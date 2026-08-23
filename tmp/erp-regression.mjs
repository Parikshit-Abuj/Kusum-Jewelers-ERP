import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { PrismaClient } from '@prisma/client';
import { buildTsplJob, checkTcpPrinter, sendTsplOverTcp } from '../src/lib/tspl-labels.js';

const baseUrl = 'http://localhost:3000';
const testDate = '2099-12-30';
const currentDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
  .formatToParts(new Date()).filter((part) => part.type !== 'literal').map((part) => part.value).join('-');
const token = `QA${Date.now().toString(36).toUpperCase()}`;
const sku = `${token}-GOLD`;
const phone = `91${String(Date.now()).slice(-8)}`;
const exportDir = path.join(process.cwd(), 'tmp', 'regression-exports');
const pdfPath = path.join(process.cwd(), 'output', 'pdf', 'erp-regression-sale-invoice.pdf');
const db = new PrismaClient();
let cookie = '';
let sale;
let unpaidUrd;
let settledUrd;
const result = { routes: {}, exports: {}, printer: {}, tests: [] };

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function form(values) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) value.forEach((entry) => params.append(key, String(entry)));
    else if (value !== undefined && value !== null) params.set(key, String(value));
  }
  return params;
}

async function request(pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, {
    redirect: 'manual',
    ...options,
    headers: { ...(options.headers || {}), ...(cookie ? { Cookie: cookie } : {}) }
  });
}

async function post(pathname, values) {
  return request(pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form(values)
  });
}

async function clean() {
  const customer = await db.customer.findUnique({ where: { phone } });
  const saleRows = await db.sale.findMany({ where: { customerId: customer?.id || -1 }, select: { id: true, invoiceNumber: true } });
  const urdRows = await db.urdPurchase.findMany({ where: { customerId: customer?.id || -1 }, select: { id: true, purchaseNumber: true } });
  const references = [...saleRows.map((row) => row.invoiceNumber), ...urdRows.map((row) => row.purchaseNumber)];
  if (references.length) await db.cashbookEntry.deleteMany({ where: { reference: { in: references } } });
  if (saleRows.length) await db.customerLedger.deleteMany({ where: { saleId: { in: saleRows.map((row) => row.id) } } });
  if (urdRows.length) await db.urdPurchase.deleteMany({ where: { id: { in: urdRows.map((row) => row.id) } } });
  if (saleRows.length) await db.sale.deleteMany({ where: { id: { in: saleRows.map((row) => row.id) } } });
  await db.product.deleteMany({ where: { sku } });
  if (customer) {
    await db.cashbookEntry.deleteMany({ where: { customerId: customer.id } });
    await db.customerLedger.deleteMany({ where: { customerId: customer.id } });
    await db.customer.delete({ where: { id: customer.id } });
  }
  await db.dailyRate.deleteMany({ where: { rateDate: testDate } });
  const invoiceCount = await db.sale.count({ where: { invoiceNumber: { startsWith: testDate.replaceAll('-', '') } } });
  const urdCount = await db.urdPurchase.count({ where: { purchaseNumber: { startsWith: `URD-${testDate.replaceAll('-', '')}-` } } });
  if (!invoiceCount) await db.documentSequence.deleteMany({ where: { key: `INV-${testDate.replaceAll('-', '')}` } });
  if (!urdCount) await db.documentSequence.deleteMany({ where: { key: `URD-${testDate.replaceAll('-', '')}` } });
}

async function testTcpLabelDelivery() {
  const gold = { barcode: 'G22 900', name: 'QA Gold Ring', metal: 'GOLD', grossWeight: 2, stoneWeight: 0.1, netWeight: 1.9 };
  const silver = { barcode: 'S 900', name: 'QA Silver Payal', metal: 'SILVER', grossWeight: 15, stoneWeight: 0, netWeight: 15 };
  const tspl = buildTsplJob([{ product: gold }, { product: silver }]);
  assert(tspl.includes('SIZE 81.0 mm, 12 mm') && tspl.includes('"QA Gold Ring"') && tspl.includes('"QA Silver Payal"') && tspl.includes('2.000') && tspl.includes('15.000'), 'TSPL templates did not receive expected product values.');
  assert(!/<(?:Item_name|ITEM_NAME|Barcode|Gross_wt|TOT_STN_WT3|net_wt|stn_wt3)>/.test(tspl), 'TSPL placeholders were left unreplaced.');
  const received = await new Promise(async (resolve, reject) => {
    const server = net.createServer((socket) => {
      const chunks = [];
      socket.on('data', (chunk) => chunks.push(chunk));
      socket.on('end', () => {
        const payload = Buffer.concat(chunks);
        // The availability check opens a connection without sending bytes; wait
        // for the second connection that carries the actual label commands.
        if (payload.length) server.close(() => resolve(payload));
      });
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', async () => {
      try {
        const { port } = server.address();
        const status = await checkTcpPrinter('127.0.0.1', port);
        assert(status.available, 'Direct TCP printer connectivity check failed.');
        await sendTsplOverTcp('127.0.0.1', port, tspl);
      } catch (error) {
        server.close(() => reject(error));
      }
    });
  });
  assert(received.equals(Buffer.from(tspl, 'latin1')), 'TCP printer payload differed from the generated native TSPL commands.');
  result.printer = { nativeTspl: true, tcpByteForByteDelivery: true, bytes: received.length };
}

async function downloadExport(resource, from, to) {
  const response = await post('/data/export', { resource, from, to });
  const bytes = Buffer.from(await response.arrayBuffer());
  assert(response.status === 200, `${resource} export returned ${response.status}.`);
  assert(response.headers.get('content-type')?.includes('spreadsheetml.sheet'), `${resource} export has the wrong content type.`);
  assert(response.headers.get('content-disposition')?.includes('.xlsx'), `${resource} export is missing the .xlsx download header.`);
  assert(bytes.subarray(0, 2).toString() === 'PK', `${resource} export is not an XLSX zip workbook.`);
  const file = path.join(exportDir, `${resource}.xlsx`);
  await fs.writeFile(file, bytes);
  result.exports[resource] = { bytes: bytes.length, file };
}

try {
  await clean();
  await fs.mkdir(exportDir, { recursive: true });

  const login = await fetch(`${baseUrl}/login`, {
    method: 'POST', redirect: 'manual', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form({ username: process.env.AUTH_USERNAME || 'kusum', password: process.env.AUTH_PASSWORD || 'kusum@123' })
  });
  assert(login.status === 302, `Login returned ${login.status}.`);
  cookie = login.headers.get('set-cookie')?.split(';')[0] || '';
  assert(cookie, 'Login did not issue a session cookie.');

  for (const pathname of ['/', '/inventory', '/inventory/new', '/rates', '/sales', '/sales/new', '/urd-purchases', '/urd-purchases/new', '/cashbook', '/customers', '/data-management', '/reports', '/network-setup', '/printer-setup']) {
    const response = await request(pathname);
    assert(response.status === 200, `${pathname} returned ${response.status}.`);
    result.routes[pathname] = response.status;
  }
  for (const pathname of ['/suppliers', '/purchases', '/repairs']) {
    const response = await request(pathname);
    assert(response.status === 404, `${pathname} should be unavailable but returned ${response.status}.`);
    result.routes[pathname] = response.status;
  }

  await db.dailyRate.upsert({ where: { rateDate: testDate }, create: { rateDate: testDate, gold22k: 10000, gold24k: 11000, silver: 100 }, update: { gold22k: 10000, gold24k: 11000, silver: 100 } });

  const inventoryPost = await post('/inventory', {
    sku, name: 'QA Gold Ring', category: 'Ring', metal: 'GOLD', purity: '22K', grossWeight: 2, stoneWeight: 0.1,
    netWeight: 1.9, quantity: 1, reorderLevel: 1, purchasePrice: 10000, makingChargeType: 'FIXED', makingChargeValue: 100,
    sellingPrice: 0, location: 'QA Counter', notes: 'Temporary regression test'
  });
  assert(inventoryPost.status === 302 && inventoryPost.headers.get('location')?.startsWith('/inventory'), 'Inventory save did not redirect to the inventory register.');
  const product = await db.product.findUniqueOrThrow({ where: { sku } });
  assert(product.barcode?.startsWith('G22 '), 'Inventory did not generate a 22K gold barcode.');

  const barcodeResponse = await request(`/api/products/barcode/${encodeURIComponent(product.barcode)}?date=${testDate}`);
  const barcodeData = await barcodeResponse.json();
  assert(barcodeResponse.status === 200 && barcodeData.metalRate === 10000 && barcodeData.product.id === product.id, 'Barcode lookup did not load the correct daily rate and product.');

  const salePost = await post('/sales', {
    saleDate: testDate, customerPhone: phone, customerName: 'QA Customer', customerEmail: '', customerAddress: 'QA address',
    productId: product.id, quantity: 1, metalRate: 10000, makingChargeType: 'FIXED', makingChargeValue: 100, taxableAmount: 19100,
    discount: 0, paymentMethod: 'MIXED', cashPaid: 10000, upiPaid: 5000, syncCashbook: 'on', notes: 'Temporary regression sale'
  });
  assert(salePost.status === 302 && salePost.headers.get('location')?.startsWith('/sales/'), 'Sale creation did not redirect to its saved invoice.');
  sale = await db.sale.findFirstOrThrow({ where: { customer: { phone }, saleDate: { gte: new Date(`${testDate}T00:00:00+05:30`), lte: new Date(`${testDate}T23:59:59+05:30`) } }, include: { customer: true, items: true } });
  assert(/^20991230\d{4}$/.test(sale.invoiceNumber), `Sale invoice number format is wrong: ${sale.invoiceNumber}`);
  assert(Number(sale.cashPaid) === 10000 && Number(sale.upiPaid) === 5000 && Number(sale.balance) > 0, 'Mixed payment or balance calculation is incorrect.');
  assert(sale.items[0].productId === null && sale.items[0].productName === 'QA Gold Ring', 'Sale did not preserve product snapshot after permanent inventory deletion.');
  assert(await db.product.findUnique({ where: { id: product.id } }) === null, 'Sold barcode was not permanently removed from inventory.');
  const cashEntries = await db.cashbookEntry.findMany({ where: { reference: sale.invoiceNumber }, orderBy: { id: 'asc' } });
  assert(cashEntries.length === 2 && cashEntries.some((entry) => entry.paymentMethod === 'CASH') && cashEntries.some((entry) => entry.paymentMethod === 'UPI'), 'Mixed payment did not create separate cashbook entries.');
  const goneBarcode = await request(`/api/products/barcode/${encodeURIComponent(product.barcode)}?date=${testDate}`);
  assert(goneBarcode.status === 404, 'Billed barcode still appears as available after sale.');

  const invoicePage = await request(`/sales/${sale.id}`);
  assert(invoicePage.status === 200 && (await invoicePage.text()).includes('QA Gold Ring'), 'Saved invoice page cannot render a deleted barcode snapshot.');
  const pdf = await request(`/sales/${sale.id}/invoice.pdf`);
  const pdfBytes = Buffer.from(await pdf.arrayBuffer());
  assert(pdf.status === 200 && pdfBytes.subarray(0, 4).toString() === '%PDF', 'Sales invoice PDF was not generated.');
  await fs.writeFile(pdfPath, pdfBytes);

  const customer = await db.customer.findUniqueOrThrow({ where: { phone } });
  const unpaidPost = await post('/urd-purchases', { purchaseDate: testDate, customerId: customer.id, metal: 'GOLD', purity: '22K', grossWeight: 1, netWeight: 1, ratePerGram: 5000, totalAmount: 5000, paid: 0, paymentMethod: 'CASH', description: 'QA unpaid URD' });
  assert(unpaidPost.status === 302, 'Unpaid URD purchase did not save.');
  unpaidUrd = await db.urdPurchase.findFirstOrThrow({ where: { customerId: customer.id, description: 'QA unpaid URD' }, include: { customer: true } });
  const protectedDelete = await post(`/urd-purchases/${unpaidUrd.id}/delete`, {});
  assert(protectedDelete.status === 302 && protectedDelete.headers.get('location')?.startsWith('/urd-purchases?error='), 'Unpaid URD deletion was not safely redirected with an error message.');
  assert(await db.urdPurchase.findUnique({ where: { id: unpaidUrd.id } }), 'Unpaid URD purchase was deleted despite an amount being due.');
  const urdPdf = await request(`/urd-purchases/${unpaidUrd.id}/invoice.pdf`);
  const urdPdfBytes = Buffer.from(await urdPdf.arrayBuffer());
  assert(urdPdf.status === 200 && urdPdfBytes.subarray(0, 4).toString() === '%PDF', 'URD invoice PDF was not generated.');

  const settledPost = await post('/urd-purchases', { purchaseDate: testDate, customerId: customer.id, metal: 'SILVER', purity: '925', grossWeight: 2, netWeight: 2, ratePerGram: 100, totalAmount: 200, paid: 200, paymentMethod: 'UPI', syncCashbook: 'on', description: 'QA settled URD' });
  assert(settledPost.status === 302, 'Settled URD purchase did not save.');
  settledUrd = await db.urdPurchase.findFirstOrThrow({ where: { customerId: customer.id, description: 'QA settled URD' } });
  const settledDelete = await post(`/urd-purchases/${settledUrd.id}/delete`, {});
  assert(settledDelete.status === 302 && settledDelete.headers.get('location')?.startsWith('/urd-purchases?message='), 'Settled URD purchase could not be deleted.');
  assert(await db.urdPurchase.findUnique({ where: { id: settledUrd.id } }) === null, 'Settled URD purchase was not deleted.');

  await downloadExport('sales', testDate, testDate);
  await downloadExport('urd', testDate, testDate);
  await downloadExport('cashbook', testDate, testDate);
  await downloadExport('rates', testDate, testDate);
  await downloadExport('inventory', currentDate, currentDate);
  await downloadExport('stock-movements', currentDate, currentDate);
  await downloadExport('customers', currentDate, currentDate);
  await downloadExport('customer-ledger', currentDate, currentDate);

  const protectedArchive = await post('/data/archive', { resource: 'sales', from: testDate, to: testDate, archiveAcknowledged: 'on', archiveConfirm: 'DELETE' });
  assert(protectedArchive.status === 302 && protectedArchive.headers.get('location')?.includes('protected'), 'Credit sale archive did not report protection.');
  assert(await db.sale.findUnique({ where: { id: sale.id } }), 'Credit sale was archived despite outstanding balance.');

  const payment = await post(`/customers/${customer.id}/payments`, { amount: sale.balance, paymentMethod: 'UPI', syncCashbook: 'on', reference: 'QA settlement', note: 'Temporary regression settlement' });
  assert(payment.status === 302, 'Customer payment did not save.');
  const settledSale = await db.sale.findUniqueOrThrow({ where: { id: sale.id } });
  assert(Number(settledSale.balance) === 0, 'Customer payment did not clear sale balance.');
  const settledArchive = await post('/data/archive', { resource: 'sales', from: testDate, to: testDate, archiveAcknowledged: 'on', archiveConfirm: 'DELETE' });
  assert(settledArchive.status === 302 && settledArchive.headers.get('location')?.includes('permanently'), 'Settled sale archive did not report deletion.');
  assert(await db.sale.findUnique({ where: { id: sale.id } }) === null, 'Settled sale was not archived independently.');

  await testTcpLabelDelivery();
  result.tests.push('authenticated routes', 'inventory barcode creation', 'barcode billing', 'mixed payments', 'credit settlement', 'URD protection', 'PDF invoices', 'archive rules', 'native TSPL TCP delivery');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await clean().catch((error) => console.error(`Cleanup warning: ${error.message}`));
  await db.$disconnect();
}

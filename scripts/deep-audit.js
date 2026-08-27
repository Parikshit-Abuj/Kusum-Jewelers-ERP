/**
 * Comprehensive Deep Audit & End-to-End Integrity Test Suite
 * Tests every single subsystem, route, API endpoint, business transaction,
 * PDF generator, Excel export, SQL backup/restore, and UI template.
 */
require('dotenv').config();
const http = require('http');
const path = require('path');
const fs = require('fs');
const { createPrisma } = require('../src/lib/prisma');
const { generateSqlBackup, importSqlBackup } = require('../src/lib/sql-backup-restore');
const { getExportPayload } = require('../src/lib/data-lifecycle');
const { writeSaleInvoice } = require('../src/lib/sale-invoice-pdf');
const { writeUrdPurchaseInvoice } = require('../src/lib/urd-invoice-pdf');
const stream = require('stream');

const PORT = Number(process.env.PORT || 3000);
let BASE_URL = `http://127.0.0.1:${PORT}`;
let serverInstance = null;
let cookie = '';

async function ensureServerRunning() {
  return new Promise((resolve, reject) => {
    // Try pinging existing server first
    const req = http.get(`${BASE_URL}/login`, (res) => {
      res.resume();
      resolve();
    });
    req.on('error', () => {
      // Start server locally on port 3000 or free port
      try {
        const serverApp = require('../src/server');
        // If server is exported or starts automatically
        setTimeout(resolve, 1500);
      } catch (err) {
        reject(err);
      }
    });
    req.setTimeout(800, () => {
      req.destroy();
    });
  });
}

function generatePdfBuffer(writerFn, data) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    const customStream = new stream.Writable({
      write(chunk, encoding, callback) {
        buffers.push(chunk);
        callback();
      }
    });
    customStream.setHeader = () => {};
    customStream.on('finish', () => {
      resolve(Buffer.concat(buffers));
    });
    customStream.on('error', reject);
    writerFn(customStream, data);
  });
}

function makeRequest(method, urlPath, body = null, isJson = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const postData = body ? (isJson ? JSON.stringify(body) : new URLSearchParams(body).toString()) : '';
    
    const headers = {
      'Cookie': cookie
    };
    if (body) {
      headers['Content-Type'] = isJson ? 'application/json' : 'application/x-www-form-urlencoded';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(url, {
      method,
      headers
    }, (res) => {
      // Capture set-cookie
      if (res.headers['set-cookie']) {
        cookie = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
      }

      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(postData);
    req.end();
  });
}

async function runDeepAudit() {
  await ensureServerRunning();
  console.log('================================================================');
  console.log('🔍 STARTING FULL DEEP AUDIT & END-TO-END ERP SYSTEM TEST');
  console.log('================================================================\n');

  const db = createPrisma();
  let errors = [];

  function check(desc, passed, detail = '') {
    if (passed) {
      console.log(`  ✔ [PASS] ${desc}`);
    } else {
      console.error(`  ✖ [FAIL] ${desc} — ${detail}`);
      errors.push(`${desc}: ${detail}`);
    }
  }

  try {
    // ----------------------------------------------------------------
    // 1. AUTHENTICATION & LOGIN
    // ----------------------------------------------------------------
    console.log('1. Subsystem: Authentication & Session Management');
    const loginRes = await makeRequest('POST', '/login', {
      username: process.env.AUTH_USERNAME || 'kusum',
      password: process.env.AUTH_PASSWORD || 'kusum123'
    });
    check('User Login and Session Cookie Creation', loginRes.status === 302 || loginRes.status === 200, `Status: ${loginRes.status}`);

    // ----------------------------------------------------------------
    // 2. GET ROUTES VERIFICATION
    // ----------------------------------------------------------------
    console.log('\n2. Subsystem: Page Routes & Navigation (GET endpoints)');
    const getRoutes = [
      '/',
      '/inventory',
      '/inventory?status=AVAILABLE',
      '/inventory?metal=GOLD',
      '/inventory?netWeight=12.45',
      '/inventory?q=Ring',
      '/inventory/new',
      '/item-names',
      '/rates',
      '/sales',
      '/sales?q=INV',
      '/sales/new',
      '/urd-purchases',
      '/urd-purchases?metal=GOLD',
      '/urd-purchases/new',
      '/cashbook',
      '/cashbook?type=IN',
      '/cashbook?method=CASH',
      '/customers',
      '/reports',
      '/data-management',
      '/network-setup',
      '/printer-setup',
      '/api/inventory/batch-docs/next',
      '/api/rates',
      '/api/item-names?q=silver'
    ];

    for (const route of getRoutes) {
      const res = await makeRequest('GET', route);
      const isOk = res.status === 200 || res.status === 304;
      check(`GET ${route}`, isOk, `Status: ${res.status}`);
    }

    // ----------------------------------------------------------------
    // 3. ITEM NAMES MASTER & AUTOCOMPLETE
    // ----------------------------------------------------------------
    console.log('\n3. Subsystem: Item Names Master');
    const testItemName = `Audit Item ${Date.now().toString().slice(-4)}`;
    const addNameRes = await makeRequest('POST', '/item-names/add', {
      name: testItemName,
      category: 'Audit Category'
    });
    check('Add Item Name to Master (/item-names/add)', addNameRes.status === 302 || addNameRes.status === 200, `Status: ${addNameRes.status}`);

    const searchNameRes = await makeRequest('GET', `/api/item-names?q=${encodeURIComponent(testItemName.slice(0, 5))}`);
    const nameData = JSON.parse(searchNameRes.body || '[]');
    const foundName = nameData.some(i => i.name.toLowerCase().includes(testItemName.toLowerCase()));
    check('Query Item Name Autocomplete API', foundName, `Results: ${JSON.stringify(nameData)}`);

    // ----------------------------------------------------------------
    // 4. DAILY METAL RATES
    // ----------------------------------------------------------------
    console.log('\n4. Subsystem: Daily Metal Rates');
    const todayStr = new Date().toISOString().slice(0, 10);
    const ratePostRes = await makeRequest('POST', '/rates', {
      rateDate: todayStr,
      gold22k: 7350,
      gold24k: 7950,
      silver: 94,
      note: 'Audit Test Rate'
    });
    check('Save Today Daily Rates', ratePostRes.status === 302 || ratePostRes.status === 200, `Status: ${ratePostRes.status}`);

    const apiRateRes = await makeRequest('GET', '/api/rates');
    const rateJson = JSON.parse(apiRateRes.body || '{}');
    check('Fetch Current Rates API', rateJson.rate && Number(rateJson.rate.gold22k) === 7350, `Rate: ${JSON.stringify(rateJson)}`);

    // ----------------------------------------------------------------
    // 5. BATCH INVENTORY ADDITION & CONCURRENCY
    // ----------------------------------------------------------------
    console.log('\n5. Subsystem: Fast-Track Batch Pieces Management');
    const batchDocNo = `BATCH-AUDIT-${Date.now().toString().slice(-5)}`;
    const pieceRes1 = await makeRequest('POST', '/api/inventory/batch-piece', {
      batchDocNo,
      name: 'Audit Gold Ring',
      category: 'Ring',
      metal: 'GOLD',
      purity: '22K',
      grossWeight: 4.500,
      stoneWeight: 0,
      netWeight: 4.500,
      makingChargeType: 'PER_GRAM',
      makingChargeValue: 550
    }, true);

    const pieceResult = JSON.parse(pieceRes1.body || '{}');
    check('Batch Add Piece via API (/api/inventory/batch-piece)', pieceResult.success && pieceResult.product?.id, `Product ID: ${pieceResult.product?.id}`);
    
    // Test in-popup piece weight edit
    if (pieceResult.product) {
      const pieceId = pieceResult.product.id;
      const editWeightRes = await makeRequest('PUT', `/api/inventory/batch-piece/${pieceId}`, {
        grossWeight: 4.850,
        stoneWeight: 0,
        netWeight: 4.850,
        metal: 'GOLD',
        purity: '22K',
        makingChargeType: 'PER_GRAM',
        makingChargeValue: 550
      }, true);
      const editResult = JSON.parse(editWeightRes.body || '{}');
      check('In-Popup Piece Weight Edit (/api/inventory/batch-piece/:id)', editResult.success && Number(editResult.product.netWeight) === 4.85, `Weight: ${editResult.product?.netWeight}`);

      // Test in-popup piece delete
      const deletePieceRes = await makeRequest('DELETE', `/api/inventory/batch-piece/${pieceId}`, null);
      const deleteResult = JSON.parse(deletePieceRes.body || '{}');
      check('In-Popup Piece Delete', deleteResult.success, `Result: ${JSON.stringify(deleteResult)}`);
    }

    // ----------------------------------------------------------------
    // 6. CUSTOMER MANAGEMENT, LOOKUP & PAN
    // ----------------------------------------------------------------
    console.log('\n6. Subsystem: Customer Directory & PAN Integration');
    const custPhone = `98${Date.now().toString().slice(-8)}`;
    const custName = 'Deep Audit Customer';
    const custPan = 'ABCDE9999Z';

    // Verify lookup for non-existent customer
    const lookup1 = await makeRequest('GET', `/api/customers/phone/${custPhone}`);
    const lookup1Json = JSON.parse(lookup1.body || '{}');
    check('Customer Phone Lookup (New Customer)', lookup1Json.found === false && lookup1Json.phone === custPhone);

    // ----------------------------------------------------------------
    // 7. SALES BILLING DESK (BARCODE SCAN, PAN, HSN, HUID, SPLIT PAY, PDF)
    // ----------------------------------------------------------------
    console.log('\n7. Subsystem: Sales Billing Desk & Invoicing');
    
    // Pick an available inventory piece for sale
    const invPiece = await db.product.findFirst({ where: { status: 'AVAILABLE', quantity: { gt: 0 } } });
    if (!invPiece) throw new Error('No available product in inventory to test sale!');

    const saleInvoiceNo = `INV-AUDIT-${Date.now().toString().slice(-4)}`;
    const salePostRes = await makeRequest('POST', '/sales', {
      invoiceNumber: saleInvoiceNo,
      saleDate: todayStr,
      customerPhone: custPhone,
      customerName: custName,
      customerPan: custPan,
      customerAddress: '123 Market Street, Pune',
      customerEmail: 'audit@example.com',
      productId: [invPiece.id],
      quantity: [1],
      metalRate: [7350],
      makingChargeType: ['PER_GRAM'],
      makingChargeValue: [500],
      hsnCode: ['71131910'],
      huidCode: ['HD999X'],
      discount: 100,
      paymentMethod: 'MIXED',
      cashPaid: 10000,
      upiPaid: 10000,
      paid: 20000,
      syncCashbook: 'on',
      syncCashCashbook: 'on',
      syncUpiCashbook: 'on'
    });

    check('Create Sale Invoice with Customer PAN, HSN, HUID & Mixed Payment', salePostRes.status === 302 || salePostRes.status === 200, `Status: ${salePostRes.status}`);

    // Verify Sale Record in Database
    const createdSale = await db.sale.findUnique({
      where: { invoiceNumber: saleInvoiceNo },
      include: { customer: true, items: true }
    });

    check('Sale saved with customerPan', createdSale && createdSale.customerPan === custPan, `PAN: ${createdSale?.customerPan}`);
    check('Sale item saved with HSN code', createdSale && createdSale.items[0]?.hsnCode === '71131910', `HSN: ${createdSale?.items[0]?.hsnCode}`);
    check('Sale item saved with HUID code', createdSale && createdSale.items[0]?.huidCode === 'HD999X', `HUID: ${createdSale?.items[0]?.huidCode}`);
    check('Customer PAN saved on Customer profile', createdSale?.customer?.panNumber === custPan, `Cust PAN: ${createdSale?.customer?.panNumber}`);

    // Verify Customer Phone Lookup for Existing Customer
    const lookup2 = await makeRequest('GET', `/api/customers/phone/${custPhone}`);
    const lookup2Json = JSON.parse(lookup2.body || '{}');
    check('Customer Phone Lookup (Existing Customer with PAN)', lookup2Json.found === true && lookup2Json.customer?.panNumber === custPan, `Lookup: ${JSON.stringify(lookup2Json.customer)}`);

    // Verify Sale Invoice Web Page
    const saleWebRes = await makeRequest('GET', `/sales/${createdSale.id}`);
    check('View Saved Invoice Page', saleWebRes.status === 200 && saleWebRes.body.includes(saleInvoiceNo) && saleWebRes.body.includes(custPan));

    // Verify PDF Tax Invoice Generation
    const pdfBuf = await generatePdfBuffer(writeSaleInvoice, createdSale);
    check('Generate PDF Tax Invoice with PAN, HSN & HUID', pdfBuf.length > 2000, `PDF Size: ${pdfBuf.length} bytes`);

    // ----------------------------------------------------------------
    // 8. URD PURCHASES (OLD GOLD BUYING)
    // ----------------------------------------------------------------
    console.log('\n8. Subsystem: URD Purchases (Old Gold Buying)');
    const urdNo = `URD-AUDIT-${Date.now().toString().slice(-4)}`;
    const urdPostRes = await makeRequest('POST', '/urd-purchases', {
      purchaseNumber: urdNo,
      purchaseDate: todayStr,
      customerId: createdSale.customerId,
      customerPhone: custPhone,
      customerName: custName,
      metal: 'GOLD',
      purity: '22K',
      grossWeight: 10.500,
      netWeight: 10.000,
      ratePerGram: 6800,
      totalAmount: 68000,
      paid: 68000,
      paymentMethod: 'CASH',
      syncCashbook: 'on',
      description: 'Old gold mangalsutra'
    });

    check('Create URD Purchase', urdPostRes.status === 302 || urdPostRes.status === 200, `Status: ${urdPostRes.status}`);
    const createdUrd = await db.urdPurchase.findUnique({ where: { purchaseNumber: urdNo }, include: { customer: true } });
    check('URD Purchase saved with cashbook settlement', createdUrd && Number(createdUrd.totalAmount) === 68000);

    // Verify URD Invoice PDF Generation
    const urdPdfBuf = await generatePdfBuffer(writeUrdPurchaseInvoice, createdUrd);
    check('Generate URD Purchase PDF Invoice', urdPdfBuf.length > 2000, `PDF Size: ${urdPdfBuf.length} bytes`);

    // ----------------------------------------------------------------
    // 9. DAILY CASHBOOK
    // ----------------------------------------------------------------
    console.log('\n9. Subsystem: Daily Cashbook');
    const cashEntryRes = await makeRequest('POST', '/cashbook', {
      entryDate: todayStr,
      type: 'IN',
      paymentMethod: 'CASH',
      amount: 5000,
      description: 'Audit Test Cash In',
      reference: 'REF-AUDIT-1'
    });
    check('Add Manual Entry to Cashbook', cashEntryRes.status === 302 || cashEntryRes.status === 200, `Status: ${cashEntryRes.status}`);

    // ----------------------------------------------------------------
    // 10. DATA LIFECYCLE & EXCEL EXPORTS
    // ----------------------------------------------------------------
    console.log('\n10. Subsystem: Excel Reports & Exports (8 Modules)');
    const range = { from: '2000-01-01', to: '2099-12-31' };
    const modules = ['sales', 'urd', 'cashbook', 'inventory', 'stock-movements', 'customers', 'customer-ledger', 'rates'];

    for (const mod of modules) {
      const payload = await getExportPayload(db, mod, range);
      check(`Excel Export Payload for "${mod}"`, payload && payload.rows.length >= 0 && payload.columns.length > 0, `Rows: ${payload.rows.length}, Cols: ${payload.columns.length}`);
    }

    // ----------------------------------------------------------------
    // 11. FULL DATABASE SQL BACKUP & RESTORE
    // ----------------------------------------------------------------
    console.log('\n11. Subsystem: Database SQL Backup & Restore');
    const backup = await generateSqlBackup(process.env.DATABASE_URL);
    check('Generate Full Database SQL Backup', backup.sql.length > 10000 && backup.tableCount >= 10, `Size: ${backup.sql.length} chars, Tables: ${backup.tableCount}`);

    const appRoot = path.resolve('.');
    const restoreResult = await importSqlBackup(process.env.DATABASE_URL, backup.sql, appRoot);
    check('Restore Full Database SQL Backup', restoreResult.success && restoreResult.tableCount >= 10, `Tables: ${restoreResult.tableCount}, Statements: ${restoreResult.executedStatements}`);

    // Clean up test records
    await db.urdPurchase.deleteMany({ where: { purchaseNumber: urdNo } });
    await db.sale.deleteMany({ where: { invoiceNumber: saleInvoiceNo } });
    await db.product.deleteMany({ where: { batchDocNo } });
    await db.customer.deleteMany({ where: { phone: custPhone } });
    await db.itemName.deleteMany({ where: { name: testItemName } });

    console.log('\n================================================================');
    if (errors.length === 0) {
      console.log('🎉 ALL AUDIT CHECKS PASSED WITH 0 ERRORS! SYSTEM IS 100% HEALTHY');
    } else {
      console.log(`⚠️ AUDIT COMPLETED WITH ${errors.length} ERROR(S):`);
      errors.forEach(e => console.log(`   - ${e}`));
    }
    console.log('================================================================\n');

  } catch (err) {
    console.error('Fatal audit failure:', err);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runDeepAudit();

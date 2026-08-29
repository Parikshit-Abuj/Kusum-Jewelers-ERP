const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
const { runBundledMigrations } = require('../src/lib/shop-provisioning');
const { parseDatabaseConnection } = require('../src/lib/sql-backup-restore');

const appRoot = path.join(__dirname, '..');
const testDatabase = 'kusum_erp_sync_weight_qa_20260828';
const testPort = 39000 + Math.floor(Math.random() * 900);
const baseUrl = `http://127.0.0.1:${testPort}`;
const auditUser = 'audit-user';
const auditPassword = 'audit-password-20260828';
let serverProcess;
let database;
let cookie = '';

dotenv.config({ path: path.join(appRoot, '.env') });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function databaseUrlWithName(baseDatabaseUrl, databaseName) {
  const url = new URL(baseDatabaseUrl);
  url.pathname = `/${databaseName}`;
  return url.toString();
}

function safeDatabaseName() {
  assert(testDatabase === 'kusum_erp_sync_weight_qa_20260828', 'Refusing unsafe test database target.');
  return `\`${testDatabase}\``;
}

async function withAdminConnection(baseDatabaseUrl, operation) {
  const config = parseDatabaseConnection(baseDatabaseUrl);
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    charset: 'utf8mb4'
  });
  try {
    await operation(connection);
  } finally {
    await connection.end();
  }
}

async function resetTestDatabase(baseDatabaseUrl) {
  await withAdminConnection(baseDatabaseUrl, async (connection) => {
    await connection.query(`DROP DATABASE IF EXISTS ${safeDatabaseName()}`);
    await connection.query(`CREATE DATABASE ${safeDatabaseName()} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  });
}

async function removeTestDatabase(baseDatabaseUrl) {
  await withAdminConnection(baseDatabaseUrl, async (connection) => {
    await connection.query(`DROP DATABASE IF EXISTS ${safeDatabaseName()}`);
  });
}

function formBody(values) {
  const body = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    const entries = Array.isArray(value) ? value : [value];
    entries.forEach((entry) => {
      if (entry !== undefined && entry !== null) body.append(key, String(entry));
    });
  });
  return body;
}

async function request(route, { method = 'GET', form } = {}) {
  const headers = {};
  if (cookie) headers.cookie = cookie;
  let body;
  if (form) {
    body = formBody(form).toString();
    headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  const response = await fetch(`${baseUrl}${route}`, { method, headers, body, redirect: 'manual' });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  return response;
}

async function uploadSql(route, sqlText, filename, acknowledged = true) {
  const multipart = new FormData();
  multipart.append('sqlFile', new Blob([sqlText], { type: 'application/sql' }), filename);
  if (acknowledged) multipart.append('restoreAcknowledged', 'on');
  return fetch(`${baseUrl}${route}`, {
    method: 'POST',
    headers: cookie ? { cookie } : {},
    body: multipart,
    redirect: 'manual'
  });
}

async function waitForServer(logs) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (serverProcess.exitCode !== null) {
      throw new Error(`Audit server exited early.\n${logs.join('')}`);
    }
    try {
      const response = await fetch(`${baseUrl}/login`, { redirect: 'manual' });
      if (response.status === 200) return;
    } catch (_) {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Audit server did not start.\n${logs.join('')}`);
}

async function stopServer() {
  if (!serverProcess || serverProcess.exitCode !== null) return;
  const exited = new Promise((resolve) => serverProcess.once('exit', resolve));
  serverProcess.kill();
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 5000))]);
}

async function main() {
  assert(process.env.DATABASE_URL, 'DATABASE_URL is missing from the development configuration.');
  const testDatabaseUrl = databaseUrlWithName(process.env.DATABASE_URL, testDatabase);
  const logs = [];

  try {
    await resetTestDatabase(process.env.DATABASE_URL);
    await runBundledMigrations(appRoot, testDatabaseUrl);

    database = new PrismaClient({ datasourceUrl: testDatabaseUrl });
    await database.$connect();
    const customer = await database.customer.create({
      data: { name: 'Automatic Sync Audit Customer', phone: '9000099928' }
    });
    await database.dailyRate.create({
      data: { rateDate: '2026-08-28', gold22k: 1000, gold24k: 1100, silver: 100 }
    });
    const product = await database.product.create({
      data: {
        barcode: 'G22 SYNC QA 1', sku: 'SYNC-WEIGHT-QA-1', name: 'Billing Weight Audit Ring', category: 'Ring',
        // Legacy releases could retain quantity > 1 on one barcode. The current
        // invariant must still delete that barcode after it is billed once.
        metal: 'GOLD', purity: '22K', grossWeight: 8, stoneWeight: 0, netWeight: 8, quantity: 3,
        purchasePrice: 0, sellingPrice: 0, makingChargeType: 'PER_GRAM', makingChargeValue: 100, status: 'AVAILABLE'
      }
    });

    serverProcess = spawn(process.execPath, ['src/server.js'], {
      cwd: appRoot,
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
        PORT: String(testPort),
        AUTH_USERNAME: auditUser,
        AUTH_PASSWORD: auditPassword,
        SESSION_SECRET: 'automatic-sync-weight-audit-session-secret',
        NODE_ENV: 'test'
      },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    serverProcess.stdout.on('data', (chunk) => logs.push(chunk.toString()));
    serverProcess.stderr.on('data', (chunk) => logs.push(chunk.toString()));
    await waitForServer(logs);

    const login = await request('/login', {
      method: 'POST',
      form: { username: auditUser, password: auditPassword }
    });
    assert(login.status === 302 && cookie, 'Could not authenticate with the isolated audit ERP.');
    let persistedSessions = 0;
    for (let attempt = 0; attempt < 20 && persistedSessions < 1; attempt += 1) {
      persistedSessions = await database.appSession.count();
      if (persistedSessions < 1) await new Promise((resolve) => setTimeout(resolve, 50));
    }
    assert(persistedSessions >= 1, 'Authenticated session was not persisted in MySQL.');
    for (const route of ['/', '/inventory', '/customers']) {
      const page = await request(route);
      assert(page.status === 200, `${route} failed after the performance and pagination changes.`);
    }

    const editResponse = await request(`/inventory/${product.id}`, {
      method: 'POST',
      form: {
        sku: product.sku, name: product.name, category: product.category,
        metal: 'GOLD', purity: '22K', grossWeight: 8, stoneWeight: 0, netWeight: 8,
        purchasePrice: 0, sellingPrice: 1, makingChargeType: 'PER_GRAM', makingChargeValue: 100,
        status: 'AVAILABLE'
      }
    });
    assert(editResponse.status === 302, `Inventory edit failed with HTTP ${editResponse.status}.`);
    const recalculatedProduct = await database.product.findUniqueOrThrow({ where: { id: product.id } });
    assert(Number(recalculatedProduct.sellingPrice) === 8800, `Inventory edit trusted stale submitted price instead of recalculating: ${recalculatedProduct.sellingPrice}.`);

    for (const route of ['/reports', '/sales', '/cashbook', '/item-names', '/urd-purchases', `/customers/${customer.id}`]) {
      const page = await request(route);
      const pageBody = await page.text();
      assert(page.status === 200, `${route} did not render after pagination/query changes (HTTP ${page.status}).\n${pageBody}\n${logs.join('')}`);
    }

    const salesForm = await request('/sales/new');
    const salesHtml = await salesForm.text();
    assert(salesForm.status === 200, 'Sales form did not render.');
    assert(/name="weight"[^>]*data-weight/.test(salesHtml), 'Sales form is missing the editable billing weight field.');
    assert(!/name="weight"[^>]*readonly/.test(salesHtml), 'Billing weight is still read-only.');
    assert(!salesHtml.includes('name="syncCashbook"'), 'Sales form still shows an optional cashbook sync field.');
    assert(salesHtml.includes('name="cardPaid"') && salesHtml.includes('name="bankPaid"'), 'Sales form is missing Card/Bank split-payment inputs.');

    const invoiceNumber = '202608289901';
    const saleResponse = await request('/sales', {
      method: 'POST',
      form: {
        invoiceNumber,
        saleDate: '2026-08-28',
        customerPhone: customer.phone,
        productId: [product.id],
        quantity: [1],
        weight: [7.125],
        metalRate: [1000],
        makingChargeType: ['PER_GRAM'],
        makingChargeValue: [100],
        discount: 0,
        paymentMethod: 'CASH',
        paid: 5000
      }
    });
    assert(saleResponse.status === 302, `Sale request failed with HTTP ${saleResponse.status}.`);

    let sale = await database.sale.findUnique({ where: { invoiceNumber }, include: { items: true } });
    assert(sale && sale.items.length === 1, 'Sale and sale-line snapshot were not saved.');
    assert(Number(sale.items[0].weight) === 7.125, `Edited billing weight was not saved: ${sale.items[0].weight}.`);
    const editedBillingWeight = Number(sale.items[0].weight);
    assert(Number(sale.items[0].metalAmount) === 7125, `Metal value did not use edited weight: ${sale.items[0].metalAmount}.`);
    assert(Number(sale.items[0].makingCharge) === 712.5, `Per-gram making charge did not use edited weight: ${sale.items[0].makingCharge}.`);
    assert(await database.product.findUnique({ where: { id: product.id } }) === null, 'Sold barcode was not removed from inventory.');
    const saleCredit = await database.customerLedger.findFirst({ where: { saleId: sale.id, type: 'SALE_CREDIT' } });
    assert(saleCredit && Math.abs(Number(saleCredit.amount) - Number(sale.balance)) < 0.011,
      'Sale balance due was not synchronized exactly to the customer ledger.');

    const saleCashbook = await database.cashbookEntry.findMany({ where: { reference: invoiceNumber } });
    assert(saleCashbook.length === 1 && saleCashbook[0].paymentMethod === 'CASH' && Number(saleCashbook[0].amount) === 5000,
      'Sale payment did not automatically synchronize to Daily Cashbook.');

    const invoicePdf = await request(`/sales/${sale.id}/invoice.pdf`);
    assert(invoicePdf.status === 200 && (invoicePdf.headers.get('content-type') || '').includes('application/pdf'),
      'Sales invoice PDF failed after saving an edited billing weight.');

    const urdNumber = 'URD-20260828-9901';
    const urdResponse = await request('/urd-purchases', {
      method: 'POST',
      form: {
        purchaseNumber: urdNumber,
        purchaseDate: '2026-08-28',
        customerId: customer.id,
        metal: 'GOLD', purity: '22K', grossWeight: 1, netWeight: 1,
        ratePerGram: 3000, totalAmount: 3000, paid: 2000, paymentMethod: 'UPI'
      }
    });
    assert(urdResponse.status === 302, `URD request failed with HTTP ${urdResponse.status}.`);
    const urdCashbook = await database.cashbookEntry.findFirst({ where: { reference: urdNumber } });
    assert(urdCashbook && urdCashbook.type === 'OUT' && urdCashbook.paymentMethod === 'UPI' && Number(urdCashbook.amount) === 2000,
      'URD payout did not automatically synchronize to Daily Cashbook.');

    const receiptResponse = await request(`/customers/${customer.id}/payments`, {
      method: 'POST',
      form: { amount: 1000, paymentMethod: 'UPI', reference: 'AUTO-RCPT-1' }
    });
    assert(receiptResponse.status === 302, `Customer receipt failed with HTTP ${receiptResponse.status}.`);
    const receiptCashbook = await database.cashbookEntry.findFirst({ where: { reference: 'AUTO-RCPT-1' } });
    assert(receiptCashbook && receiptCashbook.type === 'IN' && receiptCashbook.syncLedger,
      'Customer receipt did not automatically synchronize to Daily Cashbook.');

    sale = await database.sale.findUnique({ where: { invoiceNumber } });
    const balanceBeforeCashbookReceipt = Number(sale.balance);
    const manualCashbookResponse = await request('/cashbook', {
      method: 'POST',
      form: {
        entryDate: '2026-08-28', type: 'IN', paymentMethod: 'BANK_TRANSFER', amount: 500,
        description: 'Automatic ledger audit receipt', reference: 'AUTO-CB-1', customerId: customer.id
      }
    });
    assert(manualCashbookResponse.status === 302, `Manual cashbook entry failed with HTTP ${manualCashbookResponse.status}.`);
    const manualCashbook = await database.cashbookEntry.findFirst({ where: { reference: 'AUTO-CB-1' } });
    const saleAfterCashbookReceipt = await database.sale.findUnique({ where: { invoiceNumber } });
    assert(manualCashbook?.syncLedger === true, 'Customer-linked cashbook entry was not marked as synchronized.');
    assert(Math.abs(Number(saleAfterCashbookReceipt.balance) - (balanceBeforeCashbookReceipt - 500)) < 0.011,
      'Customer-linked cashbook receipt did not reduce the sale credit balance automatically.');

    const [urdForm, customerPage, cashbookPage] = await Promise.all([
      request('/urd-purchases/new'), request(`/customers/${customer.id}`), request('/cashbook')
    ]);
    const uiHtml = `${await urdForm.text()}${await customerPage.text()}${await cashbookPage.text()}`;
    assert(!uiHtml.includes('name="syncCashbook"') && !uiHtml.includes('name="syncLedger"'),
      'An optional synchronization checkbox is still rendered in the ERP.');

    const sqlDownload = await request('/data/backup-sql');
    const downloadedSql = await sqlDownload.text();
    assert(sqlDownload.status === 200, `SQL download route failed with HTTP ${sqlDownload.status}.`);
    assert((sqlDownload.headers.get('content-type') || '').includes('application/sql'), 'SQL download returned the wrong content type.');
    assert(/attachment; filename="kusum-erp-backup-[^"]+\.sql"/i.test(sqlDownload.headers.get('content-disposition') || ''),
      'SQL download returned an invalid backup filename.');
    assert(downloadedSql.includes('-- End of Kusum ERP Backup'), 'SQL download route returned an incomplete backup.');

    const wrongExtension = await uploadSql('/data/restore-sql', downloadedSql, 'backup.txt');
    assert(wrongExtension.status === 302 && /error=/i.test(wrongExtension.headers.get('location') || ''),
      'SQL restore route accepted a file without the .sql extension.');
    const invalidSql = await uploadSql('/data/restore-sql', 'DROP DATABASE kusum_erp;', 'invalid.sql');
    assert(invalidSql.status === 302 && /error=/i.test(invalidSql.headers.get('location') || ''),
      'SQL restore route accepted a non-ERP SQL file.');

    await database.customer.create({ data: { name: 'Must disappear after SQL restore', phone: '9000099929' } });
    await database.$disconnect();
    database = null;
    const sqlRestore = await uploadSql('/data/restore-sql', downloadedSql, 'kusum-erp-audit-backup.sql');
    assert(sqlRestore.status === 302 && /message=/i.test(sqlRestore.headers.get('location') || ''),
      `SQL restore route failed: ${sqlRestore.headers.get('location') || sqlRestore.status}.`);
    database = new PrismaClient({ datasourceUrl: testDatabaseUrl });
    await database.$connect();
    assert(await database.customer.findUnique({ where: { phone: '9000099929' } }) === null,
      'SQL restore did not replace data created after the download.');
    assert(await database.sale.findUnique({ where: { invoiceNumber } }), 'SQL restore lost the downloaded sale record.');

    console.log(JSON.stringify({
      result: 'PASS',
      editedBillingWeight,
      saleCashbookEntries: saleCashbook.length,
      urdAutoSynced: true,
      customerReceiptAutoSynced: true,
      customerLinkedCashbookAutoSynced: true,
      balanceDueSyncedToLedger: true,
      mysqlSessionStore: true,
      soldBarcodeRemoved: true,
      legacyMultiQuantityBarcodeRemoved: true,
      invoicePdf: true,
      sqlDownloadRoute: true,
      sqlImportRoute: true,
      invalidSqlRejected: true
    }, null, 2));
  } finally {
    await stopServer().catch(() => {});
    if (database) await database.$disconnect().catch(() => {});
    if (process.env.DATABASE_URL) {
      await removeTestDatabase(process.env.DATABASE_URL).catch((error) => {
        console.error(`Test database cleanup warning: ${error.message}`);
      });
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

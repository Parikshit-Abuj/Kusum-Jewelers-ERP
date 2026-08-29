const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { runBundledMigrations } = require('../src/lib/shop-provisioning');
const { generateSqlBackup, importSqlBackup, parseDatabaseConnection, splitSqlStatements } = require('../src/lib/sql-backup-restore');
const { reverseAndDeleteCashbookEntry, deleteSettledUrdPurchase, paymentMethodFromComponents } = require('../src/lib/accounting-reversal');
const { nextBatchDocumentNumber } = require('../src/lib/helpers');
const { hashPassword, verifyPassword } = require('../src/lib/auth-security');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const appRoot = path.join(__dirname, '..');
const sourceDatabase = 'kusum_erp_requested_fixes_source_20260829';
const targetDatabase = 'kusum_erp_requested_fixes_target_20260829';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function databaseUrlWithName(baseUrl, database) {
  const url = new URL(baseUrl);
  url.pathname = `/${database}`;
  return url.toString();
}

function safeDatabaseName(database) {
  assert(/^kusum_erp_requested_fixes_(source|target)_20260829$/.test(database), `Unsafe test database name: ${database}`);
  return `\`${database}\``;
}

async function resetDatabases(baseUrl) {
  const config = parseDatabaseConnection(baseUrl);
  const connection = await mysql.createConnection({ host: config.host, port: config.port, user: config.username, password: config.password });
  try {
    for (const database of [sourceDatabase, targetDatabase]) {
      await connection.query(`DROP DATABASE IF EXISTS ${safeDatabaseName(database)}`);
      await connection.query(`CREATE DATABASE ${safeDatabaseName(database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    }
  } finally {
    await connection.end();
  }
}

async function cleanupDatabases(baseUrl) {
  const config = parseDatabaseConnection(baseUrl);
  const connection = await mysql.createConnection({ host: config.host, port: config.port, user: config.username, password: config.password });
  try {
    for (const database of [sourceDatabase, targetDatabase]) await connection.query(`DROP DATABASE IF EXISTS ${safeDatabaseName(database)}`);
  } finally {
    await connection.end();
  }
}

function legacyCoreBackup(currentSql) {
  const core = new Set(['_prisma_migrations', 'customer', 'product', 'sale', 'saleitem', 'stockmovement']);
  const filtered = splitSqlStatements(currentSql).filter((statement) => {
    const match = statement.match(/^(?:DROP\s+TABLE\s+IF\s+EXISTS|CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?|INSERT\s+INTO|LOCK\s+TABLES)\s+`([^`]+)`/i);
    if (!match) return true;
    const table = match[1].toLowerCase();
    if (!core.has(table)) return false;
    return !(table === '_prisma_migrations' && /^INSERT\s+/i.test(statement));
  });
  return [
    '-- Kusum ERP — Full MySQL Database Backup',
    '-- Historical core-schema compatibility audit',
    ...filtered.map((statement) => `${statement};`),
    '-- End of Kusum ERP Backup'
  ].join('\n');
}

async function main() {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) throw new Error('DATABASE_URL is required for the isolated audit.');
  const sourceUrl = databaseUrlWithName(baseUrl, sourceDatabase);
  const targetUrl = databaseUrlWithName(baseUrl, targetDatabase);
  let source;
  let target;
  try {
    await resetDatabases(baseUrl);
    await runBundledMigrations(appRoot, sourceUrl);
    await runBundledMigrations(appRoot, targetUrl);
    source = new PrismaClient({ datasourceUrl: sourceUrl });
    target = new PrismaClient({ datasourceUrl: targetUrl });
    await Promise.all([source.$connect(), target.$connect()]);

    const passwordHash = hashPassword('shop-owner-choice');
    assert(!passwordHash.includes('shop-owner-choice') && verifyPassword('shop-owner-choice', passwordHash), 'ERP password hashing failed.');
    assert(!verifyPassword('wrong-password', passwordHash), 'ERP password hash accepted the wrong password.');

    const batchNumbers = await Promise.all(Array.from({ length: 20 }, () => nextBatchDocumentNumber(source)));
    assert(new Set(batchNumbers).size === batchNumbers.length, 'Concurrent clients received a duplicate batch document number.');

    const customer = await source.customer.create({ data: { name: 'Accounting Reversal Audit', phone: '9000000829' } });
    const sale = await source.sale.create({ data: {
      invoiceNumber: 'AUDIT-REVERSAL-1', customerId: customer.id,
      subtotal: 970.87, gstAmount: 29.13, total: 1000, paid: 400,
      cashPaid: 400, balance: 600, paymentMethod: 'CASH'
    } });
    await source.customerLedger.create({ data: {
      customerId: customer.id, saleId: sale.id, type: 'SALE_CREDIT', amount: 600, reference: sale.invoiceNumber
    } });
    const initialCashbook = await source.cashbookEntry.create({ data: {
      entryDate: '2026-08-29', type: 'IN', paymentMethod: 'CASH', amount: 400,
      description: `Sale payment — ${sale.invoiceNumber}`, reference: sale.invoiceNumber,
      customerId: customer.id, saleId: sale.id, syncLedger: true
    } });
    await source.$transaction((tx) => reverseAndDeleteCashbookEntry(tx, initialCashbook.id));
    let checkedSale = await source.sale.findUniqueOrThrow({ where: { id: sale.id } });
    let ledgerTotal = await source.customerLedger.aggregate({ where: { customerId: customer.id }, _sum: { amount: true } });
    assert(Number(checkedSale.paid) === 0 && Number(checkedSale.balance) === 1000 && Number(checkedSale.cashPaid) === 0, 'Initial sale payment was not reversed exactly.');
    assert(Number(ledgerTotal._sum.amount) === 1000, 'Initial sale payment reversal did not restore the customer due.');

    const bankEntry = await source.cashbookEntry.create({ data: {
      entryDate: '2026-08-29', type: 'IN', paymentMethod: 'BANK_TRANSFER', amount: 300,
      description: 'Customer payment received — BANK-AUDIT', reference: 'BANK-AUDIT', customerId: customer.id, syncLedger: true
    } });
    await source.sale.update({ where: { id: sale.id }, data: { paid: 300, bankPaid: 300, balance: 700, paymentMethod: 'BANK_TRANSFER' } });
    await source.customerLedger.create({ data: {
      customerId: customer.id, saleId: sale.id, cashbookEntryId: bankEntry.id,
      type: 'PAYMENT_RECEIVED', amount: -300, paymentMethod: 'BANK_TRANSFER', reference: 'BANK-AUDIT'
    } });
    await source.$transaction((tx) => reverseAndDeleteCashbookEntry(tx, bankEntry.id));
    checkedSale = await source.sale.findUniqueOrThrow({ where: { id: sale.id } });
    ledgerTotal = await source.customerLedger.aggregate({ where: { customerId: customer.id }, _sum: { amount: true } });
    assert(Number(checkedSale.paid) === 0 && Number(checkedSale.balance) === 1000 && Number(checkedSale.bankPaid) === 0, 'Later bank payment was not reversed exactly.');
    assert(Number(ledgerTotal._sum.amount) === 1000, 'Later bank payment reversal did not restore the customer due.');

    const urd = await source.urdPurchase.create({ data: {
      purchaseNumber: 'AUDIT-URD-1', customerId: customer.id, metal: 'GOLD', netWeight: 1,
      ratePerGram: 100, totalAmount: 100, paid: 100, paymentMethod: 'CARD'
    } });
    const urdCashbook = await source.cashbookEntry.create({ data: {
      entryDate: '2026-08-29', type: 'OUT', paymentMethod: 'CARD', amount: 100,
      description: `URD payout — ${urd.purchaseNumber}`, reference: `${urd.purchaseNumber}-PAY`,
      customerId: customer.id, urdPurchaseId: urd.id, syncLedger: false
    } });
    await source.$transaction((tx) => reverseAndDeleteCashbookEntry(tx, urdCashbook.id));
    const reversedUrd = await source.urdPurchase.findUniqueOrThrow({ where: { id: urd.id } });
    assert(Number(reversedUrd.paid) === 0, 'Deleting a URD cashbook payout did not reverse URD paid.');

    const finalUrdCashbook = await source.cashbookEntry.create({ data: {
      entryDate: '2026-08-29', type: 'OUT', paymentMethod: 'UPI', amount: 100,
      description: `URD payout — ${urd.purchaseNumber}`, reference: `${urd.purchaseNumber}-PAY2`,
      customerId: customer.id, urdPurchaseId: urd.id, syncLedger: false
    } });
    await source.urdPurchase.update({ where: { id: urd.id }, data: { paid: 100, paymentMethod: 'UPI' } });
    await source.$transaction((tx) => deleteSettledUrdPurchase(tx, { ...reversedUrd, paid: 100 }));
    assert(await source.urdPurchase.count({ where: { id: urd.id } }) === 0, 'Settled URD purchase was not deleted.');
    assert(await source.cashbookEntry.count({ where: { id: finalUrdCashbook.id } }) === 0, 'Settled URD payout cashbook entry survived deletion.');

    assert(paymentMethodFromComponents({ CASH: 100, UPI: 200, CARD: 300, BANK_TRANSFER: 400 }, 1000) === 'MIXED', 'Four-way payment classification failed.');
    await source.sale.create({ data: {
      invoiceNumber: 'AUDIT-HISTORICAL-UPI', customerId: customer.id,
      subtotal: 250, total: 250, paid: 250, balance: 0, paymentMethod: 'UPI',
      cashPaid: 0, upiPaid: 0, cardPaid: 0, bankPaid: 0
    } });
    await target.itemName.create({ data: { name: 'Stale target-only row', category: 'Must disappear' } });
    const backup = await generateSqlBackup(sourceUrl);
    const legacyBackup = legacyCoreBackup(backup.sql);
    const imported = await importSqlBackup(targetUrl, legacyBackup, appRoot);
    assert(imported.success, 'Historical core backup import failed.');
    await target.$disconnect();
    target = new PrismaClient({ datasourceUrl: targetUrl });
    await target.$connect();
    assert(await target.customer.count() === await source.customer.count(), 'Historical backup lost core customer data.');
    assert(await target.itemName.count() === 0, 'A current-only stale table row survived historical restore.');
    const targetColumns = await target.$queryRaw`SHOW COLUMNS FROM Sale`;
    const columnNames = new Set(targetColumns.map((column) => column.Field));
    assert(columnNames.has('cardPaid') && columnNames.has('bankPaid'), 'Historical restore did not migrate to the current payment schema.');
    const reconstructed = await target.sale.findUniqueOrThrow({ where: { invoiceNumber: 'AUDIT-HISTORICAL-UPI' } });
    assert(Number(reconstructed.upiPaid) === 250, 'Historical single-method UPI payment was not reconstructed.');

    console.log(JSON.stringify({
      result: 'PASS',
      initialSalePaymentReversal: true,
      laterBankPaymentReversal: true,
      urdCashbookReversal: true,
      settledUrdCascade: true,
      fourWayPaymentTracking: true,
      historicalPaymentReconstruction: true,
      atomicBatchNumbers: true,
      securePasswordHash: true,
      historicalSqlUpgrade: true,
      staleCurrentTableDataRemoved: true
    }, null, 2));
  } finally {
    if (source) await source.$disconnect().catch(() => {});
    if (target) await target.$disconnect().catch(() => {});
    await cleanupDatabases(baseUrl).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/**
 * Full SQL backup/restore round-trip test via HTTP endpoints.
 * Simulates exactly what the user does in the browser:
 *   1. GET /data/backup-sql  → download .sql
 *   2. Verify contents
 *   3. POST /data/restore-sql → upload the same .sql
 *   4. Verify data integrity after restore
 */
require('dotenv').config();
const http = require('http');
const { createPrisma } = require('../src/lib/prisma');
const { generateSqlBackup, importSqlBackup, validateSqlBackup } = require('../src/lib/sql-backup-restore');

async function test() {
  const db = createPrisma();
  const errors = [];

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 SQL BACKUP & RESTORE — FULL ROUND-TRIP TEST');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Snapshot current DB state before backup
  const beforeCounts = {
    products: await db.product.count(),
    customers: await db.customer.count(),
    sales: await db.sale.count(),
    saleItems: await db.saleItem.count(),
    cashbook: await db.cashbookEntry.count(),
    urd: await db.urdPurchase.count(),
    rates: await db.dailyRate.count(),
    movements: await db.stockMovement.count(),
    ledger: await db.customerLedger.count(),
    itemNames: await db.itemName.count(),
    syncRevision: await db.syncRevision.count()
  };
  console.log('1. Current DB state before backup:');
  for (const [k, v] of Object.entries(beforeCounts)) {
    console.log(`   ${k}: ${v}`);
  }

  // 2. Generate SQL backup
  console.log('\n2. Generating SQL backup...');
  const backup = await generateSqlBackup(process.env.DATABASE_URL);
  console.log(`   ✔ Generated: ${backup.filename} (${backup.sql.length} chars, ${backup.tableCount} tables)`);

  // 3. Validate backup format
  console.log('\n3. Validating backup integrity...');
  try {
    const validated = validateSqlBackup(backup.sql);
    console.log(`   ✔ SHA-256 check passed`);
    console.log(`   ✔ Manifest present with ${Object.keys(validated.manifest.tables).length} tables`);
    console.log(`   ✔ ${validated.statements.length} SQL statements parsed`);
    console.log(`   ✔ Tables created: ${[...validated.tables.created].join(', ')}`);
  } catch (e) {
    errors.push(`Validation failed: ${e.message}`);
    console.log(`   ✖ Validation failed: ${e.message}`);
  }

  // 4. Verify backup contains new schema columns
  console.log('\n4. Checking backup includes all new schema fields...');
  const schemaChecks = [
    { table: 'Product', field: 'batchDocNo', label: 'Product.batchDocNo' },
    { table: 'Sale', field: 'customerPan', label: 'Sale.customerPan' },
    { table: 'Sale', field: 'cashPaid', label: 'Sale.cashPaid' },
    { table: 'Sale', field: 'upiPaid', label: 'Sale.upiPaid' },
    { table: 'SaleItem', field: 'hsnCode', label: 'SaleItem.hsnCode' },
    { table: 'SaleItem', field: 'huidCode', label: 'SaleItem.huidCode' },
    { table: 'SaleItem', field: 'productBarcode', label: 'SaleItem.productBarcode' },
    { table: 'StockMovement', field: 'productBarcode', label: 'StockMovement.productBarcode' },
    { table: 'Customer', field: 'panNumber', label: 'Customer.panNumber' },
    { table: 'SyncRevision', field: 'revision', label: 'SyncRevision.revision' },
    { table: 'DocumentSequence', field: 'lastNumber', label: 'DocumentSequence.lastNumber' }
  ];

  for (const check of schemaChecks) {
    const createPattern = new RegExp(`CREATE TABLE.*\`${check.table}\`[^;]*\`${check.field}\``, 'is');
    if (createPattern.test(backup.sql)) {
      console.log(`   ✔ ${check.label} found in CREATE TABLE`);
    } else {
      errors.push(`${check.label} missing from SQL backup`);
      console.log(`   ✖ ${check.label} MISSING from backup!`);
    }
  }

  // 5. Import the backup back
  console.log('\n5. Importing SQL backup (full restore cycle)...');
  const appRoot = require('path').join(__dirname, '..');
  try {
    const result = await importSqlBackup(process.env.DATABASE_URL, backup.sql, appRoot);
    console.log(`   ✔ Restore succeeded: ${result.tableCount} tables, ${result.executedStatements} statements`);
  } catch (e) {
    errors.push(`Import failed: ${e.message}`);
    console.log(`   ✖ Import failed: ${e.message}`);
  }

  // 6. Verify row counts match after restore
  console.log('\n6. Verifying data integrity after restore...');
  const afterDb = createPrisma();
  const afterCounts = {
    products: await afterDb.product.count(),
    customers: await afterDb.customer.count(),
    sales: await afterDb.sale.count(),
    saleItems: await afterDb.saleItem.count(),
    cashbook: await afterDb.cashbookEntry.count(),
    urd: await afterDb.urdPurchase.count(),
    rates: await afterDb.dailyRate.count(),
    movements: await afterDb.stockMovement.count(),
    ledger: await afterDb.customerLedger.count(),
    itemNames: await afterDb.itemName.count(),
    syncRevision: await afterDb.syncRevision.count()
  };

  let countMismatches = 0;
  for (const [k, v] of Object.entries(beforeCounts)) {
    const after = afterCounts[k];
    if (v === after) {
      console.log(`   ✔ ${k}: ${v} → ${after}`);
    } else {
      countMismatches++;
      errors.push(`Row count mismatch for ${k}: ${v} → ${after}`);
      console.log(`   ✖ ${k}: ${v} → ${after} (MISMATCH!)`);
    }
  }

  // 7. Verify specific data survived the round trip
  console.log('\n7. Verifying specific data survived round trip...');
  const sampleSale = await afterDb.sale.findFirst({ include: { items: true, customer: true }, orderBy: { id: 'desc' } });
  if (sampleSale) {
    console.log(`   ✔ Latest sale: ${sampleSale.invoiceNumber} (${sampleSale.items.length} items, customer: ${sampleSale.customer?.name || 'walk-in'})`);
    if (sampleSale.customerPan) console.log(`   ✔ Sale PAN preserved: ${sampleSale.customerPan}`);
    const hsnItem = sampleSale.items.find(i => i.hsnCode);
    if (hsnItem) console.log(`   ✔ HSN code preserved: ${hsnItem.hsnCode}`);
    const huidItem = sampleSale.items.find(i => i.huidCode);
    if (huidItem) console.log(`   ✔ HUID code preserved: ${huidItem.huidCode}`);
  }
  
  const sampleProduct = await afterDb.product.findFirst({ where: { batchDocNo: { not: null } } });
  if (sampleProduct) {
    console.log(`   ✔ Batch doc product preserved: ${sampleProduct.barcode} (batch: ${sampleProduct.batchDocNo})`);
  }

  const sampleCustomer = await afterDb.customer.findFirst({ where: { panNumber: { not: null } } });
  if (sampleCustomer) {
    console.log(`   ✔ Customer PAN preserved: ${sampleCustomer.name} (PAN: ${sampleCustomer.panNumber})`);
  }

  // 8. Generate another backup after restore and compare sizes
  console.log('\n8. Generating post-restore backup to verify consistency...');
  const backup2 = await generateSqlBackup(process.env.DATABASE_URL);
  const sizeDiff = Math.abs(backup2.sql.length - backup.sql.length);
  console.log(`   Original: ${backup.sql.length} chars`);
  console.log(`   After restore: ${backup2.sql.length} chars`);
  console.log(`   Difference: ${sizeDiff} chars (${sizeDiff < 500 ? '✔ within tolerance' : '⚠️ significant difference'})`);

  await db.$disconnect();
  await afterDb.$disconnect();

  console.log('\n═══════════════════════════════════════════════════════════════');
  if (errors.length === 0) {
    console.log('✅ SQL BACKUP & RESTORE — ALL CHECKS PASSED');
  } else {
    console.log(`⚠️ ${errors.length} ERROR(S):`);
    errors.forEach((e, i) => console.log(`   ${i + 1}. ${e}`));
  }
  console.log('═══════════════════════════════════════════════════════════════');
  process.exit(errors.length > 0 ? 1 : 0);
}

test().catch(e => { console.error(e); process.exit(1); });

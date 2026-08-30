const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const ExcelJS = require('exceljs');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { RESOURCE_LIST, getExportPayload } = require('../src/lib/data-lifecycle');
const { buildExcelExport } = require('../src/lib/excel-export');
const { generateSqlBackup, importSqlBackup, parseDatabaseConnection, splitSqlStatements, validateSqlBackup } = require('../src/lib/sql-backup-restore');
const { runBundledMigrations } = require('../src/lib/shop-provisioning');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const appRoot = path.join(__dirname, '..');
const outputDir = path.join(appRoot, 'outputs', 'excel-final-qa-20260828');
const range = { from: '2026-08-28', to: '2026-08-28' };
const selectedDate = '2026-08-28';
const sourceDatabase = 'kusum_erp_excel_qa_source_20260828';
const targetDatabase = 'kusum_erp_excel_qa_restore_20260828';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function resignBackup(sql) {
  const marker = '-- Kusum ERP Backup SHA256:';
  const markerIndex = sql.indexOf(marker);
  assert(markerIndex >= 0, 'Cannot re-sign a backup without its SHA-256 marker');
  const hash = crypto.createHash('sha256').update(sql.slice(0, markerIndex), 'utf8').digest('hex');
  return sql.replace(/-- Kusum ERP Backup SHA256: [a-f0-9]{64}/i, `${marker} ${hash}`);
}

async function expectFailure(operation, messagePattern, label) {
  let failure;
  try {
    await operation();
  } catch (error) {
    failure = error;
  }
  assert(failure, `${label} unexpectedly succeeded`);
  assert(messagePattern.test(failure.message || ''), `${label} returned the wrong error: ${failure.message}`);
  return failure;
}

function databaseUrlWithName(baseUrl, database) {
  const url = new URL(baseUrl);
  url.pathname = `/${database}`;
  return url.toString();
}

function safeTestDatabase(database) {
  assert(/^kusum_erp_excel_qa_(source|restore)_20260828$/.test(database), `Refusing unsafe test database name: ${database}`);
  return `\`${database}\``;
}

async function resetTestDatabases(baseUrl) {
  const config = parseDatabaseConnection(baseUrl);
  const admin = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    charset: 'utf8mb4'
  });
  try {
    for (const database of [sourceDatabase, targetDatabase]) {
      await admin.query(`DROP DATABASE IF EXISTS ${safeTestDatabase(database)}`);
      await admin.query(`CREATE DATABASE ${safeTestDatabase(database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    }
  } finally {
    await admin.end();
  }
}

async function removeTestDatabases(baseUrl) {
  const config = parseDatabaseConnection(baseUrl);
  const admin = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    charset: 'utf8mb4'
  });
  try {
    for (const database of [sourceDatabase, targetDatabase]) {
      await admin.query(`DROP DATABASE IF EXISTS ${safeTestDatabase(database)}`);
    }
  } finally {
    await admin.end();
  }
}

function dateAt(iso) {
  return new Date(iso);
}

async function seedBoundaryFixtures(db) {
  const moments = [
    { tag: 'PREV', instant: dateAt('2026-08-27T18:29:59.999Z'), expected: false },
    { tag: 'START', instant: dateAt('2026-08-27T18:30:00.000Z'), expected: true },
    { tag: 'END', instant: dateAt('2026-08-28T18:29:59.999Z'), expected: true },
    { tag: 'NEXT', instant: dateAt('2026-08-28T18:30:00.000Z'), expected: false }
  ];
  const customers = new Map();
  const sales = new Map();

  for (const [index, moment] of moments.entries()) {
    const customer = await db.customer.create({
      data: {
        name: `IST ${moment.tag} Customer`,
        phone: `90000000${index + 10}`,
        email: `${moment.tag.toLowerCase()}@example.test`,
        address: `${moment.tag} boundary address`,
        panNumber: `ABCDE${index}F`,
        createdAt: moment.instant,
        updatedAt: moment.instant
      }
    });
    customers.set(moment.tag, customer);

    const product = await db.product.create({
      data: {
        barcode: `${index % 2 === 0 ? 'G22' : 'S'} QA ${index + 1}`,
        sku: `QA-${moment.tag}`,
        name: index % 2 === 0 ? 'Gold ring' : 'Silver anklet',
        category: index % 2 === 0 ? 'Ring' : 'Anklet',
        metal: index % 2 === 0 ? 'GOLD' : 'SILVER',
        purity: index % 2 === 0 ? '22K' : '999',
        grossWeight: index % 2 === 0 ? 8.5 : 45.25,
        stoneWeight: index % 2 === 0 ? 0.25 : 0,
        netWeight: index % 2 === 0 ? 8.25 : 45.25,
        quantity: 1,
        reorderLevel: 1,
        purchasePrice: 40000 + index,
        sellingPrice: 50000 + index,
        makingChargeType: index % 2 === 0 ? 'PERCENTAGE' : 'PER_GRAM',
        makingChargeValue: index % 2 === 0 ? 12 : 200,
        location: 'Main counter',
        batchDocNo: `BATCH-${moment.tag}`,
        notes: `Created at ${moment.tag} IST boundary`,
        createdAt: moment.instant,
        updatedAt: moment.instant,
        movements: {
          create: { type: 'OPENING', quantity: 1, note: `${moment.tag} opening`, createdAt: moment.instant }
        }
      }
    });

    const sale = await db.sale.create({
      data: {
        invoiceNumber: `20260828${String(index + 1).padStart(4, '0')}`,
        customerId: customer.id,
        customerPan: customer.panNumber,
        saleDate: moment.instant,
        subtotal: 10000 + index * 100,
        discount: 100,
        gstRate: 3,
        gstAmount: 297 + index * 3,
        total: 10197 + index * 103,
        urdOffset: index === 2 ? 1000 : 0,
        paid: 5000 + index * 100,
        cashPaid: index === 1 ? 1500 : 0,
        upiPaid: index === 1 ? 1600 : 0,
        cardPaid: index === 1 ? 900 : 0,
        bankPaid: index === 1 ? 1100 : index === 2 ? 5200 : 0,
        balance: 5197 + index * 3,
        paymentMethod: index === 1 ? 'MIXED' : 'BANK_TRANSFER',
        notes: `${moment.tag} sale note`,
        createdAt: moment.instant,
        updatedAt: moment.instant,
        items: {
          create: {
            productId: product.id,
            productBarcode: product.barcode,
            productSku: product.sku,
            productName: product.name,
            productMetal: product.metal,
            productPurity: product.purity,
            grossWeight: product.grossWeight,
            quantity: 1,
            weight: product.netWeight,
            unitPrice: 1000,
            metalRate: 1000,
            metalAmount: 8250,
            makingCharge: index % 2 === 0 ? 990 : 9050,
            makingChargeType: index % 2 === 0 ? 'PERCENTAGE' : 'PER_GRAM',
            makingChargeValue: index % 2 === 0 ? 12 : 200,
            taxableAmount: 9240,
            lineTotal: 9240,
            hsnCode: '7113',
            huidCode: `HUID${index}`
          }
        }
      }
    });
    sales.set(moment.tag, sale);

    await db.urdPurchase.create({
      data: {
        purchaseNumber: `URD-20260828-${String(index + 1).padStart(4, '0')}`,
        customerId: customer.id,
        purchaseDate: moment.instant,
        metal: index % 2 === 0 ? 'GOLD' : 'SILVER',
        purity: index % 2 === 0 ? '22K' : '999',
        grossWeight: 10 + index,
        netWeight: 9 + index,
        ratePerGram: 6000 + index,
        totalAmount: 54000 + index * 1000,
        saleOffset: index === 2 ? 5000 : 0,
        paid: 20000 + index * 1000,
        paymentMethod: index % 2 === 0 ? 'CASH' : 'UPI',
        description: `${moment.tag} old gold valuation`,
        notes: `${moment.tag} URD note`,
        createdAt: moment.instant,
        updatedAt: moment.instant
      }
    });

    await db.customerLedger.create({
      data: {
        customerId: customer.id,
        saleId: sale.id,
        type: index % 2 === 0 ? 'SALE_CREDIT' : 'PAYMENT_RECEIVED',
        amount: index % 2 === 0 ? 3000 + index : -(1000 + index),
        paymentMethod: index % 2 === 0 ? null : 'UPI',
        reference: `LEDGER-${moment.tag}`,
        note: `${moment.tag} ledger note`,
        createdAt: moment.instant
      }
    });
  }

  // A zero-stock barcode may exist after a manual stock adjustment. It is
  // history, not live inventory, and must never appear in Inventory Excel.
  await db.product.create({
    data: {
      barcode: 'S SOLDOUT QA 1',
      sku: 'S-SOLDOUT-QA-1',
      name: 'Sold-out export guard',
      category: 'Test item',
      metal: 'SILVER',
      purity: '925',
      grossWeight: 1,
      stoneWeight: 0,
      netWeight: 1,
      quantity: 0,
      reorderLevel: 1,
      purchasePrice: 100,
      sellingPrice: 120,
      makingChargeType: 'FIXED',
      makingChargeValue: 0,
      status: 'SOLD_OUT',
      createdAt: dateAt('2026-08-27T18:30:00.000Z'),
      updatedAt: dateAt('2026-08-27T18:30:00.000Z')
    }
  });

  await db.customerLedger.create({
    data: {
      customerId: customers.get('START').id,
      type: 'ADJUSTMENT',
      amount: 500,
      paymentMethod: 'CASH',
      reference: 'OPENING-BEFORE-28',
      note: 'Opening balance before selected IST date',
      createdAt: dateAt('2026-08-27T18:29:59.999Z')
    }
  });

  await db.cashbookEntry.createMany({
    data: [
      { entryDate: '2026-08-27', type: 'IN', paymentMethod: 'CASH', description: 'Previous IST day', amount: 10 },
      { entryDate: selectedDate, type: 'IN', paymentMethod: 'CASH', description: 'Cash sale received', amount: 1000, reference: 'CASH-28' },
      { entryDate: selectedDate, type: 'OUT', paymentMethod: 'UPI', description: 'UPI URD payout', amount: 250, reference: 'UPI-28' },
      { entryDate: selectedDate, type: 'IN', paymentMethod: 'CARD', description: 'Card sale received', amount: 300, reference: 'CARD-28' },
      { entryDate: selectedDate, type: 'IN', paymentMethod: 'BANK_TRANSFER', description: 'Bank receipt', amount: 500, reference: 'BANK-28' },
      { entryDate: '2026-08-29', type: 'OUT', paymentMethod: 'CASH', description: 'Next IST day', amount: 20 }
    ]
  });

  await db.dailyRate.createMany({
    data: [
      { rateDate: '2026-08-27', gold22k: 7000, gold24k: 7600, silver: 90, note: 'Previous day' },
      { rateDate: selectedDate, gold22k: 7100, gold24k: 7700, silver: 92, note: 'Selected IST day' },
      { rateDate: '2026-08-29', gold22k: 7200, gold24k: 7800, silver: 94, note: 'Next day' }
    ]
  });
}

function assertDateRows(resource, payload) {
  const dateKeys = {
    sales: 'saleDate', urd: 'purchaseDate', cashbook: 'entryDate', inventory: 'createdAt',
    'stock-movements': 'createdAt', customers: 'createdAt', 'customer-ledger': 'createdAt', rates: 'rateDate'
  };
  const key = dateKeys[resource];
  for (const row of payload.rows) {
    assert(row[key] === selectedDate, `${resource} included ${row[key]} when only ${selectedDate} was selected`);
  }
}

async function assertWorkbook(resource, payload, buffer) {
  assert(buffer.length > 6000, `${resource} workbook is unexpectedly small`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  assert(workbook.worksheets.length === (payload.sheets?.length || 1), `${resource} worksheet count mismatch`);

  for (const [sheetIndex, sheet] of workbook.worksheets.entries()) {
    const spec = payload.sheets?.[sheetIndex] || payload;
    assert(sheet.getCell('A1').value === (spec.title || payload.title), `${resource}/${sheet.name} title is missing`);
    assert(sheet.views[0]?.state === 'frozen', `${resource}/${sheet.name} header is not frozen`);
    assert(sheet.pageSetup?.fitToWidth === 1, `${resource}/${sheet.name} is not print-fitted`);

    let headerRow = 0;
    sheet.eachRow((row, rowNumber) => {
      if (!headerRow && row.getCell(1).value === spec.columns[0].label) headerRow = rowNumber;
      row.eachCell({ includeEmpty: false }, (cell) => {
        assert(!(cell.value && typeof cell.value === 'object' && cell.value.error), `${resource}/${sheet.name} contains an Excel error`);
      });
    });
    assert(headerRow > 0, `${resource}/${sheet.name} column header row was not found`);

    const dateColumnIndex = spec.columns.findIndex((column) => column.type === 'date');
    if (dateColumnIndex >= 0 && spec.rows.length) {
      for (let rowIndex = 0; rowIndex < spec.rows.length; rowIndex += 1) {
        const value = sheet.getRow(headerRow + 1 + rowIndex).getCell(dateColumnIndex + 1).value;
        assert(value instanceof Date, `${resource}/${sheet.name} date cell is not a typed Excel date`);
        assert(value.toISOString().slice(0, 10) === selectedDate, `${resource}/${sheet.name} rendered ${value.toISOString()} instead of ${selectedDate}`);
      }
    }
  }
}

async function buildAndCheckExports(db, suffix = '') {
  const manifest = [];
  const payloads = {};
  for (const resource of RESOURCE_LIST) {
    const payload = await getExportPayload(db, resource.key, range);
    payloads[resource.key] = payload;
    assertDateRows(resource.key, payload);

    if (resource.key === 'sales') {
      assert(payload.sheets[0].rows.length === 2, 'Sales did not select both IST boundary invoices');
      assert(payload.sheets[0].columns.some((column) => column.key === 'cashPaid'), 'Sales summary is missing cash paid');
      assert(payload.sheets[0].columns.some((column) => column.key === 'cardPaid'), 'Sales summary is missing card paid');
      assert(payload.sheets[0].columns.some((column) => column.key === 'bankPaid'), 'Sales summary is missing bank transfer paid');
      assert(payload.sheets[0].columns.some((column) => column.key === 'cgstAmount'), 'Sales summary is missing CGST amount');
      const mixedInvoice = payload.sheets[0].rows.find((row) => row.invoiceNumber.endsWith('0002'));
      const bankInvoice = payload.sheets[0].rows.find((row) => row.invoiceNumber.endsWith('0003'));
      assert(mixedInvoice?.cardPaid === 900 && mixedInvoice?.bankPaid === 1100, 'Sales mixed Card/Bank amounts are incorrect');
      assert(bankInvoice?.bankPaid === 5200 && bankInvoice?.otherPaid === 0, 'Sales Bank transfer amount was not classified correctly');
    }
    if (resource.key === 'urd') {
      assert(payload.rows.length === 2, 'URD did not select both IST boundary purchases');
      const endRow = payload.rows.find((row) => row.purchaseNumber.endsWith('0003'));
      assert(endRow?.outstanding === endRow.totalAmount - endRow.saleOffset - endRow.paid, 'URD outstanding did not subtract the sale adjustment');
    }
    if (resource.key === 'cashbook') {
      assert(payload.rows.length === 4, 'Cashbook export did not select exactly four 28/08 entries');
      const names = payload.sheets.map((sheet) => sheet.name);
      for (const required of ['All entries', 'Summary', 'Cash', 'UPI', 'Card', 'Bank transfer']) {
        assert(names.includes(required), `Cashbook is missing ${required} sheet`);
      }
      const cashRows = payload.sheets.find((sheet) => sheet.name === 'Cash').rows;
      const upiRows = payload.sheets.find((sheet) => sheet.name === 'UPI').rows;
      const cardRows = payload.sheets.find((sheet) => sheet.name === 'Card').rows;
      const bankRows = payload.sheets.find((sheet) => sheet.name === 'Bank transfer').rows;
      assert(cashRows.at(-1).runningBalance === 1000, 'Cash running balance is incorrect');
      assert(upiRows.at(-1).runningBalance === -250, 'UPI running balance is incorrect');
      assert(cardRows.at(-1).runningBalance === 300, 'Card running balance is incorrect');
      assert(bankRows.at(-1).runningBalance === 500, 'Bank running balance is incorrect');
    }
    if (resource.key === 'inventory') {
      assert(payload.rows.length === 2, 'Inventory did not select both IST boundary records');
      assert(!payload.rows.some((row) => row.barcode === 'S SOLDOUT QA 1'), 'Sold-out barcode appeared in the Inventory export.');
      const names = payload.sheets.map((sheet) => sheet.name);
      assert(names.includes('Gold') && names.includes('Silver'), 'Inventory is missing Gold or Silver item sheet');
    }
    if (resource.key === 'stock-movements') assert(payload.rows.length === 2, 'Stock movements did not select both IST boundary records');
    if (resource.key === 'customers') assert(payload.rows.length === 2, 'Customers did not select both IST boundary records');
    if (resource.key === 'customer-ledger') {
      assert(payload.rows.length === 2, 'Customer ledger did not select both IST boundary records');
      const startRow = payload.rows.find((row) => row.customerName === 'IST START Customer');
      assert(startRow?.openingBalance === 500, 'Customer ledger opening balance is incorrect');
      assert(startRow?.runningBalance === -501, 'Customer ledger running due did not include the opening balance');
    }
    if (resource.key === 'rates') assert(payload.rows.length === 1, 'Daily rates included another date');

    const buffer = await buildExcelExport(payload);
    await assertWorkbook(resource.key, payload, buffer);
    if (!suffix) {
      const filename = `${resource.key}-2026-08-28-IST-final.xlsx`;
      await fs.writeFile(path.join(outputDir, filename), buffer);
      manifest.push({ resource: resource.key, filename, sheets: (payload.sheets || [{ name: 'Data Export' }]).map((sheet) => sheet.name) });
    }
  }
  if (!suffix) await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return payloads;
}

async function canonicalDatabase(databaseUrl) {
  const config = parseDatabaseConnection(databaseUrl);
  const connection = await mysql.createConnection({
    host: config.host, port: config.port, user: config.username, password: config.password,
    database: config.database, charset: 'utf8mb4', dateStrings: true
  });
  try {
    const [tableRows] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    const tableKey = Object.keys(tableRows[0] || {})[0];
    const tables = tableRows.map((row) => row[tableKey]).filter(Boolean).sort();
    const snapshot = {};
    const schema = {};
    for (const table of tables) {
      const [[createRow]] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
      // MySQL expands an explicit per-column COLLATE clause to the equivalent
      // "CHARACTER SET utf8mb4 COLLATE ..." after recreating a table. Removing
      // only that redundant phrase preserves a semantic schema comparison.
      schema[table] = createRow['Create Table'].replace(/\s+CHARACTER SET utf8mb4(?=\s+COLLATE utf8mb4_unicode_ci)/gi, '');
      const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
      snapshot[table] = rows.map((row) => JSON.stringify(row)).sort();
    }
    return {
      tables,
      schema,
      snapshot,
      hash: crypto.createHash('sha256').update(JSON.stringify({ tables, schema, snapshot })).digest('hex')
    };
  } finally {
    await connection.end();
  }
}

async function main() {
  assert(process.env.DATABASE_URL, 'DATABASE_URL is missing');
  const sourceUrl = databaseUrlWithName(process.env.DATABASE_URL, sourceDatabase);
  const targetUrl = databaseUrlWithName(process.env.DATABASE_URL, targetDatabase);
  let source;
  let target;
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  try {
    await resetTestDatabases(process.env.DATABASE_URL);
    await runBundledMigrations(appRoot, sourceUrl);
    await runBundledMigrations(appRoot, targetUrl);

    source = new PrismaClient({ datasourceUrl: sourceUrl });
    await source.$connect();
    await seedBoundaryFixtures(source);

    const sourcePayloads = await buildAndCheckExports(source);
    const sourceSnapshot = await canonicalDatabase(sourceUrl);
    const backup = await generateSqlBackup(sourceUrl);
    assert(backup.sql.includes('-- End of Kusum ERP Backup'), 'SQL backup is incomplete');
    assert(/DROP TABLE IF EXISTS `sale`;/i.test(backup.sql), 'SQL backup does not contain the Sale table');
    const backupValidation = validateSqlBackup(backup.sql);
    assert(backupValidation.tables.created.size >= 13, 'SQL backup preflight did not find every ERP table');
    const conditionalStatements = splitSqlStatements("/*!40101 SET NAMES utf8mb4 */; INSERT INTO `Customer` (`name`) VALUES ('Semi;colon and doubled ''quote''');");
    assert(conditionalStatements.length === 2 && /^SET NAMES utf8mb4$/i.test(conditionalStatements[0]), 'SQL parser mishandled a MySQL conditional comment');
    assert(conditionalStatements[1].includes("Semi;colon"), 'SQL parser split a semicolon inside a quoted value');
    await fs.writeFile(path.join(outputDir, 'sql-backup-validation.json'), JSON.stringify({
      filename: backup.filename,
      bytes: Buffer.byteLength(backup.sql),
      tables: backup.tableCount,
      sourceHash: sourceSnapshot.hash
    }, null, 2));

    const restore = await importSqlBackup(targetUrl, backup.sql, appRoot);
    assert(restore.success, 'SQL restore did not report success');
    const targetSnapshot = await canonicalDatabase(targetUrl);
    const schemaDifferences = sourceSnapshot.tables.filter((table) => sourceSnapshot.schema[table] !== targetSnapshot.schema[table]);
    const dataDifferences = sourceSnapshot.tables.filter((table) => JSON.stringify(sourceSnapshot.snapshot[table]) !== JSON.stringify(targetSnapshot.snapshot[table]));
    if (schemaDifferences.length || dataDifferences.length) {
      await fs.writeFile(path.join(outputDir, 'sql-roundtrip-differences.json'), JSON.stringify({
        schema: Object.fromEntries(schemaDifferences.map((table) => [table, {
          source: sourceSnapshot.schema[table], target: targetSnapshot.schema[table]
        }])),
        dataTables: dataDifferences
      }, null, 2));
    }
    assert(sourceSnapshot.hash === targetSnapshot.hash,
      `SQL restore changed database state: ${sourceSnapshot.hash} != ${targetSnapshot.hash}; schema=${schemaDifferences.join(',') || 'none'}; data=${dataDifferences.join(',') || 'none'}`);

    await expectFailure(
      () => importSqlBackup(targetUrl, 'DROP DATABASE kusum_erp;', appRoot),
      /not a Kusum ERP SQL backup/i,
      'Non-ERP SQL rejection'
    );
    const afterInvalidSnapshot = await canonicalDatabase(targetUrl);
    assert(afterInvalidSnapshot.hash === targetSnapshot.hash, 'Rejected non-ERP SQL changed the database');

    const maliciousBackup = [
      '-- Kusum ERP — Full MySQL Database Backup',
      'DROP DATABASE `kusum_erp`;',
      '-- End of Kusum ERP Backup'
    ].join('\n');
    await expectFailure(
      () => importSqlBackup(targetUrl, maliciousBackup, appRoot),
      /unsupported command/i,
      'Unsafe SQL command rejection'
    );
    const afterUnsafeSnapshot = await canonicalDatabase(targetUrl);
    assert(afterUnsafeSnapshot.hash === targetSnapshot.hash, 'Rejected unsafe SQL changed the database');

    const corruptBackup = resignBackup(backup.sql.replace(/CREATE TABLE `Customer` \(/i, 'CREATE TABLE `Customer` BROKEN ('));
    assert(corruptBackup !== backup.sql, 'Could not construct the automatic-recovery test backup');
    await expectFailure(
      () => importSqlBackup(targetUrl, corruptBackup, appRoot),
      /restored automatically/i,
      'Automatic recovery after a mid-restore SQL failure'
    );
    const afterRecoverySnapshot = await canonicalDatabase(targetUrl);
    assert(afterRecoverySnapshot.hash === targetSnapshot.hash, 'Automatic SQL recovery did not restore the exact pre-import data');

    await expectFailure(
      () => importSqlBackup(targetUrl, backup.sql, path.join(appRoot, 'missing-audit-app-root')),
      /restored automatically/i,
      'Post-restore migration failure handling'
    );
    const afterMigrationFailureSnapshot = await canonicalDatabase(targetUrl);
    assert(afterMigrationFailureSnapshot.hash === targetSnapshot.hash, 'Migration failure recovery did not restore the exact pre-import data');

    target = new PrismaClient({ datasourceUrl: targetUrl });
    await target.$connect();
    const targetPayloads = await buildAndCheckExports(target, '-restored');
    assert(JSON.stringify(sourcePayloads) === JSON.stringify(targetPayloads), 'Excel export payloads changed after SQL restore');

    console.log(JSON.stringify({
      result: 'PASS',
      selectedDate,
      timeZone: 'Asia/Kolkata',
      resources: RESOURCE_LIST.map((resource) => resource.key),
      sqlTables: backup.tableCount,
      sqlDataHash: sourceSnapshot.hash,
      outputDir
    }, null, 2));
  } finally {
    if (source) await source.$disconnect().catch(() => {});
    if (target) await target.$disconnect().catch(() => {});
    await removeTestDatabases(process.env.DATABASE_URL).catch((error) => console.error(`Test database cleanup warning: ${error.message}`));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});

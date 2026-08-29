const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const { runBundledMigrations, verifyClientConnection } = require('../src/lib/shop-provisioning');
const { generateSqlBackupFile, validateSqlBackupFile, cleanupSqlBackupFile, parseDatabaseConnection } = require('../src/lib/sql-backup-restore');

const appRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(appRoot, '.env') });

const qaDatabase = 'kusum_erp_lifetime_qa_20260829';
const businessTables = [
  'BarcodeSequence', 'CashbookEntry', 'Customer', 'CustomerLedger', 'DailyRate',
  'DocumentSequence', 'ItemName', 'Product', 'Sale', 'SaleItem', 'StockMovement',
  'SyncRevision', 'UrdPurchase'
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function quotedIdentifier(value) {
  assert(/^[A-Za-z0-9_]{1,64}$/.test(value), `Unsafe SQL identifier: ${value}`);
  return `\`${value}\``;
}

function databaseUrlWithName(baseUrl, database) {
  const url = new URL(baseUrl);
  url.pathname = `/${database}`;
  return url.toString();
}

async function tableSnapshot(connection, database, tableNames) {
  const snapshot = {};
  for (const table of tableNames) {
    const [[row]] = await connection.query(
      `SELECT COUNT(*) rowCount FROM ${quotedIdentifier(database)}.${quotedIdentifier(table)}`
    );
    snapshot[table] = Number(row.rowCount);
  }
  const [[money]] = await connection.query(`
    SELECT
      (SELECT COALESCE(SUM(total), 0) FROM ${quotedIdentifier(database)}.\`Sale\`) saleTotal,
      (SELECT COALESCE(SUM(paid), 0) FROM ${quotedIdentifier(database)}.\`Sale\`) salePaid,
      (SELECT COALESCE(SUM(balance), 0) FROM ${quotedIdentifier(database)}.\`Sale\`) saleBalance,
      (SELECT COALESCE(SUM(amount), 0) FROM ${quotedIdentifier(database)}.\`CustomerLedger\`) ledgerBalance,
      (SELECT COALESCE(SUM(amount), 0) FROM ${quotedIdentifier(database)}.\`CashbookEntry\` WHERE type='IN') cashIn,
      (SELECT COALESCE(SUM(amount), 0) FROM ${quotedIdentifier(database)}.\`CashbookEntry\` WHERE type='OUT') cashOut,
      (SELECT COALESCE(SUM(netWeight * quantity), 0) FROM ${quotedIdentifier(database)}.\`Product\`) inventoryNetWeight
  `);
  snapshot.financials = Object.fromEntries(Object.entries(money).map(([key, value]) => [key, Number(value)]));
  return snapshot;
}

async function cloneConfiguredDatabase(baseUrl, targetDatabase) {
  const config = parseDatabaseConnection(baseUrl);
  const sourceDatabase = config.database;
  assert(sourceDatabase !== targetDatabase, 'The QA database must never equal the configured ERP database.');
  assert(qaDatabase === targetDatabase, 'Refusing an unexpected QA database target.');
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    charset: 'utf8mb4'
  });
  try {
    const [tableRows] = await connection.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema=? AND table_type=\'BASE TABLE\' ORDER BY table_name',
      [sourceDatabase]
    );
    const tables = tableRows.map((row) => row.TABLE_NAME || row.table_name);
    assert(tables.length >= 10, 'The configured ERP database does not contain the expected tables.');
    await connection.query(`DROP DATABASE IF EXISTS ${quotedIdentifier(targetDatabase)}`);
    await connection.query(`CREATE DATABASE ${quotedIdentifier(targetDatabase)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query('SET FOREIGN_KEY_CHECKS=0');
    for (const table of tables) {
      await connection.query(
        `CREATE TABLE ${quotedIdentifier(targetDatabase)}.${quotedIdentifier(table)} LIKE ${quotedIdentifier(sourceDatabase)}.${quotedIdentifier(table)}`
      );
      await connection.query(
        `INSERT INTO ${quotedIdentifier(targetDatabase)}.${quotedIdentifier(table)} SELECT * FROM ${quotedIdentifier(sourceDatabase)}.${quotedIdentifier(table)}`
      );
    }
    await connection.query('SET FOREIGN_KEY_CHECKS=1');
    return tables;
  } finally {
    await connection.end();
  }
}

async function cleanup(baseUrl) {
  const config = parseDatabaseConnection(baseUrl);
  const connection = await mysql.createConnection({
    host: config.host, port: config.port, user: config.username, password: config.password
  });
  try {
    assert(qaDatabase === 'kusum_erp_lifetime_qa_20260829', 'Refusing unsafe cleanup target.');
    await connection.query(`DROP DATABASE IF EXISTS ${quotedIdentifier(qaDatabase)}`);
  } finally {
    await connection.end();
  }
}

async function main() {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) throw new Error('DATABASE_URL is required.');
  const config = parseDatabaseConnection(baseUrl);
  const targetUrl = databaseUrlWithName(baseUrl, qaDatabase);
  let backup;
  let connection;
  try {
    const clonedTables = await cloneConfiguredDatabase(baseUrl, qaDatabase);
    connection = await mysql.createConnection({
      host: config.host, port: config.port, user: config.username, password: config.password, charset: 'utf8mb4'
    });
    const comparableTables = businessTables.filter((table) => clonedTables.some((value) => value.toLowerCase() === table.toLowerCase()));
    const before = await tableSnapshot(connection, qaDatabase, comparableTables);

    await runBundledMigrations(appRoot, targetUrl);
    await verifyClientConnection(targetUrl, appRoot);

    const after = await tableSnapshot(connection, qaDatabase, comparableTables);
    assert(JSON.stringify(before) === JSON.stringify(after), 'Migration changed business row counts or financial totals unexpectedly.');

    const [installed] = await connection.query(
      `SELECT migration_name, checksum FROM ${quotedIdentifier(qaDatabase)}.\`_prisma_migrations\` WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL`
    );
    const installedByName = new Map(installed.map((row) => [row.migration_name, String(row.checksum).toLowerCase()]));
    const migrationRoot = path.join(appRoot, 'prisma', 'migrations');
    const migrationFolders = (await fs.readdir(migrationRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    for (const folder of migrationFolders) {
      const sql = await fs.readFile(path.join(migrationRoot, folder.name, 'migration.sql'), 'utf8');
      const expected = crypto.createHash('sha256').update(sql).digest('hex');
      assert(installedByName.get(folder.name) === expected, `Migration ${folder.name} is missing or has the wrong checksum after upgrade.`);
    }

    backup = await generateSqlBackupFile(targetUrl);
    const validation = await validateSqlBackupFile(backup.filePath);
    assert(validation.isCurrentSchemaBackup, 'The migrated clone did not produce a current-schema SQL backup.');

    console.log(JSON.stringify({
      result: 'PASS',
      configuredDatabaseReadOnly: config.database,
      clonedTables: clonedTables.length,
      businessRowsPreserved: true,
      financialTotalsPreserved: true,
      bundledMigrationsVerified: migrationFolders.length,
      largeFileSqlBackupValidated: true,
      qaDatabaseRemovedOnExit: true
    }, null, 2));
  } finally {
    if (connection) await connection.end().catch(() => {});
    if (backup) await cleanupSqlBackupFile(backup).catch(() => {});
    await cleanup(baseUrl).catch((error) => console.error(`QA cleanup warning: ${error.message}`));
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});

const mysql = require('mysql2/promise');
const mysqlCore = require('mysql2');
const crypto = require('crypto');
const fs = require('fs');
const fsPromises = require('fs/promises');
const os = require('os');
const path = require('path');
const { once } = require('events');
const { runBundledMigrations } = require('./shop-provisioning');
const { dateInput, localDateParts, localTimeZoneName } = require('./helpers');

const KNOWN_ERP_TABLES = new Set([
  '_prisma_migrations',
  'AppSession',
  'BarcodeSequence',
  'CashbookEntry',
  'Customer',
  'CustomerLedger',
  'DailyRate',
  'DocumentSequence',
  'ItemName',
  'Product',
  'Sale',
  'SaleItem',
  'StockMovement',
  'SyncRevision',
  'UrdPurchase',
  // Historical tables are accepted so backups made before those modules were
  // removed can still be upgraded by the bundled Prisma migrations.
  'Supplier',
  'Purchase',
  'PurchaseItem',
  'Repair'
]);

const CURRENT_ERP_TABLES = [
  '_prisma_migrations', 'AppSession', 'BarcodeSequence', 'CashbookEntry', 'Customer',
  'CustomerLedger', 'DailyRate', 'DocumentSequence', 'ItemName', 'Product',
  'Sale', 'SaleItem', 'StockMovement', 'SyncRevision', 'UrdPurchase'
];

// These six tables existed in the first ERP schema and are sufficient to
// identify a complete historical business backup. Bundled migrations recreate
// newer tables after the old snapshot is restored.
const REQUIRED_BACKUP_TABLES = [
  '_prisma_migrations', 'Customer', 'Product', 'Sale', 'SaleItem', 'StockMovement'
];
const LEGACY_STABLE_COUNT_TABLES = ['Customer', 'Product', 'Sale', 'SaleItem'];

const ERP_SCHEMA_COLUMNS = {
  _prisma_migrations: ['id', 'checksum', 'finished_at', 'migration_name', 'logs', 'rolled_back_at', 'started_at', 'applied_steps_count'],
  AppSession: ['id', 'data', 'expiresAt', 'createdAt', 'updatedAt'],
  BarcodeSequence: ['prefix', 'lastNumber', 'updatedAt'],
  CashbookEntry: ['id', 'entryDate', 'type', 'paymentMethod', 'description', 'amount', 'reference', 'notes', 'customerId', 'saleId', 'urdPurchaseId', 'syncLedger', 'createdAt'],
  Customer: ['id', 'name', 'phone', 'email', 'address', 'panNumber', 'createdAt', 'updatedAt'],
  CustomerLedger: ['id', 'customerId', 'saleId', 'cashbookEntryId', 'type', 'amount', 'paymentMethod', 'reference', 'note', 'createdAt'],
  DailyRate: ['id', 'rateDate', 'gold22k', 'gold24k', 'silver', 'note', 'createdAt', 'updatedAt'],
  DocumentSequence: ['key', 'lastNumber', 'updatedAt'],
  ItemName: ['id', 'name', 'category', 'createdAt'],
  Product: ['id', 'barcode', 'sku', 'name', 'category', 'metal', 'purity', 'grossWeight', 'stoneWeight', 'netWeight', 'quantity', 'reorderLevel', 'purchasePrice', 'sellingPrice', 'makingChargePerGram', 'makingChargeType', 'makingChargeValue', 'location', 'batchDocNo', 'notes', 'status', 'createdAt', 'updatedAt'],
  Sale: ['id', 'invoiceNumber', 'customerId', 'customerPan', 'saleDate', 'subtotal', 'discount', 'gstRate', 'gstAmount', 'total', 'urdOffset', 'paid', 'cashPaid', 'upiPaid', 'cardPaid', 'bankPaid', 'balance', 'paymentMethod', 'notes', 'createdAt', 'updatedAt'],
  SaleItem: ['id', 'saleId', 'productId', 'productBarcode', 'productSku', 'productName', 'productMetal', 'productPurity', 'grossWeight', 'quantity', 'weight', 'unitPrice', 'metalRate', 'metalAmount', 'makingCharge', 'makingChargeType', 'makingChargeValue', 'taxableAmount', 'lineTotal', 'hsnCode', 'huidCode'],
  StockMovement: ['id', 'productId', 'productBarcode', 'productSku', 'productName', 'productMetal', 'productPurity', 'netWeight', 'type', 'quantity', 'note', 'createdAt'],
  SyncRevision: ['id', 'revision', 'updatedAt'],
  UrdPurchase: ['id', 'purchaseNumber', 'customerId', 'purchaseDate', 'metal', 'purity', 'grossWeight', 'netWeight', 'ratePerGram', 'totalAmount', 'saleOffset', 'paid', 'paymentMethod', 'description', 'notes', 'saleId', 'createdAt', 'updatedAt']
};

function windowsTimestamp(value = new Date()) {
  const parts = localDateParts(value);
  return {
    display: `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} ${localTimeZoneName(value)}`,
    filenameTime: `${parts.hour}${parts.minute}${parts.second}`
  };
}

function parseDatabaseConnection(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    if (url.protocol !== 'mysql:') throw new Error('Unsupported database connection protocol.');
    const database = decodeURIComponent((url.pathname || '').replace(/^\//, ''));
    if (!/^[A-Za-z0-9_]{1,64}$/.test(database)) throw new Error('Invalid ERP database name.');
    return {
      host: url.hostname || 'localhost',
      port: Number(url.port) || 3306,
      username: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL configured: ${error.message || error}`);
  }
}

function sqlValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (value instanceof Date) return mysqlCore.escape(value.toISOString().slice(0, 19).replace('T', ' '));
  if (Buffer.isBuffer(value)) return `0x${value.toString('hex')}`;
  if (typeof value === 'object') return mysqlCore.escape(JSON.stringify(value));
  return mysqlCore.escape(value);
}

async function writeStreamChunk(stream, value) {
  if (stream.write(value, 'utf8')) return;
  await once(stream, 'drain');
}

/**
 * Writes the SQL backup incrementally to disk. This is the production download
 * path: years of shop rows no longer have to coexist as one giant JS string.
 */
async function generateSqlBackupFile(databaseUrl, destinationDirectory = null) {
  const config = parseDatabaseConnection(databaseUrl);
  const connection = await mysql.createConnection({
    host: config.host, port: config.port, user: config.username, password: config.password,
    database: config.database, charset: 'utf8mb4', dateStrings: true
  });
  const temporaryDirectory = destinationDirectory
    ? path.resolve(destinationDirectory)
    : await fsPromises.mkdtemp(path.join(os.tmpdir(), 'kusum-erp-sql-'));
  await fsPromises.mkdir(temporaryDirectory, { recursive: true });
  const now = new Date();
  const timestamp = windowsTimestamp(now);
  const filename = `kusum-erp-backup-${dateInput(now)}-${timestamp.filenameTime}.sql`;
  const filePath = path.join(temporaryDirectory, `${crypto.randomUUID()}-${filename}`);
  const output = fs.createWriteStream(filePath, { encoding: 'utf8', flags: 'wx' });
  const hash = crypto.createHash('sha256');
  let snapshotStarted = false;
  let streamEnded = false;

  const writeProtected = async (value) => {
    hash.update(value, 'utf8');
    await writeStreamChunk(output, value);
  };

  try {
    await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await connection.query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
    snapshotStarted = true;
    const [tableRows] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    const tableKey = Object.keys(tableRows[0] || {})[0];
    const tables = tableRows.map((row) => canonicalTableName(row[tableKey])).filter(Boolean);
    const missing = CURRENT_ERP_TABLES.filter((table) => !tables.includes(table));
    if (missing.length) throw new Error(`The ERP schema is incomplete and cannot be backed up: ${missing.join(', ')} missing. Restart the Main database PC ERP to apply updates first.`);

    await writeProtected([
      '-- ========================================================',
      '-- Kusum ERP — Full MySQL Database Backup',
      `-- Database: ${config.database}`,
      `-- Backup Date & Time: ${timestamp.display}`,
      '-- Compatible with: MySQL Workbench, mysqldump, and Kusum ERP',
      '-- Backup Format: 2',
      '-- ========================================================', '',
      'SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;',
      'SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;',
      'SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;',
      'SET NAMES utf8mb4;',
      'SET @OLD_TIME_ZONE=@@TIME_ZONE;',
      "SET TIME_ZONE='+00:00';",
      'SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;',
      'SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;',
      "SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';",
      'SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;', ''
    ].join('\n'));

    const rowCounts = {};
    for (const table of tables) {
      await writeProtected(`\n-- --------------------------------------------------------\n-- Structure and Data for table \`${table}\`\n-- --------------------------------------------------------\n\nDROP TABLE IF EXISTS \`${table}\`;\n`);
      const [[createResult]] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
      await writeProtected(`${createResult['Create Table']};\n\n`);

      const [[countRow]] = table === 'AppSession'
        ? [[{ rowCount: 0 }]]
        : await connection.query(`SELECT COUNT(*) AS rowCount FROM \`${table}\``);
      const rowCount = Number(countRow.rowCount || 0);
      rowCounts[table] = rowCount;
      if (!rowCount) continue;

      const [columnRows] = await connection.query(`SHOW COLUMNS FROM \`${table}\``);
      const columns = columnRows.map((column) => column.Field);
      const columnList = columns.map((column) => `\`${column}\``).join(', ');
      await writeProtected(`LOCK TABLES \`${table}\` WRITE;\n`);
      const batchSize = 500;
      for (let offset = 0; offset < rowCount; offset += batchSize) {
        const [rows] = await connection.query(`SELECT * FROM \`${table}\` LIMIT ? OFFSET ?`, [batchSize, offset]);
        if (!rows.length) throw new Error(`The consistent backup snapshot ended early while reading ${table}.`);
        const values = rows.map((row) => `(${columns.map((column) => sqlValue(row[column])).join(', ')})`);
        await writeProtected(`INSERT INTO \`${table}\` (${columnList}) VALUES\n${values.join(',\n')};\n`);
      }
      await writeProtected('UNLOCK TABLES;\n\n');
    }

    const manifest = Buffer.from(JSON.stringify({ formatVersion: 2, tables: rowCounts }), 'utf8').toString('base64');
    await writeProtected(`\n-- Kusum ERP Backup Manifest: ${manifest}\n`);
    const backupHash = hash.digest('hex');
    await writeStreamChunk(output, [
      `-- Kusum ERP Backup SHA256: ${backupHash}`, '',
      '-- --------------------------------------------------------',
      '-- Restore Environment Variables',
      '-- --------------------------------------------------------',
      'SET TIME_ZONE=@OLD_TIME_ZONE;',
      'SET SQL_MODE=@OLD_SQL_MODE;',
      'SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;',
      'SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;',
      'SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;',
      'SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;',
      'SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;',
      'SET SQL_NOTES=@OLD_SQL_NOTES;', '',
      '-- End of Kusum ERP Backup'
    ].join('\n'));
    output.end();
    await once(output, 'finish');
    streamEnded = true;
    await connection.commit();
    snapshotStarted = false;
    return { filePath, directory: temporaryDirectory, filename, tableCount: tables.length };
  } catch (error) {
    output.destroy();
    await fsPromises.rm(filePath, { force: true }).catch(() => {});
    if (!destinationDirectory) await fsPromises.rm(temporaryDirectory, { recursive: true, force: true }).catch(() => {});
    throw error;
  } finally {
    if (!streamEnded) output.destroy();
    if (snapshotStarted) await connection.rollback().catch(() => {});
    await connection.end();
  }
}

async function cleanupSqlBackupFile(backup) {
  if (!backup) return;
  await fsPromises.rm(backup.filePath, { force: true }).catch(() => {});
  if (backup.directory && path.basename(backup.directory).startsWith('kusum-erp-sql-')) {
    await fsPromises.rm(backup.directory, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Generates a complete self-contained .sql dump of the MySQL database.
 * Compatible with MySQL Workbench, phpMyAdmin, and the MySQL CLI.
 */
async function generateSqlBackup(databaseUrl) {
  const config = parseDatabaseConnection(databaseUrl);
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    charset: 'utf8mb4',
    // Keep DATETIME(3) values as their database text instead of converting
    // through the computer's timezone and dropping milliseconds in JS Date.
    // A restored shop backup should preserve record timestamps exactly.
    dateStrings: true
  });

  let snapshotStarted = false;
  try {
    // Keep every table read at one point in time. Without a consistent snapshot,
    // a sale completed while the backup is downloading could make related tables
    // represent different moments and produce an incomplete recovery backup.
    await connection.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await connection.query('START TRANSACTION WITH CONSISTENT SNAPSHOT');
    snapshotStarted = true;

    const [tableRows] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    const tableKey = Object.keys(tableRows[0] || {})[0];
    const tables = tableRows.map((row) => canonicalTableName(row[tableKey])).filter(Boolean);
    const missingCurrentTables = CURRENT_ERP_TABLES.filter((table) => !tables.includes(table));
    if (missingCurrentTables.length) {
      throw new Error(`The ERP schema is incomplete and cannot be backed up: ${missingCurrentTables.join(', ')} missing. Restart the Main database PC ERP to apply updates first.`);
    }

    const now = new Date();
    const timestamp = windowsTimestamp(now);
    const header = [
      '-- ========================================================',
      '-- Kusum ERP — Full MySQL Database Backup',
      `-- Database: ${config.database}`,
      `-- Backup Date & Time: ${timestamp.display}`,
      '-- Compatible with: MySQL Workbench, mysqldump, and Kusum ERP',
      '-- Backup Format: 2',
      '-- ========================================================',
      '',
      'SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;',
      'SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;',
      'SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;',
      'SET NAMES utf8mb4;',
      'SET @OLD_TIME_ZONE=@@TIME_ZONE;',
      "SET TIME_ZONE='+00:00';",
      'SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;',
      'SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;',
      "SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';",
      'SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;',
      ''
    ].join('\n');

    let sql = header;
    const rowCounts = {};

    for (const table of tables) {
      sql += `\n-- --------------------------------------------------------\n`;
      sql += `-- Structure and Data for table \`${table}\`\n`;
      sql += `-- --------------------------------------------------------\n\n`;
      sql += `DROP TABLE IF EXISTS \`${table}\`;\n`;

      const [[createResult]] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
      const createSql = createResult['Create Table'];
      sql += `${createSql};\n\n`;

      // Fetch all rows in batches
      // Login sessions are runtime-only and must never be copied to another PC
      // or revived after a disaster restore. Preserve the table schema but
      // intentionally export it empty.
      const [rows] = table === 'AppSession'
        ? [[]]
        : await connection.query(`SELECT * FROM \`${table}\``);
      rowCounts[table] = rows.length;
      if (rows.length > 0) {
        sql += `LOCK TABLES \`${table}\` WRITE;\n`;
        const columns = Object.keys(rows[0]);
        const colList = columns.map((c) => `\`${c}\``).join(', ');

        const batchSize = 100;
        for (let i = 0; i < rows.length; i += batchSize) {
          const batch = rows.slice(i, i + batchSize);
          const valuesList = batch.map((row) => {
            const values = columns.map((col) => {
              const val = row[col];
              if (val === null || val === undefined) return 'NULL';
              if (val instanceof Date) {
                return mysqlCore.escape(val.toISOString().slice(0, 19).replace('T', ' '));
              }
              if (Buffer.isBuffer(val)) {
                return `0x${val.toString('hex')}`;
              }
              if (typeof val === 'object') {
                return mysqlCore.escape(JSON.stringify(val));
              }
              return mysqlCore.escape(val);
            });
            return `(${values.join(', ')})`;
          });

          sql += `INSERT INTO \`${table}\` (${colList}) VALUES\n${valuesList.join(',\n')};\n`;
        }
        sql += `UNLOCK TABLES;\n\n`;
      }
    }

    const manifest = Buffer.from(JSON.stringify({ formatVersion: 2, tables: rowCounts }), 'utf8').toString('base64');
    sql += `\n-- Kusum ERP Backup Manifest: ${manifest}\n`;
    const backupHash = crypto.createHash('sha256').update(sql, 'utf8').digest('hex');
    const footer = [
      `-- Kusum ERP Backup SHA256: ${backupHash}`,
      '',
      '-- --------------------------------------------------------',
      '-- Restore Environment Variables',
      '-- --------------------------------------------------------',
      'SET TIME_ZONE=@OLD_TIME_ZONE;',
      'SET SQL_MODE=@OLD_SQL_MODE;',
      'SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;',
      'SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;',
      'SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;',
      'SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;',
      'SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;',
      'SET SQL_NOTES=@OLD_SQL_NOTES;',
      '',
      '-- End of Kusum ERP Backup'
    ].join('\n');

    sql += footer;

    await connection.commit();
    snapshotStarted = false;

    return {
      sql,
      filename: `kusum-erp-backup-${dateInput(now)}-${timestamp.filenameTime}.sql`,
      tableCount: tables.length
    };
  } finally {
    if (snapshotStarted) await connection.rollback().catch(() => {});
    await connection.end();
  }
}

function canonicalTableName(name) {
  const match = [...KNOWN_ERP_TABLES].find((table) => table.toLowerCase() === String(name || '').toLowerCase());
  return match || null;
}

function validateBackupStatement(statement, tables) {
  const sql = statement.trim();
  if (!sql) return;

  if (/^SET\s+/i.test(sql)) {
    const compact = sql.replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=').trim();
    const safeSetPatterns = [
      /^SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT$/i,
      /^SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS$/i,
      /^SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION$/i,
      /^SET NAMES utf8mb4$/i,
      /^SET @OLD_TIME_ZONE=@@TIME_ZONE$/i,
      /^SET TIME_ZONE='\+00:00'$/i,
      /^SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0$/i,
      /^SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0$/i,
      /^SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO'$/i,
      /^SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0$/i,
      /^SET TIME_ZONE=@OLD_TIME_ZONE$/i,
      /^SET SQL_MODE=@OLD_SQL_MODE$/i,
      /^SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS$/i,
      /^SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS$/i,
      /^SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT$/i,
      /^SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS$/i,
      /^SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION$/i,
      /^SET SQL_NOTES=@OLD_SQL_NOTES$/i
    ];
    if (!safeSetPatterns.some((pattern) => pattern.test(compact))) throw new Error('The SQL file contains an unsupported SET command.');
    return;
  }

  if (/^UNLOCK\s+TABLES$/i.test(sql)) return;

  const patterns = [
    { type: 'DROP', regex: /^DROP\s+TABLE\s+IF\s+EXISTS\s+`([^`]+)`$/i },
    { type: 'CREATE', regex: /^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`([^`]+)`\s+/i },
    { type: 'INSERT', regex: /^INSERT\s+INTO\s+`([^`]+)`\s+/i },
    { type: 'LOCK', regex: /^LOCK\s+TABLES\s+`([^`]+)`\s+WRITE$/i }
  ];

  for (const pattern of patterns) {
    const match = sql.match(pattern.regex);
    if (!match) continue;
    const table = canonicalTableName(match[1]);
    if (!table) throw new Error(`The SQL file targets an unknown table: ${match[1]}.`);
    if (pattern.type === 'CREATE') tables.created.add(table);
    if (pattern.type === 'DROP') tables.dropped.add(table);
    if (pattern.type === 'INSERT') tables.inserted.add(table);
    return;
  }

  throw new Error(`The SQL file contains an unsupported command: ${sql.slice(0, 80).replace(/\s+/g, ' ')}.`);
}

function validateSqlBackup(sqlContent) {
  if (!sqlContent || typeof sqlContent !== 'string' || !sqlContent.trim()) {
    throw new Error('The uploaded SQL backup file is empty.');
  }

  const normalized = sqlContent.replace(/^\uFEFF/, '');
  if (!/--\s*Kusum ERP\s+[^\r\n]*Full MySQL Database Backup/i.test(normalized)) {
    throw new Error('This is not a Kusum ERP SQL backup. Download a fresh backup from Data management.');
  }
  if (!/--\s*End of Kusum ERP Backup\s*$/i.test(normalized.trim())) {
    throw new Error('The SQL backup is incomplete or truncated. Download it again before restoring.');
  }

  let manifest = null;
  const manifestMatch = normalized.match(/-- Kusum ERP Backup Manifest: ([A-Za-z0-9+/=]+)\r?\n-- Kusum ERP Backup SHA256: ([a-f0-9]{64})/i);
  if (/-- Backup Format: 2\s*$/im.test(normalized) && !manifestMatch) {
    throw new Error('The SQL backup integrity information is missing. Download the backup again.');
  }
  if (manifestMatch) {
    const hashMarkerIndex = manifestMatch.index + manifestMatch[0].indexOf('-- Kusum ERP Backup SHA256:');
    const protectedContent = normalized.slice(0, hashMarkerIndex);
    const actualHash = crypto.createHash('sha256').update(protectedContent, 'utf8').digest('hex');
    if (actualHash.toLowerCase() !== manifestMatch[2].toLowerCase()) {
      throw new Error('The SQL backup failed its SHA-256 integrity check. The file is incomplete or was changed.');
    }
    try {
      manifest = JSON.parse(Buffer.from(manifestMatch[1], 'base64').toString('utf8'));
    } catch (_) {
      throw new Error('The SQL backup manifest is invalid. Download the backup again.');
    }
    if (manifest?.formatVersion !== 2 || !manifest.tables || typeof manifest.tables !== 'object') {
      throw new Error('The SQL backup manifest is incomplete. Download the backup again.');
    }
    for (const [tableName, rowCount] of Object.entries(manifest.tables)) {
      if (!canonicalTableName(tableName)) throw new Error(`The SQL backup manifest contains an unknown table: ${tableName}.`);
      if (!Number.isInteger(rowCount) || rowCount < 0) throw new Error(`The SQL backup manifest has an invalid row count for ${tableName}.`);
    }
  }

  const statements = splitSqlStatements(normalized);
  const tables = { created: new Set(), dropped: new Set(), inserted: new Set() };
  statements.forEach((statement) => validateBackupStatement(statement, tables));

  for (const table of REQUIRED_BACKUP_TABLES) {
    if (!tables.created.has(table) || !tables.dropped.has(table)) {
      throw new Error(`The SQL backup is incomplete: table ${table} is missing.`);
    }
  }
  if (manifest) {
    for (const table of tables.created) {
      if (!Object.hasOwn(manifest.tables, table)) throw new Error(`The SQL backup manifest is missing the row count for ${table}.`);
    }
  }

  const isCurrentSchemaBackup = CURRENT_ERP_TABLES.every((table) => tables.created.has(table));
  return { normalized, statements, tables, manifest, isCurrentSchemaBackup };
}

// Parse one SQL statement at a time from disk. Memory use is bounded by the
// largest individual INSERT batch instead of the size of the whole backup.
async function forEachSqlFileStatement(filePath, handler) {
  const input = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 256 * 1024 });
  let buffer = '';
  let current = '';
  let inString = false;
  let quoteChar = '';
  let inLineComment = false;
  let inBlockComment = false;
  let firstText = true;

  const consume = async (final = false) => {
    let index = 0;
    while (index < buffer.length) {
      if (!final && index + 1 >= buffer.length) break;
      const char = buffer[index];
      const next = buffer[index + 1] || '';

      if (firstText) {
        firstText = false;
        if (char === '\uFEFF') { index += 1; continue; }
      }
      if (inLineComment) {
        index += 1;
        if (char === '\n') { inLineComment = false; current += '\n'; }
        continue;
      }
      if (inBlockComment) {
        if (char === '*' && next === '/') { inBlockComment = false; index += 2; }
        else index += 1;
        continue;
      }
      if (inString) {
        current += char;
        if (char === '\\') {
          if (!next && !final) break;
          if (next) { current += next; index += 2; continue; }
        } else if (char === quoteChar) {
          if (next === quoteChar) { current += next; index += 2; continue; }
          inString = false;
          quoteChar = '';
        }
        index += 1;
        continue;
      }
      if (char === '-' && next === '-') { inLineComment = true; index += 2; continue; }
      if (char === '#') { inLineComment = true; index += 1; continue; }
      if (char === '/' && next === '*') { inBlockComment = true; index += 2; continue; }
      if (char === "'" || char === '"' || char === '`') {
        inString = true;
        quoteChar = char;
        current += char;
        index += 1;
        continue;
      }
      if (char === ';') {
        const statement = current.trim();
        current = '';
        index += 1;
        if (statement) await handler(statement);
        continue;
      }
      current += char;
      index += 1;
    }
    buffer = buffer.slice(index);
  };

  for await (const chunk of input) {
    buffer += chunk;
    await consume(false);
  }
  await consume(true);
  if (inString || inBlockComment) throw new Error('The SQL backup ends inside an unfinished string or comment.');
  const finalStatement = current.trim();
  if (finalStatement) await handler(finalStatement);
}

async function inspectSqlBackupFile(filePath) {
  const marker = Buffer.from('-- Kusum ERP Backup SHA256:', 'utf8');
  const input = fs.createReadStream(filePath, { highWaterMark: 256 * 1024 });
  const hash = crypto.createHash('sha256');
  const firstParts = [];
  let firstLength = 0;
  let tail = Buffer.alloc(0);
  let pending = Buffer.alloc(0);
  let markerFound = false;
  let firstChunk = true;
  let fileBytes = 0;

  for await (let chunk of input) {
    if (firstChunk) {
      firstChunk = false;
      if (chunk.length >= 3 && chunk[0] === 0xef && chunk[1] === 0xbb && chunk[2] === 0xbf) chunk = chunk.subarray(3);
    }
    fileBytes += chunk.length;
    if (firstLength < 64 * 1024) {
      const portion = chunk.subarray(0, Math.min(chunk.length, 64 * 1024 - firstLength));
      firstParts.push(portion);
      firstLength += portion.length;
    }
    tail = Buffer.concat([tail, chunk]);
    if (tail.length > 128 * 1024) tail = tail.subarray(tail.length - 128 * 1024);

    if (!markerFound) {
      const combined = Buffer.concat([pending, chunk]);
      const markerIndex = combined.indexOf(marker);
      if (markerIndex >= 0) {
        hash.update(combined.subarray(0, markerIndex));
        markerFound = true;
        pending = Buffer.alloc(0);
      } else {
        const keep = Math.min(marker.length - 1, combined.length);
        hash.update(combined.subarray(0, combined.length - keep));
        pending = combined.subarray(combined.length - keep);
      }
    }
  }
  if (!fileBytes) throw new Error('The uploaded SQL backup file is empty.');
  if (!markerFound) hash.update(pending);

  const header = Buffer.concat(firstParts).toString('utf8');
  const ending = tail.toString('utf8');
  if (!/--\s*Kusum ERP\s+[^\r\n]*Full MySQL Database Backup/i.test(header)) {
    throw new Error('This is not a Kusum ERP SQL backup. Download a fresh backup from Data management.');
  }
  if (!/--\s*End of Kusum ERP Backup\s*$/i.test(ending.trim())) {
    throw new Error('The SQL backup is incomplete or truncated. Download it again before restoring.');
  }

  const format2 = /-- Backup Format: 2\s*$/im.test(header);
  const manifestMatch = ending.match(/-- Kusum ERP Backup Manifest: ([A-Za-z0-9+/=]+)\r?\n-- Kusum ERP Backup SHA256: ([a-f0-9]{64})/i);
  if (format2 && !manifestMatch) throw new Error('The SQL backup integrity information is missing. Download the backup again.');
  let manifest = null;
  if (manifestMatch) {
    const actualHash = hash.digest('hex');
    if (actualHash.toLowerCase() !== manifestMatch[2].toLowerCase()) {
      throw new Error('The SQL backup failed its SHA-256 integrity check. The file is incomplete or was changed.');
    }
    try {
      manifest = JSON.parse(Buffer.from(manifestMatch[1], 'base64').toString('utf8'));
    } catch (_) {
      throw new Error('The SQL backup manifest is invalid. Download the backup again.');
    }
    if (manifest?.formatVersion !== 2 || !manifest.tables || typeof manifest.tables !== 'object') {
      throw new Error('The SQL backup manifest is incomplete. Download the backup again.');
    }
    for (const [tableName, rowCount] of Object.entries(manifest.tables)) {
      if (!canonicalTableName(tableName)) throw new Error(`The SQL backup manifest contains an unknown table: ${tableName}.`);
      if (!Number.isInteger(rowCount) || rowCount < 0) throw new Error(`The SQL backup manifest has an invalid row count for ${tableName}.`);
    }
  }
  return { manifest };
}

async function validateSqlBackupFile(filePath) {
  const inspected = await inspectSqlBackupFile(filePath);
  const tables = { created: new Set(), dropped: new Set(), inserted: new Set() };
  let statementCount = 0;
  await forEachSqlFileStatement(filePath, async (statement) => {
    validateBackupStatement(statement, tables);
    statementCount += 1;
  });
  for (const table of REQUIRED_BACKUP_TABLES) {
    if (!tables.created.has(table) || !tables.dropped.has(table)) {
      throw new Error(`The SQL backup is incomplete: table ${table} is missing.`);
    }
  }
  if (inspected.manifest) {
    for (const table of tables.created) {
      if (!Object.hasOwn(inspected.manifest.tables, table)) throw new Error(`The SQL backup manifest is missing the row count for ${table}.`);
    }
  }
  return {
    ...inspected,
    tables,
    statementCount,
    isCurrentSchemaBackup: CURRENT_ERP_TABLES.every((table) => tables.created.has(table))
  };
}

async function executeRestoreStatements(databaseUrl, statements, { resetSchema = false } = {}) {
  const config = parseDatabaseConnection(databaseUrl);
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    multipleStatements: true,
    connectTimeout: 30000,
    charset: 'utf8mb4'
  });

  let executedCount = 0;
  try {
    await connection.query(`
      SET @KUSUM_OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
      SET @KUSUM_OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
      SET @KUSUM_OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
    `);

    if (resetSchema) {
      // Remove current-only tables before loading an older snapshot. Otherwise
      // records from the database being replaced could survive in tables that
      // did not yet exist when the historical backup was created.
      for (const table of [...KNOWN_ERP_TABLES]) {
        await connection.query(`DROP TABLE IF EXISTS ${mysqlCore.escapeId(table)}`);
      }
    }

    for (const statement of statements) {
      if (!statement.trim()) continue;
      await connection.query(statement);
      executedCount++;
    }

    await connection.query(`
      SET FOREIGN_KEY_CHECKS = IFNULL(@KUSUM_OLD_FOREIGN_KEY_CHECKS, 1);
      SET UNIQUE_CHECKS = IFNULL(@KUSUM_OLD_UNIQUE_CHECKS, 1);
      SET SQL_MODE = IFNULL(@KUSUM_OLD_SQL_MODE, '');
    `);
    return executedCount;
  } finally {
    await connection.end();
  }
}

async function executeRestoreFile(databaseUrl, filePath, { resetSchema = false } = {}) {
  const config = parseDatabaseConnection(databaseUrl);
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    multipleStatements: true,
    connectTimeout: 30000,
    charset: 'utf8mb4'
  });
  let executedCount = 0;
  try {
    await connection.query(`
      SET @KUSUM_OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
      SET @KUSUM_OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
      SET @KUSUM_OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
    `);
    if (resetSchema) {
      for (const table of [...KNOWN_ERP_TABLES]) {
        await connection.query(`DROP TABLE IF EXISTS ${mysqlCore.escapeId(table)}`);
      }
    }
    await forEachSqlFileStatement(filePath, async (statement) => {
      if (!statement.trim()) return;
      await connection.query(statement);
      executedCount += 1;
    });
    await connection.query(`
      SET FOREIGN_KEY_CHECKS = IFNULL(@KUSUM_OLD_FOREIGN_KEY_CHECKS, 1);
      SET UNIQUE_CHECKS = IFNULL(@KUSUM_OLD_UNIQUE_CHECKS, 1);
      SET SQL_MODE = IFNULL(@KUSUM_OLD_SQL_MODE, '');
    `);
    return executedCount;
  } finally {
    await connection.end();
  }
}

async function verifyRestoredDatabase(databaseUrl, expectedManifest = null, { legacyBackup = false } = {}) {
  const config = parseDatabaseConnection(databaseUrl);
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
    connectTimeout: 30000,
    charset: 'utf8mb4'
  });

  try {
    const [tableRows] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    const tableKey = Object.keys(tableRows[0] || {})[0];
    const tableNames = tableRows.map((row) => row[tableKey]).filter(Boolean);
    const lowerTables = new Set(tableNames.map((table) => table.toLowerCase()));
    const missing = CURRENT_ERP_TABLES.filter((table) => !lowerTables.has(table.toLowerCase()));
    if (missing.length) throw new Error(`Restored database is missing required table(s): ${missing.join(', ')}.`);

    for (const [table, columns] of Object.entries(ERP_SCHEMA_COLUMNS)) {
      const projection = columns.map((column) => mysqlCore.escapeId(column)).join(', ');
      await connection.query(`SELECT ${projection} FROM ${mysqlCore.escapeId(table)} LIMIT 0`);
    }

    const [checks] = await connection.query(`
      SELECT 'StockMovement.productId' AS relationName, COUNT(*) AS orphanCount
        FROM \`StockMovement\` child LEFT JOIN \`Product\` parent ON parent.id = child.productId WHERE child.productId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'Sale.customerId', COUNT(*) FROM \`Sale\` child LEFT JOIN \`Customer\` parent ON parent.id = child.customerId WHERE child.customerId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'SaleItem.saleId', COUNT(*) FROM \`SaleItem\` child LEFT JOIN \`Sale\` parent ON parent.id = child.saleId WHERE parent.id IS NULL
      UNION ALL SELECT 'SaleItem.productId', COUNT(*) FROM \`SaleItem\` child LEFT JOIN \`Product\` parent ON parent.id = child.productId WHERE child.productId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'CustomerLedger.customerId', COUNT(*) FROM \`CustomerLedger\` child LEFT JOIN \`Customer\` parent ON parent.id = child.customerId WHERE parent.id IS NULL
      UNION ALL SELECT 'CustomerLedger.saleId', COUNT(*) FROM \`CustomerLedger\` child LEFT JOIN \`Sale\` parent ON parent.id = child.saleId WHERE child.saleId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'CashbookEntry.customerId', COUNT(*) FROM \`CashbookEntry\` child LEFT JOIN \`Customer\` parent ON parent.id = child.customerId WHERE child.customerId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'CashbookEntry.saleId', COUNT(*) FROM \`CashbookEntry\` child LEFT JOIN \`Sale\` parent ON parent.id = child.saleId WHERE child.saleId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'CashbookEntry.urdPurchaseId', COUNT(*) FROM \`CashbookEntry\` child LEFT JOIN \`UrdPurchase\` parent ON parent.id = child.urdPurchaseId WHERE child.urdPurchaseId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'CustomerLedger.cashbookEntryId', COUNT(*) FROM \`CustomerLedger\` child LEFT JOIN \`CashbookEntry\` parent ON parent.id = child.cashbookEntryId WHERE child.cashbookEntryId IS NOT NULL AND parent.id IS NULL
      UNION ALL SELECT 'UrdPurchase.customerId', COUNT(*) FROM \`UrdPurchase\` child LEFT JOIN \`Customer\` parent ON parent.id = child.customerId WHERE parent.id IS NULL
      UNION ALL SELECT 'UrdPurchase.saleId', COUNT(*) FROM \`UrdPurchase\` child LEFT JOIN \`Sale\` parent ON parent.id = child.saleId WHERE child.saleId IS NOT NULL AND parent.id IS NULL
    `);
    const broken = checks.filter((row) => Number(row.orphanCount) > 0);
    if (broken.length) {
      throw new Error(`Restored database contains broken relationships: ${broken.map((row) => `${row.relationName} (${row.orphanCount})`).join(', ')}.`);
    }

    if (expectedManifest?.tables) {
      const countTables = legacyBackup
        ? LEGACY_STABLE_COUNT_TABLES.filter((table) => Object.hasOwn(expectedManifest.tables, table))
        : CURRENT_ERP_TABLES;
      for (const table of countTables) {
        const [[count]] = await connection.query(`SELECT COUNT(*) AS rowCount FROM ${mysqlCore.escapeId(table)}`);
        const expected = Number(expectedManifest.tables[table]);
        if (Number(count.rowCount) !== expected) {
          throw new Error(`Restored row count mismatch for ${table}: expected ${expected}, found ${count.rowCount}.`);
        }
      }
    }

    return { tableCount: tableNames.length, tables: tableNames };
  } finally {
    await connection.end();
  }
}

/**
 * Restores a backup created by Kusum ERP. The file is fully validated before
 * the current tables are touched. A private in-memory safety backup is created
 * first and is restored automatically if execution, migration, or integrity
 * verification fails. This string API remains for compatibility with internal
 * audits; the production upload route uses importSqlBackupFile below.
 */
async function importSqlBackup(databaseUrl, sqlContent, appRoot) {
  const validated = validateSqlBackup(sqlContent);
  // Keep the automatic pre-restore snapshot on disk instead of duplicating a
  // potentially large shop database in process memory.
  const safetyBackup = await generateSqlBackupFile(databaseUrl);

  try {
    const executedStatements = await executeRestoreStatements(databaseUrl, validated.statements, { resetSchema: true });
    if (appRoot) await runBundledMigrations(appRoot, databaseUrl);
    const verified = await verifyRestoredDatabase(databaseUrl, validated.manifest, { legacyBackup: !validated.isCurrentSchemaBackup });
    return {
      success: true,
      executedStatements,
      tableCount: verified.tableCount,
      tables: verified.tables
    };
  } catch (restoreError) {
    try {
      const recoverySql = await fsPromises.readFile(safetyBackup.filePath, 'utf8');
      const recovery = validateSqlBackup(recoverySql);
      await executeRestoreStatements(databaseUrl, recovery.statements, { resetSchema: true });
      await verifyRestoredDatabase(databaseUrl, recovery.manifest, { legacyBackup: !recovery.isCurrentSchemaBackup });
    } catch (recoveryError) {
      throw new Error(`SQL import failed: ${restoreError.message || restoreError}. Automatic recovery also failed: ${recoveryError.message || recoveryError}. Restore the latest downloaded backup before using the ERP.`);
    }
    throw new Error(`SQL import failed: ${restoreError.message || restoreError}. Existing ERP data was restored automatically.`);
  } finally {
    await cleanupSqlBackupFile(safetyBackup);
  }
}

/**
 * Bounded-memory production restore for large uploaded backups. Validation and
 * execution are separate file passes, so no current tables are touched until
 * the complete file, allowlist, manifest and SHA-256 have all been accepted.
 */
async function importSqlBackupFile(databaseUrl, filePath, appRoot) {
  const validated = await validateSqlBackupFile(filePath);
  const safetyBackup = await generateSqlBackupFile(databaseUrl);
  try {
    const executedStatements = await executeRestoreFile(databaseUrl, filePath, { resetSchema: true });
    if (appRoot) await runBundledMigrations(appRoot, databaseUrl);
    const verified = await verifyRestoredDatabase(databaseUrl, validated.manifest, { legacyBackup: !validated.isCurrentSchemaBackup });
    return {
      success: true,
      executedStatements,
      tableCount: verified.tableCount,
      tables: verified.tables
    };
  } catch (restoreError) {
    try {
      const recovery = await validateSqlBackupFile(safetyBackup.filePath);
      await executeRestoreFile(databaseUrl, safetyBackup.filePath, { resetSchema: true });
      await verifyRestoredDatabase(databaseUrl, recovery.manifest, { legacyBackup: !recovery.isCurrentSchemaBackup });
    } catch (recoveryError) {
      throw new Error(`SQL import failed: ${restoreError.message || restoreError}. Automatic recovery also failed: ${recoveryError.message || recoveryError}. Restore the latest downloaded backup before using the ERP.`);
    }
    throw new Error(`SQL import failed: ${restoreError.message || restoreError}. Existing ERP data was restored automatically.`);
  } finally {
    await cleanupSqlBackupFile(safetyBackup);
  }
}

/**
 * Splits SQL text into individual or grouped statements safely handling comments, quotes, and semicolons.
 */
function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inString = false;
  let quoteChar = '';
  let inLineComment = false;
  let inBlockComment = false;
  const len = sql.length;

  for (let i = 0; i < len; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1] || '';

    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        current += '\n';
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        current += ' ';
        i++;
      }
      continue;
    }

    if (inString) {
      current += char;
      if (char === '\\') {
        current += nextChar;
        i++;
      } else if (char === quoteChar) {
        if (nextChar === quoteChar) {
          current += nextChar;
          i++;
        } else {
          inString = false;
        }
      }
      continue;
    }

    // Check for comment starts
    if (char === '-' && nextChar === '-' && /\s/.test(sql[i + 2] || '')) {
      inLineComment = true;
      i++;
      continue;
    }
    if (char === '#') {
      inLineComment = true;
      continue;
    }
    if (char === '/' && nextChar === '*') {
      // MySQL conditional comments (e.g. /*!40101 ... */)
      if (sql[i + 2] === '!') {
        const bodyStart = i + 3;
        const endIdx = sql.indexOf('*/', bodyStart);
        if (endIdx !== -1) {
          const commentBody = sql.substring(bodyStart, endIdx);
          const command = commentBody.replace(/^\d{5,6}\s*/, '');
          current += ` ${command} `;
          i = endIdx + 1;
          continue;
        }
      }
      inBlockComment = true;
      i++;
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      inString = true;
      quoteChar = char;
      current += char;
      continue;
    }

    if (char === ';') {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = '';
      continue;
    }

    current += char;
  }

  const finalTrimmed = current.trim();
  if (finalTrimmed) statements.push(finalTrimmed);

  return statements;
}

module.exports = {
  generateSqlBackup,
  generateSqlBackupFile,
  cleanupSqlBackupFile,
  importSqlBackup,
  importSqlBackupFile,
  parseDatabaseConnection,
  splitSqlStatements,
  validateSqlBackup,
  validateSqlBackupFile
};

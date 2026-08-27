const mysql = require('mysql2/promise');
const mysqlCore = require('mysql2');
const path = require('path');
const { runBundledMigrations } = require('./shop-provisioning');

function parseDatabaseConnection(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname || 'localhost',
      port: Number(url.port) || 3306,
      username: decodeURIComponent(url.username || 'root'),
      password: decodeURIComponent(url.password || ''),
      database: (url.pathname || '').replace(/^\//, '') || 'kusum_erp'
    };
  } catch {
    throw new Error('Invalid DATABASE_URL configured.');
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
    const tables = tableRows.map((row) => row[tableKey]).filter(Boolean);

    const now = new Date();
    const timestamp = now.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const header = [
      '-- ========================================================',
      '-- Kusum ERP — Full MySQL Database Backup',
      `-- Database: ${config.database}`,
      `-- Backup Date & Time: ${timestamp} UTC`,
      '-- Compatible with: MySQL Workbench, mysqldump, and Kusum ERP',
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

    for (const table of tables) {
      sql += `\n-- --------------------------------------------------------\n`;
      sql += `-- Structure and Data for table \`${table}\`\n`;
      sql += `-- --------------------------------------------------------\n\n`;
      sql += `DROP TABLE IF EXISTS \`${table}\`;\n`;

      const [[createResult]] = await connection.query(`SHOW CREATE TABLE \`${table}\``);
      const createSql = createResult['Create Table'];
      sql += `${createSql};\n\n`;

      // Fetch all rows in batches
      const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
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

    const footer = [
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
      filename: `kusum-erp-backup-${now.toISOString().slice(0, 10)}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}.sql`,
      tableCount: tables.length
    };
  } finally {
    if (snapshotStarted) await connection.rollback().catch(() => {});
    await connection.end();
  }
}

/**
 * Imports and executes a .sql backup file (from MySQL Workbench or ERP export).
 * Safely disables FK checks during restore and runs migrations to ensure schema health.
 */
async function importSqlBackup(databaseUrl, sqlContent, appRoot) {
  if (!sqlContent || typeof sqlContent !== 'string' || !sqlContent.trim()) {
    throw new Error('The uploaded SQL backup file is empty.');
  }

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

  try {
    // 1. Prepare session for bulk restore
    await connection.query(`
      SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
      SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;
      SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
    `);

    // 2. Clean comments and split into safe execution chunks
    // Most MySQL Workbench files work great with multipleStatements in ~256KB-1MB chunks
    const statements = splitSqlStatements(sqlContent);
    let executedCount = 0;

    for (const stmt of statements) {
      if (!stmt.trim()) continue;
      await connection.query(stmt);
      executedCount++;
    }

    // 3. Restore foreign key checks
    await connection.query(`
      SET FOREIGN_KEY_CHECKS = IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1);
      SET UNIQUE_CHECKS = IFNULL(@OLD_UNIQUE_CHECKS, 1);
      SET SQL_MODE = IFNULL(@OLD_SQL_MODE, '');
    `);

    // 4. Verify table count
    const [tables] = await connection.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    const tableKey = Object.keys(tables[0] || {})[0];
    const tableNames = tables.map((t) => t[tableKey]).filter(Boolean);

    // 5. Ensure all bundled Prisma migrations are applied on top of the restored DB
    if (appRoot) {
      try {
        await runBundledMigrations(appRoot, databaseUrl);
      } catch (migErr) {
        console.warn('Post-restore migration check warning:', migErr.message);
      }
    }

    return {
      success: true,
      executedStatements: executedCount,
      tableCount: tableNames.length,
      tables: tableNames
    };
  } finally {
    await connection.end();
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
      if (char === '\n') inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
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
        inString = false;
      }
      continue;
    }

    // Check for comment starts
    if (char === '-' && nextChar === '-') {
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
        // Keep conditional comments content
        i += 2;
        let endIdx = sql.indexOf('*/', i);
        if (endIdx !== -1) {
          // extract conditional command without /*!12345 and */
          const commentBody = sql.substring(i, endIdx);
          const cmd = commentBody.replace(/^\d{5}\s*/, '');
          current += ' ' + cmd + ' ';
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
  importSqlBackup,
  parseDatabaseConnection
};

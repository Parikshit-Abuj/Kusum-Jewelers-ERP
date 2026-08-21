const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const mysqlCore = require('mysql2');

function input(value) {
  return String(value || '').trim();
}

function port(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) throw new Error('Enter a valid MySQL port.');
  return parsed;
}

function databaseName(value) {
  const name = input(value);
  if (!/^[A-Za-z0-9_]{1,64}$/.test(name)) throw new Error('Database name may use only letters, numbers and underscores.');
  return name;
}

function appLoginName(value) {
  const name = input(value);
  if (!/^[A-Za-z0-9_.-]{3,64}$/.test(name)) throw new Error('ERP login username must be 3 to 64 characters and use only letters, numbers, dots, dashes or underscores.');
  return name;
}

function requiredPassword(value) {
  const password = String(value || '');
  if (password.length < 8) throw new Error('ERP login password must be at least 8 characters.');
  return password;
}

function mysqlString(value) {
  return mysqlCore.escape(String(value));
}

function mysqlUrl({ host, port: mysqlPort, username, password, database }) {
  return `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${mysqlPort}/${database}`;
}

async function runBundledMigrations(appRoot, databaseUrl) {
  const migrationsPath = path.join(appRoot, 'prisma', 'migrations');
  if (!fs.existsSync(migrationsPath)) throw new Error('ERP installation files are incomplete. Re-run the installer.');

  const connection = await mysql.createConnection({ uri: databaseUrl, multipleStatements: true, connectTimeout: 12000 });
  try {
    // Keep Prisma's normal migration table so a future supported migration
    // deploy sees the exact same applied history. This avoids shipping the
    // large Prisma command-line tool in the shop installer.
    await connection.query(`CREATE TABLE IF NOT EXISTS \`_prisma_migrations\` (
      \`id\` VARCHAR(36) NOT NULL,
      \`checksum\` VARCHAR(64) NOT NULL,
      \`finished_at\` DATETIME(3) NULL,
      \`migration_name\` VARCHAR(255) NOT NULL,
      \`logs\` TEXT NULL,
      \`rolled_back_at\` DATETIME(3) NULL,
      \`started_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`applied_steps_count\` INTEGER UNSIGNED NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    const folders = fs.readdirSync(migrationsPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    for (const migrationName of folders) {
      const sqlPath = path.join(migrationsPath, migrationName, 'migration.sql');
      if (!fs.existsSync(sqlPath)) continue;
      const [applied] = await connection.query(
        'SELECT 1 FROM `_prisma_migrations` WHERE `migration_name` = ? AND `finished_at` IS NOT NULL LIMIT 1',
        [migrationName]
      );
      if (applied.length) continue;

      const sql = fs.readFileSync(sqlPath, 'utf8');
      const checksum = crypto.createHash('sha256').update(sql).digest('hex');
      const migrationId = crypto.randomUUID();
      await connection.query(
        'INSERT INTO `_prisma_migrations` (`id`, `checksum`, `migration_name`, `started_at`, `applied_steps_count`) VALUES (?, ?, ?, NOW(3), 0)',
        [migrationId, checksum, migrationName]
      );
      try {
        await connection.query(sql);
        await connection.query(
          'UPDATE `_prisma_migrations` SET `finished_at` = NOW(3), `applied_steps_count` = 1 WHERE `id` = ?',
          [migrationId]
        );
      } catch (error) {
        await connection.query('UPDATE `_prisma_migrations` SET `logs` = ? WHERE `id` = ?', [String(error.message || error).slice(0, 65535), migrationId]);
        throw error;
      }
    }
  } catch (error) {
    throw new Error(`Could not apply the ERP database schema: ${error.message || error}`);
  } finally {
    await connection.end();
  }
}

function writeEnvFile(configPath, values) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  const content = [
    '# Created by Kusum Jewelers ERP shop setup. The MySQL root password is never saved here.',
    ...Object.entries(values).map(([key, value]) => `${key}=${JSON.stringify(String(value))}`)
  ].join('\r\n') + '\r\n';
  const temporary = `${configPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content, { encoding: 'utf8', mode: 0o600 });
  fs.renameSync(temporary, configPath);
}

async function provisionShopDatabase({ appRoot, configPath, form }) {
  const host = input(form.mysqlHost || 'localhost');
  if (!['localhost', '127.0.0.1'].includes(host.toLowerCase())) throw new Error('For a safe shop install, MySQL must run on this shop PC. Use localhost or 127.0.0.1.');
  const mysqlPort = port(form.mysqlPort || 3306);
  const rootUser = input(form.mysqlUser || 'root');
  if (!rootUser) throw new Error('Enter the MySQL administrator username.');
  const rootPassword = String(form.mysqlPassword || '');
  const database = databaseName(form.databaseName || 'kusum_erp');
  const username = appLoginName(form.appUsername || 'kusum');
  const password = requiredPassword(form.appPassword);
  const printerName = input(form.printerName || 'TSC TTP-244 Pro');

  const appDbUser = `kusum_erp_${crypto.randomBytes(7).toString('hex')}`;
  const appDbPassword = crypto.randomBytes(30).toString('base64url');
  let rootConnection;
  try {
    rootConnection = await mysql.createConnection({ host, port: mysqlPort, user: rootUser, password: rootPassword, connectTimeout: 12000 });
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS ${mysqlCore.escapeId(database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    // MySQL may identify a connection to this PC as either localhost or
    // 127.0.0.1. Give the generated account access only through those two
    // local identities; it is never granted remote or server-wide access.
    for (const localHost of ['localhost', '127.0.0.1']) {
      await rootConnection.query(`CREATE USER IF NOT EXISTS ${mysqlString(appDbUser)}@${mysqlString(localHost)} IDENTIFIED BY ${mysqlString(appDbPassword)}`);
      await rootConnection.query(`ALTER USER ${mysqlString(appDbUser)}@${mysqlString(localHost)} IDENTIFIED BY ${mysqlString(appDbPassword)}`);
      await rootConnection.query(`GRANT ALL PRIVILEGES ON ${mysqlCore.escapeId(database)}.* TO ${mysqlString(appDbUser)}@${mysqlString(localHost)}`);
    }
    await rootConnection.query('FLUSH PRIVILEGES');
  } finally {
    if (rootConnection) await rootConnection.end();
  }

  const values = {
    DATABASE_URL: mysqlUrl({ host, port: mysqlPort, username: appDbUser, password: appDbPassword, database }),
    PORT: 3000,
    AUTH_USERNAME: username,
    AUTH_PASSWORD: password,
    SESSION_SECRET: crypto.randomBytes(48).toString('base64url'),
    TSC_PRINTER_NAME: printerName
  };
  await runBundledMigrations(appRoot, values.DATABASE_URL);
  writeEnvFile(configPath, values);
  return values;
}

module.exports = { provisionShopDatabase };

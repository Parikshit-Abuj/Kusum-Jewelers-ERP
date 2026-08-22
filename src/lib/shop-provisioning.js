const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const mysqlCore = require('mysql2');

function input(value) {
  return String(value || '').trim();
}

function port(value, label = 'MySQL') {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) throw new Error(`Enter a valid ${label} port (1 to 65535).`);
  return parsed;
}

function databaseName(value) {
  const name = input(value);
  if (!/^[A-Za-z0-9_]{1,64}$/.test(name)) throw new Error('Database name may use only letters, numbers and underscores.');
  return name;
}

function accountName(value, label) {
  const name = input(value);
  if (!/^[A-Za-z0-9_.-]{3,64}$/.test(name)) throw new Error(`${label} must be 3 to 64 characters and use only letters, numbers, dots, dashes or underscores.`);
  return name;
}

function requiredPassword(value, label) {
  const password = String(value || '');
  if (password.length < 8) throw new Error(`${label} must be at least 8 characters.`);
  return password;
}

function databasePassword(value) {
  const password = String(value || '');
  if (password.length < 12) throw new Error('Shared ERP database password must be at least 12 characters. It is used only by this ERP on the main and client PCs.');
  return password;
}

function mysqlHost(value) {
  const host = input(value);
  if (!host || host.length > 253 || !/^[A-Za-z0-9][A-Za-z0-9.-]*$/.test(host)) {
    throw new Error('Enter a valid MySQL server name or IPv4 address.');
  }
  return host;
}

function isLocalHost(host) {
  return ['localhost', '127.0.0.1'].includes(String(host || '').toLowerCase());
}

function mysqlString(value) {
  return mysqlCore.escape(String(value));
}

function mysqlUrl({ host, port: mysqlPort, username, password, database }) {
  return `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${mysqlPort}/${database}`;
}

function printerFormValues(form) {
  const printerMode = String(form.printerMode || 'WINDOWS').trim().toUpperCase() === 'TCP' ? 'TCP' : 'WINDOWS';
  const printerName = input(form.printerName || 'TSC TTP-244 Pro');
  if (printerMode === 'WINDOWS' && !printerName) throw new Error('Enter the installed Windows TSC printer name.');
  const printerHost = input(form.printerHost || '');
  const printerPort = port(form.printerPort || 9100, 'direct TCP printer');
  if (printerMode === 'TCP') mysqlHost(printerHost);
  return { printerMode, printerName, printerHost, printerPort };
}

function connectionValues({ host, mysqlPort, database, username, password, appUsername, appPassword, printerMode, printerName, printerHost, printerPort, mode }) {
  return {
    DATABASE_URL: mysqlUrl({ host, port: mysqlPort, username, password, database }),
    PORT: 3000,
    AUTH_USERNAME: appUsername,
    AUTH_PASSWORD: appPassword,
    SESSION_SECRET: crypto.randomBytes(48).toString('base64url'),
    TSC_PRINTER_MODE: printerMode,
    TSC_PRINTER_NAME: printerName,
    TSC_PRINTER_HOST: printerHost,
    TSC_PRINTER_PORT: printerPort,
    KUSUM_DEPLOYMENT_MODE: mode
  };
}

async function runBundledMigrations(appRoot, databaseUrl) {
  const migrationsPath = path.join(appRoot, 'prisma', 'migrations');
  if (!fs.existsSync(migrationsPath)) throw new Error('ERP installation files are incomplete. Re-run the installer.');

  const connection = await mysql.createConnection({ uri: databaseUrl, multipleStatements: true, connectTimeout: 12000 });
  try {
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
    '# Created by Kusum Jewelers ERP shop setup. The MySQL administrator password is never saved here.',
    ...Object.entries(values).map(([key, value]) => `${key}=${JSON.stringify(String(value))}`)
  ].join('\r\n') + '\r\n';
  const temporary = `${configPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content, { encoding: 'utf8', mode: 0o600 });
  fs.renameSync(temporary, configPath);
}

function commonFormValues(form) {
  return {
    host: mysqlHost(form.mysqlHost),
    mysqlPort: port(form.mysqlPort || 3306),
    database: databaseName(form.databaseName || 'kusum_erp'),
    databaseUser: accountName(form.databaseUser || 'kusum_erp_shared', 'Shared ERP database username'),
    databasePassword: databasePassword(form.databasePassword),
    appUsername: accountName(form.appUsername || 'kusum', 'ERP login username'),
    appPassword: requiredPassword(form.appPassword, 'ERP login password'),
    ...printerFormValues(form)
  };
}

async function grantDatabaseAccess(connection, { database, username, password, includeNetwork }) {
  const hosts = includeNetwork ? ['localhost', '127.0.0.1', '%'] : ['localhost', '127.0.0.1'];
  for (const accountHost of hosts) {
    await connection.query(`CREATE USER IF NOT EXISTS ${mysqlString(username)}@${mysqlString(accountHost)} IDENTIFIED BY ${mysqlString(password)}`);
    await connection.query(`ALTER USER ${mysqlString(username)}@${mysqlString(accountHost)} IDENTIFIED BY ${mysqlString(password)}`);
    // This account is limited to the ERP database. The main PC firewall keeps
    // the database port reachable only from the private shop network.
    await connection.query(`GRANT ALL PRIVILEGES ON ${mysqlCore.escapeId(database)}.* TO ${mysqlString(username)}@${mysqlString(accountHost)}`);
  }
  await connection.query('FLUSH PRIVILEGES');
}

async function verifyClientConnection(databaseUrl) {
  let connection;
  try {
    connection = await mysql.createConnection({ uri: databaseUrl, connectTimeout: 12000 });
    const [tables] = await connection.query(
      "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = '_prisma_migrations' LIMIT 1"
    );
    if (!tables.length) throw new Error('The selected database is not an initialized Kusum Jewelers ERP database. Complete Main database PC setup first.');
  } catch (error) {
    throw new Error(`Could not connect to the main ERP database: ${error.message || error}`);
  } finally {
    if (connection) await connection.end();
  }
}

function parseDatabaseConnection(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    if (url.protocol !== 'mysql:') throw new Error('Unsupported database URL.');
    return {
      host: url.hostname,
      port: port(url.port || 3306),
      database: databaseName(decodeURIComponent(url.pathname.replace(/^\//, '')))
    };
  } catch (error) {
    throw new Error(`Could not read the existing ERP database connection: ${error.message || error}`);
  }
}

async function provisionMainDatabase({ appRoot, configPath, form }) {
  const values = commonFormValues(form);
  if (!isLocalHost(values.host)) throw new Error('Main database PC setup must use localhost or 127.0.0.1. Client PCs will use this PC’s LAN address.');
  const rootUser = input(form.mysqlUser || 'root');
  if (!rootUser) throw new Error('Enter the MySQL administrator username.');
  const rootPassword = String(form.mysqlPassword || '');
  let rootConnection;
  try {
    rootConnection = await mysql.createConnection({ host: values.host, port: values.mysqlPort, user: rootUser, password: rootPassword, connectTimeout: 12000 });
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS ${mysqlCore.escapeId(values.database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await grantDatabaseAccess(rootConnection, {
      database: values.database,
      username: values.databaseUser,
      password: values.databasePassword,
      includeNetwork: true
    });
  } finally {
    if (rootConnection) await rootConnection.end();
  }

  const config = connectionValues({ ...values, username: values.databaseUser, password: values.databasePassword, mode: 'SERVER' });
  await runBundledMigrations(appRoot, config.DATABASE_URL);
  writeEnvFile(configPath, config);
  return config;
}

async function provisionClientDatabase({ configPath, form }) {
  const values = commonFormValues(form);
  const config = connectionValues({ ...values, username: values.databaseUser, password: values.databasePassword, mode: 'CLIENT' });
  await verifyClientConnection(config.DATABASE_URL);
  writeEnvFile(configPath, config);
  return config;
}

async function provisionShopDatabase({ appRoot, configPath, form }) {
  if (input(form.setupMode).toUpperCase() === 'CLIENT') return provisionClientDatabase({ configPath, form });
  return provisionMainDatabase({ appRoot, configPath, form });
}

async function enableNetworkSharing({ databaseUrl, form }) {
  const current = parseDatabaseConnection(databaseUrl);
  if (!isLocalHost(current.host)) throw new Error('This ERP is already configured as a client PC. Enable sharing only on the main database PC.');
  const rootUser = input(form.mysqlUser || 'root');
  if (!rootUser) throw new Error('Enter the MySQL administrator username.');
  const databaseUser = accountName(form.databaseUser || 'kusum_erp_shared', 'Shared ERP database username');
  const password = databasePassword(form.databasePassword);
  let rootConnection;
  try {
    rootConnection = await mysql.createConnection({ host: current.host, port: current.port, user: rootUser, password: String(form.mysqlPassword || ''), connectTimeout: 12000 });
    await grantDatabaseAccess(rootConnection, { database: current.database, username: databaseUser, password, includeNetwork: true });
  } catch (error) {
    throw new Error(`Could not enable client PC access: ${error.message || error}`);
  } finally {
    if (rootConnection) await rootConnection.end();
  }
  return { database: current.database, port: current.port, username: databaseUser };
}

function updatePrinterConfiguration({ configPath, currentEnv, form }) {
  if (!currentEnv.DATABASE_URL || !currentEnv.AUTH_USERNAME || !currentEnv.AUTH_PASSWORD) {
    throw new Error('Save a working ERP database connection before configuring the printer.');
  }
  const printer = printerFormValues(form);
  const config = {
    DATABASE_URL: currentEnv.DATABASE_URL,
    PORT: currentEnv.PORT || 3000,
    AUTH_USERNAME: currentEnv.AUTH_USERNAME,
    AUTH_PASSWORD: currentEnv.AUTH_PASSWORD,
    SESSION_SECRET: currentEnv.SESSION_SECRET || crypto.randomBytes(48).toString('base64url'),
    TSC_PRINTER_MODE: printer.printerMode,
    TSC_PRINTER_NAME: printer.printerName,
    TSC_PRINTER_HOST: printer.printerHost,
    TSC_PRINTER_PORT: printer.printerPort,
    KUSUM_DEPLOYMENT_MODE: currentEnv.KUSUM_DEPLOYMENT_MODE || 'SERVER'
  };
  writeEnvFile(configPath, config);
  return config;
}

module.exports = { provisionShopDatabase, enableNetworkSharing, updatePrinterConfiguration, parseDatabaseConnection, isLocalHost };

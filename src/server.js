const os = require('os');
const fs = require('fs');
const fsPromises = require('fs/promises');
const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const appRoot = path.join(__dirname, '..');
const shopDataDirectory = process.env.KUSUM_APP_DATA
  || path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'Kusum Jewelers ERP');
const configPath = process.env.KUSUM_CONFIG_PATH
  || (process.env.KUSUM_APP_DATA ? path.join(shopDataDirectory, '.env') : path.join(appRoot, '.env'));
dotenv.config({ path: configPath });
// Keep one unpredictable signing secret for the whole desktop process. Fresh
// setup persists this exact value so restarting the ERP does not invalidate all
// active sessions merely because setup occurred after the server booted.
process.env.SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(48).toString('base64url');
const { createPrisma } = require('./lib/prisma');
const { writeUrdPurchaseInvoice } = require('./lib/urd-invoice-pdf');
const { writeSaleInvoice } = require('./lib/sale-invoice-pdf');
const { buildTsplJob, checkTcpPrinter, sendTsplToPrinter } = require('./lib/tspl-labels');
const { resolveTscPrinter, cachedTscPrinterStatus } = require('./lib/windows-printers');
const { provisionShopDatabase, enableNetworkSharing, updatePrinterConfiguration, updateLoginConfiguration, parseDatabaseConnection, isLocalHost, runBundledMigrations, verifyClientConnection } = require('./lib/shop-provisioning');
const { buildExcelExport } = require('./lib/excel-export');
const { RESOURCE_LIST, resourceFor, parseDateRange, getExportPayload, archiveData } = require('./lib/data-lifecycle');
const { generateSqlBackupFile, cleanupSqlBackupFile, importSqlBackupFile } = require('./lib/sql-backup-restore');
const { paymentMethodFromComponents, reverseAndDeleteCashbookEntry, deleteSettledUrdPurchase } = require('./lib/accounting-reversal');
const { number, asArray, dateInput, startOfToday, dateTimeFromInput, localDateTimeRange, money, grams, nextDocumentNumber, nextBatchDocumentNumber, metalRateFromDailyRate, makingAmount } = require('./lib/helpers');
const { nextBarcode } = require('./lib/barcode-sequence');
const { upsertItemName } = require('./lib/item-names');
const { hasConfiguredPassword, passwordMatchesEnvironment, secureTextMatch, usesKnownDefaultPassword } = require('./lib/auth-security');
const { PrismaSessionStore } = require('./lib/mysql-session-store');
const multer = require('multer');

const sqlUploadDirectory = process.env.KUSUM_APP_DATA
  ? path.join(shopDataDirectory, 'sql-uploads')
  : path.join(os.tmpdir(), 'kusum-erp-sql-uploads');
fs.mkdirSync(sqlUploadDirectory, { recursive: true });
const sqlUpload = multer({
  limits: { fileSize: 512 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: sqlUploadDirectory,
    filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}.sql`)
  })
});

function receiveSqlUpload(req, res, next) {
  sqlUpload.single('sqlFile')(req, res, (error) => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'The SQL backup is larger than 512 MB. Restore it with MySQL tools on the Main database PC.'
      : (error.message || 'Could not read the uploaded SQL backup.');
    return redirectWith(res, '/data-management', 'error', message);
  });
}

let prisma = createPrisma();
let databaseHealth = { checkedAt: 0, error: null };
const app = express();
const port = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan('dev'));
app.use(session({
  name: 'kusum.erp.sid',
  secret: process.env.SESSION_SECRET,
  store: new PrismaSessionStore(() => prisma, () => !shopSetupRequired()),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 }
}));

app.locals.money = money;
app.locals.grams = grams;
app.locals.dateInput = dateInput;

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.money = money;
  res.locals.grams = grams;
  res.locals.dateInput = dateInput;
  res.locals.message = req.query.message || null;
  res.locals.error = req.query.error || null;
  res.locals.loggedInUser = req.session?.username || null;
  next();
});

// ── Real-Time Multi-PC Synchronization Hub (SSE) ─────────────
const sseClients = new Set();
let syncRevisionQueue = Promise.resolve();

async function bumpSharedSyncRevision(attempt = 1) {
  try {
    await prisma.$executeRaw`
      INSERT INTO \`SyncRevision\` (\`id\`, \`revision\`, \`updatedAt\`)
      VALUES (1, 1, CURRENT_TIMESTAMP(3))
      ON DUPLICATE KEY UPDATE
        \`revision\` = \`revision\` + 1,
        \`updatedAt\` = CURRENT_TIMESTAMP(3)
    `;
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 75));
      return bumpSharedSyncRevision(attempt + 1);
    }
    console.error('Could not update the shared ERP sync revision:', error.message || error);
  }
}

function broadcastSyncEvent(type, payload = {}) {
  const data = JSON.stringify({ type, payload, timestamp: Date.now() });
  const msg = `event: message\ndata: ${data}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch (_) {
      sseClients.delete(client);
    }
  }
  // Separate Electron installations have separate in-memory SSE hubs. Bump a
  // shared MySQL revision so every PC can notice this committed change too.
  if (!shopSetupRequired()) {
    syncRevisionQueue = syncRevisionQueue.then(() => bumpSharedSyncRevision(), () => bumpSharedSyncRevision());
  }
}

// 25-second keep-alive heartbeat
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': keep-alive\n\n');
    } catch (_) {
      sseClients.delete(client);
    }
  }
}, 25000);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/realtime-events', (req, res) => {
  if (!req.session?.authenticated) return res.status(401).end();
  if (req.socket) {
    req.socket.setKeepAlive(true);
    req.socket.setNoDelay(true);
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform, no-store',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  if (res.flushHeaders) res.flushHeaders();
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', activeClients: sseClients.size + 1 })}\n\n`);
  sseClients.add(res);

  const cleanup = () => {
    sseClients.delete(res);
    try { res.end(); } catch (_) {}
  };

  req.on('close', cleanup);
  req.on('end', cleanup);
  res.on('close', cleanup);
  res.on('finish', cleanup);
  res.on('error', cleanup);
});

function redirectWith(res, route, type, message) {
  const separator = route.includes('?') ? '&' : '?';
  res.redirect(`${route}${separator}${type}=${encodeURIComponent(message)}`);
}

function paginationFor(req, totalItems, requestedPage, pageSize) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(totalPages, Math.max(1, Math.floor(number(requestedPage, 1))));
  const pageUrl = (targetPage) => {
    const params = new URLSearchParams();
    Object.entries(req.query || {}).forEach(([key, value]) => {
      if (key === 'page' || value === undefined || value === null || value === '') return;
      params.set(key, String(Array.isArray(value) ? value[0] : value));
    });
    params.set('page', String(targetPage));
    return `${req.path}?${params.toString()}`;
  };
  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    fromItem: totalItems ? (page - 1) * pageSize + 1 : 0,
    toItem: Math.min(totalItems, page * pageSize),
    previousUrl: page > 1 ? pageUrl(page - 1) : null,
    nextUrl: page < totalPages ? pageUrl(page + 1) : null
  };
}

function isLoopbackRequest(req) {
  const address = String(req.socket?.remoteAddress || '').toLowerCase();
  return address === '::1' || address === '127.0.0.1' || address === '::ffff:127.0.0.1';
}

function requireLoopback(req, res, next) {
  if (isLoopbackRequest(req)) return next();
  return res.status(403).send('ERP setup and connection repair are available only on this PC.');
}

function databaseMutationLockName() {
  const connection = parseDatabaseConnection(process.env.DATABASE_URL);
  const identity = `${connection.host}:${connection.port}/${connection.database}`;
  return `kusum_erp_write_${crypto.createHash('sha256').update(identity).digest('hex').slice(0, 24)}`;
}

async function databaseMutationLock(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)
      || req.path === '/data/export'
      || req.path.startsWith('/labels/')
      || req.path === '/printer-setup') return next();

  let connection;
  try {
    const config = parseDatabaseConnection(process.env.DATABASE_URL);
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      connectTimeout: 12000
    });
    const [[lock]] = await connection.query('SELECT GET_LOCK(?, 15) AS acquired', [databaseMutationLockName()]);
    if (Number(lock?.acquired) !== 1) {
      throw new Error('Another ERP PC is saving or restoring data. Wait a moment and try again.');
    }
    let released = false;
    const release = async () => {
      if (released) return;
      released = true;
      try { await connection.query('DO RELEASE_LOCK(?)', [databaseMutationLockName()]); } catch (_) {}
      await connection.end().catch(() => {});
    };
    res.once('finish', release);
    res.once('close', release);
    return next();
  } catch (error) {
    if (connection) await connection.end().catch(() => {});
    if (req.is('json') || req.headers['content-type']?.includes('application/json')) {
      return res.status(409).json({ error: error.message || 'ERP is busy on another PC.' });
    }
    return redirectWith(res, req.get('referer') || '/', 'error', error.message || 'ERP is busy on another PC.');
  }
}

function labelRequests(body) {
  return [...new Set(asArray(body.productId).map(Number).filter((id) => Number.isInteger(id) && id > 0))]
    .map((id) => ({
      id,
      copies: 1
    }));
}

function saleRows(body) {
  const productIds = asArray(body.productId);
  const barcodes = asArray(body.barcode);
  const quantities = asArray(body.quantity);
  const weights = asArray(body.weight);
  const metalRates = asArray(body.metalRate);
  const makingTypes = asArray(body.makingChargeType);
  const makingValues = asArray(body.makingChargeValue);
  const taxableAmounts = asArray(body.taxableAmount);
  const hsnCodes = asArray(body.hsnCode);
  const huidCodes = asArray(body.huidCode);
  return productIds.map((productId, index) => ({
    productId: Number(productId),
    barcode: String(barcodes[index] || '').trim().toUpperCase(),
    quantity: Math.max(1, Math.floor(number(quantities[index], 1))),
    weight: weights[index] === undefined || weights[index] === '' ? null : number(weights[index]),
    metalRate: number(metalRates[index]),
    makingChargeType: ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(makingTypes[index]) ? makingTypes[index] : null,
    makingChargeValue: makingValues[index] === undefined || makingValues[index] === '' ? null : number(makingValues[index]),
    taxableAmount: taxableAmounts[index] === '' || taxableAmounts[index] === undefined ? null : Math.max(0, number(taxableAmounts[index])),
    hsnCode: (hsnCodes[index] || '').trim() || null,
    huidCode: (huidCodes[index] || '').trim() || null
  })).filter((item) => item.productId > 0);
}

async function getRateForDate(db, rateDate = dateInput()) {
  const exact = await db.dailyRate.findUnique({ where: { rateDate } });
  if (exact) return { rate: exact, sourceDate: rateDate, isFallback: false };
  const latest = await db.dailyRate.findFirst({ where: { rateDate: { lte: rateDate } }, orderBy: { rateDate: 'desc' } });
  return { rate: latest, sourceDate: latest?.rateDate || null, isFallback: Boolean(latest) };
}

function salePaymentBreakdown(body) {
  const selectedMethod = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED'].includes(body.paymentMethod)
    ? body.paymentMethod
    : 'CASH';
  if (selectedMethod !== 'MIXED') {
    // CREDIT is not a money movement. Ignore a stale or manipulated paid
    // value so the sale and cashbook can never disagree.
    const paid = selectedMethod === 'CREDIT' ? 0 : Math.max(0, roundedMoney(number(body.paid)));
    return {
      paid,
      cashPaid: selectedMethod === 'CASH' ? paid : 0,
      upiPaid: selectedMethod === 'UPI' ? paid : 0,
      cardPaid: selectedMethod === 'CARD' ? paid : 0,
      bankPaid: selectedMethod === 'BANK_TRANSFER' ? paid : 0,
      paymentMethod: paid > 0 ? selectedMethod : 'CREDIT',
      cashbookPayments: paid > 0 ? [{ method: selectedMethod, amount: paid }] : []
    };
  }
  const cashPaid = Math.max(0, roundedMoney(number(body.cashPaid)));
  const upiPaid = Math.max(0, roundedMoney(number(body.upiPaid)));
  const cardPaid = Math.max(0, roundedMoney(number(body.cardPaid)));
  const bankPaid = Math.max(0, roundedMoney(number(body.bankPaid)));
  const cashbookPayments = [];
  if (cashPaid > 0) {
    cashbookPayments.push({ method: 'CASH', amount: cashPaid });
  }
  if (upiPaid > 0) {
    cashbookPayments.push({ method: 'UPI', amount: upiPaid });
  }
  if (cardPaid > 0) {
    cashbookPayments.push({ method: 'CARD', amount: cardPaid });
  }
  if (bankPaid > 0) {
    cashbookPayments.push({ method: 'BANK_TRANSFER', amount: bankPaid });
  }
  const components = { CASH: cashPaid, UPI: upiPaid, CARD: cardPaid, BANK_TRANSFER: bankPaid };
  const paid = roundedMoney(cashPaid + upiPaid + cardPaid + bankPaid);
  return {
    paid,
    cashPaid,
    upiPaid,
    cardPaid,
    bankPaid,
    paymentMethod: paymentMethodFromComponents(components, paid),
    cashbookPayments
  };
}

function receiptMethodAmounts(paymentMethod, amount) {
  const paymentData = {};
  if (paymentMethod === 'CASH') paymentData.cashPaid = { increment: amount };
  if (paymentMethod === 'UPI') paymentData.upiPaid = { increment: amount };
  if (paymentMethod === 'CARD') paymentData.cardPaid = { increment: amount };
  if (paymentMethod === 'BANK_TRANSFER') paymentData.bankPaid = { increment: amount };
  return paymentData;
}

const RECEIPT_PAYMENT_METHODS = new Set(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER']);

function receiptPaymentMethod(value) {
  const method = String(value || 'CASH').toUpperCase();
  if (!RECEIPT_PAYMENT_METHODS.has(method)) {
    throw new Error('Choose Cash, UPI, Card or Bank Transfer as the payment method.');
  }
  return method;
}

function roundedMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function stockMovementSnapshot(product, type, quantity, note) {
  return {
    productId: product.id,
    productBarcode: product.barcode || null,
    productSku: product.sku || '',
    productName: product.name || '',
    productMetal: product.metal || null,
    productPurity: product.purity || null,
    netWeight: product.netWeight || 0,
    type,
    quantity,
    note
  };
}

async function lockCustomerForLedger(tx, customerId) {
  if (!Number.isInteger(customerId) || customerId <= 0) throw new Error('Select a valid customer.');
  // All ledger mutations for one customer take the same row lock. This keeps
  // receipts correct when two LAN clients submit at nearly the same time.
  const rows = await tx.$queryRaw`SELECT id FROM \`Customer\` WHERE id = ${customerId} FOR UPDATE`;
  if (!rows.length) throw new Error('The selected customer no longer exists.');
}

async function allocateCustomerPayment(tx, { customerId, amount, paymentMethod, reference, note, cashbookEntryId = null }) {
  await lockCustomerForLedger(tx, customerId);

  const ledgerTotal = await tx.customerLedger.aggregate({
    where: { customerId },
    _sum: { amount: true }
  });
  const outstanding = Math.max(0, roundedMoney(ledgerTotal._sum.amount || 0));
  if (outstanding <= 0) throw new Error('This customer has no outstanding credit or loan.');
  if (amount > outstanding) {
    throw new Error(`Payment is greater than the outstanding amount of ${money(outstanding)}.`);
  }

  const openSales = await tx.sale.findMany({
    where: { customerId, balance: { gt: 0 } },
    orderBy: [{ saleDate: 'asc' }, { id: 'asc' }]
  });
  let remaining = roundedMoney(amount);
  for (const sale of openSales) {
    if (remaining <= 0) break;
    const currentBalance = Number(sale.balance);
    const currentPaid = Number(sale.paid);
    const allocation = roundedMoney(Math.min(remaining, currentBalance));
    const nextPaymentMethod = currentPaid <= 0 || sale.paymentMethod === 'CREDIT'
      ? paymentMethod
      : sale.paymentMethod === paymentMethod ? sale.paymentMethod : 'MIXED';
    await tx.sale.update({
      where: { id: sale.id },
      data: {
        paid: roundedMoney(currentPaid + allocation),
        balance: Math.max(0, roundedMoney(currentBalance - allocation)),
        paymentMethod: nextPaymentMethod,
        ...receiptMethodAmounts(paymentMethod, allocation)
      }
    });
    await tx.customerLedger.create({
      data: {
        customerId,
        saleId: sale.id,
        type: 'PAYMENT_RECEIVED',
        amount: -allocation,
        paymentMethod,
        cashbookEntryId,
        reference,
        note: note || `Payment received against ${sale.invoiceNumber}`
      }
    });
    remaining = roundedMoney(remaining - allocation);
  }

  // Any amount left after invoices pays down a manual loan/adjustment. Without
  // this entry the cashbook would show money received while the ledger stayed due.
  if (remaining > 0) {
    await tx.customerLedger.create({
      data: {
        customerId,
        type: 'PAYMENT_RECEIVED',
        amount: -remaining,
        paymentMethod,
        cashbookEntryId,
        reference,
        note: note || 'Payment received against customer loan / adjustment'
      }
    });
  }

  return { outstanding, remainingAfterInvoices: remaining };
}

function normalizePhone(value) {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return digits;
}

function validCustomerPhone(phone) {
  return /^\d{10,15}$/.test(phone);
}

async function resolveBillingCustomer(tx, body) {
  const phone = normalizePhone(body.customerPhone);
  if (!validCustomerPhone(phone)) throw new Error('Enter a valid customer mobile number (10 to 15 digits) before billing.');
  const panNumber = String(body.customerPan || body.existingCustomerPan || '').trim().toUpperCase() || null;
  const existing = await tx.customer.findUnique({ where: { phone } });
  if (existing) {
    if (panNumber && existing.panNumber !== panNumber) {
      await tx.customer.update({ where: { id: existing.id }, data: { panNumber } });
      existing.panNumber = panNumber;
    }
    return existing;
  }
  const name = String(body.customerName || '').trim();
  if (!name) throw new Error('This mobile number is new. Enter the customer name to create their customer ledger.');
  return tx.customer.create({ data: {
    phone, name, email: String(body.customerEmail || '').trim() || null,
    address: String(body.customerAddress || '').trim() || null,
    panNumber
  } });
}

function shopSetupRequired() {
  return !process.env.DATABASE_URL || !process.env.AUTH_USERNAME || !hasConfiguredPassword(process.env);
}

async function reloadPrismaClient() {
  const previous = prisma;
  prisma = createPrisma();
  databaseHealth = { checkedAt: 0, error: null };
  await previous.$disconnect().catch(() => {});
}

async function databaseConnectionError(force = false) {
  if (shopSetupRequired()) return null;
  const now = Date.now();
  if (!force && now - databaseHealth.checkedAt < 5000) return databaseHealth.error;
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    databaseHealth = { checkedAt: now, error: null };
    return null;
  } catch (error) {
    databaseHealth = { checkedAt: now, error };
    return error;
  }
}

function setupDefaults() {
  const defaults = {
    setupMode: 'SERVER', mysqlHost: 'localhost', mysqlPort: '3306', databaseName: 'kusum_erp',
    databaseUser: 'kusum_erp_shared', appUsername: process.env.AUTH_USERNAME || 'kusum',
    printerMode: String(process.env.TSC_PRINTER_MODE || 'WINDOWS').toUpperCase() === 'TCP' ? 'TCP' : 'WINDOWS',
    printerName: process.env.TSC_PRINTER_NAME || 'TSC TTP-244 Pro',
    printerHost: process.env.TSC_PRINTER_HOST || '',
    printerPort: process.env.TSC_PRINTER_PORT || '9100'
  };
  if (!process.env.DATABASE_URL) return defaults;
  try {
    const connection = parseDatabaseConnection(process.env.DATABASE_URL);
    const url = new URL(process.env.DATABASE_URL);
    return {
      ...defaults,
      setupMode: process.env.KUSUM_DEPLOYMENT_MODE || (isLocalHost(connection.host) ? 'SERVER' : 'CLIENT'),
      mysqlHost: connection.host,
      mysqlPort: String(connection.port),
      databaseName: connection.database,
      databaseUser: decodeURIComponent(url.username) || defaults.databaseUser
    };
  } catch (_) {
    return defaults;
  }
}

function configuredLabelPrinter() {
  const mode = String(process.env.TSC_PRINTER_MODE || 'WINDOWS').trim().toUpperCase() === 'TCP' ? 'TCP' : 'WINDOWS';
  return {
    mode,
    name: String(process.env.TSC_PRINTER_NAME || 'TSC TTP-244 Pro').trim(),
    host: String(process.env.TSC_PRINTER_HOST || '').trim(),
    port: Number(process.env.TSC_PRINTER_PORT || 9100)
  };
}

async function resolveLabelPrinter(force = false) {
  const printer = configuredLabelPrinter();
  if (printer.mode === 'TCP') {
    if (!force) {
      return {
        available: false,
        name: `TCP ${printer.host || 'printer IP'}:${printer.port || 9100}`,
        message: 'Direct TCP printer status has not been checked yet. Inventory opens immediately; click Recheck printer before troubleshooting.',
        checked: false
      };
    }
    return checkTcpPrinter(printer.host, printer.port);
  }
  return force ? resolveTscPrinter(printer.name, true) : cachedTscPrinterStatus(printer.name);
}

function renderSetup(res, { repair = false, error = null } = {}) {
  return res.render('setup', {
    layout: false,
    title: repair ? 'Repair ERP connection' : 'Shop setup',
    repair,
    error,
    defaults: setupDefaults()
  });
}

function localNetworkAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((address) => address && address.family === 'IPv4' && !address.internal)
    .map((address) => address.address)
    .filter((address, index, all) => all.indexOf(address) === index);
}

app.get('/setup', requireLoopback, (req, res) => {
  if (!shopSetupRequired()) return res.redirect('/login');
  renderSetup(res, { error: req.query.error || null });
});

app.post('/setup', requireLoopback, async (req, res) => {
  if (!shopSetupRequired()) return res.redirect('/login');
  try {
    const values = await provisionShopDatabase({ appRoot, configPath, form: req.body });
    Object.assign(process.env, values);
    if (values.AUTH_PASSWORD_HASH) delete process.env.AUTH_PASSWORD;
    await reloadPrismaClient();
    res.redirect('/login?message=Shop setup is complete. Sign in to begin.');
  } catch (error) {
    redirectWith(res, '/setup', 'error', error.message || 'Could not set up the shop database.');
  }
});

app.get('/connection-repair', requireLoopback, (req, res) => {
  renderSetup(res, { repair: true, error: req.query.error || null });
});

app.post('/connection-repair', requireLoopback, async (req, res) => {
  try {
    const values = await provisionShopDatabase({ appRoot, configPath, form: req.body });
    Object.assign(process.env, values);
    if (values.AUTH_PASSWORD_HASH) delete process.env.AUTH_PASSWORD;
    await reloadPrismaClient();
    res.redirect('/login?message=ERP connection saved. Sign in to continue.');
  } catch (error) {
    redirectWith(res, '/connection-repair', 'error', error.message || 'Could not save the ERP connection.');
  }
});

app.get('/login', async (req, res) => {
  if (shopSetupRequired()) return res.redirect('/setup');
  if (await databaseConnectionError()) return redirectWith(res, '/connection-repair', 'error', 'The saved database connection is unavailable. Enter the current database details below.');
  if (req.session?.authenticated) return res.redirect('/');
  res.render('auth/login', { layout: false, title: 'Sign in', error: req.query.error || null, message: req.query.message || null });
});

app.post('/login', async (req, res) => {
  if (shopSetupRequired()) return res.redirect('/setup');
  if (await databaseConnectionError(true)) return redirectWith(res, '/connection-repair', 'error', 'The saved database connection is unavailable. Enter the current database details below.');
  const usernameOk = secureTextMatch(req.body.username, process.env.AUTH_USERNAME);
  const passwordOk = passwordMatchesEnvironment(req.body.password, process.env);
  if (!usernameOk || !passwordOk) return redirectWith(res, '/login', 'error', 'Incorrect username or password.');

  if (usesKnownDefaultPassword(process.env)) {
    return req.session.regenerate((error) => {
      if (error) return res.status(500).render('error', { title: 'Sign-in failed', detail: error.message });
      req.session.pendingPasswordChange = true;
      req.session.username = process.env.AUTH_USERNAME;
      res.redirect('/change-password?message=Choose your own ERP password before continuing.');
    });
  }

  // Transparently replace plaintext credentials from older releases after the
  // user has proved that password. No business data or database login changes.
  if (!process.env.AUTH_PASSWORD_HASH && process.env.NODE_ENV !== 'test') {
    try {
      const updated = updateLoginConfiguration({
        configPath,
        currentEnv: process.env,
        username: process.env.AUTH_USERNAME,
        password: req.body.password
      });
      Object.assign(process.env, updated);
      delete process.env.AUTH_PASSWORD;
    } catch (error) {
      return redirectWith(res, '/login', 'error', `Could not secure the saved ERP login: ${error.message}`);
    }
  }
  req.session.regenerate((error) => {
    if (error) return res.status(500).render('error', { title: 'Sign-in failed', detail: error.message });
    req.session.authenticated = true;
    req.session.username = process.env.AUTH_USERNAME;
    res.redirect('/');
  });
});

app.get('/change-password', (req, res) => {
  if (shopSetupRequired()) return res.redirect('/setup');
  if (!req.session?.authenticated && !req.session?.pendingPasswordChange) return res.redirect('/login');
  res.render('auth/change-password', {
    layout: false,
    title: 'Change ERP password',
    requireCurrentPassword: Boolean(req.session.authenticated),
    username: req.session.username || process.env.AUTH_USERNAME,
    error: req.query.error || null,
    message: req.query.message || null
  });
});

app.post('/change-password', async (req, res) => {
  if (shopSetupRequired()) return res.redirect('/setup');
  if (!req.session?.authenticated && !req.session?.pendingPasswordChange) return res.redirect('/login');
  try {
    if (req.session.authenticated && !passwordMatchesEnvironment(req.body.currentPassword, process.env)) {
      throw new Error('Current ERP password is incorrect.');
    }
    const newPassword = String(req.body.newPassword || '');
    const confirmation = String(req.body.confirmPassword || '');
    if (!newPassword) throw new Error('Choose a new ERP password.');
    if (newPassword !== confirmation) throw new Error('New password and confirmation do not match.');
    if (secureTextMatch(process.env.AUTH_USERNAME, 'kusum') && secureTextMatch(newPassword, 'kusum@123')) {
      throw new Error('Choose your own password instead of the old default password.');
    }
    const updated = updateLoginConfiguration({
      configPath,
      currentEnv: process.env,
      username: process.env.AUTH_USERNAME,
      password: newPassword
    });
    Object.assign(process.env, updated);
    delete process.env.AUTH_PASSWORD;
    req.session.regenerate((error) => {
      if (error) return res.status(500).render('error', { title: 'Password change failed', detail: error.message });
      req.session.authenticated = true;
      req.session.username = process.env.AUTH_USERNAME;
      res.redirect('/?message=ERP login password changed securely.');
    });
  } catch (error) {
    redirectWith(res, '/change-password', 'error', error.message || 'Could not change the ERP password.');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.use(async (req, res, next) => {
  if (shopSetupRequired()) return res.redirect('/setup');
  if (!req.session?.authenticated) return res.redirect('/login');
  if (await databaseConnectionError()) {
    return redirectWith(res, '/connection-repair', 'error', 'The saved database connection is unavailable. Enter the current database details below.');
  }
  return next();
});

app.use(databaseMutationLock);

app.get('/api/sync-version', async (req, res, next) => {
  try {
    const rows = await prisma.$queryRaw`SELECT \`revision\`, \`updatedAt\` FROM \`SyncRevision\` WHERE \`id\` = 1`;
    const row = rows[0] || { revision: 0, updatedAt: null };
    res.setHeader('Cache-Control', 'no-store');
    res.json({ revision: String(row.revision || 0), updatedAt: row.updatedAt || null });
  } catch (error) { next(error); }
});

app.get('/network-setup', (req, res, next) => {
  try {
    const connection = parseDatabaseConnection(process.env.DATABASE_URL);
    res.render('network-setup', {
      title: 'Network PC setup',
      connection,
      addresses: localNetworkAddresses(),
      canEnableSharing: isLocalHost(connection.host)
    });
  } catch (error) { next(error); }
});

app.post('/network-setup', async (req, res, next) => {
  try {
    const access = await enableNetworkSharing({ databaseUrl: process.env.DATABASE_URL, configPath, currentEnv: process.env, form: req.body });
    if (access.updatedConfig) {
      Object.assign(process.env, access.updatedConfig);
      await reloadPrismaClient();
    }
    redirectWith(res, '/network-setup', 'message', `Client PC access is ready for database ${access.database} on port ${access.port}. Use the selected database username on each client.`);
  } catch (error) {
    redirectWith(res, '/network-setup', 'error', error.message || 'Could not enable client PC access.');
  }
});

app.get('/printer-setup', (req, res) => {
  res.render('printer-setup', { title: 'Barcode printer setup', printer: configuredLabelPrinter() });
});

app.post('/printer-setup', (req, res) => {
  try {
    const values = updatePrinterConfiguration({ configPath, currentEnv: process.env, form: req.body });
    Object.assign(process.env, values);
    redirectWith(res, '/inventory', 'message', values.TSC_PRINTER_MODE === 'TCP'
      ? `Direct TCP printer saved: ${values.TSC_PRINTER_HOST}:${values.TSC_PRINTER_PORT}. Use Test TSC to verify the printer.`
      : `Windows printer saved: ${values.TSC_PRINTER_NAME}. Use Test TSC to verify the printer.`);
  } catch (error) {
    redirectWith(res, '/printer-setup', 'error', error.message || 'Could not save barcode printer settings.');
  }
});

app.get('/data-management', (req, res, next) => {
  try {
    const selectedResource = req.query.resource || 'sales';
    const resource = resourceFor(selectedResource);
    const range = parseDateRange(req.query);
    const restoreAllowed = isLocalHost(parseDatabaseConnection(process.env.DATABASE_URL).host)
      && String(process.env.KUSUM_DEPLOYMENT_MODE || 'SERVER').toUpperCase() !== 'CLIENT';
    res.render('data-management/index', { title: 'Data export & archive', resources: RESOURCE_LIST, selectedResource, resource, range, restoreAllowed });
  } catch (error) { next(error); }
});

app.post('/data/export', async (req, res) => {
  let resource;
  let range;
  try {
    resource = resourceFor(req.body.resource);
    range = parseDateRange(req.body);
    const payload = await getExportPayload(prisma, resource.key, range);
    const workbook = await buildExcelExport(payload);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${payload.filename}"`);
    res.send(workbook);
  } catch (error) {
    const query = new URLSearchParams({ resource: resource?.key || req.body.resource || 'sales', from: range?.from || req.body.from || '', to: range?.to || req.body.to || '', error: error.message || 'Could not create Excel export.' });
    res.redirect(`/data-management?${query.toString()}`);
  }
});

app.post('/data/archive', async (req, res) => {
  let resource;
  let range;
  try {
    resource = resourceFor(req.body.resource);
    range = parseDateRange(req.body);
    if (req.body.archiveAcknowledged !== 'on' || String(req.body.archiveConfirm || '').trim().toUpperCase() !== 'DELETE') {
      throw new Error('Tick the confirmation box and type DELETE before permanently removing data.');
    }
    const result = await archiveData(prisma, resource.key, range);
    broadcastSyncEvent('DATA_ARCHIVED', { resource: resource.key, from: range.from, to: range.to, deleted: result.deleted });
    const skipped = result.skipped ? ` ${result.skipped} protected record${result.skipped === 1 ? '' : 's'} kept.` : '';
    const note = result.note ? ` ${result.note}` : '';
    redirectWith(res, `/data-management?resource=${resource.key}&from=${range.from}&to=${range.to}`, 'message', `${result.deleted} ${resource.label.toLowerCase()} record${result.deleted === 1 ? '' : 's'} permanently deleted.${skipped}${note}`);
  } catch (error) {
    const query = new URLSearchParams({ resource: resource?.key || req.body.resource || 'sales', from: range?.from || req.body.from || '', to: range?.to || req.body.to || '', error: error.message || 'Could not remove data.' });
    res.redirect(`/data-management?${query.toString()}`);
  }
});

app.get('/data/backup-sql', async (req, res) => {
  let backup;
  try {
    backup = await generateSqlBackupFile(process.env.DATABASE_URL);
    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.sendFile(backup.filePath, async (error) => {
      await cleanupSqlBackupFile(backup);
      if (error && !res.headersSent) redirectWith(res, '/data-management', 'error', `Could not send SQL backup: ${error.message}`);
    });
  } catch (error) {
    await cleanupSqlBackupFile(backup);
    redirectWith(res, '/data-management', 'error', `Could not generate SQL backup: ${error.message}`);
  }
});

app.post('/data/restore-sql', receiveSqlUpload, async (req, res) => {
  let restoreAttempted = false;
  let uploadedPath = null;
  try {
    const connection = parseDatabaseConnection(process.env.DATABASE_URL);
    if (!isLocalHost(connection.host) || String(process.env.KUSUM_DEPLOYMENT_MODE || 'SERVER').toUpperCase() === 'CLIENT') {
      throw new Error('For safety, database restore is available only on the Main database PC.');
    }
    if (!req.file || !req.file.path) {
      throw new Error('Please choose a .sql backup file to upload.');
    }
    uploadedPath = req.file.path;
    if (path.extname(req.file.originalname || '').toLowerCase() !== '.sql') {
      throw new Error('Choose a Kusum ERP backup file with the .sql extension.');
    }
    if (req.body.restoreAcknowledged !== 'on') {
      throw new Error('Please tick the confirmation box to restore the database.');
    }
    restoreAttempted = true;
    const result = await importSqlBackupFile(process.env.DATABASE_URL, uploadedPath, appRoot);
    await reloadPrismaClient();
    broadcastSyncEvent('DATABASE_RESTORED', { tables: result.tableCount });
    redirectWith(res, '/data-management', 'message', `Database backup imported successfully! Restored ${result.tableCount} tables (${result.executedStatements} SQL statements executed). All records are ready.`);
  } catch (error) {
    if (restoreAttempted) await reloadPrismaClient().catch(() => {});
    redirectWith(res, '/data-management', 'error', `Could not restore database from SQL backup: ${error.message}`);
  } finally {
    if (uploadedPath) await fsPromises.rm(uploadedPath, { force: true }).catch(() => {});
  }
});

app.get('/', async (req, res, next) => {
  try {
    const today = startOfToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayKey = dateInput(today);
    const [productCount, stockSummaryRows, itemBreakdownRows, todaySales, lowStock, recentSales, todayCashbook, customerDue] = await Promise.all([
      prisma.product.count({ where: { quantity: { gt: 0 }, status: 'AVAILABLE' } }),
      prisma.$queryRaw`
        SELECT metal, SUM(quantity) AS pieces, SUM(netWeight * quantity) AS weight
        FROM Product
        WHERE quantity > 0 AND status = 'AVAILABLE'
        GROUP BY metal
      `,
      prisma.$queryRaw`
        SELECT name, category, metal, SUM(quantity) AS pieces, SUM(netWeight * quantity) AS weight
        FROM Product
        WHERE quantity > 0 AND status = 'AVAILABLE'
        GROUP BY name, category, metal
        ORDER BY weight DESC, name ASC
        LIMIT 100
      `,
      prisma.sale.aggregate({ where: { saleDate: { gte: today, lt: tomorrow } }, _sum: { total: true, paid: true, balance: true, urdOffset: true }, _count: true }),
      prisma.product.findMany({ where: { quantity: { lte: 1 }, status: 'AVAILABLE' }, orderBy: { quantity: 'asc' }, take: 6 }),
      prisma.sale.findMany({ include: { customer: true }, orderBy: { saleDate: 'desc' }, take: 6 }),
      prisma.cashbookEntry.groupBy({ by: ['type'], where: { entryDate: todayKey }, _sum: { amount: true } }),
      prisma.customerLedger.aggregate({ _sum: { amount: true } })
    ]);
    const cashFlow = todayCashbook.reduce((summary, entry) => {
      if (entry.type === 'IN') summary.in += Number(entry._sum.amount || 0);
      if (entry.type === 'OUT') summary.out += Number(entry._sum.amount || 0);
      return summary;
    }, { in: 0, out: 0 });
    const metalWeights = { GOLD: { pieces: 0, weight: 0 }, SILVER: { pieces: 0, weight: 0 }, OTHER: { pieces: 0, weight: 0 } };
    stockSummaryRows.forEach((row) => {
      const bucket = row.metal === 'GOLD' ? metalWeights.GOLD : row.metal === 'SILVER' ? metalWeights.SILVER : metalWeights.OTHER;
      bucket.pieces += Number(row.pieces || 0);
      bucket.weight += Number(row.weight || 0);
    });
    const itemWeightBreakdown = itemBreakdownRows.map((row) => ({
      name: row.name,
      category: row.category,
      metal: row.metal,
      pieces: Number(row.pieces || 0),
      weight: Number(row.weight || 0)
    }));
    res.render('dashboard', {
      title: 'Dashboard',
      stats: {
        productCount,
        stockPieces: metalWeights.GOLD.pieces + metalWeights.SILVER.pieces + metalWeights.OTHER.pieces,
        stockWeight: metalWeights.GOLD.weight + metalWeights.SILVER.weight + metalWeights.OTHER.weight,
        goldPieces: metalWeights.GOLD.pieces, goldWeight: metalWeights.GOLD.weight,
        silverPieces: metalWeights.SILVER.pieces, silverWeight: metalWeights.SILVER.weight,
        otherPieces: metalWeights.OTHER.pieces, otherWeight: metalWeights.OTHER.weight,
        sales: todaySales._sum.total || 0,
        invoices: todaySales._count,
        cashIn: cashFlow.in,
        cashOut: cashFlow.out,
        cashNet: cashFlow.in - cashFlow.out,
        customerDue: Math.max(0, Number(customerDue._sum.amount || 0))
      },
      lowStock,
      recentSales,
      itemWeightBreakdown
    });
  } catch (error) { next(error); }
});

app.get('/rates', async (req, res, next) => {
  try {
    const selectedDate = req.query.date || dateInput();
    const [rateInfo, history] = await Promise.all([
      getRateForDate(prisma, selectedDate),
      prisma.dailyRate.findMany({ orderBy: { rateDate: 'desc' }, take: 14 })
    ]);
    const exactRate = await prisma.dailyRate.findUnique({ where: { rateDate: selectedDate } });
    res.render('rates/index', { title: 'Daily metal rates', selectedDate, rate: exactRate || rateInfo.rate, rateInfo, history });
  } catch (error) { next(error); }
});

app.post('/rates', async (req, res, next) => {
  try {
    const rateDate = req.body.rateDate || dateInput();
    const gold22k = number(req.body.gold22k);
    const gold24k = number(req.body.gold24k);
    const silver = number(req.body.silver);
    await prisma.dailyRate.upsert({
      where: { rateDate },
      create: { rateDate, gold22k, gold24k, silver, note: req.body.note || null },
      update: { gold22k, gold24k, silver, note: req.body.note || null }
    });
    broadcastSyncEvent('RATES_UPDATED', { date: rateDate, gold22k, gold24k, silver });
    redirectWith(res, `/rates?date=${rateDate}`, 'message', `Rates saved for ${rateDate}.`);
  } catch (error) { next(error); }
});

app.get('/inventory', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const availableStock = { status: 'AVAILABLE', quantity: { gt: 0 } };
    let where = availableStock;
    if (q) {
      // Clean unit suffixes like "g", "gm", "gms", "gram", "grams"
      const cleanQ = q.replace(/(\d+(?:\.\d+)?)\s*(?:g|gm|gms|gram|grams)\b/gi, '$1');
      const tokens = cleanQ.split(/\s+/).filter(Boolean);
      const numTokens = [];
      const textTokens = [];
      for (const token of tokens) {
        if (/^\d+(?:\.\d+)?$/.test(token)) {
          numTokens.push(parseFloat(token));
        } else {
          textTokens.push(token);
        }
      }

      const conditions = [availableStock];
      if (numTokens.length > 0 && textTokens.length > 0) {
        // Both weight and text (e.g. "payal 18.25" or "18.25 silver chain")
        const textStr = textTokens.join(' ');
        const weightVal = numTokens[0];
        conditions.push({
          AND: [
            {
              OR: [
                { name: { contains: textStr } },
                { category: { contains: textStr } },
                { barcode: { contains: textStr } },
                { sku: { contains: textStr } }
              ]
            },
            {
              netWeight: {
                gte: weightVal - 0.005,
                lte: weightVal + 0.005
              }
            }
          ]
        });
      } else if (numTokens.length > 0) {
        // Search by numeric value: matches netWeight tolerance OR barcode / sku / name text containing the query
        const weightVal = numTokens[0];
        conditions.push({
          OR: [
            { barcode: { contains: q } },
            { sku: { contains: q } },
            { name: { contains: q } },
            { category: { contains: q } },
            {
              netWeight: {
                gte: weightVal - 0.005,
                lte: weightVal + 0.005
              }
            }
          ]
        });
      } else {
        // Pure text search (e.g. "payal" or "silver")
        conditions.push({
          OR: [
            { barcode: { contains: q } },
            { sku: { contains: q } },
            { name: { contains: q } },
            { category: { contains: q } }
          ]
        });
      }
      where = { AND: conditions };
    }
    const totalItems = await prisma.product.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 150);
    const products = await prisma.product.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    const printerStatus = await resolveLabelPrinter(req.query.checkPrinter === '1');
    const printerTransport = configuredLabelPrinter();
    res.render('inventory/index', { title: 'Inventory', products, q, pagination, printerName: printerStatus.name || printerTransport.name, printerStatus, printerTransport });
  } catch (error) { next(error); }
});

app.post('/labels/test-print', async (req, res) => {
  try {
    const printerTransport = configuredLabelPrinter();
    const printerStatus = await resolveLabelPrinter(true);
    if (!printerStatus.available) throw new Error(printerStatus.message);
    const tspl = buildTsplJob([{ product: {
      metal: 'GOLD', barcode: 'TSC TEST', name: 'PRINTER TEST',
      grossWeight: 0, stoneWeight: 0, netWeight: 0
    } }]);
    const result = await sendTsplToPrinter(printerTransport.mode === 'TCP' ? printerTransport : { mode: 'WINDOWS', name: printerStatus.name }, tspl);
    redirectWith(res, '/inventory', 'message', `TSC test label ${printerTransport.mode === 'TCP' ? 'sent to' : 'queued to'} ${printerStatus.name}. ${result}`);
  } catch (error) {
    redirectWith(res, '/inventory', 'error', error.message || 'Could not send the TSC test label.');
  }
});

app.post('/labels/print', express.json(), async (req, res, next) => {
  const isJson = req.is('json') || req.headers['content-type']?.includes('application/json') || req.body?.isJson;
  try {
    let requests;
    if (req.body.batchDocNo) {
      const batchDocProducts = await prisma.product.findMany({
        where: { batchDocNo: String(req.body.batchDocNo).trim() },
        orderBy: { id: 'asc' }
      });
      requests = batchDocProducts.map(p => ({ id: p.id, copies: 1 }));
    } else if (Array.isArray(req.body.productIds)) {
      requests = req.body.productIds.map(id => ({ id: Number(id), copies: Number(req.body.copies || 1) }));
    } else {
      requests = labelRequests(req.body);
    }
    requests = requests.map((request) => ({
      id: Number(request.id),
      copies: Number(request.copies)
    }));
    if (requests.some((request) => !Number.isInteger(request.id) || request.id <= 0 || !Number.isInteger(request.copies) || request.copies < 1 || request.copies > 20)) {
      throw new Error('Each selected item must request between 1 and 20 label copies.');
    }
    const totalRequestedLabels = requests.reduce((total, request) => total + request.copies, 0);
    if (totalRequestedLabels > 500) throw new Error('A single print job is limited to 500 labels. Split this into smaller batches.');
    if (!requests.length) {
      if (isJson) return res.status(400).json({ error: 'Select at least one inventory item to print labels.' });
      return redirectWith(res, '/inventory', 'error', 'Select at least one inventory item to print labels.');
    }
    const printerTransport = configuredLabelPrinter();
    if (printerTransport.mode === 'WINDOWS' && !printerTransport.name) {
      if (isJson) return res.status(400).json({ error: 'Set the installed Windows printer name before sending labels.' });
      return redirectWith(res, '/inventory', 'error', 'Set the installed Windows printer name before sending labels.');
    }
    const printerStatus = await resolveLabelPrinter(true);
    if (!printerStatus.available) throw new Error(printerStatus.message);
    const printerName = printerStatus.name;
    const products = await prisma.product.findMany({ where: { id: { in: requests.map((row) => row.id) } } });
    if (products.length !== requests.length) {
      if (isJson) return res.status(400).json({ error: 'One or more selected inventory items could not be found.' });
      return redirectWith(res, '/inventory', 'error', 'One or more selected inventory items could not be found.');
    }
    const orderedProducts = requests.map(r => products.find(p => p.id === r.id)).filter(Boolean);
    const labels = requests.flatMap(({ id, copies }) => {
      const product = orderedProducts.find((item) => item.id === id);
      if (!product.barcode) throw new Error(`${product.name} has no barcode yet.`);
      return Array.from({ length: copies }, (_, copyIndex) => ({ product, copyIndex: copyIndex + 1, copies }));
    });
    const tspl = buildTsplJob(labels);
    const result = await sendTsplToPrinter(printerTransport.mode === 'TCP' ? printerTransport : { mode: 'WINDOWS', name: printerName }, tspl);
    const successMsg = `${labels.length} native TSPL label${labels.length === 1 ? '' : 's'} ${printerTransport.mode === 'TCP' ? 'sent to' : 'queued to'} ${printerName}. ${result}`;
    if (isJson) {
      return res.json({ success: true, message: successMsg, count: labels.length });
    }
    redirectWith(res, '/inventory', 'message', successMsg);
  } catch (error) {
    if (isJson) return res.status(500).json({ error: error.message || 'Could not send native TSPL labels to the printer.' });
    redirectWith(res, '/inventory', 'error', error.message || 'Could not send native TSPL labels to the printer.');
  }
});

async function reserveBatchDocumentRoute(req, res, next) {
  try {
    const batchDocNo = await nextBatchDocumentNumber(prisma);
    res.json({ batchDocNo });
  } catch (error) { next(error); }
}

app.post('/api/inventory/batch-docs/reserve', reserveBatchDocumentRoute);
// Compatibility for an already-open browser window from the previous source.
// This path now reserves atomically too; fresh UI uses the POST endpoint above.
app.get('/api/inventory/batch-docs/next', reserveBatchDocumentRoute);

app.get('/api/inventory/batch-docs', async (req, res, next) => {
  try {
    const batchGroups = await prisma.product.groupBy({
      by: ['batchDocNo'],
      where: { batchDocNo: { not: null } },
      _count: { id: true },
      _sum: { netWeight: true, sellingPrice: true },
      orderBy: { batchDocNo: 'desc' },
      take: 30
    });
    const docs = await Promise.all(batchGroups.map(async (bg) => {
      const sample = await prisma.product.findFirst({
        where: { batchDocNo: bg.batchDocNo },
        select: { name: true, category: true, metal: true, purity: true, createdAt: true, makingChargeType: true, makingChargeValue: true, location: true }
      });
      return {
        batchDocNo: bg.batchDocNo,
        pieceCount: bg._count.id,
        totalWeight: Number(bg._sum.netWeight || 0),
        totalValue: Number(bg._sum.sellingPrice || 0),
        createdAt: sample?.createdAt,
        name: sample?.name,
        category: sample?.category,
        metal: sample?.metal,
        purity: sample?.purity,
        makingChargeType: sample?.makingChargeType,
        makingChargeValue: sample?.makingChargeValue,
        location: sample?.location
      };
    }));
    res.json({ docs });
  } catch (error) { next(error); }
});

app.get('/api/inventory/batch-docs/:batchDocNo', async (req, res, next) => {
  try {
    const batchDocNo = req.params.batchDocNo.trim();
    const products = await prisma.product.findMany({
      where: { batchDocNo },
      orderBy: { id: 'asc' }
    });
    const formatted = products.map((p) => ({
      ...p,
      formattedSellingPrice: money(Number(p.sellingPrice || 0)),
      formattedNetWeight: grams(Number(p.netWeight || 0)),
      formattedGrossWeight: grams(Number(p.grossWeight || p.netWeight || 0))
    }));
    res.json({ batchDocNo, products: formatted, count: formatted.length });
  } catch (error) { next(error); }
});

app.post('/api/inventory/batch-piece', express.json(), async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const category = String(req.body.category || '').trim();
    const metal = req.body.metal || 'SILVER';
    const purity = req.body.purity || null;
    const grossWeight = Math.max(0, number(req.body.grossWeight));
    const stoneWeight = Math.max(0, number(req.body.stoneWeight));
    const netWeight = number(req.body.netWeight) > 0 ? number(req.body.netWeight) : Math.max(0, grossWeight - stoneWeight);
    const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : 'PER_GRAM';
    const makingChargeValue = number(req.body.makingChargeValue);
    const location = req.body.location ? String(req.body.location).trim() : null;
    const batchDocNo = req.body.batchDocNo ? String(req.body.batchDocNo).trim() : null;
    const notes = req.body.notes ? String(req.body.notes).trim() : null;

    if (!name) return res.status(400).json({ error: 'Item name is required.' });
    if (!category) return res.status(400).json({ error: 'Category is required.' });
    if (netWeight <= 0) return res.status(400).json({ error: 'Net weight must be greater than 0.' });

    const product = await prisma.$transaction(async (tx) => {
      const rateInfo = await getRateForDate(tx);
      const metalAmount = metalRateFromDailyRate({ metal, purity }, rateInfo.rate) * netWeight;
      const suggestedPrice = metalAmount + makingAmount(makingChargeType, makingChargeValue, metalAmount, netWeight);
      const barcode = await nextBarcode(tx, metal, purity);
      const newProduct = await tx.product.create({
        data: {
          barcode,
          sku: barcode.replaceAll(' ', '-').toUpperCase(),
          name,
          category,
          metal,
          purity,
          grossWeight: grossWeight || netWeight,
          stoneWeight,
          netWeight,
          quantity: 1,
          reorderLevel: 0,
          purchasePrice: 0,
          sellingPrice: suggestedPrice,
          makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
          makingChargeType,
          makingChargeValue,
          location,
          batchDocNo,
          notes,
          status: 'AVAILABLE'
        }
      });
      await tx.stockMovement.create({
        data: stockMovementSnapshot(
          newProduct,
          'OPENING',
          1,
          `Batch opening stock · ${barcode}${batchDocNo ? ` · ${batchDocNo}` : ''}`
        )
      });
      // Register in master autocomplete list
      await upsertItemName(tx, name, category, { updateCategory: false });
      return {
        ...newProduct,
        formattedSellingPrice: money(suggestedPrice),
        formattedNetWeight: grams(netWeight),
        formattedGrossWeight: grams(grossWeight || netWeight)
      };
    });

    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'BATCH_PIECE_ADDED', batchDocNo: product.batchDocNo, product });
    res.json({ success: true, product });
  } catch (error) {
    console.error('Batch piece addition error:', error);
    res.status(500).json({ error: error.message || 'Failed to create piece.' });
  }
});

app.put('/api/inventory/batch-piece/:id', express.json(), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid piece ID.' });
    const grossWeight = Math.max(0, number(req.body.grossWeight));
    const stoneWeight = Math.max(0, number(req.body.stoneWeight));
    const netWeight = number(req.body.netWeight) > 0 ? number(req.body.netWeight) : Math.max(0, grossWeight - stoneWeight);
    if (netWeight <= 0) return res.status(400).json({ error: 'Net weight must be greater than 0.' });

    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUniqueOrThrow({ where: { id } });
      const rateInfo = await getRateForDate(tx);
      const metal = req.body.metal || existing.metal;
      const purity = req.body.purity !== undefined ? req.body.purity : existing.purity;
      const name = req.body.name ? String(req.body.name).trim() : existing.name;
      const category = req.body.category ? String(req.body.category).trim() : existing.category;
      const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : existing.makingChargeType;
      const makingChargeValue = req.body.makingChargeValue !== undefined ? number(req.body.makingChargeValue) : Number(existing.makingChargeValue);
      const location = req.body.location !== undefined ? (req.body.location ? String(req.body.location).trim() : null) : existing.location;

      const metalAmount = metalRateFromDailyRate({ metal, purity }, rateInfo.rate) * netWeight;
      const suggestedPrice = metalAmount + makingAmount(makingChargeType, makingChargeValue, metalAmount, netWeight);

      const product = await tx.product.update({
        where: { id },
        data: {
          name, category, metal, purity,
          grossWeight: grossWeight || netWeight,
          stoneWeight,
          netWeight,
          sellingPrice: suggestedPrice,
          makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
          makingChargeType,
          makingChargeValue,
          location
        }
      });

      return {
        ...product,
        formattedSellingPrice: money(suggestedPrice),
        formattedNetWeight: grams(netWeight),
        formattedGrossWeight: grams(grossWeight || netWeight)
      };
    });

    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'PIECE_UPDATED', id, product: updated, batchDocNo: updated.batchDocNo });
    res.json({ success: true, product: updated });
  } catch (error) {
    console.error('Batch piece update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update piece.' });
  }
});

app.delete('/api/inventory/batch-piece/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid piece ID.' });
    let batchDocNo = null;
    await prisma.$transaction(async (tx) => {
      const prod = await tx.product.findUnique({ where: { id }, select: { batchDocNo: true } });
      batchDocNo = prod?.batchDocNo || null;
      await tx.stockMovement.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'PIECE_DELETED', id, batchDocNo });
    res.json({ success: true, id });
  } catch (error) {
    console.error('Batch piece delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete piece.' });
  }
});

app.get('/inventory/new', async (req, res, next) => {
  try {
    const rateInfo = await getRateForDate(prisma);
    res.render('inventory/form', { title: 'Add jewellery item', product: null, rateInfo });
  } catch (error) { next(error); }
});

app.post('/inventory', async (req, res, next) => {
  try {
    const quantity = req.body.quantity !== undefined && req.body.quantity !== ''
      ? Math.max(0, Math.floor(number(req.body.quantity, 1)))
      : 1;
    const reorderLevel = req.body.reorderLevel !== undefined && req.body.reorderLevel !== ''
      ? Math.max(0, Math.floor(number(req.body.reorderLevel, 0)))
      : 0;
    const product = await prisma.$transaction(async (tx) => {
      const rateInfo = await getRateForDate(tx);
      const metal = req.body.metal;
      const purity = req.body.purity || null;
      const netWeight = number(req.body.netWeight);
      const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : 'PER_GRAM';
      const makingChargeValue = number(req.body.makingChargeValue);
      const metalAmount = metalRateFromDailyRate({ metal, purity }, rateInfo.rate) * netWeight;
      const suggestedPrice = metalAmount + makingAmount(makingChargeType, makingChargeValue, metalAmount, netWeight);
      const barcode = await nextBarcode(tx, metal, purity);
      const product = await tx.product.create({
        data: {
          barcode,
          sku: (req.body.sku || barcode.replaceAll(' ', '-')).trim().toUpperCase(), name: req.body.name.trim(), category: req.body.category.trim(),
          metal, purity,
          grossWeight: number(req.body.grossWeight), stoneWeight: number(req.body.stoneWeight), netWeight,
          quantity, reorderLevel,
          purchasePrice: number(req.body.purchasePrice), sellingPrice: suggestedPrice,
          makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
          makingChargeType, makingChargeValue, location: req.body.location || null,
          notes: req.body.notes || null, status: quantity ? 'AVAILABLE' : 'SOLD_OUT'
        }
      });
      if (quantity) await tx.stockMovement.create({ data: stockMovementSnapshot(product, 'OPENING', quantity, `Opening stock · ${barcode}`) });
      // Auto-register item name in the master list for future autocomplete
      await upsertItemName(tx, req.body.name.trim(), req.body.category.trim(), { updateCategory: false });
      return product;
    });
    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'PRODUCT_CREATED', barcode: product.barcode, name: product.name });
    redirectWith(res, '/inventory', 'message', `${product.barcode} saved to inventory.`);
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, '/inventory/new', 'error', 'SKU already exists.');
    next(error);
  }
});

app.get('/inventory/:id/edit', async (req, res, next) => {
  try {
    const [product, rateInfo] = await Promise.all([
      prisma.product.findUniqueOrThrow({ where: { id: Number(req.params.id) } }),
      getRateForDate(prisma)
    ]);
    res.render('inventory/form', { title: `Edit ${product.barcode || product.sku}`, product, rateInfo });
  } catch (error) { next(error); }
});

app.post('/inventory/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const reorderLevel = req.body.reorderLevel !== undefined && req.body.reorderLevel !== ''
      ? Math.max(0, Math.floor(number(req.body.reorderLevel, 0)))
      : 0;
    await prisma.$transaction(async (tx) => {
      const existing = await tx.product.findUniqueOrThrow({ where: { id } });
      const metal = req.body.metal;
      const purity = req.body.purity || null;
      const netWeight = number(req.body.netWeight);
      const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : 'PER_GRAM';
      const makingChargeValue = Math.max(0, number(req.body.makingChargeValue));
      if (netWeight <= 0) throw new Error('Net weight must be greater than zero.');
      const rateInfo = await getRateForDate(tx);
      const metalAmount = metalRateFromDailyRate({ metal, purity }, rateInfo.rate) * netWeight;
      const suggestedPrice = roundedMoney(metalAmount + makingAmount(makingChargeType, makingChargeValue, metalAmount, netWeight));
      await tx.product.update({ where: { id }, data: {
        sku: String(req.body.sku || existing.sku).trim().toUpperCase(), name: req.body.name.trim(), category: req.body.category.trim(), metal,
        purity, grossWeight: number(req.body.grossWeight), stoneWeight: number(req.body.stoneWeight), netWeight,
        reorderLevel, purchasePrice: number(req.body.purchasePrice), sellingPrice: suggestedPrice,
        makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
        makingChargeType, makingChargeValue, location: req.body.location || null, notes: req.body.notes || null, status: req.body.status
      } });
      await upsertItemName(tx, req.body.name.trim(), req.body.category.trim(), { updateCategory: false });
    });
    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'PRODUCT_UPDATED', id });
    redirectWith(res, '/inventory', 'message', 'Item details updated.');
  } catch (error) { next(error); }
});

app.post('/inventory/:id/adjust', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const delta = Math.floor(number(req.body.quantity));
    if (!delta) return redirectWith(res, '/inventory', 'error', 'Enter a non-zero adjustment quantity.');
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUniqueOrThrow({ where: { id } });
      const nextQuantity = product.quantity + delta;
      if (nextQuantity < 0) throw new Error('Adjustment would make stock negative.');
      await tx.product.update({ where: { id }, data: { quantity: nextQuantity, status: nextQuantity ? 'AVAILABLE' : 'SOLD_OUT' } });
      await tx.stockMovement.create({ data: stockMovementSnapshot(product, delta > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT', delta, req.body.note || 'Manual stock adjustment') });
    });
    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'STOCK_ADJUSTED', id, delta });
    redirectWith(res, '/inventory', 'message', 'Stock adjustment recorded.');
  } catch (error) { redirectWith(res, '/inventory', 'error', error.message || 'Could not adjust stock.'); }
});

app.get('/customers', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    const where = q ? { OR: [
      { name: { contains: q } },
      { phone: { contains: q } },
      { email: { contains: q } }
    ] } : {};
    const totalItems = await prisma.customer.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const customers = await prisma.customer.findMany({
      where,
      include: { _count: { select: { sales: true } } },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    const balances = customers.length ? await prisma.customerLedger.groupBy({
      by: ['customerId'],
      where: { customerId: { in: customers.map((customer) => customer.id) } },
      _sum: { amount: true }
    }) : [];
    const balanceByCustomer = new Map(balances.map((row) => [row.customerId, Number(row._sum.amount || 0)]));
    const customerRows = customers.map((customer) => ({
      ...customer,
      outstanding: balanceByCustomer.get(customer.id) || 0
    }));
    res.render('contacts/customers', { title: 'Customers', customers: customerRows, q, pagination });
  } catch (error) { next(error); }
});

app.post('/customers', async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);
    if (!validCustomerPhone(phone)) return redirectWith(res, '/customers', 'error', 'Enter a valid customer mobile number (10 to 15 digits).');
    const customer = await prisma.customer.create({ data: { name: req.body.name.trim(), phone, email: req.body.email || null, address: req.body.address || null } });
    broadcastSyncEvent('CUSTOMER_UPDATED', { customerId: customer.id, action: 'CREATED' });
    redirectWith(res, '/customers', 'message', 'Customer added.');
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, '/customers', 'error', 'That phone number already belongs to a customer.');
    next(error);
  }
});

app.get('/customers/:id', async (req, res, next) => {
  try {
    const customerId = Number(req.params.id);
    const [customer, ledgerCount, ledgerTotal, unpaidSalesCount] = await Promise.all([
      prisma.customer.findUniqueOrThrow({
        where: { id: customerId },
        include: { sales: { orderBy: { saleDate: 'desc' }, take: 10 } }
      }),
      prisma.customerLedger.count({ where: { customerId } }),
      prisma.customerLedger.aggregate({ where: { customerId }, _sum: { amount: true } }),
      prisma.sale.count({ where: { customerId, balance: { gt: 0 } } })
    ]);
    const pagination = paginationFor(req, ledgerCount, req.query.page, 200);
    const skip = (pagination.page - 1) * pagination.pageSize;
    const ledger = await prisma.customerLedger.findMany({
      where: { customerId },
      include: { sale: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take: pagination.pageSize
    });
    const outstanding = Number(ledgerTotal._sum.amount || 0);
    const [newerTotalRow] = skip > 0 ? await prisma.$queryRaw`
      SELECT COALESCE(SUM(recent.amount), 0) AS amount
      FROM (
        SELECT amount FROM CustomerLedger
        WHERE customerId = ${customerId}
        ORDER BY createdAt DESC, id DESC
        LIMIT ${skip}
      ) AS recent
    ` : [{ amount: 0 }];
    let runningDue = roundedMoney(outstanding - Number(newerTotalRow?.amount || 0));
    ledger.forEach((entry) => {
      entry.runningDue = runningDue;
      runningDue = roundedMoney(runningDue - Number(entry.amount));
    });
    customer.ledger = ledger;
    res.render('contacts/customer-detail', { title: customer.name, customer, outstanding, unpaidSalesCount, pagination });
  } catch (error) { next(error); }
});

app.post('/customers/:id/payments', async (req, res, next) => {
  try {
    const customerId = Number(req.params.id);
    const amount = roundedMoney(number(req.body.amount));
    const paymentMethod = receiptPaymentMethod(req.body.paymentMethod);
    if (amount <= 0) return redirectWith(res, `/customers/${customerId}`, 'error', 'Enter a valid payment amount.');
    await prisma.$transaction(async (tx) => {
      const receipt = req.body.reference?.trim() || `RCPT-${String(Date.now()).slice(-7)}`;
      const cashbookEntry = await tx.cashbookEntry.create({ data: {
        entryDate: dateInput(), type: 'IN', paymentMethod, amount,
        description: `Customer payment received — ${receipt}`, reference: receipt, customerId, syncLedger: true,
        notes: req.body.note || null
      } });
      await allocateCustomerPayment(tx, {
        customerId,
        amount,
        paymentMethod,
        reference: receipt,
        note: req.body.note || null,
        cashbookEntryId: cashbookEntry.id
      });
    });
    broadcastSyncEvent('CUSTOMER_UPDATED', { customerId, action: 'PAYMENT_RECEIVED', amount });
    broadcastSyncEvent('CASHBOOK_UPDATED', { type: 'IN', amount });
    redirectWith(res, `/customers/${customerId}`, 'message', 'Payment received and customer credit updated.');
  } catch (error) { redirectWith(res, `/customers/${req.params.id}`, 'error', error.message || 'Could not record payment.'); }
});

// ── Item Names master list ──────────────────────────────────
app.get('/api/item-names', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const where = q ? { name: { contains: q } } : {};
    const items = await prisma.itemName.findMany({ where, orderBy: { name: 'asc' }, take: 20 });
    res.json(items);
  } catch (error) { next(error); }
});

app.post('/api/item-names', express.json(), async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const category = (req.body.category || '').trim();
    if (!name || !category) return res.status(400).json({ error: 'Name and category are required.' });
    const item = await upsertItemName(prisma, name, category, { returnItem: true });
    broadcastSyncEvent('ITEM_NAMES_UPDATED', { name, category });
    res.json(item);
  } catch (error) { next(error); }
});

app.get('/item-names', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    const where = q ? { OR: [{ name: { contains: q } }, { category: { contains: q } }] } : {};
    const totalItems = await prisma.itemName.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 200);
    const items = await prisma.itemName.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    res.render('item-names/index', { title: 'Item Names', items, q, pagination });
  } catch (error) { next(error); }
});

app.post('/item-names/add', async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const category = (req.body.category || '').trim();
    if (!name || !category) return redirectWith(res, '/item-names', 'error', 'Name and category are required.');
    await upsertItemName(prisma, name, category);
    broadcastSyncEvent('ITEM_NAMES_UPDATED', { name, category });
    redirectWith(res, '/item-names', 'message', `"${name}" added.`);
  } catch (error) { next(error); }
});

app.post('/item-names/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = (req.body.name || '').trim();
    const category = (req.body.category || '').trim();
    if (!name || !category) return redirectWith(res, '/item-names', 'error', 'Name and category are required.');
    await prisma.itemName.update({ where: { id }, data: { name, category } });
    broadcastSyncEvent('ITEM_NAMES_UPDATED', { id, name, category, action: 'UPDATED' });
    redirectWith(res, '/item-names', 'message', `"${name}" updated.`);
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, '/item-names', 'error', 'That item name already exists.');
    next(error);
  }
});

app.post('/item-names/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.itemName.delete({ where: { id } });
    broadcastSyncEvent('ITEM_NAMES_UPDATED', { id, action: 'DELETED' });
    redirectWith(res, '/item-names', 'message', `"${item.name}" deleted.`);
  } catch (error) { next(error); }
});

app.get('/sales', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const from = req.query.from || '';
    const to = req.query.to || '';
    const where = {};
    // Text search: customer name OR customer phone OR invoice number
    if (q) {
      where.OR = [
        { invoiceNumber: { contains: q } },
        { customer: { name: { contains: q } } },
        { customer: { phone: { contains: q } } }
      ];
    }
    // Date range filter on saleDate
    if (from || to) {
      where.saleDate = {};
      if (from) where.saleDate.gte = localDateTimeRange(from, from).gte;
      if (to) where.saleDate.lte = localDateTimeRange(to, to).lte;
    }
    const totalItems = await prisma.sale.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const sales = await prisma.sale.findMany({
      where,
      include: { customer: true, _count: { select: { items: true } } },
      orderBy: { saleDate: 'desc' },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    res.render('sales/index', { title: 'Sales', sales, filters: { q, from, to }, pagination });
  } catch (error) { next(error); }
});

app.get('/api/rates', async (req, res, next) => {
  try {
    const rateInfo = await getRateForDate(prisma, req.query.date || dateInput());
    res.json({ rate: rateInfo.rate, sourceDate: rateInfo.sourceDate, isFallback: rateInfo.isFallback });
  } catch (error) { next(error); }
});

app.get('/api/products/barcode/:barcode', async (req, res, next) => {
  try {
    const raw = decodeURIComponent(req.params.barcode).trim().toUpperCase();
    // Try the input as-is, then swap dash↔space variants, then fall back to SKU
    const barcodeVariants = [...new Set([raw, raw.replace(/-/g, ' '), raw.replace(/\s+/g, '-')])];
    let product = null;
    for (const b of barcodeVariants) {
      product = await prisma.product.findUnique({ where: { barcode: b } });
      if (product) break;
    }
    // SKU fallback
    if (!product) product = await prisma.product.findFirst({ where: { sku: raw, status: 'AVAILABLE' } });
    if (!product) return res.status(404).json({ error: `"${raw}" not found. Check the barcode and try again.` });
    if (product.quantity <= 0 || product.status !== 'AVAILABLE') return res.status(409).json({ error: `${product.barcode || product.sku} is not available in stock.` });
    const rateInfo = await getRateForDate(prisma, req.query.date || dateInput());
    const metalRate = metalRateFromDailyRate(product, rateInfo.rate);
    // Always return the product — let the user set the rate manually if needed
    res.json({
      product: {
        id: product.id, barcode: product.barcode, sku: product.sku, name: product.name, category: product.category,
        metal: product.metal, purity: product.purity, netWeight: Number(product.netWeight), quantity: product.quantity,
        makingChargeType: product.makingChargeType, makingChargeValue: Number(product.makingChargeValue)
      },
      metalRate: metalRate || 0,
      rateWarning: !metalRate ? 'No daily rate set — enter the rate manually or set it from the Daily Rates page.' : null,
      sourceDate: rateInfo.sourceDate, isFallback: rateInfo.isFallback
    });
  } catch (error) { next(error); }
});

app.get('/api/customers/phone/:phone', async (req, res, next) => {
  try {
    const phone = normalizePhone(decodeURIComponent(req.params.phone));
    if (!validCustomerPhone(phone)) return res.status(400).json({ error: 'Enter a valid customer mobile number.' });
    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: { sales: { orderBy: { saleDate: 'desc' }, take: 5, select: { invoiceNumber: true, saleDate: true, total: true, balance: true } } }
    });
    if (!customer) return res.json({ found: false, phone });
    const ledgerTotal = await prisma.customerLedger.aggregate({ where: { customerId: customer.id }, _sum: { amount: true } });
    const outstanding = Number(ledgerTotal._sum.amount || 0);
    res.json({
      found: true,
      customer: { id: customer.id, name: customer.name, phone: customer.phone, email: customer.email, address: customer.address, panNumber: customer.panNumber, outstanding, recentSales: customer.sales.map((sale) => ({ ...sale, total: Number(sale.total), balance: Number(sale.balance) })) }
    });
  } catch (error) { next(error); }
});

app.get('/sales/new', async (req, res, next) => {
  try {
    const [rateInfo, nextInvoiceNumber] = await Promise.all([
      getRateForDate(prisma),
      nextDocumentNumber(prisma, 'INV')
    ]);
    res.render('sales/form', { title: 'New sale', invoiceNumber: nextInvoiceNumber, rateInfo });
  } catch (error) { next(error); }
});

app.post('/sales', async (req, res, next) => {
  try {
    const rows = saleRows(req.body);
    if (!rows.length) return redirectWith(res, '/sales/new', 'error', 'Enter at least one scanned barcode.');
    const discount = Math.max(0, number(req.body.discount));
    const payment = salePaymentBreakdown(req.body);
    const saleDate = dateTimeFromInput(req.body.saleDate);
    const includeUrdPurchase = req.body.includeUrdPurchase === 'on';
    const sale = await prisma.$transaction(async (tx) => {
      const productIds = [...new Set(rows.map((row) => row.productId))];
      // Lock in a stable order so two PCs cannot sell the same last piece or
      // overwrite one another's quantity update.
      for (const productId of [...productIds].sort((a, b) => a - b)) {
        await tx.$queryRaw`SELECT id FROM \`Product\` WHERE id = ${productId} FOR UPDATE`;
      }
      const [products, rateInfo] = await Promise.all([
        tx.product.findMany({ where: { id: { in: productIds } } }),
        getRateForDate(tx, dateInput(saleDate))
      ]);
      if (products.length !== productIds.length) throw new Error('One or more scanned items no longer exist.');
      for (const product of products) {
        if (product.status !== 'AVAILABLE') throw new Error(`${product.barcode || product.sku} is not available for sale.`);
        const submittedRows = rows.filter((row) => row.productId === product.id);
        if (submittedRows.some((row) => row.barcode && ![product.barcode, product.sku].filter(Boolean).map((value) => String(value).toUpperCase()).includes(row.barcode))) {
          throw new Error('A barcode changed before the bill was saved. Scan the item again to prevent billing the wrong piece.');
        }
        const requested = rows.filter((row) => row.productId === product.id).reduce((total, row) => total + row.quantity, 0);
        if (product.quantity < requested) throw new Error(`${product.barcode || product.sku} has only ${product.quantity} piece(s) in stock.`);
      }
      const pricedRows = rows.map((row) => {
        const product = products.find((item) => item.id === row.productId);
        const weight = row.weight === null ? Number(product.netWeight) : row.weight;
        if (!Number.isFinite(weight) || weight <= 0) {
          throw new Error(`Enter a valid billing weight for ${product.barcode || product.sku}.`);
        }
        const defaultRate = metalRateFromDailyRate(product, rateInfo.rate);
        const metalRate = row.metalRate > 0 ? row.metalRate : defaultRate;
        if (!metalRate) throw new Error(`Set a daily rate before billing ${product.barcode || product.sku}.`);
        const makingChargeType = row.makingChargeType || product.makingChargeType;
        const makingChargeValue = row.makingChargeValue === null ? Number(product.makingChargeValue) : row.makingChargeValue;
        const metalAmount = roundedMoney(metalRate * weight * row.quantity);
        const calculatedMaking = roundedMoney(makingAmount(makingChargeType, makingChargeValue, metalAmount, weight, row.quantity));
        const calculatedTaxable = roundedMoney(metalAmount + calculatedMaking);
        return {
          ...row, product, weight, metalRate, metalAmount, makingChargeType, makingChargeValue,
          makingCharge: calculatedMaking,
          taxableAmount: row.taxableAmount === null ? calculatedTaxable : roundedMoney(row.taxableAmount)
        };
      });
      const subtotal = roundedMoney(pricedRows.reduce((sum, row) => sum + row.taxableAmount, 0));
      const appliedDiscount = roundedMoney(Math.min(discount, subtotal));
      const taxable = roundedMoney(Math.max(0, subtotal - appliedDiscount));
      const gstRate = 3;
      const gstAmount = roundedMoney(taxable * gstRate / 100);
      const total = roundedMoney(taxable + gstAmount);
      const customer = await resolveBillingCustomer(tx, req.body);
      const customerId = customer.id;
      const customerPan = String(req.body.customerPan || req.body.existingCustomerPan || customer.panNumber || '').trim().toUpperCase() || null;
      const urdAmount = includeUrdPurchase ? Math.max(0, roundedMoney(number(req.body.urdTotalAmount))) : 0;
      if (includeUrdPurchase) {
        if (!customerId) throw new Error('Select the customer before settling their URD purchase against this bill.');
        if (number(req.body.urdNetWeight) <= 0 || number(req.body.urdRatePerGram) <= 0 || urdAmount <= 0) {
          throw new Error('Enter valid URD net weight, rate and purchase amount.');
        }
        if (urdAmount > total) throw new Error('URD value is higher than this sale total. Record it as a separate URD purchase so the balance can be paid to the customer.');
      }
      const netPayable = roundedMoney(Math.max(0, total - urdAmount));
      if (payment.paid > netPayable) throw new Error(`Payment is greater than the net payable amount of ${money(netPayable)}.`);
      const acceptedPaid = payment.paid;
      const balance = roundedMoney(Math.max(0, netPayable - acceptedPaid));
      const sale = await tx.sale.create({ data: {
        invoiceNumber: req.body.invoiceNumber || await nextDocumentNumber(tx, 'INV', saleDate), customerId, customerPan, saleDate,
        subtotal, discount: appliedDiscount, gstRate, gstAmount, total, urdOffset: urdAmount, paid: acceptedPaid,
        cashPaid: payment.cashPaid, upiPaid: payment.upiPaid, cardPaid: payment.cardPaid, bankPaid: payment.bankPaid, balance,
        paymentMethod: payment.paymentMethod, notes: req.body.notes || null,
        items: { create: pricedRows.map((row) => ({
          productId: row.productId, productBarcode: row.product.barcode, productSku: row.product.sku,
          productName: row.product.name, productMetal: row.product.metal, productPurity: row.product.purity,
          grossWeight: row.product.grossWeight, quantity: row.quantity, weight: row.weight, unitPrice: row.metalRate,
          metalRate: row.metalRate, metalAmount: row.metalAmount, makingCharge: row.makingCharge,
          makingChargeType: row.makingChargeType, makingChargeValue: row.makingChargeValue,
          taxableAmount: row.taxableAmount, lineTotal: row.taxableAmount,
          hsnCode: row.hsnCode || null,
          huidCode: row.huidCode || null
        })) }
      } });
      if (balance > 0) await tx.customerLedger.create({
        data: { customerId, saleId: sale.id, type: 'SALE_CREDIT', amount: balance, reference: sale.invoiceNumber, note: `Credit balance from ${sale.invoiceNumber}` }
      });
      if (includeUrdPurchase) {
        await tx.urdPurchase.create({ data: {
          purchaseNumber: req.body.urdPurchaseNumber || await nextDocumentNumber(tx, 'URD', saleDate), customerId, purchaseDate: saleDate,
          metal: req.body.urdMetal || 'GOLD', purity: req.body.urdPurity || null,
          grossWeight: number(req.body.urdGrossWeight), netWeight: number(req.body.urdNetWeight),
          ratePerGram: number(req.body.urdRatePerGram), totalAmount: urdAmount, saleOffset: urdAmount,
          paid: 0, paymentMethod: 'MIXED', description: req.body.urdDescription || 'URD purchase settled against sale',
          notes: `Settled against sale ${sale.invoiceNumber}`, saleId: sale.id
        } });
      }
      if (acceptedPaid > 0) {
        for (const recordedPayment of payment.cashbookPayments) {
          await tx.cashbookEntry.create({ data: {
             entryDate: dateInput(saleDate), type: 'IN', paymentMethod: recordedPayment.method, amount: recordedPayment.amount,
             description: `Sale payment — ${sale.invoiceNumber}`, reference: sale.invoiceNumber, customerId, syncLedger: Boolean(customerId),
             saleId: sale.id,
             notes: req.body.notes || null
          } });
        }
      }
      for (const product of products) {
        const quantitySold = rows.filter((row) => row.productId === product.id).reduce((total, row) => total + row.quantity, 0);
        await tx.stockMovement.create({ data: stockMovementSnapshot(product, 'SALE', -quantitySold, `Sold via ${sale.invoiceNumber}`) });
        // One barcode represents one physical jewellery item. Once that barcode
        // appears on a committed bill, remove its inventory row permanently.
        // SaleItem and StockMovement snapshots preserve all historical details.
        await tx.product.delete({ where: { id: product.id } });
      }
      return sale;
    });
    broadcastSyncEvent('SALE_COMPLETED', {
      invoiceNumber: sale.invoiceNumber,
      customerId: sale.customerId,
      total: Number(sale.total),
      paid: Number(sale.paid),
      balance: Number(sale.balance)
    });
    broadcastSyncEvent('INVENTORY_CHANGED', { action: 'ITEMS_SOLD', count: rows.length });
    if (Number(sale.paid) > 0) broadcastSyncEvent('CASHBOOK_UPDATED', { type: 'IN', amount: Number(sale.paid) });
    redirectWith(res, `/sales/${sale.id}`, 'message', 'Sale saved, stock removed and customer credit updated.');
  } catch (error) { redirectWith(res, '/sales/new', 'error', error.message || 'Could not save sale.'); }
});

app.get('/sales/:id', async (req, res, next) => {
  try {
    const sale = await prisma.sale.findUniqueOrThrow({ where: { id: Number(req.params.id) }, include: { customer: true, items: { include: { product: true } } } });
    res.render('sales/invoice', { title: sale.invoiceNumber, sale });
  } catch (error) { next(error); }
});

app.get('/sales/:id/invoice.pdf', async (req, res, next) => {
  try {
    const sale = await prisma.sale.findUnique({ where: { id: Number(req.params.id) }, include: { customer: true, items: { include: { product: true } } } });
    if (!sale) return res.status(404).render('not-found', { title: 'Invoice not found' });
    writeSaleInvoice(res, sale);
  } catch (error) { next(error); }
});

/* ── Cashbook ─────────────────────────────────────────────── */
app.get('/cashbook', async (req, res, next) => {
  try {
    const selectedDate = req.query.date || dateInput();
    const fromDate = req.query.from || `${dateInput().slice(0, 7)}-01`;
    const toDate = req.query.to || dateInput();
    const methodFilter = req.query.method || '';
    const where = {
      entryDate: { gte: fromDate, lte: toDate },
      ...(methodFilter ? { paymentMethod: methodFilter } : {})
    };
    const totalItems = await prisma.cashbookEntry.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 200);
    const [entries, totals, customers] = await Promise.all([
      prisma.cashbookEntry.findMany({ where, include: { customer: true }, orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }], skip: (pagination.page - 1) * pagination.pageSize, take: pagination.pageSize }),
      prisma.cashbookEntry.groupBy({
        by: ['type', 'paymentMethod'],
        where,
        _sum: { amount: true }
      }),
      prisma.customer.findMany({ orderBy: { name: 'asc' }, take: 500 })
    ]);
    const summary = { totalIn: 0, totalOut: 0, cashIn: 0, cashOut: 0, upiIn: 0, upiOut: 0, bankIn: 0, bankOut: 0 };
    totals.forEach((row) => {
      const amt = Number(row._sum.amount || 0);
      if (row.type === 'IN') summary.totalIn += amt; else summary.totalOut += amt;
      const key = row.paymentMethod.toLowerCase().replace('_transfer', '');
      if (row.type === 'IN') summary[key + 'In'] = (summary[key + 'In'] || 0) + amt;
      else summary[key + 'Out'] = (summary[key + 'Out'] || 0) + amt;
    });
    summary.netBalance = summary.totalIn - summary.totalOut;
    summary.cashNet = (summary.cashIn || 0) - (summary.cashOut || 0);
    summary.upiNet = (summary.upiIn || 0) - (summary.upiOut || 0);
    summary.bankNet = (summary.bankIn || 0) - (summary.bankOut || 0);
    res.render('cashbook/index', { title: 'Cashbook', entries, summary, fromDate, toDate, selectedDate, methodFilter, customers, pagination });
  } catch (error) { next(error); }
});

app.post('/cashbook', async (req, res, next) => {
  try {
    const amount = roundedMoney(number(req.body.amount));
    if (amount <= 0) return redirectWith(res, '/cashbook', 'error', 'Enter a valid amount greater than zero.');
    const requestedCustomerId = req.body.customerId ? Number(req.body.customerId) : null;
    const customerId = Number.isInteger(requestedCustomerId) && requestedCustomerId > 0 ? requestedCustomerId : null;
    const syncLedger = Boolean(customerId);
    const entryDate = req.body.entryDate || dateInput();
    const entryType = req.body.type === 'OUT' ? 'OUT' : 'IN';
    const paymentMethod = receiptPaymentMethod(req.body.paymentMethod);
    const description = String(req.body.description || '').trim();
    if (!description) return redirectWith(res, '/cashbook', 'error', 'Enter a description for this entry.');

    await prisma.$transaction(async (tx) => {
      const receipt = req.body.reference?.trim() || `CB-${String(Date.now()).slice(-7)}`;
      const cashbookEntry = await tx.cashbookEntry.create({
        data: {
          entryDate, type: entryType, paymentMethod, description, amount,
          reference: receipt, notes: req.body.notes || null,
          customerId, syncLedger: Boolean(syncLedger)
        }
      });
      if (syncLedger && entryType === 'IN') {
        await allocateCustomerPayment(tx, {
          customerId,
          amount,
          paymentMethod,
          reference: receipt,
          note: `Payment via cashbook · ${description}`,
          cashbookEntryId: cashbookEntry.id
        });
      } else if (syncLedger) {
        await lockCustomerForLedger(tx, customerId);
      }
      if (syncLedger && entryType === 'OUT') {
        // Money going out to a customer is money they owe back to the shop.
        await tx.customerLedger.create({
          data: {
            customerId, type: 'ADJUSTMENT', amount, cashbookEntryId: cashbookEntry.id,
            paymentMethod, reference: receipt, note: `Cashbook out · ${description}`
          }
        });
      }
    });
    broadcastSyncEvent('CASHBOOK_UPDATED', { entryDate: req.body.entryDate, type: req.body.type, amount: Number(req.body.amount) });
    if (syncLedger) broadcastSyncEvent('CUSTOMER_UPDATED', { customerId, action: entryType === 'IN' ? 'PAYMENT_RECEIVED' : 'ADJUSTMENT', amount });
    const label = req.body.type === 'OUT' ? 'Cash out' : 'Cash in';
    const syncNote = syncLedger ? ' Customer ledger updated.' : '';
    redirectWith(res, '/cashbook', 'message', `${label} entry saved.${syncNote}`);
  } catch (error) { redirectWith(res, '/cashbook', 'error', error.message || 'Could not save entry.'); }
});

app.post('/cashbook/:id/delete', async (req, res, next) => {
  try {
    const result = await prisma.$transaction((tx) => reverseAndDeleteCashbookEntry(tx, Number(req.params.id)));
    broadcastSyncEvent('CASHBOOK_UPDATED', { action: 'DELETED' });
    if (result.affectedSales.length) broadcastSyncEvent('CUSTOMER_UPDATED', { action: 'PAYMENT_REVERSED', saleIds: result.affectedSales });
    redirectWith(res, '/cashbook', 'message', 'Entry deleted and all linked accounting records reversed.');
  } catch (error) { redirectWith(res, '/cashbook', 'error', error.message || 'Could not safely delete this cashbook entry.'); }
});

/* ── URD Purchases (old gold/silver from customers) ────── */
app.get('/urd-purchases', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const where = {};
    if (q) {
      const metalMatch = ['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER'].includes(q.toUpperCase())
        ? [{ metal: q.toUpperCase() }]
        : [];
      where.OR = [
        { purchaseNumber: { contains: q } },
        { customer: { name: { contains: q } } },
        { customer: { phone: { contains: q } } },
        { description: { contains: q } },
        ...metalMatch
      ];
    }
    const totalItems = await prisma.urdPurchase.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const purchases = await prisma.urdPurchase.findMany({
      where,
      include: { customer: true },
      orderBy: { purchaseDate: 'desc' },
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    res.render('urd-purchases/index', { title: 'URD Purchases', purchases, q, pagination });
  } catch (error) { next(error); }
});

app.get('/urd-purchases/new', async (req, res, next) => {
  try {
    const [customers, rateInfo] = await Promise.all([
      prisma.customer.findMany({ orderBy: { name: 'asc' }, take: 500 }),
      getRateForDate(prisma, dateInput())
    ]);
    const purchaseNumber = await nextDocumentNumber(prisma, 'URD');
    res.render('urd-purchases/form', { title: 'New URD purchase', customers, rateInfo, purchaseNumber, purchase: null });
  } catch (error) { next(error); }
});

app.post('/urd-purchases', async (req, res, next) => {
  try {
    let customerId = Number(req.body.customerId);
    if (!Number.isInteger(customerId) || customerId <= 0) {
      if (req.body.customerPhone) {
        const cust = await resolveBillingCustomer(prisma, req.body);
        customerId = cust.id;
      } else {
        return redirectWith(res, '/urd-purchases/new', 'error', 'Select a customer for this URD purchase.');
      }
    }
    const netWeight = number(req.body.netWeight);
    const ratePerGram = number(req.body.ratePerGram);
    const totalAmount = roundedMoney(number(req.body.totalAmount));
    const paid = roundedMoney(Math.max(0, number(req.body.paid)));
    const paymentMethod = receiptPaymentMethod(req.body.paymentMethod);
    if (netWeight <= 0) return redirectWith(res, '/urd-purchases/new', 'error', 'Enter a net weight greater than zero.');
    if (ratePerGram <= 0) return redirectWith(res, '/urd-purchases/new', 'error', 'Enter a rate per gram greater than zero.');
    if (totalAmount <= 0) return redirectWith(res, '/urd-purchases/new', 'error', 'Enter a valuation amount greater than zero.');
    if (paid > totalAmount) return redirectWith(res, '/urd-purchases/new', 'error', `Payout is greater than the valuation amount of ${money(totalAmount)}.`);
    const purchaseDate = dateTimeFromInput(req.body.purchaseDate);
    const purchase = await prisma.$transaction(async (tx) => {
      const record = await tx.urdPurchase.create({
        data: {
          purchaseNumber: req.body.purchaseNumber || await nextDocumentNumber(tx, 'URD', purchaseDate),
          customerId,
          purchaseDate,
          metal: req.body.metal || 'GOLD', purity: req.body.purity || null,
          grossWeight: number(req.body.grossWeight), netWeight, ratePerGram,
          totalAmount, paid, paymentMethod, description: req.body.description || null, notes: req.body.notes || null
        }
      });
      if (paid > 0) {
        await tx.cashbookEntry.create({ data: {
          entryDate: dateInput(record.purchaseDate), type: 'OUT', paymentMethod,
          description: `URD purchase — ${record.purchaseNumber}`, amount: paid, reference: record.purchaseNumber,
          customerId: record.customerId, urdPurchaseId: record.id, syncLedger: false, notes: req.body.notes || null
        } });
      }
      return record;
    });
    broadcastSyncEvent('URD_COMPLETED', {
      purchaseNumber: purchase.purchaseNumber,
      totalAmount: Number(purchase.totalAmount),
      paid: Number(purchase.paid)
    });
    if (paid > 0) broadcastSyncEvent('CASHBOOK_UPDATED', { type: 'OUT', amount: paid });
    redirectWith(res, '/urd-purchases', 'message', `URD Purchase ${purchase.purchaseNumber} saved.`);
  } catch (error) { next(error); }
});

app.post('/urd-purchases/:id/payments', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const amount = roundedMoney(number(req.body.amount));
    const paymentMethod = receiptPaymentMethod(req.body.paymentMethod);
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid URD purchase.');
    if (amount <= 0) throw new Error('Enter a payout amount greater than zero.');
    const result = await prisma.$transaction(async (tx) => {
      const locked = await tx.$queryRaw`SELECT id FROM \`UrdPurchase\` WHERE id = ${id} FOR UPDATE`;
      if (!locked.length) throw new Error('This URD purchase no longer exists.');
      const purchase = await tx.urdPurchase.findUniqueOrThrow({ where: { id } });
      const outstanding = roundedMoney(Math.max(0, Number(purchase.totalAmount) - Number(purchase.saleOffset) - Number(purchase.paid)));
      if (outstanding <= 0) throw new Error('This URD purchase is already fully paid or settled.');
      if (amount > outstanding) throw new Error(`Payout is greater than the outstanding amount of ${money(outstanding)}.`);
      const reference = req.body.reference?.trim() || `${purchase.purchaseNumber}-PAY`;
      const nextMethod = Number(purchase.paid) <= 0 || purchase.paymentMethod === paymentMethod
        ? paymentMethod
        : 'MIXED';
      const updated = await tx.urdPurchase.update({
        where: { id },
        data: { paid: { increment: amount }, paymentMethod: nextMethod }
      });
      await tx.cashbookEntry.create({
        data: {
          entryDate: req.body.entryDate || dateInput(),
          type: 'OUT',
          paymentMethod,
          amount,
          description: `URD payout — ${purchase.purchaseNumber}`,
          reference,
          customerId: purchase.customerId,
          urdPurchaseId: purchase.id,
          syncLedger: false,
          notes: req.body.notes || null
        }
      });
      return updated;
    });
    broadcastSyncEvent('URD_UPDATED', { id, action: 'PAYOUT_RECORDED', amount, paid: Number(result.paid) });
    broadcastSyncEvent('CASHBOOK_UPDATED', { type: 'OUT', amount });
    redirectWith(res, '/urd-purchases', 'message', `URD payout of ${money(amount)} recorded.`);
  } catch (error) {
    redirectWith(res, '/urd-purchases', 'error', error.message || 'Could not record the URD payout.');
  }
});

app.get('/urd-purchases/:id/invoice.pdf', async (req, res, next) => {
  try {
    const purchase = await prisma.urdPurchase.findUnique({
      where: { id: Number(req.params.id) }, include: { customer: true, sale: true }
    });
    if (!purchase) return res.status(404).render('not-found', { title: 'URD invoice not found' });
    writeUrdPurchaseInvoice(res, purchase);
  } catch (error) { next(error); }
});

app.post('/urd-purchases/:id/delete', async (req, res, next) => {
  try {
    const purchase = await prisma.$transaction(async (tx) => {
      const record = await tx.urdPurchase.findUniqueOrThrow({ where: { id: Number(req.params.id) } });
      const outstanding = Math.max(0, Number(record.totalAmount) - Number(record.paid) - Number(record.saleOffset));
      if (outstanding > 0) throw new Error(`This URD purchase has ${money(outstanding)} still payable to the customer and cannot be deleted.`);
      await deleteSettledUrdPurchase(tx, record);
      return record;
    });
    broadcastSyncEvent('URD_UPDATED', { id: purchase.id, action: 'DELETED' });
    broadcastSyncEvent('CASHBOOK_UPDATED', { action: 'URD_DELETED', reference: purchase.purchaseNumber });
    redirectWith(res, '/urd-purchases', 'message', 'Purchase and its linked payout entries deleted.');
  } catch (error) {
    redirectWith(res, '/urd-purchases', 'error', error.message || 'Could not delete this URD purchase.');
  }
});

app.get('/reports', async (req, res, next) => {
  try {
    const todayKey = dateInput();
    const fromKey = req.query.from || `${todayKey.slice(0, 7)}-01`;
    const toKey = req.query.to || todayKey;
    const { gte: from, lte: to } = localDateTimeRange(fromKey, toKey);
    const itemQ = String(req.query.itemQ || '').trim();
    const metalSearch = ['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER'].includes(itemQ.toUpperCase())
      ? [{ metal: itemQ.toUpperCase() }]
      : [];
    const itemWhere = {
      quantity: { gt: 0 },
      status: 'AVAILABLE',
      ...(itemQ ? { OR: [
        { barcode: { contains: itemQ } },
        { sku: { contains: itemQ } },
        { name: { contains: itemQ } },
        { category: { contains: itemQ } },
        { purity: { contains: itemQ } },
        { location: { contains: itemQ } },
        ...metalSearch
      ] } : {})
    };
    const itemTotal = await prisma.product.count({ where: itemWhere });
    const pagination = paginationFor(req, itemTotal, req.query.page, 100);

    const topSelling = (metal) => prisma.$queryRaw`
      SELECT
        ${metal} AS metal,
        COALESCE(NULLIF(si.productName, ''), p.name, 'Jewellery item') AS name,
        COALESCE(NULLIF(si.productSku, ''), p.sku, '') AS sku,
        COALESCE(si.productPurity, p.purity, '') AS purity,
        SUM(si.quantity) AS quantity,
        SUM(si.lineTotal) AS billed
      FROM SaleItem si
      INNER JOIN Sale s ON s.id = si.saleId
      LEFT JOIN Product p ON p.id = si.productId
      WHERE s.saleDate >= ${from} AND s.saleDate <= ${to}
        AND COALESCE(si.productMetal, p.metal) = ${metal}
      GROUP BY
        COALESCE(NULLIF(si.productName, ''), p.name, 'Jewellery item'),
        COALESCE(NULLIF(si.productSku, ''), p.sku, ''),
        COALESCE(si.productPurity, p.purity, '')
      ORDER BY billed DESC
      LIMIT 1
    `;

    const [sales, topGoldRows, topSilverRows, stockSummaryRows, stockProducts, receivables] = await Promise.all([
      prisma.sale.aggregate({ where: { saleDate: { gte: from, lte: to } }, _sum: { subtotal: true, discount: true, gstAmount: true, total: true, paid: true, balance: true }, _count: true }),
      topSelling('GOLD'),
      topSelling('SILVER'),
      prisma.$queryRaw`
        SELECT metal, SUM(quantity) AS quantity,
          SUM(netWeight * quantity) AS netWeight,
          SUM(grossWeight * quantity) AS grossWeight
        FROM Product
        WHERE quantity > 0 AND status = 'AVAILABLE'
        GROUP BY metal
        ORDER BY metal
      `,
      prisma.product.findMany({
        where: itemWhere,
        select: { id: true, barcode: true, sku: true, name: true, category: true, metal: true, purity: true, grossWeight: true, netWeight: true, quantity: true, location: true },
        orderBy: [{ metal: 'asc' }, { name: 'asc' }, { id: 'asc' }],
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize
      }),
      prisma.sale.aggregate({ _sum: { balance: true } })
    ]);
    const topProducts = [...topGoldRows, ...topSilverRows].map((row) => ({
      metal: row.metal,
      name: row.name,
      sku: row.sku,
      purity: row.purity,
      quantity: Number(row.quantity || 0),
      billed: Number(row.billed || 0)
    }));
    const stockByMetal = stockSummaryRows.map((row) => ({
      metal: row.metal,
      quantity: Number(row.quantity || 0),
      netWeight: Number(row.netWeight || 0),
      grossWeight: Number(row.grossWeight || 0)
    }));

    const itemWiseStock = stockProducts.map((p) => {
      const netWt = Number(p.netWeight);
      const grossWt = Number(p.grossWeight);
      return {
        id: p.id,
        barcode: p.barcode || '—',
        sku: p.sku,
        name: p.name,
        category: p.category,
        metal: p.metal,
        purity: p.purity || '—',
        quantity: p.quantity,
        netWeight: netWt,
        grossWeight: grossWt,
        totalNetWeight: netWt * p.quantity,
        totalGrossWeight: grossWt * p.quantity,
        location: p.location || '—'
      };
    });

    res.render('reports/index', {
      title: 'Reports',
      from,
      to,
      sales,
      stockByMetal,
      receivables: receivables._sum.balance || 0,
      topProducts,
      itemWiseStock,
      itemQ,
      pagination
    });
  } catch (error) { next(error); }
});

app.use((req, res) => res.status(404).render('not-found', { title: 'Page not found' }));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', { title: 'Something went wrong', detail: process.env.NODE_ENV === 'development' ? error.message : null });
});

async function startApplicationServer() {
  if (!shopSetupRequired()) {
    const connection = parseDatabaseConnection(process.env.DATABASE_URL);
    const mode = String(process.env.KUSUM_DEPLOYMENT_MODE || 'SERVER').toUpperCase();
    if (mode !== 'CLIENT' && isLocalHost(connection.host)) {
      await runBundledMigrations(appRoot, process.env.DATABASE_URL);
    } else {
      // Client PCs never migrate the shared schema. They fail clearly until
      // the updated ERP has first been opened on the Main database PC.
      await verifyClientConnection(process.env.DATABASE_URL, appRoot);
    }
  }
  const mode = String(process.env.KUSUM_DEPLOYMENT_MODE || 'SERVER').toUpperCase();
  const bindHost = process.env.KUSUM_BIND_HOST || (mode === 'CLIENT' ? '127.0.0.1' : '0.0.0.0');
  return app.listen(port, bindHost, () => console.log(`Kusum ERP running at http://localhost:${port}`));
}

startApplicationServer().catch((error) => {
  console.error(error);
  setImmediate(() => { throw error; });
});

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });

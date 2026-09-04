const os = require('os');
const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const { Prisma } = require('@prisma/client');
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
const { paymentMethodFromComponents, reverseAndDeleteCashbookEntry, deleteSettledUrdPurchase, cancelUrdPurchase, cancelSale } = require('./lib/accounting-reversal');
const { urdSettlement } = require('./lib/urd-settlement');
const { productSearchClauses } = require('./lib/product-search-filters');
const { normalizeTopSellingFilters, countTopSellingItems, listTopSellingItems, summarizeTopSellingItems } = require('./lib/top-selling-items');
const { number, roundToNearestRupee, asArray, dateInput, startOfToday, dateTimeFromInput, localDateTimeRange, money, grams, formatDateDisplay, nextDocumentNumber, nextBatchDocumentNumber, metalRateFromDailyRate, makingAmount, titleCase } = require('./lib/helpers');
const { nextBarcode } = require('./lib/barcode-sequence');
const { upsertItemName } = require('./lib/item-names');
const { createInstallmentSchedule, schemeEndDate, isFullInstallmentPayment } = require('./lib/scheme-schedule');
const { hasConfiguredPassword, passwordMatchesEnvironment, secureTextMatch, usesKnownDefaultPassword } = require('./lib/auth-security');
const { PrismaSessionStore } = require('./lib/mysql-session-store');
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
if (process.env.NODE_ENV === 'development') app.use(require('morgan')('dev'));
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
app.locals.formatDate = formatDateDisplay;
app.locals.formatDateDisplay = formatDateDisplay;

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.money = money;
  res.locals.grams = grams;
  res.locals.dateInput = dateInput;
  res.locals.formatDate = formatDateDisplay;
  res.locals.formatDateDisplay = formatDateDisplay;
  res.locals.message = req.query.message || null;
  res.locals.error = req.query.error || null;
  res.locals.loggedInUser = req.session?.username || null;
  next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

function redirectWith(res, route, type, message) {
  const separator = route.includes('?') ? '&' : '?';
  res.redirect(`${route}${separator}${type}=${encodeURIComponent(message)}`);
}

// The session store is MySQL-backed. Explicitly save a regenerated session
// before redirecting, otherwise a very fast next request can arrive before
// the new cashier login has reached MySQL.
function regenerateAndSaveSession(req, res, values, destination, failureTitle) {
  req.session.regenerate((regenerateError) => {
    if (regenerateError) {
      return res.status(500).render('error', { title: failureTitle, detail: regenerateError.message });
    }
    Object.assign(req.session, values);
    return req.session.save((saveError) => {
      if (saveError) {
        return res.status(500).render('error', { title: failureTitle, detail: saveError.message || String(saveError) });
      }
      return res.redirect(destination);
    });
  });
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

function labelRequests(body) {
  return [...new Set(asArray(body.productId).map(Number).filter((id) => Number.isInteger(id) && id > 0))]
    .map((id) => ({
      id,
      copies: 1
    }));
}

function saleRows(body) {
  const productIds = asArray(body.productId);
  const saleItemIds = asArray(body.saleItemId);
  const barcodes = asArray(body.barcode);
  const weights = asArray(body.weight);
  const metalRates = asArray(body.metalRate);
  const makingTypes = asArray(body.makingChargeType);
  const makingValues = asArray(body.makingChargeValue);
  const taxableAmounts = asArray(body.taxableAmount);
  const purities = asArray(body.purity);
  const hsnCodes = asArray(body.hsnCode);
  const huidCodes = asArray(body.huidCode);
  const count = Math.max(productIds.length, saleItemIds.length, barcodes.length);
  const rows = [];
  for (let index = 0; index < count; index++) {
    const productId = Number(productIds[index]) || null;
    const saleItemId = Number(saleItemIds[index]) || null;
    if (!productId && !saleItemId) continue;
    rows.push({
      productId: productId > 0 ? productId : null,
      saleItemId: saleItemId > 0 ? saleItemId : null,
      barcode: String(barcodes[index] || '').trim().toUpperCase(),
      // Each inventory row is one physical jewellery piece and therefore one
      // barcode. Quantity is deliberately fixed at one server-side; a modified
      // browser form must never turn a single barcode into several sold pieces.
      quantity: 1,
      weight: weights[index] === undefined || weights[index] === '' ? null : number(weights[index]),
      metalRate: number(metalRates[index]),
      makingChargeType: ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(makingTypes[index]) ? makingTypes[index] : null,
      makingChargeValue: makingValues[index] === undefined || makingValues[index] === '' ? null : number(makingValues[index]),
      taxableAmount: taxableAmounts[index] === '' || taxableAmounts[index] === undefined ? null : Math.max(0, number(taxableAmounts[index])),
      purity: purities[index] === undefined ? null : String(purities[index] || '').trim().toUpperCase() || null,
      hsnCode: (hsnCodes[index] || '').trim() || null,
      huidCode: (huidCodes[index] || '').trim() || null
    });
  }
  return rows;
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

function stockMovementSnapshot(product, type, quantity, note, overrides = {}) {
  return {
    productId: product.id,
    productBarcode: product.barcode || null,
    productSku: product.sku || '',
    productName: product.name || '',
    productMetal: product.metal || null,
    productPurity: product.purity || null,
    // Billing permits a final negotiated net weight. Keep the immutable stock
    // movement snapshot aligned with the SaleItem/PDF rather than silently
    // recording the older inventory weight.
    netWeight: overrides.netWeight ?? product.netWeight ?? 0,
    type,
    quantity,
    note
  };
}

function expectsJson(req) {
  return req.path.startsWith('/api/')
    || Boolean(req.xhr)
    || String(req.headers.accept || '').includes('application/json');
}

function generatedReference(prefix, value = new Date()) {
  const dateKey = dateInput(value).replaceAll('-', '');
  const nonce = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `${prefix}-${dateKey}-${nonce}`;
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
    where: { customerId, cancelledAt: null, balance: { gt: 0 } },
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
  // Billing customer details are stored in a consistent print-ready form even
  // when a request is submitted without the browser's title-case formatting.
  const name = titleCase(body.customerName);
  if (!name) throw new Error('This mobile number is new. Enter the customer name to create their customer ledger.');
  return tx.customer.create({ data: {
    phone, name, email: String(body.customerEmail || '').trim() || null,
    address: titleCase(body.customerAddress) || null,
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
        available: null,
        name: `TCP ${printer.host || 'printer IP'}:${printer.port || 9100}`,
        message: 'Direct TCP printer is configured. No automatic connection check is run; printing sends native TSPL directly to the printer.',
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
  const enteredUsername = String(req.body.username || '').trim();
  const configuredUsername = String(process.env.AUTH_USERNAME || '').trim();
  const usernameOk = Boolean(enteredUsername) && Boolean(configuredUsername) && (
    secureTextMatch(enteredUsername, configuredUsername) ||
    secureTextMatch(enteredUsername.toLowerCase(), configuredUsername.toLowerCase())
  );
  const passwordOk = passwordMatchesEnvironment(req.body.password, process.env);
  if (!usernameOk || !passwordOk) return redirectWith(res, '/login', 'error', 'Incorrect username or password.');

  if (usesKnownDefaultPassword(process.env)) {
    return regenerateAndSaveSession(req, res, {
      pendingPasswordChange: true,
      username: process.env.AUTH_USERNAME
    }, '/change-password?message=Choose your own ERP password before continuing.', 'Sign-in failed');
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
  return regenerateAndSaveSession(req, res, {
    authenticated: true,
    username: process.env.AUTH_USERNAME
  }, '/', 'Sign-in failed');
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
    const configuredUser = String(process.env.AUTH_USERNAME || '').trim().toLowerCase();
    if (configuredUser === 'kusum' && secureTextMatch(newPassword, 'kusum@123')) {
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
    return regenerateAndSaveSession(req, res, {
      authenticated: true,
      username: process.env.AUTH_USERNAME
    }, '/?message=ERP login password changed securely.', 'Password change failed');
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

app.get('/network-setup', requireLoopback, (req, res, next) => {
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

app.post('/network-setup', requireLoopback, async (req, res, next) => {
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

app.get('/printer-setup', requireLoopback, (req, res) => {
  res.render('printer-setup', { title: 'Barcode printer setup', printer: configuredLabelPrinter() });
});

app.post('/printer-setup', requireLoopback, (req, res) => {
  const returnTo = req.body.returnTo === '/inventory' ? '/inventory' : '/printer-setup';
  try {
    const values = updatePrinterConfiguration({ configPath, currentEnv: process.env, form: req.body });
    Object.assign(process.env, values);
    redirectWith(res, returnTo, 'message', values.TSC_PRINTER_MODE === 'TCP'
      ? `Direct TCP printer saved: ${values.TSC_PRINTER_HOST}:${values.TSC_PRINTER_PORT}. Use Test TSC to verify the printer.`
      : `Windows printer saved: ${values.TSC_PRINTER_NAME}. Use Test TSC to verify the printer.`);
  } catch (error) {
    redirectWith(res, returnTo, 'error', error.message || 'Could not save barcode printer settings.');
  }
});

app.get('/data-management', (req, res, next) => {
  try {
    const selectedResource = req.query.resource || 'sales';
    const resource = resourceFor(selectedResource);
    const range = parseDateRange(req.query);
    res.render('data-management/index', { title: 'Data export & archive', resources: RESOURCE_LIST, selectedResource, resource, range });
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

app.post('/data/archive', requireLoopback, async (req, res) => {
  let resource;
  let range;
  try {
    resource = resourceFor(req.body.resource);
    range = parseDateRange(req.body);
    if (req.body.archiveAcknowledged !== 'on' || String(req.body.archiveConfirm || '').trim().toUpperCase() !== 'DELETE') {
      throw new Error('Tick the confirmation box and type DELETE before permanently removing data.');
    }
    const result = await archiveData(prisma, resource.key, range);
    const skipped = result.skipped ? ` ${result.skipped} protected record${result.skipped === 1 ? '' : 's'} kept.` : '';
    const note = result.note ? ` ${result.note}` : '';
    redirectWith(res, `/data-management?resource=${resource.key}&from=${range.from}&to=${range.to}`, 'message', `${result.deleted} ${resource.label.toLowerCase()} record${result.deleted === 1 ? '' : 's'} permanently deleted.${skipped}${note}`);
  } catch (error) {
    const query = new URLSearchParams({ resource: resource?.key || req.body.resource || 'sales', from: range?.from || req.body.from || '', to: range?.to || req.body.to || '', error: error.message || 'Could not remove data.' });
    res.redirect(`/data-management?${query.toString()}`);
  }
});

app.get('/', async (req, res, next) => {
  try {
    const today = startOfToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayKey = dateInput(today);
    const [productCount, stockSummaryRows, itemBreakdownRows, todaySales, lowStock, recentSales, todayCashbook, customerDue, topSellingRows] = await Promise.all([
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
      prisma.sale.aggregate({ where: { cancelledAt: null, saleDate: { gte: today, lt: tomorrow } }, _sum: { total: true, paid: true, balance: true, urdOffset: true }, _count: true }),
      prisma.product.findMany({ where: { quantity: { lte: 1 }, status: 'AVAILABLE' }, orderBy: { quantity: 'asc' }, take: 6 }),
      prisma.sale.findMany({ where: { cancelledAt: null }, include: { customer: true }, orderBy: { saleDate: 'desc' }, take: 6 }),
      prisma.cashbookEntry.groupBy({ by: ['type'], where: { entryDate: todayKey }, _sum: { amount: true } }),
      prisma.customerLedger.aggregate({ _sum: { amount: true } }),
      prisma.$queryRaw`
        SELECT
          COALESCE(NULLIF(si.productName, ''), 'Jewellery item') AS name,
          COALESCE(si.productMetal, 'OTHER') AS metal,
          COALESCE(si.productPurity, '') AS purity,
          SUM(si.quantity) AS quantity,
          SUM(si.lineTotal) AS billed
        FROM \`SaleItem\` si
        INNER JOIN \`Sale\` s ON s.id = si.saleId
        WHERE s.cancelledAt IS NULL AND s.saleDate >= ${today} AND s.saleDate < ${tomorrow}
        GROUP BY
          COALESCE(NULLIF(si.productName, ''), 'Jewellery item'),
          COALESCE(si.productMetal, 'OTHER'),
          COALESCE(si.productPurity, '')
        ORDER BY billed DESC
        LIMIT 1
      `
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
    const inventoryByMetal = stockSummaryRows.map((row) => ({
      metal: row.metal,
      pieces: Number(row.pieces || 0),
      weight: Number(row.weight || 0)
    }));
    const topSellingItem = topSellingRows[0] ? {
      name: topSellingRows[0].name,
      metal: topSellingRows[0].metal,
      purity: topSellingRows[0].purity || null,
      quantity: Number(topSellingRows[0].quantity || 0),
      billed: Number(topSellingRows[0].billed || 0)
    } : null;
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
        customerDue: Math.max(0, Number(customerDue._sum.amount || 0)),
        amountCollected: Number(todaySales._sum.paid || 0)
      },
      lowStock,
      recentSales,
      itemWeightBreakdown,
      inventoryByMetal,
      topSellingItem
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
      create: { rateDate, gold22k, gold24k, silver, note: req.body.note ? String(req.body.note).trim().toUpperCase() : null },
      update: { gold22k, gold24k, silver, note: req.body.note ? String(req.body.note).trim().toUpperCase() : null }
    });
    redirectWith(res, `/rates?date=${rateDate}`, 'message', `Rates saved for ${rateDate}.`);
  } catch (error) { next(error); }
});

app.get('/inventory', async (req, res, next) => {
  try {
    const filters = {
      itemName: String(req.query.itemName || req.query.q || '').trim(),
      weight: String(req.query.weight || '').trim(),
      barcode: String(req.query.barcode || '').trim()
    };
    const availableStock = { status: 'AVAILABLE', quantity: { gt: 0 } };
    const searchClauses = productSearchClauses(filters);
    const where = searchClauses.length ? { AND: [availableStock, ...searchClauses] } : availableStock;
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
    res.render('inventory/index', { title: 'Inventory', products, filters, pagination, printerName: printerStatus.name || printerTransport.name, printerStatus, printerTransport });
  } catch (error) { next(error); }
});

app.post('/labels/test-print', async (req, res) => {
  try {
    const printerTransport = configuredLabelPrinter();
    if (printerTransport.mode === 'WINDOWS' && !printerTransport.name) {
      throw new Error('Set the installed Windows printer name before sending labels.');
    }
    const printerName = printerTransport.mode === 'TCP'
      ? `TCP ${printerTransport.host}:${printerTransport.port}`
      : printerTransport.name;
    const tspl = buildTsplJob([{ product: {
      metal: 'GOLD', barcode: 'TSC TEST', name: 'PRINTER TEST',
      grossWeight: 0, stoneWeight: 0, netWeight: 0
    } }]);
    const result = await sendTsplToPrinter(printerTransport, tspl);
    redirectWith(res, '/inventory', 'message', `TSC test label ${printerTransport.mode === 'TCP' ? 'sent to' : 'queued to'} ${printerName}. ${result}`);
  } catch (error) {
    redirectWith(res, '/inventory', 'error', error.message || 'Could not send the TSC test label.');
  }
});

// Run printer checks only on demand. Page rendering must stay fast when the
// printer is disconnected or its Windows queue is slow to respond.
app.get('/api/printer/check', async (req, res) => {
  try {
    const status = await resolveLabelPrinter(true);
    res.json({ success: true, status });
  } catch (error) {
    res.status(503).json({ success: false, error: error.message || 'Could not check the configured label printer.' });
  }
});

app.post('/labels/print', express.json(), async (req, res, next) => {
  const isJson = req.is('json') || req.headers['content-type']?.includes('application/json') || req.body?.isJson;
  try {
    let requests;
    if (req.body.batchDocNo) {
      const batchDocProducts = await prisma.product.findMany({
        where: { batchDocNo: String(req.body.batchDocNo).trim(), status: 'AVAILABLE', quantity: 1 },
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
    const printerName = printerTransport.mode === 'TCP'
      ? `TCP ${printerTransport.host}:${printerTransport.port}`
      : printerTransport.name;
    const products = await prisma.product.findMany({
      where: { id: { in: requests.map((row) => row.id) }, status: 'AVAILABLE', quantity: 1 }
    });
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
    const result = await sendTsplToPrinter(printerTransport, tspl);
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

// A batch document is allocated atomically with its first physical piece. A
// page open/cancel must never consume a document number or merge two PCs into
// a pre-reserved batch.
app.all(['/api/inventory/batch-docs/reserve', '/api/inventory/batch-docs/next'], (req, res) => {
  res.status(410).json({ error: 'Refresh Batch Add. The batch number is assigned when the first piece is saved.' });
});

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
    const name = titleCase(req.body.name);
    const category = titleCase(req.body.category);
    const metal = ['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER'].includes(req.body.metal) ? req.body.metal : 'SILVER';
    const purity = metal === 'SILVER' ? null : (req.body.purity || null);
    const grossWeight = Math.max(0, number(req.body.grossWeight));
    const stoneWeight = Math.max(0, number(req.body.stoneWeight));
    const netWeight = number(req.body.netWeight) > 0 ? number(req.body.netWeight) : Math.max(0, grossWeight - stoneWeight);
    const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : 'PER_GRAM';
    const makingChargeValue = number(req.body.makingChargeValue);
    const location = req.body.location ? String(req.body.location).trim().toUpperCase() : null;
    const requestedBatchDocNo = req.body.batchDocNo ? String(req.body.batchDocNo).trim() : null;
    const notes = req.body.notes ? String(req.body.notes).trim().toUpperCase() : null;

    if (!name) return res.status(400).json({ error: 'Item name is required.' });
    if (!category) return res.status(400).json({ error: 'Category is required.' });
    if (netWeight <= 0) return res.status(400).json({ error: 'Net weight must be greater than 0.' });

    const product = await prisma.$transaction(async (tx) => {
      // A batch number is assigned only while saving the first piece.  This
      // keeps it atomic across counter PCs: two empty batch dialogs cannot
      // accidentally receive the same document number.
      const existingBatch = requestedBatchDocNo
        ? await tx.product.findFirst({
          where: { batchDocNo: requestedBatchDocNo, status: 'AVAILABLE', quantity: 1 },
          select: { id: true }
        })
        : null;
      const batchDocNo = existingBatch ? requestedBatchDocNo : await nextBatchDocumentNumber(tx);
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
          'Opening stock'
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
      if (metal !== existing.metal) {
        throw new Error(`Metal cannot be changed after barcode ${existing.barcode || 'generation'}. Delete the unsold item and add it again so its barcode remains correct.`);
      }
      const requestedPurity = req.body.purity !== undefined ? req.body.purity : existing.purity;
      const purity = metal === 'SILVER' ? null : requestedPurity;
      const name = req.body.name ? titleCase(req.body.name) : existing.name;
      const category = req.body.category ? titleCase(req.body.category) : existing.category;
      const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : existing.makingChargeType;
      const makingChargeValue = req.body.makingChargeValue !== undefined ? number(req.body.makingChargeValue) : Number(existing.makingChargeValue);
      const location = req.body.location !== undefined ? (req.body.location ? String(req.body.location).trim().toUpperCase() : null) : existing.location;

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

      await upsertItemName(tx, name, category, { updateCategory: false });

      return {
        ...product,
        formattedSellingPrice: money(suggestedPrice),
        formattedNetWeight: grams(netWeight),
        formattedGrossWeight: grams(grossWeight || netWeight)
      };
    });

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
    const enrolledPlan = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.findUnique({ where: { id }, select: { batchDocNo: true } });
      batchDocNo = prod?.batchDocNo || null;
      await tx.stockMovement.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
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
    const reorderLevel = req.body.reorderLevel !== undefined && req.body.reorderLevel !== ''
      ? Math.max(0, Math.floor(number(req.body.reorderLevel, 0)))
      : 0;
    const product = await prisma.$transaction(async (tx) => {
      const rateInfo = await getRateForDate(tx);
      const metal = ['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER'].includes(req.body.metal) ? req.body.metal : 'GOLD';
      const purity = metal === 'SILVER' ? null : (req.body.purity || null);
      const itemName = titleCase(req.body.name);
      const category = titleCase(req.body.category);
      const netWeight = number(req.body.netWeight);
      if (netWeight <= 0) throw new Error('Net weight must be greater than zero.');
      const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : 'PER_GRAM';
      const makingChargeValue = number(req.body.makingChargeValue);
      const metalAmount = metalRateFromDailyRate({ metal, purity }, rateInfo.rate) * netWeight;
      const suggestedPrice = metalAmount + makingAmount(makingChargeType, makingChargeValue, metalAmount, netWeight);
      const barcode = await nextBarcode(tx, metal, purity);
      const product = await tx.product.create({
        data: {
          barcode,
          sku: (req.body.sku || barcode.replaceAll(' ', '-')).trim().toUpperCase(), name: itemName, category,
          metal, purity,
          grossWeight: number(req.body.grossWeight), stoneWeight: number(req.body.stoneWeight), netWeight,
          // One record always represents one physical piece. Identical name,
          // metal and weight still receive a different database-reserved code.
          quantity: 1, reorderLevel,
          purchasePrice: number(req.body.purchasePrice), sellingPrice: suggestedPrice,
          makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
          makingChargeType, makingChargeValue, location: req.body.location ? String(req.body.location).trim().toUpperCase() : null,
          notes: req.body.notes ? String(req.body.notes).trim().toUpperCase() : null, status: 'AVAILABLE'
        }
      });
      await tx.stockMovement.create({ data: stockMovementSnapshot(product, 'OPENING', 1, `Opening stock · ${barcode}`) });
      // Auto-register item name in the master list for future autocomplete
      await upsertItemName(tx, itemName, category, { updateCategory: false });
      return product;
    });
    redirectWith(res, '/inventory', 'message', `${product.barcode} saved to inventory.`);
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, '/inventory/new', 'error', 'Barcode already exists.');
    next(error);
  }
});

app.get('/inventory/:id/edit', async (req, res, next) => {
  try {
    const [product, rateInfo] = await Promise.all([
      prisma.product.findUniqueOrThrow({ where: { id: Number(req.params.id) } }),
      getRateForDate(prisma)
    ]);
    res.render('inventory/form', { title: `Edit ${product.barcode || 'item'}`, product, rateInfo });
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
      const metal = req.body.metal || existing.metal;
      if (metal !== existing.metal) {
        throw new Error(`Metal cannot be changed after barcode ${existing.barcode || 'generation'}. Delete the unsold item and add it again so its barcode remains correct.`);
      }
      const purity = metal === 'SILVER' ? null : (req.body.purity || null);
      const itemName = titleCase(req.body.name);
      const category = titleCase(req.body.category);
      const netWeight = number(req.body.netWeight);
      const makingChargeType = ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(req.body.makingChargeType) ? req.body.makingChargeType : 'PER_GRAM';
      const makingChargeValue = Math.max(0, number(req.body.makingChargeValue));
      if (netWeight <= 0) throw new Error('Net weight must be greater than zero.');
      const rateInfo = await getRateForDate(tx);
      const metalAmount = metalRateFromDailyRate({ metal, purity }, rateInfo.rate) * netWeight;
      const suggestedPrice = roundedMoney(metalAmount + makingAmount(makingChargeType, makingChargeValue, metalAmount, netWeight));
      await tx.product.update({ where: { id }, data: {
        sku: String(req.body.sku || existing.sku).trim().toUpperCase(), name: itemName, category, metal,
        purity, grossWeight: number(req.body.grossWeight), stoneWeight: number(req.body.stoneWeight), netWeight,
        reorderLevel, purchasePrice: number(req.body.purchasePrice), sellingPrice: suggestedPrice,
        makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
        makingChargeType, makingChargeValue, location: req.body.location ? String(req.body.location).trim().toUpperCase() : null, notes: req.body.notes ? String(req.body.notes).trim().toUpperCase() : null, status: 'AVAILABLE'
      } });
      await upsertItemName(tx, itemName, category, { updateCategory: false });
    });
    redirectWith(res, '/inventory', 'message', 'Item details updated.');
  } catch (error) { next(error); }
});

app.post('/inventory/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return redirectWith(res, '/inventory', 'error', 'Invalid item ID.');
    const deleted = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) return null;
      await tx.stockMovement.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
      return product;
    });
    if (!deleted) return redirectWith(res, '/inventory', 'error', 'Item not found.');
    redirectWith(res, '/inventory', 'message', `Item "${deleted.barcode || deleted.name}" deleted successfully.`);
  } catch (error) { next(error); }
});

app.post('/inventory/:id/adjust', async (req, res, next) => {
  try {
    // A stock adjustment used to increase/decrease Product.quantity. That
    // creates extra physical pieces under one barcode and later allows a sale
    // to delete more than the billed item. Keep this old endpoint harmless so
    // bookmarked pages cannot violate the one-item/one-barcode invariant.
    return redirectWith(res, '/inventory', 'error', 'Quantity adjustment is no longer available. Add each physical piece separately so every item keeps its own barcode.');
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
    const customer = await prisma.customer.create({ data: { name: titleCase(req.body.name), phone, email: req.body.email || null, address: titleCase(req.body.address) || null, panNumber: String(req.body.panNumber || '').trim().toUpperCase() || null } });
    redirectWith(res, '/customers', 'message', 'Customer added.');
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, '/customers', 'error', 'That phone number already belongs to a customer.');
    next(error);
  }
});

app.post('/customers/:id', async (req, res, next) => {
  const customerId = Number(req.params.id);
  try {
    const phone = normalizePhone(req.body.phone);
    const name = titleCase(req.body.name);
    if (!name) return redirectWith(res, `/customers/${customerId}`, 'error', 'Enter the customer name.');
    if (!validCustomerPhone(phone)) return redirectWith(res, `/customers/${customerId}`, 'error', 'Enter a valid customer mobile number (10 to 15 digits).');
    await prisma.customer.update({ where: { id: customerId }, data: {
      name, phone, email: String(req.body.email || '').trim() || null,
      address: titleCase(req.body.address) || null, panNumber: String(req.body.panNumber || '').trim().toUpperCase() || null
    } });
    redirectWith(res, `/customers/${customerId}`, 'message', 'Customer details updated across linked invoices and registers.');
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, `/customers/${customerId}`, 'error', 'That mobile number already belongs to another customer.');
    next(error);
  }
});

app.get('/customers/:id', async (req, res, next) => {
  try {
    const customerId = Number(req.params.id);
    const [customer, ledgerCount, ledgerTotal, unpaidSalesCount] = await Promise.all([
      prisma.customer.findUniqueOrThrow({
        where: { id: customerId },
        include: {
          sales: { where: { cancelledAt: null }, orderBy: { saleDate: 'desc' }, take: 10 },
          schemeEnrollments: {
            include: { schemePlan: true },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: 20
          }
        }
      }),
      prisma.customerLedger.count({ where: { customerId } }),
      prisma.customerLedger.aggregate({ where: { customerId }, _sum: { amount: true } }),
      prisma.sale.count({ where: { customerId, cancelledAt: null, balance: { gt: 0 } } })
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
      const receipt = req.body.reference?.trim() || generatedReference('RCPT');
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
    const name = titleCase(req.body.name);
    const category = titleCase(req.body.category);
    if (!name || !category) return res.status(400).json({ error: 'Name and category are required.' });
    const item = await upsertItemName(prisma, name, category, { returnItem: true });
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
    const name = titleCase(req.body.name);
    const category = titleCase(req.body.category);
    if (!name || !category) return redirectWith(res, '/item-names', 'error', 'Name and category are required.');
    await upsertItemName(prisma, name, category);
    redirectWith(res, '/item-names', 'message', `"${name}" added.`);
  } catch (error) { next(error); }
});

app.post('/item-names/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = titleCase(req.body.name);
    const category = titleCase(req.body.category);
    if (!name || !category) return redirectWith(res, '/item-names', 'error', 'Name and category are required.');
    await prisma.itemName.update({ where: { id }, data: { name, category } });
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
    redirectWith(res, '/item-names', 'message', `"${item.name}" deleted.`);
  } catch (error) { next(error); }
});

app.get('/sales', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const from = req.query.from || '';
    const to = req.query.to || '';
    const where = { cancelledAt: null };
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
      include: { customer: true, urdPurchase: true, _count: { select: { items: true } } },
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
    if (product.quantity <= 0 || product.status !== 'AVAILABLE') return res.status(409).json({ error: `${product.barcode} is not available in stock.` });
    const rateInfo = await getRateForDate(prisma, req.query.date || dateInput());
    const metalRate = metalRateFromDailyRate(product, rateInfo.rate);
    // Always return the product — let the user set the rate manually if needed
    res.json({
      product: {
        id: product.id, barcode: product.barcode, name: product.name, category: product.category,
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

// Forms that need an existing customer search on demand rather than loading
// the entire customer directory (which becomes slow after several years).
app.get('/api/customers/search', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ customers: [] });
    const customers = await prisma.customer.findMany({
      where: { OR: [
        { name: { contains: q } },
        { phone: { contains: normalizePhone(q) || q } },
        { email: { contains: q } }
      ] },
      select: { id: true, name: true, phone: true },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      take: 20
    });
    res.json({ customers });
  } catch (error) { next(error); }
});

app.get('/sales/new', async (req, res, next) => {
  try {
    const rateInfo = await getRateForDate(prisma);
    // Invoice number allocation happens in the save transaction. Merely
    // opening or cancelling a bill cannot consume a number.
    res.render('sales/form', { title: 'New sale', invoiceNumber: '', rateInfo });
  } catch (error) { next(error); }
});

app.post('/sales', async (req, res, next) => {
  try {
    const rows = saleRows(req.body);
    if (!rows.length) return redirectWith(res, '/sales/new', 'error', 'Enter at least one scanned barcode.');
    if (new Set(rows.map((row) => row.productId)).size !== rows.length) {
      return redirectWith(res, '/sales/new', 'error', 'The same barcode was entered more than once. Each physical item can be billed only once.');
    }
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
        if (product.status !== 'AVAILABLE') throw new Error(`${product.barcode} is not available for sale.`);
        if (Number(product.quantity) !== 1) {
          throw new Error(`${product.barcode} is a legacy combined-stock record. Split it into individual barcode pieces before billing so no unbilled piece is removed.`);
        }
        const submittedRows = rows.filter((row) => row.productId === product.id);
        if (submittedRows.some((row) => row.barcode && ![product.barcode].filter(Boolean).map((value) => String(value).toUpperCase()).includes(row.barcode))) {
          throw new Error('A barcode changed before the bill was saved. Scan the item again to prevent billing the wrong piece.');
        }
        const requested = rows.filter((row) => row.productId === product.id).reduce((total, row) => total + row.quantity, 0);
        if (requested !== 1) throw new Error(`${product.barcode} must be billed as exactly one physical piece.`);
      }
      const pricedRows = rows.map((row) => {
        const product = products.find((item) => item.id === row.productId);
        const weight = row.weight === null ? Number(product.netWeight) : row.weight;
        if (!Number.isFinite(weight) || weight <= 0) {
          throw new Error(`Enter a valid billing weight for ${product.barcode}.`);
        }
        const defaultRate = metalRateFromDailyRate(product, rateInfo.rate);
        const metalRate = row.metalRate > 0 ? row.metalRate : defaultRate;
        if (!metalRate) throw new Error(`Set a daily rate before billing ${product.barcode}.`);
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
      // Round only once, after GST. This is the invoice-level amount used for
      // every payment validation, customer balance, cashbook entry and PDF.
      // Example: Rs. 1.80 becomes Rs. 2.00; Rs. 1.10 becomes Rs. 1.00.
      const total = roundToNearestRupee(roundedMoney(taxable + gstAmount));
      const customer = await resolveBillingCustomer(tx, req.body);
      const customerId = customer.id;
      const customerPan = String(req.body.customerPan || req.body.existingCustomerPan || customer.panNumber || '').trim().toUpperCase() || null;
      const urdAmount = includeUrdPurchase ? Math.max(0, roundedMoney(number(req.body.urdTotalAmount))) : 0;
      const settlement = urdSettlement(total, urdAmount);
      let refundMethod = null;
      if (includeUrdPurchase) {
        if (!customerId) throw new Error('Select the customer before settling their URD purchase against this bill.');
        if (number(req.body.urdNetWeight) <= 0 || number(req.body.urdRatePerGram) <= 0 || urdAmount <= 0) {
          throw new Error('Enter valid URD net weight, rate and purchase amount.');
        }
        if (settlement.hasRefund) refundMethod = receiptPaymentMethod(req.body.urdRefundMethod);
      }
      if (settlement.hasRefund && payment.paid > 0) {
        throw new Error('Do not enter a sale payment when URD value is higher than the bill. Select the refund method instead.');
      }
      const netPayable = settlement.netPayable;
      if (payment.paid > netPayable) throw new Error(`Payment is greater than the net payable amount of ${money(netPayable)}.`);
      const acceptedPaid = payment.paid;
      const balance = roundedMoney(Math.max(0, netPayable - acceptedPaid));
      const sale = await tx.sale.create({ data: {
        invoiceNumber: await nextDocumentNumber(tx, 'INV', saleDate), customerId, customerPan, saleDate,
        subtotal, discount: appliedDiscount, gstRate, gstAmount, total, urdOffset: urdAmount, paid: acceptedPaid,
        cashPaid: payment.cashPaid, upiPaid: payment.upiPaid, cardPaid: payment.cardPaid, bankPaid: payment.bankPaid, balance,
        paymentMethod: payment.paymentMethod, notes: req.body.notes ? String(req.body.notes).trim().toUpperCase() : null,
        items: { create: pricedRows.map((row) => ({
          productId: row.productId, productBarcode: row.product.barcode, productSku: row.product.sku,
          productName: row.product.name, productMetal: row.product.metal, productPurity: row.purity ? String(row.purity).trim().toUpperCase() : (row.product.purity ? String(row.product.purity).trim().toUpperCase() : null),
          grossWeight: row.product.grossWeight, quantity: row.quantity, weight: row.weight, unitPrice: row.metalRate,
          metalRate: row.metalRate, metalAmount: row.metalAmount, makingCharge: row.makingCharge,
          makingChargeType: row.makingChargeType, makingChargeValue: row.makingChargeValue,
          taxableAmount: row.taxableAmount, lineTotal: row.taxableAmount,
          hsnCode: row.hsnCode ? String(row.hsnCode).trim().toUpperCase() : null,
          huidCode: row.huidCode ? String(row.huidCode).trim().toUpperCase() : null
        })) }
      } });
      if (balance > 0) await tx.customerLedger.create({
        data: { customerId, saleId: sale.id, type: 'SALE_CREDIT', amount: balance, reference: sale.invoiceNumber, note: `Credit balance from ${sale.invoiceNumber}` }
      });
      if (includeUrdPurchase) {
        const urdPurchase = await tx.urdPurchase.create({ data: {
          purchaseNumber: await nextDocumentNumber(tx, 'URD', saleDate), customerId, purchaseDate: saleDate,
          metal: req.body.urdMetal || 'GOLD', purity: req.body.urdPurity ? String(req.body.urdPurity).trim().toUpperCase() : null,
          grossWeight: number(req.body.urdGrossWeight), netWeight: number(req.body.urdNetWeight),
          ratePerGram: number(req.body.urdRatePerGram), totalAmount: urdAmount, saleOffset: settlement.saleAdjustment,
          paid: settlement.netRefundable, paymentMethod: refundMethod || 'MIXED', description: req.body.urdDescription ? String(req.body.urdDescription).trim().toUpperCase() : 'URD PURCHASE SETTLED AGAINST SALE',
          notes: `Settled against sale ${sale.invoiceNumber}`, saleId: sale.id
        } });
        if (settlement.hasRefund) {
          await tx.cashbookEntry.create({ data: {
            entryDate: dateInput(saleDate), type: 'OUT', paymentMethod: refundMethod, amount: settlement.netRefundable,
            description: `URD refund — ${sale.invoiceNumber}`, reference: sale.invoiceNumber, customerId,
            urdPurchaseId: urdPurchase.id, syncLedger: false,
            notes: `URD excess refunded for sale ${sale.invoiceNumber}`
          } });
        }
      }
      if (acceptedPaid > 0) {
        for (const recordedPayment of payment.cashbookPayments) {
          await tx.cashbookEntry.create({ data: {
             entryDate: dateInput(saleDate), type: 'IN', paymentMethod: recordedPayment.method, amount: recordedPayment.amount,
             description: 'Sale payment', reference: sale.invoiceNumber, customerId, syncLedger: Boolean(customerId),
             saleId: sale.id,
             notes: req.body.notes || null
          } });
        }
      }
      for (const product of products) {
        const saleRow = pricedRows.find((row) => row.productId === product.id);
        const quantitySold = saleRow.quantity;
        await tx.stockMovement.create({
          data: stockMovementSnapshot(product, 'SALE', -quantitySold, `Sold via ${sale.invoiceNumber}`, { netWeight: saleRow.weight })
        });
        // One barcode represents one physical jewellery item. Once that barcode
        // appears on a committed bill, remove its inventory row permanently.
        // SaleItem and StockMovement snapshots preserve all historical details.
        await tx.product.delete({ where: { id: product.id } });
      }
      return sale;
    });
    // Mark only a newly created sale so the invoice screen can clear the local
    // in-progress billing draft. Reopening an older invoice must not discard a
    // cashier's unfinished new bill.
    redirectWith(res, `/sales/${sale.id}?newSale=1`, 'message', 'Sale saved, stock removed and customer credit updated.');
  } catch (error) { redirectWith(res, '/sales/new', 'error', error.message || 'Could not save sale.'); }
});

app.get('/sales/:id/edit', async (req, res, next) => {
  try {
    const sale = await prisma.sale.findFirstOrThrow({
      where: { id: Number(req.params.id), cancelledAt: null },
      include: {
        customer: true,
        items: { orderBy: { id: 'asc' } },
        urdPurchase: true,
        ledgerEntries: {
          where: { type: 'PAYMENT_RECEIVED' },
          select: { amount: true, paymentMethod: true }
        }
      }
    });
    const laterComponents = { CASH: 0, UPI: 0, CARD: 0, BANK_TRANSFER: 0 };
    for (const entry of sale.ledgerEntries) {
      if (entry.paymentMethod in laterComponents) {
        laterComponents[entry.paymentMethod] = roundedMoney(laterComponents[entry.paymentMethod] + Math.abs(Number(entry.amount || 0)));
      }
    }
    const initialComponents = {
      CASH: Math.max(0, roundedMoney(Number(sale.cashPaid || 0) - laterComponents.CASH)),
      UPI: Math.max(0, roundedMoney(Number(sale.upiPaid || 0) - laterComponents.UPI)),
      CARD: Math.max(0, roundedMoney(Number(sale.cardPaid || 0) - laterComponents.CARD)),
      BANK_TRANSFER: Math.max(0, roundedMoney(Number(sale.bankPaid || 0) - laterComponents.BANK_TRANSFER))
    };
    const initialPaid = roundedMoney(Object.values(initialComponents).reduce((sum, amount) => sum + amount, 0));
    const rateInfo = await getRateForDate(prisma, dateInput(sale.saleDate));
    const editSale = {
      id: sale.id,
      invoiceNumber: sale.invoiceNumber,
      saleDate: dateInput(sale.saleDate),
      customer: sale.customer ? {
        name: sale.customer.name || '',
        phone: sale.customer.phone || '',
        email: sale.customer.email || '',
        address: sale.customer.address || '',
        panNumber: sale.customer.panNumber || sale.customerPan || ''
      } : {
        name: '',
        phone: '',
        email: '',
        address: '',
        panNumber: sale.customerPan || ''
      },
      discount: Number(sale.discount || 0),
      notes: sale.notes || '',
      initialPayment: {
        paid: initialPaid,
        cashPaid: initialComponents.CASH,
        upiPaid: initialComponents.UPI,
        cardPaid: initialComponents.CARD,
        bankPaid: initialComponents.BANK_TRANSFER,
        paymentMethod: initialPaid === 0 ? 'CREDIT' : paymentMethodFromComponents(initialComponents, initialPaid)
      },
      items: sale.items.map((item) => {
        const grossWeight = Number(item.grossWeight || 0);
        const weight = Number(item.weight || 0) > 0 ? Number(item.weight) : grossWeight;
        const metalRate = Number(item.metalRate || 0) > 0 ? Number(item.metalRate) : Number(item.unitPrice || 0);
        const taxableAmount = Number(item.taxableAmount || 0) > 0 ? Number(item.taxableAmount) : Number(item.lineTotal || 0);
        return {
          saleItemId: item.id,
          barcode: item.productBarcode || '',
          sku: item.productSku || '',
          name: item.productName || 'Jewellery item',
          category: '',
          metal: item.productMetal || 'OTHER',
          purity: item.productPurity || '',
          grossWeight: Math.max(grossWeight, weight),
          weight,
          metalRate,
          makingChargeType: item.makingChargeType || 'PER_GRAM',
          makingChargeValue: Number(item.makingChargeValue || 0),
          taxableAmount,
          hsnCode: item.hsnCode || '',
          huidCode: item.huidCode || ''
        };
      }),
      urd: sale.urdPurchase ? {
        metal: sale.urdPurchase.metal,
        purity: sale.urdPurchase.purity || '',
        grossWeight: Number(sale.urdPurchase.grossWeight || 0),
        netWeight: Number(sale.urdPurchase.netWeight || 0),
        ratePerGram: Number(sale.urdPurchase.ratePerGram || 0),
        totalAmount: Number(sale.urdPurchase.totalAmount || 0),
        description: sale.urdPurchase.description || '',
        paymentMethod: sale.urdPurchase.paymentMethod || 'CASH'
      } : null
    };
    res.render('sales/form', { title: `Edit ${sale.invoiceNumber}`, invoiceNumber: sale.invoiceNumber, rateInfo, editSale });
  } catch (error) { next(error); }
});

app.post('/sales/:id/edit', async (req, res, next) => {
  const saleId = Number(req.params.id);
  try {
    const rows = saleRows(req.body);
    if (!rows.length) throw new Error('Keep at least one item on the invoice. A sold barcode is never restored to inventory.');
    const allBarcodes = rows.map((row) => row.barcode).filter(Boolean);
    if (new Set(allBarcodes).size !== allBarcodes.length) {
      throw new Error('The same barcode was entered more than once on this invoice.');
    }
    const newProductIds = rows.filter((row) => !row.saleItemId).map((row) => row.productId);
    if (newProductIds.some((id) => !Number.isInteger(id) || id <= 0) || new Set(newProductIds).size !== newProductIds.length) {
      throw new Error('Each newly added barcode must be a different available inventory item.');
    }
    const discount = Math.max(0, number(req.body.discount));
    const payment = salePaymentBreakdown(req.body);
    const saleDate = dateTimeFromInput(req.body.saleDate);
    const includeUrdPurchase = req.body.includeUrdPurchase === 'on';

    await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findFirstOrThrow({
        where: { id: saleId, cancelledAt: null },
        include: { customer: true, items: true, urdPurchase: true }
      });

      const name = titleCase(req.body.customerName);
      const phone = normalizePhone(req.body.customerPhone);
      if (!name) throw new Error('Enter the customer name.');
      if (!validCustomerPhone(phone)) throw new Error('Enter a valid customer mobile number (10 to 15 digits).');
      const panNumber = String(req.body.customerPan || '').trim().toUpperCase() || null;
      const email = String(req.body.customerEmail || '').trim() || null;
      const address = titleCase(req.body.customerAddress) || null;

      // Resolve customer by phone to avoid P2002 conflict and support reassigning/assigning customer
      let finalCustomerId = sale.customerId;
      const existingCustomerWithPhone = await tx.customer.findUnique({ where: { phone } });
      if (existingCustomerWithPhone) {
        finalCustomerId = existingCustomerWithPhone.id;
        await tx.customer.update({
          where: { id: existingCustomerWithPhone.id },
          data: {
            name,
            email: email || existingCustomerWithPhone.email,
            address: address || existingCustomerWithPhone.address,
            panNumber: panNumber || existingCustomerWithPhone.panNumber
          }
        });
      } else if (sale.customerId && sale.customer) {
        await tx.customer.update({
          where: { id: sale.customerId },
          data: { name, phone, email, address, panNumber }
        });
      } else {
        const newCustomer = await tx.customer.create({
          data: { name, phone, email, address, panNumber }
        });
        finalCustomerId = newCustomer.id;
      }

      if (sale.customerId && finalCustomerId !== sale.customerId) {
        await tx.customerLedger.updateMany({ where: { saleId: sale.id }, data: { customerId: finalCustomerId } });
        await tx.cashbookEntry.updateMany({ where: { saleId: sale.id }, data: { customerId: finalCustomerId } });
        if (sale.urdPurchase) {
          await tx.urdPurchase.updateMany({ where: { saleId: sale.id }, data: { customerId: finalCustomerId } });
        }
      }

      const existingItems = new Map(sale.items.map((item) => [item.id, item]));
      const submittedExistingIds = new Set();
      for (const row of rows.filter((item) => item.saleItemId)) {
        if (row.productId > 0 || !existingItems.has(row.saleItemId) || submittedExistingIds.has(row.saleItemId)) {
          throw new Error('An invoice item changed unexpectedly. Refresh this invoice before saving changes.');
        }
        const existing = existingItems.get(row.saleItemId);
        const expectedBarcode = String(existing.productBarcode || '').trim().toUpperCase();
        if (row.barcode && row.barcode !== expectedBarcode) {
          throw new Error('A previously billed barcode cannot be replaced. Remove the line and add a new available barcode instead.');
        }
        submittedExistingIds.add(row.saleItemId);
      }

      for (const productId of [...newProductIds].sort((left, right) => left - right)) {
        await tx.$queryRaw`SELECT id FROM \`Product\` WHERE id = ${productId} FOR UPDATE`;
      }
      const [newProducts, rateInfo] = await Promise.all([
        newProductIds.length ? tx.product.findMany({ where: { id: { in: newProductIds } } }) : [],
        getRateForDate(tx, dateInput(saleDate))
      ]);
      if (newProducts.length !== newProductIds.length) throw new Error('One or more newly added barcodes no longer exist. Scan them again.');
      for (const product of newProducts) {
        if (product.status !== 'AVAILABLE' || Number(product.quantity) !== 1) {
          throw new Error(`${product.barcode} is no longer available for billing.`);
        }
      }

      const pricedRows = rows.map((row) => {
        const existing = row.saleItemId ? existingItems.get(row.saleItemId) : null;
        const product = existing ? {
          id: null,
          barcode: existing.productBarcode || '',
          sku: existing.productSku || '',
          name: existing.productName || 'Jewellery item',
          metal: existing.productMetal || 'OTHER',
          purity: existing.productPurity || null,
          grossWeight: existing.grossWeight,
          netWeight: existing.weight,
          makingChargeType: existing.makingChargeType,
          makingChargeValue: existing.makingChargeValue
        } : newProducts.find((item) => item.id === row.productId);
        if (!product) throw new Error('An invoice item could not be found. Refresh this invoice before saving.');
        const weight = row.weight === null ? Number(existing?.weight ?? product.netWeight) : row.weight;
        if (!Number.isFinite(weight) || weight <= 0) throw new Error(`Enter a valid billing weight for ${product.barcode || product.name}.`);
        const savedRate = Number(existing?.metalRate || existing?.unitPrice || 0);
        const metalRate = row.metalRate > 0 ? row.metalRate : (savedRate || metalRateFromDailyRate(product, rateInfo.rate));
        if (!metalRate) throw new Error(`Set a daily rate before billing ${product.barcode || product.name}.`);
        const makingChargeType = row.makingChargeType || existing?.makingChargeType || product.makingChargeType || 'PER_GRAM';
        const makingChargeValue = row.makingChargeValue === null ? Number(existing?.makingChargeValue ?? product.makingChargeValue ?? 0) : row.makingChargeValue;
        const metalAmount = roundedMoney(metalRate * weight);
        const makingCharge = roundedMoney(makingAmount(makingChargeType, makingChargeValue, metalAmount, weight, 1));
        const calculatedTaxable = roundedMoney(metalAmount + makingCharge);
        return {
          ...row,
          existing,
          product,
          weight,
          metalRate,
          metalAmount,
          makingChargeType,
          makingChargeValue,
          makingCharge,
          taxableAmount: row.taxableAmount === null ? calculatedTaxable : roundedMoney(row.taxableAmount),
          purity: row.purity || existing?.productPurity || product.purity || null
        };
      });

      const subtotal = roundedMoney(pricedRows.reduce((sum, row) => sum + row.taxableAmount, 0));
      const appliedDiscount = roundedMoney(Math.min(discount, subtotal));
      const taxable = roundedMoney(Math.max(0, subtotal - appliedDiscount));
      const gstRate = 3;
      const gstAmount = roundedMoney(taxable * gstRate / 100);
      const total = roundToNearestRupee(roundedMoney(taxable + gstAmount));
      const urdAmount = includeUrdPurchase ? Math.max(0, roundedMoney(number(req.body.urdTotalAmount))) : 0;
      const settlement = urdSettlement(total, urdAmount);
      let refundMethod = null;
      if (includeUrdPurchase) {
        if (number(req.body.urdNetWeight) <= 0 || number(req.body.urdRatePerGram) <= 0 || urdAmount <= 0) {
          throw new Error('Enter valid URD net weight, rate and purchase amount.');
        }
        if (settlement.hasRefund) refundMethod = receiptPaymentMethod(req.body.urdRefundMethod);
      }
      if (settlement.hasRefund && payment.paid > 0) {
        throw new Error('Do not enter a sale payment when URD value is higher than the bill. Select the refund method instead.');
      }

      const laterPaymentLedger = await tx.customerLedger.findMany({
        where: { saleId: sale.id, type: 'PAYMENT_RECEIVED' },
        select: { amount: true, paymentMethod: true }
      });
      const laterComponents = { CASH: 0, UPI: 0, CARD: 0, BANK_TRANSFER: 0 };
      for (const entry of laterPaymentLedger) {
        if (entry.paymentMethod in laterComponents) {
          laterComponents[entry.paymentMethod] = roundedMoney(laterComponents[entry.paymentMethod] + Math.abs(Number(entry.amount || 0)));
        }
      }
      const laterPaid = roundedMoney(Object.values(laterComponents).reduce((sum, amount) => sum + amount, 0));
      const netPayable = settlement.netPayable;
      if (payment.paid + laterPaid > netPayable) {
        throw new Error('This edit would make recorded payments greater than the revised net payable amount. Cancel or correct the later receipt first.');
      }
      const totalPaid = roundedMoney(payment.paid + laterPaid);
      const balance = roundedMoney(Math.max(0, netPayable - totalPaid));
      const paymentComponents = {
        CASH: roundedMoney(payment.cashPaid + laterComponents.CASH),
        UPI: roundedMoney(payment.upiPaid + laterComponents.UPI),
        CARD: roundedMoney(payment.cardPaid + laterComponents.CARD),
        BANK_TRANSFER: roundedMoney(payment.bankPaid + laterComponents.BANK_TRANSFER)
      };
      const notes = req.body.notes ? String(req.body.notes).trim().toUpperCase() : null;

      if (sale.urdPurchase) {
        const urdEntries = await tx.cashbookEntry.findMany({ where: { urdPurchaseId: sale.urdPurchase.id }, select: { description: true } });
        const expectedRefundDescription = `URD refund — ${sale.invoiceNumber}`;
        if (urdEntries.some((entry) => entry.description !== expectedRefundDescription)) {
          throw new Error('This linked URD purchase has a later payout. Cancel that payout before editing this invoice.');
        }
        await tx.cashbookEntry.deleteMany({ where: { urdPurchaseId: sale.urdPurchase.id } });
      }

      await tx.cashbookEntry.deleteMany({ where: { saleId: sale.id } });
      await tx.customerLedger.deleteMany({ where: { saleId: sale.id, type: 'SALE_CREDIT' } });

      let urdPurchase = sale.urdPurchase;
      if (!includeUrdPurchase && urdPurchase) {
        await tx.urdPurchase.delete({ where: { id: urdPurchase.id } });
        urdPurchase = null;
      } else if (includeUrdPurchase && urdPurchase) {
        urdPurchase = await tx.urdPurchase.update({
          where: { id: urdPurchase.id },
          data: {
            customerId: finalCustomerId,
            purchaseDate: saleDate,
            metal: req.body.urdMetal || 'GOLD',
            purity: req.body.urdPurity || null,
            grossWeight: number(req.body.urdGrossWeight),
            netWeight: number(req.body.urdNetWeight),
            ratePerGram: number(req.body.urdRatePerGram),
            totalAmount: urdAmount,
            saleOffset: settlement.saleAdjustment,
            paid: settlement.netRefundable,
            paymentMethod: refundMethod || 'MIXED',
            description: req.body.urdDescription ? String(req.body.urdDescription).trim().toUpperCase() : 'URD purchase settled against sale',
            notes: `Settled against sale ${sale.invoiceNumber}`
          }
        });
      } else if (includeUrdPurchase) {
        urdPurchase = await tx.urdPurchase.create({
          data: {
            purchaseNumber: await nextDocumentNumber(tx, 'URD', saleDate),
            customerId: finalCustomerId,
            purchaseDate: saleDate,
            metal: req.body.urdMetal || 'GOLD',
            purity: req.body.urdPurity ? String(req.body.urdPurity).trim().toUpperCase() : null,
            grossWeight: number(req.body.urdGrossWeight),
            netWeight: number(req.body.urdNetWeight),
            ratePerGram: number(req.body.urdRatePerGram),
            totalAmount: urdAmount,
            saleOffset: settlement.saleAdjustment,
            paid: settlement.netRefundable,
            paymentMethod: refundMethod || 'MIXED',
            description: req.body.urdDescription ? String(req.body.urdDescription).trim().toUpperCase() : 'URD purchase settled against sale',
            notes: `Settled against sale ${sale.invoiceNumber}`,
            saleId: sale.id
          }
        });
      }

      await tx.sale.update({
        where: { id: sale.id },
        data: {
          customerId: finalCustomerId,
          customerPan: panNumber,
          saleDate,
          subtotal,
          discount: appliedDiscount,
          gstRate,
          gstAmount,
          total,
          urdOffset: urdAmount,
          paid: totalPaid,
          cashPaid: paymentComponents.CASH,
          upiPaid: paymentComponents.UPI,
          cardPaid: paymentComponents.CARD,
          bankPaid: paymentComponents.BANK_TRANSFER,
          balance,
          paymentMethod: totalPaid === 0 ? 'CREDIT' : paymentMethodFromComponents(paymentComponents, totalPaid),
          notes
        }
      });

      const originalCredit = roundedMoney(Math.max(0, netPayable - payment.paid));
      if (originalCredit > 0) {
        await tx.customerLedger.create({
          data: {
            customerId: finalCustomerId,
            saleId: sale.id,
            type: 'SALE_CREDIT',
            amount: originalCredit,
            reference: sale.invoiceNumber,
            note: `Credit balance from ${sale.invoiceNumber}`
          }
        });
      }
      for (const recordedPayment of payment.cashbookPayments) {
        await tx.cashbookEntry.create({
          data: {
            entryDate: dateInput(saleDate),
            type: 'IN',
            paymentMethod: recordedPayment.method,
            amount: recordedPayment.amount,
            description: 'Sale payment',
            reference: sale.invoiceNumber,
            customerId: finalCustomerId,
            saleId: sale.id,
            syncLedger: true,
            notes
          }
        });
      }
      if (urdPurchase && settlement.hasRefund) {
        await tx.cashbookEntry.create({
          data: {
            entryDate: dateInput(saleDate),
            type: 'OUT',
            paymentMethod: refundMethod,
            amount: settlement.netRefundable,
            description: `URD refund — ${sale.invoiceNumber}`,
            reference: sale.invoiceNumber,
            customerId: finalCustomerId,
            urdPurchaseId: urdPurchase.id,
            syncLedger: false,
            notes: `URD excess refunded for sale ${sale.invoiceNumber}`
          }
        });
      }

      const removedItems = sale.items.filter((item) => !submittedExistingIds.has(item.id));
      if (removedItems.length) {
        await tx.saleItem.deleteMany({ where: { id: { in: removedItems.map((item) => item.id) } } });
        for (const item of removedItems) {
          await tx.stockMovement.updateMany({
            where: { type: 'SALE', note: `Sold via ${sale.invoiceNumber}`, productBarcode: item.productBarcode || null },
            data: { type: 'ADJUSTMENT_OUT', note: `Removed from edited ${sale.invoiceNumber}; barcode remains unavailable`, createdAt: saleDate }
          });
        }
      }
      for (const row of pricedRows.filter((item) => item.existing)) {
        const itemGrossWeight = Math.max(Number(row.product.grossWeight || 0), row.weight);
        await tx.saleItem.update({
          where: { id: row.saleItemId },
          data: {
            productBarcode: row.product.barcode || null,
            productSku: row.product.sku || '',
            productName: row.product.name || 'Jewellery item',
            productMetal: row.product.metal || null,
            productPurity: row.purity ? String(row.purity).trim().toUpperCase() : null,
            grossWeight: itemGrossWeight,
            quantity: 1,
            weight: row.weight,
            unitPrice: row.metalRate,
            metalRate: row.metalRate,
            metalAmount: row.metalAmount,
            makingCharge: row.makingCharge,
            makingChargeType: row.makingChargeType,
            makingChargeValue: row.makingChargeValue,
            taxableAmount: row.taxableAmount,
            lineTotal: row.taxableAmount,
            hsnCode: row.hsnCode ? String(row.hsnCode).trim().toUpperCase() : null,
            huidCode: row.huidCode ? String(row.huidCode).trim().toUpperCase() : null
          }
        });
        await tx.stockMovement.updateMany({
          where: { type: 'SALE', note: `Sold via ${sale.invoiceNumber}`, productBarcode: row.product.barcode || null },
          data: { productName: row.product.name || '', productMetal: row.product.metal || null, productPurity: row.purity ? String(row.purity).trim().toUpperCase() : null, netWeight: row.weight, createdAt: saleDate }
        });
      }
      for (const row of pricedRows.filter((item) => !item.existing)) {
        const itemGrossWeight = Math.max(Number(row.product.grossWeight || 0), row.weight);
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: row.product.id,
            productBarcode: row.product.barcode,
            productSku: row.product.sku,
            productName: row.product.name,
            productMetal: row.product.metal,
            productPurity: row.purity ? String(row.purity).trim().toUpperCase() : null,
            grossWeight: itemGrossWeight,
            quantity: 1,
            weight: row.weight,
            unitPrice: row.metalRate,
            metalRate: row.metalRate,
            metalAmount: row.metalAmount,
            makingCharge: row.makingCharge,
            makingChargeType: row.makingChargeType,
            makingChargeValue: row.makingChargeValue,
            taxableAmount: row.taxableAmount,
            lineTotal: row.taxableAmount,
            hsnCode: row.hsnCode ? String(row.hsnCode).trim().toUpperCase() : null,
            huidCode: row.huidCode ? String(row.huidCode).trim().toUpperCase() : null
          }
        });
        await tx.stockMovement.create({
          data: { ...stockMovementSnapshot(row.product, 'SALE', -1, `Sold via ${sale.invoiceNumber}`, { netWeight: row.weight }), createdAt: saleDate }
        });
        await tx.product.delete({ where: { id: row.product.id } });
      }
    });

    redirectWith(res, `/sales/${saleId}`, 'message', 'Invoice updated. Its PDF, QR code, registers, ledger, cashbook and URD settlement now use the revised details.');
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, `/sales/${saleId}/edit`, 'error', 'That mobile number already belongs to another customer.');
    redirectWith(res, `/sales/${saleId}/edit`, 'error', error.message || 'Could not update this invoice.');
  }
});

app.post('/sales/:id/cancel', async (req, res, next) => {
  const saleId = Number(req.params.id);
  try {
    const sale = await prisma.$transaction((tx) => cancelSale(tx, saleId));
    redirectWith(res, '/sales', 'message', `${sale.invoiceNumber} cancelled. Inventory and its barcode remain permanently unavailable.`);
  } catch (error) { redirectWith(res, `/sales/${saleId}`, 'error', error.message || 'Could not cancel this invoice.'); }
});

app.get('/sales/:id', async (req, res, next) => {
  try {
    const sale = await prisma.sale.findFirstOrThrow({ where: { id: Number(req.params.id), cancelledAt: null }, include: { customer: true, urdPurchase: true, items: { include: { product: true } } } });
    res.render('sales/invoice', { title: sale.invoiceNumber, sale });
  } catch (error) { next(error); }
});

app.get('/sales/:id/invoice.pdf', async (req, res, next) => {
  try {
    const sale = await prisma.sale.findFirst({ where: { id: Number(req.params.id), cancelledAt: null }, include: { customer: true, urdPurchase: true, items: { include: { product: true } } } });
    if (!sale) return res.status(404).render('not-found', { title: 'Invoice not found' });
    await writeSaleInvoice(res, sale);
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
    const [entries, totals] = await Promise.all([
      prisma.cashbookEntry.findMany({ where, include: { customer: true }, orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }], skip: (pagination.page - 1) * pagination.pageSize, take: pagination.pageSize }),
      prisma.cashbookEntry.groupBy({
        by: ['type', 'paymentMethod'],
        where,
        _sum: { amount: true }
      })
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
    res.render('cashbook/index', { title: 'Cashbook', entries, summary, fromDate, toDate, selectedDate, methodFilter, customers: [], pagination });
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
    const description = String(req.body.description || '').trim().toUpperCase();
    if (!description) return redirectWith(res, '/cashbook', 'error', 'Enter a description for this entry.');

    await prisma.$transaction(async (tx) => {
      const receipt = req.body.reference?.trim() || generatedReference('CB');
      const cashbookEntry = await tx.cashbookEntry.create({
        data: {
          entryDate, type: entryType, paymentMethod, description, amount,
          reference: receipt, notes: req.body.notes ? String(req.body.notes).trim().toUpperCase() : null,
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
    const label = req.body.type === 'OUT' ? 'Cash out' : 'Cash in';
    const syncNote = syncLedger ? ' Customer ledger updated.' : '';
    redirectWith(res, '/cashbook', 'message', `${label} entry saved.${syncNote}`);
  } catch (error) { redirectWith(res, '/cashbook', 'error', error.message || 'Could not save entry.'); }
});

app.post('/cashbook/:id/delete', async (req, res, next) => {
  try {
    const result = await prisma.$transaction((tx) => reverseAndDeleteCashbookEntry(tx, Number(req.params.id)));
    redirectWith(res, '/cashbook', 'message', 'Entry deleted and all linked accounting records reversed.');
  } catch (error) { redirectWith(res, '/cashbook', 'error', error.message || 'Could not safely delete this cashbook entry.'); }
});

/* ── URD Purchases (old gold/silver from customers) ────── */
app.get('/urd-purchases', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const state = String(req.query.state || 'ACTIVE').toUpperCase() === 'CANCELLED' ? 'CANCELLED' : 'ACTIVE';
    const where = state === 'CANCELLED' ? { cancelledAt: { not: null } } : { cancelledAt: null };
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
    res.render('urd-purchases/index', { title: 'URD Purchases', purchases, q, state, pagination });
  } catch (error) { next(error); }
});

app.get('/urd-purchases/new', async (req, res, next) => {
  try {
    const rateInfo = await getRateForDate(prisma, dateInput());
    // The final number is assigned only when the purchase is committed.
    res.render('urd-purchases/form', { title: 'New URD purchase', customers: [], rateInfo, purchaseNumber: '', purchase: null });
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
          purchaseNumber: await nextDocumentNumber(tx, 'URD', purchaseDate),
          customerId,
          purchaseDate,
          metal: req.body.metal || 'GOLD', purity: req.body.purity || null,
          grossWeight: number(req.body.grossWeight), netWeight, ratePerGram,
          totalAmount, paid, paymentMethod, description: req.body.description ? String(req.body.description).trim().toUpperCase() : null, notes: req.body.notes ? String(req.body.notes).trim().toUpperCase() : null
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
      const purchase = await tx.urdPurchase.findFirstOrThrow({ where: { id, cancelledAt: null } });
      const outstanding = roundedMoney(Math.max(0, Number(purchase.totalAmount) - Number(purchase.saleOffset) - Number(purchase.paid)));
      if (outstanding <= 0) throw new Error('This URD purchase is already fully paid or settled.');
      if (amount > outstanding) throw new Error(`Payout is greater than the outstanding amount of ${money(outstanding)}.`);
      const reference = req.body.reference?.trim() || generatedReference(`${purchase.purchaseNumber}-PAY`);
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
    redirectWith(res, '/urd-purchases', 'message', `URD payout of ${money(amount)} recorded.`);
  } catch (error) {
    redirectWith(res, '/urd-purchases', 'error', error.message || 'Could not record the URD payout.');
  }
});

app.get('/urd-purchases/:id/invoice.pdf', async (req, res, next) => {
  try {
    const purchase = await prisma.urdPurchase.findUnique({
      where: { id: Number(req.params.id), cancelledAt: null }, include: { customer: true, sale: true }
    });
    if (!purchase) return res.status(404).render('not-found', { title: 'URD invoice not found' });
    writeUrdPurchaseInvoice(res, purchase);
  } catch (error) { next(error); }
});

app.post('/urd-purchases/:id/delete', async (req, res, next) => {
  try {
    const purchase = await prisma.$transaction((tx) => cancelUrdPurchase(tx, Number(req.params.id)));
    redirectWith(res, '/urd-purchases', 'message', `${purchase.purchaseNumber} cancelled and its linked payouts reversed.`);
  } catch (error) {
    redirectWith(res, '/urd-purchases', 'error', error.message || 'Could not delete this URD purchase.');
  }
});

const REPORT_METALS = ['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER'];
const REPORT_PAYMENT_METHODS = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CREDIT', 'MIXED'];
const REPORT_MOVEMENT_TYPES = ['OPENING', 'SALE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT'];

function reportDates(query) {
  const today = dateInput();
  const fromKey = String(query.from || `${today.slice(0, 7)}-01`);
  const toKey = String(query.to || today);
  const range = localDateTimeRange(fromKey, toKey);
  return { fromKey, toKey, ...range };
}

function reportText(value) {
  return String(value || '').trim();
}

app.get('/reports', (req, res) => {
  res.render('reports/index', { title: 'Reports' });
});

app.get('/reports/stock', async (req, res, next) => {
  try {
    const itemName = reportText(req.query.itemName || req.query.q);
    const weight = reportText(req.query.weight);
    const barcode = reportText(req.query.barcode);
    const metal = REPORT_METALS.includes(String(req.query.metal || '').toUpperCase()) ? String(req.query.metal).toUpperCase() : '';
    const category = reportText(req.query.category);
    const location = reportText(req.query.location);
    const fromKey = req.query.from ? String(req.query.from).trim() : '';
    const toKey = req.query.to ? String(req.query.to).trim() : '';
    let dateRangeFilter = {};
    if (fromKey || toKey) {
      const f = fromKey || '2000-01-01';
      const t = toKey || dateInput();
      dateRangeFilter = { createdAt: localDateTimeRange(f, t) };
    }
    const stockWhere = {
      AND: [
        { quantity: { gt: 0 }, status: 'AVAILABLE' },
        ...(Object.keys(dateRangeFilter).length ? [dateRangeFilter] : []),
        ...(metal ? [{ metal }] : []),
        ...(category ? [{ category: { contains: category } }] : []),
        ...(location ? [{ location: { contains: location } }] : []),
        ...productSearchClauses({ itemName, weight, barcode })
      ]
    };
    const totalItems = await prisma.product.count({ where: stockWhere });
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const products = await prisma.product.findMany({
      where: stockWhere,
      select: { id: true, barcode: true, name: true, category: true, metal: true, purity: true, grossWeight: true, netWeight: true, quantity: true, location: true, createdAt: true },
      orderBy: [{ metal: 'asc' }, { name: 'asc' }, { id: 'asc' }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    res.render('reports/stock', { title: 'Stock report', products, pagination, filters: { itemName, weight, barcode, metal, category, location, from: fromKey, to: toKey } });
  } catch (error) { next(error); }
});

app.get('/reports/stock-movements', async (req, res, next) => {
  try {
    const { fromKey, toKey, gte: from, lte: to } = reportDates(req.query);
    const q = reportText(req.query.q);
    const metal = REPORT_METALS.includes(String(req.query.metal || '').toUpperCase()) ? String(req.query.metal).toUpperCase() : '';
    const type = REPORT_MOVEMENT_TYPES.includes(String(req.query.type || '').toUpperCase()) ? String(req.query.type).toUpperCase() : '';
    const movementWhere = {
      createdAt: { gte: from, lte: to },
      ...(metal ? { productMetal: metal } : {}),
      ...(type ? { type } : {}),
      ...(q ? { OR: [
        { productBarcode: { contains: q } }, { productName: { contains: q } },
        { productPurity: { contains: q } }, { note: { contains: q } }
      ] } : {})
    };
    const totalItems = await prisma.stockMovement.count({ where: movementWhere });
    const pagination = paginationFor(req, totalItems, req.query.page, 200);
    const movements = await prisma.stockMovement.findMany({
      where: movementWhere,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    res.render('reports/stock-movements', {
      title: 'Stock movement report', movements, pagination,
      filters: { from: fromKey, to: toKey, q, metal, type }
    });
  } catch (error) { next(error); }
});

app.get('/reports/balance-register', async (req, res, next) => {
  try {
    const q = reportText(req.query.q);
    const state = ['ALL', 'DUE', 'SETTLED'].includes(String(req.query.state || 'DUE').toUpperCase())
      ? String(req.query.state || 'DUE').toUpperCase()
      : 'DUE';
    const fromKey = req.query.from ? String(req.query.from).trim() : '';
    const toKey = req.query.to ? String(req.query.to).trim() : '';
    
    let dateJoinClause = Prisma.empty;
    if (fromKey || toKey) {
      const f = fromKey || '2000-01-01';
      const t = toKey || dateInput();
      const range = localDateTimeRange(f, t);
      dateJoinClause = Prisma.sql`AND l.createdAt >= ${range.gte} AND l.createdAt <= ${range.lte}`;
    }

    const like = `%${q}%`;
    const searchClause = q
      ? Prisma.sql`WHERE (c.name LIKE ${like} OR c.phone LIKE ${like})`
      : Prisma.empty;
    const balanceClause = state === 'DUE'
      ? Prisma.sql`HAVING balance > 0.005`
      : state === 'SETTLED'
        ? Prisma.sql`HAVING balance <= 0.005 AND balance >= -0.005`
        : Prisma.empty;
    const countRows = await prisma.$queryRaw`
      SELECT COUNT(*) AS total FROM (
        SELECT c.id, COALESCE(SUM(l.amount), 0) AS balance
        FROM \`Customer\` c
        LEFT JOIN \`CustomerLedger\` l ON l.customerId = c.id ${dateJoinClause}
        ${searchClause}
        GROUP BY c.id
        ${balanceClause}
      ) AS balance_rows
    `;
    const totalItems = Number(countRows[0]?.total || 0);
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const rows = await prisma.$queryRaw`
      SELECT
        c.id,
        c.name,
        c.phone,
        COALESCE(SUM(l.amount), 0) AS balance,
        MAX(l.createdAt) AS lastActivity
      FROM \`Customer\` c
      LEFT JOIN \`CustomerLedger\` l ON l.customerId = c.id ${dateJoinClause}
      ${searchClause}
      GROUP BY c.id, c.name, c.phone
      ${balanceClause}
      ORDER BY balance DESC, lastActivity DESC, c.name ASC
      LIMIT ${pagination.pageSize} OFFSET ${(pagination.page - 1) * pagination.pageSize}
    `;
    const customers = rows.map((row) => ({
      id: Number(row.id), name: row.name, phone: row.phone || '', balance: Number(row.balance || 0), lastActivity: row.lastActivity || null
    }));
    res.render('reports/balance-register', { title: 'Balance register', customers, pagination, filters: { q, state, from: fromKey, to: toKey } });
  } catch (error) { next(error); }
});

app.get('/reports/sales-register', async (req, res, next) => {
  try {
    const { fromKey, toKey, gte: from, lte: to } = reportDates(req.query);
    const item = reportText(req.query.item);
    const customer = reportText(req.query.customer);
    const invoice = reportText(req.query.invoice);
    const paymentMethod = REPORT_PAYMENT_METHODS.includes(String(req.query.paymentMethod || '').toUpperCase())
      ? String(req.query.paymentMethod).toUpperCase() : '';
    const balanceState = ['ALL', 'DUE', 'SETTLED'].includes(String(req.query.balanceState || 'ALL').toUpperCase())
      ? String(req.query.balanceState).toUpperCase() : 'ALL';
    const recordState = String(req.query.recordState || 'ACTIVE').toUpperCase() === 'CANCELLED' ? 'CANCELLED' : 'ACTIVE';
    const saleWhere = {
      ...(recordState === 'CANCELLED' ? { cancelledAt: { not: null } } : { cancelledAt: null }),
      saleDate: { gte: from, lte: to },
      ...(invoice ? { invoiceNumber: { contains: invoice } } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(balanceState === 'DUE' ? { balance: { gt: 0 } } : {}),
      ...(balanceState === 'SETTLED' ? { balance: { equals: 0 } } : {}),
      ...(customer ? { customer: { is: { OR: [{ name: { contains: customer } }, { phone: { contains: customer } }] } } } : {}),
      ...(item ? { items: { some: { OR: [
        { productName: { contains: item } }, { productBarcode: { contains: item } }, { productSku: { contains: item } }, { productPurity: { contains: item } }
      ] } } } : {})
    };
    const totalItems = await prisma.sale.count({ where: saleWhere });
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const [sales, summary] = await Promise.all([
      prisma.sale.findMany({
        where: saleWhere,
        include: {
          customer: true,
          urdPurchase: true,
          _count: { select: { items: true } },
          items: { select: { productName: true, productBarcode: true, productPurity: true }, take: 3 }
        },
        orderBy: [{ saleDate: 'desc' }, { id: 'desc' }],
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize
      }),
      prisma.sale.aggregate({ where: saleWhere, _sum: { total: true, paid: true, balance: true }, _count: true })
    ]);
    res.render('reports/sales-register', {
      title: 'Sales register', sales, summary, pagination,
      filters: { from: fromKey, to: toKey, item, customer, invoice, paymentMethod, balanceState, recordState }
    });
  } catch (error) { next(error); }
});

app.get('/reports/top-selling-items', async (req, res, next) => {
  try {
    const { fromKey, toKey, gte: from, lte: to } = reportDates(req.query);
    const filters = { ...normalizeTopSellingFilters(req.query), from: fromKey, to: toKey };
    const source = { ...filters, from, to };
    const [totalItems, summary] = await Promise.all([
      countTopSellingItems(prisma, source),
      summarizeTopSellingItems(prisma, source)
    ]);
    const pagination = paginationFor(req, totalItems, req.query.page, 100);
    const rows = await listTopSellingItems(prisma, source, {
      skip: (pagination.page - 1) * pagination.pageSize,
      take: pagination.pageSize
    });
    res.render('reports/top-selling-items', {
      title: 'Top selling items report', rows, pagination,
      summary, filters
    });
  } catch (error) { next(error); }
});

app.get('/reports/top-selling-items/export', async (req, res) => {
  try {
    const range = parseDateRange(req.query);
    const filters = normalizeTopSellingFilters(req.query);
    const payload = await getExportPayload(prisma, 'top-selling-items', range, filters);
    const workbook = await buildExcelExport(payload);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${payload.filename}"`);
    res.send(workbook);
  } catch (error) {
    const query = new URLSearchParams({
      from: String(req.query.from || ''), to: String(req.query.to || ''),
      metal: String(req.query.metal || ''), item: String(req.query.item || ''),
      sortBy: String(req.query.sortBy || ''), sortOrder: String(req.query.sortOrder || ''),
      error: error.message || 'Could not create the Top Selling Items Excel report.'
    });
    res.redirect(`/reports/top-selling-items?${query.toString()}`);
  }
});

app.get('/reports/cashbook-register', async (req, res, next) => {
  try {
    const { fromKey, toKey } = reportDates(req.query);
    const paymentMethod = RECEIPT_PAYMENT_METHODS.has(String(req.query.paymentMethod || '').toUpperCase()) ? String(req.query.paymentMethod).toUpperCase() : '';
    const type = ['IN', 'OUT'].includes(String(req.query.type || '').toUpperCase()) ? String(req.query.type).toUpperCase() : '';
    const q = reportText(req.query.q);
    const where = { entryDate: { gte: fromKey, lte: toKey }, ...(paymentMethod ? { paymentMethod } : {}), ...(type ? { type } : {}), ...(q ? { OR: [{ description: { contains: q } }, { reference: { contains: q } }, { customer: { is: { name: { contains: q } } } }] } : {}) };
    const totalItems = await prisma.cashbookEntry.count({ where });
    const pagination = paginationFor(req, totalItems, req.query.page, 200);
    const [entries, totals] = await Promise.all([
      prisma.cashbookEntry.findMany({ where, include: { customer: true }, orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }], skip: (pagination.page - 1) * pagination.pageSize, take: pagination.pageSize }),
      prisma.cashbookEntry.groupBy({ by: ['type'], where, _sum: { amount: true } })
    ]);
    const summary = { in: 0, out: 0 }; totals.forEach((row) => { summary[row.type === 'IN' ? 'in' : 'out'] = Number(row._sum.amount || 0); });
    res.render('reports/cashbook-register', { title: 'Cashbook register', entries, summary, pagination, filters: { from: fromKey, to: toKey, paymentMethod, type, q } });
  } catch (error) { next(error); }
});

// ── Schemes ─────────────────────────────────────────────────
app.get('/schemes', async (req, res, next) => {
  try {
    const [schemePlans, activePlans, totalEnrollments, activeEnrollments, collected] = await Promise.all([
      prisma.schemePlan.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { enrollments: true } } }
      }),
      prisma.schemePlan.count({ where: { isActive: true } }),
      prisma.schemeEnrollment.count(),
      prisma.schemeEnrollment.count({ where: { status: 'ACTIVE' } }),
      prisma.schemeEnrollment.aggregate({ _sum: { totalPaid: true } })
    ]);
    const schemeStats = {
      activePlans,
      totalEnrollments,
      activeEnrollments,
      totalCollected: Number(collected._sum.totalPaid || 0)
    };
    res.render('schemes/index', { title: 'Schemes', schemePlans, schemeStats });
  } catch (error) { next(error); }
});

app.get('/schemes/plans/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const plan = await prisma.schemePlan.findUnique({
      where: { id },
      include: { _count: { select: { enrollments: true } } }
    });
    if (!plan) return res.status(404).render('not-found', { title: 'Scheme plan not found' });

    const enrollments = await prisma.schemeEnrollment.findMany({
      where: { schemePlanId: id },
      include: {
        customer: true,
        schemePlan: true,
        installments: {
          orderBy: { installmentNumber: 'asc' },
          select: { installmentNumber: true, dueDate: true, paidAmount: true, paymentDate: true, paymentMethod: true, status: true }
        }
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
    });

    const activeEnrollments = enrollments.filter((e) => e.status === 'ACTIVE').length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'COMPLETED').length;
    const cancelledEnrollments = enrollments.filter((e) => e.status === 'CANCELLED').length;
    const totalCollected = enrollments.reduce((sum, e) => sum + Number(e.totalPaid || 0), 0);

    const stats = {
      totalEnrollments: enrollments.length,
      activeEnrollments,
      completedEnrollments,
      cancelledEnrollments,
      totalCollected
    };

    res.render('schemes/plan-detail', {
      title: `${plan.name} · Scheme`,
      plan,
      enrollments,
      stats
    });
  } catch (error) { next(error); }
});

app.get('/schemes/plans/:id/edit', (req, res) => {
  res.redirect(`/schemes/plans/${req.params.id}?edit=1`);
});

app.post('/schemes/plans/new', async (req, res, next) => {
  try {
    const name = titleCase(req.body.name);
    const durationMonths = Number(req.body.durationMonths);
    const monthlyAmount = roundedMoney(number(req.body.monthlyAmount));
    const maturityAmount = roundedMoney(number(req.body.maturityAmount));
    if (!name) return redirectWith(res, '/schemes', 'error', 'Enter a scheme name.');
    if (!Number.isInteger(durationMonths) || durationMonths < 1 || durationMonths > 60) return redirectWith(res, '/schemes', 'error', 'Duration must be between 1 and 60 months.');
    if (monthlyAmount <= 0) return redirectWith(res, '/schemes', 'error', 'Enter a valid monthly installment amount.');
    if (maturityAmount <= 0) return redirectWith(res, '/schemes', 'error', 'Enter a valid maturity amount.');
    await prisma.schemePlan.create({
      data: {
        name,
        durationMonths,
        monthlyAmount,
        maturityAmount,
        description: req.body.description ? titleCase(req.body.description) : null,
        isActive: true
      }
    });
    redirectWith(res, '/schemes', 'message', `Scheme plan "${name}" created.`);
  } catch (error) { redirectWith(res, '/schemes', 'error', error.message || 'Could not create scheme plan.'); }
});

app.post('/schemes/plans/:id/edit', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = titleCase(req.body.name);
    const durationMonths = Number(req.body.durationMonths);
    const monthlyAmount = roundedMoney(number(req.body.monthlyAmount));
    const maturityAmount = roundedMoney(number(req.body.maturityAmount));
    if (!name) return redirectWith(res, '/schemes', 'error', 'Enter a scheme name.');
    if (!Number.isInteger(durationMonths) || durationMonths < 1 || durationMonths > 60) return redirectWith(res, '/schemes', 'error', 'Duration must be between 1 and 60 months.');
    if (monthlyAmount <= 0) return redirectWith(res, '/schemes', 'error', 'Enter a valid monthly installment amount.');
    if (maturityAmount <= 0) return redirectWith(res, '/schemes', 'error', 'Enter a valid maturity amount.');
    const plan = await prisma.schemePlan.findUnique({ where: { id }, include: { _count: { select: { enrollments: true } } } });
    if (!plan) return redirectWith(res, '/schemes', 'error', 'Scheme plan not found.');
    const hasEnrollments = plan._count.enrollments > 0;
    const financialTermsChanged = plan.durationMonths !== durationMonths
      || roundedMoney(plan.monthlyAmount) !== monthlyAmount
      || roundedMoney(plan.maturityAmount) !== maturityAmount;
    if (hasEnrollments && financialTermsChanged) {
      return redirectWith(res, '/schemes', 'error', 'This plan already has enrolled customers, so its duration and amounts are locked. Create a new plan for different terms.');
    }
    await prisma.schemePlan.update({
      where: { id },
      data: {
        name,
        durationMonths,
        monthlyAmount,
        maturityAmount,
        description: req.body.description ? titleCase(req.body.description) : null,
        isActive: req.body.isActive === 'on'
      }
    });
    const returnTo = req.body.returnTo === 'plan' || req.headers.referer?.includes(`/schemes/plans/${id}`)
      ? `/schemes/plans/${id}`
      : '/schemes';
    redirectWith(res, returnTo, 'message', `Scheme plan "${name}" updated.`);
  } catch (error) { redirectWith(res, '/schemes', 'error', error.message || 'Could not update scheme plan.'); }
});

app.post('/schemes/plans/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const plan = await prisma.schemePlan.findUnique({ where: { id }, include: { _count: { select: { enrollments: true } } } });
    if (!plan) return redirectWith(res, '/schemes', 'error', 'Scheme plan not found.');
    if (plan._count.enrollments > 0) return redirectWith(res, '/schemes', 'error', 'Cannot delete a plan that has enrollments. Deactivate it instead.');
    await prisma.schemePlan.delete({ where: { id } });
    redirectWith(res, '/schemes', 'message', `Scheme plan "${plan.name}" deleted.`);
  } catch (error) { redirectWith(res, '/schemes', 'error', error.message || 'Could not delete scheme plan.'); }
});

app.post('/schemes/:planId/enroll', async (req, res, next) => {
  try {
    const planId = Number(req.params.planId);
    const name = titleCase(req.body.customerName);
    const phone = normalizePhone(req.body.customerPhone);
    if (!name) return redirectWith(res, '/schemes', 'error', 'Enter the customer name.');
    if (!validCustomerPhone(phone)) return redirectWith(res, '/schemes', 'error', 'Enter a valid customer mobile number (10 to 15 digits).');
    const startDateInput = req.body.startDate || dateInput();
    const startDate = dateTimeFromInput(startDateInput);

    await prisma.$transaction(async (tx) => {
      // Lock the plan so a deactivated plan cannot receive a new enrollment
      // from another counter at the same time.
      const lockedPlans = await tx.$queryRaw`SELECT id FROM \`SchemePlan\` WHERE id = ${planId} FOR UPDATE`;
      if (!lockedPlans.length) throw new Error('Scheme plan not found.');
      const plan = await tx.schemePlan.findUniqueOrThrow({ where: { id: planId } });
      if (!plan.isActive) throw new Error('This scheme plan is not available for enrollment.');

      // Find or create the one shared customer profile. Do not silently
      // overwrite established customer details while enrolling a scheme.
      let customer = await tx.customer.findUnique({ where: { phone } });
      if (!customer) {
        customer = await tx.customer.create({ data: { name, phone } });
      }

      // Reserve a compact, atomic scheme number. Two PCs cannot receive the
      // same enrollment number, even when they enroll at the same moment.
      const enrollmentNumber = await nextDocumentNumber(tx, 'SCH', startDate);
      const schedule = createInstallmentSchedule(startDate, plan.durationMonths);

      const enrollment = await tx.schemeEnrollment.create({
        data: {
          enrollmentNumber,
          schemePlanId: planId,
          customerId: customer.id,
          startDate,
          endDate: schemeEndDate(startDate, plan.durationMonths),
          status: 'ACTIVE',
          totalPaid: 0,
          installmentsPaid: 0,
          notes: req.body.notes ? titleCase(req.body.notes) : null
        }
      });

      await tx.schemeInstallment.createMany({
        data: schedule.map(({ installmentNumber, dueDate }) => ({
          enrollmentId: enrollment.id,
          installmentNumber,
          dueDate,
          paidAmount: 0,
          status: 'PENDING'
        }))
      });
      return plan;
    });

    redirectWith(res, `/schemes/plans/${planId}`, 'message', `Customer "${name}" enrolled in ${enrolledPlan.name} successfully.`);
  } catch (error) {
    const errTarget = req.headers.referer?.includes('/plans/') ? req.headers.referer : `/schemes/plans/${req.params.planId || ''}`;
    redirectWith(res, errTarget, 'error', error.message || 'Could not enroll customer.');
  }
});

app.get('/schemes/enrollments/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const enrollment = await prisma.schemeEnrollment.findUnique({
      where: { id },
      include: {
        schemePlan: true,
        customer: true,
        installments: { orderBy: { installmentNumber: 'asc' } }
      }
    });
    if (!enrollment) return res.status(404).render('not-found', { title: 'Enrollment not found' });
    res.render('schemes/enrollment-detail', { title: `${enrollment.enrollmentNumber}`, enrollment });
  } catch (error) { next(error); }
});

app.post('/schemes/enrollments/:id/pay', async (req, res, next) => {
  const enrollmentId = Number(req.params.id);
  try {
    const installmentId = Number(req.body.installmentId);
    const paymentMethod = receiptPaymentMethod(req.body.paymentMethod);
    const amount = roundedMoney(number(req.body.amount));
    const paymentDate = dateInput(dateTimeFromInput(req.body.paymentDate || dateInput()));
    if (amount <= 0) return redirectWith(res, `/schemes/enrollments/${enrollmentId}`, 'error', 'Enter a valid payment amount.');

    await prisma.$transaction(async (tx) => {
      const lockedEnrollments = await tx.$queryRaw`SELECT id FROM \`SchemeEnrollment\` WHERE id = ${enrollmentId} FOR UPDATE`;
      if (!lockedEnrollments.length) throw new Error('Scheme enrollment not found.');
      const enrollment = await tx.schemeEnrollment.findUnique({
        where: { id: enrollmentId },
        include: { schemePlan: true }
      });
      if (!enrollment || enrollment.status !== 'ACTIVE') throw new Error('This enrollment is not active.');

      const lockedInstallments = await tx.$queryRaw`SELECT id FROM \`SchemeInstallment\` WHERE id = ${installmentId} FOR UPDATE`;
      if (!lockedInstallments.length) throw new Error('Installment not found.');
      const installment = await tx.schemeInstallment.findUnique({ where: { id: installmentId } });
      if (!installment || installment.enrollmentId !== enrollmentId) throw new Error('Installment not found.');
      if (installment.status === 'PAID') throw new Error('This installment has already been paid.');
      if (!isFullInstallmentPayment(amount, enrollment.schemePlan.monthlyAmount)) {
        throw new Error(`Enter the exact monthly installment amount of ${money(enrollment.schemePlan.monthlyAmount)}.`);
      }

      // A scheme payment is a cashbook receipt, but it is not a loan/credit
      // collection and must not change the customer's sales ledger.
      const reference = generatedReference('SCH-PAY');
      const cashbookEntry = await tx.cashbookEntry.create({
        data: {
          entryDate: paymentDate,
          type: 'IN',
          paymentMethod,
          amount,
          description: `Scheme payment — ${enrollment.enrollmentNumber} — Installment ${installment.installmentNumber}`,
          reference,
          customerId: enrollment.customerId,
          notes: `${enrollment.schemePlan.name} · Installment ${installment.installmentNumber} of ${enrollment.schemePlan.durationMonths}`
        }
      });

      // Mark installment as paid
      await tx.schemeInstallment.update({
        where: { id: installmentId },
        data: {
          paidAmount: amount,
          paymentDate,
          paymentMethod,
          cashbookEntryId: cashbookEntry.id,
          status: 'PAID'
        }
      });

      // Derive totals from saved rows rather than incrementing counters. This
      // remains correct if a cashier deletes a linked cashbook entry later.
      const [paidAggregate, newInstallmentsPaid] = await Promise.all([
        tx.schemeInstallment.aggregate({ where: { enrollmentId, status: 'PAID' }, _sum: { paidAmount: true } }),
        tx.schemeInstallment.count({ where: { enrollmentId, status: 'PAID' } })
      ]);
      const newTotalPaid = roundedMoney(paidAggregate._sum.paidAmount || 0);
      const isCompleted = newInstallmentsPaid >= enrollment.schemePlan.durationMonths;

      await tx.schemeEnrollment.update({
        where: { id: enrollmentId },
        data: {
          totalPaid: newTotalPaid,
          installmentsPaid: newInstallmentsPaid,
          status: isCompleted ? 'COMPLETED' : 'ACTIVE'
        }
      });
    });

    redirectWith(res, `/schemes/enrollments/${enrollmentId}`, 'message', 'Installment payment recorded and synced to cashbook.');
  } catch (error) { redirectWith(res, `/schemes/enrollments/${enrollmentId}`, 'error', error.message || 'Could not record payment.'); }
});

app.post('/schemes/enrollments/:id/cancel', async (req, res, next) => {
  const enrollmentId = Number(req.params.id);
  try {
    const enrollment = await prisma.schemeEnrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) return redirectWith(res, '/schemes', 'error', 'Enrollment not found.');
    if (enrollment.status !== 'ACTIVE') return redirectWith(res, `/schemes/enrollments/${enrollmentId}`, 'error', 'Only active enrollments can be cancelled.');
    await prisma.schemeEnrollment.update({
      where: { id: enrollmentId },
      data: { status: 'CANCELLED' }
    });
    redirectWith(res, `/schemes/enrollments/${enrollmentId}`, 'message', 'Enrollment cancelled. Payments already recorded remain in the cashbook.');
  } catch (error) { redirectWith(res, `/schemes/enrollments/${enrollmentId}`, 'error', error.message || 'Could not cancel enrollment.'); }
});

// Keep fall-through and error handlers last. Reports registered after either
// handler would otherwise always resolve to the 404 page before reaching their
// route.
app.use((req, res) => res.status(404).render('not-found', { title: 'Page not found' }));

app.use((error, req, res, next) => {
  console.error(error);
  // A file download or a client that closes a connection may already have
  // committed response headers. Never turn that into an uncaught exception
  // that closes the whole desktop ERP.
  if (res.headersSent) return next(error);
  if (expectsJson(req)) {
    return res.status(error.statusCode || error.status || 500).json({
      error: error.message || 'The request could not be completed.'
    });
  }
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

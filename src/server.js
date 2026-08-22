const os = require('os');
const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
const appRoot = path.join(__dirname, '..');
const shopDataDirectory = process.env.KUSUM_APP_DATA
  || path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'Kusum Jewelers ERP');
const configPath = process.env.KUSUM_CONFIG_PATH
  || (process.env.KUSUM_APP_DATA ? path.join(shopDataDirectory, '.env') : path.join(appRoot, '.env'));
dotenv.config({ path: configPath });
const { createPrisma } = require('./lib/prisma');
const { writeUrdPurchaseInvoice } = require('./lib/urd-invoice-pdf');
const { writeSaleInvoice } = require('./lib/sale-invoice-pdf');
const { buildTsplJob, checkTcpPrinter, sendTsplToPrinter } = require('./lib/tspl-labels');
const { resolveTscPrinter, cachedTscPrinterStatus } = require('./lib/windows-printers');
const { provisionShopDatabase, enableNetworkSharing, updatePrinterConfiguration, parseDatabaseConnection, isLocalHost } = require('./lib/shop-provisioning');
const { buildExcelExport } = require('./lib/excel-export');
const { RESOURCE_LIST, resourceFor, parseDateRange, getExportPayload, archiveData } = require('./lib/data-lifecycle');
const { number, nullableNumber, asArray, dateInput, startOfToday, money, grams, invoiceNumber, barcodePrefix, metalRateFromDailyRate, makingAmount } = require('./lib/helpers');

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
  secret: process.env.SESSION_SECRET || 'replace-this-local-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 }
}));

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

function redirectWith(res, route, type, message) {
  const separator = route.includes('?') ? '&' : '?';
  res.redirect(`${route}${separator}${type}=${encodeURIComponent(message)}`);
}

function itemRows(body) {
  const productIds = asArray(body.productId);
  const quantities = asArray(body.quantity);
  const prices = asArray(body.unitPrice);
  const makingCharges = asArray(body.makingCharge);
  return productIds.map((productId, index) => ({
    productId: Number(productId),
    quantity: Math.max(1, Math.floor(number(quantities[index], 1))),
    unitPrice: number(prices[index]),
    makingCharge: number(makingCharges[index])
  })).filter((item) => item.productId > 0);
}

function labelRequests(body) {
  return [...new Set(asArray(body.productId).map(Number).filter((id) => Number.isInteger(id) && id > 0))]
    .map((id) => ({
      id,
      copies: Math.max(1, Math.min(50, Math.floor(number(body[`copy_${id}`], 1))))
    }));
}

function saleRows(body) {
  const productIds = asArray(body.productId);
  const quantities = asArray(body.quantity);
  const metalRates = asArray(body.metalRate);
  const makingTypes = asArray(body.makingChargeType);
  const makingValues = asArray(body.makingChargeValue);
  const taxableAmounts = asArray(body.taxableAmount);
  return productIds.map((productId, index) => ({
    productId: Number(productId),
    quantity: Math.max(1, Math.floor(number(quantities[index], 1))),
    metalRate: number(metalRates[index]),
    makingChargeType: ['FIXED', 'PER_GRAM', 'PERCENTAGE'].includes(makingTypes[index]) ? makingTypes[index] : null,
    makingChargeValue: makingValues[index] === undefined || makingValues[index] === '' ? null : number(makingValues[index]),
    taxableAmount: taxableAmounts[index] === '' || taxableAmounts[index] === undefined ? null : Math.max(0, number(taxableAmounts[index]))
  })).filter((item) => item.productId > 0);
}

async function getRateForDate(db, rateDate = dateInput()) {
  const exact = await db.dailyRate.findUnique({ where: { rateDate } });
  if (exact) return { rate: exact, sourceDate: rateDate, isFallback: false };
  const latest = await db.dailyRate.findFirst({ where: { rateDate: { lte: rateDate } }, orderBy: { rateDate: 'desc' } });
  return { rate: latest, sourceDate: latest?.rateDate || null, isFallback: Boolean(latest) };
}

async function nextBarcode(tx, metal, purity) {
  const prefix = barcodePrefix(metal, purity);
  const sequence = await tx.barcodeSequence.upsert({
    where: { prefix },
    create: { prefix, lastNumber: 1 },
    update: { lastNumber: { increment: 1 } }
  });
  return `${prefix} ${sequence.lastNumber}`;
}

function requestedCashbookSync(body) {
  const paymentMethods = new Set(['CASH', 'UPI', 'CARD', 'BANK_TRANSFER']);
  return body.syncCashbook === 'on' && paymentMethods.has(body.paymentMethod);
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
  const existing = await tx.customer.findUnique({ where: { phone } });
  if (existing) return existing;
  const name = String(body.customerName || '').trim();
  if (!name) throw new Error('This mobile number is new. Enter the customer name to create their customer ledger.');
  return tx.customer.create({ data: {
    phone, name, email: String(body.customerEmail || '').trim() || null,
    address: String(body.customerAddress || '').trim() || null
  } });
}

function secureCredentialMatch(value, expected) {
  const left = Buffer.from(String(value || ''));
  const right = Buffer.from(String(expected || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function shopSetupRequired() {
  return !process.env.DATABASE_URL || !process.env.AUTH_USERNAME || !process.env.AUTH_PASSWORD;
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

app.get('/setup', (req, res) => {
  if (!shopSetupRequired()) return res.redirect('/login');
  renderSetup(res, { error: req.query.error || null });
});

app.post('/setup', async (req, res) => {
  if (!shopSetupRequired()) return res.redirect('/login');
  try {
    const values = await provisionShopDatabase({ appRoot, configPath, form: req.body });
    Object.assign(process.env, values);
    await reloadPrismaClient();
    res.redirect('/login?message=Shop setup is complete. Sign in to begin.');
  } catch (error) {
    redirectWith(res, '/setup', 'error', error.message || 'Could not set up the shop database.');
  }
});

app.get('/connection-repair', (req, res) => {
  renderSetup(res, { repair: true, error: req.query.error || null });
});

app.post('/connection-repair', async (req, res) => {
  try {
    const values = await provisionShopDatabase({ appRoot, configPath, form: req.body });
    Object.assign(process.env, values);
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
  const usernameOk = secureCredentialMatch(req.body.username, process.env.AUTH_USERNAME);
  const passwordOk = secureCredentialMatch(req.body.password, process.env.AUTH_PASSWORD);
  if (!usernameOk || !passwordOk) return redirectWith(res, '/login', 'error', 'Incorrect username or password.');
  req.session.regenerate((error) => {
    if (error) return res.status(500).render('error', { title: 'Sign-in failed', detail: error.message });
    req.session.authenticated = true;
    req.session.username = process.env.AUTH_USERNAME;
    res.redirect('/');
  });
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
    const access = await enableNetworkSharing({ databaseUrl: process.env.DATABASE_URL, form: req.body });
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
    const todayKey = dateInput(today);
    const [productCount, stockProducts, todaySales, activeRepairs, lowStock, recentSales, todayCashbook, customerDue] = await Promise.all([
      prisma.product.count({ where: { status: 'AVAILABLE' } }),
      prisma.product.findMany({ where: { quantity: { gt: 0 }, status: 'AVAILABLE' }, select: { quantity: true, netWeight: true } }),
      prisma.sale.aggregate({ where: { saleDate: { gte: today } }, _sum: { total: true, paid: true, balance: true, urdOffset: true }, _count: true }),
      prisma.repair.count({ where: { status: { in: ['RECEIVED', 'IN_PROGRESS', 'READY'] } } }),
      prisma.product.findMany({ where: { quantity: { lte: 1 }, status: 'AVAILABLE' }, orderBy: { quantity: 'asc' }, take: 6 }),
      prisma.sale.findMany({ include: { customer: true }, orderBy: { saleDate: 'desc' }, take: 6 }),
      prisma.cashbookEntry.findMany({ where: { entryDate: todayKey }, select: { type: true, amount: true } }),
      prisma.customerLedger.aggregate({ _sum: { amount: true } })
    ]);
    const cashFlow = todayCashbook.reduce((summary, entry) => {
      if (entry.type === 'IN') summary.in += Number(entry.amount);
      if (entry.type === 'OUT') summary.out += Number(entry.amount);
      return summary;
    }, { in: 0, out: 0 });
    res.render('dashboard', {
      title: 'Dashboard',
      stats: {
        productCount,
        stockPieces: stockProducts.reduce((total, product) => total + product.quantity, 0),
        stockWeight: stockProducts.reduce((total, product) => total + Number(product.netWeight) * product.quantity, 0),
        sales: todaySales._sum.total || 0,
        invoices: todaySales._count,
        cashIn: cashFlow.in,
        cashOut: cashFlow.out,
        cashNet: cashFlow.in - cashFlow.out,
        customerDue: Math.max(0, Number(customerDue._sum.amount || 0)),
        activeRepairs
      },
      lowStock,
      recentSales
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
    await prisma.dailyRate.upsert({
      where: { rateDate },
      create: { rateDate, gold22k: number(req.body.gold22k), gold24k: number(req.body.gold24k), silver: number(req.body.silver), note: req.body.note || null },
      update: { gold22k: number(req.body.gold22k), gold24k: number(req.body.gold24k), silver: number(req.body.silver), note: req.body.note || null }
    });
    redirectWith(res, `/rates?date=${rateDate}`, 'message', `Rates saved for ${rateDate}.`);
  } catch (error) { next(error); }
});

app.get('/inventory', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const where = q ? { OR: [
      { barcode: { contains: q } }, { sku: { contains: q } }, { name: { contains: q } }, { category: { contains: q } }
    ] } : {};
    const products = await prisma.product.findMany({ where, orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }] });
    const printerStatus = await resolveLabelPrinter(req.query.checkPrinter === '1');
    const printerTransport = configuredLabelPrinter();
    res.render('inventory/index', { title: 'Inventory', products, q, printerName: printerStatus.name || printerTransport.name, printerStatus, printerTransport });
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

app.post('/labels/print', async (req, res, next) => {
  try {
    const requests = labelRequests(req.body);
    if (!requests.length) return redirectWith(res, '/inventory', 'error', 'Select at least one inventory item to print labels.');
    const printerTransport = configuredLabelPrinter();
    if (printerTransport.mode === 'WINDOWS' && !printerTransport.name) return redirectWith(res, '/inventory', 'error', 'Set the installed Windows printer name before sending labels.');
    const printerStatus = await resolveLabelPrinter(true);
    if (!printerStatus.available) throw new Error(printerStatus.message);
    const printerName = printerStatus.name;
    const products = await prisma.product.findMany({ where: { id: { in: requests.map((row) => row.id) } } });
    if (products.length !== requests.length) return redirectWith(res, '/inventory', 'error', 'One or more selected inventory items could not be found.');
    const labels = requests.flatMap(({ id, copies }) => {
      const product = products.find((item) => item.id === id);
      if (!product.barcode) throw new Error(`${product.name} has no barcode yet.`);
      return Array.from({ length: copies }, (_, copyIndex) => ({ product, copyIndex: copyIndex + 1, copies }));
    });
    const tspl = buildTsplJob(labels);
    const result = await sendTsplToPrinter(printerTransport.mode === 'TCP' ? printerTransport : { mode: 'WINDOWS', name: printerName }, tspl);
    redirectWith(res, '/inventory', 'message', `${labels.length} native TSPL label${labels.length === 1 ? '' : 's'} ${printerTransport.mode === 'TCP' ? 'sent to' : 'queued to'} ${printerName}. ${result}`);
  } catch (error) {
    redirectWith(res, '/inventory', 'error', error.message || 'Could not send native TSPL labels to the printer.');
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
    const quantity = Math.max(0, Math.floor(number(req.body.quantity, 1)));
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
          quantity, reorderLevel: Math.max(0, Math.floor(number(req.body.reorderLevel, 1))),
          purchasePrice: number(req.body.purchasePrice), sellingPrice: suggestedPrice,
          makingChargePerGram: makingChargeType === 'PER_GRAM' ? makingChargeValue : 0,
          makingChargeType, makingChargeValue, location: req.body.location || null,
          notes: req.body.notes || null, status: quantity ? 'AVAILABLE' : 'SOLD_OUT'
        }
      });
      if (quantity) await tx.stockMovement.create({ data: { productId: product.id, type: 'OPENING', quantity, note: `Opening stock · ${barcode}` } });
      return product;
    });
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
    await prisma.product.update({ where: { id }, data: {
       sku: req.body.sku.trim().toUpperCase(), name: req.body.name.trim(), category: req.body.category.trim(), metal: req.body.metal,
       purity: req.body.purity || null, grossWeight: number(req.body.grossWeight), stoneWeight: number(req.body.stoneWeight), netWeight: number(req.body.netWeight),
       reorderLevel: Math.max(0, Math.floor(number(req.body.reorderLevel, 1))), purchasePrice: number(req.body.purchasePrice), sellingPrice: number(req.body.sellingPrice),
       makingChargePerGram: req.body.makingChargeType === 'PER_GRAM' ? number(req.body.makingChargeValue) : 0,
       makingChargeType: req.body.makingChargeType, makingChargeValue: number(req.body.makingChargeValue), location: req.body.location || null, notes: req.body.notes || null, status: req.body.status
    } });
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
      await tx.stockMovement.create({ data: { productId: id, type: delta > 0 ? 'ADJUSTMENT_IN' : 'ADJUSTMENT_OUT', quantity: delta, note: req.body.note || 'Manual stock adjustment' } });
    });
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
    const customers = await prisma.customer.findMany({
      where,
      include: { _count: { select: { sales: true, repairs: true } }, ledger: { select: { amount: true } } },
      orderBy: { name: 'asc' },
      take: 250
    });
    const customerRows = customers.map((customer) => ({
      ...customer,
      outstanding: customer.ledger.reduce((total, entry) => total + Number(entry.amount), 0)
    }));
    res.render('contacts/customers', { title: 'Customers', customers: customerRows, q });
  } catch (error) { next(error); }
});

app.post('/customers', async (req, res, next) => {
  try {
    const phone = normalizePhone(req.body.phone);
    if (!validCustomerPhone(phone)) return redirectWith(res, '/customers', 'error', 'Enter a valid customer mobile number (10 to 15 digits).');
    await prisma.customer.create({ data: { name: req.body.name.trim(), phone, email: req.body.email || null, address: req.body.address || null } });
    redirectWith(res, '/customers', 'message', 'Customer added.');
  } catch (error) {
    if (error.code === 'P2002') return redirectWith(res, '/customers', 'error', 'That phone number already belongs to a customer.');
    next(error);
  }
});

app.get('/customers/:id', async (req, res, next) => {
  try {
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
      include: {
        ledger: { include: { sale: true }, orderBy: { createdAt: 'desc' } },
        sales: { orderBy: { saleDate: 'desc' }, take: 10 },
        _count: { select: { repairs: true } }
      }
    });
    const outstanding = customer.ledger.reduce((total, entry) => total + Number(entry.amount), 0);
    res.render('contacts/customer-detail', { title: customer.name, customer, outstanding });
  } catch (error) { next(error); }
});

app.post('/customers/:id/payments', async (req, res, next) => {
  try {
    const customerId = Number(req.params.id);
    const amount = number(req.body.amount);
    const paymentMethod = req.body.paymentMethod || 'CASH';
    const syncCashbook = requestedCashbookSync(req.body);
    if (amount <= 0) return redirectWith(res, `/customers/${customerId}`, 'error', 'Enter a valid payment amount.');
    await prisma.$transaction(async (tx) => {
      const openSales = await tx.sale.findMany({
        where: { customerId, balance: { gt: 0 } },
        orderBy: { saleDate: 'asc' }
      });
      const outstanding = openSales.reduce((total, sale) => total + Number(sale.balance), 0);
      if (!outstanding) throw new Error('This customer has no outstanding credit.');
      if (amount > outstanding + 0.01) throw new Error(`Payment is greater than the outstanding amount of ${money(outstanding)}.`);
      let remaining = amount;
      const receipt = req.body.reference?.trim() || `RCPT-${String(Date.now()).slice(-7)}`;
      for (const sale of openSales) {
        if (remaining <= 0) break;
        const allocation = Math.min(remaining, Number(sale.balance));
        await tx.sale.update({
          where: { id: sale.id },
          data: { paid: Number(sale.paid) + allocation, balance: Number(sale.balance) - allocation, paymentMethod: sale.paymentMethod === req.body.paymentMethod ? sale.paymentMethod : 'MIXED' }
        });
        await tx.customerLedger.create({
          data: {
            customerId, saleId: sale.id, type: 'PAYMENT_RECEIVED', amount: -allocation,
            paymentMethod: req.body.paymentMethod, reference: receipt, note: req.body.note || `Payment received against ${sale.invoiceNumber}`
          }
        });
        remaining -= allocation;
      }
      if (syncCashbook) {
        await tx.cashbookEntry.create({ data: {
          entryDate: dateInput(), type: 'IN', paymentMethod, amount,
          description: `Customer payment received — ${receipt}`, reference: receipt, customerId, syncLedger: true,
          notes: req.body.note || null
        } });
      }
    });
    redirectWith(res, `/customers/${customerId}`, 'message', 'Payment received and customer credit updated.');
  } catch (error) { redirectWith(res, `/customers/${req.params.id}`, 'error', error.message || 'Could not record payment.'); }
});

app.get('/suppliers', async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({ include: { _count: { select: { purchases: true } } }, orderBy: { createdAt: 'desc' } });
    res.render('contacts/suppliers', { title: 'Suppliers', suppliers });
  } catch (error) { next(error); }
});

app.post('/suppliers', async (req, res, next) => {
  try {
    await prisma.supplier.create({ data: { name: req.body.name.trim(), phone: req.body.phone || null, email: req.body.email || null, gstin: req.body.gstin || null, address: req.body.address || null } });
    redirectWith(res, '/suppliers', 'message', 'Supplier added.');
  } catch (error) { next(error); }
});

app.get('/sales', async (req, res, next) => {
  try {
    const sales = await prisma.sale.findMany({ include: { customer: true, _count: { select: { items: true } } }, orderBy: { saleDate: 'desc' }, take: 100 });
    res.render('sales/index', { title: 'Sales', sales });
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
      include: { ledger: { select: { amount: true } }, sales: { orderBy: { saleDate: 'desc' }, take: 5, select: { invoiceNumber: true, saleDate: true, total: true, balance: true } } }
    });
    if (!customer) return res.json({ found: false, phone });
    const outstanding = customer.ledger.reduce((total, entry) => total + Number(entry.amount), 0);
    res.json({
      found: true,
      customer: { id: customer.id, name: customer.name, phone: customer.phone, email: customer.email, address: customer.address, outstanding, recentSales: customer.sales.map((sale) => ({ ...sale, total: Number(sale.total), balance: Number(sale.balance) })) }
    });
  } catch (error) { next(error); }
});

app.get('/sales/new', async (req, res, next) => {
  try {
    const rateInfo = await getRateForDate(prisma);
    res.render('sales/form', { title: 'New sale', invoiceNumber: invoiceNumber('INV'), rateInfo });
  } catch (error) { next(error); }
});

app.post('/sales', async (req, res, next) => {
  try {
    const rows = saleRows(req.body);
    if (!rows.length) return redirectWith(res, '/sales/new', 'error', 'Enter at least one scanned barcode.');
    const discount = Math.max(0, number(req.body.discount));
    const paid = Math.max(0, number(req.body.paid));
    const saleDate = new Date(req.body.saleDate || Date.now());
    const includeUrdPurchase = req.body.includeUrdPurchase === 'on';
    const syncCashbook = requestedCashbookSync(req.body);
    const sale = await prisma.$transaction(async (tx) => {
      const productIds = [...new Set(rows.map((row) => row.productId))];
      const [products, rateInfo] = await Promise.all([
        tx.product.findMany({ where: { id: { in: productIds } } }),
        getRateForDate(tx, dateInput(saleDate))
      ]);
      if (products.length !== productIds.length) throw new Error('One or more scanned items no longer exist.');
      for (const product of products) {
        const requested = rows.filter((row) => row.productId === product.id).reduce((total, row) => total + row.quantity, 0);
        if (product.quantity < requested) throw new Error(`${product.barcode || product.sku} has only ${product.quantity} piece(s) in stock.`);
      }
      const pricedRows = rows.map((row) => {
        const product = products.find((item) => item.id === row.productId);
        const weight = Number(product.netWeight);
        const defaultRate = metalRateFromDailyRate(product, rateInfo.rate);
        const metalRate = row.metalRate > 0 ? row.metalRate : defaultRate;
        if (!metalRate) throw new Error(`Set a daily rate before billing ${product.barcode || product.sku}.`);
        const makingChargeType = row.makingChargeType || product.makingChargeType;
        const makingChargeValue = row.makingChargeValue === null ? Number(product.makingChargeValue) : row.makingChargeValue;
        const metalAmount = metalRate * weight * row.quantity;
        const calculatedMaking = makingAmount(makingChargeType, makingChargeValue, metalAmount, weight, row.quantity);
        const calculatedTaxable = metalAmount + calculatedMaking;
        return {
          ...row, product, weight, metalRate, metalAmount, makingChargeType, makingChargeValue,
          makingCharge: calculatedMaking,
          taxableAmount: row.taxableAmount === null ? calculatedTaxable : row.taxableAmount
        };
      });
      const subtotal = pricedRows.reduce((sum, row) => sum + row.taxableAmount, 0);
      const taxable = Math.max(0, subtotal - Math.min(discount, subtotal));
      const gstRate = 3;
      const gstAmount = taxable * gstRate / 100;
      const total = taxable + gstAmount;
      const customer = await resolveBillingCustomer(tx, req.body);
      const customerId = customer.id;
      const urdAmount = includeUrdPurchase ? Math.max(0, number(req.body.urdTotalAmount)) : 0;
      if (includeUrdPurchase) {
        if (!customerId) throw new Error('Select the customer before settling their URD purchase against this bill.');
        if (number(req.body.urdNetWeight) <= 0 || number(req.body.urdRatePerGram) <= 0 || urdAmount <= 0) {
          throw new Error('Enter valid URD net weight, rate and purchase amount.');
        }
        if (urdAmount > total + 0.01) throw new Error('URD value is higher than this sale total. Record it as a separate URD purchase so the balance can be paid to the customer.');
      }
      const netPayable = Math.max(0, total - urdAmount);
      const acceptedPaid = Math.min(paid, netPayable);
      const balance = Math.max(0, netPayable - acceptedPaid);
      const sale = await tx.sale.create({ data: {
        invoiceNumber: req.body.invoiceNumber || invoiceNumber('INV'), customerId, saleDate,
        subtotal, discount: Math.min(discount, subtotal), gstRate, gstAmount, total, urdOffset: urdAmount, paid: acceptedPaid, balance,
        paymentMethod: req.body.paymentMethod, notes: req.body.notes || null,
        items: { create: pricedRows.map((row) => ({
          productId: row.productId, quantity: row.quantity, weight: row.weight, unitPrice: row.metalRate,
          metalRate: row.metalRate, metalAmount: row.metalAmount, makingCharge: row.makingCharge,
          makingChargeType: row.makingChargeType, makingChargeValue: row.makingChargeValue,
          taxableAmount: row.taxableAmount, lineTotal: row.taxableAmount
        })) }
      } });
      if (balance > 0) await tx.customerLedger.create({
        data: { customerId, saleId: sale.id, type: 'SALE_CREDIT', amount: balance, reference: sale.invoiceNumber, note: `Credit balance from ${sale.invoiceNumber}` }
      });
      if (includeUrdPurchase) {
        await tx.urdPurchase.create({ data: {
          purchaseNumber: req.body.urdPurchaseNumber || invoiceNumber('URD'), customerId, purchaseDate: saleDate,
          metal: req.body.urdMetal || 'GOLD', purity: req.body.urdPurity || null,
          grossWeight: number(req.body.urdGrossWeight), netWeight: number(req.body.urdNetWeight),
          ratePerGram: number(req.body.urdRatePerGram), totalAmount: urdAmount, saleOffset: urdAmount,
          paid: 0, paymentMethod: 'MIXED', description: req.body.urdDescription || 'URD purchase settled against sale',
          notes: `Settled against sale ${sale.invoiceNumber}`, saleId: sale.id
        } });
      }
      if (syncCashbook && acceptedPaid > 0) {
        await tx.cashbookEntry.create({ data: {
          entryDate: dateInput(saleDate), type: 'IN', paymentMethod: req.body.paymentMethod, amount: acceptedPaid,
          description: `Sale payment — ${sale.invoiceNumber}`, reference: sale.invoiceNumber, customerId, syncLedger: Boolean(customerId),
          notes: req.body.notes || null
        } });
      }
      for (const product of products) {
        const quantitySold = rows.filter((row) => row.productId === product.id).reduce((total, row) => total + row.quantity, 0);
        const remaining = product.quantity - quantitySold;
        await tx.product.update({ where: { id: product.id }, data: { quantity: remaining, status: remaining ? 'AVAILABLE' : 'SOLD_OUT' } });
        await tx.stockMovement.create({ data: { productId: product.id, type: 'SALE', quantity: -quantitySold, note: `Sold via ${sale.invoiceNumber}` } });
      }
      return sale;
    });
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

app.get('/purchases', async (req, res, next) => {
  try {
    const purchases = await prisma.purchase.findMany({ include: { supplier: true, _count: { select: { items: true } } }, orderBy: { purchaseDate: 'desc' }, take: 100 });
    res.render('purchases/index', { title: 'Purchases', purchases });
  } catch (error) { next(error); }
});

app.get('/purchases/new', async (req, res, next) => {
  try {
    const [suppliers, products] = await Promise.all([prisma.supplier.findMany({ orderBy: { name: 'asc' } }), prisma.product.findMany({ orderBy: { name: 'asc' } })]);
    res.render('purchases/form', { title: 'Record purchase', suppliers, products, purchaseNumber: invoiceNumber('PUR') });
  } catch (error) { next(error); }
});

app.post('/purchases', async (req, res, next) => {
  try {
    const rows = itemRows(req.body);
    if (!rows.length) return redirectWith(res, '/purchases/new', 'error', 'Add at least one inventory item.');
    const discount = number(req.body.discount);
    const paid = number(req.body.paid);
    const syncCashbook = requestedCashbookSync(req.body);
    await prisma.$transaction(async (tx) => {
      const productIds = [...new Set(rows.map((row) => row.productId))];
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      if (products.length !== productIds.length) throw new Error('One or more selected items no longer exist.');
      const subtotal = rows.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0);
      const total = Math.max(0, subtotal - discount);
      const purchase = await tx.purchase.create({ data: {
        purchaseNumber: req.body.purchaseNumber || invoiceNumber('PUR'), supplierId: req.body.supplierId ? Number(req.body.supplierId) : null,
        purchaseDate: new Date(req.body.purchaseDate || Date.now()), subtotal, discount, total, paid: Math.min(paid, total), paymentMethod: req.body.paymentMethod, notes: req.body.notes || null,
        items: { create: rows.map((row) => ({ productId: row.productId, quantity: row.quantity, unitCost: row.unitPrice, lineTotal: row.unitPrice * row.quantity })) }
      } });
      for (const product of products) {
        const productRows = rows.filter((row) => row.productId === product.id);
        const quantityReceived = productRows.reduce((total, row) => total + row.quantity, 0);
        const latestCost = productRows[productRows.length - 1].unitPrice;
        await tx.product.update({ where: { id: product.id }, data: { quantity: product.quantity + quantityReceived, purchasePrice: latestCost, status: 'AVAILABLE' } });
        await tx.stockMovement.create({ data: { productId: product.id, type: 'PURCHASE', quantity: quantityReceived, note: `Received via ${purchase.purchaseNumber}` } });
      }
      if (syncCashbook && Number(purchase.paid) > 0) {
        await tx.cashbookEntry.create({ data: {
          entryDate: dateInput(purchase.purchaseDate), type: 'OUT', paymentMethod: req.body.paymentMethod, amount: purchase.paid,
          description: `Supplier purchase — ${purchase.purchaseNumber}`, reference: purchase.purchaseNumber, syncLedger: false,
          notes: req.body.notes || null
        } });
      }
    });
    redirectWith(res, '/purchases', 'message', 'Purchase recorded and stock increased.');
  } catch (error) { redirectWith(res, '/purchases/new', 'error', error.message || 'Could not save purchase.'); }
});

app.get('/repairs', async (req, res, next) => {
  try {
    const repairs = await prisma.repair.findMany({ include: { customer: true }, orderBy: [{ status: 'asc' }, { dueDate: 'asc' }] });
    res.render('repairs/index', { title: 'Repairs & orders', repairs });
  } catch (error) { next(error); }
});

app.get('/repairs/new', async (req, res, next) => {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } });
    res.render('repairs/form', { title: 'Receive repair', customers, repairNumber: invoiceNumber('REP') });
  } catch (error) { next(error); }
});

app.post('/repairs', async (req, res, next) => {
  try {
    const syncCashbook = requestedCashbookSync(req.body);
    await prisma.$transaction(async (tx) => {
      const repair = await tx.repair.create({ data: {
        repairNumber: req.body.repairNumber || invoiceNumber('REP'), customerId: Number(req.body.customerId), itemDescription: req.body.itemDescription.trim(),
        metal: req.body.metal || null, grossWeight: nullableNumber(req.body.grossWeight), issueDescription: req.body.issueDescription || null,
        estimatedCharge: number(req.body.estimatedCharge), advancePaid: number(req.body.advancePaid), advancePaymentMethod: req.body.paymentMethod || 'CASH', dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        notes: req.body.notes || null
      } });
      if (syncCashbook && Number(repair.advancePaid) > 0) {
        await tx.cashbookEntry.create({ data: {
          entryDate: dateInput(), type: 'IN', paymentMethod: req.body.paymentMethod, amount: repair.advancePaid,
          description: `Repair advance — ${repair.repairNumber}`, reference: repair.repairNumber, customerId: repair.customerId,
          syncLedger: false, notes: req.body.notes || null
        } });
      }
    });
    redirectWith(res, '/repairs', 'message', 'Repair job received.');
  } catch (error) { next(error); }
});

app.post('/repairs/:id/status', async (req, res, next) => {
  try {
    const status = req.body.status;
    await prisma.repair.update({ where: { id: Number(req.params.id) }, data: { status, finalCharge: nullableNumber(req.body.finalCharge), deliveredAt: status === 'DELIVERED' ? new Date() : null } });
    redirectWith(res, '/repairs', 'message', 'Repair status updated.');
  } catch (error) { next(error); }
});

/* ── Cashbook ─────────────────────────────────────────────── */
app.get('/cashbook', async (req, res, next) => {
  try {
    const selectedDate = req.query.date || dateInput();
    const fromDate = req.query.from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
    const toDate = req.query.to || dateInput();
    const methodFilter = req.query.method || '';
    const where = {
      entryDate: { gte: fromDate, lte: toDate },
      ...(methodFilter ? { paymentMethod: methodFilter } : {})
    };
    const [entries, totals, customers] = await Promise.all([
      prisma.cashbookEntry.findMany({ where, include: { customer: true }, orderBy: [{ entryDate: 'desc' }, { createdAt: 'desc' }] }),
      prisma.cashbookEntry.groupBy({
        by: ['type', 'paymentMethod'],
        where,
        _sum: { amount: true }
      }),
      prisma.customer.findMany({ orderBy: { name: 'asc' } })
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
    res.render('cashbook/index', { title: 'Cashbook', entries, summary, fromDate, toDate, selectedDate, methodFilter, customers });
  } catch (error) { next(error); }
});

app.post('/cashbook', async (req, res, next) => {
  try {
    const amount = number(req.body.amount);
    if (amount <= 0) return redirectWith(res, '/cashbook', 'error', 'Enter a valid amount greater than zero.');
    const customerId = req.body.customerId ? Number(req.body.customerId) : null;
    const syncLedger = req.body.syncLedger === 'on' && customerId;
    const entryDate = req.body.entryDate || dateInput();
    const entryType = req.body.type === 'OUT' ? 'OUT' : 'IN';
    const paymentMethod = req.body.paymentMethod;
    const description = req.body.description.trim();

    await prisma.$transaction(async (tx) => {
      await tx.cashbookEntry.create({
        data: {
          entryDate, type: entryType, paymentMethod, description, amount,
          reference: req.body.reference || null, notes: req.body.notes || null,
          customerId, syncLedger: Boolean(syncLedger)
        }
      });
      // If syncing to customer ledger (e.g., customer repaying their loan)
      if (syncLedger) {
        const isPaymentReceived = entryType === 'IN';
        if (isPaymentReceived) {
          // Customer paying back — reduce their outstanding
          const openSales = await tx.sale.findMany({
            where: { customerId, balance: { gt: 0 } },
            orderBy: { saleDate: 'asc' }
          });
          let remaining = amount;
          const receipt = req.body.reference?.trim() || `CB-${String(Date.now()).slice(-7)}`;
          for (const sale of openSales) {
            if (remaining <= 0) break;
            const allocation = Math.min(remaining, Number(sale.balance));
            await tx.sale.update({
              where: { id: sale.id },
              data: { paid: Number(sale.paid) + allocation, balance: Number(sale.balance) - allocation, paymentMethod: 'MIXED' }
            });
            await tx.customerLedger.create({
              data: {
                customerId, saleId: sale.id, type: 'PAYMENT_RECEIVED', amount: -allocation,
                paymentMethod, reference: receipt, note: `Payment via cashbook · ${description}`
              }
            });
            remaining -= allocation;
          }
        } else {
          // Money going out to customer (e.g., refund) — log as adjustment
          await tx.customerLedger.create({
            data: {
              customerId, type: 'ADJUSTMENT', amount: amount,
              paymentMethod, reference: req.body.reference || null, note: `Cashbook out · ${description}`
            }
          });
        }
      }
    });
    const label = req.body.type === 'OUT' ? 'Cash out' : 'Cash in';
    const syncNote = syncLedger ? ' Customer ledger updated.' : '';
    redirectWith(res, '/cashbook', 'message', `${label} entry saved.${syncNote}`);
  } catch (error) { redirectWith(res, '/cashbook', 'error', error.message || 'Could not save entry.'); }
});

app.post('/cashbook/:id/delete', async (req, res, next) => {
  try {
    await prisma.cashbookEntry.delete({ where: { id: Number(req.params.id) } });
    redirectWith(res, '/cashbook', 'message', 'Entry deleted.');
  } catch (error) { next(error); }
});

/* ── URD Purchases (old gold/silver from customers) ────── */
app.get('/urd-purchases', async (req, res, next) => {
  try {
    const purchases = await prisma.urdPurchase.findMany({ include: { customer: true }, orderBy: { purchaseDate: 'desc' } });
    res.render('urd-purchases/index', { title: 'URD Purchases', purchases });
  } catch (error) { next(error); }
});

app.get('/urd-purchases/new', async (req, res, next) => {
  try {
    const [customers, rateInfo] = await Promise.all([
      prisma.customer.findMany({ orderBy: { name: 'asc' } }),
      getRateForDate(prisma, dateInput())
    ]);
    res.render('urd-purchases/form', { title: 'New URD purchase', customers, rateInfo, purchaseNumber: invoiceNumber('URD'), purchase: null });
  } catch (error) { next(error); }
});

app.post('/urd-purchases', async (req, res, next) => {
  try {
    const totalAmount = number(req.body.totalAmount);
    const paid = Math.min(Math.max(0, number(req.body.paid)), totalAmount);
    const paymentMethod = req.body.paymentMethod || 'CASH';
    const syncCashbook = requestedCashbookSync(req.body);
    const purchase = await prisma.$transaction(async (tx) => {
      const record = await tx.urdPurchase.create({
        data: {
          purchaseNumber: req.body.purchaseNumber || invoiceNumber('URD'),
          customerId: Number(req.body.customerId),
          purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : new Date(),
          metal: req.body.metal || 'GOLD', purity: req.body.purity || null,
          grossWeight: number(req.body.grossWeight), netWeight: number(req.body.netWeight), ratePerGram: number(req.body.ratePerGram),
          totalAmount, paid, paymentMethod, description: req.body.description || null, notes: req.body.notes || null
        }
      });
      if (syncCashbook && paid > 0) {
        await tx.cashbookEntry.create({ data: {
          entryDate: dateInput(record.purchaseDate), type: 'OUT', paymentMethod,
          description: `URD purchase — ${record.purchaseNumber}`, amount: paid, reference: record.purchaseNumber,
          customerId: record.customerId, syncLedger: false, notes: req.body.notes || null
        } });
      }
      return record;
    });
    redirectWith(res, '/urd-purchases', 'message', `URD Purchase ${purchase.purchaseNumber} saved.`);
  } catch (error) { next(error); }
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
    const purchase = await prisma.urdPurchase.findUniqueOrThrow({ where: { id: Number(req.params.id) } });
    await prisma.urdPurchase.delete({ where: { id: purchase.id } });
    redirectWith(res, '/urd-purchases', 'message', 'Purchase deleted.');
  } catch (error) { next(error); }
});

app.get('/reports', async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const to = req.query.to ? new Date(`${req.query.to}T23:59:59`) : new Date();
    const [sales, purchases, saleByMetal, stockProducts, receivables] = await Promise.all([
      prisma.sale.aggregate({ where: { saleDate: { gte: from, lte: to } }, _sum: { subtotal: true, discount: true, gstAmount: true, total: true, paid: true, balance: true }, _count: true }),
      prisma.purchase.aggregate({ where: { purchaseDate: { gte: from, lte: to } }, _sum: { total: true, paid: true }, _count: true }),
      prisma.saleItem.groupBy({ by: ['productId'], _sum: { quantity: true, lineTotal: true }, orderBy: { _sum: { lineTotal: 'desc' } }, take: 5 }),
      prisma.product.findMany({ select: { metal: true, quantity: true, netWeight: true } }),
      prisma.sale.aggregate({ _sum: { balance: true } })
    ]);
    const topProductIds = saleByMetal.map((row) => row.productId);
    const names = await prisma.product.findMany({ where: { id: { in: topProductIds } }, select: { id: true, sku: true, name: true } });
    const topProducts = saleByMetal.map((row) => ({ ...row, product: names.find((p) => p.id === row.productId) }));
    const stockByMetal = Object.values(stockProducts.reduce((summary, product) => {
      if (!summary[product.metal]) summary[product.metal] = { metal: product.metal, quantity: 0, netWeight: 0 };
      summary[product.metal].quantity += product.quantity;
      summary[product.metal].netWeight += Number(product.netWeight) * product.quantity;
      return summary;
    }, {})).sort((a, b) => a.metal.localeCompare(b.metal));
    res.render('reports/index', { title: 'Reports', from, to, sales, purchases, stockByMetal, receivables: receivables._sum.balance || 0, topProducts });
  } catch (error) { next(error); }
});

app.use((req, res) => res.status(404).render('not-found', { title: 'Page not found' }));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', { title: 'Something went wrong', detail: process.env.NODE_ENV === 'development' ? error.message : null });
});

app.listen(port, () => console.log(`Kusum Jewelers ERP running at http://localhost:${port}`));

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });

// The ERP is used in India. Keeping dates in this business timezone prevents
// a date-only form value from becoming the previous calendar day in invoices.
const SHOP_TIME_ZONE = 'Asia/Kolkata';

function shopDateParts(value = new Date()) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: SHOP_TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date(value)).filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumber(value) {
  return value === undefined || value === null || value === '' ? null : number(value);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function dateInput(value = new Date()) {
  const parts = shopDateParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function startOfToday() {
  return new Date(`${dateInput()}T00:00:00+05:30`);
}

function dateTimeFromInput(value) {
  const input = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return new Date(value || Date.now());
  const now = shopDateParts();
  return new Date(`${input}T${now.hour}:${now.minute}:${now.second}+05:30`);
}

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function grams(value) {
  return `${Number(value || 0).toFixed(3)} g`;
}

async function reserveDocumentNumber(tx, prefix, value = new Date()) {
  const day = dateInput(value).replaceAll('-', '');
  const key = `${prefix}-${day}`;
  // LAST_INSERT_ID(expr) is scoped to this MySQL connection. Combined with an
  // interactive Prisma transaction, it atomically reserves a counter value
  // for every LAN client, including the very first request of a new day.
  for (;;) {
    await tx.$executeRaw`
      INSERT INTO \`DocumentSequence\` (\`key\`, \`lastNumber\`, \`updatedAt\`)
      VALUES (${key}, LAST_INSERT_ID(1), CURRENT_TIMESTAMP(3))
      ON DUPLICATE KEY UPDATE
        \`lastNumber\` = LAST_INSERT_ID(\`lastNumber\` + 1),
        \`updatedAt\` = CURRENT_TIMESTAMP(3)
    `;
    const rows = await tx.$queryRaw`SELECT LAST_INSERT_ID() AS lastNumber`;
    const lastNumber = Number(rows?.[0]?.lastNumber);
    if (!Number.isInteger(lastNumber) || lastNumber < 1) {
      throw new Error(`Could not reserve the next ${prefix} document number.`);
    }
    const serial = String(lastNumber).padStart(4, '0');
    const candidate = prefix === 'INV' ? `${day}${serial}` : `${prefix}-${day}-${serial}`;
    const existing = prefix === 'INV'
      ? await tx.sale.findUnique({ where: { invoiceNumber: candidate }, select: { id: true } })
      : await tx.urdPurchase.findUnique({ where: { purchaseNumber: candidate }, select: { id: true } });
    if (!existing) return candidate;
  }
}

async function nextDocumentNumber(db, prefix, value = new Date()) {
  // Prisma's root client has $transaction; its interactive transaction client
  // intentionally does not. This permits the same helper in GET previews and
  // inside sale/URD save transactions without nested transactions.
  if (typeof db.$transaction === 'function') {
    return db.$transaction((tx) => reserveDocumentNumber(tx, prefix, value));
  }
  return reserveDocumentNumber(db, prefix, value);
}

function barcodePrefix(metal, purity) {
  const normalizedPurity = String(purity || '').toUpperCase().replaceAll(' ', '');
  if (metal === 'GOLD' && normalizedPurity === '24K') return 'G24';
  if (metal === 'GOLD') return 'G22';
  if (metal === 'SILVER') return 'S';
  return 'J';
}

function metalRateFromDailyRate(product, dailyRate) {
  if (!dailyRate) return 0;
  const purity = String(product.purity || '').toUpperCase().replaceAll(' ', '');
  if (product.metal === 'GOLD' && purity === '24K') return number(dailyRate.gold24k);
  if (product.metal === 'GOLD') return number(dailyRate.gold22k);
  if (product.metal === 'SILVER') return number(dailyRate.silver);
  return 0;
}

function makingAmount(type, value, metalAmount, weight, quantity = 1) {
  const charge = number(value);
  if (type === 'FIXED') return charge * quantity;
  if (type === 'PERCENTAGE') return metalAmount * charge / 100;
  return charge * number(weight) * quantity;
}

module.exports = { number, nullableNumber, asArray, dateInput, startOfToday, dateTimeFromInput, money, grams, nextDocumentNumber, barcodePrefix, metalRateFromDailyRate, makingAmount };

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

async function nextDocumentNumber(db, prefix, value = new Date()) {
  const day = dateInput(value).replaceAll('-', '');
  const key = `${prefix}-${day}`;
  // MySQL atomically advances this shared counter, so every LAN client receives
  // a short, sequential number without duplicate invoice numbers. The lookup
  // also skips a matching number that may already exist from older ERP data.
  for (;;) {
    const sequence = await db.documentSequence.upsert({
      where: { key },
      create: { key, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } }
    });
    const serial = String(sequence.lastNumber).padStart(4, '0');
    const candidate = prefix === 'INV' ? `${day}${serial}` : `${prefix}-${day}-${serial}`;
    const existing = prefix === 'INV'
      ? await db.sale.findUnique({ where: { invoiceNumber: candidate }, select: { id: true } })
      : await db.urdPurchase.findUnique({ where: { purchaseNumber: candidate }, select: { id: true } });
    if (!existing) return candidate;
  }
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

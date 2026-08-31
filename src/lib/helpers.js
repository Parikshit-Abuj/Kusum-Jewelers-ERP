// The shop asked that every operational date follow the Windows computer.
// Use local Date getters rather than UTC conversion or a hard-coded timezone.
function localDateParts(value = new Date()) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid date or time.');
  const pad = (part) => String(part).padStart(2, '0');
  return {
    year: String(date.getFullYear()),
    month: pad(date.getMonth() + 1),
    day: pad(date.getDate()),
    hour: pad(date.getHours()),
    minute: pad(date.getMinutes()),
    second: pad(date.getSeconds())
  };
}

function localTimeZoneName(value = new Date()) {
  return new Intl.DateTimeFormat('en-IN', { timeZoneName: 'long' })
    .formatToParts(new Date(value))
    .find((part) => part.type === 'timeZoneName')?.value || 'Windows local time';
}

function localDateBoundary(value, endOfDay = false) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
  if (!match) throw new Error('Choose a valid date.');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('Choose a valid date.');
  }
  return date;
}

function localDateTimeRange(from, to) {
  return { gte: localDateBoundary(from), lte: localDateBoundary(to, true) };
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
  const parts = localDateParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function dateTimeFromInput(value) {
  const input = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return new Date(value || Date.now());
  const now = new Date();
  const date = localDateBoundary(input);
  date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  return date;
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

async function reserveBatchNumber(tx, value = new Date()) {
  const day = dateInput(value).replaceAll('-', '');
  const prefix = `BATCH-${day}`;
  const key = `BATCH-${day}`;
  // Legacy batch counters are initialized once by a migration. Every normal
  // reservation below is a single atomic database statement, even when two
  // counters open Batch Add at the exact same time.
  await tx.$executeRaw`
    INSERT INTO \`DocumentSequence\` (\`key\`, \`lastNumber\`, \`updatedAt\`)
    VALUES (${key}, LAST_INSERT_ID(1), CURRENT_TIMESTAMP(3))
    ON DUPLICATE KEY UPDATE
      \`lastNumber\` = LAST_INSERT_ID(\`lastNumber\` + 1),
      \`updatedAt\` = CURRENT_TIMESTAMP(3)
  `;
  const rows = await tx.$queryRaw`SELECT LAST_INSERT_ID() AS lastNumber`;
  const serial = Number(rows?.[0]?.lastNumber);
  if (!Number.isInteger(serial) || serial < 1) throw new Error('Could not reserve a unique batch document number.');
  return `${prefix}-${String(serial).padStart(2, '0')}`;
}

async function nextBatchDocumentNumber(db, value = new Date()) {
  if (typeof db.$transaction === 'function') {
    return db.$transaction((tx) => reserveBatchNumber(tx, value));
  }
  return reserveBatchNumber(db, value);
}

function barcodePrefix(metal) {
  if (metal === 'GOLD') return 'G';
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

module.exports = {
  number, nullableNumber, asArray, dateInput, startOfToday, dateTimeFromInput,
  localDateParts, localDateBoundary, localDateTimeRange, localTimeZoneName,
  money, grams, nextDocumentNumber, nextBatchDocumentNumber, barcodePrefix,
  metalRateFromDailyRate, makingAmount
};

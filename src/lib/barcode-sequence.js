// Variable-length Base-36 suffixes use the shortest representation from 1 to
// 6 characters. This gives 2,176,782,335 values per metal series while keeping
// the labels compact (G 1, G A, G 10, ... G ZZZZZZ).
// The visible barcode format is intentionally separate from the sequence key:
// old labels remain valid while new labels are allocated atomically.
const BASE36_MIN_SERIAL = 1n;
const BASE36_WIDTH = 6;
const BASE36_MAX_SERIAL = (36n ** BigInt(BASE36_WIDTH)) - 1n;

function base36BarcodePrefix(metal) {
  if (metal === 'GOLD') return 'G';
  if (metal === 'SILVER') return 'S';
  return 'J';
}

function barcodeSeriesKey(metal) {
  return `${base36BarcodePrefix(metal)}_B36`;
}

function normalizeSerial(serial) {
  if (typeof serial === 'bigint') return serial;
  if (typeof serial === 'number') {
    if (!Number.isSafeInteger(serial)) return null;
    return BigInt(serial);
  }
  if (typeof serial === 'string' && /^\d+$/.test(serial.trim())) {
    try { return BigInt(serial.trim()); } catch { return null; }
  }
  return null;
}

function base36Suffix(serial) {
  const value = normalizeSerial(serial);
  if (value === null || value < BASE36_MIN_SERIAL || value > BASE36_MAX_SERIAL) {
    throw new Error(`Barcode serial must be between 1 and ${BASE36_MAX_SERIAL.toString(10)}.`);
  }
  return value.toString(36).toUpperCase();
}

function formatBarcode(prefix, serial) {
  return `${prefix} ${base36Suffix(serial)}`;
}

/**
 * Reserve the next variable-length (1–6 character) Base-36 barcode while holding the caller's database
 * transaction. `LAST_INSERT_ID(expr)` is connection-local in MySQL, making
 * the returned value safe even when several shop PCs add the same metal at
 * the exact same time.
 */
async function nextBarcode(tx, metal) {
  const prefix = base36BarcodePrefix(metal);
  const seriesKey = barcodeSeriesKey(metal);

  // The migration creates independent Base-36 counters. This never reuses the
  // legacy space-separated counters, so old product, sale and movement
  // records remain untouched and scannable.
  await tx.$executeRaw`
    INSERT INTO \`BarcodeSequence\` (\`prefix\`, \`lastNumber\`, \`updatedAt\`)
    VALUES (${seriesKey}, LAST_INSERT_ID(1), CURRENT_TIMESTAMP(3))
    ON DUPLICATE KEY UPDATE
      \`lastNumber\` = LAST_INSERT_ID(\`lastNumber\` + 1),
      \`updatedAt\` = CURRENT_TIMESTAMP(3)
  `;

  const rows = await tx.$queryRaw`SELECT LAST_INSERT_ID() AS lastNumber`;
  const rawLastNumber = rows?.[0]?.lastNumber;
  let lastNumber;
  try { lastNumber = BigInt(String(rawLastNumber)); } catch { lastNumber = null; }
  if (lastNumber === null || lastNumber < BASE36_MIN_SERIAL) {
    throw new Error(`Could not reserve the next ${prefix} barcode number.`);
  }
  if (lastNumber > BASE36_MAX_SERIAL) {
    throw new Error(`${prefix} Base-36 barcode series is full at ${prefix} ZZZZZZ. Contact support before adding another ${prefix} item.`);
  }
  return formatBarcode(prefix, lastNumber);
}

module.exports = {
  BASE36_MAX_SERIAL,
  BASE36_WIDTH,
  base36BarcodePrefix,
  barcodeSeriesKey,
  base36Suffix,
  formatBarcode,
  nextBarcode
};

// Five Base-36 characters cover 60,466,175 values from 00001 through ZZZZZ.
// The visible barcode format is intentionally separate from the sequence key:
// old labels such as "G22 84" remain valid while new labels start at
// "G 00001" without any possibility of a duplicate.
const BASE36_WIDTH = 5;
const BASE36_MAX_SERIAL = (36 ** BASE36_WIDTH) - 1;

function base36BarcodePrefix(metal) {
  if (metal === 'GOLD') return 'G';
  if (metal === 'SILVER') return 'S';
  return 'J';
}

function barcodeSeriesKey(metal) {
  return `${base36BarcodePrefix(metal)}_B36`;
}

function base36Suffix(serial) {
  if (!Number.isInteger(serial) || serial < 1 || serial > BASE36_MAX_SERIAL) {
    throw new Error(`Barcode serial must be between 1 and ${BASE36_MAX_SERIAL}.`);
  }
  return serial.toString(36).toUpperCase().padStart(BASE36_WIDTH, '0');
}

function formatBarcode(prefix, serial) {
  return `${prefix} ${base36Suffix(serial)}`;
}

/**
 * Reserve the next Base-36 barcode while holding the caller's database
 * transaction. `LAST_INSERT_ID(expr)` is connection-local in MySQL, making
 * the returned value safe even when several shop PCs add the same metal and
 * purity at the exact same time.
 */
async function nextBarcode(tx, metal, purity) {
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
  const lastNumber = Number(rows?.[0]?.lastNumber);
  if (!Number.isInteger(lastNumber) || lastNumber < 1) {
    throw new Error(`Could not reserve the next ${prefix} barcode number.`);
  }
  if (lastNumber > BASE36_MAX_SERIAL) {
    throw new Error(`${prefix} Base-36 barcode series is full at ${prefix} ZZZZZ. Contact support before adding another ${prefix} item.`);
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

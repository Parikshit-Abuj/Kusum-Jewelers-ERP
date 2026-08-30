const { barcodePrefix } = require('./helpers');

/**
 * Reserve the next barcode number while holding the caller's database
 * transaction. `LAST_INSERT_ID(expr)` is connection-local in MySQL, which
 * makes the returned number safe even when several counter PCs add the first
 * item of the same metal/purity at the exact same time.
 */
async function nextBarcode(tx, metal, purity) {
  const prefix = barcodePrefix(metal, purity);

  // A migration seeds old installations from live and historical records;
  // this statement then reserves each new barcode atomically.
  await tx.$executeRaw`
    INSERT INTO \`BarcodeSequence\` (\`prefix\`, \`lastNumber\`, \`updatedAt\`)
    VALUES (${prefix}, LAST_INSERT_ID(1), CURRENT_TIMESTAMP(3))
    ON DUPLICATE KEY UPDATE
      \`lastNumber\` = LAST_INSERT_ID(\`lastNumber\` + 1),
      \`updatedAt\` = CURRENT_TIMESTAMP(3)
  `;

  const rows = await tx.$queryRaw`SELECT LAST_INSERT_ID() AS lastNumber`;
  const lastNumber = Number(rows?.[0]?.lastNumber);
  if (!Number.isInteger(lastNumber) || lastNumber < 1) {
    throw new Error(`Could not reserve the next ${prefix} barcode number.`);
  }
  return `${prefix} ${lastNumber}`;
}

module.exports = { nextBarcode };

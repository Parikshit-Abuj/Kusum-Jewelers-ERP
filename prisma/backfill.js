const { PrismaClient } = require('@prisma/client');
const { BASE36_MAX_SERIAL, base36BarcodePrefix, formatBarcode } = require('../src/lib/barcode-sequence');

const prisma = new PrismaClient();

async function main() {
  if (process.env.KUSUM_ALLOW_BARCODE_BACKFILL !== 'yes') {
    throw new Error('Barcode backfill is a one-time maintenance tool and is disabled for safety. It must not be run against a live shop database by accident.');
  }
  const [products, stockMovements, saleItems] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'asc' } }),
    // Sold products are removed from Product, so their last barcode is kept
    // in StockMovement/SaleItem history. Include those records when advancing
    // the counter or a backfill can reuse an already billed label.
    prisma.stockMovement.findMany({
      where: { productBarcode: { not: null } },
      select: { productBarcode: true }
    }),
    prisma.saleItem.findMany({
      where: { productBarcode: { not: null } },
      select: { productBarcode: true }
    })
  ]);
  const counters = new Map();

  const historicalBarcodes = [
    ...products.map((product) => ({ barcode: product.barcode, metal: product.metal })),
    ...stockMovements.map((row) => ({ barcode: row.productBarcode, metal: null })),
    ...saleItems.map((row) => ({ barcode: row.productBarcode, metal: null }))
  ];

  const updates = [];
  for (const record of historicalBarcodes) {
    const fallbackPrefix = record.metal ? base36BarcodePrefix(record.metal) : null;
    const match = String(record.barcode || '').match(/^([GSJ])\s+([0-9A-Z]{1,6})$/i);
    if (match) {
      const serial = BigInt(Number.parseInt(match[2], 36));
      const prefix = match[1].toUpperCase();
      counters.set(prefix, (counters.get(prefix) || 0n) > serial ? counters.get(prefix) : serial);
    } else if (fallbackPrefix) {
      const legacyMatch = String(record.barcode || '').match(new RegExp(`^${fallbackPrefix}\\s+([0-9A-Z]{1,6})$`, 'i'));
      if (legacyMatch) {
        const serial = BigInt(Number.parseInt(legacyMatch[1], 36));
        counters.set(fallbackPrefix, (counters.get(fallbackPrefix) || 0n) > serial ? counters.get(fallbackPrefix) : serial);
      }
    }
  }

  for (const product of products) {
    const prefix = base36BarcodePrefix(product.metal);
    let barcode = product.barcode;
    if (!barcode) {
      const next = (counters.get(prefix) || 0n) + 1n;
      if (next > BASE36_MAX_SERIAL) {
        throw new Error(`${prefix} Base-36 barcode series is full at ${prefix} ZZZZZZ. No barcode was written.`);
      }
      counters.set(prefix, next);
      barcode = formatBarcode(prefix, next);
    }
    updates.push({
      id: product.id,
      barcode,
      makingChargeType: product.makingChargeType || 'PER_GRAM',
      makingChargeValue: Number(product.makingChargeValue) || Number(product.makingChargePerGram)
    });
  }

  // Preflight the final barcode set before writing anything. A transaction
  // avoids a half-backfilled live ERP if one legacy record is invalid.
  const allBarcodes = updates.map((update) => update.barcode).filter(Boolean);
  if (new Set(allBarcodes).size !== allBarcodes.length) throw new Error('Backfill would create duplicate barcodes. No changes were made.');

  await prisma.$transaction(async (tx) => {
    for (const update of updates) {
      await tx.product.update({
        where: { id: update.id },
        data: {
          barcode: update.barcode,
          makingChargeType: update.makingChargeType,
          makingChargeValue: update.makingChargeValue
        }
      });
    }
    for (const [prefix, lastNumber] of counters) {
      const sequenceKey = `${prefix}_B36`;
      const existing = await tx.barcodeSequence.findUnique({ where: { prefix: sequenceKey } });
      if (!existing) {
        await tx.barcodeSequence.create({ data: { prefix: sequenceKey, lastNumber } });
      } else if (BigInt(String(existing.lastNumber)) < lastNumber) {
        await tx.barcodeSequence.update({ where: { prefix: sequenceKey }, data: { lastNumber } });
      }
    }
  });

  console.log(`Backfilled ${products.length} product(s) with barcodes and making-charge settings.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());

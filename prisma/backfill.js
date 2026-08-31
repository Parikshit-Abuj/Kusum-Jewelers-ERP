const { PrismaClient } = require('@prisma/client');
const { base36BarcodePrefix, formatBarcode } = require('../src/lib/barcode-sequence');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  const counters = new Map();

  for (const product of products) {
    const prefix = base36BarcodePrefix(product.metal);
    const match = product.barcode?.match(new RegExp(`^${prefix}\\s+([0-9A-Z]{5})$`, 'i'));
    if (match) {
      const serial = Number.parseInt(match[1], 36);
      counters.set(prefix, Math.max(counters.get(prefix) || 0, serial));
    }
  }

  for (const product of products) {
    const prefix = base36BarcodePrefix(product.metal);
    let barcode = product.barcode;
    if (!barcode) {
      const next = (counters.get(prefix) || 0) + 1;
      counters.set(prefix, next);
      barcode = formatBarcode(prefix, next);
    }
    await prisma.product.update({
      where: { id: product.id },
      data: {
        barcode,
        makingChargeType: product.makingChargeType || 'PER_GRAM',
        makingChargeValue: Number(product.makingChargeValue) || Number(product.makingChargePerGram)
      }
    });
  }

  for (const [prefix, lastNumber] of counters) {
    const sequenceKey = `${prefix}_B36`;
    const existing = await prisma.barcodeSequence.findUnique({ where: { prefix: sequenceKey } });
    if (!existing) {
      await prisma.barcodeSequence.create({ data: { prefix: sequenceKey, lastNumber } });
    } else if (existing.lastNumber < lastNumber) {
      await prisma.barcodeSequence.update({ where: { prefix: sequenceKey }, data: { lastNumber } });
    }
  }

  console.log(`Backfilled ${products.length} product(s) with barcodes and making-charge settings.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());

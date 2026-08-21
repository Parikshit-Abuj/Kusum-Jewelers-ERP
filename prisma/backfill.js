const { PrismaClient } = require('@prisma/client');
const { barcodePrefix } = require('../src/lib/helpers');

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  const counters = new Map();

  for (const product of products) {
    const prefix = barcodePrefix(product.metal, product.purity);
    const match = product.barcode?.match(new RegExp(`^${prefix}\\s+(\\d+)$`, 'i'));
    if (match) counters.set(prefix, Math.max(counters.get(prefix) || 0, Number(match[1])));
  }

  for (const product of products) {
    const prefix = barcodePrefix(product.metal, product.purity);
    let barcode = product.barcode;
    if (!barcode) {
      const next = (counters.get(prefix) || 0) + 1;
      counters.set(prefix, next);
      barcode = `${prefix} ${next}`;
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
    await prisma.barcodeSequence.upsert({
      where: { prefix },
      create: { prefix, lastNumber },
      update: { lastNumber }
    });
  }

  console.log(`Backfilled ${products.length} product(s) with barcodes and making-charge settings.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());

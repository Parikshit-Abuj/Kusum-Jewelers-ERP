const { PrismaClient, MetalType, ProductStatus, MovementType } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  if (process.env.KUSUM_ALLOW_SAMPLE_SEED !== 'yes') {
    throw new Error('Sample seed is disabled for safety. It must never be run against a shop database.');
  }
  const count = await prisma.product.count();
  if (count > 0) return;

  const customer = await prisma.customer.create({ data: { name: 'Walk-in Customer', phone: '0000000000' } });
  const products = [
    { barcode: 'G 00001', sku: 'KJ-G-00001', name: 'Classic Gold Chain', category: 'Chain', metal: MetalType.GOLD, purity: '22K', grossWeight: 12.450, netWeight: 12.450, quantity: 1, purchasePrice: 85000, sellingPrice: 91500, makingChargePerGram: 650, location: 'Gold Tray A' },
    { barcode: 'G 00002', sku: 'KJ-G-00002', name: 'Floral Gold Ring', category: 'Ring', metal: MetalType.GOLD, purity: '22K', grossWeight: 4.200, netWeight: 4.200, quantity: 1, purchasePrice: 29500, sellingPrice: 32400, makingChargePerGram: 750, location: 'Gold Tray B' },
    { barcode: 'S 00001', sku: 'KJ-S-00001', name: 'Silver Payal Pair', category: 'Payal', metal: MetalType.SILVER, purity: null, grossWeight: 38.600, netWeight: 38.600, quantity: 1, purchasePrice: 3100, sellingPrice: 3850, makingChargePerGram: 20, location: 'Silver Counter' }
  ];
  for (const item of products) {
    const product = await prisma.product.create({ data: { ...item, status: ProductStatus.AVAILABLE } });
    await prisma.stockMovement.create({ data: { productId: product.id, type: MovementType.OPENING, quantity: product.quantity, note: 'Initial sample inventory' } });
  }
  await prisma.barcodeSequence.upsert({ where: { prefix: 'G_B36' }, create: { prefix: 'G_B36', lastNumber: 2 }, update: { lastNumber: 2 } });
  await prisma.barcodeSequence.upsert({ where: { prefix: 'S_B36' }, create: { prefix: 'S_B36', lastNumber: 1 }, update: { lastNumber: 1 } });
  console.log(`Seeded starter data. Walk-in customer id: ${customer.id}`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());

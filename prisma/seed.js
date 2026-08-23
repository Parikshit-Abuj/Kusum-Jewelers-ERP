const { PrismaClient, MetalType, ProductStatus, MovementType } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) return;

  const customer = await prisma.customer.create({ data: { name: 'Walk-in Customer', phone: '0000000000' } });
  const products = [
    { sku: 'KJ-G-001', name: 'Classic Gold Chain', category: 'Chain', metal: MetalType.GOLD, purity: '22K', grossWeight: 12.450, netWeight: 12.450, quantity: 2, purchasePrice: 85000, sellingPrice: 91500, makingChargePerGram: 650, location: 'Gold Tray A' },
    { sku: 'KJ-G-002', name: 'Floral Gold Ring', category: 'Ring', metal: MetalType.GOLD, purity: '22K', grossWeight: 4.200, netWeight: 4.200, quantity: 4, purchasePrice: 29500, sellingPrice: 32400, makingChargePerGram: 750, location: 'Gold Tray B' },
    { sku: 'KJ-S-001', name: 'Silver Payal Pair', category: 'Payal', metal: MetalType.SILVER, purity: '925', grossWeight: 38.600, netWeight: 38.600, quantity: 6, purchasePrice: 3100, sellingPrice: 3850, makingChargePerGram: 20, location: 'Silver Counter' }
  ];
  for (const item of products) {
    const product = await prisma.product.create({ data: { ...item, status: ProductStatus.AVAILABLE } });
    await prisma.stockMovement.create({ data: { productId: product.id, type: MovementType.OPENING, quantity: product.quantity, note: 'Initial sample inventory' } });
  }
  console.log(`Seeded starter data. Walk-in customer id: ${customer.id}`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());

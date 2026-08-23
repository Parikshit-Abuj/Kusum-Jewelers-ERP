const RESOURCE_LIST = [
  { key: 'sales', label: 'Sales invoices', dateLabel: 'Invoice date', archiveNote: 'Only invoices with no credit balance due can be removed. URD settlements do not block deletion.' },
  { key: 'urd', label: 'URD purchases', dateLabel: 'URD purchase date', archiveNote: 'Only URD purchases with no amount still payable to the customer can be removed.' },
  { key: 'cashbook', label: 'Daily cashbook', dateLabel: 'Entry date', archiveNote: 'Cashbook entries in the chosen period are permanently removed.' },
  { key: 'inventory', label: 'Inventory records', dateLabel: 'Created date', archiveNote: 'Only zero-stock records can be removed. Sold barcode items are automatically removed when billed.' },
  { key: 'stock-movements', label: 'Stock movements', dateLabel: 'Movement date', archiveNote: 'Movement history can be removed without changing current stock quantity.' },
  { key: 'customers', label: 'Customer directory', dateLabel: 'Customer created date', archiveNote: 'Only customers with no sales, URD, cashbook or ledger history can be removed.' },
  { key: 'customer-ledger', label: 'Customer ledger', dateLabel: 'Ledger date', archiveNote: 'Export only. Ledger entries cannot be deleted independently because that would alter customer due balances.', archiveDisabled: true },
  { key: 'rates', label: 'Daily metal rates', dateLabel: 'Rate date', archiveNote: 'Saved daily rates in the chosen period are permanently removed.' }
];

const RESOURCE_MAP = new Map(RESOURCE_LIST.map((resource) => [resource.key, resource]));

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

function parseDateRange(source) {
  const from = String(source.from || '2000-01-01');
  const to = String(source.to || today());
  if (!isDate(from) || !isDate(to) || from > to) throw new Error('Choose a valid From and To date range.');
  return { from, to };
}

function resourceFor(key) {
  const resource = RESOURCE_MAP.get(key);
  if (!resource) throw new Error('Choose a valid data register.');
  return resource;
}

function dateTimeRange(range) {
  return { gte: new Date(`${range.from}T00:00:00`), lte: new Date(`${range.to}T23:59:59.999`) };
}

function amount(value) {
  return Number(value || 0);
}

function description(value) {
  return value || '';
}

function exportEnvelope(resource, range, columns, rows) {
  return {
    title: `Kusum Jewelers ERP - ${resource.label}`,
    subtitle: `${resource.dateLabel}: ${range.from} to ${range.to} | ${rows.length} exported row${rows.length === 1 ? '' : 's'}`,
    columns,
    rows,
    filename: `${resource.key}-${range.from}-to-${range.to}.xlsx`
  };
}

const common = {
  date: (key, label = 'Date') => ({ key, label, type: 'date', width: 14 }),
  text: (key, label, width = 20) => ({ key, label, type: 'text', width }),
  currency: (key, label) => ({ key, label, type: 'currency', width: 16 }),
  number: (key, label) => ({ key, label, type: 'number', width: 12 }),
  weight: (key, label) => ({ key, label, type: 'weight', width: 13 })
};

async function getExportPayload(db, key, range) {
  const resource = resourceFor(key);
  switch (key) {
    case 'sales': {
      const sales = await db.sale.findMany({
        where: { saleDate: dateTimeRange(range) }, orderBy: [{ saleDate: 'asc' }, { id: 'asc' }],
        include: { customer: true, items: { include: { product: true } } }
      });
      const rows = sales.flatMap((sale) => sale.items.map((item) => ({
        saleDate: sale.saleDate, invoiceNumber: sale.invoiceNumber, customerPhone: sale.customer?.phone || '', customerName: sale.customer?.name || 'Walk-in customer',
        barcode: item.product?.barcode || item.productBarcode || item.product?.sku || item.productSku, itemName: item.product?.name || item.productName, metal: item.product?.metal || item.productMetal || '', purity: item.product?.purity || item.productPurity || '', quantity: item.quantity,
        weight: amount(item.weight), metalRate: amount(item.metalRate), makingCharge: amount(item.makingCharge), taxableAmount: amount(item.taxableAmount),
        invoiceTotal: amount(sale.total), urdOffset: amount(sale.urdOffset), paid: amount(sale.paid), balance: amount(sale.balance), paymentMethod: sale.paymentMethod, notes: description(sale.notes)
      })));
      return exportEnvelope(resource, range, [common.date('saleDate', 'Invoice date'), common.text('invoiceNumber', 'Invoice no.'), common.text('customerPhone', 'Customer phone', 16), common.text('customerName', 'Customer name'), common.text('barcode', 'Barcode', 14), common.text('itemName', 'Item'), common.text('metal', 'Metal', 12), common.text('purity', 'Purity', 10), common.number('quantity', 'Qty'), common.weight('weight', 'Weight (g)'), common.currency('metalRate', 'Rate / g'), common.currency('makingCharge', 'Making'), common.currency('taxableAmount', 'Amount ex. GST'), common.currency('invoiceTotal', 'Invoice total'), common.currency('urdOffset', 'URD adjustment'), common.currency('paid', 'Paid'), common.currency('balance', 'Balance'), common.text('paymentMethod', 'Payment method', 16), common.text('notes', 'Notes', 30)], rows);
    }
    case 'urd': {
      const purchases = await db.urdPurchase.findMany({ where: { purchaseDate: dateTimeRange(range) }, orderBy: [{ purchaseDate: 'asc' }, { id: 'asc' }], include: { customer: true, sale: true } });
      const rows = purchases.map((purchase) => ({ purchaseDate: purchase.purchaseDate, purchaseNumber: purchase.purchaseNumber, customerPhone: purchase.customer.phone || '', customerName: purchase.customer.name, metal: purchase.metal, purity: purchase.purity || '', grossWeight: amount(purchase.grossWeight), netWeight: amount(purchase.netWeight), ratePerGram: amount(purchase.ratePerGram), totalAmount: amount(purchase.totalAmount), saleOffset: amount(purchase.saleOffset), paid: amount(purchase.paid), paymentMethod: purchase.paymentMethod, settledSale: purchase.sale?.invoiceNumber || '', description: description(purchase.description), notes: description(purchase.notes) }));
      return exportEnvelope(resource, range, [common.date('purchaseDate', 'Purchase date'), common.text('purchaseNumber', 'URD no.'), common.text('customerPhone', 'Customer phone', 16), common.text('customerName', 'Customer'), common.text('metal', 'Metal', 12), common.text('purity', 'Purity', 10), common.weight('grossWeight', 'Gross wt. (g)'), common.weight('netWeight', 'Net wt. (g)'), common.currency('ratePerGram', 'Rate / g'), common.currency('totalAmount', 'Total'), common.currency('saleOffset', 'Sale adjustment'), common.currency('paid', 'Paid'), common.text('paymentMethod', 'Payment method', 16), common.text('settledSale', 'Settled sale'), common.text('description', 'Description', 30), common.text('notes', 'Notes', 30)], rows);
    }
    case 'cashbook': {
      const entries = await db.cashbookEntry.findMany({ where: { entryDate: { gte: range.from, lte: range.to } }, orderBy: [{ entryDate: 'asc' }, { id: 'asc' }], include: { customer: true } });
      const rows = entries.map((entry) => ({ entryDate: entry.entryDate, type: entry.type, paymentMethod: entry.paymentMethod, description: entry.description, amount: amount(entry.amount), reference: entry.reference || '', customerPhone: entry.customer?.phone || '', customerName: entry.customer?.name || '', syncLedger: entry.syncLedger ? 'Yes' : 'No', notes: description(entry.notes) }));
      return exportEnvelope(resource, range, [common.date('entryDate', 'Entry date'), common.text('type', 'Type', 10), common.text('paymentMethod', 'Payment method', 16), common.text('description', 'Description', 32), common.currency('amount', 'Amount'), common.text('reference', 'Reference', 18), common.text('customerPhone', 'Customer phone', 16), common.text('customerName', 'Customer'), common.text('syncLedger', 'Ledger synced', 14), common.text('notes', 'Notes', 30)], rows);
    }
    case 'inventory': {
      const products = await db.product.findMany({ where: { createdAt: dateTimeRange(range) }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] });
      const rows = products.map((product) => ({ createdAt: product.createdAt, barcode: product.barcode || '', sku: product.sku, itemName: product.name, category: product.category, metal: product.metal, purity: product.purity || '', grossWeight: amount(product.grossWeight), stoneWeight: amount(product.stoneWeight), netWeight: amount(product.netWeight), quantity: product.quantity, purchasePrice: amount(product.purchasePrice), sellingPrice: amount(product.sellingPrice), status: product.status, location: product.location || '', notes: description(product.notes) }));
      return exportEnvelope(resource, range, [common.date('createdAt', 'Created date'), common.text('barcode', 'Barcode', 16), common.text('sku', 'SKU', 16), common.text('itemName', 'Item'), common.text('category', 'Category'), common.text('metal', 'Metal', 12), common.text('purity', 'Purity', 10), common.weight('grossWeight', 'Gross wt. (g)'), common.weight('stoneWeight', 'Stone wt. (g)'), common.weight('netWeight', 'Net wt. (g)'), common.number('quantity', 'Stock qty'), common.currency('purchasePrice', 'Purchase price'), common.currency('sellingPrice', 'Selling price'), common.text('status', 'Status', 14), common.text('location', 'Location'), common.text('notes', 'Notes', 30)], rows);
    }
    case 'stock-movements': {
      const movements = await db.stockMovement.findMany({ where: { createdAt: dateTimeRange(range) }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], include: { product: true } });
      const rows = movements.map((movement) => ({ createdAt: movement.createdAt, barcode: movement.product.barcode || '', sku: movement.product.sku, itemName: movement.product.name, type: movement.type, quantity: movement.quantity, note: description(movement.note) }));
      return exportEnvelope(resource, range, [common.date('createdAt', 'Movement date'), common.text('barcode', 'Barcode', 16), common.text('sku', 'SKU', 16), common.text('itemName', 'Item'), common.text('type', 'Movement type', 18), common.number('quantity', 'Qty change'), common.text('note', 'Note', 34)], rows);
    }
    case 'customers': {
      const customers = await db.customer.findMany({ where: { createdAt: dateTimeRange(range) }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], include: { ledger: { select: { amount: true } }, _count: { select: { sales: true, urdPurchases: true } } } });
      const rows = customers.map((customer) => ({ createdAt: customer.createdAt, customerPhone: customer.phone || '', customerName: customer.name, email: customer.email || '', address: customer.address || '', salesCount: customer._count.sales, urdCount: customer._count.urdPurchases, outstanding: customer.ledger.reduce((total, entry) => total + amount(entry.amount), 0) }));
      return exportEnvelope(resource, range, [common.date('createdAt', 'Created date'), common.text('customerPhone', 'Customer phone / ID', 18), common.text('customerName', 'Customer'), common.text('email', 'Email', 24), common.text('address', 'Address', 34), common.number('salesCount', 'Sales'), common.number('urdCount', 'URD purchases'), common.currency('outstanding', 'Outstanding due')], rows);
    }
    case 'customer-ledger': {
      const entries = await db.customerLedger.findMany({ where: { createdAt: dateTimeRange(range) }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], include: { customer: true, sale: true } });
      const rows = entries.map((entry) => ({ createdAt: entry.createdAt, customerPhone: entry.customer.phone || '', customerName: entry.customer.name, type: entry.type, invoiceNumber: entry.sale?.invoiceNumber || '', amount: amount(entry.amount), paymentMethod: entry.paymentMethod || '', reference: entry.reference || '', note: description(entry.note) }));
      return exportEnvelope(resource, range, [common.date('createdAt', 'Ledger date'), common.text('customerPhone', 'Customer phone / ID', 18), common.text('customerName', 'Customer'), common.text('type', 'Entry type', 18), common.text('invoiceNumber', 'Invoice no.'), common.currency('amount', 'Amount'), common.text('paymentMethod', 'Payment method', 16), common.text('reference', 'Reference', 18), common.text('note', 'Note', 34)], rows);
    }
    case 'rates': {
      const rates = await db.dailyRate.findMany({ where: { rateDate: { gte: range.from, lte: range.to } }, orderBy: { rateDate: 'asc' } });
      const rows = rates.map((rate) => ({ rateDate: rate.rateDate, gold22k: amount(rate.gold22k), gold24k: amount(rate.gold24k), silver: amount(rate.silver), note: description(rate.note) }));
      return exportEnvelope(resource, range, [common.date('rateDate', 'Rate date'), common.currency('gold22k', '22K gold / g'), common.currency('gold24k', '24K gold / g'), common.currency('silver', 'Silver / g'), common.text('note', 'Note', 34)], rows);
    }
    default:
      throw new Error('That data register is not available.');
  }
}

async function archiveData(db, key, range) {
  const resource = resourceFor(key);
  if (resource.archiveDisabled) throw new Error(resource.archiveNote);
  return db.$transaction(async (tx) => {
    if (key === 'sales') {
      const candidates = await tx.sale.findMany({ where: { saleDate: dateTimeRange(range) }, select: { id: true, balance: true } });
      const ids = candidates.filter((sale) => amount(sale.balance) <= 0.01).map((sale) => sale.id);
      if (ids.length) {
        await tx.customerLedger.deleteMany({ where: { saleId: { in: ids } } });
        await tx.sale.deleteMany({ where: { id: { in: ids } } });
      }
      return { deleted: ids.length, skipped: candidates.length - ids.length, note: 'Invoices with an outstanding customer balance were kept.' };
    }
    if (key === 'urd') {
      const candidates = await tx.urdPurchase.findMany({ where: { purchaseDate: dateTimeRange(range) }, select: { id: true, totalAmount: true, paid: true, saleOffset: true } });
      const ids = candidates.filter((purchase) => amount(purchase.totalAmount) - amount(purchase.paid) - amount(purchase.saleOffset) <= 0.01).map((purchase) => purchase.id);
      const result = ids.length ? await tx.urdPurchase.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'URD purchases with an unpaid customer amount were kept.' };
    }
    if (key === 'cashbook') {
      const result = await tx.cashbookEntry.deleteMany({ where: { entryDate: { gte: range.from, lte: range.to } } });
      return { deleted: result.count, skipped: 0, note: '' };
    }
    if (key === 'inventory') {
      const candidates = await tx.product.findMany({ where: { createdAt: dateTimeRange(range) }, select: { id: true, quantity: true } });
      const ids = candidates.filter((product) => product.quantity === 0).map((product) => product.id);
      const result = ids.length ? await tx.product.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'Inventory with remaining stock was kept.' };
    }
    if (key === 'stock-movements') {
      const result = await tx.stockMovement.deleteMany({ where: { createdAt: dateTimeRange(range) } });
      return { deleted: result.count, skipped: 0, note: 'Current inventory quantity was not adjusted.' };
    }
    if (key === 'customers') {
      const candidates = await tx.customer.findMany({ where: { createdAt: dateTimeRange(range) }, select: { id: true, _count: { select: { sales: true, ledger: true, urdPurchases: true, cashbookEntries: true } } } });
      const ids = candidates.filter((customer) => Object.values(customer._count).every((count) => count === 0)).map((customer) => customer.id);
      const result = ids.length ? await tx.customer.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'Customers with business history were kept.' };
    }
    if (key === 'rates') {
      const result = await tx.dailyRate.deleteMany({ where: { rateDate: { gte: range.from, lte: range.to } } });
      return { deleted: result.count, skipped: 0, note: '' };
    }
    throw new Error('That data register cannot be archived.');
  });
}

module.exports = { RESOURCE_LIST, resourceFor, parseDateRange, getExportPayload, archiveData };

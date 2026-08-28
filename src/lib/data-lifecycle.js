const { dateInput } = require('./helpers');

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
  return dateInput();
}

function isDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const checked = new Date(Date.UTC(year, month - 1, day));
  return checked.getUTCFullYear() === year && checked.getUTCMonth() === month - 1 && checked.getUTCDate() === day;
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

// IST-aware UTC DateTime range so date filtering matches Indian calendar dates.
function dateTimeRange(range) {
  return {
    gte: new Date(`${range.from}T00:00:00.000+05:30`),
    lte: new Date(`${range.to}T23:59:59.999+05:30`)
  };
}

function num(value) { return Number(value || 0); }
function str(value) { return value || ''; }
function exportDate(value) { return dateInput(value); }

function displayDate(value) {
  const [year, month, day] = String(value).split('-');
  return `${day}-${month}-${year}`;
}

function enumLabel(value) {
  return String(value || '').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function paymentLabel(value) {
  const labels = { CASH: 'Cash', UPI: 'UPI', CARD: 'Card', BANK_TRANSFER: 'Bank transfer', CREDIT: 'Credit', MIXED: 'Mixed' };
  return labels[value] || enumLabel(value);
}

function makingLabel(value) {
  const labels = { FIXED: 'Fixed', PER_GRAM: 'Per gram', PERCENTAGE: 'Percentage' };
  return labels[value] || enumLabel(value);
}

function exportEnvelope(resource, range, columns, rows, options = {}) {
  return {
    title: `Kusum ERP - ${resource.label}`,
    subtitle: `${resource.dateLabel}: ${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} row${rows.length === 1 ? '' : 's'}`,
    columns,
    rows,
    filename: `${resource.key}-${range.from}-to-${range.to}.xlsx`,
    ...options
  };
}

// ── Column helpers ─────────────────────────────────────────────
const col = {
  date:     (key, label = 'Date')   => ({ key, label, type: 'date', width: 14 }),
  text:     (key, label, width = 20) => ({ key, label, type: 'text', width }),
  identifier: (key, label, width = 18) => ({ key, label, type: 'identifier', width }),
  currency: (key, label)            => ({ key, label, type: 'currency', width: 18 }),
  number:   (key, label)            => ({ key, label, type: 'number', width: 12 }),
  integer:  (key, label, width = 12) => ({ key, label, type: 'integer', width }),
  weight:   (key, label)            => ({ key, label, type: 'weight', width: 13 })
};

function pruneEmptyColumns(columns, rows) {
  // Financial registers must keep a stable schema. A zero GST, balance,
  // stone weight or payment column is meaningful and must not disappear.
  return columns;
}

const CASHBOOK_METHODS = [
  { key: 'CASH', label: 'Cash' },
  { key: 'UPI', label: 'UPI' },
  { key: 'BANK_TRANSFER', label: 'Bank transfer' }
];

const METAL_ORDER = ['GOLD', 'SILVER', 'PLATINUM', 'DIAMOND', 'OTHER'];
const METAL_LABELS = { GOLD: 'Gold', SILVER: 'Silver', PLATINUM: 'Platinum', DIAMOND: 'Diamond', OTHER: 'Other' };

// ── Aggregation helpers ───────────────────────────────────────
function cashbookTotals(rows) {
  return rows.reduce((t, r) => {
    const v = num(r.amount);
    if (r.type === 'IN') t.in += v; else t.out += v;
    return t;
  }, { in: 0, out: 0 });
}

function cashbookInfoRows(rows) {
  const t = cashbookTotals(rows);
  return [
    { label: 'Total money in', value: t.in, type: 'currency' },
    { label: 'Total money out', value: t.out, type: 'currency' },
    { label: 'Net balance', value: t.in - t.out, type: 'currency' },
    { label: 'Total entries', value: rows.length, type: 'integer' }
  ];
}

function cashbookExportRows(entries) {
  let runningBalance = 0;
  return entries.map((entry) => {
    const amount = num(entry.amount);
    runningBalance += entry.type === 'IN' ? amount : -amount;
    return {
      entryDate: entry.entryDate,
      type: entry.type === 'IN' ? 'Money in' : 'Money out',
      paymentMethod: paymentLabel(entry.paymentMethod),
      description: entry.description,
      moneyIn: entry.type === 'IN' ? amount : 0,
      moneyOut: entry.type === 'OUT' ? amount : 0,
      runningBalance,
      reference: entry.reference || '',
      customerPhone: entry.customer?.phone || '',
      customerName: entry.customer?.name || '',
      syncLedger: entry.syncLedger ? 'Yes' : 'No',
      notes: str(entry.notes)
    };
  });
}

function inventoryTotals(rows) {
  return rows.reduce((t, r) => {
    const qty = num(r.quantity);
    t.pieces += qty;
    t.grossWeight += num(r.grossWeight) * qty;
    t.netWeight += num(r.netWeight) * qty;
    t.value += num(r.sellingPrice) * qty;
    return t;
  }, { pieces: 0, grossWeight: 0, netWeight: 0, value: 0 });
}

function inventoryInfoRows(rows) {
  const t = inventoryTotals(rows);
  return [
    { label: 'Total stock pieces', value: t.pieces, type: 'integer' },
    { label: 'Total gross weight', value: t.grossWeight, type: 'weight' },
    { label: 'Total net weight', value: t.netWeight, type: 'weight' },
    { label: 'Total value', value: t.value, type: 'currency' }
  ];
}

function inventorySummaryRows(rows) {
  const groups = new Map();
  for (const r of rows) {
    const key = [r.metalKey, r.itemName, r.category, r.purity].join('\u0000');
    const g = groups.get(key) || { metal: r.metal, metalKey: r.metalKey, itemName: r.itemName, category: r.category, purity: r.purity, records: 0, quantity: 0, grossWeight: 0, netWeight: 0, value: 0 };
    const qty = num(r.quantity);
    g.records += 1;
    g.quantity += qty;
    g.grossWeight += num(r.grossWeight) * qty;
    g.netWeight += num(r.netWeight) * qty;
    g.value += num(r.sellingPrice) * qty;
    groups.set(key, g);
  }
  return [...groups.values()].sort((a, b) => {
    const md = METAL_ORDER.indexOf(a.metalKey) - METAL_ORDER.indexOf(b.metalKey);
    return md || a.itemName.localeCompare(b.itemName) || a.category.localeCompare(b.category);
  });
}

// ═══════════════════════════════════════════════════════════════
//  EXPORT PAYLOAD BUILDERS
// ═══════════════════════════════════════════════════════════════

async function getExportPayload(db, key, range) {
  const resource = resourceFor(key);

  switch (key) {

    // ────────────────────────────────────────────────────────────
    //  SALES — Line items + Invoice summary
    // ────────────────────────────────────────────────────────────
    case 'sales': {
      const sales = await db.sale.findMany({
        where: { saleDate: dateTimeRange(range) },
        orderBy: [{ saleDate: 'asc' }, { id: 'asc' }],
        include: { customer: true, items: { include: { product: true } } }
      });

      // Line-item rows (one per sold piece)
      const lineRows = sales.flatMap((s) => s.items.map((item) => ({
        saleDate: exportDate(s.saleDate),
        invoiceNumber: s.invoiceNumber,
        customerPhone: s.customer?.phone || '',
        customerName: s.customer?.name || 'Walk-in customer',
        customerPan: s.customerPan || s.customer?.panNumber || '',
        barcode: item.product?.barcode || item.productBarcode || item.product?.sku || item.productSku,
        itemName: item.product?.name || item.productName,
        metal: item.product?.metal || item.productMetal || '',
        purity: item.product?.purity || item.productPurity || '',
        hsnCode: item.hsnCode || '',
        huidCode: item.huidCode || '',
        quantity: item.quantity,
        grossWeight: num(item.grossWeight),
        weight: num(item.weight),
        metalRate: num(item.metalRate),
        metalAmount: num(item.metalAmount),
        makingType: makingLabel(item.makingChargeType),
        makingValue: num(item.makingChargeValue),
        makingCharge: num(item.makingCharge),
        taxableAmount: num(item.taxableAmount),
        gstRate: num(s.gstRate),
        invoiceTotal: num(s.total),
        urdOffset: num(s.urdOffset),
        paid: num(s.paid),
        cashPaid: num(s.cashPaid),
        upiPaid: num(s.upiPaid),
        otherPaid: Math.max(0, num(s.paid) - num(s.cashPaid) - num(s.upiPaid)),
        balance: num(s.balance),
        paymentMethod: paymentLabel(s.paymentMethod),
        notes: str(s.notes)
      })));

      const allLineColumns = [
        col.date('saleDate', 'Invoice date'),
        col.identifier('invoiceNumber', 'Invoice no.', 20),
        col.identifier('customerPhone', 'Customer phone', 16),
        col.text('customerName', 'Customer'),
        col.identifier('customerPan', 'PAN no.', 14),
        col.identifier('barcode', 'Barcode', 14),
        col.text('itemName', 'Item name'),
        col.text('metal', 'Metal', 12),
        col.text('purity', 'Purity', 10),
        col.identifier('hsnCode', 'HSN code', 12),
        col.identifier('huidCode', 'HUID', 12),
        col.integer('quantity', 'Qty'),
        col.weight('grossWeight', 'Gross wt. (g)'),
        col.weight('weight', 'Weight (g)'),
        col.currency('metalRate', 'Rate / g'),
        col.currency('metalAmount', 'Metal value'),
        col.text('makingType', 'Making basis', 15),
        col.number('makingValue', 'Making value'),
        col.currency('makingCharge', 'Making amount'),
        col.currency('taxableAmount', 'Taxable amount'),
        col.number('gstRate', 'GST rate (%)'),
        col.currency('invoiceTotal', 'Invoice total'),
        col.currency('urdOffset', 'URD adjustment'),
        col.currency('paid', 'Total paid'),
        col.currency('cashPaid', 'Cash paid'),
        col.currency('upiPaid', 'UPI paid'),
        col.currency('otherPaid', 'Other paid'),
        col.currency('balance', 'Due balance'),
        col.text('paymentMethod', 'Payment method', 16),
        col.text('notes', 'Notes', 30)
      ];
      const lineColumns = pruneEmptyColumns(allLineColumns, lineRows);

      // Invoice summary rows (one per invoice)
      const invoiceRows = sales.map((s) => ({
        saleDate: exportDate(s.saleDate),
        invoiceNumber: s.invoiceNumber,
        customerPhone: s.customer?.phone || '',
        customerName: s.customer?.name || 'Walk-in customer',
        customerPan: s.customerPan || s.customer?.panNumber || '',
        itemCount: s.items.reduce((total, item) => total + Number(item.quantity || 0), 0),
        totalWeight: s.items.reduce((sum, i) => sum + num(i.weight) * i.quantity, 0),
        subtotal: num(s.subtotal),
        discount: num(s.discount),
        taxableAfterDiscount: Math.max(0, num(s.subtotal) - num(s.discount)),
        cgstRate: num(s.gstRate) / 2,
        cgstAmount: Math.round((num(s.gstAmount) / 2) * 100) / 100,
        sgstRate: num(s.gstRate) / 2,
        sgstAmount: num(s.gstAmount) - Math.round((num(s.gstAmount) / 2) * 100) / 100,
        total: num(s.total),
        urdOffset: num(s.urdOffset),
        netPayable: Math.max(0, num(s.total) - num(s.urdOffset)),
        paid: num(s.paid),
        cashPaid: num(s.cashPaid),
        upiPaid: num(s.upiPaid),
        otherPaid: Math.max(0, num(s.paid) - num(s.cashPaid) - num(s.upiPaid)),
        balance: num(s.balance),
        paymentMethod: paymentLabel(s.paymentMethod),
        notes: str(s.notes)
      }));

      const allInvColumns = [
        col.date('saleDate', 'Invoice date'),
        col.identifier('invoiceNumber', 'Invoice no.', 20),
        col.identifier('customerPhone', 'Customer phone', 16),
        col.text('customerName', 'Customer'),
        col.identifier('customerPan', 'PAN no.', 14),
        col.integer('itemCount', 'Items sold'),
        col.weight('totalWeight', 'Total weight (g)'),
        col.currency('subtotal', 'Subtotal'),
        col.currency('discount', 'Discount'),
        col.currency('taxableAfterDiscount', 'Taxable value'),
        col.number('cgstRate', 'CGST (%)'),
        col.currency('cgstAmount', 'CGST amount'),
        col.number('sgstRate', 'SGST (%)'),
        col.currency('sgstAmount', 'SGST amount'),
        col.currency('total', 'Invoice total'),
        col.currency('urdOffset', 'URD adjustment'),
        col.currency('netPayable', 'Net payable'),
        col.currency('paid', 'Total paid'),
        col.currency('cashPaid', 'Cash paid'),
        col.currency('upiPaid', 'UPI paid'),
        col.currency('otherPaid', 'Other paid'),
        col.currency('balance', 'Due balance'),
        col.text('paymentMethod', 'Payment method', 16),
        col.text('notes', 'Notes', 30)
      ];
      const invColumns = pruneEmptyColumns(allInvColumns, invoiceRows);

      const totalSales = sales.reduce((s, sl) => s + num(sl.total), 0);
      const totalPaid = sales.reduce((s, sl) => s + num(sl.paid), 0);
      const totalDue = sales.reduce((s, sl) => s + num(sl.balance), 0);
      const totalItemsSold = sales.reduce(
        (total, sale) => total + sale.items.reduce((quantity, item) => quantity + Number(item.quantity || 0), 0),
        0
      );

      const sheets = [
        {
          name: 'Invoice summary',
          title: `Sales - Invoice summary`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${invoiceRows.length} invoice${invoiceRows.length === 1 ? '' : 's'}`,
          columns: invColumns,
          rows: invoiceRows,
          infoRows: [
            { label: 'Total invoices', value: invoiceRows.length, type: 'integer' },
            { label: 'Total sales value', value: totalSales, type: 'currency' },
            { label: 'Total received', value: totalPaid, type: 'currency' },
            { label: 'Total due balance', value: totalDue, type: 'currency' }
          ]
        },
        {
          name: 'Item-wise details',
          title: `Sales - Item-wise line details`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${totalItemsSold} item${totalItemsSold === 1 ? '' : 's'} across ${invoiceRows.length} invoice${invoiceRows.length === 1 ? '' : 's'}`,
          columns: lineColumns,
          rows: lineRows,
          infoRows: [
            { label: 'Total items sold', value: totalItemsSold, type: 'integer' },
            { label: 'Total sales value', value: totalSales, type: 'currency' }
          ]
        }
      ];

      return exportEnvelope(resource, range, lineColumns, lineRows, { sheets });
    }

    // ────────────────────────────────────────────────────────────
    //  URD PURCHASES
    // ────────────────────────────────────────────────────────────
    case 'urd': {
      const purchases = await db.urdPurchase.findMany({
        where: { purchaseDate: dateTimeRange(range) },
        orderBy: [{ purchaseDate: 'asc' }, { id: 'asc' }],
        include: { customer: true, sale: true }
      });
      const rows = purchases.map((p) => ({
        purchaseDate: exportDate(p.purchaseDate),
        purchaseNumber: p.purchaseNumber,
        customerPhone: p.customer.phone || '',
        customerName: p.customer.name,
        metal: p.metal,
        purity: p.purity || '',
        grossWeight: num(p.grossWeight),
        netWeight: num(p.netWeight),
        ratePerGram: num(p.ratePerGram),
        totalAmount: num(p.totalAmount),
        saleOffset: num(p.saleOffset),
        cashPayable: Math.max(0, num(p.totalAmount) - num(p.saleOffset)),
        paid: num(p.paid),
        outstanding: Math.max(0, num(p.totalAmount) - num(p.saleOffset) - num(p.paid)),
        paymentMethod: paymentLabel(p.paymentMethod),
        settledSale: p.sale?.invoiceNumber || '',
        description: str(p.description),
        notes: str(p.notes)
      }));

      const allColumns = [
        col.date('purchaseDate', 'Purchase date'),
        col.identifier('purchaseNumber', 'URD no.', 22),
        col.identifier('customerPhone', 'Customer phone', 16),
        col.text('customerName', 'Customer'),
        col.text('metal', 'Metal', 12),
        col.text('purity', 'Purity', 10),
        col.weight('grossWeight', 'Gross wt. (g)'),
        col.weight('netWeight', 'Net wt. (g)'),
        col.currency('ratePerGram', 'Rate / g'),
        col.currency('totalAmount', 'Total amount'),
        col.currency('saleOffset', 'Sale adjustment'),
        col.currency('cashPayable', 'Amount payable'),
        col.currency('paid', 'Amount paid'),
        col.currency('outstanding', 'Outstanding'),
        col.text('paymentMethod', 'Payment method', 16),
        col.identifier('settledSale', 'Settled invoice', 20),
        col.text('description', 'Description', 30),
        col.text('notes', 'Notes', 30)
      ];
      const columns = pruneEmptyColumns(allColumns, rows);
      const totalPurchased = rows.reduce((s, r) => s + r.totalAmount, 0);
      const totalPaid = rows.reduce((s, r) => s + r.paid, 0);
      const totalAdjusted = rows.reduce((s, r) => s + r.saleOffset, 0);
      const totalPending = rows.reduce((s, r) => s + r.outstanding, 0);

      return exportEnvelope(resource, range, columns, rows, {
        sheets: [{
          name: 'URD purchases',
          title: `URD Purchases - Detailed register`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} purchase${rows.length === 1 ? '' : 's'}`,
          columns,
          rows,
          infoRows: [
            { label: 'Total purchases', value: rows.length, type: 'integer' },
            { label: 'Total value', value: totalPurchased, type: 'currency' },
            { label: 'Adjusted in sales', value: totalAdjusted, type: 'currency' },
            { label: 'Total paid', value: totalPaid, type: 'currency' },
            { label: 'Pending', value: totalPending, type: 'currency' }
          ]
        }]
      });
    }

    // ────────────────────────────────────────────────────────────
    //  DAILY CASHBOOK — Every entry + running balance
    // ────────────────────────────────────────────────────────────
    case 'cashbook': {
      const entries = await db.cashbookEntry.findMany({
        where: { entryDate: { gte: range.from, lte: range.to } },
        orderBy: [{ entryDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        include: { customer: true }
      });

      const rows = cashbookExportRows(entries);

      const allColumns = [
        col.date('entryDate', 'Date'),
        col.text('type', 'Type', 12),
        col.text('paymentMethod', 'Payment method', 16),
        col.text('description', 'Description', 34),
        col.currency('moneyIn', 'Money in'),
        col.currency('moneyOut', 'Money out'),
        col.currency('runningBalance', 'Running balance'),
        col.identifier('reference', 'Reference', 18),
        col.identifier('customerPhone', 'Customer phone', 16),
        col.text('customerName', 'Customer', 24),
        col.text('syncLedger', 'Ledger synced', 14),
        col.text('notes', 'Notes', 30)
      ];
      const columns = pruneEmptyColumns(allColumns, rows);

      // Per-method grouping
      const grouped = CASHBOOK_METHODS.map((method) => {
        const methodEntries = entries.filter((entry) => entry.paymentMethod === method.key);
        return { ...method, entries: methodEntries, rows: cashbookExportRows(methodEntries) };
      });
      const otherEntries = entries.filter((entry) => !CASHBOOK_METHODS.some((method) => method.key === entry.paymentMethod));
      const otherRows = cashbookExportRows(otherEntries);

      // Summary rows
      const summaryColumns = [
        col.text('paymentMethod', 'Payment method', 22),
        col.integer('entries', 'Total entries'),
        col.currency('moneyIn', 'Total money in'),
        col.currency('moneyOut', 'Total money out'),
        col.currency('netBalance', 'Net balance')
      ];
      const summaryRows = [...grouped, ...(otherRows.length ? [{ key: 'OTHER', label: 'Other methods', rows: otherRows }] : [])].map((g) => {
        const totals = cashbookTotals(g.entries || otherEntries);
        return { paymentMethod: g.label, entries: g.rows.length, moneyIn: totals.in, moneyOut: totals.out, netBalance: totals.in - totals.out };
      });

      // Build sheets
      const infoAll = cashbookInfoRows(entries.map(e => ({ type: e.type, amount: num(e.amount) })));
      const sheets = [
        {
          name: 'All entries',
          title: `Daily Cashbook - All entries`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} detailed entr${rows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows,
          infoRows: infoAll
        },
        {
          name: 'Summary',
          title: `Daily Cashbook - Payment method summary`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | Totals grouped by payment method`,
          columns: summaryColumns,
          rows: summaryRows,
          infoRows: infoAll
        }
      ];

      for (const g of grouped) {
        const gInfo = cashbookInfoRows(g.entries);
        sheets.push({
          name: g.label,
          title: `Daily Cashbook - ${g.label} entries`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${g.rows.length} ${g.label.toLowerCase()} entr${g.rows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows: g.rows,
          infoRows: gInfo
        });
      }
      if (otherRows.length) {
        sheets.push({
          name: 'Other methods',
          title: `Daily Cashbook - Other payment methods`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${otherRows.length} entr${otherRows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows: otherRows,
          infoRows: cashbookInfoRows(otherEntries)
        });
      }

      return exportEnvelope(resource, range, columns, rows, { sheets });
    }

    // ────────────────────────────────────────────────────────────
    //  INVENTORY — All records + summary + per-metal
    // ────────────────────────────────────────────────────────────
    case 'inventory': {
      const products = await db.product.findMany({ where: { createdAt: dateTimeRange(range) } });

      const sortedProducts = [...products].sort((a, b) => {
        const md = METAL_ORDER.indexOf(a.metal) - METAL_ORDER.indexOf(b.metal);
        if (md !== 0) return md;
        return (a.name || '').localeCompare(b.name || '') || (a.category || '').localeCompare(b.category || '') || (a.barcode || a.sku || '').localeCompare(b.barcode || b.sku || '');
      });

      const rows = sortedProducts.map((p) => ({
        metal: enumLabel(p.metal),
        metalKey: p.metal,
        itemName: p.name,
        category: p.category,
        purity: p.purity || '',
        barcode: p.barcode || '',
        sku: p.sku,
        grossWeight: num(p.grossWeight),
        stoneWeight: num(p.stoneWeight),
        netWeight: num(p.netWeight),
        quantity: p.quantity,
        reorderLevel: p.reorderLevel,
        purchasePrice: num(p.purchasePrice),
        sellingPrice: num(p.sellingPrice),
        makingType: makingLabel(p.makingChargeType),
        makingValue: num(p.makingChargeValue),
        status: enumLabel(p.status),
        location: p.location || '',
        batchDocNo: p.batchDocNo || '',
        createdAt: exportDate(p.createdAt),
        notes: str(p.notes)
      }));

      const allColumns = [
        col.text('metal', 'Metal', 12),
        col.text('itemName', 'Item name', 24),
        col.text('category', 'Category', 18),
        col.text('purity', 'Purity', 10),
        col.identifier('barcode', 'Barcode', 16),
        col.identifier('sku', 'SKU', 16),
        col.weight('grossWeight', 'Gross wt. (g)'),
        col.weight('stoneWeight', 'Stone wt. (g)'),
        col.weight('netWeight', 'Net wt. (g)'),
        col.integer('quantity', 'Stock qty'),
        col.integer('reorderLevel', 'Reorder level'),
        col.currency('purchasePrice', 'Purchase price'),
        col.currency('sellingPrice', 'Selling price'),
        col.text('makingType', 'Making basis', 15),
        col.number('makingValue', 'Making value'),
        col.text('status', 'Status', 14),
        col.text('location', 'Location', 16),
        col.identifier('batchDocNo', 'Batch doc no.', 18),
        col.date('createdAt', 'Created date'),
        col.text('notes', 'Notes', 30)
      ];
      const columns = pruneEmptyColumns(allColumns, rows);

      const summaryColumns = [
        col.text('metal', 'Metal', 12),
        col.text('itemName', 'Item name', 24),
        col.text('category', 'Category', 18),
        col.text('purity', 'Purity', 10),
        col.integer('records', 'Barcode records'),
        col.integer('quantity', 'Stock pieces'),
        col.weight('grossWeight', 'Gross wt. (g)'),
        col.weight('netWeight', 'Net wt. (g)'),
        col.currency('value', 'Total value')
      ];

      const sheets = [
        {
          name: 'All records',
          title: `Inventory - All individual records`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} record${rows.length === 1 ? '' : 's'} with barcode details`,
          columns,
          rows,
          infoRows: inventoryInfoRows(rows)
        },
        {
          name: 'Item summary',
          title: `Inventory - Item-wise summary`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | Grouped by metal, item, category and purity`,
          columns: summaryColumns,
          rows: inventorySummaryRows(rows),
          infoRows: inventoryInfoRows(rows)
        }
      ];

      for (const metal of METAL_ORDER) {
        const metalRows = rows.filter((r) => r.metalKey === metal);
        if (!metalRows.length && !['GOLD', 'SILVER'].includes(metal)) continue;
        sheets.push({
          name: METAL_LABELS[metal],
          title: `Inventory - ${METAL_LABELS[metal]} records`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${metalRows.length} ${METAL_LABELS[metal].toLowerCase()} item${metalRows.length === 1 ? '' : 's'}`,
          columns,
          rows: metalRows,
          infoRows: inventoryInfoRows(metalRows)
        });
      }

      return exportEnvelope(resource, range, columns, rows, { sheets });
    }

    // ────────────────────────────────────────────────────────────
    //  STOCK MOVEMENTS
    // ────────────────────────────────────────────────────────────
    case 'stock-movements': {
      const movements = await db.stockMovement.findMany({
        where: { createdAt: dateTimeRange(range) },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: { product: true }
      });
      const rows = movements.map((m) => ({
        createdAt: exportDate(m.createdAt),
        type: enumLabel(m.type),
        barcode: m.product?.barcode || m.productBarcode || '',
        sku: m.product?.sku || m.productSku || '',
        itemName: m.product?.name || m.productName || 'Deleted inventory item',
        metal: enumLabel(m.product?.metal || m.productMetal),
        purity: m.product?.purity || m.productPurity || '',
        quantity: m.quantity,
        netWeight: num(m.product?.netWeight ?? m.netWeight),
        note: str(m.note)
      }));

      const allColumns = [
        col.date('createdAt', 'Movement date'),
        col.text('type', 'Movement type', 16),
        col.identifier('barcode', 'Barcode', 16),
        col.identifier('sku', 'SKU', 16),
        col.text('itemName', 'Item name', 24),
        col.text('metal', 'Metal', 12),
        col.text('purity', 'Purity', 10),
        col.integer('quantity', 'Qty change'),
        col.weight('netWeight', 'Net wt. (g)'),
        col.text('note', 'Note', 32)
      ];
      const columns = pruneEmptyColumns(allColumns, rows);

      const quantityIn = rows.filter((row) => row.quantity > 0).reduce((total, row) => total + row.quantity, 0);
      const quantityOut = rows.filter((row) => row.quantity < 0).reduce((total, row) => total + Math.abs(row.quantity), 0);
      return exportEnvelope(resource, range, columns, rows, {
        sheets: [{
          name: 'Stock movements',
          title: 'Stock Movement Register',
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} movement${rows.length === 1 ? '' : 's'}`,
          columns,
          rows,
          infoRows: [
            { label: 'Total movements', value: rows.length, type: 'integer' },
            { label: 'Quantity in', value: quantityIn, type: 'integer' },
            { label: 'Quantity out', value: quantityOut, type: 'integer' },
            { label: 'Net quantity change', value: quantityIn - quantityOut, type: 'integer' }
          ]
        }]
      });
    }

    // ────────────────────────────────────────────────────────────
    //  CUSTOMER DIRECTORY
    // ────────────────────────────────────────────────────────────
    case 'customers': {
      const customers = await db.customer.findMany({
        where: { createdAt: dateTimeRange(range) },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: { ledger: { select: { amount: true } }, _count: { select: { sales: true, urdPurchases: true } } }
      });
      const rows = customers.map((c) => ({
        createdAt: exportDate(c.createdAt),
        customerPhone: c.phone || '',
        customerName: c.name,
        panNumber: c.panNumber || '',
        email: c.email || '',
        address: c.address || '',
        salesCount: c._count.sales,
        urdCount: c._count.urdPurchases,
        outstanding: c.ledger.reduce((t, e) => t + num(e.amount), 0)
      }));

      const allColumns = [
        col.date('createdAt', 'Registered date'),
        col.identifier('customerPhone', 'Phone / ID', 18),
        col.text('customerName', 'Customer name', 24),
        col.identifier('panNumber', 'PAN no.', 14),
        col.text('email', 'Email', 24),
        col.text('address', 'Address', 34),
        col.integer('salesCount', 'Total sales'),
        col.integer('urdCount', 'URD purchases'),
        col.currency('outstanding', 'Outstanding due')
      ];
      const columns = pruneEmptyColumns(allColumns, rows);
      const totalDue = rows.reduce((s, r) => s + r.outstanding, 0);

      return exportEnvelope(resource, range, columns, rows, {
        sheets: [{
          name: 'Customer directory',
          title: `Customer Directory`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} customer${rows.length === 1 ? '' : 's'}`,
          columns,
          rows,
          infoRows: [
            { label: 'Total customers', value: rows.length, type: 'integer' },
            { label: 'Total outstanding', value: totalDue, type: 'currency' }
          ]
        }]
      });
    }

    // ────────────────────────────────────────────────────────────
    //  CUSTOMER LEDGER
    // ────────────────────────────────────────────────────────────
    case 'customer-ledger': {
      const period = dateTimeRange(range);
      const entries = await db.customerLedger.findMany({
        where: { createdAt: period },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: { customer: true, sale: true }
      });
      const customerIds = [...new Set(entries.map((entry) => entry.customerId))];
      const openingRows = customerIds.length ? await db.customerLedger.groupBy({
        by: ['customerId'],
        where: { customerId: { in: customerIds }, createdAt: { lt: period.gte } },
        _sum: { amount: true }
      }) : [];
      const openingBalances = new Map(openingRows.map((row) => [row.customerId, num(row._sum.amount)]));
      const customerBalances = new Map();
      const rows = entries.map((e) => {
        const amount = num(e.amount);
        const openingBalance = openingBalances.get(e.customerId) || 0;
        const runningBalance = (customerBalances.has(e.customerId) ? customerBalances.get(e.customerId) : openingBalance) + amount;
        customerBalances.set(e.customerId, runningBalance);
        return {
          createdAt: exportDate(e.createdAt),
          customerPhone: e.customer.phone || '',
          customerName: e.customer.name,
          type: e.type === 'SALE_CREDIT' ? 'Sale credit (due)' : e.type === 'PAYMENT_RECEIVED' ? 'Payment received' : 'Adjustment',
          invoiceNumber: e.sale?.invoiceNumber || '',
          dueIncrease: amount > 0 ? amount : 0,
          paymentReceived: amount < 0 ? Math.abs(amount) : 0,
          ledgerChange: amount,
          openingBalance,
          runningBalance,
          paymentMethod: paymentLabel(e.paymentMethod),
          reference: e.reference || '',
          note: str(e.note)
        };
      });

      const allColumns = [
        col.date('createdAt', 'Ledger date'),
        col.identifier('customerPhone', 'Phone / ID', 18),
        col.text('customerName', 'Customer', 24),
        col.text('type', 'Entry type', 22),
        col.identifier('invoiceNumber', 'Invoice no.', 20),
        col.currency('dueIncrease', 'Due / debit'),
        col.currency('paymentReceived', 'Payment / credit'),
        col.currency('ledgerChange', 'Ledger change'),
        col.currency('openingBalance', 'Opening due'),
        col.currency('runningBalance', 'Running due'),
        col.text('paymentMethod', 'Payment method', 16),
        col.identifier('reference', 'Reference', 18),
        col.text('note', 'Note', 34)
      ];
      const columns = pruneEmptyColumns(allColumns, rows);
      const totalCredit = rows.reduce((sum, row) => sum + row.dueIncrease, 0);
      const totalPayments = rows.reduce((sum, row) => sum + row.paymentReceived, 0);
      const totalOpening = [...openingBalances.values()].reduce((sum, amount) => sum + amount, 0);
      const totalClosing = [...customerBalances.values()].reduce((sum, amount) => sum + amount, 0);

      return exportEnvelope(resource, range, columns, rows, {
        sheets: [{
          name: 'Customer ledger',
          title: `Customer Ledger`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} entr${rows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows,
          infoRows: [
            { label: 'Opening due', value: totalOpening, type: 'currency' },
            { label: 'Due added', value: totalCredit, type: 'currency' },
            { label: 'Payments received', value: totalPayments, type: 'currency' },
            { label: 'Closing due', value: totalClosing, type: 'currency' },
            { label: 'Ledger entries', value: rows.length, type: 'integer' }
          ]
        }]
      });
    }

    // ────────────────────────────────────────────────────────────
    //  DAILY METAL RATES
    // ────────────────────────────────────────────────────────────
    case 'rates': {
      const rates = await db.dailyRate.findMany({ where: { rateDate: { gte: range.from, lte: range.to } }, orderBy: { rateDate: 'asc' } });
      const rows = rates.map((r) => ({
        rateDate: r.rateDate,
        gold22k: num(r.gold22k),
        gold24k: num(r.gold24k),
        silver: num(r.silver),
        note: str(r.note)
      }));

      const allColumns = [
        col.date('rateDate', 'Rate date'),
        col.currency('gold22k', '22K gold / g'),
        col.currency('gold24k', '24K gold / g'),
        col.currency('silver', 'Silver / g'),
        col.text('note', 'Note', 34)
      ];
      const columns = pruneEmptyColumns(allColumns, rows);

      return exportEnvelope(resource, range, columns, rows, {
        sheets: [{
          name: 'Daily rates',
          title: 'Daily Metal Rate Register',
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (IST) | ${rows.length} saved rate${rows.length === 1 ? '' : 's'}`,
          columns,
          rows,
          infoRows: [{ label: 'Rate days', value: rows.length, type: 'integer' }]
        }]
      });
    }

    default:
      throw new Error('That data register is not available.');
  }
}

// ═══════════════════════════════════════════════════════════════
//  ARCHIVE (DELETE) DATA
// ═══════════════════════════════════════════════════════════════

async function archiveData(db, key, range) {
  const resource = resourceFor(key);
  if (resource.archiveDisabled) throw new Error(resource.archiveNote);
  return db.$transaction(async (tx) => {
    if (key === 'sales') {
      const candidates = await tx.sale.findMany({ where: { saleDate: dateTimeRange(range) }, select: { id: true, balance: true } });
      const ids = candidates.filter((s) => num(s.balance) <= 0).map((s) => s.id);
      if (ids.length) {
        await tx.customerLedger.deleteMany({ where: { saleId: { in: ids } } });
        await tx.sale.deleteMany({ where: { id: { in: ids } } });
      }
      return { deleted: ids.length, skipped: candidates.length - ids.length, note: 'Invoices with an outstanding customer balance were kept.' };
    }
    if (key === 'urd') {
      const candidates = await tx.urdPurchase.findMany({ where: { purchaseDate: dateTimeRange(range) }, select: { id: true, totalAmount: true, paid: true, saleOffset: true } });
      const ids = candidates.filter((p) => num(p.totalAmount) - num(p.paid) - num(p.saleOffset) <= 0).map((p) => p.id);
      const result = ids.length ? await tx.urdPurchase.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'URD purchases with an unpaid customer amount were kept.' };
    }
    if (key === 'cashbook') {
      const result = await tx.cashbookEntry.deleteMany({ where: { entryDate: { gte: range.from, lte: range.to } } });
      return { deleted: result.count, skipped: 0, note: '' };
    }
    if (key === 'inventory') {
      const candidates = await tx.product.findMany({ where: { createdAt: dateTimeRange(range) }, select: { id: true, quantity: true } });
      const ids = candidates.filter((p) => p.quantity === 0).map((p) => p.id);
      const result = ids.length ? await tx.product.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'Inventory with remaining stock was kept.' };
    }
    if (key === 'stock-movements') {
      const result = await tx.stockMovement.deleteMany({ where: { createdAt: dateTimeRange(range) } });
      return { deleted: result.count, skipped: 0, note: 'Current inventory quantity was not adjusted.' };
    }
    if (key === 'customers') {
      const candidates = await tx.customer.findMany({ where: { createdAt: dateTimeRange(range) }, select: { id: true, _count: { select: { sales: true, ledger: true, urdPurchases: true, cashbookEntries: true } } } });
      const ids = candidates.filter((c) => Object.values(c._count).every((n) => n === 0)).map((c) => c.id);
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

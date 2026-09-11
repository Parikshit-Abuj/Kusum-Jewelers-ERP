const { dateInput, localDateTimeRange, localTimeZoneName } = require('./helpers');
const { reverseAndDeleteCashbookEntry, deleteSettledUrdPurchase } = require('./accounting-reversal');
const { urdSettlement } = require('./urd-settlement');
const { listTopSellingItems, topSellingSummary, normalizeTopSellingFilters } = require('./top-selling-items');

const RESOURCE_LIST = [
  { key: 'sales', label: 'Sales invoices', dateLabel: 'Invoice date', archiveNote: 'Only invoices with no credit balance due can be removed. URD settlements do not block deletion.' },
  { key: 'top-selling-items', label: 'Top selling items report', dateLabel: 'Sale date', archiveNote: 'This is a calculated report and cannot be archived.', archiveDisabled: true },
  { key: 'cancelled-sales', label: 'Cancelled invoices', dateLabel: 'Cancelled invoice date', archiveNote: 'Cancelled invoices are audit records and cannot be archived from this screen.', archiveDisabled: true },
  { key: 'urd', label: 'URD purchases', dateLabel: 'URD purchase date', archiveNote: 'Only URD purchases with no amount still payable to the customer can be removed.' },
  { key: 'pledges', label: 'Pledge loans', dateLabel: 'Pledge date', archiveNote: 'Pledge loans are financial and collateral records. Manage them from Pledge Loans; export this register instead of archiving it here.', archiveDisabled: true },
  { key: 'supplier-purchases', label: 'Supplier purchases', dateLabel: 'Supplier purchase date', archiveNote: 'Use the Purchase Register to manage supplier purchases. Export is available; purchases are not archived from this screen.', archiveDisabled: true },
  { key: 'cancelled-urd', label: 'Cancelled URD purchases', dateLabel: 'Cancelled URD purchase date', archiveNote: 'Cancelled URD purchases are audit records and cannot be archived from this screen.', archiveDisabled: true },
  { key: 'cashbook', label: 'Daily cashbook', dateLabel: 'Entry date', archiveNote: 'Cashbook entries in the chosen period are permanently removed. Any linked customer balance, invoice payment, URD payout or scheme installment is reversed safely.' },
  { key: 'schemes', label: 'Jewellery savings schemes', dateLabel: 'Scheme activity date', archiveNote: 'Scheme records and their Cashbook receipts are retained as financial history. Export this register instead of archiving it here.', archiveDisabled: true },
  { key: 'inventory', label: 'Inventory records', dateLabel: 'Created date', archiveNote: 'Only zero-stock records can be removed. Sold barcode items are automatically removed when billed.' },
  { key: 'stock-movements', label: 'Stock movements', dateLabel: 'Movement date', archiveNote: 'Movement history can be removed without changing current stock quantity.' },
  { key: 'customers', label: 'Customer directory', dateLabel: 'Customer created date', archiveNote: 'Only customers with no sales, URD, cashbook or ledger history can be removed.' },
  { key: 'customer-ledger', label: 'Customer ledger', dateLabel: 'Ledger date', archiveNote: 'Export only. Ledger entries cannot be deleted independently because that would alter customer due balances.', archiveDisabled: true },
  { key: 'rates', label: 'Daily metal rates', dateLabel: 'Rate date', archiveNote: 'Saved daily rates in the chosen period are permanently removed.' }
];

const RESOURCE_MAP = new Map(RESOURCE_LIST.map((resource) => [resource.key, resource]));
// A workbook is created in a separate Node process and therefore needs a
// bounded request. Two years keeps an export practical on a shop PC while
// still allowing long history to be downloaded in consecutive date ranges.
const MAX_EXPORT_RANGE_DAYS = 731;
const MAX_SOURCE_ROWS = 20000;
// Deletion is intentionally more conservative than export. A very large
// interactive transaction can lock billing/cashbook tables and make a shop PC
// appear hung. Users can repeat safe smaller archival ranges.
const MAX_ARCHIVE_OPERATION_ROWS = 500;

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

function assertExportRange(range) {
  const [fromYear, fromMonth, fromDay] = range.from.split('-').map(Number);
  const [toYear, toMonth, toDay] = range.to.split('-').map(Number);
  const days = Math.floor((Date.UTC(toYear, toMonth - 1, toDay) - Date.UTC(fromYear, fromMonth - 1, fromDay)) / 86400000) + 1;
  if (days > MAX_EXPORT_RANGE_DAYS) {
    throw new Error('Excel export is limited to two years at a time for reliable performance. Download longer history in consecutive date ranges.');
  }
}

function assertExportRows(rows, label) {
  if (rows.length > MAX_SOURCE_ROWS) {
    throw new Error(`${label} has more than ${MAX_SOURCE_ROWS.toLocaleString('en-IN')} records in this range. Choose a shorter date range so the export remains reliable.`);
  }
}

function resourceFor(key) {
  const resource = RESOURCE_MAP.get(key);
  if (!resource) throw new Error('Choose a valid data register.');
  return resource;
}

function dateTimeRange(range) {
  return localDateTimeRange(range.from, range.to);
}

function num(value) { return Number(value || 0); }
function str(value) { return value || ''; }
function exportDate(value) { return dateInput(value); }

function displayDate(value) {
  const [year, month, day] = String(value).split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(day)}-${monthNames[Number(month) - 1] || month}-${String(year).slice(-2)}`;
}

function registerPeriod(range) {
  return `From    ${displayDate(range.from)}   To   ${displayDate(range.to)}`;
}

function enumLabel(value) {
  return String(value || '').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function paymentLabel(value) {
  const labels = { CASH: 'Cash', UPI: 'UPI', CARD: 'Card', BANK_TRANSFER: 'Bank transfer', CREDIT: 'Credit', MIXED: 'Mixed' };
  return labels[value] || enumLabel(value);
}

function schemeInstallmentPaymentSummary(installment = {}) {
  const savedPayments = Array.isArray(installment.payments) && installment.payments.length
    ? installment.payments
    : Number(installment.paidAmount || 0) > 0 && installment.paymentDate
      ? [{ amount: installment.paidAmount, paymentDate: installment.paymentDate, paymentMethod: installment.paymentMethod }]
      : [];
  const paid = savedPayments
    .filter((payment) => Number(payment.amount || 0) > 0 && payment.paymentDate)
    // Prisma returns Date objects for DateTime fields. Comparing their
    // display strings (for example, "Mon Sep..." and "Tue Aug...") sorts by
    // weekday/month text rather than chronology, which can render split
    // payments in the wrong order. Compare timestamps so the export always
    // shows the real payment dates in sequence.
    .sort((a, b) => {
      const aTime = new Date(a.paymentDate).getTime();
      const bTime = new Date(b.paymentDate).getTime();
      return (Number.isFinite(aTime) ? aTime : 0) - (Number.isFinite(bTime) ? bTime : 0);
    });
  if (!paid.length) return { paidDates: '', paymentType: '' };

  // An installment may be paid in parts on different dates. Keep every
  // payment date and component visible so its Amount total is never shown
  // beside only the latest receipt details.
  const dates = [...new Set(paid.map((payment) => exportDate(payment.paymentDate)))];
  return {
    // Dates have their own column in the scheme register. Keep this compact
    // so a normal payment remains one clean value such as "21-Aug-26".
    paidDates: dates.map(displayDate).join(', '),
    // Keep split amounts visible, but never repeat dates here: that made the
    // payment-method column difficult to read beside the Paid Date column.
    paymentType: paid
      .map((payment) => `${paymentLabel(payment.paymentMethod)} ₹${num(payment.amount).toFixed(2)}`)
      .join(' + ')
  };
}

function latestSchemePayment(installments = []) {
  const paid = installments
    .map((installment) => ({ installment, ...schemeInstallmentPaymentSummary(installment) }))
    .filter((item) => item.paidDates);
  if (!paid.length) return { paidDates: '', paymentType: '' };
  const latest = [...paid].sort((a, b) => Number(a.installment.installmentNumber || 0) - Number(b.installment.installmentNumber || 0)).at(-1);
  return { paidDates: latest.paidDates, paymentType: latest.paymentType };
}

function makingLabel(value) {
  const labels = { FIXED: 'Fixed', PER_GRAM: 'Per gram', PERCENTAGE: 'Percentage' };
  return labels[value] || enumLabel(value);
}

function exportEnvelope(resource, range, columns, rows, options = {}) {
  const shopName = String(options.shopName || 'Jewellery ERP').trim() || 'Jewellery ERP';
  return {
    title: `${shopName} - ${resource.label}`,
    subtitle: `${resource.dateLabel}: ${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} row${rows.length === 1 ? '' : 's'}`,
    columns,
    rows,
    filename: `${resource.key}-${range.from}-to-${range.to}.xlsx`,
    ...options,
    // The Excel renderer uses this for the report heading. Keep a safe
    // fallback for callers that build payloads without loading settings.
    shopName
  };
}

// ── Column helpers ─────────────────────────────────────────────
const col = {
  date:     (key, label = 'Date')   => ({ key, label, type: 'date', width: 14 }),
  dateList: (key, label = 'Date', width = 20) => ({ key, label, type: 'date-list', width }),
  text:     (key, label, width = 20) => ({ key, label, type: 'text', width }),
  identifier: (key, label, width = 18) => ({ key, label, type: 'identifier', width }),
  currency: (key, label)            => ({ key, label, type: 'currency', width: 18 }),
  number:   (key, label)            => ({ key, label, type: 'number', width: 12 }),
  integer:  (key, label, width = 12) => ({ key, label, type: 'integer', width }),
  weight:   (key, label)            => ({ key, label, type: 'weight', width: 13 })
};

function salesExportScope(value) {
  const scope = String(value || 'ALL').trim().toUpperCase();
  return ['ALL', 'GOLD', 'SILVER'].includes(scope) ? scope : 'ALL';
}

function salesRegisterColumns() {
  return [
    col.date('saleDate', 'Date'),
    col.identifier('invoiceNumber', 'Doc-no', 20),
    col.text('customerName', 'Customer', 30),
    col.weight('grossWeight', 'Gr-wt'),
    col.weight('netWeight', 'Net-wt'),
    col.currency('taxableAmount', 'Taxable-amt'),
    col.currency('cgstAmount', 'CGST'),
    col.currency('sgstAmount', 'SGST'),
    col.currency('igstAmount', 'IGST'),
    col.currency('total', 'Total'),
    col.currency('urdAdjustment', 'URD'),
    col.currency('discount', 'Discount'),
    col.currency('netAmount', 'Net-amt')
  ];
}

function roundCurrency(value) {
  return Math.round(num(value) * 100) / 100;
}

function isGoldSilverOnlyMixedSale(sale) {
  const metals = new Set((sale.items || []).map((item) => String(item.productMetal || '').toUpperCase()));
  return metals.has('GOLD') && metals.has('SILVER') && [...metals].every((metal) => metal === 'GOLD' || metal === 'SILVER');
}

// Gold and Silver registers show a proportional share for an invoice that
// contains both metals.  Rounding both shares independently can create or
// lose one paisa.  Gold takes the normal rounded value and Silver receives
// the exact remainder, so the two registers always reconcile to All sales.
function mixedMetalAllocatedAmount(amount, selectedMetal, allItemBasis, goldItemBasis, selectedItemBasis, isMixedGoldSilverOnly) {
  if (!selectedMetal || allItemBasis <= 0) return num(amount);
  if (!isMixedGoldSilverOnly) return roundCurrency(num(amount) * (selectedItemBasis / allItemBasis));
  const goldAmount = roundCurrency(num(amount) * (goldItemBasis / allItemBasis));
  return selectedMetal === 'GOLD' ? goldAmount : roundCurrency(num(amount) - goldAmount);
}

function saleRegisterRows(sales, metal = null) {
  const selectedMetal = metal ? String(metal).toUpperCase() : null;
  return sales
    .filter((sale) => !selectedMetal || sale.items.some((item) => item.productMetal === selectedMetal))
    .map((sale) => {
      const settlement = urdSettlement(sale.total, sale.urdOffset);
      const items = selectedMetal ? sale.items.filter((item) => item.productMetal === selectedMetal) : sale.items;
      const grossWeight = items.reduce((sum, item) => sum + num(item.grossWeight) * Number(item.quantity || 0), 0);
      const netWeight = items.reduce((sum, item) => sum + num(item.weight) * Number(item.quantity || 0), 0);
      // Use taxable value for proportional allocation, but fall back to
      // weight and finally quantity when old/imported rows have no taxable
      // amount. This keeps Gold + Silver sheets reconcilable instead of
      // duplicating the full invoice into both sheets.
      const itemBasis = (item) => {
        const taxable = num(item.taxableAmount);
        if (taxable > 0) return taxable;
        const weight = num(item.weight) * Number(item.quantity || 0);
        if (weight > 0) return weight;
        return Math.max(0, Number(item.quantity || 0));
      };
      const allItemBasis = sale.items.reduce((sum, item) => sum + itemBasis(item), 0);
      const selectedItemBasis = items.reduce((sum, item) => sum + itemBasis(item), 0);
      const selectedItemTaxable = items.reduce((sum, item) => sum + num(item.taxableAmount), 0);
      const goldItemBasis = sale.items
        .filter((item) => item.productMetal === 'GOLD')
        .reduce((sum, item) => sum + itemBasis(item), 0);
      const mixedGoldSilverOnly = isGoldSilverOnlyMixedSale(sale);
      const allocate = (amount) => mixedMetalAllocatedAmount(amount, selectedMetal, allItemBasis, goldItemBasis, selectedItemBasis, mixedGoldSilverOnly);
      const discount = selectedMetal ? allocate(sale.discount) : num(sale.discount);
      const taxableAmount = selectedMetal
        ? mixedGoldSilverOnly
          ? allocate(Math.max(0, num(sale.subtotal) - num(sale.discount)))
          : roundCurrency(Math.max(0, selectedItemTaxable - discount))
        : Math.max(0, num(sale.subtotal) - num(sale.discount));
      const gstAmount = selectedMetal
        ? allocate(sale.gstAmount)
        : num(sale.gstAmount);
      const cgstAmount = Math.round((gstAmount / 2) * 100) / 100;
      const total = selectedMetal ? allocate(sale.total) : num(sale.total);
      const urdAdjustment = selectedMetal ? allocate(settlement.saleAdjustment) : settlement.saleAdjustment;
      // Keep the CA register's original columns.  When the URD valuation is
      // greater than the invoice total, the existing Net-amt column carries
      // the negative excess (for example, 100 - 200 = -100) instead of
      // introducing a separate Refund column.  Use the full valuation for
      // this difference; saleAdjustment is intentionally capped at the bill
      // total for accounting settlement purposes.
      const urdValuation = selectedMetal ? allocate(settlement.urdValue) : settlement.urdValue;
      return {
        saleDate: exportDate(sale.saleDate),
        invoiceNumber: sale.invoiceNumber,
        customerName: sale.customer?.name || 'Walk-in customer',
        grossWeight,
        netWeight,
        taxableAmount,
        cgstAmount,
        sgstAmount: gstAmount - cgstAmount,
        igstAmount: 0,
        total,
        urdAdjustment,
        discount,
        netAmount: roundCurrency(total - urdValuation)
      };
    });
}

const CASHBOOK_METHODS = [
  { key: 'CASH', label: 'Cash' },
  { key: 'UPI', label: 'UPI' },
  { key: 'CARD', label: 'Card' },
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

function cashbookInfoRows(rows, openingBalance = 0) {
  const t = cashbookTotals(rows);
  return [
    { label: 'Opening balance', value: openingBalance, type: 'currency' },
    { label: 'Total money in', value: t.in, type: 'currency' },
    { label: 'Total money out', value: t.out, type: 'currency' },
    { label: 'Net movement', value: t.in - t.out, type: 'currency' },
    { label: 'Closing balance', value: openingBalance + t.in - t.out, type: 'currency' },
    { label: 'Total entries', value: rows.length, type: 'integer' }
  ];
}

function cashbookExportRows(entries, openingBalance = 0) {
  let runningBalance = openingBalance;
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
      customerPhone: entry.customer?.phone || entry.supplierPurchase?.supplier?.phone || '',
      customerName: entry.customer?.name || entry.supplierPurchase?.supplier?.name || '',
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

async function getExportPayload(db, key, range, options = {}) {
  const resource = resourceFor(key);
  assertExportRange(range);
  const makeExportEnvelope = (columns, rows, envelopeOptions = {}) => exportEnvelope(
    resource,
    range,
    columns,
    rows,
    { ...envelopeOptions, shopName: options.shopName, metadata: options.metadata }
  );

  switch (key) {

    // ────────────────────────────────────────────────────────────
    //  SALES — CA register with All/Gold/Silver sheets
    // ────────────────────────────────────────────────────────────
    case 'sales': {
      const scope = salesExportScope(options.salesMetal);
      const sales = await db.sale.findMany({
        where: {
          saleDate: dateTimeRange(range),
          cancelledAt: null,
          ...(scope !== 'ALL' ? { items: { some: { productMetal: scope } } } : {})
        },
        orderBy: [{ saleDate: 'asc' }, { id: 'asc' }],
        include: { customer: true, urdPurchase: true, items: { include: { product: true } } },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(sales, 'Sales register');
      const selectedMetals = scope === 'ALL' ? [null, 'GOLD', 'SILVER'] : [scope];
      const columns = salesRegisterColumns();
      const sheets = selectedMetals.map((metal) => {
        const label = metal ? `${metal[0]}${metal.slice(1).toLowerCase()}` : 'All';
        const rows = saleRegisterRows(sales, metal);
        return {
          name: label,
          title: `${label} Sales Register`,
          subtitle: registerPeriod(range),
          layout: 'ca-register',
          columns,
          rows,
          totalKeys: ['grossWeight', 'netWeight', 'taxableAmount', 'cgstAmount', 'sgstAmount', 'igstAmount', 'total', 'urdAdjustment', 'discount', 'netAmount']
        };
      });
      return makeExportEnvelope(columns, sheets[0].rows, { sheets });
    }

    case 'top-selling-items': {
      const selected = normalizeTopSellingFilters(options);
      const metals = selected.metal ? [selected.metal] : ['GOLD', 'SILVER'];
      const dateRange = dateTimeRange(range);
      const columns = [
        col.text('itemName', 'Item name', 28),
        col.text('metal', 'Metal', 12),
        col.text('purity', 'Purity', 12),
        col.integer('invoiceCount', 'Invoices', 12),
        col.integer('quantitySold', 'Pieces sold', 14),
        col.weight('netWeight', 'Net wt. sold (g)'),
        col.currency('salesValue', 'Sales value')
      ];
      const sheets = [];
      for (const metal of metals) {
        const rows = await listTopSellingItems(db, {
          ...selected,
          metal,
          from: dateRange.gte,
          to: dateRange.lte
        }, { take: MAX_SOURCE_ROWS + 1 });
        assertExportRows(rows, `${metal === 'GOLD' ? 'Gold' : 'Silver'} top selling items report`);
        const totals = topSellingSummary(rows);
        sheets.push({
          name: metal === 'GOLD' ? 'Gold top sellers' : 'Silver top sellers',
          title: `Top Selling Items - ${metal === 'GOLD' ? 'Gold' : 'Silver'}`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | Sorted by ${selected.sortBy.toLowerCase()} ${selected.sortOrder.toLowerCase()}`,
          columns,
          rows,
          infoRows: [
            { label: 'Item types', value: totals.itemTypes, type: 'integer' },
            { label: 'Pieces sold', value: totals.quantitySold, type: 'integer' },
            { label: 'Net weight sold', value: totals.netWeight, type: 'weight' },
            { label: 'Sales value', value: totals.salesValue, type: 'currency' }
          ]
        });
      }
      const allRows = sheets.flatMap((sheet) => sheet.rows);
      return makeExportEnvelope(columns, allRows, {
        filename: `top-selling-items-${range.from}-to-${range.to}.xlsx`,
        sheets
      });
    }

    case 'cancelled-sales': {
      const sales = await db.sale.findMany({ where: { cancelledAt: dateTimeRange(range) }, orderBy: [{ cancelledAt: 'asc' }, { id: 'asc' }], include: { customer: true, items: true }, take: MAX_SOURCE_ROWS + 1 });
      assertExportRows(sales, 'Cancelled invoice register');
      const rows = sales.map((sale) => ({ saleDate: exportDate(sale.saleDate), cancelledAt: exportDate(sale.cancelledAt), invoiceNumber: sale.invoiceNumber, customerPhone: sale.customer?.phone || '', customerName: sale.customer?.name || 'Walk-in customer', itemCount: sale.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0), total: num(sale.total), paid: num(sale.paid), urdValuation: num(sale.urdOffset), itemNames: sale.items.map((item) => item.productName || item.productBarcode || 'Jewellery item').join('; ') }));
      const columns = [col.date('saleDate', 'Invoice date'), col.date('cancelledAt', 'Cancelled date'), col.identifier('invoiceNumber', 'Invoice no.', 20), col.identifier('customerPhone', 'Customer phone', 16), col.text('customerName', 'Customer'), col.integer('itemCount', 'Items'), col.currency('total', 'Invoice total'), col.currency('paid', 'Amount paid'), col.currency('urdValuation', 'URD valuation'), col.text('itemNames', 'Items', 42)];
      return makeExportEnvelope(columns, rows, { sheets: [{ name: 'Cancelled Invoices', title: 'Cancelled Invoices', subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} cancelled invoice${rows.length === 1 ? '' : 's'}`, columns, rows, infoRows: [{ label: 'Cancelled invoices', value: rows.length, type: 'integer' }, { label: 'Cancelled invoice value', value: rows.reduce((sum, row) => sum + row.total, 0), type: 'currency' }] }] });
    }

    // ────────────────────────────────────────────────────────────
    //  URD PURCHASES
    // ────────────────────────────────────────────────────────────
    case 'urd': {
      const purchases = await db.urdPurchase.findMany({
        where: { purchaseDate: dateTimeRange(range), cancelledAt: null },
        orderBy: [{ purchaseDate: 'asc' }, { id: 'asc' }],
        include: { customer: true, sale: true },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(purchases, 'URD purchase register');
      const rows = purchases.map((purchase) => {
        return {
          purchaseDate: exportDate(purchase.purchaseDate),
          purchaseNumber: purchase.purchaseNumber,
          customerName: purchase.customer.name,
          grossWeight: num(purchase.grossWeight),
          netWeight: num(purchase.netWeight),
          totalAmount: num(purchase.totalAmount),
          // The CA register must remain compact. Its only remark is the
          // related sales bill, when this URD purchase was adjusted in a bill.
          remark: purchase.sale?.invoiceNumber || ''
        };
      });
      const columns = [
        col.date('purchaseDate', 'Date'),
        col.identifier('purchaseNumber', 'Doc-no', 22),
        col.text('customerName', 'Customer', 28),
        col.weight('grossWeight', 'Gross-wt'),
        col.weight('netWeight', 'Net-wt'),
        col.currency('totalAmount', 'Amount'),
        col.text('remark', 'Remark', 42)
      ];
      const sheet = {
        name: 'URD Purchase Register',
        title: '03. URD Purchase',
        subtitle: registerPeriod(range),
        layout: 'ca-register',
        columns,
        rows,
        totalKeys: ['grossWeight', 'netWeight', 'totalAmount']
      };
      return makeExportEnvelope(columns, rows, { sheets: [sheet] });
    }

    // ────────────────────────────────────────────────────────────
    //  PLEDGE LOANS — Customer collateral, never inventory
    // ────────────────────────────────────────────────────────────
    case 'pledges': {
      const loans = await db.pledgeLoan.findMany({
        where: { pledgeDate: dateTimeRange(range) },
        orderBy: [{ pledgeDate: 'asc' }, { id: 'asc' }],
        include: { customer: true },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(loans, 'Pledge loan register');
      const rows = loans.map((loan, index) => ({
        srNo: index + 1,
        pledgeDate: exportDate(loan.pledgeDate),
        pledgeNumber: loan.pledgeNumber,
        customerName: loan.customer?.name || '',
        itemDescription: loan.itemDescription,
        metal: enumLabel(loan.metal),
        purity: loan.purity || '',
        grossWeight: num(loan.grossWeight),
        netWeight: num(loan.netWeight),
        valuationAmount: num(loan.valuationAmount),
        principalAmount: num(loan.principalAmount),
        principalRepaid: num(loan.principalRepaid),
        principalDue: roundCurrency(Math.max(0, num(loan.principalAmount) - num(loan.principalRepaid))),
        interestReceived: num(loan.interestReceived),
        totalAmountReceived: roundCurrency(num(loan.principalRepaid) + num(loan.interestReceived)),
        dueDate: loan.dueDate ? exportDate(loan.dueDate) : '',
        status: enumLabel(loan.status)
      }));
      const columns = [
        col.integer('srNo', 'Sr. No.', 9), col.date('pledgeDate', 'Date'), col.identifier('pledgeNumber', 'Doc-no', 22),
        col.text('customerName', 'Customer', 28), col.text('itemDescription', 'Jewellery held', 26), col.text('metal', 'Metal', 12),
        col.text('purity', 'Purity', 12), col.weight('grossWeight', 'Gross-wt'), col.weight('netWeight', 'Net-wt'),
        col.currency('valuationAmount', 'Valuation'), col.currency('principalAmount', 'Money lent'), col.currency('principalRepaid', 'Principal repaid'),
        col.currency('principalDue', 'Principal due'), col.currency('interestReceived', 'Interest received'),
        col.currency('totalAmountReceived', 'Total amount received'), col.date('dueDate', 'Return due'), col.text('status', 'Status', 14)
      ];
      return makeExportEnvelope(columns, rows, { sheets: [{
        name: 'Pledge Loan Register', title: 'Gold / Silver Pledge Loan Register', subtitle: registerPeriod(range), layout: 'ca-register',
        columns, rows, totalKeys: ['grossWeight', 'netWeight', 'valuationAmount', 'principalAmount', 'principalRepaid', 'principalDue', 'interestReceived', 'totalAmountReceived']
      }] });
    }

    case 'supplier-purchases': {
      const purchases = await db.supplierPurchase.findMany({
        where: { purchaseDate: dateTimeRange(range), cancelledAt: null },
        orderBy: [{ purchaseDate: 'asc' }, { id: 'asc' }], include: { supplier: true, product: true }, take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(purchases, 'Supplier purchase register');
      const rows = purchases.map((purchase) => ({
        purchaseDate: exportDate(purchase.purchaseDate), purchaseNumber: purchase.purchaseNumber,
        supplierName: purchase.supplier?.name || '', itemName: purchase.itemName, category: purchase.category,
        metal: enumLabel(purchase.metal), purity: purchase.purity || '', barcode: purchase.barcode || purchase.product?.barcode || '',
        quantity: Number(purchase.quantity || 1), grossWeight: num(purchase.grossWeight), netWeight: num(purchase.netWeight), ratePerGram: num(purchase.ratePerGram),
        totalAmount: num(purchase.totalAmount), paid: num(purchase.paid), due: roundCurrency(Math.max(0, num(purchase.totalAmount) - num(purchase.paid))),
        reference: purchase.reference || ''
      }));
      const columns = [col.date('purchaseDate', 'Date'), col.identifier('purchaseNumber', 'Doc-no', 22), col.text('supplierName', 'Supplier', 28), col.text('itemName', 'Item', 26), col.text('category', 'Category', 18), col.text('metal', 'Metal', 12), col.text('purity', 'Purity', 12), col.integer('quantity', 'Pieces'), col.identifier('barcode', 'Barcode', 16), col.weight('grossWeight', 'Gross-wt'), col.weight('netWeight', 'Net-wt'), col.currency('ratePerGram', 'Rate/g'), col.currency('totalAmount', 'Amount'), col.currency('paid', 'Paid'), col.currency('due', 'Due'), col.text('reference', 'Reference', 20)];
      const sheet = { name: 'Supplier Purchases', title: 'Supplier Purchase Register', subtitle: registerPeriod(range), layout: 'ca-register', columns, rows, totalKeys: ['grossWeight', 'netWeight', 'totalAmount', 'paid', 'due'] };
      return makeExportEnvelope(columns, rows, { sheets: [sheet] });
    }

    case 'cancelled-urd': {
      const purchases = await db.urdPurchase.findMany({ where: { cancelledAt: dateTimeRange(range) }, orderBy: [{ cancelledAt: 'asc' }, { id: 'asc' }], include: { customer: true }, take: MAX_SOURCE_ROWS + 1 });
      assertExportRows(purchases, 'Cancelled URD purchase register');
      const rows = purchases.map((p) => ({ purchaseDate: exportDate(p.purchaseDate), cancelledAt: exportDate(p.cancelledAt), purchaseNumber: p.purchaseNumber, customerPhone: p.customer?.phone || '', customerName: p.customer?.name || '', metal: enumLabel(p.metal), purity: p.purity || '', netWeight: num(p.netWeight), totalAmount: num(p.totalAmount), saleOffset: num(p.saleOffset), paid: num(p.paid), description: str(p.description) }));
      const columns = [col.date('purchaseDate', 'Purchase date'), col.date('cancelledAt', 'Cancelled date'), col.identifier('purchaseNumber', 'URD no.', 22), col.identifier('customerPhone', 'Customer phone', 16), col.text('customerName', 'Customer'), col.text('metal', 'Metal', 12), col.text('purity', 'Purity', 12), col.weight('netWeight', 'Net wt. (g)'), col.currency('totalAmount', 'Valuation'), col.currency('saleOffset', 'Sale adjustment'), col.currency('paid', 'Payout / refund'), col.text('description', 'Description', 30)];
      return makeExportEnvelope(columns, rows, { sheets: [{ name: 'Cancelled URD Purchases', title: 'Cancelled URD Purchases', subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} cancelled purchase${rows.length === 1 ? '' : 's'}`, columns, rows, infoRows: [{ label: 'Cancelled purchases', value: rows.length, type: 'integer' }, { label: 'Cancelled valuation', value: rows.reduce((sum, p) => sum + p.totalAmount, 0), type: 'currency' }] }] });
    }

    // ────────────────────────────────────────────────────────────
    //  DAILY CASHBOOK — Every entry + running balance
    // ────────────────────────────────────────────────────────────
    case 'cashbook': {
      const [entries, openingTotals] = await Promise.all([
        db.cashbookEntry.findMany({
          where: { entryDate: { gte: range.from, lte: range.to } },
          orderBy: [{ entryDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
          include: { customer: true, supplierPurchase: { include: { supplier: true } } },
          take: MAX_SOURCE_ROWS + 1
        }),
        db.cashbookEntry.groupBy({
          by: ['type', 'paymentMethod'],
          where: { entryDate: { lt: range.from } },
          _sum: { amount: true }
        })
      ]);
      assertExportRows(entries, 'Cashbook register');

      const openingBalanceFor = (method = null) => openingTotals
        .filter((entry) => !method || entry.paymentMethod === method)
        .reduce((total, entry) => total + (entry.type === 'IN' ? num(entry._sum.amount) : -num(entry._sum.amount)), 0);
      const openingBalance = openingBalanceFor();

      const rows = cashbookExportRows(entries, openingBalance);

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
      const columns = allColumns;

      // Per-method grouping
      const grouped = CASHBOOK_METHODS.map((method) => {
        const methodEntries = entries.filter((entry) => entry.paymentMethod === method.key);
        return {
          ...method,
          entries: methodEntries,
          openingBalance: openingBalanceFor(method.key),
          rows: cashbookExportRows(methodEntries, openingBalanceFor(method.key))
        };
      });
      const otherEntries = entries.filter((entry) => !CASHBOOK_METHODS.some((method) => method.key === entry.paymentMethod));
      const otherOpeningBalance = openingTotals
        .filter((entry) => !CASHBOOK_METHODS.some((method) => method.key === entry.paymentMethod))
        .reduce((total, entry) => total + (entry.type === 'IN' ? num(entry._sum.amount) : -num(entry._sum.amount)), 0);
      const otherRows = cashbookExportRows(otherEntries, otherOpeningBalance);

      // Summary rows
      const summaryColumns = [
        col.text('paymentMethod', 'Payment method', 22),
        col.integer('entries', 'Total entries'),
        col.currency('openingBalance', 'Opening balance'),
        col.currency('moneyIn', 'Total money in'),
        col.currency('moneyOut', 'Total money out'),
        col.currency('netBalance', 'Net movement'),
        col.currency('closingBalance', 'Closing balance')
      ];
      const summaryRows = [...grouped, ...(otherRows.length || otherOpeningBalance ? [{ key: 'OTHER', label: 'Other methods', rows: otherRows }] : [])].map((g) => {
        const totals = cashbookTotals(g.entries || otherEntries);
        const groupOpeningBalance = g.key === 'OTHER' ? otherOpeningBalance : g.openingBalance;
        return {
          paymentMethod: g.label,
          entries: g.rows.length,
          openingBalance: groupOpeningBalance,
          moneyIn: totals.in,
          moneyOut: totals.out,
          netBalance: totals.in - totals.out,
          closingBalance: groupOpeningBalance + totals.in - totals.out
        };
      });

      // Build sheets
      const infoAll = cashbookInfoRows(entries.map(e => ({ type: e.type, amount: num(e.amount) })), openingBalance);
      const sheets = [
        {
          name: 'All entries',
          title: `Daily Cashbook - All entries`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} detailed entr${rows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows,
          infoRows: infoAll
        },
        {
          name: 'Summary',
          title: `Daily Cashbook - Payment method summary`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | Totals grouped by payment method`,
          columns: summaryColumns,
          rows: summaryRows,
          infoRows: infoAll
        }
      ];

      for (const g of grouped) {
        const gInfo = cashbookInfoRows(g.entries, g.openingBalance);
        sheets.push({
          name: g.label,
          title: `Daily Cashbook - ${g.label} entries`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${g.rows.length} ${g.label.toLowerCase()} entr${g.rows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows: g.rows,
          infoRows: gInfo
        });
      }
      if (otherRows.length || otherOpeningBalance) {
        sheets.push({
          name: 'Other methods',
          title: `Daily Cashbook - Other payment methods`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${otherRows.length} entr${otherRows.length === 1 ? 'y' : 'ies'}`,
          columns,
          rows: otherRows,
          infoRows: cashbookInfoRows(otherEntries, otherOpeningBalance)
        });
      }

      return makeExportEnvelope(columns, rows, { sheets });
    }

    // ────────────────────────────────────────────────────────────
    //  INVENTORY — Live available records + summary + per-metal
    // ────────────────────────────────────────────────────────────
    case 'inventory': {
      // An Inventory export is a live stock register, never a historical
      // movement report. Sold barcode rows are deleted on billing, and a
      // manually zeroed item is marked SOLD_OUT; neither may reappear here.
      // Historical sold details remain available through Sales and Stock
      // movements exports instead.
      const products = await db.product.findMany({
        where: {
          // Inventory is a stock snapshot. Include every available record
          // created on or before the selected end date, not only records
          // created inside the reporting window.
          createdAt: { lte: dateTimeRange(range).lte },
          status: 'AVAILABLE',
          quantity: { gt: 0 }
        },
        orderBy: [{ metal: 'asc' }, { name: 'asc' }, { category: 'asc' }, { barcode: 'asc' }],
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(products, 'Inventory register');

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
        col.date('createdAt', 'Date'),
        col.text('metal', 'Metal', 12),
        col.text('itemName', 'Item name', 24),
        col.text('category', 'Category', 18),
        col.text('purity', 'Purity', 10),
        col.identifier('barcode', 'Barcode', 16),
        col.weight('grossWeight', 'Gross wt. (g)'),
        col.weight('stoneWeight', 'Stone wt. (g)'),
        col.weight('netWeight', 'Net wt. (g)'),
        col.integer('quantity', 'Stock qty'),
        col.text('status', 'Status', 14),
        col.text('location', 'Location', 16),
        col.text('notes', 'Notes', 30)
      ];
      const columns = allColumns;

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
          subtitle: `Stock as of ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} record${rows.length === 1 ? '' : 's'} with barcode details`,
          columns,
          rows,
          infoRows: inventoryInfoRows(rows)
        },
        {
          name: 'Item summary',
          title: `Inventory - Item-wise summary`,
          subtitle: `Stock as of ${displayDate(range.to)} (${localTimeZoneName()}) | Grouped by metal, item, category and purity`,
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
          subtitle: `Stock as of ${displayDate(range.to)} (${localTimeZoneName()}) | ${metalRows.length} ${METAL_LABELS[metal].toLowerCase()} item${metalRows.length === 1 ? '' : 's'}`,
          columns,
          rows: metalRows,
          infoRows: inventoryInfoRows(metalRows)
        });
      }

      return makeExportEnvelope(columns, rows, { sheets });
    }

    // ────────────────────────────────────────────────────────────
    //  STOCK MOVEMENTS
    // ────────────────────────────────────────────────────────────
    case 'stock-movements': {
      const movements = await db.stockMovement.findMany({
        where: { createdAt: dateTimeRange(range) },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: { product: true },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(movements, 'Stock movement register');
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
        col.text('itemName', 'Item name', 24),
        col.text('metal', 'Metal', 12),
        col.text('purity', 'Purity', 10),
        col.integer('quantity', 'Qty change'),
        col.weight('netWeight', 'Net wt. (g)'),
        col.text('note', 'Note', 32)
      ];
      const columns = allColumns;

      const quantityIn = rows.filter((row) => row.quantity > 0).reduce((total, row) => total + row.quantity, 0);
      const quantityOut = rows.filter((row) => row.quantity < 0).reduce((total, row) => total + Math.abs(row.quantity), 0);
      return makeExportEnvelope(columns, rows, {
        sheets: [{
          name: 'Stock movements',
          title: 'Stock Movement Register',
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} movement${rows.length === 1 ? '' : 's'}`,
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
        include: {
          _count: {
            select: {
              sales: { where: { cancelledAt: null } },
              urdPurchases: { where: { cancelledAt: null } },
              schemeEnrollments: { where: { status: { not: 'CANCELLED' } } }
            }
          }
        },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(customers, 'Customer directory');
      const customerBalances = customers.length ? await db.customerLedger.groupBy({
        by: ['customerId'],
        // Directory balances must be reproducible for the selected period;
        // do not include ledger entries created after the export's end date.
        where: { customerId: { in: customers.map((customer) => customer.id) }, createdAt: { lte: dateTimeRange(range).lte } },
        _sum: { amount: true }
      }) : [];
      const balanceByCustomer = new Map(customerBalances.map((entry) => [entry.customerId, num(entry._sum.amount)]));
      const rows = customers.map((c) => ({
        createdAt: exportDate(c.createdAt),
        customerPhone: c.phone || '',
        customerName: c.name,
        panNumber: c.panNumber || '',
        email: c.email || '',
        address: c.address || '',
        salesCount: c._count.sales,
        urdCount: c._count.urdPurchases,
        schemeCount: c._count.schemeEnrollments,
        outstanding: balanceByCustomer.get(c.id) || 0
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
        col.integer('schemeCount', 'Savings schemes'),
        col.currency('outstanding', 'Outstanding due')
      ];
      const columns = allColumns;
      const totalDue = rows.reduce((s, r) => s + r.outstanding, 0);

      return makeExportEnvelope(columns, rows, {
        sheets: [{
          name: 'Customer directory',
          title: `Customer Directory`,
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} customer${rows.length === 1 ? '' : 's'}`,
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
    //  JEWELLERY SAVINGS SCHEMES
    // ────────────────────────────────────────────────────────────
    case 'schemes': {
      const schemeDateRange = dateTimeRange(range);
      const enrollments = await db.schemeEnrollment.findMany({
        // A cancelled enrollment remains safely in the database and
        // Cashbook history, but it is not an active scheme customer and must
        // not appear in the normal CA scheme register.
        // Include active customers enrolled in the period OR customers who
        // received a payment in the period. This keeps calendar exports
        // useful when an August installment is actually paid in September.
        where: {
          status: { not: 'CANCELLED' },
          OR: [
            // Include active enrollments whose scheme overlaps the selected
            // period, even when that customer has not paid yet. This keeps a
            // monthly register complete and lets it show amount 0.
            { startDate: { lte: schemeDateRange.lte }, endDate: { gte: schemeDateRange.gte } },
            {
              installments: {
                some: {
                  OR: [
                    { paymentDate: { gte: range.from, lte: range.to } },
                    { payments: { some: { paymentDate: { gte: range.from, lte: range.to } } } }
                  ]
                }
              }
            }
          ]
        },
        orderBy: [{ startDate: 'asc' }, { id: 'asc' }],
        include: {
          customer: true,
          installments: {
            select: {
              installmentNumber: true, paidAmount: true, paymentDate: true, paymentMethod: true,
              payments: { select: { amount: true, paymentDate: true, paymentMethod: true } }
            }
          }
        },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(enrollments, 'Savings scheme register');
      const columns = [
        col.integer('srNo', 'Sr. No.', 9),
        col.identifier('enrollmentNumber', 'Scheme Doc No.', 22),
        { ...col.text('customerName', 'Name', 40), wrap: true },
        col.identifier('customerPhone', 'Mobile No.', 16),
        // This is a consolidated lifetime register. It intentionally omits
        // payment date and method: either one beside the accumulated amount
        // could falsely imply that the whole total was paid that way/on that day.
        col.currency('amount', 'Amount')
      ];
      const rows = enrollments.map((enrollment, index) => ({
        srNo: index + 1,
        enrollmentNumber: enrollment.enrollmentNumber,
        customerName: enrollment.customer?.name || 'Unknown customer',
        customerPhone: enrollment.customer?.phone || '',
        amount: num(enrollment.totalPaid)
      }));
      return makeExportEnvelope(columns, rows, {
        sheets: [{
          name: 'Scheme Register', title: 'Scheme Register', subtitle: registerPeriod(range), layout: 'ca-register',
          columns, rows, totalKeys: ['amount']
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
        include: { customer: true, sale: true },
        take: MAX_SOURCE_ROWS + 1
      });
      assertExportRows(entries, 'Customer ledger');
      const customerIds = [...new Set(entries.map((entry) => entry.customerId))];
      const openingRows = customerIds.length ? await db.customerLedger.groupBy({
        by: ['customerId'],
        where: { customerId: { in: customerIds }, createdAt: { lt: period.gte } },
        _sum: { amount: true }
      }) : [];
      const openingBalances = new Map(openingRows.map((row) => [row.customerId, num(row._sum.amount)]));
      const customerBalances = new Map();
      const rows = entries.map((e, index) => {
        const amount = num(e.amount);
        const openingBalance = openingBalances.get(e.customerId) || 0;
        const runningBalance = (customerBalances.has(e.customerId) ? customerBalances.get(e.customerId) : openingBalance) + amount;
        customerBalances.set(e.customerId, runningBalance);
        return {
          srNo: index + 1,
          date: exportDate(e.createdAt),
          customerName: e.customer?.name || 'Unknown customer',
          customerPhone: e.customer?.phone || '',
          due: runningBalance
        };
      });

      const columns = [
        col.integer('srNo', 'Sr No.', 9),
        col.date('date', 'Date', 14),
        col.text('customerName', 'Customer name', 26),
        col.identifier('customerPhone', 'Phone no.', 16),
        col.currency('due', 'Due', 16)
      ];

      return makeExportEnvelope(columns, rows, {
        sheets: [{
          name: 'Customer ledger',
          title: 'Customer Ledger Register',
          subtitle: registerPeriod(range),
          columns,
          rows,
          layout: 'ca-register'
        }]
      });
    }

    // ────────────────────────────────────────────────────────────
    //  DAILY METAL RATES
    // ────────────────────────────────────────────────────────────
    case 'rates': {
      const rates = await db.dailyRate.findMany({ where: { rateDate: { gte: range.from, lte: range.to } }, orderBy: { rateDate: 'asc' }, take: MAX_SOURCE_ROWS + 1 });
      assertExportRows(rates, 'Daily rate register');
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
      const columns = allColumns;

      return makeExportEnvelope(columns, rows, {
        sheets: [{
          name: 'Daily rates',
          title: 'Daily Metal Rate Register',
          subtitle: `${displayDate(range.from)} to ${displayDate(range.to)} (${localTimeZoneName()}) | ${rows.length} saved rate${rows.length === 1 ? '' : 's'}`,
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

async function getSchemePlanExportPayload(db, schemePlanId, options = {}) {
  const planId = Number(schemePlanId);
  if (!Number.isInteger(planId) || planId < 1) throw new Error('Choose a valid scheme plan.');
  const plan = await db.schemePlan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('Scheme plan not found.');

  const requestedMonth = String(options.month || '').trim();
  const month = requestedMonth ? Number(requestedMonth) : null;
  if (month !== null && (!Number.isInteger(month) || month < 1 || month > plan.durationMonths)) {
    throw new Error(`Choose a scheme month from 1 to ${plan.durationMonths}.`);
  }

  const enrollments = await db.schemeEnrollment.findMany({
    // Plan exports are operational registers, so exclude cancelled customers
    // consistently from consolidated and per-month reports.
    where: { schemePlanId: planId, status: { not: 'CANCELLED' } },
    orderBy: [{ enrollmentNumber: 'asc' }, { id: 'asc' }],
    include: {
      customer: true,
      installments: month === null
        ? {
            select: {
              installmentNumber: true, paidAmount: true, paymentDate: true, paymentMethod: true,
              payments: { select: { amount: true, paymentDate: true, paymentMethod: true } }
            }
          }
        : {
            where: { installmentNumber: month },
            select: {
              installmentNumber: true, paidAmount: true, paymentDate: true, paymentMethod: true,
              payments: { select: { amount: true, paymentDate: true, paymentMethod: true } }
            }
          }
    },
    take: MAX_SOURCE_ROWS + 1
  });
  assertExportRows(enrollments, 'Scheme report');

  // A consolidated report carries a lifetime total, so it deliberately shows
  // no payment date or method beside that total. A month report lists every
  // active enrollment, including unpaid and partly paid installments.
  const columns = [
    col.integer('srNo', 'Sr. No.', 9),
    col.identifier('enrollmentNumber', 'Scheme Doc No.', 22),
    // Scheme registers are often reviewed on-screen before printing. Give
    // customer names enough room to remain readable instead of forcing short
    // names to appear crowded beside the mobile-number column.
    { ...col.text('customerName', 'Name', 40), wrap: true },
    col.identifier('customerPhone', 'Mobile No.', 16),
    ...(month === null ? [] : [
      col.dateList('paidDates', 'Paid Date', 20),
      { ...col.text('paymentType', 'Payment Type', 34), wrap: true }
    ]),
    { ...col.currency('amount', 'Amount'), width: 16 }
  ];
  const rows = enrollments.map((enrollment, index) => {
    const payment = month === null ? {} : latestSchemePayment(enrollment.installments);
    return {
      srNo: index + 1,
      enrollmentNumber: enrollment.enrollmentNumber,
      customerName: enrollment.customer?.name || 'Unknown customer',
      customerPhone: enrollment.customer?.phone || '',
      amount: month === null
        ? num(enrollment.totalPaid)
        : num(enrollment.installments?.[0]?.paidAmount),
      ...payment
    };
  });
  const reportLabel = month === null ? 'Consolidated Scheme Report' : `Month ${month} Scheme Report`;
  const shopName = String(options.shopName || 'Jewellery ERP').trim() || 'Jewellery ERP';
  return {
    title: `${shopName} - ${plan.name}`,
    subtitle: `${plan.name} · ${reportLabel}`,
    filename: `scheme-${planId}-${month === null ? 'consolidated' : `month-${month}`}.xlsx`,
    shopName,
    metadata: options.metadata,
    columns,
    rows,
    sheets: [{
      name: month === null ? 'Consolidated' : `Month ${month}`,
      title: reportLabel,
      subtitle: `${plan.name} · ${reportLabel}`,
      layout: 'ca-register',
      landscape: month !== null,
      columns,
      rows,
      totalKeys: ['amount']
    }]
  };
}

// ═══════════════════════════════════════════════════════════════
//  ARCHIVE (DELETE) DATA
// ═══════════════════════════════════════════════════════════════

async function archiveData(db, key, range) {
  const resource = resourceFor(key);
  if (resource.archiveDisabled) throw new Error(resource.archiveNote);
  const archiveRange = dateTimeRange(range);
  const takeArchiveWindow = async (tx, model, where, select) => {
    const rows = await tx[model].findMany({ where, select, orderBy: { id: 'asc' }, take: MAX_ARCHIVE_OPERATION_ROWS + 1 });
    if (rows.length > MAX_ARCHIVE_OPERATION_ROWS) {
      throw new Error(`More than ${MAX_ARCHIVE_OPERATION_ROWS} ${resource.label.toLowerCase()} records match this range. Choose a shorter date range before permanently deleting data.`);
    }
    return rows;
  };
  return db.$transaction(async (tx) => {
    if (key === 'sales') {
      const candidates = await takeArchiveWindow(tx, 'sale', { saleDate: archiveRange }, { id: true, invoiceNumber: true, balance: true });
      const ids = candidates.filter((s) => num(s.balance) <= 0).map((s) => s.id);
      if (ids.length) {
        const invoiceNumbers = candidates.filter((s) => ids.includes(s.id)).map((s) => s.invoiceNumber);
        const linkedLedger = await tx.customerLedger.findMany({
          where: { saleId: { in: ids }, cashbookEntryId: { not: null } },
          select: { cashbookEntryId: true }
        });
        const cashbookIds = [...new Set(linkedLedger.map((row) => row.cashbookEntryId).filter(Boolean))];
        await tx.customerLedger.deleteMany({ where: { saleId: { in: ids } } });
        // Cashbook is an independent money register. Retain its physical
        // entries, but detach them from removed invoices and their removed
        // ledger allocations so later cashbook deletion remains safe.
        await tx.cashbookEntry.updateMany({ where: { saleId: { in: ids } }, data: { saleId: null, syncLedger: false } });
        if (cashbookIds.length) await tx.cashbookEntry.updateMany({ where: { id: { in: cashbookIds } }, data: { syncLedger: false } });
        await tx.stockMovement.deleteMany({ where: { type: 'SALE', note: { in: invoiceNumbers.map((invoiceNumber) => `Sold via ${invoiceNumber}`) } } });
        await tx.sale.deleteMany({ where: { id: { in: ids } } });
      }
      return { deleted: ids.length, skipped: candidates.length - ids.length, note: 'Invoices with an outstanding customer balance were kept. Related invoice ledger and sale-movement history was removed; independent cashbook entries were retained.' };
    }
    if (key === 'urd') {
      const candidates = await takeArchiveWindow(tx, 'urdPurchase', { purchaseDate: archiveRange }, { id: true, purchaseNumber: true, totalAmount: true, paid: true, saleOffset: true });
      const settled = candidates.filter((p) => num(p.totalAmount) - num(p.paid) - num(p.saleOffset) <= 0);
      for (const purchase of settled) await deleteSettledUrdPurchase(tx, purchase);
      return { deleted: settled.length, skipped: candidates.length - settled.length, note: 'URD purchases with an unpaid customer amount were kept. Linked payout entries were removed with each deleted purchase.' };
    }
    if (key === 'cashbook') {
      const entries = await takeArchiveWindow(tx, 'cashbookEntry', { entryDate: { gte: range.from, lte: range.to } }, { id: true });
      let deleted = 0;
      for (const entry of entries) {
        const result = await reverseAndDeleteCashbookEntry(tx, entry.id);
        deleted += result.deleted;
      }
      return { deleted, skipped: 0, note: 'Linked customer, invoice, URD and scheme installment accounting was reversed before each cashbook entry was removed.' };
    }
    if (key === 'inventory') {
      const candidates = await takeArchiveWindow(tx, 'product', { createdAt: archiveRange }, { id: true, quantity: true });
      const ids = candidates.filter((p) => p.quantity === 0).map((p) => p.id);
      const result = ids.length ? await tx.product.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'Inventory with remaining stock was kept.' };
    }
    if (key === 'stock-movements') {
      const candidates = await takeArchiveWindow(tx, 'stockMovement', { createdAt: archiveRange }, { id: true });
      const result = candidates.length ? await tx.stockMovement.deleteMany({ where: { id: { in: candidates.map((row) => row.id) } } }) : { count: 0 };
      return { deleted: result.count, skipped: 0, note: 'Current inventory quantity was not adjusted.' };
    }
    if (key === 'customers') {
      const candidates = await takeArchiveWindow(tx, 'customer', { createdAt: archiveRange }, { id: true, _count: { select: { sales: true, ledger: true, urdPurchases: true, cashbookEntries: true, schemeEnrollments: true, pledgeLoans: true } } });
      const ids = candidates.filter((c) => Object.values(c._count).every((n) => n === 0)).map((c) => c.id);
      const result = ids.length ? await tx.customer.deleteMany({ where: { id: { in: ids } } }) : { count: 0 };
      return { deleted: result.count, skipped: candidates.length - ids.length, note: 'Customers with business history were kept.' };
    }
    if (key === 'rates') {
      const candidates = await takeArchiveWindow(tx, 'dailyRate', { rateDate: { gte: range.from, lte: range.to } }, { id: true });
      const result = candidates.length ? await tx.dailyRate.deleteMany({ where: { id: { in: candidates.map((row) => row.id) } } }) : { count: 0 };
      return { deleted: result.count, skipped: 0, note: '' };
    }
    throw new Error('That data register cannot be archived.');
  });
}

module.exports = { RESOURCE_LIST, resourceFor, parseDateRange, getExportPayload, getSchemePlanExportPayload, archiveData };

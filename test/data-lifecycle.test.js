const test = require('node:test');
const assert = require('node:assert/strict');

const { dateInput, roundToNearestRupee } = require('../src/lib/helpers');
const { getExportPayload } = require('../src/lib/data-lifecycle');

test('uses the Windows-local calendar date instead of UTC for operational date keys', () => {
  // Constructing with local parts models the shop computer's own clock.  It
  // must remain the same date even when its UTC representation is the prior
  // calendar day (for example, early morning in India).
  const earlyMorning = new Date(2026, 8, 1, 0, 15, 0);
  assert.equal(dateInput(earlyMorning), '2026-09-01');
});

test('rounds final invoice values to the nearest whole rupee', () => {
  assert.equal(roundToNearestRupee(1.8), 2);
  assert.equal(roundToNearestRupee(1.1), 1);
  assert.equal(roundToNearestRupee(1.5), 2);
  assert.equal(roundToNearestRupee(19.49), 19);
});

test('cashbook export carries each payment method opening balance into its own sheet', async () => {
  const db = {
    cashbookEntry: {
      findMany: async () => [
        {
          entryDate: '2026-09-01', type: 'IN', paymentMethod: 'CASH',
          description: 'Customer receipt', amount: 50, reference: 'R-1',
          notes: '', syncLedger: true,
          customer: { name: 'Test Customer', phone: '9999999999' }
        }
      ],
      groupBy: async () => [
        { type: 'IN', paymentMethod: 'CASH', _sum: { amount: 100 } },
        { type: 'OUT', paymentMethod: 'UPI', _sum: { amount: 20 } }
      ]
    }
  };

  const payload = await getExportPayload(db, 'cashbook', { from: '2026-09-01', to: '2026-09-01' });
  const cash = payload.sheets.find((sheet) => sheet.name === 'Cash');
  const upi = payload.sheets.find((sheet) => sheet.name === 'UPI');
  const all = payload.sheets.find((sheet) => sheet.name === 'All entries');

  assert.equal(cash.infoRows.find((row) => row.label === 'Opening balance').value, 100);
  assert.equal(cash.rows[0].runningBalance, 150);
  assert.equal(upi.infoRows.find((row) => row.label === 'Opening balance').value, -20);
  assert.equal(all.infoRows.find((row) => row.label === 'Opening balance').value, 80);
});

test('long Excel date ranges stop before loading database data into memory', async () => {
  await assert.rejects(
    () => getExportPayload({}, 'sales', { from: '2024-01-01', to: '2026-09-01' }),
    /two years at a time/
  );
});

test('sales and URD export registers label an excess URD valuation as refundable', async () => {
  const sale = {
    saleDate: new Date(2026, 8, 2, 10, 0), invoiceNumber: 'INV-URD-REFUND', customerPan: '',
    subtotal: 97.09, discount: 0, gstRate: 3, gstAmount: 2.91, total: 100, urdOffset: 150,
    paid: 0, cashPaid: 0, upiPaid: 0, cardPaid: 0, bankPaid: 0, balance: 0, paymentMethod: 'CREDIT', notes: '',
    customer: { name: 'Asha', phone: '9999999999', panNumber: '' },
    items: [{ quantity: 1, grossWeight: 2, weight: 2, productBarcode: 'G00001', productSku: 'G00001', productName: 'Gold Ring', productMetal: 'GOLD', productPurity: '22K', metalRate: 100, metalAmount: 200, makingChargeType: 'FIXED', makingChargeValue: 0, makingCharge: 0, taxableAmount: 97.09, hsnCode: '', huidCode: '', product: null }],
    urdPurchase: { paid: 50, paymentMethod: 'UPI' }
  };
  const purchase = {
    purchaseDate: new Date(2026, 8, 2, 10, 0), purchaseNumber: 'URD-REFUND', metal: 'GOLD', purity: '22K',
    grossWeight: 3, netWeight: 3, ratePerGram: 50, totalAmount: 150, saleOffset: 100, paid: 50,
    paymentMethod: 'UPI', description: 'Old chain', notes: '', customer: { name: 'Asha', phone: '9999999999' }, sale: { invoiceNumber: 'INV-URD-REFUND' }
  };
  const db = {
    sale: { findMany: async () => [sale] },
    urdPurchase: { findMany: async () => [purchase] }
  };

  const sales = await getExportPayload(db, 'sales', { from: '2026-09-02', to: '2026-09-02' });
  const summary = sales.sheets.find((sheet) => sheet.name === 'Invoice summary');
  assert.equal(summary.rows[0].netPayable, 0);
  assert.equal(summary.rows[0].netRefundable, 50);
  assert.equal(summary.rows[0].refundedAmount, 50);
  assert.equal(summary.rows[0].refundMethod, 'UPI');
  assert.ok(summary.columns.some((column) => column.label === 'Net refundable'));

  const urd = await getExportPayload(db, 'urd', { from: '2026-09-02', to: '2026-09-02' });
  assert.equal(urd.rows[0].saleOffset, 100);
  assert.equal(urd.rows[0].cashPayable, 50);
  assert.equal(urd.rows[0].paid, 50);
  assert.ok(urd.columns.some((column) => column.label === 'Cash payout / refund'));
});

test('cashbook export retains a URD excess as a method-specific money-out entry', async () => {
  const entry = {
    id: 1, entryDate: '2026-09-02', createdAt: new Date(2026, 8, 2, 10, 0), type: 'OUT', paymentMethod: 'UPI', amount: 50,
    description: 'URD refund — INV-URD-REFUND', reference: 'INV-URD-REFUND', syncLedger: false, notes: 'URD excess refunded',
    customer: { name: 'Asha', phone: '9999999999' }
  };
  const db = {
    cashbookEntry: {
      findMany: async () => [entry],
      groupBy: async () => []
    }
  };
  const cashbook = await getExportPayload(db, 'cashbook', { from: '2026-09-02', to: '2026-09-02' });
  const upi = cashbook.sheets.find((sheet) => sheet.name === 'UPI');
  assert.equal(cashbook.rows[0].moneyOut, 50);
  assert.equal(cashbook.rows[0].paymentMethod, 'UPI');
  assert.match(cashbook.rows[0].description, /URD refund/);
  assert.equal(upi.rows[0].moneyOut, 50);
});

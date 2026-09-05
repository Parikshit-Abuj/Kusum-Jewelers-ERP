const test = require('node:test');
const assert = require('node:assert/strict');

const { dateInput, roundToNearestRupee, nextDocumentNumber } = require('../src/lib/helpers');
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

test('sales bill numbers use an India financial-year counter and roll over on 1 April', async () => {
  const sequenceKeys = [];
  const counters = new Map();
  let currentKey = '';
  const tx = {
    $executeRaw: async (_strings, ...values) => {
      currentKey = values[0];
      sequenceKeys.push(currentKey);
      counters.set(currentKey, (counters.get(currentKey) || 0) + 1);
    },
    $queryRaw: async () => [{ lastNumber: counters.get(currentKey) }],
    sale: { findUnique: async () => null },
    urdPurchase: { findUnique: async () => null },
    schemeEnrollment: { findUnique: async () => null }
  };

  assert.equal(await nextDocumentNumber(tx, 'SB', new Date(2026, 2, 31, 12, 0)), 'SB/25-26/00001');
  assert.equal(await nextDocumentNumber(tx, 'SB', new Date(2026, 3, 1, 12, 0)), 'SB/26-27/00001');
  assert.deepEqual(sequenceKeys, ['SB-2025-2026', 'SB-2026-2027']);
});

test('URD purchase numbers use their own India financial-year counter', async () => {
  const sequenceKeys = [];
  const counters = new Map();
  let currentKey = '';
  const tx = {
    $executeRaw: async (_strings, ...values) => {
      currentKey = values[0];
      sequenceKeys.push(currentKey);
      counters.set(currentKey, (counters.get(currentKey) || 0) + 1);
    },
    $queryRaw: async () => [{ lastNumber: counters.get(currentKey) }],
    sale: { findUnique: async () => null },
    urdPurchase: { findUnique: async () => null },
    schemeEnrollment: { findUnique: async () => null }
  };

  assert.equal(await nextDocumentNumber(tx, 'UR', new Date(2027, 2, 31, 12, 0)), 'UR/26-27/00001');
  assert.equal(await nextDocumentNumber(tx, 'UR', new Date(2027, 3, 1, 12, 0)), 'UR/27-28/00001');
  assert.deepEqual(sequenceKeys, ['UR-2026-2027', 'UR-2027-2028']);
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

test('sales and URD CA registers keep URD settlement figures accurate', async () => {
  const sale = {
    saleDate: new Date(2026, 8, 2, 10, 0), invoiceNumber: 'SB/26-27/00001', customerPan: '',
    subtotal: 97.09, discount: 0, gstRate: 3, gstAmount: 2.91, total: 100, urdOffset: 150,
    paid: 0, cashPaid: 0, upiPaid: 0, cardPaid: 0, bankPaid: 0, balance: 0, paymentMethod: 'CREDIT', notes: '',
    customer: { name: 'Asha', phone: '9999999999', panNumber: '' },
    items: [{ quantity: 1, grossWeight: 2, weight: 2, productBarcode: 'G00001', productSku: 'G00001', productName: 'Gold Ring', productMetal: 'GOLD', productPurity: '22K', metalRate: 100, metalAmount: 200, makingChargeType: 'FIXED', makingChargeValue: 0, makingCharge: 0, taxableAmount: 97.09, hsnCode: '', huidCode: '', product: null }],
    urdPurchase: { paid: 50, paymentMethod: 'UPI' }
  };
  const purchase = {
    purchaseDate: new Date(2026, 8, 2, 10, 0), purchaseNumber: 'UR/26-27/00001', metal: 'GOLD', purity: '22K',
    grossWeight: 3, netWeight: 3, ratePerGram: 50, totalAmount: 150, saleOffset: 100, paid: 50,
    paymentMethod: 'UPI', description: 'Old chain', notes: '', customer: { name: 'Asha', phone: '9999999999' }, sale: { invoiceNumber: 'SB/26-27/00001' }
  };
  const db = {
    sale: { findMany: async () => [sale] },
    urdPurchase: { findMany: async () => [purchase] }
  };

  const sales = await getExportPayload(db, 'sales', { from: '2026-09-02', to: '2026-09-02' });
  const salesRegister = sales.sheets.find((sheet) => sheet.name === 'Sales Register');
  assert.equal(salesRegister.layout, 'ca-register');
  assert.deepEqual(salesRegister.columns.map((column) => column.label), ['Date', 'Doc-no', 'Customer', 'Gr-wt', 'Net-wt', 'Taxable-amt', 'CGST', 'SGST', 'IGST', 'Total', 'URD', 'Discount', 'Net-amt']);
  assert.equal(salesRegister.rows[0].invoiceNumber, 'SB/26-27/00001');
  assert.equal(salesRegister.rows[0].urdAdjustment, 100);
  assert.equal(salesRegister.rows[0].netAmount, 0);

  const urd = await getExportPayload(db, 'urd', { from: '2026-09-02', to: '2026-09-02' });
  const urdRegister = urd.sheets.find((sheet) => sheet.name === 'URD Purchase Register');
  assert.equal(urdRegister.layout, 'ca-register');
  assert.equal(urdRegister.rows[0].purchaseNumber, 'UR/26-27/00001');
  assert.equal(urdRegister.rows[0].totalAmount, 150);
  assert.equal(urdRegister.rows[0].remark, 'SB/26-27/00001');
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

test('URD Excel export keeps Remark empty when a standalone purchase has no linked sales bill', async () => {
  const db = {
    urdPurchase: {
      findMany: async () => [{
        purchaseDate: new Date(2026, 8, 2, 10, 0), purchaseNumber: 'URD-SILVER-MANUAL', metal: 'SILVER', purity: '999 Fine Silver',
        grossWeight: 20, netWeight: 20, ratePerGram: 100, totalAmount: 2000, saleOffset: 0, paid: 2000,
        paymentMethod: 'CASH', description: '', notes: '', customer: { name: 'Asha', phone: '9999999999' }, sale: null
      }]
    }
  };
  const payload = await getExportPayload(db, 'urd', { from: '2026-09-02', to: '2026-09-02' });
  assert.equal(payload.rows[0].remark, '');
  assert.equal(payload.sheets[0].layout, 'ca-register');
});

test('customer ledger export is a compact CA register with phone and running due', async () => {
  const customer = { name: 'Ram Sharma', phone: '9876543210' };
  const db = {
    customerLedger: {
      findMany: async () => [
        { id: 1, customerId: 7, createdAt: new Date(2026, 8, 2, 10, 0), amount: 100, customer },
        { id: 2, customerId: 7, createdAt: new Date(2026, 8, 2, 11, 0), amount: -25, customer }
      ],
      groupBy: async () => [{ customerId: 7, _sum: { amount: 50 } }]
    }
  };

  const payload = await getExportPayload(db, 'customer-ledger', { from: '2026-09-02', to: '2026-09-02' });
  const sheet = payload.sheets[0];

  assert.equal(sheet.layout, 'ca-register');
  assert.equal(sheet.title, 'Customer Ledger Register');
  assert.equal(sheet.subtitle, 'From    02/09/2026   To   02/09/2026');
  assert.deepEqual(sheet.columns.map((column) => column.label), ['Sr No.', 'Date', 'Customer name', 'Phone no.', 'Due']);
  assert.deepEqual(sheet.rows.map((row) => [row.srNo, row.customerName, row.customerPhone, row.due]), [
    [1, 'Ram Sharma', '9876543210', 150],
    [2, 'Ram Sharma', '9876543210', 125]
  ]);
});

test('scheme export keeps enrollment and installment cashbook information in separate sheets', async () => {
  const enrollment = {
    id: 1,
    enrollmentNumber: 'SCH-20260904-0001',
    startDate: new Date(2026, 8, 4, 10, 0),
    endDate: new Date(2027, 7, 4, 10, 0),
    status: 'ACTIVE', totalPaid: 5000, installmentsPaid: 1, notes: 'Monthly savings',
    customer: { name: 'Asha', phone: '9999999999' },
    schemePlan: { name: 'Gold Saving 12M', durationMonths: 12, monthlyAmount: 5000, maturityAmount: 65000 },
    installments: [
      { id: 1, installmentNumber: 1, dueDate: '2026-09-04', status: 'PAID', paidAmount: 5000, paymentDate: '2026-09-04', paymentMethod: 'UPI', cashbookEntryId: 23, notes: '' },
      { id: 2, installmentNumber: 2, dueDate: '2026-10-04', status: 'PENDING', paidAmount: 0, paymentDate: null, paymentMethod: null, cashbookEntryId: null, notes: '' }
    ]
  };
  const db = { schemeEnrollment: { findMany: async () => [enrollment] } };
  const payload = await getExportPayload(db, 'schemes', { from: '2026-09-01', to: '2026-09-30' });
  const enrollments = payload.sheets.find((sheet) => sheet.name === 'Scheme Register');
  const installments = payload.sheets.find((sheet) => sheet.name === 'Installment Register');
  assert.equal(enrollments.rows[0].totalPaid, 5000);
  assert.equal(enrollments.rows[0].installmentsPending, 11);
  assert.equal(enrollments.layout, 'ca-register');
  assert.equal(installments.rows[0].paymentMethod, 'UPI');
  assert.equal(installments.rows[0].cashbookReference, 'Cashbook #23');
  assert.equal(installments.rows[1].paymentDate, '');
});

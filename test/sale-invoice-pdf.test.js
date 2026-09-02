const test = require('node:test');
const assert = require('node:assert/strict');

const { invoiceQrPayload, positiveInvoicePayments, urdRefundDetails } = require('../src/lib/sale-invoice-pdf');

test('invoice QR payload includes customer, every sold item, paid amount and credit', () => {
  const payload = invoiceQrPayload({
    invoiceNumber: 'INV-TEST-01',
    paid: 12000,
    balance: 5870.5,
    customer: { name: 'Ravi Kumar' },
    items: [
      { productName: 'Gold Ring', weight: 2.3 },
      { productName: 'Silver Payal', weight: 9.8 }
    ]
  });

  assert.match(payload, /Customer: Ravi Kumar/);
  assert.match(payload, /1\. Gold Ring - Net wt: 2\.300 g/);
  assert.match(payload, /2\. Silver Payal - Net wt: 9\.800 g/);
  assert.match(payload, /Paid amount: Rs\. 12,000\.00/);
  assert.match(payload, /Balance \/ credit: Rs\. 5,870\.50/);
});

test('invoice QR payload omits credit line when a sale is fully paid', () => {
  const payload = invoiceQrPayload({
    invoiceNumber: 'INV-TEST-02',
    paid: 500,
    balance: 0,
    customer: { name: 'Asha' },
    items: [{ productName: 'Gold Chain', weight: 4.25 }]
  });

  assert.match(payload, /Paid amount: Rs\. 500\.00/);
  assert.doesNotMatch(payload, /Balance \/ credit:/);
});

test('invoice payment lines omit zero-value Cash and UPI methods', () => {
  assert.deepEqual(
    positiveInvoicePayments({ paid: 100, cashPaid: 100, upiPaid: 0, cardPaid: 0, bankPaid: 0 }),
    [['CASH', 100]]
  );
  assert.deepEqual(
    positiveInvoicePayments({ paid: 100, cashPaid: 0, upiPaid: 100, cardPaid: 0, bankPaid: 0 }),
    [['UPI', 100]]
  );
});

test('invoice QR details retain the URD excess refund and its method', () => {
  const sale = {
    invoiceNumber: 'INV-URD-REFUND', total: 100, urdOffset: 150, paid: 0, balance: 0,
    customer: { name: 'Asha' }, items: [{ productName: 'Gold Ring', weight: 2 }],
    urdPurchase: { paid: 50, paymentMethod: 'UPI' }
  };
  const payload = invoiceQrPayload(sale);
  assert.match(payload, /Net refundable: Rs\. 50\.00/);
  assert.match(payload, /Refunded by UPI: Rs\. 50\.00/);
  assert.deepEqual(urdRefundDetails(sale), { amount: 50, recorded: true, method: 'UPI' });
});

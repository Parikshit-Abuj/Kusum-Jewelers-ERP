const test = require('node:test');
const assert = require('node:assert/strict');

const { urdSettlement } = require('../src/lib/urd-settlement');

test('uses URD valuation only up to the sale total and makes its excess refundable', () => {
  assert.deepEqual(urdSettlement(100, 150), {
    invoiceTotal: 100,
    urdValue: 150,
    saleAdjustment: 100,
    netPayable: 0,
    netRefundable: 50,
    hasRefund: true
  });
});

test('keeps a normal partial URD adjustment payable by the customer', () => {
  assert.deepEqual(urdSettlement(150, 100), {
    invoiceTotal: 150,
    urdValue: 100,
    saleAdjustment: 100,
    netPayable: 50,
    netRefundable: 0,
    hasRefund: false
  });
});

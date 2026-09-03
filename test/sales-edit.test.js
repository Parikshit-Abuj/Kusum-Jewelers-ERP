const test = require('node:test');
const assert = require('node:assert/strict');
const { Writable } = require('node:stream');

const { roundToNearestRupee } = require('../src/lib/helpers');
const { urdSettlement } = require('../src/lib/urd-settlement');
const { paymentMethodFromComponents } = require('../src/lib/accounting-reversal');
const { invoiceQrPayload, writeSaleInvoice } = require('../src/lib/sale-invoice-pdf');

function roundedMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

test('recalculates edited sales bill financials with multiple items, rates, making charges, and discounts', () => {
  // Scenario: Cashier edits an existing bill with 2 items, modifying weights and making charges,
  // and adding an invoice discount.
  const editedItems = [
    {
      name: 'Gold Ring 22K',
      weight: 3.5, // changed from 3.0g
      metalRate: 7200,
      makingChargeType: 'PER_GRAM',
      makingChargeValue: 450,
      // metalAmount = 7200 * 3.5 = 25200; making = 450 * 3.5 = 1575 => taxable = 26775
    },
    {
      name: 'Gold Chain 22K',
      weight: 12.0,
      metalRate: 7200,
      makingChargeType: 'PERCENTAGE',
      makingChargeValue: 12,
      // metalAmount = 7200 * 12 = 86400; making = 86400 * 12% = 10368 => taxable = 96768
    }
  ];

  const subtotal = roundedMoney(editedItems.reduce((sum, item) => {
    const metalAmount = item.metalRate * item.weight;
    const making = item.makingChargeType === 'PER_GRAM'
      ? item.makingChargeValue * item.weight
      : metalAmount * (item.makingChargeValue / 100);
    return sum + metalAmount + making;
  }, 0));

  assert.equal(subtotal, 123543); // 26775 + 96768

  const discount = 543;
  const taxable = roundedMoney(subtotal - discount);
  assert.equal(taxable, 123000);

  const gstRate = 3;
  const gstAmount = roundedMoney(taxable * gstRate / 100);
  assert.equal(gstAmount, 3690);

  const total = roundToNearestRupee(roundedMoney(taxable + gstAmount));
  assert.equal(total, 126690);
});

test('handles edited sales bill with URD buyback adjustment and excess refund', () => {
  // Invoice total: Rs. 50,000
  // Customer gives old gold scrap worth Rs. 65,000
  const total = 50000;
  const urdAmount = 65000;

  const settlement = urdSettlement(total, urdAmount);
  assert.equal(settlement.saleAdjustment, 50000);
  assert.equal(settlement.netPayable, 0);
  assert.equal(settlement.netRefundable, 15000);
  assert.equal(settlement.hasRefund, true);

  // When refundable, paid is 0 and payment method for sale is CREDIT or not required
  const paymentComponents = { CASH: 0, UPI: 0, CARD: 0, BANK_TRANSFER: 0 };
  const paymentMethod = paymentMethodFromComponents(paymentComponents, 0);
  assert.equal(paymentMethod, 'CREDIT');
});

test('accurately calculates mixed split payment on edited sales bill', () => {
  const netPayable = 126690;
  const components = {
    CASH: 26690,
    UPI: 50000,
    CARD: 50000,
    BANK_TRANSFER: 0
  };

  const totalPaid = roundedMoney(components.CASH + components.UPI + components.CARD + components.BANK_TRANSFER);
  assert.equal(totalPaid, 126690);
  const balance = Math.max(0, roundedMoney(netPayable - totalPaid));
  assert.equal(balance, 0);

  const paymentMethod = paymentMethodFromComponents(components, totalPaid);
  assert.equal(paymentMethod, 'MIXED');
});

test('accurately assigns CREDIT payment method when payment is zero', () => {
  const components = { CASH: 0, UPI: 0, CARD: 0, BANK_TRANSFER: 0 };
  const paymentMethod = paymentMethodFromComponents(components, 0);
  assert.equal(paymentMethod, 'CREDIT');
});

test('coordinated PDF and QR payload reflects all edited items, weights, and payments without structure distortion', async () => {
  const editedSale = {
    id: 99,
    invoiceNumber: 'INV-20260903-EDITED',
    saleDate: new Date(2026, 8, 3, 14, 30),
    customerPan: 'ABCDE1234F',
    subtotal: 123543,
    discount: 543,
    gstRate: 3,
    gstAmount: 3690,
    total: 126690,
    urdOffset: 0,
    paid: 100000,
    cashPaid: 50000,
    upiPaid: 50000,
    cardPaid: 0,
    bankPaid: 0,
    balance: 26690,
    paymentMethod: 'MIXED',
    notes: 'Corrected weight after hallmarking verification',
    customer: {
      id: 10,
      name: 'Aarav Sharma',
      phone: '9876543210',
      address: 'Main Bazaar, Beed',
      panNumber: 'ABCDE1234F'
    },
    items: [
      {
        id: 201,
        productBarcode: 'G 0001A',
        productSku: 'KJ-G-001',
        productName: 'Gold Ring 22K',
        productMetal: 'GOLD',
        productPurity: '22K',
        grossWeight: 3.6,
        weight: 3.5,
        metalRate: 7200,
        makingCharge: 1575,
        taxableAmount: 26775,
        lineTotal: 26775,
        hsnCode: '7113',
        huidCode: 'H12345'
      },
      {
        id: 202,
        productBarcode: 'G 0001B',
        productSku: 'KJ-G-002',
        productName: 'Gold Chain 22K',
        productMetal: 'GOLD',
        productPurity: '22K',
        grossWeight: 12.2,
        weight: 12.0,
        metalRate: 7200,
        makingCharge: 10368,
        taxableAmount: 96768,
        lineTotal: 96768,
        hsnCode: '7113',
        huidCode: 'H67890'
      }
    ],
    urdPurchase: null
  };

  const qr = invoiceQrPayload(editedSale);
  assert.match(qr, /KUSUM JEWELLERS - SALES INVOICE/);
  assert.match(qr, /Invoice: INV-20260903-EDITED/);
  assert.match(qr, /Customer: Aarav Sharma/);
  assert.match(qr, /Items:/);
  assert.match(qr, /1\. Gold Ring 22K - Net wt: 3\.500 g/);
  assert.match(qr, /2\. Gold Chain 22K - Net wt: 12\.000 g/);
  assert.match(qr, /Paid amount: Rs\. 1,00,000\.00/);
  assert.match(qr, /Balance \/ credit: Rs\. 26,690\.00/);

  // Verify PDF stream renders completely and validly
  const chunks = [];
  const fakeStream = new Writable({
    write(chunk, encoding, callback) {
      chunks.push(chunk);
      callback();
    }
  });
  fakeStream.setHeader = () => {};

  await new Promise((resolve, reject) => {
    fakeStream.on('finish', resolve);
    fakeStream.on('error', reject);
    writeSaleInvoice(fakeStream, editedSale).catch(reject);
  });

  const pdfBuffer = Buffer.concat(chunks);
  assert.ok(pdfBuffer.length > 500, 'PDF buffer should be non-empty');
  assert.equal(pdfBuffer.subarray(0, 5).toString('ascii'), '%PDF-', 'PDF file header should be %PDF-');
});

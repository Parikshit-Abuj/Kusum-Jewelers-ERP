function roundedMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

// A URD valuation can settle all or part of a sale.  When its value exceeds
// the invoice total, the excess is money owed back to the customer—not a
// negative sale payment and not customer credit owed to the shop.
function urdSettlement(total, urdValue) {
  const invoiceTotal = Math.max(0, roundedMoney(total));
  const valuation = Math.max(0, roundedMoney(urdValue));
  const saleAdjustment = roundedMoney(Math.min(invoiceTotal, valuation));
  const netPayable = roundedMoney(Math.max(0, invoiceTotal - valuation));
  const netRefundable = roundedMoney(Math.max(0, valuation - invoiceTotal));

  return {
    invoiceTotal,
    urdValue: valuation,
    saleAdjustment,
    netPayable,
    netRefundable,
    hasRefund: netRefundable > 0
  };
}

module.exports = { urdSettlement };

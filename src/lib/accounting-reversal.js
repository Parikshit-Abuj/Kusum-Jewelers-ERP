function roundedMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

const PAYMENT_COMPONENT_FIELDS = {
  CASH: 'cashPaid',
  UPI: 'upiPaid',
  CARD: 'cardPaid',
  BANK_TRANSFER: 'bankPaid'
};

function paymentMethodFromComponents(components, paid) {
  if (roundedMoney(paid) <= 0) return 'CREDIT';
  const active = Object.entries(components).filter(([, amount]) => roundedMoney(amount) > 0);
  const tracked = roundedMoney(active.reduce((sum, [, amount]) => sum + roundedMoney(amount), 0));
  if (active.length === 1 && Math.abs(tracked - roundedMoney(paid)) < 0.01) return active[0][0];
  return 'MIXED';
}

async function reverseSalePayment(tx, { saleId, amount, paymentMethod, createCreditEntry, note }) {
  const locked = await tx.$queryRaw`SELECT id FROM \`Sale\` WHERE id = ${saleId} FOR UPDATE`;
  if (!locked.length) return 0;

  const sale = await tx.sale.findUniqueOrThrow({ where: { id: saleId } });
  const reversed = roundedMoney(Math.min(Math.max(0, Number(sale.paid)), Math.max(0, Number(amount))));
  if (reversed <= 0) return 0;

  const components = {
    CASH: roundedMoney(sale.cashPaid),
    UPI: roundedMoney(sale.upiPaid),
    CARD: roundedMoney(sale.cardPaid),
    BANK_TRANSFER: roundedMoney(sale.bankPaid)
  };
  const componentField = PAYMENT_COMPONENT_FIELDS[paymentMethod];
  if (componentField) {
    const key = Object.entries(PAYMENT_COMPONENT_FIELDS).find(([, field]) => field === componentField)?.[0];
    components[key] = roundedMoney(Math.max(0, components[key] - reversed));
  }

  const nextPaid = roundedMoney(Math.max(0, Number(sale.paid) - reversed));
  const netPayable = roundedMoney(Math.max(0, Number(sale.total) - Number(sale.urdOffset)));
  const nextBalance = roundedMoney(Math.max(0, netPayable - nextPaid));
  await tx.sale.update({
    where: { id: sale.id },
    data: {
      paid: nextPaid,
      balance: nextBalance,
      cashPaid: components.CASH,
      upiPaid: components.UPI,
      cardPaid: components.CARD,
      bankPaid: components.BANK_TRANSFER,
      paymentMethod: paymentMethodFromComponents(components, nextPaid)
    }
  });

  // Payments taken while the sale was created have no PAYMENT_RECEIVED ledger
  // row. Reversing one creates the newly due customer balance explicitly.
  if (createCreditEntry && sale.customerId) {
    await tx.customerLedger.create({
      data: {
        customerId: sale.customerId,
        saleId: sale.id,
        type: 'SALE_CREDIT',
        amount: reversed,
        reference: sale.invoiceNumber,
        note: note || `Payment reversed from ${sale.invoiceNumber}`
      }
    });
  }
  return reversed;
}

async function reverseUrdPayment(tx, entry) {
  const locked = await tx.$queryRaw`SELECT id FROM \`UrdPurchase\` WHERE id = ${entry.urdPurchaseId} FOR UPDATE`;
  if (!locked.length) return;
  const purchase = await tx.urdPurchase.findUniqueOrThrow({ where: { id: entry.urdPurchaseId } });
  const nextPaid = roundedMoney(Math.max(0, Number(purchase.paid) - Number(entry.amount)));
  const remainingMethods = await tx.cashbookEntry.findMany({
    where: { urdPurchaseId: purchase.id, id: { not: entry.id } },
    select: { paymentMethod: true, amount: true }
  });
  const activeMethods = [...new Set(remainingMethods.filter((row) => Number(row.amount) > 0).map((row) => row.paymentMethod))];
  const paymentMethod = nextPaid <= 0 ? 'CREDIT' : activeMethods.length === 1 ? activeMethods[0] : 'MIXED';
  await tx.urdPurchase.update({ where: { id: purchase.id }, data: { paid: nextPaid, paymentMethod } });
}

async function reverseAndDeleteCashbookEntry(tx, entryId) {
  const locked = await tx.$queryRaw`SELECT id FROM \`CashbookEntry\` WHERE id = ${entryId} FOR UPDATE`;
  if (!locked.length) return { deleted: 0, affectedSales: [] };
  const entry = await tx.cashbookEntry.findUniqueOrThrow({
    where: { id: entryId },
    include: { ledgerEntries: true }
  });

  const affectedSales = new Set();
  if (entry.urdPurchaseId) await reverseUrdPayment(tx, entry);

  if (entry.saleId) {
    const reversed = await reverseSalePayment(tx, {
      saleId: entry.saleId,
      amount: entry.amount,
      paymentMethod: entry.paymentMethod,
      createCreditEntry: true,
      note: `Cashbook payment deleted · ${entry.description}`
    });
    if (reversed > 0) affectedSales.add(entry.saleId);
  }

  const saleAllocations = new Map();
  for (const ledger of entry.ledgerEntries) {
    if (ledger.type !== 'PAYMENT_RECEIVED' || !ledger.saleId || Number(ledger.amount) >= 0) continue;
    const key = `${ledger.saleId}:${ledger.paymentMethod || entry.paymentMethod}`;
    const current = saleAllocations.get(key) || { saleId: ledger.saleId, paymentMethod: ledger.paymentMethod || entry.paymentMethod, amount: 0 };
    current.amount = roundedMoney(current.amount + Math.abs(Number(ledger.amount)));
    saleAllocations.set(key, current);
  }
  for (const allocation of saleAllocations.values()) {
    const reversed = await reverseSalePayment(tx, { ...allocation, createCreditEntry: false });
    if (reversed > 0) affectedSales.add(allocation.saleId);
  }

  if (entry.syncLedger && !entry.saleId && entry.ledgerEntries.length === 0) {
    const expectedType = entry.type === 'IN' ? 'PAYMENT_RECEIVED' : 'ADJUSTMENT';
    const legacyCandidates = entry.customerId ? await tx.customerLedger.count({
      where: {
        customerId: entry.customerId,
        type: expectedType,
        ...(entry.reference
          ? { reference: entry.reference }
          : { note: entry.type === 'IN' ? `Payment via cashbook · ${entry.description}` : `Cashbook out · ${entry.description}` })
      }
    }) : 0;
    if (legacyCandidates > 0) {
      throw new Error('This older synchronized cashbook entry cannot be reversed safely because its original ledger link is ambiguous. Keep it, or restore a backup made before that entry.');
    }
  }

  await tx.customerLedger.deleteMany({ where: { cashbookEntryId: entry.id } });
  await tx.cashbookEntry.delete({ where: { id: entry.id } });
  return { deleted: 1, affectedSales: [...affectedSales] };
}

async function deleteSettledUrdPurchase(tx, purchase) {
  const descriptions = [
    `URD purchase — ${purchase.purchaseNumber}`,
    `URD payout — ${purchase.purchaseNumber}`
  ];
  // Linked entries cascade. The exact descriptions remove deterministic legacy
  // payout rows created before the relationship column existed.
  await tx.cashbookEntry.deleteMany({
    where: {
      OR: [
        { urdPurchaseId: purchase.id },
        { description: { in: descriptions } }
      ]
    }
  });
  await tx.urdPurchase.delete({ where: { id: purchase.id } });
}

async function cancelUrdPurchase(tx, purchaseId, cancelledAt = new Date()) {
  const locked = await tx.$queryRaw`SELECT id FROM \`UrdPurchase\` WHERE id = ${purchaseId} FOR UPDATE`;
  if (!locked.length) throw new Error('This URD purchase no longer exists.');
  const purchase = await tx.urdPurchase.findUniqueOrThrow({ where: { id: purchaseId } });
  if (purchase.cancelledAt) throw new Error('This URD purchase is already cancelled.');
  // A cancelled purchase must not remain in the cashbook as money paid out.
  // We keep the purchase itself for the dedicated cancelled-URD register.
  await tx.cashbookEntry.deleteMany({ where: { urdPurchaseId: purchaseId } });
  await tx.urdPurchase.update({ where: { id: purchaseId }, data: { cancelledAt } });
  return purchase;
}

async function cancelSale(tx, saleId, cancelledAt = new Date()) {
  const locked = await tx.$queryRaw`SELECT id FROM \`Sale\` WHERE id = ${saleId} FOR UPDATE`;
  if (!locked.length) throw new Error('This sales invoice no longer exists.');
  const sale = await tx.sale.findUniqueOrThrow({ where: { id: saleId }, include: { urdPurchase: true } });
  if (sale.cancelledAt) throw new Error('This sales invoice is already cancelled.');

  // Payment receipts posted after billing may be linked through the ledger.
  // Remove just their allocation to this cancelled bill. A receipt that was
  // shared with another invoice/loan remains intact for those other records.
  const linkedLedger = await tx.customerLedger.findMany({
    where: { saleId }, select: { id: true, cashbookEntryId: true }
  });
  const receiptIds = [...new Set(linkedLedger.map((row) => row.cashbookEntryId).filter(Boolean))];
  await tx.customerLedger.deleteMany({ where: { saleId } });
  await tx.cashbookEntry.deleteMany({ where: { saleId } });
  for (const cashbookEntryId of receiptIds) {
    const entry = await tx.cashbookEntry.findUnique({ where: { id: cashbookEntryId }, select: { id: true, saleId: true, syncLedger: true } });
    if (!entry || entry.saleId || !entry.syncLedger) continue;
    const allocationsLeft = await tx.customerLedger.count({ where: { cashbookEntryId } });
    if (allocationsLeft === 0) await tx.cashbookEntry.delete({ where: { id: cashbookEntryId } });
  }
  if (sale.urdPurchase) await cancelUrdPurchase(tx, sale.urdPurchase.id, cancelledAt);
  await tx.sale.update({ where: { id: saleId }, data: { cancelledAt } });
  return sale;
}

module.exports = {
  PAYMENT_COMPONENT_FIELDS,
  paymentMethodFromComponents,
  reverseAndDeleteCashbookEntry,
  deleteSettledUrdPurchase,
  cancelUrdPurchase,
  cancelSale
};

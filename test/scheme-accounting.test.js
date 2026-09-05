const test = require('node:test');
const assert = require('node:assert/strict');
const { reverseSchemeInstallmentPayment } = require('../src/lib/accounting-reversal');

test('deleting a linked scheme Cashbook receipt restores that installment and enrollment totals', async () => {
  const enrollment = {
    id: 7,
    status: 'COMPLETED',
    schemePlan: { durationMonths: 2 },
    totalPaid: 10000,
    installmentsPaid: 2
  };
  const installment = {
    id: 17, enrollmentId: 7, status: 'PAID', paidAmount: 5000,
    paymentDate: '2026-09-04', paymentMethod: 'UPI', cashbookEntryId: 45
  };
  let enrollmentUpdate;
  const tx = {
    $queryRaw: async () => [{ id: 1 }],
    schemeInstallment: {
      findUnique: async ({ where }) => {
        if (where.cashbookEntryId === 45) return { id: installment.id, enrollmentId: installment.enrollmentId };
        if (where.id === 17) return installment;
        return null;
      },
      findUniqueOrThrow: async () => installment,
      update: async ({ data }) => Object.assign(installment, data),
      aggregate: async () => ({ _sum: { paidAmount: 5000 } }),
      count: async () => 1
    },
    schemeEnrollment: {
      findUniqueOrThrow: async () => enrollment,
      update: async ({ data }) => { enrollmentUpdate = data; Object.assign(enrollment, data); }
    }
  };

  await reverseSchemeInstallmentPayment(tx, { id: 45 });

  assert.equal(installment.status, 'PENDING');
  assert.equal(installment.paidAmount, 0);
  assert.equal(installment.cashbookEntryId, null);
  assert.equal(enrollmentUpdate.totalPaid, 5000);
  assert.equal(enrollmentUpdate.installmentsPaid, 1);
  assert.equal(enrollmentUpdate.status, 'ACTIVE');
});

test('cashbook reversal does not reactivate a cancelled scheme', async () => {
  const enrollment = { id: 8, status: 'CANCELLED', schemePlan: { durationMonths: 2 } };
  const installment = { id: 18, enrollmentId: 8, status: 'PAID', paidAmount: 5000, cashbookEntryId: 46 };
  let enrollmentUpdate;
  const tx = {
    $queryRaw: async () => [{ id: 1 }],
    schemeInstallment: {
      findUnique: async ({ where }) => where.cashbookEntryId === 46 ? { id: 18, enrollmentId: 8 } : installment,
      findUniqueOrThrow: async () => installment,
      update: async ({ data }) => Object.assign(installment, data),
      aggregate: async () => ({ _sum: { paidAmount: 0 } }),
      count: async () => 0
    },
    schemeEnrollment: {
      findUniqueOrThrow: async () => enrollment,
      update: async ({ data }) => { enrollmentUpdate = data; }
    }
  };
  await reverseSchemeInstallmentPayment(tx, { id: 46 });
  assert.equal(enrollmentUpdate.status, 'CANCELLED');
});

test('reversing one part of a split scheme payment removes the full receipt and resets the installment', async () => {
  const enrollment = { id: 9, status: 'ACTIVE', schemePlan: { durationMonths: 3 } };
  const installment = {
    id: 19, enrollmentId: 9, status: 'PAID', paidAmount: 5000, paymentDate: '2026-09-05',
    paymentMethod: 'MIXED', cashbookEntryId: null,
    payments: [{ cashbookEntryId: 71 }, { cashbookEntryId: 72 }]
  };
  let deletedPaymentWhere;
  let deletedCashbookWhere;
  let enrollmentUpdate;
  const tx = {
    $queryRaw: async () => [{ id: 1 }],
    schemeInstallmentPayment: {
      findUnique: async ({ where }) => where.cashbookEntryId === 71 ? { id: 1, installmentId: 19 } : null,
      deleteMany: async ({ where }) => { deletedPaymentWhere = where; }
    },
    schemeInstallment: {
      findUnique: async ({ where }) => where.id === 19 ? { enrollmentId: 9 } : null,
      findUniqueOrThrow: async () => installment,
      update: async ({ data }) => Object.assign(installment, data),
      aggregate: async () => ({ _sum: { paidAmount: 0 } }),
      count: async () => 0
    },
    schemeEnrollment: {
      findUniqueOrThrow: async () => enrollment,
      update: async ({ data }) => { enrollmentUpdate = data; Object.assign(enrollment, data); }
    },
    cashbookEntry: {
      deleteMany: async ({ where }) => { deletedCashbookWhere = where; }
    }
  };

  await reverseSchemeInstallmentPayment(tx, { id: 71 });

  assert.deepEqual(deletedPaymentWhere, { installmentId: 19 });
  assert.deepEqual(deletedCashbookWhere, { id: { in: [72] } });
  assert.equal(installment.status, 'PENDING');
  assert.equal(installment.paidAmount, 0);
  assert.equal(enrollmentUpdate.status, 'ACTIVE');
});

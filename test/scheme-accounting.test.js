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

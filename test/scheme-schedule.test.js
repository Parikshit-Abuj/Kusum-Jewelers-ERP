const test = require('node:test');
const assert = require('node:assert/strict');
const {
  addCalendarMonths,
  createInstallmentSchedule,
  schemeEndDate,
  isFullInstallmentPayment
} = require('../src/lib/scheme-schedule');
const { dateInput } = require('../src/lib/helpers');

test('scheme schedule keeps the intended calendar day at month ends', () => {
  const schedule = createInstallmentSchedule(new Date(2026, 0, 31, 12), 3);
  assert.deepEqual(schedule, [
    { installmentNumber: 1, dueDate: '2026-01-31' },
    { installmentNumber: 2, dueDate: '2026-02-28' },
    { installmentNumber: 3, dueDate: '2026-03-31' }
  ]);
  assert.equal(dateInput(schemeEndDate(new Date(2026, 0, 31, 12), 3)), '2026-03-31');
});

test('scheme schedule handles February in a leap year', () => {
  assert.equal(dateInput(addCalendarMonths(new Date(2028, 0, 31, 12), 1)), '2028-02-29');
});

test('scheme payment must equal the saved monthly installment', () => {
  assert.equal(isFullInstallmentPayment(5000, 5000), true);
  assert.equal(isFullInstallmentPayment(5000.004, 5000), true);
  assert.equal(isFullInstallmentPayment(4999.99, 5000), false);
  assert.equal(isFullInstallmentPayment(0, 5000), false);
});

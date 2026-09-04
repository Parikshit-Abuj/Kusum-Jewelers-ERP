const { dateInput, localDateBoundary } = require('./helpers');

/**
 * Move a local calendar date by whole months without JavaScript's accidental
 * overflow (for example, 31 January must become 28/29 February, not March).
 */
function addCalendarMonths(value, months) {
  if (!Number.isInteger(months)) throw new Error('Scheme month offset must be a whole number.');
  const source = value instanceof Date ? new Date(value) : localDateBoundary(value);
  if (!Number.isFinite(source.getTime())) throw new Error('Choose a valid scheme start date.');

  const originalDay = source.getDate();
  const target = new Date(source.getFullYear(), source.getMonth(), 1, 12, 0, 0, 0);
  target.setMonth(target.getMonth() + months);
  const finalDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(originalDay, finalDay));
  return target;
}

function createInstallmentSchedule(startDate, durationMonths) {
  if (!Number.isInteger(durationMonths) || durationMonths < 1) {
    throw new Error('Scheme duration must be at least one month.');
  }
  return Array.from({ length: durationMonths }, (_, index) => ({
    installmentNumber: index + 1,
    dueDate: dateInput(addCalendarMonths(startDate, index))
  }));
}

function schemeEndDate(startDate, durationMonths) {
  if (!Number.isInteger(durationMonths) || durationMonths < 1) {
    throw new Error('Scheme duration must be at least one month.');
  }
  // The final scheduled installment is the scheme end date. A 12-month plan
  // starting on 10 January therefore ends on 10 December, not next January.
  return addCalendarMonths(startDate, durationMonths - 1);
}

function isFullInstallmentPayment(amount, monthlyAmount) {
  const paid = Math.round((Number(amount) || 0) * 100) / 100;
  const expected = Math.round((Number(monthlyAmount) || 0) * 100) / 100;
  return expected > 0 && Math.abs(paid - expected) < 0.01;
}

module.exports = {
  addCalendarMonths,
  createInstallmentSchedule,
  schemeEndDate,
  isFullInstallmentPayment
};

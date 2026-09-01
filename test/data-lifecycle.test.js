const test = require('node:test');
const assert = require('node:assert/strict');

const { dateInput, roundToNearestRupee } = require('../src/lib/helpers');
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

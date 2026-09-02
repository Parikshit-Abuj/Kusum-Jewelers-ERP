const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeTopSellingFilters, topSellingSummary } = require('../src/lib/top-selling-items');

test('keeps only supported Top Selling Items report filters', () => {
  assert.deepEqual(normalizeTopSellingFilters({ metal: 'gold', item: ' ring ', sortBy: 'value', sortOrder: 'asc' }), {
    metal: 'GOLD', item: 'ring', sortBy: 'VALUE', sortOrder: 'ASC'
  });
  assert.deepEqual(normalizeTopSellingFilters({ metal: 'PLATINUM', sortBy: 'name', sortOrder: 'sideways' }), {
    metal: '', item: '', sortBy: 'QUANTITY', sortOrder: 'DESC'
  });
});

test('summarises ranked items for report cards and Excel totals', () => {
  assert.deepEqual(topSellingSummary([
    { quantitySold: 3, netWeight: 12.5, salesValue: 90000 },
    { quantitySold: 2, netWeight: 4.25, salesValue: 25000 }
  ]), { itemTypes: 2, quantitySold: 5, netWeight: 16.75, salesValue: 115000 });
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { productSearchClauses, weightClause } = require('../src/lib/product-search-filters');

test('inventory filters compose item name, exact net weight and barcode with AND', () => {
  const clauses = productSearchClauses({ itemName: 'Ring', weight: '2.500', barcode: 'G 00001' });
  assert.equal(clauses.length, 3);
  assert.deepEqual(clauses[0], { name: { contains: 'Ring' } });
  assert.deepEqual(clauses[2], { netWeight: { gte: 2.4995, lte: 2.5005 } });
  assert.ok(clauses[1].OR.some((entry) => entry.barcode?.contains === 'G 00001'));
  assert.ok(clauses[1].OR.some((entry) => entry.sku?.contains === 'G-00001'));
});

test('invalid weight does not accidentally filter available stock', () => {
  assert.equal(weightClause('two grams'), null);
  assert.equal(weightClause(''), null);
});

test('URD Silver purity controls use manual input instead of preset Silver choices', () => {
  const files = [
    path.join(__dirname, '..', 'src', 'views', 'urd-purchases', 'form.ejs'),
    path.join(__dirname, '..', 'src', 'views', 'sales', 'form.ejs')
  ];
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /data-urd-purity-manual/);
    assert.doesNotMatch(source, /Silver 925|Pure Silver/);
  }
});

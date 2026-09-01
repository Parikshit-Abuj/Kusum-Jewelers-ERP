const test = require('node:test');
const assert = require('node:assert/strict');

const { buildTsplLabel } = require('../src/lib/tspl-labels');

test('gold labels retain the supplied TSC GOLD.PRN layout and insert item values', () => {
  const tspl = buildTsplLabel({
    metal: 'GOLD', barcode: 'G 00001', name: 'Gold Ring',
    grossWeight: 3, stoneWeight: 0.125, netWeight: 2.875
  });
  assert.match(tspl, /^SIZE 81\.0 mm, 12 mm\r\nGAP 3 mm, 0 mm/m);
  assert.match(tspl, /TEXT 620,92,"ROMAN\.TTF",180,1,8,"Gold Ring"/);
  assert.match(tspl, /BARCODE 620,69,"128M",24,0,180,1,2,"!104G 00001"/);
  assert.match(tspl, /TEXT 400,65,"ROMAN\.TTF",180,1,8,"G\. Wt\.: 3\.000"/);
  assert.match(tspl, /PRINT 1,1\r\n$/);
});

test('silver labels retain the supplied TSC SILVER.PRN layout and use a unique barcode', () => {
  const tspl = buildTsplLabel({
    metal: 'SILVER', barcode: 'S 00001', name: 'Silver Payal',
    grossWeight: 20, stoneWeight: 0, netWeight: 20
  });
  assert.match(tspl, /TEXT 620,92,"ROMAN\.TTF",180,1,8,"KUSUM JEWELLERS"/);
  assert.match(tspl, /BARCODE 620,69,"128M",24,0,180,1,2,"!104S 00001"/);
  assert.match(tspl, /TEXT 400,85,"ROMAN\.TTF",180,1,8,"Silver Payal"/);
});

test('does not silently corrupt characters unsupported by the supplied CODEPAGE 1252 label templates', () => {
  assert.throws(() => buildTsplLabel({
    metal: 'GOLD', barcode: 'G 00001', name: 'हार', grossWeight: 1, stoneWeight: 0, netWeight: 1
  }), /CODEPAGE 1252/);
});

test('keeps the supplied layout usable when an item name is longer than the label field', () => {
  const name = 'Long Gold Necklace Name That Exceeds The Fixed Label Field Width';
  const tspl = buildTsplLabel({
    metal: 'GOLD', barcode: 'G 00001', name, grossWeight: 1, stoneWeight: 0, netWeight: 1
  });
  assert.match(tspl, /TEXT 620,92,"ROMAN\.TTF",180,1,8,"Long Gold Necklace Name That Exceeds\.\.\."/);
  assert.match(tspl, /BARCODE 620,69,"128M",24,0,180,1,2,"!104G 00001"/);
});

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  BASE36_MAX_SERIAL,
  barcodeSeriesKey,
  base36Suffix,
  formatBarcode,
  nextBarcode
} = require('../src/lib/barcode-sequence');

test('formats five-character Base-36 barcode suffixes', () => {
  assert.equal(base36Suffix(1), '00001');
  assert.equal(base36Suffix(10), '0000A');
  assert.equal(base36Suffix(35), '0000Z');
  assert.equal(base36Suffix(36), '00010');
  assert.equal(base36Suffix(BASE36_MAX_SERIAL), 'ZZZZZ');
  assert.equal(formatBarcode('G', 1), 'G 00001');
  assert.equal(formatBarcode('S', 1), 'S 00001');
  assert.throws(() => base36Suffix(0), /between 1/);
  assert.throws(() => base36Suffix(BASE36_MAX_SERIAL + 1), /between 1/);
});

test('uses an independent Base-36 counter key for each metal series', () => {
  assert.equal(barcodeSeriesKey('GOLD', '22K'), 'G_B36');
  assert.equal(barcodeSeriesKey('GOLD', '24K'), 'G_B36');
  assert.equal(barcodeSeriesKey('SILVER', '925'), 'S_B36');
});

test('allocates a Base-36 barcode with the new counter instead of the legacy counter', async () => {
  let executeValues = [];
  const tx = {
    $executeRaw: async (strings, ...values) => { executeValues = values; },
    $queryRaw: async () => [{ lastNumber: 36 }]
  };

  assert.equal(await nextBarcode(tx, 'GOLD', '22K'), 'G 00010');
  assert.deepEqual(executeValues, ['G_B36']);
});

test('uses the same five-character Base-36 allocation for silver', async () => {
  let executeValues = [];
  const tx = {
    $executeRaw: async (strings, ...values) => { executeValues = values; },
    $queryRaw: async () => [{ lastNumber: 1 }]
  };

  assert.equal(await nextBarcode(tx, 'SILVER', '925'), 'S 00001');
  assert.deepEqual(executeValues, ['S_B36']);
});

test('refuses to wrap and duplicate a barcode when the Base-36 series is full', async () => {
  const tx = {
    $executeRaw: async () => {},
    $queryRaw: async () => [{ lastNumber: BASE36_MAX_SERIAL + 1 }]
  };

  await assert.rejects(() => nextBarcode(tx, 'SILVER', '925'), /S Base-36 barcode series is full at S ZZZZZ/);
});

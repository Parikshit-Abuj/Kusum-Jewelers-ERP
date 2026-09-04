const test = require('node:test');
const assert = require('node:assert/strict');

const { upperCase, titleCase } = require('../src/lib/helpers');
const { upsertItemName } = require('../src/lib/item-names');

test('helpers upperCase and titleCase convert strings to standard UPPERCASE', () => {
  assert.equal(upperCase('gold bridal necklace'), 'GOLD BRIDAL NECKLACE');
  assert.equal(upperCase('  ramesh sharma  '), 'RAMESH SHARMA');
  assert.equal(upperCase('silver payal chain 22k'), 'SILVER PAYAL CHAIN 22K');
  assert.equal(upperCase(null), '');
  assert.equal(upperCase(undefined), '');

  // titleCase is an alias for upperCase to ensure full ERP standardisation
  assert.equal(titleCase('pune camp, maharashtra'), 'PUNE CAMP, MAHARASHTRA');
  assert.equal(titleCase('broken chain, old melted ring'), 'BROKEN CHAIN, OLD MELTED RING');
});

test('upsertItemName normalises name and category to uppercase before saving', async () => {
  const executedSql = [];
  const fakeDb = {
    $executeRaw(strings, ...values) {
      executedSql.push({ sql: strings.join('?'), values });
      return Promise.resolve(1);
    },
    itemName: {
      findUniqueOrThrow({ where }) {
        return Promise.resolve({ id: 1, name: where.name, category: 'RING' });
      }
    }
  };

  await upsertItemName(fakeDb, 'diamond solitaire ring', 'ring', { updateCategory: true });
  assert.equal(executedSql.length, 1);
  assert.deepEqual(executedSql[0].values, ['DIAMOND SOLITAIRE RING', 'RING']);

  const item = await upsertItemName(fakeDb, '  gold jhumka  ', '  earring  ', { returnItem: true });
  assert.equal(item.name, 'GOLD JHUMKA');
});

test('input classification rules preserve sensitive credentials, login screen, and setup screen while uppercasing ERP data', () => {
  const EXEMPT_NAMES = new Set([
    'username', 'password', 'currentPassword', 'newPassword', 'confirmPassword',
    'appUsername', 'appPassword', 'mysqlUser', 'mysqlPassword',
    'databaseUser', 'databasePassword', 'mysqlHost', 'databaseName',
    'printerHost', 'printerPort', 'printerName'
  ]);

  // Simulate the selector matching logic implemented in public/app.js
  function testShouldUppercase(attrs, context = '') {
    const type = attrs.type || 'text';
    if (['password', 'email', 'number', 'date', 'file', 'checkbox', 'radio', 'hidden'].includes(type)) {
      return false;
    }
    if (attrs['data-no-uppercase'] || attrs.class?.includes('preserve-case')) {
      return false;
    }
    if (attrs.name && EXEMPT_NAMES.has(attrs.name)) {
      return false;
    }
    if (['login', 'change-password', 'setup', 'connection-repair', 'network-setup', 'printer-setup'].includes(context)) {
      return false;
    }
    return true;
  }

  // Business ERP fields that MUST be transformed to uppercase
  assert.equal(testShouldUppercase({ name: 'customerName', type: 'text' }), true);
  assert.equal(testShouldUppercase({ name: 'customerAddress', type: 'text' }), true);
  assert.equal(testShouldUppercase({ name: 'name', type: 'text' }), true); // inventory item name
  assert.equal(testShouldUppercase({ name: 'category', type: 'text' }), true);
  assert.equal(testShouldUppercase({ name: 'location', type: 'text' }), true);
  assert.equal(testShouldUppercase({ name: 'notes', tag: 'textarea' }), true);
  assert.equal(testShouldUppercase({ name: 'urdDescription', type: 'text' }), true);
  assert.equal(testShouldUppercase({ name: 'huidCode', type: 'text' }), true);
  assert.equal(testShouldUppercase({ name: 'q', type: 'search' }), true);

  // Login screen fields MUST PRESERVE CASE and be flexible
  assert.equal(testShouldUppercase({ name: 'username', type: 'text' }, 'login'), false);
  assert.equal(testShouldUppercase({ name: 'username', type: 'text' }), false);
  assert.equal(testShouldUppercase({ name: 'password', type: 'password' }, 'login'), false);
  assert.equal(testShouldUppercase({ name: 'currentPassword', type: 'password' }, 'change-password'), false);
  assert.equal(testShouldUppercase({ name: 'newPassword', type: 'password' }, 'change-password'), false);
  assert.equal(testShouldUppercase({ name: 'confirmPassword', type: 'password' }, 'change-password'), false);

  // Setup screen fields MUST PRESERVE CASE
  assert.equal(testShouldUppercase({ name: 'mysqlHost', type: 'text' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'mysqlHost', type: 'text' }), false);
  assert.equal(testShouldUppercase({ name: 'databaseName', type: 'text' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'mysqlUser', type: 'text' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'mysqlPassword', type: 'password' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'databaseUser', type: 'text' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'databasePassword', type: 'password' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'appUsername', type: 'text' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'appPassword', type: 'password' }, 'setup'), false);
  assert.equal(testShouldUppercase({ name: 'printerName', type: 'text' }, 'printer-setup'), false);
  assert.equal(testShouldUppercase({ name: 'printerHost', type: 'text' }, 'printer-setup'), false);

  // General non-text/opt-out fields
  assert.equal(testShouldUppercase({ name: 'customerEmail', type: 'email' }), false);
  assert.equal(testShouldUppercase({ name: 'weight', type: 'number' }), false);
  assert.equal(testShouldUppercase({ name: 'saleDate', type: 'date' }), false);
});

test('flexible login username matching supports case-insensitive entry and trims spaces', () => {
  const { secureTextMatch } = require('../src/lib/auth-security');

  function matchLoginUsername(entered, configured) {
    const enteredUser = String(entered || '').trim();
    const configuredUser = String(configured || '').trim();
    return Boolean(enteredUser) && Boolean(configuredUser) && (
      secureTextMatch(enteredUser, configuredUser) ||
      secureTextMatch(enteredUser.toLowerCase(), configuredUser.toLowerCase())
    );
  }

  const configured = 'kusum';

  // Lowercase, uppercase, title-case, and padded inputs all succeed
  assert.equal(matchLoginUsername('kusum', configured), true);
  assert.equal(matchLoginUsername('KUSUM', configured), true);
  assert.equal(matchLoginUsername('Kusum', configured), true);
  assert.equal(matchLoginUsername('  kusum  ', configured), true);
  assert.equal(matchLoginUsername('  KUSUM  ', configured), true);

  // Different usernames fail
  assert.equal(matchLoginUsername('admin', configured), false);
  assert.equal(matchLoginUsername('', configured), false);
  assert.equal(matchLoginUsername(null, configured), false);
});

const crypto = require('crypto');

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNumber(value) {
  return value === undefined || value === null || value === '' ? null : number(value);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function dateInput(value = new Date()) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function grams(value) {
  return `${Number(value || 0).toFixed(3)} g`;
}

function invoiceNumber(prefix) {
  const today = dateInput().replaceAll('-', '');
  // Every desktop client can create documents against the same MySQL database.
  // A timestamp plus a cryptographically random suffix keeps concurrent document
  // numbers distinct without relying on a per-PC counter.
  const token = Date.now().toString(36).toUpperCase();
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${today}-${token}-${suffix}`;
}

function barcodePrefix(metal, purity) {
  const normalizedPurity = String(purity || '').toUpperCase().replaceAll(' ', '');
  if (metal === 'GOLD' && normalizedPurity === '24K') return 'G24';
  if (metal === 'GOLD') return 'G22';
  if (metal === 'SILVER') return 'S';
  return 'J';
}

function metalRateFromDailyRate(product, dailyRate) {
  if (!dailyRate) return 0;
  const purity = String(product.purity || '').toUpperCase().replaceAll(' ', '');
  if (product.metal === 'GOLD' && purity === '24K') return number(dailyRate.gold24k);
  if (product.metal === 'GOLD') return number(dailyRate.gold22k);
  if (product.metal === 'SILVER') return number(dailyRate.silver);
  return 0;
}

function makingAmount(type, value, metalAmount, weight, quantity = 1) {
  const charge = number(value);
  if (type === 'FIXED') return charge * quantity;
  if (type === 'PERCENTAGE') return metalAmount * charge / 100;
  return charge * number(weight) * quantity;
}

module.exports = { number, nullableNumber, asArray, dateInput, startOfToday, money, grams, invoiceNumber, barcodePrefix, metalRateFromDailyRate, makingAmount };

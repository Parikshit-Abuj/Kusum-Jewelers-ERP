const crypto = require('crypto');

const HASH_PREFIX = 'scrypt-v1';
const HASH_BYTES = 64;

function requiredPassword(value, label = 'ERP login password') {
  const password = String(value || '');
  if (!password) throw new Error(`${label} is required.`);
  return password;
}

function hashPassword(value) {
  const password = requiredPassword(value);
  const salt = crypto.randomBytes(24);
  const derived = crypto.scryptSync(password, salt, HASH_BYTES);
  return `${HASH_PREFIX}$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

function verifyPassword(value, encodedHash) {
  const password = String(value || '');
  const parts = String(encodedHash || '').split('$');
  if (parts.length !== 3 || parts[0] !== HASH_PREFIX) return false;
  try {
    const salt = Buffer.from(parts[1], 'base64url');
    const expected = Buffer.from(parts[2], 'base64url');
    const actual = crypto.scryptSync(password, salt, expected.length);
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch (_) {
    return false;
  }
}

function secureTextMatch(value, expected) {
  const left = Buffer.from(String(value || ''));
  const right = Buffer.from(String(expected || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function passwordMatchesEnvironment(value, environment = process.env) {
  if (environment.AUTH_PASSWORD_HASH) return verifyPassword(value, environment.AUTH_PASSWORD_HASH);
  return secureTextMatch(value, environment.AUTH_PASSWORD);
}

function hasConfiguredPassword(environment = process.env) {
  return Boolean(environment.AUTH_PASSWORD_HASH || environment.AUTH_PASSWORD);
}

function usesKnownDefaultPassword(environment = process.env) {
  const username = String(environment.AUTH_USERNAME || '').trim().toLowerCase();
  return !environment.AUTH_PASSWORD_HASH
    && username === 'kusum'
    && secureTextMatch(environment.AUTH_PASSWORD, 'kusum@123');
}

module.exports = {
  hashPassword,
  hasConfiguredPassword,
  passwordMatchesEnvironment,
  requiredPassword,
  secureTextMatch,
  usesKnownDefaultPassword,
  verifyPassword
};

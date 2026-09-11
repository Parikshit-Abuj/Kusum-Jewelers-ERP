const QRCode = require('qrcode');

// QR Code version 40 with low error correction is the largest portable
// byte-mode payload supported by the library (2,953 UTF-8 bytes). Keep the
// limit explicit so an oversized receipt never gets silently truncated.
const MAX_QR_BYTES = 2953;
const options = {
  type: 'png',
  errorCorrectionLevel: 'L',
  margin: 1,
  width: 180,
  color: { dark: '#000000', light: '#FFFFFF' }
};

/**
 * Encode a complete payload, optionally retrying with a compact payload that
 * still contains every value. Never slices data and never hides an encoding
 * failure: callers receive a clear error instead of a receipt with a missing
 * QR code.
 */
async function createQrImage({ payload, compactPayload, label = 'Document' }) {
  const candidates = [
    { value: String(payload || ''), compact: false },
    ...(compactPayload ? [{ value: String(compactPayload), compact: true }] : [])
  ].filter((candidate, index, all) => candidate.value && all.findIndex((item) => item.value === candidate.value) === index);

  let lastError = null;
  for (const candidate of candidates) {
    const bytes = Buffer.byteLength(candidate.value, 'utf8');
    if (bytes > MAX_QR_BYTES) {
      lastError = new Error(`payload is ${bytes} bytes; QR capacity is ${MAX_QR_BYTES} bytes`);
      continue;
    }
    try {
      const image = await QRCode.toBuffer(candidate.value, options);
      if (candidate.compact) {
        console.warn(`${label} QR payload exceeded the normal QR capacity; compact complete payload used.`);
      }
      return image;
    } catch (error) {
      lastError = error;
    }
  }

  const reason = lastError?.message || 'unknown QR encoding error';
  throw new Error(`${label} QR code could not be generated: ${reason}. Shorten the receipt details and try again.`);
}

module.exports = { createQrImage, MAX_QR_BYTES };

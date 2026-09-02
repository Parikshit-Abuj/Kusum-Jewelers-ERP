function searchText(value) {
  return String(value || '').trim();
}

function barcodeVariants(value) {
  const barcode = searchText(value);
  if (!barcode) return [];
  return [...new Set([
    barcode,
    barcode.replace(/-/g, ' '),
    barcode.replace(/\s+/g, '-'),
    barcode.replace(/[\s-]+/g, ''),
    barcode.replace(/^([A-Za-z]+)(\d.*)$/, '$1 $2'),
    barcode.replace(/^([A-Za-z]+\d+)\s*([A-Za-z0-9]+)$/, '$1 $2')
  ])].filter(Boolean);
}

function weightClause(value) {
  const text = searchText(value).replace(/\s*(?:g|gm|gms|gram|grams)\s*$/i, '');
  if (!text) return null;
  if (!/^\d+(?:\.\d{1,3})?$/.test(text)) return null;
  const weight = Number(text);
  if (!Number.isFinite(weight) || weight < 0) return null;
  // Jewellery stock weights are saved to three decimals. This keeps a typed
  // value an exact weight filter without floating-point comparison errors.
  return { netWeight: { gte: weight - 0.0005, lte: weight + 0.0005 } };
}

function productSearchClauses({ itemName, weight, barcode } = {}) {
  const clauses = [];
  const name = searchText(itemName);
  const barcodeMatches = barcodeVariants(barcode);
  const exactWeight = weightClause(weight);
  if (name) clauses.push({ name: { contains: name } });
  if (barcodeMatches.length) {
    clauses.push({ OR: barcodeMatches.flatMap((value) => [
      { barcode: { contains: value } },
      { sku: { contains: value } }
    ]) });
  }
  if (exactWeight) clauses.push(exactWeight);
  return clauses;
}

module.exports = { searchText, barcodeVariants, weightClause, productSearchClauses };

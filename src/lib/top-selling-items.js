const { Prisma } = require('@prisma/client');

const TOP_SELLING_METALS = ['GOLD', 'SILVER'];
const TOP_SELLING_SORTS = ['QUANTITY', 'WEIGHT', 'VALUE'];
const TOP_SELLING_ORDERS = ['DESC', 'ASC'];

function normalizeTopSellingFilters(source = {}) {
  const metal = String(source.metal || '').trim().toUpperCase();
  const sortBy = String(source.sortBy || 'QUANTITY').trim().toUpperCase();
  const sortOrder = String(source.sortOrder || 'DESC').trim().toUpperCase();
  return {
    metal: TOP_SELLING_METALS.includes(metal) ? metal : '',
    item: String(source.item || '').trim(),
    sortBy: TOP_SELLING_SORTS.includes(sortBy) ? sortBy : 'QUANTITY',
    sortOrder: TOP_SELLING_ORDERS.includes(sortOrder) ? sortOrder : 'DESC'
  };
}

function queryFilters({ from, to, metal, item }) {
  const itemLike = item ? `%${item}%` : null;
  return {
    date: Prisma.sql`s.saleDate >= ${from} AND s.saleDate <= ${to}`,
    metal: metal
      ? Prisma.sql`AND si.productMetal = ${metal}`
      : Prisma.sql`AND si.productMetal IN ('GOLD', 'SILVER')`,
    item: itemLike
      ? Prisma.sql`AND (si.productName LIKE ${itemLike} OR si.productPurity LIKE ${itemLike})`
      : Prisma.empty
  };
}

function orderBy(sortBy, sortOrder) {
  const metric = {
    QUANTITY: Prisma.raw('quantitySold'),
    WEIGHT: Prisma.raw('netWeight'),
    VALUE: Prisma.raw('salesValue')
  }[sortBy];
  return { metric, direction: Prisma.raw(sortOrder) };
}

function mapRow(row) {
  return {
    itemName: row.itemName || 'Jewellery item',
    metal: row.metal || '',
    purity: row.purity || '',
    invoiceCount: Number(row.invoiceCount || 0),
    quantitySold: Number(row.quantitySold || 0),
    netWeight: Number(row.netWeight || 0),
    salesValue: Number(row.salesValue || 0)
  };
}

async function countTopSellingItems(db, source) {
  const filters = normalizeTopSellingFilters(source);
  const conditions = queryFilters({ ...source, ...filters });
  const rows = await db.$queryRaw`
    SELECT COUNT(*) AS total
    FROM (
      SELECT 1
      FROM \`SaleItem\` si
      INNER JOIN \`Sale\` s ON s.id = si.saleId
      WHERE s.cancelledAt IS NULL
        AND ${conditions.date}
        ${conditions.metal}
        ${conditions.item}
      GROUP BY
        COALESCE(NULLIF(si.productName, ''), 'Jewellery item'),
        COALESCE(si.productMetal, 'OTHER'),
        COALESCE(si.productPurity, '')
    ) AS rankedItems
  `;
  return Number(rows?.[0]?.total || 0);
}

async function listTopSellingItems(db, source, { skip = 0, take = 100 } = {}) {
  const filters = normalizeTopSellingFilters(source);
  const conditions = queryFilters({ ...source, ...filters });
  const sorting = orderBy(filters.sortBy, filters.sortOrder);
  const rows = await db.$queryRaw`
    SELECT
      COALESCE(NULLIF(si.productName, ''), 'Jewellery item') AS itemName,
      COALESCE(si.productMetal, 'OTHER') AS metal,
      COALESCE(si.productPurity, '') AS purity,
      COUNT(DISTINCT si.saleId) AS invoiceCount,
      SUM(si.quantity) AS quantitySold,
      SUM(si.weight * si.quantity) AS netWeight,
      SUM(si.lineTotal) AS salesValue
    FROM \`SaleItem\` si
    INNER JOIN \`Sale\` s ON s.id = si.saleId
    WHERE s.cancelledAt IS NULL
      AND ${conditions.date}
      ${conditions.metal}
      ${conditions.item}
    GROUP BY
      COALESCE(NULLIF(si.productName, ''), 'Jewellery item'),
      COALESCE(si.productMetal, 'OTHER'),
      COALESCE(si.productPurity, '')
    ORDER BY ${sorting.metric} ${sorting.direction}, itemName ASC, purity ASC
    LIMIT ${take} OFFSET ${skip}
  `;
  return rows.map(mapRow);
}

async function summarizeTopSellingItems(db, source) {
  const filters = normalizeTopSellingFilters(source);
  const conditions = queryFilters({ ...source, ...filters });
  const rows = await db.$queryRaw`
    SELECT
      COUNT(*) AS itemTypes,
      COALESCE(SUM(quantitySold), 0) AS quantitySold,
      COALESCE(SUM(netWeight), 0) AS netWeight,
      COALESCE(SUM(salesValue), 0) AS salesValue
    FROM (
      SELECT
        SUM(si.quantity) AS quantitySold,
        SUM(si.weight * si.quantity) AS netWeight,
        SUM(si.lineTotal) AS salesValue
      FROM \`SaleItem\` si
      INNER JOIN \`Sale\` s ON s.id = si.saleId
      WHERE s.cancelledAt IS NULL
        AND ${conditions.date}
        ${conditions.metal}
        ${conditions.item}
      GROUP BY
        COALESCE(NULLIF(si.productName, ''), 'Jewellery item'),
        COALESCE(si.productMetal, 'OTHER'),
        COALESCE(si.productPurity, '')
    ) AS rankedItems
  `;
  const row = rows?.[0] || {};
  return {
    itemTypes: Number(row.itemTypes || 0),
    quantitySold: Number(row.quantitySold || 0),
    netWeight: Number(row.netWeight || 0),
    salesValue: Number(row.salesValue || 0)
  };
}

function topSellingSummary(rows) {
  return rows.reduce((summary, row) => ({
    itemTypes: summary.itemTypes + 1,
    quantitySold: summary.quantitySold + Number(row.quantitySold || 0),
    netWeight: summary.netWeight + Number(row.netWeight || 0),
    salesValue: summary.salesValue + Number(row.salesValue || 0)
  }), { itemTypes: 0, quantitySold: 0, netWeight: 0, salesValue: 0 });
}

module.exports = {
  TOP_SELLING_METALS,
  TOP_SELLING_SORTS,
  TOP_SELLING_ORDERS,
  normalizeTopSellingFilters,
  countTopSellingItems,
  listTopSellingItems,
  summarizeTopSellingItems,
  topSellingSummary
};

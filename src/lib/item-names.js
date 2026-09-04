/**
 * MySQL's native insert-or-update statement is safe when several counter PCs
 * register the same item name at once. Prisma's application-level upsert can
 * otherwise race on a newly created unique name.
 */
async function upsertItemName(db, name, category, { updateCategory = true, returnItem = false } = {}) {
  const cleanName = String(name || '').trim().toUpperCase();
  const cleanCategory = String(category || '').trim().toUpperCase();
  if (updateCategory) {
    await db.$executeRaw`
      INSERT INTO \`ItemName\` (\`name\`, \`category\`)
      VALUES (${cleanName}, ${cleanCategory})
      ON DUPLICATE KEY UPDATE \`category\` = VALUES(\`category\`)
    `;
  } else {
    await db.$executeRaw`
      INSERT INTO \`ItemName\` (\`name\`, \`category\`)
      VALUES (${cleanName}, ${cleanCategory})
      ON DUPLICATE KEY UPDATE \`id\` = \`id\`
    `;
  }
  // Inventory callers are inside a transaction that may have an earlier
  // repeatable-read snapshot. They only need the atomic registration, not a
  // follow-up read which may not yet see another transaction's inserted row.
  return returnItem ? db.itemName.findUniqueOrThrow({ where: { name: cleanName } }) : null;
}

module.exports = { upsertItemName };

const { PrismaClient } = require('@prisma/client');

function createPrisma() {
  return new PrismaClient();
}

module.exports = { createPrisma };

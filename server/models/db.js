const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'info',
    }
  ]
});

module.exports = prisma
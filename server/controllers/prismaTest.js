const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getTokensPrisma(req,res) {
  const allTokens = await prisma.token.findMany()
  console.log(allTokens)
}

module.exports = {
  getTokensPrisma,
}

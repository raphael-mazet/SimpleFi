const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getTokensPrisma(req,res) {
  const allTokens = await prisma.token.findMany({
    where: {
      tokenId: {
        in: ['2f996b90-d62b-4b79-a153-495dbdc728c0', '4c2be9cb-03a4-492f-8e4c-1fd9ced2b41e', 'c607a06b-7277-4336-bf2c-aec65fe3f64a']
      }

    }
  })
  console.log(allTokens)
}

module.exports = {
  getTokensPrisma,
}

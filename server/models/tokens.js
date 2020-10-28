const prisma = require('./db');
const path = require ('path');

async function getTokens() {
  try {
    const tokens = await prisma.token.findMany();
    return tokens;
  } catch(err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  } 
  finally {
    (async () => {await prisma.$disconnect()})();
  }
}

async function selectUserFieldTokens(queryStr) {
  try {
    const tokens = await prisma.token.findMany({
      where: {
        tokenId: {
          in: queryStr
        }
      }
    })
    return tokens;
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  } 
  finally {
    (async () => {await prisma.$disconnect()})();
  }
}

module.exports = {
  getTokens,
  selectUserFieldTokens
}
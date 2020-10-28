// const pool = require ('./pool');
// const path = require ('path');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getTokens() {
  try {
    const tokens = await prisma.token.findMany();
    return tokens;
  } catch(err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  }
}

// async function getTokens () {
//   try {
//     const tokens = await pool.query('select * from token');
//     return tokens.rows;

//   } catch (err) {
//     console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
//   } 
// }

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
}

// async function selectUserFieldTokens(queryStr) {
//   try {
//     const tokens = await pool.query(`select * from token where ${queryStr}`);
//     console.log(' ---> tokens.rows', tokens.rows);
//     return tokens.rows;
//   } catch (err) {
//     console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
//   }
// }

module.exports = {
  getTokens,
  selectUserFieldTokens
}
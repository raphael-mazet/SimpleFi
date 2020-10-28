const { PrismaClient } = require("@prisma/client");
const path = require ('path');

const prisma = new PrismaClient();

async function getFields() {
  try {
    const fields = await prisma.field.findMany();
    return fields;
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  }
}

module.exports = {
  getFields,
}
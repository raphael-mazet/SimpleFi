const prisma = require('./db');
const path = require ('path');

async function getFields() {
  try {
    const fields = await prisma.field.findMany();
    return fields;
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  }
  finally {
    (async () => {await prisma.$disconnect()})();
  }
}

module.exports = {
  getFields,
}
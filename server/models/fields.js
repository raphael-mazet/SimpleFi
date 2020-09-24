const pool = require ('./pool');
const path = require ('path');

async function getFields () {
  try {
    const fields = await pool.query('select * from field');
    return fields.rows;
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  } 
}

module.exports = {
  getFields,
}
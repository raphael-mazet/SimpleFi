const { Pool } = require ('pg');
const password = require ('../../config/.config.js')

const pool = new Pool ({
  user: 'raph',
  host: 'localhost',
  database: 'simplefi_db',
  password: password,
  port: 5432
});

module.exports = pool;
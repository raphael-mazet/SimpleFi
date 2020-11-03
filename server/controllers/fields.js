const Fields = require ('../models/fields');
const path = require('path');

async function getFields (req, res) {
  try {
    const fields = await Fields.getFields();
    res.status = 200;
    res.send(fields);
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
    res.sendStatus(500);
  }
} 

async function getFieldWithReceiptToken (req, res) {
  try {
    receiptToken = req.params.receiptToken;
    const field = await Fields.getFieldWithReceiptToken(receiptToken);
    res.status = 200;
    res.send(field);
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getFields,
  getFieldWithReceiptToken
}
const Token = require('../models/tokens');
const path = require('path')

async function getTokens (req, res) {
  try {
    const tokens = await Token.find();
    res.status(200);
    res.send(tokens);

  } catch (O_0) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${O_0}`);
    res.sendStatus(500)
  }
}

async function createToken (req, res) {
  try {
    const {name, date, price} = req.body;
    const newToken = await Token.create({
      name,
      price_bought: [{date, price}]
    });
    res.status(201);
    res.send(newToken);
  } catch (O_o) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${O_o}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getTokens,
  createToken,
}
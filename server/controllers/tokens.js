const Token = require('../models/tokens');
const path = require('path')

async function getTokens (req, res) {
  try {
    const tokens = await Token.find();
    res.status(200);
    res.send(tokens);

  } catch (o_O) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${o_O}`);
    res.sendStatus(500)
  }
}

//TODO: implement logic on client side to ensure coingecko token_id valid
async function createToken (req, res) {
  try {
    const {name, apiId, date, bought, price, amount} = req.body;
    const newToken = await Token.create({
      name,
      apiId,
      transactions: [{date, bought, price, amount}]
    });
    res.status(201);
    res.send(newToken);
  } catch (o_O) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${o_O}`);
    res.sendStatus(500);
  }
}

async function deleteOne (req, res) {
  try {
    const { _id } = req.params;
    await Token.findByIdAndDelete(_id);
    res.sendStatus(204);

  } catch (o_O) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${o_O}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getTokens,
  createToken,
  deleteOne,
}
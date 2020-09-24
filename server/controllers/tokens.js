const Tokens = require ('../models/tokens');
const path = require('path')
const helpers = require('./helpers');

async function getTokens (req, res) {
  try {
    const tokens = await Tokens.getTokens();
    res.status = 200;
    res.send(tokens);
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
    res.sendStatus(500);
  }
} 

async function selectUserFieldTokens (req, res) {
  try {
    let {seedTokens, cropTokens} = req.body;
    seedTokens = await Tokens.selectUserFieldTokens(helpers.generateFieldTokenQuery(seedTokens));
    cropTokens = await Tokens.selectUserFieldTokens(helpers.generateFieldTokenQuery(cropTokens));
    res.status = 200;
    res.send({seedTokens, cropTokens})
  } catch(err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getTokens,
  selectUserFieldTokens
}
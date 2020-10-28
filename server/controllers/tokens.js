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

async function getUserFieldTokens (req, res) {
  try {
    tokenIds = JSON.parse(req.params.tokenIds)
    const {seedTokens, cropTokens} = tokenIds;
    const seedTokenQuery = helpers.generateFieldTokenQuery(seedTokens)
    const cropTokenQuery = helpers.generateFieldTokenQuery(cropTokens)
    const returnedTokens = {};

    if (seedTokenQuery.length) {
      const returnedSeed = await Tokens.selectUserFieldTokens(seedTokenQuery);
      returnedTokens.seedTokens = returnedSeed;
    }
    if (cropTokenQuery.length) {
      returnedCrop = await Tokens.selectUserFieldTokens(cropTokenQuery);
      returnedTokens.cropTokens = returnedCrop;
    }
    if (Object.keys(returnedTokens).length) {
      res.status = 200;
      res.send(returnedTokens);
    } else {
      res.sendStatus(204);
    }

  } catch(err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getTokens,
  getUserFieldTokens,
}
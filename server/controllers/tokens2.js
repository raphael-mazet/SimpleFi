const Tokens = require ('../models/tokens2');

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

module.exports = {
  getTokens,
}
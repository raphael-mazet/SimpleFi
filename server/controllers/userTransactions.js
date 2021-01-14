const Apis = require('../apis/userTransactions');

async function getUserTransactions(req, res) {
  try {
    const address = req.params.address;
    const userTokenTransactions = await Apis.getUserTokenTransactions(address);
    const userNormalTransactions = await Apis.getUserNormalTransactions(address);
    res.status = 200;
    res.send({userTokenTransactions, userNormalTransactions});
  } catch (err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
    res.sendStatus(500);
  }
}

module.exports = {
  getUserTransactions
}
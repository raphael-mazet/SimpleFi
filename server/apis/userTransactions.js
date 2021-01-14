const path = require ('path');
const fetchRequest = require('./fetchRequest');

const etherscanTokenTxEP = "https://api.etherscan.io/api?module=account&action=tokentx&address=";
const etherscanNormalTxEP = "https://api.etherscan.io/api?module=account&action=txlist&address=";
const etherscanAPI = '&apikey=' + process.env.ETHERSCAN_API_KEY;

async function getUserTokenTransactions(address) {
  try {
    const userTransactions = await fetchRequest(etherscanTokenTxEP + address + etherscanAPI);
    return userTransactions;
  } catch(err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  }
}

async function getUserNormalTransactions(address) {
  try {
    const userTransactions = await fetchRequest(etherscanNormalTxEP + address + etherscanAPI);
    return userTransactions;
  } catch(err) {
    console.error(`Error at ${path.basename(__dirname)}/${path.basename(__filename)} ${err}`);
  }
}

module.exports = {
  getUserTokenTransactions,
  getUserNormalTransactions
}
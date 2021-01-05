import fetchRequest from '../fetchRequest';
//TODO: set .env
import { ETHERSCAN_API_KEY } from '../.apiEnv.js';

const etherscanTokenTxEP = "https://api.etherscan.io/api?module=account&action=tokentx&address=";
const etherscanNormalTxEP = "https://api.etherscan.io/api?module=account&action=txlist&address=";
const etherscanAPI = '&apikey=' + ETHERSCAN_API_KEY;

async function getUserTokenTransactions(address) {
  const userTransactions = await fetchRequest(etherscanTokenTxEP + address + etherscanAPI);
  return userTransactions;
}

async function getUserNormalTransactions(address) {
  const userTransactions = await fetchRequest(etherscanNormalTxEP + address + etherscanAPI);
  return userTransactions;
}

export {
  getUserTokenTransactions,
  getUserNormalTransactions
}
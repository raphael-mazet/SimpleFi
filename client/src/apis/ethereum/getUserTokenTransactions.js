import fetchRequest from '../fetchRequest';
//TODO: set .env
import { ETHERSCAN_API_KEY } from '../.apiEnv.js';

const etherscanEP = "https://api.etherscan.io/api?module=account&action=tokentx&address=";
const etherscanAPI = '&apikey=' + ETHERSCAN_API_KEY;

async function getUserTokenTransactions(address) {
  const userTransactions = await fetchRequest(etherscanEP + address + etherscanAPI);
  return userTransactions;
}

export default getUserTokenTransactions;
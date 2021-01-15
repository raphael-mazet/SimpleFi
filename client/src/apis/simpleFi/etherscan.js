import fetchRequest from '../fetchRequest';
import {baseUrl, userTxEP} from './simpleFiEPs';
// TODO: add this requirement to Github documentation

async function getUserTransactions(address){
  const userTransactions = await fetchRequest(baseUrl + userTxEP + '/' + address);
  return userTransactions;
}

export {
  getUserTransactions,
}
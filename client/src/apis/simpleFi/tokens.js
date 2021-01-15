import fetchRequest from '../fetchRequest';
import {baseUrl, tokensEP, fieldTokensEP} from './simpleFiEPs';

function  getTokens () {
  return fetchRequest(baseUrl + tokensEP);
}

async function getUserFieldTokens (tokenIds) {
  tokenIds = JSON.stringify(tokenIds)
  return await fetchRequest(`${baseUrl}${fieldTokensEP}/${tokenIds}`)
}

export {
  getTokens,
  getUserFieldTokens
}
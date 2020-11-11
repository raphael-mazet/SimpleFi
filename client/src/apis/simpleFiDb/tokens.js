import fetchRequest from '../fetchRequest';

const baseUrl = 'http://localhost:3020';
const tokensEP = '/tokens';
const fieldTokensEP = '/userfieldtokens'

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
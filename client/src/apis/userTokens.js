import fetchRequest from './fetchRequest';

const baseUrl = 'http://localhost:3020';
const tokenEP = '/mytokens';

function  getTokens () {
  return fetchRequest(baseUrl + tokenEP);
}

export default {
  getTokens,
}
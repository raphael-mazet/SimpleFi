import fetchRequest from '../fetchRequest';

const baseUrl = 'http://localhost:3020';
const tokenEP = '/tokens';

function  getTokens () {
  return fetchRequest(baseUrl + tokenEP);
}

export {
  getTokens,
}
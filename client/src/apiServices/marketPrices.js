import fetchRequest from './fetchRequest';

const baseUrl = 'https://api.coingecko.com/api/v3';
const priceEP = '/coins/';

function  getPrice (tokenId) {
  return fetchRequest(baseUrl + priceEP + tokenId);
}

export default {
  getPrice,
}
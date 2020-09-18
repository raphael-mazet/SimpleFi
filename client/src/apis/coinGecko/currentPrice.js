import fetchRequest from '../fetchRequest';

const baseUrl = 'https://api.coingecko.com/api/v3';
const priceEP = '/coins/';

//TODO: check if this is recovering currPrice
function  currentPrice (tokenId) {
  return fetchRequest(baseUrl + priceEP + tokenId)
    // .then(token => console.log(' ---> token', token))
    .then(token => token.market_data.current_price.usd)
}

export {
  currentPrice,
}
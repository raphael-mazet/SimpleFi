import fetchRequest from '../fetchRequest';

const baseUrl = 'https://api.coingecko.com/api/v3';
const priceEP = '/coins/';
const manyPriceEP = '/simple/price?ids='

function  currentPrice (tokenId) {
  return fetchRequest(baseUrl + priceEP + tokenId)
    .then(token => token.market_data.current_price.usd)
}

function  manyPrices (tokenIds) {
  tokenIds = tokenIds.replace(/,/g, '%2C')
  return fetchRequest(baseUrl + manyPriceEP + tokenIds+ "&vs_currencies=usd%2Ceur")
}

export {
  currentPrice,
  manyPrices
}
import fetchRequest from '../fetchRequest';
import supportedCurrencies from './supportedCurrencies'

const baseUrl = 'https://api.coingecko.com/api/v3';
const priceEP = '/coins/';
const manyPriceEP = '/simple/price?ids=';
const currencyString = "&vs_currencies=" + supportedCurrencies.join('%2C');

function currentPrice (tokenId) {
  return fetchRequest(baseUrl + priceEP + tokenId)
    .then(token => token.market_data.current_price.usd)
}

function manyPrices (tokenIds) {
  tokenIds = tokenIds.replace(/,/g, '%2C')
  return fetchRequest(baseUrl + manyPriceEP + tokenIds + currencyString);
}

//eslint-disable-next-line import/no-anonymous-default-export
export default {
  currentPrice,
  manyPrices
}
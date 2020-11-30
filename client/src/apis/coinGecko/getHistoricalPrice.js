import fetchRequest from '../fetchRequest';
import {baseUrl, priceEP, history} from './geckoEndPoints';

/**
 * @param {uuid} tokenId - db Id of currently analysed token
 * @param {String} date - date formatted for a historical price query to coingecko
 * @dev same end point can be used for other historical market data provided by coinGecko
 * @return {Object} - token price on day specified
 */

const priceCache = [];

function getHistoricalPrice (tokenId, date) {
  const preExisting = priceCache.find(cached => cached.tokenId === tokenId && cached.date === date);
  if (preExisting) {
    return preExisting.data;
  }
  else return fetchRequest(baseUrl + priceEP + tokenId + history + date)
    .then(token => {
      const data = token.market_data.current_price.usd;
      priceCache.push({tokenId, date, data})
      return data;
    })
}

export default getHistoricalPrice;
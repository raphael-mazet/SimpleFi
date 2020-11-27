import fetchRequest from '../fetchRequest';
import supportedCurrencies from './supportedCurrencies';
import {baseUrl, priceEP, history} from './geckoEndPoints';

//@dev: same end point can be used for other mhistorical market data
//TODO: add a cache to this
const priceCache = [];

function getHistoricalPrice (tokenId, date) {
  const preExisting = priceCache.find(cached => cached.tokenId === tokenId && cached.date === date);
  if (preExisting) {
    // console.log(' ---> preExisting', preExisting);
    return preExisting.data;
  }
  else return fetchRequest(baseUrl + priceEP + tokenId + history + date)
    .then(token => {
      // console.log(' ---> token', token);
      const data = token.market_data.current_price.usd;
      priceCache.push({tokenId, date, data})
      return data;
    })
}

export default getHistoricalPrice;
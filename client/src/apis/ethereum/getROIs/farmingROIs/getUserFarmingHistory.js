import { getOneCurveHistReceiptPrice } from './getCurveFarmingPriceHistory';
import getHistoricalPrice from '../../../coinGecko/getHistoricalPrice';
import helpers from '../../../../helpers';


//@dev: assumes there is one deposit and one withdrawal address for all cropTokens
//@dev: assume that there is never a receipt token for staking
async function getUserFarmingHistory(field, userTokenTransactions, trackedFields) {
  const timeFormatter = new Intl.DateTimeFormat('en-GB');

  // @dev: farmingTxs = [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Value}]
  const farmingTxs = helpers.sortFarmingTxs(field, userTokenTransactions);

  for (let tx of farmingTxs) {
    //add historical prices of reward claims
    if (tx.cropToken) {
      const geckoDateFormat = timeFormatter.format(new Date(Number(tx.tx.timeStamp) * 1000)).replace(/\//gi, '-');
      const histTokenPrice = await getHistoricalPrice (tx.priceApi, geckoDateFormat);
      tx.pricePerToken = histTokenPrice;
    }
    //add historical prices of (un)staking transactions
    else {
      switch (field.protocol.name) {
        case 'Curve':
          tx.pricePerToken = await getOneCurveHistReceiptPrice(tx, trackedFields);
          break;
    
        //TODO: SNX staking field and Meta staking field
        default: 
      }
    }
  }

  //@dev: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Value, pricePerToken}]
  return farmingTxs;
}

export default getUserFarmingHistory;
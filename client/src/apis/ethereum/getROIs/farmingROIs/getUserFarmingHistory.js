import { getOneCurveHistReceiptPrice } from './getCurveFarmingPriceHistory';
import getOneUniswapHistReceiptPrice from './getUniswapFarmingPriceHistory';
import getHistoricalPrice from '../../../coinGecko/getHistoricalPrice';
import helpers from '../../../../helpers';

/**
 * 
 * @param {Object} field - currently analysed farming field
 * @param {Array} userTokenTransactions - all user ERC20 transactions
 * @param {Array} trackedFields - all fields tracked by SimpleFi
 * @return {Array} - an array of objects containing :{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Amount, pricePerToken}
 * @dev - in sortFarmingTxs():
 *          Presence of a receipt token indicates that the tx is a staking or unstaking transaction, and corresponds to the presence of an (un)stakingAmount property
 *          Presence of a cropToken means that the user claimed a reward and corresponds to the presence of a rewardAmount property)
 *      - in getHistoricalPrice(): assumes all crop tokens are base (and have a coinGecko price api code)
 */
async function getUserFarmingHistory(field, userTokenTransactions, trackedFields, userAccount) {
  const timeFormatter = new Intl.DateTimeFormat('en-GB');

  //@dev: farmingTxs = [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Value}]
  const farmingTxs = helpers.sortFarmingTxs(field, userTokenTransactions);

  for (let tx of farmingTxs) {
    //add historical prices of reward claims
    if (tx.cropToken) {
      const geckoDateFormat = timeFormatter.format(new Date(Number(tx.tx.timeStamp) * 1000)).replace(/\//gi, '-');
      const histTokenPrice = await getHistoricalPrice (tx.priceApi, geckoDateFormat);
      tx.txDate = new Date(Number(tx.tx.timeStamp) * 1000);
      tx.pricePerToken = histTokenPrice;
    }
    //add historical prices of (un)staking transactions based on field issuing the receipt token used as this farming field's seed
    else {
      switch (tx.receiptToken.protocol.name) {
        //CHECK: does this work properly with pure SNX staking?
        case 'Curve':
          // tx.pricePerToken = await getOneCurveHistReceiptPrice(tx, trackedFields);
          const curvePriceAndDate = await getOneCurveHistReceiptPrice(tx, trackedFields);
          tx.pricePerToken = curvePriceAndDate.pricePerToken;
          tx.txDate = curvePriceAndDate.txDate;
          break;
          
          case 'Uniswap':
            tx.pricePerToken = await getOneUniswapHistReceiptPrice(tx, userAccount);
            const uniswapPriceAndDate = await getOneUniswapHistReceiptPrice(tx, userAccount);
            tx.pricePerToken = uniswapPriceAndDate.histPricePerToken;
            tx.txDate = uniswapPriceAndDate.txDate;
            break;
    
        default: 
      }
      
    }
  }

  //@dev: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Value, pricePerToken, txDate}]
  return farmingTxs;
}

export default getUserFarmingHistory;
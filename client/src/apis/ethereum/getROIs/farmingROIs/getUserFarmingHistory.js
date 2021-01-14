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
 *          Presence of a cropToken means that the user claimed a reward and corresponds to the presence of a rewardAmount property)
 *          receiptToken is present in all tx types ((un)staking and reward claims)
 *      - in getHistoricalPrice(): assumes all crop tokens are base (and have a coinGecko price api code)
 */
async function getUserFarmingHistory(field, userTokenTransactions, userNormalTransactions, trackedFields, userAccount) {
  const timeFormatter = new Intl.DateTimeFormat('en-GB');

  //@dev: farmingTxs = [{tx, receiptToken, [cropToken,] [priceApi,] [reward | staking | unstaking]Amount}]
  const farmingTxs = helpers.sortFarmingTxs(field, userTokenTransactions, userNormalTransactions);

  for (let tx of farmingTxs) {

    // add hist. price of the reward claim tx
    if (tx.cropToken) {
      const geckoDateFormat = timeFormatter.format(new Date(Number(tx.tx.timeStamp) * 1000)).replace(/\//gi, '-');
      const histTokenPrice = await getHistoricalPrice (tx.priceApi, geckoDateFormat);
      tx.txDate = new Date(Number(tx.tx.timeStamp) * 1000);
      tx.pricePerToken = histTokenPrice;
    }
      //CHECK: does this work properly with pure SNX staking?
      /* add historical prices of (un)staking transactions based on field issuing the receipt token used as this farming field's seed
         and price of the receipt token in case of a rewards claim for use in the Farming Field Details page
      */
      let receiptTokenPriceAndDate;
      switch (field.seedTokens[0].protocol.name) {
        case 'Curve':
          const {receiptToken} = tx;
          const txTimestamp = tx.tx.timeStamp;
          receiptTokenPriceAndDate = await getOneCurveHistReceiptPrice(receiptToken, txTimestamp, trackedFields);
          break;
          
        case 'Uniswap':
          const txBlockNumber = tx.tx.blockNumber;
          receiptTokenPriceAndDate = await getOneUniswapHistReceiptPrice(txBlockNumber, userAccount);
          break;
    
        default: 
      }

      if (tx.cropToken) {
        tx.pricePerReceiptToken = receiptTokenPriceAndDate.pricePerToken;
      } else {
        tx.pricePerToken = receiptTokenPriceAndDate.pricePerToken;
        tx.txDate = receiptTokenPriceAndDate.txDate;
      }

  }

  //@dev: [{tx, receiptToken, [cropToken,] txDate, [reward | staking | unstaking]Amount, pricePerToken, [pricePerReceiptToken,] [priceApi]}]
  return farmingTxs;
}

export default getUserFarmingHistory;
import getHistoricalPrice from '../../../coinGecko/getHistoricalPrice';
import { getOneCurvePoolRawData } from '../../protocolQueries';

/**
 * 
 * @param {Object} tx - currently analysed user ERC20 transaction fetched from Etherscan
 * @param {Array} trackedFields - all SimpleFi tracked fields
 * @dev - this getter fetches the full history of daily balances and supplies from the Curve API
 *        
 * @return {Object} - returns a historical price per token and a formatted txDate (important for display in field details tx table)
 */
async function getOneCurveHistReceiptPrice(tx, trackedFields) {
  //@dev: assumes that Curve staking/farming fields only have one seed token
  //TEST: field.seedTokens[0] and tx.receiptToken should be the same
  const targetEarnField = trackedFields.find(trackedField => trackedField.receiptToken === tx.receiptToken.tokenId)
  const historicalCurveStats = await getOneCurvePoolRawData(targetEarnField.name);
  const timeFormatter = new Intl.DateTimeFormat('en-GB');
  const txDate = new Date(Number(tx.tx.timeStamp) * 1000);
  const compDate = timeFormatter.format(txDate);
  const historicalStat = historicalCurveStats.find(day => compDate === timeFormatter.format(new Date(Number(day.timestamp) * 1000)));
  const geckoDateformat = compDate.replace(/\//gi, '-');
  
  let fieldHistReserveValue = 0;

  for (let seed of targetEarnField.seedTokens) {
    const histSeedValue = await getHistoricalPrice(seed.priceApi, geckoDateformat);
    //CHECK: handle error in case no seed index (some seeds only added later to contract and are not present in old raw stats)
    const decimaledReserve = historicalStat.balances[seed.seedIndex]/Number(`1e${seed.tokenContract.decimals}`);
    fieldHistReserveValue += histSeedValue * decimaledReserve;
  }

  const pricePerToken = fieldHistReserveValue / (historicalStat.supply / Number(`1e${tx.receiptToken.tokenContract.decimals}`));
  return {pricePerToken, txDate};
}


async function getCurveHistReceiptPrices (field, receiptToken, userReceiptTokenTxs) {
  const historicalCurveStats = await getOneCurvePoolRawData(field.name);
  const timeFormatter = new Intl.DateTimeFormat('en-GB');

  const txHistoryWithPrices = userReceiptTokenTxs.map(async tx => {
    const txDate = new Date(Number(tx.timeStamp) * 1000);
    const compDate = timeFormatter.format(txDate);
    const historicalStat = historicalCurveStats.find(day => compDate === timeFormatter.format(new Date(Number(day.timestamp) * 1000)));

    const geckoDateformat = compDate.replace(/\//gi, '-')
    let fieldHistReserveValue = 0;

    for (let seed of field.seedTokens) {
      const histSeedValue = await getHistoricalPrice(seed.priceApi, geckoDateformat);
      const decimaledReserve = historicalStat.balances[seed.seedIndex]/Number(`1e${seed.tokenContract.decimals}`);
      fieldHistReserveValue += histSeedValue * decimaledReserve;
    }
       //TODO: check impact of split admin fees and use of virtual price
    const pricePerToken = fieldHistReserveValue / (historicalStat.supply / Number(`1e${receiptToken.tokenContract.decimals}`));
    return {tx, receiptToken, pricePerToken, txDate}
  })

  return txHistoryWithPrices;
}

export {
  getOneCurveHistReceiptPrice,
  getCurveHistReceiptPrices
}

// export default getCurveHistStakingPrice;
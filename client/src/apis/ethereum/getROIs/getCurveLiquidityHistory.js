import { getOneCurvePoolRawData } from '../protocolQueries';
import getHistoricalPrice from '../../coinGecko/getHistoricalPrice';
import helpers from '../../../helpers';

async function getCurveLiquidityHistory(field, receiptToken, userReceiptTokenTxs, userAccount, whitelist) {
  const timeFormatter = new Intl.DateTimeFormat('en-GB');
  const historicalCurveStats = await getOneCurvePoolRawData(field.name);
  
  const liquidityHistory = userReceiptTokenTxs.map(async tx => {
    const txDate = new Date(Number(tx.timeStamp) * 1000);
    //formatted to find corresponding date in curve data dump
    const compDate = timeFormatter.format(new Date(Number(tx.timeStamp) * 1000));
    const historicalStat = historicalCurveStats.find(day => compDate === timeFormatter.format(new Date(Number(day.timestamp) * 1000)));

    const geckoDateformat = compDate.replace(/\//gi, '-')
    let fieldHistReserveValue = 0;
    for (let seed of field.seedTokens) {
      const histSeedValue = await getHistoricalPrice (seed.priceApi, geckoDateformat);
      //TODO: check getting the right price for seedIndex;
      const decimaledReserve = historicalStat.balances[seed.seedIndex]/Number(`1e${seed.tokenContract.decimals}`);
      fieldHistReserveValue += histSeedValue * decimaledReserve;
    }
    const pricePerToken = fieldHistReserveValue / (historicalStat.supply / Number(`1e${receiptToken.tokenContract.decimals}`));
    const {txIn, txOut, staked, unstaked} = helpers.sortLiquidityTxs(tx, userAccount, whitelist);

    return {tx, txDate, pricePerToken, txIn, txOut, staked, unstaked}
  })

  return liquidityHistory;
}

export default getCurveLiquidityHistory;


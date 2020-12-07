import { getUniswapBalanceHistory } from '../../protocolQueries';
import helpers from '../../../../helpers';

async function getUniswapLiquidityHistory (field, userReceiptTokenTxs, userAccount, whitelist) {

  const rawData = await getUniswapBalanceHistory(userAccount);
  const fieldBalanceHistory = rawData.data.liquidityPositionSnapshots.filter(snapshot => snapshot.pair.id === field.contractAddresses[0].address.toLowerCase());

  const liquidityHistory = userReceiptTokenTxs.map(tx => {
    const txDate = new Date(Number(tx.timeStamp) * 1000);
    const targetSnapshot = fieldBalanceHistory.find(snapshot => tx.blockNumber === snapshot.block.toString());
    const pricePerToken = Number(targetSnapshot.reserveUSD) / Number(targetSnapshot.liquidityTokenTotalSupply);
    const {txIn, txOut, staked, unstaked} = helpers.sortLiquidityTxs(tx, userAccount, whitelist);
    return {tx, txDate, pricePerToken, txIn, txOut, staked, unstaked}
  })

  return liquidityHistory;
}

export default getUniswapLiquidityHistory;

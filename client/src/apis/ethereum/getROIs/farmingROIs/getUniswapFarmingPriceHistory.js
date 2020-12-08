import { getUniswapBalanceHistory } from "../../protocolQueries";

async function getOneUniswapHistReceiptPrice (tx, userAccount) {
  const rawData = await getUniswapBalanceHistory(userAccount);
  const targetBlock = rawData.data.liquidityPositionSnapshots.find(data => data.block === Number(tx.tx.blockNumber));
  const histPricePerToken = Number(targetBlock.reserveUSD) / Number(targetBlock.liquidityTokenTotalSupply);
  
  return histPricePerToken;
}

export default getOneUniswapHistReceiptPrice;
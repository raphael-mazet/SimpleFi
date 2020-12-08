import { getUniswapBalanceHistory } from "../../protocolQueries";

/**
 * @param {Object} tx - currently analysed user ERC20 transaction (fetched from Etherscan)
 * @param {String} userAccount
 * @dev - this assumes that the data from the Graph on the user's Uniswap balances will always match Etherscan's user ERC20 tx data
 *        (it should as the Graph records balance changes on block within which user staked/unstaked the receipt token)
 * @return {Number} - price of the uniswap receipt token at the time of the transaction
 */
async function getOneUniswapHistReceiptPrice (tx, userAccount) {
  const rawData = await getUniswapBalanceHistory(userAccount);
  const targetBlock = rawData.data.liquidityPositionSnapshots.find(data => data.block === Number(tx.tx.blockNumber));
  const histPricePerToken = Number(targetBlock.reserveUSD) / Number(targetBlock.liquidityTokenTotalSupply);
  
  return histPricePerToken;
}

export default getOneUniswapHistReceiptPrice;
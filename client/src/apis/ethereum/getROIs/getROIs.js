import getUserLiquidityHistory from './getUserLiquidityHistory';
import helpers from '../../../helpers';

//TODO: uniswap: double-check everything, indices, decimals, txs, returns, shitty Promise.alls, etc.
/**
 * 
 * @param {String} userAccount user's Eth account
 * @param {Array} userFields user's earning and farming fields
 * @param {Array} trackedFields all tracked fields
 * @param {Array} userTokenTransactions all user ERC20 transactions (pulled from Etherscan)
 * @param {Array} trackedTokens all tracked tokens
 * @return {Array} userFields with added ROI, user transaction history and current value of investment
 */
async function getROIs(userAccount, userFields, trackedFields, userTokenTransactions, trackedTokens) {

  const fieldsWithROI = [...userFields];

  for (let field of fieldsWithROI) {

    let currInvestmentValue = field.unstakedUserInvestmentValue;
    if (field.stakedBalance) {
      currInvestmentValue += field.stakedBalance.reduce((acc, curr) => acc + curr.userInvestmentValue, 0);
    }

    if (field.isEarning) {
      const receiptToken = trackedTokens.find(trackedToken => trackedToken.tokenId === field.receiptToken);
      const userReceiptTokenTxs = userTokenTransactions.filter(tx => tx.contractAddress === receiptToken.address.toLowerCase());
      
      const userLiquidityHistory = await getUserLiquidityHistory(trackedFields, field, receiptToken, userReceiptTokenTxs, userAccount);
      if (userLiquidityHistory) {
        Promise.all(userLiquidityHistory)
          .then(liquidityHistory => {
            field.investmentValue = currInvestmentValue;
            field.userTxHistory = liquidityHistory;
            field.allTimeROI = helpers.calcROI(currInvestmentValue, liquidityHistory);
          })
      }
    }
  }
  return fieldsWithROI;
}

export default getROIs;
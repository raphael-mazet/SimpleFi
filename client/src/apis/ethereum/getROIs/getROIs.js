import getUserLiquidityHistory from './getUserLiquidityHistory';

//TODO: double-check everything, indices, decimals, txs, returns, shitty Promise.alls, etc.
//TODO: add documentation
//TODO: add sBTC
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
      console.log(' ---> field.name', field.name);
      console.log(' ---> userLiquidityHistory', userLiquidityHistory);
      if (userLiquidityHistory) {
        Promise.all(userLiquidityHistory)
          .then(liquidityHistory => {
            field.investmentValue = currInvestmentValue;
            field.userTxHistory = liquidityHistory;
            field.allTimeROI = calcROI(currInvestmentValue, liquidityHistory);
          })
      }
    }
  }
  return fieldsWithROI;
}


function calcROI (investmentValue, txHistory) {
  let amountInvested = 0;
  let amountRealised = 0;
  console.log(' ---> txHistory', txHistory);

  txHistory.forEach(tx => {
    const { txIn, txOut, pricePerToken } = tx;
    if (txIn || txOut) {
      txIn ? amountInvested += txIn * pricePerToken : amountRealised += txOut * pricePerToken
    }
  })
  console.log(' ---> investmentValue', investmentValue);
  console.log(' ---> amountRealised', amountRealised);
  console.log(' ---> amountInvested', amountInvested);
  return ((investmentValue + amountRealised) / amountInvested) - 1;    
}

export default getROIs;
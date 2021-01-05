/** 
 * @param {Array} userTokens - all tokens the user currently holds either directly or indirectly (via a field)
 * @param {Array} tokenPrices - current price in fiat of user tokens
 * @param {Object} field - currently analysed field from which are extracted the user's field transactions
 * @dev - the term "value" refers to fiat value. "Amount" refers to actual token amount
 * @return {Object} - all data used for presentation in field details page, incl.
 *                      - ROI(%)
 *                      - return value($)
 *                      - avg historical investment value ($)
 *                      - breakdown of (un)claimed tokens
 */
function calcFarmingROI (userTokens, tokenPrices, field) {
  const {cropTokens, fieldId} = field;
  const unclaimed = {};
  const claimed = {}; //claimed value is calculated based on token price at that date (no calc of what it's worth today if user held onto it)
  //used to record the amount of time an investment was made for
  //currentInv.amount not currently used in calcs, but may be at a later date
  const currentInv = {value: 0, amount: 0, dateStart: null};
  const weightedInvestments =[];

    //userTx shape: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Amount, pricePerToken}]
    field.userFarmingTxHistory.forEach(userTx => {
    const { rewardAmount, stakingAmount, unstakingAmount, pricePerToken} = userTx;

    if (rewardAmount) {
      if (!claimed[userTx.cropToken.name]) {
        claimed[userTx.cropToken.name] = {amountClaimed: 0, valueClaimed: 0};
      }
        claimed[userTx.cropToken.name].amountClaimed += rewardAmount;
        claimed[userTx.cropToken.name].valueClaimed += rewardAmount * pricePerToken;

    } else if (stakingAmount) {
      if (currentInv.value) {
        const stakedTime = userTx.txDate - currentInv.dateStart;
        weightedInvestments.push({amount: currentInv.amount, value: currentInv.value, stakedTime});
      }
        currentInv.value += stakingAmount * pricePerToken;
        currentInv.amount += stakingAmount;
        currentInv.dateStart = userTx.txDate;
 
    } else if (unstakingAmount) {
      const stakedTime = userTx.txDate - currentInv.dateStart;
      weightedInvestments.push({amount: currentInv.amount, value: currentInv.value, stakedTime});
      
      //set currentInv value to 0 if it's just dust in dollar terms
      if ((currentInv.value - (unstakingAmount * pricePerToken)) < 1) {
        currentInv.value = 0;
        currentInv.amount = 0;
        currentInv.dateStart = null;
      } else {
        currentInv.value -= unstakingAmount * pricePerToken;
        currentInv.amount -= unstakingAmount;
        currentInv.dateStart = userTx.txDate;
      }
    }
  })
  
  //set any current investment as having lasted till today's date
  if (currentInv.value) {
    const stakedTime = new Date() - currentInv.dateStart;
    weightedInvestments.push({amount: currentInv.amount, value: currentInv.value, stakedTime});
  }

  //determine avg historical investment value based on relative amount of time each incremental investment was made for
  const reducedInvestmentWeights = weightedInvestments.reduce((acc, curr) => {
    acc.investments += curr.value * curr.stakedTime;
    acc.totalTime += curr.stakedTime;
    return acc;
  }, {investments: 0, totalTime: 0});
  const avgInvestment = reducedInvestmentWeights.investments / reducedInvestmentWeights.totalTime;

  const targetCropTokens = userTokens.filter(userToken => {
    return cropTokens.some(cropToken => cropToken.tokenId === userToken.tokenId);
  });

  //set aggregate amount of unclaimed tokens and value based on today's token price
  targetCropTokens.forEach(token => {
      unclaimed[token.name] = token.unclaimedBalance.reduce((acc, curr) => {
        if (curr.field.fieldId === fieldId) {
          acc.amountUnclaimed += curr.balance;
          acc.valueUnclaimed += curr.balance * tokenPrices[token.name].usd;
        }
        return acc;
    }, {amountUnclaimed: 0, valueUnclaimed: 0})
  })
  claimed.totalValue = Object.values(claimed).reduce((acc, curr) => acc + curr.valueClaimed, 0);
  unclaimed.totalValue = Object.values(unclaimed).reduce((acc, curr) => acc + curr.valueUnclaimed, 0);

  const absReturnValue = unclaimed.totalValue + claimed.totalValue;
  const allTimeROI = absReturnValue / avgInvestment;
  
  return {allTimeROI, absReturnValue, unclaimed, claimed, avgInvestment}
}

export default calcFarmingROI;
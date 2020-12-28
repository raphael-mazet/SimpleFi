//FIXME: documentation and comments incorrect
//FIXME: clean up commented out code
/**
 * 
 * @param {Number} investmentValue - current value of investment in analysed field
 * @param {Array} txHistory - pre-sorted list of user interactions with analysed field
 * @return {Number} - user ROI to date with regards to the analysed field, defined as:
 *                    (current investment value + sum of realised exits [txOut]) / sum of historical investments [txIn]
 */
function calcFarmingROI (txHistory, userTokens, tokenPrices, field) {
  const {cropTokens, fieldId} = field;
  //registers value at time of claim only - assume return is realised at that moment (no calc of what it's worth today if user held onto it)
  let amountClaimed = 0;
  let valueClaimed = 0;
  let amountUnclaimed = 0;
  let valueUnclaimed = 0;
  const unclaimed = {};
  const claimed = {};
  //used to record the amount of time an investment was made for (value indicates value in $. Amount indicates token amount (un)staked)
  //currentInv.amount not currently used in calcs, but may be at a later date
  const currentInv = {value: 0, amount: 0, dateStart: null};
  const weightedInvestments =[];

  //@dev: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Amount, pricePerToken}]
  //txHistory.forEach(userTx => {
    //TODO: delete above
    field.userFarmingTxHistory.forEach(userTx => {
    const { rewardAmount, stakingAmount, unstakingAmount, pricePerToken} = userTx;
    if (rewardAmount) {
      if (claimed[userTx.cropToken.name]) {
        claimed[userTx.cropToken.name].amountClaimed += rewardAmount;
        claimed[userTx.cropToken.name].valueClaimed += rewardAmount * pricePerToken;
      } else {
        claimed[userTx.cropToken.name] = {amountClaimed: 0, valueClaimed: 0};
        claimed[userTx.cropToken.name].amountClaimed += rewardAmount;
        claimed[userTx.cropToken.name].valueClaimed += rewardAmount * pricePerToken;
      }
      // amountClaimed += rewardAmount;
      // valueClaimed += rewardAmount * pricePerToken;
    } else if (stakingAmount) {
      if (currentInv.value) {
        const stakedTime = userTx.txDate - currentInv.dateStart;
        weightedInvestments.push({amount: currentInv.amount, value: currentInv.value, stakedTime});
      }
        currentInv.value += stakingAmount * pricePerToken;
        currentInv.amount += stakingAmount;
        currentInv.dateStart = userTx.txDate;
      // valueInvested += stakingAmount * pricePerToken;
    } else if (unstakingAmount) {
      const stakedTime = userTx.txDate - currentInv.dateStart;
      weightedInvestments.push({amount: currentInv.amount, value: currentInv.value, stakedTime});
      //set currentInv value to 0 if it's just dust
      if ((currentInv.value - (unstakingAmount * pricePerToken)) < 1) {
        currentInv.value = 0;
        currentInv.amount = 0;
        currentInv.dateStart = null;
      } else {
        currentInv.value -= unstakingAmount * pricePerToken;
        currentInv.amount -= unstakingAmount;
        currentInv.dateStart = userTx.txDate;
      }
      // valueRealised += unstakingAmount * pricePerToken;
    }
  })
  
  //set any outstanding investment as having lasted till today's date
  if (currentInv.value) {
    const stakedTime = new Date() - currentInv.dateStart;
    weightedInvestments.push({amount: currentInv.amount, value: currentInv.value, stakedTime});
  }
  const reducedInvestmentWeights = weightedInvestments.reduce((acc, curr) => {
    acc.investments += curr.value * curr.stakedTime;
    acc.totalTime += curr.stakedTime;
    return acc;
  }, {investments: 0, totalTime: 0});
  const avgInvestment = reducedInvestmentWeights.investments / reducedInvestmentWeights.totalTime;

  const targetCropTokens = userTokens.filter(userToken => {
    return cropTokens.some(cropToken => cropToken.tokenId === userToken.tokenId);
  });
  targetCropTokens.forEach(token => {
    // unclaimed[token.name] += token.unclaimedBalance.reduce((acc, curr) => {
      // valueUnclaimed += token.unclaimedBalance.reduce((acc, curr) => {
        // return curr.field.fieldId === fieldId ? curr.balance * tokenPrices[token.name].usd : acc;
        // }, valueUnclaimed)
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

  // return (valueUnclaimed + valueClaimed) / avgInvestment;
  // const allTimeROI = (valueUnclaimed + valueClaimed) / avgInvestment
  // const allTimeROI = (valueUnclaimed + valueClaimed) / avgInvestment
  const allTimeROI = (unclaimed.totalValue + claimed.totalValue) / avgInvestment
  // return {allTimeROI, valueUnclaimed, valueClaimed, avgInvestment}
  return {allTimeROI, unclaimed, claimed, avgInvestment}
}

export default calcFarmingROI;
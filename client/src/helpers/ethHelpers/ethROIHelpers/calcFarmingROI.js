/**
 * FIXME: documentation incorrect
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
  // let valueInvested = 0;
  // let valueRealised = 0;
  //used to record the amount of time an investment was made for (value indicates value in $. Amount indicates token amount (un)staked)
  //currentInv.amount not currently used in calcs, but may be at a later date
  const currentInv = {value: 0, amount: 0, dateStart: null};
  const weightedInvestments =[];

  console.log(' ---> field.name', field.name);
  //@dev: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Amount, pricePerToken}]
  txHistory.forEach(userTx => {
    if (field.name === "SNX: curve sUSD rewards") console.log(' ---> userTx', userTx);
    const { rewardAmount, stakingAmount, unstakingAmount, pricePerToken} = userTx;
    if (rewardAmount) {
      valueClaimed += rewardAmount * pricePerToken;
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
  console.log(' ---> weightedInvestments', weightedInvestments);
  const reducedInvestmentWeights = weightedInvestments.reduce((acc, curr) => {
    acc.investments += curr.value * curr.stakedTime;
    acc.totalTime += curr.stakedTime;
    return acc;
  }, {investments: 0, totalTime: 0});
  console.log(' ---> reducedInvestmentWeights', reducedInvestmentWeights);
  const avgInvestment = reducedInvestmentWeights.investments / reducedInvestmentWeights.totalTime;
  console.log(' ---> avgInvestment', avgInvestment);

  const targetCropTokens = userTokens.filter(userToken => {
    return cropTokens.some(cropToken => cropToken.tokenId === userToken.tokenId);
  });
  targetCropTokens.forEach(token => {
    console.log(' ---> token.name', token.name);
    valueUnclaimed += token.unclaimedBalance.reduce((acc, curr) => {
      return curr.field.fieldId === fieldId ? curr.balance * tokenPrices[token.name].usd : acc;
    }, valueUnclaimed)
    console.log(' ---> valueUnclaimed', valueUnclaimed);
  })

  // return (valueUnclaimed + valueClaimed) / avgInvestment;
  const allTimeROI = (valueUnclaimed + valueClaimed) / avgInvestment
  return {allTimeROI, valueUnclaimed, valueClaimed, avgInvestment}
}

export default calcFarmingROI;
/**
 * FIXME: documentation incorrect
 * @param {Number} investmentValue - current value of investment in analysed field
 * @param {Array} txHistory - pre-sorted list of user interactions with analysed field
 * @return {Number} - user ROI to date with regards to the analysed field, defined as:
 *                    (current investment value + sum of realised exits [txOut]) / sum of historical investments [txIn]
 */
function calcFarmingROI (txHistory, userTokens, tokenPrices, field) {
  const {cropTokens, fieldId} = field;
  let valueClaimed = 0;
  let valueUnclaimed = 0;
  let valueInvested = 0;
  let valueRealised = 0;
  // const invArray = [{amount, date}]


  //@dev: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Amount, pricePerToken}]
  txHistory.forEach(userTx => {
    if (field.name === "SNX: curve sUSD rewards") console.log(' ---> userTx', userTx);
    const { rewardAmount, stakingAmount, unstakingAmount, pricePerToken} = userTx;
    if (rewardAmount) {
      valueClaimed += rewardAmount * pricePerToken;
    } else if (stakingAmount) {
      valueInvested += stakingAmount * pricePerToken;
    } else if (unstakingAmount) {
      valueRealised += unstakingAmount * pricePerToken;
    }
  })

  const targetCropTokens = userTokens.filter(userToken => {
    return cropTokens.some(cropToken => cropToken.tokenId === userToken.tokenId);
  });
  targetCropTokens.forEach(token => {
    valueUnclaimed += token.unclaimedBalance.reduce((acc, curr) => {
      return curr.field.fieldId === fieldId ? curr.balance * tokenPrices[token.name].usd : acc;
    }, valueUnclaimed)
  })

  //TODO: alt ROI based on current crop value (investmentValue vs. amountInvested) for toggling in Field details
  //FIXME: absolutely necessary
  //alternative: add investmentValue in function args (currInvestmentValue from getROIs)
  //old calc: return (investmentValue + amountUnclaimed + amountClaimed + amountRealised) / amountInvested;
  return (valueUnclaimed + valueClaimed + valueRealised) / valueInvested;    
}

export default calcFarmingROI;
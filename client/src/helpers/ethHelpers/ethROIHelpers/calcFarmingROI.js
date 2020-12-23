/**
 * FIXME: documentation incorrect
 * @param {Number} investmentValue - current value of investment in analysed field
 * @param {Array} txHistory - pre-sorted list of user interactions with analysed field
 * @return {Number} - user ROI to date with regards to the analysed field, defined as:
 *                    (current investment value + sum of realised exits [txOut]) / sum of historical investments [txIn]
 */
function calcFarmingROI (txHistory, userTokens, tokenPrices, field) {
  const {cropTokens, fieldId} = field;
  let amountClaimed = 0;
  let amountUnclaimed = 0;
  let amountInvested = 0;
  let amountRealised = 0;
  //@dev: [{tx, [crop | receipt]Token, [priceApi,] [reward | staking | unstaking]Value, pricePerToken}]
  txHistory.forEach(userTx => {
    const { rewardValue, stakingValue, unstakingValue, pricePerToken} = userTx;
    if (rewardValue) {
      amountClaimed += rewardValue * pricePerToken;
    } else if (stakingValue) {
      amountInvested += stakingValue * pricePerToken;
    } else if (unstakingValue) {
      amountRealised += unstakingValue * pricePerToken;
    }
  })

  const targetCropTokens = userTokens.filter(userToken => {
    return cropTokens.some(cropToken => cropToken.tokenId === userToken.tokenId);
  });
  targetCropTokens.forEach(token => {
    amountUnclaimed += token.unclaimedBalance.reduce((acc, curr) => {
      return curr.field.fieldId === fieldId ? curr.balance * tokenPrices[token.name].usd : acc;
    }, amountUnclaimed)
  })

  //TODO: alt ROI based on current crop value (investmentValue vs. amountInvested) for toggling in Field details
  //FIXME: absolutely necessary
  //alternative: add investmentValue in function args (currInvestmentValue from getROIs)
  //old calc: return (investmentValue + amountUnclaimed + amountClaimed + amountRealised) / amountInvested;
  return (amountUnclaimed + amountClaimed + amountRealised) / amountInvested;    
}

export default calcFarmingROI;
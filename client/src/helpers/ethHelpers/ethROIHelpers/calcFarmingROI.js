//FIXME: documentation incorrect
/**
 * 
 * @param {Number} investmentValue - current value of investment in analysed field
 * @param {Array} txHistory - pre-sorted list of user interactions with analysed field
 * @return {Number} - user ROI to date with regards to the analysed field, defined as:
 *                    (current investment value + sum of realised exits [txOut]) / sum of historical investments [txIn]
 */
function calcFarmingROI (investmentValue, txHistory, userTokens, tokenPrices, fieldCropTokens) {
  let ROI = 0;
  txHistory.forEach(tx => {
    const { rewardValue, pricePerToken, priceApi } = tx;
    ROI += rewardValue * pricePerToken;
  })
  const targetUserTokens = userTokens.filter(userToken => fieldCropTokens.includes(cropToken => userToken.tokenId === cropToken.tokenId));
  targetUserTokens.forEach(token => {
    ROI += token.unclaimedBalance.reduce((acc, curr) => acc += curr.balance * tokenPrice[priceApi].usd, 0)
  })

  // Aaaaaaaaaaaaarg amount invested?!?!?!?!

  return (ROI / amountInvested) - 1;    
}

export default calcFarmingROI;
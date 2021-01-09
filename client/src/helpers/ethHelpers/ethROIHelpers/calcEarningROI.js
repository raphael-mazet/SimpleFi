/**
 *
 * @param {Number} currInvestmentValue - current value of investment in analysed field
 * @param {Array} txHistory - pre-sorted list of user interactions with analysed field
 * @return {Number} - user ROI to date with regards to the analysed field, defined as:
 *                    (current investment value + sum of realised exits [txOut]) / sum of historical investments [txIn]
 */
function calcEarningROI (currInvestmentValue, txHistory) {
  let valueInvested = 0;
  let valueRealised = 0;

  txHistory.forEach(tx => {
    const { txIn, txOut, pricePerToken } = tx;
    if (txIn || txOut) {
      txIn ? valueInvested += txIn * pricePerToken : valueRealised += txOut * pricePerToken
    }
  })
  const absReturnValue = currInvestmentValue + valueRealised - valueInvested;
  const allTimeROI = ((currInvestmentValue + valueRealised) / valueInvested) - 1;
  
  return {allTimeROI, absReturnValue, histInvestmentValue: valueInvested}
}

export default calcEarningROI;
/**
 *
 * @param {Number} investmentValue - current value of investment in analysed field
 * @param {Array} txHistory - pre-sorted list of user interactions with analysed field
 * @return {Number} - user ROI to date with regards to the analysed field, defined as:
 *                    (current investment value + sum of realised exits [txOut]) / sum of historical investments [txIn]
 */
function calcROI (investmentValue, txHistory) {
  let amountInvested = 0;
  let amountRealised = 0;

  txHistory.forEach(tx => {
    const { txIn, txOut, pricePerToken } = tx;
    if (txIn || txOut) {
      txIn ? amountInvested += txIn * pricePerToken : amountRealised += txOut * pricePerToken
    }
  })
  return ((investmentValue + amountRealised) / amountInvested) - 1;    
}

export default calcROI;
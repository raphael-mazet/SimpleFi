/**
 * 
 * @param {Object} tx - currently analysed tx (filtered from Etherscan fetch of user ERC20 transfer history)
 * @param {String} userAccount user Ethereum address
 * @param {Array} whitelist - list of seed token staking addresses to or from which
 *                            transactions don't change the user's underlying holding
 * @dev illustration: when staking a user sends to the farming contract's deposit address, but keeps stake in earning field
 *      idem: when user unstakes, they receive receipt tokens from the staking field, but should not count as a user having
 *      bought the tokens later: this whitelist concept will be key to combining user Accounts for an aggregate view
 *                            
 */
function sortLiquidityTxs (tx, userAccount, whitelist) {
  let txIn, txOut;
  let staked, unstaked;
  const txAmount = tx.value / Number(`1e${tx.tokenDecimal}`);

  if (tx.from === userAccount.toLowerCase()) {
    if (whitelist.includes(tx.to)) {
      staked = txAmount;
    } else {
      txOut = txAmount;
    }
  } else {
    if (whitelist.includes(tx.from)) {
      unstaked = txAmount;
    } else {
      txIn = txAmount;
    }
  }
  return {txIn, txOut, staked, unstaked}
}

export default sortLiquidityTxs;
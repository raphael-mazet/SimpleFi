//TODO: documentation
//@dev: tx is take from the Etherscan user erc20 transfer history, filtered by the
//relevant field receipt token
function sortLiquidityTxs (tx, userAccount, whitelist) {
  console.log(' ---> tx', tx);
  let txIn, txOut;
  let staked, unstaked;
  console.log(' ---> tx.value', tx.value);
  console.log(' ---> tx.tokenDecimal', tx.tokenDecimal);
  const txAmount = tx.value / Number(`1e${tx.tokenDecimal}`);
  console.log(' ---> txAmount', txAmount);

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

export {
  sortLiquidityTxs
} 
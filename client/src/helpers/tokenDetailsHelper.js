function extractTotalTokenBalance(token) {
  const unlockedBalance = token.userBalance ? token.userBalance : 0;
  const lockedBalance = token.lockedBalance ? token.lockedBalance.reduce((acc, lockedBalance) => acc + lockedBalance.balance, 0) : 0;
  const unclaimedBalance = token.unclaimedBalance ? token.unclaimedBalance.reduce((acc, unclaimedBalance) => acc + unclaimedBalance.balance, 0) : 0;
  return unlockedBalance + lockedBalance + unclaimedBalance;
}

export {
  extractTotalTokenBalance
}
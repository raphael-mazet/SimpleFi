function combineTokenHoldings (userTokens) {
  
  const combinedHoldings = [];

  userTokens.forEach(token => {
    
    if (token.isBase) {
      //TODO: create as object in RQ and only then extract to array for reuse in holding details
      let lockedBalance = 0;
      let unclaimedBalance = 0;
      let combinedBalance = 0;
      let lockedPercent = 0;
      const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
      
      if (token.lockedBalance) {
        lockedBalance = token.lockedBalance.reduce((acc, curr) => acc + curr.balance, 0);
      }
      if (token.unclaimedBalance) {
        unclaimedBalance = token.unclaimedBalance.reduce((acc, curr) => acc + curr.balance, 0);
      }

      if (token.userBalance) {
        combinedBalance = token.userBalance + lockedBalance + unclaimedBalance;
        lockedPercent = formatter.format(lockedBalance / combinedBalance);
      } else {
        combinedBalance = lockedBalance + unclaimedBalance;
        lockedPercent = formatter.format(1);
      }

      combinedHoldings.push([token.name, combinedBalance.toFixed(2), lockedPercent, 'Loading', 'Loading']);
    }
  })
  return combinedHoldings;
}


function addHoldingPrices(combinedHoldings, userTokenPrices) {

  let totalAssets = 0;

  for (const price in userTokenPrices) {
    const holdingIndex = combinedHoldings.findIndex(el => el[0] === price);
    if (holdingIndex !== -1) {
      //TODO: check implicit conversion from string to number
      const combinedTokenValue = userTokenPrices[price].usd * combinedHoldings[holdingIndex][1];
      totalAssets += combinedTokenValue;
      combinedHoldings[holdingIndex][4] = Number(combinedTokenValue.toFixed(2)).toLocaleString();
      combinedHoldings[holdingIndex][1] = Number(combinedHoldings[holdingIndex][1]).toLocaleString();
      combinedHoldings[holdingIndex][3] = Number(userTokenPrices[price].usd.toFixed(2)).toLocaleString();
    }
  }
  totalAssets = Number(totalAssets.toFixed()).toLocaleString();
  return { combinedHoldings, totalAssets };
}

export {
  combineTokenHoldings,
  addHoldingPrices
}

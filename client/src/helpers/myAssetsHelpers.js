function combineHoldings (userTokens) {
  
  const combinedHoldings = [];
  
  userTokens.forEach(token => {
    

    if (token.isBase) {
      //TODO: create as object in RQ and only then extract to array for reuse in holding details
      let lockedBalance = 0;
      let combinedBalance = 0;
      let lockedPercent = 0;
      const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
      
      if (token.lockedBalance) {
        lockedBalance = token.lockedBalance.reduce((acc, curr) => acc + curr.balance, 0);
        console.log(' ---> lockedBalance', lockedBalance);
      }

      if (token.balance) {
        combinedBalance = token.balance + lockedBalance;
        lockedPercent = formatter.format(lockedBalance / combinedBalance);
      } else {
        combinedBalance = lockedBalance;
        lockedPercent = formatter.format(1);
      }

      combinedHoldings.push([token.name, combinedBalance.toFixed(2), lockedPercent, 'Loading', token.currentPrice]);
    }
  })
  return combinedHoldings;
}

export {
  combineHoldings
}

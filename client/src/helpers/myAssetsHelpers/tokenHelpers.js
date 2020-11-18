import apis from '../../apis/index';

function combineTokenHoldings (userTokens) {
  
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
      }

      if (token.userBalance) {
        combinedBalance = token.userBalance + lockedBalance;
        lockedPercent = formatter.format(lockedBalance / combinedBalance);
      } else {
        combinedBalance = lockedBalance;
        lockedPercent = formatter.format(1);
      }

      combinedHoldings.push([token.name, combinedBalance.toFixed(2), lockedPercent, 'Loading', 'Loading']);
    }
  })
  return combinedHoldings;
}


function addHoldingPrices(combinedHoldings, userTokenPrices) {

  for (const price in userTokenPrices) {
    const holdingIndex = combinedHoldings.findIndex(el => el[0] === price);
    if (holdingIndex !== -1) {
      combinedHoldings[holdingIndex][4] = ((userTokenPrices[price].usd * combinedHoldings[holdingIndex][1]).toFixed(2));
      combinedHoldings[holdingIndex][3] = userTokenPrices[price].usd.toFixed(2);
    }
  }

  return combinedHoldings;
}

export {
  combineTokenHoldings,
  addHoldingPrices
}

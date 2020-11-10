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

      combinedHoldings.push([token.name, combinedBalance.toFixed(2), lockedPercent, token.priceApi, 'Loading']);
    }
  })
  return combinedHoldings;
}

//TODO: avoid addHoldingPrices being called multiple times(first with [], then meta/uni, then meta/uni/weth)
async function addHoldingPrices(combinedHoldings) {

  const priceApis = combinedHoldings.map(token => token[3]).join();
  const allPrices = await apis.manyPrices(priceApis);

  for (const price in allPrices) {
    const holdingIndex = combinedHoldings.findIndex(el => el[3] === price);
    combinedHoldings[holdingIndex][4] = ((allPrices[price].usd * combinedHoldings[holdingIndex][1]).toFixed(2));
    combinedHoldings[holdingIndex][3] = allPrices[price].usd.toFixed(2);
  }

  return combinedHoldings;
}

export {
  combineTokenHoldings,
  addHoldingPrices
}

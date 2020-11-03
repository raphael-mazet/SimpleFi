import apis from '../../apis/index';

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
      }

      if (token.balance) {
        combinedBalance = token.balance + lockedBalance;
        lockedPercent = formatter.format(lockedBalance / combinedBalance);
      } else {
        combinedBalance = lockedBalance;
        lockedPercent = formatter.format(1);
      }

      combinedHoldings.push([token.name, combinedBalance.toFixed(2), lockedPercent, 'Loading', token.priceApi]);
    }
  })
  return combinedHoldings;
}

async function addHoldingPrices(combinedHoldings) {

  const priceApis = combinedHoldings.map(token => token[4]);

  const tokenPrices = await Promise.all(
    priceApis.map(async priceApi => {
      if (priceApi){
        const currentPrice = await apis.currentPrice(priceApi);
        return currentPrice;
      }
  }))

  tokenPrices.forEach((price, i) => {
    combinedHoldings[i][3] = (price * combinedHoldings[i][1]).toFixed(2); //set value
    combinedHoldings[i][4] = price.toFixed(2); //set curr. price
  })

  return combinedHoldings;
}

export {
  combineHoldings,
  addHoldingPrices
}

export default function extractSummaryHoldingValues (userTokens, userTokenPrices) {
  const summaryTableValues = {
    baseTokens: [],
    receiptTokens: []
  };
  const overviewValues = {
    totalInvested: 0,
    totalUnclaimed: 0,
    totalValue: 0
  };

  userTokens.forEach(token => {
    let lockedBalance = 0;
    let unclaimedBalance = 0;
    let combinedBalance = 0;
    let lockedPercent = 0;
    const tokenPrice = userTokenPrices[token.name].usd;
    const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});

    if (token.lockedBalance) {
      lockedBalance = token.lockedBalance.reduce((acc, curr) => acc + curr.balance, 0);
    }
    if (token.unclaimedBalance) {
      unclaimedBalance = token.unclaimedBalance.reduce((acc, curr) => acc + curr.balance, 0);
    }
    if (token.userBalance) {
      combinedBalance = token.userBalance + lockedBalance + unclaimedBalance;
      lockedPercent = formatter.format((lockedBalance + unclaimedBalance) / combinedBalance);
    } else {
      combinedBalance = lockedBalance + unclaimedBalance;
      lockedPercent = formatter.format(1);
    }

    if (token.isBase) {
      summaryTableValues.baseTokens.push([
        token.name,
        Number(combinedBalance.toFixed(2)).toLocaleString(),
        lockedPercent,
        Number(tokenPrice.toFixed(2)).toLocaleString(),
        Number((combinedBalance * tokenPrice).toFixed(2)).toLocaleString()
      ]);
      overviewValues.totalInvested += lockedBalance * tokenPrice;
      overviewValues.totalUnclaimed += unclaimedBalance * tokenPrice;
      overviewValues.totalValue += combinedBalance * tokenPrice
      
    } else {
      summaryTableValues.receiptTokens.push([
        token.name,
        Number(combinedBalance.toFixed(2)).toLocaleString(),
        lockedPercent,
        Number(tokenPrice.toFixed(2)).toLocaleString(),
        Number((combinedBalance * tokenPrice).toFixed(2)).toLocaleString()
      ]);
    }
  });

  return {summaryTableValues, overviewValues};
}

export {
  extractSummaryHoldingValues,
}

function extractSummaryFieldValues (userFields) {
  const farmingFields = [];
  const earningFields = [];
  const totalInvested = {
    farmingInv: 0,
    earningInv: 0
  };
  const totalROI = {
    farmingROI: 0,
    earningROI: 0
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: 'percent',
    minimumFractionDigits: 2
  });

  userFields.forEach(field => {

    const { combinedBalance, stakedPercent } = combineFieldBalances(field);
    //CHECK: quid using investmentValue and allTimeROI when a field has both farming and earning returns
    //CHECK: is investmentValue based on current price or historical investment prices?
    const { name, cropTokens, isEarning, investmentValue, allTimeROI } = field;

    if (cropTokens.length) {
      let farming = '';
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      farming = farming.slice(0, -2);

      //FIXME: ROI weight should be based on the historic investment value
      totalROI.farmingROI += allTimeROI * investmentValue;
      totalInvested.farmingInv += investmentValue;
      
      const APY = field.farmingAPY?.combinedAPY ? formatter.format(field.farmingAPY.combinedAPY) : formatter.format(field.farmingAPY);
      const ROI = formatter.format(allTimeROI);
      const invested = Number(investmentValue?.toFixed(2)).toLocaleString();

      farmingFields.push([name, invested, farming, ROI, APY])
    }
    
    if (isEarning) {
      //FIXME: ROI weight should be based on the historic investment value
      totalROI.earningROI += allTimeROI * investmentValue;
      totalInvested.earningInv += investmentValue;
      
      const APY = formatter.format(field.earningAPY);
      const ROI = formatter.format(allTimeROI);
      const invested = Number(investmentValue?.toFixed(2)).toLocaleString();
      
      earningFields.push([name, invested, stakedPercent, ROI, APY]);
    }
  })
  totalROI.farmingROI = totalROI.farmingROI / totalInvested.farmingInv;
  totalROI.earningROI = totalROI.earningROI / totalInvested.earningInv;

  return {farmingFields, earningFields, totalInvested, totalROI}
}

function combineFieldBalances(field){
       
      let stakedBalance = 0;
      let combinedBalance = 0;
      let stakedPercent = 0;
      const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
      
      if (field.stakedBalance) {
        stakedBalance = field.stakedBalance.reduce((acc, curr) => acc + curr.balance, 0);
      }

      if (field.userBalance) {
        combinedBalance = field.userBalance + stakedBalance;
        stakedPercent = formatter.format(stakedBalance / combinedBalance);
      } else {
        combinedBalance = stakedBalance;
        stakedPercent = formatter.format(1);
      }
      
  return {
    combinedBalance: combinedBalance.toFixed(2),
    stakedPercent
  };
}

//NOTE: old extractSummaryFieldValues function - not currently in use
function fieldSeparator (userFields){
  const farmingFields = [];
  const earningFields = [];
  let totalInvested = 0;
  const formatter = new Intl.NumberFormat("en-US", {
    style: 'percent',
    minimumFractionDigits: 2
  });

  userFields.forEach(field => {

    const { combinedBalance, stakedPercent } = combineFieldBalances(field);
    const { name, userBalance, cropTokens, stakedBalance, isEarning, unstakedUserInvestmentValue } = field;

    //TODO: currently not adding combined balance to farming- must check
    //NOTE: on case by case if staking voids rewards on Curve in particular
    if (cropTokens.length) {
      let farming = '';
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      farming = farming.slice(0, -2);

      const APY = field.farmingAPY?.combinedAPY ? formatter.format(field.farmingAPY.combinedAPY) : formatter.format(field.farmingAPY);

      farmingFields.push([name, userBalance.toFixed(2), farming, APY])
    }

    if (isEarning) {
      const APY = formatter.format(field.earningAPY)
      earningFields.push([name, combinedBalance, stakedPercent, APY])
    }

    if (unstakedUserInvestmentValue) {
      totalInvested += unstakedUserInvestmentValue;
    }
    if (stakedBalance) {
      stakedBalance.forEach(stakedBalance => totalInvested += stakedBalance.userInvestmentValue)
    }
  })

  return {farmingFields, earningFields, totalInvested: Number(totalInvested.toFixed())}
}

export {
  fieldSeparator,
  extractSummaryFieldValues
}
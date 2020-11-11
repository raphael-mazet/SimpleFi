function combineFieldBalances(userFields){

  const combinedBalances = [];

  userFields.forEach(field => {
       
      let restakedBalance = 0;
      let combinedBalance = 0;
      let restakedPercent = 0;
      const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
      
      if (field.restakedBalance) {
        restakedBalance = field.restakedBalance.reduce((acc, curr) => acc + curr.balance, 0);
      }

      if (field.userBalance) {
        combinedBalance = field.userBalance + restakedBalance;
        restakedPercent = formatter.format(restakedBalance / combinedBalance);
      } else {
        combinedBalance = restakedBalance;
        restakedPercent = formatter.format(1);
      }

      combinedBalance.push([field.name, combinedBalance.toFixed(2), restakedPercent]);
  })
  return combinedBalances;
}


function fieldSeparator (userFields){
  const farmingFields = [];
  const earningFields = [];
  
  userFields.forEach(field => {

    const { name, userBalance, seedTokens, cropTokens, isEarning } = field;
    let underlying = '';
    seedTokens && seedTokens.forEach(token => underlying += `${token.name}, `);
    underlying = underlying.slice(0, -2);
      
    if (cropTokens.length) {
      let farming = '';
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      farming = farming.slice(0, -2);
      farmingFields.push([name, userBalance.toFixed(2), underlying, farming])
    }

    if (isEarning) {
      earningFields.push([name, userBalance.toFixed(2), underlying, 'tbd'])
    }
  })

  return {farmingFields, earningFields}
}

export {
  combineFieldBalances,
  fieldSeparator
}

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
  fieldSeparator
}

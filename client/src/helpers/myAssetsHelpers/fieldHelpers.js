const tempFieldValues = [];
    userFields.forEach(field => {

      //TODO: create two lists: earning and Farming
      const { name, balance, seedTokens, cropTokens} = field;
      let underlying = '';
      let farming = '';
      //TODO: get token name from cache
      seedTokens && seedTokens.forEach(token => underlying += `${token.name}, `);
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      underlying = underlying.slice(0, -2);
      farming = farming.slice(0, -2);
      tempFieldValues.push([name, balance.toFixed(2), underlying, farming]);
    })
    setFieldValues(tempFieldValues)
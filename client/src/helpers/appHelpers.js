function populateFieldTokensFromCache (fieldsWithBalance, trackedTokens) {
  fieldsWithBalance = fieldsWithBalance.map(field => {
    field.cropTokens = field.cropTokens.map(token => {
      return trackedTokens.find(trackedToken => token.tokenId === trackedToken.tokenId)
    });
    
    field.seedTokens = field.seedTokens.map(token => {
      return trackedTokens.find(trackedToken => token.tokenId === trackedToken.tokenId)
    });
    
    return field;
  })

  return fieldsWithBalance;
}


function addLockedTokenBalances (rewoundTokens, userTokens) {
  //ASK: is this necessary?
  const updatedUserTokens = [...userTokens];

  rewoundTokens.forEach(rewoundToken => {
    //identify if user already has a balance for curr token
    const existingUserToken = updatedUserTokens.find(userToken => userToken.tokenId === rewoundToken.token.tokenId);
    //if so, add rewound token balance to thre token's locked balance
    if (existingUserToken && existingUserToken.lockedBalance) {
      existingUserToken.lockedBalance.push({balance: rewoundToken.userTokenBalance, field: rewoundToken.field});
    }
    else if (existingUserToken) existingUserToken.lockedBalance = [{balance: rewoundToken.userTokenBalance, field: rewoundToken.field}];
    //otherwise: create a new user Token
    else {
      //TODO: double-check this is necessary
      const newUserToken = JSON.parse(JSON.stringify(rewoundToken.token));
      newUserToken.lockedBalance = [{balance: rewoundToken.userTokenBalance, field: rewoundToken.field}]
      updatedUserTokens.push(newUserToken);
    }
  })
  return updatedUserTokens;
}

export {
  populateFieldTokensFromCache,
  addLockedTokenBalances
}
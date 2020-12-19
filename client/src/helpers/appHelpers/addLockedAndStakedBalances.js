function addUnclaimedBalances(unclaimedBalances, userTokens, trackedTokens) {
  const updatedUserTokens = [...userTokens];

  unclaimedBalances.forEach(unclaimedToken => {
    //identify if user already has a balance for curr token
    const existingUserToken = updatedUserTokens.find(userToken => userToken.tokenId === unclaimedToken.tokenId);
    //if so, add rewound token balance to the token's locked balance
    if (existingUserToken && existingUserToken.unclaimedBalance) {
      existingUserToken.unclaimedBalance.push({balance: unclaimedToken.unclaimedBalance, field: unclaimedToken.field});
    }
    else if (existingUserToken) existingUserToken.unclaimedBalance = [{balance: unclaimedToken.unclaimedBalance, field: unclaimedToken.field}];
    //otherwise: create a new user Token
    else {
      //CHECK: check this is necessary
      const newUserToken = trackedTokens.find(trackedToken => trackedToken.tokenId === unclaimedToken.tokenId);
      newUserToken.unclaimedBalance = [{balance: unclaimedToken.unclaimedBalance, field: unclaimedToken.field}]
      updatedUserTokens.push(newUserToken);
    }
  })
  return updatedUserTokens;
}

function addLockedTokenBalances (rewoundTokens, userTokens) {
  const updatedUserTokens = [...userTokens];

  rewoundTokens.forEach(rewoundToken => {
    //identify if user already has a balance for curr token
    const existingUserToken = updatedUserTokens.find(userToken => userToken.tokenId === rewoundToken.token.tokenId);
    //if so, add rewound token balance to the token's locked balance
    if (existingUserToken && existingUserToken.lockedBalance) {
      const lockedBalanceObj = {balance: rewoundToken.userTokenBalance, field: rewoundToken.field};
      if (rewoundToken.via) lockedBalanceObj.via = rewoundToken.via;
      existingUserToken.lockedBalance.push(lockedBalanceObj);
    }
    else if (existingUserToken) {
      const lockedBalanceObj = {balance: rewoundToken.userTokenBalance, field: rewoundToken.field};
      if (rewoundToken.via) lockedBalanceObj.via = rewoundToken.via;
      existingUserToken.lockedBalance = [lockedBalanceObj];
    }
    //otherwise: create a new user Token
    else {
      //CHECK: check this is necessary
      const newUserToken = JSON.parse(JSON.stringify(rewoundToken.token));
      const lockedBalanceObj = {balance: rewoundToken.userTokenBalance, field: rewoundToken.field};
      if (rewoundToken.via) lockedBalanceObj.via = rewoundToken.via;
      newUserToken.lockedBalance = [lockedBalanceObj]
      updatedUserTokens.push(newUserToken);
    }
  })
  return updatedUserTokens;
}


function addStakedFieldBalances (rewoundFields, userFields) {
  //CHECK: is this necessary?
  const updatedUserFields = [...userFields];
  rewoundFields.forEach(rewoundField => {
    //identify if user already has a balance for curr field
    const existingUserField = updatedUserFields.find(userField => userField.fieldId === rewoundField.feederField.fieldId);
    //if so, add rewound field balance to the subField balance
    if (existingUserField && existingUserField.stakedBalance) {
      existingUserField.stakedBalance.push({balance: rewoundField.userFieldBalance, parentField: rewoundField.parentField});
    }
    else if (existingUserField) existingUserField.stakedBalance = [{balance: rewoundField.userFieldBalance, parentField: rewoundField.parentField}];
    //otherwise: create a new user Field
    else {
      //CHECK: check this is necessary
      const newUserField = JSON.parse(JSON.stringify(rewoundField.feederField));
      newUserField.stakedBalance = [{balance: rewoundField.userFieldBalance, parentField: rewoundField.parentField}]
      updatedUserFields.push(newUserField);
    }
  })
  return updatedUserFields;
}

export {
  addUnclaimedBalances,
  addLockedTokenBalances,
  addStakedFieldBalances
}
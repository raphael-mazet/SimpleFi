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
      //ASK: check this is necessary
      const newUserToken = JSON.parse(JSON.stringify(rewoundToken.token));
      newUserToken.lockedBalance = [{balance: rewoundToken.userTokenBalance, field: rewoundToken.field}]
      updatedUserTokens.push(newUserToken);
    }
  })
  return updatedUserTokens;
}


function addStakedFieldBalances (rewoundFields, userFields) {
  //ASK: is this necessary?
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
      //ASK: check this is necessary
      const newUserField = JSON.parse(JSON.stringify(rewoundField.feederField));
      newUserField.stakedBalance = [{balance: rewoundField.userFieldBalance, parentField: rewoundField.parentField}]
      updatedUserFields.push(newUserField);
    }
  })
  return updatedUserFields;
}

export {
  addLockedTokenBalances,
  addStakedFieldBalances
}
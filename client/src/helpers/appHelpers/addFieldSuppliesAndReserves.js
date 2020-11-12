function addFieldSuppliesAndReserves (suppliesAndBalances, userFields) {

    const updatedUserFields = [...userFields];

    suppliesAndBalances.forEach(suppliedField => {
      const targetField = userFields.find(userField => userField.name === suppliedField.fieldName);
      targetField.totalSupply = suppliedField.totalFieldSupply;

      suppliedField.seedReserves.forEach(reservedToken => {
        const targetSeed = targetField.seedTokens.find(seedToken => seedToken.name === reservedToken.tokenName);
        targetSeed.fieldReserve = reservedToken.fieldReserve
      })
    })
    return updatedUserFields;
}

export default addFieldSuppliesAndReserves;

// { fieldName, totalFieldSupply }
// { fieldName, seedReserves: [{tokenName, fieldReserve}] }
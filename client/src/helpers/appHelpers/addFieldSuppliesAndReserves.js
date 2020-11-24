/**
 * 
 * @param {Array} suppliesAndBalances - contains each fields totoal supply and underlying token reserves. Set during rewind
 * @param {Array} userFields - all fields a user has invested in
 * @return {Array} - a new userField array containing a total supply property, and a new fieldReserve property on each seed token
 */

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
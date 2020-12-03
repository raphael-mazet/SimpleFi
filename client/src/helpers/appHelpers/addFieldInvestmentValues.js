/**
 * 
 * @param {Array} userFields - all fields the user has invested in 
 * @param {Object} tokenPrices - prices of all user tokens
 * @return {Array} user fields updated with the value of the user's investment in them
 */

function addFieldInvestmentValues(userFields, tokenPrices) {
  const updatedFields = [...userFields];
  
  updatedFields.forEach(field => {
    let totalFieldValue = 0;
    field.seedTokens.forEach(token => {
      // console.log(' ---> field', field);
      // console.log(' ---> token.name', token.name);
      totalFieldValue += token.fieldReserve * tokenPrices[token.name].usd;
    })
  
    field.unstakedUserInvestmentValue = (field.userBalance / field.totalSupply) * totalFieldValue;
    if (field.stakedBalance) {
      field.stakedBalance.forEach(
        stakedBalance => stakedBalance.userInvestmentValue = (stakedBalance.balance / field.totalSupply) * totalFieldValue
      )
    }
  })

  return updatedFields;
}

export default addFieldInvestmentValues;
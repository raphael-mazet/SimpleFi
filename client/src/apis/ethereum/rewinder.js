import helpers from '../../helpers';
const ethers = require('ethers');

async function rewinder (userFields, trackedTokens, trackedFields) {
  const userTokenBalances = [];
  const userFeederFieldBalances = [];

  for (const mainField of userFields) {

    let totalMainFieldSupply = await mainField.contract.totalSupply();
    totalMainFieldSupply = Number(ethers.utils.formatUnits(totalMainFieldSupply, 18));
    
    //TODO: should call balance userBalance
    const userShareOfMainField = mainField.balance / totalMainFieldSupply;
 
    for (const token of mainField.seedTokens) {
      await tokenBalanceExtractor(token, mainField, userShareOfMainField)
    }
  }
  
  return { userTokenBalances, userFeederFieldBalances };

  async function tokenBalanceExtractor (token, field, share) {
    const { tokenId, isBase } = token;
    const tokenContract = trackedTokens.find(el => el.tokenId === tokenId).contract;
  
    let fieldSeedHolding = await tokenContract.balanceOf(field.address);
    fieldSeedHolding = Number(ethers.utils.formatUnits(fieldSeedHolding, 18));
  
    if (isBase) {
      const userTokenBalance = fieldSeedHolding * share;
      userTokenBalances.push({token, userTokenBalance, field});
  
    } else {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      
      //TODO: check why not always necessary
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);
      
      let totalFeederSupply = await feederField.contract.totalSupply();
      totalFeederSupply = Number(ethers.utils.formatUnits(totalFeederSupply, 18));
      
      const userFieldBalance = fieldSeedHolding * share;
      const userFeederShare = userFieldBalance / totalFeederSupply;
      
      //rewoundFieldBalances will contain any field with a receipt token that was fed into a field the user has staked in
      userFeederFieldBalances.push({feederField, userFieldBalance, parentField: field});
  
      for (const token of feederField.seedTokens) {
        tokenBalanceExtractor(token, feederField, userFeederShare)
      }
    }
  }
}

export default rewinder;


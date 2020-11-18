import helpers from '../../helpers';
import { getTotalFieldSupply, getFieldSeedReserves } from './';

async function rewinder (userFields, trackedTokens, trackedFields) {

  const userTokenBalances = [];
  const userFeederFieldBalances = [];
  const totalFieldSupplyCache = []; // { fieldName, totalFieldSupply }
  const fieldSeedReserveCache = []; // { fieldName, seedReserves: [{tokenName, fieldReserve}] }


  for (const mainField of userFields) {
    
    const { contract, decimals } = mainField.fieldContracts.balanceContract;
    const totalMainFieldSupply = await getTotalFieldSupply(mainField.name, contract, decimals, totalFieldSupplyCache);
    const userShareOfMainField = mainField.userBalance / totalMainFieldSupply;
 
    for (const token of mainField.seedTokens) {
      await tokenBalanceExtractor(token, mainField, userShareOfMainField)
    }
  }

  const fieldBalances = helpers.combineFieldSuppliesAndReserves(totalFieldSupplyCache, fieldSeedReserveCache);

  return {
    userTokenBalances,
    userFeederFieldBalances,
    fieldBalances
   };


  async function tokenBalanceExtractor (token, field, share) {
    const { tokenId, isBase, tokenContract } = token;

    let fieldSeedReserve = await getFieldSeedReserves(field, token, tokenContract, fieldSeedReserveCache);
  
    if (isBase) {
      const userTokenBalance = fieldSeedReserve * share;
      userTokenBalances.push({token, userTokenBalance, field});
  
    } else {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      //TODO: stop this from changing tracked Fields as well as user fields
      //TODO: avoid populating this multiple times (once in App.js)
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);
      
      const { contract, decimals } = feederField.fieldContracts.balanceContract;
      const totalFeederSupply = await getTotalFieldSupply(feederField.name, contract, decimals, totalFieldSupplyCache);
      const userFieldBalance = fieldSeedReserve * share;
      const userFeederShare = userFieldBalance / totalFeederSupply;
      
      //rewoundFieldBalances will contain any field with a receipt token that was fed into a field the user has staked in
      userFeederFieldBalances.push({feederField, userFieldBalance, parentField: field});
  
      for (const token of feederField.seedTokens) {
        await tokenBalanceExtractor(token, feederField, userFeederShare)
      }
    }
  }
}

export default rewinder;


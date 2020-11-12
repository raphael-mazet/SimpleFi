import helpers from '../../helpers';
import { getTotalFieldSupply, getFieldSeedHoldings } from './';
const ethers = require('ethers');

async function rewinder (userFields, trackedTokens, trackedFields) {

  const userTokenBalances = [];
  const userFeederFieldBalances = [];
  // { fieldName, totalFieldSupply }
  const totalFieldSupplyCache = [];
  const fieldSeedHoldingCache = [];


  for (const mainField of userFields) {
    
    const { contract, decimals } = mainField.fieldContracts.balanceContract;

    const totalMainFieldSupply = await getTotalFieldSupply(mainField.name, contract, decimals, totalFieldSupplyCache);
    // console.log(' ---> totalMainFieldSupply', totalMainFieldSupply);

    const userShareOfMainField = mainField.userBalance / totalMainFieldSupply;
 
    for (const token of mainField.seedTokens) {
      await tokenBalanceExtractor(token, mainField, userShareOfMainField)
    }
  }

  return {
    userTokenBalances,
    userFeederFieldBalances,
    totalFieldSupplies: totalFieldSupplyCache
   };


  async function tokenBalanceExtractor (token, field, share) {
    const { tokenId, isBase, tokenContract } = token;

    let fieldSeedHolding = await getFieldSeedHoldings(field, token, tokenContract);
    console.log(' ---> field.name, fieldSeedHolding', field.name, fieldSeedHolding);
  
    if (isBase) {
      const userTokenBalance = fieldSeedHolding * share;
      userTokenBalances.push({token, userTokenBalance, field});
  
    } else {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      //TODO: stop this from changing tracked Fields as well as user fields
      //TODO: avoid populating this multiple times (once in App.js)
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);
      
      const { contract, decimals } = feederField.fieldContracts.balanceContract;
      const totalFeederSupply = await getTotalFieldSupply(feederField.name, contract, decimals, totalFieldSupplyCache);
      const userFieldBalance = fieldSeedHolding * share;
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


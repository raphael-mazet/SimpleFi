import helpers from '../../helpers';
import { getTotalFieldSupply, getFieldSeedReserves } from './';

/**
 * 
 * @param {Array} userFields - all fields the user is currently invested in at a depth of 0 (investment not restaked elsewhere)
 * @param {Array} trackedTokens - all tokens tracked by SimpleFi
 * @param {Array} trackedFields - all earning and farming fields tracked by SimpleFi
 */
async function rewinder (userFields, trackedTokens, trackedFields) {

  const userTokenBalances = [];
  const userFeederFieldBalances = [];
  const totalFieldSupplyCache = []; // { fieldName, totalFieldSupply }
  const fieldSeedReserveCache = []; // { fieldName, seedReserves: [{tokenName, fieldReserve}] }

  for (const mainField of userFields) {
    
    const { contract, decimals } = mainField.fieldContracts.balanceContract;
    /*
    @dev: total supply indicates either 1) how many receipt tokens have been minted by the field
     or 2) how many input tokens the field holds (in cases where it issues no receipts)
     */
    const totalMainFieldSupply = await getTotalFieldSupply(mainField.name, contract, decimals, totalFieldSupplyCache);
    const userShareOfMainField = mainField.userBalance / totalMainFieldSupply;
 
    //@dev: will extract the balance of underlying seed tokens owned by the user
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

  //@dev via indicates the parent field via which the user has a token balance from a feederfield
  async function tokenBalanceExtractor (token, field, share, via) {
    const { tokenId, isBase, tokenContract } = token;
    
    //@dev: field seed reserves are the number of underlying tokens held by the field
    let fieldSeedReserve = await getFieldSeedReserves(field, token, tokenContract, fieldSeedReserveCache);
  
    // if isBase or !isBase
      const userTokenBalance = fieldSeedReserve * share;
      const balanceObj = {token, userTokenBalance, field};
      if (via) balanceObj.via = via;
      userTokenBalances.push(balanceObj);
  
    if (!isBase) {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      const parentField = field;

      //TODO: stop this from changing tracked Fields as well as user fields
      //TODO: avoid populating this multiple times (once in App.js)
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);

      const { contract, decimals } = feederField.fieldContracts.balanceContract;
      const totalFeederSupply = await getTotalFieldSupply(feederField.name, contract, decimals, totalFieldSupplyCache);
      const userFieldBalance = fieldSeedReserve * share;
      const userFeederShare = userFieldBalance / totalFeederSupply;
      
      //rewoundFieldBalances will contain any field with a receipt token that was fed into a field the user has staked in
      userFeederFieldBalances.push({feederField, userFieldBalance, parentField});
  
      for (const token of feederField.seedTokens) {
        await tokenBalanceExtractor(token, feederField, userFeederShare, parentField)
      }
    }
  }
}

export default rewinder;


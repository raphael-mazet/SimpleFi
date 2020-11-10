import helpers from '../../helpers';
import { getFieldSeedHoldings } from './';
const ethers = require('ethers');

async function rewinder (userFields, trackedTokens, trackedFields) {

  const userTokenBalances = [];
  const userFeederFieldBalances = [];

  for (const mainField of userFields) {
    
    const { contract, decimals } = mainField.fieldContracts.balanceContract;

    let totalMainFieldSupply = await contract.totalSupply();
    totalMainFieldSupply = Number(ethers.utils.formatUnits(totalMainFieldSupply, decimals));

    const userShareOfMainField = mainField.userBalance / totalMainFieldSupply;
 
    for (const token of mainField.seedTokens) {
      await tokenBalanceExtractor(token, mainField, userShareOfMainField)
    }
  }
  return { userTokenBalances, userFeederFieldBalances };


  async function tokenBalanceExtractor (token, field, share) {
    const { tokenId, isBase, tokenContract } = token;

    let fieldSeedHolding = await getFieldSeedHoldings(field, token, tokenContract);
  
    if (isBase) {
      const userTokenBalance = fieldSeedHolding * share;
      userTokenBalances.push({token, userTokenBalance, field});
  
    } else {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      //TODO: stop this from changing tracked Fields as well as user fields
      //TODO: avoid populating this multiple times (once in App.js)
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);
      
      const { contract, decimals } = feederField.fieldContracts.balanceContract;

      let totalFeederSupply = await contract.totalSupply();
      totalFeederSupply = Number(ethers.utils.formatUnits(totalFeederSupply, decimals));
      
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


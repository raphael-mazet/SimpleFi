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
    const { tokenId, isBase, balanceContract } = token;

    //TODO: take advantage of this to figure out prepopulated contracts
    //FIXME: seems there is no need for this step - because populated from cache
    //FIXME: for initial userfields only: need to double check when necessary and when
    //FIXME: tracked fields is modified by reference
    const tokenContract = trackedTokens.find(el => el.tokenId === tokenId).tokenContract;

    //determine underlying reserve balance extraction method
    let fieldSeedHolding = await getFieldSeedHoldings(field, token, tokenContract);
    console.log(`${field.name} holding of ${token.name}`, fieldSeedHolding);
  
    if (isBase) {
      const userTokenBalance = fieldSeedHolding * share;
      userTokenBalances.push({token, userTokenBalance, field});
      console.log(' ---> userTokenBalance', userTokenBalance);
  
    } else {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      
      //TODO: check why not always necessary
      // console.log(' ---> feederField before', feederField.seedTokens);
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);
      // console.log(' ---> feederField after§', feederField.seedTokens);
      
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


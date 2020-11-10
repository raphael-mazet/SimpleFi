import helpers from '../../helpers';
import { getFieldSeedHoldings } from './';
const ethers = require('ethers');

async function rewinder (userFields, trackedTokens, trackedFields) {

  const userTokenBalances = [];
  const userFeederFieldBalances = [];

  for (const mainField of userFields) {
    
    console.log(' ---> mainField', mainField);

    let totalMainFieldSupply = await mainField.balanceContract.totalSupply();
    totalMainFieldSupply = Number(ethers.utils.formatUnits(totalMainFieldSupply, 18));
    
    //TODO: should call balance userBalance
    const userShareOfMainField = mainField.balance / totalMainFieldSupply;
 
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
    const tokenContract = trackedTokens.find(el => el.tokenId === tokenId).balanceContract;

    //determine underlying reserve balance extraction method
    

    let fieldSeedHolding = await getFieldSeedHoldings(field, token, tokenContract);
    // let fieldSeedHolding = await tokenContract.balanceOf(field.address);
    // fieldSeedHolding = Number(ethers.utils.formatUnits(fieldSeedHolding, 18));
  
    if (isBase) {
      const userTokenBalance = fieldSeedHolding * share;
      userTokenBalances.push({token, userTokenBalance, field});
  
    } else {
      let feederField = trackedFields.find(field => field.receiptToken === tokenId);
      
      //TODO: check why not always necessary
      // console.log(' ---> feederField before', feederField.seedTokens);
      [feederField] = helpers.populateFieldTokensFromCache([feederField], trackedTokens);
      // console.log(' ---> feederField after§', feederField.seedTokens);
      
      let totalFeederSupply = await feederField.balanceContract.totalSupply();
      totalFeederSupply = Number(ethers.utils.formatUnits(totalFeederSupply, 18));
      
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


import { ethers } from 'ethers';
import { erc20, stakingField } from '../../data/ethContractTypes';

// Create provider
//TODO: potentially add default provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

//TODO: beware, documentation may not be entirely up to date
/**
 * @func createContract creates an instance of a new ethers contract interface
 * @param {collection} array of tracked tokens or fields with same type 
 * @param {type} string contract type determines abi used for contract
 * @returns {object} new contract interfaces
 */
function createContracts (collection, type) {
  const collectionWithContracts = [];
  
  let abi;
  switch (type) {
    case 'erc20': 
      abi = erc20;
      break;
    
    case 'field':
      abi = stakingField;
      break;

    default: abi = erc20;
    }

  collection.forEach(element => {
    const { address } = element;
    const newContract = new ethers.Contract(address, abi, provider);
    element.contract = newContract;
    collectionWithContracts.push(element);
  })

  return collectionWithContracts;
}

/**
 * @func getUserBalance retrieves balance of an ethereum account's tokens and stakes
 * @param {account} string user account address for which balance is requested
 * @param {contract} string token contract (optional - defaults to Eth)
 * @returns {string} account balance
 * @dev not all contracts specify decimals with which to parse balance, so defaults to 18
 */
async function getUserBalance (account, contract) {
  if (!contract) {
    const balance = await provider.getBalance(account);
    return Number(ethers.utils.formatEther(balance));
  } else {
    let decimals;
    if (contract.decimals) decimals = await contract.decimals();
    const balance = await contract.balanceOf(account);
    //TODO: check farming contract decimals?
    return Number(ethers.utils.formatUnits(balance, decimals || 18));
    }
  }


/**
 * @func rewinder extracts the underlying tokens from a given field
 * @param {field} object contract in which a user has invested to farm a given yield
 * @param {trackedTokens} array passed from App as helper needs access to contract interfaces
 * @returns {array} containing token id, token balance and related field (to inform user of where tokens are locked)
 */
async function rewinder (field, trackedTokens) {
  console.log(' ---> trackedTokens', trackedTokens);
  console.log(' ---> field', field);
  //NOTE: simple case where seedTokens are for sure base tokens (will need update)
  //TODO: check if totalSupply() will work for contracts other than uniswap
  //TODO: check if better to set this at setUserField useEffect level
  const totalFieldSupply = await field.contract.totalSupply();
  const userTokenBalances = [];
  const fieldHoldingPromises = [];
  const tokenIds = [];

  field.seedTokens.forEach(token => {
    console.log(' ---> token', token);
    const { token_id } = token;
    const tokenContract = trackedTokens.find(el => el.tokenId === token_id).contract;
    const fieldSeedHolding = tokenContract.balanceOf(field.address);
    fieldHoldingPromises.push(fieldSeedHolding);
    tokenIds.push(token_id);
  })
  
  await Promise.all(fieldHoldingPromises)
    .then(fieldHoldings => fieldHoldings.forEach((fieldHolding, i) => {
      const userTokenBalance = field.balance * fieldHolding / totalFieldSupply;
      userTokenBalances.push({token_id:tokenIds[i], userTokenBalance, field});
    }))
  return userTokenBalances;
}

export {
  createContracts,
  getUserBalance,
  rewinder
}


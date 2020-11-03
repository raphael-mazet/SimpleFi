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

  //TODO: documentation
  function getAllUserBalances (account, fieldOrTokenArr) {
    const balancePromises = Promise.all(fieldOrTokenArr.map(async fieldOrToken => {
        const { contract } = fieldOrToken;
        const balance = await getUserBalance(account, contract);
          if(balance) {
            return { ...fieldOrToken, balance }
          }
        }))
        .then(tokensWithBalances => tokensWithBalances.filter(token => token))
    return balancePromises;
    }


export {
  createContracts,
  getUserBalance,
  getAllUserBalances,
}


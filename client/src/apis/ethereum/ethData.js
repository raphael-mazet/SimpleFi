import { ethers } from 'ethers';
import { erc20Contract } from '../../data/ethContractTypes';

// Create provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

/**
 * @func createContract creates an instance of a new ethers contract interface
 * @param {address} contract address 
 * @param {type} contract type determines abi
 * @returns {object} new contract interface
 */
function createContract (address, type) {
  let abi;
  if (type === 'erc20') {
    abi = [
      'function balanceOf(address) view returns (uint)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)'
    ];
  }
  const newContract = new ethers.Contract(address, abi, provider);
  return newContract;
}

/**
 * @func getBalance retrieves balance of an an ethereum account's tokens and stakes
 * @param {account} user account for which balance is requested
 * @param {contract} token contract (optional - defaults to Eth)
 * @returns {string} account balance //TODO: check
 */
function getTokenBalance (account, contract) {
  if (!contract) {
    return (
      provider.getBalance(account)
        .then(balance => ethers.utils.formatEther(balance))
      )
  } else {
    return (
      contract.balanceOf(account)
    )
  }
}

export {
  createContract,
  getTokenBalance,
}
import { ethers } from 'ethers';
//TODO: potentially add default provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

/**
 * @func createContract creates an instance of a new ethers contract interface
 * @param {collection} array of tracked tokens or fields
 * @returns {object} collection with new contract interfaces
 */
function createContracts (collection) {
  const collectionWithContracts = [];
  
  collection.forEach(element => {
    const { address, contractInterface } = element;
    const newContract = new ethers.Contract(address, contractInterface.abi, provider);
    element.contract = newContract;
    collectionWithContracts.push(element);
  })

  return collectionWithContracts;
}

export default createContracts;


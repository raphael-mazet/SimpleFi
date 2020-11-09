import { ethers } from 'ethers';

//TODO: potentially add default provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

/**
 * @func createContract creates an instance of a new ethers contract interface
 * @param {collection} array of tracked tokens or fields
 * @returns {object} collection with new contract interfaces
 */
function createBalanceContracts (collection) {
  const collectionWithContracts = [];
  
  collection.forEach(element => {

    const { contractAddresses} = element;
    let balanceContract;
    
    //for Fields
    if (contractAddresses) {
      const balanceAddress = contractAddresses.filter(address => address.addressTypes.includes('balance'))[0];
      balanceContract = new ethers.Contract(balanceAddress.address, balanceAddress.contractInterface.abi, provider)
    }

    //for tokens
    else {
      const { address, contractInterface } = element;
      balanceContract = new ethers.Contract(address, contractInterface.abi, provider);
    }
    
    element.balanceContract = balanceContract;
    collectionWithContracts.push(element);
  })

  return collectionWithContracts;
}

export default createBalanceContracts;


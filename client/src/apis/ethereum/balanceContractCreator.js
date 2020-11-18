import { ethers } from 'ethers';
import provider from './ethProvider';

/**
 * @func createContract creates an instance of a new ethers contract interface
 * @param {collection} array of tracked tokens or fields
 * @returns {object} collection with new contract interfaces
 */
function createBalanceContracts (collection) {
  const collectionWithContracts = [];
  
  collection.forEach(element => {
    
    //for Fields
    if (element.fieldId) {
      const { contractAddresses } = element;
      //TODO: enforce unicity of filter here?
      let balanceAddress = contractAddresses.filter(address => address.addressTypes.includes('balance'));
      if (balanceAddress.length === 1) {
        balanceAddress = balanceAddress[0]
      } else {
        throw new Error('Error identifying balance address, may not exist or not be unique - createBalanceContracts()');
      }
      element.fieldContracts = {
        balanceContract: {
          contract: new ethers.Contract(balanceAddress.address, balanceAddress.contractInterface.abi, provider),
          decimals: balanceAddress.contractInterface.decimals
        }
      }
    }

    //for tokens
    else {
      const { address, contractInterface } = element;
      element.tokenContract = {
        contract: new ethers.Contract(address, contractInterface.abi, provider),
        decimals: contractInterface.decimals
      }
    }

    collectionWithContracts.push(element);
  })

  return collectionWithContracts;
}

export default createBalanceContracts;


import { ethers } from 'ethers';
import provider from './ethProvider';
import helpers from '../../helpers'

//CHECK: add cache here instead of parent function?
async function getFieldSeedReserves (field, token, tokenContract, cache) {

  //Check in cache if reserves already fetched
  const findFieldinCache = cache.filter(fieldWithReserves => fieldWithReserves.fieldName === field.name)[0];
  if (findFieldinCache) {
    const seedIndex = findFieldinCache.seedReserves.findIndex(seed => seed.tokenName === token.name);
    if (seedIndex !== -1) {
      return findFieldinCache.seedReserves[seedIndex].fieldReserve;
    }
  }

  const reserveAddress = helpers.findFieldAddressType(field, 'underlying');
  const { addressType, address, abi } = reserveAddress;
  const { decimals } = token.contractInterface;
  const tokenIndex = token.seedIndex;

  let fieldReserve;

  switch (addressType) {

    case "curveSwap":

      if (!field.fieldContracts.underlyingContract) {
        field.fieldContracts.underlyingContract = new ethers.Contract(address, abi, provider);
      }

      fieldReserve = await field.fieldContracts.underlyingContract.balances(tokenIndex);
      fieldReserve = ethers.utils.formatUnits(fieldReserve, decimals)
      break;

    case "curveSNX":

      if (!field.fieldContracts.underlyingContract) {
        field.fieldContracts.underlyingContract = new ethers.Contract(address, abi, provider);
      }
      const fieldDepositContract = field.contractAddresses.find(contractAddress => contractAddress.addressTypes.includes('deposit'));
      fieldReserve = await field.fieldContracts.underlyingContract.balanceOf(fieldDepositContract.address);
      fieldReserve = ethers.utils.formatUnits(fieldReserve, decimals)
      break;

    case "uniswap":
      const reserveContract = field.fieldContracts.balanceContract.contract;
      const _fieldReserves = await reserveContract.getReserves();
      fieldReserve = Number(ethers.utils.formatUnits(_fieldReserves[tokenIndex], decimals));
      break;

    default: 
    fieldReserve = await tokenContract.contract.balanceOf(address);
    fieldReserve = Number(ethers.utils.formatUnits(fieldReserve, decimals));
  }
  
  if (findFieldinCache) {
    findFieldinCache.seedReserves.push({
      tokenName: token.name,
      fieldReserve
    })
  } else {
    cache.push({
    fieldName: field.name, 
    seedReserves: [{tokenName: token.name, fieldReserve}]
    })
  }

  return fieldReserve;
}

export default getFieldSeedReserves
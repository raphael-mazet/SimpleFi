import { ethers } from 'ethers';
import provider from './ethProvider';
import helpers from '../../helpers'

async function getFieldSeedReserves (field, token, tokenContract, cache) {

  //Check in cache if reserves already fetched
  const findFieldinCache = cache.filter(fieldWithReserves => fieldWithReserves.fieldName === field.name)[0];
  if (findFieldinCache) {
    const seedIndex = findFieldinCache.seedReserves.findIndex(seed => seed.tokenName === token.name);
    if (seedIndex !== -1) {
      return findFieldinCache.seedReserves[seedIndex].fieldReserve;
    }
  }

  //NOTE: 'underlying' currently denotes both the address that holds seed reserves, 
  //NOTE: and the address whose ABI contains a balance reserve query function
  const reserveAddress = helpers.findFieldAddressType(field, 'underlying');
  const { type, address, abi } = reserveAddress;
  const { decimals } = token.contractInterface;
  const tokenIndex = token.seedIndex;

  let fieldReserve;

  switch (type) {

    case "curveSwap":

      if (!field.fieldContracts.underlyingContract) {
        field.fieldContracts.underlyingContract = new ethers.Contract(address, abi, provider);
      }

      fieldReserve = await field.fieldContracts.underlyingContract.balances(tokenIndex);
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
  // { fieldName, seedReserves: [{tokenName, fieldReserve}] }
  
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
import { ethers } from 'ethers';
import provider from './ethProvider';
import helpers from '../../helpers'

async function getFieldSeedHoldings (field, token, tokenContract) {

  //NOTE: underlying currently denotes both the address that holds seed reserves, 
  //NOTE: and the address whose ABI contains a balance reserve query function
  const reserveAddress = helpers.findFieldAddressType(field, 'underlying');
  const { type, address, abi } = reserveAddress;
  const { decimals } = token.contractInterface;
  const tokenIndex = token.seedIndex;

  let fieldBalance;

  switch (type) {

    case "curveSwap":

      if (!field.fieldContracts.underlyingContract) {
        field.fieldContracts.underlyingContract = new ethers.Contract(address, abi, provider);
      }

      fieldBalance = await field.fieldContracts.underlyingContract.balances(tokenIndex);
      fieldBalance = ethers.utils.formatUnits(fieldBalance, decimals)
      break;

    case "uniswap":
      const reserveContract = field.fieldContracts.balanceContract.contract;
      const fieldReserves = await reserveContract.getReserves();
      fieldBalance = Number(ethers.utils.formatUnits(fieldReserves[tokenIndex], decimals));
      break;

    default: 
    fieldBalance = await tokenContract.contract.balanceOf(address);
    fieldBalance = Number(ethers.utils.formatUnits(fieldBalance, decimals));
    break;

  }
  return fieldBalance;
}

export default getFieldSeedHoldings
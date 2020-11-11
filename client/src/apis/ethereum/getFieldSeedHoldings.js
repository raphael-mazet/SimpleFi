import { ethers } from 'ethers';
import provider from './ethProvider';
import helpers from '../../helpers'

async function getFieldSeedHoldings (field, token, tokenContract) {
  const reserveMethod = helpers.findFieldMethod(field, 'underlying');
  const { decimals } = token.contractInterface;
  const tokenIndex = token.seedIndex;

  let fieldBalance;

  //TODO: add Uniswap
  switch (reserveMethod.type) {

    case "curveSwap":

      if (!field.fieldContracts.underlyingContract) {
        const { address, abi } = reserveMethod;
        field.fieldContracts.underlyingContract = new ethers.Contract(address, abi, provider);
      }

      fieldBalance = await field.fieldContracts.underlyingContract.balances(tokenIndex);
      fieldBalance = ethers.utils.formatUnits(fieldBalance, decimals)
      break;

    case "uniswap":
      const fieldReserves = await field.fieldContracts.balanceContract.contract.getReserves();
      fieldBalance = Number(ethers.utils.formatUnits(fieldReserves[tokenIndex], decimals));
      break;

    default: 
    fieldBalance = await tokenContract.contract.balanceOf(field.address);
    fieldBalance = Number(ethers.utils.formatUnits(fieldBalance, decimals));
    break;

  }
  return fieldBalance;
}

export default getFieldSeedHoldings
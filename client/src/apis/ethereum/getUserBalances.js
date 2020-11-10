import { ethers } from 'ethers';
import provider from './ethProvider';

/**
 * @func getUserBalance retrieves balance of an ethereum account's tokens and stakes
 * @param {account} string user account address for which balance is requested
 * @param {contract} string token contract (optional - defaults to Eth)
 * @returns {string} account balance
 * @dev not all contracts specify decimals with which to parse balance, so defaults to 18
 */
async function getUserBalance (account, targetContract) {
  if (!targetContract) {
    const balance = await provider.getBalance(account);
    return Number(ethers.utils.formatEther(balance));

  } else {
    const { contract, decimals } = targetContract.balanceContract || targetContract;
    let balance = await contract.balanceOf(account);
    balance = Number(ethers.utils.formatUnits(balance, decimals));

    return balance;
  }
}

  //TODO: documentation
  function getAllUserBalances (account, fieldOrTokenArr) {
    const balancePromises = Promise.all(
      fieldOrTokenArr.map(
        async fieldOrToken => {
          let contract;
          if (fieldOrToken.tokenId) {
            contract = fieldOrToken.tokenContract;
          } else {
            contract = fieldOrToken.fieldContracts;
          }
          const userBalance = await getUserBalance(account, contract);
          if(userBalance) {
            return { ...fieldOrToken, userBalance }
          }
        }
      )
    )
      //filter undefined value from map
      .then(tokensWithBalances => tokensWithBalances.filter(token => token))
    return balancePromises;
    }

export {
  getUserBalance,
  getAllUserBalances,
}


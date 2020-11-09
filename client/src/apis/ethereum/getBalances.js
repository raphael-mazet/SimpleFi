import { ethers } from 'ethers';

// Create provider
//TODO: potentially add default provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

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
    //TODO: check farming contract decimals - add to DB?
    return {
      balance: Number(ethers.utils.formatUnits(balance, decimals || 18)),
      //sometimes returns as bigInt
      decimals: Number(decimals || 18),
    }
  }
}

  //TODO: documentation
  function getAllUserBalances (account, fieldOrTokenArr) {
    const balancePromises = Promise.all(
      fieldOrTokenArr.map(
        async fieldOrToken => {
          const { balanceContract } = fieldOrToken;
          const userBalance = await getUserBalance(account, balanceContract, fieldOrToken.name);
          if(userBalance.balance) {
            return { ...fieldOrToken, userBalance }
          }
        }
      )
    )
        //ASK: this step is needed because...?
        .then(tokensWithBalances => tokensWithBalances.filter(token => token))
    return balancePromises;
    }

export {
  getUserBalance,
  getAllUserBalances,
}


import apollo from '../../../../apollo';
import uniswapQueries from './uniswapGraphQueryStrings';

async function getUniswapPoolVolume(pairAddress, first) {
  return await apollo.uniswapClient.query(
    {
      query: uniswapQueries.getUniswapPoolVolume,
      variables: { pairAddress, first }
    })
}

const uniswapBalanceCache = {};
console.log('first log@!')
async function getUniswapBalanceHistory(userAccount) {
  if (uniswapBalanceCache[userAccount]) {
    return uniswapBalanceCache[userAccount];
  } else {
    uniswapBalanceCache[userAccount] = await apollo.uniswapClient.query(
      {
        query: uniswapQueries.getUniswapBalanceHistory,
        variables: { user: userAccount }
      })
    return uniswapBalanceCache[userAccount];
  }
}

export {
  getUniswapPoolVolume,
  getUniswapBalanceHistory
}

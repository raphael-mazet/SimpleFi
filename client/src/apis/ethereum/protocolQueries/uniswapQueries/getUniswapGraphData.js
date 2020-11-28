import apollo from '../../../../apollo';
import uniswapQueries from './uniswapGraphQueryStrings';

async function getUniswapPoolVolume(pairAddress, first) {
  return await apollo.uniswapClient.query(
    {
      query: uniswapQueries.getUniswapPoolVolume,
      variables: { pairAddress, first }
    })
}

//TODO: add cache
async function getUniswapBalanceHistory(userAccount) {
  return await apollo.uniswapClient.query(
    {
      query: uniswapQueries.getUniswapBalanceHistory,
      variables: { user: userAccount }
    })
}

export {
  getUniswapPoolVolume,
  getUniswapBalanceHistory
}

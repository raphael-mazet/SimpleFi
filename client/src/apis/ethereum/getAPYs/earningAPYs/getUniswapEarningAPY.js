import { getUniswapPoolVolume } from '../../protocolQueries';

async function getUniswapEarningAPY(field, userTokens, userTokenPrices, earningAddress) {
  const { totalSupply } = field;
  const receiptToken = userTokens.find(token => token.tokenId === field.receiptToken).name;
  const totalValue = totalSupply * userTokenPrices[receiptToken].usd;
  const pairAddress = earningAddress.address;
  const first = 5;

  const dailyVolumeArr = await getUniswapPoolVolume(pairAddress, first); 
  const trailingDailyVolume = dailyVolumeArr.data.pairDayDatas.reduce((acc, curr) => {
    return acc += curr.dailyVolumeUSD/first;
  }, 0)
  
  const APY = trailingDailyVolume * 0.003 * 365 / totalValue;
  return APY;
}

export default getUniswapEarningAPY;
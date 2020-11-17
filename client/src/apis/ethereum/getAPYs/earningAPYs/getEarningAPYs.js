import apollo from '../../../../apollo';
import { gql } from '@apollo/client';
import getCurveEarningAPY from './curveEarningAPY/getCurveEarningAPY';
 
 async function getEarningAPYs (field, userTokens, userTokenPrices) {

  //get pair address
  const earningAddress = field.contractAddresses.find(address => address.addressTypes.includes('earning'));
  let APY;

  switch (earningAddress.contractInterface.name) {
    case "uniswap V2 earn":

    const { totalSupply } = field;
    const receiptToken = userTokens.find(token => token.tokenId === field.receiptToken).name;
    const totalValue = totalSupply * userTokenPrices[receiptToken].usd;
    const pairAddress = earningAddress.address;
    const first = 5;

    const dailyVolumeArr = await apollo.uniswapClient.query(
      {
        query: gql`
          query getUniswapPoolVolume ($pairAddress: String! $first: Int!) {
            pairDayDatas (
              where: {pairAddress: $pairAddress}
              orderBy: date
              orderDirection: desc
              first: $first
            ) {
              dailyVolumeUSD
            }
          }
        `,
        variables: { pairAddress, first }
      }
    )
    
    const trailingDailyVolume = dailyVolumeArr.data.pairDayDatas.reduce((acc, curr) => {
      return acc += curr.dailyVolumeUSD/first;
    }, 0)

    APY = trailingDailyVolume * 0.003 * 365 / totalValue;
    break;

    case "curve swap 4 (sUSD)":
    case "curve swap 3 (sBTC)":
      APY = await getCurveEarningAPY(field, userTokens, userTokenPrices);
      break;

    default:

  }

  return APY;
}

 export default getEarningAPYs;

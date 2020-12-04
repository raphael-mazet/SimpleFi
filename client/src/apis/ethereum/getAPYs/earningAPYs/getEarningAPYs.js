import getCurveEarningAPY from './getCurveEarningAPY';
import getUniswapEarningAPY from './getUniswapEarningAPY'
 
 async function getEarningAPYs (field, userTokens, userTokenPrices) {

  //get pair address
  const earningAddress = field.contractAddresses.find(address => address.addressTypes.includes('earning'));
  let APY;

  switch (earningAddress.contractInterface.name) {
    case "uniswap V2 earn":
      APY = await getUniswapEarningAPY(field, userTokens, userTokenPrices, earningAddress);
      break;

    case "curve swap 4 (sUSD)":
    case "curve swap 3 (sBTC)":
    case "curve swap 2 (hBTC)":
      APY = await getCurveEarningAPY(field);
      break;

    default:

  }

  return APY;
}

 export default getEarningAPYs;

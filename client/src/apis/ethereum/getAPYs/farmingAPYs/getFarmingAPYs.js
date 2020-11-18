import getSnxFarmingAPY from './snxFarmingAPY';
import getCurveFarmingAPY from './curveFarmingAPY';

//formula for APY: (yearlyReward * cropPrice) / (totalSupply * seedPrice)
async function getFarmingAPYs (field, userTokens, userTokenPrices) {
  const rewardRateAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardRate'));
  let APY;

  switch (rewardRateAddress.contractInterface.name) {

    case "synthetix susd farm":
    case "mstable farm":
      APY = await getSnxFarmingAPY(rewardRateAddress, field, userTokenPrices);
      break;

    case 'curve pool gauge':
      APY = await getCurveFarmingAPY(rewardRateAddress, field, userTokens, userTokenPrices);
      break;
  }
  
  return APY;
}

export default getFarmingAPYs;
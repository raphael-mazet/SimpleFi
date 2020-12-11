import getSnxFarmingAPY from './getSnxFarmingAPY';
import getCurveFarmingAPY from './getCurveFarmingAPY';

//formula for APY: (yearlyReward * cropPrice) / (totalSupply * seedPrice)
//TODO: add documentation
//TODO: refactor to add secondary Farming APY - already provided in sub functions (e.g. getCurveFarmingAPY)
async function getFarmingAPYs (field, userTokenPrices) {
  const rewardRateAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardRate'));
  let APY;
  
  switch (rewardRateAddress.contractInterface.name) {
    
    case "synthetix susd farm":
      case "mstable farm":
        //CHECK: rename function if used for more than one field?
        APY = await getSnxFarmingAPY(rewardRateAddress, field, userTokenPrices);
        break;
        
    case 'curve reward gauge':
      APY = await getCurveFarmingAPY(rewardRateAddress, field, userTokenPrices);
      break;

    default:
      APY = 'undefined';
  }
  return APY;
}

export default getFarmingAPYs;
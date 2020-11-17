import apis from '../../../apis';

//formula for APY: (yearlyReward * cropPrice) / (totalSupply * seedPrice)
async function getFarmingAPYs (field, userTokens, userTokenPrices) {
  const rewardRateAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardRate'));
  let APY;

  switch (rewardRateAddress.contractInterface.name) {
    case "synthetix susd farm":
    case "mstable farm":
      APY = await apis.getSnxTypeAPY(rewardRateAddress, field, userTokenPrices);
      break;

    case 'curve pool gauge':
      APY = await apis.getCurveTypeAPY(rewardRateAddress, field, userTokens, userTokenPrices);
      break;
  }
  
  return APY;
}

export default getFarmingAPYs;
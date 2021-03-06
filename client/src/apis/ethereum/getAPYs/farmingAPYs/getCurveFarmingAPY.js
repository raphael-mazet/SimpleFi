import { ethers } from 'ethers';
import provider from '../../ethProvider';
import { getTotalAnnualReward, getFieldRewardPercent } from '../../protocolQueries/curveQueries/getCurveGaugeConstants';
import getSecondaryFieldAPYs from './getSecondaryFieldAPYs';

/*
  define annual reward
  sCRV gauge will also be used for boost
  the reward rate is the the total crop reward given per second to all pool gauges (farming fields)
  the .inflation_rate() method produces the same result for all pool gauge contracts and is the same as the CRV token contract's .rate() method
*/
async function getCurveFarmingAPY(rewardRateAddress, field, userTokenPrices) {

  const curveIndex = field.cropTokens.length === 1 ? 0 : field.cropTokens.findIndex(cropToken => cropToken.name === 'Curve');
  const curveDecimals = field.cropTokens[curveIndex].contractInterface.decimals;
  const rewardWeightAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardWeight'));
  const rewardRateContract = new ethers.Contract(rewardRateAddress.address, rewardRateAddress.contractInterface.abi, provider);
  const rewardWeightContract = new ethers.Contract(rewardWeightAddress.address, rewardWeightAddress.contractInterface.abi, provider);
  
  //TODO: add logic around timeperiod ending - contract.DURATION()
  
  const totalAnnualReward = await getTotalAnnualReward(rewardRateContract, curveDecimals);
  const fieldRewardPercent = await getFieldRewardPercent(rewardWeightContract, rewardRateAddress.address, curveDecimals);

  const curveAnnualPayout = totalAnnualReward * fieldRewardPercent;
  const { totalSupply } = field;

  //@dev: this assumes there is just one seed
  const seedPrice = userTokenPrices[field.seedTokens[0].name].usd;

  //get primary Curve APY
  //TODO: figure out the boost situation
  const cropPrice = userTokenPrices[field.cropTokens[curveIndex].name].usd;
  const curveCropAPY = (curveAnnualPayout * cropPrice) / (totalSupply * seedPrice);
  
  //additional crop token APYs
  if (curveIndex) {
    const additionalCropAPYs = await getSecondaryFieldAPYs(field, userTokenPrices, curveIndex);
    const secondaryAPY = additionalCropAPYs.reduce((acc, additionalAPY) => acc += additionalAPY.cropAPY, 0);
    return {
      combinedAPY: curveCropAPY + secondaryAPY,
      primaryAPY: {name: 'Curve', APY: curveCropAPY},
      secondaryAPYs: additionalCropAPYs //{cropAPY, cropToken, secondaryField}
    }
  } else {
    return curveCropAPY;
  }
}

  export default getCurveFarmingAPY;
import { ethers } from 'ethers';
import provider from '../../ethProvider';

async function getCurveFarmingAPY(rewardRateAddress, field, userTokens, userTokenPrices) {

  const rewardWeightAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardWeight'));
  const rewardRateContract = new ethers.Contract(rewardRateAddress.address, rewardRateAddress.contractInterface.abi, provider);
  const rewardWeightContract = new ethers.Contract(rewardWeightAddress.address, rewardWeightAddress.contractInterface.abi, provider);
  
  //TODO: add logic around timeperiod ending
  // const duration = await contract.DURATION();

  //define annual reward
  //sCRV gauge will also be used for boost
  const rewardRate = await rewardRateContract.inflation_rate();

  //get gauge weight
  //TODO: memoize totalWeight
  const totalWeight = await rewardWeightContract.get_total_weight();
  const gaugeWeight = await rewardWeightContract.get_gauge_weight(rewardRateAddress.address);
  //TODO: use decimals on these 2
  const fieldRewardsPercent = gaugeWeight / (totalWeight / 1e18);
  const annualPayout = (rewardRate / 1e18) * fieldRewardsPercent * 3.154e7;//this constant is the number of seconds in a year

  //define APY
  const { totalSupply } = field;

  //@dev: this assumes there is just one seed
  const seedPrice = userTokenPrices[field.seedTokens[0].name].usd;
  //FIXME: this assumes there is just one crop - not the case for susd
  const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;

  return (annualPayout * cropPrice) / (totalSupply * seedPrice);
}

  export default getCurveFarmingAPY;


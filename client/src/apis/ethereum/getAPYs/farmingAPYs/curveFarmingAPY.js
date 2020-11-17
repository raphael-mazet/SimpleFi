import { ethers } from 'ethers';
import provider from '../../ethProvider';

async function getCurveFarmingAPY(rewardRateAddress, field, userTokens, userTokenPrices) {

  console.log(' ---> rewardRateAddress', rewardRateAddress);
  console.log(' ---> field in getCurveFarmingAPY', field);

  const rewardWeightAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardWeight'));
  
  console.log(' ---> rewardWeightAddress', rewardWeightAddress);
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
  const fieldRewardsPercent = gaugeWeight / (totalWeight / 1e18);
  //TODO: use decimals
  const annualPayout = (rewardRate / 1e18) * fieldRewardsPercent * 3.154e7;

  //define APY
  const { totalSupply } = field;

  //seedPrice in this case is the receipt token price
  const receiptTokenName = userTokens.find(token => token.tokenId === field.receiptToken).name;
  const seedPrice = userTokenPrices[receiptTokenName].usd;
  const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;

  return (annualPayout * cropPrice) / (totalSupply * seedPrice);
}

  export default getCurveFarmingAPY;


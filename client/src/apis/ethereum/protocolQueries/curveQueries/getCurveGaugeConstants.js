import { ethers } from 'ethers';

//cache
let totalAnnualReward;

async function getTotalAnnualReward (contract, decimals) {
  if (totalAnnualReward) return totalAnnualReward;
  
  const secondsPerYear = 3.154e7;
  const rewardRateBigInt = await contract.inflation_rate();
  const rewardRate = Number(ethers.utils.formatUnits(rewardRateBigInt, decimals));
  totalAnnualReward = rewardRate * secondsPerYear;
  return totalAnnualReward;
}


async function getFieldRewardPercent(contract, address, decimals) {
  const gaugeRewardWeight = await contract["gauge_relative_weight(address)"](address);
  return Number(ethers.utils.formatUnits(gaugeRewardWeight, decimals));
}

export {
  getTotalAnnualReward,
  getFieldRewardPercent
}
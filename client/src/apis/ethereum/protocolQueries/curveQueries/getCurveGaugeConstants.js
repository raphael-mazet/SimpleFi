import { ethers } from 'ethers';

//cache
let totalAnnualReward;
let totalRewardWeight;

async function getTotalAnnualReward (contract, decimals) {
  if (totalAnnualReward) return totalAnnualReward;
  
  const secondsPerYear = 3.154e7;
  const rewardRateBigInt = await contract.inflation_rate();
  const rewardRate = Number(ethers.utils.formatUnits(rewardRateBigInt, decimals));
  totalAnnualReward = rewardRate * secondsPerYear;
  return totalAnnualReward;
}


async function getFieldRewardPercent(contract, address, decimals) {
  if (!totalRewardWeight) {
    totalRewardWeight = await contract.get_total_weight();
  }
  const gaugeRewardWeight = await contract.get_gauge_weight(address);

  return gaugeRewardWeight / Number(ethers.utils.formatUnits(totalRewardWeight, decimals));
}

export {
  getTotalAnnualReward,
  getFieldRewardPercent
}
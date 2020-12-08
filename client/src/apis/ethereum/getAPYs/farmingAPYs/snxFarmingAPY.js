import { ethers } from 'ethers';
import provider from '../../ethProvider';

async function getSnxFarmingAPY(rewardRateAddress, field, userTokenPrices) {
  const { address, contractInterface } = rewardRateAddress;
  const contract = new ethers.Contract(address, contractInterface.abi, provider);
       
  //TODO: add logic around timeperiod ending
  // const duration = await contract.DURATION();
        
  //define annual reward
  const rewardRate = await contract.rewardRate();
  //TODO: use decimals
  const annualPayout = (rewardRate / 1e18) * 3.154e7;
        
  //define APY
  const { totalSupply } = field;
  const seedPrice = userTokenPrices[field.seedTokens[0].name].usd;
  const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;

  return (annualPayout * cropPrice) / (totalSupply * seedPrice);

}

export default getSnxFarmingAPY;
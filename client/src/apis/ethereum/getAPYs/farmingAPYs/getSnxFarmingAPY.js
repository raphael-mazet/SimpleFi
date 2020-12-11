import { ethers } from 'ethers';
import provider from '../../ethProvider';

//cache
const rewardRateAndAPY = {};

/**
 * 
 * @param {Object} rewardRateAddress - contract data from which to query the field's reward rate
 * @param {Object} field - currently analysed field
 * @param {Array} userTokenPrices - all tracked token prices
 * @dev - this getter assumes there is just one crop token and one seed token per SNX farming field
 *      - this assumption is used when defining snxDecimals, the seed price and the crop price
 * @return {Number} - the field's APY
 */
async function getSnxFarmingAPY(rewardRateAddress, field, userTokenPrices) {

  if (rewardRateAndAPY[field.name]) return rewardRateAndAPY[field.name].APY;

  rewardRateAndAPY[field.name] = {};
  const { address, contractInterface } = rewardRateAddress;
  const snxDecimals = field.cropTokens[0].contractInterface.decimals;
  const secondsPerYear = 3.154e7;
  const contract = new ethers.Contract(address, contractInterface.abi, provider);
       
  //TODO: add logic around timeperiod ending
  // const duration = await contract.DURATION();
        
  //define annual reward
  // const rewardRate = await getRewardRate(contract, field.name);
  // const annualPayout = (rewardRate / 1e18) * 3.154e7;
  const rewardRate = await contract.rewardRate();
  rewardRateAndAPY[field.name].rewardRate = rewardRate;
  // console.log(' ---> Number(ethers.utils.formatUnits(rewardRate, snxDecimals))', Number(ethers.utils.formatUnits(rewardRate, snxDecimals)));
  const annualPayout = Number(ethers.utils.formatUnits(rewardRate, snxDecimals)) * secondsPerYear;
        
  //define APY
  const { totalSupply } = field;
  const seedPrice = userTokenPrices[field.seedTokens[0].name].usd;
  const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;
  const APY = (annualPayout * cropPrice) / (totalSupply * seedPrice);
  rewardRateAndAPY[field.name].APY = APY;
  return APY;
}

export default getSnxFarmingAPY;
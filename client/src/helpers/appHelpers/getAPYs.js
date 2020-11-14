import { ethers } from 'ethers';
import provider from '../../apis/ethereum/ethProvider';

async function getAPYs (userFields, userTokens, userTokenPrices) {

  //formula for APY: (yearlyReward * cropPrice) / (totalSupply * seedPrice)
  
  for (let field of userFields) {
    console.log(' ---> field.name', field.name);

    //FIXME: need to modularise and prob change DB
    //TODO: add contracts to field object
    //only applies to farming fields
    if (field.cropTokens) {

      let APY;

      if (field.name === "mStable: Earn pool 5") {

        const { address, contractInterface } = field.contractAddresses[0];
        const contract = new ethers.Contract(address, contractInterface.abi, provider);
       
        //TODO: add logic around timeperiod ending
        const duration = await contract.DURATION();
        
        //define annual reward
        const rewardRate = await contract.rewardRate();
        //TODO: use decimals
        const annualPayout = (rewardRate / 1e18) * 3.154e7;
        
        //define APY
        const { totalSupply } = field;
        const seedPrice = userTokenPrices[field.seedTokens[0].name].usd;
        const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;
        
        APY = (annualPayout * cropPrice) / (totalSupply * seedPrice)
      }
      
      if (field.name === "Curve: sBTC pool" || field.name === "Curve: sUSD v2 pool") {

        const rewardRateAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardRate'));
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
        const fieldRewardsPercent = gaugeWeight / (totalWeight / 1e18);
        const annualPayout = (rewardRate / 1e18) * fieldRewardsPercent * 3.154e7;

        //define APY
        const { totalSupply } = field;

        //seedPrice in this case is the receipt token price
        const receiptTokenName = userTokens.find(token => token.tokenId === field.receiptToken).name;
        const seedPrice = userTokenPrices[receiptTokenName].usd;
        const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;

        APY = (annualPayout * cropPrice) / (totalSupply * seedPrice);
      }

      if (field.name === "SNX: curve sUSD rewards") {

        const { address, contractInterface } = field.contractAddresses[0];
        const contract = new ethers.Contract(address, contractInterface.abi, provider);
       
        //TODO: add logic around timeperiod ending
        const duration = await contract.DURATION();
        
        //define annual reward
        const rewardRate = await contract.rewardRate();
        //TODO: use decimals
        const annualPayout = (rewardRate / 1e18) * 3.154e7;
        
        //define APY
        const { totalSupply } = field;
        const seedPrice = userTokenPrices[field.seedTokens[0].name].usd;
        const cropPrice = userTokenPrices[field.cropTokens[0].name].usd;
        
        APY = (annualPayout * cropPrice) / (totalSupply * seedPrice)
      }

      if (field.name === "Uni: MTA-wETH 50/50") {

      }


      console.log(' ---> field.name, APY', field.name, APY);
      // return APY;
    }
  }
}

export default getAPYs;
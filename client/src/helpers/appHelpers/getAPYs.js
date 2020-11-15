import apis from '../../apis';

async function getAPYs (userFields, userTokens, userTokenPrices) {

  //formula for APY: (yearlyReward * cropPrice) / (totalSupply * seedPrice)
  
  for (let field of userFields) {
    
    //TODO: add contracts to field object
    //only applies to farming fields
    if (field.cropTokens.length) {
      const rewardRateAddress = field.contractAddresses.find(address => address.addressTypes.includes('rewardRate'));

      let APY;

      switch (rewardRateAddress.contractInterface.name) {

        case "synthetix susd farm":
        case "mstable farm":
          APY = await apis.getSnxTypeAPY(rewardRateAddress, field, userTokenPrices);
          console.log(' ---> APY from switch!' + field.name, APY);
          break;

        case 'curve pool gauge':
          APY = await apis.getCurveTypeAPY(rewardRateAddress, field, userTokens, userTokenPrices);
          console.log(' ---> APY from switch!' + field.name, APY);
          break;
      }
      
      // return APY;
    }
  }
}

export default getAPYs;
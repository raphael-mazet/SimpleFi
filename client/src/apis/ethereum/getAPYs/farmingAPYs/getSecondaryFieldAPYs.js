import getFarmingAPYs from './getFarmingAPYs';
import provider from '../../ethProvider';
import { ethers } from 'ethers';

export default async function getSecondaryFieldAPYs(primaryField, userTokenPrices, primaryCropIndex) {
  const cropAPYs = [];
  let cropIndex = 0;

    for (let cropToken of primaryField.cropTokens) {
      if (cropIndex !== primaryCropIndex) {
        //identify which field the target secondary crop comes from
        const { secondaryField } = primaryField.secondaryFields.find(secondaryField => {
          return secondaryField.secondaryField.cropTokens.some(secondaryCropToken => {
            return secondaryCropToken.token.tokenId === cropToken.tokenId
          })
        })

        //reformat the secondary field to be processed by getFarmingAPY
        secondaryField.cropTokens.forEach(targetCropToken => {
          targetCropToken.name = targetCropToken.token.name;
          targetCropToken.contractInterface = targetCropToken.token.contractInterface;
        });
        secondaryField.seedTokens.forEach(targetSeedToken => {
          targetSeedToken.name = targetSeedToken.token.name;
        });

        //add secondaryFieldTotalSupply for use in APY calculation
        //CHECK: worth checking from fieldSuppliesAndReserves cache in App.js?
        const {address, contractInterface} = secondaryField.contractAddresses.find(contractAddress => contractAddress.addressTypes.includes('balance'));
        const secondaryFieldBalanceContract = new ethers.Contract(address, contractInterface.abi, provider);
        const secondarySupplyBigInt = await secondaryFieldBalanceContract.totalSupply();
        secondaryField.totalSupply = Number(ethers.utils.formatUnits(secondarySupplyBigInt, cropToken.contractInterface.decimals));

        const cropAPY = await getFarmingAPYs(secondaryField, userTokenPrices);
        cropAPYs.push({cropAPY, cropToken, secondaryField});
      }
      cropIndex ++;
    }
  return cropAPYs;
}

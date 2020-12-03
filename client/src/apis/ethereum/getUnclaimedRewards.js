import { ethers } from 'ethers';
import provider from './ethProvider';

async function getUnclaimedRewards(userAccount, trackedFields) {
  const unclaimedCropBalances = [];
  const farmFields = trackedFields.filter(field => field.cropTokens.length)
  console.log(' ---> farmFields', farmFields);

  for (let field of farmFields) {
    const { fieldId, cropTokens } = field;
    for (let cropToken of cropTokens) {
      const { tokenId } = cropToken;
      //@dev: assume that the same contract address is used to check the balance of multiple crop tokens (albeit with different methods saved in the cropToken DB table)
      const targetAddress = field.contractAddresses.find(contract => contract.addressTypes.includes('unclaimedReward'));
      const unclaimedRewardContract = new ethers.Contract(targetAddress.address, targetAddress.contractInterface.abi, provider);
      
      const unclaimedBalance = await unclaimedRewardContract[cropToken.unclaimedBalanceMethod](userAccount);
      unclaimedCropBalances.push({fieldId, tokenId, unclaimedBalance});
      //{
        //tokenId:
        //unclaimedBalanceMethod:
      //}
    }
  }
  return unclaimedCropBalances;
}

export default getUnclaimedRewards;
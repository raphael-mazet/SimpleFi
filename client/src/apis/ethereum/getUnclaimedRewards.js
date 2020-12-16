import { ethers } from 'ethers';
import provider from './ethProvider';

async function getUnclaimedRewards(userAccount, trackedFields) {
  const unclaimedCropBalances = [];
  const farmFields = trackedFields.filter(field => field.cropTokens.length)

  for (let field of farmFields) {
    const { cropTokens } = field;
    for (let cropToken of cropTokens) {
      const { tokenId } = cropToken;
      //@dev: assume that the same contract address is used to check the balance of multiple crop tokens (albeit with different methods saved in the cropToken DB table)
      try {
        const targetAddress = field.contractAddresses.find(contract => contract.addressTypes.includes('unclaimedReward'));
        const unclaimedRewardContract = new ethers.Contract(targetAddress.address, targetAddress.contractInterface.abi, provider);
        let unclaimedBalance = await unclaimedRewardContract[cropToken.unclaimedBalanceMethod](userAccount);
        unclaimedBalance = Number(ethers.utils.formatUnits(unclaimedBalance, targetAddress.contractInterface.decimals));
        unclaimedCropBalances.push({field, tokenId, unclaimedBalance});
      } catch (err) {
        console.error('Unclaimed rewards error', err);
      }
    }
  }
  return unclaimedCropBalances;
}

export default getUnclaimedRewards;
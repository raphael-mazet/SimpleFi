function sortFarmingTxs(field, userTokenTransactions) {
  const rewardDepositContract = field.contractAddresses.find(contractAddress => contractAddress.addressTypes.includes('deposit'));
  const rewardWithdrawalContract = field.contractAddresses.find(contractAddress => contractAddress.addressTypes.includes('withdraw'));
  
  const cropTokenAddresses = {};
  field.cropTokens.forEach(cropToken => {
    cropTokenAddresses[cropToken.address.toLowerCase()] = cropToken;
  });

  const sortedTxs = userTokenTransactions.reduce((acc, tx) => {
    //identify rewards claimed
    if (cropTokenAddresses[tx.contractAddress]) {
      //ASK: should this rather be unclaimedReward contract?
      if (tx.from === rewardWithdrawalContract.address.toLowerCase()) {
        const cropToken = cropTokenAddresses[tx.contractAddress];
        //@dev: assumes all crop tokens are base tokens in DB
        const priceApi = cropToken.priceApi;
        const rewardValue = tx.value / Number(`1e${cropToken.contractInterface.decimals}`);
        return [...acc, {tx, cropToken, priceApi, rewardValue}]
      } else {
        return acc;
      }

      //@dev: assumes only one seed token per staking/farming field
    } else if (tx.contractAddress === field.seedTokens[0].address.toLowerCase()) {
      //identify staking tx
      const receiptToken = field.seedTokens[0];
        //@dev: assumes the correct deposit method was used
        if (tx.to === rewardDepositContract.address.toLowerCase()) {
          const stakingValue = tx.value / Number(`1e${receiptToken.contractInterface.decimals}`);
          return [...acc, {tx, receiptToken, stakingValue}];
        //identify unstaking tx
        } else if (tx.from === rewardWithdrawalContract.address.toLowerCase()) {
          const unstakingValue = tx.value / Number(`1e${receiptToken.contractInterface.decimals}`);
          return [...acc, {tx, receiptToken, unstakingValue}];
        } else {
          return acc;
        }

    } else {
      return acc;
    }
  }, []);

  return sortedTxs;
}

export default sortFarmingTxs;
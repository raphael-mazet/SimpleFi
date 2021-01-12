function sortFarmingTxs(field, userTokenTransactions, userNormalTransactions) {
  const rewardDepositContract = field.contractAddresses.find(contractAddress => contractAddress.addressTypes.includes('deposit'));
  const rewardWithdrawalContract = field.contractAddresses.find(contractAddress => contractAddress.addressTypes.includes('withdraw'));
  
  const cropTokenAddresses = {};
  field.cropTokens.forEach(cropToken => {
    cropTokenAddresses[cropToken.address.toLowerCase()] = cropToken;
  });

  const sortedTxs = userTokenTransactions.reduce((acc, tx) => {
    //identify rewards claimed
    if (cropTokenAddresses[tx.contractAddress]) {
      
      //Check if reward address is in input method rather than from address
      let addressInMethod = false;
      if (tx.from === '0x0000000000000000000000000000000000000000') {
        const referenceTx = userNormalTransactions.find(normalTx => normalTx.hash === tx.hash);
        if (referenceTx) {
          const methodInput = '0x' + referenceTx.input.slice(-40);
          if (methodInput === rewardWithdrawalContract.address.toLowerCase()) addressInMethod = true;
        }
      }
      //ASK: should this rather be named unclaimedReward contract?
      if (tx.from === rewardWithdrawalContract.address.toLowerCase() || addressInMethod) {
        const cropToken = cropTokenAddresses[tx.contractAddress];
        //@dev: assumes all crop tokens are base tokens in DB
        const priceApi = cropToken.priceApi;
        const rewardAmount = tx.value / Number(`1e${cropToken.contractInterface.decimals}`);
        return [...acc, {tx, cropToken, priceApi, rewardAmount}]
      } else {
        return acc;
      }

      //@dev: assumes only one seed token per staking/farming field
    } else if (tx.contractAddress === field.seedTokens[0].address.toLowerCase()) {
      //identify staking tx
      const receiptToken = field.seedTokens[0];
        //@dev: assumes the correct deposit method was used
        if (tx.to === rewardDepositContract.address.toLowerCase()) {
          const stakingAmount = tx.value / Number(`1e${receiptToken.contractInterface.decimals}`);
          return [...acc, {tx, receiptToken, stakingAmount}];
        //identify unstaking tx
        } else if (tx.from === rewardWithdrawalContract.address.toLowerCase()) {
          const unstakingAmount = tx.value / Number(`1e${receiptToken.contractInterface.decimals}`);
          return [...acc, {tx, receiptToken, unstakingAmount}];
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
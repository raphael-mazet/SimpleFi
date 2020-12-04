import getHistoricalPrice from '../../coinGecko/getHistoricalPrice';

async function getUserCropReturnsHistory(field, userTokenTransactions) {
  //get the field contract sending the tokens
  //@dev: assumes there is one withdrawal address for all cropTokens
  const rewardWithdrawlContract = field.contractAddresses.find(contractAddress => contractAddress.includes('withdraw'));
  const timeFormatter = new Intl.DateTimeFormat('en-GB');
  let rewardsReceivedTxs = [];

  field.cropTokens.forEach(cropToken => {
    let cropRewardsReceived = userTokenTransactions.filter(tx => (
      tx.contractAddress === cropToken.address.toLowerCase() &&
      tx.from === rewardWithdrawlContract.address.toLowerCase()
    ));

    cropRewardsReceived = cropRewardsReceived.map(tx => {
      const priceApi = cropToken.priceApi;
      const rewardValue = tx.value / Number(`1e${cropToken.contractInterface.decimals}`)
      return {tx, priceApi, rewardValue}
    });

    rewardsReceivedTxs = [...rewardsReceivedTxs, cropRewardsReceived];
  })

  for (let tx of rewardsReceivedTxs) {
    const txDate = timeFormatter.format(new Date(Number(tx.tx.timeStamp) * 1000)).replace(/\//gi, '-');
    const histTokenPrice = await getHistoricalPrice (tx.priceApi, txDate);
    tx.pricePerToken = histTokenPrice
  }
  return rewardsReceivedTxs;
}

export default getUserCropReturnsHistory;
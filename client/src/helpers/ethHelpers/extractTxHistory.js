function extractTxHistory(field, trackedFields, userBalanceHistory, userTokenTransactions) {
  //TODO: consider getting this from DB
  //@dev: ensure staking of field receipts is removed from ROI calcs
  let whitelist = [];
  trackedFields.forEach(trackedField => {  
    trackedField.seedTokens.forEach(seedToken => {
      if (seedToken.tokenId === field.receiptToken) {
        //FIXME: this will only work if for sure only 1 contract address
        whitelist.push(trackedField.contractAddresses[0].address.toLowerCase());
      }
    })
  })

  //TODO: sanitise all addresses to lowercase
  let cumBal = 0;
  const extractedHistory = userBalanceHistory.map(snapshot => {
    const txDate = new Date(snapshot.timestamp * 1000);
    const pricePerToken = Number(snapshot.reserveUSD) / Number(snapshot.liquidityTokenTotalSupply);
    let txIn, txOut;
    let staked, unstaked;
    const newBal = Number(snapshot.liquidityTokenBalance);
    const targetBlock = userTokenTransactions.find(tx => tx.blockNumber === snapshot.block.toString());
    const {from, to} = targetBlock;

    if (cumBal < newBal) {
      if (!whitelist.includes(from)) {
        txIn = newBal - cumBal;
        cumBal += txIn;
      } else {
        unstaked = newBal - cumBal;
        cumBal += unstaked;
      }
    } else {
      if (!whitelist.includes(to)){
        txOut = cumBal - newBal;
        cumBal -= txOut;
      } else {
        staked = cumBal - newBal;
        cumBal -= staked;
      }
    }
    return {...snapshot, txDate, pricePerToken, txIn, txOut, staked, unstaked}
  })
  return extractedHistory;
}

export default extractTxHistory;
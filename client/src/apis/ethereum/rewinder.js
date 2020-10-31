
//Example for MTA EarnPool5

async function rewinder (field, trackedTokens) {
  const totalFieldSupply = await field.contract.totalSupply();
  const userTokenBalances = [];
  const fieldHoldingPromises = [];
  const tokenIds = [];

  field.seedTokens.forEach(token => {
    const { tokenId, isBase } = token;

    if (isBase) {

    }

    const tokenContract = trackedTokens.find(el => el.tokenId === tokenId).contract;
    const fieldSeedHolding = tokenContract.balanceOf(field.address);
    //fieldSeedHolding and tokenId are pushed into two separate arrays so promises can resolve

    fieldHoldingPromises.push(fieldSeedHolding);
    tokenIds.push(tokenId);
  })
  
  await Promise.all(fieldHoldingPromises)
    .then(fieldHoldings => fieldHoldings.forEach((fieldHolding, i) => {
      const userTokenBalance = field.balance * fieldHolding / totalFieldSupply;
      userTokenBalances.push({tokenId: tokenIds[i], userTokenBalance, field});
    }))
  return userTokenBalances;
}
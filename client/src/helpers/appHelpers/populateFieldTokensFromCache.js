function populateFieldTokensFromCache (fieldsWithBalance, trackedTokens) {
  fieldsWithBalance = fieldsWithBalance.map(field => {
    
    field.cropTokens = field.cropTokens.map(token => {
      //TODO: do not delete unclaimed balance method
      return trackedTokens.find(trackedToken => token.tokenId === trackedToken.tokenId)
    });
    
    field.seedTokens = field.seedTokens.map(token => {
      const { seedIndex } = token;
      return {
        ...trackedTokens.find(trackedToken => token.tokenId === trackedToken.tokenId),
        seedIndex
      }
    });
    
    return field;
  })

  return fieldsWithBalance;
}

export default populateFieldTokensFromCache;
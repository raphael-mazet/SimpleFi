function populateFieldTokensFromCache (fieldsWithBalance, trackedTokens) {
  fieldsWithBalance = fieldsWithBalance.map(field => {
    field.cropTokens = field.cropTokens.map(token => {
      return trackedTokens.find(trackedToken => token.tokenId === trackedToken.tokenId)
    });
    
    field.seedTokens = field.seedTokens.map(token => {
      return trackedTokens.find(trackedToken => token.tokenId === trackedToken.tokenId)
    });
    
    return field;
  })

  return fieldsWithBalance;
}

export { populateFieldTokensFromCache }
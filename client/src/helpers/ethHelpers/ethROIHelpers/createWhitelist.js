/**
 * 
 * @param {Array} trackedFields - all tracked fields
 * @param {Object} field - currently analysed earning field
 * @dev staking/unstaking field receipt tokens doesn't change the user's underlying balance so the corresponding addresses are "whitelisted"
 *      this helper assumes deposit and withdrawal addresses of the staking contract are the same
 * @return {Array} - a list of staking/unstaking addresses for use in the liquidity history extraction func
 * 
 */
function createWhitelist(trackedFields, field) {
  const whitelist = [];
  trackedFields.forEach(trackedField => {  
    trackedField.seedTokens.forEach(seedToken => {
      if (seedToken.tokenId === field.receiptToken) {
        const depositAddresses = trackedField.contractAddresses.filter(address => address.addressTypes.includes('deposit'));
        depositAddresses.forEach(depositAddress => whitelist.push(depositAddress.address.toLowerCase()))
      }
    })
  })
  return whitelist;
}

export default createWhitelist
import getCurveLiquidityHistory from './getCurveLiquidityHistory';
import getUniswapLiquidityHistory from './getUniswapLiquidityHistory';

//TODO: documentation: returns an array of history with prices
//TODO: in a consistent format that can be processed by the calcROI helper
async function getUserLiquidityHistory(trackedFields, field, receiptToken, userReceiptTokenTxs, userAccount) {
  const whitelist = createWhitelist(trackedFields, field);

  let liquidityHistory;

  //FIXME: shouldn't be field.name to avoid listing 22k pools - should be contract type
  switch (field.name) {

    //TODO: add the other Curves
    case "Curve: sUSD v2 pool":
      //@dev: this function contains a map with multiple calls to coinGecko, hence promise.all in main func
      liquidityHistory = await getCurveLiquidityHistory(field, receiptToken, userReceiptTokenTxs, userAccount, whitelist)
      break;
      
    case "Uni: MTA-wETH 50/50":
      console.log(' ---> hello!', field.name);
      liquidityHistory = await getUniswapLiquidityHistory(field, userReceiptTokenTxs, userAccount, whitelist)
      break;
  
    default:
      break;
  }
  return liquidityHistory;
}


function createWhitelist(trackedFields, field) {
  const whitelist = [];
  trackedFields.forEach(trackedField => {  
    trackedField.seedTokens.forEach(seedToken => {
      if (seedToken.tokenId === field.receiptToken) {
        //TODO: change DB top add withdraw in enum
        const depositAddresses = trackedField.contractAddresses.filter(address => address.addressTypes.includes('deposit' || 'withdraw'));
        depositAddresses.forEach(depositAddress => whitelist.push(depositAddress.address.toLowerCase()))
      }
    })
  })
  return whitelist;
}

export default getUserLiquidityHistory;
import apis from '../../../apis';
import getFarmingAPYs from './getFarmingAPYs';
import getEarningAPYs from './earningAPYs/getEarningAPYs';

async function getAPYs (userFields, userTokens, userTokenPrices) {

  const fieldsWithAPYs = [...userFields];

  for (let field of fieldsWithAPYs) {
    
    if (field.cropTokens.length) {
      field.farmingAPY = await getFarmingAPYs(field, userTokens, userTokenPrices);
    }

    //TODO: bulkfetch uniswap, etc. volumes from theGraph
    if (field.isEarning) {
      field.earningAPY = await getEarningAPYs(field, userTokens, userTokenPrices);
    }
  }

  return fieldsWithAPYs;
}

export default getAPYs;
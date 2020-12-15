import getFarmingAPYs from './farmingAPYs/getFarmingAPYs';
import getEarningAPYs from './earningAPYs/getEarningAPYs';

async function getAPYs (userFields, userTokens, userTokenPrices) {

  const fieldsWithAPYs = [...userFields];

  for (let field of fieldsWithAPYs) {
    
    if (field.cropTokens.length) {
      //@dev: farmingAPY is either a number or {combinedAPY, secondaryAPYs}
      field.farmingAPY = await getFarmingAPYs(field, userTokenPrices);
    }

    if (field.isEarning) {
      field.earningAPY = await getEarningAPYs(field, userTokens, userTokenPrices);
    }
  }

  return fieldsWithAPYs;
}

export default getAPYs;
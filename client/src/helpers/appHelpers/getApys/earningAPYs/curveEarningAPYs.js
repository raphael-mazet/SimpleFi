import apis from '../../../../apis/';
import curveRawStatsEPs from '../../../../data/fieldData/curveRawStatsEPs';

async function getCurveEarningAPY (field, userTokens, userTokenPrices) {
  const { name } = field;
  const latestAPYs = await apis.getAllCurvePoolRawAPY();
  console.log(' ---> latestAPYs', latestAPYs);
  const epKey = curveRawStatsEPs[name];
  return latestAPYs.apy.day[epKey];

}

export default getCurveEarningAPY;
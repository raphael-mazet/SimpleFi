import { getAllCurvePoolRawAPY } from './getRawCurvePoolData';
import curveRawStatsEPs from './curveRawStatsEPs';

async function getCurveEarningAPY (field, userTokens, userTokenPrices) {
  const { name } = field;
  const latestAPYs = await getAllCurvePoolRawAPY();
  const epKey = curveRawStatsEPs[name];
  return latestAPYs.apy.day[epKey];
}

export default getCurveEarningAPY;
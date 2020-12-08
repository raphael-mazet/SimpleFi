import {
  getUniswapPoolVolume,
  getUniswapBalanceHistory
} from './uniswapQueries/getUniswapGraphData';
import uniswapQueries from './uniswapQueries/uniswapGraphQueryStrings';
import {
  getOneCurvePoolRawData,
  getAllCurvePoolRawAPY
} from './curveQueries/getRawCurvePoolData';
import curveEPs from './curveQueries/curveRawStatsEPs'

//eslint-disable-next-line import/no-anonymous-default-export
export {
  getUniswapPoolVolume,
  getUniswapBalanceHistory,
  uniswapQueries,
  getOneCurvePoolRawData,
  getAllCurvePoolRawAPY,
  curveEPs
}
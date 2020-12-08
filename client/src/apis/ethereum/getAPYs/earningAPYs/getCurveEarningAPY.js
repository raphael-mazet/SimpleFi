import { getAllCurvePoolRawAPY, curveEPs } from '../../protocolQueries'

const { indivPoolEPs } = curveEPs

async function getCurveEarningAPY (field) {
  const { name } = field;
  const latestAPYs = await getAllCurvePoolRawAPY();
  const epKey = indivPoolEPs[name];
  return latestAPYs.apy.day[epKey];
}

export default getCurveEarningAPY;
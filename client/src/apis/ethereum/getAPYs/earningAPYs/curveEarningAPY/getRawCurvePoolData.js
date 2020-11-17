import curveRawStatsEPs from './curveRawStatsEPs';
import fetchRequest from '../../../../fetchRequest';

const curveMainEP = 'https://www.curve.fi/raw-stats/';
const indivPoolConcat = '-1440m.json';
const apyEP = 'apys.json';
const apyCache = [];

async function getOneCurvePoolRawData(name) {
  const path = curveRawStatsEPs[name] + indivPoolConcat;
  const allDaysPoolData = await fetchRequest(curveMainEP + path);
  return allDaysPoolData;
}

async function getAllCurvePoolRawAPY() {
  return apyCache.length ? apyCache : await fetchRequest(curveMainEP + apyEP)
}

export {
  getOneCurvePoolRawData,
  getAllCurvePoolRawAPY
} 
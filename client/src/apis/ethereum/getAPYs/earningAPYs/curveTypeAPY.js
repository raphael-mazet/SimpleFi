import curveRawStatsEPs from '../../../../data/fieldData/curveRawStatsEPs';
import fetchRequest from '../../../fetchRequest';

const curveMainEP = 'https://www.curve.fi/raw-stats/';
const indivPoolConcat = '-1440m.json';
const apyEP = 'apys.json';
const apyCache = [];

async function getOneDailyCurvePoolRawData(name) {
  const path = curveRawStatsEPs[name] + indivPoolConcat;
  const allDaysPoolData = await fetchRequest(curveMainEP + path);
  console.log(' ---> allDaysPoolData', name, allDaysPoolData);
  return allDaysPoolData;
}

async function getAllCurvePoolRawAPY() {
  return apyCache.length ? apyCache : await fetchRequest(curveMainEP + apyEP)
}

export {
  getOneDailyCurvePoolRawData,
  getAllCurvePoolRawAPY
} 
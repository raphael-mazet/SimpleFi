import curveEPs from './curveRawStatsEPs';
import fetchRequest from '../../../fetchRequest';

//TODO: add pool cache
const { curveMainEP, apyEP, indivPoolEPs, indivPoolConcat } = curveEPs
const apyCache = [];
const poolCache =[];

//this ep also used to get volume for all pools
async function getAllCurvePoolRawAPY() {
  return apyCache.length ? apyCache : await fetchRequest(curveMainEP + apyEP)
}

async function getOneCurvePoolRawData(name) {
  const path = indivPoolEPs[name] + indivPoolConcat;
  const allDaysPoolData = await fetchRequest(curveMainEP + path);
  return allDaysPoolData;
}

export {
  getOneCurvePoolRawData,
  getAllCurvePoolRawAPY
} 
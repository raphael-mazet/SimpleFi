import { getAllUserBalances } from './getUserBalances';
import getUnclaimedRewards from './getUnclaimedRewards';

//TODO: use this to simplify App.js
function getAllBasicBalances(userAccount, trackedTokens, trackedFields) {
  const tokenBalances = getAllUserBalances(userAccount, trackedTokens);
  const fieldBalances = getAllUserBalances(userAccount, trackedFields);
  const unclaimedRewards = getUnclaimedRewards(userAccount, trackedFields)
}

export default getAllBasicBalances;
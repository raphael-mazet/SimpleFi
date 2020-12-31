import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import getTokenPrices from './coinGecko/getTokenPrices';
import {
  getUserBalance,
  getAllUserBalances,
  getUnclaimedRewards,
  createBalanceContracts,
  rewinder,
  getAPYs,
  getUserTokenTransactions,
  getUserNormalTransactions,
  getROIs,
  uniswapQueries
} from './ethereum/index';

//eslint-disable-next-line import/no-anonymous-default-export
export default {
  getTokens,
  getUserFieldTokens,
  getFields,
  getTokenPrices,
  createBalanceContracts,
  getUserBalance,
  getAllUserBalances,
  getUnclaimedRewards,
  rewinder,
  getAPYs,
  getUserTokenTransactions,
  getUserNormalTransactions,
  getROIs,
  uniswapQueries
}
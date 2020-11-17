import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import getTokenPrices from './coinGecko/getTokenPrices';
import {
  getUserBalance,
  getAllUserBalances,
  createBalanceContracts,
  rewinder,
  getAPYs
} from './ethereum/index';

export default {
  getTokens,
  getUserFieldTokens,
  getFields,
  getTokenPrices,
  createBalanceContracts,
  getUserBalance,
  getAllUserBalances,
  rewinder,
  getAPYs
}
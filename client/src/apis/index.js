import { currentPrice, manyPrices } from './coinGecko/currentPrice';
import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import {
  getUserBalance,
  getAllUserBalances,
  createBalanceContracts,
  rewinder
} from './ethereum/index';

export default {
  currentPrice,
  manyPrices,
  getTokens,
  getUserFieldTokens,
  getFields,
  createBalanceContracts,
  getUserBalance,
  getAllUserBalances,
  rewinder
}
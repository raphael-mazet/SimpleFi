import { currentPrice, manyPrices } from './coinGecko/currentPrice';
import supportedCurrencies from './coinGecko/supportedCurrencies';
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
  supportedCurrencies,
  getTokens,
  getUserFieldTokens,
  getFields,
  createBalanceContracts,
  getUserBalance,
  getAllUserBalances,
  rewinder
}
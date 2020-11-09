import { currentPrice, manyPrices } from './coinGecko/currentPrice';
import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import {getUserBalance, getAllUserBalances} from './ethereum/getBalances';
import createBalanceContracts from './ethereum/contractCreator';
import rewinder from './ethereum/rewinder'

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
import { currentPrice, manyPrices } from './coinGecko/currentPrice';
import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import {getUserBalance, getAllUserBalances} from './ethereum/ethData';
import createContracts from './ethereum/contractCreator';
import rewinder from './ethereum/rewinder'

export default {
  currentPrice,
  manyPrices,
  getTokens,
  getUserFieldTokens,
  getFields,
  createContracts,
  getUserBalance,
  getAllUserBalances,
  rewinder
}
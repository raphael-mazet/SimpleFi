import { currentPrice } from './coinGecko/currentPrice';
import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import {createContracts, getUserBalance, getAllUserBalances} from './ethereum/ethData';
import rewinder from './ethereum/rewinder'

export default {
  currentPrice,
  getTokens,
  getUserFieldTokens,
  getFields,
  createContracts,
  getUserBalance,
  getAllUserBalances,
  rewinder
}
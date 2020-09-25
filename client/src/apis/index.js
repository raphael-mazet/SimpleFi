import { currentPrice } from './coinGecko/currentPrice';
import { getTokens, getUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import {createContracts, getUserBalance } from './ethereum/ethData'

export default {
  currentPrice,
  getTokens,
  getUserFieldTokens,
  getFields,
  createContracts,
  getUserBalance
}
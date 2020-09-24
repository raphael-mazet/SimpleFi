import { currentPrice } from './coinGecko/currentPrice';
import { getTokens, postUserFieldTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import { createContract, getUserBalance } from './ethereum/ethData'

export default {
  currentPrice,
  getTokens,
  postUserFieldTokens,
  getFields,
  createContract,
  getUserBalance
}
import { currentPrice } from './coinGecko/currentPrice';
import { getTokens } from './simpleFiDb/tokens';
import { getFields } from './simpleFiDb/fields';
import { createContract, getTokenBalance } from './ethereum/ethData'

export default {
  currentPrice,
  getTokens,
  getFields,
  createContract,
  getTokenBalance
}
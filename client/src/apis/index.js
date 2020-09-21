import { currentPrice } from './coinGecko/currentPrice';
import { getTokens } from './simpleFiDb/tokens';
import { createContract, getTokenBalance } from './ethereum/ethData'

export default {
  currentPrice,
  getTokens,
  createContract,
  getTokenBalance
}
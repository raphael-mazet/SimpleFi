import { currentPrice } from './coinGecko/currentPrice';
import { getTokens } from './simpleFiDb/tokens';
import { createContract, getBalance } from './ethereum/ethData'

export default {
  currentPrice,
  getTokens,
  createContract,
  getBalance
}
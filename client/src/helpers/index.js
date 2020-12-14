import {
  populateFieldTokensFromCache,
  addLockedTokenBalances,
  addUnclaimedBalances,
  addFieldSuppliesAndReserves,
  addStakedFieldBalances,
  addFieldInvestmentValues
} from './appHelpers'
import { combineTokenHoldings, addHoldingPrices, extractSummaryHoldingValues } from './myAssetsHelpers/tokenHelpers';
import { fieldSeparator } from './myAssetsHelpers/fieldHelpers';
import toggleDropdown from './myAssetsHelpers/dropdownHelper';
import {
  findFieldAddressType,
  combineFieldSuppliesAndReserves,
  sortLiquidityTxs,
  sortFarmingTxs,
  createWhitelist,
  calcROI,
  calcFarmingROI
} from './ethHelpers';
import extractTempFieldDetailsCells from './detailsTableHelper';
import urlStringSanitiser from './urlStringSanitiser';
import formatHeadlines from './summaryBoxHelper';

//eslint-disable-next-line import/no-anonymous-default-export
export default {
  populateFieldTokensFromCache,
  addUnclaimedBalances,
  addLockedTokenBalances,
  addFieldSuppliesAndReserves,
  addStakedFieldBalances,
  addFieldInvestmentValues,
  combineTokenHoldings,
  addHoldingPrices,
  extractSummaryHoldingValues,
  fieldSeparator,
  toggleDropdown,
  findFieldAddressType,
  combineFieldSuppliesAndReserves,
  sortLiquidityTxs,
  sortFarmingTxs,
  createWhitelist,
  calcROI,
  calcFarmingROI,
  extractTempFieldDetailsCells,
  urlStringSanitiser,
  formatHeadlines
}
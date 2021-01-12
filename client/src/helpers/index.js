import {
  populateFieldTokensFromCache,
  addLockedTokenBalances,
  addUnclaimedBalances,
  addFieldSuppliesAndReserves,
  addStakedFieldBalances,
  addFieldInvestmentValues,
  amendModal
} from './appHelpers'
import extractSummaryHoldingValues from './myAssetsHelpers/tokenHelpers';
import { extractSummaryFieldValues } from './myAssetsHelpers/fieldHelpers';
import toggleDropdown from './myAssetsHelpers/dropdownHelper';
import {
  findFieldAddressType,
  combineFieldSuppliesAndReserves,
  sortLiquidityTxs,
  sortFarmingTxs,
  createWhitelist,
  calcEarningROI,
  calcFarmingROI
} from './ethHelpers';
import extractTempFieldDetailsCells from './detailsTableHelper';
import urlStringSanitiser from './urlStringSanitiser';
import formatHeadlines from './summaryBoxHelper';
import {extractTotalTokenBalance} from './tokenDetailsHelper';
import {
  extractDetailsPieChartValues,
  extractDetailsBarChartValues,
  chartCallbacks
} from './detailsChartHelpers';
import calcCombinedROI from './earningFieldDetailsHelpers';

//eslint-disable-next-line import/no-anonymous-default-export
export default {
  populateFieldTokensFromCache,
  addUnclaimedBalances,
  addLockedTokenBalances,
  addFieldSuppliesAndReserves,
  addStakedFieldBalances,
  addFieldInvestmentValues,
  amendModal,
  extractSummaryHoldingValues,
  extractSummaryFieldValues,
  toggleDropdown,
  findFieldAddressType,
  combineFieldSuppliesAndReserves,
  sortLiquidityTxs,
  sortFarmingTxs,
  createWhitelist,
  calcEarningROI,
  calcFarmingROI,
  extractTempFieldDetailsCells,
  urlStringSanitiser,
  formatHeadlines,
  extractTotalTokenBalance,
  extractDetailsPieChartValues,
  extractDetailsBarChartValues,
  chartCallbacks,
  calcCombinedROI
}
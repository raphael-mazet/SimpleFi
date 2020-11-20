import {
  populateFieldTokensFromCache,
  addLockedTokenBalances,
  addFieldSuppliesAndReserves,
  addStakedFieldBalances,
} from './appHelpers'
import { combineTokenHoldings, addHoldingPrices } from './myAssetsHelpers/tokenHelpers';
import { fieldSeparator } from './myAssetsHelpers/fieldHelpers';
import toggleDropdown from './myAssetsHelpers/dropdownHelper';
import findFieldAddressType from './ethHelpers/findFieldAddressType';
import combineFieldSuppliesAndReserves from './ethHelpers/combineFieldSuppliesAndReserves';

//eslint-disable-next-line import/no-anonymous-default-export
export default {
  populateFieldTokensFromCache,
  addLockedTokenBalances,
  addFieldSuppliesAndReserves,
  addStakedFieldBalances,
  combineTokenHoldings,
  addHoldingPrices,
  fieldSeparator,
  toggleDropdown,
  findFieldAddressType,
  combineFieldSuppliesAndReserves
}
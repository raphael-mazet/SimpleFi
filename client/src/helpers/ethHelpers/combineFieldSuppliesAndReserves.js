function combineFieldSuppliesAndReserves (supplies, reserves) {
  let combinedBalances = [...supplies];

  for (let supply of combinedBalances) {
    const findFieldReserves = reserves.filter(reserve => reserve.fieldName === supply.fieldName)[0];
    supply.seedReserves = findFieldReserves.seedReserves;
  }

  return combinedBalances;
}

export default combineFieldSuppliesAndReserves;
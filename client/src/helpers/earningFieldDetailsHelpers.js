export default function calcCombinedROI(combinedFields) {
  const {earningField, farmingFields} = combinedFields;
  const investmentValue = earningField.earningROI.histInvestmentValue;
  const earningReturnValue = earningField.earningROI.absReturnValue;
  const farmingReturnValue = farmingFields.reduce((acc, curr) => acc + curr.farmingROI.absReturnValue, 0);
  const absReturnValue = earningReturnValue + farmingReturnValue;
  const combinedROI = absReturnValue / investmentValue;

  return ({roi: combinedROI, abs: absReturnValue})
}
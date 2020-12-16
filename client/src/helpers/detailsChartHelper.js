export default function extractDetailsChartValues(data, type) {
  console.log(' ---> data', data);
  console.log(' ---> type', type);
  console.log(' ---> type === token', type === 'token');
  const extractedValues = [];
  if (type === 'token') {
    const {userBalance, lockedBalance, unclaimedBalance} = data;
    console.log(' ---> userBalance', userBalance);
    extractedValues.push(['Available', userBalance]);
    lockedBalance && lockedBalance.forEach(lockedBalance => extractedValues.push([lockedBalance.field.name, lockedBalance.balance]));
    unclaimedBalance && unclaimedBalance.forEach(unclaimedBalance => extractedValues.push([unclaimedBalance.field.name, unclaimedBalance.balance]));
  }
  console.log(' ---> extractedValues', extractedValues);
  return extractedValues;
}
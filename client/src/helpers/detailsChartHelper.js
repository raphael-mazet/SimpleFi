export default function extractDetailsChartValues(data, type) {
  const extractedValues = [];
  if (type === 'token') {
    const {userBalance, lockedBalance, unclaimedBalance} = data;
    extractedValues.push(['Available', userBalance]);
    lockedBalance && lockedBalance.forEach(lockedBalance => extractedValues.push([lockedBalance.field.name, lockedBalance.balance]));
    unclaimedBalance && unclaimedBalance.forEach(unclaimedBalance => extractedValues.push([unclaimedBalance.field.name, unclaimedBalance.balance]));
  }
  return extractedValues;
}
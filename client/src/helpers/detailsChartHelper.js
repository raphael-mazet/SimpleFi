import pieChartColours from '../data/pieChartColours';

export default function extractDetailsChartValues(data, type) {
  const extractedValues = {data:[], labels: [], fill: []};
  let colourIndex = 0;

  if (type === 'token') {
    const {userBalance, lockedBalance, unclaimedBalance} = data;
    
    if (userBalance) {
      extractedValues.data.push([userBalance]);
      extractedValues.labels.push(['Available']);
      extractedValues.fill.push(pieChartColours[colourIndex]);
    }
    colourIndex++;

    lockedBalance && lockedBalance.forEach(lockedBalance => {
      extractedValues.data.push(Number(lockedBalance.balance.toFixed(2)));
      const lockedBalanceLabel = lockedBalance.via ? lockedBalance.via.name + ` (via ${lockedBalance.field.name})` : lockedBalance.field.name;
      extractedValues.labels.push(lockedBalanceLabel);
      if (colourIndex === pieChartColours.length) colourIndex = 0;
      extractedValues.fill.push(pieChartColours[colourIndex]);
      colourIndex++;
    });
    unclaimedBalance && unclaimedBalance.forEach(unclaimedBalance => {
      extractedValues.data.push(Number(unclaimedBalance.balance.toFixed(2)));
      extractedValues.labels.push('unclaimed from ' + unclaimedBalance.field.name);
      if (colourIndex === pieChartColours.length) colourIndex = 0;
      extractedValues.fill.push(pieChartColours[colourIndex]);
      colourIndex++;
    })
  }
  return extractedValues;
}
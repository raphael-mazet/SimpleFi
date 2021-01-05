import pieChartColours from '../data/pieChartColours';

export default function extractDetailsChartValues(data, type) {
  const extractedValues = {data:[], labels: [], fill: [], other:[]};
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

  if (type === 'farming') {
    const {unclaimed, claimed} = data;

    if (unclaimed.totalValue) {
      Object.entries(unclaimed).forEach(entry => {
        if (entry[0] !== 'totalValue') {
          extractedValues.data.push(Number(entry[1].valueUnclaimed.toFixed(2)));
          extractedValues.labels.push(`Unclaimed ${entry[0]}`);
          extractedValues.other.push(entry[1].amountUnclaimed.toFixed(2) + ' ' + entry[0]);
          extractedValues.fill.push(pieChartColours[colourIndex]);
          colourIndex++;
        }
      })
    }

    if (claimed.totalValue) {
      Object.entries(claimed).forEach(entry => {
        if (entry[0] !== 'totalValue') {
          extractedValues.data.push(Number(entry[1].valueClaimed.toFixed(2)));
          extractedValues.labels.push(`Claimed ${entry[0]}`);
          extractedValues.other.push(entry[1].amountClaimed.toFixed(2) + ' ' + entry[0]);
          extractedValues.fill.push(pieChartColours[colourIndex]);
          colourIndex++;
        }
      })
    }
  }

  if (type === 'earningAndFarming') {
    const {earningField, farmingFields} = data;

    if (earningField) {
      extractedValues.data.push(Number(earningField.earningROI.absReturnValue.toFixed(2)));
      extractedValues.labels.push(`main earnings (${earningField.name})`);
      extractedValues.fill.push(pieChartColours[colourIndex]);
      colourIndex++;
    }

    if (farmingFields.length) {
      farmingFields.forEach(farmingField => {
        extractedValues.data.push(Number(farmingField.farmingROI.absReturnValue.toFixed(2)));
        extractedValues.labels.push(`farming returns from ${farmingField.name})`);
        extractedValues.fill.push(pieChartColours[colourIndex]);
        colourIndex++;
      })
    }
  }
  
  return extractedValues;
}
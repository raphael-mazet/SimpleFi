import pieChartColours from '../../data/pieChartColours';

export default function extractDetailsBarChartValues(data, type) {
  const extractedValues = {data:[], labels: [], fill: [], other:[]};
  let colourIndex = 0;

  if (type === 'earningAndFarming') {
    const {earningField, farmingFields} = data;

    if (earningField) {
      extractedValues.data.push(Number(earningField.earningROI.absReturnValue.toFixed(2)));
      extractedValues.labels.push('This field');
      extractedValues.other.push({title: 'Core earnings', beforeBody: earningField.name});
      extractedValues.fill.push(pieChartColours[colourIndex]);
      colourIndex++;
    }

    if (farmingFields.length) {
      farmingFields.forEach(farmingField => {
        extractedValues.data.push(Number(farmingField.farmingROI.absReturnValue.toFixed(2)));
        extractedValues.labels.push(`Farming: ${farmingField.name.length >= 8 ? farmingField.name.slice(0, 5) + '...' : farmingField.name}`);
        extractedValues.other.push({title: 'Farming rewards', beforeBody: farmingField.name});
        extractedValues.fill.push(pieChartColours[colourIndex]);
        colourIndex++;
      })
    }
  }

  return extractedValues;
}
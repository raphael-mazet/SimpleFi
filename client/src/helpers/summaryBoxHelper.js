export default function formatHeadlines(tableName, headlines) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: 'percent',
    maximumFractionDigits: 1
  });

  const formattedHeadlines = [];
  let perfClasses = [];
  if (tableName === 'holding') {
    const {totalValue, totalInvested, totalUnclaimed} = headlines;
    formattedHeadlines.push(`${formatter.format(totalInvested / totalValue)} invested`);
    formattedHeadlines.push(`${formatter.format(totalUnclaimed / totalValue)} unclaimed`);
    perfClasses = [false, false];
  } else {
    let roiSign;
    if (headlines.ROI > 0) {
      roiSign = '+';
      perfClasses.push('green');
    } else if (headlines.ROI < 0) {
      roiSign = '-';
      perfClasses.push('red');
    } else {
      roiSign = '';
      perfClasses.push(null)
    }

    formattedHeadlines.push(`${roiSign}${formatter.format(headlines.ROI)}`);
    formattedHeadlines.push(`$${Number(headlines.investment?.toFixed()).toLocaleString()} invested`);
    perfClasses.push(null);
  }
  return {formattedHeadlines, perfClasses}
}
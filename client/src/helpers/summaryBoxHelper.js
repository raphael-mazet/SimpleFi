export default function formatHeadlines(tableName, headlines) {
  const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
  const formattedHeadlines = [];
  let perfClasses = [];
  if (tableName === 'holding') {
    // {totalInvested: 0, totalUnclaimed: 0, totalValue: 0}
    const {totalValue, totalInvested, totalUnclaimed} = headlines;
    formattedHeadlines.push(`${formatter.format(totalInvested / totalValue)} invested`);
    formattedHeadlines.push(`${formatter.format(totalUnclaimed / totalValue)} unclaimed`);
    perfClasses = [false, false];
  } else {
    formattedHeadlines.push('+20%');
    formattedHeadlines.push('15% locked');
    perfClasses = [true, false];
  }
  return {formattedHeadlines, perfClasses}
}
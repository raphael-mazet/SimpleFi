/**
 * @func extractRows
 * Takes a token object and returns row values
 * for the TokenTable
 * @param {object} document from the tokens collection
 * @returns {array} all values for the table row
 */
function extractRows (obj) {
  let row = [];
  row.push(obj.name);
  let amount, price, sold;
  amount = price = sold = 0;
  for (let tx of obj.transactions) {
    if (tx.bought) {
      amount += tx.amount;
      price += tx.amount * tx.price;
    } else {
      sold += tx.amount
    }
  }
  row.push(amount - sold);
  row.push(price/amount);
  return row;
}

export default { extractRows }
import React from 'react';
import TokenCell from "../../component/TokenCell";

/**
 * @func extractHoldings
 * Takes a token object and returns row values
 * for the TokenTable
 * @param {object} tokenDoc document from the tokens collection
 * @returns {array} all values for the table row
 * @dev shape: [<name>, <amount>, <price>]
 */
function extractHoldings (tokenDoc) {
  let row = [];
  row.push(tokenDoc.name);
  let amount, price, sold;
  amount = price = sold = 0;
  for (let tx of tokenDoc.transactions) {
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

/**
 * @func renderHoldings
 * Takes an array with extracted row values and returns
 * a map of cells for insertion in the TokenTable
 * @param {array} row values extracted from a token's document
 * @param {number} rowIndex index of current row for key
 * @returns {array} cell elements for the table row
 */

function renderHoldings (row, rowIndex) {
  return (
    row.map((cell, cellIndex) => (
      <TokenCell
        key={`${rowIndex}-${cellIndex}`}
        header={false}
        content={cell}/>  
    ))
  )
}

/**
 * @func rendercurrPrice
 * Takes current market prices and token details and
 * returns a cell with the current price for that token
 * @param {array} currPrices market prices of all user tokens
 * @param {array} row values extracted from a token's document
 * @returns {cell} single cell with current token price
 */
function renderCurrPrice (currPrices, row) {
  return (
    currPrices.filter(token => token.name === row[0])
    .map(token => (
      <TokenCell
        key={`${token.name}-currPrice`}
        header={false}
        content={token.currentPrice}/>
    ))
  )
}

function renderProfit (currPrices, row) {
  return (
    currPrices.filter(token => token.name === row[0])
    .map(token => (
      <TokenCell 
        key={`${token.name}-currProfit`}
        header={false}
        content={((token.currentPrice-row[2])*row[1]).toFixed(2)}/>
    ))
  )
}

export {
  extractHoldings,
  renderHoldings,
  renderCurrPrice,
  renderProfit
}
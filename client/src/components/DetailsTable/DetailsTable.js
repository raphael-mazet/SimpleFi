import React from 'react';
import './DetailsTable.css';
import externalLink from '../../assets/icons/external-link.svg';
import helpers from '../../helpers';

export default function DetailsTable({txHistory, name}) {
  const styleHeaders = ['date', 'action', 'value', 'balance', 'balance-value'];
  const columnHeaders = ['Date', 'Action', 'Value', 'Hist. balance', 'Balance value'];
  let balance = 0;

  function createCellValues(tempValues) {
    const cellValues = [...tempValues];
    let balMod = '';

    //set balance amount and modifier
    if (tempValues[3] === 'plus') {
      balance += tempValues[2];
      balMod = `➚ ${Number(tempValues[2].toFixed()).toLocaleString()}`;
    } else if (tempValues[3] === 'minus') {
      balance -= tempValues[2];
      balMod = `➘ ${tempValues[2].toFixed()}`;
    } else {
      balMod = '↔';
    }
    cellValues[3] = Number(balance.toFixed(2)).toLocaleString() + ` (${balMod})`;

    // @dev: pricePerReceiptToken is only used when there is a reward claim (txValue based on ppt, balance value based on pprt)
    const {pricePerToken, pricePerReceiptToken} = cellValues[4];
    
    cellValues[2] = Number((cellValues[2] * pricePerToken).toFixed(2)).toLocaleString(); //tx value
    
    //set hist. balance value
    if (pricePerReceiptToken) {
      cellValues[4] = Number((pricePerReceiptToken * balance).toFixed(2)).toLocaleString(); 
    } else {
      cellValues[4] = Number((pricePerToken * balance).toFixed(2)).toLocaleString();
    }

    return cellValues;
  }

  //TODO: add CSS hover-over explanations with ? icon
  return (
    <div className="field-details-tx-table">
      <div className="details-tx-table-headers">
        {columnHeaders.map((header) => {
          return (
            <div key={`${name}-${header}`} className="transaction-details-header">
              <h3>{header}</h3>
            </div>
          )
        })}
      </div>
      
      <div className="details-tx-table-rows">
        {txHistory.map((tx, txIndex) => {
          const tempCellValues = helpers.extractTempFieldDetailsCells(tx, balance);
          // @dev: returns [date, action, amount, effect-on-balance, {pricePerToken, pricePerReceiptToken}]
          const cellValues = createCellValues(tempCellValues)
          return (
            <div key={`${name}-${tx.tokenSymbol}-${txIndex}`} className="tx-table-single-row">
              {cellValues.map((value, index) => {
                return (
                  <div key={`${name}-${value}-${index}`} className={`transaction-details-cell transaction-details-${styleHeaders[index]}`}>
                    <p>{value}</p>
                  </div>
                )
              })}
              <div className={"transaction-details-cell transaction-details-link"}>
                <a href={`https://etherscan.io/tx/${tx.tx.hash}`} target="_blank" rel="noreferrer">
                  <img src={externalLink} alt={tx.tx.hash}/>
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )}
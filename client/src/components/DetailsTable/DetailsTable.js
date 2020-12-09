import React from 'react';
import './DetailsTable.css';
import externalLink from '../../assets/icons/external-link.svg';
import helpers from '../../helpers';

export default function DetailsTable({txHistory}) {
  const styleHeaders = ['date', 'action', 'value', 'balance', 'balance-value']
  const columnHeaders = ['Date', 'Action', 'Value', 'Hist. balance', 'Balance value']
  let balance = 0;

  function createCellValues(tempValues) {
    const cellValues = [...tempValues];
    let balMod = '';

    cellValues[2] = (cellValues[2] * cellValues[4]).toFixed(2);
    if (tempValues[3] === 'plus') {
      balance += tempValues[2];
      balMod = `➚ ${tempValues[2].toFixed()}`;
    } else if (tempValues[3] === 'minus') {
      balance -= tempValues[2];
      balMod = `➘ ${tempValues[2].toFixed()}`;
    } else {
      balMod = '↔';
    }
    cellValues[3] = balance.toFixed(2) + ` (${balMod})`;
    cellValues[4] = (cellValues[4] * balance).toFixed(2);
    return cellValues;
  }

  //TODO: add CSS hover-over explanations with ? icon
  //TODO: add (un)staking field for display / hover
  return (
    <div className="field-details-tx-table">
      <div className="details-tx-table-headers">
        {columnHeaders.map((header) => {
          return (
            <div className="transaction-details-header">
              <h3>{header}</h3>
            </div>
          )
        })}
      </div>
      
      <div className="details-tx-table-rows">
        {txHistory.map(tx => {
          const tempCellValues = helpers.extractTempFieldDetailsCells(tx, balance);
          // @dev: returns [date, action, amount, effect-on-balance, pricePerToken]
          const cellValues = createCellValues(tempCellValues)
          return (
            <div className="tx-table-single-row">
              {cellValues.map((value, index) => {
                return (
                  <div className={`transaction-details-cell transaction-details-${styleHeaders[index]}`}>
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
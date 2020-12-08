import React from 'react';
import './EarningFieldDetails.css';

export default function EarningFieldDetails ({name, userFields}) {
  
  const currentField = userFields.find(field => field.name === name);

  function txSorter (tx) {
    const { txIn, txOut, staked, unstaked} = tx;
    const display = {type: '', amount: 0};
    if (txIn) {
      display.type = 'accumulated';
      display.amount = txIn;
    } else if (txOut) {
      display.type = 'exited';
      display.amount = txOut;
    } else if (staked) {
      display.type = 'staked';
      display.amount = staked;
    } else if (unstaked) {
      display.type = 'unstaked';
      display.amount = unstaked;
    }
    return display;
  }


  return (
    <div className="field-details">
      <div className="field-details-titles">
        {/* TODO: quid fields both earning and farming? */}
        <h2 className="field-title">{name} {currentField.isEarning ? '(earning)' : '(farming)'}</h2>
        <p>Description: lorem ipsum dolor sit amet consectetuer</p>
        <p>Current nominal APY: {currentField.earningAPY ? (currentField.earningAPY*100).toFixed(2) : (currentField.farmingAPY*100).toFixed(2)}%</p>
      </div>
      <div className="field-details-numbers">
        <div className="field-roi">
          <h2>all time ROI</h2>
          <p>{(currentField.allTimeROI * 100).toFixed(2)}%</p>
          {/* TODO: breakdown ROI due to fee and underlying value */}
          <div className="field-roi-graph">Graph</div>
        </div>

        <div className="field-invested">
          <h2>Current value</h2>
          <p>${Number(currentField.investmentValue.toFixed()).toLocaleString()}</p>
          <div className="field-invested-graph">Pie chart and path</div>
        </div>
      </div>

      <div className="field-transactions">
        {currentField.userTxHistory.map(tx => {
          const txType = txSorter(tx)
          return (
            <div className="tx-date">
              <p> on {tx.txDate.toLocaleDateString()} you {txType.type} {txType.amount.toFixed(2)} at ${tx.pricePerToken.toFixed(2)} </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import React, {useEffect} from 'react';
import './EarningFieldDetails.css';
import DetailsTable from '../../components/DetailsTable/DetailsTable';

export default function EarningFieldDetails ({name, userFields}) {
  
  const currentField = userFields.find(field => field.name === name);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="field-details">
      <div className="field-details-titles">
        <h2 className="field-title">{name} {currentField.isEarning ? '(earning)' : '(farming)'}</h2>
        <p><span className='field-title-header'>Description</span>: lorem ipsum dolor sit amet consectetuer</p>
        <p><span className='field-title-header'>Current nominal APY</span>: {currentField.earningAPY ? (currentField.earningAPY*100).toFixed(2) : (currentField.farmingAPY*100).toFixed(2)}%</p>
        <p><span className='field-title-header'>Underlying tokens</span>: {currentField.seedTokens.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
      </div>

      <div className="field-details-numbers">
        <div className="field-overview field-roi">
          <h2>all time ROI</h2>
          <p>{(currentField.allTimeROI * 100).toFixed(2)}%</p>
          {/* TODO: breakdown ROI due to fee and underlying value */}
          <div className="field-roi-graph">Graph</div>
        </div>

        <div className="field-overview field-invested">
          <h2>Current value</h2>
          <p>${Number(currentField.investmentValue.toFixed()).toLocaleString()}</p>
          <div className="field-invested-graph">Pie chart and path</div>
        </div>
      </div>

      <div className="field-transactions">
        <h2>Transaction history</h2>
        <div className="field-transactions-table">
          <DetailsTable txHistory={currentField.userTxHistory}/>
        </div>
      </div>
    </div>
  )
}

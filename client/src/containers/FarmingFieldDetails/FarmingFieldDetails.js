import React, {useEffect} from 'react';
import './FarmingFieldDetails.css';
import DetailsTable from '../../components/DetailsTable/DetailsTable';

//TODO: identify joint components with EarningFieldDetails container
/* @dev: differences with EarningFieldDetails:
      - additional const underlyingTokens and corresponding field-title-header
      - additional stakingtoken field-title-header
      - currentField.userFarmingTxHistory passed as prop to DetailsTable instead of userTxHistory
*/

export default function FarmingFieldDetails({name, userFields}) {
  const currentField = userFields.find(field => field.name === name);
  //@dev: assumes there is a single seed/staking token
  const underlyingTokens = userFields.find(userField => userField.receiptToken === currentField.seedTokens[0].tokenId).seedTokens;
  const mainAPY = currentField.farmingAPY.primaryAPY ? `${(currentField.farmingAPY.primaryAPY.APY * 100).toFixed(2)}% (${currentField.farmingAPY.primaryAPY.name})` : `${(currentField.farmingAPY * 100).toFixed(2)}% (${currentField.cropTokens[0].name})`;
  const secondaryFarmingTokens = currentField.farmingAPY.secondaryAPYs ? currentField.farmingAPY.secondaryAPYs : null;
  console.log(' ---> currentField.name', currentField.name);
  console.log(' ---> currentField', currentField);
  console.log(' ---> secondaryFarmingTokens', secondaryFarmingTokens);
  let secondaryAPYs;
  if (secondaryFarmingTokens) {
    secondaryAPYs = secondaryFarmingTokens.reduce((acc, curr) => `${acc} ${(curr.cropAPY * 100).toFixed(2)}% (${curr.cropToken.name}), `, '').slice(0, -2); 
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div className="field-details">
      <div className="field-details-titles">
        <h2 className="field-title">{name} (farming)</h2>
        <p><span className='field-title-header'>Description</span>: lorem ipsum dolor sit amet consectetuer</p>
        <p><span className='field-title-header'>Current nominal APY</span>: {secondaryFarmingTokens ? mainAPY + ', ' + secondaryAPYs : mainAPY}</p>
        {/* @dev: assumes there is a single staking token */}
        <p><span className='field-title-header'>Staking token</span>: {currentField.seedTokens[0].name}</p>
        <p><span className='field-title-header'>Underlying tokens</span>: {underlyingTokens.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
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
          <DetailsTable txHistory={currentField.userFarmingTxHistory} name={name}/>
        </div>
      </div>
    </div>
  )
}
import React, {useState, useEffect} from 'react';
import './FarmingFieldDetails.css';
import DetailsChart from '../../components/DetailsChart/DetailsChart';
import DetailsTable from '../../components/DetailsTable/DetailsTable';
import ToggleWidget from '../../components/ToggleWidget/ToggleWidget';

//TODO: identify joint components with EarningFieldDetails container
/* @dev: differences with EarningFieldDetails:
      - additional const underlyingTokens and corresponding field-title-header
      - additional stakingtoken field-title-header
      - currentField.userFarmingTxHistory passed as prop to DetailsTable instead of userTxHistory
*/

export default function FarmingFieldDetails({name, userFields}) {

  const [currentField] = useState(userFields.find(field => field.name === name));
  const [underlyingTokens, setUnderlyingTokens] = useState([]);
  const [mainAPY, setMainAPY] = useState(0);
  const [secondaryFarmingTokens, setSecondaryFarmingTokens] = useState(null);
  const [secondaryAPYs, setSecondaryAPYs] = useState(null);
  const [lockedValue, setLockedValue] = useState({title: 'Curr.', value: Number(currentField.investmentValue.toFixed()).toLocaleString()});

  //@dev: assumes there is a single seed/staking token
  useEffect(() => {
    window.scrollTo(0, 0);
    setUnderlyingTokens(userFields.find(userField => userField.receiptToken === currentField.seedTokens[0].tokenId).seedTokens);
    setMainAPY(currentField.farmingAPY.primaryAPY ? `${(currentField.farmingAPY.primaryAPY.APY * 100).toFixed(2)}% (${currentField.farmingAPY.primaryAPY.name})` : `${(currentField.farmingAPY * 100).toFixed(2)}% (${currentField.cropTokens[0].name})`);
    const tempSecondaryFarmingTokens = currentField.farmingAPY.secondaryAPYs ? currentField.farmingAPY.secondaryAPYs : null;
    if (tempSecondaryFarmingTokens) {
      setSecondaryFarmingTokens(tempSecondaryFarmingTokens);
      setSecondaryAPYs(tempSecondaryFarmingTokens.reduce((acc, curr) => `${acc} ${(curr.cropAPY * 100).toFixed(2)}% (${curr.cropToken.name}), `, '').slice(0, -2))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentField]);

  function toggleFarmingLocked(e) {
    console.log(' ---> e.target.checked', e.target.checked);
    if (e.target.checked) {
      setLockedValue(prev => ({
          title: 'Avg',
          value: Number(currentField.farmingROI.avgInvestment.toFixed()).toLocaleString()
      }))
    } else {
      setLockedValue(prev => ({
        title: 'Curr.',
        value: Number(currentField.investmentValue.toFixed()).toLocaleString()
      }))
    }
  }

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
     
      <div className="farming-details-overviews">
        <div className="farming-details-numbers">
          <div className="farming-overview field-roi">
            <h2>all time ROI</h2>
            <p>{(currentField.farmingROI.allTimeROI * 100).toFixed(2)}%</p>
          </div>

          <div className="farming-overview field-invested">
            <h2>{lockedValue.title} investment</h2>
            <p>${lockedValue.value}</p>
            <div className="farming-locked-toggle">
              <p>curr.</p>
              <ToggleWidget handleChange={toggleFarmingLocked} />
              <p>avg</p>
            </div>
          </div>
        </div>

        <div className="farming-source-container">
            <h2>Source of ROI</h2>
          <div className="farming-source-chart">
            <DetailsChart data={currentField.farmingROI} type='farming'/>
          </div>
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
import React, {useState, useEffect} from 'react';
import './FarmingFieldDetails.css';
import DetailsPieChart from '../../components/DetailsPieChart/DetailsPieChart';
import DetailsTable from '../../components/DetailsTable/DetailsTable';
import MiniToggle from '../../components/MiniToggle/MiniToggle';

//TODO: identify joint components with EarningFieldDetails container

export default function FarmingFieldDetails({name, userFields}) {

  const [currentField] = useState(userFields.find(field => field.name === name));
  const [underlyingTokens, setUnderlyingTokens] = useState([]);
  const [mainAPY, setMainAPY] = useState(0);
  const [secondaryFarmingTokens, setSecondaryFarmingTokens] = useState(null);
  const [secondaryAPYs, setSecondaryAPYs] = useState(null);
  const [lockedValue, setLockedValue] = useState({title: 'Current', value: Number(currentField.investmentValue.toFixed()).toLocaleString()});
  const [ROIValue, setROIValue] = useState({title: 'Total ROI', value: `${(currentField.farmingROI.allTimeROI * 100).toFixed(2)}%`});

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
    if (e.target.checked) {
      setLockedValue(prev => ({
          title: 'Average historic',
          value: Number(currentField.farmingROI.avgInvestment.toFixed()).toLocaleString()
      }))
    } else {
      setLockedValue(prev => ({
        title: 'Current',
        value: Number(currentField.investmentValue.toFixed()).toLocaleString()
      }))
    }
  }

  function toggleFarmingROI(e) {
    if (e.target.checked) {
      setROIValue(prev => ({
          title: 'Total reward value',
          value: `$${Number(currentField.farmingROI.absReturnValue.toFixed(2)).toLocaleString()}`
      }))
    } else {
      setROIValue(prev => ({
        title: 'Total ROI',
        value: `${(currentField.farmingROI.allTimeROI * 100).toFixed(2)}%`
      }))
    }
  }

  return (
    <div className="field-details">
      <div className="field-details-titles">
        <h2 className="field-title">{name} (farming)</h2>
        <p><span className='field-title-header'>Current nominal APY</span>: {secondaryFarmingTokens ? mainAPY + ', ' + secondaryAPYs : mainAPY}</p>
        {/* @dev: assumes there is a single staking token */}
        <p><span className='field-title-header'>Staking token</span>: {currentField.seedTokens[0].name}</p>
        <p><span className='field-title-header'>Underlying tokens</span>: {underlyingTokens.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
      </div>
     
      <div className="farming-details-overviews">
        <div className="farming-details-numbers">
          <div className="farming-overview field-roi">
            <h2>{ROIValue.title}</h2>
            <p>{ROIValue.value}</p>
            <MiniToggle before='%' after='$' handleChange={toggleFarmingROI} />
          </div>

          <div className="farming-overview field-invested">
            <h2>{lockedValue.title} <br/> investment value</h2>
            <p>${lockedValue.value}</p>
            <MiniToggle before='curr.' after='hist.' handleChange={toggleFarmingLocked} />
          </div>
        </div>

        <div className="farming-source-container">
            <h2>Source of ROI</h2>
          <div className="farming-source-chart">
            <DetailsPieChart data={currentField.farmingROI} type='farming'/>
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
import React, { useEffect, useState, useRef } from 'react';
import './EarningFieldDetails.css';
import DetailsTable from '../../components/DetailsTable/DetailsTable';
import DetailsBarChart from '../../components/DetailsBarChart/DetailsBarChart';
import MaxiToggle from '../../components/MaxiToggle/MaxiToggle';
import helpers from '../../helpers';

export default function EarningFieldDetails ({name, userFields}) {
  
  const [currentField, setCurrentField] = useState(userFields.find(field => field.name === name));
  const [farmingFields, setFarmingFields] = useState([]);
  const [combinedfields, setCombinedFields] = useState({currentField: null, farmingFields: []});
  const [combinedROI, setCombinedROI] = useState({roi: 0, abs: 0});
  const [combinedFlag, setCombinedFlag] = useState(false);
  const combinedGraph = useRef(null);

  function toggleCombinedROI(e) {
    const graphStyle = combinedGraph.current.style;
    if (e.target.checked) {
      setCombinedFlag(true);
      graphStyle.display = 'flex';
      graphStyle.animation = 'growDown 300ms ease-in-out forwards';
    } else {
      setCombinedFlag(false);
      graphStyle.animation = 'shrinkUp 300ms ease-in-out forwards';
      setTimeout(() => graphStyle.display = 'none', 300);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    const targetFarms = userFields.filter(field => field.seedTokens[0].tokenId === currentField.receiptToken)
    setFarmingFields(targetFarms);
    setCombinedFields({earningField: currentField, farmingFields: targetFarms});
    setCombinedROI(helpers.calcCombinedROI({earningField: currentField, farmingFields: targetFarms}));
  }, [currentField]) //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="field-details">
      <div className="field-details-titles">
        <h2 className="field-title">{name} {currentField.isEarning ? '(earning)' : '(farming)'}</h2>
        <p><span className='field-title-header'>Parent protocol:</span>{currentField.protocol.name}</p>
        <p><span className='field-title-header'>Current nominal APY:</span>{currentField.earningAPY ? (currentField.earningAPY*100).toFixed(2) : (currentField.farmingAPY*100).toFixed(2)}%</p>
        <p><span className='field-title-header'>Underlying tokens:</span>{currentField.seedTokens.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
        <p><span className='field-title-header'>Linked farming fields:</span>{farmingFields.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
      </div>

      <div className="earning-details-toggle-roi">
        <h3>Add farming ROI</h3>
        <MaxiToggle handleChange={toggleCombinedROI}/>
      </div>

      <div className="field-details-numbers">
        <div className="field-overview field-roi">
          <h2>Total ROI</h2>
          <p>{!combinedFlag ? (currentField.earningROI.allTimeROI * 100).toFixed(2) : (combinedROI.roi * 100).toFixed(2)}%</p>
        </div>

        <div className="field-overview field-invested">
          <h2>Investment value</h2>
          <p>${Number(currentField.investmentValue.toFixed()).toLocaleString()}</p>
        </div>
      </div>

      <div ref={combinedGraph} className="field-details-combined-roi">
        <h2>Combined earning and Farming returns</h2>
        <div className="combined-roi-earnings-chart">
          <DetailsBarChart data={combinedfields} type='earningAndFarming'/>
        </div>
      </div>

      <div className="field-transactions">
        <h2>Transaction history</h2>
        <div className="field-transactions-table">
          <DetailsTable txHistory={currentField.userTxHistory} name={name}/>
        </div>
      </div>
    </div>
  )
}

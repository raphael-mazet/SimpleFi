import React, { useEffect, useState, useRef } from 'react';
import './EarningFieldDetails.css';
import DetailsTable from '../../components/DetailsTable/DetailsTable';
import DetailsBarChart from '../../components/DetailsBarChart/DetailsBarChart';
import MaxiToggle from '../../components/MaxiToggle/MaxiToggle';
import MiniToggle from '../../components/MiniToggle/MiniToggle';
import helpers from '../../helpers';

export default function EarningFieldDetails ({name, userFields, history}) {
  const [currentField] = useState(userFields.find(field => field.name === name));
  const [farmingFields, setFarmingFields] = useState([]);
  const [combinedfields, setCombinedFields] = useState({currentField: null, farmingFields: []});
  const [combinedROI, setCombinedROI] = useState({roi: 0, abs: 0});
  const [combinedFlag, setCombinedFlag] = useState(false);
  const [displayAbsROIValue, setDisplayAbsROIValue] = useState(false);
  const [displayHistInv, setDisplayHistInv] = useState(false);
  const [ROIValue, setROIValue] = useState({title: 'Total ROI', value: '0%'});
  const [invValue, setInvValue] = useState({title: 'Current', value: '$0'})
  const roiRef = useRef(null);
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

    roiRef.current.className = 'roi-pulse';
    setTimeout(() => roiRef.current.className = '', 300)
  }

  function toggleDisplay(e, target) {
    if (e.target.checked) {
      target === 'roi' ? setDisplayAbsROIValue(true) : setDisplayHistInv(true);
    } else {
      target === 'roi' ? setDisplayAbsROIValue(false) : setDisplayHistInv(false);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (name) {
      const targetFarms = userFields.filter(field => field.seedTokens[0].tokenId === currentField.receiptToken)
      setFarmingFields(targetFarms);
      setCombinedFields({earningField: currentField, farmingFields: targetFarms});
      setCombinedROI(helpers.calcCombinedROI({earningField: currentField, farmingFields: targetFarms}));
    }
  }, [currentField]) //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (name) {
      if (displayAbsROIValue) {
        if (combinedFlag) {
          setROIValue({title: 'Total return value', value: '$' + Number(combinedROI.abs.toFixed()).toLocaleString()})
        } else {
          setROIValue({title: 'Total return value', value: '$' + Number(currentField.earningROI.absReturnValue.toFixed()).toLocaleString()})
        }
      } else {
        if (combinedFlag) {
          setROIValue({title: 'Total ROI', value: (combinedROI.roi * 100).toFixed(2) + '%'})
        } else {
          setROIValue({title: 'Total ROI', value: (currentField.earningROI.allTimeROI * 100).toFixed(2) + '%'})
        }
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayAbsROIValue, combinedFlag])

  useEffect(() => {
    if (name) {
      if (displayHistInv) {
        setInvValue({title: 'Average historic', value: '$' + Number(currentField.earningROI.histInvestmentValue.toFixed()).toLocaleString()})
      } else {
        setInvValue({title: 'Current', value: '$' + Number(currentField.investmentValue.toFixed()).toLocaleString()})
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayHistInv])

  if (!name) {
    history.push('/dashboard');
    return (<></>)
  }

  return (
    <div className="field-details">
      <div className="field-details-titles">
        <h2 className="field-title">{name} {currentField.isEarning ? '(earning)' : '(farming)'}</h2>
        <p><span className='field-title-header'>Parent protocol:</span>{currentField.protocol.name}</p>
        <p><span className='field-title-header'>Current nominal APY:</span>{currentField.earningAPY ? (currentField.earningAPY*100).toFixed(2) : (currentField.farmingAPY*100).toFixed(2)}%</p>
        <p><span className='field-title-header'>Underlying tokens:</span>{currentField.seedTokens.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
        <p><span className='field-title-header' style={{display: !farmingFields.length && 'none'}}>Linked farming fields:</span>{farmingFields.reduce((acc, curr) => [...acc, curr.name], []).join(', ')}</p>
      </div>

      <div className="earning-details-toggle-roi" style={{display: !farmingFields.length && 'none'}}>
        <h3>Add farming ROI</h3>
        <MaxiToggle handleChange={toggleCombinedROI}/>
      </div>

      <div className="field-details-numbers">
        <div className="field-overview field-roi">
          <h2>{ROIValue.title}</h2>
          <p ref={roiRef}>{ROIValue.value}</p>
          <MiniToggle before='%' after='$' handleChange={e => toggleDisplay(e, 'roi')} />
        </div>

        <div className="field-overview field-invested">
          <h2>{invValue.title}  <br/> investment value</h2>
          <p>{invValue.value}</p>
          <MiniToggle before='curr.' after='hist.' handleChange={e => toggleDisplay(e, 'inv')} />
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

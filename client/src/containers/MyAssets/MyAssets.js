import React, { useState, useEffect } from 'react';
import './MyAssets.css';
import OverviewCard from '../../components/OverViewCard/OverviewCard';
import SummaryTable from '../../components/SummaryTable/SummaryTable';
import DropdownButton from '../../components/DropdownButton/DropdownButton';
import helpers from '../../helpers/index';
import { holdingHeaders, holdingCurrencyCells, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userFields, userTokenPrices}) {
  const [holdingValues, setHoldingValues] = useState([]);
  const [farmingValues, setFarmingValues] = useState([]);
  const [earningValues, setEarningValues] = useState([]);
  const [totalAssets, setTotalAssets] = useState(25423);
  const [totalInvested, setTotalInvested] = useState(15200);
  const [dropdown, setDropdown] = [];

  // combine available & locked token balances and add prices from coinGecko
  useEffect(() => {
    // if setSplash
    const combinedHoldings = helpers.combineTokenHoldings(userTokens);
    const holdingsWithPrices = helpers.addHoldingPrices(combinedHoldings, userTokenPrices);
    setHoldingValues(holdingsWithPrices);
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userTokenPrices])

  // separate farming and earning fields
  useEffect(() => {
    const {farmingFields, earningFields} = helpers.fieldSeparator(userFields);
    setFarmingValues(farmingFields);
    setEarningValues(earningFields);
  }, [userFields])

  function handleDropdown(e, className) {
    e.preventDefault();
    console.log(' ---> e', e);
    // setDropdown(prev => [...prev, className]);
    const targetTable = document.getElementById(className);
    targetTable.style.display = 'none';
    console.log(' ---> targetTable', targetTable);
    console.log(' ---> targetTable.style', targetTable.style);
    if (targetTable.style.display === 'none') {
      console.log('hi');
      targetTable.style.display = 'block';
      targetTable.style.animation = 'growDown 300ms ease-in-out forwards';
    }
    console.log('hi out');
    // } else {
    //   targetTable.style.animation = 'shrinkUp 300ms ease-in-out forwards';
    //   // targetTable.style.display = 'none';
    // //   targetTable.style.opacity = 0;
    // }
  }

  return (
    <div className="myassets-summary">
      <div className="summary-overview-cards-container">
        <OverviewCard title='Total assets' amount={totalAssets.toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
        <OverviewCard title='Total invested' amount={totalInvested.toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
      </div>

      <div className="summary-container summary-holding">
        <div className="summary-container-header">
          <h2>Holding: {holdingValues.reduce((acc, curr) => acc + Math.floor(Number(curr[4])), 0)}</h2>
          <DropdownButton handleDropdown={handleDropdown} tableClass='holding-table'/>
        </div>
        <div id='holding-table' className="summary-container-table">
          <SummaryTable headers={holdingHeaders} userValues={holdingValues} tableName={'holding'} currencyCells={holdingCurrencyCells}/>
        </div>
      </div>

      <div className="summary-container summary-farming">
        <div className="container-header">
          <h2>Farming</h2>
        </div>
        <SummaryTable headers={farmingHeaders} userValues={farmingValues} tableName={'farming'} currencyCells={[]}/>
      </div>

      <div className="summary-container summary-earning">
        <div className="container-header">
          <h2>Earning</h2>
        </div>
        <SummaryTable headers={earningHeaders} userValues={earningValues} tableName={'earning'} currencyCells={[]}/>
      </div>
    </div>
  )
}
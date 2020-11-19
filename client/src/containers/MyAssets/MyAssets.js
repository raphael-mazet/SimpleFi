import React, { useState, useEffect, useRef } from 'react';
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
  const holdingTable = useRef(null);
  const farmingTable = useRef(null);
  const earningTable = useRef(null);

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

  return (
    <div className="myassets-summary">
      <div className="summary-overview-cards-container">
        <OverviewCard title='Total assets' amount={totalAssets.toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
        <OverviewCard title='Total invested' amount={totalInvested.toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
      </div>

      <div className="summary-container summary-holding">
        <div className="container-header">
          <h2>Holding</h2>
          <div className="dropdown-button-wrapper">
            <DropdownButton handleDropdown={helpers.toggleDropdown} tableRef={holdingTable}/>
          </div>
        </div>
        <div ref={holdingTable} className="summary-table-container">
          <SummaryTable headers={holdingHeaders} userValues={holdingValues} tableName={'holding'} currencyCells={holdingCurrencyCells}/>
        </div>
      </div>

      <div className="summary-container summary-farming">
        <div className="container-header">
          <h2>Farming</h2>
          <div className="dropdown-button-wrapper">
            <DropdownButton handleDropdown={helpers.toggleDropdown} tableRef={farmingTable}/>
          </div>
        </div>
        <div ref={farmingTable} className="summary-table-container">
          <SummaryTable headers={farmingHeaders} userValues={farmingValues} tableName={'farming'} currencyCells={[]}/>
        </div>
      </div>

      <div className="summary-container summary-earning">
        <div className="container-header">
          <h2>Earning</h2>
          <div className="dropdown-button-wrapper">
            <DropdownButton handleDropdown={helpers.toggleDropdown} tableRef={earningTable}/>
          </div>
        </div>
        <div ref={earningTable} className="summary-table-container">
          <SummaryTable headers={earningHeaders} userValues={earningValues} tableName={'earning'} currencyCells={[]}/>
        </div>
      </div>
    </div>
  )
}
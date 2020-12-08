import React, { useState, useEffect } from 'react';
import './MyAssets.css';
import OverviewCard from '../../components/OverViewCard/OverviewCard';
import SummaryBox from '../../components/SummaryBox/SummaryBox';
import helpers from '../../helpers/index';
import { holdingHeaders, holdingCurrencyCells, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userFields, userTokenPrices, setCurrentDetail}) {
  const [holdingValues, setHoldingValues] = useState([]);
  const [farmingValues, setFarmingValues] = useState([]);
  const [earningValues, setEarningValues] = useState([]);
  const [totalAssets, setTotalAssets] = useState('Loading');
  const [totalInvested, setTotalInvested] = useState('Loading');

  // combine available & locked token balances and add prices from coinGecko
  useEffect(() => {
    // if setSplash
    const combinedHoldings = helpers.combineTokenHoldings(userTokens);
    const holdingsWithPrices = helpers.addHoldingPrices(combinedHoldings, userTokenPrices);
    setHoldingValues(holdingsWithPrices.combinedHoldings);
    setTotalAssets(holdingsWithPrices.totalAssets);
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userTokenPrices])

  // separate farming and earning fields
  useEffect(() => {
    const {farmingFields, earningFields, totalInvested } = helpers.fieldSeparator(userFields);
    setFarmingValues(farmingFields);
    setEarningValues(earningFields);
    setTotalInvested(totalInvested)
  }, [userFields])

  return (
    <div className="myassets-summary">
      <div className="summary-overview-cards-container">
        <OverviewCard title='Total assets' amount={totalAssets.toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
        <OverviewCard title='Cumulative investments' amount={totalInvested.toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
      </div>

      <div className="account-overview">
        <h1>Account overview</h1>
      </div>

      <div className="summary-container summary-holding">
        <SummaryBox userValues={holdingValues} headers={holdingHeaders} tableName='holding' currencyCells={holdingCurrencyCells} setCurrentDetail={setCurrentDetail}/>
      </div>

      <div className="summary-container summary-farming">
        <SummaryBox userValues={farmingValues} headers={farmingHeaders} tableName='farming' currencyCells={[]} setCurrentDetail={setCurrentDetail}/>
      </div>

      <div className="summary-container summary-earning">
      <SummaryBox userValues={earningValues} headers={earningHeaders} tableName='earning' currencyCells={[]} setCurrentDetail={setCurrentDetail}/>  
      </div>
    </div>
  )
}
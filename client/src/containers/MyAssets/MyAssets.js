import React, { useState, useEffect } from 'react';
import './MyAssets.css';
import SummaryTable from '../../components/SummaryTable/SummaryTable';
import helpers from '../../helpers/index';
import { holdingHeaders, holdingCurrencyCells, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userFields, setSplash}) {
  const [holdingValues, setHoldingValues] = useState([]);
  const [farmingValues, setFarmingValues] = useState([]);
  const [earningValues, setEarningValues] = useState([]);

  useEffect(() => {
    setSplash(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // combine available & locked token balances and add prices from coinGecko
  useEffect(() => {
    const combinedHoldings = helpers.combineTokenHoldings(userTokens);

    helpers.addHoldingPrices(combinedHoldings)
      .then(holdingsWithPrices => setHoldingValues(holdingsWithPrices))

  }, [userTokens])

  // separate farming and earning fields
  useEffect(() => {
    const {farmingFields, earningFields} = helpers.fieldSeparator(userFields);
    setFarmingValues(farmingFields);
    setEarningValues(earningFields);
  }, [userFields])

  return (
    <div className="myassets-summary">
      <div className="summary-container summary-holding">
        <h2>Holding</h2>
        <SummaryTable headers={holdingHeaders} userValues={holdingValues} tableName={'holding'} currencyCells={holdingCurrencyCells}/>
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
      {/* <div className="summary-earning">
        <h2>Earning</h2>
        <SummaryTable headers={earningHeaders}/>
      </div> */}
    </div>
  )
}
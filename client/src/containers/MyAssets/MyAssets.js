import React, { useState, useEffect } from 'react';
import './MyAssets.css';
import SummaryTable from '../../components/SummaryTable/SummaryTable';
import helpers from '../../helpers/index';
import { holdingHeaders, holdingCurrencyCells, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userFields, apis, setSplash}) {
  const [holdingValues, setHoldingValues] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);
  const [priceApis, setPriceApis] = useState([]);

  useEffect(() => setSplash(true), []);

  // extract ref for price query at coingecko
  useEffect(() => {
    const combinedHoldings = helpers.combineHoldings(userTokens);
    helpers.addHoldingPrices(combinedHoldings)
      .then(holdingsWithPrices => setHoldingValues(holdingsWithPrices))

  }, [userTokens])

  useEffect(() => {
    const tempFieldValues = [];
    userFields.forEach(field => {
      const { name, balance, seedTokens, cropTokens} = field;
      let underlying = '';
      let farming = '';
      //TODO: get token name from cache
      seedTokens && seedTokens.forEach(token => underlying += `${token.name}, `);
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      underlying = underlying.slice(0, -2);
      farming = farming.slice(0, -2);
      tempFieldValues.push([name, balance.toFixed(2), underlying, farming]);
    })
    setFieldValues(tempFieldValues)
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
        <SummaryTable headers={farmingHeaders} userValues={fieldValues} tableName={'farming'} currencyCells={[]}/>
      </div>
      {/*TODO: add tokens earning table*/}
      {/* <div className="summary-earning">
        <h2>Earning</h2>
        <SummaryTable headers={earningHeaders}/>
      </div> */}
    </div>
  )
}
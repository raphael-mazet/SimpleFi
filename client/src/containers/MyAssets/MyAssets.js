import React, { useState, useEffect } from 'react';
import SummaryTable from '../../components/SummaryTable/SummaryTable'
import { holdingHeaders, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userAccount, userFields}) {

  const [holdingValues, setHoldingValues] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);

  useEffect(() => {
    userTokens.forEach(token => {
      setHoldingValues(holdingValues => [...holdingValues, [token.name, token.balance, '-', token.currentPrice, '-']]);
    })
  }, [userTokens])

  useEffect(() => {
    userFields.forEach(field => {
      const { name, balance, seedTokens, cropTokens} = field;
      console.log(' ---> seedTokens', seedTokens);
      let underlying = '';
      let farming = '';
      seedTokens && seedTokens.forEach(token => underlying += `${token.name}, `);
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      underlying = underlying.slice(0, -2);
      farming += farming.slice(0, -2);
      setFieldValues(fieldValues => [...fieldValues, [name, balance, underlying, farming]])
    })
  }, [userFields])

  return (
    <div className="myassets-summary">
      <div className="summary-holding">
        <h2>Holding</h2>
        <SummaryTable headers={holdingHeaders} userValues={holdingValues}/>
      </div>
      <div className="summary-farming">
        <h2>Farming</h2>
        <SummaryTable headers={farmingHeaders} userValues={fieldValues}/>
      </div>
      {/* <div className="summary-earning">
        <h2>Earning</h2>
        <SummaryTable headers={earningHeaders}/>
      </div> */}
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import SummaryTable from '../../components/SummaryTable/SummaryTable'
import { holdingHeaders, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userFields}) {

  const [holdingValues, setHoldingValues] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);

  useEffect(() => {
    const tempHoldingValues = [];
    userTokens.forEach(token => {
      console.log(' ---> token', token);
      //FIXME: stop duplicate render
      let lockedBalance = 0;
      let combinedBalance = 0;
      let lockedPercent = 0;
      const formatter = new Intl.NumberFormat("en-US", {style: 'percent'});
      if (token.lockedBalance) {
        lockedBalance = token.lockedBalance.reduce(((acc, curr) => acc + curr.balance), 0);
      }
      if (token.balance) {
        combinedBalance = token.balance + lockedBalance;
        lockedPercent = formatter.format(lockedBalance / combinedBalance);
      } else {
        combinedBalance = lockedBalance;
        lockedPercent = formatter.format(1);
      }
      tempHoldingValues.push([token.name, combinedBalance.toFixed(2), lockedPercent, '-', token.currentPrice, '-'])
    })
    setHoldingValues(tempHoldingValues);
  }, [userTokens])

  useEffect(() => {
    const tempFieldValues = [];
    userFields.forEach(field => {
      const { name, balance, seedTokens, cropTokens} = field;
      let underlying = '';
      let farming = '';
      seedTokens && seedTokens.forEach(token => underlying += `${token.name}, `);
      cropTokens && cropTokens.forEach(token => farming += `${token.name}, `);
      underlying = underlying.slice(0, -2);
      farming = farming.slice(0, -2);
      tempFieldValues.push([name, balance, underlying, farming]);
    })
    setFieldValues(tempFieldValues)
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
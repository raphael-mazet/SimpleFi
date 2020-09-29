import React, { useState, useEffect } from 'react';
import './MyAssets.css';
import SummaryTable from '../../components/SummaryTable/SummaryTable'
import { holdingHeaders, holdingCurrencyCells, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';
import { currentPrice } from '../../apis/coinGecko/currentPrice';

export default function MyAssets ({userTokens, userFields, apis, setSplash}) {
  const [holdingValues, setHoldingValues] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);
  const [priceApis, setPriceApis] = useState([]);

  useEffect(() => setSplash(true), []);

  useEffect(() => {
    const tempHoldingValues = [];
    const tempPriceApis =[];
    userTokens.forEach(token => {
      if (token.isBase) {
        //TODO: modularise
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
        tempHoldingValues.push([token.name, combinedBalance.toFixed(2), lockedPercent, 'Loading', token.currentPrice]);
        tempPriceApis.push(token.price_api);
      }
    })
    setHoldingValues(tempHoldingValues);
    setPriceApis(tempPriceApis);
  }, [userTokens])

  useEffect(() => {
    Promise.all(priceApis.map(async priceApi => {
      if (priceApi){
        const currentPrice = await apis.currentPrice(priceApi);
        return currentPrice;
      }
    }))
      .then(prices => {
        const updatedHoldings = [];
        prices.forEach((price, i) => {
          const newValues = [...holdingValues[i]]
          newValues[3] = (price * newValues[1]).toFixed(2); //set value
          newValues[4] = price.toFixed(2); //set curr. price
          updatedHoldings.push(newValues);
        })
        setHoldingValues(updatedHoldings)
      })
  }, [priceApis])

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
      {/* <div className="summary-earning">
        <h2>Earning</h2>
        <SummaryTable headers={earningHeaders}/>
      </div> */}
    </div>
  )
}
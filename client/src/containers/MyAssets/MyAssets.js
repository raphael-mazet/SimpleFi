import React, { useState, useEffect } from 'react';
import './MyAssets.css';
import OverviewCard from '../../components/OverViewCard/OverviewCard';
import SummaryBox from '../../components/SummaryBox/SummaryBox';
import helpers from '../../helpers/index';
import { holdingHeaders, holdingCurrencyCells, farmingHeaders, farmingCurrencyCells, earningHeaders, earningCurrencyCells } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens, userFields, userTokenPrices, setCurrentDetail, allLoadedFlag, setSplash}) {
  const [holdingHeadlines, setHoldingHeadlines] = useState({totalInvested: 0, totalUnclaimed: 0, totalValue: 0});
  const [farmingHeadlines, setFarmingHeadlines] = useState(['Loading', 'Loading']);
  const [earningHeadlines, setEarningHeadlines] = useState(['Loading', 'Loading']);
  const [holdingValues, setHoldingValues] = useState({ baseTokens:[], receiptTokens:[] });
  const [farmingValues, setFarmingValues] = useState([]);
  const [earningValues, setEarningValues] = useState([]);
  const [totalROI, setTotalROI] = useState({farmingROI: 0, earningROI: 0});

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])

  // combine available and locked token balances and add prices from coinGecko
  // separate farming and earning fields
  useEffect(() => {
    if(allLoadedFlag) {
      const {summaryTableValues, overviewValues} = helpers.extractSummaryHoldingValues(userTokens, userTokenPrices);
      setHoldingValues(summaryTableValues);
      setHoldingHeadlines(overviewValues);
  
      const {farmingFields, earningFields, totalInvested, totalROI} = helpers.extractSummaryFieldValues(userFields);
      setFarmingHeadlines({investment: totalInvested.farmingInv, ROI: totalROI.farmingROI});
      setEarningHeadlines({investment: totalInvested.earningInv, ROI: totalROI.earningROI});
  
      setFarmingValues(farmingFields);
      setEarningValues(earningFields);
      setTotalROI(totalROI);
    } else {
      setSplash(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [allLoadedFlag])

  return (
    <div className="myassets-summary">
      <div className="summary-overview-cards-container">
          <OverviewCard title='Total assets' amount={Number(holdingHeadlines.totalValue.toFixed()).toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
          <OverviewCard title='Total ROI' numType='percent' amount={(Number((totalROI.farmingROI + totalROI.earningROI) * 100).toFixed(2)).toLocaleString()} performance={{daily:'plus 2', annual:'plus 3'}}/>
      </div>

      <div className="account-overview">
        <h1>Account overview</h1>
      </div>

      <div className="summary-container-sup">
        <div className="summary-container summary-holding">
          <SummaryBox headlines={holdingHeadlines} userValues={holdingValues.baseTokens} headers={holdingHeaders} tableName='holding' currencyCells={holdingCurrencyCells} setCurrentDetail={setCurrentDetail}/>
        </div>

        <div className="summary-container summary-earning">
        <SummaryBox headlines={earningHeadlines} userValues={earningValues} headers={earningHeaders} tableName='earning' currencyCells={earningCurrencyCells} setCurrentDetail={setCurrentDetail}/>  
        </div>
        
        <div className="summary-container summary-farming">
          <SummaryBox headlines={farmingHeadlines} userValues={farmingValues} headers={farmingHeaders} tableName='farming' currencyCells={farmingCurrencyCells} setCurrentDetail={setCurrentDetail}/>
        </div>

      </div>

    </div>
  )
}
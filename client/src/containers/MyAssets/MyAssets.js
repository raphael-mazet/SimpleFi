import React from 'react';
import SummaryTable from '../SummaryTable/SummaryTable'
import { holdingHeaders, farmingHeaders, earningHeaders } from '../../data/summaryHeaders';

export default function MyAssets ({userTokens}) {
  return (
    <div className="myassets-summary">
      <div className="summary-holding">
        <h2>Holding</h2>
        <SummaryTable headers={holdingHeaders} tokens={userTokens}/>
      </div>
      <div className="summary-farming">
        <h2>Farming</h2>
        <SummaryTable headers={farmingHeaders}/>
      </div>
      <div className="summary-earning">
        <h2>Earning</h2>
        <SummaryTable headers={earningHeaders}/>
      </div>
    </div>
  )
}
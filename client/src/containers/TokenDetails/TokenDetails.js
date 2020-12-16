import React, {useState, useEffect} from 'react';
import './TokenDetails.css';
import HoldingChart from '../../components/HoldingChart/HoldingChart';
import AltHoldingChart from '../../components/AltHoldingChart/AltHoldingChart'
import helpers from '../../helpers';

export default function TokenDetails({name, userTokens, userTokenPrices}) {

  const [currentToken] = useState(userTokens.find(field => field.name === name));
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const totalTokenBalance = helpers.extractTotalTokenBalance(currentToken);
    setTotalBalance(totalTokenBalance);
    setTotalValue(totalTokenBalance * userTokenPrices[name].usd);
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [currentToken]);

  return(
    <div className="field-details">
      <div className="field-details-titles">
        <h2 className="field-title">{name}</h2>
        <p><span className='field-title-header'>Description</span>: lorem ipsum dolor sit amet consectetuer</p>
        <p><span className='field-title-header'>Contract address</span>: <a href={`https://etherscan.io/token/${currentToken.address}`} target="_blank" rel="noreferrer">{currentToken.address}</a></p>
      </div>

      <div className="field-details-numbers">
        <div className="field-overview field-roi">
          <h2>Total balance</h2>
          <p>{Number(totalBalance.toFixed(2)).toLocaleString()}</p>
          <div className="field-roi-graph">Graph</div>
        </div>

        <div className="field-overview field-invested">
          <h2>Current value</h2>
          <p>${Number(totalValue.toFixed(2)).toLocaleString()}</p>
          <div className="field-invested-graph">Pie chart and path</div>
        </div>
      </div>

      <div className="token-location-container">
        <HoldingChart/>
      </div>
      <AltHoldingChart data={currentToken} type='token'/>

      {/* <div className="field-transactions">
        <h2>Transaction history</h2>
        <div className="field-transactions-table">
          <DetailsTable txHistory={currentField.userTxHistory} name={name}/>
        </div>
      </div> */}
    </div>
    )
}
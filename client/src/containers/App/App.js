import React, { useEffect, useState } from 'react';
import { userTokens, marketPrices } from '../../apiServices';
import './App.css';
import TokenTable from '../TokenTable/TokenTable'

function App() {
  //TODO: create simple table with tokens held, amount, price bought, current price, gain/loss
  const [tokens, setTokens] = useState([]);
  const [currentPrices, setCurrentPrices] = useState([]);

  useEffect(() => {
    userTokens.getTokens()
      .then(tokens => setTokens(tokens))
  }, [])

  useEffect(() => {
    tokens.forEach(token => {
      const { apiId, name } = token;
      marketPrices.getPrice(apiId)
        .then(currentPrice =>
          setCurrentPrices(currentPrices => [...currentPrices, {apiId, name, currentPrice}]
            ))
    })
  }, [tokens])

  return (
    <div>
      <TokenTable tokens={tokens} currentPrices={currentPrices}/>
    </div>
  );
}

export default App;

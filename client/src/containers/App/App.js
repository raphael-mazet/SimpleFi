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

  //TODO: is this best way to get prices, or should add directly to each token
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

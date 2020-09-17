import React, { useEffect, useState } from 'react';
import { userTokens, currentPrice } from '../../apis';
import './App.css';
import TokenTable from '../TokenTable/TokenTable'
import MetamaskButton from '../../components/MetamaskButton/MetamaskButton'

function App() {
  const [tokens, setTokens] = useState([]);
  const [currentPrices, setCurrentPrices] = useState([]);

  useEffect(() => {
    userTokens.getTokens()
      .then(tokens => setTokens(tokens))
  }, [])

  useEffect(() => {
    tokens.forEach(token => {
      const { apiId, name } = token;
      currentPrice.getPrice(apiId)
        .then(currentPrice =>
          setCurrentPrices(currentPrices => [...currentPrices, {apiId, name, currentPrice}]
            ))
    })
  }, [tokens])

  return (
    <div>
      <TokenTable tokens={tokens} currentPrices={currentPrices}/>
      <MetamaskButton/>
    </div>
  );
}

export default App;

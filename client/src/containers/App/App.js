import React, { useEffect, useState } from 'react';
import apiService from '../../apiService';
import './App.css';
import TokenTable from '../TokenTable/TokenTable'

function App() {
  //TODO: create simple token with tokens held, amount, price bought, current price, gain/loss
  const [tokens, setTokens] = useState([]); 
  const headers = [
    'Token',
    'Holdings',
    'Bought at (avg)',
    'Curr. price',
    'Profit']

  useEffect(() => {
    apiService.getTokens()
      .then(tokens => setTokens(tokens))
  }, [])

  return (
    <div>
      <TokenTable tokens={tokens} headers={headers}/>
    </div>
  );
}

export default App;

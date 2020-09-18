import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import apis from '../../apis';
import metamaskConnect from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
// import TokenTable from '../TokenTable/TokenTable';
import MetamaskButton from '../../components/MetamaskButton/MetamaskButton';

function App() {
  // apis.getTokens.getTokens();
  const [userAccount, setUserAccount] = useState('');
  const [tokens, setTokens] = useState([]);
  const [currentPrices, setCurrentPrices] = useState([]);

  async function connectWallet () {
    if (window.ethereum) {
      const newAccount = await metamaskConnect();
      setUserAccount(newAccount)
    } else {
      alert('Please install Metamask to use SimpleFi https://metamask.io/')
    }
  }

  useEffect(() => {
    apis.getTokens()
      .then(tokens => {
        setTokens(tokens);
        console.log(' ---> tokens', tokens);
      })
  }, [])

  // useEffect(() => {
  //   tokens.forEach(token => {
  //     const { price_api, name } = token;
  //     apis.currentPrice(price_api)
  //       .then(currentPrice =>
  //         setCurrentPrices(currentPrices => [...currentPrices, {price_api, name, currentPrice}]
  //           ))
  //   })
  // }, [tokens])

  return (
    <div>
      <Nav connect={connectWallet}/>
      {/* <TokenTable tokens={tokens} currentPrices={currentPrices}/> */}
      {/* <MetamaskButton/> */}
    </div>
  );
}

export default App;

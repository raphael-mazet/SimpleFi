import React, { useEffect, useState } from 'react';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import MyAssets from '../MyAssets/MyAssets';

function App() {
  const [userAccount, setUserAccount] = useState('');
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [userTokens, setUserTokens] = useState([]);

  async function connectWallet () {
    if (window.ethereum) {
      const newAccount = await metamaskConnect();
      setUserAccount(newAccount)
      console.log(' ---> newAccount', newAccount);
    } else {
      alert('Please install Metamask to use SimpleFi https://metamask.io/')
    }
  }

  useEffect(() => {
    apis.getTokens()
      .then(tokens => setTrackedTokens(tokens))
  }, [])

  useEffect(() => {
    trackedTokens.forEach(token => {
      const { name, address, price_api } = token;
      const contract = apis.createContract(address, 'erc20');
      if (userAccount.length) {
        apis.getTokenBalance(userAccount[0], contract)
        .then(balance => {
          if (balance) {
            if(price_api) {
              apis.currentPrice(price_api)
                .then(currentPrice => {
                  setUserTokens(userTokens => [...userTokens, {
                    name,
                    address,
                    contract,
                    balance,
                    currentPrice
                  }])
                })
            }
          }
        })
      }
    })
  }, [trackedTokens, userAccount])

  return (
    <div>
      <Nav connect={connectWallet}/>
      <MyAssets userTokens={userTokens}/>
      {/* <TokenTable tokens={tokens} currentPrices={currentPrices}/> */}
    </div>
  );
}

export default App;

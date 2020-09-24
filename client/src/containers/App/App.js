import React, { useEffect, useState } from 'react';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import MyAssets from '../MyAssets/MyAssets';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [tokensLoaded, setTokensLoaded] = useState(false);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);

  //Get tracked tokens from SimpleFi db
  useEffect(() => {
    apis.getTokens()
      .then(tokens => {
        setTrackedTokens(tokens);
        setTokensLoaded(true);
    })
  }, [])

  //TODOs: repetitive? abstract function?
  useEffect(() => {
    apis.getFields()
      .then(fields => {
        setTrackedFields(fields);
        setFieldsLoaded(true);
      })
  }, [])
  
  //Create token contract interfaces
  //TODO: can I abstract and call in first useEffect?
  //TODO: see how how to manage contract abis with userTokens
  useEffect(() => {
    if (tokensLoaded && fieldsLoaded) {
      const tokensWithContracts = [];
      const fieldsWithContracts = [];

      trackedTokens.forEach(token => {
        const { address } = token;
        const contract = apis.createContract(address, 'erc20');
        token.contract = contract;
        tokensWithContracts.push(token);
      });
      setTrackedTokens(tokensWithContracts);

      trackedFields.forEach(field => {
        const { address } = field;
        const contract = apis.createContract(address, 'field');
        field.contract = contract;
        fieldsWithContracts.push(field);
      });
      setTrackedFields(fieldsWithContracts);

    }
    
  }, [tokensLoaded, fieldsLoaded])

  async function connectWallet () {
    if (window.ethereum) {
      //TODO: persist this without logging button
      //TODO: probablay second window
      const newAccount = await metamaskConnect();
      setUserAccount(newAccount)
    } else {
      alert('Please install Metamask to use SimpleFi https://metamask.io/')
    }
  }

  // Create userTokens with token balances
  useEffect(() => {
    console.log(' ---> using price search!');
    if (trackedTokens.length && userAccount.length) {
      //TODO: only trigger once per active account
      //TODO: auto-trigger if metamask already connected
      trackedTokens.forEach(async token => {
        const { name, contract, price_api } = token;
        //TODO: check active account w/ Metamask
        const balance = await apis.getTokenBalance(userAccount[0], contract);
            if(balance) {
              token.balance = balance;
              if (price_api) {
                apis.currentPrice(price_api)
                  .then(currentPrice => {
                    setUserTokens(userTokens => [...userTokens, {
                      name,
                      contract,
                      balance,
                      //TODO: check how I can refresh prices
                      currentPrice
                    }])
                  })
              }
            }
          })
    }
  }, [trackedTokens, userAccount])

  return (
    <div>
      <Nav connect={connectWallet}/>
      <MyAssets userAccount= {userAccount} userTokens={userTokens}/>
    </div>
  );
}

export default App;

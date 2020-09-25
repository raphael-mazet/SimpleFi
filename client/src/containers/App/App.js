import React, { useEffect, useState } from 'react';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import MyAssets from '../MyAssets/MyAssets';
import { createContracts } from '../../apis/ethereum/ethData';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [allTrackedLoaded, setAllTrackedLoaded] = useState(false);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);

  //Get tracked tokens and fields from SimpleFi db
  useEffect(() => {
    const getTokens = apis.getTokens();
    const getFields = apis.getFields();
    Promise.all([getTokens, getFields])
      .then(([tokens, fields]) => {
        setTrackedTokens(tokens);
        setTrackedFields(fields);
        setAllTrackedLoaded(true);
    })
  }, [])
  
  //Create token and field contract interfaces
  useEffect(() => {
    setTrackedTokens(trackedTokens => apis.createContracts(trackedTokens, 'erc20'));
    setTrackedFields(trackedFields => apis.createContracts(trackedFields, 'field'));
    setContractsLoaded(true);
  }, [allTrackedLoaded])

 async function connectWallet () {
    //TODO: autorefresh when toggle account from Metamask
    if (window.ethereum) {
      const newAccount = await metamaskConnect();
      /*if (newAccount[0] !== userAccount[0]) */setUserAccount(newAccount)
      setUserTokens([]);
    } else {
      alert('Please install Metamask to use SimpleFi (https://metamask.io/)')
    }
  }

  // Create userTokens with token balances
  useEffect(() => {
    if (trackedTokens.length && userAccount.length) {
      //TODO: check active account when toggle from Metamask
      //TODO: auto-trigger if metamask already connected
      trackedTokens.forEach(async token => {
        const { name, contract, price_api } = token;
        const balance = await apis.getUserBalance(userAccount[0], contract);
            if(balance) {
              token.balance = balance;
              // TODO: problem as will only load tokens with price
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
  }, [contractsLoaded, userAccount])

  useEffect(() => {
    if (userAccount.length) {
      trackedFields.forEach(async field => {
        const { contract } = field;
        const balance = await apis.getUserBalance(userAccount[0], contract);
        if (balance) {
          const { field_id, name, protocol_id, address, instructions, risk_level, receipt_token } = field;
          //TODO: yield is a reserved word - fix on db
          const seedTokens = (
            ({seed_token_1, seed_token_2, seed_token_3, seed_token_4}) =>
              ({seed_token_1, seed_token_2, seed_token_3, seed_token_4})
          )(field);

          const cropTokens = (
            ({crop_token_1, crop_token_2,}) =>
             ({crop_token_1, crop_token_2,})
          )(field);

          apis.getUserFieldTokens({seedTokens, cropTokens})
            .then(fieldTokens => {
              const {seedTokens, cropTokens} = fieldTokens;
              setUserFields(userFields => 
                [...userFields, {field_id, contract, name, balance, protocol_id, address, instructions, risk_level, receipt_token, seedTokens, cropTokens}]
              )
            })
        }
      }
    )}
  }, [contractsLoaded, userAccount])

  return (
    <div>
      <Nav connect={connectWallet}/>
      <MyAssets userAccount= {userAccount} fieldsLoaded={allTrackedLoaded} userFields={userFields} userTokens={userTokens}/>
    </div>
  );
}

export default App;

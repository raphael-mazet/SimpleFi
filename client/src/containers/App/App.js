import React, { useEffect, useState } from 'react';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import MyAssets from '../MyAssets/MyAssets';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [tokensLoaded, setTokensLoaded] = useState(false);
  const [trackedFields, setTrackedFields] = useState([]);
  const [fieldsLoaded, setFieldsLoaded] = useState(false);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);

  //Get tracked tokens from SimpleFi db
  useEffect(() => {
    apis.getTokens()
      .then(tokens => {
        setTrackedTokens(tokens);
        setTokensLoaded(true);
    })
  }, [])

  //TODO: repetitive? abstract function? promiseAll?
  useEffect(() => {
    apis.getFields()
      .then(fields => {
        setTrackedFields(fields);
        setFieldsLoaded(true);
      })
  }, [])
  
  //Create token and field contract interfaces
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

      setContractsLoaded(true);
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
    if (trackedTokens.length && userAccount.length) {
      //TODO: only trigger once per active account
      //TODO: check active account w/ Metamask
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
                [...userFields, {field_id, name, protocol_id, address, instructions, risk_level, receipt_token, seedTokens, cropTokens}]
              )
            })
        }
      }
    )}
  }, [contractsLoaded, userAccount])

  return (
    <div>
      <Nav connect={connectWallet}/>
      <MyAssets userAccount= {userAccount} userTokens={userTokens}/>
    </div>
  );
}

export default App;

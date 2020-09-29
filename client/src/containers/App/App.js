import React, { useEffect, useState } from 'react';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import MyAssets from '../MyAssets/MyAssets';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [allTrackedLoaded, setAllTrackedLoaded] = useState(false);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);
  const [rewoundFlag, setRewoundFlag] = useState(false);

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
      if(!userAccount[0]) setUserAccount(newAccount);
      else if (newAccount[0] !== userAccount[0]) {
        const resetUserTokens = setUserTokens([]);
        const resetUserFields = setUserFields([]);
        Promise.all([resetUserTokens, resetUserFields])
          .then(resets => setUserAccount(newAccount))
      }
    } else {
      alert('Please install Metamask to use SimpleFi (https://metamask.io/)')
    }
  }

  // Create first set of userTokens with token balances
  useEffect(() => {
    if (userAccount.length && contractsLoaded) {
      Promise.all(trackedTokens.map(async token => {
        const { contract } = token;
        const balance = await apis.getUserBalance(userAccount[0], contract);
        if(balance) {
          const { token_id, protocol_id, name, price_api, address } = token;
          let currentPrice;
          if (price_api) {
            currentPrice = await apis.currentPrice(price_api);
          }
          return { token_id, protocol_id, name, price_api, address, contract, balance, currentPrice }
        }
      }))
        .then(tokensWithBalances => {
          const filteredTokens = tokensWithBalances.filter(token => token);
          setUserTokens(filteredTokens)})
    }
  }, [contractsLoaded, userAccount])

  // Set first set of user fields
  useEffect(() => {
    if (userAccount.length && contractsLoaded) {
      Promise.all(trackedFields.map(async field => {
        const { contract } = field;
        const balance = await apis.getUserBalance(userAccount[0], contract);
        if (balance) {
          const { field_id, name, protocol_id, address, instructions, risk_level, receipt_token } = field;

          const seedTokens = (
            ({seed_token_1, seed_token_2, seed_token_3, seed_token_4}) =>
              ({seed_token_1, seed_token_2, seed_token_3, seed_token_4})
          )(field);

          const cropTokens = (
            ({crop_token_1, crop_token_2,}) =>
             ({crop_token_1, crop_token_2,})
          )(field);
          const fieldTokens = await apis.getUserFieldTokens({seedTokens, cropTokens});
          return  {field_id, contract, name, balance, protocol_id, address, instructions, risk_level, receipt_token, seedTokens: fieldTokens.seedTokens, cropTokens: fieldTokens.cropTokens};
        }
      })).then((userFieldsWithTokens) => {
        const filteredFields = userFieldsWithTokens.filter(field => field);
        setUserFields(filteredFields)})
    }
  }, [contractsLoaded, userAccount])

  // extract underlying tokens from user fields
  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag){
      //TODO: what if usertokens not set yet?
      const updatedUserTokens = [...userTokens];
      console.log(' ---> updatedUserTokens', updatedUserTokens);
      const lockedUserTokens = [];
      userFields.forEach(async field => {
        setRewoundFlag(true);
        //FIXME: for testing purposes only: fix to make more generic
        if(field.name === "MTA-wETH 50/50") {
          const rewound = await apis.rewinder(field, trackedTokens);
          console.log(' ---> rewound', rewound);
          //@dev: shape: {token_id, userTokenBalance, field}
          lockedUserTokens.push(...rewound)
          console.log(' ---> lockedUserTokens', lockedUserTokens);
        }
        lockedUserTokens.forEach(token => {
          const existingUserToken = updatedUserTokens.find(userToken => userToken.token_id === token.token_id);
          if (existingUserToken && existingUserToken.lockedBalance) existingUserToken.lockedBalance.push({balance: token.userTokenBalance, field})
          else if (existingUserToken) existingUserToken.lockedBalance = [{balance: token.userTokenBalance, field}];
          else {
            const newUserToken = trackedTokens.find(trackedToken => trackedToken.token_id === token.token_id)
            //TODO: if rewound token is not a "base" token, must be rewound again with corresponding field (recursive???)
            newUserToken.lockedBalance = [{balance: token.userTokenBalance, field}];
            updatedUserTokens.push(newUserToken);
          }
        })
        console.log(' ---> updatedUserTokens', updatedUserTokens);
        setUserTokens(userTokens => [...updatedUserTokens]);
      })
      //FIXME: change trigger to a userField loaded flag to avoid duplicate renders
    }
  }, [userFields, userTokens])

  return (
    <div>
      <Nav connect={connectWallet}/>
      <MyAssets userFields={userFields} userTokens={userTokens}/>
    </div>
  );
}

export default App;

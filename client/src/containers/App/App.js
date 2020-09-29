import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import Welcome from '../../components/Welcome/Welcome';
import MyAssets from '../MyAssets/MyAssets';
import HoldingChart from '../../components/HoldingChart/HoldingChart';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [allTrackedLoaded, setAllTrackedLoaded] = useState(false);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);
  const [rewoundFlag, setRewoundFlag] = useState(false);
  const [splash, setSplash] = useState(false)

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
          const { token_id, protocol_id, name, price_api, address, isBase } = token;
          return { token_id, protocol_id, name, price_api, address, isBase, contract, balance }
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
      const lockedUserTokens = [];
      userFields.forEach(async field => {
        setRewoundFlag(true);
        //FIXME: for testing purposes only: fix to make more generic
        if(field.name === "MTA-wETH 50/50") {
          const rewound = await apis.rewinder(field, trackedTokens);
          //@dev: shape: {token_id, userTokenBalance, field}
          lockedUserTokens.push(...rewound)
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
        setUserTokens(userTokens => [...updatedUserTokens]);
      })
      //FIXME: change trigger to a userField loaded flag to avoid duplicate renders
    }
  }, [userFields, userTokens])

  return (
    <div>
      <Nav connect={connectWallet} splash={splash}/>
      <Switch>
        <Route path='/' exact render={() => <Welcome connect={connectWallet} setSplash={setSplash}/>}/>
        <Route path='/dashboard' exact render={() => <MyAssets userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/>
        <Route path='/chart' exact render={() => <HoldingChart userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/>
      </Switch>
    </div>
  );
}

export default App;

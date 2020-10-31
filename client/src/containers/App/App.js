import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import apis from '../../apis';
import helpers from '../../helpers';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import Welcome from '../../components/Welcome/Welcome';
import MyAssets from '../MyAssets/MyAssets';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [contractsLoaded, setContractsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);
  const [rewoundFlag, setRewoundFlag] = useState(false);
  const [splash, setSplash] = useState(false)
  const history = useHistory();

  //Get tracked tokens and fields from SimpleFi db and attach contracts
  useEffect(() => {
    const getTokens = apis.getTokens();
    const getFields = apis.getFields();
    Promise.all([getTokens, getFields])
      .then(([tokens, fields]) => {
        setTrackedTokens(apis.createContracts(tokens, 'erc20'));
        setTrackedFields(apis.createContracts(fields, 'field'));
        setContractsLoaded(true);
    })
  }, [])

 async function connectWallet () {
    //TODO: autorefresh when toggle account from Metamask
    if (window.ethereum) {
      const newAccount = await metamaskConnect();
      if(!userAccount[0]) {setUserAccount(newAccount);
      history.push('/dashboard');}
      else if (newAccount[0] !== userAccount[0]) {
        const resetUserTokens = setUserTokens([]);
        const resetUserFields = setUserFields([]);
        Promise.all([resetUserTokens, resetUserFields])
          .then(resets => {setUserAccount(newAccount);})
      }
    } else {
      alert('Please install Metamask to use SimpleFi (https://metamask.io/)')
    }
  }

  // Create first set of userTokens with token balances
  useEffect(() => {
    if (userAccount.length && contractsLoaded) {

      apis.getAllUserBalances(userAccount[0], trackedTokens)
        .then(tokensWithBalance => {
          setUserTokens(tokensWithBalance)
        });

      apis.getAllUserBalances(userAccount[0], trackedFields)
        .then(fieldsWithBalance => {
          fieldsWithBalance = helpers.populateFieldTokensFromCache(fieldsWithBalance, trackedTokens);
          setUserFields(fieldsWithBalance)
        });

    }
  }, [contractsLoaded, userAccount])

  // extract underlying tokens from user fields
  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag){
      const updatedUserTokens = [...userTokens];
      const lockedUserTokens = [];
      userFields.forEach(async field => {
        //TODO: do not set flag at each iteration
        setRewoundFlag(true);
        //FIXME: this field is hardcoded for testing purposes and due to differences in contract ABIs - fix to make more generic
        if(field.name === "MTA-wETH 50/50") {
          const rewound = await apis.rewinder(field, trackedTokens);
          //@dev: interface: {tokenId, userTokenBalance, field}
          lockedUserTokens.push(...rewound)
        }
        lockedUserTokens.forEach(token => {
          const existingUserToken = updatedUserTokens.find(userToken => userToken.tokenId === token.tokenId);
          if (existingUserToken && existingUserToken.lockedBalance) existingUserToken.lockedBalance.push({balance: token.userTokenBalance, field})
          else if (existingUserToken) existingUserToken.lockedBalance = [{balance: token.userTokenBalance, field}];
          else {
            const newUserToken = trackedTokens.find(trackedToken => trackedToken.tokenId === token.tokenId)
            //TODO: if rewound token is not a "base" token, must be rewound again with corresponding field (recursive calls)
            newUserToken.lockedBalance = [{balance: token.userTokenBalance, field}];
            updatedUserTokens.push(newUserToken);
          }
        })
        setUserTokens(userTokens => [...updatedUserTokens]);
      })
    }
  }, [userFields, userTokens])

  return (
    <div>
      <Nav connect={connectWallet} splash={splash}/>
      <Switch>
        <Route path='/' exact render={() => <Welcome connect={connectWallet} setSplash={setSplash}/>}/>
        <Route path='/dashboard' exact render={() => <MyAssets userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/>
        //TODO: add new holding details routes
        {/* <Route path='/dashboard/:tokenName' render={() => <HoldingDetails userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/> */}
        {/* <Route path='/chart' exact render={() => <HoldingChart userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/> */}
      </Switch>
    </div>
  );
}

export default App;

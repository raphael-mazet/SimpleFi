import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import apis from '../../apis';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import Welcome from '../../components/Welcome/Welcome';
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
  const [splash, setSplash] = useState(false)
  const history = useHistory();

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
      Promise.all(trackedTokens.map(async token => {
        const { contract } = token;
        const balance = await apis.getUserBalance(userAccount[0], contract);
        if(balance) {
          const { tokenId, protocolId, name, priceApi, address, isBase } = token;
          return { tokenId, protocolId, name, priceApi, address, isBase, contract, balance }
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
          const { fieldId, name, protocolId, address, instructions, riskLevel, receiptToken } = field;

          const seedTokens = (
            ({seedToken1, seedToken2, seedToken3, seedToken4}) =>
              ({seedToken1, seedToken2, seedToken3, seedToken4})
          )(field);

          const cropTokens = (
            ({cropToken1, cropToken2,}) =>
             ({cropToken1, cropToken2,})
          )(field);
          const fieldTokens = await apis.getUserFieldTokens({seedTokens, cropTokens});
          return  {fieldId, contract, name, balance, protocolId, address, instructions, riskLevel, receiptToken, seedTokens: fieldTokens.seedTokens, cropTokens: fieldTokens.cropTokens};
        }
      })).then((userFieldsWithTokens) => {
        const filteredFields = userFieldsWithTokens.filter(field => field);
        setUserFields(filteredFields)})
    }
  }, [contractsLoaded, userAccount])

  // extract underlying tokens from user fields
  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag){
      const updatedUserTokens = [...userTokens];
      const lockedUserTokens = [];
      userFields.forEach(async field => {
        setRewoundFlag(true);
        //FIXME: this field is hardcoded for testing purposes and due to differences in contract ABIs - fix to make more generic
        if(field.name === "MTA-wETH 50/50") {
          const rewound = await apis.rewinder(field, trackedTokens);
          //@dev: shape: {tokenId, userTokenBalance, field}
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

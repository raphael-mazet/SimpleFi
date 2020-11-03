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
  const [rewoundTokenBalances, setRewoundTokenBalances] = useState([]);
  const [rewoundFeederFieldBalances, setRewoundFeederFieldBalances] = useState([]);
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
        .then(tokensWithBalance => setUserTokens(tokensWithBalance));

      apis.getAllUserBalances(userAccount[0], trackedFields)
        .then(fieldsWithBalance => {
          fieldsWithBalance = helpers.populateFieldTokensFromCache(fieldsWithBalance, trackedTokens);
          setUserFields(fieldsWithBalance)
        });
    }
  }, [contractsLoaded, userAccount])

  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag) {
        apis.rewinder(userFields, trackedTokens, trackedFields)
          .then(rewound => {
            setRewoundTokenBalances (prev => [...prev, ...rewound.userTokenBalances]);
            setRewoundFeederFieldBalances (prev => [...prev, ...rewound.userFeederFieldBalances]);
            setRewoundFlag(true);
          })
      }
  }, [userFields, userTokens])

  //ASK: is flag necessary?
  //TODO: add feeder fields
  //FIXME: inconsistent populating of locked tokens
  useEffect(() => {

    if (rewoundFlag) {
      const updatedUserTokens = helpers.addLockedTokenBalances(rewoundTokenBalances, userTokens);
      setUserTokens(updatedUserTokens);
    }

  }, [rewoundTokenBalances, rewoundFlag])

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

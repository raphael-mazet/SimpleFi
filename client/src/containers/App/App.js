import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import apis from '../../apis';
import helpers from '../../helpers';
import { metamaskConnect } from '../../authentication/web3';
import './App.css';
import Nav from '../../components/Nav/Nav';
import Welcome from '../../components/Welcome/Welcome';
import MyAssets from '../MyAssets/MyAssets';
import TokenDetails from '../TokenDetails/TokenDetails';
import FarmingFieldDetails from '../FarmingFieldDetails/FarmingFieldDetails';
import EarningFieldDetails from '../EarningFieldDetails/EarningFieldDetails';
// import { AppProvider } from './AppContext';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [balanceContractsLoaded, setBalanceContractsLoaded] = useState(false);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);
  const [userTokenTransactions, setUserTokenTransactions] = useState([]);
  const [unclaimedRewards, setUnclaimedRewards] = useState([]);
  const [rewoundTokenBalances, setRewoundTokenBalances] = useState([]);
  const [rewoundFieldBalances, setRewoundFieldBalances] = useState([]);
  const [fieldSuppliesAndReserves, setFieldSuppliesAndReserves] = useState([]);
  const [userTokenPrices, setUserTokenPrices] = useState({});
  const [rewoundFlag, setRewoundFlag] = useState(false);
  const [splash, setSplash] = useState(false);

  const [currentDetail, setCurrentDetail] = useState('');
  const history = useHistory();

  async function connectWallet () {
    //TODO: autorefresh when toggle account from Metamask
    if (window.ethereum) {
      const newAccount = await metamaskConnect();
      if(!userAccount[0]) {setUserAccount(newAccount);
      history.push('/dashboard');
    } else if (newAccount[0] !== userAccount[0]) {
        const resetUserTokens = setUserTokens([]);
        const resetUserFields = setUserFields([]);
        //ASK: not sure this does anything
        Promise.all([resetUserTokens, resetUserFields])
          .then(resets => {setUserAccount(newAccount);})
      }
    } else {
      alert('Please install Metamask to use SimpleFi (https://metamask.io/)')
    }
  }

  //Get tracked tokens and fields from SimpleFi db and attach contracts
  useEffect(() => {
    const getTokens = apis.getTokens();
    const getFields = apis.getFields();
    Promise.all([getTokens, getFields])
      .then(([tokens, fields]) => {
        setTrackedTokens(apis.createBalanceContracts(tokens));
        setTrackedFields(apis.createBalanceContracts(fields));
        setBalanceContractsLoaded(true);
    })
    setSplash(true);
  }, [])

  //Create first set of userTokens with token balances
  //Get all user token transactions
  useEffect(() => {
    if (userAccount.length && balanceContractsLoaded) {
      
      apis.getUserTokenTransactions(userAccount[0])
        .then(txArr => setUserTokenTransactions(txArr.result));

      apis.getUnclaimedRewards(userAccount[0], trackedFields, trackedTokens)
        .then(unclaimedArr => setUnclaimedRewards(unclaimedArr))

      const getTokenBalances = apis.getAllUserBalances(userAccount[0], trackedTokens);
      const getFieldBalances = apis.getAllUserBalances(userAccount[0], trackedFields);
      Promise.all([getTokenBalances, getFieldBalances])
        .then(([tokensWithBalance, fieldsWithBalance]) => {
          setUserTokens(tokensWithBalance);

          fieldsWithBalance = helpers.populateFieldTokensFromCache(fieldsWithBalance, trackedTokens);
          setUserFields(fieldsWithBalance);
          if (!fieldsWithBalance.length) setRewoundFlag(true);
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceContractsLoaded, userAccount])

  // Add all underlying token and field balances
  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag) {
      apis.rewinder(userFields, trackedTokens, trackedFields)
        .then(rewound => {
          setRewoundTokenBalances (rewound.userTokenBalances);
          setRewoundFieldBalances (rewound.userFeederFieldBalances);
          setFieldSuppliesAndReserves(rewound.fieldBalances);
          setRewoundFlag(true);
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userFields])

  useEffect(() => {

    if (rewoundFlag) {
      const tokensWithLockedBalances = helpers.addLockedTokenBalances(rewoundTokenBalances, userTokens);
      const tokensWithUnclaimedBalances = helpers.addUnclaimedBalances(unclaimedRewards, tokensWithLockedBalances)
      setUserTokens(tokensWithUnclaimedBalances);

      const fieldsWithStakedBalances = helpers.addStakedFieldBalances(rewoundFieldBalances, userFields);
      const fieldsWithSuppliesAndReserves = helpers.addFieldSuppliesAndReserves(fieldSuppliesAndReserves, fieldsWithStakedBalances);
      
      apis.getTokenPrices(tokensWithUnclaimedBalances, fieldsWithSuppliesAndReserves, trackedTokens)
        .then(tokenPrices => {
          setUserTokenPrices(tokenPrices);
          const fieldsWithInvestmentValues = helpers.addFieldInvestmentValues(fieldsWithSuppliesAndReserves, tokenPrices)
          apis.getAPYs(fieldsWithInvestmentValues, tokensWithUnclaimedBalances, tokenPrices)
            .then(fieldsWithAPYs => {
              apis.getROIs(userAccount[0], fieldsWithAPYs, trackedFields, userTokenTransactions, trackedTokens, tokensWithUnclaimedBalances, tokenPrices)
                .then(fieldsWithROIs => setUserFields(fieldsWithROIs))
            })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [rewoundFlag])

  //TODO: setcontext around this
  return (
    <div>
      <Nav connect={connectWallet} splash={splash}/>
      {/* <AppProvider value={balanceContractsLoaded}> */}
        <Switch>
          <Route path='/' exact render={() => <Welcome connect={connectWallet} setSplash={setSplash}/>}/>
          <Route path='/dashboard' exact render={() => <MyAssets userTokens={userTokens} userFields={userFields} userTokenPrices={userTokenPrices} setSplash={setSplash} setCurrentDetail={setCurrentDetail}/>}/>
          <Route path='/token/:tokenName' exact render={() => <TokenDetails name={currentDetail} userTokens={userTokens} userFields={userFields} />}/>
          <Route path='/farming/:fieldName' exact render={() => <FarmingFieldDetails name={currentDetail} userTokens={userTokens} userFields={userFields} />}/>
          <Route path='/earning/:fieldName' exact render={() => <EarningFieldDetails name={currentDetail} userTokens={userTokens} userFields={userFields} />}/>
          {/* <Route path='/dashboard/:tokenName' render={() => <HoldingDetails userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/> */}
          {/* <Route path='/chart' exact render={() => <HoldingChart userTokens={userTokens} userFields={userFields} apis={apis} setSplash={setSplash}/>}/> */}
        </Switch>
      {/* </AppProvider> */}
    </div>
  );
}

export default App;

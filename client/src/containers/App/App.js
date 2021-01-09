import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import apis from '../../apis';
import helpers from '../../helpers';
import './App.css';
import Nav from '../../components/Nav/Nav';
import Welcome from '../../components/Welcome/Welcome';
import MyAssets from '../MyAssets/MyAssets';
import TokenDetails from '../TokenDetails/TokenDetails';
import FarmingFieldDetails from '../FarmingFieldDetails/FarmingFieldDetails';
import EarningFieldDetails from '../EarningFieldDetails/EarningFieldDetails';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import Footer from '../../components/Footer/Footer'
// import { AppProvider } from './AppContext';

function App() {
  const [trackedTokens, setTrackedTokens] = useState([]);
  const [trackedFields, setTrackedFields] = useState([]);
  const [userAccount, setUserAccount] = useState([]);
  const [userTokens, setUserTokens] = useState([]);
  const [userFields, setUserFields] = useState([]);
  const [userTokenTransactions, setUserTokenTransactions] = useState([]);
  const [userNormalTransactions, setUserNormalTransactions] = useState([]);
  const [unclaimedRewards, setUnclaimedRewards] = useState([]);
  const [rewoundTokenBalances, setRewoundTokenBalances] = useState([]);
  const [rewoundFieldBalances, setRewoundFieldBalances] = useState([]);
  const [fieldSuppliesAndReserves, setFieldSuppliesAndReserves] = useState([]);
  const [userTokenPrices, setUserTokenPrices] = useState({});
  
  const [splash, setSplash] = useState(false);
  const [balanceContractsLoaded, setBalanceContractsLoaded] = useState(false);
  const [rewoundFlag, setRewoundFlag] = useState(false);
  const [allLoadedFlag, setAllLoadedFlag] = useState(false);
  const [changedAddress, setChangedAddress] = useState(false);
  
  const [currentDetail, setCurrentDetail] = useState('');
  const [loadingMessage, setLoadingMessage] = useState({headline: null, actions: []});
  
  const history = useHistory();

  //Get tracked tokens and fields from SimpleFi db and attach contracts
  useEffect(() => {
    if (window.ethereum) { 
      window.ethereum.autoRefreshOnNetworkChange = false;
      window.ethereum.on('accountsChanged', function (accounts) {
        if(splash) history.push('/dashboard');
        setChangedAddress(true);
        setUserAccount(accounts);
      });
    } else {
      alert('Please install Metamask to use SimpleFi (https://metamask.io/)');
    }

    const getTokens = apis.getTokens();
    const getFields = apis.getFields();
    Promise.all([getTokens, getFields])
      .then(([tokens, fields]) => {
        setTrackedTokens(apis.createBalanceContracts(tokens));
        setTrackedFields(apis.createBalanceContracts(fields));
        setBalanceContractsLoaded(true);
    })
  //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //TODO fix no rewind on refresh of same address - persist metamask account
    if (changedAddress) {
      setUserTokens([]);
      setUserFields([]);
      setUserTokenTransactions([]);
      setUnclaimedRewards([]);
      setRewoundTokenBalances([]);
      setRewoundFieldBalances([]);
      setFieldSuppliesAndReserves([]);
      setRewoundFlag(false);
      setAllLoadedFlag(false);
      setChangedAddress(false);
    }
  }, [changedAddress])

  //Create first set of userTokens with token balances
  //Get all user token transactions
  useEffect(() => {
    if (userAccount.length && balanceContractsLoaded && !changedAddress) {
      setLoadingMessage(() => helpers.amendModal('balances'));
      const getTokenBalances = apis.getAllUserBalances(userAccount[0], trackedTokens);
      const getFieldBalances = apis.getAllUserBalances(userAccount[0], trackedFields);
      const userTxPromise = apis.getUserTokenTransactions(userAccount[0]);
      const userNormalPromise = apis.getUserNormalTransactions(userAccount[0]);
      const unclaimedRewardsPromise = apis.getUnclaimedRewards(userAccount[0], trackedFields, trackedTokens);

      Promise.all([getTokenBalances, getFieldBalances, userTxPromise, userNormalPromise, unclaimedRewardsPromise])
        .then(([tokensWithBalance, fieldsWithBalance, tokenTxArr, normalTxArr, unclaimedArr]) => {
          fieldsWithBalance = helpers.populateFieldTokensFromCache(fieldsWithBalance, trackedTokens);
          setLoadingMessage(prev => helpers.amendModal('Fetching primary token and field balances', prev));
          setLoadingMessage(prev => helpers.amendModal('Fetching historic token transactions', prev));
          setLoadingMessage(prev => helpers.amendModal('Fetching unclaimed rewards', prev));
          setTimeout(() => {
            setUserTokens(tokensWithBalance);
            setUserFields(fieldsWithBalance);
            setUserTokenTransactions(tokenTxArr.result);
            setUserNormalTransactions(normalTxArr.result);
            setUnclaimedRewards(unclaimedArr);
            if (!fieldsWithBalance.length) setRewoundFlag(true);
          }, 200)
        })
        .catch(e => {
          console.error(e);
          alert("Oops, something went wrong. Please refresh the page!");
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceContractsLoaded, userAccount, changedAddress])

  // Add all underlying token and field balances
  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag && !changedAddress) {
      setLoadingMessage(() => helpers.amendModal('rewinding'));
      apis.rewinder(userFields, trackedTokens, trackedFields)
      .then(rewound => {
          setLoadingMessage(prev => helpers.amendModal('Rewinding underlying farming investments', prev));
          setLoadingMessage(prev => helpers.amendModal('Rewinding underlying tokens', prev));
          setTimeout(() => {
            setRewoundTokenBalances (rewound.userTokenBalances);
            setRewoundFieldBalances (rewound.userFeederFieldBalances);
            setFieldSuppliesAndReserves(rewound.fieldBalances);
            setRewoundFlag(true);
          }, 200)
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userFields, changedAddress])

  useEffect(() => {
    if (rewoundFlag && !changedAddress) {
      setLoadingMessage(() => helpers.amendModal('ROIs'));
      const tokensWithLockedBalances = helpers.addLockedTokenBalances(rewoundTokenBalances, userTokens);
      const tokensWithUnclaimedBalances = helpers.addUnclaimedBalances(unclaimedRewards, tokensWithLockedBalances, trackedTokens);
      setUserTokens(tokensWithUnclaimedBalances);

      const fieldsWithStakedBalances = helpers.addStakedFieldBalances(rewoundFieldBalances, userFields);
      const fieldsWithSuppliesAndReserves = helpers.addFieldSuppliesAndReserves(fieldSuppliesAndReserves, fieldsWithStakedBalances);
      apis.getTokenPrices(tokensWithUnclaimedBalances, fieldsWithSuppliesAndReserves, trackedTokens)
        .then(tokenPrices => {
          setLoadingMessage(prev => helpers.amendModal('Fetching token and field prices', prev));
          setUserTokenPrices(tokenPrices);
          const fieldsWithInvestmentValues = helpers.addFieldInvestmentValues(fieldsWithSuppliesAndReserves, tokenPrices)
          apis.getAPYs(fieldsWithInvestmentValues, tokensWithUnclaimedBalances, tokenPrices)
          .then(fieldsWithAPYs => {
              setLoadingMessage(prev => helpers.amendModal('Calculating APYs', prev));
              apis.getROIs(userAccount[0], fieldsWithAPYs, trackedFields, userTokenTransactions, userNormalTransactions, trackedTokens, tokensWithUnclaimedBalances, tokenPrices)
              .then(fieldsWithROIs => {
                  setLoadingMessage(prev => helpers.amendModal('Calculating ROIs', prev));
                  setUserFields(fieldsWithROIs);
                  setAllLoadedFlag(true);
                  setTimeout(() => setLoadingMessage(() => {return {headline: null, actions: []}}), 300);
                })
            })
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [rewoundFlag, changedAddress])

  return (
    <div className="simplefi-app">
      <Nav splash={splash} userAccount={userAccount} history={history}/>
      {/* <AppProvider value={balanceContractsLoaded}> */}
      <LoadingModal splash={splash} loadingMessage={loadingMessage}/>
        <Switch>
          <Route path='/' exact render={() => <Welcome setUserAccount={setUserAccount} userAccount={userAccount} setSplash={setSplash}/>}/>
          <Route path='/dashboard' exact render={() => <MyAssets userTokens={userTokens} userFields={userFields} userTokenPrices={userTokenPrices} setSplash={setSplash} setCurrentDetail={setCurrentDetail} allLoadedFlag={allLoadedFlag}/>}/>
          <Route path='/token/:tokenName' exact render={() => <TokenDetails name={currentDetail} userTokens={userTokens} userTokenPrices={userTokenPrices} />}/>
          <Route path='/farming/:fieldName' exact render={() => <FarmingFieldDetails name={currentDetail} userFields={userFields} />}/>
          <Route path='/earning/:fieldName' exact render={() => <EarningFieldDetails name={currentDetail} userFields={userFields} history={history}/>}/>
        </Switch>
      {/* </AppProvider> */}
      <Footer/>
    </div>
  );
}

export default App;
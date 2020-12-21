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
import LoadingModal from '../../components/LoadingModal/LoadingModal';
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
  const [allLoadedFlag, setAllLoadedFlag] = useState(false);
  const [splash, setSplash] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState({headline: null, actions: []});

  const [currentDetail, setCurrentDetail] = useState('');
  const history = useHistory();

  async function connectWallet () {
    //TODO: autorefresh when toggle account from Metamask
    if (window.ethereum) {
      const newAccount = await metamaskConnect();
      if (newAccount.error) {
        if (newAccount.error.code === 4001) {
          alert('Please connect to Metamask');
        } else {
          alert('Oops, something went wrong - please refresh the page');
        }
      }
      if(newAccount[0] && newAccount !== userAccount) {
        setUserAccount(newAccount);
        history.push('/dashboard');
      } 
    } else {
      alert('Please install Metamask to use SimpleFi (https://metamask.io/)')
    }
  }

  //Get tracked tokens and fields from SimpleFi db and attach contracts
  useEffect(() => {
    if (window.ethereum) { 
      window.ethereum.autoRefreshOnNetworkChange = false;
      window.ethereum.on('accountsChanged', function (accounts) {
        console.log(' ---> accounts', accounts);
        setUserAccount(accounts);
        setRewoundFlag(false);
      });
        //eslint-disable-next-line no-undef
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
    setSplash(true);
  }, [])

  //Create first set of userTokens with token balances
  //Get all user token transactions
  useEffect(() => {
    if (userAccount.length && balanceContractsLoaded) {
      setLoadingMessage(() => helpers.amendModal('balances'));
      
      apis.getUserTokenTransactions(userAccount[0])
        .then(txArr => {
          setLoadingMessage(prev => helpers.amendModal('Fetching historic token transactions', prev));
          setUserTokenTransactions(txArr.result);
        })

      apis.getUnclaimedRewards(userAccount[0], trackedFields, trackedTokens)
        .then(unclaimedArr => {
          setLoadingMessage(prev => helpers.amendModal('Fetching unclaimed rewards', prev));
          setUnclaimedRewards(unclaimedArr)
        })

      const getTokenBalances = apis.getAllUserBalances(userAccount[0], trackedTokens);
      const getFieldBalances = apis.getAllUserBalances(userAccount[0], trackedFields);
      Promise.all([getTokenBalances, getFieldBalances])
        .then(([tokensWithBalance, fieldsWithBalance]) => {
          setUserTokens(tokensWithBalance);
          fieldsWithBalance = helpers.populateFieldTokensFromCache(fieldsWithBalance, trackedTokens);
          setLoadingMessage(prev => helpers.amendModal('Fetching primary token and field balances', prev));
          setUserFields(fieldsWithBalance);
          if (!fieldsWithBalance.length) setRewoundFlag(true);
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceContractsLoaded, userAccount])

  // Add all underlying token and field balances
  useEffect(() => {
    if (userFields.length && userTokens.length && !rewoundFlag) {
      setLoadingMessage(() => helpers.amendModal('rewinding'));
      apis.rewinder(userFields, trackedTokens, trackedFields)
      .then(rewound => {
          setLoadingMessage(prev => helpers.amendModal('Rewinding underlying farming investments', prev));
          setRewoundTokenBalances (rewound.userTokenBalances);
          setRewoundFieldBalances (rewound.userFeederFieldBalances);
          setFieldSuppliesAndReserves(rewound.fieldBalances);
          setTimeout(() => setLoadingMessage(prev => helpers.amendModal('Rewinding underlying tokens', prev)), 50);
          setTimeout(() => setRewoundFlag(true), 200);
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [userFields])

  useEffect(() => {
    if (rewoundFlag) {
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
              apis.getROIs(userAccount[0], fieldsWithAPYs, trackedFields, userTokenTransactions, trackedTokens, tokensWithUnclaimedBalances, tokenPrices)
              .then(fieldsWithROIs => {
                  setLoadingMessage(prev => helpers.amendModal('Calculating ROIs', prev));
                  setUserFields(fieldsWithROIs);
                  setTimeout(() => setLoadingMessage(() => {return {headline: null, actions: []}}), 300);
                  setAllLoadedFlag(true);
                })
            })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [rewoundFlag])

  //TODO: setcontext around this
  return (
    <div className="simplefi-app">
      <Nav connect={connectWallet} splash={splash}/>
      {/* <AppProvider value={balanceContractsLoaded}> */}
      <LoadingModal loadingMessage={loadingMessage}/>
        <Switch>
          <Route path='/' exact render={() => <Welcome connect={connectWallet} setSplash={setSplash}/>}/>
          <Route path='/dashboard' exact render={() => <MyAssets userTokens={userTokens} userFields={userFields} userTokenPrices={userTokenPrices} setSplash={setSplash} setCurrentDetail={setCurrentDetail} allLoadedFlag={allLoadedFlag}/>}/>
          <Route path='/token/:tokenName' exact render={() => <TokenDetails name={currentDetail} userTokens={userTokens} userTokenPrices={userTokenPrices} />}/>
          <Route path='/farming/:fieldName' exact render={() => <FarmingFieldDetails name={currentDetail} userFields={userFields} />}/>
          <Route path='/earning/:fieldName' exact render={() => <EarningFieldDetails name={currentDetail} userFields={userFields} />}/>
        </Switch>
      {/* </AppProvider> */}
    </div>
  );
}

export default App;

import getUserBalanceHistory from './getUserBalanceHistory';
import helpers from '../../../helpers';
import { getOneCurvePoolRawData } from '../protocolQueries';
import getHistoricalPrice from '../../coinGecko/getHistoricalPrice'
const ethers = require('ethers');

async function getROIs(userAccount, userFields, trackedFields, userTokenTransactions, trackedTokens) {

  const fieldsWithROI = [...userFields];

  for (let field of fieldsWithROI) {

    let investmentValue = field.unstakedUserInvestmentValue;
    if (field.stakedBalance) investmentValue += field.stakedBalance.reduce((acc, curr) => acc + curr.userInvestmentValue, 0);

    if (field.name === "Curve: sUSD v2 pool") {
      console.log(' ---> field.name', field.name);
      const receiptToken = trackedTokens.find(trackedToken => trackedToken.tokenId === field.receiptToken);
      const userBalanceChanges = userTokenTransactions.filter(tx => tx.contractAddress === receiptToken.address.toLowerCase());
      // const historicalBalance
      console.log(' ---> userBalanceChanges', userBalanceChanges);
      let whitelist = [];
      trackedFields.forEach(trackedField => {  
        trackedField.seedTokens.forEach(seedToken => {
          if (seedToken.tokenId === field.receiptToken) {
            //TODO: change DB top add withdraw in enum
            const depositAddresses = trackedField.contractAddresses.filter(address => address.addressTypes.includes('deposit' || 'withdraw'));
            depositAddresses.forEach(depositAddress => whitelist.push(depositAddress.address.toLowerCase()))
          }
        })
      })

      const historicalCurveStats = await getOneCurvePoolRawData(field.name);
      const timeFormatter = new Intl.DateTimeFormat('en-GB');

      const extractedHistory = await userBalanceChanges.map(async tx => {
        //find day in raw curve stats
        console.log(' ---> tx', tx);
        const txDate = new Date(Number(tx.timeStamp) * 1000);
        const compDate = timeFormatter.format(new Date(Number(tx.timeStamp) * 1000));
        // console.log(' ---> compDate', compDate);
        const historicalStat = historicalCurveStats.find(day => compDate === timeFormatter.format(new Date(Number(day.timestamp) * 1000)));
        // console.log(' ---> historicalStat', historicalStat);
        const geckoDateformat = compDate.replace(/\//gi, '-')
        //the full reserve price of each seed token on that date
        let fieldHistReserveValue = 0;
        for (let seed of field.seedTokens) {
          const histSeedValue = await getHistoricalPrice (seed.priceApi, geckoDateformat);
          //TODO: check getting the right price for seedIndex;
          // console.log(' ---> histSeedValue', histSeedValue);
          // console.log(' ---> seed.name', seed.name);
          // console.log(' ---> seed.decimal', seed.tokenContract.decimals);
          // console.log(' ---> seed.Index', seed.seedIndex);
          // console.log(' ---> historicalStat.balances[seed.seedIndex]', historicalStat.balances[seed.seedIndex]);
          // console.log(' ---> add to histSeedValue', );
          const decimaledReserve = historicalStat.balances[seed.seedIndex]/Number(`1e${seed.tokenContract.decimals}`);
          // console.log(' ---> decimaledReserve', decimaledReserve);
          fieldHistReserveValue += histSeedValue * decimaledReserve;
        }
        // console.log(' ---> fieldHistReserveValue', fieldHistReserveValue);
        //TODO: add the right formatting decimal
        const pricePerToken = fieldHistReserveValue / (historicalStat.supply / Number(`1e${receiptToken.tokenContract.decimals}`));
        // console.log(' ---> pricePerToken', pricePerToken);
        let txIn, txOut;
        let staked, unstaked;
        const txAmount = Number(ethers.utils.formatUnits(tx.value, tx.decimals))
        if (tx.from === userAccount.toLowerCase()) {
          if (whitelist.includes(tx.to)) {
            staked = txAmount;
          } else {
            txOut = txAmount;
          }
        } else {
          if (whitelist.includes(tx.from)) {
            unstaked = txAmount;
          } else {
            txIn = txAmount;
          }
        }

        return {tx, txDate, pricePerToken, txIn, txOut, staked, unstaked}
      })
      Promise.all(extractedHistory)
        .then(extractedHistory => {
          const fieldROI = calcROI(investmentValue, extractedHistory);
          field.allTimeROI = fieldROI;
          field.userTxHistory = extractedHistory;
          field.investmentValue = investmentValue;
        })
    } else {
    
        if (field.isEarning) {
          //@dev: gets raw historical snapshots of user's balance in field
          const userBalanceHistory = await getUserBalanceHistory(userAccount, field, trackedFields);
          if (userBalanceHistory) {
            //@dev: converts snapshots into tx types (position accumulation/exit, staking/unstaking)
            const userTxHistory = helpers.extractTxHistory(field, trackedFields, userBalanceHistory, userTokenTransactions);
            const fieldROI = calcROI(investmentValue, userTxHistory);
            
            field.userTxHistory = userTxHistory;
            field.allTimeROI = fieldROI;
          }
    
          field.investmentValue = investmentValue;
        }
      }
    }
  console.log(' ---> fieldsWithROI', fieldsWithROI);
  return fieldsWithROI;
}


function calcROI (investmentValue, txHistory) {
  let amountInvested = 0;
  let amountRealised = 0;
  console.log(' ---> txHistory', txHistory);

  txHistory.forEach(tx => {
    const { txIn, txOut, pricePerToken } = tx;
    if (txIn || txOut) {
      txIn ? amountInvested += txIn * pricePerToken : amountRealised += txOut * pricePerToken
    }
  })
  console.log(' ---> investmentValue', investmentValue);
  console.log(' ---> amountRealised', amountRealised);
  console.log(' ---> amountInvested', amountInvested);
  return ((investmentValue + amountRealised) / amountInvested) - 1;    
}

export default getROIs;
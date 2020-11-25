import React, { useState } from 'react';
import './FieldDetails.css';
import { useEffect } from 'react';
import apollo from '../../apollo/index';
import { gql } from '@apollo/client';
import apis from '../../apis';

export default function FieldDetails ({name, userTokens, userFields, trackedFields, userAccount, userTokenTransactions}) {
  const [fullHistory, setFullHistory] = useState([]);
  const [roi, setRoi] = useState (0);

  //TODO: need current FIeld investment value
  //TODO: derive ROI from that and tx history
  
  //Uni func
  const currentField = userFields.find(field => field.name === name);
  const uniToken = userTokens.find(token => token.tokenId === currentField.receiptToken);
  let investmentValue = currentField.unstakedUserInvestmentValue;
  if (currentField.stakedBalance) investmentValue += currentField.stakedBalance.reduce((acc, curr) => acc + curr.userInvestmentValue, 0);


  function formatUniData(balanceHistory) {
    let whitelist = [];
    trackedFields.forEach(field => {  
      field.seedTokens.forEach(seedToken => {
        if (seedToken.tokenId === currentField.receiptToken) {
          whitelist.push(field.contractAddresses[0].address.toLowerCase());
        }
      })
    })

    //only Uniswap fields
    //TODO: sanitise all addresses to lowercase
    const fieldHistory = balanceHistory.data.liquidityPositionSnapshots.filter(snapshot => snapshot.pair.id === currentField.contractAddresses[0].address.toLowerCase());
    let cumBal = 0;
    const formattedHistory = fieldHistory.map(snapshot => {
      const txDate = new Date(snapshot.timestamp * 1000);
      const pricePerToken = Number(snapshot.reserveUSD) / Number(snapshot.liquidityTokenTotalSupply);
      let txIn, txOut;
      //TODO: usewhitelist
      let staked, unstaked;
      const newBal = Number(snapshot.liquidityTokenBalance);
      const targetBlock = userTokenTransactions.find(tx => tx.blockNumber === snapshot.block.toString());
      const {from, to} = targetBlock;

      if (cumBal < newBal) {
        if (!whitelist.includes(from)) {
          txIn = newBal - cumBal;
          cumBal += txIn;
        } else {
          unstaked = newBal - cumBal;
          cumBal += unstaked;
        }
      } else {
        if (!whitelist.includes(to)){
          txOut = cumBal - newBal;
          cumBal -= txOut;
        } else {
          staked = cumBal - newBal;
          cumBal -= staked;
        }
      }
      return {...snapshot, txDate, pricePerToken, txIn, txOut, staked, unstaked}
    })
    console.log(' ---> formattedHistory', formattedHistory);
    return formattedHistory;
  }

  useEffect(() => {
  apollo.uniswapClient.query(
    {
      query: gql`
        query getUserBalanceHistory ($user: String!) {
          liquidityPositionSnapshots (
            where: {user: $user}
            orderBy: timestamp
            orderDirection: asc
          ) {
            timestamp
            pair {
              id
            }
            # add block to retrieve token whitelist info
            block
            liquidityTokenBalance
            liquidityTokenTotalSupply
            reserveUSD
          }
        }
      `,
      variables: { user: userAccount[0] }
    }
  )
    .then(res => {
      const formattedData = formatUniData(res);
      setRoi(calcROI(investmentValue, formattedData));
      setFullHistory(formattedData);
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //ROI definition: ((currVal of investment + amount realised) / amount invested) -1
  function calcROI (investmentValue, txHistory) {
    let amountInvested = 0;
    let amountRealised = 0;

    txHistory.forEach(tx => {
      const { txIn, txOut, pricePerToken } = tx;
      if (txIn || txOut) {
        txIn ? amountInvested += txIn * pricePerToken : amountRealised += txOut * pricePerToken
        console.log(' ---> txIn', txIn);
        console.log(' ---> txOut', txOut);
        console.log(' ---> pricePerToken', pricePerToken);
        console.log(' ---> amountInvested', amountInvested);
        console.log(' ---> amountRealised', amountRealised);
      }
    })
    console.log(' ---> amountInvested final', amountInvested);
    console.log(' ---> amountRealised final', amountRealised);
    return ((investmentValue + amountRealised) / amountInvested) - 1;    
  }

  function txSorter (tx) {
    const { txIn, txOut, staked, unstaked} = tx;
    const display = {type: '', amount: 0};
    if (txIn) {
      display.type = 'accumulated';
      display.amount = txIn;
    } else if (txOut) {
      display.type = 'exited';
      display.amount = txOut;
    } else if (staked) {
      display.type = 'staked';
      display.amount = staked;
    } else if (unstaked) {
      display.type = 'unstaked';
      display.amount = unstaked;
    }
    return display;
  }


  return (
    <div className="field-details">
      <div className="field-details-titles">
        {/* TODO: quid fields both earning and farming? */}
        <h2 className="field-title">{name} {currentField.isEarning ? '(earning)' : '(farming)'}</h2>
        <p>Description: lorem ipsum dolor sit amet consectetuer</p>
        <p>Current nominal APY: {currentField.earningAPY ? (currentField.earningAPY*100).toFixed(2) : (currentField.farmingAPY*100).toFixed(2)}%</p>
      </div>
      <div className="field-details-numbers">
        <div className="field-roi">
          <h2>all time ROI</h2>
          <p>{(roi*100).toFixed(2)}%</p>
          {/* TODO: breakdown ROI due to fee and underlying value */}
          <div className="field-roi-graph">Graph</div>
        </div>

        <div className="field-invested">
          <h2>Total invested</h2>
          <p>${Number(investmentValue.toFixed()).toLocaleString()}</p>
          <div className="field-invested-graph">Pie chart and path</div>
        </div>
      </div>

      <div className="field-transactions">
        {fullHistory.map(tx => {
          const txType = txSorter(tx)
          return (
            <div className="tx-date">
              <p> on {tx.txDate.toLocaleDateString()} you {txType.type} {txType.amount.toFixed()} at ${tx.pricePerToken.toFixed()} </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

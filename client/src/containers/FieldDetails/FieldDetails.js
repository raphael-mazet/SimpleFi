import React, { useState } from 'react';
import './FieldDetails.css';
import { useContext, useEffect } from 'react';
import AppContext from '../App/AppContext';
import apollo from '../../apollo/index';
import { gql } from '@apollo/client';

export default function FieldDetails ({name, userTokens, userFields, userAccount}) {
  const [fullHistory, setFullHistory] = useState([]);
  const [roi, setRoi] = useState (0);

  //TODO: need current FIeld investment value
  //TODO: derive ROI from that and tx history
  
  //Uni func
  const currentField = userFields.find(field => field.name === name);
  const uniToken = userTokens.find(token => token.tokenId === currentField.receiptToken);

  function formatUniData(txHistory) {
    const fieldHistory = txHistory.data.liquidityPositionSnapshots.filter(snapshot => snapshot.pair.id === currentField.contractAddresses[0].address.toLowerCase());
    let cumBal = 0;
    const formattedHistory = fieldHistory.map(snapshot => {
      const txDate = new Date(snapshot.timestamp * 1000);
      const pricePerToken = Number(snapshot.reserveUSD) / Number(snapshot.liquidityTokenTotalSupply);
      let txIn, txOut;
      const newBal = Number(snapshot.liquidityTokenBalance);
      if (cumBal < newBal) {
        txIn = newBal - cumBal;
        cumBal += txIn;
      } else {
        txOut = cumBal - newBal;
        cumBal -= txOut;
      }
      return {...snapshot, txDate, pricePerToken, txIn, txOut}
    })
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
      setFullHistory(formattedData);
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <p>{`Field: ${name}`}</p>
      {fullHistory.map(tx => {
        console.log(' ---> tx', tx);
        return (
          <div className="tx-date">
            <p> on {tx.txDate.toLocaleDateString()} you {tx.txIn ? `bought ${tx.txIn.toString()}` : `sold ${tx.txOut.toString()}`} at {tx.pricePerToken} </p>
          </div>
        )
        
        })
      }
    </>
  )
}

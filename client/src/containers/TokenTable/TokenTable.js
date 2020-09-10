import React from 'react';
import './TokenTable.css';
import helpers from '../../helpers';
import TokenCell from '../../component/TokenCell';
import tokenHeaders from '../../data/tokenHeaders';

export default function ({tokens, currentPrices }) {

  //TODO: add currentPrices to table
  //TODO: use filter on currentPrices? lift out tr?
  return (
    <table className="token-table">
      <thead>
        <tr>
          {tokenHeaders.map(header => <TokenCell key={header} content={header} header={true}/>)}
        </tr>
      </thead>
      <tbody>
        {tokens
          .map(token => helpers.extractRows(token))
          .map((row, rowIndex) => (
            <tr key={row[0]}>
              {row.map((cell, cellIndex) => (
                <TokenCell key={rowIndex-cellIndex} content={cell} header={false}/>
              ))}
              {currentPrices
                .filter(token => token.name === row[0])
                .map(token => (
                  <TokenCell content={token.currentPrice} header={false}/>
                ))}
            </tr>
          ))}
      </tbody>
    </table>
  )
}

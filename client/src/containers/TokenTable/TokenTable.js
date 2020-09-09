import React from 'react';
import './TokenTable.css';
import helpers from '../../helpers';
import TokenCell from '../../component/TokenCell';
import tokenHeaders from '../../data/tokenHeaders';

export default function ({tokens}) {

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
            </tr>
          ))}
      </tbody>
    </table>
  )
}

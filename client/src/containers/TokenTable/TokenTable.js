//TODO:delete
import React from 'react';
import './TokenTable.css';
import { extractHoldings, renderHoldings, renderCurrPrice, renderProfit } from './helpers';
import TokenCell from '../../components/TokenCell/TokenCell';
import tokenHeaders from '../../data/summaryHeaders/tokenHeaders';

export default function ({tokens, currentPrices }) {

  return (
    <table className="token-table">
      <thead>
        <tr>
          {tokenHeaders.map(header => <TokenCell key={header} content={header} header={true}/>)}
        </tr>
      </thead>
      <tbody>
        {tokens
          .map(token => extractHoldings(token))
          .map((row, rowIndex) => (
            <tr key={row[0]}>
              {renderHoldings(row, rowIndex)}
              {renderCurrPrice(currentPrices, row)}
              {renderProfit(currentPrices, row)}
            </tr>
          ))}
      </tbody>
    </table>
  )
}

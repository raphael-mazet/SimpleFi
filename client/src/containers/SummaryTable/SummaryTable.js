import React from 'react';
import './SummaryTable.css';
import TokenCell from '../../components/TokenCell/TokenCell'

export default function SummaryTable ({headers, userTokens, userAccount}) {
  return (
    <table className="summary-table">
      <thead>
        <tr>
          {headers.map(header => <TokenCell key={header} content={header} header={true}/>)}
        </tr>
      </thead>
      <tbody>
        {userTokens.map((token, rowIndex) => {
          const tokenValues = [token.name, token.balance, '-', token.currentPrice, '-'];
          return (
            <tr key={`row-${rowIndex}`}>
              {tokenValues.map((value, cellIndex) => {
                return (
                  <TokenCell key={`cell-${rowIndex}-${cellIndex}`} content={value} header={false}/>
                )
              } )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
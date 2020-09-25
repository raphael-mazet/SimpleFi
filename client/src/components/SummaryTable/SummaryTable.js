import React from 'react';
import './SummaryTable.css';
import TokenCell from '../TokenCell/TokenCell'

export default function SummaryTable ({headers, userValues}) {
  return (
    <table className="summary-table">
      <thead>
        <tr>
          {headers.map(header => <TokenCell key={header} content={header} header={true}/>)}
        </tr>
      </thead>
      <tbody>
        {userValues.map((rowValues, rowIndex) => {
          return (
            <tr key={`row-${rowIndex}`}>
              {rowValues.map((value, cellIndex) => {
                return (
                  <TokenCell key={`cell-${rowIndex}-${cellIndex}`} content={value} header={false}/>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
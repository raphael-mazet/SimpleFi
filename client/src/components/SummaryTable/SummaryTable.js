import React from 'react';
import './SummaryTable.css';
import TokenCell from '../TokenCell/TokenCell'

export default function SummaryTable ({headers, userValues, tableName, currencyCells}) {
  return (
    <table className="summary-table">
      <thead>
          <tr>
            {headers.map(header => <TokenCell key={`${tableName}-${header}`} content={header} header={true}/>)}
          </tr>
      </thead>
      <tbody>
        {userValues.map((rowValues, rowIndex) => {
          return (
              <tr key={`${tableName}-row-${rowIndex}`} className="summary-table-row">
                {rowValues.map((value, cellIndex) => {
                  return (
                    <TokenCell key={`${tableName}-cell-${rowIndex}-${cellIndex}`} content={value} header={false} index={cellIndex} currencyCells={currencyCells}/>
                    )
                  })}
              </tr>
          )
        })}
      </tbody>
    </table>
  )
}
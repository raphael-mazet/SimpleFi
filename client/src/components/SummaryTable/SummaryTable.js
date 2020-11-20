import React from 'react';
import './SummaryTable.css';
import TokenCell from '../TokenCell/TokenCell';
import { useHistory } from 'react-router-dom';
import { setState } from 'react';


export default function SummaryTable ({headers, userValues, tableName, currencyCells, setCurrentDetail}) {
  const history = useHistory();

  function handleClick(e, rowValues) {
    setCurrentDetail(rowValues[0]);
    history.push(`/field:${rowValues[0]}`);
  }

  return (
    <table className="summary-table">
      <thead>
          <tr className="summary-table-header">
            {headers.map(header => <TokenCell key={`${tableName}-${header}`} content={header} header={true}/>)}
          </tr>
      </thead>
      <tbody>
        {userValues.map((rowValues, rowIndex) => {
          return (
              <tr key={`${tableName}-row-${rowIndex}`} className="summary-table-row" onClick={(e) => handleClick(e, rowValues)}>
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
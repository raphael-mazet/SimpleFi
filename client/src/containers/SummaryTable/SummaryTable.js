import React from 'react';
import './SummaryTable.css';
import TokenCell from '../../components/TokenCell/TokenCell'

export default function SummaryTable ({headers}) {
  return (
    <table className="summary-table">
      <thead>
        <tr>
          {headers.map(header => <TokenCell key={header} content={header} header={true}/>)}
        </tr>
      </thead>
    </table>
  )
}
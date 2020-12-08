import React from 'react';
import './DetailsTable.css';
import helpers from '../../helpers';

export default function DetailsTable(txHistory) {
  return (
    <div className="field-transactions">
    {txHistory.map(tx => {
      const cellValues = helpers.createFieldDetailsCellValues(tx)
      return (
        {cellValues.map(value => {
          return value
        })}
    </div>
  )
}
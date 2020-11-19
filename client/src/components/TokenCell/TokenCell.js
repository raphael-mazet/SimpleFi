import React from 'react';
import './TokenCell.css';

export default function TokenCell ( {header, content, index, currencyCells} ) {
  const cellMarkup = header ? (
    <th className="cell cell-header">
      {content}
    </th>
  ) : (
    <td className={`cell cell-value${currencyCells[index] ? ' cell-currency' : ''}`}>
      {content}
    </td>
  )

  return (cellMarkup);
  
}
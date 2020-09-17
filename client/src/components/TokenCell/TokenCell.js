import React from 'react';
import './TokenCell.css';

export default function TokenCell ( {header, content} ) {

  const cellMarkup = header ? (
    <th className="cell cell-header">
      {content}
    </th>
  ) : (
    <td className="cell">
      {content}
    </td>
  )

  return (cellMarkup);
  
}
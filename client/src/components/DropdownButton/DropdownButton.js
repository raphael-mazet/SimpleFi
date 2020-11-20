import React from 'react';
import './DropdownButton.css';

export default function DropdownButton({handleDropdown, tableRef}) {
  return (
    <div className="dropdown-wrapper">
      <button className="dropdown" onClick={(e) => handleDropdown(e, tableRef)}></button>
    </div>
  )
}
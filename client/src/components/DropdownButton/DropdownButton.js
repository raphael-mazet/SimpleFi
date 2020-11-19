import React from 'react';

export default function DropdownButton({handleDropdown, tableClass}) {
  return (
    <button onClick={(e) => handleDropdown(e, tableClass)}>drop</button>
  )
}
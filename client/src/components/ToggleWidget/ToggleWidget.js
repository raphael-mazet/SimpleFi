import React from 'react';
import './ToggleWidget.css';

export default function ToggleWidget({handleChange}) {
  return(
    <input type="checkbox" className="toggle" value='yay' onChange={handleChange}></input>
  )
}
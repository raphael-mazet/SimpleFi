import React from 'react';
import './MiniToggle.css';

export default function MiniToggle({handleChange, before, after}) {
  return(
    <div className="mini-toggle-container">
      <p>{before}</p>
      <input type="checkbox" className="mini-toggle" value='yay' onChange={handleChange}></input>
      <p>{after}</p>
    </div>
  )
}
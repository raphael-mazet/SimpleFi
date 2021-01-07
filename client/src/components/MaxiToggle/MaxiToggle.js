import React from 'react';
import './MaxiToggle.css';

export default function MaxiToggle({handleChange}) {
  return(
    <div className="maxi-toggle-container">
      <input type="checkbox" className="maxi-toggle" onChange={(e) => handleChange(e)}></input>
    </div>
  )
}

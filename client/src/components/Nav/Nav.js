import React from 'react';
import './Nav.css';

export default function Nav ({connect, splash}) {
  return (
    <nav>
      <div className="nav-title">{splash ? 'SimpleFi' : ""}</div>
      {/* <ul>
        <li>Dashboard</li>
        <li>About</li>
      </ul> */}
      {splash && (
        <div className="nav-buttons">
          <button onClick={connect}>Connect wallet</button>
        </div>
      )
    }
    </nav>
  )
}

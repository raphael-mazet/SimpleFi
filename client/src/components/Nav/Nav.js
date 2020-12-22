import React from 'react';
import './Nav.css';
import Blockies from 'react-blockies';

export default function Nav ({splash, userAccount}) {
  return (
    <nav style={splash ? {'border-bottom':'1px solid #333333'} : {}}>
      <div className="nav-title">
        <h1 style={!splash ? {visibility:'hidden'} : {}}>SimpleFi</h1>
      </div>
      <div className="nav-items">
        <div className="nav-links">
          <p>About</p>
          <p>What is DeFi</p>
        </div>
          <div className="nav-address-button" style={!splash ? {visibility:'hidden'} : {}}>
            <p>{userAccount.length ? `${userAccount[0].slice(0,6)}...${userAccount[0].slice(-4)}` : '0x0000...0000'}</p>
            <Blockies className="user-blocky" seed={userAccount[0]} size={7} scale={3}/>
          </div>
      </div>
    </nav>
  )
}

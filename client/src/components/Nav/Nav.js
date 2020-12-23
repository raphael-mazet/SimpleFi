import React from 'react';
import './Nav.css';
import Blockies from 'react-blockies';
import simpleFiLogo from '../../assets/logos/simplefi-logotype.svg';

export default function Nav ({splash, userAccount}) {
  return (
    <nav style={splash ? {'borderBottom':'1px solid  #BBB3E855'} : {}}>
      <div className="nav-logo">
        <img src={simpleFiLogo} alt='simpleFi logo' style={!splash ? {visibility:'hidden'} : {}}/>
      </div>
      <div className="nav-items">
        <div className="nav-links">
          <p>About</p>
          <p>What is DeFi</p>
        </div>
          <div className="nav-address-button" style={!splash ? {visibility:'hidden'} : {}}>
            <p>{userAccount.length ? `${userAccount[0].slice(0,6)}...${userAccount[0].slice(-4)}` : '0x0000...0000'}</p>
            <Blockies className="user-blocky" seed={userAccount[0] || 'simpleFi'} size={7} scale={3}/>
          </div>
      </div>
    </nav>
  )
}

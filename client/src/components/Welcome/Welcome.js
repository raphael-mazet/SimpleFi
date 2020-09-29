import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import simpleFiSplash from '../../assets/images/simpleFi-splash3.svg';
import './Welcome.css';

export default function Welcome ({connect, setSplash}) {

  useEffect(() => setSplash(false), [])

  return (
    <div className='welcome'>
      <div className='welcome-splash'>
        <div className="splash-text">
          <h1>SimpleFi</h1>
          <h2>Decentralised finance investing made easy!</h2>
        </div>
        <div className="splash-connect">
          <Link exact to='/dashboard'>
            <button className='welcome-button' onClick={connect}>Connect wallet</button>
          </Link>
        </div>
      </div>
      <div className="welcome-media">
        <img src={simpleFiSplash} alt="Welcome to SimpleFi" className="welcome-media-image"/>
      </div>
    </div>
  )
}
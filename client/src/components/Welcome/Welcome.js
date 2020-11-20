import React, { useEffect } from 'react';
import simpleFiSplash from '../../assets/images/simpleFi-splash-blue-sun.svg';
import simpleFiLogo from '../../assets/logos/simplefi-logotype.svg';
import './Welcome.css';
import Footer from '../Footer/Footer';

export default function Welcome ({connect, setSplash}) {

  useEffect(() => {
    setSplash(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  return (
    <>
    <div className='welcome'>
      <div className='welcome-splash'>
        <div className="splash-main">
          <div className="splash-image">
            <img src={simpleFiLogo} alt='simpleFi logo' className="welcome-splash-image" />
          </div>
          <h2>Making decentralized finance accessible to everyone</h2>
        </div>
        <div className="splash-connect">
            <button className='welcome-button' onClick={connect}>Connect wallet</button>
        </div>
      </div>
      <div className="welcome-media">
        <img src={simpleFiSplash} alt="Welcome to SimpleFi" className="welcome-media-image"/>
      </div>
    </div>
    <Footer/>
    </>
  )
}
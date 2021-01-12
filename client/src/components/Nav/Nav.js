import React, {useEffect, useRef, useState} from 'react';
import './Nav.css';
import Blockies from 'react-blockies';
import InfoModal from '../../components/InfoModal/InfoModal';
import simpleFiLogo from '../../assets/logos/simplefi-logotype.svg';

export default function Nav ({splash, userAccount, history}) {
  const [infoModalContent, setInfoModalContent] = useState('');
  const aboutRef = useRef(null);
  const infoModalRef = useRef(null);
  const infoModalContentRef = useRef(null);
  const logoRef = useRef(null);

  function handleClick(e) {
    if (!infoModalContentRef.current.contains(e.target)) {
      if (aboutRef.current.contains(e.target) && infoModalRef.current.style.visibility !== 'visible') {
        setInfoModalContent('about');
        infoModalRef.current.style.visibility = 'visible';
        infoModalRef.current.style.opacity = 1;
      } else {
        infoModalRef.current.style.visibility = 'collapse';
        infoModalRef.current.style.opacity = 0;
      }
    }
    if (logoRef.current.contains(e.target)) {
      history.push('/');
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {document.removeEventListener("mousedown", handleClick)}
  })

  return (
    <nav style={splash ? {"borderBottom":"1px solid  #BBB3E855"} : {}}>
      <div ref={logoRef} className="nav-logo">
        <img src={simpleFiLogo} alt="simpleFi logo" style={!splash ? {visibility:"hidden"} : {}}/>
      </div>
      <div className="nav-items">
        <div className="nav-links">
          <p ref={aboutRef} >About</p>
          <p>😊</p>
          <a href="https://github.com/raphael-mazet/SimpleFi" target="_blank" rel="noreferrer">Github</a>
        </div>
          <div className="nav-address-button" style={!splash ? {visibility:'hidden'} : {}}>
            <p>{userAccount.length ? `${userAccount[0].slice(0,6)}...${userAccount[0].slice(-4)}` : '0x0000...0000'}</p>
            <Blockies className="user-blocky" seed={userAccount[0] || 'simpleFi'} size={7} scale={3}/>
          </div>
      </div>
      <div ref={infoModalRef} className="info-modal-container">
        <InfoModal content={infoModalContent} contentRef={infoModalContentRef}/>
      </div>
    </nav>
  )
}

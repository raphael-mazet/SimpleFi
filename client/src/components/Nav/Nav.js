import React from 'react';
import WalletConnect from '../WalletConnect/WalletConnect';

export default function Nav ({connect}) {
  return (
    <nav>
      <p>SimpleFi navbar</p>
      <WalletConnect connect={connect}/>
    </nav>
  )
}

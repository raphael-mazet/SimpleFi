import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers';


//TODO: modularise
export default function MetamaskButton (props) {

  const [ethAccount, setEthAccount] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [trackedTokens, setTrackedTokens] = useState([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const mtaAddress = '0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2';
  const mtaAbi = [
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];
  const mtaContract = new ethers.Contract(mtaAddress, mtaAbi, provider);

  async function requestConnection () {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setEthAccount(account[0]);
  }

  //TODO: store token info in server and separate from user info/preferences
  //TODO: - get decimals - check name vs coingecko
  useEffect(() => {
    if (ethAccount) {
      provider.getBalance(ethAccount)
        .then (balance => setEthBalance(Number(ethers.utils.formatEther(balance))))
    }
  }, [provider, ethAccount])

  useEffect(() => {
    if (ethAccount) {
      mtaContract.balanceOf(ethAccount)
        .then (balance => console.log(' ---> balance', ethers.utils.formatUnits(balance, 18)))
    }
  }, [ethAccount])


  return (
    <>
      <button className="metamask" onClick={requestConnection}>Connect</button>
      {ethAccount && <p>Your account is {ethAccount}</p>}
      {ethAccount && <p>Your eth balance is {ethBalance}</p>}
    </>
  )
}
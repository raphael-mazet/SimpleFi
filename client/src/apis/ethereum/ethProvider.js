import { ethers } from 'ethers';

//TODO: potentially add default provider
let provider;
if (window.ethereum && window.ethereum.isMetaMask) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  provider.getNetwork()
    .then(res => console.log(' ---> checkNetwork', res))
}

export default provider;
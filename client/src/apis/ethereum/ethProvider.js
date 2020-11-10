import { ethers } from 'ethers';

//TODO: potentially add default provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

export default provider;
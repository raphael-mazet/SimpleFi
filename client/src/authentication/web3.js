
//TODO: persist login at each refresh if Metamask still logged
async function metamaskConnect () {
  const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return account;
}

export {
  metamaskConnect,
}
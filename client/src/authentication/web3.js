
//TODO: persist login at each refresh if Metamask still logged
//NOTE: using Metamask requires downloading the Chrome plugin - window.ethereum object is injected automatically
async function metamaskConnect () {
  const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return account;
}

export {
  metamaskConnect,
}
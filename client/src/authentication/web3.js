
async function metamaskConnect () {
  const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return account;
}

export default {
  metamaskConnect,
}
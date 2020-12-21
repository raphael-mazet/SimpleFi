
//TODO: persist login at each refresh if Metamask still logged
async function metamaskConnect () {
  try {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return account
  } catch(error) {
    console.log(' ---> error', error);
      return {error};
    }
}

export {
  metamaskConnect,
}
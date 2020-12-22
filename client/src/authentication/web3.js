
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

async function connectWallet (setUserAccount, history, userAccount) {
  if (window.ethereum) {
    const newAccount = await metamaskConnect();
    if (newAccount.error) {
      if (newAccount.error.code === 4001) {
        alert('Please connect to Metamask');
      } else {
        alert('Oops, something went wrong - please refresh the page');
      }
    }
    if(newAccount[0] && newAccount !== userAccount) {
      console.log(' ---> userAccount', userAccount);
      setUserAccount(newAccount);
      history.push('/dashboard');
    } 
  } else {
    alert('Please install Metamask to use SimpleFi (https://metamask.io/)')
  }
}

export {
  connectWallet,
}
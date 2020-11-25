import apollo from '../../../apollo';

//TODO: memoize this
async function getUserBalanceHistory (userAccount, field, trackedFields) {
  
  let fieldBalanceHistory;
  //identify field type
  const fieldAddress = field.contractAddresses.find(address => address.addressTypes.includes('earning'));

  switch (fieldAddress.contractInterface.name) {

    case 'uniswap V2 earn':
      const rawData = await apollo.uniswapClient.query(
        {
          query: apollo.uniswapQueries.getUniswapBalanceHistory,
          variables: { user: userAccount }
        }
      )
      fieldBalanceHistory = rawData.data.liquidityPositionSnapshots.filter(snapshot => snapshot.pair.id === field.contractAddresses[0].address.toLowerCase());
      break;

    default: break;
  }
  return fieldBalanceHistory;
}

export default getUserBalanceHistory;
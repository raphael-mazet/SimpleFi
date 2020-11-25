import getUserBalanceHistory from './getUserBalanceHistory';
import helpers from '../../../helpers';

async function getROIs(userAccount, userFields, trackedFields, userTokenTransactions) {

  const fieldsWithROI = [...userFields];

  for (let field of fieldsWithROI) {

  let investmentValue = field.unstakedUserInvestmentValue;
  if (field.stakedBalance) investmentValue += field.stakedBalance.reduce((acc, curr) => acc + curr.userInvestmentValue, 0);

    if (field.isEarning) {
      //@dev: gets raw historical snapshots of user's balance in field
      const userBalanceHistory = await getUserBalanceHistory(userAccount, field, trackedFields);

      if (userBalanceHistory) {
        //@dev: converts snapshots into tx types (position accumulation/exit, staking/unstaking)
        const userTxHistory = helpers.extractTxHistory(field, trackedFields, userBalanceHistory, userTokenTransactions);
        const fieldROI = calcROI(investmentValue, userTxHistory);
        
        field.userTxHistory = userTxHistory;
        field.allTimeROI = fieldROI;
      }

      field.investmentValue = investmentValue;
    }
  }
  return fieldsWithROI;
}


function calcROI (investmentValue, txHistory) {
  let amountInvested = 0;
  let amountRealised = 0;

  txHistory.forEach(tx => {
    const { txIn, txOut, pricePerToken } = tx;
    if (txIn || txOut) {
      txIn ? amountInvested += txIn * pricePerToken : amountRealised += txOut * pricePerToken
    }
  })
  return ((investmentValue + amountRealised) / amountInvested) - 1;    
}

export default getROIs;
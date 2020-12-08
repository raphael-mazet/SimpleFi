export default function createFieldDetailsCellValues(tx) {
  //@dev: [date, action, amount, pricePerToken]
  const cellValues = [];
  const {action, amount} = addTxTypeAndAmount(tx);
  cellValues.push = tx.txDate.toLocaleString();
  cellValues.push(action);
  cellValues.push(amount.toFixed(2));
  cellValues.push(tx.pricePerToken.toFixed(2));
}

function addTxTypeAndAmount(tx) {
    const { txIn, txOut, staked, unstaked, stakingValue, unstakingValue, rewardValue} = tx;
    if (txIn) return {action: 'accumulated', amount: txIn};
    else if (txOut) return {action: 'exited', amount: txOut};
    else if (staked || stakingValue) return {action: 'staked', amount: staked || stakingValue};
    else if (unstaked || unstakingValue) return {action: 'unstaked', amount: unstaked || unstakingValue};
    else if (rewardValue) return {action: 'claimed', amount: rewardValue}
  }
export default function extractTempFieldDetailsCells(tx) {
  const cellValues = [];
  const {action, amount, balEffect} = addTxTypeAndAmount(tx);
  // @dev: only reward claim txs will have a defined value for pricePerReceiptToken
  const {txDate, pricePerToken, pricePerReceiptToken} = tx;

  cellValues.push(txDate.toLocaleString('en-GB').split(',')[0]);
  cellValues.push(action);
  cellValues.push(amount);
  cellValues.push(balEffect);
  cellValues.push({pricePerToken, pricePerReceiptToken})

  return cellValues;
}

function addTxTypeAndAmount(tx) {
    const { txIn, txOut, staked, unstaked, stakingAmount, unstakingAmount, rewardAmount} = tx;
    //@dev: txIn(out) are earning field txs
    if (txIn || txIn === 0) return {action: 'accumulated', amount: txIn, balEffect: 'plus'};
    else if (txOut || txOut === 0) return {action: 'exited', amount: txOut, balEffect: 'minus'};
    /* @dev: (un)staked are an earning field tx where its receipt token interacts with a
             farming field and therefore has no impact on the underlying earning field balance */
    else if (staked || staked === 0) return {action: 'staked', amount: staked, balEffect: 'neutral'};
    else if (unstaked || unstaked === 0) return {action: 'unstaked', amount: unstaked, balEffect: 'neutral'};
    //@dev (un)stakingAmount are farming field txs and therefore modify the farming field's balance
    else if (stakingAmount || stakingAmount === 0) return {action: 'staked', amount: stakingAmount, balEffect: 'plus'};
    else if (unstakingAmount || unstakingAmount === 0) return {action: 'unstaked', amount: unstakingAmount, balEffect: 'minus'};
    else if (rewardAmount || rewardAmount === 0) return {action: 'claimed', amount: rewardAmount, balEffect: 'neutral'}
  };
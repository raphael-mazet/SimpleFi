export default function extractTempFieldDetailsCells(tx) {
  //@dev: [date, action, amount, effect-on-balance, pricePerToken]
  const cellValues = [];
  const {action, amount, balEffect} = addTxTypeAndAmount(tx);
  cellValues.push(tx.txDate.toLocaleString('en-GB').split(',')[0]);
  cellValues.push(action);
  cellValues.push(amount);
  cellValues.push(balEffect);
  cellValues.push(tx.pricePerToken);

  return cellValues;
}

function addTxTypeAndAmount(tx) {
    const { txIn, txOut, staked, unstaked, stakingValue, unstakingValue, rewardValue} = tx;
    //@dev: txIn(out) are earning field txs
    if (txIn) return {action: 'accumulated', amount: txIn, balEffect: 'plus'};
    else if (txOut) return {action: 'exited', amount: txOut, balEffect: 'minus'};
    /* @dev: (un)staked are an earning field tx where its receipt token interacts with a
             farming field and therefore has no impact on the underlying earning field balance */
    else if (staked) return {action: 'staked', amount: staked, balEffect: 'neutral'};
    else if (unstaked) return {action: 'unstaked', amount: unstaked, balEffect: 'neutral'};
    //@dev (un)stakingValue are farming field txs and therefore modify the farming field's balance
    else if (stakingValue) return {action: 'staked', amount: stakingValue, balEffect: 'plus'};
    else if (unstakingValue) return {action: 'unstaked', amount: unstakingValue, balEffect: 'minus'};
    else if (rewardValue) return {action: 'claimed', amount: rewardValue, balEffect: 'neutral'}
  };
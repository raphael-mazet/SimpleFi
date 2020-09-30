import React from 'react';

export default function HoldingDetailAction ({available, protocol, amount}) {
  
  const actionText = available ? 'available:' : `Locked in ${protocol}:`;
  const buttonText = available ? 'transfer' : 'withdraw';

  return (
    <div className="token-action">
      <h3 className="action-text">{`${actionText} ${amount}`}</h3>
      <button className="action-button">{buttonText}</button>
    </div>
  )
}
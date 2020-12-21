import React from 'react';
import './OverviewCard.css';

export default function OverviewCard ({title, amount, performance, numType}) {

  let roiSign = '';
  let perfClass = '';
  if (numType === 'percent') {
    if (amount > 0) {
      roiSign = '+';
      perfClass = '-green';
    } else if (amount < 0) {
      roiSign = '-';
      perfClass = '-red';
    }
    amount = roiSign + Math.abs(amount);
  }
  
  return (
    <div className="overview-card">
        <div className={`card-headline${perfClass}`}>
          <h1>{title}</h1>
          <h2>{amount}</h2>
        </div>
    </div>
  )
}
import React from 'react';
import './OverviewCard.css';

export default function OverviewCard ({title, amount, numType}) {
  let roiSign = '';
  let perfClass = '';
  if (numType === 'percent') {
    perfClass = '-percent';
    
    if (Number(amount)) {
      if (amount > 0) {
        roiSign = '+';
        perfClass = '-green';
      } else if (amount < 0) {
        roiSign = '-';
        perfClass = '-red';
      }
      amount = roiSign + Math.abs(amount);
    } else {
      amount = '--'
    }
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
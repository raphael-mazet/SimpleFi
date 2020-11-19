import React from 'react';
import './OverviewCard.css';

export default function OverviewCard ({title, amount, performance}) {

  return (
    <div className="overview-card">
      <div className="card-text-container">
        <div className="card-headline">
          <h1>{title}</h1>
          <h2>{amount}</h2>
        </div>
        <div className="card-performance">
          <p>{performance.daily}</p>
          <p>{performance.annual}</p>
        </div>
      </div>
    </div>
  )
}
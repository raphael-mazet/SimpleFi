import React from 'react';
import './OverviewCard.css';

export default function OverviewCard ({title, amount, performance}) {

  return (
    <div className="overview-card">
      <div className="card-text-container">
        <h1>{title}</h1>
        <h2>{amount}</h2>
        <div className="overview-performance">
          <div className="performance-daily">{performance.daily}</div>
          <div className="performance-annually">{performance.annual}</div>
        </div>
      </div>
    </div>
  )
}
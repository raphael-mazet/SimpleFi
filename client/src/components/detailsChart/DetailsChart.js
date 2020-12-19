import React, {useState, useEffect, useRef} from 'react';
import './DetailsChart.css';
import helpers from '../../helpers';
const Chart = require('chart.js');

export default function DetailsChart({data, type}) {

  const [tableData] = useState(helpers.extractDetailsChartValues(data, type));
  const chartRef = useRef(null);

  useEffect(() => {
    new Chart(chartRef.current, {
      type: "pie",
      data: {
          datasets: [{
            data: tableData.data,
            backgroundColor: tableData.fill
          }],
          labels: tableData.labels
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0
          }
        },
        legend: {
          labels: {
            fontColor: '#FFFAFA'
          },
          position: 'right',
          align: 'center',
          fontFamily: "'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue'",
        }
      }
    });
  }, [tableData]);

  return (
    <canvas id="details-token-chart" width="100%" height="100%" ref={chartRef}></canvas>
  )
}
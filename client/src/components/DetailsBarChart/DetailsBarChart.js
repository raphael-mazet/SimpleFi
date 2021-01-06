import React, {useState, useEffect, useRef} from 'react';
import './DetailsBarChart.css';
import helpers from '../../helpers';
import { createWhitelist } from '../../helpers/ethHelpers';
const Chart = require('chart.js');

export default function DetailsBarChart({data, type}) {

  const [tableData, setTableData] = useState({data: [], fill:[], labels: [], other: []});
  const chartRef = useRef(null);

    useEffect(() => {
      setTableData(helpers.extractDetailsBarChartValues(data, type))
    }, [data, type]);

  useEffect(() => {
    new Chart(chartRef.current, {
      type: 'bar',
      data: {
          datasets: [{
            data: tableData.data,
            backgroundColor: tableData.fill,
            labels: tableData.labels,
            other: tableData.other,
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
          display: false,
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: '#FFF0F5CE'
            },
            gridLines: {
              display: false,
            },
          }],
          yAxes: [{
            ticks: {
              callback: value => value >= 0 ? '$' + value : '-$' + Math.abs(value),
              fontColor: '#FFF0F5CE'
            },
            gridLines: {
              color: '#FFF0F511',
              zeroLineColor: '#FFFAFA66',
            },
          }]
        },
        tooltips: {
          yPadding: 10,
          xPadding: 10,
          titleSpacing: 100,
          bodySpacing: 5,
          callbacks: {
            label: function(tooltipItem, data) {
              if (type === 'earningAndFarming') {
                return helpers.chartCallbacks.label.earningAndFarming(tooltipItem, data);
              } else {
                return Chart.defaults.doughnut.tooltips.callbacks.label(tooltipItem, data);
              }
            },
            title: function(tooltipItem, data) {
              if (type === 'earningAndFarming') {
                return helpers.chartCallbacks.title.earningAndFarming(tooltipItem, data);
              }
            },
            beforeBody: function(tooltipItem, data) {
              if (type === 'earningAndFarming') {
                return 'from ' + helpers.chartCallbacks.beforeBody.earningAndFarming(tooltipItem, data);
              }
            },
          }
        }
      }
    });
  }, [tableData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas id="details-token-chart" width="100%" height="100%" ref={chartRef}></canvas>
  )
}
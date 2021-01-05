import React, {useState, useEffect, useRef} from 'react';
import './DetailsChart.css';
import helpers from '../../helpers';
const Chart = require('chart.js');

export default function DetailsChart({data, type}) {

  const [tableData, setTableData] = useState({data: [], fill:[], labels: [], other: []});
  const chartRef = useRef(null);

  const tableCallbacks = 
    {
      label: {
        farming: function(tooltipItem, data) {
          return ` $ ${data.datasets[0].data[tooltipItem.index]} (${data.datasets[0].other[tooltipItem.index]})` ;
        }
      },
      title: {
        farming: function(tooltipItem, data) {
          return data.datasets[0].labels[tooltipItem[0].index]
        }
      }
    }

    useEffect(() => {
      setTableData(helpers.extractDetailsChartValues(data, type))
    }, [data, type]);

  useEffect(() => {
    new Chart(chartRef.current, {
      type: "pie",
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
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              if (type === 'farming') {
                return tableCallbacks.label.farming(tooltipItem, data);
              } else {
                return Chart.defaults.doughnut.tooltips.callbacks.label(tooltipItem, data);
              }
            },
            title: function(tooltipItem, data) {
              if (type === 'farming') {
                return tableCallbacks.title.farming(tooltipItem, data);
              }
            },
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
  }, [tableData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas id="details-token-chart" width="100%" height="100%" ref={chartRef}></canvas>
  )
}
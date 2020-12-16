import React, {useState, useEffect} from 'react';
import './DetailsChart.css';
import helpers from '../../helpers';

export default function AltHoldingChart ({data, type}) {

const [tableData] = useState(helpers.extractDetailsChartValues(data, type));

  useEffect(() => {
    google.charts.setOnLoadCallback(drawChart); //eslint-disable-line no-undef
  }, [tableData]) // eslint-disable-line react-hooks/exhaustive-deps

  function drawChart() {
    // Create the data table.
    const chartData = new google.visualization.DataTable(); // eslint-disable-line no-undef
    chartData.addColumn('string', 'State');
    chartData.addColumn('number', 'Balance');
    chartData.addRows(tableData);

    var chartOptions = {
      title:'',
      backgroundColor: {
        fill:'transparent',
      },
      pieSliceText: 'label',
      slices: [
        {color: "#57C3E1"},
        {color: "#DCCDE8"},
        {color: "#007fad"},
        {color: "#F9B5AC"}
      ],
      legend: {
        // position: "none",
        alignment: "center",
        textStyle: {
          color: "233238",
          fontSize: 14
        }
      },
      tooltip: {
        showColorCode: true
      },
      chartArea: {
        left: 0,
        top: 0,
        width: "100%",
        height: "80%",
       },
       fontName: ""
    };
      
    var chart = new google.visualization.PieChart(document.getElementById('chart_div')); // eslint-disable-line no-undef
    chart.draw(chartData, chartOptions);
    }

  return (
    <div id="chart_div"></div>
  )
}
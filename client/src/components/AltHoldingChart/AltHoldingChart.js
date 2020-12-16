import React, {useState, useEffect} from 'react';
import helpers from '../../helpers'

export default function AltHoldingChart ({data, type}) {

const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(helpers.extractDetailsChartValues(data, type));
  }, [data, type]);

  useEffect(() => {
    //eslint-disable-next-line no-undef
    google.charts.setOnLoadCallback(drawChart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData])

  function drawChart() {

    // Create the data table.
    // eslint-disable-next-line no-undef
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'State');
    data.addColumn('number', 'Balance');
    data.addRows(tableData);

    var options = {
      title:'How Much Pizza I Ate Last Night',
      'width':400,
      'height':300,
      backgroundColor: {
        fill:'transparent',
      },
      legend: {
        // position: "none",
        alignment: "center",
        textStyle: {
          color: "233238",
          fontSize: 14
        }
      }
    };
      
    // eslint-disable-next-line no-undef
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    }

  return (
    <div id="chart_div"></div>
  )
}
import React from 'react';
import Chart from "react-google-charts";

export default function HoldingChart () {

  const pieOptions = {
    title: "",
    backgroundColor: {
      fill:'transparent',
    },
    slices: [
      {color: "#57C3E1"},
      {color: "#DCCDE8"},
      {color: "#007fad"},
      {color: "#F9B5AC"}
    ],
    legend: {
      position: "right",
      alignment: "left",
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

  return (
    <div className="App">
      <Chart
        chartType="PieChart"
        data={[["Age", "Weight"], ["a", 12], ["b", 5.5]]}
        options={pieOptions}
        graph_id="PieChart"
        width={"100%"}
        height={"400px"}
        legend_toggle
      />
    </div>
  )
}
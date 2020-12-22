import React from 'react';
import Chart from "react-google-charts";

//NOTE: this component is not yet hooked up to anything - will be used for token details
export default function HoldingChart () {

  const pieOptions = {
    title: "",
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
      position: "none",
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

  return (
    <div className="App">
      <Chart
        chartType="PieChart"
        data={[["isLocked", "Amount"], ["Protocol A", 12], ["Protocol B", 5.5]]}
        options={pieOptions}
        graph_id="PieChart"
        width={"100%"}
        height={"250px"}
        legend_toggle
      />
    </div>
  )
}
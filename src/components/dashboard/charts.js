import * as React from "react";
import { Chart } from "react-google-charts";
 
const chartEvents = [
  {
    eventName: "select",
    callback({ chartWrapper }) {
      console.log("Selected ", chartWrapper.getChart().getSelection());
    }
  }
];
const data = [
  ["Revenue", "Months"],
  [8, 12],
  [4, 5.5],
  [11, 14],
  [4, 5],
  [3, 3.5],
  [6.5, 7]
];
 
const options = {
  title: "Revenue vs. Months comparison",
  hAxis: { title: "Revenue", viewWindow: { min: 0, max: 15 } },
  vAxis: { title: "Months", viewWindow: { min: 0, max: 15 } },
  legend: "none"
};
const ExampleChart = () => {
  return (
    <Chart
  width={'100%'}
  height={'200px'}
  chartType="Line"
  loader={<div>Loading Chart</div>}
  data={[
    [
      'A',
      'B',
      'C',
      'D',
    ],
    [1, 37.8, 2.8, 41.8],
    [2, 30.9, 69.5, 32.4],
    [3, 25.4, 57, 25.7],
    [4, 11.7, 18.8, 10.5],
    [5, 11.9, 17.6, 10.4],
    [6, 8.8, 13.6, 7.7],
    [7, 7.6, 12.3, 9.6],
    [8, 12.3, 29.2, 10.6],
    [9, 16.9, 42.9, 14.8],
    [10, 12.8, 30.9, 11.6],
    [11, 5.3, 7.9, 4.7],
    [12, 6.6, 8.4, 5.2],
    [13, 4.8, 6.3, 3.6],
    [14, 4.2, 6.2, 3.4],
  ]}
  options={{
    chart: {
      title: '',
      subtitle: '',
    },
  }}
  rootProps={{ 'data-testid': '1' }}
/>
  );
};
 
export default ExampleChart;
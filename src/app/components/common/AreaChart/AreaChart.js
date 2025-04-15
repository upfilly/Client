import React from 'react'
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);

const ReportChart = ({ areaData }) => {

  const monthNumberToName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const data = {
    labels: areaData?.headers?.map(header => monthNumberToName(header.month)),
    datasets: [
      {
        label: "Price",
        data: areaData?.data?.map((item) => item.price),
        backgroundColor: 'rgba(9,70,121,0.2)',
        borderColor: 'rgba(87,78,244,1)',
        fill: 'origin',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      filler: {
        propagate: true,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `$${tooltipItem.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} style={{ height: "400px", width: "400px" }} />
    </div>
  );
};

export default ReportChart;

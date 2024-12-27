import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const LineChart = ({ data }) => {
  console.log(data,'gghhghghghghg')
  const monthNumberToName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const chartData = {
    labels: data?.headers?.map(header => monthNumberToName(header.month)),
    datasets: [
      {
        label: 'Price',
        data: data?.data?.map(d => d.price),
        backgroundColor: 'rgba(75, 134, 192, 0.6)',
        borderColor: 'rgba(75, 134, 192, 1)',
        borderWidth: 2,
        fill: true, // Fill the area under the line
        tension: 0.4, // Smooth the line
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;

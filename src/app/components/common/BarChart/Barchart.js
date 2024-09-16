// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data }) => {

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
        borderWidth: 1,
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

  return <Bar data={chartData} options={options} />;
};

export default BarChart;

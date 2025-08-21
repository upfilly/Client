import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const LineChart = ({ data, convertedCurrency, exchangeRate }) => {
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
        label: 'Revenue ($)',
        data: data?.data?.map(d => d.price),
        backgroundColor: 'rgba(75, 134, 192, 0.6)',
        borderColor: 'rgba(75, 134, 192, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return !exchangeRate ? `$${tooltipItem.parsed.y.toFixed(2)}` : `${convertedCurrency(tooltipItem.parsed.y.toFixed(2))}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return !exchangeRate ? `$${value}` : `${convertedCurrency(value)}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '413px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
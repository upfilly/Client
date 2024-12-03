// DonutChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DonutChart = ({ data }) => {
  const monthNumberToName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  // Calculate the total value
  const totalValue = data?.data?.reduce((acc, d) => acc + d.price, 0) || 0;

  const chartData = {
    labels: data?.headers?.map(header => monthNumberToName(header.month)),
    datasets: [
      {
        label: 'Price',
        data: data?.data?.map(d => d.price),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
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
      // Custom plugin to add central label
      datalabels: {
        display: false, // Disable default data labels
      },
    },
    cutout: '50%', // Creates a donut chart
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ position: 'relative', width: '250px', height: '250px', margin:'Auto' }}>
      <Pie data={chartData} options={options} />
      <div style={{
        position: 'absolute',
        top: '62%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        <br/>
        Total:
        <br/>
    <span className='pt-2'>{totalValue.toFixed(2)}$</span>
      </div>
    </div>
  );
};

export default DonutChart;

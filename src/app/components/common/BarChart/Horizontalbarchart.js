import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyHoriBarChart = ({ sales, clicks, transaction }) => {
  const monthNumberToShortName = (month) => {
    const monthsShort = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthsShort[month - 1];
  };

  const salesData = sales.map(sale => ({
    totalAmount: sale.totalAmount,
    count: sale.count,
    label: 'Revenue',
    month: 1
  }));

  const clicksData = clicks[0]?.clicks.map(click => ({
    day: click._id.day,
    month: click._id.month,
    year: click._id.year,
    count: click.count,
    label: 'Clicks'
  })) || [];

  // Process Transaction Data
  const transactionData = transaction.map(trans => ({
    totalAmount: trans.totalAmount,
    count: trans.count,
    transaction_type: trans.transaction_type,
    label: trans.transaction_type,
    month: 1
  }));

  const combinedData = [...salesData, ...clicksData, ...transactionData];

  const groupedData = combinedData.reduce((acc, item) => {
    const month = item.month;

    if (!acc[month]) {
      acc[month] = {
        month: month,
        salesTotalAmount: 0,
        salesCount: 0,
        clicks: 0,
        transactionTotalAmount: 0,
        transactionCount: 0,
        transactionTypes: {}
      };
    }

    if (item.label === 'Revenue') {
      acc[month].salesTotalAmount += item.totalAmount;
      acc[month].salesCount += item.count;
    } else if (item.label === 'Clicks') {
      acc[month].clicks += item.count;
    } else if (item.label.startsWith('pay_')) {
      acc[month].transactionTotalAmount += item.totalAmount;
      acc[month].transactionCount += item.count;
      if (!acc[month].transactionTypes[item.label]) {
        acc[month].transactionTypes[item.label] = 0;
      }
      acc[month].transactionTypes[item.label] += item.totalAmount;
    }

    return acc;
  }, {});

  const sortedGroupedData = Object.values(groupedData).sort((a, b) => a.month - b.month);

  const chartLabels = sortedGroupedData.map(item => monthNumberToShortName(item.month));

  const chartDatasets = [
    {
      label: 'Revenue',
      data: sortedGroupedData.map(item => item.salesTotalAmount),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Clicks',
      data: sortedGroupedData.map(item => item.clicks),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'Transaction',
      data: sortedGroupedData.map(item => item.transactionTotalAmount),
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    },
  ];

  const options = {
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Combined Data Chart',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';

            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      },
      y: {
        title: {
          display: false,
          text: 'Month'
        }
      },
    },
  };

  return <Bar data={{ labels: chartLabels, datasets: chartDatasets }} options={options} />;
};

export default MyHoriBarChart;
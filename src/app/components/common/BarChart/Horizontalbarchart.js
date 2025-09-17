import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyHoriBarChart = ({ sales, clicks, transaction }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const processData = () => {
      const monthNumberToShortName = (month) => {
        const monthsShort = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthsShort[month - 1] || '';
      };

      const monthlyData = {};
      for (let i = 1; i <= 12; i++) {
        monthlyData[i] = {
          month: i,
          revenue: 0,
          clicks: 0,
          transaction: 0
        };
      }

      sales.forEach(sale => {
        const date = new Date(sale.createdAt);
        const month = date.getMonth() + 1; // getMonth() returns 0-11

        monthlyData[month].revenue += sale.totalAmount || 0;
      });

      if (clicks && clicks.length > 0 && clicks[0].clicks) {
        clicks[0].clicks.forEach(click => {
          const month = click._id?.month || 1;
          monthlyData[month].clicks += click.count || 0;
        });
      }

      transaction.forEach(trans => {
        const date = new Date(trans.createdAt);
        const month = date.getMonth() + 1;

        monthlyData[month].transaction += trans.totalAmount || 0;
      });

      const sortedData = Object.values(monthlyData).sort((a, b) => a.month - b.month);

      const labels = sortedData.map(item => monthNumberToShortName(item.month));

      const datasets = [
        {
          label: 'Revenue',
          data: sortedData.map(item => item.revenue),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Clicks',
          data: sortedData.map(item => item.clicks),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Transaction',
          data: sortedData.map(item => item.transaction),
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ];

      // Calculate max value for scaling
      const maxValue = Math.max(
        ...datasets.flatMap(dataset => dataset.data)
      );

      // Set chart options
      const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Performance Metrics',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.x !== null) {
                  label += context.parsed.x.toLocaleString();
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: maxValue * 1.1, // Add 10% padding
            title: {
              display: true,
              text: 'Value'
            },
            ticks: {
              callback: function (value) {
                return value.toLocaleString();
              },
              stepSize: Math.ceil(maxValue / 5),
              maxTicksLimit: 6
            },
          },
          y: {
            title: {
              display: false,
              text: 'Month'
            }
          },
        },
      };

      setChartData({ labels, datasets });
      setChartOptions(options);
    };

    processData();
  }, [sales, clicks, transaction]);

  return (
    <div style={{ width: '100%', height: '500px', padding: '20px' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default MyHoriBarChart;
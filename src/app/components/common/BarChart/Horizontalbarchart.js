import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyHoriBarChart = ({ sales, clicks, transaction, filter = 'this_year' }) => {
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

      const monthNumberToFullName = (month) => {
        const monthsFull = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthsFull[month - 1] || '';
      };

      const getFilteredData = () => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // 1-12
        const currentYear = now.getFullYear();

        let monthsToShow = [];

        switch (filter) {
          case 'this_month': {
            // Show days or weeks of current month
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
            const dataByDay = {};

            // Initialize all days of the month
            for (let day = 1; day <= daysInMonth; day++) {
              dataByDay[day] = {
                label: `${currentMonth}/${day}`,
                displayLabel: `Day ${day}`,
                revenue: 0,
                clicks: 0,
                transaction: 0
              };
            }

            // Process sales data for current month
            sales.forEach(sale => {
              const date = new Date(sale.createdAt);
              if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
                const day = date.getDate();
                dataByDay[day].revenue += sale.totalAmount || 0;
              }
            });

            // Process clicks data for current month
            if (clicks && clicks.length > 0 && clicks[0].clicks) {
              clicks[0].clicks.forEach(click => {
                const date = new Date(click.date || click._id?.date);
                if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
                  const day = date.getDate();
                  dataByDay[day].clicks += click.count || 0;
                }
              });
            }

            // Process transaction data for current month
            transaction.forEach(trans => {
              const date = new Date(trans.createdAt);
              if (date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear) {
                const day = date.getDate();
                dataByDay[day].transaction += trans.totalAmount || 0;
              }
            });

            return Object.values(dataByDay);
          }

          case 'last_month': {
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const daysInLastMonth = new Date(lastMonthYear, lastMonth, 0).getDate();
            const dataByDay = {};

            for (let day = 1; day <= daysInLastMonth; day++) {
              dataByDay[day] = {
                label: `${lastMonth}/${day}`,
                displayLabel: `Day ${day}`,
                revenue: 0,
                clicks: 0,
                transaction: 0
              };
            }

            // Similar processing as this_month but for last month
            sales.forEach(sale => {
              const date = new Date(sale.createdAt);
              if (date.getMonth() + 1 === lastMonth && date.getFullYear() === lastMonthYear) {
                const day = date.getDate();
                dataByDay[day].revenue += sale.totalAmount || 0;
              }
            });

            if (clicks && clicks.length > 0 && clicks[0].clicks) {
              clicks[0].clicks.forEach(click => {
                const date = new Date(click.date || click._id?.date);
                if (date.getMonth() + 1 === lastMonth && date.getFullYear() === lastMonthYear) {
                  const day = date.getDate();
                  dataByDay[day].clicks += click.count || 0;
                }
              });
            }

            transaction.forEach(trans => {
              const date = new Date(trans.createdAt);
              if (date.getMonth() + 1 === lastMonth && date.getFullYear() === lastMonthYear) {
                const day = date.getDate();
                dataByDay[day].transaction += trans.totalAmount || 0;
              }
            });

            return Object.values(dataByDay);
          }

          case 'this_year': {
            // Original logic for showing all months of current year
            const monthlyData = {};
            for (let i = 1; i <= 12; i++) {
              monthlyData[i] = {
                label: monthNumberToShortName(i),
                displayLabel: monthNumberToFullName(i),
                revenue: 0,
                clicks: 0,
                transaction: 0
              };
            }

            sales.forEach(sale => {
              const date = new Date(sale.createdAt);
              if (date.getFullYear() === currentYear) {
                const month = date.getMonth() + 1;
                monthlyData[month].revenue += sale.totalAmount || 0;
              }
            });

            if (clicks && clicks.length > 0 && clicks[0].clicks) {
              clicks[0].clicks.forEach(click => {
                const date = new Date(click.date || click._id?.date);
                if (date.getFullYear() === currentYear) {
                  const month = date.getMonth() + 1;
                  monthlyData[month].clicks += click.count || 0;
                }
              });
            }

            transaction.forEach(trans => {
              const date = new Date(trans.createdAt);
              if (date.getFullYear() === currentYear) {
                const month = date.getMonth() + 1;
                monthlyData[month].transaction += trans.totalAmount || 0;
              }
            });

            return Object.values(monthlyData);
          }

          case 'last_year': {
            const lastYear = currentYear - 1;
            const monthlyData = {};
            for (let i = 1; i <= 12; i++) {
              monthlyData[i] = {
                label: monthNumberToShortName(i),
                displayLabel: monthNumberToFullName(i),
                revenue: 0,
                clicks: 0,
                transaction: 0
              };
            }

            sales.forEach(sale => {
              const date = new Date(sale.createdAt);
              if (date.getFullYear() === lastYear) {
                const month = date.getMonth() + 1;
                monthlyData[month].revenue += sale.totalAmount || 0;
              }
            });

            if (clicks && clicks.length > 0 && clicks[0].clicks) {
              clicks[0].clicks.forEach(click => {
                const date = new Date(click.date || click._id?.date);
                if (date.getFullYear() === lastYear) {
                  const month = date.getMonth() + 1;
                  monthlyData[month].clicks += click.count || 0;
                }
              });
            }

            transaction.forEach(trans => {
              const date = new Date(trans.createdAt);
              if (date.getFullYear() === lastYear) {
                const month = date.getMonth() + 1;
                monthlyData[month].transaction += trans.totalAmount || 0;
              }
            });

            return Object.values(monthlyData);
          }

          default:
            return [];
        }
      };

      const filteredData = getFilteredData();

      // Filter out empty data if needed (optional)
      const sortedData = filteredData.filter(item =>
        item.revenue > 0 || item.clicks > 0 || item.transaction > 0
      );

      const labels = sortedData.map(item => item.label);
      const displayLabels = sortedData.map(item => item.displayLabel);

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
      const allValues = datasets.flatMap(dataset => dataset.data);
      const maxValue = allValues.length > 0 ? Math.max(...allValues) : 100;

      // Set appropriate chart title based on filter
      const getChartTitle = () => {
        switch (filter) {
          case 'this_month': return 'This Month Daily Performance';
          case 'last_month': return 'Last Month Daily Performance';
          case 'this_year': return 'This Year Monthly Performance';
          case 'last_year': return 'Last Year Monthly Performance';
          default: return 'Performance Metrics';
        }
      };

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
            text: getChartTitle(),
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
              text: filter.includes('month') ? 'Day' : 'Month'
            },
            ticks: {
              callback: function (value, index) {
                return displayLabels[index] || labels[index] || value;
              }
            }
          },
        },
      };

      setChartData({ labels, datasets });
      setChartOptions(options);
    };

    processData();
  }, [sales, clicks, transaction, filter]); // Added filter to dependencies

  return (
    <div style={{ width: '100%', height: '500px', padding: '20px' }}>
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>No data available for the selected period</p>
        </div>
      )}
    </div>
  );
};

export default MyHoriBarChart;
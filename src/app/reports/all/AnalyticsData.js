import React from 'react';
import ReactECharts from 'echarts-for-react';
import './AnalyticsDashboard.scss';

const CustomCard = ({ title, children }) => (
  <div className="custom-card">
    <h2 className="custom-card-title">{title}</h2>
    {children}
  </div>
);

const AnalyticsChartData = ({ data, data2, clicks, clicks2, state }) => {
  const { selection1, selection2 } = state;

  // Helper function to format date strings
  const formatDates = (data) => {
    return data.map(item => `${item._id.year}-${item._id.month}-${item._id.day}`);
  };

  // Since data is already filtered, we can directly map it to chart variables
  const revenueData1 = data?.[0]?.revenue || [];
  const actionData1 = data?.[0]?.actions || [];
  const clickData1 = clicks?.[0]?.clicks || [];

  const revenueData2 = data2?.[0]?.revenue || [];
  const actionData2 = data2?.[0]?.actions || [];
  const clickData2 = clicks2?.[0]?.clicks || [];

  // Format the filtered data for each chart
  const revenueDates1 = formatDates(revenueData1);
  const revenuePrices1 = revenueData1.map(item => item.price);

  const actionDates1 = formatDates(actionData1);
  const actionCounts1 = actionData1.map(item => item.action);

  const clickDates1 = formatDates(clickData1);
  const clickCounts1 = clickData1.map(item => item.count);

  const revenueDates2 = formatDates(revenueData2);
  const revenuePrices2 = revenueData2.map(item => item.price);

  const actionDates2 = formatDates(actionData2);
  const actionCounts2 = actionData2.map(item => item.action);

  const clickDates2 = formatDates(clickData2);
  const clickCounts2 = clickData2.map(item => item.count);

  // Format the dynamic legend labels using the selected date ranges
  const formatLegendLabel = (selection) => {
    const startDate = selection.startDate.toLocaleDateString();
    const endDate = selection.endDate.toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  // Chart options for Revenue, Actions, and Clicks with blue color scheme
  const revenueChartOption = {
    title: {
      text: 'Revenue Over Time Comparison',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [
        `${formatLegendLabel(selection1)}`,
        `${formatLegendLabel(selection2)}`
      ],
      bottom: 0, // Place legend below x-axis
      left: 'center', // Center the legend
    },
    xAxis: {
      type: 'category',
      data: revenueDates1,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: `${formatLegendLabel(selection1)}`,
        data: revenuePrices1,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#1E90FF', // Blue color
        },
      },
      {
        name: `${formatLegendLabel(selection2)}`,
        data: revenuePrices2,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#4682B4', // Lighter blue color
        },
      },
    ],
  };

  const actionsChartOption = {
    title: {
      text: 'Actions Comparison',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [
        `${formatLegendLabel(selection1)}`,
        `${formatLegendLabel(selection2)}`
      ],
      bottom: 0, // Place legend below x-axis
      left: 'center', // Center the legend
    },
    xAxis: {
      type: 'category',
      data: actionDates1,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: `${formatLegendLabel(selection1)}`,
        data: actionCounts1,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#1E90FF', // Blue color
        },
      },
      {
        name: `${formatLegendLabel(selection2)}`,
        data: actionCounts2,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#4682B4', // Lighter blue color
        },
      },
    ],
  };

  const clicksChartOption = {
    title: {
      text: 'Clicks Comparison',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [
        `${formatLegendLabel(selection1)}`,
        `${formatLegendLabel(selection2)}`
      ],
      bottom: 0, // Place legend below x-axis
      left: 'center', // Center the legend
    },
    xAxis: {
      type: 'category',
      data: clickDates1,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: `${formatLegendLabel(selection1)}`,
        data: clickCounts1,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#1E90FF', // Blue color
        },
      },
      {
        name: `${formatLegendLabel(selection2)}`,
        data: clickCounts2,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#4682B4', // Lighter blue color
        },
      },
    ],
  };

  return (
    <div className="cards-grid">
      <CustomCard title="Revenue Over Time">
        <ReactECharts option={revenueChartOption} className="chart" />
      </CustomCard>
      <CustomCard title="Actions">
        <ReactECharts option={actionsChartOption} className="chart" />
      </CustomCard>
      <CustomCard title="Clicks Comparison">
        <ReactECharts option={clicksChartOption} className="chart" />
      </CustomCard>
    </div>
  );
};

export default AnalyticsChartData;

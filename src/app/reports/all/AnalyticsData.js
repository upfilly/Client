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

  const formatDates = (data) => {
    return data.map(item => `${item._id.year}-${item._id.month}-${item._id.day}`);
  };

  const getChartData = (data, dates) => {
    if (!data || data.length === 0) {
      return Array(dates.length).fill(0)
    }
    return data.map(item => item.price || item.action || item.count || 0);
  };

  const revenueData1 = data?.[0]?.revenue || [];
  const actionData1 = data?.[0]?.actions || [];
  const clickData1 = clicks?.[0]?.clicks || [];

  const revenueData2 = data2?.[0]?.revenue || [];
  const actionData2 = data2?.[0]?.actions || [];
  const clickData2 = clicks2?.[0]?.clicks || [];

  const revenueDates1 = formatDates(revenueData1);
  const revenuePrices1 = getChartData(revenueData1, revenueDates1);

  const actionDates1 = formatDates(actionData1);
  const actionCounts1 = getChartData(actionData1, actionDates1);

  const clickDates1 = formatDates(clickData1);
  const clickCounts1 = getChartData(clickData1, clickDates1);

  const revenueDates2 = formatDates(revenueData2);
  const revenuePrices2 = getChartData(revenueData2, revenueDates2);

  const actionDates2 = formatDates(actionData2);
  const actionCounts2 = getChartData(actionData2, actionDates2);

  const clickDates2 = formatDates(clickData2);
  const clickCounts2 = getChartData(clickData2, clickDates2);

  const formatLegendLabel = (selection) => {
    const startDate = selection.startDate.toLocaleDateString();
    const endDate = selection.endDate.toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  const calculatePercentageDifference = (value1, value2) => {
    
    if (value1 === 0 || !value1) {
      return value2 > 0 ? '∞%' : '0%';
    }
  
    const diff = Math.abs(value2 || 0 - value1 || 0);
    const percentageDiff = (diff / value1) * 100;
    return `${percentageDiff.toFixed(2)}%`;
  };

  const revenueChartOption = {
    title: {
      text: 'Revenue Over Time Comparison',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let tooltipContent = '';
        params.forEach(item => {
          const value1 = item.data;
          const value2 = params[1]?.data;
          const percentageDifference = calculatePercentageDifference(value1, value2)
          
          tooltipContent += `
            <div>${item.seriesName}: $${value1} (${percentageDifference})</div>
          `;
        });
        return tooltipContent;
      },
    },
    legend: {
      data: [
        `${formatLegendLabel(selection1)}`,
        `${formatLegendLabel(selection2)}`
      ],
      bottom: 0,
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: revenueDates1,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
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
          color: '#1E90FF',
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
          color: '#4682B4',
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
      formatter: function (params) {
        let tooltipContent = '';
        params.forEach(item => {
          const value1 = item.data;
          const value2 = params[1]?.data;  // Get the data for the second chart
          const percentageDifference = calculatePercentageDifference(value1, value2)
          
          tooltipContent += `
            <div>${item.seriesName}: ${value1} (${percentageDifference})</div>
          `;
        });
        return tooltipContent;
      },
    },
    legend: {
      data: [
        `${formatLegendLabel(selection1)}`,
        `${formatLegendLabel(selection2)}`
      ],
      bottom: 0,
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: actionDates1,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
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
          color: '#1E90FF',
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
          color: '#4682B4',
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
      formatter: function (params) {
        let tooltipContent = '';
        params.forEach(item => {
          const value1 = item.data;
          const value2 = params[1]?.data;
          const percentageDifference = calculatePercentageDifference(value1, value2)
          
          tooltipContent += `
            <div>${item.seriesName}: ${value1} (${percentageDifference})</div>
          `;
        });
        return tooltipContent;
      },
    },
    legend: {
      data: [
        `${formatLegendLabel(selection1)}`,
        `${formatLegendLabel(selection2)}`
      ],
      bottom: 0,
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: clickDates1,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: false,
      },
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
          color: '#1E90FF',
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
          color: '#4682B4',
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

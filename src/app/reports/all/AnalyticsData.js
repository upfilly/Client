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
  const revenueData = data?.[0]?.revenue || [];
  const actionData = data?.[0]?.actions || [];
  const clickData = clicks?.[0]?.clicks || [];
  const revenueData2 = data2?.[0]?.revenue || [];
  const actionData2 = data2?.[0]?.actions || [];
  const clickData2 = clicks2?.[0]?.clicks || [];

  const formatDates = (data) => {
    return data.map(item => `${item._id.year}-${item._id.month}-${item._id.day}`);
  };

  const revenueDates = formatDates(revenueData);
  const revenuePrices = revenueData.map(item => item.price);

  const actionDates = formatDates(actionData);
  const actionCounts = actionData.map(item => item.action);

  const clickDates = formatDates(clickData);
  const clickCounts = clickData.map(item => item.count);

  const revenueDates2 = formatDates(revenueData2);
  const revenuePrices2 = revenueData2.map(item => item.price);

  const actionDates2 = formatDates(actionData2);
  const actionCounts2 = actionData2.map(item => item.action);

  const clickDates2 = formatDates(clickData2);
  const clickCounts2 = clickData2.map(item => item.count);

  const revenueChartOption = {
    title: {
      text: 'Revenue Over Time Comparison',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: revenueDates,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Revenue Selection 1',
        data: revenuePrices,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#33cc99',
        },
      },
      {
        name: 'Revenue Selection 2',
        data: revenuePrices2,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#ff6600',
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
    xAxis: {
      type: 'category',
      data: actionDates,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Actions Selection 1',
        data: actionCounts,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#33cc99',
        },
      },
      {
        name: 'Actions Selection 2',
        data: actionCounts2,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#ff6600',
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
    xAxis: {
      type: 'category',
      data: clickDates,
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Clicks Selection 1',
        data: clickCounts,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#33cc99',
        },
      },
      {
        name: 'Clicks Selection 2',
        data: clickCounts2,
        type: 'line',
        smooth: true,
        areaStyle: {},
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: '#ff6600',
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

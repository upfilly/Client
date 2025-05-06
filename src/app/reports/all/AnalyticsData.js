import React, { useState } from 'react';
import { ExpandOutlined, CompressOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import './AnalyticsDashboard.scss';

const CustomCard = ({ title, children, isExpanded, onExpand }) => (
  <div className={`custom-card ${isExpanded ? "expanded" : ""}`}>
    <div className="card-header" onClick={onExpand}>
      <h2 className="custom-card-title">{title}</h2>
      <span className="expand-icon">
        {isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
      </span>
    </div>
    <div className="card-content">
      {children}
    </div>
  </div>
);

const AnalyticsChartData = ({ data, data2, clicks, clicks2, state,convertedCurrency,exchangeRate,comparisonPeriod}) => {
  const { selection1, selection2 } = state;
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleExpand = (cardTitle) => {
    setExpandedCard(expandedCard === cardTitle ? null : cardTitle);
  };

  const formatDates = (data) => {
    return data.map(item => `${item._id.year}-${item._id.month}-${item._id.day}`);
  };

  const getAllDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const getChartData = (data, allDates) => {
    if (!data || data.length === 0) {
      return allDates.map(() => 0);
    }

    const dataMap = data.reduce((acc, item) => {
      const date = `${item._id.year}-${item._id.month}-${item._id.day}`;
      acc[date] = item.price || item.action || item.count || 0;
      return acc;
    }, {});

    return allDates.map(date => dataMap[date] || 0);
  };

  const calculateTotal = (data) => {
    return data.reduce((sum, value) => sum + (value || 0), 0);
  };

  const calculatePercentageDifference = (value1, value2) => {
    if (value1 === 0 || !value1) {
      return value2 > 0 ? '∞%' : '0%';
    }
    const diff = value2 - value1;
    const percentageDiff = (diff / value1) * 100;
    return `${percentageDiff.toFixed(2)}%`;
  };

  const formatLegendLabel = (selection, percentage) => {
    const startDate = selection.startDate ? selection.startDate.toLocaleDateString() : "";
    const endDate = selection.endDate ? selection.endDate.toLocaleDateString() : "";
    return `${startDate} - ${endDate} (${percentage})`;
  };

  // Get all dates in the selected range
  const allDates1 = getAllDatesInRange(selection1.startDate, selection1.endDate);
  const allDates2 = getAllDatesInRange(selection2.startDate, selection2.endDate);

  // Extract data
  const revenueData1 = data?.[0]?.revenue || [];
  const actionData1 = data?.[0]?.actions || [];
  const clickData1 = clicks?.[0]?.clicks || [];

  const revenueData2 = data2?.[0]?.revenue || [];
  const actionData2 = data2?.[0]?.actions || [];
  const clickData2 = clicks2?.[0]?.clicks || [];

  // Get chart data for all selected dates
  const revenuePrices1 = getChartData(revenueData1, allDates1);
  const revenuePrices2 = getChartData(revenueData2, allDates2);

  const actionCounts1 = getChartData(actionData1, allDates1);
  const actionCounts2 = getChartData(actionData2, allDates2);

  const clickCounts1 = getChartData(clickData1, allDates1);
  const clickCounts2 = getChartData(clickData2, allDates2);

  // Calculate overall totals and percentage differences
  const totalRevenue1 = calculateTotal(revenuePrices1);
  const totalRevenue2 = calculateTotal(revenuePrices2);
  const revenuePercentage = calculatePercentageDifference(totalRevenue1, totalRevenue2);

  const totalActions1 = calculateTotal(actionCounts1);
  const totalActions2 = calculateTotal(actionCounts2);
  const actionPercentage = calculatePercentageDifference(totalActions1, totalActions2);

  const totalClicks1 = calculateTotal(clickCounts1);
  const totalClicks2 = calculateTotal(clickCounts2);
  const clickPercentage = calculatePercentageDifference(totalClicks1, totalClicks2);

  // Update legend labels with overall percentages
  const legendRevenue1 = formatLegendLabel(selection1, revenuePercentage);
  const legendRevenue2 = selection2 ? formatLegendLabel(selection2, revenuePercentage) : "";

  const legendActions1 = formatLegendLabel(selection1, actionPercentage);
  const legendActions2 = selection2 ? formatLegendLabel(selection2, actionPercentage) : "";

  const legendClicks1 = formatLegendLabel(selection1, clickPercentage);
  const legendClicks2 = selection2 ? formatLegendLabel(selection2, clickPercentage) : "";

  const revenueChartOption = {
    title: { text: comparisonPeriod == 'none' ? 'Revenue Over Time' : 'Revenue Over Time Comparison' },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let tooltipContent = '';
        params.forEach(item => {
          const date = allDates1[item.dataIndex];
          const value1 = item.data;
          const value2 = params[1]?.data;
          const percentageDifference = calculatePercentageDifference(value1, value2);
          tooltipContent += `<div>${date}: ${!exchangeRate ? `$${value1}` :`${convertedCurrency(value1)}`} (${percentageDifference})</div>`;
        });
        return tooltipContent;
      },
    },
    legend: { data: [legendRevenue1, legendRevenue2], bottom: 0, left: 'center' },
    xAxis: { type: 'category', data: allDates1, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { show: false } },
    series: [
      { name: legendRevenue1, data: revenuePrices1, type: 'line', smooth: true, areaStyle: {}, lineStyle: { width: 2 }, itemStyle: { color: '#1E90FF' } },
      { name: legendRevenue2, data: revenuePrices2, type: 'line', smooth: true, areaStyle: {}, lineStyle: { width: 2 }, itemStyle: { color: '#4682B4' } },
    ],
  };
  
  const actionsChartOption = {
    title: { text:comparisonPeriod == 'none' ? 'Actions' : 'Actions Comparison' },
    tooltip: revenueChartOption.tooltip,
    legend: { data: [legendActions1, legendActions2], bottom: 0, left: 'center' },
    xAxis: { type: 'category', data: allDates1, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { show: false } },
    series: [
      { name: legendActions1, data: actionCounts1, type: 'line', smooth: true, areaStyle: {}, lineStyle: { width: 2 }, itemStyle: { color: '#1E90FF' } },
      { name: legendActions2, data: actionCounts2, type: 'line', smooth: true, areaStyle: {}, lineStyle: { width: 2 }, itemStyle: { color: '#4682B4' } },
    ],
  };
  
  const clicksChartOption = {
    title: { text:comparisonPeriod == "none" ? 'Clicks' : 'Clicks Comparison' },
    tooltip: revenueChartOption.tooltip,
    legend: { data: [legendClicks1, legendClicks2], bottom: 0, left: 'center' },
    xAxis: { type: 'category', data: allDates1, boundaryGap: false },
    yAxis: { type: 'value', axisLabel: { show: false } },
    series: [
      { name: legendClicks1, data: clickCounts1, type: 'line', smooth: true, areaStyle: {}, lineStyle: { width: 2 }, itemStyle: { color: '#1E90FF' } },
      { name: legendClicks2, data: clickCounts2, type: 'line', smooth: true, areaStyle: {}, lineStyle: { width: 2 }, itemStyle: { color: '#4682B4' } },
    ],
  };

  return (
    <div className="analytics-container">
      <div className="row">
        <div className={expandedCard === "Revenue Over Time" ? "col-12 mt-3" : "col-md-6 mt-3"}>
          <CustomCard 
            title="Revenue Over Time" 
            isExpanded={expandedCard === "Revenue Over Time"} 
            onExpand={() => toggleExpand("Revenue Over Time")}
          >
            <ReactECharts option={revenueChartOption} className="chart" />
          </CustomCard>
        </div>
        
        <div className={expandedCard === "Actions" ? "col-12 mt-3" : "col-md-6 mt-3"}>
          <CustomCard 
            title="Actions"  
            isExpanded={expandedCard === "Actions"} 
            onExpand={() => toggleExpand("Actions")}
          >
            <ReactECharts option={actionsChartOption} className="chart" />
          </CustomCard>
        </div>
        
        <div className={expandedCard === "Clicks Comparison" ? "col-12 mt-3" : "col-md-6 mt-3"}>
          <CustomCard 
            title="Clicks"  
            isExpanded={expandedCard === "Clicks Comparison"} 
            onExpand={() => toggleExpand("Clicks Comparison")}
          >
            <ReactECharts option={clicksChartOption} className="chart" />
          </CustomCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChartData;
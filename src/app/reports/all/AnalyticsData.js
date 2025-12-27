import React, { useEffect, useRef, useState } from "react";
import { ExpandOutlined, CompressOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import "./AnalyticsDashboard.scss";

const CustomCard = ({ title, children, isExpanded, onExpand, cardRef }) => (
  <div className={`custom-card ${isExpanded ? "expanded" : ""}`} ref={cardRef}>
    <div className="card-header" onClick={onExpand}>
      <h2 className="custom-card-title">{title}</h2>
      <span className="expand-icon">
        {isExpanded ? <CompressOutlined /> : <ExpandOutlined />}
      </span>
    </div>
    <div className="card-content p-0">{children}</div>
  </div>
);

const AnalyticsChartData = ({
  data,
  data2,
  clicks,
  clicks2,
  state,
  convertedCurrency,
  exchangeRate,
  comparisonPeriod,
  handleDateFilter, setHandleDateFilter
}) => {
  const { selection1, selection2, selection3 } = state;
  const [expandedCard, setExpandedCard] = useState(null);
  const revenueCardRef = useRef(null);
  const actionsCardRef = useRef(null);
  const conversionCardRef = useRef(null);
  const clicksCardRef = useRef(null);

  useEffect(() => {
    if (expandedCard) {
      setTimeout(() => {
        switch (expandedCard) {
          case "Revenue Over Time":
            revenueCardRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          case "Action":
            actionsCardRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          case "Conversion Rate":
            conversionCardRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          case "Clicks":
            clicksCardRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          default:
            break;
        }
      }, 10);
    }
  }, [expandedCard]);

  const toggleExpand = (cardTitle) => {
    setExpandedCard(expandedCard === cardTitle ? null : cardTitle);
  };

  const formatDates = (data) => {
    return data.map(
      (item) => `${item._id.year}-${item._id.month}-${item._id.day}`
    );
  };

  const getAllDatesInRange = (startDate, endDate) => {
    const dates = [];
    if (!startDate || !endDate) return dates;

    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(
        `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
        }-${currentDate.getDate()}`
      );
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

    return allDates.map((date) => dataMap[date] || 0);
  };

  const calculateTotal = (data) => {
    return data.reduce((sum, value) => sum + (value || 0), 0);
  };

  const calculatePercentageDifference = (value1, value2) => {
    // Handle undefined/null values
    const val1 = Number(value1) || 0;
    const val2 = Number(value2) || 0;

    if (val1 === 0) {
      return val2 > 0 ? "∞%" : "0%";
    }

    const diff = val2 - val1;
    const percentageDiff = (diff / val1) * 100;

    // Handle NaN and Infinity cases
    if (isNaN(percentageDiff) || !isFinite(percentageDiff)) {
      return "0%";
    }

    return `${percentageDiff.toFixed(2)}%`;
  };

  const formatLegendLabel = (selection, percentage) => {
    if (!selection || !selection.startDate || !selection.endDate) {
      return "";
    }
    const startDate = selection.startDate.toLocaleDateString();
    const endDate = selection.endDate.toLocaleDateString();
    return `${startDate} - ${endDate} (${percentage})`;
  };

  const formatCurrency = (value, useConverted = false) => {
    const numValue = Number(value) || 0;

    if (useConverted && exchangeRate && convertedCurrency) {
      try {
        if (typeof convertedCurrency === 'function') {
          const result = convertedCurrency(numValue);
          return typeof result === 'string' ? result : `$${numValue.toFixed(2)}`;
        }
      } catch (error) {
        console.error('Error in currency conversion:', error);
      }
    }

    // Fallback to USD formatting
    return `$${numValue.toFixed(2)}`;
  };

  // Get all dates in the selected range
  const allDates1 = getAllDatesInRange(
    selection1?.startDate,
    selection1?.endDate
  );
  const allDates2 = getAllDatesInRange(
    selection2?.startDate,
    selection2?.endDate
  );

  // Extract data with fallbacks
  const revenueData1 = data?.[0]?.revenue || [];
  const actionData1 = data?.[0]?.actions || [];
  const conversionData1 = data?.[0]?.conversions || [];
  const clickData1 = clicks?.[0]?.clicks || [];

  const revenueData2 = data2?.[0]?.revenue || [];
  const actionData2 = data2?.[0]?.actions || [];
  const conversionData2 = data2?.[0]?.conversions || [];
  const clickData2 = clicks2?.[0]?.clicks || [];

  // Get chart data for all selected dates
  const revenuePrices1 = getChartData(revenueData1, allDates1);
  const revenuePrices2 = getChartData(revenueData2, allDates2);

  const actionCounts1 = getChartData(actionData1, allDates1);
  const actionCounts2 = getChartData(actionData2, allDates2);

  const conversionRate1 = getChartData(conversionData1, allDates1);
  const conversionRate2 = getChartData(conversionData2, allDates2);

  const clickCounts1 = getChartData(clickData1, allDates1);
  const clickCounts2 = getChartData(clickData2, allDates2);

  // Calculate conversion rates (conversions/clicks) with safe division
  const calculateConversionRates = (conversions, clicks) => {
    return conversions.map((conversion, index) => {
      const conversionNum = Number(conversion) || 0;
      const clickCount = Number(clicks[index]) || 0;
      if (clickCount === 0) return 0;
      return (conversionNum / clickCount) * 100; // Return as percentage
    });
  };

  const conversionRates1 = calculateConversionRates(
    conversionRate1,
    clickCounts1
  );
  const conversionRates2 = calculateConversionRates(
    conversionRate2,
    clickCounts2
  );

  // Calculate overall totals and percentage differences with safe values
  const totalRevenue1 = calculateTotal(revenuePrices1);
  const totalRevenue2 = calculateTotal(revenuePrices2);
  const revenuePercentage = calculatePercentageDifference(
    totalRevenue1,
    totalRevenue2
  );

  const totalActions1 = calculateTotal(actionCounts1);
  const totalActions2 = calculateTotal(actionCounts2);
  const actionPercentage = calculatePercentageDifference(
    totalActions1,
    totalActions2
  );

  const avgConversionRate1 =
    conversionRates1.length > 0
      ? calculateTotal(conversionRates1) / conversionRates1.length
      : 0;
  const avgConversionRate2 =
    conversionRates2.length > 0
      ? calculateTotal(conversionRates2) / conversionRates2.length
      : 0;
  const conversionPercentage = calculatePercentageDifference(
    avgConversionRate1,
    avgConversionRate2
  );

  const totalClicks1 = calculateTotal(clickCounts1);
  const totalClicks2 = calculateTotal(clickCounts2);
  const clickPercentage = calculatePercentageDifference(
    totalClicks1,
    totalClicks2
  );

  // Update legend labels with overall percentages
  const legendRevenue1 = formatLegendLabel(selection1, revenuePercentage);
  const legendRevenue2 =
    comparisonPeriod !== "none"
      ? formatLegendLabel(selection2, revenuePercentage)
      : "";
  const legendActions1 = formatLegendLabel(selection1, actionPercentage);
  const legendActions2 =
    comparisonPeriod !== "none"
      ? formatLegendLabel(selection2, actionPercentage)
      : "";

  const legendConversion1 = formatLegendLabel(selection1, conversionPercentage);
  const legendConversion2 =
    comparisonPeriod !== "none"
      ? formatLegendLabel(selection2, conversionPercentage)
      : "";

  const legendClicks1 = formatLegendLabel(selection1, clickPercentage);
  const legendClicks2 =
    comparisonPeriod !== "none"
      ? formatLegendLabel(selection2, clickPercentage)
      : "";

  const createChartOption = (
    title,
    legend1,
    legend2,
    data1,
    data2,
    isRevenue = false,
    isPercentage = false
  ) => {
    const legendData = [legend1, legend2].filter((label) => label);
    const series = [
      legend1 && {
        name: legend1,
        data: data1,
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: { width: 3 },
        itemStyle: { color: "#1E90FF" },
        symbol: 'circle',
        symbolSize: 6
      },
      legend2 && {
        name: legend2,
        data: data2,
        type: "line",
        smooth: true,
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: { width: 3 },
        itemStyle: { color: "#FF6B6B" },
        symbol: 'circle',
        symbolSize: 6
      },
    ].filter(Boolean);

    // Format x-axis labels to show only day
    const xAxisLabels = allDates1.map(date => {
      const dateObj = new Date(date);
      return dateObj.getDate().toString(); // Only the day number
    });

    // Get year-month for the title or subtitle
    const getYearMonthRange = (dates) => {
      if (!dates || dates.length === 0) return '';

      const firstDate = new Date(dates[0]);
      const lastDate = new Date(dates[dates.length - 1]);

      const firstYearMonth = `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}`;
      const lastYearMonth = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}`;

      return firstYearMonth === lastYearMonth ? firstYearMonth : `${firstYearMonth} to ${lastYearMonth}`;
    };

    const yearMonthRange = getYearMonthRange(allDates1);

    // Safe y-axis formatter for revenue
    const yAxisFormatter = (value) => {
      if (isPercentage) {
        return `${value.toFixed(1)}%`;
      }
      if (isRevenue) {
        if (exchangeRate) {
          // For converted currency, show abbreviated format for large numbers
          if (value >= 1000000) {
            return formatCurrency(value / 1000000, true).replace(/(\.\d+)?$/, 'M');
          } else if (value >= 1000) {
            return formatCurrency(value / 1000, true).replace(/(\.\d+)?$/, 'K');
          }
          return formatCurrency(value, true);
        } else {
          // For USD, show abbreviated format
          if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
          }
          return `$${value.toFixed(0)}`;
        }
      }
      // For counts (actions, clicks)
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toFixed(0);
    };

    return {
      title: {
        text: comparisonPeriod === "none" ? `${title}` : `${title} Comparison`,
        subtext: yearMonthRange,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: function (params) {
          const date = allDates1[params[0].dataIndex];
          const dateObj = new Date(date);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          let tooltipContent = `<div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px;">${formattedDate}</div>`;

          params.forEach((item) => {
            const value = Number(item.data) || 0;
            let formattedValue = value;

            if (isRevenue) {
              formattedValue = formatCurrency(value, true);
            } else if (isPercentage) {
              formattedValue = `${value.toFixed(2)}%`;
            } else {
              formattedValue = value.toLocaleString();
            }

            const color = item.color;
            tooltipContent += `
              <div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span>${item.seriesName}: <strong>${formattedValue}</strong></span>
              </div>
            `;
          });
          return tooltipContent;
        },
      },
      legend: {
        data: legendData,
        bottom: 5,
        left: "center",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 11
        }
      },
      grid: {
        top: 75,
        right: 20,
        bottom: 45,
        left: 60,
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: xAxisLabels,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11
        },
        name: 'Day',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: '#666',
          fontSize: 11
        }
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        },
        axisLabel: {
          color: '#666',
          fontSize: 11,
          formatter: yAxisFormatter
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        }
      },
      series,
    };
  };

  const revenueChartOption = createChartOption(
    "Revenue Over Time",
    legendRevenue1,
    legendRevenue2,
    revenuePrices1,
    revenuePrices2,
    true
  );

  const actionsChartOption = createChartOption(
    "Actions",
    legendActions1,
    legendActions2,
    actionCounts1,
    actionCounts2
  );

  const conversionChartOption = createChartOption(
    "Conversion Rate",
    legendConversion1,
    legendConversion2,
    conversionRates1,
    conversionRates2,
    false,
    true
  );

  const clicksChartOption = createChartOption(
    "Clicks",
    legendClicks1,
    legendClicks2,
    clickCounts1,
    clickCounts2
  );

  const chartComponents = [
    {
      title: "Revenue Over Time",
      component: (
        <CustomCard
          key="revenue"
          title="Revenue Over Time"
          isExpanded={expandedCard === "Revenue Over Time"}
          onExpand={() => toggleExpand("Revenue Over Time")}
          cardRef={revenueCardRef}
        >
          <div className="chart-container">
            <ReactECharts
              option={revenueChartOption}
              className="chart"
              style={{
                height: expandedCard === "Revenue Over Time" ? '500px' : '300px',
                width: '100%'
              }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </CustomCard>
      ),
      isExpanded: expandedCard === "Revenue Over Time",
    },
    {
      title: "Actions",
      component: (
        <CustomCard
          key="actions"
          title="Actions"
          isExpanded={expandedCard === "Actions"}
          onExpand={() => toggleExpand("Actions")}
          cardRef={actionsCardRef}
        >
          <div className="chart-container">
            <ReactECharts
              option={actionsChartOption}
              className="chart"
              style={{
                height: expandedCard === "Actions" ? '500px' : '300px',
                width: '100%'
              }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </CustomCard>
      ),
      isExpanded: expandedCard === "Actions",
    },
    {
      title: "Conversion Rate",
      component: (
        <CustomCard
          key="conversion"
          title="Conversion Rate"
          isExpanded={expandedCard === "Conversion Rate"}
          onExpand={() => toggleExpand("Conversion Rate")}
          cardRef={conversionCardRef}
        >
          <div className="chart-container">
            <ReactECharts
              option={conversionChartOption}
              className="chart"
              style={{
                height: expandedCard === "Conversion Rate" ? '500px' : '300px',
                width: '100%'
              }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </CustomCard>
      ),
      isExpanded: expandedCard === "Conversion Rate",
    },
    {
      title: "Clicks",
      component: (
        <CustomCard
          key="clicks"
          title="Clicks"
          isExpanded={expandedCard === "Clicks"}
          onExpand={() => toggleExpand("Clicks")}
          cardRef={clicksCardRef}
        >
          <div className="chart-container">
            <ReactECharts
              option={clicksChartOption}
              className="chart"
              style={{
                height: expandedCard === "Clicks" ? '500px' : '300px',
                width: '100%'
              }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </CustomCard>
      ),
      isExpanded: expandedCard === "Clicks",
    },
  ];

  const sortedCharts = [...chartComponents].sort((a, b) => {
    if (a.isExpanded && !b.isExpanded) return -1;
    if (!a.isExpanded && b.isExpanded) return 1;
    return 0;
  });

  return (
    <div className="analytics-container" onClick={() => { if (handleDateFilter) { setHandleDateFilter(false) }; }}>
      <div className="row">
        {sortedCharts.map((chart, index) => (
          <div
            key={chart.title}
            className={
              chart.isExpanded
                ? "col-12 mt-3"
                : index === 0 && expandedCard
                  ? "col-lg-6 mt-3"
                  : "col-lg-6 mt-3"
            }
          >
            {chart.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsChartData;
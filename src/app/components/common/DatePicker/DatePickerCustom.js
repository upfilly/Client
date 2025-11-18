import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";

const getDateRange = (option) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

  switch (option) {
    case "today":
      return [today, today];
    case "yesterday":
      return [yesterday, yesterday];
    case "thisweek": {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return [startOfWeek, endOfWeek];
    }
    case "lastweek": {
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - today.getDay() - 6);
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
      return [startOfLastWeek, endOfLastWeek];
    }
    case "currentmonth":
      return [firstDayOfMonth, today];
    case "lastmonth":
      return [
        new Date(today.getFullYear(), today.getMonth() - 1, 1),
        new Date(today.getFullYear(), today.getMonth(), 0),
      ];
    case "thisyear":
      return [firstDayOfYear, lastDayOfYear];
    case "lastyear":
      return [
        new Date(today.getFullYear() - 1, 0, 1),
        new Date(today.getFullYear() - 1, 11, 31),
      ];
    case "last7days": {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      return [start, today];
    }
    default:
      return [today, today];
  }
};

// New function to calculate comparison periods based on base period
const getComparisonDates = (baseDates, comparisonType) => {
  const [baseStart, baseEnd] = baseDates;
  
  if (comparisonType === "previousperiod") {
    // Calculate the duration of base period
    const duration = baseEnd.getTime() - baseStart.getTime();
    
    // Calculate previous period by subtracting duration from both dates
    const compStart = new Date(baseStart);
    compStart.setTime(compStart.getTime() - duration - (24 * 60 * 60 * 1000)); // -1 day to avoid overlap
    
    const compEnd = new Date(baseStart);
    compEnd.setTime(compEnd.getTime() - (24 * 60 * 60 * 1000)); // day before base start
    
    return [compStart, compEnd];
  }
  
  if (comparisonType === "previousyear") {
    // Subtract 1 year from both dates
    const compStart = new Date(baseStart);
    compStart.setFullYear(compStart.getFullYear() - 1);
    
    const compEnd = new Date(baseEnd);
    compEnd.setFullYear(compEnd.getFullYear() - 1);
    
    return [compStart, compEnd];
  }
  
  return [new Date(), new Date()];
};

const CustomDatePicker = ({
  baseDates,
  setBaseDates,
  compDates,
  setCompDates,
  setHandleDateFilter,
  ApplyDateFilter,
  comparisonPeriod,
  setComparisonPeriod,
}) => {
  const [basePeriod, setBasePeriod] = useState("currentmonth");

  const handlePeriodChange = (option, type) => {
    const [start, end] = getDateRange(option);
    if (start && end) {
      if (type === "base") {
        setBasePeriod(option);
        setBaseDates([start, end]);
      } else {
        setComparisonPeriod(option);
        setCompDates([start, end]);
      }
    }
  };

  const handleRadioPeriodChange = (option, type) => {
    const [start, end] = getDateRange(option);
    if (start && end) {
      setBaseDates([start, end]);
      setBasePeriod(option);
      
      // Update comparison dates if comparison period is set to previous period or previous year
      if (comparisonPeriod === "previousperiod" || comparisonPeriod === "previousyear") {
        const [compStart, compEnd] = getComparisonDates([start, end], comparisonPeriod);
        setCompDates([compStart, compEnd]);
      }
    }
  };

  const handleCompareRadioPeriodChange = (option, type) => {
    setComparisonPeriod(option);
    
    if (option === "none") {
      setCompDates(["", ""]);
    } else if (option === "previousperiod" || option === "previousyear") {
      // Calculate comparison dates based on current base dates
      const [compStart, compEnd] = getComparisonDates(baseDates, option);
      setCompDates([compStart, compEnd]);
    } else if (option === "custom") {
      // For custom, you might want to set some default dates or keep existing
      if (!compDates[0] || !compDates[1]) {
        setCompDates([new Date(), new Date()]);
      }
    }
  };

  // Update comparison dates when base dates change (if comparison is active)
  React.useEffect(() => {
    if (comparisonPeriod === "previousperiod" || comparisonPeriod === "previousyear") {
      const [compStart, compEnd] = getComparisonDates(baseDates, comparisonPeriod);
      setCompDates([compStart, compEnd]);
    }
  }, [baseDates, comparisonPeriod]);

  return (
    <div className={comparisonPeriod == "none" ?  "single-date-picker-container"  : "date-picker-container"}>
      <div className="flex-container">
        <div className="flex-container">
          <h3 className="section-title">Base Period</h3>
          {[
            "Today",
            "Yesterday",
            "Last Week",
            "Last Month",
            "Last Year",
            "Custom",
            "Current Month",
            "Last 7 Days",
          ].map((option) => (
            <label key={option} className="radio-label">
              <input
                type="radio"
                name="basePeriod"
                checked={
                  basePeriod === option.toLowerCase().replace(/\s+/g, "")
                }
                onChange={() =>
                  handleRadioPeriodChange(
                    option.toLowerCase().replace(/\s+/g, ""),
                    "base"
                  )
                }
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          <h3 className="section-title mt-3">Comparison Period</h3>
          {["Previous Period", "Previous Year", "Custom", "None"].map(
            (option) => (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="comparisonPeriod"
                  checked={
                    comparisonPeriod ===
                    option.toLowerCase().replace(/\s+/g, "")
                  }
                  onChange={() =>
                    handleCompareRadioPeriodChange(
                      option.toLowerCase().replace(/\s+/g, ""),
                      "comparison"
                    )
                  }
                />
                {option}
              </label>
            )
          )}
        </div>
      </div>

      <div className="date-picker-wrapper">
        <div className="d-flex gap-3 date-picker-inner justify-content-center justify-content-lg-end">
          <DateRange
            ranges={[
              {
                startDate: baseDates[0],
                endDate: baseDates[1],
                key: "selection",
              },
            ]}  
            onChange={(ranges) => {
              const newBaseDates = [
                ranges.selection.startDate,
                ranges.selection.endDate,
              ];
              setBaseDates(newBaseDates);
              
              // Update comparison dates automatically for previous period/year
              if (comparisonPeriod === "previousperiod" || comparisonPeriod === "previousyear") {
                const [compStart, compEnd] = getComparisonDates(newBaseDates, comparisonPeriod);
                setCompDates([compStart, compEnd]);
              }
            }}
            moveRangeOnFirstSelection={true}
            editableDateInputs={false}
            maxDate={new Date()}
          />
          {comparisonPeriod !== "none" && (
            <DateRange
              ranges={[
                {
                  startDate: compDates[0],
                  endDate: compDates[1],
                  key: "selection",
                },
              ]}
              onChange={(ranges) => {
                // Only allow manual changes if comparison period is set to custom
                if (comparisonPeriod === "custom") {
                  setCompDates([
                    ranges.selection.startDate,
                    ranges.selection.endDate,
                  ]);
                }
              }}
              moveRangeOnFirstSelection={true}
              rangeColors={["#198754"]}
              editableDateInputs={comparisonPeriod === "custom"}
              maxDate={new Date()}
              disabled={comparisonPeriod !== "custom"} // Disable interaction for non-custom comparisons
            />
          )}
        </div>
        <div className="button-container gap-2 gap-sm-0">
          <button
            className="cancel-btn"
            onClick={() => setHandleDateFilter(false)}
          >
            Cancel
          </button>
          <button className="apply-btn" onClick={() => ApplyDateFilter()}>
            Apply 
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;
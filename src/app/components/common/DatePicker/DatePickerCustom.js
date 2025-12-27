import React, { useState, useEffect } from "react";
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

// Helper function to check if two date ranges are equal
const areDateRangesEqual = (range1, range2) => {
  if (!range1[0] || !range1[1] || !range2[0] || !range2[1]) return false;

  return (
    range1[0].toDateString() === range2[0].toDateString() &&
    range1[1].toDateString() === range2[1].toDateString()
  );
};

// Helper function to find which predefined period matches the given dates
const findMatchingPeriod = (dates) => {
  if (!dates[0] || !dates[1]) return null;

  const periodOptions = [
    "today",
    "yesterday",
    "thisweek",
    "lastweek",
    "currentmonth",
    "lastmonth",
    "thisyear",
    "lastyear",
    "last7days"
  ];

  for (const option of periodOptions) {
    const optionDates = getDateRange(option);
    if (areDateRangesEqual(dates, optionDates)) {
      return option;
    }
  }

  return "custom"; // Return custom if no match found
};

// Helper function to check if comparison dates match a calculated period
const checkIfComparisonMatchesPeriod = (baseDates, compDates, comparisonPeriod) => {
  if (comparisonPeriod === "previousperiod" || comparisonPeriod === "previousyear") {
    const calculatedCompDates = getComparisonDates(baseDates, comparisonPeriod);
    return areDateRangesEqual(compDates, calculatedCompDates);
  }
  return false;
};

const getComparisonDates = (baseDates, comparisonType) => {
  const [baseStart, baseEnd] = baseDates;

  if (comparisonType === "previousperiod") {
    const duration = baseEnd.getTime() - baseStart.getTime();
    const compStart = new Date(baseStart);
    compStart.setTime(compStart.getTime() - duration - (24 * 60 * 60 * 1000));
    const compEnd = new Date(baseStart);
    compEnd.setTime(compEnd.getTime() - (24 * 60 * 60 * 1000));
    return [compStart, compEnd];
  }

  if (comparisonType === "previousyear") {
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
  const [prevCompDates, setPrevCompDates] = useState(compDates);

  // Effect to update basePeriod when baseDates change (e.g., from calendar selection)
  useEffect(() => {
    const matchingPeriod = findMatchingPeriod(baseDates);
    setBasePeriod(matchingPeriod);
  }, [baseDates]);

  // Effect to check if comparison dates have been manually modified
  useEffect(() => {
    // Skip if no comparison dates or comparison period is already custom
    if (!compDates[0] || !compDates[1] || comparisonPeriod === "custom" || comparisonPeriod === "none") {
      setPrevCompDates(compDates);
      return;
    }

    // Check if dates have actually changed
    const datesChanged = !areDateRangesEqual(compDates, prevCompDates);

    if (datesChanged) {
      // Check if the new dates still match the current comparison period calculation
      const stillMatchesPeriod = checkIfComparisonMatchesPeriod(baseDates, compDates, comparisonPeriod);

      if (!stillMatchesPeriod) {
        // If dates were manually changed and no longer match the calculated period, switch to custom
        setComparisonPeriod("custom");
      }

      setPrevCompDates(compDates);
    }
  }, [compDates, baseDates, comparisonPeriod]);

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
      const [compStart, compEnd] = getComparisonDates(baseDates, option);
      setCompDates([compStart, compEnd]);
    } else if (option === "custom") {
      if (!compDates[0] || !compDates[1]) {
        setCompDates([new Date(), new Date()]);
      }
    }
  };

  // Update comparison dates when base dates change (if comparison is active)
  useEffect(() => {
    if (comparisonPeriod === "previousperiod" || comparisonPeriod === "previousyear") {
      const [compStart, compEnd] = getComparisonDates(baseDates, comparisonPeriod);
      setCompDates([compStart, compEnd]);
      setPrevCompDates([compStart, compEnd]);
    }
  }, [baseDates, comparisonPeriod]);

  return (
    <div className={comparisonPeriod == "none" ? "single-date-picker-container" : "date-picker-container"}>
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
          ].map((option) => {
            const optionKey = option.toLowerCase().replace(/\s+/g, "");
            return (
              <label key={option} className="radio-label">
                <input
                  type="radio"
                  name="basePeriod"
                  checked={basePeriod === optionKey}
                  onChange={() =>
                    handleRadioPeriodChange(optionKey, "base")
                  }
                />
                {option}
              </label>
            );
          })}
        </div>
        <div>
          <h3 className="section-title mt-3">Comparison Period</h3>
          {["Previous Period", "Previous Year", "Custom", "None"].map(
            (option) => {
              const optionKey = option.toLowerCase().replace(/\s+/g, "");
              return (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    name="comparisonPeriod"
                    checked={comparisonPeriod === optionKey}
                    onChange={() =>
                      handleCompareRadioPeriodChange(optionKey, "comparison")
                    }
                  />
                  {option}
                </label>
              );
            }
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

              // The basePeriod will be updated automatically via the useEffect

              if (comparisonPeriod === "previousperiod" || comparisonPeriod === "previousyear") {
                const [compStart, compEnd] = getComparisonDates(newBaseDates, comparisonPeriod);
                setCompDates([compStart, compEnd]);
                setPrevCompDates([compStart, compEnd]);
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
                // Allow manual changes regardless of current comparison period
                // The useEffect will detect the change and switch to custom if needed
                const newCompDates = [
                  ranges.selection.startDate,
                  ranges.selection.endDate,
                ];
                setCompDates(newCompDates);
              }}
              moveRangeOnFirstSelection={true}
              rangeColors={["#198754"]}
              editableDateInputs={true} // Always allow date input
              maxDate={new Date()}
            // Don't disable the calendar - allow interaction
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
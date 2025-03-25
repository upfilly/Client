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
        case "thismonth":
            return [firstDayOfMonth, lastDayOfMonth];
        case "lastmonth":
            return [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(), today.getMonth(), 0)];
        case "thisyear":
            return [firstDayOfYear, lastDayOfYear];
        case "lastyear":
            return [new Date(today.getFullYear() - 1, 0, 1), new Date(today.getFullYear() - 1, 11, 31)];
        default:
            return [today, today];
    }
};

const CustomDatePicker = ({baseDates, setBaseDates,compDates, setCompDates,setHandleDateFilter,ApplyDateFilter,comparisonPeriod, setComparisonPeriod}) => {
    const [basePeriod, setBasePeriod] = useState("custom");
    // const [comparisonPeriod, setComparisonPeriod] = useState("previousYear");
    // const [baseDates, setBaseDates] = useState([new Date(), new Date()]);
    // const [compDates, setCompDates] = useState([new Date(), new Date()]);

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
            //   if (type === "base") {
            setBasePeriod(option);
            setBaseDates([start, end]);
            // setComparisonPeriod(option);
            setCompDates([start, end]);
            //   } else {
            //     setComparisonPeriod(option);
            //     setCompDates([start, end]);
            //   }
        }
    };

    const handleCompareRadioPeriodChange = (option, type) => {
        const [start, end] = getDateRange(option);
        // if (start && end) {
        //   if (type === "base") {
        // setBasePeriod(option);
        setBaseDates([start, end]);
        setComparisonPeriod(option);
        if(option == "none"){
           setCompDates(["", ""]); 
        }
        // setCompDates([start, end]);
        //   } else {
        //     setComparisonPeriod(option);
        //     setCompDates([start, end]);
        //   }
        // }
    };

    return (
        <div className="date-picker-container">
            <div className="flex-container">
                <div className="flex-container">
                    <h3 className="section-title">Base Period</h3>
                    {["Today", "Yesterday", "Last Week",  "Last Month", "Last Year", "Custom"].map((option) => (
                        <label key={option} className="radio-label">
                            <input
                                type="radio"
                                name="basePeriod"
                                checked={basePeriod === option.toLowerCase().replace(/\s+/g, "")}
                                onChange={() => handleRadioPeriodChange(option.toLowerCase().replace(/\s+/g, ""), "base")}
                            />
                            {option}
                        </label>
                    ))}
                </div>
                <div>
                    <h3 className="section-title mt-3">Comparison Period</h3>
                    {["Previous Period", "Previous Year", "Custom", "None"].map((option) => (
                        <label key={option} className="radio-label">
                            <input
                                type="radio"
                                name="comparisonPeriod"
                                checked={comparisonPeriod === option.toLowerCase().replace(/\s+/g, "")}
                                onChange={() => handleCompareRadioPeriodChange(option.toLowerCase().replace(/\s+/g, ""), "comparison")}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
            <div className="date-picker-wrapper">
                <div className="d-flex gap-3">
                    <DateRange
                        ranges={[{ startDate: baseDates[0], endDate: baseDates[1], key: "selection" }]}
                        onChange={(ranges) => setBaseDates([ranges.selection.startDate, ranges.selection.endDate])}
                        moveRangeOnFirstSelection={true}
                        editableDateInputs={false}
                        maxDate={new Date()}
                    />
                    {comparisonPeriod !== "none" && (
                        <DateRange
                            ranges={[{ startDate: compDates[0], endDate: compDates[1], key: "selection" }]}
                            onChange={(ranges) => setCompDates([ranges.selection.startDate, ranges.selection.endDate])}
                            moveRangeOnFirstSelection={true}
                            rangeColors={['#198754']}
                            editableDateInputs={false}
                            maxDate={new Date()}
                        />
                    )}
                </div>
                <div className="button-container">
                    <button className="cancel-btn" onClick={()=>setHandleDateFilter(false)}>Cancel</button>
                    <button className="apply-btn" onClick={()=>ApplyDateFilter()}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default CustomDatePicker;

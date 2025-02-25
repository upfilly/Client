'use client';

import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import Layout from '@/app/components/global/layout';
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import './AnalyticsDashboard.scss';

const lineChartOption = {
    xAxis: {
        type: 'category',
        data: ['Feb 20, 2025', 'Feb 21, 2025']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [938, 50],
            type: 'line',
            smooth: true,
            areaStyle: { color: 'rgba(74, 144, 226, 0.4)' },
            lineStyle: { color: '#4A90E2', width: 3 },
            symbol: 'circle',
            symbolSize: 10
        }
    ]
};

const CustomCard = ({ title, children }) => (
    <div className="custom-card">
        <h2 className="custom-card-title">{title}</h2>
        {children}
    </div>
);

export default function AnalyticsDashboard() {
    const [dateFilter, setdateFilter] = useState([
        {
            startDate: "",
            endDate: "",
            key: "selection",
        },
    ]);
    const [handleDateFilter, sethandleDateFilter] = useState(false);
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <Layout>
            <div className="dashboard">
                <aside className="sidebar">
                    <h1 className="sidebar-title">Insights</h1>
                    <nav className="sidebar-nav">
                        <button className="sidebar-button">Program Overview</button>
                        <button className="sidebar-button">Performance</button>
                        <button className="sidebar-button">Customer Analysis</button>
                    </nav>
                </aside>

                <main className="main-content">
                    <div className='d-flex'>
                        <span
                            class="form-select position-relactive  date_select"
                            onClick={(e) => sethandleDateFilter(!handleDateFilter)}
                            onBlur={(e) => sethandleDateFilter(false)}
                        >
                            {dateFilter?.[0]?.startDate || dateFilter?.[0]?.endDate
                                ? `${moment(dateFilter?.[0]?.startDate).format(
                                    "MMMM DD, YYYY"
                                )} - ${moment(dateFilter?.[0]?.endDate).format(
                                    "MMMM DD, YYYY"
                                )}`
                                : "Select Date Range"}
                        </span>
                        <select className="dropdown ml-3 bg-white border-class">
                            <option>Gross (Before corrections)</option>
                            <option>Net (After corrections)</option>
                        </select>
                    </div>
                    <div className="controls mt-2">

                        {handleDateFilter && <DateRangePicker
                            onChange={(item) => {
                                setdateFilter([
                                    {
                                        startDate: item.selection.startDate,
                                        endDate: item.selection.endDate,
                                        key: "selection",
                                    },
                                ]);
                            }}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={dateFilter}
                            direction="horizontal"
                            className="rounded"
                            startDatePlaceholder="Date"
                            endDatePlaceholder="Date"
                        />}

                    </div>

                    <div className="cards-grid">
                        <CustomCard title="Revenue Over Time">
                            <ReactECharts option={lineChartOption} className="chart" />
                        </CustomCard>
                        <CustomCard title="Clicks">
                            <ReactECharts option={lineChartOption} className="chart" />
                        </CustomCard>
                        <CustomCard title="Actions">
                            <ReactECharts option={lineChartOption} className="chart" />
                        </CustomCard>

                    </div>
                </main>
            </div>
        </Layout>
    );
}

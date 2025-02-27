'use client';

import React, { useEffect, useState } from 'react';
import { addDays } from 'date-fns';
import ReactECharts from 'echarts-for-react';
import Layout from '@/app/components/global/layout';
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import './AnalyticsDashboard.scss';
import ApiClient from '@/methods/api/apiClient';
import AnalyticsChartData from './AnalyticsData'

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



export default function AnalyticsDashboard() {
    const [state, setState] = useState({
        selection1: {
            startDate: addDays(new Date(), -6),
            endDate: new Date(),
            key: 'selection1'
        },
        selection2: {
            startDate: addDays(new Date(), 1),
            endDate: addDays(new Date(), 7),
            key: 'selection2'
        }
    });
    const [data, setData] = useState()
    const [data2, setData2] = useState()
    const [clicks, setClicks] = useState()
    const [clicks2, setClicks2] = useState()
    const [handleDateFilter, setHandleDateFilter] = useState(false);

    // const handleDateChange = (ranges) => {
    //     if (ranges.selection1 && ranges.selection2) {
    //         setDateFilter([ranges.selection1, ranges.selection2]);
    //     }
    // };

    const getAnalyticsData = (p = {}) => {
        let filter = { ...p }
        let url = 'analytics-reports'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setData2(res?.data?.data2)
                setData(res?.data?.data)
                console.log(res?.data, "oppppoppopopo")
            }
        })
    }

    const getClicksAnalyticsData = (p = {}) => {
        let filter = { ...p }
        let url = 'analytics-click'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setClicks2(res?.data?.data2)
                setClicks(res?.data?.data)
                console.log(res?.data, "oppppoppopopo")
            }
        })
    }

    useEffect(() => {
        getClicksAnalyticsData({
            // startDate: moment(state?.selection1?.startDate).format("YYYY-MM-DD"),
            // endDate: moment(state?.selection1?.endDate).format("YYYY-MM-DD"),
            // affiliate_id: "",
            // brand_id: "",
            // startDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
            // endDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
        })
        getAnalyticsData({
            // startDate: moment(state?.selection1?.startDate).format("YYYY-MM-DD"),
            // endDate: moment(state?.selection1?.endDate).format("YYYY-MM-DD"),
            // affiliate_id: "",
            // brand_id: "",
            // startDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
            // endDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
        })
    }, [state])

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
                            className="form-select position-relative date_select"
                            onClick={(e) => setHandleDateFilter(!handleDateFilter)}
                            onBlur={(e) => setHandleDateFilter(false)}
                        >
                            {
                                state?.selection1?.startDate || state?.selection1?.endDate || state?.selection2?.startDate || state?.selection2?.endDate
                                    ? `${moment(state?.selection1?.startDate).format("MMMM DD, YYYY")} - ${moment(state?.selection1?.endDate).format("MMMM DD, YYYY")} && ${moment(state?.selection2?.startDate).format("MMMM DD, YYYY")} - ${moment(state?.selection2?.endDate).format("MMMM DD, YYYY")}`
                                    : "Select Date Range"
                            }
                        </span>
                        <select className="dropdown ml-3 bg-white border-class">
                            <option>Gross (Before corrections)</option>
                            <option>Net (After corrections)</option>
                        </select>
                    </div>

                    <div className="controls mt-2">
                        {handleDateFilter && (
                            <DateRangePicker
                                onChange={item => setState({ ...state, ...item })}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={[state.selection1, state.selection2]}
                                direction="horizontal"
                                ariaLabels={{
                                    dateInput: {
                                        selection1: { startDate: "start date input of selction 1", endDate: "end date input of selction 1" },
                                        selection2: { startDate: "start date input of selction 2", endDate: "end date input of selction 2" }
                                    },
                                    monthPicker: "month picker",
                                    yearPicker: "year picker",
                                    prevButton: "previous month button",
                                    nextButton: "next month button",
                                }}
                            />
                        )}
                    </div>
                    <AnalyticsChartData data={data} data2={data2} clicks={clicks} clicks2={clicks2} state={state}/>
                </main>
            </div>
        </Layout>
    );
}

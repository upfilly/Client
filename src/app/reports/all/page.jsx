'use client';

import React, { useEffect, useState } from 'react';
import { addDays } from 'date-fns';
import Layout from '@/app/components/global/layout';
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import './AnalyticsDashboard.scss';
import ApiClient from '@/methods/api/apiClient';
import AnalyticsChartData from './AnalyticsData'
import MultiSelectValue from '@/app/components/common/MultiSelectValue';
import crendentialModel from '@/models/credential.model';

export default function AnalyticsDashboard() {
    const user = crendentialModel.getUser()
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
    const [affiliateData, setAffiliateData] = useState();
    const [selectedAffiliate,setSelectedAffiliate] = useState();
    const [selectedBrand,setSelectedBrand] = useState();
    const [brands,setBrands] = useState();

    console.log(selectedBrand,"associated/brands")

    const getBrandData = (p = {}) => {
        let url = 'associated/brands'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                setBrands(filteredData)
            }
        })
    }

    const getData = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url, { brand_id: user?.id || user?._id }).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                setAffiliateData(filteredData)
            }
        })
    }

    useEffect(() => {
        getData()
        getBrandData()
    }, [])

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
            startDate: moment(state?.selection1?.startDate).format("YYYY-MM-DD"),
            endDate: moment(state?.selection1?.endDate).format("YYYY-MM-DD"),
            affiliate_id:selectedAffiliate || "",
            brand_id:selectedBrand || "",
            startDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
            endDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
        })
        getAnalyticsData({
            startDate: moment(state?.selection1?.startDate).format("YYYY-MM-DD"),
            endDate: moment(state?.selection1?.endDate).format("YYYY-MM-DD"),
            affiliate_id:selectedAffiliate || "",
            brand_id:selectedBrand || "",
            startDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
            endDate2: moment(state?.selection2?.endDate).format("YYYY-MM-DD"),
        })
    }, [state,selectedAffiliate,selectedBrand])

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
                                    ? `${moment(state?.selection1?.startDate).format("MMMM DD, YYYY")} - ${moment(state?.selection1?.endDate).format("MMMM DD, YYYY")} ⇆ ${moment(state?.selection2?.startDate).format("MMMM DD, YYYY")} - ${moment(state?.selection2?.endDate).format("MMMM DD, YYYY")}`
                                    : "Select Date Range"
                            }
                        </span>

                        {user.role != "brand" ?
                            <MultiSelectValue
                                id="statusDropdown"
                                displayValue="fullName"
                                placeholder="Select Affiliate"
                                singleSelect={true}
                                intialValue={selectedBrand}
                                result={e => {
                                    setSelectedBrand(e.value);
                                }}
                                options={brands}
                            />
                            : <MultiSelectValue
                                id="statusDropdown"
                                displayValue="fullName"
                                placeholder="Select Affiliate"
                                singleSelect={true}
                                intialValue={selectedAffiliate}
                                result={e => {
                                    setSelectedAffiliate(e.value);
                                }}
                                options={affiliateData}
                            />}
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

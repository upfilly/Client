'use client';

import React, { useEffect, useState } from 'react';
import { addDays } from 'date-fns';
import Layout from '@/app/components/global/layout';
// import { DateRangePicker } from "react-date-range";
import moment from "moment";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-datepicker/dist/react-datepicker.css';
import './AnalyticsDashboard.scss';
import ApiClient from '@/methods/api/apiClient';
import AnalyticsChartData from './AnalyticsData'
import MultiSelectValue from '@/app/components/common/MultiSelectValue';
import crendentialModel from '@/models/credential.model';
import CustomDatePicker from '../../components/common/DatePicker/DatePickerCustom'
import { CurencyData } from '@/methods/currency';
import SelectDropdown from '@/app/components/common/SelectDropdown';

export default function AnalyticsDashboard() {
    const user = crendentialModel.getUser()
    const [state, setState] = useState({
        selection1: {
            startDate: addDays(new Date(), -6),
            endDate: new Date(),
            key: 'selection1'
        },
        selection2: {
            startDate: addDays(new Date(), -31),
            endDate: addDays(new Date(), -47),
            key: 'selection2'
        }
    });
    const [data, setData] = useState()
    const [data2, setData2] = useState()
    const [clicks, setClicks] = useState()
    const [clicks2, setClicks2] = useState()
    const [handleDateFilter, setHandleDateFilter] = useState(false);
    const [affiliateData, setAffiliateData] = useState();
    const [selectedAffiliate, setSelectedAffiliate] = useState();
    const [selectedBrand, setSelectedBrand] = useState();
    const [brands, setBrands] = useState();
    const [baseDates, setBaseDates] = useState([new Date(), new Date()]);
    const [compDates, setCompDates] = useState([new Date(), new Date()]);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [comparisonPeriod, setComparisonPeriod] = useState("previousYear");

    const dateRange = {
        selection1: {
            startDate: baseDates?.[0],
            endDate: baseDates?.[1],
            key: 'selection1'
        },
        selection2: {
            startDate: compDates?.[0],
            endDate: compDates?.[1],
            key: 'selection2'
        }
    }

    const isFilterApplied = () => {
        return (
            selectedAffiliate ||
            selectedBrand ||
            state.selection1.startDate !== addDays(new Date(), -6) ||
            state.selection1.endDate !== new Date() ||
            state.selection2.startDate !== addDays(new Date(), 1) ||
            state.selection2.endDate !== addDays(new Date(), 7)
        );
    };

    const convertedCurrency = (price) => {
        if (price && exchangeRate) {
            const totalCal = (price * exchangeRate).toFixed(2) + " " + selectedCurrency
            return totalCal
        } else {
            return price
        }
    }

    const getExchangeRate = async (currency) => {
        try {
            const res = await fetch(`https://v6.exchangerate-api.com/v6/b0247d42906773d9631b53b0/pair/USD/${currency}`);
            const data = await res.json();

            if (data.result === "success") {
                setExchangeRate(data.conversion_rate);
            } else {
                setExchangeRate("")
                // toast.error('Failed to fetch exchange rate');
            }
        } catch (err) {
            setExchangeRate("")
            console.error(err);
            // toast.error('Error fetching exchange rate');
        }
    };

    const handleCurrencyChange = (e) => {
        const currency = e.value;
        setSelectedCurrency(currency);
        getExchangeRate(currency);
    };

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
            }
        })
    }

    useEffect(() => {
        getClicksAnalyticsData({
            startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
            endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
            affiliate_id: selectedAffiliate || "",
            brand_id: selectedBrand || "",
            startDate2: moment(compDates?.[0]).format("YYYY-MM-DD"),
            endDate2: moment(compDates?.[1]).format("YYYY-MM-DD"),
        })
        getAnalyticsData({
            startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
            endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
            affiliate_id: selectedAffiliate || "",
            brand_id: selectedBrand || "",
            startDate2: moment(compDates?.[0]).format("YYYY-MM-DD"),
            endDate2: moment(compDates?.[1]).format("YYYY-MM-DD"),
        })
    }, [selectedAffiliate, selectedBrand])

    const ApplyDateFilter = () => {
        getClicksAnalyticsData({
            startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
            endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
            // affiliate_id: selectedAffiliate || "",
            // brand_id: selectedBrand || "",
            startDate2: comparisonPeriod == 'none' ? "" : moment(compDates?.[0]).format("YYYY-MM-DD"),
            endDate2: comparisonPeriod == 'none' ? "" : moment(compDates?.[1]).format("YYYY-MM-DD"),
        })
        getAnalyticsData({
            startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
            endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
            // affiliate_id: selectedAffiliate || "",
            // brand_id: selectedBrand || "",
            startDate2: comparisonPeriod == 'none' ? "" : moment(compDates?.[0]).format("YYYY-MM-DD"),
            endDate2: comparisonPeriod == 'none' ? "" : moment(compDates?.[1]).format("YYYY-MM-DD"),
        })
        setHandleDateFilter(false)
    }

    const resetFilters = () => {
        setBaseDates([new Date(), new Date()]);
        setCompDates([new Date(), new Date()]);
        setSelectedAffiliate(null);
        setSelectedBrand(null);
    };

    return (
        <Layout name="Reports">
            <div className="dashboard">
                <aside className="sidebar">
                    <h1 className="sidebar-title">Insights</h1>
                    <nav className="sidebar-nav">
                        <button className="sidebar-button">Program Overview</button>
                        {/* <button className="sidebar-button">Performance</button>
                        <button className="sidebar-button">Customer Analysis</button> */}
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
                                baseDates?.[0] || baseDates?.[1] || compDates?.[0] || compDates?.[1]
                                    ? comparisonPeriod == 'none' ? `${moment(baseDates?.[0]).format("MMMM DD, YYYY")} - ${moment(baseDates?.[1]).format("MMMM DD, YYYY")}` : `${moment(baseDates?.[0]).format("MMMM DD, YYYY")} - ${moment(baseDates?.[1]).format("MMMM DD, YYYY")} ⇆ ${moment(compDates?.[0]).format("MMMM DD, YYYY")} - ${moment(compDates?.[1]).format("MMMM DD, YYYY")}`
                                    : "Select Date Range"
                            }
                        </span>

                        {user.role != "brand" ?
                            <MultiSelectValue
                                id="statusDropdown"
                                displayValue="fullName"
                                placeholder="Select Brand"
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

                        <SelectDropdown
                            theme='search'
                            id="currencyDropdown"
                            displayValue="name"
                            placeholder="Select Currency"
                            intialValue={selectedCurrency}
                            result={handleCurrencyChange}
                            options={CurencyData}
                        />
                    </div>

                    <div className="controls mt-2">
                        {/* {handleDateFilter && (
                            <DateRangePicker
                                onChange={item => setState({ ...state, ...item })}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                maxDate={new Date()}
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
                        )} */}
                        {handleDateFilter && <CustomDatePicker baseDates={baseDates} setBaseDates={setBaseDates} compDates={compDates} setCompDates={setCompDates} setHandleDateFilter={setHandleDateFilter} ApplyDateFilter={ApplyDateFilter} comparisonPeriod={comparisonPeriod} setComparisonPeriod={setComparisonPeriod} />}
                    </div>

                    <div className="reset-filters-container">
                        {isFilterApplied() && (
                            <button className="reset-button" onClick={resetFilters}>
                                Reset Filters
                            </button>
                        )}
                    </div>


            <AnalyticsChartData data={data} data2={data2} clicks={clicks} clicks2={clicks2} state={dateRange} convertedCurrency={convertedCurrency} exchangeRate={exchangeRate}/>
                </main>
            </div>
        </Layout>
    );
}

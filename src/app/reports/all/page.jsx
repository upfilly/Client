"use client";

import React, { useEffect, useState } from "react";
import { addDays } from "date-fns";
import Layout from "@/app/components/global/layout";
// import { DateRangePicker } from "react-date-range";
import moment from "moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-datepicker/dist/react-datepicker.css";
import "./AnalyticsDashboard.scss";
import ApiClient from "@/methods/api/apiClient";
import AnalyticsChartData from "./AnalyticsData";
import MultiSelectValue from "@/app/components/common/MultiSelectValue";
import crendentialModel from "@/models/credential.model";
import CustomDatePicker from "../../components/common/DatePicker/DatePickerCustom";
import { CurencyData } from "@/methods/currency";
import SelectDropdown from "@/app/components/common/SelectDropdown";

export default function AnalyticsDashboard() {
  const user = crendentialModel.getUser();
  const [state, setState] = useState({
    selection1: {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: "selection1",
    },
    selection2: {
      startDate: addDays(new Date(), -31),
      endDate: addDays(new Date(), -47),
      key: "selection2",
    },
  });
  const [data, setData] = useState();
  const [data2, setData2] = useState();
  const [clicks, setClicks] = useState();
  const [clicks2, setClicks2] = useState();
  const [handleDateFilter, setHandleDateFilter] = useState(false);
  const [affiliateData, setAffiliateData] = useState();
  const [selectedAffiliate, setSelectedAffiliate] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [brands, setBrands] = useState();
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [baseDates, setBaseDates] = useState([firstDayOfMonth, today]);
  const [compDates, setCompDates] = useState([firstDayOfMonth, today]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [comparisonPeriod, setComparisonPeriod] = useState("none");
  const [CampaignData, setCamapign] = useState([]);
  const [campaignId, setCampaignId] = useState([]);

  console.log(baseDates, "basedate");

  const dateRange = {
    selection1: {
      startDate: baseDates?.[0],
      endDate: baseDates?.[1],
      key: "selection1",
    },
    selection2: {
      startDate: compDates?.[0],
      endDate: compDates?.[1],
      key: "selection2",
    },
  };

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
      const totalCal =
        (price * exchangeRate).toFixed(2) + " " + selectedCurrency;
      return totalCal;
    } else {
      return price;
    }
  };

  const getExchangeRate = async (currency) => {
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/b0247d42906773d9631b53b0/pair/USD/${currency}`
      );
      const data = await res.json();

      if (data.result === "success") {
        setExchangeRate(data.conversion_rate);
      } else {
        setExchangeRate("");
        // toast.error('Failed to fetch exchange rate');
      }
    } catch (err) {
      setExchangeRate("");
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
    let url = "associated/brands";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.filter((item) => item !== null);
        setBrands(filteredData);
      }
    });
  };

  const getData = (p = {}) => {
    let url = "campaign/affiliate";
    ApiClient.get(url, { campaign:campaignId?.map((dat)=>dat).join(",")}).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.affiliateFetch?.filter((item) => item !== null);
        const uniqueData = filteredData?.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.id === item.id
          ))
        );
        setAffiliateData(uniqueData);
      }else{
        setAffiliateData([]);
      }
    });
  };

  useEffect(() => {
    getBrandData();
  }, []);

  useEffect(() => {
    getData();
  }, [campaignId]);

  const getAnalyticsData = (p = {}) => {
    let filter = { ...p };
    let url = "analytics-reports";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        setData2(res?.data?.data2);
        setData(res?.data?.data);
      }
    });
  };

  const getClicksAnalyticsData = (p = {}) => {
    let filter = { ...p };
    let url = "analytics-click";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        setClicks2(res?.data?.data2);
        setClicks(res?.data?.data);
      }
    });
  };

  const getCamapignData = (p = {}) => {
    let filter = { ...p };
    let url = "campaign/brand/all";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const data = res?.data?.data?.map((data) => {
          return {
            id: data?.id || data?._id,
            name: data?.name,
          };
        });
        setCamapign(data);
      }
    });
  };

  useEffect(() => {
    getCamapignData();
    getClicksAnalyticsData({
      startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
      endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
      affiliate_id: selectedAffiliate?.map((dat) => dat).join(",") || "",
      brand_id: selectedBrand?.map((dat) => dat).join(",") || "",
      campaign: campaignId?.map((dat) => dat).join(",") || "",
      startDate2: moment(compDates?.[0]).format("YYYY-MM-DD"),
      endDate2: moment(compDates?.[1]).format("YYYY-MM-DD"),
    });
    getAnalyticsData({
      startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
      endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
      campaign: campaignId?.map((dat) => dat).join(",") || "",
      affiliate_id: selectedAffiliate?.map((dat) => dat).join(",") || "",
      brand_id: selectedBrand?.map((dat) => dat).join(",") || "",
      startDate2: moment(compDates?.[0]).format("YYYY-MM-DD"),
      endDate2: moment(compDates?.[1]).format("YYYY-MM-DD"),
    });
  }, [selectedAffiliate, selectedBrand, campaignId]);

  const ApplyDateFilter = () => {
    // Ensure compDates are valid when switching from "none" to another period
    let effectiveCompDates = compDates;
    if (comparisonPeriod !== "none" && (!compDates[0] || !compDates[1])) {
      // Set default comparison dates based on the selected period
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      switch (comparisonPeriod) {
        case "previousPeriod":
          const duration = baseDates[1] - baseDates[0];
          effectiveCompDates = [
            new Date(baseDates[0].getTime() - duration - 1),
            new Date(baseDates[1].getTime() - duration - 1),
          ];
          break;
        case "previousYear":
          effectiveCompDates = [
            new Date(
              baseDates[0].getFullYear() - 1,
              baseDates[0].getMonth(),
              baseDates[0].getDate()
            ),
            new Date(
              baseDates[1].getFullYear() - 1,
              baseDates[1].getMonth(),
              baseDates[1].getDate()
            ),
          ];
          break;
        default:
          effectiveCompDates = [firstDayOfMonth, today];
      }
      setCompDates(effectiveCompDates);
    }

    getClicksAnalyticsData({
      startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
      endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
      affiliate_id: selectedAffiliate?.map((dat) => dat).join(",") || "",
      brand_id: selectedBrand?.map((dat) => dat).join(",") || "",
      campaign: campaignId?.map((dat) => dat).join(",") || "",
      startDate2:
        comparisonPeriod == "none"
          ? ""
          : moment(effectiveCompDates?.[0]).format("YYYY-MM-DD"),
      endDate2:
        comparisonPeriod == "none"
          ? ""
          : moment(effectiveCompDates?.[1]).format("YYYY-MM-DD"),
    });

    getAnalyticsData({
      startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
      endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
      affiliate_id: selectedAffiliate?.map((dat) => dat).join(",") || "",
      brand_id: selectedBrand?.map((dat) => dat).join(",") || "",
      campaign: campaignId?.map((dat) => dat).join(",") || "",
      startDate2:
        comparisonPeriod == "none"
          ? ""
          : moment(effectiveCompDates?.[0]).format("YYYY-MM-DD"),
      endDate2:
        comparisonPeriod == "none"
          ? ""
          : moment(effectiveCompDates?.[1]).format("YYYY-MM-DD"),
    });

    setHandleDateFilter(false);
  };

  const resetFilters = () => {
    setBaseDates([firstDayOfMonth, today]);
    setCompDates([firstDayOfMonth, today]);
    setSelectedAffiliate(null);
    setSelectedBrand(null);
    setCampaignId(null);
  };

  return (
    <Layout name="Reports">
      <div className="dashboard">
        <aside className="sidebar">
          <h1 className="sidebar-title">Insights </h1>
          <nav className="sidebar-nav">
            {/* <button className="sidebar-button">Program Overview</button> */}
            {/* <button className="sidebar-button">Performance</button>
                        <button className="sidebar-button">Customer Analysis</button> */}
          </nav>
        </aside>

        <main className="main-content">
          <div className="custom-dropdown">
            <div className="dropdown-item">
              <span
                className="form-select position-relative date_select"
                onClick={() => setHandleDateFilter(!handleDateFilter)}
                onBlur={() => setHandleDateFilter(false)}
              >
                {baseDates?.[0] ||
                baseDates?.[1] ||
                compDates?.[0] ||
                compDates?.[1]
                  ? comparisonPeriod == "none"
                    ? `${moment(baseDates?.[0]).format(
                        "MMMM DD, YYYY"
                      )} - ${moment(baseDates?.[1]).format("MMMM DD, YYYY")}`
                    : `${moment(baseDates?.[0]).format(
                        "MMMM DD, YYYY"
                      )} - ${moment(baseDates?.[1]).format(
                        "MMMM DD, YYYY"
                      )} ⇆ ${moment(compDates?.[0]).format(
                        "MMMM DD, YYYY"
                      )} - ${moment(compDates?.[1]).format("MMMM DD, YYYY")}`
                  : "Select Date Range"}
              </span>
            </div>

            <div className="dropdown-item">
              <MultiSelectValue
                id="statusDropdown"
                displayValue="name"
                placeholder="Select Campaign"
                isClearable={true}
                singleSelect={false}
                intialValue={campaignId}
                result={(e) => setCampaignId(e.value)}
                options={CampaignData}
              />
            </div>

            <div className="dropdown-item">
              {user.role !== "brand" ? (
                <MultiSelectValue
                  id="statusDropdown"
                  displayValue="fullName"
                  placeholder="Select Brand"
                  intialValue={selectedBrand}
                  result={(e) => setSelectedBrand(e.value)}
                  options={brands}
                />
              ) : (
                <MultiSelectValue
                  id="statusDropdown"
                  displayValue="fullName"
                  placeholder="Select Affiliate"
                  isClearable={true}
                  intialValue={selectedAffiliate}
                  result={(e) => setSelectedAffiliate(e.value)}
                  options={affiliateData}
                />
              )}
            </div>

           

            <div className="dropdown-item">
              <SelectDropdown
                theme="search"
                id="currencyDropdown"
                displayValue="name"
                placeholder="Select Currency"
                intialValue={selectedCurrency}
                result={handleCurrencyChange}
                options={CurencyData}
              />
            </div>
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
            {handleDateFilter && (
              <CustomDatePicker
                baseDates={baseDates}
                setBaseDates={setBaseDates}
                compDates={compDates}
                setCompDates={setCompDates}
                setHandleDateFilter={setHandleDateFilter}
                ApplyDateFilter={ApplyDateFilter}
                comparisonPeriod={comparisonPeriod}
                setComparisonPeriod={setComparisonPeriod}
              />
            )}
          </div>

          <div className="reset-filters-container">
            {isFilterApplied() && (
              <button className="btn-primary " onClick={resetFilters}>
                Reset Filters
              </button>
            )}
          </div>

          <AnalyticsChartData
            data={data}
            data2={data2}
            clicks={clicks}
            clicks2={clicks2}
            state={dateRange}
            convertedCurrency={convertedCurrency}
            exchangeRate={exchangeRate}
            comparisonPeriod={comparisonPeriod}
          />
        </main>
      </div>
    </Layout>
  );
}

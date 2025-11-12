"use client";

import React, { useEffect, useState } from "react";
import { addDays } from "date-fns";
import Layout from "@/app/components/global/layout";
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
import loader from "@/methods/loader";

export default function AnalyticsDashboard() {
  const user = crendentialModel.getUser();
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Default filter values
  const defaultFilters = {
    baseDates: [firstDayOfMonth, today],
    compDates: [firstDayOfMonth, today],
    selectedCurrency: "USD",
    campaignId: [],
    selectedAffiliate: [],
    selectedBrand: [],
    comparisonPeriod: "none"
  };

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
  const [baseDates, setBaseDates] = useState([firstDayOfMonth, today]);
  const [compDates, setCompDates] = useState([firstDayOfMonth, today]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [comparisonPeriod, setComparisonPeriod] = useState("none");
  const [CampaignData, setCamapign] = useState([]);
  const [campaignId, setCampaignId] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [showDropdown, setShowDropdown] = useState(true);

  // State to track pending filter changes (not applied yet)
  const [pendingFilters, setPendingFilters] = useState(defaultFilters);

  const downloadOptions = [
    { id: 'csv', name: "Download CSV", value: "csv" },
    { id: "xml", name: "Download XML", value: "xml" },
    { id: "excel", name: "Download Excel", value: "excel" },
  ];

  const handleDownload = (e) => {
    const type = e.value;
    if (!type) { setSelectedType("") }
    setSelectedType(type);
    exportCsv(type)
  };

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
      selectedAffiliate?.length > 0 ||
      selectedBrand?.length > 0 ||
      campaignId?.length > 0 ||
      baseDates[0]?.getTime() !== firstDayOfMonth.getTime() ||
      baseDates[1]?.getTime() !== today.getTime() ||
      compDates[0]?.getTime() !== firstDayOfMonth.getTime() ||
      compDates[1]?.getTime() !== today.getTime() ||
      selectedCurrency !== "USD" ||
      comparisonPeriod !== "none"
    );
  };

  const hasPendingChanges = () => {
    return (
      pendingFilters.baseDates[0]?.getTime() !== baseDates[0]?.getTime() ||
      pendingFilters.baseDates[1]?.getTime() !== baseDates[1]?.getTime() ||
      pendingFilters.compDates[0]?.getTime() !== compDates[0]?.getTime() ||
      pendingFilters.compDates[1]?.getTime() !== compDates[1]?.getTime() ||
      pendingFilters.selectedCurrency !== selectedCurrency ||
      JSON.stringify(pendingFilters.campaignId) !== JSON.stringify(campaignId) ||
      JSON.stringify(pendingFilters.selectedAffiliate) !== JSON.stringify(selectedAffiliate) ||
      JSON.stringify(pendingFilters.selectedBrand) !== JSON.stringify(selectedBrand) ||
      pendingFilters.comparisonPeriod !== comparisonPeriod
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
      }
    } catch (err) {
      setExchangeRate("");
      console.error(err);
    }
  };

  const handleCurrencyChange = (e) => {
    const currency = e.value;
    setPendingFilters(prev => ({
      ...prev,
      selectedCurrency: currency
    }));
  };

  const getBrandData = (p = {}) => {
    let url = "associated/brands";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.filter((item) => item !== null);
        const manipulateData = filteredData.map((itm) => {
          return {
            name: itm?.userName || itm?.firstName,
            id: itm?.id || itm?._id,
          };
        });
        setBrands(manipulateData);
      }
    });
  };

  const getData = (p = {}) => {
    let url = "campaign/affiliate";
    ApiClient.get(url, {
      campaign: pendingFilters.campaignId?.map((dat) => dat).join(","),
    }).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.affiliateFetch?.filter(
          (item) => item !== null
        );
        const uniqueData = filteredData?.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        setAffiliateData(uniqueData);
      } else {
        setAffiliateData([]);
      }
    });
  };

  const exportCsv = (type) => {
    const config = type != "excel" ? {
      startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
      endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
      format: type,
      responseType: type === "excel" ? "arraybuffer" : ""
    } : {
      params: {
        startDate: moment(baseDates?.[0]).format("YYYY-MM-DD"),
        endDate: moment(baseDates?.[1]).format("YYYY-MM-DD"),
        format: type,
      },
      responseType: type === "excel" ? "arraybuffer" : ""
    }

    ApiClient.get("reports/performance/export", config)
      .then((response) => {
        console.log(`Response for ${type}:`, response);

        let fileExtension = type === "excel" ? "xlsx" : type;

        if (response && response.success !== false) {
          if (type === 'xml') {
            const responseStr = typeof response === 'string' ? response : new TextDecoder('utf-8').decode(response);
            if (!responseStr.trim().startsWith('<?xml') && !responseStr.trim().startsWith('<')) {
              console.error('Invalid XML data received:', responseStr.substring(0, 500));
              alert('Server returned invalid XML data. Check console for details.');
              return;
            }
          }

          downloadFile(response, `Performance_Report.${fileExtension}`, type);
        } else {
          alert("No data to download.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("Error fetching data: " + (err.message || err));
      });
  };

  function downloadFile(data, filename, type) {
    let blob;

    if (type === 'excel') {
      blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } else if (type === 'csv') {
      blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
    } else if (type === 'xml') {
      blob = new Blob([data], { type: 'application/xml;charset=utf-8;' });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    getBrandData();
    getCamapignData();
    // Apply initial filters on component mount
    applyFilters();
  }, []);

  useEffect(() => {
    getData();
  }, [pendingFilters.campaignId]);

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

  // Main function to apply all filters
  const applyFilters = () => {
    // Update the actual filter states with pending values
    setBaseDates(pendingFilters.baseDates);
    setCompDates(pendingFilters.compDates);
    setSelectedCurrency(pendingFilters.selectedCurrency);
    setCampaignId(pendingFilters.campaignId);
    setSelectedAffiliate(pendingFilters.selectedAffiliate);
    setSelectedBrand(pendingFilters.selectedBrand);
    setComparisonPeriod(pendingFilters.comparisonPeriod);

    // Ensure compDates are valid when switching from "none" to another period
    let effectiveCompDates = pendingFilters.compDates;
    if (pendingFilters.comparisonPeriod !== "none" && (!pendingFilters.compDates[0] || !pendingFilters.compDates[1])) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      switch (pendingFilters.comparisonPeriod) {
        case "previousPeriod":
          const duration = pendingFilters.baseDates[1] - pendingFilters.baseDates[0];
          effectiveCompDates = [
            new Date(pendingFilters.baseDates[0].getTime() - duration - 1),
            new Date(pendingFilters.baseDates[1].getTime() - duration - 1),
          ];
          break;
        case "previousYear":
          effectiveCompDates = [
            new Date(pendingFilters.baseDates[0].getFullYear() - 1, pendingFilters.baseDates[0].getMonth(), pendingFilters.baseDates[0].getDate()),
            new Date(pendingFilters.baseDates[1].getFullYear() - 1, pendingFilters.baseDates[1].getMonth(), pendingFilters.baseDates[1].getDate()),
          ];
          break;
        default:
          effectiveCompDates = [firstDayOfMonth, today];
      }
      setPendingFilters(prev => ({ ...prev, compDates: effectiveCompDates }));
    }

    const filterParams = {
      startDate: moment(pendingFilters.baseDates?.[0]).format("YYYY-MM-DD"),
      endDate: moment(pendingFilters.baseDates?.[1]).format("YYYY-MM-DD"),
      affiliate_id: pendingFilters.selectedAffiliate?.map((dat) => dat).join(",") || "",
      brand_id: user?.id,
      campaign: pendingFilters.campaignId?.map((dat) => dat).join(",") || "",
      startDate2: pendingFilters.comparisonPeriod === "none" ? "" : moment(effectiveCompDates?.[0]).format("YYYY-MM-DD"),
      endDate2: pendingFilters.comparisonPeriod === "none" ? "" : moment(effectiveCompDates?.[1]).format("YYYY-MM-DD"),
    };

    // Get exchange rate for the selected currency
    if (pendingFilters.selectedCurrency !== "USD") {
      getExchangeRate(pendingFilters.selectedCurrency);
    } else {
      setExchangeRate(1);
    }

    getClicksAnalyticsData(filterParams);
    getAnalyticsData(filterParams);

    setHandleDateFilter(false);
  };

  const ApplyDateFilter = () => {
    // Just close the date picker, filters will be applied when user clicks "Apply Filters"
    setHandleDateFilter(false);
  };

  const resetFilters = () => {
    // Reset both pending and applied filters to defaults
    setPendingFilters(defaultFilters);

    // Immediately update all applied filter states
    setBaseDates(defaultFilters.baseDates);
    setCompDates(defaultFilters.compDates);
    setSelectedCurrency(defaultFilters.selectedCurrency);
    setCampaignId(defaultFilters.campaignId);
    setSelectedAffiliate(defaultFilters.selectedAffiliate);
    setSelectedBrand(defaultFilters.selectedBrand);
    setComparisonPeriod(defaultFilters.comparisonPeriod);

    // Apply the reset filters immediately
    const filterParams = {
      startDate: moment(defaultFilters.baseDates[0]).format("YYYY-MM-DD"),
      endDate: moment(defaultFilters.baseDates[1]).format("YYYY-MM-DD"),
      affiliate_id: "",
      brand_id: user?.id,
      campaign: "",
      startDate2: "",
      endDate2: "",
    };

    // Reset exchange rate
    setExchangeRate(1);

    // Fetch data with reset filters
    getClicksAnalyticsData(filterParams);
    getAnalyticsData(filterParams);

    setHandleDateFilter(false);
  };

  return (
    <Layout name="Reports">
      <div className="dashboard">
        <aside className="sidebar" onClick={() => { if (handleDateFilter) { setHandleDateFilter(false) }; }}>
          <h3 className="sidebar-title mb-0">Insights</h3>
          <nav className="sidebar-nav">
            {/* Navigation buttons */}
          </nav>
        </aside>

        <main className="main-content p-2 md-p-0 ">
          {/* Apply Filters Button at the TOP */}
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-start mb-3">
            <button
              className="btn btn-primary apply-filters-btn"
              onClick={applyFilters}
              disabled={!hasPendingChanges()}
            >
              Apply Filters {hasPendingChanges() && "•"}
            </button>
          </div>

          <div className="custom-dropdown position-relative">
            <div className="dropdown-item date-picker-dropdown">
              <span
                className="form-select date_select"
                onClick={() => setHandleDateFilter(!handleDateFilter)}
                onBlur={() => setHandleDateFilter(false)}
              >
                {pendingFilters.baseDates?.[0] && pendingFilters.baseDates?.[1]
                  ? pendingFilters.comparisonPeriod === "none"
                    ? `${moment(pendingFilters.baseDates?.[0]).format("MMMM DD, YYYY")} - ${moment(pendingFilters.baseDates?.[1]).format("MMMM DD, YYYY")}`
                    : `${moment(pendingFilters.baseDates?.[0]).format("MMMM DD, YYYY")} - ${moment(pendingFilters.baseDates?.[1]).format("MMMM DD, YYYY")} ⇆ ${moment(pendingFilters.compDates?.[0]).format("MMMM DD, YYYY")} - ${moment(pendingFilters.compDates?.[1]).format("MMMM DD, YYYY")}`
                  : "Select Date Range"}
              </span>

              <div className="controls mt-0 single-date-picker-wrapper">
                {handleDateFilter && (
                  <CustomDatePicker
                    baseDates={pendingFilters.baseDates}
                    setBaseDates={(dates) => setPendingFilters(prev => ({ ...prev, baseDates: dates }))}
                    compDates={pendingFilters.compDates}
                    setCompDates={(dates) => setPendingFilters(prev => ({ ...prev, compDates: dates }))}
                    setHandleDateFilter={setHandleDateFilter}
                    ApplyDateFilter={ApplyDateFilter}
                    comparisonPeriod={pendingFilters.comparisonPeriod}
                    setComparisonPeriod={(period) => setPendingFilters(prev => ({ ...prev, comparisonPeriod: period }))}
                  />
                )}
              </div>
            </div>

            <div className="dropdown-item mc-campaign-dropdown">
              <SelectDropdown
                theme="search"
                id="currencyDropdown"
                displayValue="name"
                placeholder="Select Currency"
                intialValue={pendingFilters.selectedCurrency}
                result={handleCurrencyChange}
                options={CurencyData}
              />
            </div>

            <div className="dropdown-item mc-campaign-dropdown ">
              <MultiSelectValue
                id="statusDropdown"
                displayValue="name"
                placeholder="Select Campaign"
                isClearable={true}
                singleSelect={false}
                intialValue={pendingFilters.campaignId}
                result={(e) => setPendingFilters(prev => ({ ...prev, campaignId: e.value }))}
                options={CampaignData}
              />
            </div>

            <div className="dropdown-item mc-campaign-dropdown">
              {user.role !== "brand" ? (
                <MultiSelectValue
                  id="statusDropdown"
                  displayValue="fullName"
                  placeholder="Select Brand"
                  intialValue={pendingFilters.selectedBrand}
                  result={(e) => setPendingFilters(prev => ({ ...prev, selectedBrand: e.value }))}
                  options={brands}
                />
              ) : (
                <MultiSelectValue
                  id="statusDropdown"
                  displayValue="userName"
                  placeholder="Select Affiliate"
                  isClearable={true}
                  intialValue={pendingFilters.selectedAffiliate}
                  result={(e) => setPendingFilters(prev => ({ ...prev, selectedAffiliate: e.value }))}
                  options={affiliateData}
                />
              )}
            </div>
          </div>

          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-end mt-3 mb-3">
            {showDropdown && (
              <SelectDropdown
                theme="search"
                id="downloadDropdown"
                displayValue="name"
                placeholder="Download"
                intialValue={selectedType}
                result={handleDownload}
                options={downloadOptions}
              />
            )}
            <div className="reset-filters-container mt-0 px-0" onClick={() => { if (handleDateFilter) { setHandleDateFilter(false) }; }}>
              {isFilterApplied() && (
                <button className="btn btn-primary" onClick={resetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
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
            setHandleDateFilter={setHandleDateFilter}
            handleDateFilter={handleDateFilter}
          />
        </main>
      </div>
    </Layout>
  );
}
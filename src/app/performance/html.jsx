"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import "./style.scss";
import { useRouter } from "next/navigation";
import LineChart from "../components/common/LineChart/LineChart";
import crendentialModel from "@/models/credential.model";
import ApiClient from "@/methods/api/apiClient";
import SelectDropdown from "../components/common/SelectDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MultiSelectDropdown from "../components/common/MultiSelectValue";
import { CurencyData } from "@/methods/currency";

const Html = ({
  reset,
  filters,
  setFilter,
  filter,
  AffiliateDataId,
  setAffiliateDataId,
  AffiliateData,
  setAffiliateData,
  dateRange,
  setDateRange,
  start,
  end,
}) => {
  const history = useRouter();
  const user = crendentialModel.getUser();
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [analyticData, setAnalyticData] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [showResetButton, setShowResetButton] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const isoStart = start instanceof Date ? start.toISOString() : start;
  const isoEnd = end instanceof Date ? end.toISOString() : end;

  // Check if any filters are active
  useEffect(() => {
    const isFilterActive =
      AffiliateDataId.length > 0 ||
      selectedCurrency !== "USD" ||
      selectedPeriod !== "Today" ||
      (start &&
        end &&
        (start.toDateString() !== new Date().toDateString() ||
          end.toDateString() !== new Date().toDateString()));

    setShowResetButton(isFilterActive);
  }, [AffiliateDataId, selectedCurrency, selectedPeriod, start, end]);

  // Reset all filters to default
  const handleResetFilters = () => {
    setAffiliateDataId([]);
    setSelectedCurrency("USD");
    setSelectedPeriod("Today");
    const today = new Date();
    setDateRange([today, today]);
    setShowDateSuggestions(false);

    // If you have a parent reset function, call it
    if (reset) {
      reset();
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

  const convertedCurrency = (price) => {
    if (price && exchangeRate && selectedCurrency != "USD") {
      const totalCal =
        (price * exchangeRate).toFixed(2) + " " + selectedCurrency || "USD";
      return totalCal;
    } else {
      return price;
    }
  };

  const handleCurrencyChange = (e) => {
    const currency = e.value;
    setSelectedCurrency(currency);
    getExchangeRate(currency);
  };

  const getAnalyticsData = (p = {}) => {
    let url = "analytics-sales";

    let filter = {
      ...filters,
      affiliate_id: AffiliateDataId.map((itm) => itm)
        .join(",")
        .toString(),
      startDate: isoStart,
      endDate: isoEnd,
    };

    if (!AffiliateDataId) {
      filter = { ...filters, ...p, brand_id: user?.id };
    } else {
      filter = {
        ...filters,
        ...p,
        brand_id: user?.id || user?._id,
        affiliate_id: AffiliateDataId.map((itm) => itm)
          .join(",")
          .toString(),
      };
    }

    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        setAnalyticData(res?.data);
      }
    });
  };

  useEffect(() => {
    getAnalyticsData();
  }, [start, end, AffiliateDataId]);

  const setDatePeriod = (period) => {
    const today = new Date();
    let startDate, endDate;

    switch (period) {
      case "Today":
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday;
        endDate = yesterday;
        break;
      case "Last Month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Last Year":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      case "Current Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last 7 Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        endDate = new Date(today);
        break;
      default:
        return;
    }

    setSelectedPeriod(period);
    setDateRange([startDate, endDate]);
    setShowDateSuggestions(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const options = {
    chart: {
      title: "Box Office Earnings in First Two Weeks of Opening",
      subtitle: "in millions of dollars (USD)",
    },
  };

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={handleKeyPress}
      setFilter={setFilter}
      reset={reset}
      filter={filter}
      name="Performance"
      filters={filters}
    >
      <div className="sidebar-left-content">
        <div className="accordion" id="accordionExample">
          <div className="accordion-item main_accordingbx">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Program - Daily
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <div className="program_bx ">
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-4 mb-2">
                      <div className="selectbx1 mc-campaign-dropdown mb-0">
                        <MultiSelectDropdown
                          id="statusDropdown"
                          displayValue="name"
                          intialValue={AffiliateDataId}
                          result={(e) => {
                            setAffiliateDataId(e.value);
                          }}
                          options={AffiliateData}
                          placeholder="All Affiliate"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 mb-2">
                      <div className="selectbx1 mc-campaign-dropdown mb-0">
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
                    <div className="col-12 col-sm-6 col-md-4">
                      <div className="date-range-container">
                        <div className="form-group">
                          <div
                            className="date-picker-trigger form-control"
                            onClick={() =>
                              setShowDateSuggestions(!showDateSuggestions)
                            }
                          >
                            {start && end
                              ? `${formatDate(start)} - ${formatDate(end)}`
                              : "Select Date Range"}
                          </div>

                          {showDateSuggestions && (
                            <div className="date-suggestions-dropdown">
                              <div>
                                <div className="suggestion-list">
                                  {[
                                    "Today",
                                    "Yesterday",
                                    "Last Month",
                                    "Last Year",
                                    "Current Month",
                                    "Last 7 Days",
                                    "Custom",
                                  ].map((period) => (
                                    <div
                                      key={period}
                                      className={`suggestion-item ${
                                        selectedPeriod === period
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() => {
                                        if (period === "Custom") {
                                          setSelectedPeriod("Custom");
                                          setShowDateSuggestions(true);
                                        } else {
                                          setDatePeriod(period);
                                        }
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="datePeriod"
                                        value={period}
                                        checked={selectedPeriod === period}
                                        onChange={() => {}}
                                        className="radio-input"
                                      />
                                      <span className="radio-custom"></span>
                                      <span className="label">{period}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="calendar-section">
                                <div className="calendar-container">
                                  <DatePicker
                                    selected={start}
                                    onChange={(update) => {
                                      setDateRange([update[0], update[1]]);
                                      setSelectedPeriod("Custom");
                                    }}
                                    startDate={start}
                                    endDate={end}
                                    selectsRange
                                    inline
                                    monthsShown={1}
                                    maxDate={new Date()}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                    {/* <div className="col-12 col-sm-4">
                      <div className="selectbx1 mb-0">
                        <div className="form-group mb-0">
                          <DatePicker
                            showIcon
                            className="date-picker form-control"
                            monthsShown={1}
                            shouldCloseOnSelect={true}
                            selectsRange={true}
                            placeholderText="Select Date Range"
                            startDate={start}
                            endDate={end}
                            onChange={(update) => {
                              setDateRange([update[0], update[1]]);
                            }}
                            isClearable
                            maxDate={new Date()}
                            // withPortal
                            dateFormat={"dd/MM/yyyy"}
                          />
                        </div>
                      </div>
                    </div> */}
                    <div className="col-12 col-sm-6">
                      {showResetButton && (
                        <button
                          className="btn btn-sm btn-primary ms-3 reset-btn"
                          onClick={handleResetFilters}
                          title="Reset all filters"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  


        </div>
              <div className="graph_charts">
          <div className='graph-chart-line-chart'>
            <LineChart
              data={analyticData?.data?.[0]}
              convertedCurrency={convertedCurrency}
              exchangeRate={exchangeRate}
            />
          </div>
        </div>
        
        
        </div></div></div>
    </Layout>
  );
};

export default Html;

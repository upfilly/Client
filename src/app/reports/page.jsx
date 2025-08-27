"use client";

import React, { useEffect, useState } from "react";
import Layout from "../components/global/layout";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import ApiClient from "@/methods/api/apiClient";
import datepipeModel from "@/models/datepipemodel";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import ReportChart from "../components/common/AreaChart/AreaChart";
import MultiSelectDropdownWithCheckboxes from "./MultiSelectDropdownWithCheckboxes";
import DatePicker from "react-datepicker";

export default function CampaignReport() {
  const history = useRouter();
  const user = crendentialModel.getUser();
  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    search: "",
    isDeleted: false,
  });
  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoader] = useState(true);
  const [campaignId, setCampaignId] = useState([]);
  const [CampaignData, setCamapign] = useState([]);
  const [analyticData, setAnalyticData] = useState();
  const [showDateSuggestions, setShowDateSuggestions] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [start, end] = dateRange;
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(0); // Add a reset trigger

  useEffect(() => {
    const isDateFilterActive = start !== null && end !== null;
    const isCampaignFilterActive = campaignId.length > 0;
    const isSearchFilterActive = filters.search !== "";

    setHasActiveFilters(
      isDateFilterActive || isCampaignFilterActive || isSearchFilterActive
    );
  }, [start, end, campaignId, filters.search]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const getCamapignData = (p = {}) => {
    let filter = { ...filters, ...p };
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

  const getData = (p = {}) => {
    setLoader(true);
    let filter;

    const campaignFilter =
      campaignId.length > 0 ? { campaignId: campaignId.join(",") } : {};

    const dateFilter =
      start && end
        ? {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          }
        : {};

    if (user?.role == "brand") {
      filter = {
        ...filters,
        ...p,
        brand_id: user?.id || user?._id,
        ...campaignFilter,
        ...dateFilter,
      };
    } else {
      filter = {
        ...filters,
        ...p,
        ...campaignFilter,
        ...dateFilter,
      };
    }

    ApiClient.get(`affiliatelink/report`, filter).then((res) => {
      if (res.success) {
        setData(res?.data);
        setTotal(res?.data?.total_count);
        setLoader(false);
      }
    });
  };

  useEffect(() => {
    getCamapignData({ page: 1 });
  }, []);

  useEffect(() => {
    getData({ page: 1 });
    getAnalyticsData();
  }, [campaignId, start, end]);

  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected });
    getData({ page: e.selected + 1 });
  };

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p });
    getData({ ...p, page: 1 });
  };

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key == key) {
      if (filters?.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }

    let sortBy = `${key} ${sorder}`;
    filter({ sortBy, key, sorder });
  };

  const resetAllFilters = () => {
    setDateRange([null, null]);
    setSelectedPeriod("Today");
    setCampaignId([]);
    setResetDropdown((prev) => prev + 1); // Trigger dropdown reset

    const resetFilters = {
      page: 0,
      count: 10,
      search: "",
      isDeleted: false,
      key: "",
      sorder: "",
      sortBy: "",
    };

    setFilter(resetFilters);
    getData({ ...resetFilters, page: 1 });
  };

  const uniqueKeys = data?.data?.reduce((headers, itm) => {
    if (itm?.urlParams && typeof itm.urlParams === "object") {
      Object.keys(itm.urlParams).forEach((key) => {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      });
    }
    return headers;
  }, []);

  const getAnalyticsData = () => {
    let url = "analytics-sales";

    const campaignFilter =
      campaignId.length > 0 ? { campaignId: campaignId.join(",") } : {};

    const dateFilter =
      start && end
        ? {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          }
        : {};

    let filters = {
      brand_id: user?.id || user?._id,
      ...campaignFilter,
      ...dateFilter,
    };

    ApiClient.get(url, filters).then((res) => {
      if (res) {
        setAnalyticData(res?.data);
      }
    });
  };

  const setDatePeriod = (period) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate, endDate;

    switch (period) {
      case "Today":
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday;
        endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999);
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
        endDate.setHours(23, 59, 59, 999);
        break;
      case "Last 7 Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Layout
        handleKeyPress={handleKeyPress}
        setFilter={setFilter}
        reset={resetAllFilters}
        filter={filter}
        name="Track Data"
        filters={filters}
        hasActiveFilters={hasActiveFilters}
      >
        <div className='sidebar-left-content'>
          <div className='nmain-list  mb-3 main_box pt-0'>
            <div className='select-campaing-heaidng'>
              <h3 class="campaign-header">
                Select Campaign
              </h3>
            </div>

            <div className="">
              <div className="col-12 col-md-6 mb-2">
                <div className="date-range-container">
                  <div className="form-group">
                    <label className="form-label">Date Range</label>
                    <div
                      className="date-picker-trigger form-control"
                      onClick={() =>
                        setShowDateSuggestions(!showDateSuggestions)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {start && end
                        ? `${formatDate(start)} - ${formatDate(end)}`
                        : "Select Date Range"}
                    </div>

                    {showDateSuggestions && (
                      <div className="date-suggestions-dropdown">
                        <div className="suggestion-list-container">
                          <div className="suggestion-list">
                            {[
                              "Today",
                              "Yesterday",
                              "Last 7 Days",
                              "Current Month",
                              "Last Month",
                              "Last Year",
                              "Custom",
                            ].map((period) => (
                              <div
                                key={period}
                                className={`suggestion-item ${
                                  selectedPeriod === period ? "selected" : ""
                                }`}
                                onClick={() => {
                                  if (period === "Custom") {
                                    setSelectedPeriod("Custom");
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
                                setDateRange(update);
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
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12">
              <div className="select-campaign-wrapper">
                <label className="form-label">Campaigns</label>
                <MultiSelectDropdownWithCheckboxes
                  key={resetDropdown} // Add key to force re-render
                  options={CampaignData}
                  initialValue={campaignId}
                  onChange={(selectedValues) => setCampaignId(selectedValues)}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="col-12 mt-3 mb-3">
                <button className="btn btn-primary" onClick={resetAllFilters}>
                  Reset Filters
                </button>
              </div>
            )}

            <div className="container-fluid">
              <div className="row mb-4">
                <div className="col-12">
                  <div className="chart-container">
                    <ReportChart areaData={analyticData?.data?.[0]} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="table-section">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead className="thead-clr">
                          <tr>
                            {uniqueKeys?.map((key) => (
                              <th key={key} scope="col">
                                {key}
                              </th>
                            ))}
                            <th scope="col">Affiliate</th>
                            <th scope="col">Brand</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Counts</th>
                            <th
                              scope="col"
                              onClick={(e) => sorting("createdAt")}
                              style={{ cursor: "pointer" }}
                            >
                              Creation Date
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {!loading && data?.data?.length > 0 ? (
                            data.data.map((itm, i) => {
                              return (
                                <tr className="data_row" key={i}>
                                  {uniqueKeys?.map((key) => {
                                    const value =
                                      itm?.urlParams &&
                                      itm.urlParams[key] !== undefined
                                        ? itm.urlParams[key]
                                        : null;
                                    return (
                                      <td
                                        key={key}
                                        className="name-person ml-2"
                                      >
                                        {value || "--"}
                                      </td>
                                    );
                                  })}
                                  <td className="name-person ml-2">
                                    {itm?.affiliate_details?.userName || "--"}
                                  </td>
                                  <td className="name-person ml-2">
                                    {itm?.brand_details?.fullName || "--"}
                                  </td>
                                  <td className="name-person ml-2">
                                    {itm?.revenue}
                                  </td>
                                  <td className="name-person ml-2">
                                    {itm?.click_count}
                                  </td>
                                  <td className="name-person ml-2">
                                    {datepipeModel.date(
                                      itm?.affiliate_details?.createdAt
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan={uniqueKeys?.length + 5}
                                className="text-center py-4"
                              >
                                {loading ? (
                                  <img
                                    src="/assets/img/loader.gif"
                                    className="pageLoader"
                                    alt="Loading..."
                                  />
                                ) : (
                                  "No Data Found"
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`paginationWrapper ${
              !loading && total > 10 ? "" : "d-none"
            }`}
          >
            <span>
              Showing {data?.data?.length || 0} of {total} reports
            </span>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              initialPage={filters?.page}
              onPageChange={pageChange}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={Math.ceil(total / filters?.count)}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
              pageClassName={"pagination-item"}
              activeClassName={"pagination-item-active"}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

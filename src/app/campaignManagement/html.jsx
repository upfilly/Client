import React, { useState, useEffect, useRef } from "react";
import Layout from "@/app/components/global/layout";
import ReactPaginate from "react-paginate";
import "./style.scss";
import methodModel from "../../methods/methods";
import datepipeModel from "@/models/datepipemodel";
import { useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import { FaFilter, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import SelectDropdown from "../components/common/SelectDropdown";
import axios from "axios";
import { regionData } from "../campaign/AddEditUser/regionCountries";
import { CurencyData } from "../../methods/currency";

const Html = ({
  statusChange,
  pageChange,
  filters,
  loaging,
  data,
  total,
  filter,
  sorting,
  setFilter,
  previousdata,
  previoustotal,
  getData,
  SendPreviousRequest,
  sendRequest,
  ChangeStatus,
  params,
}) => {
  const history = useRouter();
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [filteredData, setFilteredData] = useState(data);
  const [categoryType, setCategoryType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [category, setCategory] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(
    params?.currency || "USD"
  );
  const [exchangeRate, setExchangeRate] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const columnSelectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showColumnSelector &&
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target) &&
        !event.target.closest('.column-selector-container button')
      ) {
        setShowColumnSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnSelector]);

  // Define all available columns
  const allColumns = [
    { key: 'campaignName', label: 'Campaign Name', sortable: true, default: true },
    { key: 'brandName', label: 'Brand Name', sortable: true, default: true },
    { key: 'affiliateApproval', label: 'Affiliate Approval', sortable: true, default: true },
    { key: 'eventType', label: 'Event Type', sortable: true, default: true },
    { key: 'commission', label: 'Commission', sortable: true, default: true },
    { key: 'leadAmount', label: 'Lead Amount', sortable: true, default: true },
    { key: 'campaignStatus', label: 'Campaign Status', sortable: true, default: true },
    { key: 'requestStatus', label: 'Request Status', sortable: true, default: true },
    { key: 'createdDate', label: 'Created Date', sortable: true, default: true },
    { key: 'actions', label: 'Actions', sortable: false, default: true, alwaysShow: true }
  ];

  // Initialize visible columns state
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    return defaultColumns;
  });

  console.log(data, "bbnbnbn")

  const toggleDropdown = () => {
    setShowColumnSelector(false)
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleRegionExpand = (region) => {
    setExpandedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const toggleSubCategory = (id) => {
    setExpandedSubCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id]
    );
  };

  const handleRegionChange = (region) => {
    setSelectedRegion((prevState) =>
      prevState.includes(region)
        ? prevState.filter((r) => r !== region)
        : [...prevState, region]
    );
  };

  const handleCountryChange = (country) => {
    setSelectedCountries((prevState) =>
      prevState.includes(country)
        ? prevState.filter((c) => c !== country)
        : [...prevState, country]
    );
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    const column = allColumns.find(col => col.key === columnKey);
    if (column?.alwaysShow) return; // Don't allow hiding always-show columns

    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  // Check if a column is visible
  const isColumnVisible = (columnKey) => {
    return visibleColumns.includes(columnKey);
  };

  // Reset to default columns
  const resetColumns = () => {
    const defaultColumns = allColumns.filter(col => col.default).map(col => col.key);
    setVisibleColumns(defaultColumns);
  };

  // Show all columns
  const showAllColumns = () => {
    setVisibleColumns(allColumns.map(col => col.key));
  };

  // Render column selector dropdown
  const renderColumnSelector = () => (
    <div className="column-selector-wrapper" ref={columnSelectorRef}>
      <div className="column-selector-dropdown">
        <div className="column-selector-header">
          <h6>Manage Columns</h6>
          <div className="column-selector-actions">
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={resetColumns}
            >
              Default
            </button>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={showAllColumns}
            >
              Show All
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowColumnSelector(false)}
            >
              ×
            </button>
          </div>
        </div>
        <div className="column-selector-body">
          {allColumns.map(column => (
            <div key={column.key} className="column-selector-item">
              <label className="column-checkbox">
                <input
                  type="checkbox"
                  checked={isColumnVisible(column.key)}
                  onChange={() => toggleColumn(column.key)}
                  disabled={column.alwaysShow}
                />
                <span className="checkmark"></span>
                {column.label}
                {column.alwaysShow && <small className="text-muted"> (Required)</small>}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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

  function parseStringToArray(input) {
    if (typeof input !== "string") return [];
    return input.split(",").map((item) => item.trim());
  }

  useEffect(() => {
    getExchangeRate(params?.currency);
    setSelectedCategory(parseStringToArray(params?.category));
    setSelectedSubCategory(parseStringToArray(params?.sub_category));
    setSelectedSubSubCategory(parseStringToArray(params?.sub_child_category));
    setSelectedRegion(parseStringToArray(params?.region));
    setSelectedCountries(parseStringToArray(params?.countries));
  }, []);

  const handleCurrencyChange = (e) => {
    const currency = e.value;
    setShowColumnSelector(false)
    setSelectedCurrency(currency);
    getExchangeRate(currency);
  };

  const convertedCurrency = (price) => {
    if (price && exchangeRate) {
      return price * exchangeRate + " " + selectedCurrency;
    } else {
      return price;
    }
  };

  const reset = () => {
    let filter = {
      status: "",
      role: "",
      search: "",
      page: 1,
      count: 10,
    };
    setFilter({ ...filters, ...filter });
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setSelectedSubSubCategory([]);
    setSelectedRegion([]);
    setSelectedCountries([]);
    getData({ ...filter });
  };

  const getCategory = (p = {}) => {
    let url = `categoryWithSub?page&count&search&cat_type=advertiser_categories&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data
          .map((data) => (data.parent_cat_name ? data : undefined))
          .filter((item) => item !== undefined);
        setCategory(data);
      }
    });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category._id)
        ? prev.filter((item) => item !== category._id)
        : [...prev, category._id]
    );
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory((prev) =>
      prev.includes(subCategory.id)
        ? prev.filter((item) => item !== subCategory.id)
        : [...prev, subCategory.id]
    );
  };

  const handleSubSubCategoryChange = (subSubCategory) => {
    setSelectedSubSubCategory((prev) =>
      prev.includes(subSubCategory._id)
        ? prev.filter((item) => item !== subSubCategory._id)
        : [...prev, subSubCategory._id]
    );
  };

  const fetchCountriesByRegions = async (regions) => {
    try {
      const countries = await Promise.all(
        regions.map(async (region) => {
          const response = await axios.get(
            `https://restcountries.com/v3.1/region/${region}`
          );
          return response.data.map((country) => ({
            label: country.name.common,
            id: country.name.common,
          }));
        })
      );
      setCountries(countries.flat());
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  };

  const categoryTypes = [
    { id: "promotional_models", name: "Promotional Models" },
    { id: "property_types", name: "Property Types" },
  ];

  useEffect(() => {
    if (activeTab === "new") {
      setFilteredData(data);
    } else {
      setFilteredData(previousdata);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchCountriesByRegions(selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    getCategory();
  }, [categoryType]);

  const view = (id) => {
    const filterParams = {
      ...filters,
      page: 1,
      currency: selectedCurrency,
      region: selectedRegion?.join(","),
      category_type: categoryType?.join(","),
      category: selectedCategory?.join(","),
      sub_category: selectedSubCategory?.join(","),
      countries: selectedCountries?.join(","),
      sub_child_category: selectedSubSubCategory?.join(","),
    };

    const queryString = new URLSearchParams(filterParams).toString();

    history.push(`/campaignManagement/detail/${id}?${queryString}`);
  };

  useEffect(() => {
    getData({
      page: 1,
      region: selectedRegion?.map((dat) => dat).join(","),
      category_type: categoryType?.map((dat) => dat).join(","),
      category: selectedCategory?.map((dat) => dat).join(","),
      sub_category: selectedSubCategory?.map((dat) => dat).join(","),
      countries: selectedCountries?.map((dat) => dat).join(","),
      sub_child_category: selectedSubSubCategory?.map((dat) => dat).join(","),
    });
  }, [
    categoryType,
    selectedCategory,
    selectedSubCategory,
    selectedSubSubCategory,
    selectedRegion,
    selectedCountries,
  ]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const resetUrl = () => {
    let filter = {
      status: "",
      role: "",
      search: "",
      page: 1,
      count: 10,
    };
    setFilter({ ...filters, ...filter });
    getData({ ...filter, page: 1 });
    setSelectedCurrency("USD");
    history.push("/campaignManagement");
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={handleKeyPress}
      setFilter={setFilter}
      reset={reset}
      filter={filter}
      name="Campaigns"
      filters={filters}
    >
      <div className="mapping-wrapper">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-12 col-lg-12">
            <div className="lists_marketplace">
              <div className="set-border-top  gap-sm-3">
                <div className="main_title_head d-flex justify-content-flex-start align-items-center">
                  <h3 className="">Campaign Management  </h3>
                </div>

                <div className="d-flex Campaign-Management-dropdpwns  align-items-center gap-2">
                  <SelectDropdown
                    theme="search"
                    id="statusDropdown"
                    displayValue="name"
                    placeholder="Status"
                    intialValue={filters.status}
                    result={(e) => {
                      ChangeStatus(e.value);
                      setShowColumnSelector(false)
                    }}
                    options={[
                      { id: "pending", name: "Pending" },
                      { id: "accepted", name: "Accepted" },
                      { id: "rejected", name: "Rejected" },
                      { id: "removed", name: "Removed" },
                    ]}
                  />


                  <SelectDropdown
                    theme="search"
                    id="currencyDropdown"
                    displayValue="name"
                    placeholder="Select Currency"
                    intialValue={selectedCurrency}
                    result={handleCurrencyChange}
                    options={CurencyData}
                  />


                  <div className="filter-dropdown-container position-relative">
                    <button
                      className="btn btn-primary d-flex align-items-center filter-toggle-btn"
                      type="button"
                      onClick={toggleDropdown}
                    >
                      <FaFilter className="mr-2" />
                      <span className="filter-text">Filter</span>
                      {isDropdownOpen ? (
                        <FaChevronUp className="ml-2" />
                      ) : (
                        <FaChevronDown className="ml-2" />
                      )}
                    </button>

                    {/* Enhanced Dropdown Filter Content */}
                    {isDropdownOpen && (
                      <div className="filter-dropdown-card">
                        <div className="filter-dropdown-header">
                          <h4 className="filter-title">All Filters</h4>
                          <div className="d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-clear-all"
                              onClick={reset}
                            >
                              Clear all
                            </button>
                            <button
                              className="btn-close-dropdown"
                              onClick={toggleDropdown}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </div>

                        <div className="filter-sections-container">
                          {/* Category Section with Alphabetical Sorting */}
                          <div className="filter-section-card">
                            <div className="filter-section-header">
                              <h5 className="section-title">Select Category</h5>
                            </div>
                            <div className="filter-section-body">
                              <ul className="filter-list">
                                {[...category]
                                  .sort((a, b) =>
                                    a.parent_cat_name.localeCompare(
                                      b.parent_cat_name
                                    )
                                  )
                                  .map((category) => {
                                    const isCategoryExpanded =
                                      expandedCategories.includes(category._id);
                                    return (
                                      <li
                                        key={category._id}
                                        className="filter-list-item"
                                      >
                                        <div className="form-check d-flex justify-content-between align-items-center">
                                          <div className="d-flex align-items-center">
                                            <input
                                              className="form-check-input filter-checkbox"
                                              type="checkbox"
                                              id={`cat-${category._id}`}
                                              name="category"
                                              value={category._id}
                                              checked={selectedCategory?.includes(
                                                category._id
                                              )}
                                              onChange={() =>
                                                handleCategoryChange(category)
                                              }
                                            />
                                            <label
                                              className="form-check-label filter-label"
                                              htmlFor={`cat-${category._id}`}
                                            >
                                              {category.parent_cat_name}
                                            </label>
                                          </div>
                                          {category.subCategories?.length >
                                            0 && (
                                              <button
                                                className="btn-expand-toggle"
                                                onClick={() =>
                                                  toggleCategory(category._id)
                                                }
                                              >
                                                <i
                                                  className={`fa fa-angle-${isCategoryExpanded
                                                      ? "down"
                                                      : "right"
                                                    }`}
                                                />
                                              </button>
                                            )}
                                        </div>
                                        {isCategoryExpanded && (
                                          <ul className="sub-filter-list">
                                            {[...(category.subCategories || [])]
                                              .sort((a, b) =>
                                                a.name.localeCompare(b.name)
                                              )
                                              .map((subCategory) => {
                                                const isSubExpanded =
                                                  expandedSubCategories.includes(
                                                    subCategory.id
                                                  );
                                                return (
                                                  <li
                                                    key={subCategory.id}
                                                    className="sub-filter-list-item"
                                                  >
                                                    <div className="form-check d-flex justify-content-between align-items-center">
                                                      <div className="d-flex align-items-center">
                                                        <input
                                                          className="form-check-input filter-checkbox"
                                                          type="checkbox"
                                                          id={`subcat-${subCategory.id}`}
                                                          name="subCategory"
                                                          value={subCategory.id}
                                                          checked={selectedSubCategory?.includes(
                                                            subCategory.id
                                                          )}
                                                          onChange={() =>
                                                            handleSubCategoryChange(
                                                              subCategory
                                                            )
                                                          }
                                                        />
                                                        <label
                                                          className="form-check-label filter-label"
                                                          htmlFor={`subcat-${subCategory.id}`}
                                                        >
                                                          {subCategory.name}
                                                        </label>
                                                      </div>
                                                      {subCategory
                                                        .subchildcategory
                                                        ?.length > 0 && (
                                                          <button
                                                            className="btn-expand-toggle"
                                                            onClick={() =>
                                                              toggleSubCategory(
                                                                subCategory.id
                                                              )
                                                            }
                                                          >
                                                            <i
                                                              className={`fa fa-angle-${isSubExpanded
                                                                  ? "down"
                                                                  : "right"
                                                                }`}
                                                            />
                                                          </button>
                                                        )}
                                                    </div>
                                                    {isSubExpanded &&
                                                      subCategory
                                                        .subchildcategory
                                                        ?.length > 0 && (
                                                        <ul className="sub-sub-filter-list">
                                                          {[
                                                            ...(subCategory.subchildcategory ||
                                                              []),
                                                          ]
                                                            .sort((a, b) =>
                                                              a.name.localeCompare(
                                                                b.name
                                                              )
                                                            )
                                                            .map(
                                                              (
                                                                subSubCategory
                                                              ) => (
                                                                <li
                                                                  key={
                                                                    subSubCategory._id
                                                                  }
                                                                  className="sub-sub-filter-list-item"
                                                                >
                                                                  <div className="form-check">
                                                                    <input
                                                                      className="form-check-input filter-checkbox"
                                                                      type="checkbox"
                                                                      id={`subsubcat-${subSubCategory._id}`}
                                                                      name="subSubCategory"
                                                                      value={
                                                                        subSubCategory._id
                                                                      }
                                                                      checked={selectedSubSubCategory?.includes(
                                                                        subSubCategory._id
                                                                      )}
                                                                      onChange={() =>
                                                                        handleSubSubCategoryChange(
                                                                          subSubCategory
                                                                        )
                                                                      }
                                                                    />
                                                                    <label
                                                                      className="form-check-label filter-label"
                                                                      htmlFor={`subsubcat-${subSubCategory._id}`}
                                                                    >
                                                                      {
                                                                        subSubCategory.name
                                                                      }
                                                                    </label>
                                                                  </div>
                                                                </li>
                                                              )
                                                            )}
                                                        </ul>
                                                      )}
                                                  </li>
                                                );
                                              })}
                                          </ul>
                                        )}
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>

                          {/* Region & Country Section with Alphabetical Sorting */}
                          <div className="filter-section-card">
                            <div className="filter-section-header">
                              <h5 className="section-title">
                                Select Region & Country
                              </h5>
                            </div>
                            <div className="filter-section-body">
                              <ul className="filter-list">
                                {Object.keys(regionData)
                                  .sort((a, b) => a.localeCompare(b))
                                  .map((region) => {
                                    const isRegionExpanded =
                                      expandedRegions.includes(region);
                                    return (
                                      <li
                                        key={region}
                                        className="filter-list-item"
                                      >
                                        <div className="form-check d-flex justify-content-between align-items-center">
                                          <div className="d-flex align-items-center">
                                            <input
                                              className="form-check-input filter-checkbox"
                                              type="checkbox"
                                              id={`region-${region}`}
                                              value={region}
                                              checked={selectedRegion?.includes(
                                                region
                                              )}
                                              onChange={() =>{
                                                handleRegionChange(region)
                                                setShowColumnSelector(false)
                                              }}
                                            />
                                            <label
                                              className="form-check-label filter-label region-label"
                                              htmlFor={`region-${region}`}
                                            >
                                              {region}
                                            </label>
                                          </div>
                                          <button
                                            className="btn-expand-toggle"
                                            onClick={() =>{
                                              toggleRegionExpand(region)
                                              setShowColumnSelector(false)
                                            }}
                                          >
                                            <i
                                              className={`fa fa-angle-${isRegionExpanded
                                                  ? "down"
                                                  : "right"
                                                }`}
                                            />
                                          </button>
                                        </div>
                                        {isRegionExpanded && (
                                          <ul className="sub-filter-list region-countries">
                                            {[...regionData[region]]
                                              .sort((a, b) =>
                                                a.localeCompare(b)
                                              )
                                              .map((country) => (
                                                <li
                                                  key={country}
                                                  className="sub-filter-list-item"
                                                >
                                                  <div className="form-check">
                                                    <input
                                                      className="form-check-input filter-checkbox"
                                                      type="checkbox"
                                                      id={`country-${country}`}
                                                      name="country"
                                                      value={country}
                                                      checked={selectedCountries?.includes(
                                                        country
                                                      )}
                                                      onChange={() =>{
                                                        handleCountryChange(
                                                          country
                                                        );setShowColumnSelector(false)}
                                                      }
                                                    />
                                                    <label
                                                      className="form-check-label filter-label"
                                                      htmlFor={`country-${country}`}
                                                    >
                                                      {country}
                                                    </label>
                                                  </div>
                                                </li>
                                              ))}
                                          </ul>
                                        )}
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="filter-dropdown-footer">
                          <button
                            className="btn btn-primary btn-apply-filters"
                            onClick={() => {
                              filter();
                              toggleDropdown();
                              setShowColumnSelector(false)
                            }}
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Column Selector Button */}
                  <div className="column-selector-container">
                    <button
                      className="btn btn-outline-secondary mb-0 me-2"
                      onClick={() => setShowColumnSelector(!showColumnSelector)}
                      title="Manage Columns"
                    >
                      <i className="fa fa-columns mr-1"></i>
                      Columns
                    </button>
                    {showColumnSelector && renderColumnSelector()}
                  </div>

                  {filters.status && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary reset-btn"
                      onClick={(e) => resetUrl()}
                    >
                      Reset
                    </button>
                  )}



                </div>
              </div>
              <div className="mt-5">
                <div className="table_section mt-0 p-0">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="table_head">
                        <tr className="heading_row">
                          {isColumnVisible('campaignName') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("campaign_name")}
                            >
                              Campaign Name{" "}
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('brandName') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("brand_name")}
                            >
                              Brand Name {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('affiliateApproval') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("campaign_type")}
                            >
                              Affiliate Approval
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('eventType') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("event_type")}
                            >
                              Event Type
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('commission') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("campaign_commission")}
                            >
                              Commission
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('leadAmount') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("lead_amount")}
                            >
                              Lead Amount
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('campaignStatus') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("status")}
                            >
                              Campaign Status
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('requestStatus') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("isActive")}
                            >
                              Request Status
                              {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('createdDate') && (
                            <th
                              scope="col"
                              className="table_data"
                              onClick={(e) => sorting("createdAt")}
                            >
                              Created Date {filters?.sorder === "asc" ? "↑" : "↓"}
                            </th>
                          )}
                          {isColumnVisible('actions') && (
                            <th scope="col" className="table_data">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {!loaging && activeTab == "new" ? (
                          data.map((itm, i) => {
                            return (
                              <tr className="data_row" key={i}>
                                {isColumnVisible('campaignName') && (
                                  <td
                                    className="table_dats"
                                    onClick={(e) =>
                                      view(
                                        itm.campaign_detail?.id ||
                                        itm?.campaign_detail?._id
                                      )
                                    }
                                  >
                                    <div className="user_detail">
                                      <div className="user_name">
                                        <h4 className="user">
                                          {methodModel.capitalizeFirstLetter(
                                            itm?.campaign_detail?.name
                                          )}
                                        </h4>
                                      </div>
                                    </div>
                                  </td>
                                )}
                                {isColumnVisible('brandName') && itm?.brand_detail?.fullName && (
                                  <td className="table_dats">
                                    {itm?.brand_detail?.fullName}
                                  </td>
                                )}
                                {isColumnVisible('affiliateApproval') && (
                                  <td className="table_dats">
                                    {itm?.campaign_type || "--"}
                                  </td>
                                )}
                                {isColumnVisible('eventType') && (
                                  <td className="table_dats">
                                    {itm?.campaign_detail?.event_type.join(",")}
                                  </td>
                                )}
                                {isColumnVisible('commission') && (
                                  <td className="table_dats">
                                    {" "}
                                    {itm?.campaign_detail?.commission_type ==
                                      "percentage"
                                      ? `${itm?.campaign_detail?.commission}%`
                                      : selectedCurrency
                                        ? `${convertedCurrency(
                                          itm?.campaign_detail?.commission
                                        )}`
                                        : `$${convertedCurrency(
                                          itm?.campaign_detail?.commission
                                        )}`}
                                  </td>
                                )}
                                {isColumnVisible('leadAmount') && (
                                  <td className="table_dats">
                                    {" "}
                                    {selectedCurrency && exchangeRate
                                      ? ` ${convertedCurrency(itm?.lead_amount)}`
                                      : `$ ${convertedCurrency(
                                        itm?.lead_amount
                                      )}`}
                                  </td>
                                )}
                                {isColumnVisible('campaignStatus') && (
                                  <td className="table_dats">
                                    {" "}
                                    <span className={`active_btn${itm?.status}`}>
                                      <span
                                        className={
                                          itm?.status == "deactive"
                                            ? "inactive"
                                            : "contract"
                                        }
                                      >
                                        {itm?.status == "deactive"
                                          ? "Inactive"
                                          : "Active"}
                                      </span>
                                    </span>
                                  </td>
                                )}
                                {isColumnVisible('requestStatus') && (
                                  <td className="table_dats">
                                    {" "}
                                    <span
                                      className={`active_btn${itm?.isActive}`}
                                    >
                                      <span
                                        className={
                                          !itm?.isActive
                                            ? itm?.status == "accepted" &&
                                              !itm?.isActive
                                              ? itm?.status == "removed"
                                                ? "inactive"
                                                : "pending_status"
                                              : "inactive"
                                            : "contract"
                                        }
                                      >
                                        {!itm?.isActive
                                          ? itm?.status == "removed"
                                            ? "Removed"
                                            : itm?.status == "rejected"
                                              ? "Rejected"
                                              : itm?.status == "accepted" &&
                                                !itm?.isActive
                                                ? "Switched"
                                                : "Pending"
                                          : "Joined"}
                                      </span>
                                    </span>
                                  </td>
                                )}
                                {isColumnVisible('createdDate') && (
                                  <td className="table_dats">
                                    {datepipeModel.date(
                                      itm.campaign_detail?.createdAt
                                    )}
                                  </td>
                                )}
                                {isColumnVisible('actions') && (
                                  <td className="table_dats d-flex gap-1 align-items-center">
                                    {itm?.status == "pending" ? (
                                      <div className="d-flex gap-1 align-items-center">
                                        <button
                                          onClick={
                                            itm?.campaign_type == "manual" &&
                                              itm?.campaign_type != "private"
                                              ? () =>
                                                sendRequest(
                                                  itm?._id,
                                                  itm?.brand_id,
                                                  itm?.campaign_id
                                                )
                                              : () =>
                                                statusChange(
                                                  "accepted",
                                                  itm?.id || itm?._id
                                                )
                                          }
                                          className="btn btn-primary mr-2 btn_actions"
                                        >
                                          <i className="fa fa-check"></i>
                                        </button>
                                      </div>
                                    ) : itm?.status == "rejected" ? (
                                      <div className="btn btn-danger mr-2">
                                        Removed
                                      </div>
                                    ) : itm?.status == "rejected" ? (
                                      <div className="btn btn-primary mr-2">
                                        Rejected
                                      </div>
                                    ) : itm?.status == "requested" ? (
                                      <div className="btn btn-primary mr-2">
                                        Request Sent
                                      </div>
                                    ) : (
                                      <div className="btn btn-primary mr-2">
                                        Accepted
                                      </div>
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <>
                            {!loaging &&
                              filteredData.map((itm, i) => (
                                <tr className="data_row" key={i}>
                                  {isColumnVisible('campaignName') && (
                                    <td
                                      className="table_dats"
                                      onClick={(e) => view(itm?.id || itm?._id)}
                                    >
                                      <div className="user_detail">
                                        <div className="user_name">
                                          <h4 className="user">
                                            {methodModel.capitalizeFirstLetter(
                                              itm?.name
                                            )}
                                          </h4>
                                        </div>
                                      </div>
                                    </td>
                                  )}
                                  {isColumnVisible('eventType') && itm?.event_type && (
                                    <td className="table_dats">
                                      {itm?.event_type.join(",")}
                                    </td>
                                  )}
                                  {isColumnVisible('commission') && (
                                    <td className="table_dats">{itm?.amount}</td>
                                  )}
                                  {isColumnVisible('createdDate') && (
                                    <td className="table_dats">
                                      {datepipeModel.date(itm?.createdAt)}
                                    </td>
                                  )}
                                  {isColumnVisible('actions') && (
                                    <td className="table_dats d-flex align-items-center">
                                      <button
                                        className="btn btn-primary btn_actions"
                                        title="Send request"
                                        onClick={() => {
                                          SendPreviousRequest(
                                            itm?.id || itm?._id,
                                            itm?.brand_id
                                          );
                                        }}
                                      >
                                        <i class="fa-solid fa-code-pull-request"></i>
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </>
                        )}
                      </tbody>
                    </table>
                    {!loaging && total === 0 && activeTab == "new" && (
                      <div className="py-3 text-center">No Data</div>
                    )}
                    {!loaging && previoustotal === 0 && activeTab != "new" && (
                      <div className="py-3 text-center">No Data</div>
                    )}
                  </div>
                </div>

                <div
                  className={`paginationWrapper ${!loaging && total > 10 ? "" : "d-none"
                    }`}
                >
                  <span>
                    Show{" "}
                    <select
                      className="form-control"
                      onChange={(e) =>
                        handleCountChange(parseInt(e.target.value))
                      }
                      value={filters.count}
                    >
                      <option value={10}>10</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={150}>150</option>
                      <option value={200}>200</option>
                    </select>{" "}
                    from {total} Campaigns
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

                {loaging ? (
                  <div className="text-center py-4">
                    <img src="/assets/img/loader.gif" className="pageLoader" />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* campaign filters */}
            <div
              className="modal filter_modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header align-items-center bg_headers">
                    <h2 className="modal-title fs-5" id="exampleModalLabel">
                      All Filter
                    </h2>
                    <i
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      className="fa fa-times clse"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div className="modal-body">
                    <div className="modal-footer gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary m-0"
                        data-bs-dismiss="modal"
                        onClick={reset}
                      >
                        Clear all Filter
                      </button>
                    </div>
                    <div className="height_fixed">
                      <div className="accordion" id="accordionExample">
                        <div className="accordion-item"></div>
                      </div>

                      <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapsebx1"
                              aria-expanded="true"
                              aria-controls="collapsebx1"
                            >
                              <b>Select Category</b>
                              <i
                                className="fa fa-angle-down down_typs"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </h2>
                          <div
                            id="collapsebx1"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <ul className="filter_ullist">
                                {category.map((category) => {
                                  console.log(category, "klklklklk");
                                  const isCategoryExpanded =
                                    expandedCategories.includes(category._id);
                                  console.log(isCategoryExpanded, "klklkl");
                                  return (
                                    <li key={category._id}>
                                      <div className="form-check d-flex justify-content-between align-items-center">
                                        <div>
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={category._id}
                                            name="category"
                                            value={category._id}
                                            checked={selectedCategory?.includes(
                                              category._id
                                            )}
                                            onChange={() =>
                                              handleCategoryChange(category)
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={category._id}
                                          >
                                            {category.parent_cat_name}
                                          </label>
                                        </div>

                                        {category.subCategories?.length > 0 && (
                                          <i
                                            className={`fa fa-angle-${isCategoryExpanded
                                                ? "down"
                                                : "right"
                                              } toggle-arrow`}
                                            onClick={() =>
                                              toggleCategory(category._id)
                                            }
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        )}
                                      </div>

                                      {isCategoryExpanded && (
                                        // selectedCategory?.includes(category._id) &&
                                        <ul className="sub_ulbx">
                                          {category.subCategories.map(
                                            (subCategory) => {
                                              const isSubExpanded =
                                                expandedSubCategories.includes(
                                                  subCategory.id
                                                );
                                              return (
                                                <li key={subCategory.id}>
                                                  <div className="form-check d-flex justify-content-between align-items-center">
                                                    <div>
                                                      <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={subCategory.id}
                                                        name="subCategory"
                                                        value={subCategory.id}
                                                        checked={selectedSubCategory?.includes(
                                                          subCategory.id
                                                        )}
                                                        onChange={() =>
                                                          handleSubCategoryChange(
                                                            subCategory
                                                          )
                                                        }
                                                      />
                                                      <label
                                                        className="form-check-label"
                                                        htmlFor={subCategory.id}
                                                      >
                                                        {subCategory.name}
                                                      </label>
                                                    </div>

                                                    {subCategory
                                                      .subchildcategory
                                                      ?.length > 0 && (
                                                        <i
                                                          className={`fa fa-angle-${isSubExpanded
                                                              ? "down"
                                                              : "right"
                                                            } toggle-arrow`}
                                                          onClick={() =>
                                                            toggleSubCategory(
                                                              subCategory.id
                                                            )
                                                          }
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                        ></i>
                                                      )}
                                                  </div>

                                                  {isSubExpanded &&
                                                    subCategory.subchildcategory
                                                      ?.length > 0 && (
                                                      <ul>
                                                        {subCategory.subchildcategory.map(
                                                          (subSubCategory) => (
                                                            <li
                                                              key={
                                                                subSubCategory._id
                                                              }
                                                            >
                                                              <div className="form-check">
                                                                <input
                                                                  className="form-check-input"
                                                                  type="checkbox"
                                                                  id={
                                                                    subSubCategory._id
                                                                  }
                                                                  name="subSubCategory"
                                                                  value={
                                                                    subSubCategory._id
                                                                  }
                                                                  checked={selectedSubSubCategory?.includes(
                                                                    subSubCategory._id
                                                                  )}
                                                                  onChange={() =>
                                                                    handleSubSubCategoryChange(
                                                                      subSubCategory
                                                                    )
                                                                  }
                                                                />
                                                                <label
                                                                  className="form-check-label"
                                                                  htmlFor={
                                                                    subSubCategory._id
                                                                  }
                                                                >
                                                                  {
                                                                    subSubCategory.name
                                                                  }
                                                                </label>
                                                              </div>
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>
                                                    )}
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsebxRegionCountry"
                                aria-expanded="true"
                                aria-controls="collapsebxRegionCountry"
                              >
                                <b>Select Region & Country</b>
                                <i
                                  className="fa fa-angle-down down_typs"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </h2>
                            <div
                              id="collapsebxRegionCountry"
                              className="accordion-collapse collapse show"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <ul className="filter_ullist">
                                  <ul className="filter_ullist">
                                    {Object.keys(regionData).map((region) => (
                                      <li key={region}>
                                        <div className="form-check d-flex justify-content-between align-items-center">
                                          <div>
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={region}
                                              value={region}
                                              checked={selectedRegion?.includes(
                                                region
                                              )}
                                              onChange={() =>
                                                handleRegionChange(region)
                                              }
                                            />
                                            <label
                                              className="form-check-label ms-2"
                                              htmlFor={region}
                                            >
                                              <b>{region}</b>
                                            </label>
                                          </div>
                                          <i
                                            className={`fa fa-angle-${expandedRegions.includes(region)
                                                ? "down"
                                                : "right"
                                              } cursor-pointer`}
                                            onClick={() =>
                                              toggleRegionExpand(region)
                                            }
                                            aria-hidden="true"
                                          ></i>
                                        </div>

                                        {expandedRegions.includes(region) && (
                                          <ul className="filter_ullist ms-4">
                                            {regionData[region].map(
                                              (country) => (
                                                <li key={country}>
                                                  <div className="form-check">
                                                    <input
                                                      className="form-check-input"
                                                      type="checkbox"
                                                      id={country}
                                                      name="country"
                                                      value={country}
                                                      checked={selectedCountries?.includes(
                                                        country
                                                      )}
                                                      onChange={() =>
                                                        handleCountryChange(
                                                          country
                                                        )
                                                      }
                                                    />
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor={country}
                                                    >
                                                      {country}
                                                    </label>
                                                  </div>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Html;

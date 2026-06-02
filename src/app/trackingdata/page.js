'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import loader from '@/methods/loader';
import PaymentModal from './paymodal';
import { toast } from 'react-toastify';
import SelectDropdown from '../components/common/SelectDropdown';
import { CurencyData } from '../../methods/currency';
import datepipeModel from '@/models/datepipemodel';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ConnectSocket } from '../chat/socket';
import { FiColumns, FiDownload, FiChevronDown, FiChevronUp, FiCheck, FiX, FiSearch, FiCalendar, FiRefreshCw, FiEye } from 'react-icons/fi';
import debounce from 'lodash/debounce';

// Column Definitions
const ALL_COLUMNS = [
  { key: 'subIds', label: 'URL Parameters', sortable: false, default: true, width: '150px' },
  { key: 'affiliate', label: 'Affiliate', sortable: true, default: true, width: '180px' },
  { key: 'brand', label: 'Brand', sortable: true, default: true, width: '180px' },
  { key: 'currency', label: 'Currency', sortable: false, default: true, width: '100px' },
  { key: 'orderPrice', label: 'Order Price', sortable: true, default: true, width: '120px' },
  { key: 'orderId', label: 'Order ID', sortable: false, default: true, width: '140px' },
  { key: 'transactionDate', label: 'Transaction Date', sortable: true, default: true, width: '150px' },
  { key: 'commission', label: 'Commission', sortable: true, default: true, width: '120px' },
  { key: 'commissionPaid', label: 'Brand Paid', sortable: false, default: true, width: '110px' },
  { key: 'commissionStatus', label: 'Commission Status', sortable: true, default: true, width: '140px' },
  { key: 'paymentStatus', label: 'Admin Paid', sortable: true, default: true, width: '110px' },
  { key: 'actions', label: 'Actions', sortable: false, default: true, alwaysShow: true, width: '100px' }
];

export default function Affiliate() {
  const router = useRouter();
  const user = crendentialModel.getUser();
  const [filters, setFilter] = useState({
    page: 1,
    count: 10,
    search: '',
    isDeleted: false,
    startDate: '',
    endDate: '',
    commission_status: '',
    commission_paid: ''
  });
  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoader] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showModal, setShowModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState({ associateId: "", amount: 100, upfillyAmount: 100 });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const columnSelectorRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState(() =>
    ALL_COLUMNS.filter(col => col.default).map(col => col.key)
  );

  // Cancel previous API calls
  const cancelPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Handle click outside for column selector
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColumnSelector && columnSelectorRef.current && !columnSelectorRef.current.contains(event.target)) {
        setShowColumnSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnSelector]);

  // Fetch exchange rate with cleanup
  const getExchangeRate = useCallback(async (currency) => {
    if (currency === 'USD') {
      setExchangeRate(null);
      return;
    }

    // Cancel previous exchange rate request
    cancelPreviousRequest();

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const res = await fetch(`https://v6.exchangerate-api.com/v6/b0247d42906773d9631b53b0/pair/USD/${currency}`, {
        signal: abortController.signal
      });
      const data = await res.json();

      if (isMountedRef.current) {
        if (data.result === "success") setExchangeRate(data.conversion_rate);
        else setExchangeRate(null);
      }
    } catch (err) {
      if (err.name !== 'AbortError' && isMountedRef.current) {
        setExchangeRate(null);
        console.error(err);
      }
    }
  }, [cancelPreviousRequest]);

  useEffect(() => {
    getExchangeRate(selectedCurrency);
  }, [selectedCurrency, getExchangeRate]);

  const convertCurrency = useCallback((price) => {
    if (!price && price !== 0) return '—';
    if (exchangeRate && selectedCurrency !== 'USD') {
      return `${(price * exchangeRate).toFixed(2)} ${selectedCurrency}`;
    }
    return `$${price?.toFixed(2) || '0.00'}`;
  }, [exchangeRate, selectedCurrency]);

  const calculateCommissionDetails = useCallback((commissionType, price, commission) => {
    let baseCommission = commissionType === "percentage" ? (price * commission) / 100 : commission;
    const overrideAmount = baseCommission * (user?.plan_id?.commission_override / 100);
    return { total: baseCommission + overrideAmount, upfilly: overrideAmount };
  }, [user]);

  const handlePayClick = (price, commission, commissionType, id) => {
    const { total, upfilly } = calculateCommissionDetails(commissionType, price, commission);
    setSelectedCommission({ associateId: id, amount: total, upfillyAmount: upfilly });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Main data fetching function with abort capability
  const getData = useCallback(async (additionalFilters = {}, isPaginated = false) => {
    // Cancel any ongoing request
    cancelPreviousRequest();

    // Don't fetch if component is unmounted
    if (!isMountedRef.current) return;

    setLoader(true);

    try {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const baseFilter = user?.role === "brand"
        ? { ...filters, ...additionalFilters, brand_id: user.id }
        : { ...filters, ...additionalFilters, affiliate_id: user.id };

      // Remove undefined/null values
      Object.keys(baseFilter).forEach(key => {
        if (baseFilter[key] === undefined || baseFilter[key] === null || baseFilter[key] === '') {
          delete baseFilter[key];
        }
      });

      const res = await ApiClient.get(`affiliatelink/all`, baseFilter);

      if (isMountedRef.current && res) {
        if (res.success) {
          setData(res?.data);
          setTotal(res?.data?.total_count || 0);
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError' && isMountedRef.current) {
        console.error('API Error:', err);
        if (err.message !== 'canceled') {
          toast.error('Failed to fetch data');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoader(false);
        setIsInitialLoad(false);
      }
    }
  }, [filters, user, cancelPreviousRequest]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((searchValue) => {
      if (isMountedRef.current) {
        updateFilter({ search: searchValue, page: 1 });
      }
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilter(prev => ({ ...prev, search: value }));
    debouncedSearch(value);
  };

  // Update filter with optimized re-renders
  const updateFilter = useCallback((updates, shouldFetch = true) => {
    setFilter(prev => {
      const newFilters = { ...prev, ...updates, page: updates.page !== undefined ? updates.page : 1 };
      if (shouldFetch) {
        // Use setTimeout to avoid multiple rapid updates
        setTimeout(() => {
          if (isMountedRef.current) {
            getData({ ...updates, page: newFilters.page });
          }
        }, 0);
      }
      return newFilters;
    });
  }, [getData]);

  const resetFilters = useCallback(() => {
    setDateRange({ start: null, end: null });
    const resetValues = {
      startDate: "",
      endDate: "",
      search: "",
      commission_paid: '',
      commission_status: '',
      page: 1,
      count: 10
    };
    setFilter(prev => ({ ...prev, ...resetValues }));
    getData(resetValues);
  }, [getData]);

  const handleSort = useCallback((key) => {
    const newOrder = (filters.key === key && filters.sorder === 'asc') ? 'desc' : 'asc';
    updateFilter({ sortBy: `${key} ${newOrder}`, key, sorder: newOrder });
  }, [filters.key, filters.sorder, updateFilter]);

  const handleStatusChange = useCallback((itm, id, dataItem) => {
    if (itm === 'accepted') {
      loader(true);
      ApiClient.put('update/commission/status', {
        campaignId: dataItem?.campaign_details?._id,
        commission_status: itm,
        id
      }).then((res) => {
        if (res.success) {
          toast.success(res.message);
          getData({ page: filters.page });
        }
        loader(false);
      }).catch(() => loader(false));
    } else {
      Swal.fire({
        html: `<div class="text-left">
          <h3 class="mb-3" style="color: #dc2626;">Deny Commission</h3>
          <label class="fw-bold mb-2">Reason for denial:</label>
          <textarea id="denialReason" class="form-control mt-2" rows="4" placeholder="Please provide a reason..."></textarea>
        </div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Deny Commission',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          const denialReason = (document.getElementById('denialReason'))?.value;
          if (!denialReason?.trim()) {
            toast.error('Please provide a reason for denial');
            return;
          }
          loader(true);
          ApiClient.put('update/commission/status', {
            campaignId: dataItem?.campaign_details?._id,
            commission_status: itm,
            id,
            reason: denialReason
          }).then((res) => {
            if (res.success) {
              toast.success(res.message);
              getData({ page: filters.page });
            }
            loader(false);
          }).catch(() => loader(false));
        }
      });
    }
  }, [filters.page, getData]);

  const exportToExcel = useCallback(async () => {
    const filterParams = { ...filters, export_to_xls: "yes" };
    if (user?.role === "brand") filterParams.brand_id = user.id;
    else filterParams.affiliate_id = user.id;
    delete filterParams.search;

    try {
      const response = await fetch(`https://api.upfilly.com/affiliatelink/all?${new URLSearchParams(filterParams)}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Affiliate_Transactions.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export started successfully');
    } catch (error) {
      console.error("Export failed:", error);
      toast.error('Failed to export data');
    }
  }, [filters, user]);

  const toggleColumn = useCallback((key) => {
    const column = ALL_COLUMNS.find(c => c.key === key);
    if (column?.alwaysShow) return;
    setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }, []);

  const resetColumns = useCallback(() => setVisibleColumns(ALL_COLUMNS.filter(c => c.default).map(c => c.key)), []);
  const showAllColumns = useCallback(() => setVisibleColumns(ALL_COLUMNS.map(c => c.key)), []);

  // Dynamic subIds headers
  const subIdHeaders = useMemo(() => {
    const headers = new Set();
    data?.data?.forEach(item => {
      if (item?.subIds && typeof item.subIds === 'object') {
        Object.keys(item.subIds).forEach(key => headers.add(key));
      }
    });
    return Array.from(headers);
  }, [data]);

  const isColumnVisible = (key) => visibleColumns.includes(key);
  const getColumnWidth = (key) => ALL_COLUMNS.find(c => c.key === key)?.width || 'auto';

  // Initial data load - only once
  useEffect(() => {
    if (user?.id || user?._id) {
      if (user.role === 'brand') {
        getData({ page: 1 });
      } else {
        // Setup socket listener only once
        const handleUpdate = (data) => {
          console.log(data,"kjkjkj")
          if (data) {
            getData({ page: 1 });
          }
        };
        ConnectSocket.emit("join-room-shopify", { user_id:user?.id || user?._id , "type":"shopify"});
        ConnectSocket.on(`shopify-listing-update`, handleUpdate);
        getData({ page: 1 });

        return () => {
          ConnectSocket.off(`shopify-listing-update`, handleUpdate);
        };
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelPreviousRequest();
      debouncedSearch.cancel();
    };
  }, [cancelPreviousRequest, debouncedSearch]);

  // Memoized select dropdown handlers
  const handleCommissionStatusChange = useCallback((e) => {
    updateFilter({ commission_status: e.value });
  }, [updateFilter]);

  const handleCurrencyChange = useCallback((e) => {
    setSelectedCurrency(e.value);
  }, []);

  const handleBrandPaidStatusChange = useCallback((e) => {
    updateFilter({ commission_paid: e.value });
  }, [updateFilter]);

  const handleDateRangeChange = useCallback((dates) => {
    const [start, end] = dates;
    setDateRange({ start, end });
    updateFilter({
      startDate: start?.toISOString().split('T')[0] || "",
      endDate: end?.toISOString().split('T')[0] || ""
    });
  }, [updateFilter]);

  const handlePageChange = useCallback(({ selected }) => {
    updateFilter({ page: selected + 1 });
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateFilter]);

  const handleCountChange = useCallback((e) => {
    updateFilter({ count: Number(e.target.value) });
  }, [updateFilter]);

  return (
    <Layout handleKeyPress={(e) => e.key === 'Enter' && updateFilter({})} reset={resetFilters} filter={updateFilter} name="Track Data" filters={filters}>
      <div className="affiliate-commission-tracker">
        <div className="container-fluid px-4 py-4">

          {/* Header Section */}
          <div className="header-section mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <h1 className="page-title mb-1">Commission Transactions</h1>
                <p className="page-subtitle text-muted">Track and manage all affiliate commission earnings</p>
              </div>

              {/* <div className="stats-badge">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  Total Transactions: {total}
                </span>
              </div> */}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="filters-bar card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3 col-lg-2">
                  <label className="form-label small text-muted mb-1">Search</label>
                  <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      value={filters.search}
                      placeholder="Order ID, Affiliate..."
                      className="form-control ps-4"
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                <div className="col-md-3 col-lg-2">
                  <label className="form-label small text-muted mb-1">Commission Status</label>
                  <SelectDropdown
                    theme="search"
                    placeholder="All Status"
                    intialValue={filters.commission_status}
                    result={handleCommissionStatusChange}
                    options={[
                      { id: '', name: 'All' },
                      { id: 'pending', name: 'Pending' },
                      { id: 'accepted', name: 'Accepted' },
                      { id: 'rejected', name: 'Rejected' },
                    ]}
                  />
                </div>

                <div className="col-md-3 col-lg-2">
                  <label className="form-label small text-muted mb-1">Currency</label>
                  <SelectDropdown
                    theme="search"
                    placeholder="Select Currency"
                    intialValue={selectedCurrency}
                    result={handleCurrencyChange}
                    options={CurencyData}
                  />
                </div>

                {user?.role === "affiliate" && (
                  <div className="col-md-3 col-lg-2">
                    <label className="form-label small text-muted mb-1">Brand Paid Status</label>
                    <SelectDropdown
                      theme="search"
                      placeholder="All"
                      intialValue={filters.commission_paid}
                      result={handleBrandPaidStatusChange}
                      options={[
                        { id: '', name: 'All' },
                        { id: 'pending', name: 'Pending' },
                        { id: 'paid', name: 'Paid' },
                        { id: 'unpaid', name: 'Unpaid' },
                      ]}
                    />
                  </div>
                )}

                <div className="col-md-3 col-lg-2">
                  <label className="form-label small text-muted mb-1">Date Range</label>
                  <div className="date-picker-wrapper">
                    <FiCalendar className="calendar-icon" />
                    <DatePicker
                      selectsRange
                      startDate={dateRange.start}
                      endDate={dateRange.end}
                      onChange={handleDateRangeChange}
                      placeholderText="Select range"
                      className="form-control ps-4"
                    />
                  </div>
                </div>

                <div className="col-md-auto">
                  <div className="d-flex gap-2">
                    <div className="column-selector-container position-relative">
                      <button className="btn btn-outline-secondary" onClick={() => setShowColumnSelector(!showColumnSelector)}>
                        <FiColumns className="me-1" /> Columns
                      </button>
                      {showColumnSelector && (
                        <div className="column-selector-panel" ref={columnSelectorRef}>
                          <div className="panel-header">
                            <h6 className="mb-0">Manage Columns</h6>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-link p-0" onClick={resetColumns}>Reset</button>
                              <button className="btn btn-sm btn-link p-0" onClick={showAllColumns}>Show All</button>
                            </div>
                          </div>
                          <div className="panel-body">
                            {ALL_COLUMNS.map(col => (
                              <label key={col.key} className="column-option">
                                <input
                                  type="checkbox"
                                  checked={isColumnVisible(col.key)}
                                  onChange={() => toggleColumn(col.key)}
                                  disabled={col.alwaysShow}
                                />
                                <span>{col.label}</span>
                                {col.alwaysShow && <small className="text-muted ms-1">(required)</small>}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="btn btn-primary" onClick={exportToExcel} disabled={loading || total === 0}>
                      <FiDownload className="me-1" /> Export
                    </button>

                    {(dateRange.start || dateRange.end || filters.search || filters.commission_paid || filters.commission_status) && (
                      <button className="btn btn-outline-danger" onClick={resetFilters}>
                        <FiRefreshCw className="me-1" /> Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="table-container card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    {isColumnVisible('subIds') && subIdHeaders.map(key => (
                      <th key={key} style={{ minWidth: getColumnWidth('subIds') }}>
                        {key === 'affiliate' ? 'Affiliate ID' : key}
                      </th>
                    ))}
                    {isColumnVisible('affiliate') && (
                      <th onClick={() => handleSort('affiliate_name')} className="sortable" style={{ minWidth: getColumnWidth('affiliate') }}>
                        Affiliate {filters.key === 'affiliate_name' && (filters.sorder === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />)}
                      </th>
                    )}
                    {isColumnVisible('brand') && (
                      <th onClick={() => handleSort('brand_name')} className="sortable" style={{ minWidth: getColumnWidth('brand') }}>
                        Brand {filters.key === 'brand_name' && (filters.sorder === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />)}
                      </th>
                    )}
                    {isColumnVisible('currency') && (
                      <th style={{ minWidth: getColumnWidth('currency') }}>Currency</th>
                    )}
                    {isColumnVisible('orderPrice') && (
                      <th onClick={() => handleSort('price')} className="sortable text-end" style={{ minWidth: getColumnWidth('orderPrice') }}>
                        Order Price {filters.key === 'price' && (filters.sorder === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />)}
                      </th>
                    )}
                    {isColumnVisible('orderId') && (
                      <th style={{ minWidth: getColumnWidth('orderId') }}>Order ID</th>
                    )}
                    {isColumnVisible('transactionDate') && (
                      <th onClick={() => handleSort('timestamp')} className="sortable" style={{ minWidth: getColumnWidth('transactionDate') }}>
                        Transaction Date {filters.key === 'timestamp' && (filters.sorder === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />)}
                      </th>
                    )}
                    {isColumnVisible('commission') && (
                      <th onClick={() => handleSort('commission')} className="sortable text-end" style={{ minWidth: getColumnWidth('commission') }}>
                        Commission {filters.key === 'commission' && (filters.sorder === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />)}
                      </th>
                    )}
                    {isColumnVisible('commissionStatus') && (
                      <th onClick={() => handleSort('commission_status')} className="sortable" style={{ minWidth: getColumnWidth('commissionStatus') }}>
                        Commission Status {filters.key === 'commission_status' && (filters.sorder === 'asc' ? <FiChevronUp className="ms-1" /> : <FiChevronDown className="ms-1" />)}
                      </th>
                    )}
                    {isColumnVisible('commissionPaid') && user?.role === "affiliate" && (
                      <th style={{ minWidth: getColumnWidth('commissionPaid') }}>Brand Paid</th>
                    )}
                    {isColumnVisible('paymentStatus') && user?.role === "affiliate" && (
                      <th style={{ minWidth: getColumnWidth('paymentStatus') }}>Admin Paid</th>
                    )}
                    {isColumnVisible('actions') && user?.role === "brand" && (
                      <th style={{ minWidth: getColumnWidth('actions') }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {!loading && data?.data?.map((item, idx) => (
                    <tr key={item._id || item.id || idx} className="transaction-row">
                      {isColumnVisible('subIds') && subIdHeaders.map(key => (
                        <td key={key} className="text-muted small">{item?.subIds?.[key] ?? '—'}</td>
                      ))}
                      {isColumnVisible('affiliate') && (
                        <td className="fw-medium">{item?.affiliate_name || '—'}</td>
                      )}
                      {isColumnVisible('brand') && (
                        <td>{item?.brand_name || '—'}</td>
                      )}
                      {isColumnVisible('currency') && (
                        <td><span className="badge bg-light text-dark">{item?.currency || 'USD'}</span></td>
                      )}
                      {isColumnVisible('orderPrice') && (
                        <td className="text-end fw-semibold">{convertCurrency(item?.price)}</td>
                      )}
                      {isColumnVisible('orderId') && (
                        <td><code className="small">{item?.order_id || '—'}</code></td>
                      )}
                      {isColumnVisible('transactionDate') && (
                        <td className="text-muted small">{datepipeModel.date(item?.timestamp || item?.createdAt)}</td>
                      )}
                      {isColumnVisible('commission') && (
                        <td className="text-end fw-semibold text-success">
                          {item?.amount_of_commission
                            ? convertCurrency(item.amount_of_commission)
                            : item?.campaign_details?.commission_type === "percentage"
                              ? `${item?.campaign_details?.commission}%`
                              : convertCurrency(item?.campaign_details?.commission)}
                        </td>
                      )}
                      {isColumnVisible('commissionStatus') && (
                        <td>
                          <span className={`status-badge status-${item?.commission_status}`}>
                            {item?.commission_status || 'pending'}
                          </span>
                        </td>
                      )}
                      {isColumnVisible('commissionPaid') && user?.role === "affiliate" && (
                        <td>
                          <span className={`status-badge status-${item?.commission_paid}`}>
                            {item?.commission_paid || 'pending'}
                          </span>
                        </td>
                      )}
                      {isColumnVisible('paymentStatus') && user?.role === "affiliate" && (
                        <td>
                          <span className={`status-badge status-${item?.admin_paid}`}>
                            {item?.admin_paid || 'pending'}
                          </span>
                        </td>
                      )}
                      {isColumnVisible('actions') && user?.role === "brand" && (
                        <td>
                          {item?.commission_status === 'pending' ? (
                            <div className="action-buttons">
                              <button
                                onClick={() => handleStatusChange("accepted", item?.id || item?._id, item)}
                                className="btn-action accept"
                                title="Accept Commission"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => handleStatusChange("rejected", item?.id || item?._id, item)}
                                className="btn-action reject"
                                title="Reject Commission"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2">Loading transactions...</p>
                </div>
              )}

              {!loading && total === 0 && !isInitialLoad && (
                <div className="text-center py-5">
                  <div className="empty-state">
                    <FiEye className="empty-icon mb-3" />
                    <h5 className="text-muted">No transactions found</h5>
                    <p className="text-muted small">Try adjusting your filters or date range</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {!loading && total > 0 && (
            <div className="pagination-wrapper mt-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="show-entries">
                  <span className="text-muted me-2">Show</span>
                  <select
                    className="form-select form-select-sm d-inline-block w-auto"
                    value={filters.count}
                    onChange={handleCountChange}
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                  </select>
                  <span className="text-muted ms-2">of {total} entries</span>
                </div>

                <ReactPaginate
                  breakLabel="..."
                  nextLabel="Next →"
                  forcePage={filters.page - 1}
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={1}
                  pageCount={Math.ceil(total / filters.count)}
                  previousLabel="← Previous"
                  renderOnZeroPageCount={null}
                  containerClassName="pagination mb-0"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  activeClassName="active"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal
        showModal={showModal}
        setShowModal={setShowModal}
        calculatedAmount={selectedCommission.amount}
        upfillyAmount={selectedCommission.upfillyAmount}
        associateId={selectedCommission.associateId}
        user={user}
        handleClose={handleCloseModal}
      />
    </Layout>
  );
}
"use client";

import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/global/layout";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import loader from "@/methods/loader";
import ApiClient from "@/methods/api/apiClient";
import SelectDropdown from "../components/common/SelectDropdown";
import datepipeModel from "@/models/datepipemodel";
import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import methodModel from "../../methods/methods";
import Modal from 'react-modal';
import toast from 'react-toastify';
import environment from "@/environment";
import axios from "axios";

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function Affilate() {
  const history = useRouter();
  const user = crendentialModel.getUser();
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    transaction_type: "",
    search: "",
    isDeleted: false,
    transaction_status: "",
    subscription_plan_id: "",
    export_to_xls: "",
    ...(user?.role == "brand" ? { user_id: user?.id } : { paid_to: user?.id }),
  });
  const [monthlyFilters, setMonthlyFilters] = useState({
    page: 0,
    count: 10,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    sortBy: "createdAt desc"
  });
  const [data, setData] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [total, setTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoader] = useState(true);
  const [monthlyLoading, setMonthlyLoader] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [pendingPaymentData, setPendingPaymentData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const activePlans = planData?.filter((plan) => plan.isActive);
  const comissionAmount = activePlans?.[0]?.commission_override || 5;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);

  const downloadInvoice = (transaction) => {
    if (!transaction.invoice_url) {
      alert('No invoice available for this transaction');
      return;
    }

    const link = document.createElement('a');
    link.href = transaction.invoice_url;
    link.download = `invoice_${transaction.transaction_id || transaction._id}_${new Date(transaction.createdAt).toISOString().split('T')[0]}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadInvoicepending = (transaction) => {
    if (!transaction.custom_invoice_url) {
      alert('No invoice available for this transaction');
      return;
    }

    const link = document.createElement('a');
    link.href = `${environment.api}${transaction.custom_invoice_url}`;
    link.download = `invoice_${transaction.transaction_id || transaction._id}_${new Date(transaction.createdAt).toISOString().split('T')[0]}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewInvoice = (transaction) => {
    if (transaction.invoice_url) {
      window.open(transaction.invoice_url, '_blank');
    } else {
      alert('Invoice URL not available');
    }
  };

  // const downloadMonthlyInvoice = async (invoice) => {
  //   try {
  //     const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
      
  //     const link = document.createElement('a');
  //     link.href = invoiceUrl;
  //     link.download = invoice.invoice_url.split('/').pop() || `monthly_invoice_${invoice.month}_${invoice.year}_${invoice.id}.pdf`;
  //     link.target = '_blank';
      
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
      
  //   } catch (error) {
  //     console.error("Error downloading invoice:", error);
  //     try {
  //       const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
  //       window.open(invoiceUrl, '_blank');
  //     } catch (fallbackError) {
  //       alert('Failed to download invoice. Please try again.');
  //     }
  //   }
  // };

  const downloadMonthlyInvoice = async (invoice) => {
    try {
      const invoiceUrl = `${environment.api}${invoice.invoice_url}`;

      const response = await axios.get(invoiceUrl, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a');
      link.href = url;
      link.download = invoice.invoice_url.split('/').pop() || `monthly_invoice_${invoice.month}_${invoice.year}_${invoice.id}.pdf`;
      link.setAttribute('download', 'link.download')
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading invoice:", error);
      try {
        const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
        window.open(invoiceUrl, '_blank');
      } catch (fallbackError) {
        alert('Failed to download invoice. Please try again.');
      }
    }
  };

  const viewMonthlyInvoice = (invoice) => {
    if (invoice.invoice_url) {
      const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
      window.open(invoiceUrl, '_blank');
    } else {
      alert('Invoice not available for viewing.');
    }
  };

  const downloadMonthlyReport = async (invoice) => {
    try {
      const invoiceUrl = `${environment.api}${invoice.report_url}`;

      const response = await axios.get(invoiceUrl, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a');
      link.href = url;
      link.download = invoice.report_url.split('/').pop() || `monthly_invoice_${invoice.month}_${invoice.year}_${invoice.id}.pdf`;
      link.setAttribute('download', 'link.download')
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error downloading invoice:", error);
      try {
        const invoiceUrl = `${environment.api}${invoice.report_url}`;
        window.open(invoiceUrl, '_blank');
      } catch (fallbackError) {
        alert('Failed to download invoice. Please try again.');
      }
    }
  };

  const viewMonthlyReport = (invoice) => {
    if (invoice.invoice_url) {
      const invoiceUrl = `${environment.api}${invoice.report_url}`;
      window.open(invoiceUrl, '_blank');
    } else {
      alert('Invoice not available for viewing.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (activeTab === "all") {
        filter();
      } else {
        getMonthlyInvoices();
      }
    }
  };

  const getPlanData = (p = {}) => {
    setLoader(true);
    if (user) {
      let filter = {
        page: 1,
        count: 50, 
        userId: user?.id, 
        category: "Network"
      }
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setPlanData(res?.data?.data)
        }
        setLoader(false)
      })
    }
  }

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...params, ...p };

    ApiClient.get(`transaction/all`, filter).then((res) => {
      if (res.success) {
        setData(res?.data);
        setTotal(res?.data?.total);
        setLoader(false);
      }
    });
  };

  const getMonthlyInvoices = async (p = {}) => {
    setMonthlyLoader(true);
    
    try {
      let filter = { 
        ...monthlyFilters, 
        ...p,
        page: monthlyFilters.page + 1,
        brand_id:user?.id || user?._id,
      };

      const cleanFilter = Object.keys(filter).reduce((acc, key) => {
        if (filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
          acc[key] = filter[key];
        }
        return acc;
      }, {});

      if (user?.role === "brand") {
        const res = await ApiClient.get(`commission/monthly-invoices/list`, cleanFilter);
        
        if (res?.success) {
          setMonthlyData(Array.isArray(res.data) ? res.data : (res.data?.data || []));
          setMonthlyTotal(Array.isArray(res.data) ? res.data.length : (res.data?.total || 0));
        } else {
          setMonthlyData([]);
          setMonthlyTotal(0);
        }
      } else {
        setMonthlyData([]);
        setMonthlyTotal(0);
      }
    } catch (error) {
      console.error("Error fetching monthly invoices:", error);
      setMonthlyData([]);
      setMonthlyTotal(0);
      toast.error("Failed to load monthly invoices");
    } finally {
      setMonthlyLoader(false);
    }
  };

  const getPendingPaymentData = () => {
    ApiClient.get(`payableMonthlyTransactions`).then((res) => {
      if (res.success) {
        setPendingPaymentData(res?.data);
      } else {
        setPendingPaymentData(null);
      }
    }).catch(error => {
      console.error("Error fetching pending payments:", error);
      setPendingPaymentData(null);
    });
  };

  useEffect(() => {
    if (user.role == "brand") {
      setFilter({ ...filters, page: 1, ...params });
      getData({ page: 1, user_id: user?.id, ...params });
      getPlanData();
    } else if (user.role != "brand") {
      setFilter({ ...filters, page: 1, ...params });
      getData({ page: 1, paid_to: user?.id, ...params });
    }
  }, []);

  useEffect(() => {
    if (activeTab === "monthly" && user?.role === "brand") {
      getMonthlyInvoices();
    }
  }, [activeTab, monthlyFilters.page, monthlyFilters.year, monthlyFilters.month, monthlyFilters.sortBy]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClosePaymentModal();
      }
    };

    if (isPaymentModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPaymentModalOpen]);

  const pageChange = (e) => {
    if (activeTab === "all") {
      setFilter({ ...filters, page: e.selected });
      getData({ page: e.selected + 1 });
    } else {
      setMonthlyFilters({ ...monthlyFilters, page: e.selected });
    }
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

  const monthlySorting = (key) => {
    let sorder = "asc";
    if (monthlyFilters.key == key) {
      if (monthlyFilters?.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }

    let sortBy = `${key} ${sorder}`;
    setMonthlyFilters({ 
      ...monthlyFilters, 
      sortBy,
      key,
      sorder,
      page: 0 
    });
  };

  const ChangeStatus = (e) => {
    setFilter({ ...filters, transaction_status: e });
    getData({ transaction_status: e, page: 1, user_id: user?.id });
  };

  const handleCountChange = (count) => {
    if (activeTab === "all") {
      setFilter({ ...filters, count: count, page: 1 });
      getData({ count: count, page: 1 });
    } else {
      setMonthlyFilters({ ...monthlyFilters, count: count, page: 0 });
    }
  };

  const reset = () => {
    let filter = {
      user_id: user?.id,
      transaction_status: "",
      role: "",
      search: "",
      page: 1,
      count: 10,
      transaction_type: "",
    };
    setStartDate("");
    setEndDate("");
    setIsOpen(false);
    setFilter({ ...filters, ...filter });
    getData({ ...filter });
    history.push('/payments');
  };

  const view = (id) => {
    const filterParams = {
      ...filters,
      page: 1,
    };
    const queryString = new URLSearchParams(filterParams).toString();
    history.push(`/payments/detail/${id}?${queryString}`);
  };

  const changeTransactionStatus = (e) => {
    setFilter({ ...filters, transaction_type: e, page: 0 });
    getData({ transaction_type: e, page: 1, user_id: user?.id });
  };

  const handleOpenPaymentModal = () => {
    getPendingPaymentData();
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    if (!isProcessing) {
      setIsPaymentModalOpen(false);
      setPendingPaymentData(null);
    }
  };

  const calculateDistribution = () => {
    if (!pendingPaymentData || !pendingPaymentData.totalPayableAmount) {
      return {
        totalAmount: 0,
        stripeFee: 0,
        upfillyFee: 0,
        affiliateCommission: 0,
        percentageBreakdown: {
          stripe: "0%",
          upfilly: "0%",
          affiliate: "0%"
        }
      };
    }

    const totalAmount = parseFloat(pendingPaymentData.totalPayableAmount);
    const totalTransactions = pendingPaymentData.totalPendingTransactions || 1;

    const stripePercentage = 0.029;
    const stripeFixedFee = totalTransactions * 0.30;
    const stripeFee = (totalAmount * stripePercentage) + stripeFixedFee;

    const upfillyPercentage = comissionAmount / 100;
    const upfillyFee = totalAmount * upfillyPercentage;

    const affiliateCommission = Math.max(0, totalAmount - stripeFee - upfillyFee);

    const stripePercentageOfTotal = (stripeFee / totalAmount) * 100;
    const upfillyPercentageOfTotal = (upfillyFee / totalAmount) * 100;
    const affiliatePercentageOfTotal = (affiliateCommission / totalAmount) * 100;

    return {
      totalAmount: totalAmount.toFixed(2),
      stripeFee: stripeFee.toFixed(2),
      upfillyFee: upfillyFee.toFixed(2),
      affiliateCommission: affiliateCommission.toFixed(2),
      percentageBreakdown: {
        stripe: stripePercentageOfTotal.toFixed(1) + "%",
        upfilly: upfillyPercentageOfTotal.toFixed(1) + "%",
        affiliate: affiliatePercentageOfTotal.toFixed(1) + "%"
      }
    };
  };

  const handlePayCommission = async () => {
    if (!pendingPaymentData || !pendingPaymentData.totalPayableAmount) {
      toast.error("No pending payments to process");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await ApiClient.post('pay/commission/to/admin', {
        transaction_ids: pendingPaymentData.ids,
        commission: parseFloat(pendingPaymentData.totalPayableAmount),
      });

      if (response?.success) {
        window.open(response.data.url, "_self");
        getData();
        setIsPaymentModalOpen(false);
        setPendingPaymentData(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayMonthlyInvoice = async (invoice) => {
    try {
      setIsProcessing(true);
      toast.info("Processing invoice payment...");
      
      const response = await ApiClient.post('commission/monthly-invoices/pay', {
        invoice_id: invoice.id,
        amount: invoice.total_amount
      });

      if (response?.success) {
        toast.success("Payment initiated successfully");
        if (response.data.payment_url) {
          window.open(response.data.payment_url, "_self");
        } else {
          getMonthlyInvoices();
        }
      } else {
        toast.error(response?.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const viewInvoiceDetails = (invoice) => {
    alert(`Invoice Details:\n\nInvoice Number: ${invoice.invoice_number}\nMonth: ${invoice.month}/${invoice.year}\nTotal Amount: $${invoice.total_amount}\nStatus: ${invoice.status}\nCommission Count: ${invoice.commission_count}\nAffiliates: ${invoice.details?.affiliates?.length || 0}`);
  };

  const calculateMonthlySummary = () => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        totalInvoices: 0,
        totalAmount: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        totalCommissions: 0
      };
    }

    const totalInvoices = monthlyData.length;
    const totalAmount = monthlyData.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
    const paidInvoices = monthlyData.filter(invoice => invoice.status === 'paid').length;
    const pendingInvoices = monthlyData.filter(invoice => invoice.status === 'pending').length;
    const totalCommissions = monthlyData.reduce((sum, invoice) => sum + (invoice.commission_count || 0), 0);

    return {
      totalInvoices,
      totalAmount,
      paidInvoices,
      pendingInvoices,
      totalCommissions
    };
  };

  const renderAllTransactionsTable = () => (
    <div className="nmain-list mb-3 main_box">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex flex-wrap gap-2 all_flexbx justify-content-md-end">
              {user?.role === "brand" && (
                <button
                  className="btn btn-primary"
                  onClick={handleOpenPaymentModal}
                >
                  <i className="fa fa-money me-2" aria-hidden="true"></i>
                  Pay Commission
                </button>
              )}

              <div className="">
                {user?.role == "brand" ? (
                  <SelectDropdown
                    theme="search"
                    id="statusDropdown"
                    displayValue="name"
                    placeholder="All Transactions"
                    intialValue={filters?.transaction_type}
                    result={(e) => {
                      changeTransactionStatus(e.value);
                    }}
                    options={[
                      { id: "buy_subscription", name: "Subscription" },
                      { id: "pay_commission", name: "Commission" },
                    ]}
                  />
                ) : (
                  <SelectDropdown
                    theme="search"
                    id="statusDropdown"
                    displayValue="name"
                    placeholder="All Transactions"
                    intialValue={filters?.transaction_type}
                    result={(e) => {
                      changeTransactionStatus(e.value);
                    }}
                    options={[{ id: "pay_commission", name: "Commission" }]}
                  />
                )}
              </div>

              <div className="">
                <SelectDropdown
                  theme="search"
                  id="statusDropdown"
                  displayValue="name"
                  placeholder="Status"
                  intialValue={filters?.transaction_status}
                  result={(e) => {
                    ChangeStatus(e.value);
                  }}
                  options={[
                    { id: "paid", name: "Successful" },
                    { id: "pending", name: "Pending" },
                    { id: "failed", name: "Failed" },
                  ]}
                />
              </div>

              {(filters?.search || filters.transaction_status || filters.transaction_type) && (
                <a className="btn btn-primary" onClick={(e) => reset()}>
                  Reset
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="respon_data">
            <div className="table_section ">
              <div className="table-responsive ">
                <table className="table table-striped ">
                  <thead className="thead-clr">
                    <tr>
                      <th scope="row" onClick={(e) => sorting("paid_to_name")}>
                        Name {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      {user?.role == "brand" ? (
                        <th onClick={(e) => sorting("amount")}>
                          Amount {filters?.sorder === "asc" ? "↑" : "↓"}
                        </th>
                      ) : (
                        <th onClick={(e) => sorting("amount")}>
                          Commission {filters?.sorder === "asc" ? "↑" : "↓"}
                        </th>
                      )}
                      <th onClick={(e) => sorting("currency")}>
                        Currency {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th onClick={(e) => sorting("transaction_status")}>
                        Payment Status {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th onClick={(e) => sorting("createdAt")}>
                        Creation Date {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      <th onClick={(e) => sorting("updatedAt")}>
                        Last Modified {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      {/* <th>Report</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && data?.data?.map((itm, i) => (
                      <tr className="data_row" key={i}>
                        <td
                          className="name-person ml-2"
                          onClick={(e) => view(itm._id)}
                          style={{ cursor: 'pointer', color: '#007bff' }}
                        >
                          {methodModel?.capitalizeFirstLetter(itm?.paid_to_name)}
                        </td>
                        <td className="name-person ml-2">
                          {itm?.amount}
                        </td>
                        <td className="name-person ml-2">
                          {itm?.currency || "USD"}
                        </td>
                        <td className="name-person ml-2">
                          <span className={`badge bg-${(itm?.transaction_status === 'successful' || itm?.transaction_status === 'paid') ? 'success' : 'danger'}`}>
                            {(itm?.transaction_status === 'successful' || itm?.transaction_status === 'paid') ? "Successful" : itm?.transaction_status}
                          </span>
                        </td>
                        <td className="name-person ml-2">
                          {datepipeModel.date(itm?.createdAt)}
                        </td>
                        <td className="name-person ml-2">
                          {datepipeModel.date(itm?.updatedAt)}
                        </td>
                        {/* <td className="name-person ml-2">
                          <div className="invoice-actions" style={{ display: 'flex', gap: '8px' }}>
                            {itm.invoice_url ? (
                              <button
                                onClick={() => downloadInvoice(itm)}
                                className="btn btn-sm btn-outline-primary"
                                title="Download Invoice"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                              >
                                <i className="fa fa-download me-1" aria-hidden="true"></i>
                                Download
                              </button>
                            ) : !itm?.custom_invoice_url ?
                              <span className="text-muted small">No invoice</span>
                              : (
                                <button
                                  onClick={() => downloadInvoicepending(itm)}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Download Invoice"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                >
                                  <i className="fa fa-download me-1" aria-hidden="true"></i>
                                  Download
                                </button>
                              )}
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loading && (
                  <div className="text-center py-4">
                    <img
                      src="/assets/img/loader.gif"
                      className="pageLoader"
                      alt="Loading..."
                    />
                  </div>
                )}
                {!loading && total == 0 && (
                  <div className="mb-3 text-center">No Data Found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonthlyInvoicesTable = () => {
    const summary = calculateMonthlySummary();
    
    return (
      <div className="nmain-list mb-3 main_box">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex flex-wrap gap-2 all_flexbx justify-content-md-between mb-3">
                <div>
                  <h5 className="mb-0">Monthly Commission Invoices</h5>
                  <small className="text-muted">View and download your monthly commission invoices</small>
                </div>
                
                {/* <div className="d-flex gap-2 align-items-center">
                  <div className="d-flex gap-2">
                    <div>
                      <label className="form-label small mb-1">Year</label>
                      <select
                        className="form-control"
                        value={monthlyFilters.year}
                        onChange={(e) => setMonthlyFilters({...monthlyFilters, year: parseInt(e.target.value), page: 0})}
                        style={{ minWidth: '100px' }}
                      >
                        {[2023, 2024, 2025, 2026, 2027].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label small mb-1">Month</label>
                      <select
                        className="form-control"
                        value={monthlyFilters.month}
                        onChange={(e) => setMonthlyFilters({...monthlyFilters, month: parseInt(e.target.value), page: 0})}
                        style={{ minWidth: '120px' }}
                      >
                        {[
                          {value: 0, label: 'All Months'},
                          {value: 1, label: 'January'},
                          {value: 2, label: 'February'},
                          {value: 3, label: 'March'},
                          {value: 4, label: 'April'},
                          {value: 5, label: 'May'},
                          {value: 6, label: 'June'},
                          {value: 7, label: 'July'},
                          {value: 8, label: 'August'},
                          {value: 9, label: 'September'},
                          {value: 10, label: 'October'},
                          {value: 11, label: 'November'},
                          {value: 12, label: 'December'},
                        ].map(month => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="align-self-end">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => getMonthlyInvoices()}
                      disabled={monthlyLoading}
                      title="Refresh"
                    >
                      <i className="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              {/* {monthlyData.length > 0 && (
                <div className="row mb-4">
                  <div className="col-md-2">
                    <div className="card bg-light border">
                      <div className="card-body py-2">
                        <h6 className="text-muted mb-1 small">Total Invoices</h6>
                        <h4 className="mb-0">{summary.totalInvoices}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-light border">
                      <div className="card-body py-2">
                        <h6 className="text-muted mb-1 small">Total Amount</h6>
                        <h4 className="mb-0">${summary.totalAmount.toFixed(2)}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-light border">
                      <div className="card-body py-2">
                        <h6 className="text-muted mb-1 small">Paid Invoices</h6>
                        <h4 className="mb-0">{summary.paidInvoices}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-light border">
                      <div className="card-body py-2">
                        <h6 className="text-muted mb-1 small">Pending Invoices</h6>
                        <h4 className="mb-0">{summary.pendingInvoices}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-light border">
                      <div className="card-body py-2">
                        <h6 className="text-muted mb-1 small">Total Commissions</h6>
                        <h4 className="mb-0">{summary.totalCommissions}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-light border">
                      <div className="card-body py-2">
                        <h6 className="text-muted mb-1 small">Avg per Invoice</h6>
                        <h4 className="mb-0">${(summary.totalAmount / summary.totalInvoices).toFixed(2)}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              <div className="respon_data">
                <div className="table_section">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead className="thead-clr">
                        <tr>
                          <th onClick={() => monthlySorting("invoice_number")}>
                            Invoice Number {monthlyFilters?.key === "invoice_number" ? (monthlyFilters?.sorder === "asc" ? "↑" : "↓") : ""}
                          </th>
                          <th onClick={() => monthlySorting("month")}>
                            Month/Year {monthlyFilters?.key === "month" ? (monthlyFilters?.sorder === "asc" ? "↑" : "↓") : ""}
                          </th>
                          <th onClick={() => monthlySorting("total_amount")}>
                            Total Amount {monthlyFilters?.key === "total_amount" ? (monthlyFilters?.sorder === "asc" ? "↑" : "↓") : ""}
                          </th>
                          {/* <th>Commission Count</th>
                          <th>Affiliates</th> */}
                          <th onClick={() => monthlySorting("status")}>
                            Status {monthlyFilters?.key === "status" ? (monthlyFilters?.sorder === "asc" ? "↑" : "↓") : ""}
                          </th>
                          <th onClick={() => monthlySorting("createdAt")}>
                            Generated On {monthlyFilters?.key === "createdAt" ? (monthlyFilters?.sorder === "asc" ? "↑" : "↓") : ""}
                          </th>
                          <th>Invoices</th>
                          <th>Reports</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!monthlyLoading && monthlyData.map((invoice, i) => (
                          <tr className="data_row" key={i}>
                            <td className="name-person ml-2">
                              <strong 
                                onClick={() => viewInvoiceDetails(invoice)}
                                style={{ cursor: 'pointer', color: '#007bff' }}
                                title="Click to view details"
                              >
                                {invoice.invoice_number}
                              </strong>
                              <div className="small text-muted">
                                ID: {invoice.id.substring(0, 8)}...
                              </div>
                            </td>
                            <td className="name-person ml-2">
                              <div className="fw-medium">
                                {new Date(2000, invoice.month - 1).toLocaleString('default', { month: 'long' })}
                              </div>
                              <div className="small text-muted">
                                {invoice.year}
                              </div>
                            </td>
                            <td className="name-person ml-2">
                              <div className="fw-bold text-success">
                                ${(invoice.total_amount || 0).toFixed(2)}
                              </div>
                              <div className="small text-muted">
                                Commission: ${(invoice.total_commission || 0).toFixed(2)}
                              </div>
                            </td>
                            {/* <td className="name-person ml-2">
                              <div className="text-center">
                                <span className="badge bg-info">
                                  {invoice.commission_count || 0}
                                </span>
                              </div>
                              <div className="small text-muted text-center">
                                Transactions
                              </div>
                            </td> */}
                            {/* <td className="name-person ml-2">
                              <div className="small">
                                {invoice.details?.affiliates?.length || 0} Affiliate(s)
                              </div>
                              {invoice.details?.affiliates?.slice(0, 2).map((affiliate, idx) => (
                                <div key={idx} className="small text-truncate" style={{ maxWidth: '150px' }} title={affiliate.affiliate_name}>
                                  {affiliate.affiliate_name}
                                </div>
                              ))}
                              {invoice.details?.affiliates?.length > 2 && (
                                <div className="small text-muted">
                                  +{invoice.details.affiliates.length - 2} more
                                </div>
                              )}
                            </td> */}
                            <td className="name-person ml-2">
                              <span className={`badge bg-${invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'secondary'}`}>
                                {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1) || 'Generated'}
                              </span>
                              {invoice.paid_at && (
                                <div className="small text-muted">
                                  Paid: {datepipeModel.date(invoice.paid_at)}
                                </div>
                              )}
                            </td>
                            <td className="name-person ml-2">
                              {datepipeModel.date(invoice.createdAt)}
                              <div className="small text-muted">
                                {datepipeModel.time(invoice.createdAt)}
                              </div>
                            </td>
                            <td className="name-person ml-2">
                              <div className="invoice-actions" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <button
                                  onClick={() => downloadMonthlyInvoice(invoice)}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Download Invoice PDF"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  disabled={!invoice.invoice_url}
                                >
                                  <i className="fa fa-download me-1" aria-hidden="true"></i>
                                  Download
                                </button>
                                
                                <button
                                  onClick={() => viewMonthlyInvoice(invoice)}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="View Invoice"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  disabled={!invoice.invoice_url}
                                >
                                  <i className="fa fa-eye me-1" aria-hidden="true"></i>
                                  View
                                </button>
                                
                                {/* {invoice.status === 'pending' && (
                                  <button
                                    onClick={() => handlePayMonthlyInvoice(invoice)}
                                    className="btn btn-sm btn-success"
                                    title="Pay Invoice"
                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                  >
                                    <i className="fa fa-credit-card me-1" aria-hidden="true"></i>
                                    Pay Now
                                  </button>
                                )} */}
                              </div>
                            </td>

                            <td className="name-person ml-2">
                              <div className="invoice-actions" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <button
                                  onClick={() => downloadMonthlyReport(invoice)}
                                  className="btn btn-sm btn-outline-primary"
                                  title="Download Report PDF"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  disabled={!invoice.invoice_url}
                                >
                                  <i className="fa fa-download me-1" aria-hidden="true"></i>
                                  Download
                                </button>
                                
                                <button
                                  onClick={() => viewMonthlyReport(invoice)}
                                  className="btn btn-sm btn-outline-secondary"
                                  title="View Report"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  disabled={!invoice.invoice_url}
                                >
                                  <i className="fa fa-eye me-1" aria-hidden="true"></i>
                                  View
                                </button>
                                
                                {/* {invoice.status === 'pending' && (
                                  <button
                                    onClick={() => handlePayMonthlyInvoice(invoice)}
                                    className="btn btn-sm btn-success"
                                    title="Pay Invoice"
                                    style={{ padding: '4px 8px', fontSize: '12px' }}
                                  >
                                    <i className="fa fa-credit-card me-1" aria-hidden="true"></i>
                                    Pay Now
                                  </button>
                                )} */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {monthlyLoading && (
                      <div className="text-center py-4">
                        <img
                          src="/assets/img/loader.gif"
                          className="pageLoader"
                          alt="Loading..."
                        />
                      </div>
                    )}
                    {!monthlyLoading && monthlyData.length === 0 && (
                      <div className="mb-3 text-center py-4">
                        <i className="fa fa-file-text-o fa-3x text-muted mb-3" aria-hidden="true"></i>
                        <p className="text-muted">No monthly invoices found for the selected period.</p>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setMonthlyFilters({
                            ...monthlyFilters,
                            year: new Date().getFullYear(),
                            month: new Date().getMonth() + 1,
                            page: 0
                          })}
                        >
                          Show Current Month
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '650px',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      borderRadius: '8px',
      border: '1px solid #ddd',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '0',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    }
  };

  return (
    <>
      <Layout
        handleKeyPress={handleKeyPress}
        setFilter={setFilter}
        reset={reset}
        filter={filter}
        name="Payments"
        filters={filters}
      >
        <div className="container-fluid mb-4">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body p-2">
                  <ul className="nav nav-tabs" id="paymentsTab" role="tablist" style={{ borderBottom: 'none' }}>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => setActiveTab("all")}
                        type="button"
                        style={{ 
                          border: '1px solid #dee2e6',
                          borderBottom: activeTab === "all" ? 'none' : '1px solid #dee2e6',
                          borderRadius: '4px 4px 0 0',
                          marginRight: '5px'
                        }}
                      >
                        <i className="fa fa-list me-2" aria-hidden="true"></i>
                        All Transactions
                      </button>
                    </li>
                    {user?.role == "brand" && 
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "monthly" ? "active" : ""}`}
                        onClick={() => setActiveTab("monthly")}
                        type="button"
                        disabled={user?.role !== "brand"}
                        title={user?.role !== "brand" ? "Only available for brands" : ""}
                        style={{ 
                          border: '1px solid #dee2e6',
                          borderBottom: activeTab === "monthly" ? 'none' : '1px solid #dee2e6',
                          borderRadius: '4px 4px 0 0',
                          opacity: user?.role !== "brand" ? 0.5 : 1
                        }}
                      >
                        <i className="fa fa-file-text-o me-2" aria-hidden="true"></i>
                        Monthly Invoices
                      </button>
                    </li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content" id="paymentsTabContent">
          {activeTab === "all" && renderAllTransactionsTable()}
          {activeTab === "monthly" && renderMonthlyInvoicesTable()}
        </div>

        <div
          className={`paginationWrapper ${((activeTab === "all" && !loading && total > 10) || (activeTab === "monthly" && !monthlyLoading && monthlyTotal > 10)) ? "" : "d-none"}`}
        >
          <span>
            Show{" "}
            <select
              className="form-control"
              onChange={(e) => handleCountChange(parseInt(e.target.value))}
              value={activeTab === "all" ? filters.count : monthlyFilters.count}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={150}>150</option>
              <option value={200}>200</option>
            </select>{" "}
            from {activeTab === "all" ? total : monthlyTotal} {activeTab === "all" ? "Campaigns" : "Invoices"}
          </span>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            initialPage={activeTab === "all" ? filters?.page : monthlyFilters?.page}
            onPageChange={pageChange}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={Math.ceil((activeTab === "all" ? total : monthlyTotal) / (activeTab === "all" ? filters?.count : monthlyFilters?.count))}
            previousLabel="< Previous"
            renderOnZeroPageCount={null}
            pageClassName={"pagination-item"}
            activeClassName={"pagination-item-active"}
          />
        </div>
      </Layout>

      <Modal
        isOpen={isPaymentModalOpen}
        onRequestClose={handleClosePaymentModal}
        style={customModalStyles}
        contentLabel="Pay Commission Modal"
      >
        <div ref={modalRef}>
          <div className="modal-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
            <h5 className="modal-title" style={{ fontSize: '18px', fontWeight: '600' }}>
              <i className="fa fa-money me-2" aria-hidden="true"></i>
              Commission Payment Distribution
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClosePaymentModal}
              disabled={isProcessing}
            ></button>
          </div>

          <div className="modal-body" style={{ padding: '20px' }}>
            {pendingPaymentData ? (
              <>
                {(() => {
                  const distribution = calculateDistribution();
                  
                  return (
                    <>
                      <div className="mb-4 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0" style={{ color: '#6c757d' }}>
                            <i className="fa fa-file-text-o me-2" aria-hidden="true"></i>
                            Payment Summary
                          </h6>
                          <span className="badge bg-warning">
                            {pendingPaymentData.totalPendingTransactions} Transaction(s)
                          </span>
                        </div>

                        <div className="total-amount-display text-center my-3">
                          <div className="text-muted small">Total Amount to Pay</div>
                          <div className="display-4 fw-bold" style={{ color: '#28a745' }}>
                            ${distribution.totalAmount}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="mb-3" style={{ color: '#6c757d', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
                          <i className="fa fa-pie-chart me-2" aria-hidden="true"></i>
                          Amount Distribution
                        </h6>

                        <div className="row mb-4">
                          <div className="col-md-4 mb-3">
                            <div className="card border-danger h-100">
                              <div className="card-body text-center">
                                <div className="text-danger mb-2">
                                  <i className="fa fa-credit-card fa-2x" aria-hidden="true"></i>
                                </div>
                                <h6 className="card-title">Stripe Processing Fee</h6>
                                <div className="h4 text-danger fw-bold">${distribution.stripeFee}</div>
                                <div className="text-muted small">{distribution.percentageBreakdown.stripe} of total</div>
                                <div className="mt-2 small text-muted">(2.9% + $0.30 per transaction)</div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 mb-3">
                            <div className="card border-warning h-100">
                              <div className="card-body text-center">
                                <div className="text-warning mb-2">
                                  <i className="fa fa-building fa-2x" aria-hidden="true"></i>
                                </div>
                                <h6 className="card-title">Upfilly Platform Fee</h6>
                                <div className="h4 text-warning fw-bold">${distribution.upfillyFee}</div>
                                <div className="text-muted small">{distribution.percentageBreakdown.upfilly} of total</div>
                                <div className="mt-2 small text-muted">({comissionAmount}% platform fee)</div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 mb-3">
                            <div className="card border-success h-100">
                              <div className="card-body text-center">
                                <div className="text-success mb-2">
                                  <i className="fa fa-users fa-2x" aria-hidden="true"></i>
                                </div>
                                <h6 className="card-title">Affiliate Commission</h6>
                                <div className="h4 text-success fw-bold">${distribution.affiliateCommission}</div>
                                <div className="text-muted small">{distribution.percentageBreakdown.affiliate} of total</div>
                                <div className="mt-2 small text-muted">(Paid to affiliates)</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead className="thead-light">
                              <tr>
                                <th>Component</th>
                                <th>Amount</th>
                                <th>Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><strong>Total Gross Amount</strong></td>
                                <td><strong>${distribution.totalAmount}</strong></td>
                                <td><strong>100%</strong></td>
                              </tr>
                              <tr>
                                <td>Stripe Processing Fee</td>
                                <td className="text-danger">-${distribution.stripeFee}</td>
                                <td>{distribution.percentageBreakdown.stripe}</td>
                              </tr>
                              <tr>
                                <td>Upfilly Platform Fee</td>
                                <td className="text-warning">-${distribution.upfillyFee}</td>
                                <td>{distribution.percentageBreakdown.upfilly}</td>
                              </tr>
                              <tr className="table-success">
                                <td><strong>Net Affiliate Commission</strong></td>
                                <td><strong className="text-success">${distribution.affiliateCommission}</strong></td>
                                <td><strong>{distribution.percentageBreakdown.affiliate}</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="mb-3" style={{ color: '#6c757d' }}>
                          <i className="fa fa-bar-chart me-2" aria-hidden="true"></i>
                          Distribution Visualization
                        </h6>
                        <div className="distribution-bar mb-3">
                          <div className="d-flex" style={{ height: '30px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              className="bg-success"
                              style={{
                                width: `${parseFloat(distribution.percentageBreakdown.affiliate)}%`,
                                transition: 'width 0.5s ease'
                              }}
                              title={`Affiliate: ${distribution.percentageBreakdown.affiliate}`}
                            ></div>
                            <div
                              className="bg-warning"
                              style={{
                                width: `${parseFloat(distribution.percentageBreakdown.upfilly)}%`,
                                transition: 'width 0.5s ease'
                              }}
                              title={`Upfilly: ${distribution.percentageBreakdown.upfilly}`}
                            ></div>
                            <div
                              className="bg-danger"
                              style={{
                                width: `${parseFloat(distribution.percentageBreakdown.stripe)}%`,
                                transition: 'width 0.5s ease'
                              }}
                              title={`Stripe: ${distribution.percentageBreakdown.stripe}`}
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between mt-2 small text-muted">
                            <span>Affiliate Commission</span>
                            <span>Upfilly Fee</span>
                            <span>Stripe Fee</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-3">
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={handlePayCommission}
                          disabled={isProcessing}
                          style={{ padding: '12px 30px', fontSize: '1.1rem', minWidth: '200px' }}
                        >
                          {isProcessing ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-check-circle me-2" aria-hidden="true"></i>
                              Confirm Payment
                            </>
                          )}
                        </button>
                      </div>

                      <div className="alert alert-info">
                        <small>
                          <i className="fa fa-info-circle me-2" aria-hidden="true"></i>
                          <strong>Important:</strong> Total payment of ${distribution.totalAmount} will be processed.
                          Affiliates will receive ${distribution.affiliateCommission} after deducting all fees.
                        </small>
                      </div>
                    </>
                  );
                })()}
              </>
            ) : (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading payment distribution...</span>
                </div>
                <p className="mt-3 text-muted">Calculating payment distribution...</p>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '15px 20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClosePaymentModal}
              disabled={isProcessing}
            >
              Cancel
            </button>
            {pendingPaymentData && (
              <div className="ms-auto">
                <small className="text-muted">
                  Total: <strong>${calculateDistribution().totalAmount}</strong>
                </small>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
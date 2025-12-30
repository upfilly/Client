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

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function Affilate() {
  const history = useRouter();
  const user = crendentialModel.getUser();
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
  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoader] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [pendingPaymentData, setPendingPaymentData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const activePlans = planData?.filter((plan) => plan.isActive);
  const comissionAmount = activePlans?.[0]?.commission_override;

  // Payment modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);

  // Invoice download functions
  const downloadInvoice = (transaction) => {
    if (!transaction.invoice_url) {
      alert('No invoice available for this transaction');
      return;
    }

    // Direct download method
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

    // Direct download method
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

  // API-based download for CORS issues
  const downloadInvoiceViaAPI = async (transaction) => {
    if (!transaction.invoice_url) {
      alert('No invoice available');
      return;
    }

    try {
      // Show loading
      setLoader(true);

      // Use API endpoint to proxy the download
      const response = await ApiClient.get(`transaction/invoice/${transaction._id}`, {
        responseType: 'blob'
      });

      if (response) {
        // Create download link
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${transaction._id}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    } finally {
      setLoader(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const getPlanData = (p = {}) => {
    setLoader(true);

    if (user) {
      let filter = {
        page: 1,
        count: 50, userId: user?.id, category: "Network"
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
      getPlanData()
    } else if (user.role != "brand") {
      setFilter({ ...filters, page: 1, ...params });
      getData({ page: 1, paid_to: user?.id, ...params });
    }
  }, []);

  // Close modal when clicking outside
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

  const ChangeStatus = (e) => {
    setFilter({ ...filters, transaction_status: e });
    getData({ transaction_status: e, page: 1, user_id: user?.id });
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
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
    setSelectedOptions([]);
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

    const totalAmount = pendingPaymentData.totalPayableAmount;

    const stripePercentage = 0.029;
    const stripeFixedFee = pendingPaymentData.totalPendingTransactions * 0.30;
    const stripeFee = (totalAmount * stripePercentage) + stripeFixedFee;

    const upfillyPercentage = comissionAmount / 100;
    const upfillyFee = totalAmount * upfillyPercentage;

    const affiliateCommission = totalAmount - stripeFee - upfillyFee;

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

  const handlePayCommission = async () => {
    if (!pendingPaymentData || !pendingPaymentData.totalPayableAmount) {
      toast.error("No pending payments to process");
      return;
    }

    setIsProcessing(true);

    try {
      const distribution = calculateDistribution();

      const response = await ApiClient.post('pay/commission/to/admin', {
        transaction_ids: pendingPaymentData.transaction_ids,
        commission: parseFloat(pendingPaymentData.totalPayableAmount),
      });

      if (response?.success) {
        window.open(response.data.url, "_self")
        getData();
        setIsPaymentModalOpen(false);
        setPendingPaymentData(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Modal styles
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

  const distribution = calculateDistribution();

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
        <div className="nmain-list mb-3 main_box">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex flex-wrap gap-2 all_flexbx justify-content-md-end">
                  {/* Pay Commission Button - Show only for brand users */}
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
                        { id: "successful", name: "Successful" },
                        { id: "failed", name: "Failed" },
                      ]}
                    />
                  </div>

                  {filters?.search ||
                    filters.transaction_status ||
                    filters.transaction_type ? (
                    <a className="btn btn-primary" onClick={(e) => reset()}>
                      Reset
                    </a>
                  ) : (
                    <></>
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
                          <th
                            scope="row"
                            onClick={(e) => sorting("paid_to_name")}
                          >
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
                            Transaction Status{" "}
                            {filters?.sorder === "asc" ? "↑" : "↓"}
                          </th>
                          <th onClick={(e) => sorting("createdAt")}>
                            Creation Date{" "}
                            {filters?.sorder === "asc" ? "↑" : "↓"}
                          </th>
                          <th onClick={(e) => sorting("updatedAt")}>
                            Last Modified{" "}
                            {filters?.sorder === "asc" ? "↑" : "↓"}
                          </th>
                          {/* Invoice Column Header */}
                          <th>Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading &&
                          data?.data.map((itm, i) => {
                            return (
                              <tr className="data_row" key={i}>
                                <td
                                  className="name-person ml-2"
                                  onClick={(e) => view(itm._id)}
                                  style={{ cursor: 'pointer', color: '#007bff' }}
                                >
                                  {methodModel?.capitalizeFirstLetter(
                                    itm?.paid_to_name
                                  )}
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
                                {/* Invoice Actions Column */}
                                <td className="name-person ml-2">
                                  <div className="invoice-actions" style={{ display: 'flex', gap: '8px' }}>
                                    {itm.invoice_url ? (
                                      <>
                                        <button
                                          onClick={() => downloadInvoice(itm)}
                                          className="btn btn-sm btn-outline-primary"
                                          title="Download Invoice"
                                          style={{ padding: '4px 8px', fontSize: '12px' }}
                                        >
                                          <i className="fa fa-download me-1" aria-hidden="true"></i>
                                          Download
                                        </button>
                                        {/* <button
                                          onClick={() => viewInvoice(itm)}
                                          className="btn btn-sm btn-outline-secondary"
                                          title="View Invoice"
                                          style={{ padding: '4px 8px', fontSize: '12px' }}
                                        >
                                          <i className="fa fa-eye me-1" aria-hidden="true"></i>
                                          View
                                        </button> */}
                                      </>
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
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    {loading ? (
                      <div className="text-center py-4">
                        <img
                          src="/assets/img/loader.gif"
                          className="pageLoader"
                          alt="Loading..."
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    {!loading && total == 0 ? (
                      <div className="mb-3 text-center">No Data Found</div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`paginationWrapper ${!loading && total > 10 ? "" : "d-none"
            }`}
        >
          <span>
            Show{" "}
            <select
              className="form-control"
              onChange={(e) => handleCountChange(parseInt(e.target.value))}
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
      </Layout>

      {/* Payment Modal */}
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
                {/* Total Summary */}
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

                {/* Distribution Breakdown */}
                <div className="mb-4">
                  <h6 className="mb-3" style={{ color: '#6c757d', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
                    <i className="fa fa-pie-chart me-2" aria-hidden="true"></i>
                    Amount Distribution
                  </h6>

                  {/* Distribution Cards */}
                  <div className="row mb-4">
                    {/* Stripe Fee Card */}
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

                    {/* Upfilly Fee Card */}
                    <div className="col-md-4 mb-3">
                      <div className="card border-warning h-100">
                        <div className="card-body text-center">
                          <div className="text-warning mb-2">
                            <i className="fa fa-building fa-2x" aria-hidden="true"></i>
                          </div>
                          <h6 className="card-title">Upfilly Platform Fee</h6>
                          <div className="h4 text-warning fw-bold">${distribution.upfillyFee}</div>
                          <div className="text-muted small">{distribution.percentageBreakdown.upfilly} of total</div>
                          <div className="mt-2 small text-muted">(5% platform fee)</div>
                        </div>
                      </div>
                    </div>

                    {/* Affiliate Commission Card */}
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

                  {/* Detailed Breakdown Table */}
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

                {/* Visual Distribution Chart */}
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

                {/* Action Button */}
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
            ) : (
              // Loading state
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
            <div className="ms-auto">
              <small className="text-muted">
                Total: <strong>${distribution.totalAmount}</strong>
              </small>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
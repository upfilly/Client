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
import environment from "@/environment";
import axios from "axios";
import { toast } from "react-toastify";

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

// Update customModalStyles - remove overflow from modal content
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
    maxHeight: '85vh',
    overflow: 'hidden', // Changed from 'auto' to 'hidden'
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '0',
    zIndex: 9999,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9998,
  }
};

// Helper functions for tiered commission calculation
const calculateTieredCommission = (amount, tiers, calculationType = "per_tier") => {
  if (!tiers || tiers.length === 0) return 0;

  let totalCommission = 0;

  if (calculationType === "retrospective") {
    // Find the tier that applies to the full amount
    const applicableTier = [...tiers].reverse().find(tier =>
      (tier.min === null || amount >= tier.min) &&
      (tier.max === null || amount <= tier.max)
    );

    if (applicableTier) {
      if (applicableTier.type === "percentage") {
        totalCommission = (amount * applicableTier.rate) / 100;
      } else {
        totalCommission = applicableTier.rate;
      }
    }
  } else {
    // per_tier calculation
    let remainingAmount = amount;

    for (const tier of tiers) {
      const tierMin = tier.min || 0;
      const tierMax = tier.max || Infinity;

      if (remainingAmount <= 0) break;

      let tierAmount = 0;

      if (amount > tierMin) {
        if (tierMax === Infinity) {
          tierAmount = remainingAmount;
        } else if (amount > tierMax) {
          tierAmount = Math.min(remainingAmount, tierMax - tierMin);
        } else {
          tierAmount = remainingAmount;
        }

        if (tier.type === "percentage") {
          totalCommission += (tierAmount * tier.rate) / 100;
        } else {
          totalCommission += tier.rate;
        }

        remainingAmount -= tierAmount;
      }
    }
  }

  return totalCommission;
};

const calculateLeadTieredCommission = (leadCount, leadTiers, calculationType = "per_tier") => {
  if (!leadTiers || leadTiers.length === 0) return 0;

  let totalCommission = 0;

  if (calculationType === "retrospective") {
    const applicableTier = [...leadTiers].reverse().find(tier =>
      (tier.min === null || leadCount >= tier.min) &&
      (tier.max === null || leadCount <= tier.max)
    );

    if (applicableTier) {
      totalCommission = applicableTier.rate;
    }
  } else {
    // per_tier calculation
    let remainingLeads = leadCount;

    for (const tier of leadTiers) {
      const tierMin = tier.min || 0;
      const tierMax = tier.max || Infinity;

      if (remainingLeads <= 0) break;

      let tierLeads = 0;

      if (leadCount > tierMin) {
        if (tierMax === Infinity) {
          tierLeads = remainingLeads;
        } else if (leadCount > tierMax) {
          tierLeads = Math.min(remainingLeads, tierMax - tierMin);
        } else {
          tierLeads = remainingLeads;
        }

        totalCommission += tierLeads * tier.rate;
        remainingLeads -= tierLeads;
      }
    }
  }

  return totalCommission;
};

const getCommissionBreakdown = (transaction, campaignDetails) => {
  if (!campaignDetails) return null;

  const isTiered = campaignDetails.tiered_commission_enabled;
  const tierCalculationType = campaignDetails.tier_calculation_type || "per_tier";
  const eventType = campaignDetails.event_type || [];

  console.log(isTiered,"isTieredisTiered")

  let commissionAmount = 0;
  let commissionDetails = {
    type: isTiered ? "tiered" : "standard",
    calculationType: tierCalculationType,
    breakdown: [],
    totalCommission: 0
  };

  // Check if it's a purchase transaction
  const isPurchase = true

  // Check if it's a lead transaction
  const isLead = true

  if (isPurchase && eventType.includes("purchase")) {
    const purchaseAmount = transaction.affiliate_link_data?.price ||
      0;

    if (isTiered && campaignDetails.tiers && campaignDetails.tiers.length > 0) {
      commissionAmount = calculateTieredCommission(
        purchaseAmount,
        campaignDetails.tiers,
        tierCalculationType
      );

      commissionDetails.breakdown.push({
        type: "purchase",
        amount: purchaseAmount,
        commission: commissionAmount,
        tierUsed: true,
        calculationType: tierCalculationType,
        tiers: campaignDetails.tiers
      });
    } else {
      // Standard commission
      if (campaignDetails.commission_type === "percentage") {
        commissionAmount = (purchaseAmount * campaignDetails.commission) / 100;
      } else {
        commissionAmount = campaignDetails.commission;
      }

      commissionDetails.breakdown.push({
        type: "purchase",
        amount: purchaseAmount,
        commission: commissionAmount,
        tierUsed: false,
        rate: campaignDetails.commission,
        rateType: campaignDetails.commission_type
      });
    }
  }

  if (isLead && eventType.includes("lead")) {
    const leadCount = 1;
    let leadCommission = 0;

    if (isTiered && campaignDetails.lead_tiers && campaignDetails.lead_tiers.length > 0) {
      leadCommission = calculateLeadTieredCommission(
        leadCount,
        campaignDetails.lead_tiers,
        tierCalculationType
      );

      commissionDetails.breakdown.push({
        type: "lead",
        count: leadCount,
        commission: leadCommission,
        tierUsed: true,
        calculationType: tierCalculationType,
        tiers: campaignDetails.lead_tiers
      });
    } else {
      // Standard lead commission
      leadCommission = campaignDetails.lead_amount || 0;

      commissionDetails.breakdown.push({
        type: "lead",
        count: leadCount,
        commission: leadCommission,
        tierUsed: false,
        amount: campaignDetails.lead_amount
      });
    }

    commissionAmount += leadCommission;
  }

  commissionDetails.totalCommission = commissionAmount;

  return commissionDetails;
};

// Commission Details Modal Component - Fixed scrolling
const CommissionDetailsModal = ({ isOpen, onClose, transaction, campaignDetails }) => {
  if (!isOpen || !campaignDetails) return null;

  const commissionBreakdown = getCommissionBreakdown(transaction, campaignDetails);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Commission Details"
    >
      <div className="commission-details-modal" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="modal-header" style={{
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
          padding: '16px 20px',
          flexShrink: 0
        }}>
          <h5 className="modal-title" style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
            <i className="fa fa-calculator me-2" aria-hidden="true"></i>
            Commission Calculation Details
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <div className="modal-body" style={{
          padding: '20px',
          flex: 1,
          overflowY: 'auto',
          minHeight: 0
        }}>
          <div className="mb-4">
            <h6>Campaign: {campaignDetails.name}</h6>
            <p className="text-muted small">{campaignDetails.description?.replace(/<[^>]*>/g, '') || 'No description'}</p>
          </div>

          <div className="alert alert-info mb-3">
            <strong>
              {commissionBreakdown?.type === "tiered" ? "Tiered Commission" : "Standard Commission"}
            </strong>
            {commissionBreakdown?.type === "tiered" && (
              <span className="badge bg-info ms-2">
                {commissionBreakdown.calculationType === "per_tier" ? "Per Tier" : "Retrospective"}
              </span>
            )}
          </div>

          {commissionBreakdown?.breakdown.map((item, idx) => (
            <div key={idx} className="card mb-3" style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
              <div className="card-header bg-light" style={{ padding: '12px 16px', borderBottom: '1px solid #dee2e6' }}>
                <strong className="text-capitalize">{item.type}</strong> Commission
              </div>
              <div className="card-body" style={{ padding: '16px' }}>
                {item.type === "purchase" && (
                  <>
                    <div className="mb-2">
                      <strong>Purchase Amount:</strong> ${item.amount?.toFixed(2) || '0.00'}
                    </div>
                    {item.tierUsed ? (
                      <div className="mb-2">
                        <strong>Tier Structure:</strong>
                        <div className="table-responsive mt-2">
                          <table className="table table-sm table-bordered" style={{ fontSize: '14px', marginBottom: 0 }}>
                            <thead>
                              <tr>
                                <th>Min Range</th>
                                <th>Max Range</th>
                                <th>Rate</th>
                                <th>Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.tiers?.map((tier, tierIdx) => (
                                <tr key={tierIdx}>
                                  <td>${tier.min || 0}</td>
                                  <td>{tier.max ? `$${tier.max}` : "∞"}</td>
                                  <td>{tier.rate}%</td>
                                  <td>{tier.type || "percentage"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="text-muted small mt-2">
                          Calculation applied: {item.calculationType === "per_tier"
                            ? "Commission calculated per tier range"
                            : "Full amount qualifies for highest tier rate"}
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <strong>Commission Rate:</strong> {item.rate}% ({item.rateType})
                      </div>
                    )}
                  </>
                )}

                {item.type === "lead" && (
                  <>
                    <div className="mb-2">
                      <strong>Lead Count:</strong> {item.count}
                    </div>
                    {item.tierUsed ? (
                      <div className="mb-2">
                        <strong>Lead Tier Structure:</strong>
                        <div className="table-responsive mt-2">
                          <table className="table table-sm table-bordered" style={{ fontSize: '14px', marginBottom: 0 }}>
                            <thead>
                              <tr>
                                <th>Min Leads</th>
                                <th>Max Leads</th>
                                <th>Rate ($)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.tiers?.map((tier, tierIdx) => (
                                <tr key={tierIdx}>
                                  <td>{tier.min || 0}</td>
                                  <td>{tier.max || "∞"}</td>
                                  <td>${tier.rate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-2">
                        <strong>Lead Amount:</strong> ${item.amount || '0.00'}
                      </div>
                    )}
                  </>
                )}

                <div className="mt-3 pt-2 border-top">
                  <strong className="text-success">
                    Calculated Commission: ${item.commission?.toFixed(2) || '0.00'}
                  </strong>
                </div>
              </div>
            </div>
          ))}

          <div className="alert alert-success">
            <h6 className="mb-0">
              <i className="fa fa-money me-2" aria-hidden="true"></i>
              Total Commission: ${commissionBreakdown?.totalCommission?.toFixed(2) || '0.00'}
            </h6>
          </div>

          <div className="alert alert-warning mt-3">
            <small>
              <i className="fa fa-info-circle me-2" aria-hidden="true"></i>
              <strong>Note:</strong> Final commission amount may be subject to platform fees and adjustments based on return/refund policies.
            </small>
          </div>
        </div>

        <div className="modal-footer" style={{
          borderTop: '1px solid #dee2e6',
          padding: '15px 20px',
          flexShrink: 0
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

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
  const [hasPendingPayments, setHasPendingPayments] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const activePlans = planData?.filter((plan) => plan.isActive);
  const comissionAmount = activePlans?.[0]?.commission_override || 5;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);

  // State for commission details modal
  const [selectedCommissionTransaction, setSelectedCommissionTransaction] = useState(null);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

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

  const downloadMonthlyInvoice = async (invoice) => {
    try {
      const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
      const response = await axios.get(invoiceUrl, { responseType: 'blob' });

      const filename = invoice.invoice_url.split('/').pop() ||
        `monthly_invoice_${invoice.month}_${invoice.year}_${invoice.id}.pdf`;

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;

      link.download = filename;

      link.style.display = 'none';
      document.body.appendChild(link);

      if (navigator.userAgent.includes('Mac') || /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(event);
      } else {
        link.click();
      }

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error("Error downloading invoice:", error);

      try {
        if (navigator.userAgent.includes('Mac') ||
          navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
          window.open(invoiceUrl, '_blank');
        } else {
          throw error;
        }
      } catch (fallbackError) {
        alert('Failed to download invoice. Please try again.');
      }
    }
  };

  const downloadMonthlyAffiliateInvoice = async (invoice) => {
    try {
      const invoiceUrl = `${environment.api}${invoice.custom_invoice_url}`;
      const response = await axios.get(invoiceUrl, { responseType: 'blob' });

      const filename = invoice.custom_invoice_url.split('/').pop() ||
        `monthly_invoice_${invoice.month}_${invoice.year}_${invoice.id}.pdf`;

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;

      link.download = filename;

      link.style.display = 'none';
      document.body.appendChild(link);

      if (navigator.userAgent.includes('Mac') || /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        link.dispatchEvent(event);
      } else {
        link.click();
      }

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error("Error downloading invoice:", error);

      try {
        if (navigator.userAgent.includes('Mac') ||
          navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          const invoiceUrl = `${environment.api}${invoice.invoice_url}`;
          window.open(invoiceUrl, '_blank');
        } else {
          throw error;
        }
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

      const response = await axios.get(invoiceUrl, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const filename = invoice.report_url.split('/').pop() ||
        `monthly_invoice_${invoice.month}_${invoice.year}_${invoice.id}.pdf`;

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        setTimeout(() => {
          const safariWindow = window.open(url, '_blank');
          if (!safariWindow) {
            alert('Please allow pop-ups to download the file');
          }
        }, 500);
      }

    } catch (error) {
      console.error("Error downloading invoice:", error);

      try {
        const invoiceUrl = `${environment.api}${invoice.report_url}`;

        const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);

        if (isMac) {
          const newWindow = window.open(invoiceUrl, '_blank');
          if (!newWindow) {
            alert('Please allow pop-ups to download the invoice. ' +
              'If the file doesn\'t open automatically, right-click the link and select "Download".');
          }
        } else {
          window.open(invoiceUrl, '_blank');
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        alert('Failed to download invoice. Please try again or contact support.');
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
        brand_id: user?.id || user?._id,
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
        const hasPayments = res?.data?.totalPayableAmount > 0 &&
          res?.data?.totalPendingTransactions > 0;
        setHasPendingPayments(hasPayments);
      } else {
        setPendingPaymentData(null);
        setHasPendingPayments(false);
      }
    }).catch(error => {
      console.error("Error fetching pending payments:", error);
      setPendingPaymentData(null);
      setHasPendingPayments(false);
    });
  };

  useEffect(() => {
    if (user.role == "brand") {
      setFilter({ ...filters, page: 1, ...params });
      getData({ page: 1, user_id: user?.id, ...params });
      getPlanData();
      getPendingPaymentData();
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
    if (activeTab === "all" && user?.role === "brand") {
      getPendingPaymentData();
    }
  }, [activeTab]);

  // Improved click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isProcessing) {
        handleClosePaymentModal();
      }
    };

    if (isPaymentModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isPaymentModalOpen, isProcessing]);

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

  // Function to view commission details
  const viewCommissionDetails = (transaction) => {
    console.log(transaction,"transactiontransaction")
    if (transaction.campaign_details) {
      setSelectedCommissionTransaction(transaction);
      setIsCommissionModalOpen(true);
    } else {
      toast.error("No campaign details available for commission calculation");
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
        setTimeout(() => {
          getPendingPaymentData();
        }, 2000);
        setIsPaymentModalOpen(false);
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
              {user?.role === "brand" && hasPendingPayments && (
                <button
                  className="btn btn-primary"
                  onClick={handleOpenPaymentModal}
                >
                  <i className="fa fa-money me-2" aria-hidden="true"></i>
                  Pay Commission
                </button>
              )}

              {user?.role === "brand" && !hasPendingPayments && !loading && (
                <div className="text-muted small d-flex align-items-center">
                  <i className="fa fa-check-circle text-success me-2" aria-hidden="true"></i>
                  No pending commissions to pay
                </div>
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
                      {user?.role == "affiliate" && <th scope="row">
                        Brand Name
                      </th>}
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
                      <th>
                        Currency
                      </th>
                      <th>
                        Payment Status
                      </th>
                      <th onClick={(e) => sorting("createdAt")}>
                        Creation Date {filters?.sorder === "asc" ? "↑" : "↓"}
                      </th>
                      {user?.role === "affiliate" && <th>
                        Action
                      </th>}
                      {user?.role === "brand" && (
                        <th scope="row">
                          Commission Info
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && data?.data?.map((itm, i) => (
                      <tr className="data_row" key={i}>
                        {user?.role == "affiliate" && <td
                          className="name-person ml-2"
                          onClick={(e) => view(itm._id)}
                          style={{ cursor: 'pointer', color: '#007bff' }}
                        >
                          {methodModel?.capitalizeFirstLetter(itm?.brand_details?.userName || itm?.brand_details?.fullName)}
                        </td>}
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
                          {itm?.affiliate_link_data?.currency || "USD"}
                        </td>
                        <td className="name-person ml-2">
                          <span className={`badge bg-${(itm?.transaction_status === 'successful' || itm?.transaction_status === 'paid') ? 'success' : 'danger'}`}>
                            {(itm?.transaction_status === 'successful' || itm?.transaction_status === 'paid') ? "Successful" : itm?.transaction_status}
                          </span>
                        </td>
                        <td className="name-person ml-2">
                          {datepipeModel.date(itm?.createdAt)}
                        </td>
                        {user?.role === "affiliate" && <td className="name-person ml-2">
                          <div className="invoice-actions" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <button
                              onClick={() => downloadMonthlyAffiliateInvoice(itm)}
                              className="btn btn-sm btn-outline-primary"
                              title="Download Report PDF"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              <i className="fa fa-download me-1" aria-hidden="true"></i>
                              Download
                            </button>
                          </div>
                        </td>}
                        {user?.role === "brand" && (
                          <td className="name-person ml-2">
                            <button
                              onClick={() => viewCommissionDetails(itm)}
                              className="btn btn-sm btn-info"
                              title="View Commission Calculation Details"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                              <i className="fa fa-calculator me-1" aria-hidden="true"></i>
                              Calculate
                            </button>
                          </td>
                         )}
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
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
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

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onRequestClose={handleClosePaymentModal}
        style={customModalStyles}
        contentLabel="Pay Commission Modal"
        portalClassName="payment-modal-portal"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        overlayClassName="payment-modal-overlay"
      >
        <div ref={modalRef} className="payment-modal-content">
          <div className="modal-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6', padding: '16px 20px' }}>
            <h5 className="modal-title" style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
              <i className="fa fa-money me-2" aria-hidden="true"></i>
              Commission Payment Distribution
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClosePaymentModal}
              disabled={isProcessing}
              aria-label="Close"
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
            >
              ×
            </button>
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

      {/* Commission Details Modal */}
      <CommissionDetailsModal
        isOpen={isCommissionModalOpen}
        onClose={() => {
          setIsCommissionModalOpen(false);
          setSelectedCommissionTransaction(null);
        }}
        transaction={selectedCommissionTransaction}
        campaignDetails={selectedCommissionTransaction?.campaign_details}
      />
    </>
  );
}
'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout/index';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import datepipeModel from '@/models/datepipemodel';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import { toast } from 'react-toastify';
import { LuCircleCheckBig, LuX } from "react-icons/lu";

export default function Pricing() {
  const user = crendentialModel.getUser()
  const history = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [FAQdata, setFAQData] = useState([])
  const [filters, setFilter] = useState({
    page: 1,
    count: 50,
    search: '',
    isDeleted: false,
    status: ''
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any>(false)
  const param = useSearchParams()
  const id = param.get("id")
  const [offers, setOffers] = useState<any>([])
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Feature comparison data
  const featureComparison = [
    { feature: "Basket Value Charge", key: "basket_value_charge", unit: "%" },
    { feature: "Commission Override", key: "commission_override", unit: "%" },
    { feature: "Bonus Override", key: "bonus_override", unit: "%" },
    { feature: "Allowed Total Revenue", key: "allowed_total_revenue", unit: "$" },
    { feature: "Real-time Tracking", key: "real_time_tracking", isBoolean: true },
    { feature: "Affiliate Recruitment Tools", key: "affiliate_recruitment", isBoolean: true },
    { feature: "Advanced Analytics", key: "advanced_analytics", isBoolean: true },
    { feature: "Automated Payouts", key: "automated_payouts", isBoolean: true },
    { feature: "API Access", key: "api_access", isBoolean: true },
    { feature: "Priority Support", key: "priority_support", isBoolean: true },
    { feature: "Custom Branding", key: "custom_branding", isBoolean: true },
    { feature: "Dedicated Account Manager", key: "dedicated_manager", isBoolean: true },
  ];

  const getContentData = (p = {}) => {
    let url = 'content'
    ApiClient.get(url, { title: "Pricing" }).then(res => {
      if (res) {
        getFaq(res?.data?.id)
      }
    })
  }

  const getFaq = (id: any) => {
    let url = 'faq/all'
    ApiClient.get(url, { content_id: id }).then(res => {
      if (res.success) {
        const data = res?.data?.data;
        setFAQData(data)
      }
    })
  }

  const getOfferData = (p = {}) => {
    setLoader(true)
    let filter = { category: "Managed Services" }
    let url = 'subscription-plan/all'
    ApiClient.get(url, filter).then(res => {
      if (res) {
        setOffers(res?.data?.data)
        setLoader(false)
      }
    })
  }

  useEffect(() => {
    getOfferData()
    getContentData()
  }, [])

  const handleAutologin = () => {
    loader(true)
    ApiClient.post('user/auto-login', { "id": id }).then(res => {
      if (res.success == true) {
        crendentialModel?.setUser(res?.data)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('addedUser', JSON.stringify(res?.data?.addedBy))
        window.location.reload();
      }
      loader(false)
    })
  };

  useEffect(() => {
    if (id && !user) {
      handleAutologin()
    }
  }, [id])

  if (user?.role == "affiliate") {
    history.push('/')
  }

  const getData = (p = {}) => {
    setLoader(true)
    if (!user) {
      let filter = { ...filters, ...p, category: "Network" }
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setData(res?.data?.data)
          setTotal(res?.data?.total_count)
        }
        setLoader(false)
      })
    }

    if (user) {
      let filter = { ...filters, ...p, userId: user?.id, category: "Network" }
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setData(res?.data?.data)
          setTotal(res?.data?.total_count)
        }
        setLoader(false)
      })
    }
  }

  const filteredPlans = data?.filter((item: any) => {
    if (!selectedPlan) {
      return item?.interval_count === 1;
    } else {
      return item?.interval_count === 12;
    }
  });

  const sortedData = filteredPlans?.sort((a: any, b: any) => {
    return a.amount - b.amount;
  });

  const ChangePlan = (dat: any) => {
    const data1 = {
      "network_plan_amount": dat?.amount,
      "managed_services_plan_amount": 0,
      "interval": "month",
      "interval_count": dat?.interval_count,
      "isSpecial": false,
      "planId": dat?.id || dat?._id,
      "promoId": "",
      "special_plan_id": null
    }
    ApiClient.post('subscribe', data1).then(res => {
      if (res.success == true) {
        loader(false)
        if (dat?.amount == 0) {
          toast.success(res?.message)
          getData()
        } else {
          window.location.href = res?.data?.url
        }
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  // Helper function to get plan features for comparison
  const getPlanFeatureValue = (plan: any, featureKey: string, isBoolean: boolean = false, unit: string = '') => {
    if (isBoolean) {
      // For boolean features, check if plan has this feature
      return plan.features?.some((f: any) =>
        f.feature_name?.toLowerCase().includes(featureKey.toLowerCase())
      ) || false;
    }
    // For numeric values
    return plan[featureKey] !== undefined ? `${plan[featureKey]}${unit}` : '—';
  };

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="pricing-page">
        {/* Hero Section */}
        <section className="pricing-hero">
          <div className="container">
            <h1>Simple, <span className="gradient-text">Transparent</span> Pricing</h1>
            <p className="hero-subtitle">Choose the plan that fits your business needs. No hidden fees, no surprises.</p>

            {/* Plan Toggle */}
            <div className="plan-toggle">
              <span className={!selectedPlan ? 'active-toggle' : ''}>Monthly</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={selectedPlan}
                  onChange={() => setSelectedPlan(!selectedPlan)}
                />
                <span className="slider round"></span>
              </label>
              <span className={selectedPlan ? 'active-toggle' : ''}>Annually</span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <div className="container">
          {!user?.isPayment && user && (
            <div className="note-section">
              <h5 className="no-plan">Note: You don't have any active plan</h5>
            </div>
          )}

          <div className="pricing-grid">
            {sortedData?.map((itm: any) => {
              const activePlans: any = data.filter((plan: any) => plan.isActive);
              const upcomingDate = new Date(itm?.upcoming_date)
              const currentDate = new Date()
              const showCard = (upcomingDate >= currentDate);

              const calculateDiscountedAmount = (amount: any, discountDetails: any) => {
                if (!discountDetails || !discountDetails.discount_type) return amount;
                if (discountDetails.discount_type === 'flat') return amount - discountDetails.amount_value;
                if (discountDetails.discount_type === 'percentage') {
                  const percentageValue = (amount * discountDetails.amount_value) / 100;
                  return amount - percentageValue;
                }
                return amount;
              }

              const discountedAmount = calculateDiscountedAmount(itm.amount, itm.discount_details);
              const isPopular = itm.recommended === "Y" && !user?.isPayment;
              const isUpcoming = itm?.isUpcoming && showCard;

              return (
                <div className={`pricing-card ${isPopular ? 'popular' : ''}`} key={itm._id}>
                  {isPopular && <div className="popular-badge">MOST POPULAR</div>}
                  {isUpcoming && <div className="upcoming-badge">Upcoming {datepipeModel.date(itm?.upcoming_date)}</div>}

                  <div className="plan-header">
                    <h3 className="plan-name">{methodModel.capitalizeFirstLetter(itm.name)}</h3>
                    <div className="plan-price">
                      {itm?.discount_details && <span className="original-price">${itm?.amount}</span>}
                      <span className="currency">$</span>
                      <span className="amount">{discountedAmount}</span>
                    </div>
                    <p className="plan-description">
                      {itm.payment_type === "recurring"
                        ? `for ${itm.billing_frequency} month${itm.billing_frequency > 1 ? 's' : ''}`
                        : `for ${itm.trial_period_days} days trial`
                      }
                    </p>
                  </div>

                  <div className="plan-details">
                    <div className="detail-item">
                      <strong>Basket Value Charge:</strong>
                      <p>{itm.basket_value_charge}%</p>
                    </div>
                    {/* <div className="detail-item">
                      <strong>Commission Override:</strong>
                      <p>{itm.commission_override}%</p>
                    </div> */}
                    <div className="detail-item">
                      <strong>Bonus Override:</strong>
                      <p>{itm.bonus_override}%</p>
                    </div>
                    <div className="detail-item">
                      <strong>Allowed Total Revenue(monthly):</strong>
                      <p>${itm.allowed_total_revenue}</p>
                    </div>
                  </div>

                  <div className="plan-cta">
                    {(!showCard && !itm.isUpcoming && !user && !user?.isPayment) && (
                      <a className="btn-outline" onClick={() => history.push(`/bookingform?planId=${itm._id}`)}>
                        Book a Demo
                      </a>
                    )}
                    {(!showCard && !itm.isUpcoming && !user?.isPayment && user) && (
                      <a className="btn-primary" onClick={() => ChangePlan(itm)}>
                        Buy Plan
                      </a>
                    )}
                    {(!showCard && !itm.isUpcoming && user && !itm.isActive && user?.isPayment) && (
                      <a className="btn-primary" onClick={() => ChangePlan(itm)}>
                        {parseInt(itm.amount) <= parseInt(activePlans[0]?.amount) ? "Buy" : "Upgrade"}
                      </a>
                    )}
                    {(!showCard && !itm.isUpcoming && user && itm.isActive) && (
                      <span className="btn-active">Active Plan</span>
                    )}
                    {(showCard && itm.isUpcoming && !user && !user?.isPayment) && (
                      <a className="btn-outline" onClick={() => history.push(`/bookingform?planId=${itm._id}`)}>
                        Book a Demo
                      </a>
                    )}
                    {(showCard && itm.isUpcoming && user && !user?.isPayment) && (
                      <a className="btn-primary" onClick={() => ChangePlan(itm)}>
                        Buy Plan
                      </a>
                    )}
                    {(showCard && itm.isUpcoming && user && !itm.isActive && user?.isPayment) && (
                      <a className="btn-primary" onClick={() => ChangePlan(itm)}>
                        {parseInt(itm.amount) <= parseInt(activePlans[0]?.amount) ? "Buy" : "Upgrade"}
                      </a>
                    )}
                    {(showCard && itm.isUpcoming && user && itm.isActive) && (
                      <span className="btn-active">Active Plan</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="feature-table-section">
          <div className="container">
            <div className="section-header">
              <h2>Compare <span className="gradient-text">Features</span></h2>
              <p>See what each plan includes and choose the one that's right for you</p>
            </div>

            <div className="feature-table-wrapper">
              <table className="feature-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    {sortedData?.map((plan: any, idx: number) => (
                      <th key={idx}>
                        {methodModel.capitalizeFirstLetter(plan.name)}
                        {plan.recommended === "Y" && <span className="table-badge ml-2">Popular</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Pricing Row */}
                  <tr>
                    <td className="feature-name">Starting Price</td>
                    {sortedData?.map((plan: any, idx: number) => {
                      const discounted = plan.discount_details
                        ? (plan.discount_details.discount_type === 'percentage'
                          ? plan.amount - (plan.amount * plan.discount_details.amount_value / 100)
                          : plan.amount - plan.discount_details.amount_value)
                        : plan.amount;
                      return (
                        <td key={idx}>
                          <strong>${discounted}</strong>
                          {plan.discount_details && <span className="table-badge ml-2">-{plan.discount_details.amount_value}%</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Basket Value Charge */}
                  <tr>
                    <td className="feature-name">Basket Value Charge</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>{plan.basket_value_charge}%</td>
                    ))}
                  </tr>

                  {/* Commission Override */}
                  <tr>
                    <td className="feature-name">Commission Override</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>{plan.commission_override}%</td>
                    ))}
                  </tr>

                  {/* Bonus Override */}
                  <tr>
                    <td className="feature-name">Bonus Override</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>{plan.bonus_override}%</td>
                    ))}
                  </tr>

                  {/* Allowed Total Revenue */}
                  <tr>
                    <td className="feature-name">Allowed Total Revenue</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>${plan.allowed_total_revenue}</td>
                    ))}
                  </tr>

                  {/* Real-time Tracking */}
                  <tr>
                    <td className="feature-name">Real-time Tracking</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        <LuCircleCheckBig className="check-icon" size={18} />
                      </td>
                    ))}
                  </tr>

                  {/* Affiliate Recruitment */}
                  <tr>
                    <td className="feature-name">Affiliate Recruitment Tools</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        {plan.name?.toLowerCase().includes('pro') || plan.name?.toLowerCase().includes('enterprise')
                          ? <LuCircleCheckBig className="check-icon" size={18} />
                          : <LuX className="close-icon" size={18} />
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Advanced Analytics */}
                  <tr>
                    <td className="feature-name">Advanced Analytics</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        {plan.name?.toLowerCase().includes('pro') || plan.name?.toLowerCase().includes('enterprise')
                          ? <LuCircleCheckBig className="check-icon" size={18} />
                          : <LuX className="close-icon" size={18} />
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Automated Payouts */}
                  <tr>
                    <td className="feature-name">Automated Payouts</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        <LuCircleCheckBig className="check-icon" size={18} />
                      </td>
                    ))}
                  </tr>

                  {/* API Access */}
                  <tr>
                    <td className="feature-name">API Access</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        {plan.name?.toLowerCase().includes('enterprise')
                          ? <LuCircleCheckBig className="check-icon" size={18} />
                          : <LuX className="close-icon" size={18} />
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Priority Support */}
                  <tr>
                    <td className="feature-name">Priority Support</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        {plan.name?.toLowerCase().includes('pro') || plan.name?.toLowerCase().includes('enterprise')
                          ? <LuCircleCheckBig className="check-icon" size={18} />
                          : <LuX className="close-icon" size={18} />
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Custom Branding */}
                  <tr>
                    <td className="feature-name">Custom Branding</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        {plan.name?.toLowerCase().includes('enterprise')
                          ? <LuCircleCheckBig className="check-icon" size={18} />
                          : <LuX className="close-icon" size={18} />
                        }
                      </td>
                    ))}
                  </tr>

                  {/* Dedicated Account Manager */}
                  <tr>
                    <td className="feature-name">Dedicated Account Manager</td>
                    {sortedData?.map((plan: any, idx: number) => (
                      <td key={idx}>
                        {plan.name?.toLowerCase().includes('enterprise')
                          ? <LuCircleCheckBig className="check-icon" size={18} />
                          : <LuX className="close-icon" size={18} />
                        }
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {FAQdata && FAQdata.length > 0 && (
          <section className="faq-section">
            <div className="container">
              <div className="section-header">
                <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
                <p>Everything you need to know about our pricing plans</p>
              </div>
              <div className="faq-grid">
                {FAQdata.slice(0, 4).map((faq: any, index: number) => (
                  <div key={faq._id || index} className="faq-card">
                    <h4>{faq.question}</h4>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Scale Your Business?</h2>
              <p>Join thousands of merchants already growing with Upfilly</p>
              <button className="btn-white" onClick={() => history.push('/bookingform')}>
                Start Your Free Trial
              </button>
              <p className="cta-note">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </section>

        {/* Popup Modal */}
        {showPopup && (
          <div className="modal-overlay">
            <div className="modal-content-custom">
              <img src="../../../assets/img/logo.png" alt="Logo" />
              <h5>Alert</h5>
              <p className="modal-text">Please purchase a plan first to continue...</p>
              <button className="btn-primary" onClick={() => setShowPopup(false)}>Ok</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
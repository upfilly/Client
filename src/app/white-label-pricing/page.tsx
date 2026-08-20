'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout/index';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { useRouter, useSearchParams } from 'next/navigation';
import datepipeModel from '@/models/datepipemodel';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import { toast } from 'react-toastify';
import { LuCircleCheckBig, LuX, LuSparkles, LuShield, LuPalette, LuGlobe, LuHeadphones, LuChartColumnIncreasing, LuZap, LuLayers } from "react-icons/lu";

export default function WhiteLabelPricing() {
  const user = crendentialModel.getUser()
  const history = useRouter()
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
  const [activeWlType, setActiveWlType] = useState('merchant')
  const param = useSearchParams()
  const id = param.get("id")
  const [showPopup, setShowPopup] = useState(false)

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

  useEffect(() => {
    getData()
    getContentData()
  }, [])

  const handleAutologin = () => {
    loader(true)
    ApiClient.post('user/auto-login', { "id": id }).then(res => {
      if (res.success == true) {
        crendentialModel?.setUser(res?.data)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('addedUser', JSON.stringify(res?.data?.addedBy))
        if (res?.data?.role === 'white_lable' || res?.data?.role === 'white_label') {
          history.push('/white-label-onboarding')
        } else {
          window.location.reload();
        }
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
    let filter = { ...filters, ...p, category: "white_label", status: "active" }
    if (user) {
      filter = { ...filter, userId: user?.id } as any
    }
    let url = 'subscription-plan/all'
    ApiClient.get(url, filter).then(res => {
      if (res) {
        setData(res?.data?.data || [])
        setTotal(res?.data?.total_count || 0)
      }
      setLoader(false)
    })
  }

  const filteredPlans = data?.filter((item: any) => {
    const isCorrectWlType = item?.whitelabelType === activeWlType;
    if (!selectedPlan) {
      return item?.interval_count === 1 && isCorrectWlType;
    } else {
      return item?.interval_count === 12 && isCorrectWlType;
    }
  });

  const sortedData = filteredPlans?.sort((a: any, b: any) => {
    return a.amount - b.amount;
  });

  const ChangePlan = (dat: any) => {
    const data1 = {
      "network_plan_amount": 0,
      "managed_services_plan_amount": 0,
      "white_label_plan_amount": dat?.amount,
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

  // Tier configurations for card styling
  const getTierConfig = (index: number, total: number) => {
    const configs = [
      { tier: 'starter', icon: <LuZap size={28} />, label: 'Starter' },
      { tier: 'growth', icon: <LuChartColumnIncreasing size={28} />, label: 'Growth' },
      { tier: 'professional', icon: <LuSparkles size={28} />, label: 'Professional' },
      { tier: 'enterprise', icon: <LuLayers size={28} />, label: 'Enterprise' },
    ];
    return configs[index % configs.length];
  };

  const whitelabelFeatures = [
    { icon: <LuPalette size={24} />, title: "Custom Branding", desc: "Your logo, colors, and domain — fully branded as yours" },
    { icon: <LuGlobe size={24} />, title: "Custom Domain", desc: "Launch on your own domain with SSL included" },
    { icon: <LuShield size={24} />, title: "White-Glove Onboarding", desc: "Dedicated setup assistance to get you live fast" },
    { icon: <LuHeadphones size={24} />, title: "Priority Support", desc: "Direct access to our team with guaranteed response times" },
  ];

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="wl-pricing-page">
        {/* Hero Section */}
        <section className="wl-hero">
          <div className="wl-hero-bg-orbs">
            <div className="wl-orb wl-orb-1"></div>
            <div className="wl-orb wl-orb-2"></div>
            <div className="wl-orb wl-orb-3"></div>
          </div>
          <div className="wl-container">
            <div className="wl-hero-badge">
              <LuSparkles size={14} />
              <span>White Label Solution</span>
            </div>
            <h1>Launch <span className="wl-gradient-text">Your Own Brand</span></h1>
            <p className="wl-hero-subtitle">
              Build and scale your affiliate platform under your own brand.
              Full customization, zero development required.
            </p>

            {/* Whitelabel Type Segmented Control */}
            <div className="wl-segmented-control mb-4">
              <button
                className={`wl-segment ${activeWlType === 'merchant' ? 'active' : ''}`}
                onClick={() => setActiveWlType('merchant')}
              >
                Merchant Plans
              </button>
              <button
                className={`wl-segment ${activeWlType === 'network' ? 'active' : ''}`}
                onClick={() => setActiveWlType('network')}
              >
                Network Plans
              </button>
            </div>

            {/* Plan Toggle */}
            <div className="wl-plan-toggle">
              <span className={!selectedPlan ? 'wl-toggle-active' : ''}>Monthly</span>
              <label className="wl-switch">
                <input
                  type="checkbox"
                  checked={selectedPlan}
                  onChange={() => setSelectedPlan(!selectedPlan)}
                />
                <span className="wl-slider"></span>
              </label>
              <span className={selectedPlan ? 'wl-toggle-active' : ''}>
                Annually
                <span className="wl-save-badge">Save 20%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="wl-cards-section">
          <div className="wl-container">
            {!user?.isPayment && user && (
              <div className="wl-note-banner">
                <LuShield size={18} />
                <span>You don't have any active white label plan</span>
              </div>
            )}

            {loaging ? (
              <div className="wl-loading">
                <img src="/assets/img/loader.gif" className="pageLoader" alt="Loading" />
              </div>
            ) : sortedData?.length === 0 ? (
              <div className="wl-empty-state">
                <LuLayers size={48} />
                <h3>No Plans Available</h3>
                <p>White label plans are coming soon. Contact us for early access.</p>
                <a className="wl-btn-primary" onClick={() => history.push('/bookingform')}>
                  Contact Sales
                </a>
              </div>
            ) : (
              <div className="wl-pricing-grid">
                {sortedData?.map((itm: any, index: number) => {
                  const activePlans: any = data.filter((plan: any) => plan.isActive);
                  const upcomingDate = new Date(itm?.upcoming_date)
                  const currentDate = new Date()
                  const showCard = (upcomingDate >= currentDate);
                  const tierConfig = getTierConfig(index, sortedData.length);

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
                    <div className={`wl-pricing-card wl-tier-${tierConfig.tier} ${isPopular ? 'wl-popular' : ''}`} key={itm._id}>
                      {isPopular && <div className="wl-popular-badge"><LuSparkles size={12} /> RECOMMENDED</div>}
                      {isUpcoming && <div className="wl-upcoming-badge">Upcoming {datepipeModel.date(itm?.upcoming_date)}</div>}

                      <div className="wl-card-header">
                        <div className="wl-tier-icon">{tierConfig.icon}</div>
                        <h3 className="wl-plan-name">{methodModel.capitalizeFirstLetter(itm.name)}</h3>
                        <div className="wl-plan-price">
                          {itm?.discount_details && <span className="wl-original-price">${itm?.amount}</span>}
                          <div className="wl-price-main">
                            <span className="wl-currency">$</span>
                            <span className="wl-amount">{discountedAmount}</span>
                          </div>
                          <span className="wl-period">
                            / {itm?.interval_count === 1 ? 'month' : 'year'}
                          </span>
                        </div>
                      </div>

                      <div className="wl-card-body">
                        {/* Feature list from plan */}
                        {itm.features && itm.features.length > 0 && (
                          <div className="wl-feature-list">
                            <h4>Included Features</h4>
                            {itm.features.map((feat: any, fi: number) => (
                              <div className="wl-feature-item" key={fi}>
                                <LuCircleCheckBig size={16} className="wl-check" />
                                <span>{feat.feature_name || feat.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="wl-card-footer">
                        {(!showCard && !itm.isUpcoming && !user && !user?.isPayment) && (
                          <div className="wl-btn-group">
                            <a className="wl-btn-outline" onClick={() => history.push(`/bookingform?planId=${itm._id}&category=white_label&role=white_lable&whitelabelType=${itm.whitelabelType || activeWlType || 'merchant'}`)}>
                              Book a Demo
                            </a>
                          </div>
                        )}
                        {/* {(!showCard && !itm.isUpcoming && !user?.isPayment && user) && (
                          <a className="wl-btn-primary" onClick={() => history.push(`/white-label-onboarding?planId=${itm._id}`)}>
                            Get Started
                          </a>
                        )} */}
                        {(!showCard && !itm.isUpcoming && user && !itm.isActive && user?.isPayment) && (
                          <a className="wl-btn-primary" onClick={() => ChangePlan(itm)}>
                            {parseInt(itm.amount) <= parseInt(activePlans[0]?.amount) ? "Switch Plan" : "Upgrade"}
                          </a>
                        )}
                        {(!showCard && !itm.isUpcoming && user && itm.isActive) && (
                          <span className="wl-btn-active">Current Plan</span>
                        )}
                        {(showCard && itm.isUpcoming && !user && !user?.isPayment) && (
                          <div className="wl-btn-group">
                            <a className="wl-btn-outline" onClick={() => history.push(`/bookingform?planId=${itm._id}&category=white_label&role=${itm.whitelabelType || activeWlType || 'merchant'}&whitelabelType=${itm.whitelabelType || activeWlType || 'merchant'}`)}>
                              Book a Demo
                            </a>
                          </div>
                        )}
                        {(showCard && itm.isUpcoming && user && !user?.isPayment) && (
                          <a className="wl-btn-primary" onClick={() => history.push(`/white-label-onboarding?planId=${itm._id}`)}>
                            Get Started
                          </a>
                        )}
                        {(showCard && itm.isUpcoming && user && !itm.isActive && user?.isPayment) && (
                          <a className="wl-btn-primary" onClick={() => ChangePlan(itm)}>
                            {parseInt(itm.amount) <= parseInt(activePlans[0]?.amount) ? "Switch Plan" : "Upgrade"}
                          </a>
                        )}
                        {(showCard && itm.isUpcoming && user && itm.isActive) && (
                          <span className="wl-btn-active">Current Plan</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Why White Label Section */}
        <section className="wl-features-section">
          <div className="wl-container">
            <div className="wl-section-header">
              <h2>Why Choose <span className="wl-gradient-text">White Label</span>?</h2>
              <p>Everything you need to launch your own branded affiliate platform</p>
            </div>
            <div className="wl-features-grid">
              {whitelabelFeatures.map((feature, i) => (
                <div className="wl-feature-card" key={i}>
                  <div className="wl-feature-icon">{feature.icon}</div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        {sortedData && sortedData.length > 0 && (
          <section className="wl-comparison-section">
            <div className="wl-container">
              <div className="wl-section-header">
                <h2>Compare <span className="wl-gradient-text">Plans</span></h2>
                <p>See what each white label plan includes</p>
              </div>

              <div className="wl-table-wrapper">
                <table className="wl-table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      {sortedData?.map((plan: any, idx: number) => (
                        <th key={idx}>
                          {methodModel.capitalizeFirstLetter(plan.name)}
                          {plan.recommended === "Y" && <span className="wl-table-badge">Popular</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="wl-feature-name">Starting Price</td>
                      {sortedData?.map((plan: any, idx: number) => {
                        const discounted = plan.discount_details
                          ? (plan.discount_details.discount_type === 'percentage'
                            ? plan.amount - (plan.amount * plan.discount_details.amount_value / 100)
                            : plan.amount - plan.discount_details.amount_value)
                          : plan.amount;
                        return (
                          <td key={idx}>
                            <strong>${discounted}</strong>
                            {plan.discount_details && <span className="wl-table-badge ml-2">-{plan.discount_details.amount_value}%</span>}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="wl-feature-name">Custom Branding</td>
                      {sortedData?.map((plan: any, idx: number) => (
                        <td key={idx}>
                          <LuCircleCheckBig className="wl-check-icon" size={18} />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="wl-feature-name">Custom Domain</td>
                      {sortedData?.map((plan: any, idx: number) => (
                        <td key={idx}>
                          <LuCircleCheckBig className="wl-check-icon" size={18} />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="wl-feature-name">White-Glove Onboarding</td>
                      {sortedData?.map((plan: any, idx: number) => (
                        <td key={idx}>
                          {idx >= Math.floor(sortedData.length / 2)
                            ? <LuCircleCheckBig className="wl-check-icon" size={18} />
                            : <LuX className="wl-cross-icon" size={18} />
                          }
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="wl-feature-name">Priority Support</td>
                      {sortedData?.map((plan: any, idx: number) => (
                        <td key={idx}>
                          {idx >= Math.floor(sortedData.length / 2)
                            ? <LuCircleCheckBig className="wl-check-icon" size={18} />
                            : <LuX className="wl-cross-icon" size={18} />
                          }
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="wl-feature-name">API Access</td>
                      {sortedData?.map((plan: any, idx: number) => (
                        <td key={idx}>
                          {idx === sortedData.length - 1
                            ? <LuCircleCheckBig className="wl-check-icon" size={18} />
                            : <LuX className="wl-cross-icon" size={18} />
                          }
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="wl-feature-name">Dedicated Account Manager</td>
                      {sortedData?.map((plan: any, idx: number) => (
                        <td key={idx}>
                          {idx === sortedData.length - 1
                            ? <LuCircleCheckBig className="wl-check-icon" size={18} />
                            : <LuX className="wl-cross-icon" size={18} />
                          }
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {FAQdata && FAQdata.length > 0 && (
          <section className="wl-faq-section">
            <div className="wl-container">
              <div className="wl-section-header">
                <h2>Frequently Asked <span className="wl-gradient-text">Questions</span></h2>
                <p>Everything you need to know about white label pricing</p>
              </div>
              <div className="wl-faq-grid">
                {FAQdata.slice(0, 6).map((faq: any, index: number) => (
                  <div key={faq._id || index} className="wl-faq-card">
                    <h4>{faq.question}</h4>
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="wl-cta-section">
          <div className="wl-container">
            <div className="wl-cta-card">
              <div className="wl-cta-content">
                <h2>Ready to Build Your Brand?</h2>
                <p>Launch your own affiliate platform with zero development. Get started in minutes.</p>
                <div className="wl-cta-buttons">
                  <button className="wl-btn-white" onClick={() => history.push('/bookingform')}>
                    Book a Demo
                  </button>
                  <button className="wl-btn-ghost" onClick={() => history.push('/contact')}>
                    Talk to Sales
                  </button>
                </div>
                <p className="wl-cta-note">No credit card required • Free consultation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popup Modal */}
        {showPopup && (
          <div className="wl-modal-overlay">
            <div className="wl-modal-content">
              <img src="../../../assets/img/logo.png" alt="Logo" />
              <h5>Alert</h5>
              <p className="wl-modal-text">Please purchase a plan first to continue...</p>
              <button className="wl-btn-primary" onClick={() => setShowPopup(false)}>Ok</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

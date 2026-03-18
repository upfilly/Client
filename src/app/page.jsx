"use client";

import { useEffect, useState } from "react";
import crendentialModel from "@/models/credential.model";
import "./style.scss";
import Layout from "./components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import CookiesPopup from "./cookiesModel";

export default function Home() {
  const user = crendentialModel.getUser();
  const history = useRouter();
  const [FAQdata, setFAQData] = useState([]);
  const [contentData, setContentData] = useState(null);
  const [IP, setIP] = useState("");
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const param = useSearchParams();
  const id = param.get("affiliate_id");
  const brandId = param.get("brand_id");
  const data = param.get("url");
  const url = decodeURIComponent(data);
  const [payload, setPayload] = useState({
    isSet: false,
  });
  const [queryParams, setQueryParams] = useState({});
  const [selectedRole, setSelectedRole] = useState('merchant'); // 'merchant' or 'affiliate'

  const testimonials = [
    {
      name: "John Doe",
      location: "New York, USA",
      feedback:
        "I am really impressed with the quality of service. The product exceeded my expectations. Highly recommend!",
      image: "/assets/img/person.jpg",
    },
    {
      name: "Jane Smith",
      location: "London, UK",
      feedback:
        "The experience was great! I received prompt support and the product is fantastic. Definitely would buy again.",
      image: "/assets/img/person.jpg",
    },
    {
      name: "Michael Brown",
      location: "Sydney, Australia",
      feedback:
        "Amazing customer service! My issues were resolved quickly, and the product works perfectly. Couldn't ask for more.",
      image: "/assets/img/person.jpg",
    },
  ];

  useEffect(() => {
    const subIds = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of subIds.entries()) {
      params[key] = value;
    }
    setQueryParams(params);
  }, []);

  useEffect(() => {
    const dataInCookies = Cookies.get("Upfilly_affiliate");
    setPayload((prevPayload) => ({
      ...prevPayload,
      isSet: dataInCookies ? true : false,
    }));
  }, []);

  const getIpData = () => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((res) => {
        setIP(res.ip);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setCookieValue = () => {
    Cookies.set("Upfilly_affiliate", id);
  };

  useEffect(() => {
    if (id) {
      getIpData();
      setCookieValue();
    }
  }, []);

  useEffect(() => {
    const getDeviceInfo = () => {
      const { userAgent, platform, language, vendor } = navigator;
      setDeviceInfo({
        userAgent,
        platform,
        language,
        vendor,
        browser: {
          name: getBrowserName(),
          version: getBrowserVersion(),
        },
        deviceType: getDeviceType(),
      });
    };

    const getDeviceType = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        return "Mobile";
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        return "Tablet";
      } else {
        return "Desktop";
      }
    };

    const getBrowserName = () => {
      const userAgent = navigator.userAgent;
      const browsers = {
        Chrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
        Firefox: /Firefox/.test(userAgent),
        Safari: /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor),
        Edge: /Edge/.test(userAgent),
        IE: /Trident/.test(userAgent),
      };

      for (const browser in browsers) {
        if (browsers[browser]) return browser;
      }
      return "Unknown";
    };

    const getBrowserVersion = () => {
      const userAgent = navigator.userAgent;
      const versionRegex = {
        Chrome: /(?:Chrome|CriOS)\/([0-9.]+)/,
        Firefox: /Firefox\/([0-9.]+)/,
        Safari: /Version\/([0-9.]+)/,
        Edge: /Edge\/([0-9.]+)/,
        IE: /(?:MSIE |Trident\/.*; rv:)([0-9.]+)/,
      };

      for (const browser in versionRegex) {
        const match = userAgent.match(versionRegex[browser]);
        if (match) return match[1];
      }
      return "Unknown";
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error(error);
          }
        );
      }
    };

    getDeviceInfo();
    getLocation();
  }, []);

  useEffect(() => {
    if (id && IP) {
      const data1 = {
        affiliate_id: id,
        brand_id: brandId,
        affiliate_link: window?.location?.href,
        ip_address: IP,
        device: deviceInfo?.deviceType,
        browser: deviceInfo?.browser?.name,
        os: deviceInfo?.platform,
        lat: deviceInfo?.latitude,
        lng: deviceInfo?.longitude,
        isSet: payload?.isSet,
      };

      ApiClient.post("saved-cookies", data1).then((res) => {
        if (res.success) {
          if (url) {
            window.open(url, "_self");
          }
        }
      });
    }
  }, [IP]);

  const getContentData = (p = {}) => {
    let url = "content";
    ApiClient.get(url, { title: "Home" }).then((res) => {
      if (res) {
        setContentData(res?.data);
        getData(res?.data?.id);
      }
    });
  };

  const getData = (id) => {
    let url = "faq/all";
    ApiClient.get(url, { content_id: id }).then((res) => {
      if (res.success) {
        const data = res?.data?.data;
        setFAQData(data);
      }
    });
  };

  useEffect(() => {
    if (user) {
      getContentData();
    }
  }, []);

  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={undefined}
      filters={undefined}
    >
      <div className="home-page">
        {/* Hero Section */}
        <div className="container py-5">
          <div className="hero-section bg-gradient-primary rounded-4 p-5 text-white">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="display-4 fw-bold mb-4">
                  Grow faster with performance-based partnerships
                </h1>
                <p className="lead mb-4">
                  Upfilly is an affiliate network that connects merchants with high-quality
                  affiliates and gives both sides the tools to track, manage, and scale revenue
                  through performance marketing.
                </p>
                {(user?.role == "brand" || !user) && (
                  <div className="d-flex gap-3">
                    <a href="/signupoptions" className="btn btn-light btn-lg px-4">
                      Get Started
                    </a>
                    {/* <a href="/pricing" className="btn btn-outline-light btn-lg px-4">
                      Book a Demo
                    </a> */}
                  </div>
                )}
              </div>
              <div className="col-lg-6">
                <img
                  src="/assets/img/main.png"
                  alt="Upfilly Platform"
                  className="img-fluid hero-image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Why Upfilly Section */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Why Upfilly</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#19294d" strokeWidth="2">
                    <path d="M21 12V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="M12 22V12" />
                    <path d="M3.3 7L12 12l8.7-5" />
                  </svg>
                </div>
                <h4>Transparent tracking and attribution</h4>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#19294d" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" />
                    <path d="M7 2v20" />
                    <path d="M17 2v20" />
                    <path d="M2 12h20" />
                    <path d="M2 7h5" />
                    <path d="M2 17h5" />
                    <path d="M17 17h5" />
                    <path d="M17 7h5" />
                  </svg>
                </div>
                <h4>Easy program management for merchants</h4>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#19294d" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                    <path d="M12 18V6" />
                  </svg>
                </div>
                <h4>Reliable payouts for affiliates</h4>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="feature-card h-100 p-4 text-center">
                <div className="feature-icon mb-3">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#19294d" strokeWidth="2">
                    <path d="M21 12h-3M3 12h3M12 3v3M12 21v-3" />
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                </div>
                <h4>Real-time reporting for both sides</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Who is Upfilly For Section */}
        <div className="container py-5 bg-light rounded-4">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Who is Upfilly for</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="role-card p-4 h-100">
                <h3 className="text-primary mb-3">Merchants</h3>
                <p className="lead">Launch and scale an affiliate program without complex setup.</p>
                <a href="/bookingform" className="btn btn-outline-primary mt-3">Learn More →</a>
              </div>
            </div>
            <div className="col-md-6">
              <div className="role-card p-4 h-100">
                <h3 className="text-success mb-3">Affiliates</h3>
                <p className="lead">Promote trusted brands, track performance, and earn commissions.</p>
                <a href="/track/signup/affiliate" className="btn btn-outline-success mt-3">Learn More →</a>
              </div>
            </div>
          </div>
        </div>

        {/* How it works Section */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">How it works</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="step-card p-4">
                <div className="step-number mb-3">1</div>
                <h4>Merchants create affiliate programs</h4>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="step-card p-4">
                <div className="step-number mb-3">2</div>
                <h4>Affiliates apply and promote offers</h4>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="step-card p-4">
                <div className="step-number mb-3">3</div>
                <h4>Sales and leads are tracked automatically</h4>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="step-card p-4">
                <div className="step-number mb-3">4</div>
                <h4>Commissions are calculated and paid</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Choose Your Role Section */}
        <div className="container py-5">
          <div className="role-selector-section bg-gradient-secondary rounded-4 p-5 text-white">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold">How it works - Choose your role</h2>
              <p className="lead">Upfilly is built for two sides. Select the experience that fits you.</p>
            </div>

            <div className="role-toggle mb-4">
              <button
                className={`role-btn ${selectedRole === 'merchant' ? 'active' : ''}`}
                onClick={() => setSelectedRole('merchant')}
              >
                For Merchants
              </button>
              <button
                className={`role-btn ${selectedRole === 'affiliate' ? 'active' : ''}`}
                onClick={() => setSelectedRole('affiliate')}
              >
                For Affiliates
              </button>
            </div>

            <div className="role-content text-center">
              {selectedRole === 'merchant' ? (
                <div>
                  <h3 className="mb-3">Launch and manage affiliate programs</h3>
                  <a href="/bookingform" className="btn btn-light btn-lg px-4">Get Started as Merchant</a>
                </div>
              ) : (
                <div>
                  <h3 className="mb-3">Discover programs and earn commissions</h3>
                  <a href="/track/signup/affiliate" className="btn btn-light btn-lg px-4">Get Started as Affiliate</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Who this is for Section */}
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Who this is for</h2>
            <p className="lead">Upfilly is designed for:</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="target-audience-card p-5 text-center">
                <h3 className="mb-0">E-commerce brands</h3>
                <p className="lead mt-3">If you sell online, you can run an affiliate program with Upfilly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="container py-5 bg-light">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">What Our Users Say</h2>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="testimonial-card h-100 p-4">
                  <div className="quote-icon mb-3">"</div>
                  <p className="mb-4">{testimonial.feedback}</p>
                  <div className="d-flex align-items-center">
                    <img src={testimonial.image} alt={testimonial.name} className="testimonial-image rounded-circle me-3" />
                    <div>
                      <h5 className="mb-1">{testimonial.name}</h5>
                      <small className="text-muted">{testimonial.location}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        {FAQdata && FAQdata.length > 0 && (
          <div className="container py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold">Frequently Asked Questions</h2>
            </div>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="accordion" id="faqAccordion">
                  {FAQdata.slice(0, 4).map((faq, index) => (
                    <div key={faq._id} className="accordion-item mb-3">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq-${index}`}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={`faq-${index}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">
                          <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="container py-5">
          <div className="cta-section bg-primary text-white rounded-4 p-5 text-center">
            <h2 className="display-5 fw-bold mb-4">Ready to grow with performance-based partnerships?</h2>
            <p className="lead mb-4">Join Upfilly today and start scaling your revenue through affiliate marketing.</p>
            {(user?.role == "brand" || !user) && (
              <a href="/signupoptions" className="btn btn-light btn-lg px-5">
                Get Started Now
              </a>
            )}
          </div>
        </div>

        <CookiesPopup />
      </div>
    </Layout>
  );
}
'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout';
import { useRouter } from 'next/navigation';

export default function Resources() {
  const history = useRouter()

  const featuresData = [
    {
      icon: "🎯",
      title: "Affiliate Tracking",
      description: "Monitor clicks, sales, and commissions in real-time, ensuring transparency and precision."
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Get detailed insights into your affiliate performance with customizable reports."
    },
    {
      icon: "🤝",
      title: "Affiliate Recruitment",
      description: "Find and onboard the best affiliates to grow your program."
    },
    {
      icon: "💰",
      title: "Automated Payouts",
      description: "Calculate and pay commissions automatically, saving time and reducing errors."
    },
    {
      icon: "🎨",
      title: "Creative Management",
      description: "Upload and manage banners, links, and promotional materials."
    },
    {
      icon: "⚡",
      title: "Real-time Reporting",
      description: "Track performance metrics instantly with live dashboards."
    }
  ];

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="resources-page">
        
        {/* Hero Section */}
        <section className="resources-hero">
          <div className="container">
            <h1>Powerful Tools to Drive Your <span className="gradient-text">Affiliate Success</span></h1>
            <p className="hero-subtitle">UpFilly offers everything you need to track, analyze, and optimize your affiliate program—all in one place.</p>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="features-grid-section">
          <div className="container">
            <div className="section-header">
              <h2>Everything You Need to <span className="gradient-text">Succeed</span></h2>
              <p>Powerful tools designed to help you launch, manage, and scale your affiliate program</p>
            </div>
            <div className="features-grid">
              {featuresData.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="white" strokeWidth="1.5" />
                      <path d="M12 22V12" stroke="white" strokeWidth="1.5" />
                      <path d="M3.3 7L12 12l8.7-5" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="benefit-section">
          <div className="container">
            <div className="benefit-row">
              <div className="benefit-image">
                <img src="assets/img/f2.png" alt="Integration" />
              </div>
              <div className="benefit-content">
                <h2>Integrate Seamlessly with Your <span className="gradient-text">Existing Platforms</span></h2>
                <p className="lead-text">Connect your favorite tools and platforms with UpFilly's powerful integrations.</p>
                <ul className="feature-list">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span><strong>Shopify Integration</strong> - Easily connect your Shopify store for precise tracking and analytics.</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span><strong>WooCommerce Integration</strong> - Seamless connection with WordPress stores.</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span><strong>Custom API</strong> - Build custom integrations with our powerful REST API.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Scalability Section */}
        <section className="benefit-section" style={{ background: 'white' }}>
          <div className="container">
            <div className="benefit-row reverse">
              <div className="benefit-image">
                <img src="assets/img/f1.png" alt="Scalability" />
              </div>
              <div className="benefit-content">
                <h2>Built to <span className="gradient-text">Grow</span> with Your Business</h2>
                <p className="lead-text">UpFilly is designed to support businesses of all sizes—from startups launching their first affiliate program to enterprise-level brands managing complex networks.</p>
                <ul className="feature-list">
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Affordable entry plans with no setup fees for startups</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Robust tools to handle high-volume campaigns</span>
                  </li>
                  <li>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Enterprise-grade security and compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className="benefit-section" style={{ background: 'var(--gray-100)' }}>
          <div className="container">
            <div className="benefit-row">
              <div className="benefit-image">
                <img src="assets/img/f3.png" alt="Dashboard" />
              </div>
              <div className="benefit-content">
                <h2>An Intuitive Dashboard for <span className="gradient-text">Merchants and Affiliates</span></h2>
                <p className="lead-text">Our dashboard is designed to be simple yet powerful, providing all the tools you need to manage and optimize your program.</p>
                
                <div className="sub-feature">
                  <h5>For Merchants:</h5>
                  <p>Customizable branding options, program management tools, and detailed analytics</p>
                </div>
                
                <div className="sub-feature">
                  <h5>For Affiliates:</h5>
                  <p>A clean interface to track earnings, access campaign insights, and find new opportunities</p>
                </div>
                
                <div className="sub-feature">
                  <h5>For Both:</h5>
                  <p>Real-time notifications, secure messaging, and transparent reporting</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <h2>Explore UpFilly's Features Today</h2>
            <p>Discover how our platform can take your affiliate marketing to the next level.</p>
            <button className="cta-button" onClick={() => history.push("/signupoptions")}>
              Get Started Now
            </button>
          </div>
        </section>

        {/* Shopify Tracking Section */}
        <section className="shopify-section">
          <div className="container">
            <div className="shopify-card">
              <div className="shopify-content">
                <h3>About Our <span className="gradient-text">Shopify Tracking App</span></h3>
                <p className="description">Our Shopify tracking app helps you monitor customer interactions, optimize your marketing strategies, and boost your sales. With detailed analytics and easy integration, you can gain insights into user behavior and enhance your store's performance.</p>
                
                <div className="features-wrapper">
                  <h4>Key Features</h4>
                  <ul className="shopify-features">
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Real-time tracking of customer actions
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      In-depth analytics and reporting
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Seamless integration with Shopify
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Customizable tracking parameters
                    </li>
                    <li>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      User-friendly interface for easy management
                    </li>
                  </ul>
                </div>
                
                <div className="shopify-cta">
                  <a href="/shopifyguide" className="btn-outline">Learn More About Shopify App →</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
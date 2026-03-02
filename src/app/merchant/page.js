"use client"

import React from 'react';
import './style.scss';
import Layout from '../components/global/layout';
import { useRouter } from 'next/navigation';

const UpfillyMerchantGuide = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="merchant-guide">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <span className="badge">Merchant Guide</span>
            <h1>Launch Your Affiliate Program <span className="gradient-text">in Minutes</span></h1>
            <p className="hero-subtitle">Join 10,000+ merchants scaling their business with Upfilly's affiliate marketing platform</p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => router.push('/bookingform')}>
                Start Free Trial
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="btn-secondary1" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Merchants</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$50M+</span>
                <span className="stat-label">Commissions Paid</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-pattern"></div>
        </section>

        {/* Introduction */}
        <section className="intro-section">
          <div className="container">
            <div className="intro-card">
              <div className="quote-mark">"</div>
              <p className="intro-text">
                Looking for a cost-effective way to scale your sales? Welcome to affiliate marketing — and more importantly, welcome to Upfilly. No jargon. No technical headaches. Just growth.
              </p>
            </div>
          </div>
        </section>

        {/* What Merchants Get */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Everything You Need to <span className="gradient-text">Succeed</span></h2>
              <p>Powerful tools designed to help you launch, manage, and scale your affiliate program</p>
            </div>
            <div className="features-grid">
              {[
                { icon: "🎯", title: "Accurate Tracking", desc: "Precise attribution and real-time tracking" },
                { icon: "🤝", title: "Affiliate Recruitment", desc: "Find and approve the perfect partners" },
                { icon: "💰", title: "Flexible Commissions", desc: "Customize rates for any business model" },
                { icon: "🎨", title: "Creative Management", desc: "Upload banners, links, and promos" },
                { icon: "📊", title: "Advanced Analytics", desc: "Detailed reports and performance insights" },
                { icon: "⚡", title: "Automated Payouts", desc: "Calculate and pay commissions automatically" }
              ].map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <div className="section-header">
              <h2>How <span className="gradient-text">Upfilly</span> Works</h2>
              <p>Five simple steps to launch your affiliate program</p>
            </div>
            <div className="steps">
              {[
                { number: "01", title: "Create Program", desc: "Set up your affiliate program in minutes" },
                { number: "02", title: "Set Terms", desc: "Define commissions and program rules" },
                { number: "03", title: "Recruit Affiliates", desc: "Approve partners or let them find you" },
                { number: "04", title: "Track Performance", desc: "Monitor sales and affiliate activity" },
                { number: "05", title: "Pay Commissions", desc: "Automated payouts based on results" }
              ].map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                  {index < 4 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section className="prerequisites">
          <div className="container">
            <div className="prerequisites-grid">
              <div className="prerequisites-content">
                <span className="badge">Get Ready</span>
                <h2>What You'll Need <span className="gradient-text">Before Starting</span></h2>
                <p>Prepare these items to make your setup smooth and fast</p>
                <ul className="checklist">
                  {[
                    "Your website or product URL",
                    "Product or service details",
                    "Commission structure (CPA, CPS, etc.)",
                    "Marketing creatives (optional)",
                    "Preferred payout method"
                  ].map((item, index) => (
                    <li key={index}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="prerequisites-illustration">
                <div className="illustration-grid">
                  <div className="grid-item"></div>
                  <div className="grid-item"></div>
                  <div className="grid-item"></div>
                  <div className="grid-item"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Setup */}
        <section className="setup-guide">
          <div className="container">
            <div className="section-header">
              <h2>Step-by-Step <span className="gradient-text">Setup Guide</span></h2>
              <p>Follow these simple steps to get your affiliate program running</p>
            </div>
            <div className="setup-steps">
              {[
                {
                  step: "Step 1",
                  title: "Create Your Free Account",
                  desc: "Visit upfilly.com and click 'Start Free'. Takes less than 2 minutes.",
                  icon: "📝"
                },
                {
                  step: "Step 2",
                  title: "Add Your Store",
                  desc: "Connect Shopify, Amazon, or integrate manually with your checkout.",
                  icon: "🛍️"
                },
                {
                  step: "Step 3",
                  title: "Set Commission Rules",
                  desc: "Choose flat-rate, percentage, or tiered commissions. Add validation windows.",
                  icon: "⚙️"
                },
                {
                  step: "Step 4",
                  title: "Upload Creatives",
                  desc: "Add banners, product shots, and coupon codes for your affiliates.",
                  icon: "🎨"
                },
                {
                  step: "Step 5",
                  title: "Launch & Recruit",
                  desc: "Invite partners or get discovered through Upfilly's network.",
                  icon: "🚀"
                }
              ].map((item, index) => (
                <div key={index} className="setup-card">
                  <div className="setup-icon">{item.icon}</div>
                  <div className="setup-content">
                    <span className="setup-step">{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Post-Signup Checklist */}
        <section className="checklist-section">
          <div className="container">
            <div className="checklist-card">
              <h3>📋 After Signup Checklist</h3>
              <p>Complete these tasks to optimize your program</p>
              <div className="checklist-grid">
                {[
                  "Install tracking on your website",
                  "Create your first affiliate offer",
                  "Upload creatives and banners",
                  "Set program terms and rules",
                  "Review affiliate applications"
                ].map((item, index) => (
                  <div key={index} className="checklist-item">
                    <div className="checkbox">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <h2>Frequently Asked <span className="gradient-text">Questions</span></h2>
              <p>Everything you need to know about getting started</p>
            </div>
            <div className="faq-grid">
              {[
                {
                  q: "How are affiliates tracked?",
                  a: "Sales and actions are tracked automatically using Upfilly's advanced tracking technology with real-time attribution."
                },
                {
                  q: "Can I approve affiliates manually?",
                  a: "Yes, you have full control. Review and approve each affiliate before they can promote your program."
                },
                {
                  q: "When do I pay commissions?",
                  a: "Commissions are paid based on your monthly payout schedule. You can customize approval settings."
                },
                {
                  q: "Can I change commissions later?",
                  a: "Absolutely! Update commissions and terms anytime to optimize your program performance."
                }
              ].map((faq, index) => (
                <div key={index} className="faq-card">
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Scale Your Business?</h2>
              <p>Join thousands of merchants already growing with Upfilly</p>
              <button className="btn-primary btn-large" onClick={() => router.push('/bookingform')}>
                Start Your Free Trial
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16666 10H15.8333M15.8333 10L11.6667 5.83333M15.8333 10L11.6667 14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="cta-note">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UpfillyMerchantGuide;
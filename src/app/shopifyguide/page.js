"use client"

import React, { useState, useEffect } from 'react';
import Layout from '../components/global/layout';

const steps = [
    {
        number: '01',
        title: 'Install the App',
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
        ),
        description: 'Head to the Shopify App Store and search for the Upfilly affiliate tracking app. Hit "Add app" and follow the on-screen prompts to install it in your store — takes less than two minutes.',
        actions: [
            { label: 'Open Shopify App Store', href: 'https://apps.shopify.com' },
        ],
        tag: 'One-time setup',
    },
    {
        number: '02',
        title: 'Enter Your Advertiser ID',
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
        ),
        description: 'After installation, navigate to the Upfilly app inside your Shopify admin panel. Locate the Advertiser ID field and paste in your unique ID — you\'ll find this in your Upfilly dashboard under Account Settings.',
        actions: [],
        tag: 'Required',
        highlight: true,
    },
    {
        number: '03',
        title: 'Start Tracking',
        icon: (
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        description: 'Save your settings and you\'re live. Upfilly will immediately begin tracking affiliate-referred visits and conversions on your Shopify store. Check your dashboard within 24 hours to see your first data come in.',
        actions: [],
        tag: 'Go live',
    },
];

const ShopifyGuide = () => {
    const [activeStep, setActiveStep] = useState(null);
    const [visible, setVisible] = useState([]);

    useEffect(() => {
        steps.forEach((_, i) => {
            setTimeout(() => {
                setVisible(prev => [...prev, i]);
            }, i * 120);
        });
    }, []);

    return (
                <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className="sg-root">
            {/* Hero */}
            <header className="sg-hero">
                <div className="sg-hero-inner">
                    <div className="sg-badge">Shopify Integration</div>
                    <h1 className="sg-hero-title">Set Up Affiliate Tracking<br />in Three Steps</h1>
                    <p className="sg-hero-sub">Connect Upfilly to your Shopify store and start attributing every sale to the right affiliate — no code required.</p>
                    <div className="sg-hero-stats">
                        <div className="sg-stat">
                            <span className="sg-stat-num">~2 min</span>
                            <span className="sg-stat-label">Setup time</span>
                        </div>
                        <div className="sg-stat-divider" />
                        <div className="sg-stat">
                            <span className="sg-stat-num">0</span>
                            <span className="sg-stat-label">Lines of code</span>
                        </div>
                        <div className="sg-stat-divider" />
                        <div className="sg-stat">
                            <span className="sg-stat-num">Real-time</span>
                            <span className="sg-stat-label">Data tracking</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Steps */}
            <main className="sg-main">
                <div className="sg-steps">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`sg-step ${visible.includes(i) ? 'sg-step--visible' : ''} ${activeStep === i ? 'sg-step--active' : ''} ${step.highlight ? 'sg-step--highlight' : ''}`}
                            onClick={() => setActiveStep(activeStep === i ? null : i)}
                        >
                            <div className="sg-step-head">
                                <div className="sg-step-left">
                                    <div className="sg-step-icon-wrap">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <div className="sg-step-meta">
                                            <span className="sg-step-num">{step.number}</span>
                                            <span className={`sg-step-tag ${step.highlight ? 'sg-step-tag--accent' : ''}`}>{step.tag}</span>
                                        </div>
                                        <h2 className="sg-step-title">{step.title}</h2>
                                    </div>
                                </div>
                                <div className={`sg-chevron ${activeStep === i ? 'sg-chevron--open' : ''}`}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>

                            <div className={`sg-step-body ${activeStep === i ? 'sg-step-body--open' : ''}`}>
                                <div className="sg-step-body-inner">
                                    <p className="sg-step-desc">{step.description}</p>
                                    {/* Placeholder for screenshot */}
                                    <div className="sg-img-placeholder">
                                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" opacity="0.3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        <span>Screenshot coming soon</span>
                                    </div>
                                    {step.actions.length > 0 && (
                                        <div className="sg-step-actions">
                                            {step.actions.map((a, j) => (
                                                <a key={j} href={a.href} className="sg-btn" target="_blank" rel="noopener noreferrer">
                                                    {a.label}
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help callout */}
                <div className="sg-callout">
                    <div className="sg-callout-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <p className="sg-callout-title">Need your Advertiser ID?</p>
                        <p className="sg-callout-text">Log into your Upfilly account, go to <strong>Account → Settings → Integration</strong>, and copy the ID from the Advertiser ID field.</p>
                    </div>
                </div>
            </main>

            <style>{`
        .sg-root {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          background: #f7f8fa;
          min-height: 100vh;
          color: #111;
        }

        /* Hero */
        .sg-hero {
          background: #fff;
          border-bottom: 1px solid #e8eaed;
          padding: 56px 24px 48px;
        }
        .sg-hero-inner {
          max-width: 680px;
          margin: 0 auto;
        }
        .sg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #5b3ef5;
          background: #ece9fd;
          border-radius: 20px;
          padding: 4px 12px;
          margin-bottom: 20px;
        }
        .sg-hero-title {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: #0d0d0d;
          margin: 0 0 16px;
        }
        .sg-hero-sub {
          font-size: 17px;
          line-height: 1.65;
          color: #5a5f6b;
          margin: 0 0 36px;
          max-width: 520px;
        }
        .sg-hero-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .sg-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sg-stat-num {
          font-size: 20px;
          font-weight: 700;
          color: #0d0d0d;
          letter-spacing: -0.01em;
        }
        .sg-stat-label {
          font-size: 12px;
          color: #9098a3;
          font-weight: 500;
        }
        .sg-stat-divider {
          width: 1px;
          height: 32px;
          background: #e2e5ea;
        }

        /* Main */
        .sg-main {
          max-width: 680px;
          margin: 0 auto;
          padding: 40px 24px 64px;
        }
        .sg-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        /* Step card */
        .sg-step {
          background: #fff;
          border: 1px solid #e2e5ea;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, opacity 0.3s, transform 0.3s;
          opacity: 0;
          transform: translateY(10px);
        }
        .sg-step--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .sg-step:hover {
          border-color: #c8ccdb;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .sg-step--active {
          border-color: #7c5cf5;
          box-shadow: 0 0 0 3px rgba(124,92,245,0.1);
        }
        .sg-step--highlight {
          border-color: #b8aff0;
        }
        .sg-step--highlight.sg-step--active {
          border-color: #7c5cf5;
        }

        .sg-step-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 22px;
          gap: 16px;
        }
        .sg-step-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }
        .sg-step-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #f0eefe;
          color: #6640e8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .sg-step--highlight .sg-step-icon-wrap {
          background: #6640e8;
          color: #fff;
        }
        .sg-step-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .sg-step-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #9098a3;
        }
        .sg-step-tag {
          font-size: 11px;
          font-weight: 600;
          color: #5a5f6b;
          background: #f0f1f3;
          border-radius: 20px;
          padding: 2px 8px;
        }
        .sg-step-tag--accent {
          color: #5b3ef5;
          background: #ece9fd;
        }
        .sg-step-title {
          font-size: 16px;
          font-weight: 600;
          color: #0d0d0d;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .sg-chevron {
          color: #9098a3;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .sg-chevron--open {
          transform: rotate(180deg);
          color: #7c5cf5;
        }

        /* Step body */
        .sg-step-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .sg-step-body--open {
          max-height: 600px;
        }
        .sg-step-body-inner {
          padding: 0 22px 22px;
          border-top: 1px solid #f0f1f3;
          padding-top: 18px;
        }
        .sg-step-desc {
          font-size: 15px;
          line-height: 1.7;
          color: #4b5059;
          margin: 0 0 18px;
        }

        /* Image placeholder */
        .sg-img-placeholder {
          width: 100%;
          height: 160px;
          background: #f7f8fa;
          border: 1px dashed #d0d4de;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #9098a3;
          font-size: 13px;
          margin-bottom: 18px;
        }

        .sg-step-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sg-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #5b3ef5;
          background: #f0eefe;
          border-radius: 8px;
          padding: 8px 16px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .sg-btn:hover {
          background: #e2ddfb;
        }

        /* Callout */
        .sg-callout {
          background: #fff8ed;
          border: 1px solid #fde8ba;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .sg-callout-icon {
          color: #d97b0a;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .sg-callout-title {
          font-size: 14px;
          font-weight: 600;
          color: #7a4800;
          margin: 0 0 4px;
        }
        .sg-callout-text {
          font-size: 13.5px;
          line-height: 1.6;
          color: #8a6200;
          margin: 0;
        }
        .sg-callout-text strong {
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 540px) {
          .sg-hero { padding: 36px 16px 32px; }
          .sg-main { padding: 28px 16px 48px; }
          .sg-step-head { padding: 16px; }
          .sg-step-body-inner { padding: 0 16px 18px; padding-top: 16px; }
          .sg-hero-stats { gap: 16px; }
        }
      `}</style>
        </div>
        </Layout>
    );
};

export default ShopifyGuide;
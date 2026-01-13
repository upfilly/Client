"use client"

import React from 'react';
import './style.scss';
import Layout from '../components/global/layout';
import { useRouter } from 'next/navigation';

const UpfillyMerchantGuide = () => {
  const history = useRouter()

  return (
    <Layout>
    <div className="guide-container">
      <header className="guide-header">
        <h1>Getting Started with Upfilly as a Merchant</h1>
        <p className="subtitle">Launch Your Affiliate Program in Minutes</p>
      </header>

      <section className="intro">
        <p>
          Looking for a cost-effective way to scale your sales? Welcome to affiliate marketing — and more importantly, welcome to Upfilly. In this guide, you’ll learn exactly how to start your affiliate program using Upfilly, step-by-step. No jargon. No technical headaches. Just growth.
        </p>
      </section>

      <section className="section">
        <h2>What Is Upfilly?</h2>
        <ul>
          <li>Create and manage your affiliate program</li>
          <li>Track affiliate sales and conversions</li>
          <li>Automate commissions and payouts</li>
          <li>Attract the right affiliates for your brand</li>
        </ul>
        <p>
          Whether you’re selling through Shopify, Amazon, or your own eCommerce store, Upfilly gives you full control and visibility — from day one.
        </p>
      </section>

      <section className="section">
        <h2>Why Start an Affiliate Program?</h2>
        <ul>
          <li>Pay-per-sale model – no wasted ad budgets</li>
          <li>Leverage other people’s audiences</li>
          <li>Track everything in real time</li>
          <li>Scale fast without hiring a marketing team</li>
        </ul>
        <p>
          With the right platform, affiliate marketing becomes one of the most scalable and low-risk strategies for growth.
        </p>
      </section>

      <section className="section">
        <h2>Step-by-Step: Setting Up as a Merchant on Upfilly</h2>
        <ol>
          <li>
            <strong>Step 1: Create Your Free Account</strong><br />
            Go to upfilly.com and click Start Free. It takes less than 2 minutes to set up.
          </li>
          <li>
            <strong>Step 2: Add Your Store</strong><br />
            Connect your Shopify store, Amazon products, or manually integrate your checkout — depending on where you sell.
          </li>
          <li>
            <strong>Step 3: Set Commission Rules</strong><br />
            Choose flat-rate, % per order, or tiered commissions. Add validation windows to prevent fraud.
          </li>
          <li>
            <strong>Step 4: Upload Banners and Creatives</strong><br />
            Add banners, product shots, and coupon codes for affiliates.
          </li>
          <li>
            <strong>Step 5: Invite Affiliates or Let Them Find You</strong><br />
            Invite partners or be discovered through Upfilly’s network. Ask about our Managed Program option.
          </li>
        </ol>
      </section>

      <section className="section">
        <h2>What You Can Track with Upfilly</h2>
        <ul>
          <li>Clicks and conversion rate</li>
          <li>Affiliate performance</li>
          <li>Top-selling campaigns</li>
          <li>Commission totals</li>
          <li>ROI per campaign</li>
        </ul>
      </section>

      <section className="section">
        <h2>Best Practices for New Merchants</h2>
        <ul>
          <li>Offer a competitive commission</li>
          <li>Pay affiliates on time — Upfilly automates this for you</li>
          <li>Communicate regularly with affiliates</li>
          <li>Vet affiliates before approving them</li>
        </ul>
      </section>

      <footer className="footer">
        <h3>Final Thoughts</h3>
        <p>
          Launching an affiliate program can sound complicated — but with Upfilly, it’s easy. You don’t need a developer. You don’t need to chase affiliates. You just need a product and a willingness to grow.
        </p>
        <button className="cta-button" onClick={() => history.push('/bookingform')}>Start Free Today</button>
      </footer>
    </div>
    </Layout>
  );
};

export default UpfillyMerchantGuide;

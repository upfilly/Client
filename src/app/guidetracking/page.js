"use client"

import React from 'react';
import './style.scss';
import Layout from '../components/global/layout';
import { useRouter } from 'next/navigation';

const UpfillyAffiliateTracking = () => {
  const history = useRouter()

  return (
    <Layout>
      <div className="affiliate-guide-container">
        <header className="affiliate-header">
          <h1>What Is Affiliate Marketing and How Does It Work?</h1>
          <div className="header-underline"></div>
        </header>

        <section className="intro-section">
          <p>
            Affiliate marketing is a simple but powerful way to grow a business — and earn money by promoting the products you love. Whether you're a brand looking to scale or a content creator wanting to monetize your audience, affiliate marketing connects the two sides in a win-win partnership.
          </p>
          <p className="highlight-text">Let's break it down.</p>
        </section>

        <section className="content-section">
          <h2>The Basics</h2>
          <p>
            At its core, affiliate marketing is a <strong>performance-based marketing model</strong>. Here's how it works:
          </p>
          <ol className="steps-list">
            <li><strong>A merchant (brand)</strong> sets up an affiliate program — offering a commission for every sale that comes from a partner's referral.</li>
            <li><strong>An affiliate (creator, blogger, influencer)</strong> joins the program and gets a special tracking link.</li>
            <li>The affiliate promotes the product through content, ads, or social media.</li>
            <li>When someone clicks that link and makes a purchase, <strong>the affiliate gets paid</strong>.</li>
          </ol>
          <p className="highlight-text">It's like word-of-mouth marketing — but smarter, scalable, and trackable.</p>
        </section>

        <section className="content-section">
          <h2>Why Everyone Wins</h2>
          <ul className="benefits-list">
            <li><strong>Merchants</strong> only pay for actual sales. No upfront ad spend. No guesswork.</li>
            <li><strong>Affiliates</strong> earn money for driving results — without creating their own products.</li>
            <li><strong>Customers</strong> get to discover trusted products through people they follow.</li>
          </ul>
        </section>

        <section className="content-section example-section">
          <h2>Real-Life Example</h2>
          <div className="example-content">
            <p>
              Let's say Maria is a fitness blogger. She signs up for a protein brand's affiliate program on Upfilly. She writes a review post with her unique link. Her audience clicks the link, buys the product, and Maria earns 15% commission on every sale.
            </p>
            <p className="highlight-text">
              Maria helps her followers. The brand grows its customer base. Maria gets paid. Everyone wins.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2>What Makes Affiliate Marketing Work</h2>
          <ul className="key-factors-list">
            <li><strong>Trust</strong>: Audiences convert best when they trust the affiliate's opinion.</li>
            <li><strong>Relevance</strong>: Niche affiliates perform better because they promote what their audience actually cares about.</li>
            <li><strong>Transparency</strong>: Clear tracking, fair commissions, and consistent payouts keep the ecosystem healthy.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2>Why It's Growing Fast</h2>
          <p>
            Affiliate marketing has grown massively in recent years. Why?
          </p>
          <ul className="growth-factors-list">
            <li>Ad costs are rising.</li>
            <li>Social media influencers are everywhere.</li>
            <li>People trust peer recommendations more than ads.</li>
          </ul>
          <p>
            Merchants want cost-effective growth. Affiliates want flexible income. Affiliate marketing delivers both.
          </p>
        </section>

        <section className="content-section conclusion-section">
          <h2>Key Takeaways</h2>
          <p>
            Affiliate marketing is <strong>not</strong> a get-rich-quick scheme. It's a long-term, performance-driven channel that rewards quality content, trust, and consistency.
          </p>
          <p>
            Whether you're a merchant or affiliate, platforms like <strong>Upfilly</strong> make it easier than ever to get started — with no tech headaches.
          </p>
        </section>

        <div className="cta-container">
          <button className="cta-button" onClick={()=>history.push('track/signup/affiliate')}>Start Your Affiliate Journey</button>
        </div>
      </div>
    </Layout>
  );
};

export default UpfillyAffiliateTracking;

"use client"

import React from "react";
import Layout from "../components/global/layout";
import "./affiliateguide.css";
import { useRouter } from "next/navigation";

const affiliateguide = () => {
   const history = useRouter();
  return (
    <Layout>
      <div className="affiliate-guide">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <span className="badge">Affiliate Marketing Guide</span>
            <h1>What Is Affiliate Marketing and How Does It Work?</h1>
            <p className="hero-description">
              Affiliate marketing is a simple but powerful way to grow a business —
              and earn money by promoting the products you love. Whether you're a
              brand looking to scale or a content creator wanting to monetize your
              audience, affiliate marketing connects the two sides in a win-win
              partnership.
            </p>
            {/* <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">$12B+</span>
                <span className="stat-label">Industry Value</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">81%</span>
                <span className="stat-label">Brands Use Affiliates</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15%</span>
                <span className="stat-label">Avg. Commission</span>
              </div>
            </div> */}
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="section">
          <div className="section-header">
            <h2>Who This Is For</h2>
            <p className="section-subtitle">Upfilly welcomes all types of affiliates</p>
          </div>

          <div className="audience-grid">
            <div className="audience-card">
              <div className="card-icon">🎨</div>
              <h3>Content Creators</h3>
              <p>Bloggers, YouTubers, and social media influencers</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">📱</div>
              <h3>Media Buyers</h3>
              <p>Paid traffic specialists and media buyers</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">💰</div>
              <h3>Cashback Sites</h3>
              <p>Loyalty programs and cashback platforms</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">🔍</div>
              <h3>Review Sites</h3>
              <p>Product review and comparison websites</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">🏷️</div>
              <h3>Coupon Sites</h3>
              <p>Deal and coupon websites</p>
            </div>
            <div className="audience-card">
              <div className="card-icon">🤝</div>
              <h3>Subnetworks</h3>
              <p>Affiliate networks and technology partners</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-light">
          <div className="section-header">
            <h2>How Affiliates Make Money on Upfilly</h2>
            <p className="section-subtitle">Simple 5-step process to start earning</p>
          </div>

          <div className="process-flow">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Join</h3>
                <p>Create your free affiliate account</p>
              </div>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Apply</h3>
                <p>Apply to relevant programs</p>
              </div>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Links</h3>
                <p>Receive unique tracking links</p>
              </div>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Promote</h3>
                <p>Share with your audience</p>
              </div>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Get Paid</h3>
                <p>Earn commissions on sales</p>
              </div>
            </div>
          </div>

          <div className="highlight-box">
            <p>Upfilly tracks your performance and ensures commissions are calculated accurately in real-time.</p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section">
          <div className="section-header">
            <h2>What You Get as an Affiliate</h2>
            <p className="section-subtitle">Everything you need to succeed</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <div>
                <h4>Access to Top Merchants</h4>
                <p>Hundreds of affiliate programs across multiple niches</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <div>
                <h4>Unique Tracking Links</h4>
                <p>Track every click and conversion accurately</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <div>
                <h4>Real-time Analytics</h4>
                <p>Monitor performance with live statistics</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <div>
                <h4>Transparent Reporting</h4>
                <p>Clear commission tracking and reporting</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <div>
                <h4>Timely Payouts</h4>
                <p>Reliable and scheduled commission payments</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated affiliate support team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Grid */}
        <section className="section bg-gradient">
          <div className="split-grid">
            {/* Left Column - Prerequisites */}
            <div className="info-card">
              <h3>What You Need Before Signup</h3>
              <ul className="checklist">
                <li>A website, social account, or traffic source</li>
                <li>Basic profile information</li>
                <li>A payout method (PayPal, Bank Transfer, etc.)</li>
              </ul>
            </div>

            {/* Right Column - Signup Steps */}
            <div className="info-card">
              <h3>Affiliate Signup Steps</h3>
              <ol className="numbered-list">
                <li>Create an account</li>
                <li>Complete your affiliate profile</li>
                <li>Verify your email address</li>
                <li>Set your payout method</li>
                <li>Apply to affiliate programs</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Checklist Section */}
        <section className="section">
          <div className="section-header">
            <h2>After Signup Checklist</h2>
            <p className="section-subtitle">5 steps to launch your first campaign</p>
          </div>

          <div className="checklist-grid">
            <div className="checklist-item">
              <div className="checklist-number">01</div>
              <div className="checklist-content">
                <h4>Complete Your Profile</h4>
                <p>Fill out all profile details for better merchant approval rates</p>
              </div>
            </div>
            <div className="checklist-item">
              <div className="checklist-number">02</div>
              <div className="checklist-content">
                <h4>Choose Your Niche</h4>
                <p>Select a clear niche that aligns with your audience</p>
              </div>
            </div>
            <div className="checklist-item">
              <div className="checklist-number">03</div>
              <div className="checklist-content">
                <h4>Apply to Programs</h4>
                <p>Start with 3-5 relevant programs to test performance</p>
              </div>
            </div>
            <div className="checklist-item">
              <div className="checklist-number">04</div>
              <div className="checklist-content">
                <h4>Generate Links</h4>
                <p>Create your unique tracking links for each offer</p>
              </div>
            </div>
            <div className="checklist-item">
              <div className="checklist-number">05</div>
              <div className="checklist-content">
                <h4>Start Promoting</h4>
                <p>Publish your first promotion and track results</p>
              </div>
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section className="section bg-light">
          <div className="section-header">
            <h2>Rules & Compliance</h2>
            <p className="section-subtitle">Important guidelines for all affiliates</p>
          </div>

          <div className="rules-grid">
            <div className="rule-card warning">
              <div className="rule-icon">🚫</div>
              <h4>No Fraudulent Traffic</h4>
              <p>Prohibited or fraudulent traffic is strictly not allowed</p>
            </div>
            <div className="rule-card">
              <div className="rule-icon">🔍</div>
              <h4>Brand Bidding Rules</h4>
              <p>Respect merchant brand bidding policies</p>
            </div>
            <div className="rule-card">
              <div className="rule-icon">🏷️</div>
              <h4>Coupon Policies</h4>
              <p>Deal and coupon rules vary by merchant</p>
            </div>
            <div className="rule-card">
              <div className="rule-icon">📢</div>
              <h4>Proper Disclosure</h4>
              <p>Always disclose affiliate relationships</p>
            </div>
            <div className="rule-card highlight">
              <div className="rule-icon">⚠️</div>
              <h4>Account Suspension</h4>
              <p>Violations may result in immediate account suspension</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p className="section-subtitle">Got questions? We've got answers.</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>How do payouts work?</h4>
              <p>Commissions are paid once approved and after reaching the minimum payout threshold. Payouts are processed on a monthly basis.</p>
            </div>
            <div className="faq-item">
              <h4>What is the minimum payout?</h4>
              <p>The minimum payout amount varies by payment method and is clearly displayed in your account settings.</p>
            </div>
            <div className="faq-item">
              <h4>Why was my application rejected?</h4>
              <p>Merchants review applications individually based on traffic quality, relevance, and site content. You can always reapply after improving your application.</p>
            </div>
            <div className="faq-item">
              <h4>What if a commission is missing?</h4>
              <p>You can report missing commissions directly from your dashboard. Our support team will investigate and resolve the issue within 48 hours.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Affiliate Journey?</h2>
            <p>Join thousands of affiliates already earning on Upfilly</p>
            <button className="cta-button" onClick={()=>history.push("/track/signup/affiliate")}>Create Free Account</button>
            <p className="cta-note">No credit card required • 5-minute setup</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default affiliateguide;
"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import Layout from "../components/global/layout";

export default function Company() {
  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={undefined}
        filters={undefined}
      >
        <div className="managed-subscriptions">
          {/* Overview Section */}
          <section className="overview">
            <header className="overview-header">
              <h1 className="overview-title">Take the Hassle Out of Managing Your Affiliate Program</h1>
              <h2 className="overview-subtitle">
                Let our team of specialists handle your affiliate program, so you can focus on growing your business.
              </h2>
            </header>
            <p className="overview-text">
              Our Managed Subscriptions service is designed to provide expert guidance and hands-on management for your affiliate network. From strategy to execution, we ensure your program performs at its best.
            </p>
          </section>

          {/* What’s Included Section */}
          <section className="whats-included">
            <header>
              <h2 className="section-title">What’s Included in Managed Subscriptions?</h2>
            </header>
            <div className="included-list">
              <div className="included-item">
                <h3>Dedicated Affiliate Specialist</h3>
                <p>Your personal expert to manage and optimize your program.</p>
              </div>
              <div className="included-item">
                <h3>Weekly Strategy Calls</h3>
                <p>Regular discussions to align on goals, share insights, and refine strategies.</p>
              </div>
              <div className="included-item">
                <h3>Comprehensive Reports</h3>
                <p>Detailed analysis of affiliate performance, campaign success, and growth opportunities.</p>
              </div>
            </div>
          </section>

          {/* Pricing Options Section */}
          <section className="pricing-options">
            <header>
              <h2 className="section-title">Flexible Pricing to Suit Your Needs</h2>
            </header>
            <div className="pricing-table">
              <div className="pricing-option">
                <h3>Standard Package</h3>
                <p>Fixed monthly fee for full-service management.</p>
              </div>
              <div className="pricing-option">
                <h3>Hybrid Package</h3>
                <p>Monthly fee + a small commission percentage tied to program performance.</p>
              </div>
              <div className="pricing-option">
                <h3>Custom Requests</h3>
                <p>Tailored plans to align with your specific business requirements.</p>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="benefits">
            <header>
              <h2 className="section-title">Why Choose Managed Subscriptions?</h2>
            </header>
            <ul className="benefits-list">
              <li>Save Time and Resources: Let us handle the heavy lifting while you focus on scaling your business.</li>
              <li>Optimize Performance: Benefit from expert strategies tailored to your goals.</li>
              <li>Clear and Transparent Reporting: Gain detailed insights into affiliate activity and campaign outcomes.</li>
            </ul>
          </section>

          {/* Call-to-Action Section */}
          <section className="cta">
            <header>
              <h1 className="cta-title">Let Our Experts Manage Your Affiliate Program</h1>
              <h2 className="cta-subtitle">Maximize your affiliate marketing success with the help of our dedicated specialists.</h2>
            </header>
            <div className="cta-buttons">
              <button className="cta-btn primary">Get Started with Managed Subscriptions</button>
              <button className="cta-btn secondary">Contact Us for a Custom Plan</button>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

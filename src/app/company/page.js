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

        {/* Overview Section */}
        <section className=" bgdots">

          <div className="minus_margin container">

            <h1 className="innerhtmls">Take the Hassle Out of Managing Your <p className="d-block "> Affiliate Program</p></h1>
            <h2 className="ptext_bgs">
              Let our team of specialists handle your affiliate program, so you can focus on growing your business.
            </h2>

            <p className="para3">
              Our Managed Subscriptions service is designed to provide expert guidance and hands-on management for your affiliate network. From strategy to execution, we ensure your program performs at its best.
            </p>
          </div>
        </section>

        {/* What’s Included Section */}
        <section className="container">
          <div className="cuspadding2">
            <h2 className="included-title ">What’s Included in Managed Subscriptions?</h2>
            <div className="included-list">
              <div className=" row">
                <div className="col-12 col-md-4">
                  <div className="included-item">
                    <div className="d-flex gap-2 mb-md-3 align-items-center flex-column flex-lg-row">
                      <div className="included-icon">
                        <img className="iconhegt" src="/assets/img/s1.svg" />
                      </div>
                      <h3>Dedicated Affiliate Specialist</h3>
                    </div>
                    <p className="text-center text-md-left">Your personal expert to manage and optimize your program.</p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="included-item">
                    <div className="d-flex gap-2 mb-md-3 align-items-center flex-column flex-lg-row">
                      <div className="included-icon">
                        <img className="iconhegt" src="/assets/img/s2.svg" />
                      </div>
                      <h3>Weekly Strategy Calls</h3>
                    </div>
                    <p className="text-center text-md-left">Regular discussions to align on goals, share insights, and refine strategies.</p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="included-item">
                    <div className="d-flex gap-2 mb-md-3 align-items-center flex-column flex-lg-row">
                      <div className="included-icon">
                        <img className="iconhegt" src="/assets/img/s3.svg" />
                      </div>
                      <h3>Comprehensive Reports</h3>
                    </div>
                    <p className="text-center text-md-left">Detailed analysis of affiliate performance, campaign success, and growth opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Options Section */}
        <section className="container">
          <div className="cuspadding2  pt-0">
            <h2 className="included-title">Flexible Pricing to Suit Your Needs</h2>
            <div className="included-list">
              <div className=" row">
                <div className="col-12 col-md-4">
                  <div className="pricing-option text-center text-md-left">
                    <h3>Standard Package</h3>
                    <p>Fixed monthly fee for full-service management.</p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="pricing-option text-center text-md-left">
                    <h3>Hybrid Package</h3>
                    <p>Monthly fee + a small commission percentage tied to program performance.</p>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="pricing-option text-center text-md-left">
                    <h3>Custom Requests</h3>
                    <p>Tailored plans to align with your specific business requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits container py-0 py-md-4">
          <div className="cuspadding2 pt-0">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 col-lg-6">
                <img src="assets/img/subscription.png" className=" hightwidth" />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <h2 className="text-left lefttext text-center text-md-left  mb-4">Why Choose Managed Subscriptions?</h2>
                <div className="subs-content">
                  <div className="d-flex gap-2 align-items-start">
                    <span>
                      <img src="/assets/img/check.png" className="check_list mt-1" alt=""></img>
                    </span>
                    <div>
                      <h5>Save Time and Resources:</h5>
                      <h6>Let us handle the heavy lifting while you focus on scaling your business. </h6>
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <span>
                      <img src="/assets/img/check.png" className="check_list mt-1" alt=""></img>
                    </span>
                    <div>
                      <h5>Optimize Performance:</h5>
                      <h6> Benefit from expert strategies tailored to your goals.</h6>
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-start">
                    <span>
                      <img src="/assets/img/check.png" className="check_list mt-1" alt=""></img>
                    </span>
                    <div>
                      <h5>Clear and Transparent Reporting:</h5>
                      <h6 className="mb-0"> Gain detailed insights into affiliate activity and campaign outcomes.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}  
        <section className="cta container">
          <div className="row">
            <div className="col-md-12">
              <div className="cta-content">
                <header>
                  <h1 className="cta-title">Let Our Experts Manage Your Affiliate Program</h1>
                  <h2 className="cta-subtitle">Maximize your affiliate marketing success with the help of our dedicated specialists.</h2>
                </header>
                <div className="cta-buttons">
                  <button className="cta-btn primary">Get Started with Managed Subscriptions</button>
                  <button className="cta-btn secondary">Contact Us for a Custom Plan</button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </Layout>
    </>
  );
}

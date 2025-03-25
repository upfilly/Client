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
        <img className='dots-img' src='/assets/img/Vector-dots.png' alt=''></img>
        <div className="managed-subscriptions container">
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
                <div className="d-flex gap-2">
                  <div className="included-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64" fill="none">
                      <path d="M23.3305 23.7C29.4167 23.7 34.3505 18.8423 34.3505 12.85C34.3505 6.85771 29.4167 2 23.3305 2C17.2444 2 12.3105 6.85771 12.3105 12.85C12.3105 18.8423 17.2444 23.7 23.3305 23.7Z" fill="#032E72" />
                      <path d="M30.4295 30.3199C31.0395 29.8699 31.6795 29.4599 32.3395 29.0799C29.6495 27.4899 26.5595 26.6299 23.3995 26.6299H23.2695C13.5695 26.6299 5.68945 34.5199 5.68945 44.2199V45.3199C5.68945 45.8799 6.13945 46.3199 6.68945 46.3199H22.8495C22.8495 45.9899 22.8295 45.6599 22.8295 45.3299C22.8295 44.9999 22.8395 44.6499 22.8495 44.3199C23.1595 38.5899 26.0695 33.5399 30.4295 30.3199Z" fill="#032E72" />
                      <path d="M41.5701 28.6599C32.3401 28.6599 24.8301 36.1399 24.8301 45.3299C24.8301 54.5199 32.3401 61.9999 41.5701 61.9999C50.8001 61.9999 58.3101 54.5199 58.3101 45.3299C58.3101 36.1399 50.8001 28.6599 41.5701 28.6599ZM51.5001 42.4299L49.9601 50.5199C49.8701 50.9999 49.4601 51.3399 48.9801 51.3399H34.1601C33.6801 51.3399 33.2701 50.9999 33.1801 50.5199L31.6401 42.4299C31.5701 42.0599 31.7101 41.6899 32.0001 41.4599C32.2901 41.2199 32.6901 41.1799 33.0301 41.3299L37.7301 43.4199L40.8001 39.6799C41.1801 39.2199 41.9601 39.2199 42.3401 39.6799L45.4101 43.4199L50.1101 41.3299C50.4501 41.1799 50.8501 41.2299 51.1401 41.4599C51.4301 41.6899 51.5701 42.0599 51.5001 42.4299Z" fill="#00BAFF" />
                    </svg>
                  </div>
                  <h3>Dedicated Affiliate Specialist</h3>
                </div>
                <p>Your personal expert to manage and optimize your program.</p>
              </div>
              <div className="included-item">
                <div className="d-flex gap-2">
                  <div className="included-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <path d="M41.0371 36.6274C40.5493 36.138 39.9697 35.7496 39.3316 35.4846C38.6935 35.2196 38.0093 35.0832 37.3183 35.0832C36.6273 35.0832 35.9431 35.2196 35.305 35.4846C34.6669 35.7496 34.0873 36.138 33.5996 36.6274L31.0621 39.1649C28.205 37.3516 25.558 35.227 23.1696 32.8299C20.7725 30.4415 18.6478 27.7944 16.8346 24.9374L19.3721 22.3999C19.8615 21.9121 20.2498 21.3326 20.5148 20.6944C20.7798 20.0563 20.9162 19.3721 20.9162 18.6811C20.9162 17.9902 20.7798 17.306 20.5148 16.6678C20.2498 16.0297 19.8615 15.4501 19.3721 14.9624L14.4196 10.0274C13.9387 9.53633 13.364 9.14695 12.7297 8.88239C12.0954 8.61784 11.4143 8.48351 10.7271 8.48739C10.0349 8.48569 9.34924 8.62088 8.70952 8.88517C8.06981 9.14947 7.48867 9.53765 6.99955 10.0274L4.61955 12.3899C3.48515 13.6096 2.6385 15.068 2.14184 16.6579C1.64518 18.2478 1.51113 19.9288 1.74955 21.5774C2.30955 28.1399 6.61455 36.0324 13.2471 42.6824C19.8796 49.3324 27.8596 53.6199 34.4221 54.2499C34.9117 54.2761 35.4024 54.2761 35.8921 54.2499C37.3047 54.3092 38.715 54.0859 40.0402 53.5931C41.3654 53.1002 42.5789 52.3478 43.6096 51.3799L45.9721 48.9999C46.4618 48.5108 46.85 47.9296 47.1143 47.2899C47.3786 46.6502 47.5137 45.9645 47.5121 45.2724C47.5159 44.5851 47.3816 43.9041 47.117 43.2697C46.8525 42.6354 46.4631 42.0607 45.9721 41.5799L41.0371 36.6274Z" fill="#032E72" />
                      <path d="M46.55 9.43255C44.118 6.99125 41.2267 5.05552 38.043 3.73697C34.8592 2.41842 31.446 1.74314 28 1.75005C27.5359 1.75005 27.0908 1.93443 26.7626 2.26262C26.4344 2.5908 26.25 3.03592 26.25 3.50005C26.25 3.96418 26.4344 4.4093 26.7626 4.73749C27.0908 5.06568 27.5359 5.25005 28 5.25005C31.0038 5.24994 33.978 5.84471 36.7507 7.00002C39.5235 8.15534 42.0401 9.84832 44.1551 11.9813C46.2702 14.1143 47.9419 16.645 49.0738 19.4274C50.2057 22.2098 50.7754 25.1888 50.75 28.1926C50.75 28.6567 50.9344 29.1018 51.2626 29.43C51.5907 29.7582 52.0359 29.9426 52.5 29.9426C52.9641 29.9426 53.4093 29.7582 53.7374 29.43C54.0656 29.1018 54.25 28.6567 54.25 28.1926C54.2835 24.7099 53.6195 21.2559 52.297 18.0339C50.9746 14.812 49.0205 11.8874 46.55 9.43255Z" fill="#00BAFF" />
                      <path d="M36.592 19.4426C37.5851 20.4297 38.3708 21.6055 38.9027 22.9009C39.4347 24.1962 39.7022 25.5848 39.6895 26.9851C39.6895 27.4492 39.8738 27.8943 40.202 28.2225C40.5302 28.5507 40.9753 28.7351 41.4395 28.7351C41.9036 28.7351 42.3487 28.5507 42.6769 28.2225C43.0051 27.8943 43.1895 27.4492 43.1895 26.9851C43.2126 25.1319 42.8676 23.2925 42.1744 21.5737C41.4812 19.8549 40.4537 18.2909 39.1513 16.9722C37.849 15.6536 36.2978 14.6067 34.5878 13.8922C32.8777 13.1778 31.0428 12.8099 29.1895 12.8101C28.7253 12.8101 28.2802 12.9944 27.952 13.3226C27.6238 13.6508 27.4395 14.0959 27.4395 14.5601C27.4395 15.0242 27.6238 15.4693 27.952 15.7975C28.2802 16.1257 28.7253 16.3101 29.1895 16.3101C30.5686 16.3204 31.9322 16.6024 33.2023 17.1399C34.4725 17.6774 35.6243 18.4598 36.592 19.4426Z" fill="#00BAFF" />
                    </svg>
                  </div>
                  <h3>Weekly Strategy Calls</h3>
                </div>
                <p>Regular discussions to align on goals, share insights, and refine strategies.</p>
              </div>
              <div className="included-item">
                <div className="d-flex gap-2">
                  <div className="included-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="58" height="52" viewBox="0 0 58 52" fill="none">
                      <path d="M36.25 0V13H50.75L36.25 0Z" fill="#00BAFF" />
                      <path d="M36.25 16.25C34.2526 16.25 32.625 14.7907 32.625 13V0H10.875C8.87762 0 7.25 1.45925 7.25 3.25V48.75C7.25 50.544 8.87762 52 10.875 52H47.125C49.126 52 50.75 50.544 50.75 48.75V16.25H36.25ZM21.75 45.5H14.5V35.75H21.75V45.5ZM32.625 45.5H25.375V29.25H32.625V45.5ZM43.5 45.5H36.25V22.75H43.5V45.5Z" fill="#032E72" />
                    </svg>
                  </div>
                  <h3>Comprehensive Reports</h3>
                </div>
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
              {/* <h2 className="section-title">Why Choose Managed Subscriptions?</h2> */}
            </header>
            <div className="row">
              <div className="col-md-6">
                <img src="assets/img/subscription.png" width={"100%"}></img>
              </div>
              <div className="col-md-6">
                <h2 className="text-left subs-title">Why Choose Managed Subscriptions?</h2>
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
                      <h6> Gain detailed insights into affiliate activity and campaign outcomes.</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

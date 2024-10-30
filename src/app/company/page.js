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
        <div className="company-page pricing-padding">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className='main-title text-center mb-3'>
                  <h1>About Our Company</h1>
                  <p className='printit'>
                    At XYZ Corp, we are dedicated to providing innovative solutions that drive success in the modern business landscape. 
                    <br />
                    Our expertise in technology and customer service sets us apart in the industry.
                  </p>
                </div>
              </div>
            </div>

            <div className="row align-items-center mb-5 pt-4">
              <div className="col-lg-6">
                <div className="feature-left mb-3">
                  <img className="company_img" src="assets/img/company-feature-one.png" alt="Enhance Your Business" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-text mb-4 lens_details mb-3">
                  <h1 className="text-black set_lensbx mb-0">Enhance Your Business Outcomes</h1>
                  <p className="border-common"></p>
                  <p>
                    Our commitment to excellence ensures that we deliver solutions that meet your unique needs. 
                    From advanced analytics to tailored marketing strategies, we help you enhance your business outcomes.
                  </p>
                  <a href="#" className="blue-btn btn btn-primary">
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>

            <div className="my-5">
              <div className="row align-items-center flex-column-reverse flex-lg-row">
                <div className="col-lg-6">
                  <div className="feature-text mb-3">
                    <h1 className="text-black ulable mb-0">
                      Optimize Your Business Growth Operating Model
                    </h1>
                    <p className="border-common"></p>
                    <p>
                      We specialize in optimizing operational efficiencies to foster sustainable growth. 
                      Our data-driven approach enables you to make informed decisions that lead to long-term success.
                    </p>
                    <a href="#" className="blue-btn btn btn-primary">
                      Get in Touch
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="feature-left mb-3">
                    <img className="company_img" src="assets/img/company-feature-two.png" alt="Business Growth" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid">
            <div className="border-blue"></div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="expertise">
                  <h3 className="main-head">Our Expertise</h3>
                  <ul>
                    <li>
                      <img src="assets/img/arrow-left.svg" alt="Arrow" />
                      Comprehensive market analysis and insights.
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" alt="Arrow" />
                      Cutting-edge technology implementation and support.
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" alt="Arrow" />
                      Tailored marketing and branding strategies.
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" alt="Arrow" />
                      Data analytics and business intelligence solutions.
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" alt="Arrow" />
                      Customer engagement and retention programs.
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" alt="Arrow" />
                      Strategic consulting for operational efficiency.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

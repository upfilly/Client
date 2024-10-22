"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import Layout from "../components/global/layout";

export default function Platforms() {
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
        <div className="company-page my-5">
          <div className="container">
            {/* Video Section */}
            <div className="row">
              <div className="col-md-12">
                <div className="video-container mb-5">
                  <iframe
                    width="100%"
                    height="500"
                    src="/assets/img/affiliate-market.mp4"
                    title="Video Title"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="platform_bx">
              <div className="row align-items-center">
                <div className="col-md-12">
                  <h1 className="text-center rise">Platform</h1>
                  <p className="text-center printit">
                    The trusted foundation for everyone in the affiliate marketing world,
                    serving as the standard for captivating content that drives engagement
                    and boosts sales.
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="platform-desc mt-5">
                  <div>
                    <h2 className="blue-color">Important Updates</h2>
                    <p>Whether you are just beginning to build or expand your business, Upfilly offers a broad set of programs to help you innovate, expand, and differentiate your offerings.</p>
                    <p>For decades, the industry has relied on proven strategies and frameworks to create effective marketing materials. These approaches have not only stood the test of time but have also adapted seamlessly to the digital landscape, ensuring your content remains impactful and relevant.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="my-5">
                <div className="row align-items-center mb-150 mobile-flex-reverse reversebx">
                  <div className="col-12 col-sm-12 col-md-5">
                    <div className="mb-4">
                      <h1 className="text-black ulable">
                        Usable Upfilly <br /> Platform
                      </h1>
                      <p>
                        Effective content creation is essential in today’s digital landscape. By leveraging proven strategies, you can craft compelling messages that resonate with your audience and elevate your brand.
                      </p>

                      <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                        <b>Understand Buyers</b>
                        <img
                          src="/assets/img/check.png"
                          className="check_list"
                          alt=""
                        />
                      </div>
                      <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                        <b>Attribute User Activity</b>
                        <img
                          src="/assets/img/check.png"
                          className="check_list"
                          alt=""
                        />
                      </div>
                      <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                        <b>Utilize CRM Stages</b>
                        <img
                          src="/assets/img/check.png"
                          className="check_list"
                          alt=""
                        />
                      </div>
                      <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                        <b>Measure Organic</b>
                        <img
                          src="/assets/img/check.png"
                          className="check_list"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-7">
                    <div className="mb-4">
                      <div className="platform-feature-img platform-feature-left">
                        <img src="/assets/img/platform-feature.png" className="img-fluid" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-5">
              <div className="row align-items-center reversebx">
                <div className="col-12 col-sm-12 col-md-7">
                  <div className="mb-4">
                    <div className="platform-feature-img">
                      <img src="/assets/img/platform-feature-two.png" className="img-fluid" alt="" />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-5">
                  <div className="mb-4">
                    <h1 className="text-black ulable">
                      Usable Upfilly <br /> Platform
                    </h1>
                    <p>
                      Effective content creation is essential in today’s digital landscape. By leveraging proven strategies, you can craft compelling messages that resonate with your audience and elevate your brand.
                    </p>

                    <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                      <b>Understand Buyers</b>
                      <img
                        src="/assets/img/check.png"
                        className="check_list"
                        alt=""
                      />
                    </div>
                    <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                      <b>Attribute User Activity</b>
                      <img
                        src="/assets/img/check.png"
                        className="check_list"
                        alt=""
                      />
                    </div>
                    <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                      <b>Utilize CRM Stages</b>
                      <img
                        src="/assets/img/check.png"
                        className="check_list"
                        alt=""
                      />
                    </div>
                    <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
                      <b>Measure Organic</b>
                      <img
                        src="/assets/img/check.png"
                        className="check_list"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

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
          <div className="container  ">
            <div className="row align-items-center ">
              <div className="col-md-12">
                <div className='main-title text-center'>
                  <h1 className=''>Company</h1>
                  <p className=' printit'>Lorem Ipsum is simply dummy text of the printing and typesetting  <br /> industry. Lorem Ipsum has been the industry's standard </p>
                </div>
              </div>
            </div>

            <div className="row align-items-center mb-5 pt-4">
              <div class="col-lg-6 ">
                <div className="feature-left">
                  <img className="img-fluid" src="assets/img/company-feature-one.png" />
                </div>
              </div>
              <div className="col-lg-6  ">
                <div className="feature-text">
                  <h1 class="text-black mb-0">Enhance your <br /> Business Outcomes</h1>
                  <p className="border-common"></p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                  <a href="#" className="blue-btn btn btn-primary">
                    Get in touch
                  </a>
                </div>
              </div>

            </div>

            <div className="row align-items-center pt-4">
              <div className="col-lg-6  ">
                <div className="feature-text">
                  <h1 class="text-black mb-0">
                    Optimise your business growth operating model
                  </h1>
                  <p className="border-common"></p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged.
                  </p>
                  <a href="#" className="blue-btn btn btn-primary">
                    Get in touch
                  </a>
                </div>
              </div>
              <div class="col-lg-6  ">
                <div className="feature-left">
                  <img className="img-fluid" src="assets/img/company-feature-two.png" />
                </div>
              </div>
            </div>
          </div>

          <div className="conatiner-fluid">
            <div className="border-blue"></div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="expertise">
                  <h3 className="main-head">Our Expertise</h3 >
                  <ul>
                    <li>
                      <img src="assets/img/arrow-left.svg" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.{" "}
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.{" "}
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.{" "}
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.{" "}
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.{" "}
                    </li>
                    <li>
                      <img src="assets/img/arrow-left.svg" />
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.{" "}
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

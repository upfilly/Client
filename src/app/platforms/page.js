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
          <div className="container ">
           <div className=" platform_bx" >
           <div className="row align-items-center ">
              <div className="col-md-12">
                <h1 className="text-center rise">Platform</h1>
                <p className="text-center printit">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the
                  industry's standard{" "}
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
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
           <div className="my-5">
           <div className="row align-items-center mb-150 mobile-flex-reverse">
              <div className=" col-12 col-sm-12   col-md-5  ">
                <h1 className="text-black ulable  ">
                  Usable Upfilly <br /> Platform
                </h1>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and type lorem Ipsum is simply
                </p>
                <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                  <b>Understand Buyers  </b>
                  <img
                    src="/assets/img/check.png"
                    className="check_list"
                    alt=""
                  />
                </div>
                <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                  <b>Attribute User Activity</b>
                  <img
                    src="/assets/img/check.png"
                    className="check_list"
                    alt=""
                  />
                </div>
                <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                  <b>Utilize CRM Stages</b>
                  <img
                    src="/assets/img/check.png"
                    className="check_list"
                    alt=""
                  />
                </div>
                <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                  <b>Measure Organic</b>
                  <img
                    src="/assets/img/check.png"
                    className="check_list"
                    alt=""
                  />
                </div>
              </div>
              <div className= " col-12 col-sm-12   col-md-7">
               <div className="" >
               <div className="platform-feature-img platform-feature-left">
                  <img src="/assets/img/platform-feature.png" className="img-fluid " alt="" />
                </div>
               </div>
              </div>



            </div>
           </div>
            </div>


            <div className="row align-items-center mb-150">
              <div className="col-md-7 mt-5 pt-5">
                <div className="platform-feature-img">
                  <img src="/assets/img/platform-feature-two.png" className="img-fluid" alt="" />
                </div>
              </div>
              <div className="col-md-5 mt-5 pt-5 pr-5 ">
                <div className="mb-5">
                  <h1 className="text-black">
                    Usable Upfilly <br /> Platform
                  </h1>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and type lorem Ipsum is simply
                  </p>
                  <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                    <b>Understand Buyers  </b>
                    <img
                      src="/assets/img/check.png"
                      className="check_list"
                      alt=""
                    />
                  </div>
                  <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                    <b>Attribute User Activity</b>
                    <img
                      src="/assets/img/check.png"
                      className="check_list"
                      alt=""
                    />
                  </div>
                  <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
                    <b>Utilize CRM Stages</b>
                    <img
                      src="/assets/img/check.png"
                      className="check_list"
                      alt=""
                    />
                  </div>
                  <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3">
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
      </Layout>
    </>
  );
}

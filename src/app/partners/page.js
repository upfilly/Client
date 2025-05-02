"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import Layout from "../components/global/layout";

export default function Partners() {
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
        <div className="pricing-padding">
          <div className="bgdots">
            <div class="minus_margin container">
              <h5 class="innerhtmls">Partners’ Programs</h5>
              <p class="para3">
                Effective content is essential in the printing and typesetting
                industry. Proven strategies have become the standard for
                creating engaging materials that capture attention and drive
                results.
              </p>
              <button className="btn btn-primary bap-btn mt-2">Become a partner</button>
            </div>
          </div>
          <div className="container partners-page">
            <div className="row">
              <div className="col-md-12">
                <div className="need_contactus">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="platform-desc text-center text-md-left mt-5 mb-5">
                        <div>
                          <h2 className="blue-color">Important Updates</h2>
                          <p>
                            Whether you are just beginning to build or expand
                            your business, Upfilly offers a broad set of
                            programs to help you innovate, expand, and
                            differentiate your offerings.
                          </p>
                          <p>
                            In today’s fast-paced digital landscape, effective
                            communication is key. Our industry-standard
                            practices have evolved to ensure your content
                            remains relevant and impactful, enabling you to
                            connect with your audience and achieve your business
                            goals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>


                <h3 className="partners-heading mb-4 mb-md-5">Programs to help you build your business</h3>
                  <div className="row">
                    <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <div className="card_box  hover_box">
                        <div className="imgtag_card text-center text-sm-left">
                          <h4 className="mx-1">Customer engagement for partner opportunities</h4>

                          <p className="mx-1">
                            Go to our community forum to ask questions and take
                            advantage of the incredible experience of the
                            worldwide television industry, 24 hours a day!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'>
                      <div className='card_box  hover_box'>
                        <div className='imgtag_card'>
                          <h4>Customer engagement for partner opportunities</h4>

                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>

                        </div>
                      </div>
                    </div>

                    <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'>
                      <div className='card_box  hover_box'>
                        <div className='imgtag_card'>
                          <h4>Customer engagement for partner opportunities</h4>

                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>

                        </div>
                      </div>
                    </div>

                    <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'>
                      <div className='card_box  hover_box'>
                        <div className='imgtag_card'>
                          <h4>Customer engagement for partner opportunities</h4>

                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>

                        </div>
                      </div>
                    </div>

                    <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'>
                      <div className='card_box  hover_box'>
                        <div className='imgtag_card'>
                          <h4>Customer engagement for partner opportunities</h4>

                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>

                        </div>
                      </div>
                    </div>

                    <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'>
                      <div className='card_box  hover_box'>
                        <div className='imgtag_card'>
                          <h4>Customer engagement for partner opportunities</h4>

                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>

                        </div>
                      </div>
                    </div>

                    <div className='col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3'>
                      <div className='card_box  hover_box'>
                        <div className='imgtag_card'>
                          <h4>Customer engagement for partner opportunities</h4>

                          <p>Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!</p>

                        </div>
                      </div>
                    </div> */}
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

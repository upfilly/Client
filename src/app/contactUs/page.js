"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import Layout from "../components/global/layout";

export default function ContactUs() {
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
            <h5 className="innerhtmls">Contact Us</h5>

            <p className="para3">
              Feel free to reach out to us with any questions or feedback.{" "}
              <br />
              We're here to help and look forward to connecting with you!
            </p>
          </div>
        </section>

        <div className="cuspadding2 contactus">
          <div className="container ">
            <h3 className="mainhead mb-sm-4 text-center text-md-left">
              Need Assistance?
            </h3>
            <div className="row">
              <div className="grid-item col-md-6 col-lg-4">
                <div className="card_box text-center mb-4">
                  <div className="imgtag_card">
                    <img
                      src="/assets/img/c2.png"
                      className="img-fluid heighteual"
                    />
                    <h6>Visit our Forum</h6>
                    <p>
                      Go to our community forum to ask questions and take
                      advantage of the incredible experience of the worldwide
                      television industry, 24 hours a day!
                    </p>
                    <button className="btn btn-blue">Visit the Forum</button>
                  </div>
                </div>
              </div>
              <div className="grid-item col-md-6 col-lg-4">
                <div className="card_box text-center mb-4 ">
                  <div className="imgtag_card">
                    <img
                      src="/assets/img/c1.png"
                      className="img-fluid heighteual"
                    />
                    <h6>Email Us </h6>
                    <p>
                      Whenever you have a question for the community, visit our
                      forum to connect with industry experts and get the help
                      you need around the clock.
                    </p>
                    <button className="btn btn-blue">Send us an Email</button>
                  </div>
                </div>
              </div>
              <div className="grid-item col-md-6 col-lg-4">
                <div className="card_box text-center mb-4">
                  <div className="imgtag_card">
                    <img
                      src="/assets/img/c3.png"
                      className="img-fluid heighteual"
                    />
                    <h6>Telephone Us</h6>
                    <p>
                      When you need urgent help, call the Blackmagic Design
                      support office closest to you. If you need out of hours
                      help, call one of our worldwide support offices.
                    </p>
                    <button className="btn btn-blue">Contact Us</button>
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

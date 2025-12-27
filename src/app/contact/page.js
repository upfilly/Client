"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import Layout from "../components/global/layout";
import { useRouter } from "next/navigation";

export default function ContactUs() {
  const router = useRouter();

  const handleHelpGuides = () => {
    router.push('/affguide');
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@example.com';
  };

  const handleChat = () => {
    alert("Live chat feature will be implemented soon!");
  };

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
                    <h6>Help Guides</h6>
                    <p>
                      Browse our comprehensive help guides and documentation to find answers to common questions and learn how to make the most of our products and services.
                    </p>
                    <button className="btn btn-blue" onClick={handleHelpGuides}>
                      View Help Guides
                    </button>
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
                    <h6>Email Support</h6>
                    <p>
                      Send us an email with your questions or issues and our support team will get back to you with detailed assistance and solutions.
                    </p>
                    <button className="btn btn-blue" onClick={handleEmail}>
                      Send us an Email
                    </button>
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
                    <h6>Live Chat</h6>
                    <p>
                      Get immediate help through our live chat support. Connect with our support agents in real-time for quick answers and troubleshooting assistance.
                    </p>
                    <button className="btn btn-blue" onClick={handleChat}>
                      Start Chat
                    </button>
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
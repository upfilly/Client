"use client";

// import { useEffect, useState } from "react";
// import "./style.scss";
// import Layout from "../components/global/layout";

// export default function Platforms() {
//   return (
//     <>
//       <Layout
//         handleKeyPress={undefined}
//         setFilter={undefined}
//         reset={undefined}
//         filter={undefined}
//         name={undefined}
//         filters={undefined}
//       >
//         <div className="company-page my-5">
//           <div className="container">
//             {/* Video Section */}
//             <div className="row">
//               <div className="col-md-12">
//                 <div className="video-container mb-5">
//                   <iframe
//                     width="100%"
//                     height="500"
//                     src="/assets/img/affiliate-market.mp4"
//                     title="Video Title"
//                     frameBorder="0"
//                     allowFullScreen
//                   ></iframe>
//                 </div>
//               </div>
//             </div>

//             <div className="platform_bx">
//               <div className="row align-items-center">
//                 <div className="col-md-12">
//                   <h1 className="text-center rise">UpFilly: Powering Your Affiliate Success</h1>
//                   <p className="text-center printit">
//                   UpFilly is your all-in-one affiliate marketing solution designed to help merchants and affiliates thrive.
//                   With advanced tracking, actionable insights, and seamless payouts, we simplify the process of
//                   building and scaling affiliate programs. Whether you’re just starting or looking to optimize, UpFilly has the tools you need to succeed.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="platform-desc mt-5">
//                   <div>
//                     <h2 className="blue-color">Important Updates</h2>
//                     <p>A mockup of the UpFilly dashboard showing key metrics like sales, clicks, and conversions.</p>
//                     <p>Icons for Tracking, Analytics, and Payouts below the text.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div className="my-5">
//                 <div className="row align-items-center mb-150 mobile-flex-reverse reversebx">
//                   <div className="col-12 col-sm-12 col-md-5">
//                     <div className="mb-4">
//                       <h1 className="text-black ulable">
//                       Directly below the Overview <br />  section
//                       </h1>
//                       <p>
//                       Stay on top of your affiliate program with real-time tracking. UpFilly provides precise data on clicks, conversions, and commissions, ensuring you never miss a detail. Our advanced attribution technology guarantees accurate results, while fraud protection tools keep your campaigns secure.
//                       </p>

//                       <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                         <b>An infographic showing the flow of tracking from a click to a commission.</b>
//                         <img
//                           src="/assets/img/check.png"
//                           className="check_list"
//                           alt=""
//                         />
//                       </div>
//                       <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                         <b>A screenshot of a live tracking interface.</b>
//                         <img
//                           src="/assets/img/check.png"
//                           className="check_list"
//                           alt=""
//                         />
//                       </div>
//                       <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                         <b>Utilize CRM Stages</b>
//                         <img
//                           src="/assets/img/check.png"
//                           className="check_list"
//                           alt=""
//                         />
//                       </div>
//                       <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                         <b>Measure Organic</b>
//                         <img
//                           src="/assets/img/check.png"
//                           className="check_list"
//                           alt=""
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-12 col-sm-12 col-md-7">
//                     <div className="mb-4">
//                       <div className="platform-feature-img platform-feature-left">
//                         <img src="/assets/img/platform-feature.png" className="img-fluid" alt="" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="my-5">
//               <div className="row align-items-center reversebx">
//                 <div className="col-12 col-sm-12 col-md-7">
//                   <div className="mb-4">
//                     <div className="platform-feature-img">
//                       <img src="/assets/img/platform-feature-two.png" className="img-fluid" alt="" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-12 col-sm-12 col-md-5">
//                   <div className="mb-4">
//                     <h1 className="text-black ulable">
//                       Usable Upfilly <br /> Platform
//                     </h1>
//                     <p>
//                       Effective content creation is essential in today’s digital landscape. By leveraging proven strategies, you can craft compelling messages that resonate with your audience and elevate your brand.
//                     </p>

//                     <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                       <b>Understand Buyers</b>
//                       <img
//                         src="/assets/img/check.png"
//                         className="check_list"
//                         alt=""
//                       />
//                     </div>
//                     <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                       <b>Attribute User Activity</b>
//                       <img
//                         src="/assets/img/check.png"
//                         className="check_list"
//                         alt=""
//                       />
//                     </div>
//                     <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                       <b>Utilize CRM Stages</b>
//                       <img
//                         src="/assets/img/check.png"
//                         className="check_list"
//                         alt=""
//                       />
//                     </div>
//                     <div className="d-flex justify-content-between border-bottom mt-3 pt-2 mb-3 pb-3 flex_list">
//                       <b>Measure Organic</b>
//                       <img
//                         src="/assets/img/check.png"
//                         className="check_list"
//                         alt=""
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </>
//   );
// }

import React from "react";
import Layout from "../components/global/layout";
import "./style.scss";
import { useRouter } from "next/navigation";
// Combined component for the entire page
const UpFillyPage = () => {
  const history = useRouter();

  return (
    <Layout>
      <div className="App platforms-page">
        {/* Header Section */}
        <header className="header">
          <h1>Powering Your Affiliate Success</h1>
          <p className="desc-pera mt-3">
            UpFilly is your all-in-one affiliate marketing solution designed to
            help merchants and affiliates thrive. With advanced tracking,
            actionable insights, and seamless payouts, we simplify the process
            of building and scaling affiliate programs. Whether you’re just
            starting or looking to optimize, UpFilly has the tools you need to
            succeed.
          </p>
          {/* <div className="header-visual">
          <img src="/assets/images/dashboard-mockup.png" alt="UpFilly Dashboard" />
          <div className="icons">
            <img src="/assets/icons/tracking-icon.svg" alt="Tracking" />
            <img src="/assets/icons/analytics-icon.svg" alt="Analytics" />
            <img src="/assets/icons/payouts-icon.svg" alt="Payouts" />
          </div>
        </div> */}
        </header>
<div className="container">

        {/* Overview Section */}

        {/* Affiliate Tracking Section */}
        <section className="affiliate-tracking mt-4">
          <h2>Track Every Click, Conversion, and Commission</h2>
          <p>
            Stay on top of your affiliate program with real-time tracking.
            UpFilly provides precise data on clicks, conversions, and
            commissions, ensuring you never miss a detail. Our advanced
            attribution technology guarantees accurate results, while fraud
            protection tools keep your campaigns secure.
          </p>
          {/* <div className="tracking-visual">
          <img src="/assets/images/affiliate-tracking.png" alt="Tracking Flow" />
          <img src="/assets/icons/tracking-icon.svg" alt="Tracking" />
        </div> */}
        </section>

        {/* Analytics & Insights Section */}
        <section className="analytics-insights">
          <h2>Turn Data Into Decisions</h2>
          <p>
            UpFilly’s powerful analytics give you a complete overview of your
            affiliate program’s performance. With advanced reporting and data
            visualization, you can identify top-performing affiliates, optimize
            campaigns, and drive better results. Make informed decisions with
            insights that matter.
          </p>
          {/* <div className="analytics-visual">
          <img src="/assets/images/analytics-graph.png" alt="Analytics Graph" />
          <div className="icons">
            <img src="/assets/icons/analytics-icon.svg" alt="Top Affiliates" />
            <img src="/assets/icons/analytics-icon.svg" alt="Campaign ROI" />
            <img src="/assets/icons/analytics-icon.svg" alt="Click-Through Rates" />
          </div>
        </div> */}
        </section>

        {/* Payout Management Section */}
        <section className="payout-management">
          <h2>Simplify Affiliate Payouts</h2>
          <p>
            Pay your affiliates quickly and effortlessly with UpFilly’s
            automated payout system. Choose from multiple payment methods and
            let us handle the rest. Whether it’s one affiliate or hundreds,
            UpFilly ensures payments are accurate and on time, keeping your
            partners happy and engaged.
          </p>
          {/* <div className="payout-visual">
          <img src="/assets/images/payout-completed.png" alt="Payout Completed" />
          <img src="/assets/icons/payment-options.svg" alt="Payment Options" />
        </div> */}
        </section>

        {/* Supported Integrations Section */}
        <section className="supported-integrations">
          <h2>Connect with Leading Platforms</h2>
          <p>
            UpFilly integrates seamlessly with platforms like Shopify, making it
            easy to connect your store and start tracking affiliate performance.
            With quick onboarding and minimal setup, you’ll be up and running in
            no time.
          </p>
          {/* <div className="integrations-logos">
          <img src="/assets/images/shopify-logo.svg" alt="Shopify" />
        </div>
        <img src="/assets/icons/platform-integrations.svg" alt="Integration Visual" /> */}
        </section>

        {/* Call to Action Section */}
        <div className="container mt-5">
          <section className="cta last-section card_box">
            <h2>Experience the Power of UpFilly</h2>
            <button
              className="cta-button"
              onClick={() => history.push("/SignupOptions")}
            >
              Get Started Now
            </button>
          </section>
        </div>
</div>
      </div>
    </Layout>
  );
};

export default UpFillyPage;

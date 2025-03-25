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
      <img className='dots-img' src='/assets/img/Vector-dots.png' alt=''></img>
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
            <h2>
              {/* Track Every Click, Conversion, and Commission */}
              Important Updates
            </h2>
            <p>
              {/* Stay on top of your affiliate program with real-time tracking.
            UpFilly provides precise data on clicks, conversions, and
            commissions, ensuring you never miss a detail. Our advanced
            attribution technology guarantees accurate results, while fraud
            protection tools keep your campaigns secure. */}
              Whether you are just beginning to build or expand your business, Upfilly offers a broad set of programs to help you innovate, expand, and differentiate your offerings. <br></br><br></br>

              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
            </p>
            {/* <div className="tracking-visual">
          <img src="/assets/images/affiliate-tracking.png" alt="Tracking Flow" />
          <img src="/assets/icons/tracking-icon.svg" alt="Tracking" />
        </div> */}
          </section>

          {/* Analytics & Insights Section */}
          <section className="analytics-insights">
            {/* <h2>Turn Data Into Decisions</h2>
          <p>
            UpFilly’s powerful analytics give you a complete overview of your
            affiliate program’s performance. With advanced reporting and data
            visualization, you can identify top-performing affiliates, optimize
            campaigns, and drive better results. Make informed decisions with
            insights that matter.
          </p> */}
            {/* <div className="analytics-visual">
          <img src="/assets/images/analytics-graph.png" alt="Analytics Graph" />
          <div className="icons">
            <img src="/assets/icons/analytics-icon.svg" alt="Top Affiliates" />
            <img src="/assets/icons/analytics-icon.svg" alt="Campaign ROI" />
            <img src="/assets/icons/analytics-icon.svg" alt="Click-Through Rates" />
          </div>
        </div> */}

            <div className="row">
              <div className="col-md-6 platform-wrapper">
                <h1>
                  Usable Upfilly
                </h1>
                <h1>
                  Platform
                </h1>
                <p>
                  Lorem Ipsum is simply dummy text of the
                </p>
                <p>
                  printing and type lorem Ipsum is simply
                </p>
                <div className="platform-content mt-3">
                  <h2>
                    Understand Buyers
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
                <div className="platform-content">
                  <h2>
                    Attribute User Activity
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
                <div className="platform-content">
                  <h2>
                    Utilize CRM Stages
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
                <div className="platform-content-2">
                  <h2>
                    Measure Organic
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                <img className='w-75 object-fit-contain' src='/assets/img/platform-1.png' alt=''></img>
              </div>
            </div>
          </section>

          {/* Payout Management Section */}
          <section className="payout-management">
            {/* <h2>Simplify Affiliate Payouts</h2>
          <p>
            Pay your affiliates quickly and effortlessly with UpFilly’s
            automated payout system. Choose from multiple payment methods and
            let us handle the rest. Whether it’s one affiliate or hundreds,
            UpFilly ensures payments are accurate and on time, keeping your
            partners happy and engaged.
          </p> */}
            {/* <div className="payout-visual">
          <img src="/assets/images/payout-completed.png" alt="Payout Completed" />
          <img src="/assets/icons/payment-options.svg" alt="Payment Options" />
        </div> */}

            <div className="row">
              <div className="col-md-6 d-flex justify-content-start">
                <img className='w-75 object-fit-contain' src='/assets/img/platform-2.png' alt=''></img>
              </div>
              <div className="col-md-6 platform-wrapper">
                <h1>
                  Usable Upfilly
                </h1>
                <h1>
                  Platform
                </h1>
                <p>
                  Lorem Ipsum is simply dummy text of the
                </p>
                <p>
                  printing and type lorem Ipsum is simply
                </p>
                <div className="platform-content mt-3">
                  <h2>
                    Understand Buyers
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
                <div className="platform-content">
                  <h2>
                    Attribute User Activity
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
                <div className="platform-content">
                  <h2>
                    Utilize CRM Stages
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
                <div className="platform-content-2">
                  <h2>
                    Measure Organic
                  </h2>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 40 37" fill="none">
                      <path d="M18.8602 36.1695C16.0795 36.1706 13.3368 35.5237 10.8496 34.2802C8.3625 33.0366 6.19933 31.2307 4.5317 29.0055C2.86407 26.7804 1.73787 24.1973 1.24243 21.4611C0.746982 18.7249 0.895922 15.9109 1.67743 13.2422C2.45894 10.5736 3.85153 8.12384 5.74472 6.08716C7.63792 4.05048 9.97964 2.48296 12.5842 1.50892C15.1887 0.534883 17.9843 0.181131 20.7494 0.475723C23.5144 0.770314 26.1728 1.70514 28.5136 3.20606C28.7765 3.3854 28.959 3.66021 29.0224 3.97206C29.0858 4.28391 29.0251 4.60819 28.8531 4.87593C28.6811 5.14367 28.4114 5.33375 28.1014 5.40574C27.7915 5.47774 27.4656 5.42597 27.1932 5.26144C24.3026 3.41032 20.8779 2.57423 17.4594 2.88507C14.0409 3.1959 10.8232 4.63596 8.31378 6.97809C5.80438 9.32022 4.14613 12.4311 3.6006 15.8201C3.05507 19.209 3.6533 22.6832 5.30094 25.6945C6.94858 28.7058 9.55184 31.0829 12.7001 32.4508C15.8483 33.8187 19.3624 34.0995 22.688 33.2491C26.0135 32.3986 28.9613 30.4652 31.0664 27.7538C33.1714 25.0425 34.3139 21.7075 34.3135 18.2749C34.3135 17.7656 34.2886 17.2603 34.2414 16.7655C34.2171 16.6016 34.2265 16.4345 34.2688 16.2744C34.3112 16.1143 34.3856 15.9644 34.4877 15.8339C34.5897 15.7034 34.7173 15.5951 34.8625 15.5154C35.0077 15.4357 35.1677 15.3864 35.3325 15.3705C35.4974 15.3545 35.6638 15.3723 35.8216 15.4226C35.9794 15.473 36.1254 15.5549 36.2505 15.6634C36.3757 15.7719 36.4775 15.9048 36.5498 16.0538C36.622 16.2029 36.6632 16.3651 36.6708 16.5306C36.7259 17.1046 36.7535 17.6864 36.7535 18.2762C36.7472 23.0199 34.86 27.5675 31.5058 30.9218C28.1515 34.2761 23.6039 36.1632 18.8602 36.1695Z" fill="black" />
                      <path d="M20.8927 22.3423C20.7327 22.3426 20.5743 22.3112 20.4265 22.25C20.2787 22.1887 20.1445 22.0988 20.0317 21.9853L12.7106 14.6642C12.5878 14.5531 12.4889 14.4182 12.4199 14.2677C12.3508 14.1172 12.3131 13.9542 12.309 13.7887C12.3048 13.6231 12.3344 13.4585 12.3959 13.3047C12.4573 13.1509 12.5494 13.0113 12.6665 12.8942C12.7836 12.7771 12.9233 12.685 13.077 12.6236C13.2308 12.5621 13.3954 12.5325 13.561 12.5367C13.7265 12.5408 13.8895 12.5785 14.04 12.6476C14.1905 12.7166 14.3254 12.8155 14.4365 12.9383L20.8953 19.3971L37.9276 2.36478C38.1601 2.15438 38.4646 2.0414 38.778 2.04921C39.0915 2.05702 39.3899 2.18502 39.6116 2.40673C39.8333 2.62844 39.9613 2.92689 39.9691 3.24034C39.977 3.55379 39.864 3.85824 39.6536 4.09072L21.7629 21.9853C21.5335 22.2136 21.2229 22.3415 20.8993 22.341L20.8927 22.3423Z" fill="black" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Supported Integrations Section */}
          {/* <section className="supported-integrations">
            <h2>Connect with Leading Platforms</h2>
          <p>
            UpFilly integrates seamlessly with platforms like Shopify, making it
            easy to connect your store and start tracking affiliate performance.
            With quick onboarding and minimal setup, you’ll be up and running in
            no time.
          </p>
            <div className="integrations-logos">
          <img src="/assets/images/shopify-logo.svg" alt="Shopify" />
        </div>
        <img src="/assets/icons/platform-integrations.svg" alt="Integration Visual" />
          </section> */}

          {/* Call to Action Section */}

          {/* <section className="cta last-section card_box">
            <h2>Experience the Power of UpFilly</h2>
            <button
              className="cta-button"
              onClick={() => history.push("/SignupOptions")}
            >
              Get Started Now
            </button>
          </section> */}

        </div>
      </div>
    </Layout>
  );
};

export default UpFillyPage;

'use client'

import React from 'react';
import './style.css';
import Layout from '../components/global/layout';
import crendentialModel from "../../models/credential.model";

const TrackingGuide = () => {
  const user = crendentialModel.getUser()
  
  return (<Layout>
    <div className="container">
      <header className="header">
        <h1 className='trackHeading my-3'>Tracking Implementation Guide</h1>
        <p>This guide shows how to implement tracking in your Web app using cookies, URL parameters, and API requests to log user behavior.</p>
      </header>

      <section className="content mb-5">
        <h4 className='trackHeading text-left'>Step 1: Setting Master Script</h4>
        <p>Cookies allow you to store data on the user's browser. Here's how to set and get cookies in your web app.</p>

        <div className="code-block">
          <pre>
            {`// tracking your parameter data
            <script src=${`https://script.upfilly.com/${user?.id || user?._id || "{{BRAND_ID}}"}.js`} type="text/javascript" defer="defer"></script>
`}
          </pre>
        </div>

        <p>This code captures URL parameters like <code>?abcd=1234</code> and stores them as cookies for later use. For example, you can track affiliate IDs or campaign sources using this method.</p>
<hr></hr>
        <h4 className='trackHeading text-left'>Step 2: Sending Tracking Data For Upfilly</h4>
        <p>Once you have captured the necessary data (like user information, sales, or campaign data), you can send it to an external API for further processing. Here's an example using <code>XMLHttpRequest</code>:</p>

        <div className="code-block">
          <pre>
            {`// Sending tracking data to an external
            <script>
           const saleData = {
            merchant: ${user?.id || user?._id || `{{1001}}`} , // given by upfilly after signup
            affiliate_id: getCookie("affiliate_id") || "defaultAffiliate", // value not in cookies then implement this script where it get 
            amount: parseFloat(getCookie("totalAmount") || 0).toFixed(2),  // value not in cookies then implement this script where it get 
            channel: getCookie("source") || "defaultChannel",  // value not in cookies then implement this script where it get 
            currency: getCookie("currency") || "USD",  // value not in cookies then implement this script where it get 
            lead_id: getCookie("lead_id") || "defaultOrder",  // value not in cookies then implement this script where it get
            orderRef: getCookie("order_id") || "defaultOrder",  // value not in cookies then implement this script where it get 
            voucher: getCookie("voucher") || "noVoucher",  // value not in cookies then implement this script where it get 
            };

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.upfilly.com/affiliatelink", true);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Sale data successfully sent.");
            } else {
           console.error("Error sending sale data: " + xhr.statusText);
           }
           };

           xhr.send(JSON.stringify(saleData));
           </script>
`}
          </pre>
        </div>

        <p>This code sends tracking data like the sale amount, affiliate ID, and order reference to an external server. You can adjust the endpoint <code>https://api.example.com/trackSale</code> to match your tracking API.</p>
        <hr></hr>
        <h4>Step 3: Verifying Tracking</h4>
        <p>After implementing tracking, it's important to verify its functionality:</p>
        <ul>
          <li><strong>Check Cookies:</strong> Open the browser's developer tools and go to the "Application" tab (Chrome) to see the cookies set on your website.</li>
          <li><strong>Check Network Requests:</strong> Use the "Network" tab in developer tools to see if the tracking data is being sent to the server correctly.</li>
          <li><strong>Test Server Logs:</strong> Check your server logs to verify that the tracking data is being received and processed correctly.</li>
        </ul>
      </section>

      {/* <footer className="footer">
        <p>Created by [Your Name]. Follow these steps to implement tracking in your React app.</p>
      </footer> */}
    </div>
    </Layout>
  );
};

export default TrackingGuide;

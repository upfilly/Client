import React from 'react';
import './style.css';
import Layout from '../components/global/layout';

const TrackingGuide = () => {
  return (<Layout>
    <div className="container">
      <header className="header">
        <h1 className='trackHeading my-3'>Tracking Implementation Guide</h1>
        <p>This guide shows how to implement tracking in your Web app using cookies, URL parameters, and API requests to log user behavior.</p>
      </header>

      <section className="content mb-5">
        <h4 className='trackHeading text-left'>Step 1: Setting Up Cookies</h4>
        <p>Cookies allow you to store data on the user's browser. Here's how to set and get cookies in your React app.</p>

        <div className="code-block">
          <pre>
            {`// Function to set a cookie with a specified name, value, and expiration time (in days)
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration date
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"; // Set cookie with path /
}

// Function to get a cookie by name
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") == 0) {
            return cookie.substring(name.length + 1, cookie.length); // Return cookie value
        }
    }
    return "";
}`}
          </pre>
        </div>

        <p>This example demonstrates how to store and retrieve cookies in React. Use the <code>setCookie</code> function to store data (like affiliate ID, session data) and the <code>getCookie</code> function to retrieve this information.</p>

        <div className="code-block">
          <pre>
            {`// Function to get all query parameters from the URL and set them as cookies
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.slice(1); // Remove '?' from the start
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach((value, name) => {
        params[name] = value;
        // Set each query parameter as a cookie
        setCookie(name, value, 30); // Set cookie with 30 days expiration
    });
    return params;
}

// Example usage
const queryParams = getQueryParams();  // Get query parameters from the URL and set them as cookies
console.log("Query Parameters: ", queryParams);`}
          </pre>
        </div>

        <p>This code captures URL parameters like <code>?abcd=1234</code> and stores them as cookies for later use. For example, you can track affiliate IDs or campaign sources using this method.</p>
<hr></hr>
        <h4 className='trackHeading text-left'>Step 2: Sending Tracking Data For Upfilly</h4>
        <p>Once you have captured the necessary data (like user information, sales, or campaign data), you can send it to an external API for further processing. Here's an example using <code>XMLHttpRequest</code>:</p>

        <div className="code-block">
          <pre>
            {`// Sending tracking data to an external API
            <script>
const saleData = {
    merchant: {{1001}}, // given by upfilly after signup
    affiliate_id: getCookie("affiliate_id") || "defaultAffiliate",
    amount: parseFloat(getCookie("totalAmount") || 0).toFixed(2),
    channel: getCookie("source") || "defaultChannel",
    currency: getCookie("currency") || "USD",
    orderRef: getCookie("order_id") || "defaultOrder",
    voucher: getCookie("voucher") || "noVoucher"
};

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.example.com/trackSale", true);
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
        <h4>Step 4: Verifying Tracking</h4>
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

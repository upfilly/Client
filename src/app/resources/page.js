'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout';
import { useRouter } from 'next/navigation';

const resourcesData = [
  {
    id: 1,
    image: "/assets/img/reso1.png",
    description: "Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!",
    link: "#"
  },
  {
    id: 2,
    image: "/assets/img/reso1.png",
    description: "Join our webinars to stay updated on the latest trends in the television industry.",
    link: "#"
  },
];

const shopifyTrackingInfo = {
  title: "About Our Shopify Tracking App",
  description: "Our Shopify tracking app helps you monitor customer interactions, optimize your marketing strategies, and boost your sales. With detailed analytics and easy integration, you can gain insights into user behavior and enhance your store's performance.",
  features: [
    "Real-time tracking of customer actions",
    "In-depth analytics and reporting",
    "Seamless integration with Shopify",
    "Customizable tracking parameters",
    "User-friendly interface for easy management"
  ],
  link: "/shopifyGuide",
};

export default function Resources() {
  const history = useRouter()
  const handleTrackResource = (resourceId) => {
    // Replace 'trackEvent' with the actual tracking function if necessary
    // trackEvent('Resource Viewed', { resourceId }); // Example tracking
    console.log(`Resource viewed: ${resourceId}`); // For demo purposes
  };

  const handleReadMoreClick = (resourceId) => {
    handleTrackResource(resourceId);
    // Optionally, you could navigate to the link here if needed
  };

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className="feature-page resource-page">
      <div className='container'>
          {/* Core Features Section */}
          <section className="core-features">
            <header className="core-features-header">
              <h1 className="core-features-title mb-3">Powerful Tools to Drive Your Affiliate Success</h1>
              <h2 className="core-features-subtitle">
                UpFilly offers everything you need to track, analyze, and optimize your affiliate program—all in one place.
              </h2>
            </header>
            <div className="features-list">
              <div className="feature-item">
                <h3>Affiliate Tracking</h3>
                <p>Monitor clicks, sales, and commissions in real-time, ensuring transparency and precision.</p>
              </div>
              <div className="feature-item">
                <h3>Advanced Analytics</h3>
                <p>Gain actionable insights to refine your strategies and improve campaign performance.</p>
              </div>
              <div className="feature-item">
                <h3>Seamless Payouts</h3>
                <p>Automate affiliate payments with minimal effort, keeping your partners happy and motivated.</p>
              </div>
            </div>
          </section>

          {/* Integrations Section */}
          <section className="scalability mt-5">
            <header>
              <h2 className="section-title">Integrate Seamlessly with Your Existing Platforms</h2>
            </header>
            <div>
              <h3>Shopify Integration</h3>
              <p>Easily connect your Shopify store for precise tracking and analytics.</p>
            </div>
          </section>

          {/* Scalability Section */}
          <section className="scalability my-5">
            <header>
              <h2 className="section-title">Built to Grow with Your Business</h2>
            </header>
            <div>
              <p>UpFilly is designed to support businesses of all sizes—from startups launching their first affiliate program to enterprise-level brands managing complex networks.</p>
              <ul>
                <li>Affordable entry plans with no setup fees (for startups).</li>
                <li>Robust tools to handle high-volume campaigns (enterprise-ready).</li>
              </ul>
            </div>
          </section>

          {/* User-Friendly Interface Section */}
          <section className="scalability">
            <header>
              <h2 className="section-title">An Intuitive Dashboard for Merchants and Affiliates</h2>
            </header>
            <div>
              <p>Our dashboard is designed to be simple, yet powerful, providing all the tools you need to manage and optimize your program.</p>
              <div>
                <h3>For Merchants:</h3>
                <p>Customizable branding options to align with your identity.</p>
              </div>
              <div>
                <h3>For Affiliates:</h3>
                <p>A clean interface to track earnings and access campaign insights.</p>
              </div>
            </div>
          </section>

          {/* Call-to-Action Section */}
          <section className="cta mt-5">
            <header className="cta-header">
              <h1 className="cta-title">Explore UpFilly’s Features Today</h1>
              <h2 className="cta-subtitle">Discover how our platform can take your affiliate marketing to the next level.</h2>
            </header>
            <div className="cta-buttons">
              <button className="cta-btn primary" onClick={() => history.push("/SignupOptions")}>Get Started Now</button>
              {/* <button className="cta-btn secondary">Learn More About Features</button> */}
            </div>
          </section>
          <div className='pricing-padding'>
          

            {/* Shopify Tracking App Section */}
            <div className='row cpadd pt-3'>
              <div className='col-md-12'>
                <div className='card_box text-center hover_box'>
                  <h2 className='mb-3'>{shopifyTrackingInfo.title}</h2>
                  <p>{shopifyTrackingInfo.description}</p>
                  <ul className='list-unstyled mb-4'>
                    {shopifyTrackingInfo.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <a href={shopifyTrackingInfo.link} className='cta-button'>Learn More</a>
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

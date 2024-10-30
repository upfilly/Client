'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout';

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
        <div className='pricing-padding'>
          <div className='container'>
            <div className="row align-items-center">
              <div className='main-title text-center mb-3'>
                <h1>Business Resources</h1>
                <p className='printit'>
                  Discover a wealth of tools and information designed to support your business endeavors.
                  Whether you're a startup or an established enterprise, our curated resources can help you navigate challenges,
                  enhance productivity, and drive growth.
                </p>
              </div>
            </div>

            <div className='row cpadd pt-3'>
              <div className='col-md-12'>
                <div className='need_contactus'>
                  <div className='row'>
                    {resourcesData.map(resource => (
                      <div key={resource.id} className='col-sm-12 col-md-6 col-lg-4 col-xl-3'>
                        <div className='card_box text-center hover_box'>
                          <div className='imgtag_card'>
                            <img src={resource.image} className='img-fluid heighteual mb-0' alt={`Resource ${resource.id}`} />
                            <p>{resource.description}</p>
                            <a
                              href={resource.link}
                              className='btn btn-primary'
                              onClick={() => handleReadMoreClick(resource.id)} // Track click
                            >
                              Read More
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Shopify Tracking App Section */}
            <div className='row cpadd pt-3'>
              <div className='col-md-12'>
                <div className='card_box text-center hover_box'>
                  <h2>{shopifyTrackingInfo.title}</h2>
                  <p>{shopifyTrackingInfo.description}</p>
                  <ul className='list-unstyled'>
                    {shopifyTrackingInfo.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <a href={shopifyTrackingInfo.link} className='btn btn-primary'>Learn More</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    </>
  );
}

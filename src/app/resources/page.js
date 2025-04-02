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


        {/* Overview Section */}
        <section className=" bgdots">

          <div className="minus_margin container">

            <h5 className="innerhtmls">Powerful Tools to Drive Your Affiliate  <p className="d-block "> Success</p></h5>


            <p className="para3">
              UpFilly offers everything you need to track, analyze, and optimize your affiliate program—all in one place.
            </p>


          </div>


        </section>


        <section className='rowmeatures'>
          <div className='container'>
            <div className='row'>
              <div className='col-12 col-md-4'>
                <div className='fetausinners'>
                  <h6 className='linetext'>Affiliate Tracking</h6>
                  <p>Monitor clicks, sales, and commissions in real-time, ensuring transparency and precision.</p>
                </div>
              </div>

              <div className='col-12 col-md-4'>
                <div className='fetausinners'>
                  <h6 className='linetext'>Affiliate Tracking</h6>
                  <p>Monitor clicks, sales, and commissions in real-time, ensuring transparency and precision.</p>
                </div>
              </div>

              <div className='col-12 col-md-4'>
                <div className='fetausinners'>
                  <h6 className='linetext'>Affiliate Tracking</h6>
                  <p>Monitor clicks, sales, and commissions in real-time, ensuring transparency and precision.</p>
                </div>
              </div>


            </div>
          </div>


        </section>



        <div className="container my-5">

          <div className="row align-items-center cuspadding">
            <div className="col-md-6 text-center">
              <img src="/assets/img/f2.png" className="img-fluid rounded" alt="Shopify Integration" />
            </div>
            <div className="col-md-6">
              <h3 className="shopify-title">Integrate Seamlessly with Your Existing Platforms</h3>
              <p className="highlight-text">Shopify Integration</p>
              <p>Easily connect your Shopify store for precise tracking and analytics.</p>
            </div>
          </div>

          <div className="row align-items-center cuspadding pt-0 flex-md-row-reverse">
            <div className="col-md-6 text-center">
              <img src="/assets/img/f1.png" className="img-fluid rounded" alt="Business Growth" />
            </div>
            <div className="col-md-6">
              <h3 className="shopify-title">Built to Grow with Your Business</h3>

              <p>UpFilly is designed to support businesses of all sizes—from startups launching their first affiliate program to enterprise-level brands managing complex networks.</p>
              <ul className="custom-list">
                <li>
                  <img src="/assets/img/cheks.svg" className="img-fluid rounded" alt="cheks" />
                  Affordable entry plans with no setup fees for startups.
                </li>
                <li>
                  <img src="/assets/img/cheks.svg" className="img-fluid rounded" alt="cheks" />
                  Robust tools to handle high-volume campaigns.
                </li>
              </ul>

            </div>
          </div>

          <div className="row align-items-center cuspadding pt-0">
            <div className="col-md-6 text-center">
              <img src="/assets/img/f3.png" className="img-fluid rounded" alt="Dashboard for Merchants and Affiliates" />
            </div>
            <div className="col-md-6">
              <h3 className="shopify-title">An Intuitive Dashboard for Merchants and Affiliates</h3>
              <p>Our dashboard is designed to be simple yet powerful, providing all the tools you need to manage and optimize your program.</p>
              <div className='d-flex gap-3 align-items-center mb-4 mt-4'>
                 <img src="/assets/img/cheks.svg" className="checimg" alt="cheks" />
                 <div className='heavy_fonts'>
                    <p className='heads'>For Merchants:</p> 
                    <p className='mb-0'>Customizable branding options.</p>
                 </div>
              </div>

              <div className='d-flex gap-3 align-items-center mb-4'>
                 <img src="/assets/img/cheks.svg" className="checimg" alt="cheks" />
                 <div className=''>
                    <p className='heads'>For Affiliates:</p> 
                    <p className='mb-0'>A clean interface to track earnings and access campaign insights.</p>
                 </div>
              </div>



             
            </div>
          </div>
        </div>






        <div className="feature-page resource-page">
          <div className='container'>




            {/* Call-to-Action Section */}
            <section className="cta mt-5">
              <div className="cta-header">
                <h1 className="cta-title">Explore UpFilly’s Features Today</h1>
                <h2 className="cta-subtitle">Discover how our platform can take your affiliate marketing to the next level.</h2>
              </div>
              <div className="mt-5">
                <button className="cta-button" onClick={() => history.push("/SignupOptions")}>Get Started Now</button>
                {/* <button className="cta-btn secondary">Learn More About Features</button> */}
              </div>
            </section>







          </div>
        </div>


        <div className="cuspadding container">
          <div className=' bggraylight'>
            {/* Shopify Tracking App Section */}
            <div className='row  align-items-center'>
              <div className='col-12 col-md-6'>
                <div className='fetaues_lasts'>
                  <h6 className=''>{shopifyTrackingInfo.title}</h6>
                  <p>{shopifyTrackingInfo.description}</p>
                </div>

              </div>

              <div className='col-12 col-md-6'>
                <div className='card_box text-center hover_box'>

                  <ul className='feyusul mb-4'>
                    {shopifyTrackingInfo.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>

                </div>
              </div>

              <div className='col-12 mt-5'>
                <div className='text-center'>

                  <a href={shopifyTrackingInfo.link} className='cta-button'>Learn More</a>
                </div>
              </div>


            </div>

          </div>
        </div>

      </Layout>
    </>
  );
}

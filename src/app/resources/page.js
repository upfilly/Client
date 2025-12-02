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
  link: "/shopifyguide",
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

            <h5 className="innerhtmls">Powerful Tools to Drive Your Affiliate Success</h5>


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


        <section className="benefits container">
          <div className="cuspadding2 pb-0 ">
            <div className="row align-items-center">
              <div className="col-12 col-md-6 col-lg-6">
                <img src="assets/img/f2.png" className="fetures_imgs " />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <h2 className="text-left lefttext text-md-left text-center mb-2 mb-md-4">Integrate Seamlessly with Your Existing Platforms
                </h2>
                <div className="subs-content text-md-left text-center">
                  <div className="d-flex gap-2 align-items-start">
                    <div>
                      <h5>Shopify Integration</h5>
                      <h6>Easily connect your Shopify store for precise tracking and analytics.</h6>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="benefits container">
          <div className="cuspadding2 pb-0 ">
            <div className="row align-items-center flex-md-row-reverse">
              <div className="col-12 col-md-6 col-lg-6">
                <img src="assets/img/f1.png" className="fetures_imgs " />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <h2 className="text-left lefttext text-center text-md-left mb-2 mb-md-4">Built to Grow with Your Business
                </h2>
                <div className="subs-content">
                  <div className="d-flex gap-2 align-items-center">
                    <div className='text-center text-md-left'>

                      <h6>UpFilly is designed to support businesses of all sizes—from startups launching their first affiliate program to enterprise-level brands managing complex networks.</h6>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-center mt-3 mt-md-4">
                    <span>
                      <img src="/assets/img/cheks.svg" className="checimg" alt=""></img>
                    </span>
                    <div>
                      <h6 className='mb-0'>Affordable entry plans with no setup fees for startups. </h6>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-center mt-3">
                    <span>
                      <img src="/assets/img/cheks.svg" className="checimg" alt=""></img>
                    </span>
                    <div>
                      <h6 className='mb-0'>Robust tools to handle high-volume campaigns. </h6>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>



        <section className="benefits container">
          <div className="cuspadding2 ">
            <div className="row align-items-center ">
              <div className="col-12 col-md-6 col-lg-6">
                <img src="assets/img/f3.png" className="fetures_imgslast " />
              </div>
              <div className="col-12 col-md-6 col-lg-6">
                <h2 className="text-left lefttext mb-2 text-center text-md-left mb-2 mb-md-4">An Intuitive Dashboard for Merchants and Affiliates
                </h2>
                <div className="subs-content">
                  <div className="d-flex gap-2 align-items-center">
                    <div className='text-center text-md-left'>

                      <h6>Our dashboard is designed to be simple yet powerful, providing all the tools you need to manage and optimize your program.</h6>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-start mt-3 mt-md-4">
                    <span>
                      <img src="/assets/img/cheks.svg" className="checimg" alt=""></img>
                    </span>
                    <div>
                      <h5>For Merchants:</h5>
                      <h6>Customizable branding options. </h6>
                    </div>
                  </div>

                  <div className="d-flex gap-2 align-items-start">
                    <span>
                      <img src="/assets/img/cheks.svg" className="checimg" alt=""></img>
                    </span>
                    <div>
                      <h5>For Affiliates:</h5>
                      <h6>A clean interface to track earnings and access campaign insights. </h6>
                    </div>
                  </div>



                </div>

              </div>
            </div>
          </div>
        </section>



        <div className="feature-page resource-page">
          <div className='container'>

            {/* Call-to-Action Section */}
            <section className="cta ">
              <div className="cta-header">
                <h1 className="cta-title">Explore UpFilly’s Features Today</h1>
                <h2 className="cta-subtitle">Discover how our platform can take your affiliate marketing to the next level.</h2>
              </div>
              <div className="mt-sm-5 mt-4">
                <button className="cta-button" onClick={() => history.push("/SignupOptions")}>Get Started Now</button>
                {/* <button className="cta-btn secondary">Learn More About Features</button> */}
              </div>
            </section>







          </div>
        </div>


        <div className="cuspadding2 container">
          <div className=' bggraylight'>
            {/* Shopify Tracking App Section */}
            <div className='row  align-items-center'>
              <div className='col-12 col-md-6'>
                <div className='fetaues_lasts text-center text-md-left'>
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

              <div className='col-12 mt-4 mt-md-5'>
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

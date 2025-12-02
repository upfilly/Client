import React from 'react';
import './TrackingGuide.css';
import Layout from '../components/global/layout';

const ShopifyGuide = () => {
    return (<>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className="tracking-setup">
                <h1 className="heading">How to Set Up Tracking on Shopify</h1>

                <div className="step">
                    <h2 className="step-title">Step 1: Install the App</h2>
                    {/* <img src="/assets/img/screenGuide.png" alt="Install App" /> */}
                    <p className="step-description">Go to the Shopify App Store and search for the upfilly affiliate tracking app.</p>
                    <p className="step-description">Click on "Add app" and follow the prompts to install it in your store.</p>
                </div>

                <div className="step">
                    <h2 className="step-title">Step 2: Enter Your Advertiser ID</h2>
                    <img src="/assets/img/screenGuide.png" alt="Enter Advertiser ID" className="step-image" />
                    <p className="step-description">After installation, navigate to the app's settings in your Shopify admin panel.</p>
                    <p className="step-description">Locate the field for the Advertiser ID and enter your unique ID.</p>
                </div>

                <div className="step">
                    <h2 className="step-title">Step 3: Start Tracking</h2>
                    <img src="/assets/img/screenGuide.png" alt="Start Tracking" className="step-image" />
                    <p className="step-description">Once you’ve entered your Advertiser ID, save your settings.</p>
                    <p className="step-description">Your app will now begin tracking data on your Shopify store!</p>
                </div>
            </div>
        </Layout></>
    );
};

export default ShopifyGuide;

import React from 'react';
import Layout from '../components/global/layout';
import "./style.scss";

const TermConditions = () => {

    return (
        <Layout>
            <div className="terms-conditions-container">
                <header className="header">
                    <h1>Terms and Conditions</h1>
                </header>
                <section className="section">
                    <h2>Introduction</h2>
                    <p>
                        Welcome to the Upfilly.com Privacy Notice (“Privacy Notice”). Upfilly.com LLC (“Upfilly.com,” “Upfilly,” “we,”
                        “us,” or “our”) is an affiliate marketing company. We’ve created this resource to provide you with valuable
                        transparency and choice on how we might collect, use, and share your personal information as a consumer (or
                        visitor) to the website(s) of one of our affiliate publishers or advertisers.
                    </p>
                </section>

                <section className="section">
                    <h2>Scope of this Privacy Notice</h2>
                    <p>
                        This Privacy Policy is intended to describe how your personal information as a consumer is collected and used
                        by Upfilly.com while providing our affiliate marketing services. We believe that your privacy and data protection
                        is essential to the growth and prosperity of the internet, and that a great online experience can provide significant
                        benefits to consumers when done properly. In accordance with these beliefs, Upfilly.com strives to create results
                        for publishers, advertisers, and consumers in revolutionary ways without compromising privacy.
                    </p>
                </section>

                <section className="section">
                    <h2>Overview of Upfilly.com and Affiliate Marketing</h2>
                    <p>
                        When you visit websites and mobile applications, there are almost always third parties working behind the scenes
                        to help provide a great digital experience. Upfilly.com is one of these companies, and we offer affiliate marketing
                        technology and services that keep your favorite blogs free, your favorite stores in business, and your experience
                        with brands more relevant.
                    </p>
                </section>

                <section className="section">
                    <h2>Privacy by Design</h2>
                    <p>
                        Upfilly.com integrates privacy into all aspects of our business, including strategy, product development, and delivery.
                        We do not collect, store, process, or allow in our systems any of your personally identifiable information (DII).
                        We collect only pseudonymous information to maintain your privacy and ensure our services remain efficient.
                    </p>
                </section>

                <section className="section">
                    <h2>Information Collection & Use</h2>
                    <p>
                        Upfilly.com collects pseudonymous information, including but not limited to IP addresses, cookie IDs, and browsing activity
                        to understand consumer behavior without directly identifying individuals. We do not collect personally identifiable
                        information unless it is voluntarily provided by you.
                    </p>
                </section>

                <section className="section">
                    <h2>Information Sharing</h2>
                    <p>
                        We may share personal information with service providers, partners, affiliates, and for legal purposes as described in
                        this Privacy Notice. Information may also be shared for fraud prevention and safety, or in the event of corporate transactions.
                    </p>
                </section>

                <section className="section">
                    <h2>Protecting Personal Information</h2>
                    <p>
                        We employ physical and electronic security measures such as encryption and access controls to safeguard personal data
                        collected through our affiliate marketing services.
                    </p>
                </section>

                <section className="section">
                    <h2>Notice to California Residents</h2>
                    <p>
                        California residents have certain rights under the California Consumer Privacy Act of 2018 (CCPA), including the
                        right to access, delete, and opt-out of the "sale" of their personal information.
                    </p>
                </section>

                <section className="section">
                    <h2>Modifications to this Privacy Notice</h2>
                    <p>
                        We may update this Privacy Notice from time to time. Any changes will be effective once posted on our website.
                    </p>
                </section>

                <section className="section">
                    <h2>Contact Us</h2>
                    <p>
                        For any questions regarding this Privacy Notice, please contact us at <a href="mailto:privacy@upfilly.com">privacy@upfilly.com</a>.
                    </p>
                </section>

                {/* <footer className="footer">
                    <p>&copy; 2025 Upfilly.com. All rights reserved.</p>
                </footer> */}
            </div>
        </Layout>)

}

export default TermConditions


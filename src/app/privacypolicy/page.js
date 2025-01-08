import React from 'react';
import Layout from '../components/global/layout';
import "./style.scss";

const PrivacyPolicy = () => {

    return (
        <Layout>
            <div className="privacy-policy-container">
                <header className="header">
                    <h1>Privacy Policy</h1>
                </header>
                <section className="section">
                    <h2>Introduction</h2>
                    <p>
                        Welcome to Upfilly. Your privacy is important to us. This Privacy Policy explains how we collect,
                        use, and safeguard your personal information when you visit our website.
                    </p>
                </section>
                <section className="section">
                    <h2>Information We Collect</h2>
                    <p>
                        We may collect personal information such as your name, email address, and IP address when you interact
                        with our site. We also use cookies to enhance your experience and analyze website usage.
                    </p>
                </section>
                <section className="section">
                    <h2>How We Use Your Information</h2>
                    <p>
                        Your information helps us to improve our site, respond to inquiries, and personalize your experience. We do
                        not sell or share your information with third parties without your consent, except as required by law.
                    </p>
                </section>
                <section className="section">
                    <h2>Cookies</h2>
                    <p>
                        We use cookies to enhance your experience. A cookie is a small file stored on your device that helps us
                        analyze website traffic and track usage patterns. You can choose to disable cookies through your browser settings.
                    </p>
                </section>
                <section className="section">
                    <h2>Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information from unauthorized access,
                        alteration, or destruction.
                    </p>
                </section>
                <section className="section">
                    <h2>Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal data. If you wish to exercise any of these rights,
                        please contact us using the details provided on our website.
                    </p>
                </section>
                <section className="section">
                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated
                        policy will take effect immediately upon posting.
                    </p>
                </section>
                {/* <footer className="footer">
                    <p>&copy; 2025 Upfilly. All rights reserved.</p>
                </footer> */}
            </div>

        </Layout>)

}

export default PrivacyPolicy
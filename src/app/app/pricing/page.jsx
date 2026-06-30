'use client'

import React from 'react';
import Layout from '../../components/global/layout';

export default function ShopifyPricing() {
  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name="Shopify Pricing"
      filters={undefined}
    >
      <div style={styles.pageContainer}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerLeft}>
            <h1 style={styles.mainTitle}>What is affiliate marketing?</h1>
            <p style={styles.subtitle}>
              <a href="#" style={styles.link}>Affiliate marketing</a> gets your online store in front of the right audience.
            </p>
            <p style={styles.description}>
              Connect with thousands of online partners such as websites, influencers and bloggers who can promote your products to their engaged online audiences. Driving more traffic and reaching new customers that you may not have access to through your usual online marketing.
            </p>
          </div>
          <div style={styles.headerRight}>
            {/* Using a placeholder text for Shopify Partners or text */}
            <div style={styles.shopifyPartners}>
              <span style={styles.shopifyLogo}>🛍️</span> <strong>shopify</strong> partners
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div style={styles.stepsContainer}>
          <div style={styles.stepCard}>
            <div style={styles.stepHeader}>
              <span style={styles.stepIcon}>🤝</span>
              <h3 style={styles.stepTitle}>Step 1: Join Upfilly</h3>
            </div>
            <p style={styles.stepDesc}>
              Apply via the form below and someone will be in touch to get you started with your advertiser account.
            </p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepHeader}>
              <span style={styles.stepIcon}>⚙️</span>
              <h3 style={styles.stepTitle}>Step 2: Setup your Upfilly Shopify app</h3>
            </div>
            <p style={styles.stepDesc}>
              Follow the simple integration wizard to sync your advertiser account with your app.
            </p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepHeader}>
              <span style={styles.stepIcon}>🚀</span>
              <h3 style={styles.stepTitle}>Step 3: Grow online sales, report and measure</h3>
            </div>
            <p style={styles.stepDesc}>
              Our easy to use platform will track, pay and report on your affiliate partnerships in one place.
            </p>
          </div>
        </div>

        {/* Pricing Info Section */}
        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>What are the costs to join Upfilly?</h2>
          <p style={styles.infoText}>
            Upfilly has a selection of solutions for varying business sizes and requirements.
          </p>
          <p style={styles.infoText}>
            You have been referred by Shopify to our self-managed solution for small businesses, Upfilly Access. Please submit your details through the form below to check if you qualify. You will then receive further instructions to get setup on Upfilly Access, or a guide on a suitable alternative for you.
          </p>

          <p style={styles.infoTextHighlight}>
            Join Upfilly Access today and get <u>free use of the platform for the first month</u>
          </p>

          <ul style={styles.list}>
            <li>Free to join</li>
            <li>$0 platform fee for the first month ($89 +VAT a month after this)</li>
            <li>3.5% Upfilly tracking fee*</li>
            <li>3 month minimum term</li>
          </ul>

          <p style={styles.finePrint}>
            *You choose the commission to pay your affiliate partners as a percentage of the transaction value. The Upfilly tracking fee is an additional 3.5% of the transaction value.
            <br /><br />
            <em>For example, if you wish to pay 6% of the transaction value to your affiliate partners and the transaction was $100, $6 would go to the affiliate partner and $3.50 to Upfilly.</em>
            <br /><br />
            <em>Please note - if you operate a business within finance or telecommunications where no transaction value exists, alternative rates will be shared.</em>
          </p>

          <h3 style={styles.benefitsTitle}>The benefits of Upfilly Access</h3>
          <ul style={styles.list}>
            <li>Our customers are getting $14 back for every $1 spent</li>
            <li>Test affiliate marketing with peace of mind and a short 3-month minimum term</li>
            <li>No experience needed</li>
            <li>Perfect for time-short business owners looking to grow online sales</li>
          </ul>

          <p style={styles.finePrint}>
            *You choose the commission to pay your affiliate partners as a % of the transaction value. The Upfilly tracking fee is an additional 2.5% of the transaction value.
            <br /><br />
            For example, if you wish to pay 6% of the transaction value to your affiliate partners and the transaction was $100, $6 would go to the affiliate partner and $2.50 to Upfilly.
            <br /><br />
            If you operate a business within finance or telecommunications where no transaction value exists, alternative rates will be shared.
          </p>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  pageContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#333',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '50px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  headerLeft: {
    flex: '1 1 600px',
  },
  headerRight: {
    flex: '0 0 auto',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#111',
  },
  subtitle: {
    fontSize: '15px',
    marginBottom: '15px',
  },
  link: {
    color: '#666',
    textDecoration: 'underline',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#555',
    maxWidth: '700px',
  },
  shopifyPartners: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '20px',
    color: '#95bf47', // Shopify green
  },
  shopifyLogo: {
    fontSize: '24px',
  },
  stepsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '30px',
    marginBottom: '60px',
    flexWrap: 'wrap',
  },
  stepCard: {
    flex: '1 1 250px',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  stepIcon: {
    fontSize: '24px',
    color: '#6B46C1', // Purple tone similar to the image icons
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#444',
  },
  stepDesc: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: '#666',
  },
  infoSection: {
    maxWidth: '800px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
  infoText: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '15px',
    color: '#444',
  },
  infoTextHighlight: {
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '15px',
    color: '#444',
  },
  list: {
    paddingLeft: '20px',
    marginBottom: '25px',
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#444',
  },
  finePrint: {
    fontSize: '12px',
    lineHeight: '1.6',
    color: '#777',
    marginBottom: '30px',
    fontStyle: 'italic',
  },
  benefitsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333',
  },
};

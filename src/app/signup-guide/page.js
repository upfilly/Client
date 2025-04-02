'use client'

import "./style.scss";
import { useRouter } from 'next/navigation'
import Layout from '../components/global/layout';

export default function AboutUs() {
  const router = useRouter()

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className="guide-container mb-5">
          
          {/* Affiliate Guide Section */}
          <div className="affiliate-guide-container">
            <h1 className="title">Affiliate Guide</h1>
            <h2 className="subtitle">Joining UpFilly as an Affiliate</h2>
            <ol className="steps-list">
              <li>
                <h3>1. Sign Up and Set Up Your Profile:</h3>
                <ul>
                  <li>Visit UpFilly.com and click "Join as Affiliate."</li>
                  <li>Complete the sign-up process, including details about your promotional channels (blogs, social media, etc.).</li>
                </ul>
              </li>
              <li>
                <h3>2. Find Campaigns:</h3>
                <ul>
                  <li>Log into your dashboard and explore available merchant campaigns.</li>
                  <li>Filter campaigns by category, commission rate, or popularity.</li>
                </ul>
              </li>
              <li>
                <h3>3. Apply to Campaigns:</h3>
                <ul>
                  <li>Click "Join Campaign" to submit your application.</li>
                  <li>Wait for merchant approval.</li>
                </ul>
              </li>
              <li>
                <h3>4. Start Promoting:</h3>
                <ul>
                  <li>Access affiliate links, banners, and other creatives in your dashboard.</li>
                  <li>Share links across your preferred promotional platforms.</li>
                </ul>
              </li>
              <li>
                <h3>5. Track Your Performance:</h3>
                <ul>
                  <li>Use the dashboard to monitor clicks, sales, and commissions.</li>
                  <li>Adjust your efforts based on performance reports.</li>
                </ul>
              </li>
              <li>
                <h3>6. Receive Payments:</h3>
                <ul>
                  <li>Set up your preferred payment method in the "Payment Settings" section.</li>
                  <li>Payments are processed on the merchant's payout schedule.</li>
                </ul>
              </li>
            </ol>
          </div>
          
          {/* Merchant Guide Section */}
          <div className="merchant-guide-container">
            <h1 className="title">Merchant Guide</h1>
            <h2 className="subtitle">Getting Started with UpFilly</h2>
            <ol className="steps-list">
              <li>
                <h3>1. Sign Up and Set Up Your Account:</h3>
                <ul>
                  <li>Visit UpFilly.com and click "Sign Up."</li>
                  <li>Complete the registration process by entering your business details and verifying your email.</li>
                  <li>Customize your profile with branding options.</li>
                </ul>
              </li>
              <li>
                <h3>2. Create Your Affiliate Program:</h3>
                <ul>
                  <li>Navigate to the "Create Program" section on the dashboard.</li>
                  <li>Define your commission structure: Choose between a commission-only model (x%) or a subscription-based model (y% + monthly fee).</li>
                  <li>Add campaign details, including product information and terms for affiliates.</li>
                </ul>
              </li>
              <li>
                <h3>3. Connect Your Store:</h3>
                <ul>
                  <li>Integrate with Shopify or use our API for custom platforms.</li>
                  <li>Follow simple instructions for seamless setup.</li>
                </ul>
              </li>
              <li>
                <h3>4. Track and Optimize:</h3>
                <ul>
                  <li>Monitor performance through the real-time dashboard for clicks, sales, and commissions.</li>
                  <li>Use detailed analytics and performance reports to optimize campaigns.</li>
                </ul>
              </li>
              <li>
                <h3>5. Payout Affiliates:</h3>
                <ul>
                  <li>Set up payment preferences (e.g., PayPal, bank transfer).</li>
                  <li>Automate payouts through the "Payout Management" section.</li>
                </ul>
              </li>
            </ol>
            
            {/* Managed Subscriptions for Merchants Section */}
            <h2 className="subtitle">Managed Subscriptions for Merchants</h2>
            <ol className="steps-list">
              <li>
                <h3>1. Choose Your Package:</h3>
                <ul>
                  <li>Standard Plan: Fixed monthly fee.</li>
                  <li>Custom Request: Tailored to your unique needs.</li>
                </ul>
              </li>
              <li>
                <h3>2. Collaborate with Specialists:</h3>
                <ul>
                  <li>Schedule weekly strategy calls to discuss program performance.</li>
                  <li>Receive comprehensive campaign and affiliate performance reports.</li>
                </ul>
              </li>
              <li>
                <h3>3. Optimize for Growth:</h3>
                <ul>
                  <li>Work with experts to refine strategies, maximize ROI, and scale your affiliate program.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </Layout>
    </>
  );
}

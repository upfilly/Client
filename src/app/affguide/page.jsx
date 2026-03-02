import React from "react";
import Layout from "../components/global/layout";
import "./affiliateguide.css";

const affiliateguide = () => {
  return (
    <Layout>
      <div className="affiliate-container">
        <h1>What Is Affiliate Marketing and How Does It Work?</h1>
        <p className="intro-text">
          Affiliate marketing is a simple but powerful way to grow a business —
          and earn money by promoting the products you love. Whether you're a
          brand looking to scale or a content creator wanting to monetize your
          audience, affiliate marketing connects the two sides in a win-win
          partnership.
        </p>

        {/* <h2>Let's break it down.</h2> */}

        <div className="content-section">
          {/* <div className="info-block">
            <h3>The Basics</h3>
            <ul>
              <li>A merchant (brand) sets up an affiliate program — offering a commission for every sale that comes from a partner's referral.</li>
              <li>An affiliate (creator, blogger, influencer) joins the program and gets a special tracking link.</li>
              <li>The affiliate promotes the product through content, ads, or social media.</li>
              <li>When someone clicks that link and makes a purchase, the affiliate gets paid.</li>
            </ul>
            <p>It's like word-of-mouth marketing — but smarter, scalable, and trackable.</p>
          </div> */}

          <div class="info-block">
            <h3>Who this is for</h3>
            <p>Upfilly is for:</p>

            <div class="grid grid-cols-2 gap-4">
              <ul class="list-disc pl-5 m-0">
                <li>Content creators</li>
                <li>Bloggers</li>
                <li>Influencers</li>
                <li>Media buyers</li>
                <li>Coupon and deal websites</li>
                <li>Technology Partners</li>
                <li>Browser Extensions</li>
              </ul>
              <ul class="list-disc pl-5 m-0">
                <li>Programmatic</li>
                <li>Review Sites</li>
                <li>Subnetworks</li>
                <li>Loyalty or Cashback Sites</li>
                <li>Search Affiliates</li>
                <li>Comparison shopping</li>
                <li>News & Media Sites</li>
              </ul>
            </div>
          </div>

          <div className="info-block">
            <h3>How affiliates make money on Upfilly</h3>
            <ul>
              <li>
                Join → apply to programs → get tracking links → promote → earn
                commissions → get paid
              </li>
              <li>
                Upfilly tracks your performance and ensures commissions are
                calculated accurately.
              </li>
            </ul>
          </div>

          <div className="info-block">
            <h3>What you get as an affiliate</h3>
            <ul>
              <li>Access to merchant affiliate programs</li>
              <li>Unique tracking links for every offer</li>
              <li>Real-time performance statistics</li>
              <li>Transparent commission reporting</li>
              <li>Reliable and timely payouts</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>What you need before signup</h3>
            <p>To get started, you’ll need:</p>
            <ul>
              <li>A website, social account, or traffic source</li>
              <li>Basic profile information</li>
              <li>A payout method</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>Affiliate signup steps</h3>
            <ul>
              <li>Create an account</li>
              <li>Complete your affiliate profile</li>
              <li>Verify your email address</li>
              <li>Set your payout method</li>
              <li>Apply to affiliate programs</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>After the signup checklist</h3>
            <ul>
              <li>Complete your profile fully</li>
              <li>Choose a clear niche</li>
              <li>Apply to 3–5 relevant programs</li>
              <li>Generate your tracking links</li>
              <li>Publish your first promotion</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>Rules & compliance</h3>
            <ul>
              <li>Prohibited or fraudulent traffic is not allowed</li>
              <li>Brand bidding rules must be respected</li>
              <li>Coupon and deal policies vary by merchant</li>
              <li>Proper affiliate disclosures are required</li>
              <li>Violations may result in account suspension</li>
            </ul>
          </div>
          <div className="info-block">
            <h3 className="mb-4">Affiliate FAQs</h3>
            <ul className="space-y-3">
              <li>
                <p>
                  <strong>How do payouts work?</strong> <br />
                  Commissions are paid once approved and after reaching the
                  minimum payout threshold.
                </p>
              </li>
              <li>
                <p>
                  <strong>What is the minimum payout?</strong> <br />
                  The minimum payout amount is defined in your account.
                </p>
              </li>
              <li>
                <p>
                  <strong>Why was my application rejected?</strong> <br />
                  Merchants review applications individually based on traffic
                  quality and relevance.
                </p>
              </li>
              <li>
                <p>
                  <strong>What if a commission is missing?</strong> <br />
                  You can report missing commissions directly from your
                  dashboard.
                </p>
              </li>
            </ul>
          </div>
          {/* <div className="info-block">
            <h3>Real-Life Example</h3>
            <p>
              Let's say <strong>Maria</strong> is a fitness blogger. She signs up for a protein brand's affiliate program on Upfilly. She writes a review post with her unique link. Her audience clicks the link, buys the product, and Maria earns 15% commission on every sale.
            </p>
            <p>Maria helps her followers. The brand grows its customer base. Maria gets paid. Everyone wins.</p>
          </div> */}

          {/* <div className="info-block">
            <h3>What Makes Affiliate Marketing Work</h3>
            <ul>
              <li><strong>Trust:</strong> Audiences convert best when they trust the affiliate's opinion.</li>
              <li><strong>Relevance:</strong> Niche affiliates perform better because they promote what their audience actually cares about.</li>
              <li><strong>Transparency:</strong> Clear tracking, fair commissions, and consistent payouts keep the ecosystem healthy.</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>Why It's Growing Fast</h3>
            <ul>
              <li>Ad costs are rising.</li>
              <li>Social media influencers are everywhere.</li>
              <li>People trust peer recommendations more than ads.</li>
              <li>Merchants want cost-effective growth. Affiliates want flexible income. Affiliate marketing delivers both.</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>Key Takeaways</h3>
            <p>Affiliate marketing is not a get-rich-quick scheme. It's a long-term, performance-driven channel that rewards quality content, trust, and consistency.</p>
            <p>Whether you're a merchant or affiliate, platforms like <strong>Upfilly</strong> make it easier than ever to get started — with no tech headaches.</p>
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default affiliateguide;

"use client";

import Layout from "../components/global/layout";
import "./style.scss";
import { useRouter } from "next/navigation";

export default function Partners() {
  const router = useRouter();

  const programsData = [
    {
      icon: "🤝",
      title: "Customer engagement for partner opportunities",
      description: "Go to our community forum to ask questions and take advantage of the incredible experience of the worldwide television industry, 24 hours a day!"
    },
    {
      icon: "📈",
      title: "Revenue sharing program",
      description: "Earn competitive commissions by referring merchants to Upfilly. Our transparent tracking ensures you get paid for every successful referral."
    },
    {
      icon: "🎓",
      title: "Training and certification",
      description: "Access our comprehensive training materials and become a certified Upfilly partner. Enhance your skills and grow your business."
    },
    {
      icon: "🔧",
      title: "Technical integration support",
      description: "Get dedicated technical assistance to help you integrate Upfilly with your existing systems and platforms seamlessly."
    },
    {
      icon: "📊",
      title: "Marketing resources library",
      description: "Access a wide range of marketing materials, case studies, and best practices to help you promote Upfilly effectively."
    },
    {
      icon: "💡",
      title: "Co-marketing opportunities",
      description: "Partner with Upfilly on joint marketing campaigns, webinars, and events to reach new audiences and drive growth."
    }
  ];

  const benefitsData = [
    {
      icon: "💰",
      title: "Competitive Commissions",
      description: "Earn industry-leading commissions on every successful referral"
    },
    {
      icon: "⚡",
      title: "Fast Payouts",
      description: "Get paid quickly with our automated monthly payout system"
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track your performance with detailed real-time dashboards"
    },
    {
      icon: "🎯",
      title: "Dedicated Support",
      description: "Get priority support from our partner success team"
    }
  ];

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={undefined}
        filters={undefined}
      >
        <div className="partners-page">
          {/* Hero Section */}
          <section className="partners-hero">
            <div className="container">
              <h1>Partner <span className="gradient-text">Programs</span></h1>
              <p className="hero-subtitle">
                Effective content is essential in the printing and typesetting industry. 
                Proven strategies have become the standard for creating engaging materials 
                that capture attention and drive results.
              </p>
              <button className="btn-primary-gradient" onClick={() => router.push('/partner-signup')}>
                Become a Partner
              </button>
            </div>
          </section>

          {/* Important Updates Section */}
          <section className="updates-section">
            <div className="container">
              <div className="updates-content">
                <h2>Important Updates</h2>
                <p>
                  Whether you are just beginning to build or expand your business, 
                  Upfilly offers a broad set of programs to help you innovate, expand, 
                  and differentiate your offerings.
                </p>
                <p>
                  In today's fast-paced digital landscape, effective communication is key. 
                  Our industry-standard practices have evolved to ensure your content remains 
                  relevant and impactful, enabling you to connect with your audience and 
                  achieve your business goals.
                </p>
              </div>
            </div>
          </section>

          {/* Programs Section */}
          <section className="programs-section">
            <div className="container">
              <div className="section-header">
                <h2>Programs to help you <span className="gradient-text">build your business</span></h2>
                <p>Choose from a variety of partnership programs designed to help you grow</p>
              </div>
              <div className="programs-grid">
                {programsData.map((program, index) => (
                  <div key={index} className="program-card">
                    <div className="program-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15 8H22L16 12L18 18L12 14L6 18L8 12L2 8H9L12 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </div>
                    <h3>{program.title}</h3>
                    <p>{program.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Partner Benefits Section */}
          <section className="benefits-section">
            <div className="container">
              <div className="section-header">
                <h2>Why Partner with <span className="gradient-text">Upfilly?</span></h2>
                <p>Join our partner program and unlock exclusive benefits</p>
              </div>
              <div className="benefits-grid">
                {benefitsData.map((benefit, index) => (
                  <div key={index} className="benefit-card">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="container">
              <h2>Ready to Become a Partner?</h2>
              <p>Join our growing network of partners and start growing your business today</p>
              <button className="cta-button-white" onClick={() => router.push('/partner-signup')}>
                Apply Now
              </button>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
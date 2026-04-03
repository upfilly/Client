import Link from "next/link";
import React from "react";
import methodModel from '@/methods/methods';
import Sidebar from '../sidebar';
import environment from "@/environment";

const Html = ({ settingData, isOpen, toggle, isOpen2, toggle2, setIsOpen2, searchHandle, search, user, isOpen1, searchChange, clear, Logout }) => {
  return (
    <>
      <div className="footer">
        <div className="container">
          {/* CTA Section */}
          <div className="footer-cta">
            <h2>Start Your Growth Today</h2>
            <p>Here are more ways to discover how we can help you.</p>
            <Link className="btn-gradient" href='/contact'>Contact Us</Link>
            <Link className="btn-outline" href="/aboutus">About Us</Link>
          </div>

          {/* Footer Columns */}
          <div className="footer-columns">
            {/* Get In Touch Column */}
            <div className="footer-column">
              <h4>Get In Touch</h4>
              <ul className="contact-info">
                <li>
                  <span className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.352 21.402C21.1467 21.5903 20.9044 21.7335 20.6408 21.8222C20.3772 21.9109 20.098 21.9431 19.822 21.917C16.5528 21.5856 13.4043 20.5341 10.63 18.85C8.00308 17.2991 5.73894 15.191 4 12.63C2.3087 9.86591 1.24045 6.75821 0.876999 3.528C0.850795 3.25216 0.882766 2.97312 0.971102 2.70966C1.05944 2.44621 1.20219 2.20398 1.39008 1.99861C1.57797 1.79323 1.80654 1.62932 2.06116 1.5172C2.31578 1.40509 2.59107 1.34727 2.87 1.348H5.87C6.42324 1.34326 6.95983 1.53729 7.376 1.889C7.79217 2.24072 8.05455 2.7229 8.11 3.252C8.18652 3.95075 8.33887 4.64025 8.564 5.306C8.68316 5.64371 8.7087 6.00538 8.63765 6.35505C8.5666 6.70473 8.40173 7.02938 8.16 7.296L6.96 8.556C8.07714 10.5706 9.59948 12.333 11.44 13.73L12.71 12.54C12.9768 12.2995 13.3006 12.1353 13.6493 12.0642C13.998 11.9932 14.3588 12.0181 14.696 12.136C15.3618 12.362 16.0514 12.5148 16.75 12.591C17.2796 12.6467 17.7622 12.9096 18.1139 13.3265C18.4655 13.7434 18.6587 14.2807 18.652 14.834V17.834C18.652 18.114 18.5403 18.3825 18.342 18.5809C18.1437 18.7793 17.8752 18.891 17.595 18.891" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <a href={`tel:${settingData?.company_dial_code}${settingData?.company_mobile_no}`}>
                    ({settingData?.company_dial_code}){settingData?.company_mobile_no}
                  </a>
                </li>
                <li>
                  <span className="contact-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 6L12 13L2 6M22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6M22 6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <a href={`mailto:${settingData?.company_email}`}>{settingData?.company_email}</a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="footer-column">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><Link href="/aboutus">About Us</Link></li>
                <li><Link href="/partners">Partners</Link></li>
                <li><Link href="/platforms">Platform</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="footer-column">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><Link href='/blog'>Blog</Link></li>
                <li><Link href='/affguide'>Affiliate Guides</Link></li>
                <li><Link href='/merchant'>Merchant Guides</Link></li>
                <li><Link href='/faq'>FAQ</Link></li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="footer-column">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <div className="social-icon" onClick={() => window.open('https://linkedin.com/')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="social-icon" onClick={() => window.open('https://facebook.com')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="social-icon" onClick={() => window.open('https://instagram.com')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09406 12.5923C7.96044 11.7616 8.09202 10.9099 8.47029 10.1584C8.84856 9.40685 9.45418 8.7938 10.201 8.4063C10.9478 8.0188 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="social-icon" onClick={() => window.open('https://twitter.com')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3C22.0424 3.67546 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">{settingData?.copy_right}</div>
            <div className="footer-logo">
              {settingData?.fav_icon && (
                <img src={`${environment?.api}${settingData?.fav_icon}`} alt="Logo" width="35" height="40" />
              )}
            </div>
            <div className="footer-links-bottom">
              <Link href="/privacypolicy">Privacy Policy</Link>
              <Link href="/termsconditions">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Html;
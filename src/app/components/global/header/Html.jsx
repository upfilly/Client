import Link from "next/link";
import React, { useEffect, useState } from "react";
import methodModel from '@/methods/methods';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import crendentialModel from "@/models/credential.model";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { ConnectSocket } from "@/app/chat/socket";
import environment from "@/environment";

const Html = ({ settingData, Logout }) => {
  const pathname = usePathname()
  const history = useRouter()
  const user = crendentialModel.getUser()
  const isDashboard = pathname.includes('/publisher') || pathname.includes('/proposals') || pathname.includes('/bookingform') || pathname.includes('/dashboard') || pathname.includes('/campaign') || pathname.includes('/campaignmanagement') || pathname.includes('/affiliate')
  const param = useSearchParams()
  const id = param.get("id")
  const code = param.get("campaign_code")
  const eventType = param.get("event_type")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    ConnectSocket.emit("notify-message", { user_id: user?.id });
    ConnectSocket.on(`notify-message`, (data) => {});
  }, [])

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org?format=json");
    if (res) {
      const data = {
        campaign_unique_id: code,
        event_type: eventType,
        ip_address: res?.data?.ip
      }
      ApiClient.post('tracking', data).then(res => {
        if (res.success == true) {
        }
      })
    }
  };

  useEffect(() => {
    if (eventType == "visitor" || eventType == "line-item") {
      getData();
    }
  }, [eventType]);

  const setIPaddress = () => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((res) => {
        localStorage.setItem("ip_address", res.ip)
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (!localStorage.getItem("ip_address")) {
      setIPaddress()
    }
  }, [])

  const handleAutologin = () => {
    loader(true)
    ApiClient.post('user/auto-login', { "id": id }).then(res => {
      if (res.success == true) {
        crendentialModel?.setUser(res?.data)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('addedUser', JSON.stringify(res?.data?.addedBy))
        window.location.reload();
      }
      loader(false)
    })
  };

  useEffect(() => {
    if (id && !user) {
      handleAutologin()
    }
  }, [id])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Check if we should show main navigation
  const showMainNav = !isDashboard && pathname !== "/profile/edit" && pathname !== "/profile" && pathname !== "/chat"

  return (
    <>
      <header className="professional-header">
        {/* Top Announcement Bar */}
        {!user && (
          <div className="top-announcement">
            <div className="container">
              <div className="announcement-wrapper">
                <svg className="announcement-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="announcement-text">Subscribe to an annual plan to lock in today's pricing before December 1st, 2026!</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="main-navigation">
          <div className="container">
            <div className="nav-wrapper">
              {/* Logo */}
              <Link href={(user?.id || user?._id) ? "/dashboard" : "/"} className="brand-logo">
                <img
                  src={`${environment?.api}${settingData?.logo}`}
                  className="brand-logo-img"
                  alt="Upfilly"
                />
              </Link>

              {/* Desktop Navigation Links - Only show on non-dashboard pages */}
              {showMainNav && (
                <nav className="desktop-nav">
                  <Link href="/" className={`nav-link ${pathname === "/" ? 'active' : ''}`}>
                    Home
                  </Link>
                  <div className="nav-dropdown">
                    <span className={`nav-link dropdown-trigger ${pathname.includes("/how-it-works") || pathname === "/merchant" || pathname === "/affguide" ? 'active' : ''}`}>
                      How It Works
                    </span>
                    <div className="dropdown-menu-custom">
                      <Link href="/merchant" className="dropdown-item">For Merchants</Link>
                      <Link href="/affguide" className="dropdown-item">For Affiliates</Link>
                    </div>
                  </div>
                  <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? 'active' : ''}`}>
                    Pricing
                  </Link>
                  <Link href="/resources" className={`nav-link ${pathname === "/resources" ? 'active' : ''}`}>
                    Resources
                  </Link>
                </nav>
              )}

              {/* Auth Section */}
              <div className="auth-wrapper">
                {!user ? (
                  <div className="auth-links">
                    <Link href="/signupoptions" className="auth-link signup-link">Sign Up</Link>
                    <span className="auth-divider">/</span>
                    <Link href="/login" className="auth-link login-link">Sign In</Link>
                  </div>
                ) : (
                  <div className="user-section">
                    {user?.request_status !== "accepted" && (
                      <div className="verification-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>Pending Verification</span>
                      </div>
                    )}
                    <Dropdown className="user-dropdown">
                      <Dropdown.Toggle className="user-trigger">
                        <img 
                          src={user?.image ? methodModel.userImg(user?.image) : '/assets/img/person.jpg'} 
                          className="user-avatar" 
                          alt={user?.firstName}
                        />
                        <span className="user-name">{user?.firstName}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="user-dropdown-menu">
                        <Dropdown.Item onClick={() => history.push('/dashboard')} className="user-menu-item">
                          Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => history.push('/profile')} className="user-menu-item">
                          Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => history.push('/profile/change-password')} className="user-menu-item">
                          Change Password
                        </Dropdown.Item>
                        <Dropdown.Divider className="menu-divider" />
                        <Dropdown.Item onClick={() => Logout()} className="user-menu-item logout-item">
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button - Only show on non-dashboard pages */}
              {showMainNav && (
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                  <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Navigation Menu */}
            {showMainNav && mobileMenuOpen && (
              <div className="mobile-nav-menu">
                <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <div className="mobile-dropdown">
                  <span className="mobile-dropdown-trigger">How It Works</span>
                  <div className="mobile-dropdown-items">
                    <Link href="/merchant" className="mobile-nav-link sub" onClick={() => setMobileMenuOpen(false)}>For Merchants</Link>
                    <Link href="/affguide" className="mobile-nav-link sub" onClick={() => setMobileMenuOpen(false)}>For Affiliates</Link>
                  </div>
                </div>
                <Link href="/pricing" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                <Link href="/resources" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <style>{`
        .professional-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Top Announcement Bar */
        .top-announcement {
          background: #1a1f36;
          color: white;
          padding: 10px 0;
          font-size: 13px;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .announcement-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .announcement-icon {
          flex-shrink: 0;
          color: #ff6b35;
        }

        .announcement-text {
          font-weight: 500;
        }

        /* Main Navigation */
        .main-navigation {
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          min-height: 70px;
        }

        /* Brand Logo */
        .brand-logo {
          flex-shrink: 0;
          text-decoration: none;
        }

        .brand-logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
        }

        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }

        .nav-link {
          display: inline-block;
          padding: 8px 18px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s ease;
          cursor: pointer;
          background: transparent;
          border: none;
        }

        .nav-link:hover {
          color: #4361ee;
          background: #eef2ff;
        }

        .nav-link.active {
          color: #4361ee;
          background: #eef2ff;
        }

        /* Dropdown */
        .nav-dropdown {
          position: relative;
        }

        .dropdown-trigger {
          cursor: pointer;
        }

        .dropdown-menu-custom {
          position: absolute;
          top: 100%;
          left: 0;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          padding: 8px 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s ease;
          z-index: 1001;
          border: 1px solid #e5e7eb;
        }

        .nav-dropdown:hover .dropdown-menu-custom {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: block;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: #eef2ff;
          color: #4361ee;
        }

        /* Auth Section */
        .auth-wrapper {
          flex-shrink: 0;
        }

        .auth-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-link {
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .signup-link {
          color: #374151;
        }

        .signup-link:hover {
          color: #4361ee;
        }

        .login-link {
          color: #4361ee;
        }

        .login-link:hover {
          color: #3a56d4;
        }

        .auth-divider {
          color: #d1d5db;
        }

        /* User Section */
        .user-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .verification-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fef3c7;
          color: #d97706;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .verification-badge svg {
          flex-shrink: 0;
        }

        /* User Dropdown */
        .user-dropdown {
          position: relative;
        }

        .user-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 40px;
          transition: all 0.2s ease;
        }

        .user-trigger:hover {
          background: #f3f4f6;
        }

        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .user-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          left: auto;
          min-width: 220px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          margin-top: 8px;
          border: 1px solid #e5e7eb;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-menu-item:hover {
          background: #eef2ff;
          color: #4361ee;
        }

        .logout-item {
          color: #6b7280;
        }

        .menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }

        /* Mobile Menu Button */
        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger {
          display: block;
          width: 22px;
          height: 16px;
          position: relative;
        }

        .hamburger span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: #374151;
          border-radius: 2px;
          transition: all 0.2s ease;
        }

        .hamburger span:nth-child(1) { top: 0; }
        .hamburger span:nth-child(2) { top: 7px; }
        .hamburger span:nth-child(3) { top: 14px; }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg);
          top: 7px;
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg);
          top: 7px;
        }

        /* Mobile Navigation Menu */
        .mobile-nav-menu {
          display: none;
          padding: 16px 0;
          border-top: 1px solid #e5e7eb;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-nav-link {
          display: block;
          padding: 12px 0;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          border-bottom: 1px solid #f3f4f6;
        }

        .mobile-nav-link.sub {
          padding-left: 16px;
          font-size: 14px;
          font-weight: 400;
          color: #6b7280;
        }

        .mobile-dropdown-trigger {
          display: block;
          padding: 12px 0;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
        }

        .mobile-dropdown-items {
          padding-left: 16px;
          border-left: 2px solid #eef2ff;
          margin: 4px 0 8px 0;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .mobile-nav-menu {
            display: block;
          }

          .verification-badge span {
            display: none;
          }

          .verification-badge {
            padding: 6px;
          }

          .user-name {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .container {
            padding: 0 16px;
          }

          .nav-wrapper {
            min-height: 60px;
          }

          .brand-logo-img {
            height: 30px;
          }

          .user-avatar {
            width: 30px;
            height: 30px;
          }

          .announcement-text {
            font-size: 11px;
          }

          .auth-links {
            gap: 4px;
          }

          .auth-link {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}

export default Html;
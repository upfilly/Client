"use client";

import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import methodModel from "@/methods/methods";
import crendentialModel from "@/models/credential.model";
import datepipeModel from "@/models/datepipemodel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";

export default function Header2({
  handleKeyPress,
  setFilter,
  reset,
  filter,
  name,
  filters,
  settingData,
}) {
  const user = crendentialModel.getUser();
  const pathname = usePathname();
  const history = useRouter();
  const param = useSearchParams();
  const id = param.get("id");
  const [notifications, setNotification] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const validPaths = [
    "/affiliate",
    "/group",
    "/commission/commisionplan",
    "/commission/addcommision",
    "/campaign",
    "/payments",
    "/product",
    "/campaignmanagement",
    "/creativeemails",
    "/banners",
    "/coupons",
    "/invitations",
    "/allownotifications",
    "/requestcampaigns"
  ];

  const isDashboard = validPaths.includes(pathname);

  const handleAutologin = () => {
    loader(true);
    ApiClient.post("user/auto-login", { id: id }).then((res) => {
      if (res.success == true) {
        crendentialModel?.setUser(res?.data);
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("addedUser", JSON.stringify(res?.data?.addedBy));
        window.location.reload();
      }
      loader(false);
    });
  };

  const Notifications = () => {
    if (user?.id) {
      ApiClient.get("notification/all", { send_to: user?.id }).then((res) => {
        if (res.success == true) {
          setNotification(res?.data?.data);
        }
      });
    }
  };

  useEffect(() => {
    Notifications();
  }, []);

  const updateNotifications = () => {
    ApiClient.put("notification/change-status-all", { status: "read" }).then(
      (res) => {
        if (res.success == true) {
          Notifications();
        }
      }
    );
  };

  const updateSingleNotifications = (id) => {
    ApiClient.put("notification/change-status", {
      id: id,
      status: "read",
    }).then((res) => {
      if (res.success == true) {
        Notifications();
      }
    });
  };

  const unreadCount = notifications.filter(
    (item) => item.status === "unread"
  ).length;
  const unreadNotification = notifications.filter(
    (item) => item.status === "unread"
  );

  useEffect(() => {
    Notifications();
  }, []);

  useEffect(() => {
    if (id && !user) {
      handleAutologin();
    }
  }, [id]);

  const Logout = () => {
    crendentialModel.logout();
    history.push("/login");
  };

  return (
    <>
      <style jsx>{`
        .fixed-topbar {
          position: sticky;
          top: 0;
          z-index: 1030;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .header-right {
          padding: 0.75rem 1.5rem;
          background: #ffffff;
        }

        .header-logo {
          gap: 0.75rem;
        }

        .upfilly_logo {
          height: 36px;
          width: auto;
          object-fit: contain;
        }

        .page-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          padding-left: 0.75rem;
          border-left: 2px solid #e5e7eb;
        }

        .header-content {
          gap: 1rem;
        }

        /* Search Input */
        .searchInput {
          position: relative;
          width: 280px;
        }

        .searchInput .form-control {
          height: 38px;
          padding: 0.5rem 2.5rem 0.5rem 1rem;
          font-size: 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .searchInput .form-control:focus {
          outline: none;
          border-color: #4361ee;
          box-shadow: 0 0 0 3px #eef2ff;
        }

        .search_fa {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .search_fa:hover {
          color: #4361ee;
        }

        /* Bell Icon Container */
        .bell-icon-container {
          position: relative;
          display: inline-block;
        }

        .bell-icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .bell-icon-btn:hover {
          background: #f3f4f6;
          transform: translateY(-2px);
        }

        .bell-icon {
          width: 22px;
          height: 22px;
          display: block;
        }

        .notification-badge {
          position: absolute;
          top: 0px;
          right: 0px;
          background: #ff6b35;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 4px rgba(255, 107, 53, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
          }
        }

        /* Notification Dropdown */
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 380px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          margin-top: 8px;
          z-index: 1050;
          animation: slideDown 0.2s ease;
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

        .dropdown-header {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .dropdown-actions {
          display: flex;
          gap: 8px;
        }

        .clear-btn, .view-btn {
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .clear-btn {
          color: #6b7280;
        }

        .clear-btn:hover {
          color: #374151;
          background: #e5e7eb;
        }

        .view-btn {
          color: #4361ee;
        }

        .view-btn:hover {
          background: #eef2ff;
        }

        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .notifications-list::-webkit-scrollbar {
          width: 6px;
        }

        .notifications-list::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .notifications-list::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .notification-item {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-item:hover {
          background: #f9fafb;
        }

        .notification-item.unread {
          background: #eef2ff;
        }

        .notification-type {
          font-size: 11px;
          font-weight: 600;
          color: #4361ee;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .notification-message {
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .notification-date {
          font-size: 11px;
          color: #9ca3af;
        }

        .no-notifications {
          padding: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        /* Profile Section */
        .profile-img {
          margin-left: 0.5rem;
        }

        .proifle_dropbx .dropdown-toggle {
          background: transparent;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .proifle_dropbx .dropdown-toggle::after {
          display: none;
        }

        .drpdown_new {
          padding: 4px;
          border-radius: 32px;
          transition: all 0.2s ease;
        }

        .drpdown_new:hover {
          background: #f3f4f6;
        }

        .profile-img img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .campaingh-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          left: auto !important;
          min-width: 200px;
          margin-top: 8px;
          padding: 8px 0;
          border: none;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          background: #ffffff;
        }

        .dropdown-item.has-icon {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .dropdown-item.has-icon:hover {
          background: #eef2ff;
          color: #4361ee;
        }

        .dropdown-item.has-icon i {
          width: 20px;
          margin-right: 8px;
        }

        /* Mobile Responsive */
        @media (max-width: 991px) {
          .show_bx {
            display: none;
          }
          
          .none_bx {
            display: block;
          }
          
          .set_search_icons .dropdown-menu {
            width: 280px;
            right: -60px;
            padding: 16px;
          }
          
          .payment_bx .searchInput {
            width: 100%;
          }
          
          .notification-dropdown {
            width: 340px;
            right: -80px;
          }
        }

        @media (max-width: 768px) {
          .page-name {
            display: none;
          }
          
          .upfilly_logo {
            height: 32px;
          }
          
          .header-content {
            gap: 8px;
          }
          
          .notification-dropdown {
            width: 320px;
            right: -100px;
          }
        }

        @media (max-width: 576px) {
          .header-right {
            padding: 12px;
          }
          
          .upfilly_logo {
            height: 28px;
          }
          
          .profile-img img {
            width: 32px;
            height: 32px;
          }
          
          .bell-icon {
            width: 20px;
            height: 20px;
          }
          
          .notification-dropdown {
            width: 300px;
            right: -120px;
          }
        }
      `}</style>

      <div className="fixed-topbar sidebar-content-detail">
        <div className="d-flex justify-content-between header-right align-items-center set-header-icon">
          <div className="d-flex align-items-center header-logo ">
            <a href={!user ? "/" : "/dashboard"}>
              <img src="/assets/img/logo.png" className="upfilly_logo" alt="" />
            </a>
            <span className="ml-2 page-name"> / {name}</span>
          </div>

          <div className="d-flex justify-content-end header-content align-items-center ">
            {isDashboard && (
              <>
                <div className="searchInput show_bx">
                  <input
                    type="search"
                    className="form-control quick-radius"
                    placeholder="Search"
                    onChange={(e) =>
                      e.target.value == ""
                        ? reset()
                        : setFilter({
                          ...filters,
                          search: e.target.value,
                          page: 1,
                        })
                    }
                    onKeyPress={handleKeyPress}
                  />
                  <i
                    className="fa fa-search search_fa"
                    onClick={() => {
                      filter();
                    }}
                    aria-hidden="true"
                  ></i>
                </div>

                <div className="dropdown set_search_icons none_bx">
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item">
                        <div className="payment_bx">
                          <div className="searchInput">
                            <input
                              type="search"
                              className="form-control quick-radius"
                              placeholder="Search"
                              onChange={(e) =>
                                e.target.value == ""
                                  ? reset()
                                  : setFilter({
                                    ...filters,
                                    search: e.target.value,
                                  })
                              }
                              onKeyPress={handleKeyPress}
                            />
                            <i
                              className="fa fa-search search_fa"
                              onClick={() => {
                                filter();
                              }}
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* Bell Icon - Simplified Version */}
            <div className="bell-icon-container">
              <button
                className="bell-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg
                  className="bell-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#FFFFFF"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="notification-dropdown"
                    onMouseLeave={() => setShowNotifications(false)}
                  >
                    <div className="dropdown-header">
                      <span className="dropdown-title">Notifications</span>
                      <div className="dropdown-actions">
                        {unreadNotification.length > 0 && (
                          <span
                            className="clear-btn"
                            onClick={() => updateNotifications()}
                          >
                            Clear all
                          </span>
                        )}
                        <span
                          className="view-btn"
                          onClick={() => {
                            setShowNotifications(false);
                            history.push("notifications");
                          }}
                        >
                          View all
                        </span>
                      </div>
                    </div>

                    {unreadNotification.length > 0 ? (
                      <div className="notifications-list">
                        {unreadNotification.map((itm) => (
                          <div
                            key={itm?.id}
                            className={`notification-item ${itm.status === "unread" ? 'unread' : ''}`}
                            onClick={() => {
                              updateSingleNotifications(itm?.id);
                              setShowNotifications(false);
                              if (itm?.type == "message") {
                                history.push("/chat");
                              } else if (itm?.type == "make_offer") {
                                history.push("/requests");
                              } else {
                                if (user?.role !== "brand") {
                                  history.push("/campaignmanagement");
                                } else {
                                  history.push("/campaign");
                                }
                              }
                            }}
                          >
                            <div className="notification-type">
                              {itm?.type == "message" && "💬 New Message"}
                              {itm?.type == "make_offer" && "💰 Offer Request"}
                              {itm?.type == "campaign" && "📢 Campaign Update"}
                              {!itm?.type && "📋 Update"}
                            </div>
                            <div className="notification-message">
                              {itm?.type == "message" ? (
                                <>You have a message from {itm?.addedBy_name?.slice(0, 10)}...</>
                              ) : itm?.type == "campaign" ? (
                                <>{itm?.message} by {itm?.addedBy_name}</>
                              ) : itm?.type == "make_offer" ? (
                                <>{itm?.message} by {itm?.addedBy_name}</>
                              ) : (
                                <>{itm?.message?.slice(0, 50)}</>
                              )}
                            </div>
                            <div className="notification-date">
                              {datepipeModel.datetime(itm?.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-notifications">
                        No new notifications
                      </div>
                    )}
                  </div>

                  {/* Backdrop click to close */}
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1040
                    }}
                    onClick={() => setShowNotifications(false)}
                  />
                </>
              )}
            </div>

            <div className="profile-img ">
              {user && (
                <>
                  <Dropdown className="ml-auto ml-2 proifle_dropbx">
                    <Dropdown.Toggle
                      className="d-flex p-0 align-items-center drpdown_new"
                      variant=""
                      id=""
                    >
                      <img
                        alt="image"
                        src={
                          user?.image
                            ? methodModel.userImg(user && user?.image)
                            : "/assets/img/person.jpg"
                        }
                        className="rounded-circle mr-1"
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="campaingh-dropdown">
                      <Dropdown.Item
                        className="has-icon"
                        onClick={() => history.push("/")}
                      >
                        <i className="fa fa-dashboard mr-2" /> Home
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="has-icon"
                        onClick={() => history.push("/profile")}
                      >
                        <i className="fa fa-user mr-2" /> Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="has-icon"
                        onClick={() => history.push("/profile/change-password")}
                      >
                        <i className="fa fa-cog mr-2" aria-hidden="true"></i>{" "}
                        Change Password
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="has-icon"
                        onClick={() => Logout()}
                      >
                        <i
                          className="fa fa-sign-out mr-2"
                          aria-hidden="true"
                        ></i>{" "}
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import React, { useEffect, useState } from "react";
import CustomTooltip from "../../common/Tooltip/CustomTooltip";

const Html = ({
  tabChange,
  tab,
  ListItemLink,
  tabclass,
  urlAllow,
  setActiveSidebar,
  activeSidebar,
  user,
}) => {
  const [addedUser, setaddedUser] = useState();

  useEffect(() => {
    setaddedUser(JSON.parse(localStorage.getItem("addedUser")));
  }, []);

  const permission = (p) => {
    if (user && user?.permission_detail && p) {
      return user?.permission_detail[p];
    } else {
      return false;
    }
  };

  return (
    <div className="nav flex-column new-sidebar" component="siderbar">
      <div className="toggle-img">
        <img
          src="/assets/img/menu.svg"
          alt=""
          onClick={() => setActiveSidebar(!activeSidebar)}
          className="cross-show"
        />
        <img
          src="/assets/img/cross.svg"
          onClick={() => setActiveSidebar(!activeSidebar)}
          className="cross-hide"
        />
      </div>

      <div className="top_scrollbx">
        <div className="main-top">
          {/* {urlAllow('dashboard') ? <>


            <ListItemLink to="/dashboard" title="Dashboard">
              <i class="material-icons  svg_iconbx">grid_view</i>
              <span className="side_head">Dashboard </span>
            </ListItemLink>
          </> : <></>} */}

          {
            <>
              {urlAllow("dashboard") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Dashboard">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("dashboard") || tab == "dashboard"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("dashboard")}
                      >
                        <i class="material-icons  svg_iconbx">
                          space_dashboard
                        </i>
                        <span className="  side_head">Dashboard</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("dashboard") || tab == "dashboard" ? "show" : ""
                }`}
              >
                <ListItemLink to="/dashboard" title="Overview">
                  <i class="material-icons  svg_iconbx">grid_view</i>
                  <span className="side_head">Overview </span>
                </ListItemLink>
              </div>
            </>
          }

          {(user?.role == "brand" || addedUser?.role == "brand") && (
            <>
              {urlAllow("affiliate", "group") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Affiliate">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("affiliates") || tab == "affiliates"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("affiliates")}
                      >
                        <i class="material-icons  svg_iconbx">account_circle</i>
                        <span className="  side_head">Affiliates</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("affiliates") || tab == "affiliates" ? "show" : ""
                }`}
              >
                {urlAllow("affiliate") ? (
                  <>
                    <ListItemLink to="/affiliate" title="Manage">
                      <div className="d-flex align-items-center icns_center">
                        <i class="material-icons  svg_iconbx">
                          manage_accounts
                        </i>
                        <span className="side_head">Manage</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}
                {urlAllow("group") && permission("affiliate_group") ? (
                  <>
                    <ListItemLink to="/group" title="Groups">
                      <div className="d-flex align-items-center  icns_center">
                        <i class="material-icons svg_iconbx">groups</i>
                        <span className="side_head">Groups</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}
                {urlAllow("group") && permission("affiliate_group") ? (
                  <>
                    <ListItemLink to="/marketplace" title="Marketplace">
                      <div className="d-flex align-items-center  icns_center">
                        <i class="material-icons svg_iconbx">
                          add_shopping_cart
                        </i>
                        <span className="side_head">Marketplace</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}
                {urlAllow("EmailTemplate") &&
                (user?.role == "brand" || addedUser?.role == "brand") ? (
                  <>
                    <ListItemLink to="/emailtemplate" title="Newsletter">
                      <div className="d-flex align-items-center  icns_center">
                        <i class="material-icons svg_iconbx">note</i>
                        <span className="side_head">Newsletter</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}
                {/* {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/appliedjobs" title="Affiliate Request">

                <div className="d-flex align-items-center icns_center">
                  <i class="material-icons svg_iconbx">payments</i >
                  <span className="side_head">Affiliate Request</span>
                </div>
              </ListItemLink>} */}
                {user &&
                  (user?.role == "brand" || addedUser?.role == "brand") && (
                    <ListItemLink to="/requests" title="Sent Offers">
                      <i
                        className="material-icons  svg_iconbx"
                        title="campaignmanagement"
                      >
                        business
                      </i>
                      <span className="side_head">Sent Offers</span>
                    </ListItemLink>
                  )}

                {user &&
                  (user?.role == "brand" ||
                    addedUser?.role == "brand" ||
                    permission("generate_link_add")) && (
                    <ListItemLink to="/makeLink" title="Generate Link">
                      <i
                        className="material-icons  svg_iconbx"
                        title="campaignmanagement"
                      >
                        timeline
                      </i>
                      <span className="side_head">Generate Link</span>
                    </ListItemLink>
                  )}
              </div>
            </>
          )}

          {
            <>
              {urlAllow("performancereports") &&
              (user?.role == "brand" || addedUser?.role == "brand") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Campaigns & Requests">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("campaignsrequests") ||
                          tab == "campaignsrequests"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("campaignsrequests")}
                      >
                        <i class="material-icons  svg_iconbx">
                          holiday_village
                        </i>
                        <span className="  side_head">
                          Campaigns & Requests
                        </span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("campaignsrequests") || tab == "campaignsrequests"
                    ? "show"
                    : ""
                }`}
              >
                {permission("camapaign_get") ||
                  ((user?.role == "brand" || addedUser?.role == "brand") && (
                    <ListItemLink to="/campaign" title="Campaign">
                      <i
                        className="material-icons  svg_iconbx"
                        title="campaignmanagement"
                      >
                        recent_actors
                      </i>
                      <span className="side_head">Manage Campaigns</span>
                    </ListItemLink>
                  ))}

                {permission("camapaign_get") ||
                  ((user?.role == "brand" || addedUser?.role == "brand") && (
                    <ListItemLink to="/requestCampaigns" title="Campaign">
                      <i
                        className="material-icons  svg_iconbx"
                        title="campaignmanagement"
                      >
                        alarm_add
                      </i>
                      <span className="side_head">Campaign Requests</span>
                    </ListItemLink>
                  ))}
              </div>
            </>
          }

          {(user?.role == "affiliate" || addedUser?.role == "affiate") && (
            <>
              {urlAllow("partnermanagement") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Partner Management">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("partnermanagement") ||
                          tab == "partnermanagement"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("partnermanagement")}
                      >
                        <i class="material-icons  svg_iconbx">handshake</i>
                        <span className="  side_head">Partner Management</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("partnermanagement") || tab == "partnermanagement"
                    ? "show"
                    : ""
                }`}
              >
                {/* {urlAllow('requests') && (permission('offer_get')) || (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/requests" title="Offer Request" >
                <i className="material-icons  svg_iconbx " title="campaignmanagement">business_center</i>
                <span className="side_head">Offer Request</span>
              </ListItemLink>} */}

                {user &&
                  (user?.role == "affiliate" ||
                    addedUser?.role == "affiliate") && (
                    <ListItemLink to="/invitations" title="Merchant Invites">
                      <i
                        className="material-icons  svg_iconbx "
                        title="campaignmanagement"
                      >
                        transfer_within_a_station
                      </i>
                      <span className="side_head">Merchant Invites</span>
                    </ListItemLink>
                  )}

                {permission("camapaign_get") ||
                  ((user?.role == "affiliate" ||
                    addedUser?.role == "affiliate") && (
                    <ListItemLink
                      to="/campaignmanagement"
                      title="Campaign Management"
                    >
                      <i
                        className="material-icons  svg_iconbx"
                        title="campaignmanagement"
                      >
                        manage_accounts
                      </i>
                      <span className="side_head">Campaign Management</span>
                    </ListItemLink>
                  ))}
              </div>
            </>
          )}

          {(user?.role == "affiliate" || addedUser?.role == "affiate") && (
            <>
              {urlAllow("marketplace") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Marketplace">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("marketplace") || tab == "marketplace"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("marketplace")}
                      >
                        <i class="material-icons  svg_iconbx">store</i>
                        <span className="  side_head">Marketplace</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("marketplace") || tab == "marketplace" ? "show" : ""
                }`}
              >
                {(urlAllow("requests") && permission("offer_get")) ||
                  ((user?.role == "affiliate" ||
                    addedUser?.role == "affiliate") && (
                    <ListItemLink to="/requests" title="Offer Requests">
                      <i
                        className="material-icons  svg_iconbx "
                        title="campaignmanagement"
                      >
                        business_center
                      </i>
                      <span className="side_head">Offers Requests</span>
                    </ListItemLink>
                  ))}

                {(permission("marketplace_product_add") ||
                  user?.role == "affiliate" ||
                  addedUser?.role == "affiliate") && (
                  <ListItemLink to="/offers" title="Add Offer">
                    <i
                      className="material-icons  svg_iconbx ListItemLink"
                      title="product"
                    >
                      add_shopping_cart
                    </i>
                    <span className="side_head ">Add Offer</span>
                  </ListItemLink>
                )}
              </div>
            </>
          )}

          {/* {(user?.role == "affiliate" || addedUser?.role == "affiate") && <> */}

          {urlAllow("communication") ? (
            <>
              <div className="nav-item">
                <CustomTooltip text="Communication">
                  <a
                    className={` side_titles  nav-link hoverclass affilate ${
                      tabclass("communication") || tab == "communication"
                        ? ""
                        : "collapsed-m"
                    }`}
                    onClick={() => tabChange("communication")}
                  >
                    <i class="material-icons  svg_iconbx">border_color</i>
                    <span className="  side_head">Communication</span>
                    <i
                      className="fa fa-angle-down fontsize20"
                      aria-hidden="true"
                    ></i>
                  </a>
                </CustomTooltip>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className={`collapse dropdown-btm ${
              tabclass("communication") || tab == "communication" ? "show" : ""
            }`}
          >
            {urlAllow("emailmessages") &&
            (user?.role == "affiliate" || addedUser?.role == "affiliate") ? (
              <>
                <ListItemLink to="/emailmessages" title="Email Messages">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">note</i>
                    <span className="side_head">Email Messages</span>
                  </div>
                </ListItemLink>
              </>
            ) : (
              <></>
            )}

            {
              <ListItemLink to="/notifications" title="Notifications">
                <i class="material-icons  svg_iconbx">notifications_active</i>
                <span className="side_head">Notifications</span>
              </ListItemLink>
            }

            {
              <ListItemLink to="/chat" title="Messages">
                <i class="material-icons  svg_iconbx">question_answer</i>
                <span className="side_head">Messages</span>
              </ListItemLink>
            }

            {/* {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/invitations" title="Merchant Invites" >
                <i className="material-icons  svg_iconbx " title="campaignmanagement">transfer_within_a_station</i>
                <span className="side_head">Merchant Invites</span>
              </ListItemLink>} */}

            {/* {(permission('camapaign_get')) || (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/campaignmanagement" title="Campaign Management">
                <i className="material-icons  svg_iconbx" title="campaignmanagement">manage_accounts</i>
                <span className="side_head">Campaign Management</span>
              </ListItemLink>} */}
          </div>
          {/* </>} */}

          {(user?.role == "brand" || addedUser?.role == "brand") && (
            <>
              {urlAllow("commisionplan", "manualCommission") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Commissions">
                      <a
                        className={` side_titles nav-link hoverclass affilate ${
                          tabclass("commisions") || tab == "commisions"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("commisions")}
                      >
                        <i class="material-icons  svg_iconbx">
                          monetization_on
                        </i>
                        <span className="side_head">Commissions</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                        <div></div>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("commisions") || tab == "commisions" ? "show" : ""
                }`}
              >
                {/* {urlAllow('commisionplan') ? <>
                <ListItemLink to="/commission/commisionplan" title="Manage Commissions">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Manage</span>
                  </div>
                </ListItemLink>
              </> : <></>} */}
                {/* {urlAllow('addcommision') ? <>
              <ListItemLink to="/commission/addcommision"  title="Commissions">
              <div className="d-flex align-items-center icns_center">
              <i  class="material-icons svg_iconbx">payments</i >
                <span className="side_head">Add Commissions</span>
              </div>
              </ListItemLink>
            </> : <></>} */}
                {
                  <ListItemLink to="/salestracking" title="Untracked Sales">
                    <i
                      className="material-icons  svg_iconbx"
                      title="untracked sales"
                    >
                      real_estate_agent
                    </i>
                    <span className="side_head">Untracked Sales</span>
                  </ListItemLink>
                }
                {permission("commission_add") ? (
                  <>
                    <ListItemLink
                      to="/commission/manualCommission/view"
                      title="Commissions"
                    >
                      <div className="d-flex align-items-center icns_center gap-0">
                        <i class="material-icons svg_iconbx">monetization_on</i>
                        <span className="side_head">Manual Commission</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}

                {user && user?.role == "brand" && (
                  <ListItemLink to="/trackingdata" title="Transactions">
                    <i class="material-icons svg_iconbx">compare_arrows</i>
                    <span className="side_head">Transactions</span>
                  </ListItemLink>
                )}
              </div>
            </>
          )}

          {
            <>
              {urlAllow(
                "creativeasset",
                "emailtemplate",
                "emailmessages",
                "productfeeds"
              ) ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Creative Assets">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("creativeasset") || tab == "creativeasset"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("creativeasset")}
                      >
                        <i class="material-icons  svg_iconbx">layers</i>
                        <span className="  side_head">Creative Assets</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("creativeasset") || tab == "creativeasset"
                    ? "show"
                    : ""
                }`}
              >
                {(user.role == "affiliate" ||
                  addedUser?.role == "affiliate" ||
                  user.role == "brand" ||
                  addedUser?.role == "brand") && (
                  <ListItemLink to="/banners" title="Banners">
                    <i className="material-icons  svg_iconbx" title="Banners">
                      collections
                    </i>
                    <span className="side_head">
                      {user.role == "brand" || addedUser?.role == "brand"
                        ? "Banners/Text Link"
                        : "Banners/Text Link"}
                    </span>
                  </ListItemLink>
                )}
{/* 
                <ListItemLink to="/textlinks" title="Text Links">
                  <i className="material-icons  svg_iconbx" title="Text Links">
                    timeline
                  </i>
                  <span className="side_head">
                    {user.role == "brand" || addedUser?.role == "brand"
                      ? "Add Text Link"
                      : "Text Links"}
                  </span>
                </ListItemLink> */}

                <ListItemLink to="/coupons" title="Coupons">
                  <i
                    className="material-icons  svg_iconbx"
                    title="campaignmanagement"
                  >
                    confirmation_number
                  </i>
                  <span className="side_head">
                    {user.role == "brand" || addedUser?.role == "brand"
                      ? "Add Coupon"
                      : "Coupons"}
                  </span>
                </ListItemLink>

                {user?.role == "brand" || addedUser?.role == "brand" ? (
                  <>
                    <ListItemLink to="/creativeasset" title="Product Feeds">
                      <div className="d-flex align-items-center icns_center gap-0">
                        <i class="material-icons  svg_iconbx">
                          manage_accounts
                        </i>
                        <span className="side_head">Product Feeds</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}

                {urlAllow("productfeeds") &&
                (user?.role == "affiliate" ||
                  addedUser?.role == "affiliate") ? (
                  <>
                    <ListItemLink to="/productfeeds" title="Product Feeds">
                      <div className="d-flex align-items-center icns_center gap-0">
                        <i class="material-icons  svg_iconbx">
                          manage_accounts
                        </i>
                        <span className="side_head">Product Feeds</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}

                {user &&
                  (user?.role == "affiliate" ||
                    addedUser?.role == "affiliate") &&
                  permission("generate_link_add") && (
                    <ListItemLink to="/generatelink" title="Generate Link">
                      <i
                        className="material-icons  svg_iconbx"
                        title="campaignmanagement"
                      >
                        timeline
                      </i>
                      <span className="side_head">Generate Link</span>
                    </ListItemLink>
                  )}
                {/* {urlAllow('EmailMessages') && (user?.role == "affiliate" || addedUser?.role == "affiliate") ? <>
                <ListItemLink to="/EmailMessages" title="Email Messages">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">note</i>
                    <span className="side_head">Email Messages</span>
                  </div>
                </ListItemLink>
              </> : <></>} */}
                {urlAllow("creativeemails") &&
                (user?.role == "affiliate" ||
                  addedUser?.role == "affiliate") ? (
                  <>
                    <ListItemLink to="/creativeemails" title="Email Messages">
                      <div className="d-flex align-items-center  icns_center gap-0">
                        <i class="material-icons svg_iconbx">local_library</i>
                        <span className="side_head"> Emails</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}
                {user?.role == "brand" || addedUser?.role == "brand" ? (
                  <>
                    <ListItemLink to="/creativeemails" title="Creative Email">
                      <div className="d-flex align-items-center  icns_center gap-0">
                        <i class="material-icons svg_iconbx">local_library</i>
                        <span className="side_head">Email</span>
                      </div>
                    </ListItemLink>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </>
          }

          {/* {(permission('commission_get') || user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/commission/addcommision" title="Commissions">
            <div className="d-flex align-items-center icns_center">
              <i class="material-icons svg_iconbx">local_atm</i >
              <span className="side_head">Manage Commissions</span>
            </div>
          </ListItemLink>} */}

          {
            <>
              {urlAllow("marketplace") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Account & Settings">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("accountSettings") ||
                          tab == "accountSettings"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("accountSettings")}
                      >
                        <i class="material-icons  svg_iconbx">group</i>
                        <span className="  side_head">Account & Settings</span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("accountSettings") || tab == "accountSettings"
                    ? "show"
                    : ""
                }`}
              >
                {user?.role == "affiliate" && (
                  <ListItemLink
                    to="/addAccount/detail"
                    title="Profile Management"
                  >
                    <i class="material-icons  svg_iconbx">list_alt</i>
                    <span className="side_head">Profile Management</span>
                  </ListItemLink>
                )}

                {(permission("camapaign_get") || user?.role != "users") && (
                  <ListItemLink to="/users" title="User Management">
                    <i className="material-icons  svg_iconbx" title="product">
                      groups_3
                    </i>
                    <span className="side_head">User Management</span>
                  </ListItemLink>
                )}
                {(user.role == "affiliate" ||
                  addedUser?.role == "affiliate" ||
                  user.role == "brand" ||
                  addedUser?.role == "brand") && (
                  <ListItemLink
                    to="/allownotifications"
                    title="Allow Notifications"
                  >
                    <i className="material-icons  svg_iconbx" title="product">
                      settings
                    </i>
                    <span className="side_head">Notifications Settings</span>
                  </ListItemLink>
                )}
              </div>
            </>
          }

          {
            <>
              {urlAllow("performancereports") ? (
                <>
                  <div className="nav-item">
                    <CustomTooltip text="Performance & Reports">
                      <a
                        className={` side_titles  nav-link hoverclass affilate ${
                          tabclass("performancereports") ||
                          tab == "performancereports"
                            ? ""
                            : "collapsed-m"
                        }`}
                        onClick={() => tabChange("performancereports")}
                      >
                        <i class="material-icons  svg_iconbx">summarize</i>
                        <span className="  side_head">
                          Performance & Reports
                        </span>
                        <i
                          className="fa fa-angle-down fontsize20"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </CustomTooltip>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div
                className={`collapse dropdown-btm ${
                  tabclass("performancereports") || tab == "performancereports"
                    ? "show"
                    : ""
                }`}
              >
                {
                  <ListItemLink to="/reports/all" title="Report">
                    <i class="material-icons  svg_iconbx">insert_chart</i>
                    <span className="side_head">Reports</span>
                  </ListItemLink>
                }

                {user &&
                  (user?.role == "brand" || addedUser?.role == "brand") && (
                    <ListItemLink
                      to="/performance"
                      title="Affiliate Performance"
                    >
                      <i class="material-icons  svg_iconbx">insights</i>
                      <span className="side_head">Affiliate Performance</span>
                    </ListItemLink>
                  )}

                {(user?.role == "brand" || addedUser?.role == "brand") && (
                  <ListItemLink to="/reports" title="Campaign Overview">
                    <i class="material-icons  svg_iconbx">stacked_line_chart</i>
                    <span className="side_head">Campaign Overview</span>
                  </ListItemLink>
                )}
              </div>
            </>
          }

          {urlAllow("commissionspayments") && (
            <ListItemLink to="/payments" title="Payments">
              <i
                className="material-icons  svg_iconbx"
                title="campaignmanagement"
              >
                recent_actors
              </i>
              <span className="side_head">Payments</span>
            </ListItemLink>
          )}

          {/* {(permission('camapaign_get')) || (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/campaign" title="Campaign">
            <i className="material-icons  svg_iconbx" title="campaignmanagement">recent_actors</i>
            <span className="side_head">Manage Campaign</span>
          </ListItemLink>}

          {(permission('camapaign_get')) || (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/requestCampaigns" title="Campaign">
            <i className="material-icons  svg_iconbx" title="campaignmanagement">alarm_add</i>
            <span className="side_head">Campaign Request</span>
          </ListItemLink>} */}

          {/* {(permission('camapaign_get')) || (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/mapping" title="Map data">
            <i className="material-icons  svg_iconbx" title="campaignmanagement">recent_actors</i>
            <span className="side_head">Map Keys</span>
          </ListItemLink>} */}

          {/* {(permission('marketplace_product_add') || user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/Offers" title="Add Offer" >
            <i className="material-icons  svg_iconbx ListItemLink" title="product">add_shopping_cart</i>
            <span className="side_head ">Add Offer</span>
          </ListItemLink>} */}

          {/* {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/applymerchants"  title="Apply Merchants" >
            <i class="material-icons  svg_iconbx">account_circle</i>
            <span className="side_head ">Apply Merchants</span>
          </ListItemLink>} */}

          {/* {(permission('offer_get')) || (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/requests" title="Offer Request" >
            <i className="material-icons  svg_iconbx " title="campaignmanagement">business_center</i>
            <span className="side_head">Offer Request</span>
          </ListItemLink>} */}

          {/* {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/invitations" title="Merchant Invites" >
            <i className="material-icons  svg_iconbx " title="campaignmanagement">transfer_within_a_station</i>
            <span className="side_head">Merchant Invites</span>
          </ListItemLink>} */}

          {/* {(permission('camapaign_get')) || (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/campaignmanagement" title="Campaign Management">
            <i className="material-icons  svg_iconbx" title="campaignmanagement">manage_accounts</i>
            <span className="side_head">Campaign Management</span>
          </ListItemLink>} */}

          {/* {user && user?.role == "affiliate" && <ListItemLink to="/inviteUsers"  title="Offer Request" >
          <i class="material-icons svg_iconbx " title="campaignmanagement">person_add</i>
          <span className="side_head">Invite Users</span>
        </ListItemLink>} */}

          {/* {user && (user?.role == "affiliate" ) && <ListItemLink to="/invitedUsers"  title="Offer Request" >
          <i className="material-icons  svg_iconbx " title="campaignmanagement">group_add</i>
          <span className="side_head">Invited Users</span>
        </ListItemLink>} */}

          {/* {(user?.role == "affiliate") && <ListItemLink to="/affiliate-report" title="Affiliate Report">
            <i class="material-icons  svg_iconbx">summarize</i>
            <span className="side_head">Report</span>
          </ListItemLink>} */}

          {/* {(user?.role == "brand") && <ListItemLink to="/brand-report"  title="Brand-Report">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Brand Report</span>
          </ListItemLink>} */}

          {/* {(user?.role == "affiliate") && <ListItemLink to="/addAccount/detail" title="Change Plan">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Add Tax Detail</span>
          </ListItemLink>} */}

          {/* {((permission('camapaign_get')) || user?.role != "users") && <ListItemLink to="/users" title="Add Users" >
            <i className="material-icons  svg_iconbx" title="product">groups_3</i>
            <span className="side_head">Add Users</span>
          </ListItemLink>} */}

          {/* {user && (user?.role == "users") && <ListItemLink to="/users"  title="Add Users">
            <i className="material-icons  svg_iconbx" title="product">groups_3</i>
            <span className="side_head">Add Users</span>
          </ListItemLink>} */}

          {/* {<ListItemLink to="/salesTracking" title="Untracked Sales">
            <i className="material-icons  svg_iconbx" title="untracked sales">
              real_estate_agent</i>
            <span className="side_head">Untracked Sales</span>
          </ListItemLink>} */}

          {/* {user?.role != "team" && <ListItemLink to="/URLShortener"  title="Add Offer" disabled={(!user?.account_id && user?.role === 'affiliate') ? true : false}>
          <i className="material-icons mr-2" title="untracked sales">
            real_estate_agent</i>
          <span className="side_head">URL Shortener</span>
        </ListItemLink>} */}

          {/* <ListItemLink to="/coupons" title="Coupons">
            <i className="material-icons  svg_iconbx" title="campaignmanagement">confirmation_number</i>
            <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Add Coupon" : "Coupons"}</span>
          </ListItemLink> */}

          {/* {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && (permission('generate_link_add')) && <ListItemLink to="/generateLink" title="Generate Link" >
            <i className="material-icons  svg_iconbx" title="campaignmanagement">timeline</i>
            <span className="side_head">Generate Link</span>
          </ListItemLink>} */}

          {/* {user && (user?.role == "affiliate" ) && <ListItemLink to="/Trackings"  title="Trackings">
          <i className="material-icons  svg_iconbx" title="tracking">show_chart</i>
  
          <span className="side_head">Trackings</span>
        </ListItemLink>} */}

          {/* <ListItemLink to="/notifications" title="Payments">
            <i class="material-icons  svg_iconbx">notifications_active</i>
            <span className="side_head">Notification</span>
          </ListItemLink> */}

          {/* {permission('transactions_get') && <ListItemLink to="/payments" title="Payments">
            <i class="material-icons  svg_iconbx">payment</i>
            <span className="side_head">Payments</span>
          </ListItemLink>} */}

          {/* {(user?.role == "brand") && <ListItemLink to="/pricing"  title="Change Plan">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Change Plan</span>
          </ListItemLink>} */}
        </div>
      </div>
    </div>
  );
};

export default Html;

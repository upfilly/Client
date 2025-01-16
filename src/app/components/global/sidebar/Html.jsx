import methodModel from "@/methods/methods";
import React, { useEffect, useState } from "react";
import CustomTooltip from "../../common/Tooltip/CustomTooltip"

const Html = ({ tabChange, tab, ListItemLink, tabclass, urlAllow, setActiveSidebar, activeSidebar, user }) => {
  const [addedUser, setaddedUser] = useState()

  useEffect(() => {
    setaddedUser(JSON.parse(localStorage.getItem('addedUser')))
  }, [])

  const permission = (p) => {
    if (user && user?.permission_detail && p) {
      return user?.permission_detail[p]
    } else {
      return false
    }
  }

  return (
    <div className="nav flex-column new-sidebar" component="siderbar">

      <div className='toggle-img'>
        <img src="/assets/img/menu.svg" alt="" onClick={() => setActiveSidebar(!activeSidebar)} className="cross-show" />
        <img src="/assets/img/cross.svg" onClick={() => setActiveSidebar(!activeSidebar)} className="cross-hide" />
      </div>

      <div className="top_scrollbx">
        <div className="main-top">
          {urlAllow('dashboard') ? <>


            <ListItemLink to="/dashboard" title="Dashboard">
              <i class="material-icons  svg_iconbx">grid_view</i>
              <span className="side_head">Dashboard </span>
            </ListItemLink>
          </> : <></>}
          {<>

            {urlAllow('EmailMessages') ? <>
              <div className="nav-item">
                <CustomTooltip text="Communication">
                  <a className={` side_titles  nav-link hoverclass affilate ${tabclass('communications') || tab == 'communications' ? '' : 'collapsed-m'}`} onClick={() => tabChange('communications')}>
                    <i class="material-icons  svg_iconbx">layers</i>
                    <span className="  side_head" >Communication
                    </span>
                    <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                  </a>
                </CustomTooltip>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('communications') || tab == 'communications' ? 'show' : ''}`}>
              {urlAllow('EmailMessages') && (user?.role == "affiliate" || addedUser?.role == "affiliate") ? <>
                <ListItemLink to="/EmailMessages" title="Email Messages">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">note</i>
                    <span className="side_head">Email Messages</span>
                  </div>
                </ListItemLink>
              </> : <></>}

            </div></>}
          {(user?.role == "brand" || addedUser?.role == "brand") && <>

            {urlAllow('affiliate', 'group') ? <>
              <div className="nav-item">
                <CustomTooltip text="Affiliate">
                  <a className={` side_titles  nav-link hoverclass affilate ${tabclass('affiliates') || tab == 'affiliates' ? '' : 'collapsed-m'}`} onClick={() => tabChange('affiliates')} >
                    <i class="material-icons  svg_iconbx">account_circle</i>
                    <span className="  side_head" >Affiliates
                    </span>
                    <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                  </a>
                </CustomTooltip>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('affiliates') || tab == 'affiliates' ? 'show' : ''}`}>

              {urlAllow('affiliate') ? <>

                <ListItemLink to="/affiliate" title="Manage">

                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Manage</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {(urlAllow('group') && permission('affiliate_group')) ? <>
                <ListItemLink to="/group" title="Groups">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">groups</i>
                    <span className="side_head">Groups</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {urlAllow('group') && permission('affiliate_group') ? <>
                <ListItemLink to="/marketplace" title="Groups">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">add_shopping_cart</i>
                    <span className="side_head">Marketplace</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {urlAllow('EmailTemplate') && (user?.role == "brand" || addedUser?.role == "brand") ? <>
                <ListItemLink to="/EmailTemplate" title="Email Template">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">note</i>
                    <span className="side_head">Newsletter</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/appliedjobs" title="Affiliate Request">

                <div className="d-flex align-items-center icns_center">
                  <i class="material-icons svg_iconbx">payments</i >
                  <span className="side_head">Affiliate Request</span>
                </div>
              </ListItemLink>}
              {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/requests" title="Sent Offers">
                <i className="material-icons  svg_iconbx" title="campaignManagement">business</i>
                <span className="side_head">Sent Offers</span>
              </ListItemLink>}

              {user && (user?.role == "brand" || addedUser?.role == "brand" || permission('generate_link_add')) && <ListItemLink to="/makeLink" title="Generate Link" >
                <i className="material-icons  svg_iconbx" title="campaignManagement">timeline</i>
                <span className="side_head">Generate Link</span>
              </ListItemLink>}

            </div></>}

          {(user?.role == "brand" || addedUser?.role == "brand") && <>

            {urlAllow('commisionplan', 'manualCommission') ? <>
              <div className="nav-item">
                <CustomTooltip text="Commissions">
                  <a className={` side_titles nav-link hoverclass affilate ${tabclass('commisions') || tab == 'commisions' ? '' : 'collapsed-m'}`} onClick={() => tabChange('commisions')}>
                    <i class="material-icons  svg_iconbx">monetization_on</i>
                    <span className="side_head">Commissions
                    </span>
                    <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                    <div>
                    </div>
                  </a>
                </CustomTooltip>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('commisions') || tab == 'commisions' ? 'show' : ''}`}>

              {urlAllow('commisionplan') ? <>
                <ListItemLink to="/commission/commisionplan" title="Manage Commissions">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Manage</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {/* {urlAllow('addcommision') ? <>
              <ListItemLink to="/commission/addcommision"  title="Commissions">
              <div className="d-flex align-items-center icns_center">
              <i  class="material-icons svg_iconbx">payments</i >
                <span className="side_head">Add Commissions</span>
              </div>
              </ListItemLink>
            </> : <></>} */}
              {permission("commission_add") ? <>
                <ListItemLink to="/commission/manualCommission/view" title="Commissions">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons svg_iconbx">monetization_on</i >
                    <span className="side_head">Manual Commission</span>
                  </div>
                </ListItemLink>
              </> : <></>}

            </div></>}

          {<>

            {urlAllow('CreativeAsset', 'EmailTemplate', 'EmailMessages', 'DataFeeds',"coupons") ? <>
              <div className="nav-item">
                <CustomTooltip text="Creative Assets">
                  <a className={` side_titles  nav-link hoverclass affilate ${tabclass('CreativeAssets') || tab == 'CreativeAssets' ? '' : 'collapsed-m'}`} onClick={() => tabChange('CreativeAssets')}>
                    <i class="material-icons  svg_iconbx">layers</i>
                    <span className="  side_head" >Creative Assets
                    </span>
                    <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                  </a>
                </CustomTooltip>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('CreativeAssets') || tab == 'CreativeAssets' ? 'show' : ''}`}>

              {(user.role == "affiliate" || addedUser?.role == "affiliate" || user.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/addbanner" title="Campaign Management">
                <i className="material-icons  svg_iconbx" title="Banners">collections</i>
                <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Banners" : "Banners"}</span>
              </ListItemLink>}

              {(user?.role == "brand" || addedUser?.role == "brand") ? <>
                <ListItemLink to="/CreativeAsset" title="Data Feeds">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Data Feeds</span>
                  </div>
                </ListItemLink>
              </> : <></>}

              {urlAllow('DataFeeds') && (user?.role == "affiliate" || addedUser?.role == "affiliate") ? <>
                <ListItemLink to="/DataFeeds" title="Data Feeds">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Data Feeds</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              <ListItemLink to="/coupons" title="Coupons">
            <i className="material-icons  svg_iconbx" title="campaignManagement">confirmation_number</i>
            <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Add Coupon" : "Coupons"}</span>
          </ListItemLink>
              {/* {urlAllow('EmailMessages') && (user?.role == "affiliate" || addedUser?.role == "affiliate") ? <>
                <ListItemLink to="/EmailMessages" title="Email Messages">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">note</i>
                    <span className="side_head">Email Messages</span>
                  </div>
                </ListItemLink>
              </> : <></>} */}
              {urlAllow('CreativeEmails') && (user?.role == "affiliate" || addedUser?.role == "affiliate") ? <>
                <ListItemLink to="/CreativeEmails" title="Email Messages">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">local_library</i>
                    <span className="side_head"> Emails</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {(user?.role == "brand" || addedUser?.role == "brand") ? <>
                <ListItemLink to="/CreativeEmails" title="Creative Email">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">local_library</i>
                    <span className="side_head">Email</span>
                  </div>
                </ListItemLink>
              </> : <></>}
            </div></>}



          {(permission('commission_get') || user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/commission/addcommision" title="Commissions">
            <div className="d-flex align-items-center icns_center">
              <i class="material-icons svg_iconbx">local_atm</i >
              <span className="side_head">Manage Commissions</span>
            </div>
          </ListItemLink>}



          {(permission('camapaign_get')) || (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/campaign" title="Campaign">
            <i className="material-icons  svg_iconbx" title="campaignManagement">recent_actors</i>
            <span className="side_head">Manage Campaign</span>
          </ListItemLink>}

          {/* {(permission('camapaign_get')) || (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/requestCampaigns"  title="Campaign">
            <i className="material-icons  svg_iconbx" title="campaignManagement">recent_actors</i>
            <span className="side_head">Campaign Request</span>
          </ListItemLink>} */}

          {(permission('camapaign_get')) || (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/mapping" title="Map data">
            <i className="material-icons  svg_iconbx" title="campaignManagement">recent_actors</i>
            <span className="side_head">Map Keys</span>
          </ListItemLink>}
          {<>

            {urlAllow('Offers', 'requests', 'invitations', 'campaignManagement') ? <>
              <div className="nav-item">
                <CustomTooltip text="Partner Management">
                  <a className={` side_titles  nav-link hoverclass affilate ${tabclass('Partner') || tab == 'Partner' ? '' : 'collapsed-m'}`} onClick={() => tabChange('Partner')}>
                    <i class="material-icons  svg_iconbx">layers</i>
                    <span className="  side_head" >Partner Management
                    </span>
                    <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                  </a>
                </CustomTooltip>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('Partner') || tab == 'Partner' ? 'show' : ''}`}>
              {(permission('marketplace_product_add') || user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/Offers" title="Add Offer" >
                <i className="material-icons  svg_iconbx ListItemLink" title="product">add_shopping_cart</i>
                <span className="side_head ">Add Offer</span>
              </ListItemLink>}

              {/* {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/applymerchants"  title="Apply Merchants" >
            <i class="material-icons  svg_iconbx">account_circle</i>
            <span className="side_head ">Apply Merchants</span>
          </ListItemLink>} */}

              {(permission('offer_get')) || (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/requests" title="Offer Request" >
                <i className="material-icons  svg_iconbx " title="campaignManagement">business_center</i>
                <span className="side_head">Offer Request</span>
              </ListItemLink>}

              {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/invitations" title="Merchant Invites" >
                <i className="material-icons  svg_iconbx " title="campaignManagement">transfer_within_a_station</i>
                <span className="side_head">Merchant Invites</span>
              </ListItemLink>}

              {(permission('camapaign_get')) || (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/campaignManagement" title="Campaign Management">
                <i className="material-icons  svg_iconbx" title="campaignManagement">manage_accounts</i>
                <span className="side_head">Campaign Management</span>
              </ListItemLink>}
            </div></>}
          {/* {user && user?.role == "affiliate" && <ListItemLink to="/inviteUsers"  title="Offer Request" >
          <i class="material-icons svg_iconbx " title="campaignManagement">person_add</i>
          <span className="side_head">Invite Users</span>
        </ListItemLink>} */}

          {/* {user && (user?.role == "affiliate" ) && <ListItemLink to="/invitedUsers"  title="Offer Request" >
          <i className="material-icons  svg_iconbx " title="campaignManagement">group_add</i>
          <span className="side_head">Invited Users</span>
        </ListItemLink>} */}

          {(user?.role == "affiliate") && <ListItemLink to="/affiliate-report" title="Affiliate Report">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Report</span>
          </ListItemLink>}

          {/* {(user?.role == "brand") && <ListItemLink to="/brand-report"  title="Brand-Report">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Brand Report</span>
          </ListItemLink>} */}

          {(user?.role == "affiliate") && <ListItemLink to="/addAccount/detail" title="Change Plan">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Add tax Detail</span>
          </ListItemLink>}

          {((permission('camapaign_get')) || user?.role != "users") && <ListItemLink to="/users" title="Add Users" >
            <i className="material-icons  svg_iconbx" title="product">groups_3</i>
            <span className="side_head">Add Users</span>
          </ListItemLink>}

          {/* {user && (user?.role == "users") && <ListItemLink to="/users"  title="Add Users">
            <i className="material-icons  svg_iconbx" title="product">groups_3</i>
            <span className="side_head">Add Users</span>
          </ListItemLink>} */}

          {<ListItemLink to="/salesTracking" title="Untracked Sales">
            <i className="material-icons  svg_iconbx" title="untracked sales">
              real_estate_agent</i>
            <span className="side_head">Untracked Sales</span>
          </ListItemLink>}

          {/* {user?.role != "team" && <ListItemLink to="/URLShortener"  title="Add Offer" disabled={(!user?.account_id && user?.role === 'affiliate') ? true : false}>
          <i className="material-icons mr-2" title="untracked sales">
            real_estate_agent</i>
          <span className="side_head">URL Shortener</span>
        </ListItemLink>} */}

          {user && user?.role == "brand" && <ListItemLink to="/trackingData" title="Invites">
            <i class="material-icons svg_iconbx">markunread</i>
            <span className="side_head">Tracking Data</span>
          </ListItemLink>}



          {/* <ListItemLink to="/coupons" title="Coupons">
            <i className="material-icons  svg_iconbx" title="campaignManagement">confirmation_number</i>
            <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Add Coupon" : "Coupons"}</span>
          </ListItemLink> */}

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && (permission('generate_link_add')) && <ListItemLink to="/generateLink" title="Generate Link" >
            <i className="material-icons  svg_iconbx" title="campaignManagement">timeline</i>
            <span className="side_head">Generate Link</span>
          </ListItemLink>}



          {/* {user && (user?.role == "affiliate" ) && <ListItemLink to="/Trackings"  title="Trackings">
          <i className="material-icons  svg_iconbx" title="tracking">show_chart</i>
  
          <span className="side_head">Trackings</span>
        </ListItemLink>} */}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/performance" title="Performance">
            <i class="material-icons  svg_iconbx">insert_chart</i>
            <span className="side_head">Performance Chart</span>
          </ListItemLink>}

          {permission('transactions_get') && <ListItemLink to="/payments" title="Payments">
            <i class="material-icons  svg_iconbx">payment</i>
            <span className="side_head">Payments</span>
          </ListItemLink>}
          {/* {(user?.role == "brand") && <ListItemLink to="/pricing"  title="Change Plan">
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Change Plan</span>
          </ListItemLink>} */}

          {(user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/reports" title="Campaign Report">
            <i class="material-icons  svg_iconbx">insert_chart</i>
            <span className="side_head">Campaign Reports</span>
          </ListItemLink>}
        </div>
      </div>

    </div>
  );
}

export default Html
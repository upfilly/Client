import React, { useEffect, useState } from "react";

const Html = ({ tabChange, tab, ListItemLink, tabclass, urlAllow, setActiveSidebar, activeSidebar, user }) => {
  const [addedUser, setaddedUser] = useState()

  useEffect(() => {
    setaddedUser(JSON.parse(localStorage.getItem('addedUser')))
  }, [])

  return (
    <div className="nav flex-column new-sidebar" component="siderbar">

      <div className='toggle-img'>
        <img src="/assets/img/menu.svg" alt="" onClick={() => setActiveSidebar(!activeSidebar)} className="cross-show" />
        <img src="/assets/img/cross.svg" onClick={() => setActiveSidebar(!activeSidebar)} className="cross-hide" />
      </div>

      <div className="top_scrollbx">
        <div className="main-top">
          {urlAllow('dashboard') ? <>
            <ListItemLink to="/dashboard" data-bs-toggle="tooltip" data-bs-placement="top" title="Dashboard">
              <i class="material-icons  svg_iconbx">grid_view</i>
              <span className="side_head">Dashboard </span>
            </ListItemLink>
          </> : <></>}
          {(user?.role == "brand" || addedUser?.role == "brand") && <>

            {urlAllow('affiliate', 'group') ? <>
              <div className="nav-item">
                <a className={` side_titles  nav-link hoverclass affilate ${tabclass('affiliates') || tab == 'affiliates' ? '' : 'collapsed-m'}`} onClick={() => tabChange('affiliates')}
                  data-bs-toggle="tooltip" data-bs-placement="top" title="Affiliate">
                  <i class="material-icons  svg_iconbx">account_circle</i>
                  <span className="  side_head" >Affiliate
                  </span>
                  <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                </a>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('affiliates') || tab == 'affiliates' ? 'show' : ''}`}>

              {urlAllow('affiliate') ? <>
                <ListItemLink to="/affiliate" data-bs-toggle="tooltip" data-bs-placement="top" title="Manage">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Manage</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {urlAllow('group') ? <>
                <ListItemLink to="/group" data-bs-toggle="tooltip" data-bs-placement="top" title="Groups">
                  <div className="d-flex align-items-center  icns_center">
                    <i class="material-icons svg_iconbx">groups</i>
                    <span className="side_head">Groups</span>
                  </div>
                </ListItemLink>
              </> : <></>}
            </div></>}

          {(user?.role == "brand" || addedUser?.role == "brand") && <>

            {urlAllow('commisionplan', 'manualCommission') ? <>
              <div className="nav-item">
                <a className={` side_titles nav-link hoverclass affilate ${tabclass('commisions') || tab == 'commisions' ? '' : 'collapsed-m'}`} onClick={() => tabChange('commisions')}
                  data-bs-toggle="tooltip" data-bs-placement="top" title="Commissions">
                  <i class="material-icons  svg_iconbx">monetization_on</i>
                  <span className="side_head">Commissions
                  </span>
                  <i className="fa fa-angle-down fontsize20" aria-hidden="true"></i>
                  <div>
                  </div>
                </a>
              </div>
            </> : <></>}

            <div className={`collapse dropdown-btm ${tabclass('commisions') || tab == 'commisions' ? 'show' : ''}`}>

              {urlAllow('commisionplan') ? <>
                <ListItemLink to="/commission/commisionplan" data-bs-toggle="tooltip" data-bs-placement="top" title="Manage Commissions">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons  svg_iconbx" >manage_accounts</i>
                    <span className="side_head">Manage</span>
                  </div>
                </ListItemLink>
              </> : <></>}
              {/* {urlAllow('addcommision') ? <>
              <ListItemLink to="/commission/addcommision" data-bs-toggle="tooltip" data-bs-placement="top" title="Commissions">
              <div className="d-flex align-items-center icns_center">
              <i  class="material-icons svg_iconbx">payments</i >
                <span className="side_head">Add Commissions</span>
              </div>
              </ListItemLink>
            </> : <></>} */}
              {urlAllow('manualCommission') ? <>
                <ListItemLink to="/commission/manualCommission/view" data-bs-toggle="tooltip" data-bs-placement="top" title="Commissions">
                  <div className="d-flex align-items-center icns_center">
                    <i class="material-icons svg_iconbx">monetization_on</i >
                    <span className="side_head">Manual Commission</span>
                  </div>
                </ListItemLink>
              </> : <></>}

            </div></>}

          {<ListItemLink to="/addbanner" data-bs-toggle="tooltip" data-bs-placement="top" title="Campaign Management">
            <i className="material-icons  svg_iconbx" title="campaignManagement">collections</i>
            <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Add Banner" : "Banners"}</span>
          </ListItemLink>}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/commission/addcommision" data-bs-toggle="tooltip" data-bs-placement="top" title="Commissions">
            <div className="d-flex align-items-center icns_center">
              <i class="material-icons svg_iconbx">payments</i >
              <span className="side_head">Add Commissions</span>
            </div>
          </ListItemLink>}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/appliedjobs" data-bs-toggle="tooltip" data-bs-placement="top" title="Commissions">
            <div className="d-flex align-items-center icns_center">
              <i class="material-icons svg_iconbx">payments</i >
              <span className="side_head">Affiliate Request</span>
            </div>
          </ListItemLink>}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/campaign" data-bs-toggle="tooltip" data-bs-placement="top" title="Campaign Management">
            <i className="material-icons  svg_iconbx" title="campaignManagement">recent_actors</i>
            <span className="side_head">Add Campaign</span>
          </ListItemLink>}

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/Offers" data-bs-toggle="tooltip" data-bs-placement="top" title="Add Offer" >
            <i className="material-icons  svg_iconbx ListItemLink" title="product">add_shopping_cart</i>
            <span className="side_head ">Add Offer</span>
          </ListItemLink>}

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/applymerchants" data-bs-toggle="tooltip" data-bs-placement="top" title="Add Offer" >
            <i class="material-icons  svg_iconbx">account_circle</i>
            <span className="side_head ">Apply Merchants</span>
          </ListItemLink>}

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/requests" data-bs-toggle="tooltip" data-bs-placement="top" title="Offer Request" >
            <i className="material-icons  svg_iconbx " title="campaignManagement">business_center</i>
            <span className="side_head">Offer Request</span>
          </ListItemLink>}

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/invitations" data-bs-toggle="tooltip" data-bs-placement="top" title="Offer Request" >
            <i className="material-icons  svg_iconbx " title="campaignManagement">transfer_within_a_station</i>
            <span className="side_head">Merchant Invites</span>
          </ListItemLink>}

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/campaignManagement" data-bs-toggle="tooltip" data-bs-placement="top" title="Campaign Management">
            <i className="material-icons  svg_iconbx" title="campaignManagement">manage_accounts</i>
            <span className="side_head">Campaign Management</span>
          </ListItemLink>}

          {/* {user && user?.role == "affiliate" && <ListItemLink to="/inviteUsers" data-bs-toggle="tooltip" data-bs-placement="top" title="Offer Request" >
          <i class="material-icons svg_iconbx " title="campaignManagement">person_add</i>
          <span className="side_head">Invite Users</span>
        </ListItemLink>} */}

          {/* {user && (user?.role == "affiliate" ) && <ListItemLink to="/invitedUsers" data-bs-toggle="tooltip" data-bs-placement="top" title="Offer Request" >
          <i className="material-icons  svg_iconbx " title="campaignManagement">group_add</i>
          <span className="side_head">Invited Users</span>
        </ListItemLink>} */}

          {user && (user?.role != "users") && <ListItemLink to="/users" data-bs-toggle="tooltip" data-bs-placement="top" title="Add Offer" >
            <i className="material-icons  svg_iconbx" title="product">groups_3</i>
            <span className="side_head">Add Users</span>
          </ListItemLink>}

          {user && (user?.role == "users") && <ListItemLink to="/users" data-bs-toggle="tooltip" data-bs-placement="top" title="Add Offer">
            <i className="material-icons  svg_iconbx" title="product">groups_3</i>
            <span className="side_head">Add Users</span>
          </ListItemLink>}

          {(user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/salesTracking" data-bs-toggle="tooltip" data-bs-placement="top" title="Add Offer">
            <i className="material-icons  svg_iconbx" title="untracked sales">
              real_estate_agent</i>
            <span className="side_head">Untracked Sales</span>
          </ListItemLink>}

          {/* {user?.role != "team" && <ListItemLink to="/URLShortener" data-bs-toggle="tooltip" data-bs-placement="top" title="Add Offer" disabled={(!user?.account_id && user?.role === 'affiliate') ? true : false}>
          <i className="material-icons mr-2" title="untracked sales">
            real_estate_agent</i>
          <span className="side_head">URL Shortener</span>
        </ListItemLink>} */}

          {/* {user && user?.role == "brand" && <ListItemLink to="/invites" data-bs-toggle="tooltip" data-bs-placement="top" title="Invites">
          <i class="material-icons svg_iconbx">markunread</i>
          <span className="side_head">Invites</span>
        </ListItemLink>} */}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/requests" data-bs-toggle="tooltip" data-bs-placement="top" title="Sent Offers">
            <i className="material-icons  svg_iconbx" title="campaignManagement">business</i>
            <span className="side_head">Sent Offers</span>
          </ListItemLink>}

          <ListItemLink to="/coupons" data-bs-toggle="tooltip" data-bs-placement="top" title="Sent Offers">
            <i className="material-icons  svg_iconbx" title="campaignManagement">confirmation_number</i>
            <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Add Coupon" : "Coupons"}</span>
          </ListItemLink>

          {user && (user?.role == "affiliate" || addedUser?.role == "affiliate") && <ListItemLink to="/generateLink" data-bs-toggle="tooltip" data-bs-placement="top" title="Generate Link" >
            <i className="material-icons  svg_iconbx" title="campaignManagement">timeline</i>
            <span className="side_head">Generate Link</span>
          </ListItemLink>}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/makeLink" data-bs-toggle="tooltip" data-bs-placement="top" title="Generate Link" >
            <i className="material-icons  svg_iconbx" title="campaignManagement">timeline</i>
            <span className="side_head">Generate Link</span>
          </ListItemLink>}

          {/* {user && (user?.role == "affiliate" ) && <ListItemLink to="/Trackings" data-bs-toggle="tooltip" data-bs-placement="top" title="Trackings">
          <i className="material-icons  svg_iconbx" title="tracking">show_chart</i>
  
          <span className="side_head">Trackings</span>
        </ListItemLink>} */}

          {user?.role != "users" && <ListItemLink to="/payments" data-bs-toggle="tooltip" data-bs-placement="top" title="Payments">
            {/* <svg className="text_black  svg_iconbx" xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">
            <path d="M2.81907e-08 18.646C3.37655e-08 15.1375 1.0404 11.7078 2.98963 8.79063C4.93886 5.87344 7.70937 3.59979 10.9508 2.2572C14.1922 0.914602 17.759 0.563369 21.2001 1.24791C24.6411 1.93246 27.8019 3.62203 30.2827 6.10298C32.7635 8.58392 34.4529 11.7448 35.1373 15.1859C35.8216 18.627 35.4702 22.1937 34.1274 25.4351C32.7846 28.6765 30.5108 31.4468 27.5935 33.3959C24.6762 35.345 21.2465 36.3852 17.738 36.385C15.4085 36.385 13.1019 35.9261 10.9497 35.0347C8.79759 34.1432 6.84212 32.8365 5.19499 31.1893C3.54785 29.5421 2.2413 27.5865 1.34994 25.4343C0.458579 23.2821 -0.000131298 20.9755 2.81907e-08 18.646ZM2.048 18.646C2.0482 21.7489 2.96848 24.7821 4.69249 27.362C6.4165 29.9418 8.86679 31.9526 11.7335 33.1399C14.6003 34.3273 17.7547 34.6379 20.798 34.0325C23.8413 33.4271 26.6367 31.9329 28.8308 29.7388C31.0249 27.5447 32.5191 24.7493 33.1245 21.706C33.7299 18.6627 33.4193 15.5083 32.2319 12.6415C31.0446 9.77478 29.0339 7.32449 26.454 5.60048C23.8741 3.87648 20.8409 2.95619 17.738 2.95599C13.5768 2.95599 9.58594 4.60904 6.64349 7.55149C3.70105 10.4939 2.048 14.4847 2.048 18.646ZM16.935 28.328C16.894 27.614 16.885 27.576 16.716 27.495L16.603 27.441C15.133 26.741 15.133 26.741 14.565 26.171L14.531 26.138C13.9807 25.6542 13.5654 25.0359 13.3258 24.3435C13.0862 23.6511 13.0304 22.9084 13.164 22.188C13.2323 22.0041 13.355 21.8454 13.5158 21.733C13.6766 21.6206 13.8678 21.5599 14.064 21.559H14.113C14.769 21.559 15.113 21.967 15.224 22.878C15.2855 23.4955 15.5468 24.076 15.9682 24.5315C16.3896 24.987 16.9481 25.2926 17.5589 25.4018C18.1697 25.5111 18.7995 25.4181 19.3527 25.1369C19.9059 24.8558 20.3522 24.4018 20.624 23.844C20.9353 23.0528 20.9353 22.1731 20.624 21.382C20.3877 20.8957 20.0192 20.4858 19.5608 20.1992C19.1025 19.9125 18.5726 19.7607 18.032 19.761H17.932C16.9103 19.6908 15.9295 19.3316 15.1043 18.7252C14.279 18.1187 13.6432 17.2901 13.271 16.336C12.9608 15.4519 12.9139 14.4967 13.1359 13.5864C13.358 12.6762 13.8395 11.8499 14.522 11.208L14.559 11.171C15.125 10.608 15.125 10.608 16.593 9.90799L16.706 9.85499C16.872 9.77599 16.884 9.72899 16.929 9.01599C16.988 8.05399 17.409 7.43299 18 7.43299C18.2477 7.44281 18.4856 7.53263 18.678 7.68899C19.021 7.94699 19.121 8.22299 19.164 9.02499C19.205 9.73899 19.215 9.77699 19.383 9.85799L19.5 9.90799C20.971 10.608 20.971 10.608 21.539 11.178L21.572 11.211C22.1221 11.6947 22.5373 12.3128 22.777 13.005C23.0168 13.6971 23.073 14.4397 22.94 15.16C22.8709 15.3433 22.748 15.5014 22.5874 15.6135C22.4267 15.7256 22.2359 15.7864 22.04 15.788H21.99C21.334 15.788 20.99 15.376 20.873 14.452C20.808 13.8361 20.5443 13.2582 20.1218 12.8055C19.6992 12.3527 19.1408 12.0498 18.5309 11.9425C17.921 11.8352 17.2928 11.9294 16.7411 12.2107C16.1894 12.4921 15.7443 12.9453 15.473 13.502C15.2399 14.0381 15.1691 14.6308 15.2691 15.2068C15.3692 15.7828 15.6358 16.3168 16.036 16.743C16.5788 17.2805 17.3111 17.5829 18.075 17.585H18.16C19.1828 17.6529 20.1651 18.011 20.9917 18.6172C21.8183 19.2235 22.4549 20.0528 22.827 21.008C23.137 21.8917 23.1841 22.8463 22.9624 23.7561C22.7407 24.666 22.2598 25.492 21.578 26.134L21.539 26.174C20.975 26.742 20.975 26.742 19.499 27.442L19.392 27.494C19.226 27.572 19.214 27.62 19.169 28.333C19.102 29.433 18.787 29.86 18.056 29.86C17.325 29.86 17 29.418 16.935 28.328Z" fill="#252849" />
          </svg> */}
            <i class="material-icons  svg_iconbx">payment</i>
            <span className="side_head">Payments</span>
          </ListItemLink>}
          {(user?.role == "brand") && <ListItemLink to="/pricing" data-bs-toggle="tooltip" data-bs-placement="top" title="Change Plan">
            {/* <svg className="text_black svg_iconbx" xmlns="http://www.w3.org/2000/svg" width="25" height="20" viewBox="0 0 60 60" fill="none">
            <path d="M9.375 3.75V56.25H50.625V3.75H9.375ZM46.875 52.5H13.125V7.5H46.875V52.5ZM28.125 11.25H16.875V22.5H28.125V11.25ZM24.375 18.75H20.625V15H24.375V18.75ZM43.125 18.75H30V15H43.125V18.75ZM28.125 24.375H16.875V35.625H28.125V24.375ZM24.375 31.875H20.625V28.125H24.375V31.875ZM43.125 31.875H30V28.125H43.125V31.875ZM28.125 37.5H16.875V48.75H28.125V37.5ZM24.375 45H20.625V41.25H24.375V45ZM43.125 45H30V41.25H43.125V45Z" fill="#111918" />
          </svg> */}
            <i class="material-icons  svg_iconbx">list_alt</i>
            <span className="side_head">Change Plan</span>
          </ListItemLink>}
        </div>
      </div>

    </div>
  );
}

export default Html
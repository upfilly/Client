import React, { useEffect, useState } from "react";

const Html = ({ tabChange, tab, ListItemLink, tabclass, urlAllow, setActiveSidebar, activeSidebar, user }) => {
  const [addedUser, setaddedUser] = useState()

  // const addedUser = JSON.parse(localStorage.getItem('addedUser'))

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

            {/* <svg className="text_black  svg_iconbx" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.75089 0.113006C1.35475 0.242813 0.996345 0.467467 0.706855 0.767415C0.417364 1.06736 0.205565 1.43351 0.0898902 1.83401C-0.0321098 2.23401 -0.0291098 11.079 0.0898902 11.481C0.233574 11.9597 0.513644 12.3861 0.895842 12.708C1.27804 13.03 1.74579 13.2337 2.24189 13.294C2.79689 13.366 10.4959 13.367 11.0589 13.294C11.6272 13.224 12.1557 12.9659 12.5602 12.5606C12.9647 12.1554 13.2219 11.6264 13.2909 11.058C13.3639 10.5 13.3639 2.80201 13.2909 2.24401C13.2306 1.74846 13.0273 1.28118 12.7059 0.899212C12.3845 0.517246 11.9588 0.237112 11.4809 0.0930056C11.0279 -0.0439944 2.15889 -0.0239944 1.75089 0.113006ZM17.7879 0.113006C17.3252 0.265839 16.9157 0.547379 16.6074 0.924628C16.299 1.30188 16.1046 1.7592 16.0469 2.24301C15.9739 2.80101 15.9739 10.499 16.0469 11.057C16.1158 11.6254 16.3731 12.1544 16.7776 12.5596C17.1821 12.9649 17.7106 13.223 18.2789 13.293C18.8429 13.365 26.5409 13.365 27.0959 13.293C27.592 13.2327 28.0597 13.029 28.4419 12.707C28.8241 12.3851 29.1042 11.9587 29.2479 11.48C29.3729 11.069 29.3729 2.23301 29.2479 1.82201C29.1257 1.41141 28.9027 1.03789 28.5994 0.735398C28.296 0.432909 27.9218 0.211053 27.5109 0.0900056C27.0689 -0.0439944 18.1919 -0.0209944 17.7919 0.116006M11.0439 2.25201L11.1769 2.37701V6.66201C11.1769 10.871 11.1769 10.95 11.0619 11.062C10.9469 11.174 10.8709 11.177 6.66989 11.177H2.39189L2.25889 11.052L2.12589 10.927V2.39301L2.25089 2.26001L2.37589 2.12701H10.9109L11.0439 2.25201ZM27.0809 2.25201L27.2139 2.37701V10.913L27.0889 11.046L26.9639 11.179H22.6789C18.4699 11.179 18.3909 11.179 18.2789 11.064C18.1669 10.949 18.1639 10.873 18.1639 6.67201V2.39301L18.2889 2.26001L18.4139 2.12701H26.9489L27.0819 2.25201M2.19289 16.05C1.70763 16.1229 1.25291 16.3317 0.881299 16.6522C0.509687 16.9726 0.236353 17.3917 0.0928902 17.861C-0.0291098 18.261 -0.0321098 27.107 0.0928902 27.508C0.213546 27.9199 0.435447 28.295 0.738339 28.5992C1.04123 28.9033 1.41547 29.1267 1.82689 29.249C2.23789 29.374 11.0739 29.374 11.4849 29.249C11.9635 29.1053 12.3899 28.8253 12.7119 28.4431C13.0339 28.0609 13.2375 27.5931 13.2979 27.097C13.3699 26.542 13.3709 18.843 13.2979 18.28C13.2279 17.7117 12.9697 17.1832 12.5645 16.7787C12.1593 16.3742 11.6303 16.117 11.0619 16.048C10.5459 15.981 2.71589 15.983 2.19589 16.048M18.2249 16.048C17.6686 16.1323 17.155 16.3959 16.7622 16.7988C16.3695 17.2016 16.119 17.7217 16.0489 18.28C15.9759 18.838 15.9759 26.536 16.0489 27.094C16.1092 27.5901 16.3129 28.0579 16.6348 28.4401C16.9568 28.8223 17.3832 29.1023 17.8619 29.246C18.2729 29.371 27.1089 29.371 27.5199 29.246C27.9313 29.1237 28.3055 28.9003 28.6084 28.5962C28.9113 28.292 29.1332 27.9169 29.2539 27.505C29.3759 27.105 29.3729 18.26 29.2539 17.858C29.1102 17.3794 28.8301 16.953 28.4479 16.631C28.0657 16.309 27.598 16.1054 27.1019 16.045C26.5809 15.977 18.7539 15.981 18.2279 16.045M11.0679 18.273C11.1809 18.385 11.1829 18.464 11.1829 22.665V26.943L11.0579 27.076L10.9329 27.209H2.39189L2.25889 27.084L2.12589 26.959V18.43L2.25089 18.297L2.37589 18.164H6.66189C10.8709 18.164 10.9499 18.164 11.0619 18.279M27.0809 18.289L27.2139 18.414V26.949L27.0889 27.082L26.9639 27.215H18.4299L18.2969 27.09L18.1639 26.965V22.679C18.1639 18.47 18.1639 18.391 18.2789 18.279C18.3939 18.167 18.4699 18.164 22.6709 18.164H26.9489L27.0819 18.289" fill="#252849" />
            </svg> */}
            <i class="material-icons  svg_iconbx">grid_view</i>
            <span className="side_head">Dashboard </span>
          </ListItemLink>
        </> : <></>}
        {(user?.role == "brand" || addedUser?.role == "brand") && <>

          {urlAllow('affiliate', 'group') ? <>
            <div className="nav-item">
              <a className={` side_titles  nav-link hoverclass affilate ${tabclass('affiliates') || tab == 'affiliates' ? '' : 'collapsed-m'}`} onClick={() => tabChange('affiliates')}
                data-bs-toggle="tooltip" data-bs-placement="top" title="Affiliate">
                {/* <svg className="text_black  mr-2svg_iconbx" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M30.3899 5.214C27.9004 2.72491 24.7287 1.02991 21.276 0.343319C17.8232 -0.343269 14.2443 0.00939524 10.992 1.35672C7.73962 2.70404 4.9598 4.98551 3.00404 7.91265C1.04828 10.8398 0.00439453 14.2811 0.00439453 17.8015C0.00439453 21.3219 1.04828 24.7632 3.00404 27.6904C4.9598 30.6175 7.73962 32.899 10.992 34.2463C14.2443 35.5936 17.8232 35.9463 21.276 35.2597C24.7287 34.5731 27.9004 32.8781 30.3899 30.389C32.0431 28.7361 33.3545 26.7737 34.2492 24.6139C35.1439 22.4541 35.6044 20.1393 35.6044 17.8015C35.6044 15.4637 35.1439 13.1489 34.2492 10.9891C33.3545 8.82931 32.0431 6.86692 30.3899 5.214ZM8.9249 30.762C9.29296 28.6751 10.3845 26.7845 12.0079 25.4224C13.6313 24.0602 15.6827 23.3136 17.8019 23.3136C19.9211 23.3136 21.9725 24.0602 23.5959 25.4224C25.2193 26.7845 26.3108 28.6751 26.6789 30.762C24.0663 32.5562 20.9713 33.5166 17.8019 33.5166C14.6325 33.5166 11.5375 32.5562 8.9249 30.762ZM12.1419 15.562C12.1419 14.4423 12.474 13.3477 13.0961 12.4167C13.7182 11.4857 14.6025 10.7601 15.637 10.3317C16.6715 9.90332 17.8099 9.79133 18.908 10.0099C20.0062 10.2285 21.0149 10.7679 21.8065 11.5598C22.5982 12.3517 23.1372 13.3606 23.3554 14.4588C23.5736 15.5571 23.4612 16.6954 23.0324 17.7298C22.6036 18.7641 21.8777 19.6481 20.9465 20.2699C20.0153 20.8917 18.9206 21.2234 17.8009 21.223C16.3 21.2225 14.8608 20.626 13.7996 19.5646C12.7384 18.5032 12.1422 17.0629 12.1419 15.562ZM28.4849 29.315C28.0272 27.6952 27.2077 26.2004 26.0881 24.9435C24.9686 23.6866 23.5782 22.7003 22.0219 22.059C23.4227 21.1488 24.4917 19.8102 25.0696 18.2429C25.6475 16.6755 25.7032 14.9633 25.2286 13.3617C24.7539 11.76 23.7743 10.3547 22.4357 9.3553C21.0972 8.35589 19.4714 7.81591 17.8009 7.81591C16.1304 7.81591 14.5046 8.35589 13.1661 9.3553C11.8275 10.3547 10.8479 11.76 10.3732 13.3617C9.89855 14.9633 9.95432 16.6755 10.5322 18.2429C11.1101 19.8102 12.1791 21.1488 13.5799 22.059C12.0235 22.7002 10.6331 23.6865 9.51357 24.9434C8.39399 26.2004 7.57449 27.6951 7.1169 29.315C4.80043 27.1675 3.1849 24.3717 2.48102 21.2924C1.77714 18.213 2.01759 14.993 3.17099 12.0523C4.3244 9.11165 6.33722 6.58682 8.94694 4.80714C11.5567 3.02746 14.6421 2.07554 17.8009 2.07554C20.9597 2.07554 24.0451 3.02746 26.6549 4.80714C29.2646 6.58682 31.2774 9.11165 32.4308 12.0523C33.5842 14.993 33.8246 18.213 33.1208 21.2924C32.4169 24.3717 30.8014 27.1675 28.4849 29.315Z" fill="#252849" />
                </svg> */}
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
                {/* <i className="fa fa-user-circle-o icon  svg_iconbx" aria-hidden="true"></i> */}
                <div className="d-flex align-items-center icns_center">
                <i class="material-icons  svg_iconbx" >manage_accounts</i>
                <span className="side_head">Manage</span>
                </div>
              </ListItemLink>
            </> : <></>}
            {urlAllow('group') ? <>
              <ListItemLink to="/group" data-bs-toggle="tooltip" data-bs-placement="top" title="Groups">
                {/* <i className="fa fa-user-circle-o icon  svg_iconbx" aria-hidden="true"></i> */}
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
                {/* <svg className="text_black svg_iconbx" xmlns="http://www.w3.org/2000/svg" width="36" height="37" viewBox="0 0 36 37" fill="none">
                  <path d="M2.81907e-08 18.646C3.37655e-08 15.1375 1.0404 11.7078 2.98963 8.79063C4.93886 5.87344 7.70937 3.59979 10.9508 2.2572C14.1922 0.914602 17.759 0.563369 21.2001 1.24791C24.6411 1.93246 27.8019 3.62203 30.2827 6.10298C32.7635 8.58392 34.4529 11.7448 35.1373 15.1859C35.8216 18.627 35.4702 22.1937 34.1274 25.4351C32.7846 28.6765 30.5108 31.4468 27.5935 33.3959C24.6762 35.345 21.2465 36.3852 17.738 36.385C15.4085 36.385 13.1019 35.9261 10.9497 35.0347C8.79759 34.1432 6.84212 32.8365 5.19499 31.1893C3.54785 29.5421 2.2413 27.5865 1.34994 25.4343C0.458579 23.2821 -0.000131298 20.9755 2.81907e-08 18.646ZM2.048 18.646C2.0482 21.7489 2.96848 24.7821 4.69249 27.362C6.4165 29.9418 8.86679 31.9526 11.7335 33.1399C14.6003 34.3273 17.7547 34.6379 20.798 34.0325C23.8413 33.4271 26.6367 31.9329 28.8308 29.7388C31.0249 27.5447 32.5191 24.7493 33.1245 21.706C33.7299 18.6627 33.4193 15.5083 32.2319 12.6415C31.0446 9.77478 29.0339 7.32449 26.454 5.60048C23.8741 3.87648 20.8409 2.95619 17.738 2.95599C13.5768 2.95599 9.58594 4.60904 6.64349 7.55149C3.70105 10.4939 2.048 14.4847 2.048 18.646ZM16.935 28.328C16.894 27.614 16.885 27.576 16.716 27.495L16.603 27.441C15.133 26.741 15.133 26.741 14.565 26.171L14.531 26.138C13.9807 25.6542 13.5654 25.0359 13.3258 24.3435C13.0862 23.6511 13.0304 22.9084 13.164 22.188C13.2323 22.0041 13.355 21.8454 13.5158 21.733C13.6766 21.6206 13.8678 21.5599 14.064 21.559H14.113C14.769 21.559 15.113 21.967 15.224 22.878C15.2855 23.4955 15.5468 24.076 15.9682 24.5315C16.3896 24.987 16.9481 25.2926 17.5589 25.4018C18.1697 25.5111 18.7995 25.4181 19.3527 25.1369C19.9059 24.8558 20.3522 24.4018 20.624 23.844C20.9353 23.0528 20.9353 22.1731 20.624 21.382C20.3877 20.8957 20.0192 20.4858 19.5608 20.1992C19.1025 19.9125 18.5726 19.7607 18.032 19.761H17.932C16.9103 19.6908 15.9295 19.3316 15.1043 18.7252C14.279 18.1187 13.6432 17.2901 13.271 16.336C12.9608 15.4519 12.9139 14.4967 13.1359 13.5864C13.358 12.6762 13.8395 11.8499 14.522 11.208L14.559 11.171C15.125 10.608 15.125 10.608 16.593 9.90799L16.706 9.85499C16.872 9.77599 16.884 9.72899 16.929 9.01599C16.988 8.05399 17.409 7.43299 18 7.43299C18.2477 7.44281 18.4856 7.53263 18.678 7.68899C19.021 7.94699 19.121 8.22299 19.164 9.02499C19.205 9.73899 19.215 9.77699 19.383 9.85799L19.5 9.90799C20.971 10.608 20.971 10.608 21.539 11.178L21.572 11.211C22.1221 11.6947 22.5373 12.3128 22.777 13.005C23.0168 13.6971 23.073 14.4397 22.94 15.16C22.8709 15.3433 22.748 15.5014 22.5874 15.6135C22.4267 15.7256 22.2359 15.7864 22.04 15.788H21.99C21.334 15.788 20.99 15.376 20.873 14.452C20.808 13.8361 20.5443 13.2582 20.1218 12.8055C19.6992 12.3527 19.1408 12.0498 18.5309 11.9425C17.921 11.8352 17.2928 11.9294 16.7411 12.2107C16.1894 12.4921 15.7443 12.9453 15.473 13.502C15.2399 14.0381 15.1691 14.6308 15.2691 15.2068C15.3692 15.7828 15.6358 16.3168 16.036 16.743C16.5788 17.2805 17.3111 17.5829 18.075 17.585H18.16C19.1828 17.6529 20.1651 18.011 20.9917 18.6172C21.8183 19.2235 22.4549 20.0528 22.827 21.008C23.137 21.8917 23.1841 22.8463 22.9624 23.7561C22.7407 24.666 22.2598 25.492 21.578 26.134L21.539 26.174C20.975 26.742 20.975 26.742 19.499 27.442L19.392 27.494C19.226 27.572 19.214 27.62 19.169 28.333C19.102 29.433 18.787 29.86 18.056 29.86C17.325 29.86 17 29.418 16.935 28.328Z" fill="#252849" />
                </svg> */}
                <i class="material-icons  svg_iconbx">monetization_on</i>
                <span  className="side_head">Commissions
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
                {/* <i className="fa fa-user-circle-o icon  svg_iconbx" aria-hidden="true"></i> */}
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

          { <ListItemLink to="/addbanner" data-bs-toggle="tooltip" data-bs-placement="top" title="Campaign Management">
            <i className="material-icons  svg_iconbx" title="campaignManagement">collections</i>
            <span className="side_head">{(user.role == "brand" || addedUser?.role == "brand") ? "Add Banner" : "Banners"}</span>
          </ListItemLink>}

          {user && (user?.role == "brand" || addedUser?.role == "brand") && <ListItemLink to="/commission/addcommision" data-bs-toggle="tooltip" data-bs-placement="top" title="Commissions">
            <div className="d-flex align-items-center icns_center">
              <i class="material-icons svg_iconbx">payments</i >
              <span className="side_head">Add Commissions</span>
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
          <i className="material-icons  svg_iconbx"  title="product">groups_3</i>
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
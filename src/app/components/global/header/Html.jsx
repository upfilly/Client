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
  const isDashboard = pathname.includes('/proposals') || pathname.includes('/bookingForm') || pathname.includes('/dashboard') || pathname.includes('/campaign') || pathname.includes('/campaignManagement') || pathname.includes('/affiliate')
  const param = useSearchParams()
  const id = param.get("id")
  const code = param.get("campaign_code")
  const eventType = param.get("event_type")

  // const ipLocation = async () => {
  //   // Get the user's IP address
  //   const ipRes = await axios.get("https://geolocation-db.com/json/");
  //   if (ipRes && ipRes.data && ipRes.data.ip) {
  //     const ipAddress = ipRes.data.ip;
  //     const locationRes = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
  //     if (locationRes && locationRes.data) {
  //       // console.log(locationRes,"========locationRes")
  //       localStorage.setItem("ip", ipAddress);
  //       localStorage.setItem("location", JSON.stringify(locationRes.data));
  //     }
  //   }
  // };

  // useEffect(() => {
  //   ipLocation()
  // }, [])

  useEffect(() => {
    ConnectSocket.emit("notify-message", { user_id: user?.id });
    ConnectSocket.on(`notify-message`, (data) => {
      // console.log("notify-message", data)
    });
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
        // loader(false)
      })
    }
    // };
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
      .catch((error) =>{ 
        // console.log(error, "==Ip Address Error")
      });
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
        // let url = '/dashboard'
        // history.push(url);
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


  return (
    <>
      <div className="">
        <div className="blue_header ">
          <div className="container">
            <div className="row" >
              {!user ?
                <div className="col-12 col-md-12 col-lg-9 col-xl-10 text-center text-lg-left">
                  <div className=" set_heading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 38 36" fill="none">
                      <g clipPath="url(#clip0_3_252)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M25.8435 1.79235C25.7584 1.89299 25.503 2.25472 25.2761 2.59616C22.4244 6.87846 18.3355 10.5844 15.0286 11.8907L14.4627 12.1141L17.2073 23.2505L17.7684 23.1943C21.4018 22.8295 26.2999 24.0742 30.9824 26.5419C32.2521 27.2117 32.2416 27.2082 32.6276 27.1125C32.7887 27.0888 32.9398 27.0199 33.0636 26.9136C33.1874 26.8074 33.2789 26.668 33.3279 26.5113C33.4384 26.1944 27.4666 1.96335 27.2214 1.73404C27.0267 1.56476 26.7758 1.47635 26.5198 1.48675C26.2638 1.49716 26.0217 1.60561 25.8429 1.79008M5.89448 14.4769C1.36936 16.9333 2.34567 23.8988 7.37111 25.0083C8.56016 25.2712 8.73435 25.2488 12.2557 24.3809L15.3515 23.618L12.6483 12.65L9.53074 13.4213C6.44804 14.1841 6.40737 14.1959 5.89448 14.4745M32.2 13.6473C32.6592 15.5104 33.0033 16.8097 33.0371 16.8013C33.4993 16.3407 33.8344 15.766 34.0097 15.1338C34.185 14.5015 34.1944 13.8333 34.037 13.1945C33.8796 12.5558 33.5607 11.9685 33.1117 11.4901C32.6627 11.0117 32.0989 10.6586 31.4756 10.4655C31.4435 10.4734 31.7409 11.7842 32.2 13.6473ZM9.65679 26.9687C9.87739 27.8639 11.6995 31.4053 12.7158 32.915C13.361 33.8733 13.1101 33.8609 16.2465 33.0879C19.1171 32.3804 19.0272 32.4153 19.196 31.9324C19.3422 31.5131 19.2028 31.2336 18.3111 30.164C17.866 29.6296 17.4699 29.1369 17.431 29.0686C17.3604 28.9448 17.361 28.9446 18.4685 28.6512C20.1219 28.2135 20.2359 27.9542 19.4195 26.4804C19.205 26.0944 18.9499 25.5899 18.8508 25.3596C18.6996 25.0081 18.6486 24.9416 18.5323 24.9419C18.0373 24.9595 17.5455 25.0271 17.0643 25.1437L16.7313 25.2463L17.0076 25.9213C17.1588 26.2927 17.3255 26.6808 17.3765 26.7835L17.4692 26.9707L16.8331 27.1274C16.2798 27.2638 16.1898 27.2715 16.1388 27.1857C15.9879 26.9295 15.4027 25.878 15.335 25.7413L15.2589 25.5875L12.5566 26.2293C11.0703 26.5823 9.8015 26.8606 9.73679 26.8476C9.64212 26.8293 9.62649 26.8531 9.65482 26.968" fill="white" />
                      </g>
                      <defs>
                        <clipPath id="clip0_3_252">
                          <rect width="31.7804" height="28.2493" fill="white" transform="translate(0 8) rotate(-13.8449)" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span className="ml-2">Subscribe to an annual plan to lock in today's pricing before December 1st, 2023!</span>
                  </div>

                </div> : <div></div>}

              <div className={!user ? "col-12 col-md-12 col-lg-3 col-xl-2 " : "col-12 col-md-12 px-0"}>
                <div className="right_auth d-flex align-items-center blue-header-main justify-content-center justify-content-lg-end">
                  {(!user) && <>
                  <img src="/assets/img/users1.svg" className="hedsvg" />

                  <Link className="ml-2 mr-2" href="/SignupOptions"
                  // onClick={() => setShowPopup(true)}
                  >Sign Up</Link> /
                    <Link className="ml-2 mr-2" href="/login">Sign In</Link></>}
                  {user && <>
                    {(user?.request_status != "accepted") && <span className="text-danger">Please update your profile details to ensure they meet the required criteria for verification. Once your details are updated, the admin will review your request.</span>}
                    <Dropdown className="ml-auto ml-2 proifle_dropbx">
                      <Dropdown.Toggle className="d-flex align-items-center justify-content-end drpdown_new" variant="" id="">
                        <img alt="image" src={user?.image ? methodModel.userImg(user && user?.image) : '/assets/img/person.jpg'} className="rounded-circle mr-1" />
                        <div className="ml-1 nameFont text-white">
                          <b className="name_user">{user?.firstName}</b>
                        </div>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {(user?.request_status == "accepted") && <Dropdown.Item className="has-icon" onClick={() => history.push('/dashboard')}><i class="fa fa-dashboard mr-2 " /> My DashBoard</Dropdown.Item>
                        }
                        <Dropdown.Item className="has-icon" onClick={() => history.push('/profile')}> <i className="fa fa-user mr-2 " /> Profile</Dropdown.Item>
                        {/* {(user?.request_status == "accepted") &&<Dropdown.Item className="has-icon" onClick={() => history.push('/marketplace')}><i class="fa-solid fa-chart-simple mr-2 "></i> MarketPlace</Dropdown.Item>}                        */}
                         <Dropdown.Item className="has-icon" onClick={() => history.push('/profile/change-password')}> <i className="fa fa-cog mr-2" aria-hidden="true"></i> Change Password</Dropdown.Item>
                        <Dropdown.Item className="has-icon" onClick={() => Logout()}> <i class="fa fa-sign-out mr-2" aria-hidden="true"></i> Logout</Dropdown.Item>

                      </Dropdown.Menu>

                    </Dropdown>

                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {pathname.includes('/bookingForm') && <nav class="navbar navbar-expand-lg navbar-light bg-white">
        <Link href="/">
          <img src="/assets/img/logo.png" className="logo" alt="" />
        </Link>
      </nav>} */}
        {!isDashboard &&
          <nav class="navbar container navbar-expand-lg navbar-light bg-white pl-4 pr-4 pt-3 pb-2">
            <Link href="/">
              <img
                src={`${environment?.api}${settingData?.logo}`}
                className="logo"
                alt=""
                style={{ width: '200px', height: 'auto' }}
              />
            </Link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse set_nabx py-2" id="navbarSupportedContent">
              <ul class="navbar-nav d-flex gap-0 ml-auto set_navbx">
              <li class="nav-item">
                  <Link
                    class={`nav-link py-2 ${pathname == "/merchant" ? 'active' : ''}`}
                    href="/merchant">Merchant</Link>
                </li>
                <li class="nav-item">
                  <Link
                    class={`nav-link py-2 ${pathname == "/affguide" ? 'active' : ''}`}
                    href="/affguide">Affiliate</Link>
                </li>
                <li class="nav-item">
                  <Link
                    class={`nav-link py-2 ${pathname == "/platforms" ? 'active' : ''}`}
                    href="/platforms">Platform</Link>
                </li>
                {/* {false && */}
                 <>{(user?.role == "brand" || !user) && <li class="nav-item">
                  <Link class={`nav-link py-2 ${pathname == "/pricing" ? 'active' : ''}`} href="/pricing">Pricing</Link>
                </li>}</>
                {/* } */}
                {/* <li class="nav-item">
                  <Link class={`nav-link ${pathname == "/partners" ? 'active' : ''}`} href="/partners">Partners</Link>
                </li> */}
                <li class="nav-item">
                  <Link class={`nav-link py-2 ${pathname == "/resources" ? 'active' : ''}`} href="/resources">Features</Link>
                </li>
                <li class="nav-item">
                  <Link class={`nav-link py-2 ${pathname == "/company" ? 'active' : ''}`} href="/company">Subscriptions</Link>
                </li>
                {(user?.role == "brand" || !user) && <li class="nav-item">
                  <Link class={`nav-link py-2 ${pathname == "/scriptGuide" ? 'active' : ''}`} href="/scriptGuide">Script</Link>
                </li>}

              </ul>
              <form class="my-2 my-lg-0 ">
                {/* <li class="nav-item">
            {(user?.role == "brand" || !user) && <Link class="btn btn-primary login" href="/pricing">Book a Demo</Link>}
            </li> */}
                {/* <li class="nav-item">
                  <Link class={`btn btn-primary login ms-2 ${pathname == "/contactUs" ? 'active_btn' : ''}`} href="/contactUs">Book a Demo</Link>
                </li> */}
                {/* <li class="nav-item text-center">
                  <Link class={`btn btn-primary   contact-btn ms-2 ${pathname == "/contactUs" ? '' : ''}`} href="/contactUs">Contact Us</Link>
                </li> */}
              </form>
            </div>
          </nav>


        }

      </div>
    </>




  );
}




export default Html


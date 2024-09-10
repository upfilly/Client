'use client'

import { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import "./style.scss";
import Layout from './components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import CookiesPopup from './cookiesModel'

export default function Home() {
  const user = crendentialModel.getUser()
  const history = useRouter()
  const [FAQdata, setFAQData] = useState([])
  const [contentData,setContentData] = useState(null)
  const [IP,setIP] = useState('')
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [location, setLocation] = useState(null);
  const param = useSearchParams()
  const id = param.get("affiliate_id")
  const data = param.get("url")
  const url = decodeURIComponent(data)
  const [payload, setPayload] = useState({
    isSet: false,
  });
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    setQueryParams(params);
  }, []);

  useEffect(() => {
    const dataInCookies = Cookies.get('Upfilly_affiliate')

    setPayload(prevPayload => ({
      ...prevPayload,
      isSet: dataInCookies ? true : false,
    }));
  }, []);

  const getIpData =() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((res) => {
        setIP(res.ip);
        // getUserLocation(data.ip, slugData);
      })
      .catch((error) => console.log(error, "==Ip Address Error"));
    // const res = await axios.get("https://api.ipify.org/?format=json");
    // setIP(res.data.ip);
  };

  const setCookieValue = () => {
    Cookies.set('Upfilly_affiliate', id)
  };

  useEffect(() => {
    if(id){
      getIpData();
      setCookieValue()
    }
  }, []);

  useEffect(() => {
    const getDeviceInfo = () => {
      const { userAgent, platform, language, vendor } = navigator;
      setDeviceInfo({
        userAgent,
        platform,
        language,
        vendor,
        browser: {
          name: getBrowserName(),
          version: getBrowserVersion()
        },
        deviceType: getDeviceType()
      });
    };

    const getDeviceType = () => {
      if (window.matchMedia('(max-width: 768px)').matches) {
        return 'Mobile';
      } else if (window.matchMedia('(max-width: 1024px)').matches) {
        return 'Tablet';
      } else {
        return 'Desktop';
      }
    };

    const getBrowserName = () => {
      const userAgent = navigator.userAgent;
      const browsers = {
        Chrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
        Firefox: /Firefox/.test(userAgent),
        Safari: /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor),
        Edge: /Edge/.test(userAgent),
        IE: /Trident/.test(userAgent)
      };

      for (const browser in browsers) {
        if (browsers[browser]) return browser;
      }

      return 'Unknown';
    };

    const getBrowserVersion = () => {
      const userAgent = navigator.userAgent;
      const versionRegex = {
        Chrome: /(?:Chrome|CriOS)\/([0-9.]+)/,
        Firefox: /Firefox\/([0-9.]+)/,
        Safari: /Version\/([0-9.]+)/,
        Edge: /Edge\/([0-9.]+)/,
        IE: /(?:MSIE |Trident\/.*; rv:)([0-9.]+)/
      };

      for (const browser in versionRegex) {
        const match = userAgent.match(versionRegex[browser]);
        if (match) return match[1];
      }

      return 'Unknown';
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          error => {
            console.error(error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getDeviceInfo();
    getLocation();
  }, []);


  useEffect(() => {
    if (id && IP) {
      const data1 = {
        "affiliate_id": id,
        "affiliate_link": window?.location?.href,
        "ip_address": IP,
        "device": deviceInfo?.deviceType,
        "browser": deviceInfo?.browser?.name,
        "os": deviceInfo?.platform,
        "lat": deviceInfo?.latitude,
        "lng": deviceInfo?.longitude,
        "isSet": payload?.isSet,
      }
      
      ApiClient.post('saved-cookies', data1).then(res => {
        if (res.success) {
          if (url) {
            window.open(url, '_self')
          }
        }
      })
    }
  }, [IP])

  const getContentData = (p = {}) => {
    let url = 'content'
    ApiClient.get(url, { title: "Home" }).then(res => {
      if (res) {
        setContentData(res?.data)
        getData(res?.data?.id)
      }
    })
  }

  const getData = (id) => {
    let url = 'faq/all'
    ApiClient.get(url,{content_id:id}).then(res => {
      if (res.success) {
        const data = res?.data?.data;
        setFAQData(data)
      }
    })
  }

  useEffect(() => {
    if (user) {
      getContentData()
    }
  }, [])

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className='container-fluid pl-4 pr-4'>
        <div className="main-section">
          <div className="row align-items-center flex-lg-row flex-column-reverse  flex-md-row ">
            <div className="col-md-6 ">
            <div className='pl_section ' >
            <h2 className='heding_main'>Give Your  Growth Goals The Right tools</h2>
              
              <p className='desc'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard</p>
              
              {/* {(user?.role == "brand" || !user) && <a className='btn btn-primary mt-3 mr-2' href="/pricing">Book a Demo</a>} */}
              {(user?.role == "brand" || !user) && <a className='btn btn-outline-primary mt-3' href="/pricing">Prices</a>}
            </div>
            </div>
            <div className="col-md-6">
              <div className='centerimg mb-4'>
                <img src="/assets/img/main.png" alt="" className='main_bg img-fluid' />
                {/* className='main_bg w-100' */}
              </div>
            </div>
          </div>
        </div>
       <div className="my-5">
       <div className="row">
          <div className="col-md-8 mx-auto">
            <p className='text-center social '>Trusted by industry leaders and best-in-class brands</p>
            <div className="d-flex  align-items-center flex-wrap gap-4  justify-content-center ">
              <img src="/assets/img/social5.png" alt="" className='social_img' />
              <img src="/assets/img/social1.png" alt="" className='social_img' />
              <img src="/assets/img/social6.png" alt="" className='social_img' />
              <img src="/assets/img/social7.png" alt="" className='social_img' />
              <img src="/assets/img/youtube.png" alt="" className='social_img' />
            </div>
          </div>
        </div>
       </div>
      </div>
      <div className="container ">
     <div className="my-5 mobile-pl ">
     <div className="row">
          <div className="col-md-12 text-center mt-5 mb-0">
            <h2 className='leading_heading'>The Leading Revenue Tools</h2>
            <p className='' >Providing best developers to create your affiliates</p>
          </div>
          </div>
     </div>

<div className="row">
        
        <div className="col-12 col-sm-12 col-md-6 col-lg-4">
          <div className="bg_blue p-4  mb-4">
            <h4 className='affiliatebx' >Affiliate <br /> Partnerships</h4>
            <p className='text-white para_affiliate'>Lorem Ipsum is simply dummy text of the printing and type</p>

            <div className="arrow">
              <img src="/assets/img/arrow.png" className='arrow_icon' alt="" />
            </div>

            <ul className='tool_list set_tool_list'>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-4">
          <div className="bg_blue p-4 mb-4 ">
            <h4 className='affiliatebx' >Media <br /> Buying</h4>
            <p className='text-white para_affiliate'>Lorem Ipsum is simply dummy text of the printing and type</p>

            <div className="arrow">
              <img src="/assets/img/arrow.png" className='arrow_icon' alt="" />
            </div>

            <ul className='tool_list set_tool_list'>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
            </ul>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-6 col-lg-4">
          <div className="bg_blue p-4 mb-4 ">
            <h4 className='affiliatebx' >Strategic <br /> Partnerships</h4>
            <p className='text-white para_affiliate'>Lorem Ipsum is simply dummy text of the printing and type</p>

            <div className="arrow">
              <img src="/assets/img/arrow.png" className='arrow_icon' alt="" />
            </div>

            <ul className='tool_list set_tool_list'>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
              <li>
                <img src="/assets/img/checkmark.png" className='chckrk' alt="" />
                Lorem Ipsum is simply dummy
              </li>
            </ul>
          </div>
        </div>
</div>

<div className='my-5'>
<div className="row align-items-center flex-column-reverse flex-md-row">
        
        

        <div className="col-12  col-sm-12 col-md-6 col-lg-5" >
          <div className="mb-4 lens_details prbx">
          <h1 className='text-black set_lensbx'>Use a Lens <br /> Performance</h1>
          <p>Lorem Ipsum is simply dummy text of the  printing and type lorem Ipsum is simply</p>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Understand Buyers</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Attribute User Activity</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Utilize CRM Stages</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Measure Organic</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          </div>
        </div>
        <div className="col-12  col-sm-12 col-md-6 col-lg-7 ">
          <div className="mb-4">
          <img src="/assets/img/lens.png" className='img-fluid' alt="" />
          </div>
        </div>

        </div>
</div>

<div className='my-5'>
<div className="row align-items-center">
        

        <div className="col-12  col-sm-12 col-md-6 col-lg-5 col-12  col-sm-12 col-md-6 col-lg-7">
        <div className="mb-4">
          <img src="/assets/img/scale.png" className='img-fluid' alt="" />
        </div>
        </div>
        <div className="col-12  col-sm-12 col-md-6 col-lg-5 ">
      <div className="mb-4 lens_details plbx">
      <h1 className='text-black set_lensbx '>Scale The Right  <br /> Channels</h1>
          <p>Lorem Ipsum is simply dummy text of the  printing and type lorem Ipsum is simply</p>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Understand Buyers</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Attribute User Activity</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Utilize CRM Stages</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
          <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
            <b>Measure Organic</b>
            <img src="/assets/img/check.png" className='check_list' alt="" />
          </div>
      </div>
        </div>

        </div>
</div>
<div className='my-5'>
<div className="row align-items-center flex-column-reverse flex-md-row">
    
          

    <div className="col-12  col-sm-12 col-md-6 col-lg-5">
    <div className="mb-4 lens_details prbx">
    <h1 className='text-black set_lensbx'>Simplify Your <br /> Growth</h1>
      <p>Lorem Ipsum is simply dummy text of the  printing and type lorem Ipsum is simply</p>
      <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
        <b>Understand Buyers</b>
        <img src="/assets/img/check.png" className='check_list' alt="" />
      </div>
      <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
        <b>Attribute User Activity</b>
        <img src="/assets/img/check.png" className='check_list' alt="" />
      </div>
      <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
        <b>Utilize CRM Stages</b>
        <img src="/assets/img/check.png" className='check_list' alt="" />
      </div>
      <div className="d-flex justify-content-between border-bottom  mt-3 pt-2 mb-3 pb-3 flex_list">
        <b>Measure Organic</b>
        <img src="/assets/img/check.png" className='check_list' alt="" />
      </div>
    </div>
      
    </div>
    <div className="col-12  col-sm-12 col-md-6 col-lg-7">
    <div className="mb-4">
      <img src="/assets/img/grow.png" className='img-fluid' alt="" />
    </div>
    </div>
  </div>
</div>
        

        <div className="bg_tracked">
          <div className="row align-items-center">
            <div className="col-md-6">
             <div className="pl-0 pl-lg-5 mb-4 ">
             <h1 className='customers' >Customers <br />tracked in 2023 <br />more than +3Mi </h1>
              {(user?.role == "brand" || !user) && <a className='btn btn-light' href="/pricing">Book a Demo</a>}
             </div>
            </div>
            <div className="col-md-6">
              <div className="bg-white text-black p-4 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="41" viewBox="0 0 43 41" fill="none">
                  <path opacity="0.15" d="M24.42 38.8719V31.7199C24.4199 31.489 24.4653 31.2604 24.5536 31.047C24.6419 30.8337 24.7713 30.6398 24.9346 30.4765C25.0979 30.3133 25.2917 30.1838 25.5051 30.0955C25.7184 30.0072 25.9471 29.9618 26.178 29.9619C29.64 29.9619 31.524 26.4109 31.786 19.4009H26.177C25.7116 19.4007 25.2653 19.2159 24.936 18.8871C24.6066 18.5583 24.4211 18.1123 24.42 17.6469V2.53193C24.42 2.30111 24.4655 2.07255 24.5538 1.85932C24.6422 1.64609 24.7717 1.45235 24.935 1.28919C25.0982 1.12602 25.292 0.996621 25.5053 0.908382C25.7186 0.820144 25.9472 0.774795 26.178 0.774926H41.128C41.5941 0.774926 42.0411 0.960007 42.3707 1.28948C42.7004 1.61895 42.8857 2.06585 42.886 2.53193V17.6419C42.9164 20.7263 42.579 23.8034 41.881 26.8079C41.286 29.394 40.229 31.8514 38.761 34.0619C37.4058 36.0763 35.5886 37.7374 33.461 38.9069C31.2171 40.0832 28.7131 40.6758 26.18 40.6299C25.949 40.6302 25.7201 40.5849 25.5066 40.4967C25.2931 40.4085 25.0991 40.279 24.9356 40.1157C24.7722 39.9525 24.6425 39.7586 24.554 39.5451C24.4655 39.3317 24.42 39.103 24.42 38.8719ZM1.757 29.9589C1.29119 29.9589 0.84444 30.1439 0.514967 30.4732C0.185494 30.8025 0.000265403 31.2491 2.84602e-07 31.7149V38.8729C0.000530323 39.3386 0.185876 39.785 0.51532 40.114C0.844764 40.4431 1.29136 40.6279 1.757 40.6279C4.28982 40.6738 6.79343 40.0812 9.037 38.9049C11.1651 37.7362 12.9825 36.0749 14.337 34.0599C15.8059 31.8493 16.8632 29.3915 17.458 26.8049C18.1547 23.7996 18.4904 20.7218 18.458 17.6369V2.53093C18.4577 2.06485 18.2724 1.61795 17.9427 1.28848C17.6131 0.959006 17.1661 0.773926 16.7 0.773926H1.757C1.2911 0.774191 0.84435 0.959388 0.514906 1.28883C0.185462 1.61828 0.000265229 2.06502 2.84602e-07 2.53093V17.6369C-0.000131085 17.8677 0.0452181 18.0963 0.133457 18.3096C0.221696 18.5229 0.351094 18.7167 0.51426 18.88C0.677426 19.0432 0.87116 19.1727 1.08439 19.2611C1.29763 19.3494 1.52618 19.3949 1.757 19.3949H7.286C7.028 26.4069 5.171 29.9589 1.757 29.9589Z" fill="black" />
                </svg>

                <p className='mt-4 mb-4 pb-4 border-bottom'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived.</p>
                <div className="d-flex align-items-center">
                  <img src='/assets/img/person.jpg' className='icon_user' alt="" />
                  <div className='ml-2 line_height_user'>
                    <b>Person Name</b> <br />
                    <small>City Location</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       <div className="my-5">
       <div className="row">
          <div className="col-md-12 text-center mb-4">
            <h2 className='abouts mb-0' >What Customers Say About Us</h2>
          </div>
          <div className=" col-12 col-sm-12  col-md-6 col-lg-4">
            <div className="bgGray_about text-black p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 43 41" fill="none">
                <path opacity="0.15" d="M24.42 38.8719V31.7199C24.4199 31.489 24.4653 31.2604 24.5536 31.047C24.6419 30.8337 24.7713 30.6398 24.9346 30.4765C25.0979 30.3133 25.2917 30.1838 25.5051 30.0955C25.7184 30.0072 25.9471 29.9618 26.178 29.9619C29.64 29.9619 31.524 26.4109 31.786 19.4009H26.177C25.7116 19.4007 25.2653 19.2159 24.936 18.8871C24.6066 18.5583 24.4211 18.1123 24.42 17.6469V2.53193C24.42 2.30111 24.4655 2.07255 24.5538 1.85932C24.6422 1.64609 24.7717 1.45235 24.935 1.28919C25.0982 1.12602 25.292 0.996621 25.5053 0.908382C25.7186 0.820144 25.9472 0.774795 26.178 0.774926H41.128C41.5941 0.774926 42.0411 0.960007 42.3707 1.28948C42.7004 1.61895 42.8857 2.06585 42.886 2.53193V17.6419C42.9164 20.7263 42.579 23.8034 41.881 26.8079C41.286 29.394 40.229 31.8514 38.761 34.0619C37.4058 36.0763 35.5886 37.7374 33.461 38.9069C31.2171 40.0832 28.7131 40.6758 26.18 40.6299C25.949 40.6302 25.7201 40.5849 25.5066 40.4967C25.2931 40.4085 25.0991 40.279 24.9356 40.1157C24.7722 39.9525 24.6425 39.7586 24.554 39.5451C24.4655 39.3317 24.42 39.103 24.42 38.8719ZM1.757 29.9589C1.29119 29.9589 0.84444 30.1439 0.514967 30.4732C0.185494 30.8025 0.000265403 31.2491 2.84602e-07 31.7149V38.8729C0.000530323 39.3386 0.185876 39.785 0.51532 40.114C0.844764 40.4431 1.29136 40.6279 1.757 40.6279C4.28982 40.6738 6.79343 40.0812 9.037 38.9049C11.1651 37.7362 12.9825 36.0749 14.337 34.0599C15.8059 31.8493 16.8632 29.3915 17.458 26.8049C18.1547 23.7996 18.4904 20.7218 18.458 17.6369V2.53093C18.4577 2.06485 18.2724 1.61795 17.9427 1.28848C17.6131 0.959006 17.1661 0.773926 16.7 0.773926H1.757C1.2911 0.774191 0.84435 0.959388 0.514906 1.28883C0.185462 1.61828 0.000265229 2.06502 2.84602e-07 2.53093V17.6369C-0.000131085 17.8677 0.0452181 18.0963 0.133457 18.3096C0.221696 18.5229 0.351094 18.7167 0.51426 18.88C0.677426 19.0432 0.87116 19.1727 1.08439 19.2611C1.29763 19.3494 1.52618 19.3949 1.757 19.3949H7.286C7.028 26.4069 5.171 29.9589 1.757 29.9589Z" fill="black" />
              </svg>

              <p className='mt-4 mb-4 pb-4 borderbottom'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived.</p>
              <div className="d-flex align-items-center">
                <img src='/assets/img/person.jpg' className='icon_user' alt="" />
                <div className='ml-2 line_height_user'>
                  <b>Person Name</b> <br />
                  <small>City Location</small>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-12 col-sm-12  col-md-6 col-lg-4">
            <div className="bgGray_about text-black p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 43 41" fill="none">
                <path opacity="0.15" d="M24.42 38.8719V31.7199C24.4199 31.489 24.4653 31.2604 24.5536 31.047C24.6419 30.8337 24.7713 30.6398 24.9346 30.4765C25.0979 30.3133 25.2917 30.1838 25.5051 30.0955C25.7184 30.0072 25.9471 29.9618 26.178 29.9619C29.64 29.9619 31.524 26.4109 31.786 19.4009H26.177C25.7116 19.4007 25.2653 19.2159 24.936 18.8871C24.6066 18.5583 24.4211 18.1123 24.42 17.6469V2.53193C24.42 2.30111 24.4655 2.07255 24.5538 1.85932C24.6422 1.64609 24.7717 1.45235 24.935 1.28919C25.0982 1.12602 25.292 0.996621 25.5053 0.908382C25.7186 0.820144 25.9472 0.774795 26.178 0.774926H41.128C41.5941 0.774926 42.0411 0.960007 42.3707 1.28948C42.7004 1.61895 42.8857 2.06585 42.886 2.53193V17.6419C42.9164 20.7263 42.579 23.8034 41.881 26.8079C41.286 29.394 40.229 31.8514 38.761 34.0619C37.4058 36.0763 35.5886 37.7374 33.461 38.9069C31.2171 40.0832 28.7131 40.6758 26.18 40.6299C25.949 40.6302 25.7201 40.5849 25.5066 40.4967C25.2931 40.4085 25.0991 40.279 24.9356 40.1157C24.7722 39.9525 24.6425 39.7586 24.554 39.5451C24.4655 39.3317 24.42 39.103 24.42 38.8719ZM1.757 29.9589C1.29119 29.9589 0.84444 30.1439 0.514967 30.4732C0.185494 30.8025 0.000265403 31.2491 2.84602e-07 31.7149V38.8729C0.000530323 39.3386 0.185876 39.785 0.51532 40.114C0.844764 40.4431 1.29136 40.6279 1.757 40.6279C4.28982 40.6738 6.79343 40.0812 9.037 38.9049C11.1651 37.7362 12.9825 36.0749 14.337 34.0599C15.8059 31.8493 16.8632 29.3915 17.458 26.8049C18.1547 23.7996 18.4904 20.7218 18.458 17.6369V2.53093C18.4577 2.06485 18.2724 1.61795 17.9427 1.28848C17.6131 0.959006 17.1661 0.773926 16.7 0.773926H1.757C1.2911 0.774191 0.84435 0.959388 0.514906 1.28883C0.185462 1.61828 0.000265229 2.06502 2.84602e-07 2.53093V17.6369C-0.000131085 17.8677 0.0452181 18.0963 0.133457 18.3096C0.221696 18.5229 0.351094 18.7167 0.51426 18.88C0.677426 19.0432 0.87116 19.1727 1.08439 19.2611C1.29763 19.3494 1.52618 19.3949 1.757 19.3949H7.286C7.028 26.4069 5.171 29.9589 1.757 29.9589Z" fill="black" />
              </svg>

              <p className='mt-4 mb-4 pb-4 borderbottom'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived.</p>
              <div className="d-flex align-items-center">
                <img src='/assets/img/person.jpg' className='icon_user' alt="" />
                <div className='ml-2 line_height_user'>
                  <b>Person Name</b> <br />
                  <small>City Location</small>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-12 col-sm-12  col-md-6 col-lg-4">
            <div className="bgGray_about text-black p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 43 41" fill="none">
                <path opacity="0.15" d="M24.42 38.8719V31.7199C24.4199 31.489 24.4653 31.2604 24.5536 31.047C24.6419 30.8337 24.7713 30.6398 24.9346 30.4765C25.0979 30.3133 25.2917 30.1838 25.5051 30.0955C25.7184 30.0072 25.9471 29.9618 26.178 29.9619C29.64 29.9619 31.524 26.4109 31.786 19.4009H26.177C25.7116 19.4007 25.2653 19.2159 24.936 18.8871C24.6066 18.5583 24.4211 18.1123 24.42 17.6469V2.53193C24.42 2.30111 24.4655 2.07255 24.5538 1.85932C24.6422 1.64609 24.7717 1.45235 24.935 1.28919C25.0982 1.12602 25.292 0.996621 25.5053 0.908382C25.7186 0.820144 25.9472 0.774795 26.178 0.774926H41.128C41.5941 0.774926 42.0411 0.960007 42.3707 1.28948C42.7004 1.61895 42.8857 2.06585 42.886 2.53193V17.6419C42.9164 20.7263 42.579 23.8034 41.881 26.8079C41.286 29.394 40.229 31.8514 38.761 34.0619C37.4058 36.0763 35.5886 37.7374 33.461 38.9069C31.2171 40.0832 28.7131 40.6758 26.18 40.6299C25.949 40.6302 25.7201 40.5849 25.5066 40.4967C25.2931 40.4085 25.0991 40.279 24.9356 40.1157C24.7722 39.9525 24.6425 39.7586 24.554 39.5451C24.4655 39.3317 24.42 39.103 24.42 38.8719ZM1.757 29.9589C1.29119 29.9589 0.84444 30.1439 0.514967 30.4732C0.185494 30.8025 0.000265403 31.2491 2.84602e-07 31.7149V38.8729C0.000530323 39.3386 0.185876 39.785 0.51532 40.114C0.844764 40.4431 1.29136 40.6279 1.757 40.6279C4.28982 40.6738 6.79343 40.0812 9.037 38.9049C11.1651 37.7362 12.9825 36.0749 14.337 34.0599C15.8059 31.8493 16.8632 29.3915 17.458 26.8049C18.1547 23.7996 18.4904 20.7218 18.458 17.6369V2.53093C18.4577 2.06485 18.2724 1.61795 17.9427 1.28848C17.6131 0.959006 17.1661 0.773926 16.7 0.773926H1.757C1.2911 0.774191 0.84435 0.959388 0.514906 1.28883C0.185462 1.61828 0.000265229 2.06502 2.84602e-07 2.53093V17.6369C-0.000131085 17.8677 0.0452181 18.0963 0.133457 18.3096C0.221696 18.5229 0.351094 18.7167 0.51426 18.88C0.677426 19.0432 0.87116 19.1727 1.08439 19.2611C1.29763 19.3494 1.52618 19.3949 1.757 19.3949H7.286C7.028 26.4069 5.171 29.9589 1.757 29.9589Z" fill="black" />
              </svg>

              <p className='mt-4 mb-4 pb-4 borderbottom'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived.</p>
              <div className="d-flex align-items-center">
                <img src='/assets/img/person.jpg' className='icon_user' alt="" />
                <div className='ml-2 line_height_user'>
                  <b>Person Name</b> <br />
                  <small>City Location</small>
                </div>
              </div>
            </div>
          </div>
        </div>
       </div>

        <div className="bg_goal my-5">
          <div className="row align-items-center">
            <div className="col-md-6 ">
             <div className="pl-0 pl-sm-0 pl-lg-5 ">
             <h1 class="customers" >Give Your  <br />Growth Goals  <br />The Right tools </h1>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum </p>
              {(user?.role == "brand" || !user) && <a className='btn btn-blue-new' href="/pricing">Book a Demo</a>}
             </div>
            </div>
            <div className="col-md-6">

            </div>
          </div>
        </div>
<div className="my-5">
<div className="row ">
          <div className="col-md-12 text-center">
            <h2 className='customers mb-0' >Frequent Asked Questions</h2>
          </div>
          <div className="accordion " id="accordionExample">
            <div className="row">
              {FAQdata ? <>{FAQdata?.map((itm, index) => {
                if (index <= 2) {
                  return <div key={itm?._id} className="col-md-6">
                    <div className="accordion-item mb-3">
                      <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseTwo-${index}`} aria-expanded="false" aria-controls={`collapseTwo-${index}`}>
                          {itm?.question}
                        </button>
                      </h2>
                      <div id={`collapseTwo-${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                          <p dangerouslySetInnerHTML={{ __html: itm?.answer }} />
                        </div>
                      </div>
                    </div>
                  </div>
                }
              })}</>
                :
                <><p>No Question for now</p></>
              }
            </div>



          </div>
        </div>
</div>
       
      </div>
      <CookiesPopup />
    </Layout>
  );
}

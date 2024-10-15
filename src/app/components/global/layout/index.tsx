'use client'

import React, { useEffect, useState } from 'react';
import './style.scss';
import Sidebar from '../sidebar';
import Header from '../header';
import Header2 from '../header2/header2';
import Footer from '../footer'
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { usePathname, useRouter } from 'next/navigation';
import {requestForToken , message} from '../../../firebase/function'
import PageContainer from '../../main/PageContainer';

type Props = {
  description?: string;
  children: any;
  title?: string;
  activeSidebar?: boolean
  handleKeyPress:any, setFilter:any, reset:any ,filter:any,name:any,filters:any
};

declare const localStorage: any

export default function Layout({ title, description, children , handleKeyPress, setFilter, reset ,filter ,name ,filters}: Props) {
  let user: any = crendentialModel.getUser()
  const [activeSidebar, setActiveSidebar] = useState(false)
  const [settingData, setSettingData] = useState([])
  const history: any = useRouter()
  const pathname = usePathname()
  const [showPopup, setShowPopup] = useState(false)
  const isDashboard = pathname.includes('/brand-report') || pathname.includes('/affiliate-report') || pathname.includes('/trackingData') || pathname.includes('/performance') || pathname.includes('/CreativeEmails') || pathname.includes('/EmailMessages') || pathname.includes('/DataFeeds') || pathname.includes('/CreativeAsset') || pathname.includes('/EmailTemplate') ||pathname.includes('/coupons') || pathname.includes('/appliedjobs') || pathname.includes('/applymerchants') || pathname.includes('/invitedUsers') || pathname.includes('/addbanner') || pathname.includes('/invitations') || pathname.includes('/inviteUsers') || pathname.includes('/users') || pathname.includes('/salesTracking') || pathname.includes('makeLink') || pathname.includes('/generateLink') || pathname.includes('/Trackings') || pathname.includes('/invites') || pathname.includes('/requests') || pathname.includes('/addAccount/detail') || pathname.includes('/Offers') || pathname.includes('/proposals') || pathname.includes('/dashboard') || 
                      pathname.includes('/campaign') || pathname.includes('/campaignManagement') || pathname.includes('/affiliate') || pathname.includes('/group')|| pathname.includes('/commission') || pathname.includes('/payments') || pathname.includes('/chat')
  const isAuthenticate = pathname.includes('/brand-report') || pathname.includes('/affiliate-report') || pathname.includes('/campaign') || pathname.includes('/campaignManagement') || pathname.includes('/affiliate') ||
                         pathname.includes('/profile') || pathname.includes('/payments') || pathname.includes('/proposals') || pathname.includes('/commission')
  useEffect(() => {
    if (user) {
      ApiClient.get('user/detail', { id: user.id }).then(res => {
        if (res.success) {
          let data = { ...user, ...res.data }
          crendentialModel.setUser(data)
          localStorage.setItem('browseload', 'true')
        }
      })
    }
  }, [])

  useEffect(() => {
      ApiClient.get('settings').then(res => {
        if (res.success) {
          setSettingData(res?.data)
        }
      })
  }, [])

  // const requestPermission = async () => {
  //   // console.log("Requesting permission...");
  //   await Notification.requestPermission()
  //     .then((permission) => {
        // requestForToken()
        // if (permission === "granted") {
        //   requestForToken();
        // } else 
        // if (permission == "denied") {
        //   alert("You denied Notification permission.");
        // }
  //     })
  //     .catch((error) => {
  //       // console.error("Error while requesting notification permission:", error);
  //     });
  // };

  useEffect(() => {
    requestForToken()
    // requestPermission();
  }, []);

  useEffect(() => {
    message();
  }, []);

  useEffect(() => {
    if (isAuthenticate) {
      if (!user) {
        history.push('/login')
      }
    }
  }, [])

  // useEffect(() => {
  //   if (isAuthenticate) {
  //     if (!user?.isPayment && user?.role == "brand") {
  //       history.push('/pricing')
  //     }
  //   }
  // }, [])

  const logo = () => {
    let value = '/assets/img/logo.png'
    return value
  }

  const router = () => {
    let route: any = localStorage.getItem('route')
    history.push(route);
  }

  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    <>
      <PageContainer title={title} description={description} settingData={settingData}>
        <div>
          <div onClick={e => router()} id="routerDiv"></div>
          {(!user || !isDashboard) && <Header setShowPopup={setShowPopup} settingData={settingData}/>}

          {isDashboard ? <div className={!activeSidebar ? 'sidebar_main' : 'sidebar_main active'}>
            <div className='left_sidebar'><Sidebar setActiveSidebar={setActiveSidebar} activeSidebar={activeSidebar}/></div>
            <div className='layout_right'>
              <Header2 settingData={settingData}  handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name={name} filters={filters}/>
              {children}
            </div>
          </div> :
            <span>
              {children}
            </span>
          }
          {/* {showPopup && (
            <div className="modal d-block bgBlur">
              <div className="modal-dialog modal-dialog-centered  dateModal" role="document">
                <div className="modal-content text-center">
                  <a type="button" className="closeIcon" data-dismiss="modal" aria-label="Close" onClick={() => setShowPopup(false)}>
                    <span aria-hidden="true">&times;</span>
                  </a>
                  <div className="modal-body pb-5">
                    <div className='mb-4'>
                      <img src="../../../assets/img/logo.png" className="greentik" />
                    </div>
                    <div>
                      <h6 className='mb-3'>Signing up as</h6>
                      <Link className='btn btn-primary mr-3 pl-4 pr-4' onClick={handleClose} href="signup/brand">Brand</Link>
                      <Link className='btn btn-primary pl-4 pr-4' onClick={handleClose} href="pricing">Affiliate</Link>
                    </div>
                    <div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )} */}
          {!isDashboard && <Footer settingData={settingData}/>}
        </div>
      </PageContainer>
    </>
  );
};


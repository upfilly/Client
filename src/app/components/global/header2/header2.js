'use client'

import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import crendentialModel from '@/models/credential.model';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Navbar, Dropdown, Button, Form, Col, Row, Modal } from "react-bootstrap";

export default function Header2({ handleKeyPress, setFilter, reset, filter, name, filters, settingData }) {
    const user = crendentialModel.getUser()
    const pathname = usePathname()
    const history = useRouter()
    const param = useSearchParams()
    const id = param.get("id")
    const [notifications, setNotification] = useState([])
    const validPaths = [
        '/affiliate',
        '/group',
        '/commission/commisionplan',
        '/commission/addcommision',
        '/campaign',
        '/payments','/product'
    ];

    const isDashboard = validPaths.includes(pathname);
    const handleAutologin = () => {
        loader(true)
        ApiClient.post('user/auto-login', { "id": id }).then(res => {
            if (res.success == true) {
                crendentialModel?.setUser(res?.data)
                localStorage.setItem('token', res.data.access_token)
                // let url = '/dashboard'
                // history.push(url);
                window.location.reload();
            }
            loader(false)
        })
    };

    const Notifications = () => {
        if(user?.id){
        ApiClient.get('notification/all', { "send_to": user?.id }).then(res => {
            if (res.success == true) {
                setNotification(res?.data?.data)
            }
        })}
    };

    useEffect(() => {
        Notifications()
    }, [])

    const updateNotifications = () => {
        ApiClient.put('notification/change-status-all', { "status": "read" }).then(res => {
            if (res.success == true) {
                Notifications()
            }
        })
    };

    const updateSingleNotifications = (id) => {
        ApiClient.put('notification/change-status', { id: id, "status": "read" }).then(res => {
            if (res.success == true) {
                Notifications()
            }
        })
    };

    const unreadCount = notifications.filter(item => item.status === 'unread').length;
    const unreadNotification = notifications.filter(item => item.status === 'unread')

    useEffect(() => {
        Notifications()
    }, [])

    useEffect(() => {
        if (id && !user) {
            handleAutologin()
        }
    }, [id])


    const Logout = () => {
        crendentialModel.logout()
        history.push('/login');
    };

    return (
        <>
            <div className='fixed-topbar sidebar-content-detail' >

                <div className='d-flex justify-content-between header-right'>
                    <div className='d-flex align-items-center header-logo'>
                        <a href='/'>
                            <img src="/assets/img/logo.png" className="logo w170" alt="" /></a>
                        <span className="ml-2 page-name" > / {name}</span>
                    </div>

                    <div className='d-flex justify-content-end header-content'>
                        {isDashboard && <div className='searchInput'>
                            <input type="search"
                                className='form-control quick-radius'
                                placeholder='Search'
                                onChange={(e) => e.target.value == "" ? reset() : setFilter({ ...filters, search: e.target.value })}
                                onKeyPress={handleKeyPress}
                            />
                            <i class="fa fa-search search_fa" onClick={() => {
                                filter()
                            }} aria-hidden="true"></i>
                        </div>}

                        <a href='#' className='help-icon' ><svg className='fonts15' xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                            <path d="M0 20.083C0 16.111 1.17785 12.2281 3.3846 8.92549C5.59134 5.62286 8.72788 3.04877 12.3976 1.52874C16.0673 0.00870156 20.1053 -0.389009 24.001 0.385898C27.8967 1.16081 31.4752 3.07353 34.2838 5.88218C37.0925 8.69084 39.0052 12.2693 39.7801 16.165C40.555 20.0607 40.1573 24.0988 38.6373 27.7684C37.1172 31.4381 34.5431 34.5747 31.2405 36.7814C27.9379 38.9882 24.055 40.166 20.083 40.166C14.7567 40.166 9.64847 38.0501 5.88217 34.2838C2.11588 30.5175 0 25.4094 0 20.083ZM2.319 20.083C2.3192 23.5961 3.36112 27.0303 5.31302 29.9512C7.26492 32.8722 10.0391 35.1488 13.2849 36.4931C16.5306 37.8374 20.102 38.1891 23.5476 37.5036C26.9932 36.8182 30.1582 35.1265 32.6423 32.6423C35.1265 30.1582 36.8182 26.9932 37.5036 23.5476C38.1891 20.1021 37.8374 16.5306 36.4931 13.2849C35.1488 10.0391 32.8722 7.26493 29.9512 5.31303C27.0303 3.36113 23.5961 2.31921 20.083 2.31901C17.7501 2.31875 15.44 2.77805 13.2847 3.67068C11.1294 4.56331 9.17096 5.87179 7.52137 7.52138C5.87178 9.17097 4.5633 11.1294 3.67067 13.2847C2.77804 15.4401 2.31874 17.7501 2.319 20.083Z" fill="#252849" />
                            <path d="M21.9039 32.449H18.5779V29.122H21.9039V32.449ZM21.9039 25.787H18.5779V21.727L22.4859 18.151C22.8287 17.8408 23.1026 17.4621 23.2896 17.0394C23.4767 16.6166 23.5729 16.1593 23.5719 15.697C23.5796 15.2553 23.4992 14.8165 23.3355 14.4062C23.1717 13.9959 22.9279 13.6223 22.6183 13.3073C22.3086 12.9922 21.9393 12.7419 21.5319 12.5711C21.1245 12.4003 20.6872 12.3123 20.2454 12.3123C19.8037 12.3123 19.3663 12.4003 18.9589 12.5711C18.5515 12.7419 18.1822 12.9922 17.8726 13.3073C17.5629 13.6223 17.3191 13.9959 17.1554 14.4062C16.9917 14.8165 16.9113 15.2553 16.9189 15.697H16.9129H13.5859C13.5872 14.5906 13.8644 13.502 14.3924 12.5298C14.9203 11.5575 15.6825 10.7323 16.6097 10.1287C17.537 9.5252 18.6001 9.16245 19.7029 9.07331C20.8057 8.98417 21.9133 9.17146 22.9255 9.61822C23.9376 10.065 24.8224 10.7571 25.4997 11.632C26.1769 12.5068 26.6254 13.5367 26.8043 14.6286C26.9833 15.7204 26.8871 16.8396 26.5246 17.8848C26.162 18.9301 25.5445 19.8685 24.7279 20.615L21.9039 23.203V25.787Z" fill="#252849" />
                        </svg></a>

                        <div className='bell_icon'>
                            <div class="dropdown notifications position-relative">

                               <div type="button" data-bs-toggle="dropdown" aria-expanded="false">
                               {unreadNotification?.length > 0 ?
                                    <span className="count">
                                        {unreadCount}
                                    </span>
                                    : ''}

                                <p class="m-0  bell_bg" >
                                    <svg className='fonts15' xmlns="http://www.w3.org/2000/svg" width="36" height="41" viewBox="0 0 36 41" fill="none">
                                        <path d="M17.9731 40.673C16.5561 40.6715 15.174 40.2338 14.0145 39.4194C12.8549 38.605 11.9743 37.4534 11.4921 36.121H4.12408C3.27712 36.1117 2.45306 35.8448 1.76139 35.3559C1.06973 34.867 0.543208 34.1792 0.251806 33.3839C-0.0395958 32.5886 -0.082084 31.7235 0.129987 30.9034C0.342059 30.0834 0.798648 29.3473 1.43908 28.793C2.56816 27.8331 3.47449 26.6386 4.09499 25.2927C4.7155 23.9469 5.03528 22.482 5.03208 21V16.278C5.03192 13.2512 6.0922 10.3199 8.02867 7.99361C9.96514 5.66728 12.6554 4.0929 15.6321 3.54401V1.98501L15.6601 1.85801C15.7783 1.33217 16.0715 0.862026 16.4916 0.524501C16.9118 0.186975 17.4341 0.00205827 17.9731 8.00042e-06C18.5134 -0.00308295 19.0383 0.179941 19.4595 0.518309C19.8807 0.856677 20.1726 1.32975 20.2861 1.85801L20.3141 1.98501V3.54501C23.2904 4.09423 25.9803 5.66857 27.9167 7.99461C29.8531 10.3206 30.9136 13.2514 30.9141 16.278V20.994C30.91 22.4708 31.2267 23.9308 31.8422 25.2732C32.4578 26.6156 33.3574 27.8084 34.4791 28.769C35.1271 29.3185 35.5919 30.0528 35.8113 30.8737C36.0306 31.6946 35.994 32.5628 35.7063 33.3623C35.4187 34.1618 34.8938 34.8544 34.2018 35.3474C33.5098 35.8404 32.6837 36.1103 31.8341 36.121H24.4561C23.9712 37.452 23.0896 38.6022 21.9302 39.4162C20.7709 40.2303 19.3897 40.6689 17.9731 40.673ZM4.14608 33.721H13.3751L13.5751 34.681C13.7843 35.6933 14.3362 36.6025 15.1377 37.2553C15.9393 37.9081 16.9414 38.2646 17.9751 38.2646C19.0088 38.2646 20.0109 37.9081 20.8124 37.2553C21.6139 36.6025 22.1658 35.6933 22.3751 34.681L22.5751 33.721H31.8151C32.1746 33.7139 32.5235 33.5975 32.8153 33.3873C33.1072 33.1771 33.328 32.8831 33.4487 32.5443C33.5693 32.2055 33.5839 31.838 33.4905 31.4907C33.3972 31.1434 33.2003 30.8327 32.9261 30.6L32.9201 30.595C31.5343 29.4094 30.4225 27.9369 29.6618 26.2793C28.9011 24.6218 28.5095 22.8188 28.5141 20.995V16.278C28.5246 13.6562 27.5538 11.1252 25.7927 9.18291C24.0315 7.2406 21.6074 6.02744 18.9971 5.78201L17.9771 5.68201L16.9501 5.78201C14.3389 6.02727 11.9139 7.24089 10.1525 9.18408C8.39104 11.1273 7.42059 13.6593 7.43208 16.282V20.998C7.43621 22.8266 7.04227 24.6342 6.27762 26.2953C5.51297 27.9563 4.39594 29.431 3.00408 30.617C2.73356 30.853 2.54103 31.1655 2.45196 31.5132C2.36289 31.8609 2.38146 32.2275 2.50523 32.5645C2.629 32.9014 2.85213 33.1929 3.14512 33.4003C3.43811 33.6077 3.78715 33.7213 4.14608 33.726V33.721Z" fill="#252849" />
                                    </svg>
                                </p>
                               </div>
                                <div class="dropdown-menu overflow_hight p-0">
                                    <div className="dropdown_header">
                                        <span class="triangle"></span>
                                        <span className="noti_head w-100 pt-0 d-flex justify-content-between align-items-center"><span>Notifications</span> <span className="clear_btn" onClick={() => updateNotifications()}>Clear</span></span>
                                    </div>
                                    {unreadNotification?.length > 0 ? <div className="noti_scroll_data">
                                        {unreadNotification.map((itm) => (<div onClick={() => {
                                            updateSingleNotifications(itm?.id)
                                            if (itm?.type == 'message') {
                                                history.push("/chat")
                                            } else if (itm?.type == 'make_offer') {
                                                history.push("/requests")
                                            } else {
                                                if (user?.role !== 'brand') {
                                                    history.push("/campaignManagement")
                                                } else {
                                                    history.push("/campaign")
                                                }
                                            }
                                        }}>
                                            <div className='messagetext'>
                                                <div className='mb-3 bgblue'>
                                                    <h3 className='noti_head'>{itm?.type == 'message' ? itm?.type == 'make_offer' ? "Offer Request" : "" : "Campaign"}</h3>
                                                    <span>{itm?.type == 'message' ?
                                                        <p className='noti_text_msg'>You have a message from {itm?.addedBy_name?.slice(0, 10)}...</p>
                                                        : <p className='noti_text_chat'>{itm?.message?.slice(0, 50)}</p>}</span>
                                                    {itm?.type == 'message' && <p className='noti_text_chat'>{itm?.message?.slice(0, 50)} </p>}
                                                    {itm?.type == 'make_offer' && <p className='noti_text_chat'>{itm?.message} </p>}
                                                </div>
                                            </div>
                                        </div>))
                                        }
                                    </div> :
                                        <div className='no_Notification'>No Notification</div>
                                    }
                                </div>
                            </div>
                        </div>


                        <div className="profile-img">
                            {user && <>
                                <Dropdown className="ml-auto ml-2">
                                    <Dropdown.Toggle className="d-flex p-0 align-items-center drpdown_new" variant="" id="">
                                        <img alt="image" src={user?.image ? methodModel.userImg(user && user?.image) : '/assets/img/person.jpg'} className="rounded-circle mr-1" />
                                        {/* <div className="ml-1 nameFont text-white">
                                            <b className="name_user">{user?.firstName}</b>
                                        </div> */}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item className="has-icon" onClick={() => history.push('/')}><i class="fa fa-dashboard" /> Home</Dropdown.Item>
                                        <Dropdown.Item className="has-icon" onClick={() => history.push('/profile')}> <i className="fa fa-user" /> Profile</Dropdown.Item>
                                        <Dropdown.Item className="has-icon" onClick={() => history.push('/marketplace')}> <i class="fa-solid fa-chart-simple"></i> MarketPlace</Dropdown.Item>
                                        <Dropdown.Item className="has-icon" onClick={() => history.push('/profile/change-password')}> <i className="fa fa-cog" aria-hidden="true"></i> Change Password</Dropdown.Item>
                                        <Dropdown.Item className="has-icon" onClick={() => Logout()}> <i class="fa fa-sign-out" aria-hidden="true"></i> Logout</Dropdown.Item>

                                    </Dropdown.Menu>

                                </Dropdown>
                            </>}
                        </div>
                    </div>


                </div>

            </div>
        </>
    );
};


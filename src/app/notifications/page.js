"use client"

import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import './style.scss';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { useRouter } from 'next/navigation';
import environment from '../../environment';

const NotificationPage = () => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const [notifications, setNotification] = useState([])
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const Notifications = () => {
        if (user?.id) {
            ApiClient.get('notification/all', { "send_to": user?.id }).then(res => {
                if (res.success == true) {
                    setNotification(res?.data?.data)
                }
            })
        }
    };

    const isURL = (text) => {
        const containsDocuments = text?.includes("documents/");
        return containsDocuments;
      };

    useEffect(() => {
        if (!user?.id) {
            history.push("/")
        }
        Notifications()
    }, [])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className="container">
                <h4 className='text-center mb-3'>Notifications</h4>
                <div className="notificationList">
                    {notifications.length > 0 ? (
                        notifications.map((notification) =>{
                            const fileExtension = notification?.message?.split(".").pop().toLowerCase();
                            let isTrue = imageExtensions.includes(fileExtension); 
                            return(
                            <div key={notification.id} className="notificationItem" onClick={() => {
                                if (notification?.type == 'message') {
                                    localStorage.setItem("chatId",notification?.addedBy)
                                    history.push("/chat")
                                } else if (notification?.type == 'make_offer') {
                                    history.push("/requests")
                                } else {
                                    if (user?.role !== 'brand') {
                                        history.push("/campaignManagement")
                                    } else {
                                        history.push("/campaign")
                                    }
                                }
                            }}>
                                <h3 className='noti_head'>{notification?.type == 'message' ? "" : notification?.type == 'make_offer' ? "Offer Request" : "Campaign"}</h3>
                                {notification?.type == 'message' && <p className='noti_text_msg'>You have a message from {notification?.addedBy_name?.slice(0, 10)}...</p>}
                                    <p>{isTrue ? <img
                                        // onClick={()=>router.push(`${`chat/userDetail/${activeUser[0]?.user_id}`}`)}
                                        src={`${environment.api}${notification.message}`}
                                        height={45}
                                        width={55}
                                    /> :  isURL(notification.message) ? (
                                        <a
                                          href={`${environment?.api}${notification.message}`}
                                          download="document.pdf"
                                        >
                                          {" "}
                                                <img src="/assets/img/document.png" height={45}
                                                    width={55}></img>

                                        </a>
                                      ) :notification?.type == 'campaign' ? <p className='noti_text_chat'>{notification?.message} by {notification?.addedBy_name}</p> : notification.message}</p>
                                <span className="timestamp">{formatTimestamp(notification.createdAt)}</span>
                            </div>
                        )})
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default NotificationPage;

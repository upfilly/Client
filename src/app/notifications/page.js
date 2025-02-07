"use client"

import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import './style.scss';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { useRouter } from 'next/navigation';

const NotificationPage = () => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const [notifications, setNotification] = useState([])

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

    useEffect(() => {
        Notifications()
    }, [])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className="container">
                <h1>Notifications</h1>
                <div className="notificationList">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div key={notification.id} className="notificationItem" onClick={() => {
                                if (notification?.type == 'message') {
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
                                {/* <h2>{notification.title}</h2> */}
                                <p>{notification.message}</p>
                                <span className="timestamp">{formatTimestamp(notification.createdAt)}</span>
                            </div>
                        ))
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default NotificationPage;

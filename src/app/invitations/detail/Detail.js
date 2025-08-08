import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`getInviteById`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        const searchParams = window.location.search;
                
        window.location.href = '/invitations' + searchParams;
        // history.back()
    }

    useEffect(() => {
        getDetail(id)
    }, [id])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>

            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='main_title_head'>
                            <h3 className="">
                                <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                Invitation Detail 
                            </h3>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="campaine_detls_wrapper">
                        
                            <div className='row'>
                                <div className='col-12 col-sm-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Sended By:</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub px-0'>{data && data?.addedBy?.fullName}</p>
                                    </div>
                                </div>
                            </div>

                         <><div className='row'>
                                <div className='col-12 col-sm-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Sender E-mail:</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-3'>
                                    <div className='name-dtls'>
                                        <p className='headsub px-0'>{data && data?.addedBy?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                            <div className='col-12 col-sm-3'>
                                <div className='userdata'>
                                    <p className='headmain'>Campaign:</p>
                                </div>
                            </div>
                            <div className='col-12 col-sm-9'>
                                <div className='name-dtls'>
                                    <p className='headsub px-0'>{data?.campaign_id?.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 col-sm-3'>
                                <div className='userdata'>
                                    <p className='headmain'>Message:</p>
                                </div>
                            </div>
                            <div className='col-12 col-sm-9'>
                                <div className='name-dtls'>
                                    <p className='headsub px-0'>{data?.message}</p>
                                </div>
                            </div>
                        </div>
                        </> 

                        </div>
                    </div>

                </div>
            </div>



        </Layout >

    );
};

export default Detail;

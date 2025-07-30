import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`brand/getrequestdetails`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        history.back()
    }

    useEffect(() => {
        getDetail(id)
    }, [id])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={'Request'} filters={undefined}>

            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='main_title_head'>
                            <h3 className="">
                                <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                Request Detail 
                            </h3>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="campaine_detls_wrapper">

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Name:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.affiliate_id?.fullName)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Affiliate Email:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.affiliate_id?.email)}</p>
                                    </div>
                                </div>
                            </div>


                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Description:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub mb-0' style={{ margin: '0px' }} dangerouslySetInnerHTML={{ __html: data?.affiliate_id?.description || "--" }} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Status:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.status)}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>



        </Layout >

    );
};

export default Detail;

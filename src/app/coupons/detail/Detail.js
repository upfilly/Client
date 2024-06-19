import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import datepipeModel from '@/models/datepipemodel';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`coupon/get`, { id: did }).then(res => {
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
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='sidebar-left-content'>

                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head">
                            <h3> <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i></a>  Coupon Detail</h3>
                        </div>
                    </div>


                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='campaine_detls_wrapper'>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Coupon Code:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.couponCode)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Coupon Type:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.couponType)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Coupon Commission:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.couponCommission}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Commission Type:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.commissionType}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Coupon Commission:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.couponCommission}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Expiration Date:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && datepipeModel.date(data?.expirationDate)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Start Date:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && datepipeModel.date(data?.startDate)}</p>
                                            </div>
                                        </div>
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

import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import rolesModel from '@/models/role.model';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`tracking-customer`, { id: did }).then(res => {
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
                        <div className='main_title_head'>
                            <h3 className="">
                                <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                Tracking Detail
                            </h3>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="campaine_detls_wrapper">
                        
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Affiliate Link:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.affiliate_link}</p>
                                    </div>
                                </div>
                            </div>

                         <><div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Total Clicks:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.clicks}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                            <div className='col-3'>
                                <div className='userdata'>
                                    <p className='headmain'>Type:</p>
                                </div>
                            </div>
                            <div className='col-9'>
                                <div className='name-dtls'>
                                    <p className='headsub'>{data?.type == 'returning_customer' ? 'Returning Customer' : 'New Customer'}</p>
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

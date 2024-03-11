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
        ApiClient.get(`make-offer`, { id: did }).then(res => {
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
                                Request Detail
                            </h3>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="campaine_detls_wrapper">
                        
                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Title:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.name)}</p>
                                    </div>
                                </div>
                            </div>

                            {user?.role == 'brand' &&<> <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Affiliate Name:</p>
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
                                        <p className='headmain'>Affiliate E-mail:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.affiliate_id?.email)}</p>
                                    </div>
                                </div>
                            </div>
                            </>}

                         {user?.role == 'affiliate' && <><div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Brand Name:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.brand_id?.fullName)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                            <div className='col-3'>
                                <div className='userdata'>
                                    <p className='headmain'>Brand E-mail:</p>
                                </div>
                            </div>
                            <div className='col-9'>
                                <div className='name-dtls'>
                                    <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.brand_id?.email)}</p>
                                </div>
                            </div>
                        </div>
                        </> 
                            }

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

                            {/* <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Description:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub mb-0' style={{ margin: '0px' }} dangerouslySetInnerHTML={{ __html: data?.description }} />
                                    </div>
                                </div>
                            </div> */}

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Comment:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.comments}</p>
                                    </div>
                                </div>
                            </div>


                            {/* <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Brand detail:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <ul className='ulclass'>
                                            <li> <div className='profiledetailscls mr-3'><b><i className='fa fa-user blue-icon mr-2'></i></b>{data?.brand_id?.fullName}</div>
                                            </li>
                                            <li> <div className='profiledetailscls'><b><i className='fa fa-envelope blue-icon mr-2'></i></b>{data?.brand_id?.email}</div></li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}


                            {/* <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Image:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <div>
                                            {data?.images?.map((itm) =>
                                                <div className="imagethumbWrapper">
                                                    <img src={methodModel.noImg(itm?.url)} className="" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                        </div>
                    </div>

                </div>
            </div>



        </Layout >

    );
};

export default Detail;

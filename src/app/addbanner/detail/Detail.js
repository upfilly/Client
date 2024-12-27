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
        ApiClient.get(`banner`, { id: did }).then(res => {
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
                            <h3> <a to="/addbanner" onClick={back}>  <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i></a>  Banner Detail</h3>
                        </div>
                    </div>


                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='campaine_detls_wrapper'>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Title:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.title)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Seo Attributes:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.seo_attributes)}</p>
                                                </div>
                                            </div>

                                        </div>


                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Category:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.category_id?.name)}</p>
                                                </div>
                                            </div>

                                        </div>


                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Activation Date:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && datepipeModel.date(data?.activation_date)}</p>
                                                </div>
                                            </div>

                                        </div>


                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Availability Date:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && datepipeModel.date(data?.availability_date)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Expiration Date:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data && datepipeModel.date(data?.expiration_date)}</p>
                                                </div>
                                            </div>

                                        </div>

                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Destination Url:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{data?.destination_url}</p>
                                                </div>
                                            </div>

                                        </div>






                                        <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Images:</p>
                                                </div>
                                                <div className='name-dtls'>
                                                    <div>
                                                        {/* {data?.images?.map((itm) => */}
                                                        <div className="imagethumbWrapper">
                                                            <img src={methodModel.noImg(data?.image)} className="" />
                                                        </div>
                                                        {/* )} */}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                        <div className='col-12 col-sm-12 col-md-12 col-lg-12'>
                                            <div className='mb-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Description:</p>
                                                </div>
                                                <div className='headsub'>
                                                    <p className='mb-0 multiP' dangerouslySetInnerHTML={{ __html: data?.description }} />
                                                </div>
                                            </div>

                                        </div>
                                        <div className='col-12 col-sm-12 col-md-12 col-lg-12'>
                                            <div className='mb-3 '>

                                                <div className=' headsub  '>
                                                    <p className='startbx mb-3' >/* START ADVERTISER: WebHosting  */</p>
                                                    <div className=' startbx '>
                                                        {
                                                            "<a  href=" + `${data?.destination_url}` + ">"
                                                        }
                                                        <p className='text-center mb-0 '>
                                                            {"<img src=" + `${methodModel.noImg(data?.image)}` + " " + "/>"
                                                            }
                                                        </p>
                                                        <p className='' >{` </a>`}</p>
                                                    </div>
                                                    <p className='startbx' > /* END ADVERTISER: WebHosting  */</p>

                                                </div>
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

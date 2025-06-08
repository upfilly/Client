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
        ApiClient.get(`product`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        const searchParams = window.location.search;
                
        window.location.href = '/Offers' + searchParams;
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
                            <h3> <a to="/campaign" onClick={back}>  <i className=" left_btx fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i></a>Offer Detail</h3>
                        </div>
                    </div>


                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='campaine_detls_wrapper'>

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Name:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.name)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Description:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0' dangerouslySetInnerHTML={{ __html: data?.description }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Category:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.all_categories?.map((dat) => dat?.name)?.join(",")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Sub-Category:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.all_sub_categories?.map((dat) => dat?.name)?.join(",")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Sub-Child-Category:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.all_sub_child_categories?.map((dat) => {
                                                    if (dat == null) {
                                                        return
                                                    }
                                                    dat?.name
                                                })?.join(",")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Quantity:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && data?.quantity}</p>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Opportunity:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.opportunity_type?.map((itm) => itm).join(',\n')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Placement:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.placement?.map((itm) => itm).join(',\n')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Price:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <p className='headsub'>${data?.price}</p>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className='row'>
                                        <div className='col-12 col-sm-4 col-md-3 ' >
                                            <div className='userdata'>
                                                <p className='headmain'>Images:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-8 col-md-9 '>
                                            <div className='name-dtls'>
                                                <div>
                                                    {data?.image?.map((itm) =>
                                                        <div className="imagethumbWrapper">
                                                            <img src={methodModel.noImg(itm)} className="" />
                                                        </div>
                                                    )}
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

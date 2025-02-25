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
    const [copied, setCopied] = useState(false);
    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`campaign`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        history.back()
    }

    const handleCopyLink = () => {
        const link = `https://upfilly.com?affiliate_id=${user?.id || user?._id}&url=${user?.website}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

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
                                Campaign Detail
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
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.name || "--")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Category :</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.category?.map((itm) => itm?.name)?.join(",")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Sub Category:</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.sub_category?.map((itm) => itm?.name)?.join(",")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Sub Child Category:</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.sub_child_category?.map((itm) => itm?.name)?.join(",")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Regions:</p>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.region?.map((itm) => itm)?.join(",")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Commission:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.commission}{data?.commission_type == "percentage" ? "%" : "$"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Name:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.name)}</p>
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
                                        <p className='headsub mb-0' style={{ margin: '0px' }} dangerouslySetInnerHTML={{ __html: data?.description }} />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Event Type:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data && data?.event_type}</p>
                                    </div>
                                </div>
                            </div>


                            <div className='row'>
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
                            </div>


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
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Videos:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p>
                                            {data?.videos?.map((itm) =>
                                                <div className="imagethumbWrapper">
                                                    <video width="180" height="100" controls className='mr-3'>
                                                        <source src={methodModel.noImg(itm?.url)} type="video/mp4">
                                                        </source>
                                                    </video>
                                                </div>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div> */}

                            {/* <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Documents:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <div className='doc_icon_width'>
                                            {data?.documents?.map((itm) =>
                                                <div className="">
                                                    <img src="/assets/img/document.png" className="doc_icon" onClick={() => window.open(methodModel.noImg(itm?.url))} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Campaign Link:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>
                                            <span>{`https://upfilly.com?affiliate_id=${id}&url=${user?.website}`}</span>
                                            <button onClick={handleCopyLink} className='btn btn-primary ml-1'>
                                                {copied ? 'Copied!' : 'Copy Link'}
                                            </button>
                                        </p>
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

import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import '../style.scss';
import methodModel from '@/methods/methods';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import { Navbar, Dropdown, Button, Form, Col, Row, Modal, Accordion } from "react-bootstrap";



const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const [status, setStatus] = useState()
    const [showStatus, setShowStatus] = useState()

    const getStatus = (did) => {
        ApiClient.get(`tracking`, { affiliate_id: did }).then(res => {
            if (res.success) {
                setStatus(res?.data?.data)
            }
        })
    };

    useEffect(() => {
        getStatus(id)
    }, [id])

    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`user/detail`, { id: did }).then(res => {
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
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>

            <div className="sidebar-left-content">
                <div className="  card  ">

                    <div className='card-header'>
                        <div className='main_title_head profile-card card_header'>

                            <h3 className="  ">
                                <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a> <span> Affiliate Details</span>
                            </h3>


                        </div>
                    </div>


                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-12 mb-3'>
                                <div className='affilate-detals'>

                                    <div className='billing_dtls'>
                                        <h6>User Information</h6>
                                    </div>

                                    <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Name:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.fullName)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Email:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.email)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {data?.title && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Title:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.title)}</p>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.language && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Language:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.language)}</p>
                                            </div>
                                        </div>
                                    </div>}


                                    {data?.time_zone && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Time zone:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.time_zone)}</p>
                                            </div>
                                        </div>
                                    </div>}


                                    {data?.tax_detail && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Tax Details:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                {/* <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.tax_detail)}</p> */}
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.mobileNo && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Mobile Number:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.mobileNo)}</p>
                                            </div>
                                        </div>
                                    </div>}


                                    {data?.work_phone && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Work Number:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.work_phone)}</p>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.description && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Description:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.description)}</p>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.affiliate_group_name && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Affiliate group:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.affiliate_group_name)}</p>
                                            </div>
                                        </div>
                                    </div>}


                                    {data?.parter_manager_name && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Partner Manager:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.parter_manager_name)}</p>
                                            </div>
                                        </div>
                                    </div>}

                                    {data?.images && <div className='row'>
                                        <div className='col-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Image:</p>
                                            </div>
                                        </div>
                                        <div className='col-9'>
                                            <div className='name-dtls'>

                                                <p className='headsub'> <img src={methodModel.noImg(data?.images)} className="w170" /></p>
                                            </div>
                                        </div>
                                    </div>}

                                </div>
                            </div>

                            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-12 mb-3'>
                                {<div className='billing_dtls'>
                                    <h6>Billing Detail</h6>
                                </div>
                                }

                                {data?.default_invoice_setting && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Default Invoice:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data?.default_invoice_setting}</p>
                                        </div>
                                    </div>
                                </div>}

                                {data?.billing_frequency && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Billing Frequency:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data?.billing_frequency}</p>
                                        </div>
                                    </div>
                                </div>}

                                {data?.address && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Address:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.address)}</p>
                                        </div>
                                    </div>
                                </div>}
                            </div>

                            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-12 mb-3'>
                                <div className='billing_dtls'>
                                    <h6>Tax Detail</h6>
                                </div>

                                {data?.tax_detail?.tax_name && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Tax Name:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data?.tax_detail?.tax_name}</p>
                                        </div>
                                    </div>
                                </div>}

                                {data?.tax_detail?.tax_classification && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Tax Classification:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data?.tax_detail?.tax_classification}</p>
                                        </div>
                                    </div>
                                </div>}

                               <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Us Citizen:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data && data?.tax_detail?.is_us_citizen ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {data?.tax_detail?.federal_text_classification && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Federal Text Classification:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data && data?.tax_detail?.federal_text_classification}</p>
                                        </div>
                                    </div>
                                </div>}

                                {data?.tax_detail?.trade_name && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Trade Name:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data && data?.tax_detail?.trade_name}</p>
                                        </div>
                                    </div>
                                </div>}

                               {data?.tax_detail?.social_security_number && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Social Security Number:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data && data?.tax_detail?.social_security_number}</p>
                                        </div>
                                    </div>
                                </div>}

                               {data?.tax_detail?.signature_date && <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Signature Date:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <p className='headsub'>{data && data?.tax_detail?.signature_date}</p>
                                        </div>
                                    </div>
                                </div>}
                            </div>

                            <div className='col-sm-12 col-md-12'>
                                <div className='fetch_data'>
                                    <div className='track_head' onClick={() => setShowStatus(!showStatus)}>
                                        <h4 > Track Affiliate Status</h4>
                                        <i className={`fa ${showStatus ? 'fa-minus' : 'fa-plus'}`}></i>

                                    </div>


                                    {showStatus && <> {data?.length <= 0 ?
                                        <div className='NoProgressHeading'>
                                            <h3>No Progress</h3>
                                        </div>
                                        : <div className=' '>
                                            <div className='table-responsive table_section mt-3'>
                                                <table className='table table-striped'>
                                                    <thead>
                                                        <tr>
                                                            <th>Campaign</th>
                                                            <th>Event Type</th>
                                                            <th>No of Member Click On Link</th>
                                                        </tr>
                                                    </thead>
                                                    {status?.map((item) => {
                                                        return <tbody>
                                                            <tr>
                                                                <td>{item && item?.campign_name}</td>
                                                                <td>{item && methodModel.capitalizeFirstLetter(item?.event_type)}</td>
                                                                <td>{item && item?.clicks}</td>
                                                            </tr>
                                                        </tbody>
                                                    })}
                                                    
                                                </table>
                                                {status?.length == 0 && <div className='text-center'>No Data Found</div>}
                                            </div>
                                        </div>}</>}
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

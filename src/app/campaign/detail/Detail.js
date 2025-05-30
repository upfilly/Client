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

    useEffect(() => {
        getDetail(id)
    }, [id])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head">
                            <h3> 
                                <a to="/campaign" onClick={back}>  
                                    <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i>
                                </a>  
                                Campaign Detail
                            </h3>
                        </div>
                    </div>

                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3'>
                                <div className='campaine_detls_wrapper'>

                                    {/* Basic Information */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Name:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.name)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Description:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0' dangerouslySetInnerHTML={{ __html: data?.description }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Access Type:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.access_type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Campaign Type:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.campaign_type}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Campaign ID:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.campaign_unique_id}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Category:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.category?.map((itm) => itm?.name)?.join(", ")}</p>
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
                                                <p className='headsub'>{data?.sub_category?.map((itm) => itm?.name)?.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Regions */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Region:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.region?.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Region Continents:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.region_continents?.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Commission */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Commission:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>
                                                    {data?.commission} {data?.commission_type === "percentage" ? "%" : "$"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Lead Amount:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.lead_amount}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Event Types:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.event_type?.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Currency */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Currency:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.currencies}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Images:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <div className="d-flex flex-wrap">
                                                    {data?.images?.length > 0 ? 
                                                        data?.images?.map((itm, index) => (
                                                            <div key={index} className="imagethumbWrapper mr-2 mb-2">
                                                                <img src={methodModel.noImg(itm?.url)} className="img-thumbnail" alt={`Image ${index}`} />
                                                            </div>
                                                        ))
                                                        : "No Images"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Documents:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <div className="d-flex flex-wrap">
                                                    {data?.documents?.length > 0 ? 
                                                        data?.documents?.map((itm, index) => (
                                                            <div key={index} className="mr-2 mb-2">
                                                                <img 
                                                                    src="/assets/img/document.png" 
                                                                    className="doc_icon" 
                                                                    onClick={() => window.open(methodModel.noImg(itm?.url))} 
                                                                    alt={`Document ${index}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </div>
                                                        ))
                                                        : "No Documents"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legal Terms */}
                                    {data?.islegal && (
                                        <div className='row'>
                                            <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>Legal Terms:</p>
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                                <div className='name-dtls'>
                                                    <div className="legal-terms-container" dangerouslySetInnerHTML={{ __html: data?.legalTerm }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Brand Information */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Brand:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.brand_id?.fullName}</p>
                                                <p className='headsub'>{data?.brand_id?.email}</p>
                                                <p className='headsub'>{data?.brand_id?.mobileNo}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* De-duplication Settings */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3'>De-duplication Settings</h4>
                                        </div>
                                    </div>
                                    
                                    {data?.deDuplicate && Object.entries(data.deDuplicate).map(([key, value]) => (
                                        <div className='row' key={key}>
                                            <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>{key}:</p>
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{value.value} {value.additionalInfo && `(${value.additionalInfo})`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Publisher Restrictions */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3'>Publisher Restrictions</h4>
                                        </div>
                                    </div>
                                    
                                    {data?.publisher && Object.entries(data.publisher).map(([key, value]) => (
                                        <div className='row' key={key}>
                                            <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>{key}:</p>
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{value.value} {value.additionalInfo && `(${value.additionalInfo})`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* PPC Settings */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3'>PPC Settings</h4>
                                        </div>
                                    </div>
                                    
                                    {data?.ppc && Object.entries(data.ppc).map(([key, value]) => (
                                        <div className='row' key={key}>
                                            <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>{key}:</p>
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{value.value} {value.additionalInfo && `(${value.additionalInfo})`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Transaction Settings */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3'>Transaction Settings</h4>
                                        </div>
                                    </div>
                                    
                                    {data?.transaction && Object.entries(data.transaction).map(([key, value]) => (
                                        <div className='row' key={key}>
                                            <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                                <div className='userdata'>
                                                    <p className='headmain'>{key}:</p>
                                                </div>
                                            </div>
                                            <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                                <div className='name-dtls'>
                                                    <p className='headsub'>{value.value} {value.additionalInfo && `(${value.additionalInfo})`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Detail;
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
        ApiClient.get(`campaign-request`, { id: did }).then(res => {
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
                                        <p className='headmain'>Campaign Name:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.name && methodModel.capitalizeFirstLetter(data?.campaign_id?.name)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Campaign Description:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub mb-0' style={{ margin: '0px' }} dangerouslySetInnerHTML={{ __html: data?.campaign_id?.description }} />
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
                                        <p className='headsub'>{data?.campaign_id?.event_type?.join(', ')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Campaign Type:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.campaign_type && methodModel.capitalizeFirstLetter(data?.campaign_id?.campaign_type)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Commission Type:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.commission_type && methodModel.capitalizeFirstLetter(data?.campaign_id?.commission_type)}</p>
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
                                        <p className='headsub'>{data?.campaign_id?.commission}%</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Lead Amount:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>${data?.campaign_id?.lead_amount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Campaign Status:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.status && methodModel.capitalizeFirstLetter(data?.status)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Campaign Unique ID:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.campaign_unique_id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Request Status:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.affiliate_id?.request_status && methodModel.capitalizeFirstLetter(data?.affiliate_id?.request_status)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Access Type:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.access_type && methodModel.capitalizeFirstLetter(data?.campaign_id?.access_type)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Affiliate detail:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <ul className='ulclass'>
                                            <li>
                                                <div className='profiledetailscls mr-3'>
                                                    <b><i className='fa fa-user blue-icon mr-2'></i></b>
                                                    {data?.affiliate_id?.fullName}
                                                </div>
                                            </li>
                                            <li>
                                                <div className='profiledetailscls'>
                                                    <b><i className='fa fa-envelope blue-icon mr-2'></i></b>
                                                    {data?.affiliate_id?.email}
                                                </div>
                                            </li>
                                            <li>
                                                <div className='profiledetailscls'>
                                                    <b><i className='fa fa-phone blue-icon mr-2'></i></b>
                                                    {data?.affiliate_id?.dialCode} {data?.affiliate_id?.mobileNo}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Region:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.region?.join(', ')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Currencies:</p>
                                    </div>
                                </div>
                                <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{data?.campaign_id?.currencies}</p>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-3'>
                                    <div className='userdata'>
                                        <p className='headmain'>Created Date:</p>
                                    </div>
                                </div>
                                {/* <div className='col-9'>
                                    <div className='name-dtls'>
                                        <p className='headsub'>{methodModel.formatDate(data?.createdAt)}</p>
                                    </div>
                                </div> */}
                            </div>

                            {data?.campaign_id?.images?.length > 0 && (
                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Images:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <div className='d-flex flex-wrap'>
                                                {data?.campaign_id?.images?.map((itm, index) => (
                                                    <div className="imagethumbWrapper mr-3 mb-3" key={index}>
                                                        <img src={methodModel.noImg(itm?.url)} className="img-fluid" style={{ maxWidth: '150px' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data?.campaign_id?.videos?.length > 0 && (
                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Videos:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <div className='d-flex flex-wrap'>
                                                {data?.campaign_id?.videos?.map((itm, index) => (
                                                    <div className="imagethumbWrapper mr-3 mb-3" key={index}>
                                                        <video width="180" height="100" controls className='mr-3'>
                                                            <source src={methodModel.noImg(itm?.url)} type="video/mp4" />
                                                        </video>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data?.campaign_id?.documents?.length > 0 && (
                                <div className='row'>
                                    <div className='col-3'>
                                        <div className='userdata'>
                                            <p className='headmain'>Documents:</p>
                                        </div>
                                    </div>
                                    <div className='col-9'>
                                        <div className='name-dtls'>
                                            <div className='doc_icon_width d-flex flex-wrap'>
                                                {data?.campaign_id?.documents?.map((itm, index) => (
                                                    <div className="mr-3 mb-3" key={index}>
                                                        <img
                                                            src="/assets/img/document.png"
                                                            className="doc_icon cursor-pointer"
                                                            onClick={() => window.open(methodModel.noImg(itm?.url))}
                                                            alt="Document"
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data?.campaign_id?.deDuplicate && (
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className='userdata'>
                                            <p className='headmain'>De-duplication Settings:</p>
                                        </div>
                                        <div className='name-dtls'>
                                            <table className='table table-bordered'>
                                                <thead>
                                                    <tr>
                                                        <th>Category</th>
                                                        <th>Value</th>
                                                        <th>Additional Info</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(data?.campaign_id?.deDuplicate).map(([key, value]) => (
                                                        <tr key={key}>
                                                            <td>{key}</td>
                                                            <td>{value?.value}</td>
                                                            <td>{value?.additionalInfo}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data?.campaign_id?.legalTerm && (
                                <div className='row'>
                                    <div className='col-12'>
                                        <div className='userdata'>
                                            <p className='headmain'>Legal Terms:</p>
                                        </div>
                                        <div className='name-dtls'>
                                            <div className='legal-terms-container' style={{
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                border: '1px solid #ddd',
                                                padding: '15px',
                                                borderRadius: '5px'
                                            }}>
                                                <div dangerouslySetInnerHTML={{ __html: data?.campaign_id?.legalTerm }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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
        </Layout>
    );
};

export default Detail;
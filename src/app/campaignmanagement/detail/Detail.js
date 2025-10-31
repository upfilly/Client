import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import loader from '@/methods/loader';
import ApiClient from '@/methods/api/apiClient';
import Layout from '@/app/components/global/layout';
import methodModel from '@/methods/methods';
import crendentialModel from '@/models/credential.model';
import "./style.scss"

const CampaignDetail = () => {
    const history = useRouter()
    const searchParams = useSearchParams();
    const { id } = useParams()
    const [data, setData] = useState({});
    const user = crendentialModel.getUser()

    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`campaign`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    useEffect(() => {
        getDetail(id)
    }, [id])

    const [copied, setCopied] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        regions: false,
        deduplication: false,
        publisher: false,
        ppc: false,
        transaction: false,
        legal: false
    });

    const back = () => {
        const searchParams = window.location.search;
                
        window.location.href = '/campaignmanagement' + searchParams;
    }

    const handleCopyLink = () => {
        const link = `https://upfilly.com?affiliate_id=${user?.id || user?._id}&url=${user?.website}&brand_id=${data?.addedBy}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderKeyValuePairs = (obj, sectionKey) => {
        if (!obj || typeof obj !== 'object') return null;

        return (
            <div className="mt-3">
                {Object.entries(obj).map(([key, value]) => (
                    <div key={key} className="row mb-2">
                        <div className="col-12 col-sm-12 col-md-4 col-lg-3">
                            <div className="userdata">
                                <p className="headmain">{key}:</p>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-8 col-lg-9">
                            <div className="name-dtls">
                                <p className="headsub">
                                    {typeof value === 'object' && value?.value ? (
                                        <span className={`badge ${value.value === 'Yes' ? 'bg-success' : 'bg-danger'}`}>
                                            {value.value} {value.additionalInfo && `(${value.additionalInfo})`}
                                        </span>
                                    ) : (
                                        String(value)
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">
                                <a href="#" onClick={back}>
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

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Sub Child Category:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>{data?.sub_child_category?.map((itm) => itm?.name)?.join(", ") || "None"}</p>
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
                                                <p className='headmain'>
                                                    Region Continents:
                                                    <button
                                                        onClick={() => toggleSection('regions')}
                                                        className="btn btn-link btn-sm p-0 ms-2"
                                                        style={{ textDecoration: 'none' }}
                                                    >
                                                        <i className={`fa fa-chevron-${expandedSections.regions ? 'up' : 'down'}`}></i>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                {expandedSections.regions ? (
                                                    <div className="row">
                                                        {data?.region_continents?.map((country, index) => (
                                                            <div key={index} className="col-6 col-sm-4 col-md-3 mb-2">
                                                                <span className="badge bg-primary">{country}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className='headsub'>
                                                        {data?.region_continents?.length || 0} countries (Click to expand)
                                                    </p>
                                                )}
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
                                                    <span className="text-success fw-bold">
                                                        {data?.commission} {data?.commission_type === "percentage" ? "%" : "$"}
                                                    </span>
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
                                                <p className='headsub'>{Array.isArray(data?.event_type) ? data.event_type.join(", ") : data?.event_type}</p>
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

                                    {/* Brand Information */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Brand:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fa fa-user-circle me-2 text-primary"></i>
                                                    <span className='headsub'>{data?.brand_id?.fullName}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="fa fa-envelope me-2 text-primary"></i>
                                                    <span className='headsub'>{data?.brand_id?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Campaign Link */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Campaign Link:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <div className="d-flex flex-column flex-sm-row align-items-start gap-2">
                                                    <div className="flex-fill bg-light p-2 rounded border small text-break">
                                                        {`https://upfilly.com?affiliate_id=${data?.id}&url=${user?.website}&brand_id=${data?.addedBy}`}
                                                    </div>
                                                    <span onClick={handleCopyLink} className='btn btn-primary d-flex align-items-center'>
                                                        <i className={`fa fa-${copied ? 'check' : 'copy'} me-1`}></i>
                                                        {copied ? 'Copied!' : 'Copy'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* De-duplication Settings */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3 CM-Settings'>
                                                De-duplication Settings 
                                                <button
                                                    onClick={() => toggleSection('deduplication')}
                                                    className="btn btn-link btn-sm ms-2"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <i className={`fa fa-chevron-${expandedSections.deduplication ? 'up' : 'down'}`}></i>
                                                </button>
                                            </h4>
                                        </div>
                                    </div>

                                    {expandedSections.deduplication ? (
                                        renderKeyValuePairs(data?.deDuplicate, 'deduplication')
                                    ) : (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <p className='text-muted'>
                                                    {Object.keys(data?.deDuplicate || {}).length} settings configured (Click to expand)
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Publisher Restrictions */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3 CM-Settings'>
                                                Publisher Restrictions
                                                <button
                                                    onClick={() => toggleSection('publisher')}
                                                    className="btn btn-link btn-sm ms-2"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <i className={`fa fa-chevron-${expandedSections.publisher ? 'up' : 'down'}`}></i>
                                                </button>
                                            </h4>
                                        </div>
                                    </div>

                                    {expandedSections.publisher ? (
                                        renderKeyValuePairs(data?.publisher, 'publisher')
                                    ) : (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <p className='text-muted'>
                                                    {Object.keys(data?.publisher || {}).length} publisher restrictions configured (Click to expand)
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* PPC Settings */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3 CM-Settings'>
                                                PPC Settings
                                                <button
                                                    onClick={() => toggleSection('ppc')}
                                                    className="btn btn-link btn-sm ms-2"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <i className={`fa fa-chevron-${expandedSections.ppc ? 'up' : 'down'}`}></i>
                                                </button>
                                            </h4>
                                        </div>
                                    </div>

                                    {expandedSections.ppc ? (
                                        renderKeyValuePairs(data?.ppc, 'ppc')
                                    ) : (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <p className='text-muted'>
                                                    {Object.keys(data?.ppc || {}).length} PPC rules configured (Click to expand)
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Transaction Settings */}
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h4 className='mt-4 mb-3 CM-Settings'>
                                                Transaction Settings 
                                                <button
                                                    onClick={() => toggleSection('transaction')}
                                                    className="btn btn-link btn-sm ms-2"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <i className={`fa fa-chevron-${expandedSections.transaction ? 'up' : 'down'}`}></i>
                                                </button>
                                            </h4>
                                        </div>
                                    </div>

                                    {expandedSections.transaction ? (
                                        renderKeyValuePairs(data?.transaction, 'transaction')
                                    ) : (
                                        <div className='row'>
                                            <div className='col-12'>
                                                <p className='text-muted'>
                                                    {Object.keys(data?.transaction || {}).length} transaction rules configured (Click to expand)
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Legal Terms */}
                                    {data?.legalTerm && (
                                        <>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <h4 className='mt-4 mb-3 CM-Settings'>
                                                        Legal Terms
                                                        <button
                                                            onClick={() => toggleSection('legal')}
                                                            className="btn btn-link btn-sm ms-2"
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            <i className={`fa fa-chevron-${expandedSections.legal ? 'up' : 'down'}`}></i>
                                                        </button>
                                                    </h4>
                                                </div>
                                            </div>

                                            {expandedSections.legal ? (
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <div className="bg-light p-3 rounded border" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                                            <div className="legal-terms-container" dangerouslySetInnerHTML={{ __html: data?.legalTerm }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <p className='text-muted'>
                                                            Legal agreement available (Click to expand)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CampaignDetail;
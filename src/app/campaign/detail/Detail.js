import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import Swal from 'sweetalert2';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const [copied, setCopied] = useState(false);
    const [showAffiliatesModal, setShowAffiliatesModal] = useState(false);
    const [affiliates, setAffiliates] = useState([]);
    const [loadingAffiliates, setLoadingAffiliates] = useState(false);

    console.log(affiliates, "affiliatesaffiliates")

    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`campaign`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const getAffiliates = () => {
        setLoadingAffiliates(true);
        ApiClient.get(`campaign/all/affiliates`, { campaign: id, brand: user?.id || user?._id }).then(res => {
            if (res.success) {
                setAffiliates(res.data.data || []);
            }
            setLoadingAffiliates(false);
        }).catch(err => {
            console.error('Failed to fetch affiliates:', err);
            setLoadingAffiliates(false);
        });
    };

    const removeAffiliate = async (affiliateId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to remove this affiliate',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            // loader(true);
            try {
                const res = await ApiClient.post(`campaign/remove`, {
                    affiliate_id: affiliateId,
                    campaign_id: id,
                    brand_id: user?.id || user?._id
                });

                if (res.success) {
                    setAffiliates(prev => prev.filter(affiliate => affiliate.affiliate_id.id !== affiliateId));
                    await Swal.fire(
                        'Deleted!',
                        'Affiliate removed successfully',
                        'success'
                    );
                    // loader(false);
                } else {
                    await Swal.fire(
                        'Error!',
                        'Failed to remove affiliate',
                        'error'
                    );
                }
            } catch (err) {
                console.error('Failed to remove affiliate:', err);
                await Swal.fire(
                    'Error!',
                    'Failed to remove affiliate',
                    'error'
                );
            } finally {
                loader(false);
            }
        }
    };

    const openAffiliatesModal = () => {
        setShowAffiliatesModal(true);
        getAffiliates();
    };

    const closeAffiliatesModal = () => {
        setShowAffiliatesModal(false);
    };

    const back = () => {
        history.back()
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

    useEffect(() => {
        getDetail(id)
    }, [id])

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">
                                <a to="/campaign" onClick={back}>
                                    <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i>
                                </a>
                                Campaign Detail
                            </h3>
                            <button
                                className="btn btn-primary"
                                onClick={openAffiliatesModal}
                            >
                                <i className="fa fa-users mr-2"></i>
                                View Affiliates
                            </button>
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

                                    {/* Campaign Link */}
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Campaign Link:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub'>
                                                    <span>{`https://upfilly.com?affiliate_id=${id}&url=${user?.website}&brand_id=${data?.addedBy}`}</span>
                                                    <button onClick={handleCopyLink} className='btn btn-primary ml-1 btn-sm'>
                                                        {copied ? 'Copied!' : 'Copy Link'}
                                                    </button>
                                                </p>
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

            {/* Affiliates Modal */}
            {showAffiliatesModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fa fa-users mr-2"></i>
                                    Campaign Affiliates
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={closeAffiliatesModal}
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body p-0">
                                {loadingAffiliates ? (
                                    <div className="text-center py-4">
                                        <i className="fa fa-spinner fa-spin fa-2x"></i>
                                        <p className="mt-2">Loading affiliates...</p>
                                    </div>
                                ) : affiliates.length > 0 ? (
                                    <div className="table-responsive" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>Name</th>
                                                    <th style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>Email</th>
                                                    {/* <th style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>Website</th> */}
                                                    <th style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>Joined Date</th>
                                                    <th style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {affiliates.map((affiliate) => (
                                                    <tr key={affiliate.affiliate_id.id || affiliate.affiliate_id._id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <i className="fa fa-user-circle mr-2 text-primary"></i>
                                                                {affiliate.affiliate_id.fullName || affiliate.affiliate_id.name || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td>{affiliate.affiliate_id.email || 'N/A'}</td>
                                                        {/* <td>
                                                            {affiliate.affiliate_id.website ? (
                                                                <a
                                                                    href={affiliate.affiliate_id.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary"
                                                                >
                                                                    <i className="fa fa-external-link mr-1"></i>
                                                                    {affiliate.affiliate_id.website}
                                                                </a>
                                                            ) : 'N/A'}
                                                        </td> */}
                                                        <td>
                                                            {affiliate.affiliate_id.joinedDate ?
                                                                new Date(affiliate.affiliate_id.joinedDate).toLocaleDateString() :
                                                                affiliate.affiliate_id.createdAt ?
                                                                    new Date(affiliate.affiliate_id.createdAt).toLocaleDateString() :
                                                                    'N/A'
                                                            }
                                                        </td>
                                                        <td>
                                                            {affiliate.status != "removed" && <button
                                                                className="btn btn-sm btn-outline-danger text-danger bg-light"
                                                                onClick={() => removeAffiliate(affiliate.affiliate_id.id || affiliate.affiliate_id._id)}
                                                                title="Remove Affiliate"
                                                            >
                                                                <i className="fa fa-trash mr-1"></i>
                                                                Remove
                                                            </button>}
                                                            {affiliate.status == "removed" && <button
                                                                className="btn btn-sm btn-danger"
                                                                disabled
                                                            // onClick={() => removeAffiliate(affiliate.affiliate_id.id || affiliate.affiliate_id._id)}
                                                            // title="Remove Affiliate"
                                                            >
                                                                <i className="fa fa-trash mr-1"></i>
                                                                Removed
                                                            </button>}

                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="fa fa-users fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted">No Affiliates Found</h5>
                                        <p className="text-muted">This campaign doesn't have any affiliates yet.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeAffiliatesModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default Detail;
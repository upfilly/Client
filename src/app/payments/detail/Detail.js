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
        ApiClient.get(`transaction`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        const searchParams = window.location.search;
        window.location.href = '/payments' + searchParams;
    }

    useEffect(() => {
        getDetail(id)
    }, [id])

    const getBrandName = () => {
        if (data?.brand_details?.fullName) {
            return data.brand_details.fullName;
        } else if (data?.brand_details?.brand_name) {
            return data.brand_details.brand_name;
        }
        return '';
    }

    const getAffiliateStatus = () => {
        if (data?.affiliate_link_details?.admin_paid) {
            return data.affiliate_link_details.admin_paid;
        } else if (data?.affiliate_link_details?.commission_status) {
            return data.affiliate_link_details.commission_status;
        }
        return '';
    }

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='main_title_head'>
                            <h3>
                                <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                Transaction Detail
                            </h3>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className="">
                            <div className='row'>
                                <div className='main-view-pages'>
                                    <div className='row'>
                                        {/* Payer Information */}
                                        {data?.user_id_name &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Payer:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.user_id_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {data?.role &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Payer Role:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Recipient Information */}
                                        {data?.paid_to_name &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Paid To:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.paid_to_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Brand Information */}
                                        {getBrandName() &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Brand:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{getBrandName()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Brand Email */}
                                        {data?.brand_details?.email &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Brand Email:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.brand_details.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Transaction Amount */}
                                        {data?.amount &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Amount:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>${data.amount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Transaction Type */}
                                        {data?.transaction_type &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Transaction Type:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.transaction_type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Transaction Status */}
                                        {data?.transaction_status &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Transaction Status:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.transaction_status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Affiliate Link Details */}
                                        {data?.affiliate_link_details?.commission_type &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Commission Type:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.affiliate_link_details.commission_type}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {data?.affiliate_link_details?.amount_of_commission &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Commission Amount:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>${data.affiliate_link_details.amount_of_commission}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {getAffiliateStatus() &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Affiliate Status:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{getAffiliateStatus()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Transaction ID */}
                                        {data?.transaction_id &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Transaction ID:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.transaction_id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Created Date */}
                                        {/* {data?.createdAt &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Created Date:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>
                                                            {methodModel.formatDate(data.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        } */}

                                        {/* Invoice Link */}
                                        {data?.custom_invoice_url &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Invoice:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <a
                                                            href={data.custom_invoice_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className='headsub mb-0 profile-page-pl-none text-primary'
                                                            style={{ textDecoration: 'underline' }}
                                                        >
                                                            View Invoice
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Subscription Details */}
                                        {data?.subscription_plan_id &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Subscription Plan:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.subscription_plan_id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Stripe Details */}
                                        {data?.stripe_charge_id &&
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                                                <div className='mb-3'>
                                                    <div className='userdata'>
                                                        <p className='headmain'>Stripe Charge ID:</p>
                                                    </div>
                                                    <div className='name-dtls'>
                                                        <p className='headsub mb-0 profile-page-pl-none'>{data.stripe_charge_id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
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
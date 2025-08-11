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
        ApiClient.get(`link/generate/detail`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        const searchParams = window.location.search;
        window.location.href = '/textlinks' + searchParams;
    }

    useEffect(() => {
        getDetail(id)
    }, [id])

    // Helper function to render categories with chips
    const renderCategories = (categories, maxItems = 3) => {
        if (!categories || !categories.length) return <span className="text-muted">-</span>;

        const visibleItems = categories.slice(0, maxItems);
        const remainingCount = categories.length - maxItems;

        return (
            <div className="category-chips">
                {visibleItems.map((cat, index) => (
                    <span key={index} className="category-chip">
                        {typeof cat === 'object' ? methodModel.capitalizeFirstLetter(cat.name) : cat}
                    </span>
                ))}
                {remainingCount > 0 && (
                    <span className="category-chip more-chip">
                        +{remainingCount} more
                    </span>
                )}
            </div>
        );
    }

    const extractDomainAndExt = (url) => {
        if (!url) return { domain: 'example', ext: 'com' };

        const cleanUrl = url.replace(/(https?:\/\/)?(www\.)?/, '');

        const parts = cleanUrl.split('.');

        const ext = parts.length > 2 ? parts.slice(-2).join('.') : parts.slice(-1)[0];
        const domain = parts.length > 2 ? parts.slice(0, -2)[0] : parts[0];

        return { domain, ext };
    };

    const { domain, ext } = extractDomainAndExt(data?.destinationUrl);

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card banner-detail-card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex align-items-center">
                            <button onClick={back} className="btn btn-back me-3">
                                <i className="fas fa-arrow-left" title='Back'></i>
                            </button>
                            <h3 className="mb-0">Text Link Details</h3>
                        </div>
                    </div>

                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='banner-detail-wrapper'>
                                    <div className='row'>
                                        {/* Basic Information Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Basic Information</h5>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Link Name</label>
                                                            <p>{data?.linkName ? methodModel.capitalizeFirstLetter(data.linkName) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>SEO Enabled</label>
                                                            <p>{data?.seo ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Deep Link</label>
                                                            <p>{data?.deepLink ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Destination URL</label>
                                                            <p className="text-truncate">{data?.destinationUrl || '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-12'>
                                                        <div className='detail-item'>
                                                            <label>Description</label>
                                                            <div className='description-content' dangerouslySetInnerHTML={{ __html: data?.description || '-' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Categories Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Categories</h5>
                                                <div className='row'>
                                                    <div className='col-md-12'>
                                                        <div className='detail-item'>
                                                            <label>Categories</label>
                                                            {data?.category ? renderCategories(data.category) : '-'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Dates</h5>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Start Date</label>
                                                            <p>{data?.startDate ? datepipeModel.date(data.startDate) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>End Date</label>
                                                            <p>{data?.endDate ? datepipeModel.date(data.endDate) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Created At</label>
                                                            <p>{data?.createdAt ? datepipeModel.date(data.createdAt) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Updated At</label>
                                                            <p>{data?.updatedAt ? datepipeModel.date(data.updatedAt) : '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Status</h5>
                                                <div className='row'>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Status</label>
                                                            <p>{data?.status ? methodModel.capitalizeFirstLetter(data.status) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <div className='detail-item'>
                                                            <label>Deleted</label>
                                                            <p>{data?.isDeleted ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Added By Section */}
                                        {data?.addedBy && (
                                            <div className='col-12'>
                                                <div className='detail-section'>
                                                    <h5 className='section-title'>Added By</h5>
                                                    <div className='row'>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>Name</label>
                                                                <p>{data.addedBy.fullName || '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>Email</label>
                                                                <p>{data.addedBy.email || '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>Role</label>
                                                                <p>{data.addedBy.role ? methodModel.capitalizeFirstLetter(data.addedBy.role) : '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>Website</label>
                                                                <p>{data.addedBy.website || '-'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Embed Code Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Embed Code</h5>
                                                <div className='embed-code-container'>
                                                    <pre className="embed-code">
                                                        {`/* START ADVERTISER: ${data?.linkName || 'Link'} */\n`}
                                                        {`<a href="https://api.upfilly.com/link/affiliate_id=${user?.role == "affiliate" ? user?.id : "ID" || 'ID'}&url=${domain}&ext=${ext}" target="_blank">\n`}
                                                        {`  ${data?.linkName || 'Link Text'}\n`}
                                                        {`</a>\n`}
                                                        {`/* END ADVERTISER: ${data?.linkName || 'Link'} */`}
                                                    </pre>
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
        </Layout>
    );
};

export default Detail;
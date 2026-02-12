import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import methodModel from '@/methods/methods';
import { useRouter, useParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import datepipeModel from '@/models/datepipemodel';
import { toast } from 'react-toastify';

const Detail = (p) => {
    const history = useRouter()
    const user = crendentialModel.getUser()
    const { id } = useParams()
    const [data, setData] = useState()
    const [activeTab, setActiveTab] = useState('html')

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
        const searchParams = window.location.search;
        window.location.href = '/banners' + searchParams;
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
                {visibleItems.map(cat => (
                    <span key={cat.id} className="category-chip">
                        {methodModel.capitalizeFirstLetter(cat.name)}
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

    // Helper function to generate affiliate code
    const getAffiliateCode = (type = 'html') => {
        if (!data) return '';

        const linkData = {
            url: data?.linkDestinationUrl || '#',
            name: data?.linkName || 'Click Here for Exclusive Offer',
            description: data?.linkDescription || '',
            seo: data?.linkSeo,
            deepLink: data?.linkDeepLink,
            title: data?.title || 'Affiliate Banner'
        };

        switch (type) {
            case 'button':
                return `<!-- START AFFILIATE BUTTON: ${linkData.title} -->
<a href="${linkData.url}" 
   target="_blank" 
   rel="nofollow sponsored noopener noreferrer"
   style="display: inline-block; 
          background-color: #4CAF50; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px;
          font-weight: bold;
          ${linkData.seo ? 'border: 2px solid #333;' : ''}">
  ${linkData.name}
</a>
<!-- END AFFILIATE BUTTON: ${linkData.title} -->`;

            case 'banner':
                return `<!-- START AFFILIATE BANNER: ${linkData.title} -->
<div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; max-width: 400px; background: #f9f9f9;">
  <a href="${linkData.url}" 
     target="_blank" 
     rel="nofollow sponsored noopener noreferrer"
     style="text-decoration: none; color: #333;">
    <h3 style="margin: 0 0 10px; color: #1976D2;">${linkData.name}</h3>
    ${linkData.description ? `<p style="margin: 0; color: #666;">${linkData.description.replace(/<[^>]*>/g, ' ')}</p>` : ''}
    <span style="display: inline-block; margin-top: 15px; color: #4CAF50; font-weight: bold;">Click Here →</span>
  </a>
</div>
<!-- END AFFILIATE BANNER: ${linkData.title} -->`;

            case 'simple':
                return `<a href="${linkData.url}" target="_blank" rel="nofollow sponsored noopener noreferrer">${linkData.name}</a>`;

            case 'url':
                return linkData.url;

            default:
                return `<!-- START AFFILIATE LINK: ${linkData.title} -->
<a href="${linkData.url}" 
   target="_blank" 
   rel="nofollow sponsored noopener noreferrer"
   style="display: inline-block; ${linkData.seo ? 'font-weight: bold;' : ''}">
  ${linkData.name}
</a>
<!-- END AFFILIATE LINK: ${linkData.title} -->`;
        }
    };

    const copyToClipboard = (text, message = 'Code copied to clipboard!') => {
        navigator.clipboard.writeText(text);
        toast.success(message, {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const renderLinkFields = () => {
        if (data?.addType !== "link") return null;

        return (
            <>
                <div className='col-12'>
                    <div className='detail-section'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='detail-item'>
                                    <label>Text Link Name</label>
                                    <p>{data?.linkName ? data.linkName : '-'}</p>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='detail-item'>
                                    <label>Ad Copy</label>
                                    <div className='description-content' dangerouslySetInnerHTML={{
                                        __html: data?.description || '-'
                                    }} />
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className='detail-item'>
                                    <label>Link Destination URL</label>
                                    <p className="text-truncate">
                                        {data?.linkDestinationUrl ? (
                                            <a href={data.linkDestinationUrl} target="_blank" rel="noopener noreferrer">
                                                {data.linkDestinationUrl}
                                            </a>
                                        ) : '-'}
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-12'>
                                <div className='detail-item'>
                                    <label>Link Description</label>
                                    <div className='description-content' dangerouslySetInnerHTML={{
                                        __html: data?.linkDescription || '-'
                                    }} />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='detail-item'>
                                    <label>Link Start Date</label>
                                    <p>{data?.linkStartDate ? datepipeModel.date(data.linkStartDate) : '-'}</p>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='detail-item'>
                                    <label>Link End Date</label>
                                    <p>{data?.linkEndDate ? datepipeModel.date(data.linkEndDate) : '-'}</p>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='detail-item'>
                                    <label>Link SEO</label>
                                    <p>{data?.linkSeo ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='detail-item'>
                                    <label>Link Deep Linking</label>
                                    <p>{data?.linkDeepLink ? 'Enabled' : 'Disabled'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link Categories Section */}
                {data?.linkCategory && data.linkCategory.length > 0 && (
                    <div className='col-12'>
                        <div className='detail-section'>
                            <h5 className='section-title'>Link Categories</h5>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='detail-item'>
                                        <label>Categories</label>
                                        {renderCategories(data.linkCategory)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Affiliate Embed Code Section */}
                <div className='col-12'>
                    <div className='detail-section'>
                        <h5 className='section-title'>Affiliate Embed Code</h5>
                        <div className='embed-code-container'>
                            <div className="embed-tabs">
                                <button
                                    className={`embed-tab ${activeTab === 'html' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('html')}
                                >
                                    HTML Link
                                </button>
                                {/* <button
                                    className={`embed-tab ${activeTab === 'button' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('button')}
                                >
                                    Button Style
                                </button>
                                <button
                                    className={`embed-tab ${activeTab === 'banner' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('banner')}
                                >
                                    Banner Style
                                </button> */}
                            </div>

                            {/* HTML Embed Code - Standard Link */}
                            {activeTab === 'html' && (
                                <div className="embed-content active">
                                    <div className="code-preview">
                                        {data?.linkDestinationUrl && (
                                            <a
                                                href={data.linkDestinationUrl}
                                                target="_blank"
                                                rel="nofollow sponsored noopener noreferrer"
                                                className="preview-link"
                                            >
                                                {data.linkName || 'Click Here'}
                                            </a>
                                        )}
                                    </div>

                                    <div className="code-block-wrapper">
                                        <button
                                            className="btn btn-sm btn-copy"
                                            onClick={() => copyToClipboard(getAffiliateCode('html'))}
                                        >
                                            <i className="fas fa-copy"></i> Copy Code
                                        </button>
                                        <pre className="embed-code">
                                            {getAffiliateCode('html')}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Button Style Code */}
                            {/* {activeTab === 'button' && (
                                <div className="embed-content active">
                                    <div className="code-preview">
                                        {data?.linkDestinationUrl && (
                                            <a
                                                href={data.linkDestinationUrl}
                                                target="_blank"
                                                rel="nofollow sponsored noopener noreferrer"
                                                className="preview-button"
                                            >
                                                {data.linkName || 'Shop Now'}
                                            </a>
                                        )}
                                    </div>

                                    <div className="code-block-wrapper">
                                        <button
                                            className="btn btn-sm btn-copy"
                                            onClick={() => copyToClipboard(getAffiliateCode('button'))}
                                        >
                                            <i className="fas fa-copy"></i> Copy Code
                                        </button>
                                        <pre className="embed-code">
                                            {getAffiliateCode('button')}
                                        </pre>
                                    </div>
                                </div>
                            )} */}

                            {/* Banner Style with Description */}
                            {/* {activeTab === 'banner' && (
                                <div className="embed-content active">
                                    <div className="code-preview">
                                        {data?.linkDestinationUrl && (
                                            <div className="preview-banner">
                                                <a href={data.linkDestinationUrl} target="_blank" rel="nofollow sponsored noopener noreferrer">
                                                    <strong>{data.linkName || 'Special Offer'}</strong>
                                                    {data.linkDescription && (
                                                        <p style={{ margin: '5px 0 0', fontSize: '14px' }}>
                                                            {data.linkDescription.replace(/<[^>]*>/g, ' ').substring(0, 100)}
                                                        </p>
                                                    )}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="code-block-wrapper">
                                        <button
                                            className="btn btn-sm btn-copy"
                                            onClick={() => copyToClipboard(getAffiliateCode('banner'))}
                                        >
                                            <i className="fas fa-copy"></i> Copy Code
                                        </button>
                                        <pre className="embed-code">
                                            {getAffiliateCode('banner')}
                                        </pre>
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Quick Copy Options */}
                        <div className="quick-copy-options mt-3">
                            <h6 className="mb-2">Quick Copy:</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => copyToClipboard(getAffiliateCode('url'), 'URL copied to clipboard!')}
                                >
                                    <i className="fas fa-link"></i> Copy URL Only
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => copyToClipboard(getAffiliateCode('simple'), 'Simple link copied!')}
                                >
                                    <i className="fas fa-code"></i> Copy Simple Link
                                </button>
                                {data?.linkDeepLink && (
                                    <button
                                        className="btn btn-sm btn-outline-success"
                                        onClick={() => copyToClipboard(data?.linkDestinationUrl || '#', 'Deep link copied!')}
                                    >
                                        <i className="fas fa-mobile-alt"></i> Copy Deep Link
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={data?.addType == "link" ? "text link" : "banner"} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card banner-detail-card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex align-items-center">
                            <button onClick={back} className="btn btn-back me-3">
                                <i className="fas fa-arrow-left" title='Back'></i>
                            </button>
                            <h3 className="mb-0">{data?.addType == "link" ? "Text Link Details" : "Banner Details"}</h3>
                        </div>
                    </div>

                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='banner-detail-wrapper'>
                                    <div className='row'>
                                        {/* Basic Information Section - Different for Link vs Banner */}
                                        {data?.addType === "link" ? (<></>
                                            // <div className='col-12'>
                                            //     <div className='detail-section'>
                                            //         <h5 className='section-title'>Basic Information</h5>
                                            //         <div className='row'>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Title</label>
                                            //                     <p>{data?.title ? methodModel.capitalizeFirstLetter(data.title) : '-'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>SEO Attributes</label>
                                            //                     <p>{data?.seo_attributes ? methodModel.capitalizeFirstLetter(data.seo_attributes) : '-'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Affiliate ID</label>
                                            //                     <p>{data?.affiliate_id || '-'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Access Type</label>
                                            //                     <p>{data?.access_type ? methodModel.capitalizeFirstLetter(data.access_type) : '-'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Animation</label>
                                            //                     <p>{data?.is_animation ? 'Yes' : 'No'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Deep Linking</label>
                                            //                     <p>{data?.is_deep_linking ? 'Yes' : 'No'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-6'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Mobile Creative</label>
                                            //                     <p>{data?.mobile_creative ? 'Yes' : 'No'}</p>
                                            //                 </div>
                                            //             </div>
                                            //             <div className='col-md-12'>
                                            //                 <div className='detail-item'>
                                            //                     <label>Description</label>
                                            //                     <div className='description-content' dangerouslySetInnerHTML={{
                                            //                         __html: data?.description || '-'
                                            //                     }} />
                                            //                 </div>
                                            //             </div>
                                            //         </div>
                                            //     </div>
                                            // </div>
                                        ) : (
                                            <div className='col-12'>
                                                <div className='detail-section'>
                                                    <h5 className='section-title'>Basic Information</h5>
                                                    <div className='row'>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>Title</label>
                                                                <p>{data?.title ? methodModel.capitalizeFirstLetter(data.title) : '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>SEO Attributes</label>
                                                                <p>{data?.seo_attributes ? methodModel.capitalizeFirstLetter(data.seo_attributes) : '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            <div className='detail-item'>
                                                                <label>Destination URL</label>
                                                                <p className="text-truncate">
                                                                    {data?.destination_url ? (
                                                                        <a href={data.destination_url} target="_blank" rel="noopener noreferrer">
                                                                            {data.destination_url}
                                                                        </a>
                                                                    ) : '-'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12'>
                                                            <div className='detail-item'>
                                                                <label>Description</label>
                                                                <div className='description-content' dangerouslySetInnerHTML={{
                                                                    __html: data?.description || '-'
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {renderLinkFields()}

                                        {data?.addType !== "link" && (
                                            <div className='col-12'>
                                                <div className='detail-section'>
                                                    <h5 className='section-title'>Categories</h5>
                                                    <div className='row'>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Main Category</label>
                                                                {data?.categoryData ? renderCategories(data.categoryData) : '-'}
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Sub Categories</label>
                                                                {data?.subCategoryData ? renderCategories(data.subCategoryData, 5) : '-'}
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Sub Child Categories</label>
                                                                {data?.childSubCategoryData ? renderCategories(data.childSubCategoryData, 5) : '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {data?.addType !== "link" && (
                                            <div className='col-12'>
                                                <div className='detail-section'>
                                                    <h5 className='section-title'>Dates</h5>
                                                    <div className='row'>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Created At</label>
                                                                <p>{data?.createdAt ? datepipeModel.date(data.createdAt) : '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Updated At</label>
                                                                <p>{data?.updatedAt ? datepipeModel.date(data.updatedAt) : '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Activation Date</label>
                                                                <p>{data?.activation_date ? datepipeModel.date(data.activation_date) : '-'}</p>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <div className='detail-item'>
                                                                <label>Expiration Date</label>
                                                                <p>{data?.expiration_date ? datepipeModel.date(data.expiration_date) : '-'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {data?.addType !== "link" && (
                                            <div className='col-12'>
                                                <div className='detail-section'>
                                                    <h5 className='section-title'>Banner Image</h5>
                                                    <div className='banner-image-container'>
                                                        {data?.image ? (
                                                            <img
                                                                src={methodModel.noImg(data.image)}
                                                                alt="Banner"
                                                                className="banner-image img-fluid"
                                                            />
                                                        ) : (
                                                            <div className="no-image-placeholder">
                                                                No Image Available
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {data?.addType !== "link" && (
                                            <div className='col-12'>
                                                <div className='detail-section'>
                                                    <h5 className='section-title'>Embed Code</h5>
                                                    <div className='embed-code-container'>
                                                        <div className="code-block-wrapper">
                                                            <button
                                                                className="btn btn-sm btn-copy"
                                                                onClick={() => copyToClipboard(`/* START ADVERTISER: WebHosting */\n<a href="${data?.destination_url || '#'}">\n  <img src="${data?.image ? methodModel.noImg(data.image) : '#'}" />\n</a>\n/* END ADVERTISER: WebHosting */`)}
                                                            >
                                                                <i className="fas fa-copy"></i> Copy Code
                                                            </button>
                                                            <pre className="embed-code">
                                                                {`/* START ADVERTISER: WebHosting */\n`}
                                                                {`<a href="${data?.destination_url || '#'}">\n`}
                                                                {`  <img src="${data?.image ? methodModel.noImg(data.image) : '#'}" />\n`}
                                                                {`</a>\n`}
                                                                {`/* END ADVERTISER: WebHosting */`}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
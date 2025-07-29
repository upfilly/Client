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
        ApiClient.get(`banner`, { id: did }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    const back = () => {
        const searchParams = window.location.search;                
        window.location.href = '/addbanner' + searchParams;
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

    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='sidebar-left-content'>
                <div className='card banner-detail-card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex align-items-center">
                            <button onClick={back} className="btn btn-back me-3">
                                <i className="fas fa-arrow-left" title='Back'></i>
                            </button>
                            <h3 className="mb-0">Banner Details</h3>
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
                                                            <p className="text-truncate">{data?.destination_url || '-'}</p>
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

                                        {/* Dates Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Dates</h5>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='detail-item'>
                                                            <label>Activation Date</label>
                                                            <p>{data?.activation_date ? datepipeModel.date(data.activation_date) : '-'}</p>
                                                        </div>
                                                    </div>
                                                    {/* <div className='col-md-4'>
                                                        <div className='detail-item'>
                                                            <label>Availability Date</label>
                                                            <p>{data?.availability_date ? datepipeModel.date(data.availability_date) : '-'}</p>
                                                        </div>
                                                    </div> */}
                                                    <div className='col-md-4'>
                                                        <div className='detail-item'>
                                                            <label>Expiration Date</label>
                                                            <p>{data?.expiration_date ? datepipeModel.date(data.expiration_date) : '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image Section */}
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

                                        {/* Embed Code Section */}
                                        <div className='col-12'>
                                            <div className='detail-section'>
                                                <h5 className='section-title'>Embed Code</h5>
                                                <div className='embed-code-container'>
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
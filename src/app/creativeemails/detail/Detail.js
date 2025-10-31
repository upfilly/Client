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
    const [copySuccess, setCopySuccess] = useState(false)

    const appendAffiliateToLinks = (htmlContent) => {
        if (!htmlContent) return '--';

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const links = doc.querySelectorAll('a');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const hasParams = href.includes('?');
                const newHref = hasParams
                    ? `${href}&affiliate=${user?.id}`
                    : `${href}?affiliate=${user?.id}`;
                link.setAttribute('href', newHref);
            }
        });

        // Get the modified HTML content
        return doc.body.innerHTML;
    };

    // Function to handle copying content to clipboard
    const copyToClipboard = (text) => {
        if (!text) return;

        navigator.clipboard.writeText(text)
            .then(() => {
                setCopySuccess(true);
                // Reset success message after 2 seconds
                setTimeout(() => {
                    setCopySuccess(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const getDetail = (did) => {
        loader(true)
        ApiClient.get(`emailtemplate`, { id: id }).then(res => {
            if (res.success) {
                setData(res.data)
            }
            loader(false)
        })
    };

    // const back = () => {
    //     history.back()
    // }

    const back = () => {
        const searchParams = window.location.search;

        window.location.href = '/creativeemails' + searchParams;
        // history.back()
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
                            <h3> <a to="/campaign" onClick={back}>  <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i></a>  Email Template Detail</h3>
                        </div>
                    </div>


                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3'>
                                <div className='campaine_detls_wrapper'>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Email Name:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls '>
                                                <p className='headsub'>{data && methodModel.capitalizeFirstLetter(data?.templateName)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Email Name:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.emailName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Subject:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.subject}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Purpose:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.purpose}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>From:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.from}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Audience:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls'>
                                                <p className='headsub mb-0'>{data && data?.audience}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>HTML content:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div></div>
                                                <span
                                                    // className="btn btn-sm btn-primary copy-btn"
                                                    onClick={() => copyToClipboard(appendAffiliateToLinks(data?.textContent))}
                                                >
                                                    {/* {copySuccess ? 'Copied!' : 'Copy HTML'} */}
                                                    <i className={`fa fa-${copySuccess ? 'check' : 'copy'} ml-1`} aria-hidden="true"></i>
                                                </span>
                                            </div>
                                            <div className='name-dtls content_scrollbx'>
                                                <p className='headsub mb-0'>{appendAffiliateToLinks(data?.textContent)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Text Content:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
                                            <div className='name-dtls image_content'>
                                                {/* Modified to use the affiliate link function */}
                                                <p className='headsub mb-0' dangerouslySetInnerHTML={{ __html: data && appendAffiliateToLinks(data?.textContent) || '--' }}></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Images:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
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
                                    </div> */}

                                    {/* <div className='row'>
                                        <div className='col-12 col-sm-12 col-md-4 col-lg-3'>
                                            <div className='userdata'>
                                                <p className='headmain'>Videos:</p>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-8 col-lg-9'>
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
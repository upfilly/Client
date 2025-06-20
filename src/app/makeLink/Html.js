import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import MultiSelectValue from '../components/common/MultiSelectValue'
import axios from 'axios';

const Html = () => {
    const user = crendentialModel.getUser()
    const [url, setUrl] = useState('');
    const [isSubmited, setSubmited] = useState(false);
    const [copied, setCopied] = useState(false);
    const [SelectDropdown, setSelectDropdown] = useState(true);
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [showNewKeyForm, setShowNewKeyForm] = useState(false);
    const [showCustomParameters, setShowCustomParameters] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState([
        { id: "param", label: "param" },
        // { key: "affiliate_id", label: "Affiliate ID" },
        { id: "newparam", label: "newparam" },
        { id: "newparam1", label: "newparam1" }
    ])
    const [brandData, setBrandData] = useState([])
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedValues, setSelectedValues] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [DestinationUrl, setDestinationUrl] = useState('')
    const [CampaignData, setCampaignData] = useState([])
    const [SelectedCampaign, setSelectedCampaign] = useState('')
    const [shrtlnk, setshrtlnk] = useState('')

    const handleInputChange = (selected, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [selected]: value
        }));
    };

    const updateDictionary = () => {
        const updatedDict = Object.fromEntries(
            Object.entries(inputValues).filter(([key]) => selectedValues.includes(key))
        );
        setInputValues(updatedDict);
    };

    useEffect(() => {
        updateDictionary();
    }, [selectedValues]);

    const handleMultiSelectChange = (selectedOptions) => {
        setSelectedValues(selectedOptions);
    };

    // Toggle function for custom parameters section
    const toggleCustomParameters = () => {
        setShowCustomParameters(!showCustomParameters);
    };

    const getData = (p = {}) => {
        let filter = {brand_id:user?.id}
        let url = 'getallaffiliatelisting'
        ApiClient.get(url,filter).then(res => {
            if (res.success) {
                const data = res.data
                // const filteredData = data.filter(item => item !== null);
                const manipulateData = data.map((itm) => {
                    return {
                        name: itm?.fullName || itm?.firstName, id: itm?.id || itm?._id
                    }
                })
                setBrandData(manipulateData)
            }
        })
    }

    const brands = Array.from(new Set(brandData.map(item => ({
        id: item.id || item?._id,
        name: item.fullName
    }))));

    const handleBrandChange = event => {
        setSelectedBrand(event.target.value);
    };

    const handleCampaignChange = event => {
        setSelectedCampaign(event.target.value)
    }

    useEffect(() => {
        getData()
        getCampaignData()
        generateShortLink(url)
    }, [url])

    const getCampaignData = (p = {}) => {
        let filter = { search: '', isDeleted: false, status: '', brand_id: user?.id }
        let url = 'campaign/brand/all'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                const data = res?.data?.data?.map((data) => {
                    return ({
                      id: data?.id || data?._id,
                      name: data?.name
                    })
                  })
                setCampaignData(data)
            }
        })
    }

    const copyText = () => {
        const textToCopy = document.getElementById("textToCopy").innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }).catch(err => {
            // console.error('Failed to copy: ', err);
        });
    };


    const copyShortText = () => {
        const textToCopy = document.getElementById("textShortToCopy").innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }).catch(err => {
            // console.error('Failed to copy: ', err);
        });
    };


    const generateShortLink = async (urlData) => {
        if (urlData || url) {
            const data = await axios.post('https://api.t.ly/api/v1/link/shorten', { long_url: urlData || url }, {
                headers: {
                    'Authorization':'Bearer KAxgeQzaEgrANTAdKImU25lQVbGZ3rkJTZ0vlN35FXqksFm65E3suA9opwee',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            )
            setshrtlnk(data?.data?.short_url)
        }
    }

    const handleAddNew = () => {
        if (newKey && newLabel) {
            setCheckboxValues(prevValues => [
                ...prevValues,
                { id: newKey, label: newLabel }
            ]);
            setNewKey('');
            setNewLabel('');
            setShowNewKeyForm(false);
        }
    };

    useEffect(() => {
        ApiClient.get('get-affilaite-link').then((res) => {
            if (res?.success) {
                console.log(res?.data, "res?.datares?.datares?.data")
                setUrl(res?.data?.link.replace('/?','/'))
                generateShortLink(res?.data?.link.replace('/?','/'))
            }
            loader(false);
        });
    }, []);

    const handleSubmit = () => {
        setSubmited(true)
        if(!DestinationUrl){
            return
        }
        // if (hasBlankInput) {
        //     toast.error("Please fill in all required fields.");
        //     return;
        // }

        const base_url = 'https://api.upfilly.com/';

        // const hasProtocol = /^https?:\/\//i.test(DestinationUrl);
        // const formattedDestinationUrl = DestinationUrl
        //     .replace(/^https?:\/\//i, '') 
        //     .replace(/\.com$/i, '');
        const rawUrl = DestinationUrl.replace(/^https?:\/\//i, '');

        const domainParts = rawUrl.split('.');
        const formattedDestinationUrl = domainParts.slice(0, -1).join('.')
        const domainExtension = domainParts[domainParts.length - 1];

        // const urlParams = new URLSearchParams({
        //     fp_sid: selectedBrand,
        //     affiliate: selectedBrand,
        //     brand: user?.id
        // }).toString();
        const urlParams = `fp_sid=${selectedBrand}&affiliate=${selectedBrand}&brand=${user?.id}`;

        let finalUrl = new URL(base_url);

        if (selectedBrand) {
            finalUrl.searchParams.set('affiliate_id', selectedBrand);
        }

        if (SelectedCampaign) {
            finalUrl.searchParams.set('campaign_id', SelectedCampaign);
        }

        if (DestinationUrl) {
            // const destinationUrlWithParams = `${formattedDestinationUrl}?${urlParams}`;
            const destinationUrlWithParams = `${formattedDestinationUrl}`;
            finalUrl.searchParams.set('url', destinationUrlWithParams);
            finalUrl.searchParams.set('ext', domainExtension);
        }

        const finalUrlString = finalUrl.toString();


        // loader(true);
        ApiClient.post('get-link', { "base_url": finalUrlString, "parameters": inputValues }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setSubmited(false)
                setUrl(res?.data.replace('/?','/'));
                generateShortLink(res?.data.replace('/?','/'))
                if (!SelectDropdown) {
                    setSelectDropdown(!SelectDropdown)
                }
                // setSelectedBrand('')
            }
            // loader(false);
        });
    };


    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Generate Link" filters={''} >
                <div className='sidebar-left-content'>
                    <div className="card">
                        <div className='card-header'>
                            <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 className="link_default m-0"><i className="fa fa-bullhorn link_icon" aria-hidden="true"></i> Default Links
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>

                            <div className='row'>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3'>
                                        <label className='mb-2' >Select Affiliate</label>
                                        <select class="form-select mb-2" id="brandSelect" value={selectedBrand} onChange={handleBrandChange}>
                                            <option value="">Select Affiliate</option>
                                            {brandData.map(brand => (
                                                <option key={brand.id} value={brand.id} >{brand.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <label className='mb-2' >Select Campaign</label>
                                        <select class="form-select mb-2" id="brandSelect" value={SelectedCampaign} onChange={handleCampaignChange}>
                                            <option value="">Select Campaign</option>
                                            {CampaignData.map(item => (
                                                <option key={item.id || item._id} value={item.id || item._id} >{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>
                                        Destination Url<span className="star">*</span>
                                    </label>
                                    <div className="input-group  border_description">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)}
                                        />
                                    </div>
                                    {(!DestinationUrl && isSubmited) && <div className="invalid-feedback d-block">Destination url is Required</div>}
                                </div>

                                <div className='col-12 col-md-12 mb-3'>
                                    {/* Show/Hide Custom Parameters Checkbox */}
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="showCustomParameters" 
                                            checked={showCustomParameters}
                                            onChange={toggleCustomParameters}
                                        />
                                        <label className="form-check-label" htmlFor="showCustomParameters">
                                            Show Custom Parameters
                                        </label>
                                    </div>
                                </div>

                                {showCustomParameters && (
                                    <div className='col-12 col-md-12'>
                                        <div class="select_parabx mb-3" >
                                            <div className='mb-3' >
                                                <label className='mb-2'>Select Custom Parameters</label>
                                                <MultiSelectValue
                                                    id="statusDropdown"
                                                    displayValue="label"
                                                    intialValue={selectedValues}
                                                    result={(e) => handleMultiSelectChange(e.value)}
                                                    setInputValues={setInputValues}
                                                    updateDictionary={updateDictionary}
                                                    inputValues={inputValues}
                                                    options={checkboxValues}
                                                />
                                            </div>

                                            <div className='addkey mt-3 mb-3 d-flex justify-content-end'>
                                                <button className='btn btn-primary ' onClick={() => setShowNewKeyForm(true)}><i className='fa fa-plus mr-1'></i>Add Key</button>
                                            </div>

                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-12 '>
                                                <div className='row'>
                                                    {selectedValues.map((selected, index) => (
                                                        <div className='col-12 col-sm-6 col-md-4 mb-3 ' key={index}>
                                                            <p className='mb-0 labeltext'>{selected}:</p>
                                                            <input
                                                                type="text"
                                                                className='form-control'
                                                                placeholder={`Input value for ${selected}`}
                                                                onChange={(e) => handleInputChange(selected, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='text-end '>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Genrate URL</button>
                            </div>

                            <h6 className="link_default m-0"> Your Link :</h6>
                            <div className="input-group my-3">
                                <div className="input-group-prepend pointer" title='Copy text' onClick={copyText}>
                                    <div className="input-group-text">
                                        <i className="fa fa-clipboard copy_icon" aria-hidden="true" ></i>
                                    </div>
                                </div>

                                {!selectedBrand && !SelectedCampaign && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://api.upfilly.com`}</div>}
                                {SelectedCampaign && !selectedBrand && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://api.upfilly.com/?campaign=${SelectedCampaign}`}</div>}
                                {selectedBrand && !SelectedCampaign && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://api.upfilly.com/?affiliate_id=${selectedBrand}`}</div>}
                                {selectedBrand && SelectedCampaign && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://api.upfilly.com/?affiliate_id=${selectedBrand}&campaign=${SelectedCampaign}`}</div>}
                            </div>

                            <h6 className="link_default mt-3 mb-0"> Your Short URL Link :</h6>
                            <div className="input-group my-2">
                                <div className="input-group-prepend pointer" title='Copy text' onClick={copyShortText}>
                                    <div className="input-group-text">
                                        <i className="fa fa-clipboard copy_icon" aria-hidden="true" ></i>
                                    </div>
                                </div>
                                <div id="textShortToCopy" className="form-control br0 mb-0 heauto" >{shrtlnk}</div>
                            </div>
                            {copied && <div className="">Copied!</div>}
                        </div>
                    </div>
                </div>
            </Layout>
            {showNewKeyForm && (
                <div class="modal d-block">
                    <div class="modal-dialog  modal-dialog-centered dateModal" role="document">
                        <div class="modal-content ">
                            <div class="modal-body">
                                <div className='d-flex justify-content-between'>
                                    <h5 className='mb-3'>Add New Key</h5>
                                    <i className='fa fa-times' onClick={() => setShowNewKeyForm(false)}></i>
                                </div>
                                <div className='form-group'>
                                    <p className='mb-2'>Key:</p>
                                    <input type="text" className='form-control' value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Enter Key" />
                                </div>

                                <div className='form-group'>
                                    <p className='mb-2'>Value:</p>
                                    <input type="text" className='form-control' value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Enter Label" />                            </div>

                                <div className='text-end'>
                                    <button type="button" class="btn btn-primary" onClick={handleAddNew} >Add Key</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Html;
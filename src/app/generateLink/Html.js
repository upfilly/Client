import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import MultiSelectValue from '../components/common/MultiSelectValue'
import axios from 'axios';
import methodModel from '../../methods/methods';

const Html = () => {
    const user = crendentialModel.getUser()
    const [isSubmited, setSubmited] = useState(false);
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [SelectDropdown, setSelectDropdown] = useState(true);
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [showNewKeyForm, setShowNewKeyForm] = useState(false);
    const [showCustomParameters, setShowCustomParameters] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState([
        { id: "param", label: "param" },
        { id: "newparam", label: "newparam" },
        { id: "newparam1", label: "newparam1" }
    ])
    const [brandData, setBrandData] = useState([])
    const [selectedBrand, setSelectedBrand] = useState('')
    const [selectedValues, setSelectedValues] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [DestinationUrl, setDestinationUrl] = useState('')
    const [shrtlnk, setshrtlnk] = useState('')

    const permission = (p) => {
        if (user && user?.permission_detail && p) {
          return user?.permission_detail[p]
        } else {
          return false
        }
      }

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

    const getData = (p = {}) => {
        let url = 'associated/brands'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                const manipulateData = filteredData.map((itm)=>{return{
                    name:itm?.fullName || itm?.firstName , id : itm?.id || itm?._id
                }})
                setBrandData(manipulateData)
            }
        })
    }

    const brands = Array.from(new Set(brandData.map(item => ({
        id: item.id,
        name: item.name
    }))));

    const handleBrandChange = event => {
        setSelectedBrand(event.target.value);
    };

    useEffect(() => {
        getData()
        generateShortLink(url)
    }, [url])

    function isValidUrl(url) {
        if (!url) return false;

        if (!/^https?:\/\//i.test(url)) {
            return false;
        }

        try {
            const urlObj = new URL(url);

            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return false;
            }

            if (!urlObj.hostname ||
                !/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(urlObj.hostname)) {
                return false;
            }

            if (urlObj.port && !/^\d+$/.test(urlObj.port)) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
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
                setUrl(res?.data?.link)
            }
            loader(false);
        });
    }, []);

    const generateShortLink = async(urlData) => {
        if(urlData || url){
        const data = await axios.post('https://api.t.ly/api/v1/link/shorten',{long_url:urlData || url}, {
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

    const handleSubmit = () => {
        setSubmited(true)
        if(!DestinationUrl || !selectedBrand){
            return
        }
        const base_url = 'https://api.upfilly.com/';
        // const hasProtocol = /^https?:\/\//i.test(DestinationUrl);
        // const formattedDestinationUrl = hasProtocol ? DestinationUrl : `https://${DestinationUrl}`;
        // const formattedDestinationUrl = DestinationUrl
        //     .replace(/^https?:\/\//i, '') 
        //     .replace(/\.com$/i, '');

        const rawUrl = DestinationUrl.replace(/^https?:\/\//i, '');

        const domainParts = rawUrl.split('.');
        let subdomain = '';
        let domainName = '';
        let domainExtension = '';

        if (domainParts.length >= 3) {
            subdomain = domainParts[0];
            domainName = domainParts[1];
            domainExtension = domainParts.slice(2).join('.');
        } else if (domainParts.length === 2) {
            domainName = domainParts[0]; // "example"
            domainExtension = domainParts[1]; // "com"
        }
        
        const baseParams = new URLSearchParams({
            affiliate_id: user?.id,
            merchant_id: selectedBrand
        });
        
        const urlParams = new URLSearchParams({
            fp_sid: user?.id,
            brand: selectedBrand,
            affiliate: user?.id
        }).toString();
        
        let finalUrl = base_url;
        
        if (user?.id) {
            finalUrl += `affiliate_id=${user?.id}`;
        }
        
        if (selectedBrand) {
            finalUrl += `&merchant_id=${selectedBrand}`;
        }
        
        if (DestinationUrl) {
            // const finalDestinationUrl = formattedDestinationUrl + (urlParams ? `?${urlParams}` : '');
            const finalDestinationUrl = domainName
            // finalUrl += `&url=${encodeURIComponent(finalDestinationUrl)}`;
            finalUrl += `&hUrl=${subdomain}&url=${finalDestinationUrl}&ext=${domainExtension}`;
        }
        
        if (!finalUrl.includes('?')) {
            finalUrl += '?';
        }
        
        ApiClient.post('get-link', { "base_url": finalUrl, "parameters": inputValues }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setSubmited(false)
                setUrl(res?.data);
                generateShortLink(res?.data)
                if (!SelectDropdown) {
                    setSelectDropdown(!SelectDropdown)
                }
            }
        });
    };

    // Handler for checkbox change
    const handleCustomParametersToggle = (e) => {
        setShowCustomParameters(e.target.checked);
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
                                <div className='col-12 col-sm-6 col-md-6 custom-dropdown'>
                                    <div className='mb-3' >
                                        <label>Select a Merchant</label>
                                        <select className="form-select mb-2" id="brandSelect" value={selectedBrand} onChange={handleBrandChange}>
                                            <option value="">Select a Merchant</option>
                                            {brands.map(brand => (
                                                <option key={brand.id} value={brand.id} >{brand.name}</option>
                                            ))}
                                        </select>
    {(!selectedBrand && isSubmited) && <div className="invalid-feedback d-block">Please select a merchant</div>}
                                    </div>
                                </div>
                                <div className="col-md-12 mb-3 custom-input">
                                    <label>
                                        Destination Url<span className="star">*</span>
                                    </label>
                                    <div className="input-group border_description">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={DestinationUrl}
                                             onChange={e => {
                                                const url = e.target.value;
                                                setDestinationUrl(url);
                                            }}
                                            style={!isValidUrl(DestinationUrl) && DestinationUrl ? { borderColor: 'red' } : {}}
                                            // onChange={(e) => setDestinationUrl(e.target.value)}
                                        />
                                    </div>
                                    {(!DestinationUrl && isSubmited) && <div className="invalid-feedback d-block">Destination url is Required</div>}
                                    {!isValidUrl(DestinationUrl) && DestinationUrl && (
                                        <div className="text-danger">Please enter a valid URL (including http:// or https://)</div>
                                    )}
                                </div>

                                {/* Custom Parameters Checkbox */}
                                <div className='col-12 col-md-12 mb-3'>
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="showCustomParameters" 
                                            checked={showCustomParameters}
                                            onChange={handleCustomParametersToggle}
                                        />
                                        <label className="form-check-label" htmlFor="showCustomParameters">
                                            Show Custom Parameters
                                        </label>
                                    </div>
                                </div>

                                {/* Custom Parameters Section - Only show when checkbox is checked */}
                                {showCustomParameters && (
                                    <div className='col-12 col-md-12'>
                                        <div className='select_parabx mb-3' >
                                            <div className='mb-3' >
                                                <label>Select Custom Parameters</label>
                                                <div className='position-relative set_downbx '>
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
                                            </div>

                                            <div className='addkey mt-3 d-flex justify-content-end'>
                                                <button className='btn btn-primary ' onClick={() => setShowNewKeyForm(true)}>
                                                    <i className='fa fa-plus mr-1'></i>Add Key
                                                </button>
                                            </div>
                                            <div className='row'>
                                                <div className='col-12 col-md-12 '>
                                                    <div className='row'>
                                                        {selectedValues.map((selected, index) => (
                                                            <div className='col-12 col-md-4 ' key={index}>
                                                                <div className='mb-3'>
                                                                    <p className='mb-0 labeltext'>{selected}:</p>
                                                                    <input
                                                                        type="text"
                                                                        className='form-control'
                                                                        placeholder={`Input value for ${selected}`}
                                                                        value={inputValues[selected] || ''}
                                                                        onChange={(e) => handleInputChange(selected, e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className='text-end'>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={!isValidUrl(DestinationUrl)}
                                >
                                    Generate URL
                                </button>
                            </div>

                            {permission('generate_link_get') && <div className='mb-3'>
                                <h6 className="link_default m-0"> Your Link :</h6>

                                <div className="input-group my-2">
                                    <div className="input-group-prepend pointer" title='Copy text' onClick={copyText}>
                                        <div className="input-group-text">
                                            <i className="fa fa-clipboard copy_icon" aria-hidden="true" ></i>
                                        </div>
                                    </div>
                                    {!selectedBrand && <p id="textToCopy" className="form-control gen_links heauto br0 mb-0" >{url || `https://api.upfilly.com/affiliate_id=${user?.id}`}</p>}
                                    {selectedBrand && <p id="textToCopy" className="form-control gen_links heauto br0 mb-0" >{url || `https://api.upfilly.com/affiliate_id=${user?.id}&merchant_id=${selectedBrand}`}</p>}
                                </div>
                            </div>}
                            {copied && <div className="">Copied!</div>}

                            {permission('generate_link_get') && <div className='mb-3' >
                                <h6 className="link_default m-0"> Your Short Link : </h6>

                                {shrtlnk && <div className="input-group my-2">
                                    <div className="input-group-prepend pointer" title='Copy text' onClick={copyShortText}>
                                        <div className="input-group-text">
                                            <i className="fa fa-clipboard copy_icon" aria-hidden="true" ></i>
                                        </div>
                                    </div>
                                    <p id="textShortToCopy" className="form-control gen_links br0 mb-0 heauto" >{shrtlnk}</p>
                                </div>}
                            </div>}
                        </div>
                    </div>
                </div>
            </Layout>
            {showNewKeyForm && (
                <div className="modal d-block">
                    <div className="modal-dialog modal-dialog-centered dateModal" role="document">
                        <div className="modal-content p-0">
                            <div className="modal-body">
                                <div className='d-flex justify-content-between'>
                                    <h5 className='mb-3'>Add New Key</h5>
                                    <i className='fa fa-times' onClick={() => setShowNewKeyForm(false)}></i>
                                </div>
                                <div className='form-group'>
                                    <label className='mb-2'>Key:</label>
                                    <input type="text" className='form-control' value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Enter Key" />
                                </div>

                                <div className='form-group'>
                                    <label className='mb-2'>Value:</label>
                                    <input type="text" className='form-control' value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Enter Label" />
                                </div>

                                <div className='text-end'>
                                    <button type="button" className="btn btn-primary" onClick={handleAddNew}>Add Key</button>
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
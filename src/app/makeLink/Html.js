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
    const [copied, setCopied] = useState(false);
    const [SelectDropdown, setSelectDropdown] = useState(true);
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [showNewKeyForm, setShowNewKeyForm] = useState(false);
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
    const [DestinationUrl,setDestinationUrl]=useState('')
    const [CampaignData,setCampaignData] = useState([])
    const [SelectedCampaign,setSelectedCampaign] = useState('')
    const [shrtlnk,setshrtlnk] = useState('')
  
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

    // const getData = (p = {}) => {

    //     let filter = {role: "affiliate",isDeleted: false}
    //     let url = 'users/list'
    //     ApiClient.get(url, filter).then(res => {
    //         if (res.success) {
    //             setBrandData(res?.data?.data);
    //         }
    //     })
    // }

    const getData = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                const manipulateData = filteredData.map((itm)=>{return{
                    name:itm?.fullName || itm?.firstName , id : itm?.id || itm?._id
                }})
                setAffiliateData(manipulateData)
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
        let filter = { search: '', isDeleted: false,status:'',brand_id:user?.id}
        let url='campaign/all'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setCampaignData(res.data.data)
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
            console.error('Failed to copy: ', err);
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
            console.error('Failed to copy: ', err);
        });
    };


    const generateShortLink = async(urlData) => {
        if(urlData || url){
        const data = await axios.post('https://shrtlnk.dev/api/v2/link',{url:urlData || url}, {
            headers: {
                'api-key':'eyZ0tnBPL04QueUUCl4gcFcdvaSQgRa79t9gQbWpCTxP4',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        )
        setshrtlnk(data?.data?.shrtlnk)
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
                setUrl(res?.data?.link)
            }
            loader(false);
        });
    }, []);

    const handleSubmit = () => {

        // if (hasBlankInput) {
        //     toast.error("Please fill in all required fields.");
        //     return;
        // }
        

      let base_url='https://upfilly.com/'
        if(DestinationUrl && selectedBrand && SelectedCampaign){
           base_url = `https://upfilly.com/?affiliate_id=${selectedBrand}&campaign=${SelectedCampaign}&url=${`https://${DestinationUrl}?fp_sid=${selectedBrand}&affiliate=${selectedBrand}&brand=${user?.id}`}` 
        }else if(DestinationUrl && selectedBrand){
            base_url = `https://upfilly.com/?affiliate_id=${selectedBrand}&url=${`https://${DestinationUrl}?fp_sid=${selectedBrand}&affiliate=${selectedBrand}&brand=${user?.id}`}`
        }else if(DestinationUrl && SelectedCampaign){
            base_url = `https://upfilly.com/?affiliate_id=${selectedBrand}&campaign=${SelectedCampaign}&url=${`https://${DestinationUrl}?fp_sid=${selectedBrand}&affiliate=${selectedBrand}&brand=${user?.id}`}` 
        }else if(SelectedCampaign && selectedBrand){
            base_url = `https://upfilly.com/?affiliate_id=${selectedBrand}&campaign=${SelectedCampaign}`  
        }else if(SelectedCampaign){
            base_url = `https://upfilly.com/?campaign=${SelectedCampaign}`  
        }else if(selectedBrand){
            base_url = `https://upfilly.com/?affiliate_id=${selectedBrand}`  
        }else if(DestinationUrl){
            base_url = `https://upfilly.com/?url=${`https://${DestinationUrl}?fp_sid=${selectedBrand}&affiliate=${selectedBrand}&brand=${user?.id}`}`  
        }

        // loader(true);
        ApiClient.post('get-link', { "base_url":base_url, "parameters": inputValues }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setUrl(res?.data);
                generateShortLink(res?.data)
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
                                            <label className='mb-2' >Select a Affiliate</label>
                                            <select class="form-select mb-2" id="brandSelect" value={selectedBrand} onChange={handleBrandChange}>
                                                <option value="">Select a Affiliate</option>
                                                {brands.map(brand => (
                                                    <option key={brand.id} value={brand.id} >{brand.name}</option>
                                                ))}
                                            </select>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                            <label className='mb-2' >Select a Campaign</label>
                                            <select class="form-select mb-2" id="brandSelect" value={SelectedCampaign} onChange={handleCampaignChange}>
                                                <option value="">Select a Campaign</option>
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
                                        {selectedBrand && <span className="input-group-text  ">?fp_sid={selectedBrand}</span>}
                                    </div>
                                    {/* {selectedBrand && (
                                        <div className="invalid-feedback d-block">Destination url is Required</div>
                                    )} */}
                                </div>
                                {/* <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <label className='mb-2' >Destination URL</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    {selectedBrand && <span className="input-group-text  ">? fp_sid:{selectedBrand}</span>}
                                    </div>

                                </div> */}

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
                                            <button className='btn btn-primary btn-sm' onClick={()=>setShowNewKeyForm(true)}><i className='fa fa-plus mr-1'></i>Add Key</button>
                                    </div>

                                </div>

<div className='row'>
<div className='col-12 col-md-12 '>
                                    <div className='row'>
                                        {selectedValues.map((selected,index) => (
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
                                   
                             
                            </div>

                            <div className='text-end '>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Add Data</button>
                            </div>

                            <h6 className="link_default m-0"> Your Link :</h6>
                            <div className="input-group my-3">
                                <div className="input-group-prepend pointer" title='Copy text' onClick={copyText}>
                                    <div className="input-group-text">
                                        <i className="fa fa-clipboard copy_icon" aria-hidden="true" ></i>
                                    </div>
                                </div>
                                
                                { !selectedBrand && !SelectedCampaign && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://upfilly.com`}</div>}
                                { SelectedCampaign && !selectedBrand && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://upfilly.com/?campaign=${SelectedCampaign}`}</div>}
                                {selectedBrand && !SelectedCampaign && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://upfilly.com/?affiliate_id=${selectedBrand}`}</div>}
                                {selectedBrand && SelectedCampaign && <div id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://upfilly.com/?affiliate_id=${selectedBrand}&campaign=${SelectedCampaign}`}</div>}
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

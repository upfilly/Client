import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import MultiSelectValue from '../components/common/MultiSelectValue'

const Html = () => {
    const user = crendentialModel.getUser()
    // const [isChecked, setIsChecked] = useState({});
    // const [parameters, setParameters] = useState({
    //     product: '',
    //     affiliate_id: '',
    //     XYZ: '',
    //     New_id: ''
    // });
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

        let filter = { status: 'accepted' }
        let url = 'make-offers'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                const uniqueBrands = new Set();
                const filteredData = res?.data?.data.reduce((acc, item) => {
                    if (!uniqueBrands.has(item.brand_id)) {
                        uniqueBrands.add(item.brand_id);
                        acc.push({
                            id: item.brand_id,
                            brand_name: item.brand_name
                        });
                    }
                    return acc;
                }, []);
                setBrandData(filteredData);
            }
        })
    }

    const brands = Array.from(new Set(brandData.map(item => ({
        id: item.brand_id,
        name: item.brand_name
    }))));

    const handleBrandChange = event => {
        setSelectedBrand(event.target.value);
    };

    useEffect(() => {
        getData()
    }, [])

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
      let base_url=''
        if(DestinationUrl && selectedBrand){
           base_url = `https://upfilly.jcsoftwaresolution.in/?affiliate_id=${user?.id}&merchant_id=${selectedBrand}&url=${`https://${DestinationUrl}`}` 
        }else if(selectedBrand){
            base_url = `https://upfilly.jcsoftwaresolution.in/?affiliate_id=${user?.id}&merchant_id=${selectedBrand}` 
        }else if(DestinationUrl){
            base_url = `https://upfilly.jcsoftwaresolution.in/?affiliate_id=${user?.id}&url=${`https://${DestinationUrl}`}` 
        }

        // loader(true);
        ApiClient.post('get-link', { "base_url":base_url, "parameters": inputValues }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setUrl(res?.data);
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
                                    <div>
                                            <div>Select a Merchant</div>
                                            <select class="form-select mb-2" id="brandSelect" value={selectedBrand} onChange={handleBrandChange}>
                                                <option value="">Select a Merchant</option>
                                                {brands.map(brand => (
                                                    <option key={brand.id} value={brand.id} >{brand.name}</option>
                                                ))}
                                            </select>
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div>
                                        <div>Destination URL</div>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    </div>

                                </div>

                                <div className='col-12 col-md-12'>
                                    <div>
                                    <div>Select Custom Parameters</div>
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


                                <div className='col-12 col-md-12 mt-2'>
                                    <div className='row'>
                                        {selectedValues.map((selected,index) => (
                                            <div className='col-12 col-md-4 ' key={index}>
                                               <div className='mb-3'>
                                               <p className='mb-0 labeltext'>{selected}:</p>
                                                <input
                                                    type="text"
                                                    className='form-control'
                                                    placeholder={`Input value for ${selected}`}
                                                    onChange={(e) => handleInputChange(selected, e.target.value)}
                                                />
                                               </div>
                                            </div>
                                         ))}
                                    </div>

                                </div>


                            </div>
                          

                        

                            <div className='text-end mt-3'>
                                <button type="button" class="btn btn-primary pr-5 pl-5" onClick={handleSubmit} >Add Data</button>
                            </div>

                            <div className="input-group mb-2 mt-3">
                                <div className="input-group-prepend pointer" title='Copy text' onClick={copyText}>
                                    <div className="input-group-text">
                                        <i className="fa fa-clipboard copy_icon" aria-hidden="true" ></i>
                                    </div>
                                </div>
                                {!selectedBrand && <p id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://upfilly.jcsoftwaresolution.in/?affiliate_id=${user?.id}`}</p>}
                                {selectedBrand && <p id="textToCopy" className="form-control br0 mb-0 heauto" >{url || `https://upfilly.jcsoftwaresolution.in/?affiliate_id=${user?.id}&merchant_id=${selectedBrand}`}</p>}
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
                                    <button type="button" class="btn btn-primary pr-5 pl-5" onClick={handleAddNew} >Add Key</button>
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

import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';

const Html = () => {
    const user = crendentialModel.getUser()
    const [isChecked, setIsChecked] = useState({});
    const [parameters, setParameters] = useState({
        product: '',
        affiliate_id: '',
        XYZ: '',
        New_id: ''
    });
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [SelectDropdown, setSelectDropdown] = useState(true);
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [showNewKeyForm, setShowNewKeyForm] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState([
        { key: "product", label: "Product" },
        // { key: "affiliate_id", label: "Affiliate ID" },
        { key: "XYZ", label: "XYZ" },
        { key: "New_id", label: "New ID" }
    ])
    const [brandData,setBrandData] = useState([])
    const [selectedBrand,setSelectedBrand] = useState('')        

    const getData = (p = {}) => {
        // setLoader(true)
        // const brand_id = user?.role == 'brand' ? user?.id : null
        let filter = {status:'accepted'}
        let url = 'make-offers'
        ApiClient.get(url, filter).then(res => {
          if (res.success) {
            console.log(res?.data?.data,"dgfygduyfg")
            setBrandData(res?.data?.data)
            // setTotal(res?.data?.total_count)
          }
        //   setLoader(false)
        })
      }

      const brands = Array.from(new Set(brandData.map(item => ({
        id: item.brand_id,
        name: item.brand_name
      }))));

      const handleBrandChange = event => {
        setSelectedBrand(event.target.value);
      };

      useEffect(()=>{
        getData()
      },[])

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

    const handleCheckboxChange = (key) => {
        setIsChecked(prevState => ({
            ...prevState,
            [key]: !prevState[key]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setParameters(prevParams => ({
            ...prevParams,
            [name]: value
        }));
    };

    const handleAddNew = () => {
        if (newKey && newLabel) {
        setCheckboxValues(prevValues => [
            ...prevValues,
            { key: newKey, label: newLabel }
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

    console.log(isChecked,"isCheckedisChecked")

    const handleSubmit = () => {
        const checkedParameters = {};
        let hasBlankInput = false;
        // Check for blank inputs in checked parameters
        Object.keys(isChecked).forEach(key => {
            if (isChecked[key]) {
                if (!parameters[key]) {
                    hasBlankInput = true;
                    return;
                }
                checkedParameters[key] = parameters[key];
            }
        });
    
        if (hasBlankInput) {
            toast.error("Please fill in all required fields.");
            return;
        }
    
        loader(true);
        ApiClient.post('get-link', { "base_url": `https://upfilly.jcsoftwaresolution.in/?affiliate_id=${user?.id}&merchant_id=${selectedBrand}`, "parameters": checkedParameters }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setUrl(res?.data);
                if(!SelectDropdown){
                setSelectDropdown(!SelectDropdown)}
                setIsChecked({})
                setSelectedBrand('')
            }
            loader(false);
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
                                <div className=''>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="position-relative">
                                            <button className="btn btn-primary btn-sm " onClick={() => setSelectDropdown(!SelectDropdown)}>
                                                Add Dynamic Parameters <i className='fa fa-angle-down'></i>
                                            </button>
                                            {!SelectDropdown && <div className="links_width_menu">
                                                {checkboxValues.map((checkbox, index) => (
                                                    <div key={index} className=" pb-2 mb-3 border-bottom">
                                                        <div className='d-flex align-items-center gap-3 justify-content-between'>
                                                            <div className="">
                                                                <input className="mr-1" type="checkbox" id={`gridCheck${index}`} checked={isChecked[checkbox.key]} onChange={() => handleCheckboxChange(checkbox.key)} />
                                                                <label className="mb-0" htmlFor={`gridCheck${index}`}>
                                                                    {checkbox.label}
                                                                </label>
                                                            </div>
                                                            {isChecked[checkbox.key] && (
                                                                <div className="">
                                                                    <input type="text" className="inpudesgn mr-2" name={checkbox.key} value={parameters[checkbox.key]} onChange={handleInputChange} placeholder={`Enter ${checkbox.label} Value`} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='text-end'>
                                                    <button className="btn btn-secondary btn-sm mb-3 mr-2" onClick={() => setShowNewKeyForm(true)}>Add New</button>
                                                    <button className="btn btn-primary btn-sm mb-3" onClick={handleSubmit}>Submit</button>
                                                </div>
                                            </div>}
                                        </div>
                                        <div>
                                            <select class="form-select" id="brandSelect" value={selectedBrand} onChange={handleBrandChange}>
                                                <option value="">Select a Merchant</option>
                                                {brands.map(brand => (
                                                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                      { selectedBrand && <button className='btn btn-primary login ml-3' onClick={handleSubmit}>Save Change</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card-body'>
                            {/* <h5 className="fiver_cpa mb-3">Fiverr CPA</h5> */}
                            <div className="input-group mb-2">

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

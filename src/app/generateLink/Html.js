import datepipeModel from '@/models/datepipemodel';
import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import { Dropdown } from 'react-bootstrap';

const Html = () => {
    const [isChecked, setIsChecked] = useState({});
    const [parameters, setParameters] = useState({
        product: '',
        affiliate_id: '',
        XYZ: '',
        New_id: ''
    });
    const [url, setUrl] = useState('')
    const [copied, setCopied] = useState(false);
    const [SelectDropdown,setSelectDropdown] = useState(true)

    const copyText = () => {
        const textToCopy = document.getElementById("textToCopy").innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log("texttttttt")
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const checkboxValues = [
        { key: "product", label: "Product" },
        { key: "affiliate_id", label: "Affiliate ID" },
        { key: "XYZ", label: "XYZ" },
        { key: "New_id", label: "New ID" }
    ];

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

    // useEffect(()=>{
    //     ApiClient.get('get-link').then((res) => {
    //         if (res?.success) {
    //             setUrl(res?.data)
    //             console.log(res?.data, "=======resssss")
    //         }
    //     loader(false)
    //     })
    // },[])

    const handleSubmit = () => {
        const checkedParameters = {};
        Object.keys(isChecked).forEach(key => {
            if (isChecked[key]) {
                checkedParameters[key] = parameters[key];
            }
        });
        loader(true)
        ApiClient.post('get-link', { "base_url": "https://upfilly.jcsoftwaresolution.in/", "parameters": checkedParameters }).then((res) => {
            if (res?.success) {
                setUrl(res?.data)
                console.log(res?.data, "=======resssss")
            }
            loader(false)
        })

        const queryParams = Object.keys(checkedParameters)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(checkedParameters[key]))
            .join('&');
        const url = 'http://example.com?' + queryParams;
        console.log(url, "urlurl")
    };

    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Generate Link" filters={''} >
                <div className='sidebar-left-content'>


                    <div class="card">
                        <div className='card-header'>
                            <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 class="link_default m-0"><i class="fa fa-bullhorn link_icon" aria-hidden="true"></i> Default Links
                                </h3>

                                <div className=''>
                                    <div class="d-flex align-items-center gap-3">
                                        <div className="position-relative">
                                            <button className="btn btn-primary btn-sm " onClick={()=>setSelectDropdown(!SelectDropdown)}>
                                                Dynamic Parameters <i className='fa fa-angle-down'></i>
                                            </button>
                                            {!SelectDropdown && <div className="links_width_menu" >
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
                                                                <i className="fa fa-times class-bx" aria-hidden="true"></i>
                                                            </div>
                                                          
                                                        )}
                                                           </div>
                                                    </div>
                                                ))}
                                               <div className='text-end'>
                                               <button className="btn btn-primary mb-3" onClick={handleSubmit}>Submit</button>
                                               </div>
                                            </div>}
                                        </div>
                                        {/* <div className='select_one'>
                                        <select className='selectwidth '>
                                            <option>One</option>
                                            <option>One</option>
                                            <option>One</option>
                                        </select>
                                    </div> */}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='card-body'>
                            <h2 class="fiver_cpa">Fiverr CPA</h2>
                            <div class="input-group mb-2">

                                <div class="input-group-prepend">
                                    <div class="input-group-text">
                                        <i className="fa fa-clipboard copy_icon" aria-hidden="true" onClick={copyText}></i>
                                    </div>
                                </div>
                                <p id="textToCopy" class="form-control mb-0" >{url || 'https://upfilly.jcsoftwaresolution.in/'}</p>
                                
                            </div>
                           
                        </div>
                        {copied && <div className="">Copied!</div>}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

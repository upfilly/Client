import datepipeModel from '@/models/datepipemodel';
import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';

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
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                DYNAMIC PARAMETERS
                                            </button>
                                            <div className="dropdown-menu width_menu" aria-labelledby="dropdownMenuButton">
                                                {checkboxValues.map((checkbox, index) => (
                                                    <div key={index} className="d-flex align-items-center gap-3 justify-content-between px-2 border-bottom">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" id={`gridCheck${index}`} checked={isChecked[checkbox.key]} onChange={() => handleCheckboxChange(checkbox.key)} />
                                                            <label className="form-check-label" htmlFor={`gridCheck${index}`}>
                                                                {checkbox.label}
                                                            </label>
                                                        </div>
                                                        {isChecked[checkbox.key] && (
                                                            <div className="d-flex gap-3 align-items-center">
                                                                <input type="text" className="form-control" name={checkbox.key} value={parameters[checkbox.key]} onChange={handleInputChange} placeholder={`Enter ${checkbox.label} Value`} />
                                                                <i className="fa fa-times class-bx" aria-hidden="true"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <button className="btn btn-primary mt-3" onClick={handleSubmit}>Submit</button>
                                            </div>
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

import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import SelectDropdown from '@/app/components/common/SelectDropdown';

const Html = () => {
    const user = crendentialModel.getUser()
    const [selectedBrand, setSelectedBrand] = useState('')
    const [formData, setFormData] = useState({});
    const [data, setData] = useState([]);
    const [formType, setFormType] = useState('single');
    const [isChecked, setIsChecked] = useState(false);
    const [file, setFile] = useState(null);
    const [locale, setLocale] = useState('');
    const [hasHeader, setHasHeader] = useState(false);
    const [commissionSelectType, setCommissionType] = useState("");

    console.log(data,"datadatav")

    const commissionType = [{
        id: "sales", name: "Sales"
    },
    {
        id: "lead", name: "Lead"
    }]

    const handleFileChange = (event) => {
        console.log("innnnnnn")
        const selectedFile = event.target.files[0];
        ApiClient.postFormData('upload/document',{file:selectedFile}).then((res)=>{
            if(res?.success){
                // setFile(selectedFile)
                console.log(res?.data)
            }
        })
    };

    const handleLocaleChange = (event) => {
        setLocale(event.target.value);
    };

    const handleHeaderChange = (event) => {
        setHasHeader(event.target.checked);
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleCommissionTypeChange =(e)=>{
        setCommissionType(e.target.value)
    }

    const getData = (p = {}) => {
        // let filter = { ...filters, ...p }
        ApiClient.get(`users/list`).then(res => {
          if (res.success) {
            setData(res?.data?.data)
          }
        })
      };

      useEffect(()=>{
        getData()
      },[])

    const handleSubmit = () => {

        let payload ;

        if(formType == "single"){
            payload={
                "upload_method": formType,
                "commission_type": commissionSelectType,
                // "publisher_id": formData?.publisher_id,
                "amount_of_sale": formData?.amount_of_sale,
                "amount_of_commission": formData?.amount_of_commission,
                "order_reference": formData?.order_reference,
                "click_ref": formData?.click_ref,
                "affiliate_id": formData?.publisher_id,
                "is_send_email_to_publisher": isChecked,
            }
        }else{
           payload={
            "batch_file": formData?.batch_file,
            "isContain_headers": hasHeader ? "yes" : "no",
            "locality": locale,
           }
        }

        ApiClient.post('add-commission',payload).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setFormType('')
                setCommissionType('')
                setFormData({
                    "amount_of_sale":"",
                    "amount_of_commission":"",
                    "order_reference":"",
                    "click_ref":"",
                    "affiliate_id":"",
                    "is_send_email_to_publisher": false,
                    "batch_file":"",
                    "isContain_headers":false,
                    "locality": '',
                })
            }
            // loader(false);
        });

    };


    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Manual Commission" filters={''} >
                <div className='sidebar-left-content'>
                    <div className="card">
                        <div className='card-header'>
                            <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 className="link_default m-0"><i className="fa fa-bullhorn mr-3 link_icon" aria-hidden="true"></i>
                                    Manual Commission
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>

                        <div className='container' >

                                
                                   <div className='d-flex gap-5 align-items-center mb-4 ' >
                                     <div className="form-check" >
                                    <input
                                    className="form-check-input"
                                        type="radio"
                                        id="single"
                                        name="formType"
                                        value="single"
                                        checked={formType === 'single'}
                                        onChange={() => setFormType('single')}
                                    />
                                    <label className="form-check-label" htmlFor="single">Single</label>
                                    </div>
                                    <div className="form-check" >
                                    <input
                                    className="form-check-input"
                                        type="radio"
                                        id="batch"
                                        name="formType"
                                        value="batch"
                                        checked={formType === 'batch'}
                                        onChange={() => setFormType('batch')}
                                    />
                                    <label className="form-check-label" htmlFor="batch">Batch(CSV)</label>
                                    </div>
                                   </div>
                               
                                {formType === 'single' && 
                                <div className='row' >
                                    <div className='col-md-6 '>
                                        <div className='mb-3' >
                                        <label>Select a Commission Type</label>
                                                <SelectDropdown
                                                    id="statusDropdown"
                                                    displayValue="name"
                                                    placeholder="select"
                                                    intialValue={commissionSelectType}
                                                    result={e => { setCommissionType(e.value) }}
                                                    options={commissionType}
                                                />
                                        </div>
                                    </div>
                                    <div className='col-md-6 '>
                                        <div className='mb-3' >
                                        <label>Publisher Id</label>
                                                <SelectDropdown
                                                    id="statusDropdown"
                                                    displayValue="fullName"
                                                    placeholder="select"
                                                    intialValue={formData?.publisher_id}
                                                    result={e => { setFormData({ ...formData, publisher_id:e.value}) }}
                                                    options={data}
                                                />
                                        </div>
                                    </div>
                                    <div className='col-md-6 '>
                                        <div className='mb-3' >
                                            <label>Amount of Commission </label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder="Enter your Amount of Commission"
                                                value={formData?.amount_of_commission}
                                                onChange={(e) => setFormData({ ...formData, amount_of_commission: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className='col-md-6 '>
                                        <div className='mb-3' >
                                            <label>Commission Status</label>
                                            <SelectDropdown
                                                id="statusDropdown"
                                                displayValue="name"
                                                placeholder="select"
                                                intialValue={formData?.commission_status}
                                                result={e => { setFormData({ ...formData, commission_status: e.value }) }}
                                                options={[
                                                    { id: 'pending', name: 'Pending' },
                                                    { id: 'confirmed', name: 'Confirmed' },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-md-6 '>
                                        <div className='mb-3' >
                                            <label>Order Reference</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder="Enter your Order Rference"
                                                value={formData?.order_reference}
                                                onChange={(e) => setFormData({ ...formData, order_reference: e.value })} />
                                        </div>
                                    </div>

                                    <div className='col-md-6 '>
                                        <div className='mb-3' >
                                            <label>click ref (IO Number)</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder="Enter your click ref (IO Number)"
                                                value={formData?.click_ref}
                                                onChange={(e) => setFormData({ ...formData, click_ref: e.value })} />
                                        </div>
                                    </div>
                                  <div className='col-md-12'>
                                    <div className='mb-3'>
                                    <div  className="form-check form-check-inline ">
                                   
                                   <label className="form-check-label" >
                                   <input
                                       className="form-check-input mt-1"
                                           type="checkbox"
                                           checked={isChecked}
                                           onChange={handleCheckboxChange}
                                       />
                                    <span className='ml-2' >Check the box to send the publisher an email containing the commission details </span>
                                   </label>
                                   </div>
                                    </div>
                                  </div>
                                  
                                </div>}
                                {formType != 'single' &&<>
                                    <div className='mb-3' >
                                        <label htmlFor="fileInput">Upload CSV file:</label>
                                        <input
                                            type="file"
                                            className='form-control'
                                            id="fileInput"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className='mb-3' >
                                        <label htmlFor="localeSelect">Select Locale:</label>
                                        <select className='form-control' id="localeSelect" value={locale} onChange={handleLocaleChange}>
                                            <option value="">Select Locale</option>
                                            <option value="en">English</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                    <div className="form-check form-check-inline" >
                                    <input className="form-check-input"type="checkbox"
                                                id="headerCheckbox"
                                                checked={hasHeader}
                                                onChange={handleHeaderChange}
                                            />
                                        <label className="form-check-label" htmlFor="headerCheckbox"> Does first line contain header?
                                        </label>
                                    </div></>}
                          
                            <div className='text-end'>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Submit Commisssion</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

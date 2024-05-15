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
    const [inputValues, setInputValues] = useState({});
    const [DestinationUrl, setDestinationUrl] = useState('')
    const [formType, setFormType] = useState('single');
    const [isChecked, setIsChecked] = useState(false);
    const [file, setFile] = useState(null);
    const [locale, setLocale] = useState('');
    const [hasHeader, setHasHeader] = useState(false);

    const commissionType = [{
        id: "sales or lead", name: "Sales or Lead"
    }]

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
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

    const handleSubmit = () => {

        ApiClient.post('get-link', { "base_url": base_url, "parameters": inputValues }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                
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
                                <h3 className="link_default m-0"><i className="fa fa-bullhorn link_icon" aria-hidden="true"></i>
                                    Manual Commission
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>

                            <div className='row'>
                                <div>
                                    <input
                                        type="radio"
                                        id="single"
                                        name="formType"
                                        value="single"
                                        checked={formType === 'single'}
                                        onChange={() => setFormType('single')}
                                    />
                                    <label htmlFor="single">Single</label>
                                    <input
                                        type="radio"
                                        id="batch"
                                        name="formType"
                                        value="batch"
                                        checked={formType === 'batch'}
                                        onChange={() => setFormType('batch')}
                                    />
                                    <label htmlFor="batch">Batch(CSV)</label>
                                </div>
                                {formType === 'single' && <div>
                                    <div className='col-md-6 mb-3'>
                                        {/* <div className='mb-3' > */}
                                        <label>Select a Commission Type</label>
                                        <select class="form-select mb-2" id="brandSelect" value={selectedBrand}
                                        // onChange={handleBrandChange}
                                        >
                                            <option value="">Select a Commission Type</option>
                                            {commissionType.map(data => (
                                                <option key={data.id} value={data.id} >{data.name}</option>
                                            ))}
                                        </select>
                                        {/* </div> */}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        {/* <div className='mb-3' > */}
                                        <label>Publisher Id</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Publisher Id"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                        {/* </div> */}
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <div className='mb-3' >
                                            <label>Amount of Commission </label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder="Enter your Amount of Commission"
                                                value={DestinationUrl}
                                                onChange={(e) => setDestinationUrl(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='col-md-6 mb-3'>
                                        <div className='mb-3' >
                                            <label>Commission Status</label>
                                            <SelectDropdown
                                                id="statusDropdown"
                                                displayValue="name"

                                                placeholder="select"
                                                intialValue={formData?.instant_messaging}
                                                result={e => { setFormData({ ...formData, instant_messaging: e.value }) }}
                                                options={[
                                                    { id: 'pending', name: 'Pending' },
                                                    { id: 'confirmed', name: 'Confirmed' },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-md-6 mb-3'>
                                        <div className='mb-3' >
                                            <label>Order Rference</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder="Enter your Order Rference"
                                                value={DestinationUrl}
                                                onChange={(e) => setDestinationUrl(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='col-md-6 mb-3'>
                                        <div className='mb-3' >
                                            <label>click ref (IO Number)</label>
                                            <input
                                                type="text"
                                                className='form-control'
                                                placeholder="Enter your click ref (IO Number)"
                                                value={DestinationUrl}
                                                onChange={(e) => setDestinationUrl(e.target.value)} />
                                        </div>
                                    </div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        Check the box to send the publisher an email containing the commission details
                                    </label>
                                </div>}
                                {formType != 'single' && <form onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="fileInput">Upload CSV file:</label>
                                        <input
                                            type="file"
                                            className='form-control'
                                            id="fileInput"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="localeSelect">Select Locale:</label>
                                        <select className='form-control' id="localeSelect" value={locale} onChange={handleLocaleChange}>
                                            <option value="">Select Locale</option>
                                            <option value="en">English</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="headerCheckbox">
                                            <input
                                                type="checkbox"
                                                id="headerCheckbox"
                                                checked={hasHeader}
                                                onChange={handleHeaderChange}
                                            />
                                            Does first line contain header?
                                        </label>
                                    </div>
                                </form>}
                            </div>
                            <div className='text-end'>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Submit Commisssion</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

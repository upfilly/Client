import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import MultiSelectValue from '../../components/common/MultiSelectValue'
import axios from 'axios';
import SelectDropdown from '@/app/components/common/SelectDropdown';

const Html = () => {
    const user = crendentialModel.getUser()
    const [url, setUrl] = useState('');
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [showNewKeyForm, setShowNewKeyForm] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('')
    const [formData, setFormData] = useState({});
    const [inputValues, setInputValues] = useState({});
    const [DestinationUrl, setDestinationUrl] = useState('')
    const [formType, setFormType] = useState('single');
    const commissionType = [{
        id:"sales or lead" , name :"Sales or Lead"
    }]

    const handleSubmit = () => {
      
        ApiClient.post('get-link', { "base_url": base_url, "parameters": inputValues }).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setUrl(res?.data);
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
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label>Select a Commission Type</label>
                                        <select class="form-select mb-2" id="brandSelect" value={selectedBrand} 
                                        // onChange={handleBrandChange}
                                        >
                                            <option value="">Select a Commission Type</option>
                                            {commissionType.map(data => (
                                                <option key={data.id} value={data.id} >{data.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label>Publisher Id</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    </div>
                                </div>
                                 <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label>Amount of Commission </label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    </div>
                                </div>
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
                                 <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label>Order Rference</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    </div>
                                </div>
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label>click ref (IO Number)</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <input
                                            type="checkbox"
                                            className='form-control'
                                            placeholder="Enter your Url"
                                            value={DestinationUrl}
                                            onChange={(e) => setDestinationUrl(e.target.value)} />
                                    </div>
                                </div>
                                </div>}
                            </div>
                            <div className='text-end'>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Add Data</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            {showNewKeyForm && (
                <div class="modal d-block">
                    <div class="modal-dialog  modal-dialog-centered dateModal" role="document">
                        <div class="modal-content  p-0">
                            <div class="modal-body">
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
                                    <input type="text" className='form-control' value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Enter Label" />                            </div>

                                <div className='text-end'>
                                    <button type="button" class="btn btn-primary " onClick={handleAddNew} >Add Key</button>
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

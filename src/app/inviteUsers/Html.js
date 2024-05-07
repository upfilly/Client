import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import SelectDropdown from '../components/common/SelectDropdown';

const Html = () => {
    const user = crendentialModel.getUser()
    const [form, setForm] = useState({
        email: '',
        language: '',
        type: '',
        firstName:'',
        lastName:''
    })

    const handleSubmit = () => {

        const payload = {
            role: form?.type,
            language: form?.language,
            email: form?.email,
            firstName:form?.firstName,
            lastName:form?.lastName
        }
        loader(true);
        ApiClient.post('add/user', payload).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setForm({
                    email: '',
                    language: '',
                    type: '',
                    firstName:'',
                    lastName:''
                })
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
                                <h3 className="link_default m-0"><i className="fa fa-bullhorn link_icon" aria-hidden="true"></i> Invite user
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>

                            <div className='row'>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >First Name</div>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter First Name"
                                            value={form?.firstName}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Last Name</div>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter Last Name"
                                            value={form?.lastName}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Enter Email</div>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter Email"
                                            value={form?.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Select User Role</div>
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Roles"
                                            intialValue={form?.type}
                                            result={e => setForm({ ...form, type: e.value })}
                                            options={[
                                                { id: 'affiliate', name: 'Super User' },
                                                { id: 'operator', name: 'Operator' },
                                                { id: 'analyzer', name: 'Analyzer' },
                                                { id: 'publisher', name: 'Publisher' },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Language</div>
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Language"
                                            intialValue={form?.language}
                                            result={e => setForm({ ...form, language: e.value })}
                                            options={[
                                                { id: 'English', name: 'English(US)' },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='text-end mt-3'>
                                <button type="button" class="btn btn-primary pr-5 pl-5" onClick={handleSubmit} >Invite User</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

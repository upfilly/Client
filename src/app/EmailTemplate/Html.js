import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import SelectDropdown from '../components/common/SelectDropdown';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import moment from 'moment'

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ relatedAffiliate , form, setForm , handleSubmit }) => {
    const user = crendentialModel.getUser()
    const history = useRouter()
    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Send E-mail" filters={''} >
                <div className='sidebar-left-content'>
                    <div className="card">
                        <div className='card-header'>
                            <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 className="link_default m-0"><i className="fa fa-bullhorn link_icon" aria-hidden="true"></i> Send E-mail
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>

                            <div className='row'>
                            <div className='col-12 col-sm-3 col-md-3'>
                                    <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.isAllJoined}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: e.target.checked ,timeInterval:'',affiliateStatus:false ,acceptedDate:''})}
                                        />
                                        <label className='form-check-label' >All Joined</label>
                                    </div>
                                    <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.affiliateStatus}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: false ,timeInterval:'',affiliateStatus:e.target.checked ,acceptedDate:''})}
                                        />
                                        <label className=' form-check-label' >Active Affiliates</label>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-3 col-md-3'>
                                    <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.timeInterval=='before' ? true : false}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: false,timeInterval:'before',affiliateStatus:false })}
                                        />
                                        <label className='form-check-label' >before</label>
                                        </div>
                                        <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.timeInterval=='after' ? true:false}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: false,timeInterval:'after',affiliateStatus:false })}
                                        />
                                        <label className='form-check-label' >after</label>
                                        </div>
                                </div>
                              
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className=' mb-3' >
                                    <label  className='form-label' >Joined Date</label>
                                        <input
                                            type="date"
                                            className='form-control'
                                            disabled={!form?.timeInterval}
                                            placeholder="Select date"
                                            value={moment(form?.acceptedDate).format('YYYY-MM-DD')}
                                            onChange={(e) => setForm({ ...form, acceptedDate:e.target.value })}
                                        />
                                       
                                    </div>
                                </div>
                             
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label className='mb-2' >Title</label>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter Title"
                                            value={form?.title ? form?.title : ''}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {/* <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Select User</div>
                                        <SelectDropdown                                                     theme='search'
                                            id="statusDropdown"
                                            displayValue="fullName"
                                            placeholder="Select User"
                                            intialValue={form?.user_id ? form?.user_id : ''}
                                            result={e => setForm({ ...form, user_id: e.value })}
                                            options={relatedAffiliate}
                                        />
                                    </div>
                                </div> */}
                                <div className='col-md-12 '>
                                    <div className='mb-3 custom-description' >
                                        <label className='mb-2' >Description</label>
                                        <DynamicReactQuill
                                            theme="snow"
                                            value={form?.description ? form?.description : ''}

                                            onChange={(newValue, editor) => {
                                                setForm({ ...form, description: newValue })
                                            }}
                                            className='tuncketcls'
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                    [{ size: [] }],
                                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                                    { 'indent': '-1' }, { 'indent': '+1' }],
                                                    ['link', 'image', 'video'],
                                                    ['clean']
                                                ],
                                            }}
                                            formats={[
                                                'header', 'font', 'size',
                                                'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                'list', 'bullet', 'indent',
                                                'link', 'image', 'video'
                                            ]}
                                            bounds={'.app'}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className='text-end mt-3'>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Send E-mail</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

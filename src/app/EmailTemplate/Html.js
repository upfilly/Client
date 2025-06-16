import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/global/layout';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import moment from 'moment'
import environment from '@/environment';
import { Editor } from '@tinymce/tinymce-react';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ relatedAffiliate, form, setForm, handleSubmit }) => {
    const user = crendentialModel.getUser()
    const history = useRouter()
    const editorRef = useRef(null);
    const [emailTemplate, setEmailTemplate] = useState('');
    const [errors, setErrors] = useState({});

    const generateEmailTemplate = (content = '') => {
        return `
    <div style="
        width: 676px !important;
        max-width: 676px !important;
        min-width: 676px !important;
        margin: 0 auto !important;
        padding: 20px 0 !important;
        background: transparent !important;
    ">
        <!-- Main Container -->
        <div style="
            width: 100% !important;
            margin: auto !important;
            margin-top: 2rem !important;
            box-shadow: 0px 0px 20px -15px #000 !important;
            position: relative !important;
            background: white !important;
        ">
            <!-- Banner Section -->
            <div style="text-align: center !important;">
                <div style="
                    background: url('${environment.api}/images/banner.png') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    width: 100% !important;
                    height: 260px !important;
                "></div>
                
                <!-- Content Card -->
                <div style="margin-top: -190px !important;">
                    <div style="
                        width: 225px !important;
                        height: auto !important;
                        padding: 1.5rem !important;
                        text-align: center !important;
                        background: #fff !important;
                        margin: auto !important;
                        border-radius: 4px !important;
                        box-sizing: border-box !important;
                    ">
                        <img src="${environment.api}/images/logo.png" alt="Company Logo" style="width:115px !important; height:40px !important; object-fit:contain !important;">
                        
                        <h1 style="margin: 10px 0 0 !important; font-size: 18px !important; font-weight: normal !important;">
                            <span style="font-weight:400 !important; color:#373737 !important;">Hi </span> ${`{affiliateFullName}`},
                        </h1>
                        
                        <p style="margin: 10px 0 0 !important; font-size:14px !important; color:#373737 !important;">
                            You have an email message from ${user?.fullName}
                        </p>

                        <h2 style="margin: 10px 0 0 !important; font-size:14px !important; color:#373737 !important;">
                            ${form?.title || 'Your email title'}
                        </h2>
                        
                        <!-- Message Content -->
                        <div style="
                            margin: 15px 0 0 !important;
                            padding: 15px !important;
                            background: #f9f9f9 !important;
                            border-radius: 4px !important;
                            text-align: left !important;
                            font-size: 13px !important;
                            line-height: 1.5 !important;
                            color: #333 !important;
                        ">
                            ${content || 'Your message content goes here...'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Social Media Icons -->
        <div style="margin: 30px 0 20px !important; text-align: center !important;">
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api}/Image1.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api}/Image2.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api}/Image3.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api}/Image4.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
        </div>
        
        <!-- Footer -->
        <p style="color: #626262 !important; font-size: 11px !important; text-align: center !important; margin-bottom: 0 !important;">
            Copyright © ${new Date().getFullYear()} All Rights Reserved
        </p>
    </div>
    `;
    };

    useEffect(() => {
        const initialTemplate = generateEmailTemplate(form?.content);
        setEmailTemplate(initialTemplate);

        if (!form?.emailTemplate) {
            setForm(prev => ({
                ...prev,
                emailTemplate: initialTemplate
            }));
        }
    }, [form?.content, form?.title]);

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setForm(prev => ({
            ...prev,
            content: newContent,
            emailTemplate: generateEmailTemplate(newContent)
        }));

        // Clear content error when user starts typing
        if (errors.content) {
            setErrors(prev => ({ ...prev, content: '' }));
        }
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setForm(prev => ({ ...prev, title: newTitle }));

        // Clear title error when user starts typing
        if (errors.title) {
            setErrors(prev => ({ ...prev, title: '' }));
        }
    };

    const handleDateChange = (e) => {
        setForm(prev => ({ ...prev, acceptedDate: e.target.value }));

        // Clear date error when user selects a date
        if (errors.acceptedDate) {
            setErrors(prev => ({ ...prev, acceptedDate: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Check if title is required and empty
        if (!form?.title || form.title.trim() === '') {
            newErrors.title = 'Email title is required';
        }

        // Check if content is required and empty
        if (!form?.content || form.content.trim() === '') {
            newErrors.content = 'Email content is required';
        }

        // Check if date is required when before/after is selected
        if ((form?.timeInterval === 'before' || form?.timeInterval === 'after') && !form?.acceptedDate) {
            newErrors.acceptedDate = 'Date is required when selecting before/after';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitWithValidation = () => {
        if (validateForm()) {
            handleSubmit();
        }
    };

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
                                            autoComplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: e.target.checked, timeInterval: '', affiliateStatus: false, acceptedDate: '' })}
                                        />
                                        <label className='form-check-label' >All Joined {`(${relatedAffiliate?.totalJoined})`}</label>
                                    </div>
                                    <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.affiliateStatus}
                                            autoComplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: false, timeInterval: '', affiliateStatus: e.target.checked, acceptedDate: '' })}
                                        />
                                        <label className=' form-check-label' >Active Affiliates {`(${relatedAffiliate?.totalActive})`}</label>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-3 col-md-3'>
                                    <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.timeInterval === 'before'}
                                            autoComplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: false, timeInterval: 'before', affiliateStatus: false })}
                                        />
                                        <label className='form-check-label' >before</label>
                                    </div>
                                    <div className='form-check mb-3' >
                                        <input
                                            type="radio"
                                            className='form-check-input'
                                            placeholder="Enter Title"
                                            checked={form?.timeInterval === 'after'}
                                            autoComplete="off"
                                            onChange={(e) => setForm({ ...form, isAllJoined: false, timeInterval: 'after', affiliateStatus: false })}
                                        />
                                        <label className='form-check-label' >after</label>
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className=' mb-3' >
                                        <label className='form-label' >Joined Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.acceptedDate ? 'is-invalid' : ''}`}
                                            disabled={!form?.timeInterval}
                                            placeholder="Select date"
                                            value={moment(form?.acceptedDate).format('YYYY-MM-DD')}
                                            onChange={handleDateChange}
                                            max={moment().format('YYYY-MM-DD')}
                                        />
                                        {errors.acceptedDate && (
                                            <div className="invalid-feedback">
                                                {errors.acceptedDate}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label className='mb-2' >Subject <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            placeholder="Enter Title"
                                            value={form?.title ? form?.title : ''}
                                            autoComplete="off"
                                            onChange={handleTitleChange}
                                        />
                                        {errors.title && (
                                            <div className="invalid-feedback">
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label className='mb-2' >Sender Email</label>
                                        <input
                                            type="email"
                                            className={`form-control`}
                                            // placeholder="Enter Title"
                                            value={'jc@jcsoftwaresolution.in'}
                                            autoComplete="off"
                                            disabled
                                            // onChange={handleTitleChange}
                                        />
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <label className='mb-2' >Report Date</label>
                                        <input
                                            type="email"
                                            className={`form-control`}
                                            // placeholder="Enter Title"
                                            value={new Date()}
                                            autoComplete="off"
                                            disabled
                                            // onChange={handleTitleChange}
                                        />
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <div className='mb-3'>
                                        <label className='mb-2'>Email Content <span className="text-danger">*</span></label>
                                        <textarea
                                            className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                                            rows="5"
                                            placeholder="Enter your email content here"
                                            value={form?.content || ''}
                                            onChange={handleContentChange}
                                        />
                                        {errors.content && (
                                            <div className="invalid-feedback">
                                                {errors.content}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='col-md-12'>
                                    <div className='mb-3 custom-description'>
                                        <label className='mb-2'>Email Template Preview</label>
                                        <Editor
                                            apiKey='zua062bxyqw46jy8bhcu8tz9aw6q37sb1pln5kwrnhnr319g'
                                            value={emailTemplate}
                                            onEditorChange={(newValue) => {
                                                setEmailTemplate(newValue);
                                                setForm(prev => ({ ...prev, "emailTemplate": newValue }));
                                            }}
                                            init={{
                                                height: 500,
                                                menubar: false,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                                ],
                                                toolbar: 'undo redo | blocks | ' +
                                                    'bold italic forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='text-end mt-3'>
                                <button type="button" className="btn btn-primary" onClick={handleSubmitWithValidation}>Send E-mail</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;
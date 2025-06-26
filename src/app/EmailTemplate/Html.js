import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import './style.scss';
import crendentialModel from '@/models/credential.model';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import environment from '@/environment';
import { Editor } from '@tinymce/tinymce-react';
import EmailLogsModal from '../EmailTemplate/EmailModal'

const Html = ({ relatedAffiliate, form, setForm, handleSubmit }) => {
    const user = crendentialModel.getUser();
    const [emailTemplate, setEmailTemplate] = useState('');
    const [errors, setErrors] = useState({});
    const [editorRef, setEditorRef] = useState(null);
    const [showLogsModal, setShowLogsModal] = useState(false);

    const shortcodes = [
        { label: 'Brand Name', value: '{brandFullName}' },
        { label: 'Affiliate Link', value: '{affiliateLink}' },
        { label: 'Current Date', value: '{currentDate}' },
    ];

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
                           Subject :- ${form?.title || 'Your email subject'}
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
            setForm(prev => ({ ...prev, emailTemplate: initialTemplate }));
        }
    }, [form?.content, form?.title]);

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setForm(prev => ({
            ...prev,
            content: newContent,
            emailTemplate: generateEmailTemplate(newContent)
        }));
        if (errors.content) setErrors(prev => ({ ...prev, content: '' }));
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setForm(prev => ({ ...prev, title: newTitle }));
        if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
    };

    const handleDateChange = (e) => {
        setForm(prev => ({ ...prev, acceptedDate: e.target.value }));
        if (errors.acceptedDate) setErrors(prev => ({ ...prev, acceptedDate: '' }));
    };

    const handleRecipientChange = (type) => {
        setForm(prev => ({
            ...prev,
            isAllJoined: type === 'allJoined',
            affiliateStatus: type === 'activeAffiliates'
        }));
    };

    const handleTimeIntervalChange = (interval) => {
        setForm(prev => ({
            ...prev,
            timeInterval: interval,
            acceptedDate: interval ? prev.acceptedDate : ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form?.title) newErrors.title = 'Email title is required';
        if (!form?.content) newErrors.content = 'Email content is required';
        if (!form?.isAllJoined && !form?.affiliateStatus) {
            newErrors.recipientType = 'Please select a recipient type';
        }
        if (form?.timeInterval && !form?.acceptedDate) {
            newErrors.acceptedDate = 'Date is required when selecting before/after';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitWithValidation = (e) => {
        e.preventDefault();
        if (validateForm()) handleSubmit();
    };

    const insertShortcode = (shortcode) => {
        if (editorRef) {
            editorRef.insertContent(shortcode);
        } else {
            // Fallback for textarea
            const textarea = document.querySelector('textarea[name="content"]');
            if (textarea) {
                const startPos = textarea.selectionStart;
                const endPos = textarea.selectionEnd;
                const currentValue = textarea.value;

                textarea.value = currentValue.substring(0, startPos) +
                    shortcode +
                    currentValue.substring(endPos, currentValue.length);

                // Update form state
                setForm(prev => ({
                    ...prev,
                    content: textarea.value,
                    emailTemplate: generateEmailTemplate(textarea.value)
                }));

                // Set cursor position after inserted shortcode
                textarea.selectionStart = startPos + shortcode.length;
                textarea.selectionEnd = startPos + shortcode.length;
                textarea.focus();
            }
        }
    };

    return (
        <Layout name="Send E-mail">
            <div className='sidebar-left-content'>
                <div className="card">
                    <div className='card-header'>
                        <h3 className="link_default m-0">
                            <i className="fa fa-bullhorn link_icon" aria-hidden="true"></i> Send E-mail
                        </h3>
                        Count:{form?.affiliateStatus ? relatedAffiliate?.totalActive : relatedAffiliate?.totalJoined}

                        <button
                            type="button"
                            className="btn btn-outline-primary me-2"
                            onClick={() => setShowLogsModal(true)}
                        >
                            View Email Logs
                        </button>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handleSubmitWithValidation}>
                            <div className='row'>
                                {/* Recipient Type Selection */}
                                <div className='col-12 col-sm-6 col-md-4'>
                                    <div className='form-group'>
                                        <label className='form-label'>Recipient Type</label>
                                        <div className='form-check mb-3'>
                                            <input
                                                type="radio"
                                                className='form-check-input'
                                                checked={form?.isAllJoined}
                                                onChange={() => handleRecipientChange('allJoined')}
                                            />
                                            <label className='form-check-label'>
                                                All Joined ({relatedAffiliate?.totalJoined})
                                            </label>
                                        </div>
                                        <div className='form-check mb-3'>
                                            <input
                                                type="radio"
                                                className='form-check-input'
                                                checked={form?.affiliateStatus}
                                                onChange={() => handleRecipientChange('activeAffiliates')}
                                            />
                                            <label className='form-check-label'>
                                                Active Affiliates ({relatedAffiliate?.totalActive})
                                            </label>
                                        </div>
                                        {errors.recipientType && (
                                            <div className="text-danger small">{errors.recipientType}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Time Interval Selection */}
                                <div className='col-12 col-sm-6 col-md-4'>
                                    <div className='form-group'>
                                        <label className='form-label'>Time Interval (Optional)</label>
                                        <div className='form-check mb-3'>
                                            <input
                                                type="radio"
                                                className='form-check-input'
                                                checked={form?.timeInterval === 'before'}
                                                onChange={() => handleTimeIntervalChange('before')}
                                            />
                                            <label className='form-check-label'>Before</label>
                                        </div>
                                        <div className='form-check mb-3'>
                                            <input
                                                type="radio"
                                                className='form-check-input'
                                                checked={form?.timeInterval === 'after'}
                                                onChange={() => handleTimeIntervalChange('after')}
                                            />
                                            <label className='form-check-label'>After</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className='col-12 col-sm-6 col-md-4'>
                                    <div className='form-group mb-3'>
                                        <label className='form-label'>Joined Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.acceptedDate ? 'is-invalid' : ''}`}
                                            disabled={!form?.timeInterval}
                                            value={moment(form?.acceptedDate).format('YYYY-MM-DD')}
                                            onChange={handleDateChange}
                                            max={moment().format('YYYY-MM-DD')}
                                        />
                                        {errors.acceptedDate && (
                                            <div className="invalid-feedback">{errors.acceptedDate}</div>
                                        )}
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='form-group mb-3'>
                                        <label className='form-label'>Subject <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            value={form?.title || ''}
                                            onChange={handleTitleChange}
                                        />
                                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                    </div>
                                </div>

                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='form-group mb-3'>
                                        <label className='form-label'>Sent Date</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            value={new Date().toISOString().split('T')[0]}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <div className='form-group mb-3'>
                                        <label className='form-label'>Email Content <span className="text-danger">*</span></label>

                                        <textarea
                                            className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                                            rows="5"
                                            value={form?.content || ''}
                                            onChange={handleContentChange}
                                            name="content"
                                        />
                                        {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <div className='form-group mb-3'>
                                        <label className='form-label'>Email Template Preview</label>

                                        {/* Shortcode buttons for the editor */}
                                        <div className="mb-3">
                                            <label className="form-label">Insert Shortcodes:</label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {shortcodes.map((shortcode, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => insertShortcode(shortcode.value)}
                                                        title={shortcode.label}
                                                    >
                                                        {shortcode.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Editor
                                            apiKey='zua062bxyqw46jy8bhcu8tz9aw6q37sb1pln5kwrnhnr319g'
                                            value={emailTemplate}
                                            onEditorChange={(newValue) => {
                                                setEmailTemplate(newValue);
                                                setForm(prev => ({ ...prev, emailTemplate: newValue }));
                                            }}
                                            onInit={(evt, editor) => setEditorRef(editor)}
                                            init={{
                                                height: 500,
                                                menubar: false,
                                                plugins: ['lists', 'link', 'image', 'table', 'code'],
                                                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='text-end mt-3'>
                                <button type="submit" className="btn btn-primary">
                                    Send E-mail
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <EmailLogsModal
                show={showLogsModal}
                handleClose={() => setShowLogsModal(false)}
            />
        </Layout>
    );
};

export default Html;
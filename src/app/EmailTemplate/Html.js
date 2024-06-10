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

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ relatedAffiliate }) => {
    const user = crendentialModel.getUser()
    const history = useRouter()
    const [form, setForm] = useState({
        "title": "",
        "user_id": "",
        description: '',
    })

    const handleSubmit = () => {

        const payload = {
            "title": form?.title,
            "user_id": form?.user_id,
            description: form?.description
        }
        loader(true);
        ApiClient.post('emailmessage/send', payload).then((res) => {
            if (res?.success) {
                history.push('/invitedUsers')
                toast.success(res?.message)
                setForm({})
            }
            loader(false);
        });
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
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Title</div>
                                        <input
                                            type="text"
                                            className='form-control'
                                            placeholder="Enter Title"
                                            value={form?.title}
                                            autocomplete="off"
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='col-12 col-sm-6 col-md-6'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Select User</div>
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="fullName"
                                            placeholder="Select User"
                                            intialValue={form?.user_id}
                                            result={e => setForm({ ...form, user_id: e.value })}
                                            options={relatedAffiliate}
                                        />
                                    </div>
                                </div>
                                <div className='col-md-12 mb-3'>
                                    <div className='mb-3' >
                                        <div className='mb-2' >Description</div>
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

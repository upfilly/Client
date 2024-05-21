import React from "react";
import ApiClient from '@/methods/api/apiClient';
import Swal from "sweetalert2";
import loader from '@/methods/loader';
import Layout from "@/app/components/global/layout";
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../style.scss';
import dynamic from 'next/dynamic';

const Html = ({ submitted, form, handleSubmit, setform, back }) => {

    const defaultAffiliateFunction = () => {
        loader(true)
        ApiClient.get(`default/affiliate-group`).then(res => {
            if (!res.success) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You have already default group. This action will update your Default group....",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Yes'
                }).then((result) => {
                    if (result?.isConfirmed) {
                        setform({ ...form, isDefaultAffiliateGroup: true })
                    }
                    if (!result?.isConfirmed) {
                        setform({ ...form, isDefaultAffiliateGroup: false })
                    }
                })
            }
            loader(false)
        })
    }

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>

            <div className='view_page sidebar-left-content '>
                <div className='pprofile1 card card-shadow p-4'>

                    <form onSubmit={handleSubmit}>
                        <div className="main_title_head profile-card">

                            <h3 className=''> <a to="/users" onClick={e => back()}>  <i className="fa fa-arrow-left  mr-2" title='Back' aria-hidden="true"></i></a>{form && form?.id ? 'Edit' : 'Add'} Affiliate Group</h3>
                            <hr></hr>
                        </div>


                        <div className="">
                            <div className="form-row ">
                                <div className="col-md-6 mb-3">
                                    <label>Group Name<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form?.group_name}
                                        onChange={e => setform({ ...form, group_name: e.target.value })}
                                    />
                                    {submitted && !form?.group_name ? <div className="invalid-feedback d-block">Group name is Required</div> : <></>}
                                </div>
                                {/* <div className="col-md-6 mb-3">
                                    <label>Commision<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form?.commision}
                                        onChange={e => setform({ ...form, commision: e.target.value })}
                                    /> */}
                                    {/* <Editor apiKey='e9b46x5ebse3zswyqxc5gpl8b5zzduu2ziq9r75c2s91ytpe' textareaName='content' value={form?.commision ? form?.commision : ''} className='tuncketcls'
                                        onEditorChange={(newValue, editor) => {
                                            setform({ ...form, commision: newValue })
                                        }}

                                        init={{
                                            selector: 'textarea#autocompleter-cardmenuitem',
                                            height: 250,
                                        }}
                                    /> */}
                                    {/* {submitted && !form?.commision ? <div className="invalid-feedback d-block">Commision is Required</div> : <></>}
                                </div> */}
                                {/* <div className="col-md-6 mb-3 ml-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={form?.isDefaultAffiliateGroup} onChange={e => {
                                            setform({ ...form, isDefaultAffiliateGroup: !form.isDefaultAffiliateGroup })
                                            if (!form.isDefaultAffiliateGroup) {
                                                defaultAffiliateFunction()
                                            }
                                        }} />
                                        <label class="form-check-label" for="flexSwitchCheckChecked">Set Default Group</label>
                                    </div>
                                </div> */}
                                {/* <div className="col-md-6 mb-3 ml-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={form?.isPreRegisterLeads} onChange={e => {
                                            setform({ ...form, isPreRegisterLeads: !form.isPreRegisterLeads })
                                        }} />
                                        <label class="form-check-label" for="flexSwitchCheckChecked">Can Affiliate Group Pre-Register Leads?</label>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 ml-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={form?.isArchive} onChange={e => setform({ ...form, isArchive: !form.isArchive })} />
                                        <label class="form-check-label" for="flexSwitchCheckChecked">Archive</label>
                                    </div>
                                </div> */}
                            </div>
                            <div className="text-right edit-btns">
                                <button type="button" className="btn btn-secondary discard mr-2 back-btn" onClick={e => back()}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    </>
}

export default Html
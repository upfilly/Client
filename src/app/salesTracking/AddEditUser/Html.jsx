import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import '../style.scss';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import ImageUpload from "@/app/components/common/ImageUpload";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ id, BrandData, form, affiliateData, handleSubmit, setform, submitted, images, imageResult, getError, setEyes, eyes, back, emailCheck, emailErr, emailLoader }) => {

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Camapaign"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className=" pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head profile-card">

                                <h3 className='VieUser'>
                                    <a to="/campaign" onClick={e => back()}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                    {form && form.id ? 'Edit' : 'Add'} Untracked Sales</h3>
                                <hr></hr>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>Title<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.title}
                                        onChange={e => setform({ ...form, title: e.target.value })}
                                    />
                                    {submitted && !form?.title ? <div className="invalid-feedback d-block">Title is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Select Brand<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="brand_name"
                                            placeholder="Select Brand"
                                            intialValue={form?.brand_id}
                                            // disabled={(form?.status == "rejected" || !id) ? false : true}
                                            result={e => {
                                                setform({ ...form, brand_id: e.value })
                                            }}
                                            options={BrandData}
                                        />
                                    </div>
                                    {submitted && !form?.brand_id ? <div className="invalid-feedback d-block">Brand is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Amount<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.amount}
                                        onChange={e => setform({ ...form, amount: e.target.value })}
                                    />
                                    {submitted && !form?.amount ? <div className="invalid-feedback d-block">Amount is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Currency<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.currency}
                                        onChange={e => setform({ ...form, currency: e.target.value })}
                                    />
                                    {submitted && !form?.currency ? <div className="invalid-feedback d-block">Currency is Required</div> : <></>}
                                </div>
                                {/* <div className="col-md-6 mb-3">
                                    <label>Click Ref</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.click_ref}
                                        onChange={e => setform({ ...form, click_ref: e.target.value })}
                                    />
                                </div> */}
                                <div className="col-md-6 mb-3">
                                    <label>Commission<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.commission}
                                        onChange={e => setform({ ...form, commission: e.target.value })}
                                    />
                                    {submitted && !form?.commission ? <div className="invalid-feedback d-block">Commission is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Customer Reference<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.customer_reference}
                                        onChange={e => setform({ ...form, customer_reference: e.target.value })}
                                    />
                                    {submitted && !form?.customer_reference ? <div className="invalid-feedback d-block">Customer Reference is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Order Reference<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.order_reference}
                                        onChange={e => setform({ ...form, order_reference: e.target.value })}
                                    />
                                    {submitted && !form?.order_reference ? <div className="invalid-feedback d-block">Order Reference is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Order Date<span className="star">*</span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={form.order_date}
                                        onChange={e => setform({ ...form, order_date: e.target.value })}
                                    />
                                    {submitted && !form?.order_date ? <div className="invalid-feedback d-block">Order Date is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Type</label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.type}
                                            result={e => {
                                                setform({ ...form, type: e.value })
                                            }}
                                            options={[{
                                                name:'unTracked',id:'unTracked'
                                            },
                                            {
                                                name:'Incorrect',id:'Incorrect'
                                            },
                                            {
                                                name:'Declined',id:'Declined'
                                            }]}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>TimeZone</label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select TimeZone"
                                            intialValue={form?.timeZone}
                                            // disabled={(form?.status == "rejected" || !id) ? false : true}
                                            result={e => {
                                                setform({ ...form, timeZone: e.value })
                                            }}
                                            options={[{
                                                name:'Europe/Dublin',id:'Europe/Dublin'
                                            },
                                           ]}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Description</label>
                                    <DynamicReactQuill
                                        theme="snow"
                                        value={form?.description ? form?.description : ''}

                                        onChange={(newValue, editor) => {
                                            setform({ ...form, description: newValue })
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

                                <div className="col-md-6 mt-3">
                                    <label className='lablefontcls'>Image</label><br></br>
                                    <ImageUpload model="untrackSales" result={e => imageResult(e, 'image')} value={images} multiple={false} />
                                </div>

                            </div>


                            <div className="text-right edit-btns">

                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    </>
}

export default Html
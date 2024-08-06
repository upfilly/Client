import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import '../style.scss';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import ImageUpload from "@/app/components/common/ImageUpload";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ id, BrandData, category, form, affiliateData, handleSubmit, setform, submitted, images, imageResult, getError, setEyes, eyes, back, emailCheck, emailErr, emailLoader }) => {
    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Banner"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className=" pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head profile-card">

                                <h3 className='VieUser'>
                                    <a to="/campaign" onClick={e => back()}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                    {form && form.id ? 'Edit' : 'Add'} Banner</h3>
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
                                <div className='col-12 col-sm-12 col-md-6'>
                                    <div className='form-group'>
                                        <div className="select_drop ">
                                            <label>Select Access Type<span className='star'>*</span></label>
                                            <div className="select_row">
                                                <SelectDropdown
                                                    id="statusDropdown"
                                                    displayValue="name"
                                                    placeholder="Select type"
                                                    intialValue={form?.access_type}
                                                    result={e => { setform({ ...form, access_type: e.value }) }}
                                                    options={[{ name: "Private", id: "private" }, { name: "Public", id: "public" }]}
                                                />
                                            </div>
                                            {submitted && !form?.access_type ? <div className="invalid-feedback d-block">Type is Required</div> : <></>}

                                        </div>
                                    </div>
                                </div>
                                {form?.access_type == "private" && <div className='col-12 col-sm-12 col-md-6'>
                                    <div className='form-group'>
                                        <div className="select_drop ">
                                            <label>Select Affiliate<span className='star'>*</span></label>
                                            <div className="select_row">
                                                <SelectDropdown
                                                    id="statusDropdown"
                                                    displayValue="name"
                                                    placeholder="Select Affiliate"
                                                    intialValue={form?.affiliate_id}
                                                    result={e => setform({ ...form, affiliate_id: e.value })}
                                                    options={affiliateData}
                                                />
                                            </div>
                                            {submitted && !form?.affiliate_id ? <div className="invalid-feedback d-block">Affiliate is Required</div> : <></>}

                                        </div>
                                    </div>
                                </div>}
                                <div className="col-md-6 mb-3">
                                    <label>Destination Url<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.destination_url}
                                        onChange={e => setform({ ...form, destination_url: e.target.value })}
                                    />
                                    {submitted && !form?.destination_url ? <div className="invalid-feedback d-block">Destination url is Required</div> : <></>}
                                </div>

                                <div className='col-12 col-sm-12 col-md-6'>
                                    <div className='form-group'>
                                        <div className="select_drop ">
                                            <label>Category<span className='star'>*</span></label>
                                            <div className="select_row">
                                                <SelectDropdown
                                                    id="statusDropdown"
                                                    displayValue="name"
                                                    placeholder="Select category"
                                                    intialValue={form?.category_id}
                                                    result={e => setform({ ...form, category_id: e.value })}
                                                    options={category}
                                                />
                                            </div>
                                            {submitted && !form?.category_id ? <div className="invalid-feedback d-block">Category is Required</div> : <></>}

                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>SEO Attributes</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.seo_attributes}
                                        onChange={e => setform({ ...form, seo_attributes: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Activation Date<span className="star">*</span></label>
                                    <ReactDatePicker
                                        showIcon
                                        isClearable
                                        placeholderText="Select Activation Date"
                                        selected={form?.activation_date}
                                        className="form-control"
                                        onChange={(date) => setform({ ...form, activation_date: date })}
                                        timeInputLabel="Time:"
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        showTimeInput
                                    />
                                    {/* <input
                                        type="date"
                                        className="form-control"
                                        value={moment(form.activation_date).format('YYYY-MM-DD')}
                                        onChange={e => setform({ ...form, activation_date: e.target.value })}
                                    /> */}
                                    {submitted && !form?.activation_date ? <div className="invalid-feedback d-block">Activation Date Date is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Availability Date<span className="star">*</span></label>
                                    <ReactDatePicker
                                        showIcon
                                        isClearable
                                        placeholderText="Select Availability Date"
                                        selected={form?.availability_date}
                                        minDate={form?.activation_date}
                                        className="form-control"
                                        onChange={(date) => setform({ ...form, availability_date: date })}
                                        timeInputLabel="Time:"
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        showTimeInput
                                    />
                                    {/* <input
                                        type="date"
                                        className="form-control"
                                        value={moment(form.availability_date).format('YYYY-MM-DD')}
                                        onChange={e => setform({ ...form, availability_date: e.target.value })}
                                    /> */}
                                    {submitted && !form?.availability_date ? <div className="invalid-feedback d-block">Expiration Date Date is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Expiration Date<span className="star">*</span></label>
                                    <ReactDatePicker
                                        showIcon
                                        isClearable
                                        placeholderText="Select Expiration Date"
                                        selected={form?.expiration_date}
                                        minDate={form?.activation_date}
                                        className="form-control"
                                        onChange={(date) => setform({ ...form, expiration_date: date })}
                                        timeInputLabel="Time:"
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        showTimeInput
                                    />
                                    {/* <input
                                        type="date"
                                        className="form-control"
                                        value={moment(form.expiration_date).format('YYYY-MM-DD')}
                                        onChange={e => setform({ ...form, expiration_date: e.target.value })}
                                    /> */}
                                    {submitted && !form?.expiration_date ? <div className="invalid-feedback d-block">Expiration Date Date is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3 ">
                                    <label>Select : </label>
                                    <div className="select_check">
                                        {/* <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input mr-4"
                                                checked={form?.is_animation}
                                                onClick={(e) =>
                                                    setform({
                                                        ...form,
                                                        is_animation: !form?.is_animation,
                                                    })
                                                }
                                            />
                                            <label className="form-check-label" >
                                                Is Animation
                                            </label>
                                        </div> */}

                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input mr-4"
                                                checked={form?.is_deep_linking}
                                                onClick={(e) =>
                                                    setform({
                                                        ...form,
                                                        is_deep_linking: !form?.is_deep_linking,
                                                    })
                                                }
                                            />
                                            <label className="form-check-label" >
                                                Is Deep Linking
                                            </label>
                                        </div>

                                        <div className="form-check">

                                            <input
                                                type="checkbox"
                                                className="form-check-input mr-4"
                                                checked={form?.mobile_creative}
                                                onClick={(e) =>
                                                    setform({
                                                        ...form,
                                                        mobile_creative: !form?.mobile_creative,
                                                    })
                                                }
                                            />
                                            <label className="form-check-label" >
                                                Mobile Creative
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label>Description</label>
                                    {affiliateData && <DynamicReactQuill
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
                                    />}
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className='lablefontcls'>Image<span className="star">*</span></label><br></br>
                                    <ImageUpload model="untrackSales" result={e => imageResult(e, 'image')} value={images} multiple={false} />
                                    {submitted && !images ? <div className="invalid-feedback d-block">Image is Required</div> : <></>}
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
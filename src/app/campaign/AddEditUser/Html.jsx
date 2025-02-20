import React, { useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import '../style.scss';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import MultiSelectValue from "@/app/components/common/MultiSelectValue";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ id, form, affiliateData, handleSubmit, setform, submitted, back }) => {

    // const [loaderr, setLoader] = useState()
    // const [imgLoder, setImgLoder] = useState()
    // const [loadViderr, setVidLoader] = useState()
    // const [vidLoder, setvidLoder] = useState()
    const [loadDocerr, setDocLoader] = useState()
    const [docLoder, setDocLoder] = useState()

    const EventType = [
        { id: 'lead', name: 'Lead' },
        // { id: 'visitor', name: 'Visitor' },
        { id: 'purchase', name: 'Purchase' },
        // { id: 'line-item', name: 'Line-item' }
    ]

    const uploadDocument = async (e, key) => {
        // console.log('enter');
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        setDocLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            let url = 'upload/document'

            const res = await ApiClient.postFormData(url, { file: file })
            if (res.success) {
                let path = res?.data?.imagePath
                if (form?.documents?.length <= 9) {
                    form?.documents?.push({
                        name: `documents/${path}`,
                        url: `documents/${path}`
                    })
                }
            }
            i++
        }
        setDocLoader(false)
        setDocLoder(false)
        // setVdo(false)
    }

    const removeDocument = (index, key) => {
        const filterVid = form?.documents?.length > 0 && form.documents.filter((data, indx) => {
            return index != indx
        })
        setform({ ...form, documents: filterVid })
    }

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Campaign"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className="pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head profile-card">
                                <h3 className='VieUser'>
                                    <a to="/campaign" onClick={e => back()}>
                                        <i className="fa fa-arrow-left mr-2" title='Back' aria-hidden="true"></i>
                                    </a>
                                    {form && form.id ? 'Edit' : 'Add'} Campaign
                                </h3>
                                <hr />
                            </div>

                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>Name<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={e => setform({ ...form, name: e.target.value })}
                                    />
                                    {submitted && !form?.name && <div className="invalid-feedback d-block">Name is Required</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.access_type}
                                            disabled={form?.status === "rejected" || !id ? false : true}
                                            result={e => {
                                                setform({ ...form, access_type: e.value });
                                            }}
                                            options={[{ id: "public", name: "Public" }, { id: "private", name: "Private" }]}
                                        />
                                    </div>
                                    {submitted && !form?.access_type && <div className="invalid-feedback d-block">Access Type is Required</div>}
                                </div>

                                {form?.access_type === "private" && (
                                    <div className="col-md-6 mb-3">
                                        <label>Affiliate<span className="star">*</span></label>
                                        <div className="select_row">
                                            <MultiSelectValue
                                                id="statusDropdown"
                                                displayValue="fullName"
                                                placeholder="Select Affiliate"
                                                intialValue={form?.affiliate_id}
                                                result={e => {
                                                    setform({ ...form, affiliate_id: e.value });
                                                }}
                                                disabled={form?.status === "rejected" || !id ? false : true}
                                                options={affiliateData}
                                            />
                                        </div>
                                        {submitted && !form?.affiliate_id && <div className="invalid-feedback d-block">Affiliate is Required</div>}
                                    </div>
                                )}

                                <div className="col-md-6 mb-3">
                                    <label>Event Type:<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectValue
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
                                            intialValue={form?.event_type}
                                            disabled={!id}
                                            result={e => {
                                                setform({ ...form, event_type: e.value });
                                            }}
                                            options={EventType}
                                        />
                                    </div>
                                    {submitted && !form?.event_type && <div className="invalid-feedback d-block">Event type is Required</div>}
                                </div>

                                {/* New Dropdown for Percentage or Amount */}
                                <div className="col-md-6 mb-3">
                                    <label>Amount/Percentage Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="amountPercentageDropdown"
                                            displayValue="name"
                                            placeholder="Select Amount or Percentage"
                                            intialValue={form?.amountPercentage}
                                            result={e => {
                                                setform({ ...form, amountPercentage: e.value });
                                            }}
                                            options={[{ id: "percentage", name: "Percentage" }, { id: "amount", name: "Amount" }]}
                                        />
                                    </div>
                                    {submitted && !form?.amountPercentage && <div className="invalid-feedback d-block">Amount/Percentage Type is Required</div>}
                                </div>

                                {/* Conditionally Render the Input Field for Amount or Percentage */}
                                {form?.amountPercentage === "percentage" && (
                                    <div className="col-md-6 mb-3">
                                        <label>Percentage<span className="star">*</span></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form?.percentage || ''}
                                            onChange={e => setform({ ...form, percentage: e.target.value })}
                                            placeholder="Enter Percentage"
                                        />
                                        {submitted && !form?.percentage && <div className="invalid-feedback d-block">Percentage is Required</div>}
                                    </div>
                                )}

                                {form?.amountPercentage === "amount" && (
                                    <div className="col-md-6 mb-3">
                                        <label>Amount<span className="star">*</span></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form?.amount || ''}
                                            onChange={e => setform({ ...form, amount: e.target.value })}
                                            placeholder="Enter Amount"
                                        />
                                        {submitted && !form?.amount && <div className="invalid-feedback d-block">Amount is Required</div>}
                                    </div>
                                )}

                                <div className="col-md-12 mb-3">
                                    <label>Default Campaign</label>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={form?.isDefault || false}
                                            onChange={e => setform({ ...form, isDefault: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="defaultCampaign">
                                            Set this as the default campaign
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label>Description<span className="star">*</span></label>
                                    {true && <DynamicReactQuill
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
                                    {submitted && !form?.description && <div className="invalid-feedback d-block">Description is Required</div>}
                                </div>

                                <div className='col-md-6'>
                                    <label>Document(Max. Limit 10)</label>
                                    <div className="form-group drag_drop">
                                        <div className='upload_file'>
                                            {form?.documents?.length <= 9 && (
                                                <>
                                                    <button className="btn btn-primary upload_image">Upload Document</button>
                                                    <input
                                                        type="file"
                                                        className="form-control-file over_input"
                                                        accept=".doc,.docx,.xml,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        multiple={true}
                                                        onChange={(e) => {
                                                            setDocLoder(true)
                                                            uploadDocument(e, 'images');
                                                        }}
                                                    />
                                                </>
                                            )}
                                            {loadDocerr && docLoder && <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div>}
                                            <div className="imagesRow mt-4 img-wrappper">
                                                {form?.documents && form?.documents.map((itm, i) => {
                                                    return <div className="imagethumbWrapper cover" key={i}>
                                                        <img src="/assets/img/document.png" className="thumbnail" onClick={() => window.open(methodModel.noImg(itm?.url))} />
                                                        <i className="fa fa-times kliil" title="Remove" onClick={e => removeDocument(i)}></i>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
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
import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import '../style.scss';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import ImageUpload from "@/app/components/common/ImageUpload";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import MultiSelectDropdownData from "../../campaign/MultiSelectDropdownData"
import ApiClient from "@/methods/api/apiClient";

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ 
    form, 
    affiliateData,
    handleSubmit, 
    setform, 
    submitted, 
    images, 
    imageResult, 
    back,
    selectedItems,
    setSelectedItems }) => {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const getCategory = () => {
        let url = `categoryWithSub?page&count&search&cat_type=advertiser_categories&status=active`;
        ApiClient.get(url).then((res) => {
            if (res.success) {
                 const data = res.data.data
                    .map(data => data.parent_cat_name ? data : undefined)
                    .filter(item => item !== undefined);
                setCategories(data);
            }
        });
    };

    useEffect(()=>{
     getCategory()
    },[])

    function isValidUrl(url) {
        if (!url) return false;

        if (!/^https?:\/\//i.test(url)) {
            return false;
        }

        try {
            const urlObj = new URL(url);

            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return false;
            }

            if (!urlObj.hostname ||
                !/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(urlObj.hostname)) {
                return false;
            }

            if (urlObj.port && !/^\d+$/.test(urlObj.port)) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

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
                                                <SelectDropdown theme='search'
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
                                                <SelectDropdown theme='search'
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
                                <div className="col-md-12 mb-3">
                                    <label>
                                        Destination Url<span className="star">*</span>
                                    </label>
                                    <div className="input-group  border_description ">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.destination_url}
                                            onChange={e => {
                                                const url = e.target.value;
                                                setform({ ...form, destination_url: url });
                                            }}
                                            style={!isValidUrl(form.destination_url) && form.destination_url ? { borderColor: 'red' } : {}}
                                        />
                                        {/* {form?.affiliate_id && <span className="input-group-text  ">? fp_sid={form?.affiliate_id}</span>} */}
                                    </div>
                                    {submitted && !form?.destination_url && (
                                        <div className="invalid-feedback d-block">Destination url is Required</div>
                                    )}
                                    {!isValidUrl(form.destination_url) && form.destination_url && (
                                        <div className="text-danger">Please enter a valid URL (including http:// or https://)</div>
                                    )}
                                </div>


                                {/* <div className='col-12 col-sm-12 col-md-6'>
                                    <div className='form-group'>
                                        <div className="select_drop ">
                                            <label>Category<span className='star'>*</span></label>
                                            <div className="select_row">
                                                <SelectDropdown theme='search'
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
                                </div> */}

                                <div className="col-md-12 mb-3 category-dropdown" onClick={() => setIsOpen(false)}>
                                    <label>Select Category<span className="star">*</span></label>
                                    <div className="drops category-input">
                                        <MultiSelectDropdownData
                                            isOpen={isOpen}
                                            setIsOpen={setIsOpen}
                                            data={categories}
                                            selectedItems={selectedItems}
                                            setSelectedItems={setSelectedItems}
                                        />
                                    </div>
                                    {/* {submitted && selectedItems?.categories?.length === 0 && <div className="invalid-feedback d-block">{errors?.categories}</div>} */}
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

                                    {submitted && !form?.availability_date ? <div className="invalid-feedback d-block">Availability Date is Required</div> : <></>}
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

                                    {submitted && !form?.expiration_date ? <div className="invalid-feedback d-block">Expiration Date is Required</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3 ">
                                    <label>Select : </label>
                                    <div className="select_check">

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
                                <div className="col-md-12 mb-3 custom-description">
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
                                <button type="submit" disabled={!isValidUrl(form.destination_url)} className="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    </>
}

export default Html
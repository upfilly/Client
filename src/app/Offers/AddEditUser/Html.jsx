import React, { useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import MultiSelectDropdown from "@/app/components/common/MultiSelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import { Editor } from "@tinymce/tinymce-react";
import '../style.scss';
import { useRouter } from "next/navigation";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Html = ({form,startDate, endDate,setDateRange, handleSubmit, setform, submitted, back,category,setCategory,subCategory,setSubCategory}) => {
    const [loaderr, setLoader] = useState()
    const [imgLoder, setImgLoder] = useState()
   
    const history = useRouter()

    const uploadImage = async (e, key) => {
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        setLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            let url = 'upload/image?modelName=campaign'

            const res = await ApiClient.postFormData(url, { file: file })
            if (res.success) {
                let path = res?.data?.fullpath
                if (form?.image.length <= 9) {
                    form?.image?.push(`images/campaign/${path}`
                        // {
                        // name: `images/campaign/${path}`,
                        // url: `images/campaign/${path}`
                    // }
                    )
                }
            }
            i++
        }
        setLoader(false)
        setImgLoder(false)
    }

    const remove = (index, key) => {
        const filterImg = form?.image.length > 0 && form.image.filter((data, indx) => {
            return index != indx
        })
        setform({ ...form, image: filterImg })
    }

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Camapaign"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className=" pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head ">

                                <h3 className='VieUser mb-4'>
                                    <a to="/product" onClick={e => back()}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                    {form && form.id ? 'Edit' : 'Add'} Offer</h3>
                                
                            </div>

                            <div className="row ">
                            <div className="col-sm-12 col-md-8">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Title<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.name}
                                        onChange={e => setform({ ...form, name: e.target.value })}
                                    />
                                    {submitted && !form?.name ? <div className="invalid-feedback d-block">product name is Required</div> : <></>}
                                </div>
                                {/* <div className="col-md-6 mb-3">
                                    <label>Price ($)<span className="star">*</span></label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="0"
                                        name="amount"
                                        value={form?.price}
                                        onChange={(e) => {
                                            const enteredValue = e.target.value;
                                            const regex = /^[0-9]*$/;
                                            if (enteredValue === '' || regex.test(enteredValue)) {
                                                setform({ ...form, price: enteredValue });
                                            }
                                        }}
                                    />
                                    {submitted && !form?.price ? <div className="invalid-feedback d-block">Price is Required</div> : <></>}
                                </div> */}
                                {/* <div className="col-md-6 mb-3">
                                    <label>Quantity<span className="star">*</span></label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="0"
                                        name="quantity"
                                        value={form?.quantity}
                                        onChange={(e) => {
                                            const enteredValue = e.target.value;
                                            const regex = /^[0-9]*$/;
                                            if (enteredValue === '' || regex.test(enteredValue)) {
                                                setform({ ...form, quantity: enteredValue });
                                            }
                                        }}
                                    />
                                    {submitted && !form?.quantity ? <div className="invalid-feedback d-block">Quantity is Required</div> : <></>}
                                </div> */}
                                <div className="col-md-6 mb-3">
                                    <label>Date<span className="star">*</span></label>
                                    <DatePicker
                                           showIcon
                                        className="form-control"
                                        monthsShown={2}
                                        shouldCloseOnSelect={true}
                                        selectsRange={true}
                                        placeholderText="Select Date Range"
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setDateRange([update[0], update[1]])
                                        }}
                                        isClearable
                                        minDate={new Date()}
                                        withPortal
                                        dateFormat={"dd/MM/yyyy"}
                                    />
                                </div>
                             
                                <div className="select_drop col-md-6 mb-3">
                                    <label>Category<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select category"
                                            intialValue={form?.category_id}
                                            result={e => setform({ ...form, category_id: e.value })}
                                            options={category}
                                            required
                                        />
                                    </div>
                                    {submitted && !form?.category_id ? (
                                        <div className="invalid-feedback d-block">Category is Required</div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {form?.category_id &&  <div className="select_drop col-md-6 mb-3">
                                    <label>Sub Category<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Sub Category"
                                            intialValue={form?.sub_category_id}
                                            result={e => setform({ ...form, sub_category_id: e.value })}
                                            options={subCategory}
                                            required
                                        />
                                    </div>
                                    {/* {submitted && !form?.sub_category_id ? (
                                        <div className="invalid-feedback d-block">Sub Category is Required</div>
                                    ) : (
                                        <></>
                                    )} */}
                                </div>}
                                <div className="select_type select_drop col-md-6 mb-3">
                                    <label>Placement<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Placement"
                                            intialValue={form?.placement}
                                            result={e => setform({ ...form, placement: e.value })}
                                            options={[{ name: "Website", id: "website" },
                                            { name: "Email", id: "email" },
                                            { name: "Social", id: "social" },
                                            { name: "Mobile", id: "mobile" }]}
                                            required
                                        />
                                    </div>
                                    {submitted && form?.placement?.length <= 0 ? (
                                        <div className="invalid-feedback d-block">Placement is Required</div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="select_type select_drop col-md-6 mb-3">
                                    <label>Opportunity Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Opportunity"
                                            intialValue={form?.opportunity_type}
                                            result={e => setform({ ...form, opportunity_type: e.value })}
                                            options={[{ name: "Single Placement", id: "single_placement" },
                                            { name: "Package", id: "package" },
                                            { name: "Social", id: "social" },
                                            ]}
                                            required
                                        />
                                    </div>
                                    {submitted && !form?.opportunity_type?.length <= 0 ? (
                                        <div className="invalid-feedback d-block">Opportunity Type is Required</div>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                                <div className="select_drop col-md-12 mb-3">
                                    <label>Payment Model<span className="star">*</span></label>
                                    <div className="select_row selectmultiple">
                                        <MultiSelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select category"
                                            intialValue={form?.payment_model}
                                            result={e => setform({ ...form, payment_model: e.value })}
                                            options={[{ name: "Revenue Share", id: "Rev_share" },
                                            { name: "Flat Fee", id: "Flat_fee" },
                                            { name: "CPA +", id: "CPA +" },
                                            { name: "CPC", id: "CPC" }]}
                                            required
                                        />
                                    </div>
                                    {submitted && !form?.category_id ? (
                                        <div className="invalid-feedback d-block">Category is Required</div>
                                    ) : (
                                        <></>
                                    )}
                                </div>


                                <div className="col-md-12 mb-3">
                                    <label>Description<span className="star">*</span></label>
                                    <Editor apiKey='e9b46x5ebse3zswyqxc5gpl8b5zzduu2ziq9r75c2s91ytpe' textareaName='content' value={form?.description ? form?.description : ''} className='tuncketcls'
                                        onEditorChange={(newValue, editor) => {
                                            setform({ ...form, description: newValue })
                                        }}

                                        init={{
                                            selector: 'textarea#autocompleter-cardmenuitem',
                                            height: 250,
                                        }}
                                    />
                                    {submitted && !form?.description ? <div className="invalid-feedback d-block">Description is Required</div> : <></>}
                                </div>
                              
                            </div>
                            </div>
                            <div className="col-sm-12 col-md-4">
                            <div className='imagesshowing'>
                                    <label>Images (Max. Limit 10) </label>
                                    <div className="form-group drag_drop">
                                        <div className='upload_file'>
                                            {form?.image.length <= 9 && <><button className="uploaddataimg upload_image "><i className="fa fa-upload"></i>  Upload Image</button>
                                                <input type="file" className="form-control-file w-100 over_input pointer" accept="image/*" multiple={true}
                                                    // disabled={loader}
                                                    onChange={(e) => {
                                                        setImgLoder(true)
                                                        uploadImage(e, 'image');
                                                    }} /></>}
                                            {loaderr && imgLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                            <div className="imagesRow mt-4 img-wrappper">
                                                {form?.image && form?.image.map((itm, i) => {
                                                    return <div className="imagethumbWrapper" key={i}>
                                                        <img src={methodModel.noImg(itm)} className="thumbnail" />
                                                        <i className="fa fa-times kliil" title="Remove" onClick={e => remove(i)}></i>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             </div>

                            <div className="text-right edit-btns">
                                <a className="btn btn-secondary mr-2" onClick={() => history.push('/product')}>Back</a>
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
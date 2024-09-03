import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import '../style.scss';
import MultiSelectDropdown from "@/app/components/common/MultiSelectDropdown";
import MultiSelectValue from "@/app/components/common/MultiSelectValue";

const Html = ({ category, relatedAffiliate, form, handleSubmit, setform, submitted, back }) => {

    const handleRemove = (valueToRemove) => {
        const updatedValues = form?.applicable?.filter((value) => value !== valueToRemove);
        setform({ ...form, applicable: updatedValues });
    };

    const filtered = category?.filter(item => form?.applicable?.includes(item?.id));

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Coupons"} filters={undefined}>
            <form onSubmit={handleSubmit}>
                <div className="sidebar-left-content">
                    <div className=" pprofile1 card card-shadow p-4">
                        <div className="">
                            <div className="main_title_head profile-card">

                                <h3 className='VieUser'>
                                    <a to="/campaign" onClick={e => back()}>  <i className="fa fa-arrow-left mr-2 " title='Back' aria-hidden="true"></i></a>
                                    {form && form.id ? 'Edit' : 'Add'} Coupon</h3>
                                <hr></hr>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>Coupon Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.couponCode}
                                        onChange={e => setform({ ...form, couponCode: e.target.value })}
                                    />
                                    {/* {submitted && !form?.couponCode ? <div className="invalid-feedback d-block">Coupon Code is Required</div> : <></>} */}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Coupon Type</label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Coupon Type"
                                            intialValue={form?.visibility}
                                            result={e => {
                                                setform({ ...form, visibility: e.value })
                                            }}
                                            options={[{
                                                id: 'Public', name: 'Public'
                                            },
                                            {
                                                id: 'Exclusive to specific affiliate', name: 'Private'
                                            },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Commission Type</label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Commission Type"
                                            intialValue={form?.commissionType}
                                            // disabled={(form?.status == "rejected" || !id) ? false : true}
                                            result={e => {
                                                setform({ ...form, commissionType: e.value })
                                            }}
                                            options={[{
                                                name: 'Fixed amount', id: 'Fixed amount'
                                            },
                                            {
                                                name: 'Percentage', id: 'Percentage Commission'
                                            },
                                            ]}
                                        />
                                        {!form?.commissionType && submitted && <p className="invalid-feedback d-block">Commission Type is required</p>}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Coupon Commission</label>
                                    <SelectDropdown
                                        id="statusDropdown"
                                        displayValue="name"
                                        placeholder="Select Commission Type"
                                        intialValue={form?.couponCommission}
                                        m
                                        result={e => {
                                            setform({ ...form, couponCommission: e.value })
                                        }}
                                        options={[{
                                            name: 'Fixed amount', id: 'Fixed amount'
                                        },
                                        {
                                            name: 'Percentage', id: 'Percentage Commission'
                                        },
                                        ]}
                                    />
                                    {/* {submitted && !form?.couponCommission ? <div className="invalid-feedback d-block">Coupon Commission is Required</div> : <></>} */}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Coupon Type <span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Coupon Type"
                                            intialValue={form?.couponType}
                                            result={e => {
                                                setform({ ...form, couponType: e.value })
                                            }}
                                            options={[{
                                                id: 'percentage-based', name: 'Percentage-based'
                                            },
                                            {
                                                id: 'fixed', name: 'Fixed'
                                            },
                                            {
                                                id: 'bogo', name: 'BOGO'
                                            },
                                            {
                                                id: 'minimum purchase', name: 'Minimum Purchase'
                                            },
                                            {
                                                id: 'New Customer', name: 'new customer'
                                            },
                                            {
                                                id: 'other', name: 'Other'
                                            }]}
                                        />
                                        {submitted && !form?.couponType ? <div className="invalid-feedback d-block">Coupon Type is Required</div> : <></>}

                                    </div>
                                </div>
                                {form?.visibility == 'Exclusive to specific affiliate' && <div className="col-md-6 mb-3">
                                    <label>Media<span className="star">*</span></label>
                                    <div className="select_row media_row">
                                        <MultiSelectValue
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Media"
                                            intialValue={form?.media}
                                            result={e => {
                                                setform({ ...form, media: e })
                                            }}
                                            isSingle={false}
                                            options={relatedAffiliate}
                                        />
                                    </div>
                                    {submitted && !form?.media ? <div className="invalid-feedback d-block">Brand is Required</div> : <></>}
                                </div>}
                                {/* <div className="col-md-6 mb-3">
                                    <label>Applicable<span className="star">*</span></label>
                                    <div className="select_row">
                                        <MultiSelectDropdown
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Applicable"
                                            intialValue={form?.applicable}
                                            result={e => {
                                                setform({ ...form, applicable: e.value })
                                            }}
                                            options={category}
                                        />
                                        {filtered?.length > 0 && <div className="selected_offrs_market">
                                            {filtered?.map((value, index) => (
                                                <div className="d-flex gap-3 align-items-center btn btn-primary">
                                                    <p className="mb-0 valus" key={index}>
                                                        {value?.name}
                                                    </p>
                                                    <i className="fa fa-times close_bx" onClick={() => handleRemove(value?.id)}></i>
                                                </div>

                                            ))}
                                        </div>}
                                    </div>
                                    {submitted && !form?.applicable ? <div className="invalid-feedback d-block">Applicable is Required</div> : <></>}
                                </div> */}
  
                                <div className="col-md-6 mb-3">
                                    <label>Start Date<span className="star">*</span></label>
                                    <div className="position-relative">
                                    <i class="fa fa-calendar-o calender_position" aria-hidden="true"></i>

                                    <input
                                        type="date"
                                        className="width_full"
                                        value={form.startDate}
                                        onChange={e => setform({ ...form, startDate: e.target.value })}
                                        
                                    />
                                    {submitted && !form?.startDate ? <div className="invalid-feedback d-block">Start Date is Required</div> : <></>}
                                    </div>
                                   
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Expired Date<span className="star">*</span></label>
                                    <div className="position-relative">
                                    <i class="fa fa-calendar-o calender_position" aria-hidden="true"></i>
                                    <input
                                        type="date"
                                        className="width_full"
                                        min={form.startDate}
                                        value={form.expirationDate}
                                        onChange={e => setform({ ...form, expirationDate: e.target.value })}
                                    />
                                     </div>
                                    {submitted && !form?.expirationDate ? <div className="invalid-feedback d-block">Expiration Date is Required</div> : <></>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Site URL<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.url}
                                        onChange={e => setform({ ...form, url: e.target.value })}
                                    />
                                    {submitted && !form?.url ? <div className="invalid-feedback d-block">Site URL is Required</div> : <></>}
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
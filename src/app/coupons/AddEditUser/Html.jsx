import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import '../style.scss';
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
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Type</label>
                                    <div className="select_row">
                                        <SelectDropdown theme='search'
                                            id="statusDropdown"
                                            displayValue="name"
                                            placeholder="Select Type"
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
                                    <label>Commission Type<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown theme='search'
                                            id="commissionTypeDropdown"
                                            displayValue="name"
                                            placeholder="Select Commission Type"
                                            intialValue={form?.couponType}
                                            result={e => {
                                                setform({
                                                    ...form,
                                                    couponType: e.value,
                                                    // Reset coupon commission fields when changing type
                                                    // commissionType: e.value === 'Campaign' ? null : form.commissionType,
                                                    // couponCommissionValue: e.value === 'Campaign' ? null : form.couponCommissionValue
                                                })
                                            }}
                                            options={[{
                                                name: 'Campaign', id: 'Campaign'
                                            },
                                            {
                                                name: 'Custom', id: 'Custom'
                                            }]}
                                        />
                                        {!form?.couponType && submitted && <p className="invalid-feedback d-block">Commission Type is required</p>}
                                    </div>
                                </div>

                                {form?.couponType === 'Custom' && (
                                    <>
                                        <div className="col-md-6 mb-3">
                                            <label>Custom Commission Type<span className="star">*</span></label>
                                            <SelectDropdown theme='search'
                                                id="couponCommissionTypeDropdown"
                                                displayValue="name"
                                                placeholder="Select Commission Type"
                                                intialValue={form?.commissionType}
                                                result={e => {
                                                    setform({
                                                        ...form,
                                                        commissionType: e.value,
                                                        // Reset value when changing type
                                                        // couponCommissionValue: ''
                                                    })
                                                }}
                                                // Percentage Commission, Fixed amount
                                                options={[{
                                                    name: 'Fixed amount', id: 'Fixed amount'
                                                },
                                                {
                                                    name: 'Percentage', id: 'Percentage Commission'
                                                }]}
                                            />
                                            {submitted && !form?.commissionType && (
                                                <div className="invalid-feedback d-block">Commission Type is Required</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label>Commission Value<span className="star">*</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder={form?.commissionType === 'Percentage' ? 'Enter percentage' : 'Enter amount'}
                                                value={form.couponAmount || ''}
                                                onChange={e => setform({ ...form, couponAmount: e.target.value })}
                                            />
                                            {submitted && !form?.couponAmount && (
                                                <div className="invalid-feedback d-block">
                                                    {form?.commissionType === 'Percentage'
                                                        ? 'Percentage is required'
                                                        : 'Amount is required'}
                                                </div>
                                            )}
                                            {form?.commissionType === 'Percentage' && form?.couponCommissionValue > 100 && (
                                                <div className="invalid-feedback d-block">Percentage cannot exceed 100%</div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* <div className="col-md-6 mb-3">
                                    <label>Coupon Type <span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown theme='search'
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
                                </div> */}

                                {form?.visibility == 'Exclusive to specific affiliate' && <div className="col-md-6 mb-3">
                                    <label>Affiliates<span className="star">*</span></label>
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

                                <div className="col-md-6 mb-3 main_input">
                                    <label>Start Date<span className="star">*</span></label>
                                    <div className="position-relative">
                                        <input
                                            type="date"
                                            className="width_full"
                                            value={form.startDate}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={e => setform({ ...form, startDate: e.target.value })}
                                        />
                                        {submitted && !form?.startDate ? <div className="invalid-feedback d-block">Start Date is Required</div> : <></>}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 main_input">
                                    <label>Expired Date<span className="star">*</span></label>
                                    <div className="position-relative">
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
import React, { useState } from "react";
import 'react-phone-input-2/lib/style.css';
import ImageUpload from "@/app/components/common/ImageUpload";
import SelectDropdown from "../../components/common/SelectDropdown"
import Layout from '../../components/global/layout';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ affiliateGroup, id, role, form, handleSubmit, setform, submitted, images, imageResult,
    getError, setEyes, eyes, back, }) => {

    return <>
        <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Affiliate Team" filters={''} >
            <form onSubmit={handleSubmit}>

                <div className="pprofile1 mt-3">
                    <div className="d-flex align-items-center add_memeber_bx">
                        <a to="/users" onClick={e => back()}>  <i className="fa fa-arrow-left left_arrows" title='Back' aria-hidden="true"></i></a>
                        <h3 className='Profilehedding add_title'>{form && form?.id ? 'Edit' : 'Add'} {role ? rolesModel.name(role) : 'User'}</h3>
                    </div>

                    <div className="  add_team_bx ">
                        <div className="form-row ">
                            <div className="col-md-6 mb-3">
                                <label>First Name<span className="star">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form?.firstName}
                                    onChange={e => setform({ ...form, firstName: e.target.value })}

                                />
                                {submitted && !form?.firstName ? <div className="invalid-feedback d-block">FirstName is Required</div> : <></>}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Last Name<span className="star">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form?.lastName}
                                    onChange={e => setform({ ...form, lastName: e.target.value })}

                                />
                                {submitted && !form?.lastName ? <div className="invalid-feedback d-block">LastName is Required</div> : <></>}
                            </div>

                            {/* {role ? <></> : <div className="col-md-6 mb-3">
                        <label>Role<span className="star">*</span></label>
                        <div className="select_row">
                            <SelectDropdown
                                id="statusDropdown"
                                displayValue="name"
                                placeholder="Select Role"
                                intialValue={form?.role}
                                disabled={form?.id ? true : false}
                                result={e => { setform({ ...form, role: e.value }) }}
                                options={rolesModel.list}
                            />
                        </div>
                        {submitted && !form?.role ? <div className="invalid-feedback d-block">Role is Required</div> : <></>}
                    </div>} */}

                            <div className="col-md-12 mb-3">
                                <label>Description<span className="star">*</span></label>
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

                            <div className="dd">

                            </div>

                            {
                                <div className="select_drop col-md-6 mb-3">
                                    <label>Affiliate Group</label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="group_name"
                                            placeholder="Select Group"
                                            intialValue={form?.affiliate_group}
                                            result={e => setform({ ...form, affiliate_group: e.value })}
                                            options={affiliateGroup}

                                        />
                                    </div>
                                </div>}
                        </div>
                    </div>

                    <div className="add_team_bx">
                        <div className=" form-row">
                            {!id && <> <div className="col-md-6 mb-3">
                                <label>Password<span className="star">*</span></label>
                                <div className="inputWrapper quick-ic">
                                    <input
                                        type={eyes?.password ? 'text' : 'password'}
                                        className="form-control"
                                        value={form?.password}
                                        onChange={e => setform({ ...form, password: e.target.value })}

                                    />
                                    <i className={eyes?.password ? 'fa fa-eye fa-set' : 'fa fa-eye-slash fa-set'} onClick={() => setEyes({ ...eyes, password: !eyes?.password })}></i>
                                </div>
                                {submitted && getError('password').invalid ? <div className="invalid-feedback d-block">Password minimum length should be 8</div> : <></>}
                                {submitted && !form?.password ? <div className="invalid-feedback d-block">Password is Required</div> : <></>}
                            </div>
                                <div className="col-md-6 mb-3">
                                    <label>Confirm Password {form?.password ? <span className="star">*</span> : <></>}</label>
                                    <div className="inputWrapper quick-ic">
                                        <input
                                            type={eyes?.confirmPassword ? 'text' : 'password'}
                                            className="form-control"
                                            value={form?.confirmPassword}
                                            onChange={e => setform({ ...form, confirmPassword: e.target.value })}
                                            required={form?.password ? true : false}
                                        />
                                        <i className={eyes?.confirmPassword ? 'fa fa-eye fa-set' : 'fa fa-eye-slash fa-set'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
                                    </div>
                                    {submitted && getError('confirmPassword').invalid ? <div className="invalid-feedback d-block">Comfirm Password is not matched with Password</div> : <></>}
                                    {submitted && !form?.confirmPassword ? <div className="invalid-feedback d-block">ConfirmPassword is Required</div> : <></>}
                                </div></>
                            }

                            <div className="col-md-6 mt-3">
                                <label className='lablefontcls'>Image</label><br></br>
                                <ImageUpload model="users" result={e => imageResult(e, 'image')} value={images} multiple={false} />
                            </div>

                        </div>
                    </div>

                    <div className="set-buttons d-flex align-items-center justify-content-end mt-3">
                        <button type="button" className="btn btn-secondary  discard back-link mr-2" onClick={e => back()}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </div>

            </form>
        </Layout>
    </>
}

export default Html

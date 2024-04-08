import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ImageUpload from "@/app/components/common/ImageUpload";
import SelectDropdown from "../../components/common/SelectDropdown"
import Layout from '../../components/global/layout';
import methodModel from "@/methods/methods";
import PlacesAutocomplete from "react-places-autocomplete";
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ affiliateGroup, id, role, setForm, handleSelect, address, category, states, cities, setChangeSubCategory, changeSubCategory, form, handleSubmit, setform, submitted, images, imageResult, handleChange, location,
    getError, handleFeatureCheckbox, selectedItems, setSelectedItems, setEyes, eyes, back, emailCheck, emailErr, emailLoader, setPermissions, permissions  }) => {

console.log(form?.mobileNo,"9999999999911111111--------")

        const data = [
            "youtube",
            "twitter",
            "instagram",
            "linkedin"
        ]
        const pattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
    
        const addTag = () => {
            if (changeSubCategory) {
                setForm({
                    ...form,
                    tags: [...form.tags, changeSubCategory],
                });
                setChangeSubCategory('');
            }
        };
    
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
            }
        };
    
        const cancele = (item, type) => {
            const data1 = form?.[type]?.filter(data => data != item)
            setform({
                ...form,
                [type]: data1
            })
            return data1
        }

    return <>
    <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Affiliate Team" filters={''} >
    <form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center">
                <a to="/users" onClick={e => back()}>  <i className="fa fa-arrow-left  " title='Back' aria-hidden="true"></i></a>
                <h3 className='Profilehedding'>{form && form?.id ? 'Edit' : 'Add'} {role ? rolesModel.name(role) : 'Team Member'}</h3>
            </div>

            <div className="pprofile1 mt-3">

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
                    {
                        <div className="select_drop col-md-6 mb-3">
                            <label>Category</label>
                            <div className="select_row">
                                <SelectDropdown
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="Select category"
                                    intialValue={form?.category_id}
                                    result={e => setform({ ...form, category_id: e.value })}
                                    options={category} 
                                />
{submitted && !form?.category_id ? <div className="invalid-feedback d-block">Category is Required</div> : <></>}
                            </div>
                        </div>}

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

                    {

                        <div className=" col-md-6 mb-3">
                            <label> Tags</label>
                            <div className="d-flex flex-row">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={changeSubCategory}
                                    placeholder="Enter..."
                                    onChange={e => setChangeSubCategory(e.target.value)}
                                    onKeyDown={handleKeyDown}

                                />
                                <a
                                    className="p_plus btn btn-primary ml-2 mb-0"
                                    onClick={addTag}
                                ><i className="fa fa-plus"></i></a>
                            </div>
                            {form?.tags?.map((item, i) => {
                                console.log({ item });
                                return (
                                    <button type="button" class="btn btn-primary position-relative mr-3 btn_min" key={i}>
                                        {item}
                                        <span class="position-absolute top-0 start-100 translate-middle bg-danger border border-light rounded-circle span_close">
                                            <span style={{ width: '5px', height: '5px' }} onClick={() => cancele(item, 'tags')}>x</span>
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    }

                    {<> <div className="col-md-6 mb-3">
                        <label>Location</label>

                        <div>
                            <PlacesAutocomplete
                                value={address}
                                onChange={handleChange}
                                onSelect={handleSelect}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input className="form-control"

                                            {...getInputProps({
                                                placeholder: 'Enter an address...',
                                                // value:addressData
                                            })}
                                        />
                                        <div>
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map((suggestion) => {
                                                const style = {
                                                    backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                                                };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            style,
                                                        })}
                                                    >
                                                 <i class="fa-solid fa-location-dot mr-1"></i>{suggestion.description}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                        </div>


                    </div>

                        <div className='col-md-6'>
                            <div class="form-group">
                                <label className='label-set'>Country  </label>
                                <input type="text" value={form?.country} className="form-control quick-radius" id="exampleFormControlInput1" disabled />
                            </div>
                        </div><div className='col-md-3'>
                            <div class="form-group">
                                <label className='label-set'>City  </label>
                                <input type="text" value={form?.city} className="form-control quick-radius" id="exampleFormControlInput1" disabled />
                            </div>
                        </div><div className='col-md-3'>
                            <div class="form-group">
                                <label className='label-set' >Postal Code <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                                <input type="text" value={form?.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="form-control quick-radius" id="exampleFormControlInput1" />
                            </div>
                        </div></>
                    }

                    <div className="col-md-6 mb-3">
                        <label>Gender<span className="star">*</span></label>
                        <div className="select_row">
                            <SelectDropdown
                                id="statusDropdown"
                                displayValue="name"
                                placeholder="Select Gender"
                                intialValue={form?.gender}
                                result={e => { setform({ ...form, gender: e.value }) }}
                                options={[
                                    { id: 'male', name: 'Male' },
                                    { id: 'female', name: 'Female' },
                                    { id: 'others', name: 'Rather Not Say' },
                                ]}
                            />
                        </div>
                        {submitted && !form?.gender ? <div className="invalid-feedback d-block">Gender is Required</div> : <></>}
                    </div>

                    {/* <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Title<span className="star">*</span>  </label>
                        <input type="text" placeholder='Title' className="form-control " id="exampleFormControlInput1" name="title"
                          value={formData.title}
                          onChange={handleInputChange} />
                        {submitted && !formData?.title ? <div className="invalid-feedback d-block">Title is Required</div> : <></>}
                      </div>
                    </div> */}
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Mobile Number</label>
                        <div className="phoneInput main-no">
                          <div className='dailCode phn-code'>
                            <PhoneInput
                              international
                              country="US"
                              inputProps={{
                                disabled: true
                              }}
                              value={form?.dialCode}
                              className="input_number bg_none disable_white"
                              onChange={phone => setform({ ...form, dialCode: phone })}                             
                              readOnly={true}
                              placeholder="+1"
                              enableSearch
                            />
                          </div>
                          <input type="number" className="form-control overlap_mobile" id="exampleFormControlInput1" name="mobileNo"
                            value={form.mobileNo} autoComplete="off"
                            onChange={e => setform({ ...form, mobileNo: e.target.value })}
                            />
                        </div>

                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Email <span className="star">*</span> {emailLoader ? <span><i className="fa fa-spinner fa-spin"></i></span> : <></>}</label>
                        <input
                            type="email"
                            className="form-control"
                            value={form?.email}
                            disabled={form?.id ? true : false}
                            onChange={e => { setform({ ...form, email: e.target.value }); emailCheck(e.target.value) }}
                        />
                        {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
                        {submitted && !form?.email ? <div className="invalid-feedback d-block">Email is Required</div> : <></>}
                    </div>
                    {<div className="col-md-6 mb-3">
                        <label>Website</label>
                        <input
                            type="text"
                            className="form-control"
                            value={form?.website}
                            onChange={e => setform({ ...form, website: e.target.value })}
                            pattern={pattern}
                            title="http://www.example.com"
                        />
                    </div>}
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

                   

                    {<div className="col-md-12 mb-3">
                        <label>Select Social media platforms :</label>
                        <div className="row">

                            {data?.map((item) => (
                                <div key={item?.id} className="col-md-3">
                                    <div className="card p-3 border">
                                        <input
                                            className="form-check-input ml-0"
                                            type="checkbox"
                                            id={item}
                                            onChange={() => handleFeatureCheckbox(item)}
                                            checked={selectedItems?.includes(item)}
                                        />
                                        <label className="form-check-label ml-3 pl-1" for={item}>
                                            {methodModel?.capitalizeFirstLetter(item)}
                                        </label>
                                        {selectedItems?.includes(item) && (
                                            <div className="row">
                                                <div className="col-md-12 mb-3 mt-4">
                                                    <label>User name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={form[`${item}_username`]}
                                                        onChange={(e) => {
                                                            setForm((prevForm) => ({
                                                                ...prevForm,
                                                                [`${item}_username`]: e.target.value,
                                                            }));
                                                        }}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-12 mb-3">
                                                    <label>{`${methodModel?.capitalizeFirstLetter(item)} link`}</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={form[`${item}_profile_link`]}
                                                        onChange={(e) => {
                                                            setForm((prevForm) => ({
                                                                ...prevForm,
                                                                [`${item}_profile_link`]: e.target.value,
                                                            }));
                                                        }}
                                                        title="http://www.example.com"
                                                        pattern={pattern}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div></div>}

                    <div className="col-md-6 mt-3">
                        <label className='lablefontcls'>Image</label><br></br>
                        <ImageUpload model="users" result={e => imageResult(e, 'image')} value={images} multiple={false} />
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

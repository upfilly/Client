import React, { useEffect, useState } from 'react';
import methodModel from '@/methods/methods';
import './style.scss';
import Link from 'next/link';
import PhoneInput from 'react-phone-input-2'
import PlacesAutocomplete from "react-places-autocomplete";
import 'react-phone-input-2/lib/style.css';
import SelectDropdown from '../../common/SelectDropdown';
import 'react-datepicker/dist/react-datepicker.css';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ user,
  picLoader,
  selectedItems,
  handleFeatureCheckbox,
  handleSubmit,
  setChangeSubCategory,
  handleChange,
  handleSelect,
  address,
  changeSubCategory,
  formData,
  setFormData,
  form,
  getError,
  uploadImage,
  submitted,
  category,
  setForm,
  handleCategoryChange,
  handleSubcategoryChange,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  handleSubsubcategoryChange }) => {
  const [inputFocused, setInputFocused] = useState(false)
  const categoryTypes = [
    { id: 'promotional_models', name: 'Promotional Models' },
    { id: 'property_types', name: 'Property Types' },
    { id: 'advertiser_categories', name: 'Advertiser Categories' },
  ]
  const data = ["youtube", "twitter", "instagram", "linkedin"]

  const pattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'routing_number' && value.length > 9) {
      return;
    }

    if (name === 'account_number' && value.length > 12) {
      return;
    }

    if (name === 'ssn_number' && value.length > 9) {
      return;
    }

    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  }

  const cancele = (item, type) => {
    const data1 = form?.[type]?.filter(data => data != item)
    setForm({
      ...form,
      [type]: data1
    })
    return data1
  }

  return (
    <>

      <div className='padding60'>
        <div className='container'>
          <form
            name="profileForm"
            className="w-100"
            onSubmit={handleSubmit}
          >

            <div className='card mb-3'>
              <div className='card-header'>
                <div className='main_title_head d-flex gap-3 align-items-center'>
                <button type='button'className='btn btn-primary rounded-2'><i class="fa fa-arrow-left " aria-hidden="true"></i></button>

                  <h3>  User Details</h3>
                </div>
              </div>
              <div className='card-body p-3'>
                <div className='row'>
                  <div className='col-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='profile-edit-sec  flex-wrap  mb-3'>
                          <label className="">
                            <img src={methodModel.userImg(form && form.image)} className="profileuserimg" />
                          </label>

                          <div className='d-flex gap-2 align-items-center width-profile '>

                            {picLoader ?
                              <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div>
                              : <div>
                                <label className="btn btn-primary  edit_btns mb-0">
                                  <input
                                    id="bannerImage"
                                    type="file"
                                    className="d-none"
                                    accept="image/*"
                                    value={form.baseImg ? form.baseImg : ''}
                                    onChange={(e) => { uploadImage(e); }}
                                  />{form.image ? '  Change' : 'Upload'} Image</label>
                              </div>}
                            <div>
                              {form.image ? <label className="btn btn-secondary mb-0 edit_btns" onClick={e => setForm({ ...form, image: "" })}>Remove Image</label> : <></>}
                            </div>
                            {/* <input type="hidden" name='image' required value={form.image} /> */}
                            {submitted && getError('image')?.invalid ? <div className="invalid-feedback d-block">Image is required</div> : <></>}
                          </div>
                      
                    </div>
                  </div>

                  <div className='col-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='edit-user-details'>

                      <div className='row'>
                        <div className='col-12 col-sm-12 col-md-6 form-group'>
                          <label>Name<span className='star'>*</span></label>
                          <div>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Name"
                              name='fullName'
                              value={form.firstName}
                              onChange={e => setForm({ ...form, firstName: e.target.value })}
                            />
                            {submitted && !form?.firstName ? <div className="invalid-feedback d-block">Name is Required</div> : <></>}
                          </div>
                        </div>

                        <div className='col-12 col-sm-12 col-md-6 form-group'>
                          <label className='d-block'>Email</label>
                          <div>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Name"
                              value={form.email ? form.email : ''}
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-12 col-md-6 form-group">
                          <label>Mobile No<span className='star'>*</span></label>
                          <div className='w-100'>
                            <div className="phoneInput w-100 ">
                              <div className='dailCode phn-code'>
                                <PhoneInput
                                  international
                                  country="US"
                                  defaultValue="+1"
                                  value={form?.dialCode}
                                  className="input_number"
                                  onChange={phone => setForm({ ...form, dialCode: phone })}
                                  readOnly={true}
                                  placeholder="+1"
                                  enableSearch
                                />
                              </div>
                              <input
                                type="text"
                                name='mobileNo'
                                className="form-control overlap_mobile"
                                placeholder='Mobile No.'
                                value={form && form.mobileNo}
                                minLength="10"
                                maxLength={12}
                                onChange={e => setForm({ ...form, mobileNo: methodModel.isNumber(e) })}
                              />
                            </div>
                            {submitted && getError('dialCode').invalid ? <div className="invalid-feedback d-block">Invalid country code</div> : <></>}
                            {submitted && getError('mobileNo').invalid && !getError('dialCode').invalid ? <div className="invalid-feedback d-block">Min Length is 10</div> : <></>}
                            {submitted && !form?.mobileNo && !form?.dialCode ? <div className="invalid-feedback d-block"> DailCode is Required*   MobileNo is Required* </div> : submitted && !form?.mobileNo ? <div className="invalid-feedback d-block">MobileNo is Required*</div> : <></>}
                            {/* {submitted && !form?.dialCode ? <div className="invalid-feedback d-block">DailCode is Required</div> : <></>} */}
                          </div>

                        </div>

                        <div className="col-12 col-sm-12 col-md-6 form-group ">
                          <label>Role</label>
                          <div>
                            <input
                              type="text"
                              className="form-control text-capitalize"
                              placeholder="Enter Name"
                              value={form?.role}
                              disabled
                            />
                          </div>
                        </div>

                        <div className=" col-12 col-sm-12 col-md-12">
                          <label>Description</label>
                          {/* <Editor  apiKey='e9b46x5ebse3zswyqxc5gpl8b5zzduu2ziq9r75c2s91ytpe' textareaName='content' value={form?.description ? form?.description : ''} className='tuncketcls'
                            onEditorChange={(newValue, editor) => {
                              setForm({ ...form, description: newValue })
                            }}

                            init={{
                              selector: 'textarea#autocompleter-cardmenuitem',
                              height: 200,
                            }}
                          /> */}
                      <div className="rounded-5 descript_editpro">
                      <DynamicReactQuill
                            theme="snow"
                            value={form?.description ? form?.description : ''}

                            onChange={(newValue, editor) => {
                              setForm({ ...form, description: newValue })
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
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className='mt-4 mb-3'>
              <div className='row'>
                <div className='col-12 col-sm-12 col-md-12 col-lg-8'>
                  <div className='card mb-4'>
                    <div className='card-header'>
                      <div className='main_title_head'>
                        <h3>User Information</h3>
                      </div>
                    </div>
                    <div className='card-body'>
                      <div className='row'>
                        {user?.role == 'affiliate' &&
                        
                        <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <div className='form-group'>
                            <div className="select_drop ">
                              <label>Category Type</label>
                              <div className="select_row">
                                <SelectDropdown
                                  id="statusDropdown"
                                  displayValue="name"
                                  placeholder="Select Type"
                                  intialValue={form?.cat_type}
                                  result={e => setForm({ ...form, cat_type: e.value })}
                                  options={categoryTypes}
                                />
                              </div>
                              {/* {submitted && !form?.category_id ? <div className="invalid-feedback d-block">Category is Required</div> : <></>} */}

                            </div>
                          </div>
                        </div>}
                        <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <label htmlFor="category">Category:</label>
                          <select class="form-select mb-2" id="category" value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="">Select a category</option>
                            {category?.map(category => (
                              <option key={category._id} value={category._id}>{category.parent_cat_name}</option>
                            ))}
                          </select></div>
                        <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <label htmlFor="subcategory">Subcategory:</label>
                          <select class="form-select mb-2" id="subcategory" value={selectedSubcategory} onChange={handleSubcategoryChange}>
                            <option value="">Select a subcategory</option>
                            {selectedCategory && category.find(cat => cat._id === selectedCategory).subCategories.map(subcategory => (
                              <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                            ))}
                          </select></div>
                        <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <label htmlFor="subsubcategory">Sub-subcategory:</label>
                          <select class="form-select mb-2" id="subsubcategory" value={selectedSubSubcategory} onChange={handleSubsubcategoryChange}>
                            <option value="">Select a sub-subcategory</option>
                            {selectedSubcategory && category.find(cat => cat._id === selectedCategory).subCategories.find(subcat => subcat.id || subcat?._id === selectedSubcategory).subchildcategory.map(subsubcat => (
                              <option key={subsubcat._id} value={subsubcat._id}>{subsubcat.name}</option>
                            ))}
                          </select></div>
                      

                        {user?.role == 'affiliate' &&
                         <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <div className='form-group'>
                            <div className="select_drop ">
                              <label>Type</label>
                              <div className="select_row">
                                <SelectDropdown
                                  id="statusDropdown"
                                  displayValue="name"
                                  placeholder="Select Type"
                                  intialValue={form?.affiliate_type}
                                  result={e => setForm({ ...form, affiliate_type: e.value })}
                                  options={[{ name: 'Business', id: 'business' }, { name: 'Individual', id: 'individual' }]}
                                />
                              </div>
                              {/* {submitted && !form?.category_id ? <div className="invalid-feedback d-block">Category is Required</div> : <></>} */}

                            </div>
                          </div>
                        </div>}

                        {<><>
                         <div className="col-12 col-sm-12 col-md-6 mb-3">
                          <div className="form-group">
                            <label>Location</label>
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
                                        onFocus: () => setInputFocused(true),
                                        onBlur: () => setInputFocused(false),
                                        // value:addressData
                                      })} />
                                    {/* {(inputFocused && address.length > 0) && <div className='shadow p-3'> */}
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map((suggestion) => {
                                      const style = {
                                        backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                                      };
                                      return (
                                        <div className='location_address'
                                          {...getSuggestionItemProps(suggestion, {
                                            style,
                                          })}
                                        >
                                          <i class="fa-solid fa-location-dot mr-1"></i>{suggestion.description}
                                        </div>
                                      );
                                    })}
                                    {/* </div>} */}
                                  </div>
                                )}
                              </PlacesAutocomplete>
                            <div>
                              
                            </div>

                          </div>
                        </div>
                        </>
                        <div className='col-12 col-sm-12 col-md-6 mb-3 '>
                            <div class="form-group">
                              <label className='label-set'>Country  </label>
                              <input type="text" value={form?.country} className="form-control quick-radius" id="exampleFormControlInput1" disabled />
                            </div>
                          </div>
                          <div className='col-12 col-sm-12 col-md-6 mb-3 '>
                            <div class="form-group">
                              <label className='label-set'>City  </label>
                              <input type="text" value={form?.city} className="form-control quick-radius" id="exampleFormControlInput1" disabled />
                            </div>
                          </div> 
                            <div className='col-12 col-sm-12 col-md-6 mb-3'>
                            <div class="form-group">
                              <label className='label-set' >Postal Code</label>
                              <input type="text" value={form?.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="form-control quick-radius" id="exampleFormControlInput1" />
                            </div>
                          </div></>
                        }

                        {<div className="col-12 col-sm-12 col-md-6 mb-3">
                          <div className='form-group'>
                            <label>website</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder='URL'
                              value={form?.website}
                              onChange={e => setForm({ ...form, website: e.target.value })}
                              title="http://www.example.com"
                              pattern={pattern}
                            />
                          </div>
                        </div>}

                        <div className="col-12 col-sm-12 col-md-6 mb-3 ">
                          <div className='form-group'>
                            <label>Gender<span className="star">*</span></label>
                            <div className="select_row">
                              <SelectDropdown
                                id="statusDropdown"
                                className='gander_drop'
                                displayValue="name"
                                placeholder="Select Gender"
                                intialValue={form?.gender}
                                result={e => { setForm({ ...form, gender: e.value }) }}
                                options={[
                                  { id: 'male', name: 'Male' },
                                  { id: 'female', name: 'Female' },
                                  { id: 'others', name: 'Rather Not Say' },
                                ]}
                              />
                            </div>
                            {submitted && !form?.gender ? <div className="invalid-feedback d-block">Gender is Required</div> : <></>}
                          </div>
                        </div>
                        {
                          <div className='col-12 col-sm-12 col-md-6 mb-3  col-lg-12'>
                            <div className=" form-group">
                              <label> Tags</label>
                              <div className="d-flex gap-3  flex-row">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={changeSubCategory}
                                  placeholder="Enter..."
                                  onChange={e => setChangeSubCategory(e.target.value)}
                                  onKeyDown={handleKeyDown}

                                />
                                <a
                                  className=" d-flex justify-content-center align-items-center btn btn-primary"
                                  onClick={addTag}
                                ><i className='fa fa-plus'></i></a>
                              </div>
                              <div className="d-flex gap-3 align-items-center flex-wrap mt-4 ">
                              {form && form?.tags?.map((item, i) => {
                                return (
                                         <button type="button" class="btn btn-primary d-flex gap-2 align-items-center" key={i}>
                                          <span className=' pt_bx'> {item}</span>
                                          <i className='fa fa-close cloosebtn'  onClick={() => cancele(item, 'tags')} ></i>
                                  </button>
                                  
                             
                                )
                              })}
                              </div>
                            
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-12 col-sm-12 col-md-12 col-lg-4'>
                  <div className='card'>
                    <div className='card-header'>
                      <div className='main_title_head'>
                        <h3>Select Social Media Platforms :</h3>
                      </div>
                    </div>
                    <div className='card-body'>
                      {
                        
                          <div className="row mx-auto">

                            {data?.map((item) => (
                              <div key={item?.id} className=" col-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="card rounded-5 border platforms_input mb-3">
                                  <input
                                    className="form-check-input ml-0"
                                    type="checkbox"
                                    id={item}
                                    onChange={() => handleFeatureCheckbox(item)}
                                    checked={selectedItems?.includes(item)}
                                  />
                                  <label className="form-check-label ml-3 pl-2" for={item}>
                                    {methodModel?.capitalizeFirstLetter(item)}
                                  </label>
                                  {selectedItems?.includes(item) && (
                                    <div className="row">
                                      <div className="col-12 col-sm-12  col-md-6 col-lg-12 my-3">
                                        <label>User name</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder='Enter Name'
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

                                      <div className="col-12 col-sm-12  col-md-6 col-lg-12 my-3">
                                        <label>{`${methodModel?.capitalizeFirstLetter(item)} link`}</label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder='Enter link'

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
                          </div>
                      
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-12 mt-4'>
                <div className='row'>
                  <div className='card p-0'>
                    <div className='card-header'>
                      <div className='main_title_head'>
                        <h3>Add Your Account Detail</h3>
                      </div>
                    </div>
                    <div className='card-body'>

                      <div className='row '>
                        {/* <div className='col-md-6'>

                            <div className='form-group'>
                              <p className='mb-0'><label className='label-set'>Auto Invoicing <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                              <input type="checkbox"
                                checked={formData?.auto_invoice}
                                name="auto_invoice"
                                onChange={handleInputChange}
                                className="checkbox-custom d-block">
                              </input>
                            </div>


                          </div>
                          <div className='col-12 col-sm-12 col-md-6 '>


                            <div className='form-group'>
                              <p className='mb-0'><label className='label-set'>Hide Invoices from Partners <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                              <input
                                checked={formData?.is_hide_invoice}
                                onChange={handleInputChange}
                                name="is_hide_invoice"
                                type="checkbox"
                                className="checkbox-custom d-block"></input>
                            </div>
                          </div> */}
                      </div>
                      <div className='row  '>
                        {/* <div className='col-md-6'>
                            <div class="form-group">
                              <label className='label-set' >Payment Method  </label>
                              <select class="form-select " aria-label="Default select example" name='payment_method' value={formData?.payment_method}
                                onChange={handleInputChange}>
                                <option selected>Select</option>
                                <option value="stripe">Stripe</option>
                               
                              </select>
                              {submitted && !formData?.payment_method ? <div className="invalid-feedback d-block">Payment method is Required</div> : <></>}
                            </div>
                          </div> */}
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <p className='mb-0'><label className='label-set'>Account Holder Name </label></p>
                            <input
                              value={formData?.accountholder_name}
                              onChange={handleInputChange}
                              name="accountholder_name"
                              placeholder="Enter your Holder Number"
                              type="text"
                              className="form-control "></input>
                            {submitted && !formData?.accountholder_name ? <div className="invalid-feedback d-block">Account Holder Name is Required</div> : <></>}
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <div className='form-group'>
                            <p className='mb-0'><label className='label-set'>Company Name </label></p>
                            <input
                              value={formData?.company_name}
                              onChange={handleInputChange}
                              name="company_name"
                              placeholder="Enter your Company Number"
                              type="text"
                              className="form-control "></input>
                            {submitted && !formData?.company_name ? <div className="invalid-feedback d-block">Company Name is Required</div> : <></>}
                          </div>
                        </div>
                        <div className='col-md-6'>


                          <div className='form-group'>
                            <p className='mb-0'><label className='label-set'>Account Number</label></p>
                            <input
                              value={formData?.account_number}
                              onChange={handleInputChange}
                              name="account_number"
                              placeholder="Enter your Account Number"
                              type="number"
                              className="form-control "></input>
                            {submitted && formData?.account_number?.length < 12 ? <div className="invalid-feedback d-block">Account Number is must be 12 digit</div> : <></>}
                          </div>
                        </div>
                        <div className='col-md-6'>

                          <div className='form-group'>
                            <p className='mb-0'><label className='label-set'>Routing Number </label></p>
                            <input
                              value={formData?.routing_number}
                              onChange={handleInputChange}
                              name="routing_number"
                              placeholder="Enter your Routing Number"
                              type="number"
                              className="form-control "></input>
                            {submitted && formData?.routing_number?.length < 9 ? <div className="invalid-feedback d-block">Routing Number is must be 9 digit</div> : <></>}
                          </div>
                        </div>
                        <div className='col-md-6'>

                          <div className='form-group'>
                            <p className='mb-0'><label className='label-set'>SSN Number </label></p>
                            <input
                              value={formData?.ssn_number}
                              onChange={handleInputChange}
                              name="ssn_number"
                              placeholder="Enter your SSN Number"
                              type="number"
                              className="form-control "></input>
                            {submitted && formData?.ssn_number?.length < 9 ? <div className="invalid-feedback d-block">SSN Number is must be 9 digit</div> : <></>}
                          </div>
                        </div>
                        {/* <div className='col-md-6'>
                            <div className='form-group rect-cust-width'>
                              <label className='label-set'>Date of Birth:</label>
                              <p>
                                <DatePicker
                                  className='form-control w-100'
                                  selected={dob}
                                  onChange={handleDateChange}
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  placeholderText="Select Date of Birth"
                                  maxDate={eighteenYearsAgo}
                                />
                                {submitted && !dob ? <div className="invalid-feedback d-block">DOB is Required</div> : <></>}
                              </p>
                            </div>
                          </div> */}

                        {/* <div className='col-md-6 ml-1'>
                            <div class="form-group">
                              <label className='label-set' >Tax Details <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                              <input type="text" className="form-control " id="tax_detail" name="tax_detail" value={formData?.tax_detail}
                                onChange={handleInputChange} />
                            </div>
                          </div> */}
                        {/* <div className='col-md-6'>
                            <label>Front Doc (only image)</label>
                            <div className="form-group drag_drop">
                              <div className='upload_file'>
                                {!loaderr && !imgLoder && image.length == 0 ? <><button className="btn btn-primary upload_image">Upload Document</button>
                                  <input type="file" className="form-control-file over_input" accept="images/*" multiple={true}
                                    // disabled={loader}
                                    onChange={(e) => {
                                      setImgLoder(true)
                                      uploadImage(e, 'images');
                                    }} /></> : <></>}
                                {submitted && !frontDoc ? <div className="invalid-feedback d-block">Front doc is Required</div> : <></>}
                                {loaderr && imgLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                <div className="imagesRow mt-4 img-wrappper">
                                  {image && image?.map((itm, i) => {
                                    return <div className="imagethumbWrapper" key={i}>
                                      <img src={itm?.url?.length > 0 ? methodModel.noImg(itm?.url) : ''} alt={itm.name} className="thumbnail" />
                                      <i className="fa fa-times kliil" title="Remove" onClick={e => remove(i)}></i>
                                    </div>
                                  })}
                                </div>
                              </div>
                            </div>
                          </div> */}

                        {/* <div className='col-md-6'>
                            <label>Back Doc(only image) </label>
                            <div className="form-group drag_drop">
                              <div className='upload_file'>
                                {!loadDocerr && !docLoder && doc.length == 0 && <><button className="btn btn-primary upload_image">Upload Document</button>
                                  <input type="file" className="form-control-file over_input" accept="images/*" multiple={true}
                                    // disabled={loader}
                                    onChange={(e) => {
                                      setDocLoder(true)
                                      uploadDocument(e, 'images');
                                    }} /></>}
                                {submitted && !backDoc ? <div className="invalid-feedback d-block">Back doc is Required</div> : <></>}
                                {loadDocerr && docLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                <div className="imagesRow mt-4 img-wrappper">
                                  {doc && doc?.map((itm, i) => {
                                    return <div className="imagethumbWrapper" key={i}>
                                      <img src={itm?.url?.length > 0 ? methodModel.noImg(itm?.url) : ''} alt={itm.name} className="thumbnail" />
                                      <i className="fa fa-times kliil" title="Remove" onClick={e => removeDocument(i)}></i>
                                    </div>
                                  })}
                                </div>
                              </div>
                            </div>
                          </div> */}
                      </div>

                    </div>
                  </div>
                </div>
              </div>



            </div>



            <div className='mt-4 btn-discards'>
              <div className="text-end edit-btns d-flex gap-3 align-items-center justify-content-end">
                <Link href="/profile" className="btn btn-secondary ">
                  Discard
                </Link>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Html;

import React, { useEffect, useState } from 'react';
import methodModel from '@/methods/methods';
import './style.scss';
import Link from 'next/link';
import PhoneInput from 'react-phone-input-2'
import PlacesAutocomplete from "react-places-autocomplete";
import 'react-phone-input-2/lib/style.css';
import SelectDropdown from '../../common/SelectDropdown';
import MultiSelectDropdown from '../../../campaign/MultiSelectDropdownData'
import 'react-datepicker/dist/react-datepicker.css';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import ApiClient from '@/methods/api/apiClient';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Html = ({ user,
  picLoader,
  selectedItems1,
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
  selectedItems,
  setSelectedItems,
  setSelectedItems1,
  uploadImage,
  submitted,
  category,
  setForm,
  websites,
  setWebsites,
  history }) => {
  const [inputFocused, setInputFocused] = useState(false)
  const [categories, setCategories] = useState([]);
  const categoryTypes = [
    { id: 'promotional_models', name: 'Promotional Models' },
    { id: 'property_types', name: 'Property Types' },
    { id: 'advertiser_categories', name: 'Advertiser Categories' },
  ]
  const data = ["youtube", "twitter", "instagram", "linkedin"]

  const [newItem, setNewItem] = useState("");
  const [customItems, setCustomItems] = useState(data);

  const handleAddNewItem = () => {
    if (newItem.trim() !== "" && !customItems.includes(newItem)) {
      setCustomItems([...customItems, newItem]);
      setNewItem(""); // Clear input
    }
  };
  
  const handleRemoveItem = (itemToRemove) => {
    setCustomItems(customItems.filter((item) => item !== itemToRemove));
    setSelectedItems1(selectedItems1.filter((item) => item !== itemToRemove));
  
    // Remove related form values
    setForm((prevForm) => {
      const updatedForm = { ...prevForm };
      delete updatedForm[`${itemToRemove}_username`];
      delete updatedForm[`${itemToRemove}_profile_link`];
      return updatedForm;
    });
  };

  const handleWebsiteChange = (index, value) => {
    const newWebsites = [...websites];
    newWebsites[index] = value;
    setWebsites(newWebsites);
  };

  const addWebsite = () => {
    setWebsites([...websites, '']);
  };

  const removeWebsite = (index) => {
    const newWebsites = websites.filter((_, i) => i !== index);
    setWebsites(newWebsites);
  };

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

  const getCategory = () => {
    let url = `categoryWithSub?page&count&search&cat_type=${user?.role == "affiliate" ? "promotional_models,property_types": "advertiser_categories"}&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        setCategories(res.data.data);
      }
    });
  };

  useEffect(() => {
    getCategory()
  }, [])

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
                  <button type='button' className='btn btn-primary rounded-2' onClick={() => history.push("/profile")}><i class="fa fa-arrow-left " aria-hidden="true"></i></button>

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
                        {/* {user?.role == 'affiliate' &&

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

                              </div>
                            </div>
                          </div>} */}


                        {/* <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <label htmlFor="category">Category:</label>
                          <select class="form-select mb-2" id="category" value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="">Select a category</option>
                            {category?.map(category => (
                              <option key={category._id} value={category._id}>{category.parent_cat_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <label htmlFor="subcategory">Subcategory:</label>
                          <select class="form-select mb-2" id="subcategory" value={selectedSubcategory} onChange={handleSubcategoryChange}>
                            <option value="">Select a subcategory</option>
                            {selectedCategory && category.find(cat => cat._id === selectedCategory).subCategories.map(subcategory => (
                              <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className='col-12 col-sm-12 col-md-6 mb-3'>
                          <label htmlFor="subsubcategory">Sub-subcategory:</label>
                          <select class="form-select mb-2" id="subsubcategory" value={selectedSubSubcategory} onChange={handleSubsubcategoryChange}>
                            <option value="">Select a sub-subcategory</option>
                            {selectedSubcategory && category.find(cat => cat._id === selectedCategory).subCategories.find(subcat => subcat.id || subcat?._id === selectedSubcategory).subchildcategory.map(subsubcat => (
                              <option key={subsubcat._id} value={subsubcat._id}>{subsubcat.name}</option>
                            ))}
                          </select>
                        </div> */}


                        <div className="col-md-12 mb-3">
                          <label>Select Category<span className="star">*</span></label>
                          <div className="drops category-input">
                            <MultiSelectDropdown
                              data={categories}
                              selectedItems={selectedItems}
                              setSelectedItems={setSelectedItems}
                            />
                          </div>
                          {/* {submitted && selectedItems?.categories?.length == 0 && <div className="invalid-feedback d-block">{errors?.categories}</div>} */}
                        </div>


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
                                {submitted && !form?.affiliate_type ? <div className="invalid-feedback d-block">Affiliate Type is Required</div> : <></>}

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
                              <input type="text" value={form?.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="form-control quick-radius" id="exampleFormControlInput1" />
                            </div>
                          </div>
                          <div className='col-12 col-sm-12 col-md-6 mb-3 '>
                            <div class="form-group">
                              <label className='label-set'>City  </label>
                              <input type="text" value={form?.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="form-control quick-radius" id="exampleFormControlInput1" />
                            </div>
                          </div>
                          <div className='col-12 col-sm-12 col-md-6 mb-3'>
                            <div class="form-group">
                              <label className='label-set' >Postal Code</label>
                              <input type="text" value={form?.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="form-control quick-radius" id="exampleFormControlInput1" />
                            </div>
                          </div></>
                        }

                        {user?.role != "affiliate" ? <div className="col-12 col-sm-12 col-md-6 mb-3">
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
                        </div> 
                        :
                        <div className="col-12 col-sm-12 col-md-6 mb-3">
                        <div className="form-group">
                          <label>Websites</label>
                          {websites.map((website, index) => (
                            <div key={index} className="d-flex align-items-center gap-2 mb-2">
                              <input
                                type="text"
                                className="form-control flex-grow-1"
                                placeholder="http://www.example.com"
                                value={website}
                                onChange={(e) => handleWebsiteChange(index, e.target.value)}
                                title="http://www.example.com"
                                pattern="https?://.+" 
                              />
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeWebsite(index)}
                                disabled={websites.length === 1}
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                          <button type="button" className="btn btn-primary mt-2" onClick={addWebsite}>
                            ➕ Add Website
                          </button>
                        </div>
                      </div>
                        }


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
                                      <i className='fa fa-close cloosebtn' onClick={() => cancele(item, 'tags')} ></i>
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
                          {[...customItems].map((item,index) => (
                            <div key={item} className="col-12">
                              <div className="card rounded-5 border platforms_input mb-3 p-3">
                                <div className="d-flex align-items-center">
                                  <input
                                    className="form-check-input ml-0"
                                    type="checkbox"
                                    id={item}
                                    onChange={() => handleFeatureCheckbox(item)}
                                    checked={selectedItems1?.includes(item)}
                                  />
                                  <label className="form-check-label ml-3 pl-2" htmlFor={item}>
                                    {methodModel?.capitalizeFirstLetter(item)}
                                  </label>
                                  {index > 3 && <button
                                    className="btn btn-danger btn-sm ml-auto"
                                    onClick={() => handleRemoveItem(item)}
                                  >
                                    Remove
                                  </button>}
                                </div>
                                {selectedItems1?.includes(item) && (
                                  <div className="row">
                                    <div className="col-12 my-3">
                                      <label>User name</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Name"
                                        value={form[`${item}_username`] || ""}
                                        onChange={(e) =>
                                          setForm((prevForm) => ({
                                            ...prevForm,
                                            [`${item}_username`]: e.target.value,
                                          }))
                                        }
                                        required
                                      />
                                    </div>

                                    <div className="col-12 my-3">
                                      <label>{`${methodModel?.capitalizeFirstLetter(item)} link`}</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter link"
                                        value={form[`${item}_profile_link`] || ""}
                                        onChange={(e) =>
                                          setForm((prevForm) => ({
                                            ...prevForm,
                                            [`${item}_profile_link`]: e.target.value,
                                          }))
                                        }
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

                          <div className="col-12">
                            <div className="card rounded-5 border platforms_input mb-3 p-3">
                              <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Enter new platform"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                              />
                              <button className="btn btn-primary" onClick={handleAddNewItem}>
                                Add Platform
                              </button>
                            </div>
                          </div>

                        </div>

                      }
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

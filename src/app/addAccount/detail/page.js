'use client'

import react, { useEffect, useState } from 'react';
import "../style.scss";
import Layout from '../../components/global/layout';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import methodModel from '@/methods/methods';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import crendentialModel from '@/models/credential.model';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import loader from '@/methods/loader';
import { toast } from 'react-toastify';
import { Label } from "reactstrap";
import $ from 'jquery';

export default function addAffiliateAccount() {
  const user = crendentialModel.getUser()
  const router = useRouter()
  const [formData, setFormData] = useState({
    billing_frequency: "",
    payment_method: "",
    tax_detail: "",
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: "",
    company_name: "",
    dialCode: "+1",
    mobileNo: "",
  });
  const [submitted, setSubmitted] = useState(false)
  const [loaderr, setLoader] = useState()
  const [imgLoder, setImgLoder] = useState()
  const [image, setImage] = useState([])
  const [loadDocerr, setDocLoader] = useState()
  const [docLoder, setDocLoder] = useState()
  const [doc, setDoc] = useState([])
  const [dob, setDOB] = useState(null);
  const [formatedDob, setFormatedDob] = useState()
  const [frontDoc, setFrontDoc] = useState()
  const [backDoc, setBackDoc] = useState()
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [stateAutocomplete, setStateAutocomplete] = useState(true)
  const [form, setForm] = useState({user_id:user?.id || user ?._id ,social_security_number: '' });
  const currentDate = new Date().toISOString().split("T")[0];
  const [sumitted, setSumitted] = useState(false);
  const [taxDetailTabEnabled, setTaxDetailTabEnabled] = useState(false);

  const uploadSignatureImage = (e) => {
    setForm({ ...form, baseImg: e.target.value })
    let files = e.target.files
    let file = files.item(0)
    // loader(true)
    setImgLoder(true)
    setLoader(true)
    ApiClient.postFormData('upload/image?modelName=users', { file: file, modelName: 'users' }).then(res => {
      if (res.data) {
        let image = res?.data?.fullpath
        setForm({ ...form, signature: `images/users/${image}` })
      }
      setImgLoder(false)
      setLoader(false)
    })
  }

  useEffect(() => {
    if (user && user?.role == 'affiliate' && user?.account_id) {
      console.log("ENTER.....")
      setTaxDetailTabEnabled(true)
    }
  }, [])

  const handleSubmit = (e) => {
    // localStorage.setItem('tax_detail', form)

    const payload = {
      ...form
    }

    if(payload?.tax_classification == 'business'){
      delete payload?.tax_name,
      delete payload?.social_security_number
    }

    if(payload?.tax_classification == 'individual'){
      delete payload?.federal_text_classification
      // delete data?.social_security_number
    }
    ApiClient.post('addTax', payload).then(res => {
      if (res.success) {
        let uUser = { ...user, ...data1 }
        crendentialModel.setUser(uUser)
        router.push("/profile")
        toast.success('Tax Detail Added Sccessfully ...')
        // router.push(`/`)
      }
    })
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  useEffect(() => {
    toast.error('Please add your account first... ')
    setTimeout(() => {
      setStateAutocomplete(false)
    }, 2000);
  }, [])

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      const city = addressComponents.find((component) =>
        component.types.includes('locality')
      )?.long_name || '';
      const state = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      )?.long_name || '';
      const country = addressComponents.find((component) =>
        component.types.includes('country')
      )?.long_name || '';
      const pincode = addressComponents.find((component) =>
        component.types.includes('postal_code')
      )?.long_name || '';

      const selectedLocation = {
        address: selectedAddress,
        city,
        state,
        country,
        pincode,
        ...latLng,
      };

      setSelectedLocation(selectedLocation);

      setAddress(selectedAddress);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

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

    if (name === "mobileNo" && value.length > 11) {
      return;
    }

    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue, });
  }

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedDOB = { day, month, year };

      setDOB(date);
      setFormatedDob(formattedDOB);
    }
  };

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
      let url = 'upload/front/image'

      const res = await ApiClient.postFormData(url, { file: file })
      if (res.success) {
        let path = res?.imagePath
        let name = res?.filename
        if (image?.length <= 10) {
          image?.push({
            name: `${name}`,
            url: `frontdoc/${path}`
          })
        }
        const data = await ApiClient.postFormData("verify/images", {
          "image": path,
          "path": res?.fullPath
        })
        if (data.success) {
          setFrontDoc(data?.data?.id)
          setLoader(false)
          setImgLoder(false)
        } else {
          setLoader(false)
          setImgLoder(false)
          // setImage([])
        }
      }
      i++
    }
    setLoader(false)
    setImgLoder(false)
  }

  const uploadDocument = async (e, key) => {
    let files = e.target.files
    let i = 0
    let imgfile = []
    for (let item of files) {
      imgfile.push(item)
    }

    setDocLoader(true)
    for await (let item of imgfile) {
      let file = files.item(i)
      let url = 'upload/back/image'

      const res = await ApiClient.postFormData(url, { file: file })
      if (res.success) {
        let path = res?.imagePath
        let name = res?.filename
        doc?.push({
          name: `backdoc/${name}`,
          url: `backdoc/${path}`
        })
        const data = await ApiClient.postFormData("verify/images", {
          "image": path,
          "path": res?.fullPath
        })
        if (data.success) {
          setBackDoc(data?.data?.id)
          setLoader(false)
          setImgLoder(false)
        } else {
          setLoader(false)
          setImgLoder(false)
        }
      }
      i++
    }
    setDocLoader(false)
    setDocLoder(false)
    // setVdo(false)
  }

  const remove = (index) => {
    const filteredImages = image.filter((data, indx) => index !== indx);
    setImage(filteredImages);
  };

  const removeDocument = (index) => {
    const filteredImages = doc.filter((data, indx) => index !== indx);
    setDoc(filteredImages);
  };


  const handleSave = () => {
                // setTaxDetailTabEnabled(true)

    if (!formData?.mobileNo || !formData?.account_number || !formData?.company_name || !frontDoc || !backDoc ||
      formData?.ssn_number?.length < 9 || formData?.routing_number?.length < 9 || !formData?.accountholder_name || formData?.account_number?.length < 12 || !dob || formData?.mobileNo?.length < 10) {
      setSubmitted(true)
      return
    }

    if (!address || !selectedLocation?.pincode || !selectedLocation?.city || !selectedLocation?.state) {
      setSubmitted(true)
      return;
    }
    loader(true)
    const mobileData = `${formData?.dialCode}${formData?.mobileNo}`
    const data1 = {
      "email": user?.email,
      "accountholder_name": formData.accountholder_name,
      "routing_number": formData.routing_number,
      "account_number": formData.account_number,
      "first_name": user?.firstName,
      "last_name": user?.lastName,
      "mobile": mobileData,
      "ssn_number": formData.ssn_number,
      "address": {
        "line1": selectedLocation?.address,
        "city": selectedLocation?.city,
        "state": selectedLocation?.state,
        "postal_code": selectedLocation?.pincode
      },
      "dob": formatedDob,
      "company_name": formData?.company_name,
      "frontdoc": frontDoc,
      "backdoc": backDoc,
      "user_id": user?.id
    }
    ApiClient.post('bank', data1).then(res => {
      if (res.success == true) {
        const data1 = {
          id: user?.id,
          accountholder_name: formData?.accountholder_name,
          routing_number: formData?.routing_number,
          account_number: formData?.account_number,
          ssn_number: formData?.ssn_number,
          company_name: formData?.company_name,
        }

        ApiClient.put('edit/profile', data1).then(res => {
          if (res.success) {
            let uUser = { ...user, ...data1 }
            crendentialModel.setUser(uUser)
            // history.push("/profile")
            toast.success('Account Added Sccessfully ...')
            // router.push(`/`)
          }
          // loader(false)
        })

      }
      loader(false)
    })
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Add Account"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5 pt-0'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-12'>
                <ul class="nav accout_details nav-pills mb-3" id="pills-tab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class={`nav-link nb_link ${taxDetailTabEnabled ? 'disabled' : 'active'}`} id="account_details" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Account Detail</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class={`nav-link nb_link ${taxDetailTabEnabled ? 'active' : 'disabled'}`} id="text_details" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false" disabled={!taxDetailTabEnabled}>Tax Detail</button>   </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                  <div class={`tab-pane fade ${taxDetailTabEnabled ? '' : 'show active'}`} id="pills-home" role="tabpanel" aria-labelledby="account_details" tabindex="0">
                    <div className='card'>
                      <div className='card-body account_body '>


                        <div className='row'>
                          <div className='col-12 col-md-12 '>
                            <div className='dtls_head'>
                              <h3>Account Detail  </h3>
                            </div>
                            <div className='row'>
                              <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                  <p className='mb-0'><label className='label-set account_set '>Account Holder Name<span className="star">*</span> </label></p>
                                  <input
                                    value={formData?.accountholder_name}
                                    onChange={handleInputChange}
                                    name="accountholder_name"
                                    type="text"
                                    className="form-control "
                                    placeholder="Enter Account Holder Name"></input>
                                  {submitted && !formData?.accountholder_name ? <div className="invalid-feedback d-block">Account Holder Name is Required</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                  <p className='mb-0'><label className='label-set account_set '>Company Name<span className="star">*</span> </label></p>
                                  <input
                                    value={formData?.company_name}
                                    onChange={handleInputChange}
                                    name="company_name"
                                    type="text"
                                    className="form-control "
                                    placeholder="Enter Company Name"></input>
                                  {submitted && !formData?.company_name ? <div className="invalid-feedback d-block">Company Name is Required</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                  <p className='mb-0'><label className='label-set account_set '>Account Number<span className="star">*</span></label></p>
                                  <input
                                    value={formData?.account_number}
                                    onChange={handleInputChange}
                                    name="account_number"
                                    type="number"
                                    className="form-control "
                                    placeholder="Enter Account Number"></input>
                                  {submitted && formData?.account_number?.length < 12 ? <div className="invalid-feedback d-block">Account Number is must be 12 digit</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                  <p className='mb-0'><label className='label-set account_set '>Routing Number<span className="star">*</span> </label></p>
                                  <input
                                    value={formData?.routing_number}
                                    onChange={handleInputChange}
                                    name="routing_number"
                                    type="number"
                                    className="form-control "
                                    placeholder="Enter Routing Number"></input>
                                  {submitted && formData?.routing_number?.length < 9 ? <div className="invalid-feedback d-block">Routing Number is must be 9 digit</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                  <p className='mb-0'><label className='label-set account_set '>SSN Number<span className="star">*</span> </label></p>
                                  <input
                                    value={formData?.ssn_number}
                                    onChange={handleInputChange}
                                    name="ssn_number"
                                    type="number"
                                    className="form-control "
                                    placeholder="Enter SSN Number"></input>
                                  {submitted && formData?.ssn_number?.length < 9 ? <div className="invalid-feedback d-block">SSN Number is must be 9 digit</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div class="form-group">
                                  <label className='label-set account_set ' >Mobile Number<span className="star">*</span></label>
                                  <div className="phoneInput main-no">
                                    <div className='dailCode phn-code'>
                                      <PhoneInput
                                        international
                                        country={"us"}
                                        inputProps={{
                                          disabled: true
                                        }}
                                        value={formData?.dialCode}
                                        className="input_number bg_none disable_white"
                                        onChange={phone => setFormData({ ...formData, dialCode: phone })}
                                        readOnly={true}
                                        placeholder="+1"
                                        enableSearch
                                      />
                                    </div>
                                    <input
                                      type="number"
                                      className="form-control overlap_mobile"
                                      id="exampleFormControlInput1"
                                      name="mobileNo"
                                      value={formData?.mobileNo}
                                      autoComplete="off"
                                      onChange={handleInputChange}
                                      placeholder="Enter a valid number"
                                      required
                                    />
                                  </div>
                                  {submitted && formData?.mobileNo?.length < 10 ? <div className="invalid-feedback d-block">Mobile Number is must be 10 digit</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div className='form-group rect-cust-width'>
                                  <label className='label-set account_set '>Date of Birth:<span className="star">*</span></label>
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
                              </div>


                              {/* <div className='col-md-6 ml-1'>
                            <div class="form-group">
                              <label className='label-set account_set ' >Tax Details  </label>
                              <input type="text" className="form-control " id="tax_detail" name="tax_detail" value={formData?.tax_detail}
                                onChange={handleInputChange} />
                            </div>
                          </div> */}

                              <div className='col-12 col-md-4'>
                                <label className='label-set account_set '>Front Doc <span className='text-sm'>(only image)</span><span className="star">*</span></label>
                                <div className="form-group drag_drop mb-0">
                                  <div className='upload_file  set_upload_bx'>
                                    {!loaderr && !imgLoder && image.length == 0 ? <>
                                      <label className='label_btns_file pointer'>
                                        <input type="file" className="d-none pointer" accept="images/*" multiple={false}
                                          // disabled={loader}
                                          onChange={(e) => {
                                            setImgLoder(true)
                                            uploadImage(e, 'images');
                                          }} />
                                        <div className='d-flex justify-content-center flex-column'>
                                          <i className='fa fa-plus'></i>
                                          Upload Image
                                        </div>
                                      </label>
                                    </> : <></>}
                                    {submitted && !frontDoc ? <div className="invalid-feedback d-block">Front doc is Required</div> : <></>}
                                    {loaderr && imgLoder ? <div className="text-success text-center mt-2 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                    <div className="imagesRow  img-wrappper  ">
                                      {image && image?.map((itm, i) => {
                                        return <div className="imagethumbWrapper" key={i}>
                                          <img src={itm?.url?.length > 0 ? methodModel.noImg(itm?.url) : ''} alt={itm.name} className="thumbnail" />
                                          <i className="fa fa-times kliil" title="Remove" onClick={e => remove(i)}></i>
                                        </div>
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>


                              <div className='col-12 col-md-4'>
                                <label className='label-set account_set '>Back Doc <span className='text-sm'>(only image)</span><span className="star">*</span></label>
                                <div className="form-group drag_drop">
                                  <div className='upload_file set_upload_bx'>
                                    {!loadDocerr && !docLoder && doc.length == 0 && <>
                                      {/* <button className="btn btn-primary upload_image">Upload Document</button> */}
                                      <label className='label_btns_file pointer'>
                                        <input type="file" className="form-control-file over_input" accept="images/*" multiple={false}
                                          // disabled={loader}
                                          onChange={(e) => {
                                            setDocLoder(true)
                                            uploadDocument(e, 'images');
                                          }} />
                                        <div className='d-flex justify-content-center flex-column'>
                                          <i className='fa fa-plus'></i>
                                          Upload Image
                                        </div>
                                      </label>
                                    </>}
                                    {submitted && !backDoc ? <div className="invalid-feedback d-block">Back doc is Required</div> : <></>}
                                    {loadDocerr && docLoder ? <div className="text-success text-center mt-2 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                                    <div className="imagesRow img-wrappper">
                                      {doc && doc?.map((itm, i) => {
                                        return <div className="imagethumbWrapper" key={i}>
                                          <img src={itm?.url?.length > 0 ? methodModel.noImg(itm?.url) : ''} alt={itm.name} className="thumbnail" />
                                          <i className="fa fa-times kliil" title="Remove" onClick={e => removeDocument(i)}></i>
                                        </div>
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className='col-12 col-md-12 '>
                            <div className='dtls_head'>
                              <h3>Address Detail</h3>
                            </div>

                            <div className='row'>

                              <div className='col-12 col-md-4'>
                                <div className='form-group'>
                                  <label className='label-set account_set '>Address1<span className="star">*</span></label>
                                  {!stateAutocomplete && <PlacesAutocomplete
                                    value={address}
                                    onChange={handleChange}
                                    onSelect={handleSelect}
                                  >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                      <div >
                                        <input className="form-control "

                                          {...getInputProps({
                                            placeholder: 'Enter an address...',
                                            onFocus: () => setInputFocused(true),
                                            onBlur: () => setInputFocused(false),
                                            // value:addressData
                                          })} />

                                        {/* {(inputFocused && address?.length > 0) && <div className='shadow p-3'> */}
                                        {loading && <div>Loading...</div>}

                                        {suggestions?.map((suggestion) => {

                                          const style = {
                                            backgroundColor: suggestion.active ? '#41b6e6' : '#fff',

                                          };

                                          return (

                                            <div >
                                              <div className='location_address'
                                                {...getSuggestionItemProps(suggestion, {
                                                  style,
                                                })}
                                              >
                                                <i class="fa-solid fa-location-dot mr-1"></i>{suggestion.description}
                                              </div>
                                            </div>

                                          );
                                        })}

                                        {/* </div>} */}
                                      </div>
                                    )}
                                  </PlacesAutocomplete>}
                                  {submitted && !address ? <div className="invalid-feedback d-block">Address is Required</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div class="form-group">
                                  <label className='label-set account_set '>Address2  </label>
                                  <input type="text" className="form-control " placeholder="Enter Your Address" value={address2} onChange={(e) => setAddress2(e.target.value)} id="exampleFormControlInput1" />
                                </div>
                              </div>

                              <div className='col-12 col-md-4'>
                                <div class="form-group">
                                  <label className='label-set account_set '>Country<span className="star">*</span>  </label>
                                  <input type="text" value={selectedLocation?.country} className="form-control " id="exampleFormControlInput1" disabled />
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div class="form-group">
                                  <label className='label-set account_set '>State<span className="star">*</span>  </label>
                                  <input type="text" value={selectedLocation?.state} placeholder="Enter Your State" onChange={(e) => setSelectedLocation({ ...selectedLocation, state: e.target.value })} className="form-control " id="exampleFormControlInput1" />
                                  {submitted && !selectedLocation?.state ? <div className="invalid-feedback d-block">State is Required</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div class="form-group">
                                  <label className='label-set account_set '>City<span className="star">*</span>  </label>
                                  <input type="text" value={selectedLocation?.city} placeholder="Enter Your City" onChange={(e) => setSelectedLocation({ ...selectedLocation, city: e.target.value })} className="form-control " id="exampleFormControlInput1" />
                                  {submitted && !selectedLocation?.city ? <div className="invalid-feedback d-block">City is Required</div> : <></>}
                                </div>
                              </div>
                              <div className='col-12 col-md-4'>
                                <div class="form-group">
                                  <label className='label-set account_set '>Postal Code<span className="star">*</span>  </label>
                                  <input type="text" value={selectedLocation?.pincode} placeholder="Enter Your Postal Code " onChange={(e) => setSelectedLocation({ ...selectedLocation, pincode: e.target.value })} className="form-control " id="exampleFormControlInput1" />
                                  {submitted && !selectedLocation?.pincode ? <div className="invalid-feedback d-block">Pincode is Required</div> : <></>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                        <div className='d-flex justify-content-end '>
                          <button className='back-btns' onClick={handleGoBack}>Back</button>
                          <button className='btn btn-primary login ml-3' onClick={handleSave}>Save & Continue</button>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class={`tab-pane fade ${!taxDetailTabEnabled ? '' : 'show active'}`} id="pills-profile" role="tabpanel" aria-labelledby="text_details" tabindex="0">

                    <div className='tx_detailsbx'>
                    <div class="dtls_head"><h3>Tax Detail  </h3></div>

<div className="form_page b-none">
  <div className="container">
<div className='row'>
<div className='col-md-6'> 
<div className="mb-4">
        <label className='form-label certif_inst ' >
          Are you a U.S. citizen, U.S. permanent resident (green card
          holder) <i class="fa fa-info-circle" aria-hidden="true"></i>
        </label>
     <div className='position-relative selectYes'>
     <select
          class="form-control  "
          id="exampleFormControlSelect1"
          value={form?.is_us_citizen}
          onChange={(e) =>
            setForm({ ...form, is_us_citizen: e.target.value })
          }
          required
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
        <i class="fa fa-sort-desc down_arrow" aria-hidden="true"></i>
     </div>

      </div>
</div>
<div className='col-md-6'> 
<div className="mb-4">
        <label className='form-label certif_inst' >
          What is your tax classification?{" "}

        </label>
        <div className="row">
          <div className="col-6">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              checked={form?.tax_classification === "individual"}
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onChange={(e) =>
                setForm({
                  ...form,
                  tax_classification: "individual",
                  federal_text_classification: "",
                  social_security_number: "",
                  trade_name: "",
                })
              }
            />
            <label class="form-check-label" for="flexRadioDefault1">
              {" "}
              Individual
            </label>
            </div>
            </div>
            <div className="col-6">
            <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              checked={form?.tax_classification === "business"}
              onChange={(e) =>
                setForm({
                  ...form,
                  tax_classification: "business",
                  tax_name: "",
                  ein: "",
                })
              }
            />
            <label class="form-check-label" for="flexRadioDefault2">
              {" "}
              Business
            </label>
          </div>

          </div>
        </div>
      </div>
</div>

<div className='col-md-12'> 


      {/* new fields add start */}

      {form?.tax_classification === "business" && (
        <div className="mb-4">
          <label className='form-label certif_inst ' >
            Check appropriate box for federal tax classification of
            the person whose name is entered on line
          </label>

          <div className="checkbox_publish mt-2">
<label className='certif_inst'>  1. Check only one of the following seven boxes. </label>

          <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input mr-2"
                    checked={
                      form?.federal_text_classification ===
                      "individual"
                    }
                    onClick={(e) =>
                      setForm({
                        ...form,
                        federal_text_classification: "individual",
                      })
                    }
                  />
                  <label className="form-check-label" >
                    individual/sole propriertor or single-member LLC
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input mr-2"
                    checked={
                      form?.federal_text_classification ===
                      "c_corporation"
                    }
                    onClick={(e) =>
                      setForm({
                        ...form,
                        federal_text_classification: "c_corporation",
                      })
                    }
                  />
                  <label className="form-check-label"  >C Corporation</label  >
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input mr-2"
                    checked={
                      form?.federal_text_classification ===
                      "s_corporation"
                    }
                    onClick={(e) =>
                      setForm({
                        ...form,
                        federal_text_classification: "s_corporation",
                      })
                    }
                  />
                  <span>S Corporation</span>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input mr-2"
                    checked={
                      form?.federal_text_classification ===
                      "patnership"
                    }
                    onClick={(e) =>
                      setForm({
                        ...form,
                        federal_text_classification: "patnership",
                      })
                    }
                  />
                  
                  <label className="form-check-label"  >Patnership</label  >
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input  mr-2"
                    checked={
                      form?.federal_text_classification ===
                      "limited_liability"
                    }
                    onClick={(e) =>
                      setForm({
                        ...form,
                        federal_text_classification:
                          "limited_liability",
                      })
                    }
                  />
                 
                  <label className="form-check-label"  >Limited liability company. Enter the tax
                    classification (C=C Corporation, S=S Corporation,
                    P Patnership,){" "}</label  >
                </div>
         
            {sumitted && !form?.federal_text_classification && (
              <p className="text-danger">This field is required</p>
            )}
          </div>
        </div>
      )}

      {/* new fields add end */}

      <div className="mb-4">
        <label className="form-label certif_inst " >
          Tax Identity Information{" "}

        </label>
        {/* <p className='label_p'>This is themos important place to include keywords</p> */}

        <div className="row">
        
          {form?.tax_classification === "individual" && (
            <div className="col-md-6 ">
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInputss"
                placeholder="Name"
                value={form?.tax_name}
                onChange={(e) =>
                  setForm({ ...form, tax_name: e.target.value })
                }
                required
              />
              {sumitted && !form?.tax_name && (
                <p className="text-danger">This field is required</p>
              )}
            </div>
          )}

          {form?.tax_classification === "business" && (
            <>
              <div className="col-md-6 ">
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Doing business as “DBA” or trade name (optional)"
                  value={form?.trade_name}
                  onChange={(e) =>
                    setForm({ ...form, trade_name: e.target.value })
                  }
                />
                {sumitted && !form?.trade_name && (
                  <p className="text-danger">
                    This field is required
                  </p>
                )}
              </div>

              <div className="col-md-6 ">
                <input
                  type="text"
                  className="form-control phone_IN"
                  id="exampleFormControlInput1"
                  maxLength={10}
                  onKeyUp={function (e) {
                    var value = $(".phone_IN").val();
                    if (e.key.match(/[0-9]/) == null) {
                      value = value.replace(e.key, "");
                      setForm({
                        ...form,
                        ein: e.target.value,
                      });
                      return;
                    }

                    if (value.length == 2) {
                      setForm({
                        ...form,
                        ein: e.target.value + "-",
                      });
                    }
                  }}
                  placeholder="EIN"
                  value={form?.ein}
                  onChange={(e) =>
                    setForm({ ...form, ein: e.target.value })
                  }
                  required
                />
                {sumitted && !form?.ein && (
                  <p className="text-danger">
                    This field is required
                  </p>
                )}
              </div>
            </>
          )}

          {form?.tax_classification === "individual" && (
            <div className="col-md-6 ">
              <input
                type="text"
                className="form-control phone_us"
                id="exampleFormControlInput1"
                placeholder="Social Security Number"
                pattern="[A-Z]{2}-[A-Z0-9]{3}-[A-Z0-9]{3}"
                maxlength="11"
                onKeyUp={function (e) {
                  var value = $(".phone_us").val();
                  if (e.key.match(/[0-9]/) == null) {
                    value = value.replace(e.key, "");
                    setForm({
                      ...form,
                      social_security_number: e.target.value,
                    });
                    return;
                  }

                  if (value.length == 3) {
                    setForm({
                      ...form,
                      social_security_number: e.target.value + "-",
                    });
                  }
                  if (value.length == 6) {
                    setForm({
                      ...form,
                      social_security_number: e.target.value + "-",
                    });
                  }
                }}
                value={form?.social_security_number}
                onChange={(e) => {
                  setForm({
                    ...form,
                    social_security_number: e.target.value,
                  });
                  console.log(
                    form?.social_security_number.replaceAll("-", "")
                  );
                }}
              />
              {sumitted && !form?.social_security_number && (
                <p className="text-danger font_fix">This field is required</p>
              )}
            </div>
          )}
        </div>
      </div>

</div>

<div className='col-md-12'> 
<div className="mb-4">
        <label className='certif_inst'>
          I consent to sign my IRS Form W-9 electronically.{" "}

        </label>
        <div className="form-check">
          <input
            className="mr5 form-check-input"
            type="checkbox"
            id="consent"
            checked={form?.consent_agreed}
            onChange={(e) =>
              setForm({ ...form, consent_agreed: e.target.checked })
            }
          />
          <label className="label_p form-check-label">
            If you provide an electronic signature, you will be able
            to submit your tax information immediately.
          </label>
        </div>
      </div>

      <div className="formwrapper p-0">
      <div className="boxpublish certify_detials mb-3">
        <Label className='form-label certif_inst' >Under penalties of perjury, I certify that:</Label>
        <ol className='ul_listsbx'>
          <li className="no_list" >   The number shown on this form is my correct taxpayer
            identification number  (or I am waiting for a number to be issued to me), and </li>
          <li className="no_list" > {" "}
            by the Internal Revenue Service (IRS) that I am subject to
            ackup withholding as a result of a failure to report all
            interest or{" "} </li>
          <li className="no_list" >   I am a U.S. citizen or other U.S. person (defined in the
            instructions), and{" "} </li>
          <li className="no_list" > The FATCA code(s) entered on this form (if any) indicating
            that I am exempt from FATCA reporting is correct.{" "} </li>
         
        </ol>
      
       
        
       
      </div>

      <div className="text_git ">
        <h3 className='certif_inst'>
          Certification Instructions{" "}

        </h3>
        <p className="label_pbx label_font">
          You must cross out item 2 above if you have been notified by
          the IRS that you are currently subject to backup
          withholding. You will need to print out your hard copy form
          at the end of the interview and cross out item 2 before
          signing and mailing to the address provided. The Internal
          Revenue Service does not require your consent to any
          provision of this document other than the certifications
          required to avoid backup withholding.
        </p>
      </div>

      <div className="d-flex justify-content-between mt-3 align-items-center">
        <div className="">
          <div className=''>
            {/* <label>Signature</label> */}
            <div className="form-group drag_drop mb-0">
              <div className='upload_file set_upload_bx position-relative'>
                {!form?.signature && !imgLoder && <> <button className="btn btn-primary upload_image">Upload Signature</button>
                  <input type="file" className="form-control-file over_input" accept="images/*" multiple={true}
                    // disabled={loader}
                    onChange={(e) => {
                      setImgLoder(true)
                      uploadSignatureImage(e, 'images');
                    }} /></>}
                {loaderr && imgLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                {form?.signature && <div className="imagesRow position-relative mt-4">
                  <img className="signurimg" src={methodModel.noImg(form?.signature)} />
                  <i className="fa fa-times kliil" title="Remove" onClick={e => setForm({ ...form, signature: "" })}></i>
                </div>}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <input
            type="date"
            className="form-control"
            min={currentDate}
            value={form?.signature_date || ""}
            onChange={(e) =>
              setForm({ ...form, signature_date: e.target.value })
            }
          />
          {sumitted && !form?.signature_date && (
            <p className="text-danger font_fix">This field is required</p>
          )}
        </div>
      </div>
      <div className='col-md-12 '>
        <div className='mb-4 mt-5 text-right '>
        <button className='back-btns' onClick={() => back()}>Back</button>
        < button className='btn btn-primary login ml-3 ' onClick={(e) => handleSubmit(e)}>Save & Continue</button>
        </div>
      </div>
    </div>

</div>


</div>
  

  
  </div>
</div>
                    </div>

                  </div>

                </div>





              </div>
            </div>
          </div>
        </div>


      </Layout>
    </>
  );
}

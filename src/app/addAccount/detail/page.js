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

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  useEffect(() => {
    // setFormData({...formData,dialCode:'+1'})
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
    setFormData({ ...formData, [name]: fieldValue,});
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
    console.log('enter');
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
          id:user?.id,
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
            router.push(`/`)
          }
          // loader(false)
        })
        
      }
      loader(false)
    })
  }

  const getDetail = () => {
    ApiClient.get(`user/detail?id=${id}`).then(res => {
      if (res.success) {
        setFormData(res?.data)
      }
    })
  };

  // useEffect(() => {
  //   const storedData = localStorage.getItem("step3");
  //   const parsedData = storedData ? JSON.parse(storedData) : null;
  //   setFormData(parsedData)
  // }, [])

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Add Account"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-12'>

                <div className='card'>
                  <div className='card-body account_body '>

             
                  <div className='row'>
                      <div className='col-12 col-md-12 '>
                        <div className='dtls_head'>
                                <h3>Account Detail</h3>
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
                            <div className="form-group drag_drop">
                              <div className='upload_file '>
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
                                <div className="imagesRow  img-wrappper">
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
                              <div className='upload_file'>
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
                                  
                                  {suggestions?.map((suggestion) =>  {
                                    
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
              </div>
            </div>
          </div>
       

      </Layout>
    </>
  );
}

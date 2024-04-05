'use client'

import react, { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../components/global/layout';
import SelectDropdown from '@/app/components/common/SelectDropdown';
import ApiClient from '@/methods/api/apiClient';
import { useParams, useRouter } from 'next/navigation';
import loader from '@/methods/loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

export default function StageLastStep() {
  const { id } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    addUser: false,
    firstName: '',
    lastName: '',
    status: '',
    title: '',
    email: '',
    mobileNo: '',
    // work_phone: '',
    language: '',
    // time_zone: '',
    currency: 'usd',
    instant_messaging: '',
    password: '',
    dialCode: '',
    sendActivationEmail: false,
    cellDialCode: "",
    isSetPasswordManually: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });
  const [submitted, setSubmitted] = useState(false)
  const [step1, setStep1] = useState(null)
  const [step2, setStep2] = useState(null)
  const [step3, setStep3] = useState(null)
  const [isLoader, setisLoader] = useState(false)

  const handleGoBack = () => {
    router.push(`/affiliate-form/StageSecStep`)
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name == 'mobileNo' && value?.length > 11) {
      return
    }
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  }

  useEffect(() => {
    const storedData1 = localStorage.getItem("stepFirst");
    const parsedData1 = storedData1 ? JSON.parse(storedData1) : null;
    const storedData2 = localStorage.getItem("step2");
    const parsedData2 = storedData2 ? JSON.parse(storedData2) : null;
    const storedData3 = localStorage.getItem("step3");
    const parsedData3 = storedData3 ? JSON.parse(storedData3) : null;
    setStep1(parsedData1)
    setStep2(parsedData2)
    setStep3(parsedData3)
  }, [])

  useEffect(() => {
    if (!formData?.dialCode) {
      setFormData((prevForm) => ({ ...prevForm, dialCode: '+1' }));
    }
  }, [formData?.dialCode]);

  useEffect(() => {
    if (!formData?.cellDialCode) {
      setFormData((prevForm) => ({ ...prevForm, cellDialCode: '+1' }));
    }
  }, [formData?.cellDialCode]);

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
    return emailRegex.test(email);
  }

  const handleSave = async () => {

    if (formData.isSetPasswordManually) {
      if (!formData.password || formData.password.length < 8) {
        setPasswordError('Password must be at least 8 characters');
        return;
      }
    }

    if (formData.isSetPasswordManually) {
      if (formData.password !== formData.confirmpassword) {
        setConfirmPasswordError('Passwords do not match');
        return;
      }
    }

    if (!isValidEmail(formData?.email)) {
      setSubmitted(true);
      return;
    }

    if (!formData?.firstName || !formData?.lastName || !formData?.title || !formData?.language || !formData?.instant_messaging) {
      setSubmitted(true)
      return;
    }
    setisLoader(true)
    // loader(true)
    const deviceToken = localStorage.getItem("device_token");
    const device_token = deviceToken ? deviceToken : '';

    try {
      const data = {
        id: id,
        role: "affiliate",
        firstName: formData?.firstName,
        email: formData?.email,
        lastName: formData?.lastName,
        title: formData?.title,
        // time_zone: formData?.time_zone,
        mobileNo: formData?.mobileNo,
        // work_phone: formData?.work_phone,
        instant_messaging: formData?.instant_messaging,
        language: formData?.language,
        isSendActivationEmail: formData?.sendActivationEmail,
        dialCode: formData?.dialCode,
        currency: formData?.currency,
        cellDialCode: formData?.cellDialCode,
        password: formData?.password,
        createdByBrand: step1?.createdByBrand,
        refferedBy: step1?.referredBy,
        labels: step1?.labels,
        status: step1?.status,
        currency: step1?.currency,
        affiliate_group: step1?.affiliate_group,
        isSetPasswordManually: step1?.isSetPasswordManually,
        reffering_affiliate: step1?.reffering_affiliate,
        affiliate_code: step1?.affiliate_code,
        ...step2,
        billing_frequency: step3?.billing_frequency,
        payment_method: step3?.payment_method,
        tax_detail: step3?.tax_detail,
        device_token:device_token
        // ...step3,
        // isSetPasswordManually: formData?.setPasswordManually ,
      }
      if (!step1?.affiliate_group) {
        delete data?.affiliate_group
      }

      if (!step1?.affiliate_code) {
        delete data?.affiliate_code
      }

      if (!step1?.referredBy) {
        delete data?.refferedBy
      }

      if (!formData?.isSetPasswordManually) {
        delete data?.password
      }
      // delete data?.currency
      delete step1?.firstName;
      // const mobileData = `${formData?.dialCode}${formData?.mobileNo}`
      
      ApiClient.post('add/user', data).then(res => {
        if (res?.success) {
          toast.success(res?.message)
          router.push(`/affiliate`)
          // let userId = res?.data?.id
          // const data1 = {
          //   "email": formData?.email,
          //   "accountholder_name": step3.accountholder_name,
          //   "routing_number": step3.routing_number,
          //   "account_number": step3.account_number,
          //   "first_name": formData?.firstName,
          //   "last_name": formData?.lastName,
          //   "mobile": mobileData,
          //   "ssn_number": step3.ssn_number,
          //   "address": {
          //     "line1": step2?.address,
          //     "city": step2?.city,
          //     "state": step2?.state,
          //     "postal_code": step2?.pincode
          //   },
          //   "dob": step3?.dob,
          //   "company_name": step3?.company_name,
          //   "frontdoc": step3?.frontDoc,
          //   "backdoc": step3?.backDoc,
          //   "user_id":userId
          // }
          // ApiClient.post('bank', data1).then(res => {
          //   if (res.success == true) {
          //     localStorage.removeItem('stepFirst');
          //     localStorage.removeItem('step2');
          //     localStorage.removeItem('step3');
          //     router.push(`/affiliate`)
          //   } else {
          //     ApiClient.delete(`destroy/user?id=${userId}`).then(res => {
          //       if (res.success) {
          //         toast.error("Affiliate cannot Created...")
          //       }
          //       loader(false)
          //     })
          //   }
          //   setisLoader(false)
          // })

        } 
        setisLoader(false)
        // else {
        //   setisLoader(false)
        // }
      })


    } catch (error) {
      // Handle errors if the request fails
      console.error('Error sending data:', error);
    }
  }

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5'>
          <div className='container-fluid'>
            <div className='row mx-0'>
              <div className='col-md-12'>
                <div className='d-flex align-items-center'>
                  <button className='genral-buttons' onClick={()=> router.push(`/affiliate-form/StageFirstStep`)}><span className="rank mr-2">01</span>General</button>
                  <button className='genral-buttons ml-3' onClick={()=> router.push(`/affiliate-form/StageSecStep`)}><span className="rank mr-2">02</span>Address</button>
                  <button className='genral-buttons ml-3' onClick={()=> router.push(`/affiliate-form/taxSection`)}><span className="rank mr-2">03</span> Tax Detail</button>
                  <button className='genral-buttons ml-3' onClick={()=> router.push(`/affiliate-form/StageLastStep`)}><span className="rank mr-2">03</span>User</button>
                </div>
              </div>
            </div>

            {!isLoader ? <div className='row'>
              <div className='col-lg-12'>

                <div className=' '>
                  <div className='row mt-4 mx-0'>
                  </div>
                  <div className='row mx-0 mt-4'>
                    <div className='col-md-3'>
                      <div class="form-group">
                        <label className='label-set' >First Name <span className="star">*</span> </label>
                        <input type="text" placeholder='Your First Name' className="form-control " id="exampleFormControlInput1" value={formData.firstName}
                          name="firstName" onChange={handleInputChange} />
                        {submitted && !formData?.firstName ? <div className="invalid-feedback d-block">FirstName is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div class="form-group">
                        <label className='label-set' >Last Name <span className="star">*</span> </label>
                        <input type="text" placeholder='Your Last Name' className="form-control " id="exampleFormControlInput1" name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange} />
                        {submitted && !formData?.lastName ? <div className="invalid-feedback d-block">LastName is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Status  </label>

                        <SelectDropdown
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="select"
                          intialValue={formData?.status}

                          result={e => { setFormData({ ...formData, status: e.value }) }}
                          options={[
                            { id: 'active', name: 'Active' },
                            { id: 'deactive', name: 'Deactive' },
                          ]}
                        />
                      </div>
                    </div>

                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Title<span className="star">*</span>  </label>
                        <input type="text" placeholder='Title' className="form-control " id="exampleFormControlInput1" name="title"
                          value={formData.title}
                          onChange={handleInputChange} />
                        {submitted && !formData?.title ? <div className="invalid-feedback d-block">Title is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Cell Phone  </label>
                        <div className="phoneInput main-no">
                          <div className='dailCode phn-code'>
                            <PhoneInput
                              international
                              country="US"
                              inputProps={{
                                disabled: true
                              }}
                              value={formData?.cellDialCode}
                              className="input_number bg_none disable_white"
                              onChange={phone => setFormData({ ...formData, cellDialCode: phone })}
                              readOnly={true}
                              placeholder="+1"
                              enableSearch
                            />
                          </div>
                          <input type="number" className="form-control overlap_mobile" id="exampleFormControlInput1" name="mobileNo"
                            value={formData.mobileNo} autoComplete="off"
                            onChange={handleInputChange} />
                        </div>

                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Email<span className="star">*</span></label>
                        <input
                          type="email"
                          placeholder='Your Email'
                          className="form-control "
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {submitted && !isValidEmail(formData?.email) ? <div className="invalid-feedback d-block">Email is not Valid</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Language<span className="star">*</span>  </label>
                        <SelectDropdown
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="select"

                          intialValue={formData?.language}
                          result={e => { setFormData({ ...formData, language: e.value }) }}
                          options={[
                            { id: 'english', name: 'English' },
                            // { id: 'hindi', name: 'Hindi' },
                          ]}
                        />
                        {submitted && !formData?.language ? <div className="invalid-feedback d-block">Language is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Currency  </label>
                        <input type="text" placeholder='Enter Currency' name="currency"
                          className="form-control "
                          value={formData?.currency}
                          onChange={handleInputChange} disabled></input>
                      </div>
                    </div>

                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Instant Messaging<span className="star">*</span>  </label>
                        <SelectDropdown
                          id="statusDropdown"
                          displayValue="name"

                          placeholder="select"
                          intialValue={formData?.instant_messaging}
                          result={e => { setFormData({ ...formData, instant_messaging: e.value }) }}
                          options={[
                            { id: 'yes', name: 'Yes' },
                            { id: 'no', name: 'No' },
                          ]}
                        />
                        {submitted && !formData?.instant_messaging ? <div className="invalid-feedback d-block">InstantMessaging is Required</div> : <></>}
                      </div>
                    </div>

                    <div className='col-md-6 mt-3'>
                      <p className='mb-0'><label className='label-set'>Send Activation email account creation </label></p>
                      <input type="checkbox" name="sendActivationEmail"
                        checked={formData.sendActivationEmail}

                        onChange={handleInputChange}
                        className="checkbox-custom d-block"></input>
                    </div>

                    <div className='col-md-6'>
                      <div className='form-group'>
                        <label className='label-set'>Set Password Manually <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label>
                        <input type="checkbox" name="isSetPasswordManually" className='checkbox-custom d-block'
                          checked={formData.isSetPasswordManually}
                          onChange={handleInputChange}></input>
                      </div>
                    </div>

                    {formData.isSetPasswordManually && <div className='col-md-6 '>
                      <div className='form-group'>
                        <label className='label-set'>Password <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label>
                        <input type={eyes.password ? 'text' : 'password'} placeholder='Set Password' name="password" className="form-control position-relative "
                          checked={formData.password}
                          onChange={handleInputChange}></input>
                        <div className='eye-icon-m'>
                          <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
                        </div>
                      </div>
                      {passwordError && formData.password.length < 8 && <div className="text-danger">{passwordError}</div>}
                    </div>}

                    {formData.isSetPasswordManually && <div className='col-md-6 '>
                      <div className='form-group'>
                        <label className='label-set'>Confirm Password <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label>
                        <input placeholder='Confirm Name' type={eyes.confirmPassword ? 'text' : 'password'} name="confirmpassword" className="form-control "
                          checked={formData.confirmpassword}
                          onChange={handleInputChange}></input>
                        <div className='eye-icon-m'>
                          <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
                        </div>
                      </div>
                      {confirmPasswordError && formData.password !== formData.confirmpassword && (
                        <div className="text-danger">{confirmPasswordError}</div>
                      )}
                    </div>}

                    <div className='col-md-12 mt-4 mb-2'>
                      <button className='back-btns' onClick={handleGoBack}>Back</button>
                      < button className='btn btn-primary login ml-3 ' onClick={handleSave}>Save & Continue</button>
                    </div>

                  </div>

                </div>

              </div>
            </div> : <div className="text-center py-4">
              <img src="/assets/img/loader.gif" className="pageLoader" />
            </div>
            }
          </div>
        </div>

      </Layout>
    </>
  );
}

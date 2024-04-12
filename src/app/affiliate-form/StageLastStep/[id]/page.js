'use client'

import react, { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../../components/global/layout';
import SelectDropdown from '@/app/components/common/SelectDropdown';
import ApiClient from '@/methods/api/apiClient';
import { useParams, useRouter } from 'next/navigation';
import loader from '@/methods/loader';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
  const [loadera,setLoader]=useState(false)

  const handleGoBack = () => {
    router.push(`/affiliate-form/StageSecStep/${id}`)
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  }

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

  const handleSave = async () => {

    if (!formData?.firstName || !formData?.lastName || !formData?.title || !formData?.language || !formData?.instant_messaging) {
      setSubmitted(true)
      return;
    }

    setLoader(true)
    try {
      const data = {
        id: id,
        firstName: formData?.firstName,
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
        isSetPasswordManually: formData?.isSetPasswordManually ,
      }
      delete data?.currency
      ApiClient.put('edit/profile', data).then(res => {

        if (res.success == true) {
          router.push(`/affiliate`)
        }
        setLoader(false)
      })
    } catch (error) {
      // Handle errors if the request fails
      console.error('Error sending data:', error);
    }
  }

  const getDetail = () => {
    // loader(true)
    ApiClient.get(`user/detail?id=${id}`).then(res => {
      if (res.success) {
        setFormData(res?.data)
      }
      // loader(false)
    })
  };

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5'>
          <div className='container-fluid'>
            <div className='row mx-0'>
              <div className='col-md-12'>
                <div className='d-flex align-items-center'>
                  <button className='genral-buttons'><span className="rank mr-2">01</span>General</button>
                  <button className='genral-buttons ml-3'><span className="rank mr-2">02</span>Address</button>
                  <button className='genral-buttons ml-3'><span className="rank mr-2">03</span>Tax Detail</button>
                  <button className='genral-buttons ml-3'><span className="rank mr-2">04</span>User</button>
                </div>
              </div>
            </div>

            {!loadera ? <div className='row'>
              <div className='col-lg-12'>

                <div className=' '>
                  <div className='row mt-4 mx-0'>
                    {/* <div className='col-md-12'>


               <div className='form-group'>
               <p className='mb-0'><label className='label-set'>Add User </label></p>
                <input
                  type="checkbox"
                  name="addUser"
                  checked={formData.addUser}
                  
                  onChange={handleInputChange}
                  className="checkbox-custom d-block"
                /> </div> </div> */}
                  </div>
                  <div className='row mx-0 mt-4'>
                    <div className='col-md-3'>
                      <div class="form-group">
                        <label className='label-set' >First Name<span className="star">*</span>  </label>
                        <input type="text" className="form-control " id="exampleFormControlInput1" value={formData.firstName}
                          name="firstName" onChange={handleInputChange} />
                        {submitted && !formData?.firstName ? <div className="invalid-feedback d-block">FirstName is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-3'>
                      <div class="form-group">
                        <label className='label-set' >Last Name<span className="star">*</span>  </label>
                        <input type="text" className="form-control " id="exampleFormControlInput1" name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange} />
                        {submitted && !formData?.lastName ? <div className="invalid-feedback d-block">LastName is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Status  </label>
                        {/* <select class="form-select " aria-label="Default select example" name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option selected>Select</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select> */}

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
                        <input type="text" className="form-control " id="exampleFormControlInput1" name="title"
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
                              value={formData?.cellDialCode}
                              className="input_number "
                              onChange={phone => setFormData({ ...formData, cellDialCode: phone })}
                              readOnly={true}
                              placeholder="+1"
                              enableSearch
                            />
                          </div>
                          <input type="text" className="form-control overlap_mobile" id="exampleFormControlInput1" name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleInputChange} />
                        </div>

                      </div>
                    </div>

                    {/* <div className="col-md-6 inputFlex">
                      <label className='label-set'>Work Phone  </label>
                      <div>
                        <div className="phoneInput main-no ">
                          <div className='dailCode phn-code '>
                            <PhoneInput
                              international
                              country="US"
                              value={formData?.dialCode}
                              className="input_number"
                              onChange={phone => setFormData({ ...formData, dialCode: phone })}
                              readOnly={true}
                              placeholder="+1"
                              enableSearch
                            />
                          </div>
                          <input
                            type="text"
                            name='work_phone'
                            className="form-control overlap_mobile"
                            placeholder=''

                            value={formData && formData.work_phone}
                            minLength="10"
                            maxLength={12}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div></div> */}
                      <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled
                        />
   {/* {submitted && !isValidEmail(formData?.email) ? <div className="invalid-feedback d-block">Email is not valid</div> : <></>} */}
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

                    {/* <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Time Zone  </label>
                        <SelectDropdown
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="select"
                          intialValue={formData?.time_zone}

                          result={e => { setFormData({ ...formData, time_zone: e.value }) }}
                          options={[
                            { id: 'eastern Time Zone ', name: 'Eastern Time Zone ' },
                            { id: 'central Time Zone', name: 'Central Time Zone' },
                          ]}
                        />
                        {submitted && !formData?.time_zone ? <div className="invalid-feedback d-block">TimeZone is Required</div> : <></>}
                      </div>
                    </div> */}
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Currency</label>
                        <input type="text" name="currency"
                          className="form-control "
                          value={formData?.currency || 'usd'}
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
                        <input type={eyes.password ? 'text' : 'password'} name="password" className="form-control position-relative "
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
                        <input type={eyes.confirmPassword ? 'text' : 'password'} name="confirmpassword" className="form-control "
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
                    < button className='btn btn-primary login ' onClick={handleSave}>Save & Continue</button>
                    </div>

                  </div>

                </div>

              </div>
            </div>:
             <div className="text-center py-4">
             <img src="/assets/img/loader.gif" className="pageLoader" />
         </div>
            }
          </div>
        </div>

      </Layout>
    </>
  );
}

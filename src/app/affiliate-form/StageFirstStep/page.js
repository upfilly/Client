'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../components/global/layout';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import SelectDropdown from '@/app/components/common/SelectDropdown';
import crendentialModel from '@/models/credential.model';

export default function StageFirstStep() {
  const router = useRouter()
  const user = crendentialModel.getUser()
  const [accountExecutive, setAccountExecutive] = useState([])
  // const [passwordError, setPasswordError] = useState('');
  const [submitted, setSubmitted] = useState(false)
  const [partnerManager, setPartnerManager] = useState([])
  const [affiliateGroup, setAffiliategroup] = useState([])
  // const [confirmPasswordError, setConfirmPasswordError] = useState('');
  // const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });
  const [formData, setFormData] = useState({
    firstName: '',
    // email: '',
    // parter_manager_id: '',
    // account_executive_id: '',
    reffering_affiliate: user?.email,
    affiliate_code: '',
    // referredBy: '',
    labels: '',
    status: '',
    // currency:'usd',
    // allow_notification: false,
    // is_enable_mediacost: false,
    affiliate_group: "",
    // password: "",
    confirmpassword: "",
  });


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'affiliate_code' && value.length > 12) {
      return;
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = () => {

    if (!formData?.firstName || !formData?.status) {
      setSubmitted(true)
      return;
    }

    // loader(true)

    const data = {
      role: "affiliate",
      createdByBrand: user?.id,
      // email: formData?.email,
      firstName: formData?.firstName,
      // parter_manager_id: formData?.parter_manager_id,
      // account_executive_id: formData?.account_executive_id,
      // refferedBy: formData?.referredBy,
      labels: formData?.labels,
      status: formData?.status,
      // currency: formData?.currency,
      // allow_notification: formData?.allow_notification,
      // is_enable_mediacost: formData?.is_enable_mediacost,
      affiliate_group: formData?.affiliate_group,
      isSetPasswordManually: formData?.isSetPasswordManually,
      // password: formData?.password,
      reffering_affiliate: formData?.reffering_affiliate,
      affiliate_code: formData?.affiliate_code,
    }

    // if (!formData?.affiliate_group) {
    //   delete data?.affiliate_group
    // }

    // if (!formData?.affiliate_code) {
    //   delete data?.affiliate_code
    // }

    // if (!formData?.referredBy) {
    //   delete data?.refferedBy
    // }

    // if (!formData?.isSetPasswordManually) {
    //   delete data?.password
    // }

       localStorage.setItem("stepFirst",JSON.stringify(data))
    // ApiClient.post('add/user', data).then(res => {

    //   if (res.success == true) {
        router.push(`/affiliate-form/StageSecStep`)
      // }
    //   loader(false)
    // })
  }

  const handleAccountExecutive = () => {

    ApiClient.get('users/list', { role: "accountExecutive" }).then(res => {

      if (res.success == true) {
        setAccountExecutive(res?.data?.data)
      }
    })
  }

  const handlePartnerManager = () => {

    ApiClient.get('users/list', { role: "parterManager" }).then(res => {

      if (res.success == true) {
        setPartnerManager(res?.data?.data)
      }
    })
  }

  const handleAffiliateGroup = () => {

    ApiClient.get('affiliate-groups', { status: "active" }).then(res => {

      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  useEffect(() => {
    handleAccountExecutive()
    handlePartnerManager()
    handleAffiliateGroup()
  }, [])

  useEffect(() => {
    const storedData = localStorage.getItem("stepFirst");
    const parsedData = storedData ? JSON.parse(storedData) : formData;
    setFormData(parsedData)
  }, [])




  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5'>
          <div className='container-fluid'>
            <div className='row mx-0'>
              <div className='col-md-8'>
                <div className='d-flex align-items-center'>
                  <button className='genral-buttons'><span className="rank mr-2">01</span>General</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">02</span>Address</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">03</span> Tax Detail</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">04</span>User</button>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-lg-12'>
                <div className=''>
                  <div className='row mx-0 mt-4'>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Name<span className="star">*</span> </label>
                        <input
                          type="text"
                          placeholder='Your Name'
                          className="form-control "
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
       {submitted && !formData?.firstName ? <div className="invalid-feedback d-block">Name is Required</div> : <></>}
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Email</label>
                        <input
                          type="email"
                          className="form-control "
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
   {submitted && !isValidEmail(formData?.email) ? <div className="invalid-feedback d-block">Email is Required</div> : <></>}
                      </div>
                    </div> */}
                    {/* <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>partner Manager </label>
                        <SelectDropdown                                                     theme='search'
                          id="statusDropdown"
                          displayValue="fullName"
                          placeholder="select"
                          intialValue={formData?.parter_manager_id}
                          result={e => { setFormData({ ...formData, parter_manager_id: e.value }) }}
                          options={partnerManager}
                        />
      {submitted && !formData?.parter_manager_id ? <div className="invalid-feedback d-block">PartnerManager is Required</div> : <></>}
                      </div>
                    </div> */}
                    {/* <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Account Executive </label>
                        <SelectDropdown                                                     theme='search'
                          id="statusDropdown"
                          displayValue="fullName"
                          placeholder="select"
                          intialValue={formData?.account_executive_id}
                          result={e => { setFormData({ ...formData, account_executive_id: e.value }) }}
                          options={accountExecutive}
                        />
            {submitted && !formData?.account_executive_id ? <div className="invalid-feedback d-block">Account Executive is Required</div> : <></>}
                      </div>
                    </div> */}
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Affilate Group </label>
                        <SelectDropdown                                                     theme='search'
                          id="statusDropdown"
                          displayValue="group_name"
                          placeholder="select"
                          intialValue={formData?.affiliate_group}
                          result={e => { setFormData({ ...formData, affiliate_group: e.value }) }}
                          options={affiliateGroup}
                        />
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Referred By </label>
                        <SelectDropdown                                                     theme='search'
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="select"
                          intialValue={formData?.referredBy}
                          result={e => { setFormData({ ...formData, referredBy: e.value }) }}
                          options={[
                            { id: 'active', name: 'Active' },
                            { id: 'deactive', name: 'Deactive' },
                          ]}
                        />
                      </div>
                    </div> */}
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Labels </label>
                        <input
                          type="text"
                          placeholder='Label'
                          className="form-control "
                          id="labels"
                          name="labels"
                          value={formData.labels}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Reffering Affiliate </label>
                        <input
                          type="text"
                          className="form-control "
                          id="reffering_affiliate"
                          name="reffering_affiliate"
                          value={formData.reffering_affiliate}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Affiliate Code </label>
                        <input
                          type="text"
                          placeholder='Your Unique Code'
                          className="form-control "
                          id="affiliate_code"
                          name="affiliate_code"
                          value={formData.affiliate_code}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Status<span className="star">*</span></label>
                        <SelectDropdown                                                     theme='search'
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="select"
                          className=" form-control"
                          intialValue={formData?.status}
                          result={e => { setFormData({ ...formData, status: e.value }) }}
                          options={[
                            { id: 'active', name: 'Active' },
                            { id: 'deactive', name: 'Deactive' },
                          ]}
                        />
             {submitted && !formData?.status ? <div className="invalid-feedback d-block">Status is Required</div> : <></>}
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Currency </label>
                        <input
                          type="text"
                          className="form-control "
                          placeholder='Currency'
                          id="currency"
                          name="currency"
                          value={formData?.currency}
                          onChange={handleInputChange}
                          disabled
                        />
                      </div>
                    </div> */}
                    {/* <div className='col-md-6'>
                      <div className='form-group'>
                        <label className='label-set'>
                          Allow partner to receive notifications
                        </label>
                        <input
                          type="checkbox"
                          id="allow_notification"
                          name="allow_notification"
                          className='checkbox-custom d-block'
                          checked={formData.allow_notification}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div> */}
                    {/* <div className='col-md-6'>
                      <div className='form-group'>
                        <label className='label-set'>
                          Enable media cost / payouts in tracking links
                        </label>
                        <input
                          type="checkbox"
                          id="is_enable_mediacost"
                          className='checkbox-custom d-block'
                          name="is_enable_mediacost"
                          checked={formData.is_enable_mediacost}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div> */}

                    <div className='col-md-12 mt-4 mb-2'>
                      <button className='btn btn-primary p-2' onClick={handleSave}>Save & Continue</button>
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

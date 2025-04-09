'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../../components/global/layout';
import { useParams, useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import SelectDropdown from '@/app/components/common/SelectDropdown';
import loader from '@/methods/loader';
import crendentialModel from '@/models/credential.model';

export default function StageFirstStep() {
  const user = crendentialModel.getUser()
  const { id } = useParams()
  const router = useRouter()
  const [accountExecutive, setAccountExecutive] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [partnerManager, setPartnerManager] = useState([])
  const [affiliateGroup, setAffiliategroup] = useState([])
  const [loadera, setLoader] = useState(false)
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
    currency: 'usd',
    // allow_notification: false,
    // is_enable_mediacost: false,
    affiliate_group: "",
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

    // if(!formData?.firstName || !formData?.email || !formData?.partnerManager || !formData?.accountExecutive){
    //   setSubmitted(true)
    //   return 
    // }

    setLoader(true)
    let data;
    if (id) {
      data = {
        id: id,
        // email: formData?.email,
        firstName: formData?.firstName,
        // parter_manager_id: formData?.parter_manager_id,
        // account_executive_id: formData?.account_executive_id,
        // refferedBy: formData?.referredBy,
        affiliate_group: formData?.affiliate_group,
        labels: formData?.labels,
        status: formData?.status,
        currency: formData?.currency,
        // allow_notification: formData?.allow_notification,
        // is_enable_mediacost: formData?.is_enable_mediacost,
        reffering_affiliate: formData?.reffering_affiliate,
        affiliate_code: formData?.affiliate_code,
      }
    } else {
      data = {
        role: "affiliate",
        // email: formData?.email,
        firstName: formData?.firstName,
        parter_manager_id: formData?.parter_manager_id,
        account_executive_id: formData?.account_executive_id,
        // refferedBy: formData?.refferedBy,
        labels: formData?.labels,
        status: formData?.status,
        currency: formData?.currency,
        affiliate_group: formData?.affiliate_group,
        is_enable_mediacost: formData?.is_enable_mediacost,
      }
    }
    delete data?.reffering_affiliate
    delete data?.currency
    delete data?.affiliate_code
    if (id) {
      ApiClient.put('edit/profile', data).then(res => {

        if (res.success == true) {
          router.replace(`/affiliate-form/StageSecStep/${id}`)
        }
        setLoader(false)
      })
    } else {
      ApiClient.replace('register', data).then(res => {

        if (res.success == true) {
          router.push(`/affiliate-form/StageSecStep/${res?.data?.id}`)
        }
        loader(false)
      })
    }
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

  const getDetail = () => {
    // loader(true)
    ApiClient.get(`user/detail?id=${id}`).then(res => {
      if (res.success) {
        setFormData(res?.data)
      }
      // loader(false)
    })
  };

  const handleAffiliateGroup = () => {

    ApiClient.get('affiliate-groups', { status: "active" }).then(res => {

      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [])

  useEffect(() => {
    handleAccountExecutive()
    handlePartnerManager()
    handleAffiliateGroup()
  }, [])

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5'>
          <div className='container-fluid'>
            <div className='row mx-0'>
              <div className='col-md-12'>
                <div className='d-flex align-items-center'>
                  <button className='genral-buttons'><span className="rank mr-2">01</span>General</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">02</span>Address</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">03</span> Tax Detail</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">04</span>User</button>
                </div>
              </div>
            </div>{!loadera ? <><div className='row'>
              <div className='col-lg-12'>
                <div className=''>
                  <div className='row mx-0 mt-4'>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Name </label>
                        <input
                          type="text"
                          className="form-control "
                          id="firstName"
                          name="firstName"
                          value={formData?.firstName}
                          onChange={handleInputChange}
                          disabled />
                        {submitted && !formData?.firstName ? <div className="invalid-feedback d-block">Name is Required</div> : <></>}
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
      <div className="form-group">
        <label className='label-set'>Email </label>
        <input
          type="email"
          className="form-control "
          id="email"
          disabled
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
        />
{submitted && !formData?.email ? <div className="invalid-feedback d-block">Email is Required</div> : <></>}
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
    </div>
    <div className='col-md-6'>
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
                          result={e => { setFormData({ ...formData, affiliate_group: e.value }); }}
                          options={affiliateGroup} />
                        {submitted && !formData?.affiliate_group ? <div className="invalid-feedback d-block">Affiliate group is Required</div> : <></>}
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
                        <div className="form-group">
                          <label className='label-set'>Referred By </label>
                          <SelectDropdown                                                     theme='search'
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="select"
                            intialValue={formData?.refferedBy}
                            result={e => { setFormData({ ...formData, refferedBy: e.value }); } }
                            options={[
                              { id: 'active', name: 'Active' },
                              { id: 'deactive', name: 'Deactive' },
                            ]} />
                        </div>
                      </div> */}
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
                          disabled />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Affiliate Code </label>
                        <input
                          type="text"
                          className="form-control "
                          id="affiliate_code"
                          name="affiliate_code"
                          value={formData.affiliate_code}
                          onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Labels </label>
                        <input
                          type="text"
                          className="form-control "
                          id="labels"
                          name="labels"
                          value={formData?.labels}
                          onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className="form-group">
                        <label className='label-set'>Status </label>
                        <SelectDropdown                                                     theme='search'
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="select"
                          intialValue={formData?.status}
                          result={e => { setFormData({ ...formData, status: e.value }); }}
                          options={[
                            { id: 'active', name: 'Active' },
                            { id: 'deactive', name: 'Deactive' },
                          ]} />
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
                        <div className="form-group">
                          <label className='label-set'>Currency </label>
                          <input
                            type="text"
                            className="form-control "
                            id="currency"
                            name="currency"
                            value={formData?.currency}
                            onChange={handleInputChange}
                            disabled />
                        </div>
                      </div> */}
                    {/* <div className='col-md-6'>
     <div className="form-group">
     <label className='label-set'>
        Allow partner to receive notifications
      </label>
      <input
        type="checkbox"
        id="allow_notification"
        name="allow_notification"
        className='checkbox-custom d-block'
        checked={formData?.allow_notification}
        onChange={handleInputChange}
      />
     </div>
    </div>
    <div className='col-md-6'>
     <div className='form-group'>
     <label className='label-set'>
        Enable media cost / payouts in tracking links
      </label>
      <input
        type="checkbox"
        id="is_enable_mediacost"
        name="is_enable_mediacost"
        className='checkbox-custom d-block'
        checked={formData?.is_enable_mediacost}
        onChange={handleInputChange}
      />
     </div>
    </div> */}

                    <div className='col-md-12 mt-4 mb-2'>
                      <button className='btn btn-primary' onClick={handleSave}>Save & Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div></> : <div className="text-center py-4">
              <img src="/assets/img/loader.gif" className="pageLoader" />
            </div>}
          </div>
        </div>

      </Layout>
    </>
  );
}

'use client'

import react, { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../../components/global/layout';
import { useParams, useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';

export default function StageThirdStep() {
  const { id } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    // auto_invoice: false,
    // is_hide_invoice: false,
    billing_frequency: '',
    payment_method: '',
    tax_detail: '',
    // default_invoice_setting: '',
  });
  const [submitted, setSubmitted] = useState(false)
  const [loadera,setLoader]=useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
  }


  const handleSave = () => {
    if (!formData?.billing_frequency || !formData?.payment_method ) {
      setSubmitted(true)
      return
    }
    setLoader(true)
    const data = {
      id: id,
      // auto_invoice: formData?.auto_invoice,
      // is_hide_invoice: formData?.is_hide_invoice,
      billing_frequency: formData?.billing_frequency,
      payment_method: formData?.payment_method,
      tax_detail: formData?.tax_detail,
      // default_invoice_setting: formData?.default_invoice_setting,
    }
    ApiClient.put('edit/profile', data).then(res => {

      if (res.success == true) {
        router.push(`/affiliate-form/StageLastStep/${id}`)
      }
      setLoader(false)
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

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [])

  const handleGoBack = () => {
    router.back();
  };

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
                  {/* <button className='genral-buttons ml-3'><span className="rank mr-2">03</span>Billing</button> */}
                  <button className='genral-button ml-3'><span className="ranks mr-2">04</span>User</button>
                </div>
              </div>
            </div>


            {!loadera ? <div className='row'>
              <div className='col-lg-12'>
                <div className=''>
                  <div className='row mt-2 mx-0'>
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
                    <div className='col-md-6'>


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
                  <div className='row mx-0 '>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Billing Frequency <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                        <select class="form-select " aria-label="Default select example" value={formData.billing_frequency} name='billing_frequency'
                          onChange={handleInputChange}>
                          <option selected>Select</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        {submitted && !formData?.billing_frequency ? <div className="invalid-feedback d-block">Billing is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Payment Method <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                        <select disabled class="form-select " aria-label="Default select example" name='payment_method' value={formData?.payment_method}
                          onChange={handleInputChange}>
                          <option selected>Select</option>
                          <option value="stripe">Stripe</option>
                          <option value="account detail">Account detail</option>
                        </select>
                        {submitted && !formData?.payment_method ? <div className="invalid-feedback d-block">Payment method is Required</div> : <></>}
                      </div>
                    </div>


                    <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Tax Details <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                        <input type="text" className="form-control " id="tax_detail" name="tax_detail" value={formData.tax_detail}
                          onChange={handleInputChange} />
                      </div>
                    </div>
                    {/* <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Default Invoice Settings <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                        <input type="text" className="form-control " id="exampleFormControlInput1" name="default_invoice_setting" value={formData.default_invoice_setting}
                          onChange={handleInputChange} />
                        {submitted && !formData?.default_invoice_setting ? <div className="invalid-feedback d-block">Default Invoice is Required</div> : <></>}
                      </div>
                    </div> */}

                    <div className='col-md-12 mt-4 mb-2'>
                      <button className='back-btns' onClick={handleGoBack}>Back</button>
                      < button className='btn btn-primary login ml-3' onClick={handleSave}>Save & Continue</button>
                    </div>

                  </div>
                </div>
              </div>
            </div> :
           <div className="text-center py-4">
                    <img src="/assets/img/loader.gif" className="pageLoader" />
                </div>}
          </div>
        </div>

      </Layout>
    </>
  );
}

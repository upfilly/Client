'use client'

import react, { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../components/global/layout';
import { useParams, useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function StageThirdStep() {
  const { id } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    // auto_invoice: false,
    // is_hide_invoice: false,
    billing_frequency: '',
    payment_method: '',
    tax_detail: '',
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: '',
    company_name: "",
    // front_image:"",
    // back_image:""
    // default_invoice_setting: '',
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

  const imageUrl = image.map((itm) => itm?.url)
  const docUrl = doc.map((itm) => itm?.url)

  // useEffect(() => {
  //   setFormData({ ...formData, front_image: imageUrl })
  //   setFormData({ ...formData, back_image: docUrl })
  // }, [])

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'routing_number' && value.length > 9 ) {
      return;
    }

    if (name === 'account_number' && value.length > 12 ) {
      return;
    }

    if (name === 'ssn_number' && value.length > 9) {
      return;
    }

    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: fieldValue });
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
    if (!formData?.billing_frequency || !formData?.payment_method || !formData?.account_number || !formData?.company_name || !frontDoc || !backDoc ||
      formData?.ssn_number?.length < 9 || formData?.routing_number?.length < 9 || !formData?.accountholder_name || formData?.account_number?.length < 12 || !dob) {
      setSubmitted(true)
      return
    }
    // loader(true)
    const data = {
      // auto_invoice: formData?.auto_invoice,
      // is_hide_invoice: formData?.is_hide_invoice,
      billing_frequency: formData?.billing_frequency,
      payment_method: formData?.payment_method,
      tax_detail: formData?.tax_detail,
      backDoc: backDoc,
      frontDoc: frontDoc,
      dob: formatedDob,
      accountholder_name: formData?.accountholder_name,
      routing_number: formData?.routing_number,
      account_number: formData?.account_number,
      ssn_number: formData?.ssn_number,
      company_name: formData?.company_name,
      // default_invoice_setting: formData?.default_invoice_setting,
    }
    // ApiClient.put('edit/profile', data).then(res => {

    // if (res.success == true) {
    localStorage.setItem("step3", JSON.stringify(data))
    router.push(`/affiliate-form/StageLastStep`)
    //   }
    //   loader(false)
    // })
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
    const storedData = localStorage.getItem("step3");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    setFormData(parsedData)
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
                  <button className='genral-button ml-3'><span className="ranks mr-2">04</span>User</button>
                </div>
              </div>
            </div>


            <div className='row'>
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
                        <select class="form-select " aria-label="Default select example" value={formData?.billing_frequency} name='billing_frequency'
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
                        <select class="form-select " aria-label="Default select example" name='payment_method' value={formData?.payment_method}
                          onChange={handleInputChange}>
                          <option selected>Select</option>
                          <option value="stripe">Stripe</option>
                          {/* <option value="account detail">Account detail</option> */}
                          {/* <option value="3">Three</option> */}
                        </select>
                        {submitted && !formData?.payment_method ? <div className="invalid-feedback d-block">Payment method is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <p className='mb-0'><label className='label-set'>Account Holder Name <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                        <input
                          value={formData?.accountholder_name}
                          onChange={handleInputChange}
                          name="accountholder_name"
                          type="text"
                          className="form-control "></input>
                        {submitted && !formData?.accountholder_name ? <div className="invalid-feedback d-block">Account Holder Name is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div className='form-group'>
                        <p className='mb-0'><label className='label-set'>Company Name <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                        <input
                          value={formData?.company_name}
                          onChange={handleInputChange}
                          name="company_name"
                          type="text"
                          className="form-control "></input>
                        {submitted && !formData?.company_name ? <div className="invalid-feedback d-block">Company Name is Required</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>


                      <div className='form-group'>
                        <p className='mb-0'><label className='label-set'>Account Number<img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                        <input
                          value={formData?.account_number}
                          onChange={handleInputChange}
                          name="account_number"
                          type="number"
                          className="form-control "></input>
                        {submitted && formData?.account_number?.length < 12 ? <div className="invalid-feedback d-block">Account Number is must be 12 digit</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>


                      <div className='form-group'>
                        <p className='mb-0'><label className='label-set'>Routing Number <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                        <input
                          value={formData?.routing_number}
                          onChange={handleInputChange}
                          name="routing_number"
                          type="number"
                          className="form-control "></input>
                        {submitted && formData?.routing_number?.length < 9  ? <div className="invalid-feedback d-block">Routing Number is must be 9 digit</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>


                      <div className='form-group'>
                        <p className='mb-0'><label className='label-set'>SSN Number <img className='sad-img' src='/assets/img/information-button.png' alt=''></img></label></p>
                        <input
                          value={formData?.ssn_number}
                          onChange={handleInputChange}
                          name="ssn_number"
                          type="number"
                          className="form-control "></input>
                        {submitted && formData?.ssn_number?.length < 9 ? <div className="invalid-feedback d-block">SSN Number is must be 9 digit</div> : <></>}
                      </div>
                    </div>
                    <div className='col-md-6'>
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
                    </div>

                    <div className='col-md-6 ml-1'>
                      <div class="form-group">
                        <label className='label-set' >Tax Details <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                        <input type="text" className="form-control " id="tax_detail" name="tax_detail" value={formData?.tax_detail}
                          onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className='col-md-6'>
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
                    </div>

                    <div className='col-md-6'>
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
                    </div>

                    {/* <div className='col-md-6'>
                      <div class="form-group">
                        <label className='label-set' >Default Invoice Settings <img className='sad-img' src='/assets/img/information-button.png' alt=''></img> </label>
                        <input type="text" className="form-control " id="exampleFormControlInput1" name="default_invoice_setting" value={formData?.default_invoice_setting}
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
            </div>
          </div>
        </div>

      </Layout>
    </>
  );
}

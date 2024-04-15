"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import "./style.scss";
import Layout from "@/app/components/global/layout";
import methodModel from "@/methods/methods";
import $ from 'jquery';
import ApiClient from "@/methods/api/apiClient";

const Publish = () => {
  const { id } = useParams()
  const history = useRouter();
  const [form, setForm] = useState({
    is_us_citizen:'',
    federal_text_classification:'',
    tax_classification:'',
    tax_name:'',
    trade_name:'',
    ein:'',
    social_security_number:'',
    consent_agreed:'',
    signature:'',
    signature_date:'',
    social_security_number: null });
  const [sumitted, setSumitted] = useState(false);
  const [loaderr, setLoader] = useState()
  const [imgLoder, setImgLoder] = useState()
  const currentDate = new Date().toISOString().split("T")[0];

  console.log(form,"formform-------")

  const handleSave = () => {
    // setLoader(true)
    const data = {
      ...form
    }
    if (data?.tax_classification == 'business') {
      delete data?.tax_name,
        delete data?.social_security_number
    }

    if (data?.tax_classification == 'individual') {
      delete data?.federal_text_classification
      // delete data?.social_security_number
    }
    ApiClient.put('edit/profile', data).then(res => {

      if (res.success == true) {
        history.push(`/affiliate-form/StageLastStep/${id}`)
      }
      // setLoader(false)
    })
  }

  const getDetail = () => {
    // loader(true)
    ApiClient.get(`user/detail?id=${id}`).then(res => {
      if (res.success) {
        console.log(res?.data,"0000000000")
        setForm({ is_us_citizen:res?.data?.tax_detail?.is_us_citizen,
        id:id,
        federal_text_classification:res?.data?.tax_detail?.federal_text_classification,
        tax_classification:res?.data?.tax_detail?.tax_classification,
        tax_name:res?.data?.tax_detail?.tax_name,
        trade_name:res?.data?.tax_detail?.trade_name,
        ein:res?.data?.tax_detail?.ein,
        social_security_number:res?.data?.tax_detail?.social_security_number,
        consent_agreed:res?.data?.tax_detail?.consent_agreed,
        signature:res?.data?.tax_detail?.signature,
        signature_date:res?.data?.tax_detail?.signature_date})
      }
      // loader(false)
    })
  };

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [])

  const uploadImage = (e) => {
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


  // const handleSubmit = (e) => {
    
  //   localStorage.setItem('tax_detail',form)

  // };

  const back = () => {
    history.back();
  };

  return (
    <div>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5 px-4'>
          <div className='container-fluid'>
            <div className='row mx-0'>
              <div className='col-md-12'>
                <div className='d-flex align-items-center'>
                  <button className='genral-buttons' onClick={() => history.push(`/affiliate-form/StageFirstStep`)}><span className="rank mr-2">01</span>General</button>
                  <button className='genral-buttons ml-3' onClick={() => history.push(`/affiliate-form/StageSecStep`)}><span className="rank mr-2">02</span>Address</button>
                  <button className='genral-buttons ml-3' onClick={() => history.push(`/affiliate-form/taxSection`)}><span className="rank mr-2">03</span> Tax Detail</button>
                  <button className='genral-button ml-3' onClick={() => history.push(`/affiliate-form/StageLastStep`)}><span className="ranks mr-2">04</span>User</button>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-4 '>
                    <div class="dtls_head"><h3>Tax Detail  </h3></div>
          <div className="form_page b-none">
            <div className="container">
            <div className="row">
            <div className="col-md-7">
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
            <div className="col-md-5">
            <div className="mb-4">
                <label className='form-label certif_inst ' >
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
                     
                      <label class="form-check-label certif_inst " for="flexRadioDefault1">
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
                      
                      <label class="form-check-label certif_inst " for="flexRadioDefault2">
                        {" "}
                        Business
                      </label>
                    </div>
                    </div>

                  </div>
                </div>

            </div>
            <div className="col-md-12">


               
                {/* new fields add start */}

                {form?.tax_classification === "business" && (
                  <div className="mb-4">
                     <label class="form-check-label certif_inst ">
                      Check appropriate box for federal tax classification of
                      the person whose name is entered on line 
                    </label>

                    <div className="checkbox_publish mt-2">
                    <label className='certif_inst'>  1. Check only one of the following seven boxes. </label>

                    
                       
                        <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
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
                            <span>
                              individual/sole propriertor or single-member LLC
                            </span>
                          </div>
                       

                         <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
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
                            <span>C Corporation</span>
                          </div>
                     

                       
                         <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
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
                              className="form-checkbox mr-2"
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
                            <span>Patnership</span>
                          </div>
                    
                       
                         <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
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
                            <span>
                              Limited liability company. Enter the tax
                              classification (C=C Corporation, S=S Corporation,
                              P Patnership,){" "}
                            </span>
                          </div>
                        
                      </div>
                      {sumitted && !form?.federal_text_classification && (
                        <p className="text-danger">This field is required</p>
                      )}
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
                        <div className="col-md-6">
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
                      <div className="col-md-6  ">
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
            <div className="col-md-12">
              
            <div className="mb-4">
                  <label>
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
            </div>
            </div>
           

             
            </div>
          </div>

          
          </div>
        </div>
      </Layout>
    </div>
  );
};
Publish.layout = "Contentlayout";

export default Publish;

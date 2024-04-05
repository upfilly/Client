"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import ApiClient from "../../../methods/api/apiClient";
import "./style.scss";
import Layout from "@/app/components/global/layout";
import methodModel from "@/methods/methods";
import $ from 'jquery';

const Publish = () => {
  const history = useRouter();
  const [form, setForm] = useState({ social_security_number: null });
  const [sumitted, setSumitted] = useState(false);
  const [loaderr, setLoader] = useState()
  const [imgLoder, setImgLoder] = useState()
  const currentDate = new Date().toISOString().split("T")[0];

  const handleSave = () => {
    // setLoader(true)
    const data = {
  ...form
    }
    ApiClient.put('edit/profile', data).then(res => {

      if (res.success == true) {
        router.push(`/affiliate-form/StageLastStep/${id}`)
      }
      // setLoader(false)
    })
  }

  const getDetail = () => {
    // loader(true)
    ApiClient.get(`user/detail?id=${id}`).then(res => {
      if (res.success) {
        setForm(res?.data)
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
        setForm({ ...form, image: `images/users/${image}` })
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
        <div className='main-affiliate mt-3 mb-5'>
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
          <div className="form_page b-none">
            <div className="container">

              <div className="formwrapper">
                <div className="mt-4">
                  <label>
                    Are you a U.S. citizen, U.S. permanent resident (green card
                    holder) <i class="fa fa-info-circle" aria-hidden="true"></i>
                  </label>
                  <select
                    class="form-control select_width mt-2 width20"
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
                </div>
                <div className="mt-4">
                  <label>
                    What is your tax classification?{" "}
                  
                  </label>
                  <div className="row pl-4">
                    <div className="col-md-3">
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
                    <div className="col-md-3">
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

                {/* new fields add start */}

                {form?.tax_classification === "business" && (
                  <div className="mt-4">
                    <label>
                      Check appropriate box for federal tax classification of
                      the person whose name is entered on line 1. Check only one
                      of the following seven boxes.
                    </label>

                    <div className="checkbox_publish mt-2">
                      <div className="row">
                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                          <div className="form-group">
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
                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                          <div className="form-group">
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
                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                          <div className="form-group">
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
                        </div>

                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                          <div className="form-group">
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
                        </div>

                        <div className="col-sm-12 ">
                          <div className="form-group">
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
                      </div>
                      {sumitted && !form?.federal_text_classification && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>
                )}

                {/* new fields add end */}

                <div className="mt-4">
                  <label>
                    Tax Identity Information{" "}
                  
                  </label>
                  {/* <p className='label_p'>This is themos important place to include keywords</p> */}

                  <div className="row">
                    {form?.tax_classification === "individual" && (
                      <div className="col-md-6 mt-3">
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
                        <div className="col-md-6 mt-3">
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

                        <div className="col-md-6 mt-3">
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
                      <div className="col-md-6 mt-3">
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

                <div className="mt-4">
                  <label>
                    I consent to sign my IRS Form W-9 electronically.{" "}
                  
                  </label>
                  <div className="d-flex ">
                    <input
                      className="mr5"
                      type="checkbox"
                      id="consent"
                      checked={form?.consent_agreed}
                      onChange={(e) =>
                        setForm({ ...form, consent_agreed: e.target.checked })
                      }
                    />
                    <p className="label_p ml-3">
                      If you provide an electronic signature, you will be able
                      to submit your tax information immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="formwrapper p-0">
                <div className="boxpublish mt-3">
                  <Label>Under penalties of perjury, I certify that:</Label>
                  <div className="no_list">
                    <span className="number_box">01</span>
                    <p>
                      The number shown on this form is my correct taxpayer
                      identification number
                      <br />
                      (or I am waiting for a number to be issued to me), and
                    </p>
                  </div>
                  <div className="no_list">
                    <span className="number_box">02</span>
                    <p>
                      {" "}
                      by the Internal Revenue Service (IRS) that I am subject to
                      ackup withholding as a result of a failure to report all
                      interest or{" "}
                    </p>
                  </div>
                  <div className="no_list">
                    <span className="number_box">03</span>
                    <p>
                      I am a U.S. citizen or other U.S. person (defined in the
                      instructions), and{" "}
                    </p>
                  </div>
                  <div className="no_list">
                    <span className="number_box">04</span>
                    <p>
                      The FATCA code(s) entered on this form (if any) indicating
                      that I am exempt from FATCA reporting is correct.{" "}
                    </p>
                  </div>
                </div>

                <div className="text_git mx-4 mt-4">
                  <label>
                    Certification Instructions{" "}
                  
                  </label>
                  <p className="label_p">
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
                      <div className="form-group drag_drop">
                        <div className='upload_file'>
                        {!form?.image && !imgLoder && <> <button className="btn btn-primary upload_image">Upload Signature</button>
                          <input type="file" className="form-control-file over_input" accept="images/*" multiple={true}
                            // disabled={loader}
                            onChange={(e) => {
                              setImgLoder(true)
                              uploadImage(e, 'images');
                            }} /></>}
                          {loaderr && imgLoder ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
                         {form?.image && <div className="imagesRow position-relative mt-4">
                                <img className="signurimg" src={methodModel.noImg(form?.image)} />
                                <i className="fa fa-times kliil" title="Remove" onClick={e => setForm({ ...form, image: "" })}></i>
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
                      value={form?.day || ""}
                      onChange={(e) =>
                        setForm({ ...form, day: e.target.value })
                      }
                    />
                    {sumitted && !form?.day && (
                      <p className="text-danger font_fix">This field is required</p>
                    )}
                  </div>
                </div>
                <div className='col-md-12 mt-4 mb-2'>
                  <button className='back-btns' onClick={() => back()}>Back</button>
                  < button className='btn btn-primary login ml-3 ' onClick={(e) => handleSave(e)}>Save & Continue</button>
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

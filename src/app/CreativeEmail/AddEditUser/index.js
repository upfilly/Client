"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import methodModel from "@/methods/methods";
import { emailType } from "@/models/type.model";
import Layout from '../../components/global/layout';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';

const DynamicReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreativeEmail = () => {
  const defaultvalue = () => {
    let keys = { ...emailType };
    Object.keys(emailType).map((itm) => {
      if (itm != "permissions") keys[itm] = "";
    });
    keys.status = "active";
    return keys;
  };
  const { id } = useParams()
  const [form, setform] = useState({templateName:'',emailName:'',purpose:'',audience:'',format:'HTML',subject:'',from:'',htmlContent:'',textContent:'',personalizationTags:''});
  const [tab, setTab] = useState("form");
  const [submitted, setSubmitted] = useState(false);
  const specialChars = useRef([]);
  const [variables, setVariables] = useState('');
  const [htmlCode, setHtmlCode] = useState(false);
  const formValidation = [{ key: "subject", required: true }];
  const history = useRouter()
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) {
      setTab("form");
      return;
    }
    let method = "post";
    let url = "emailtemplate";
    let value = {
      ...form,id:id
    };
    if (id) {
      method = "put";
      url = `emailtemplate`;
    } else {
      delete value.id;
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        history.push("/CreativeEmail");
      }
      loader(false);
    });
  };


  useEffect(() => {
    if (id) {
    loader(true);
    ApiClient.get("emailtemplate", { id:id }).then(
    (res) => {
      if (res.success) {
        let value = res.data;
        let payload = form;
        Object.keys(payload).map((itm) => {
          payload[itm] = value[itm];
        });
        setform({
          ...payload,id:id
        });
      }
      loader(false);
    }
    );
  }
     else {
      setform(defaultvalue());
    }
    }
    , []);

  const onSelect = (e) => { };

  const onRemove = (e) => { };

  const textAreaRef = useRef(null);

  const insertVariable = (variable) => {
    try {
      const textarea = textAreaRef.current;
      const cursorPos = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const textBeforeCursor = form.content.substring(0, cursorPos);
      const textAfterCursor = form.content.substring(
        cursorPos,
        form.content.length
      );

      // Insert the variable at the cursor position
      const updatedText =
        textBeforeCursor + "{" + variable + "}" + textAfterCursor;
      textarea.value = updatedText;
      setform({ ...form, content: updatedText });

      // Ensure the textarea maintains focus after insertion
      textarea.focus();
      textAreaRef.current.selectionEnd = end + variable.length + 2;
    } catch (err) { }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlepersonalize();
    }
  };

  const handlepersonalize=()=>{
    if(!variables){
      return
    }else{
      let personalize=form?.personalizationTags||[]
      personalize.push(variables)
      setform({...form,personalizationTags:personalize})
      setVariables('')
    }
  }
  const removepersonalize=(name)=>{
    let personalize=form?.personalizationTags||[]
    if(personalize?.length==0){
      return
    }
    personalize = personalize.filter(itm=>itm!=name)
    setform({...form,personalizationTags:personalize})
  }

  return (
    <>
      <Layout>
        <div className="max-w-[1420px]">
          {tab == "form" ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="pprofile1">
                  <div className="flex items-center mb-8">
                    {/* <Tooltip placement="top" title="Back"> */}
                    
                    {/* </Tooltip> */}
                    <div className="d-flex align-items-center  add_memeber_bx">
                    <a onClick={(e) => history.back()}>  <i class="fa fa-arrow-left left_arrows" title="Back" aria-hidden="true"></i></a>
                      <div className="Profilehedding " >
                      <h3 className="add_email">
                        {form && form?.id ? "Edit" : "Add"} Email
                      </h3>
                      <p class="mb-0 add_detils">
                        Here you can see all about your Email
                      </p>
                      </div>
                    </div>
                  </div>
                  </div>
<div className="pprofile1 pt-0">
<div className="  add_team_bx mt-0  ">
<div className="row">
                    <div className="col-md-6">
                    <div className="mb-3" >
                    <label className=" form-label ">
                    Template Name<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className=" form-control shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.templateName}
                        onChange={(e) =>
                          setform({ ...form, templateName: e.target.value })
                        }
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <label className="form-label ">
                      Email Name<span className="star">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control  shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.emailName}
                        onChange={(e) =>
                          setform({ ...form, emailName: e.target.value })
                        }
                        required
                      />
                      </div>
                     
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <label className="form-label ">
                      Purpose<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control  shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.purpose}
                        onChange={(e) =>
                          setform({ ...form, purpose: e.target.value })
                        }
                        required
                      />
                      </div>
                     
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <label className="form-label ">
                      Audience<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control  shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.audience}
                        onChange={(e) =>
                          setform({ ...form, audience: e.target.value })
                        }
                        required
                      />
                      </div>
                     
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <label className="form-label ">
                      Subject<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control  shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.subject}
                        onChange={(e) =>
                          setform({ ...form, subject: e.target.value })
                        }
                        required
                      />
                      </div>
                     
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                      <label className="form-label ">
                      From<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control  shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.from}
                        onChange={(e) =>
                          setform({ ...form, from: e.target.value })
                        }
                        required
                      />
                      </div>
                     
                    </div>
                        <div className="col-md-12">
                      <div className="mb-3">
                      <label className="text-sm font-normal text-[#75757A] block !mb-3">
                            Description<span className="star">*</span>
                          </label>
                          <div className="">
                            <ul class="nav nav-tabs flex mb-3 d-flex justify-content-start gap-3  align-items-center boder p-2">
                              <li className="nav-item flex mr-0 cursor-pointer mt-0 set_buttons">
                                <a
                                  className={` ${form?.format=='Text'
                                       ? " btn btn-outline-light"
                                      : "  btn btn-primary"
                                    }`}
                                  onClick={(e) => setform({...form,format:'HTML'})}>
                                  Html Code
                                </a>
                              </li>
                              <li className="nav-item cursor-pointer mt-0 set_buttons">
                                <a
                                  className={` ${form?.format!=='Text'
                                      ? " btn btn-outline-light"
                                      : "  btn btn-primary"
                                    }`}
                                    onClick={(e) => setform({...form,format:'Text'})}>
                                  Editor
                                </a>
                              </li>
                            </ul>
                            {form?.format!=='Text' ? (
                              <>
                                <textarea
                                  ref={textAreaRef}
                                  className="form-control  rounded-2"
                                  rows="4"
                                  value={form?.htmlContent}
                                  onChange={(e) =>
                                    setform({
                                      ...form,
                                      htmlContent: e.target.value,
                                    })
                                  }></textarea>
                              </>
                            ) : (
                              <>
                                <DynamicReactQuill
                                  theme="snow"
                                  value={form?.textContent ? form?.textContent : ''}

                                  onChange={(newValue, editor) => {
                                    setform({ ...form, textContent: newValue })
                                  }}
                                  className='tuncketcls'
                                  modules={{
                                    toolbar: [
                                      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                      [{ size: [] }],
                                      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                      [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                      { 'indent': '-1' }, { 'indent': '+1' }],
                                      ['link', 'image', 'video'],
                                      ['clean']
                                    ],
                                  }}
                                  formats={[
                                    'header', 'font', 'size',
                                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                                    'list', 'bullet', 'indent',
                                    'link', 'image', 'video'
                                  ]}
                                  bounds={'.app'}
                                />
                              </>
                            )}
                          </div>
                      </div>
                        </div>
                     <div className="col-md-6">
                     <div className="mb-3">
                          <label className="form-label">
                          Personalization Tags
                          </label>
                          
                          <div className="d-flex gap-3  flex-row">
                          <input
                        type="text"
                        className="form-control  "
                        value={variables}
                        onChange={(e) =>
                          setVariables(e.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        required={!form?.personalizationTags ||form?.personalizationTags?.length==0}
                      />
                      <a onClick={handlepersonalize} className=" d-flex justify-content-center align-items-center btn btn-primary" >
                      <i class="fa fa-plus" aria-hidden="true" ></i>
                      </a>
                          </div>
                          {submitted && form?.personalizationTags?.length<=0 &&<span className="text-danger">Please add personalization Tags</span>}

                          <div className="d-flex gap-3 align-items-center flex-wrap mt-4 ">
                            <div className=" list-disc list-inside inside_bx d-flex align-items-center gap-3 flex-wrap">
                              {form?.personalizationTags&&form?.personalizationTags.map((itm) => {
                                return (
                                  <span
                                    className="pb-1 cursor-pointer btn btn-primary d-flex gap-2 align-items-center"
                                    onClick={(e) => insertVariable(itm)}>
                                    <span className="item_add" >{itm}</span>
                                    <i class="fa fa-close cloosebtn" onClick={e=>removepersonalize(itm)}></i>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                     </div>
                 <div className="col-md-12">
                 <div className="d-flex justify-content-end  align-items-center  gap-3 ">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={(e) => setTab("preview")}>
                      Preview
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary">
                      Save
                    </button>
                  </div>
                 </div>
</div>
                 
                </div>
</div>

              </form>
            </>
          ) : (
            <>
              <div className="pprofile1">
                <h4 class="text-2xl font-semibold text-[#111827] mb-3">
                  Preview
                </h4>
                <div
                  className="shadow-box border !border-grey p-2 bg-white rounded-large"
                  dangerouslySetInnerHTML={{ __html: form?.content }}></div>
                <div className="flex justify-end gap-2 mt-3 text-right">
                  <button
                    type="button"
                    className="!px-2.5 text-[#3C3E49] text-sm h-9 font-normal py-2.5 flex items-center justify-center gap-2 bg-[#fff] rounded-large shadow-btn hover:bg-[#F3F2F5] border border-[#D0D5DD] transition-all focus:ring-2 ring-[#F1F2F3] disabled:bg-[#F3F2F5] disabled:cursor-not-allowed"
                    onClick={(e) => setTab("form")}>
                    Back
                  </button>
                  <button
                    className="!px-4 text-sm font-normal text-white h-9 flex items-center justify-center gap-2 !bg-primary rounded-extra_large shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
                    onClick={(e) => handleSubmit()}>
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Body
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <span
                      dangerouslySetInnerHTML={{ __html: form?.content }}></span>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CreativeEmail;

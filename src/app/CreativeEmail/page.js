"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import methodModel from "@/methods/methods";
import { emailType } from "@/models/type.model";
import Layout from '../components/global/layout';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

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
  const [form, setform] = useState();
  const [tab, setTab] = useState("form");
  const [submitted, setSubmitted] = useState(false);
  const specialChars = useRef([]);
  const [variables, setVariables] = useState([]);
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
    let url = "api/email";
    let value = {
      ...form,
    };
    if (value.id) {
      method = "put";
      url = `api/update/template?id=${value.id}`;
    } else {
      delete value.id;
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        // toast.success(res.message)
        history("/email/templates");
      }
      loader(false);
    });
  };

  const getConstants = () => {
    ApiClient.get("api/constants").then((res) => {
      if (res.success) {
        let data = res.data.map((itm) => {
          return {
            text: itm,
            value: itm,
          };
        });
        setVariables([...data]);
        specialChars.current = data;
      }
    });
  };

  useEffect(() => {
    // getConstants()
    // if (id) {
    // loader(true);
    // ApiClient.get("api/template", { id }, "", "", { apiCall: true }).then(
    (res) => {
      if (res.success) {
        let value = res.data;
        let payload = emailType;
        Object.keys(payload).map((itm) => {
          payload[itm] = value[itm];
        });
        setform({
          ...payload,
        });
        setVariables([...value?.constants]);
      }
      // loader(false);
    }
    // );
  }
    //  else {
    //   setform(defaultvalue());
    // }
    // }
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
                    <p
                      onClick={(e) => history("/CreativeEmail/templates")}
                      className="cursor-pointer flex items-center justify-center  rounded-full shadow-box border !border-grey bg-white h-10 w-10 hover:bg-[#F3F2F5] border  transition-all    mr-3">
                      {/* <IoArrowBackSharp /> */}
                    </p>
                    {/* </Tooltip> */}
                    <div>
                      <h3 className="text-2xl font-semibold text-[#111827]">
                        {form && form?.id ? "Edit" : "Add"} Email
                      </h3>
                      <p class="text-sm font-normal text-[#75757A]">
                        Here you can see all about your Email
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="md:col-span-12 col-span-12">
                      <label className="text-sm font-normal text-[#75757A] !mb-3">
                        Title<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.title}
                        onChange={(e) =>
                          setform({ ...form, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-12 col-span-12">
                      <label className="text-sm font-normal text-[#75757A] !mb-3">
                        Subject<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="shadow-box border !border-grey bg-white w-full text-sm placeholder:text-gray-500 rounded-large h-10 flex items-center gap-2 overflow-hidden px-4 !ring-primary !outline-primary disabled:!bg-gray-200"
                        value={form?.subject}
                        onChange={(e) =>
                          setform({ ...form, subject: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-12 col-span-12">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="md:col-span-8 col-span-12">
                          <label className="text-sm font-normal text-[#75757A] block !mb-3">
                            Body<span className="star">*</span>
                          </label>
                          <div className="shadow-box border !border-grey w-full p-4 bg-white rounded-large">
                            <ul class="nav nav-tabs flex mb-3">
                              <li className="nav-item flex ml-2 mr-2 cursor-pointer">
                                <a
                                  className={` pt-[1px] px-[4px] pb-[11px] block text-sm font-normal hover:!text-primary hover:no-underline ${htmlCode
                                      ? "border-b-2 !border-primary !text-primary !font-medium"
                                      : "!text-[#667085]"
                                    }`}
                                  onClick={(e) => setHtmlCode(true)}>
                                  Html Code
                                </a>
                              </li>
                              <li className="nav-item cursor-pointer">
                                <a
                                  className={` pt-[1px] px-[4px] pb-[11px] block text-sm font-normal hover:!text-primary hover:no-underline ${!htmlCode
                                      ? "border-b-2 !border-primary !text-primary !font-medium"
                                      : "!text-[#667085]"
                                    }`}
                                  onClick={(e) => setHtmlCode(false)}>
                                  Editor
                                </a>
                              </li>
                            </ul>
                            {htmlCode ? (
                              <>
                                <textarea
                                  ref={textAreaRef}
                                  className="w-full text-sm placeholder:text-gray-500 rounded-large h-[400px]  flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary disabled:!bg-gray-200"
                                  value={form?.content}
                                  onChange={(e) =>
                                    setform({
                                      ...form,
                                      content: e.target.value,
                                    })
                                  }></textarea>
                              </>
                            ) : (
                              <>
                                <DynamicReactQuill
                                  theme="snow"
                                  value={form?.description ? form?.description : ''}

                                  onChange={(newValue, editor) => {
                                    setForm({ ...form, description: newValue })
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
                        <div className="md:col-span-4 col-span-12">
                          <label className="text-sm font-normal text-[#75757A] block !mb-3">
                            Variables
                          </label>

                          <div className="text-sm shadow-box border !border-grey p-3 bg-white rounded-large">
                            <ul className=" list-disc list-inside">
                              {variables.map((itm) => {
                                return (
                                  <li
                                    className="pb-1 cursor-pointer"
                                    onClick={(e) => insertVariable(itm)}>
                                    {itm}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex text-right">
                    <button
                      type="button"
                      className="mx-2 ml-auto !px-4 text-sm font-normal text-white h-9 flex items-center justify-center gap-2 !bg-primary rounded-extra_large shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
                      onClick={(e) => setTab("preview")}>
                      Preview
                    </button>
                    <button
                      type="submit"
                      className="!px-4 text-sm font-normal text-white h-9 flex items-center justify-center gap-2 !bg-primary rounded-extra_large shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed">
                      Save
                    </button>
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

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import methodModel from "@/methods/methods";
import Layout from '../../components/global/layout';
import 'react-quill/dist/quill.snow.css';
import { useParams, useRouter } from 'next/navigation';
import EmailEditorTemplate from '../../email/emaileditor'

const Html = () => {
  const { id } = useParams()
  const [form, setform] = useState({ templateName: '', emailName: '', purpose: '', audience: '', format: 'Text', subject: '', from: '', htmlContent: '', textContent: '', personalizationTags: '', textJSONContent: {} });
  const [tab, setTab] = useState("form");
  const [submitted, setSubmitted] = useState(false);
  const specialChars = useRef([]);
  const [variables, setVariables] = useState('');
  const [htmlCode, setHtmlCode] = useState(false);
  const formValidation = [{ key: "subject", required: true }];
  const router = useRouter()
  const childRef = useRef();
  const emailEditorRef = useRef(null);

  const exportHtml = (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    const unlayer = emailEditorRef.current?.editor;

    if (unlayer) {
      unlayer.exportHtml((data) => {
        const { design, html } = data;
        console.log(data,"dadadadad")

        if (html) {
          setform({
            ...form,
            textContent: html,
            textJSONContent: design || {}
          });
          console.log(form,"klklklkl")
          // Call handleSubmit without the event to avoid double submission
          // handleSubmit();
        }
      });
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    setSubmitted(true);
    
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) {
      setTab("form");
      return;
    }
    
    let method = "post";
    let url = "emailtemplate";
    let value = {
      ...form, id: id
    };
    
    if (id && id != "add") {
      method = "put";
      url = `emailtemplate`;
    } else {
      delete value.id;
    }
    
    loader(true);

    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        router.push("/CreativeEmails");
      }
      loader(false);
    });
  };
  
  const handleSaveFromPreview = (e) => {
    e.preventDefault(); // Prevent default behavior
    handleSubmit();
  };

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get("emailtemplate", { id: id }).then(
        (res) => {
          if (res.success) {
            let value = res.data;
            let payload = form;
            Object.keys(payload).map((itm) => {
              payload[itm] = value[itm];
            });
            setform({
              ...payload, id: id
            });
          }
          loader(false);
        }
      );
    }
  }, []);

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

  const handlepersonalize = () => {
    if (!variables) {
      return
    } else {
      let personalize = form?.personalizationTags || []
      personalize.push(variables)
      setform({ ...form, personalizationTags: personalize })
      setVariables('')
    }
  }
  
  const removepersonalize = (name) => {
    let personalize = form?.personalizationTags || []
    if (personalize?.length == 0) {
      return
    }
    personalize = personalize.filter(itm => itm != name)
    setform({ ...form, personalizationTags: personalize })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (form?.format == 'Text' && (!form?.textJSONContent || !form?.textContent)) {
      exportHtml(e);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <>
      <Layout>
        <div className="max-w-[1420px]">
          {tab == "form" ? (
            <>
              <form onSubmit={handleFormSubmit}>
                <div className="pprofile1">
                  <div className="flex items-center mb-8">
                    <div className="d-flex align-items-center add_memeber_bx">
                      <a onClick={() => router.back()}>  
                        <i className="fa fa-arrow-left left_arrows" title="Back" aria-hidden="true"></i>
                      </a>
                      <div className="Profilehedding">
                        <h3 className="add_email">
                          {form && form?.id ? "Edit" : "Add"} Email
                        </h3>
                        <p className="mb-0 add_detils">
                          Here you can see all about your Email
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pprofile1 pt-0">
                  <div className="add_team_bx mt-0">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Template Name<span className="star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
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
                          <label className="form-label">
                            Email Name<span className="star">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
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
                          <label className="form-label">
                            Purpose<span className="star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
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
                          <label className="form-label">
                            Audience<span className="star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
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
                          <label className="form-label">
                            Subject<span className="star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
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
                          <label className="form-label">
                            From<span className="star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
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
                            <ul className="nav nav-tabs flex mb-2 d-flex justify-content-start gap-2 flex-wrap align-items-center border-bottom-0 pb-0 pb-md-2">
                              <li className="nav-item flex mr-0 cursor-pointer mt-0 set_buttons">
                                <a
                                  className={` ${form?.format == 'Text'
                                    ? " btn btn-outline-light"
                                    : " btn btn-primary"
                                    }`}
                                  onClick={() => setform({ ...form, format: 'HTML' })}>
                                  Html Code
                                </a>
                              </li>
                              <li className="nav-item cursor-pointer mt-0 set_buttons">
                                <a
                                  className={` ${form?.format !== 'Text'
                                    ? " btn btn-outline-light"
                                    : " btn btn-primary"
                                    }`}
                                  onClick={() => setform({ ...form, format: 'Text' })}>
                                  Editor
                                </a>
                              </li>
                            </ul>

                            {form?.format !== 'Text' ? (
                              <>
                                <textarea
                                  ref={textAreaRef}
                                  className="form-control rounded-2"
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
                                <EmailEditorTemplate 
                                  state={form} 
                                  setstate={setform} 
                                  ref={childRef} 
                                  exportHtml={exportHtml} 
                                  emailEditorRef={emailEditorRef}
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

                          <div className="d-flex gap-3 flex-row">
                            <input
                              type="text"
                              className="form-control"
                              value={variables}
                              onChange={(e) =>
                                setVariables(e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              required={!form?.personalizationTags || form?.personalizationTags?.length == 0}
                            />
                            <a onClick={handlepersonalize} className="d-flex justify-content-center align-items-center btn btn-primary">
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </a>
                          </div>
                          {submitted && form?.personalizationTags?.length <= 0 && <span className="text-danger">Please add personalization Tags</span>}

                          <div className="d-flex gap-3 align-items-center flex-wrap mt-4">
                            <div className="list-disc list-inside inside_bx d-flex align-items-center gap-3 flex-wrap">
                              {form?.personalizationTags && form?.personalizationTags.map((itm, index) => {
                                return (
                                  <span
                                    key={index}
                                    className="pb-1 cursor-pointer btn btn-primary d-flex gap-2 align-items-center"
                                    onClick={() => insertVariable(itm)}>
                                    <span className="item_add">{itm}</span>
                                    <i className="fa fa-close cloosebtn" onClick={(e) => {
                                      e.stopPropagation(); // Prevent triggering the parent onClick
                                      removepersonalize(itm);
                                    }}></i>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="d-flex justify-content-end align-items-center gap-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setTab("preview")}>
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
                <h4 className="text-2xl font-semibold text-[#111827] mb-3">
                  Preview
                </h4>
                <div
                  className="shadow-box border !border-grey p-2 bg-white rounded-large"
                  dangerouslySetInnerHTML={{ __html: form?.content || form?.textContent }}></div>
                <div className="flex justify-end gap-2 mt-3 text-right">
                  <button
                    type="button"
                    className="btn btn-secondary mr-3"
                    onClick={() => setTab("form")}>
                    Back
                  </button>
                  <button
                    type="button" // Changed from button without type
                    className="btn btn-primary"
                    onClick={handleSaveFromPreview}>
                    Save
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Body
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <span
                      dangerouslySetInnerHTML={{ __html: form?.content }}></span>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
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

export default Html;
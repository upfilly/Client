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
  const [form, setform] = useState({ 
    templateName: '',
    content:"", 
    emailName: '', 
    format: 'Text', 
    subject: '', 
    from: '', 
    htmlContent: '', 
    textContent: '', 
    personalizationTags: [], 
    textJSONContent: {} 
  });
  const [tab, setTab] = useState("form");
  const [submitted, setSubmitted] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const specialChars = useRef([]);
  const [variables, setVariables] = useState('');
  const [htmlCode, setHtmlCode] = useState(false);
  const formValidation = [{ key: "subject", required: true }];
  const router = useRouter()
  const childRef = useRef();
  const emailEditorRef = useRef(null);

  console.log(form,"form?.content || form?.textContent")

  const exportHtml = (e) => {
    if (e) e.preventDefault();
    
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
          // Call handleSubmit without the event to avoid double submission
          handleSubmit();
        }
      });
    }
  };

  // New function to generate preview for EmailEditor
  const generateEmailEditorPreview = () => {
    return new Promise((resolve) => {
      const unlayer = emailEditorRef.current?.editor;
      
      if (unlayer) {
        unlayer.exportHtml((data) => {
          const { html, design } = data;
          // Update form with latest content and design
          setform(prevForm => ({
            ...prevForm,
            textContent: html || '',
            textJSONContent: design || {}
          }));
          resolve(html || '');
        });
      } else {
        resolve('');
      }
    });
  };

  // Enhanced preview handler
  const handlePreview = async (e) => {
    if (e) e.preventDefault();
    
    setIsGeneratingPreview(true);
    
    try {
      let content = '';
      
      if (form?.format === 'Text') {
        // For EmailEditor, we need to export HTML first and save the design
        if (emailEditorRef.current?.editor) {
          content = await generateEmailEditorPreview();
          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          // Fallback to existing textContent if available
          content = form?.textContent || '';
        }
      } else {
        // For HTML textarea
        content = form?.htmlContent || '';
      }
      
      setPreviewContent(content);
      setTab("preview");
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Error generating preview');
    } finally {
      setIsGeneratingPreview(false);
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

    delete value?.content;
    
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
  
  const handleSaveFromPreview = async (e) => {
    e.preventDefault();
    
    // If we're previewing EmailEditor content, make sure we have the latest HTML
    if (form?.format === 'Text' && emailEditorRef.current?.editor) {
      setIsGeneratingPreview(true);
      try {
        const htmlContent = await generateEmailEditorPreview();
        const updatedForm = {
          ...form,
          textContent: htmlContent
        };
        setform(updatedForm);
        
        // Now submit with updated content
        setTimeout(() => {
          handleSubmit();
        }, 100);
      } catch (error) {
        console.error('Error saving from preview:', error);
        toast.error('Error saving template');
      } finally {
        setIsGeneratingPreview(false);
      }
    } else {
      handleSubmit();
    }
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
                            From Email<span className="star">*</span>
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
                            Email Subject<span className="star">*</span>
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
                            Senders Name<span className="star">*</span>
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
                                  }
                                  placeholder="Enter your HTML code here..."
                                ></textarea>
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
                      <div className="col-md-12">
                        <div className="d-flex justify-content-end align-items-center gap-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handlePreview}
                            disabled={isGeneratingPreview}
                          >
                            {isGeneratingPreview ? (
                              <>
                                <i className="fa fa-spinner fa-spin mr-2"></i>
                                Generating Preview...
                              </>
                            ) : (
                              'Preview'
                            )}
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="text-2xl font-semibold text-[#111827] mb-0">
                    Email Preview
                  </h4>
                  <div className="badge badge-info">
                    {form?.format === 'Text' ? 'Email Editor' : 'HTML Code'} Preview
                  </div>
                </div>
                
                {/* Email Header Info */}
                <div className="preview-header mb-4 p-3 bg-light rounded">
                  <div className="row">
                    <div className="col-md-6">
                      <strong>From:</strong> {form?.from} &lt;{form?.emailName}&gt;
                    </div>
                    <div className="col-md-6">
                      <strong>Subject:</strong> {form?.subject}
                    </div>
                  </div>
                </div>

                {/* Email Content Preview */}
                <div className="preview-content">
                  <div
                    className="shadow-box border !border-grey p-3 bg-white rounded-large"
                    style={{ 
                      minHeight: '400px',
                      maxHeight: '80vh',
                      overflowY: 'auto',
                      border: '1px solid #e5e5e5'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: previewContent || form?.content || form?.textContent || form?.htmlContent || '<p>No content to preview</p>'
                    }}
                  ></div>
                </div>

                <div className="flex justify-end gap-2 mt-4 text-right">
                  <button
                    type="button"
                    className="btn btn-secondary mr-3"
                    onClick={() => {
                      setTab("form");
                      // Small delay to ensure EmailEditor is mounted before trying to reload
                      setTimeout(() => {
                        if (emailEditorRef.current?.editor && form?.textJSONContent) {
                          console.log('Reloading design when returning from preview');
                          try {
                            if (typeof form.textJSONContent === 'object') {
                              emailEditorRef.current.editor.loadDesign(form.textJSONContent);
                            } else if (typeof form.textJSONContent === 'string' && form.textJSONContent !== '{}') {
                              const design = JSON.parse(form.textJSONContent);
                              emailEditorRef.current.editor.loadDesign(design);
                            }
                          } catch (error) {
                            console.error('Error reloading design:', error);
                          }
                        }
                      }, 500);
                    }}>
                    <i className="fa fa-arrow-left mr-2"></i>
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-success mr-3"
                    onClick={handlePreview}
                    disabled={isGeneratingPreview}>
                    <i className="fa fa-refresh mr-2"></i>
                    Refresh Preview
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveFromPreview}
                    disabled={isGeneratingPreview}>
                    <i className="fa fa-save mr-2"></i>
                    Save Template
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Modal remains the same */}
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
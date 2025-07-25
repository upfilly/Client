import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/global/layout";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import { useRouter } from "next/navigation";
import moment from "moment";
import environment from "@/environment";
import { Editor } from "@tinymce/tinymce-react";
import EmailLogsModal from "../EmailTemplate/EmailModal";

const Html = ({ relatedAffiliate, form, setForm, handleSubmit }) => {
  const user = crendentialModel.getUser();
  const [emailTemplate, setEmailTemplate] = useState("");
  const [errors, setErrors] = useState({});
  const [editorRef, setEditorRef] = useState(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [htmlToPaste, setHtmlToPaste] = useState("");
  const pasteTextareaRef = useRef(null);

  const shortcodes = [
    { label: "Affiliate Name", value: "{affiliateFullName}" },
    { label: "Affiliate Link", value: "{affiliateLink}" },
    { label: "Current Date", value: "{currentDate}" },
  ];

  const generateEmailTemplate = (content = "", title = "") => {
    return `
    <div style="
        width: 100% !important;
        margin: 0 auto !important;
        padding: 20px 0 !important;
        background: transparent !important;
    ">
        <!-- Main Container -->
        <div style="
            width: 100% !important;
            margin: auto !important;
            margin-top: 2rem !important;
            box-shadow: 0px 0px 20px -15px #000 !important;
            position: relative !important;
            background: white !important;
        ">
            <!-- Banner Section -->
            <div style="text-align: center !important;">
                <div style="
                    background: url('${environment.api
      }/images/banner.png') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    width: 100% !important;
                    height: 260px !important;
                "></div>
                
                <!-- Content Card -->
                <div style="margin-top: -190px !important;">
                    <div style="
                        height: auto !important;
                        padding: 1.5rem !important;
                        text-align: center !important;
                        background: #fff !important;S
                        margin: auto !important;
                        border-radius: 4px !important;
                        box-sizing: border-box !important;
                    ">
                        <img src="${environment.api
      }/images/logo.png" alt="Company Logo" style="width:115px !important; height:40px !important; object-fit:contain !important;">
                        
                        <h1 style="margin: 10px 0 0 !important; font-size: 18px !important; font-weight: normal !important;">
                            <span style="font-weight:400 !important; color:#373737 !important;">Hi </span> ${`{affiliateFullName}`},
                        </h1>
                        
                        <p style="margin: 10px 0 0 !important; font-size:14px !important; color:#373737 !important;">
                            You have an email message from ${user?.fullName}
                        </p>

                        <h2 style="margin: 10px 0 0 !important; font-size:14px !important; color:#373737 !important;">
                           Subject :- ${title || "Your email subject"}
                        </h2>
                        
                        <!-- Message Content -->
                        <div style="
                            margin: 15px 0 0 !important;
                            padding: 15px !important;
                            background: #f9f9f9 !important;
                            border-radius: 4px !important;
                            text-align: left !important;
                            font-size: 13px !important;
                            line-height: 1.5 !important;
                            color: #333 !important;
                        ">
                            ${content || "Your message content goes here..."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Social Media Icons -->
        <div style="margin: 30px 0 20px !important; text-align: center !important;">
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api
      }/Image1.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api
      }/Image2.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api
      }/Image3.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
            <a href="#" style="text-decoration: none !important; display: inline-block !important; margin: 0 5px !important;">
                <img src="${environment.api
      }/Image4.png" style="width:40px !important; height:40px !important; object-fit:contain !important;">
            </a>
        </div>
        
        <!-- Footer -->
        <p style="color: #626262 !important; font-size: 11px !important; text-align: center !important; margin-bottom: 0 !important;">
            Copyright © ${new Date().getFullYear()} All Rights Reserved
        </p>
    </div>
    `;
  };

  useEffect(() => {
    // Only set initial template if no content exists
    if (!form?.content && !form?.emailTemplate) {
      const initialTemplate = generateEmailTemplate("");
      setEmailTemplate(initialTemplate);
      setForm((prev) => ({ ...prev, emailTemplate: initialTemplate }));
    }
  }, []);

  const handlePasteHtml = () => {
    if (!htmlToPaste.trim()) return;

    if (!/<[a-z][\s\S]*>/i.test(htmlToPaste)) {
      alert("The text doesn't appear to contain valid HTML");
      return;
    }

    if (editorRef) {
      editorRef.setContent(htmlToPaste);
      setEmailTemplate(htmlToPaste);
      setForm((prev) => ({
        ...prev,
        emailTemplate: htmlToPaste,
        content: htmlToPaste,
      }));
    }
    setShowPasteModal(false);
    setHtmlToPaste("");
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setForm((prev) => ({
      ...prev,
      content: newContent,
      emailTemplate: newContent,
    }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setForm((prev) => ({ ...prev, title: newTitle }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
  };

  const handleDateChange = (e) => {
    setForm((prev) => ({ ...prev, acceptedDate: e.target.value }));
    if (errors.acceptedDate)
      setErrors((prev) => ({ ...prev, acceptedDate: "" }));
  };

  const handleRecipientChange = (type) => {
    setForm((prev) => ({
      ...prev,
      isAllJoined: type === "allJoined",
      affiliateStatus: type === "activeAffiliates",
    }));
  };

  const handleTimeIntervalChange = (interval) => {
    if (interval === "none") {
      setForm((prev) => {
        return {
          ...prev,
          timeInterval: "",
          acceptedDate: "",
        };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        timeInterval: interval,
        acceptedDate: interval ? prev.acceptedDate : "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form?.isAllJoined && !form?.affiliateStatus) {
      newErrors.recipientType = "Please select a recipient type";
    }
    if (form?.timeInterval && !form?.acceptedDate) {
      newErrors.acceptedDate = "Date is required when selecting before/after";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    if (validateForm()) handleSubmit();
  };

  const insertShortcode = (shortcode) => {
    if (editorRef) {
      editorRef.insertContent(shortcode);
    } else {
      const textarea = document.querySelector('textarea[name="content"]');
      if (textarea) {
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const currentValue = textarea.value;

        textarea.value =
          currentValue.substring(0, startPos) +
          shortcode +
          currentValue.substring(endPos, currentValue.length);

        setForm((prev) => ({
          ...prev,
          content: textarea.value,
          emailTemplate: textarea.value,
        }));

        textarea.selectionStart = startPos + shortcode.length;
        textarea.selectionEnd = startPos + shortcode.length;
        textarea.focus();
      }
    }
  };

  const file_picker_callback = (callback, value, meta) => {
    if (meta.filetype === "image") {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.onchange = function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            callback(e.target.result, { alt: file.name });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const dateInputRef = useRef(null);

  const handleClick = () => {
    if (dateInputRef.current && !dateInputRef.current.disabled) {
      dateInputRef.current.showPicker();
    }
  };

  const clearEditor = () => {
    if (editorRef) {
      editorRef.setContent('');
    }
    setEmailTemplate('');
    setForm(prev => ({
      ...prev,
      emailTemplate: '',
      content: ''
    }));
  };

  const resetToDefaultTemplate = () => {
    const defaultTemplate = generateEmailTemplate("");
    if (editorRef) {
      editorRef.setContent(defaultTemplate);
    }
    setEmailTemplate(defaultTemplate);
    setForm(prev => ({
      ...prev,
      emailTemplate: defaultTemplate,
      content: defaultTemplate
    }));
  };

  return (
    <Layout name="Send E-mail">
      <div className="sidebar-left-content">
        <div className="card">
          <div className="card-header">
            <h3 className="link_default m-0">
              <i className="fa fa-bullhorn link_icon" aria-hidden="true"></i>{" "}
              Send E-mail
            </h3>
            Count:
            {form?.affiliateStatus
              ? relatedAffiliate?.totalActive
              : relatedAffiliate?.totalJoined}
            <button
              type="button"
              className="btn btn-outline-primary me-2"
              onClick={() => setShowLogsModal(true)}
            >
              View Email Logs
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitWithValidation}>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-4">
                  <div className="form-group">
                    <label className="form-label">Recipient Type</label>
                    <div className="form-check mb-3">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={form?.isAllJoined}
                        onChange={() => handleRecipientChange("allJoined")}
                      />
                      <label className="form-check-label">
                        All Joined ({relatedAffiliate?.totalJoined})
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={form?.affiliateStatus}
                        onChange={() =>
                          handleRecipientChange("activeAffiliates")
                        }
                      />
                      <label className="form-check-label">
                        Active Affiliates ({relatedAffiliate?.totalActive})
                      </label>
                    </div>
                    {errors.recipientType && (
                      <div className="text-danger small">
                        {errors.recipientType}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      Time Interval (Optional)
                    </label>
                    <div className="form-check mb-3">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={form?.timeInterval === "before"}
                        onChange={() => handleTimeIntervalChange("before")}
                      />
                      <label className="form-check-label">Before</label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={form?.timeInterval === "after"}
                        onChange={() => handleTimeIntervalChange("after")}
                      />
                      <label className="form-check-label">After</label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={
                          form?.timeInterval === "none" ||
                          form?.timeInterval === ""
                        }
                        onChange={() => handleTimeIntervalChange("none")}
                      />
                      <label className="form-check-label">None</label>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4">
                  <div className="form-group mb-3">
                    <label className="form-label">Joined Date</label>
                    <input
                      ref={dateInputRef}
                      type="date"
                      className={`form-control ${errors.acceptedDate ? "is-invalid" : ""
                        }`}
                      disabled={!form?.timeInterval}
                      value={moment(form?.acceptedDate).format("YYYY-MM-DD")}
                      onChange={handleDateChange}
                      onClick={handleClick}
                      max={moment().format("YYYY-MM-DD")}
                    />
                    {errors.acceptedDate && (
                      <div className="invalid-feedback">
                        {errors.acceptedDate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group mb-3">
                    <label className="form-label">Email Template Preview</label>

                    <div className="mb-3">
                      <label className="form-label">Insert Shortcodes:</label>
                      <div className="d-flex flex-wrap gap-2">
                        {shortcodes.map((shortcode, index) => (
                          <button
                            key={index}
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => insertShortcode(shortcode.value)}
                            title={shortcode.label}
                          >
                            {shortcode.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setShowPasteModal(true)}
                        >
                          Paste HTML
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={clearEditor}
                        >
                          Clear Editor
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm"
                          onClick={resetToDefaultTemplate}
                        >
                          Reset Template
                        </button>
                      </div>
                    </div>
                    <div>
                      <Editor
                        apiKey="zua062bxyqw46jy8bhcu8tz9aw6q37sb1pln5kwrnhnr319g"
                        className='tuncketcls'
                        value={emailTemplate}
                        onEditorChange={(newValue) => {
                          setEmailTemplate(newValue);
                          setForm((prev) => ({
                            ...prev,
                            emailTemplate: newValue,
                            content: newValue,
                          }));
                        }}
                        onInit={(evt, editor) => setEditorRef(editor)}
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            "lists",
                            "link",
                            "image",
                            "table",
                            "code",
                            "textcolor" // This plugin enables both text and background color pickers
                          ],
                          toolbar: "undo redo | formatselect | bold italic | forecolor backcolor | image | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat",
                          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          file_picker_callback,
                          fixed_toolbar_container: '#toolbar-container',
                          toolbar_sticky: true,
                          toolbar_sticky_offset: 64,
                          color_cols: 5,
                          // Ensure both color buttons are enabled
                          textcolor_map: [
                            "000000", "Black",
                            "FFFFFF", "White",
                            // add more colors as needed
                          ],
                          // Or use this for more colors:
                          textcolor_rows: 5,
                          textcolor_cols: 8,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary">
                  Send E-mail
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <EmailLogsModal
        show={showLogsModal}
        handleClose={() => setShowLogsModal(false)}
      />

      {showPasteModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Paste HTML</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPasteModal(false);
                    setHtmlToPaste("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  ref={pasteTextareaRef}
                  className="form-control"
                  rows={10}
                  value={htmlToPaste}
                  onChange={(e) => setHtmlToPaste(e.target.value)}
                  placeholder="Paste your HTML code here..."
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasteModal(false);
                    setHtmlToPaste("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasteHtml}
                  disabled={!htmlToPaste.trim()}
                >
                  Insert HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Html;
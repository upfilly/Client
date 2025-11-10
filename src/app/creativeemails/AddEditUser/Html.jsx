import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import methodModel from "@/methods/methods";
import Layout from "../../components/global/layout";
import "react-quill/dist/quill.snow.css";
import { useParams, useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import crendentialModel from "@/models/credential.model";

const Html = () => {
  const user = crendentialModel.getUser();
  const { id } = useParams();
  const [form, setform] = useState({
    templateName: "",
    content: "",
    emailName: "",
    format: "Text",
    subject: "",
    htmlContent: "",
    textContent: "",
    personalizationTags: [],
    textJSONContent: {},
  });
  const [tab, setTab] = useState("form");
  const [submitted, setSubmitted] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const specialChars = useRef([]);
  const [variables, setVariables] = useState("");
  const [htmlCode, setHtmlCode] = useState(false);
  const formValidation = [
    { key: "templateName", key: "campaign_id", required: true },
  ];
  const router = useRouter();
  const tinyMCEditorRef = useRef(null);
  const [editorRef, setEditorRef] = useState(null);
  const [camppaignData, setCamppaignData] = useState([]);

  const shortcodes = [{ label: "Affiliate Link", value: "{affiliateLink}" }];

  const exportHtml = (e) => {
    if (e) e.preventDefault();

    if (tinyMCEditorRef.current) {
      const content = tinyMCEditorRef.current.getContent();
      setform({
        ...form,
        textContent: content,
        textJSONContent: {}, // Not needed for TinyMCE
      });
      handleSubmit();
    }
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

        setform((prev) => ({
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

  const capitalFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getCampaignData = (p = {}) => {
    let url = "campaign/brand/all";
    ApiClient.get(url, { brand_id: user?.id }).then((res) => {
      if (res.success) {
        const campaign = res.data.data.map((dat) => {
          return {
            name: capitalFirstLetter(dat?.name),
            id: dat?.id || dat?._id,
            isDefault: dat?.isDefault,
          };
        });
        campaign.sort((a, b) => b.isDefault - a.isDefault);
        setCamppaignData(campaign);
      }
    });
  };

  const generateTinyMCEPreview = () => {
    if (tinyMCEditorRef.current) {
      return tinyMCEditorRef.current.getContent();
    }
    return "";
  };

  const handlePreview = async (e) => {
    if (e) e.preventDefault();

    setIsGeneratingPreview(true);

    try {
      let content = "";

      if (form?.format === "Text") {
        content = generateTinyMCEPreview();
        setform((prevForm) => ({
          ...prevForm,
          textContent: content,
        }));
      } else {
        content = form?.htmlContent || "";
      }

      setPreviewContent(content);
      setTab("preview");
    } catch (error) {
      console.error("Error generating preview:", error);
      toast.error("Error generating preview");
    } finally {
      setIsGeneratingPreview(false);
    }
  };

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
      ...form,
      emailName: form?.templateName,
      subject: form?.templateName,
      from: form?.templateName,
      id: id,
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
        toast.success(res?.message);
        router.push("/creativeemails");
      }
      loader(false);
    });
  };

  const handleSaveFromPreview = async (e) => {
    e.preventDefault();

    if (form?.format === "Text" && tinyMCEditorRef.current) {
      setIsGeneratingPreview(true);
      try {
        const htmlContent = generateTinyMCEPreview();
        const updatedForm = {
          ...form,
          textContent: htmlContent,
        };
        setform(updatedForm);

        setTimeout(() => {
          handleSubmit();
        }, 100);
      } catch (error) {
        console.error("Error saving from preview:", error);
        toast.error("Error saving template");
      } finally {
        setIsGeneratingPreview(false);
      }
    } else {
      handleSubmit();
    }
  };

  useEffect(() => {
    getCampaignData();
    if (id) {
      loader(true);
      ApiClient.get("emailtemplate", { id: id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let payload = form;
          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });
          setform({
            ...payload,
            campaign_id: campaign_id?.id || campaign_id?._id,
            id: id,
          });
        }
        loader(false);
      });
    }
  }, []);

  const onSelect = (e) => {};

  const onRemove = (e) => {};

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

      const updatedText =
        textBeforeCursor + "{" + variable + "}" + textAfterCursor;
      textarea.value = updatedText;
      setform({ ...form, content: updatedText });

      textarea.focus();
      textAreaRef.current.selectionEnd = end + variable.length + 2;
    } catch (err) {}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlepersonalize();
    }
  };

  const handlepersonalize = () => {
    if (!variables) {
      return;
    } else {
      let personalize = form?.personalizationTags || [];
      personalize.push(variables);
      setform({ ...form, personalizationTags: personalize });
      setVariables("");
    }
  };

  const removepersonalize = (name) => {
    let personalize = form?.personalizationTags || [];
    if (personalize?.length == 0) {
      return;
    }
    personalize = personalize.filter((itm) => itm != name);
    setform({ ...form, personalizationTags: personalize });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (form?.format == "Text" && tinyMCEditorRef.current) {
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
                <div className="pprofile1 pt-0 p-3 p-md-4">
                  <div className="add_team_bx mt-0">
                    <div className="pprofile1 add-emial-bg-none">
                      <div className="flex items-center mb-8">
                        <div className="d-flex align-items-baseline add_memeber_bx  mb-3">
                          <a onClick={() => router.back()}>
                            <i
                              className="fa fa-arrow-left mr-1 left_arrows"
                              title="Back"
                              aria-hidden="true"
                            ></i>
                          </a>
                          <div className="Profilehedding">
                            <h3 className="add_email">
                              {form && form?.id ? "Edit" : "Add "} Email
                            </h3>
                            <p className="mb-0 add_detils">
                              Here you can see all about your Email
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label ">
                            Email Title<span className="star">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Email Name"
                            value={form?.templateName}
                            onChange={(e) =>
                              setform({ ...form, templateName: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>
                          Campaign<span className="star">*</span>
                        </label>
                        <div className="select_row">
                          <SelectDropdown
                            theme="search"
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="Select Campaign"
                            intialValue={form?.campaign_id}
                            result={(e) => {
                              setform({ ...form, campaign_id: e.value });
                            }}
                            options={camppaignData}
                          />
                        </div>
                        {submitted && !form?.campaign_id && (
                          <div className="invalid-feedback d-block">
                            Campaign is required
                          </div>
                        )}
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="form-label">
                            Insert Shortcodes:
                          </label>
                          <ul className="nav nav-tabs flex mb-2 d-flex justify-content-start gap-2 flex-wrap align-items-center border-bottom-0 pb-0 pb-md-2">
                            <li className="nav-item flex mr-0 cursor-pointer mt-0 set_buttons">
                              <a
                                className={` ${
                                  form?.format == "Text"
                                    ? " btn btn-outline-light"
                                    : " btn btn-primary"
                                }`}
                                onClick={() =>
                                  setform({ ...form, format: "HTML" })
                                }
                              >
                                Html Code
                              </a>
                            </li>

                            <li className="nav-item cursor-pointer mt-0 set_buttons">
                              <a
                                className={` ${
                                  form?.format !== "Text"
                                    ? " btn btn-outline-light"
                                    : " btn btn-primary"
                                }`}
                                onClick={() =>
                                  setform({ ...form, format: "Text" })
                                }
                              >
                                Editor
                              </a>
                            </li>

                            <div className="d-flex flex-wrap gap-2">
                              {shortcodes.map((shortcode, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    insertShortcode(shortcode.value)
                                  }
                                  title={shortcode.label}
                                >
                                  {shortcode.label}
                                </button>
                              ))}
                            </div>
                          </ul>

                          <div className="">
                            {form?.format !== "Text" ? (
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
                                <Editor
                                  apiKey="zua062bxyqw46jy8bhcu8tz9aw6q37sb1pln5kwrnhnr319g"
                                  onInit={(evt, editor) =>
                                    setEditorRef(
                                      (tinyMCEditorRef.current = editor)
                                    )
                                  }
                                  initialValue={""}
                                  init={{
                                    height: 500,
                                    menubar: true,
                                    plugins: [
                                      "advlist autolink lists link image charmap print preview anchor",
                                      "searchreplace visualblocks code fullscreen",
                                      "insertdatetime media table paste code help wordcount",
                                      "image",
                                      "media",
                                      "textcolor",
                                      "colorpicker",
                                    ],
                                    toolbar:
                                      "undo redo | formatselect | bold italic forecolor backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | image media | \
              removeformat | help",
                                    content_style:
                                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

                                    // Direct image upload as base64
                                    images_upload_handler: (
                                      blobInfo,
                                      progress
                                    ) =>
                                      new Promise((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          resolve(reader.result);
                                        };
                                        reader.onerror = (error) => {
                                          reject(
                                            "Image upload failed: " + error
                                          );
                                        };
                                        reader.readAsDataURL(blobInfo.blob());
                                      }),

                                    // Text and background color options
                                    textcolor_map: [
                                      "000000",
                                      "Black",
                                      "993300",
                                      "Burnt orange",
                                      "333300",
                                      "Dark olive",
                                      "003300",
                                      "Dark green",
                                      "003366",
                                      "Dark azure",
                                      "000080",
                                      "Navy Blue",
                                      "333399",
                                      "Indigo",
                                      "333333",
                                      "Very dark gray",
                                      "800000",
                                      "Maroon",
                                      "FF6600",
                                      "Orange",
                                      "808000",
                                      "Olive",
                                      "008000",
                                      "Green",
                                      "008080",
                                      "Teal",
                                      "0000FF",
                                      "Blue",
                                      "666699",
                                      "Grayish blue",
                                      "808080",
                                      "Gray",
                                      "FF0000",
                                      "Red",
                                      "FF9900",
                                      "Amber",
                                      "99CC00",
                                      "Yellow green",
                                      "339966",
                                      "Sea green",
                                      "33CCCC",
                                      "Turquoise",
                                      "3366FF",
                                      "Royal blue",
                                      "800080",
                                      "Purple",
                                      "999999",
                                      "Medium gray",
                                      "FF00FF",
                                      "Magenta",
                                      "FFCC00",
                                      "Gold",
                                      "FFFF00",
                                      "Yellow",
                                      "00FF00",
                                      "Lime",
                                      "00FFFF",
                                      "Aqua",
                                      "00CCFF",
                                      "Sky blue",
                                      "993366",
                                      "Red violet",
                                      "FFFFFF",
                                      "White",
                                      "FF99CC",
                                      "Pink",
                                      "FFCC99",
                                      "Peach",
                                      "FFFF99",
                                      "Light yellow",
                                      "CCFFCC",
                                      "Pale green",
                                      "CCFFFF",
                                      "Pale cyan",
                                      "99CCFF",
                                      "Light sky blue",
                                      "CC99FF",
                                      "Plum",
                                    ],
                                    color_cols: 8,
                                    color_map: [
                                      "000000",
                                      "Black",
                                      "FFFFFF",
                                      "White",
                                      "FF0000",
                                      "Red",
                                      "00FF00",
                                      "Green",
                                      "0000FF",
                                      "Blue",
                                      "FFFF00",
                                      "Yellow",
                                      "00FFFF",
                                      "Cyan",
                                      "FF00FF",
                                      "Magenta",
                                    ],

                                    // Automatic uploads when images are pasted or dropped
                                    automatic_uploads: true,
                                    paste_data_images: true,
                                  }}
                                  onEditorChange={(content) => {
                                    setform({
                                      ...form,
                                      textContent: content,
                                    });
                                  }}
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
                              "Preview"
                            )}
                          </button>
                          <button type="submit" className="btn btn-primary">
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
                    {form?.format === "Text" ? "Rich Text" : "HTML Code"}{" "}
                    Preview
                  </div>
                </div>

                <div className="preview-content">
                  {previewContent ||
                  form?.content ||
                  form?.textContent ||
                  form?.htmlContent ? (
                    <div
                      className="shadow-box border !border-grey p-3 bg-white rounded-large"
                      style={{
                        minHeight: "400px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        border: "1px solid #e5e5e5",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          previewContent ||
                          form?.content ||
                          form?.textContent ||
                          form?.htmlContent ||
                          "<p>No content to preview</p>",
                      }}
                    ></div>
                  ) : (
                    <>
                      <div className="no-data">
                        <img
                          src="/assets/img/no-data-placeholder.svg"
                          alt="img"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="d-flex justify-end gap-2 mt-4 text-right flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn btn-secondary mr-3"
                    onClick={() => {
                      setTab("form");
                    }}
                  >
                    <i className="fa fa-arrow-left mr-2"></i>
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-success mr-3"
                    onClick={handlePreview}
                    disabled={isGeneratingPreview}
                  >
                    <i className="fa fa-refresh mr-2"></i>
                    Refresh Preview
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveFromPreview}
                    disabled={isGeneratingPreview}
                  >
                    <i className="fa fa-save mr-2"></i>
                    Save Template
                  </button> */}
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
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Body
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <span
                      dangerouslySetInnerHTML={{ __html: form?.content }}
                    ></span>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
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

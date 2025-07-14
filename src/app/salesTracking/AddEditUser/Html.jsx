import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import "../style.scss";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import ImageUpload from "@/app/components/common/ImageUpload";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import crendentialModel from "@/models/credential.model";

const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Html = ({
  id,
  BrandData,
  form,
  affiliateData,
  handleSubmit,
  setform,
  submitted,
  images,
  imageResult,
  getError,
  setEyes,
  eyes,
  back,
  emailCheck,
  emailErr,
  emailLoader,
}) => {
  const [imageError, setImageError] = useState("");
  const [profileData, setProfileData] = useState();
  const user = crendentialModel.getUser();

  const handleImageUpload = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    if (file.size > MAX_SIZE) {
      setImageError("Image size must be less than 5MB");
      return false;
    }
    console.log(file, "file");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPEG, JPG, PNG, or GIF images are allowed");
      return false;
    }

    setImageError("");
    imageResult(file, "image");
    return true;
  };

  const getProfileDetail = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: form?.brand_id }).then((res) => {
      if (res.success) {
        setProfileData(res.data);
      }
      loader(false);
    });
  };

  useEffect(() => {
    if (form?.brand_id) {
      getProfileDetail();
    }
  }, [form?.brand_id]);

  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={"Campaign"}
      filters={undefined}
    >
      <form onSubmit={handleSubmit} className="untracked-sales-form">
        <div className="sidebar-left-content">
          <div className="pprofile1 card card-shadow p-4">
            <div className="form-container">
              <div className="form-header">
                <h3 className="form-title">
                  <a onClick={(e) => back()} className="back-button">
                    <i
                      className="fa fa-arrow-left mr-2"
                      title="Back"
                      aria-hidden="true"
                    ></i>
                  </a>
                  {form?.id ? "Edit" : "Add"} Untracked Sales
                </h3>
                <hr className="form-divider" />
              </div>

              <div className="form-row">
                {/* Title Field */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    Title<span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      submitted && !form?.title ? "is-invalid" : ""
                    }`}
                    value={form.title || ""}
                    onChange={(e) =>
                      setform({ ...form, title: e.target.value })
                    }
                    placeholder="Enter title"
                  />
                  {submitted && !form?.title && (
                    <div className="invalid-feedback">Title is required</div>
                  )}
                </div>

                {/* Brand Selection */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    Select Brand<span className="required-star">*</span>
                  </label>
                  <SelectDropdown
                    theme="search"
                    id="brandDropdown"
                    displayValue="name"
                    placeholder="Select Brand"
                    intialValue={form?.brand_id}
                    result={(e) => setform({ ...form, brand_id: e.value })}
                    options={BrandData}
                    className={submitted && !form?.brand_id ? "is-invalid" : ""}
                  />
                  {submitted && !form?.brand_id && (
                    <div className="invalid-feedback">Brand is required</div>
                  )}
                </div>

                {/* Amount Field */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    Amount<span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      submitted && !form?.amount ? "is-invalid" : ""
                    }`}
                    value={form.amount || ""}
                    onChange={(e) =>
                      setform({ ...form, amount: e.target.value })
                    }
                    placeholder="0.00"
                  />
                  {submitted && !form?.amount && (
                    <div className="invalid-feedback">Amount is required</div>
                  )}
                </div>

                {/* Currency Field */}
                {/* <div className="col-md-6 mb-4">
                                    <label className="form-label">
                                        Currency<span className="required-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${submitted && !form?.currency ? 'is-invalid' : ''}`}
                                        value={form.currency || ''}
                                        onChange={e => setform({ ...form, currency: e.target.value })}
                                        placeholder="USD"
                                    />
                                    {submitted && !form?.currency && (
                                        <div className="invalid-feedback">Currency is required</div>
                                    )}
                                </div> */}

                <div className="col-md-6 mb-3 custom-type">
                  <label>
                    Currency<span className="star">*</span>
                  </label>
                  <div className="select_row">
                    <SelectDropdown
                      theme="search"
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="Select Currency"
                      intialValue={form?.currency}
                      result={(e) => {
                        setform({ ...form, currency: e.value });
                      }}
                      options={profileData?.currencies?.map((dat) => {
                        return {
                          name: dat,
                          id: dat,
                        };
                      })}
                    />
                  </div>
                  {submitted && !form?.currency && (
                    <div className="invalid-feedback d-block">
                      Currency is required
                    </div>
                  )}
                </div>

                {/* Commission Field */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    Commission<span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      submitted && !form?.commission ? "is-invalid" : ""
                    }`}
                    value={form.commission || ""}
                    onChange={(e) =>
                      setform({ ...form, commission: e.target.value })
                    }
                    placeholder="0.00"
                  />
                  {submitted && !form?.commission && (
                    <div className="invalid-feedback">
                      Commission is required
                    </div>
                  )}
                </div>

                {/* Customer Reference */}
                {/* <div className="col-md-6 mb-4">
                                    <label className="form-label">
                                        Customer Reference<span className="required-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${submitted && !form?.customer_reference ? 'is-invalid' : ''}`}
                                        value={form.customer_reference || ''}
                                        onChange={e => setform({ ...form, customer_reference: e.target.value })}
                                        placeholder="Enter reference"
                                    />
                                    {submitted && !form?.customer_reference && (
                                        <div className="invalid-feedback">Customer reference is required</div>
                                    )}
                                </div> */}

                {/* Order Reference */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    Order Reference<span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      submitted && !form?.order_reference ? "is-invalid" : ""
                    }`}
                    value={form.order_reference || ""}
                    onChange={(e) =>
                      setform({ ...form, order_reference: e.target.value })
                    }
                    placeholder="Enter order reference"
                  />
                  {submitted && !form?.order_reference && (
                    <div className="invalid-feedback">
                      Order reference is required
                    </div>
                  )}
                </div>

                {/* Order Date */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">
                    Order Date<span className="required-star">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${
                      submitted && !form?.order_date ? "is-invalid" : ""
                    }`}
                    value={form.order_date || ""}
                    onChange={(e) =>
                      setform({ ...form, order_date: e.target.value })
                    }
                  />
                  {submitted && !form?.order_date && (
                    <div className="invalid-feedback">
                      Order date is required
                    </div>
                  )}
                </div>

                {/* Type Selection */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">Type</label>
                  <SelectDropdown
                    theme="search"
                    id="typeDropdown"
                    displayValue="name"
                    placeholder="Select Type"
                    intialValue={form?.type}
                    result={(e) => setform({ ...form, type: e.value })}
                    options={[
                      { name: "Untracked", id: "unTracked" },
                      { name: "Incorrect", id: "Incorrect" },
                      { name: "Declined", id: "Declined" },
                    ]}
                    className={submitted && !form?.type ? "is-invalid" : ""}
                  />
                  {submitted && !form?.type && (
                    <div className="invalid-feedback">Type is required</div>
                  )}
                </div>

                {/* Timezone Selection */}
                {/* <div className="col-md-6 mb-4">
                                    <label className="form-label">TimeZone</label>
                                    <SelectDropdown
                                        theme="search"
                                        id="timezoneDropdown"
                                        displayValue="name"
                                        placeholder="Select TimeZone"
                                        intialValue={form?.timeZone}
                                        result={e => setform({ ...form, timeZone: e.value })}
                                        options={[
                                            { name: 'Europe/Dublin', id: 'Europe/Dublin' }
                                        ]}
                                    />
                                </div> */}

                {/* Description (Rich Text Editor) */}
                <div className="col-md-12 mb-4">
                  <label className="form-label">Notes</label>
                  <div
                    className={`rich-text-editor ${
                      submitted && !form?.description ? "is-invalid" : ""
                    }`}
                  >
                    <DynamicReactQuill
                      theme="snow"
                      value={form?.description || ""}
                      onChange={(newValue) =>
                        setform({ ...form, description: newValue })
                      }
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ size: [] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                          ],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "indent",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </div>
                  {submitted && !form?.description && (
                    <div className="invalid-feedback">
                      Description is required
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="col-md-6 mb-4">
                  <label className="form-label">Image</label>
                  <div className="image-upload-container">
                    <ImageUpload
                      model="untrackSales"
                      type="file"
                      result={handleImageUpload}
                      value={images}
                      multiple={false}
                    />
                    {imageError && (
                      <div className="invalid-feedback d-block">
                        {imageError}
                      </div>
                    )}
                    <div className="upload-hint">
                      <small className="text-muted">
                        Max file size: 5MB (JPEG, JPG, PNG, GIF)
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions text-right">
                <button type="submit" className="btn btn-primary submit-button">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Html;

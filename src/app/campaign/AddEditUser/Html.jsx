import React, { useEffect, useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import "../style.scss";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import MultiSelectDropdownData from "../MultiSelectDropdownData";
import MultiSelectRegionDropdown from "../MultiSelectRegion";
import MultiSelectValue from "@/app/components/common/MultiSelectValue";
import Affiliateprogrammanagement from "./campaigntabs/Affiliateprogrammanagement";
import Swal from "sweetalert2";

const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Html = ({
  id,
  form,
  affiliateData,
  selectedRegionItems,
  setSelectedRegionItems,
  handleSubmit,
  setform,
  submitted,
  back,
  errors,
  selectedItems,
  setSelectedItems,
  profileData,
  formData,
  setFormData,
  formPpcData,
  setFormPpcData,
  formPublisherData,
  setFormPublisherData,
  formTransactionData,
  setFormTransactionData,
  isAgreed,
  setIsAgreed,
  legalTerm,
  setlegalTerm,
  formFields,
  formPpcFields,
  formTransactionFields,
  formPublisherFields,
  campaignType,
}) => {
  const [loadDocerr, setDocLoader] = useState(false);
  const [docLoder, setDocLoder] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegionOpen, setRegionIsOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const EventType = [
    { id: "lead", name: "Lead" },
    { id: "purchase", name: "Purchase" },
  ];

  const [isTypeDisabled, setIsTypeDisabled] = useState(false);

  // Patch categories and regions when editing
  useEffect(() => {
    if (categories.length > 0 && form?.categories?.length > 0) {
      const selectedCats = form.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
      }));
      setSelectedItems({ categories: selectedCats });
    }

    if (form?.regions?.length > 0) {
      const selectedRegs = form.regions.map((reg) => ({
        id: reg.id,
        name: reg.name,
      }));
      setSelectedRegionItems({ regions: selectedRegs });
    }
  }, [categories, form?.categories, form?.regions]);

  const handleDefaultCampaignChange = (e) => {
    const checked = e.target.checked;
    setform({ ...form, isDefault: checked });

    if (checked) {
      setform((prev) => ({ ...prev, access_type: "public" }));
      setIsTypeDisabled(true);
      Swal.fire({
        icon: "info",
        title: "Default Campaign Selected",
        text: "This campaign is now set as default. Type is set to Public.",
        confirmButtonText: "OK",
      });
    } else {
      setIsTypeDisabled(false);
    }
  };

  const uploadDocument = async (e) => {
    const files = e.target.files;
    const uploadedFileNames = [];
    setDocLoder(true);

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const originalName = file.name;
      const isImage = file.type.startsWith("image/");
      const url = isImage
        ? "upload/image?modelName=campaign"
        : "upload/document";

      try {
        const res = await ApiClient.postFormData(url, { file: file });

        if (res.success) {
          const path = res?.data?.imagePath;
          const docPath = `documents/${path}`;

          if (form?.documents?.length < 10) {
            if (isImage) {
              form.images.push({
                name: originalName,
                url: `images/campaign/${res?.data?.fullpath}`,
              });
            } else {
              form.documents.push({
                name: originalName,
                url: docPath,
              });
            }
          }
          uploadedFileNames.push(originalName);
        }
      } catch (error) {
        console.error(`Upload failed for ${originalName}`, error);
      }
    }

    setDocLoder(false);
  };

  const remove = (index) => {
    const filterImg = form?.images?.filter((_, indx) => index !== indx);
    setform({ ...form, images: filterImg });
  };

  const removeDocument = (index) => {
    const filterVid = form?.documents?.filter((_, indx) => index !== indx);
    setform({ ...form, documents: filterVid });
  };

  const getCategory = () => {
    let url = `categoryWithSub?page&count&search&cat_type=advertiser_categories&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data
          .map((data) => (data.parent_cat_name ? data : undefined))
          .filter((item) => item !== undefined);
        setCategories(data);
      }
    });
  };

  const handleNumericInput = (e, fieldName) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setform({ ...form, [fieldName]: value });
    }
  };

  const handleNumericCommissionInput = (e, field) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const numericValue = parseFloat(value);
      if (value === "" || (!isNaN(numericValue) && numericValue <= 100)) {
        setform((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleAcceptTerms = (isAccepted) => {
    setIsTermsAccepted(isAccepted);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Layout name={"Campaign"}>
      <form onSubmit={handleSubmit}>
        <div className="sidebar-left-content">
          <div className="pprofile1 card card-shadow p-3 p-sm-4">
            <div className="">
              <div
                className="main_title_head profile-card"
                onClick={() => {
                  setIsOpen(false);
                  setRegionIsOpen(false);
                }}
              >
                <h3 className="VieUser">
                  <a to="/campaign" onClick={(e) => back()}>
                    <i
                      className="fa fa-arrow-left mr-2"
                      title="Back"
                      aria-hidden="true"
                    ></i>
                  </a>
                  {form && form.id ? "Edit" : "Add"} Campaign
                </h3>
                <hr />
              </div>

              <div className="form-row">
                {/* Campaign Name */}
                <div
                  className="col-md-6 mb-3 custom-input"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>
                    Name<span className="star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setform({ ...form, name: e.target.value })}
                  />
                  {submitted && !form?.name && (
                    <div className="invalid-feedback d-block">
                      {errors?.name}
                    </div>
                  )}
                </div>

                {/* Campaign Type */}
                <div
                  className="col-md-6 mb-3 custom-type"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>
                    Type<span className="star">*</span>
                  </label>
                  <div className="select_row">
                    <SelectDropdown
                      theme="search"
                      displayValue="name"
                      placeholder="Select Type"
                      intialValue={form?.access_type}
                      disabled={isTypeDisabled}
                      result={(e) => {
                        const newAccessType = e.value;
                        const isPrivate = newAccessType === "private";
                        setform((prev) => ({
                          ...prev,
                          access_type: newAccessType,
                          ...(isPrivate && { campaign_type: "automatic" }),
                        }));
                      }}
                      options={[
                        { id: "public", name: "Public" },
                        { id: "private", name: "Private" },
                      ]}
                    />
                  </div>
                  {submitted && !form?.access_type && (
                    <div className="invalid-feedback d-block">
                      {errors?.access_type}
                    </div>
                  )}
                </div>

                {/* Currency */}
                <div
                  className="col-md-6 mb-3 custom-type"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>
                    Currency<span className="star">*</span>
                  </label>
                  <div className="select_row">
                    <SelectDropdown
                      theme="search"
                      displayValue="name"
                      placeholder="Select Currency"
                      intialValue={form?.currencies}
                      result={(e) => setform({ ...form, currencies: e.value })}
                      options={
                        profileData?.currencies?.map((dat) => ({
                          name: dat,
                          id: dat,
                        })) || []
                      }
                    />
                  </div>
                  {submitted && !form?.currencies && (
                    <div className="invalid-feedback d-block">
                      {errors?.currencies}
                    </div>
                  )}
                  {(!profileData?.currencies ||
                    profileData?.currencies?.length === 0) && (
                    <div className="text-danger small mt-2">
                      Note: You don't have any currencies. Please update your
                      profile first.
                    </div>
                  )}
                </div>

                {/* Affiliate (Private Campaign) */}
                {form?.access_type === "private" && (
                  <div
                    className="col-md-6 mb-3 event-select affiliate"
                    onClick={() => {
                      setIsOpen(false);
                      setRegionIsOpen(false);
                    }}
                  >
                    <label>
                      Affiliate<span className="star">*</span>
                    </label>
                    <div className="select_row">
                      <MultiSelectValue
                        displayValue="name"
                        placeholder="Select Affiliate"
                        intialValue={form?.affiliate_id}
                        result={(e) =>
                          setform({ ...form, affiliate_id: e.value })
                        }
                        disabled={
                          form?.status === "rejected" || !id ? false : true
                        }
                        options={affiliateData}
                      />
                    </div>
                    {submitted && !form?.affiliate_id && (
                      <div className="invalid-feedback d-block">
                        {errors?.affiliate_id}
                      </div>
                    )}
                  </div>
                )}

                {/* Event Type */}
                <div
                  className="col-md-6 mb-3"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>
                    Event Type:<span className="star">*</span>
                  </label>
                  <div className="select_row event-select">
                    <MultiSelectValue
                      intialValue={form.event_type}
                      options={EventType}
                      result={(res) =>
                        setform({ ...form, event_type: res.value })
                      }
                      displayValue="name"
                      placeholder="Select Event Type"
                      disabled={!!id}
                      isSingle={false}
                    />
                  </div>
                  {submitted &&
                    (!form?.event_type || form.event_type.length === 0) && (
                      <div className="invalid-feedback d-block">
                        {errors?.event_type}
                      </div>
                    )}
                </div>

                {/* Affiliate Approval */}
                <div
                  className="col-md-6 mb-3"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>
                    Affiliate Approval:<span className="star">*</span>
                  </label>
                  <div className="select_row event-select affiliate">
                    <MultiSelectValue
                      isSingle={true}
                      displayValue="label"
                      placeholder="Select Approval"
                      intialValue={form?.campaign_type}
                      disabled={form?.access_type === "private" || !!id}
                      result={(e) =>
                        setform((prev) => ({ ...prev, campaign_type: e.value }))
                      }
                      options={[
                        { id: "manual", label: "Manual" },
                        { id: "automatic", label: "Automatic" },
                      ]}
                    />
                  </div>
                  {submitted && !form?.campaign_type && (
                    <div className="invalid-feedback d-block">
                      {errors?.campaign_type}
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div
                  className="col-md-12 mb-3 category-dropdown"
                  onClick={() => setRegionIsOpen(false)}
                >
                  <label>
                    Select Category<span className="star">*</span>
                  </label>
                  <div className="drops category-input">
                    <MultiSelectDropdownData
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      data={categories}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                    />
                  </div>
                  {submitted && selectedItems?.categories?.length === 0 && (
                    <div className="invalid-feedback d-block">
                      {errors?.categories}
                    </div>
                  )}
                </div>

                {/* Regions */}
                <div
                  className="col-md-12 mb-3 category-dropdown"
                  onClick={() => setIsOpen(false)}
                >
                  <label>
                    Select Country<span className="star">*</span>
                  </label>
                  <div className="drops category-input">
                    <MultiSelectRegionDropdown
                      isRegionOpen={isRegionOpen}
                      setRegionIsOpen={setRegionIsOpen}
                      selectedItems={selectedRegionItems}
                      setSelectedItems={setSelectedRegionItems}
                    />
                  </div>
                  {submitted && selectedRegionItems?.regions?.length === 0 && (
                    <div className="invalid-feedback d-block">
                      {errors?.region}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div
                  className="col-md-12 mb-3 custom-description"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>
                    Description<span className="star">*</span>
                  </label>
                  <DynamicReactQuill
                    theme="snow"
                    value={form?.description || ""}
                    onChange={(newValue) =>
                      setform((prev) => ({ ...prev, description: newValue }))
                    }
                    className="tuncketcls"
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
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
                  />
                  {submitted && !form?.description && (
                    <div className="invalid-feedback d-block">
                      Description is Required
                    </div>
                  )}
                </div>

                {/* Documents Upload */}
                <div
                  className="col-md-6"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <label>Document(Max. Limit 10)</label>
                  <div className="form-group drag_drop">
                    <div className="upload_file">
                      {form?.documents?.length <= 9 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary upload_image"
                          >
                            Upload Document
                          </button>
                          <input
                            type="file"
                            className="form-control-file over_input"
                            accept=".doc,.docx,.xml,.xls,.xlsx,.pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            multiple={true}
                            onChange={(e) => {
                              setDocLoder(true);
                              uploadDocument(e);
                            }}
                          />
                        </>
                      )}
                      {loadDocerr && docLoder && (
                        <div className="text-success text-center mt-5 top_loading">
                          Uploading... <i className="fa fa-spinner fa-spin"></i>
                        </div>
                      )}
                      <div className="imagesRow mt-4 img-wrappper">
                        {form?.documents?.map((itm, i) => (
                          <div className="imagethumbWrapper cover" key={i}>
                            <img
                              src="/assets/img/document.png"
                              onClick={() =>
                                window.open(methodModel.noImg(itm?.url))
                              }
                              alt="Document"
                            />
                            <i
                              className="fa fa-times kliil"
                              title="Remove"
                              onClick={() => removeDocument(i)}
                            ></i>
                            <div>{itm?.name}</div>
                          </div>
                        ))}
                      </div>
                      <div className="imagesRow mt-4">
                        {form?.images?.map((itm, i) => (
                          <div className="imagethumbWrapper" key={i}>
                            <img
                              src={methodModel.noImg(itm?.url)}
                              className="thumbnail"
                              alt="Upload"
                            />
                            <i
                              className="fa fa-times kliil"
                              title="Remove"
                              onClick={() => remove(i)}
                            ></i>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affiliate Program Management */}
                <div
                  className="col-md-12 mb-3"
                  onClick={() => {
                    setIsOpen(false);
                    setRegionIsOpen(false);
                  }}
                >
                  <Affiliateprogrammanagement
                    onAcceptTerms={handleAcceptTerms}
                    formData={formData}
                    setFormData={setFormData}
                    formPpcData={formPpcData}
                    setFormPpcData={setFormPpcData}
                    formPublisherData={formPublisherData}
                    setFormPublisherData={setFormPublisherData}
                    formTransactionData={formTransactionData}
                    setFormTransactionData={setFormTransactionData}
                    isAgreed={isAgreed}
                    setIsAgreed={setIsAgreed}
                    legalTerm={legalTerm}
                    setlegalTerm={setlegalTerm}
                    formFields={formFields}
                    formPpcFields={formPpcFields}
                    formTransactionFields={formTransactionFields}
                    formPublisherFields={formPublisherFields}
                  />
                </div>
              </div>

              <div
                className="text-right edit-btns mt-0"
                onClick={() => {
                  setIsOpen(false);
                  setRegionIsOpen(false);
                }}
              >
                {!isTermsAccepted && (
                  <p className="text-danger">
                    *Accept terms and conditions of legal terms
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!isTermsAccepted}
                  className="btn btn-primary"
                >
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

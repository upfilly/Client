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
  console.log(form?.campaign_type, "form?.campaign_type");

  const [loadDocerr, setDocLoader] = useState(false);
  const [docLoder, setDocLoder] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRegionOpen, setRegionIsOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const EventType = [
    { id: "lead", name: "Lead" },
    // { id: 'visitor', name: 'Visitor' },
    { id: "purchase", name: "Purchase" },
    // { id: 'line-item', name: 'Line-item' }
  ];

  console.log(profileData?.currencies, "profileData");

  const [isTypeDisabled, setIsTypeDisabled] = useState(false);

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
    } else if (checked) {
      setform((prev) => ({ ...prev, access_type: "private" }));
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
      const formDataKey = isImage ? "images" : "file";

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

  const remove = (index, key) => {
    const filterImg =
      form?.images.length > 0 &&
      form.images.filter((data, indx) => {
        return index !== indx;
      });
    setform({ ...form, images: filterImg });
  };

  const removeDocument = (index, key) => {
    const filterVid =
      form?.documents?.length > 0 &&
      form.documents.filter((data, indx) => {
        return index !== indx;
      });
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
    console.log("Terms accepted:", isAccepted);
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={"Campaign"}
      filters={undefined}
    >
      <form onSubmit={handleSubmit}>
        <div className="sidebar-left-content">
          <div className="pprofile1 card card-shadow p-3 p-sm-4">
            <div className="">
              <div className="main_title_head profile-card">
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
                <div className="col-md-6 mb-3 custom-input">
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

                <div className="col-md-6 mb-3 custom-type">
                  <label>
                    Type<span className="star">*</span>
                  </label>
                  <div className="select_row">
                    <SelectDropdown
                      theme="search"
                      id="statusDropdown"
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
                          ...(isPrivate && {
                            campaign_type: "automatic",
                          }),
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
                      intialValue={form?.currencies}
                      result={(e) => {
                        setform({ ...form, currencies: e.value });
                      }}
                      options={profileData?.currencies?.map((dat) => {
                        console.log(dat, "currency");

                        return {
                          name: dat,
                          id: dat,
                        };
                      })}
                    />
                  </div>
                  {submitted && !form?.currencies && (
                    <div className="invalid-feedback d-block">
                      {errors?.currencies}
                    </div>
                  )}

                  {/* Add this conditional note */}
                  {(!profileData?.currencies ||
                    profileData?.currencies == undefined) && (
                    <div className="text-danger  small mt-2">
                      Note: You don't have any currencies. Please update your
                      profile first.
                    </div>
                  )}
                </div>

                {form?.access_type === "private" && (
                  <div className="col-md-6 mb-3 event-select affiliate">
                    <label>
                      Affiliate<span className="star">*</span>
                    </label>
                    <div className="select_row">
                      <MultiSelectValue
                        id="statusDropdown"
                        displayValue="fullName"
                        placeholder="Select Affiliate"
                        intialValue={form?.affiliate_id}
                        result={(e) => {
                          setform({ ...form, affiliate_id: e.value });
                        }}
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

                <div className="col-md-6 mb-3">
                  <label>
                    Event Type:<span className="star">*</span>
                  </label>
                  <div className="select_row event-select">
                    <MultiSelectValue
                      intialValue={form.event_type} // Array of IDs like ["1", "2"] or single ID
                      options={EventType} // Array of {id, name} objects
                      result={(res) => {
                        // For multi-select:
                        setform({ ...form, event_type: res.value });
                        // For single select:
                        // setform({ ...form, event_type: res.value });
                      }}
                      displayValue="name"
                      placeholder="Select Event Type"
                      disabled={!!id}
                      isSingle={false} // Set to true for single-select mode
                    />
                  </div>
                  {submitted &&
                    (!form?.event_type || form.event_type.length === 0) && (
                      <div className="invalid-feedback d-block">
                        {errors?.event_type}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>
                    Affiliate Approval:<span className="star">*</span>
                  </label>
                  <div className="select_row event-select affiliate">
                    <MultiSelectValue
                      id="statusDropdown"
                      isSingle={true}
                      displayValue="label"
                      placeholder="Select Approval"
                      intialValue={
                        form?.campaign_type
                          ? Array.isArray(form.campaign_type)
                            ? form.campaign_type[0]
                            : form.campaign_type
                          : undefined
                      }
                      disabled={form?.access_type == "private" || !!id}
                      result={(e) => {
                        console.log("Selection result:", e);
                        setform((prevState) => ({
                          ...prevState,
                          campaign_type: e.value,
                        }));
                      }}
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

                {form?.event_type?.includes("purchase") && (
                  <div className="col-md-6 mb-3 custom-type">
                    <label>
                      Purchase Amount/Percentage Type
                      <span className="star">*</span>
                    </label>
                    <div className="select_row">
                      <SelectDropdown
                        theme="search"
                        id="amount_typeDropdown"
                        displayValue="name"
                        placeholder="Select Amount or Percentage"
                        intialValue={form?.commission_type}
                        disabled={!id ? false : true}
                        result={(e) => {
                          setform({ ...form, commission_type: e.value });
                        }}
                        options={[
                          { id: "percentage", name: "Percentage" },
                          { id: "amount", name: "Amount" },
                        ]}
                      />
                    </div>
                    {submitted && !form?.commission_type && (
                      <div className="invalid-feedback d-block">
                        {errors?.commission_type}
                      </div>
                    )}
                  </div>
                )}

                {form?.commission_type === "percentage" &&
                  form?.event_type?.includes("purchase") && (
                    <div className="col-md-6 mb-3">
                      <label>
                        Commission(%)<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form?.commission || ""}
                        disabled={!id ? false : true}
                        onChange={(e) =>
                          handleNumericCommissionInput(e, "commission")
                        }
                        placeholder="Enter Commission"
                      />
                      {submitted && !form?.commission && (
                        <div className="invalid-feedback d-block">
                          {errors?.commission}
                        </div>
                      )}
                    </div>
                  )}

                {form?.commission_type === "amount" &&
                  form?.event_type?.includes("purchase") && (
                    <div className="col-md-6 mb-3">
                      <label>
                        Commission Amount<span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={form?.commission || ""}
                        disabled={!id ? false : true}
                        onChange={(e) => handleNumericInput(e, "commission")}
                        placeholder="Enter Commission Amount"
                      />
                      {submitted && !form?.commission && (
                        <div className="invalid-feedback d-block">
                          {errors?.commission}
                        </div>
                      )}
                      {id && (
                        <div className="invalid-feedback d-block">
                          Note: Commission can't be changed on a published
                          campaign.
                        </div>
                      )}
                    </div>
                  )}

                {form?.event_type?.includes("lead") && (
                  <div className="col-md-6 mb-3 custom-input">
                    <label>
                      Lead Amount<span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form?.lead_amount || ""}
                      disabled={!id ? false : true}
                      onChange={(e) => handleNumericInput(e, "lead_amount")}
                      placeholder="Enter Lead Amount"
                    />
                    {submitted && !form?.lead_amount && (
                      <div className="invalid-feedback d-block">
                        {errors?.lead_amount}
                      </div>
                    )}
                    {id && (
                      <div className="invalid-feedback d-block">
                        Note: Lead Amount can't be changed on a published
                        campaign.
                      </div>
                    )}
                  </div>
                )}

                {form?.access_type === "private" ? (
                  <></>
                ) : (
                  <div className="col-md-12 mb-3 ">
                    <label>Default Campaign</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form?.isDefault || false}
                        onChange={handleDefaultCampaignChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="defaultCampaign"
                      >
                        Set this as the default campaign 
                      </label>
                    </div>
                  </div>
                )}

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

                <div className="col-md-12 mb-3 custom-description">
                  <label>
                    Description<span className="star">*</span>
                  </label>
                  <DynamicReactQuill
                    theme="snow"
                    value={form?.description ? form?.description : ""}
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
                          campaignType,
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
                    bounds={".app"}
                  />
                  {submitted && !form?.description && (
                    <div className="invalid-feedback d-block">
                      Description is Required
                    </div>
                  )}
                </div>

                <div className="col-md-6">
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
                        {form?.documents &&
                          form?.documents.map((itm, i) => {
                            return (
                              <div className="imagethumbWrapper cover" key={i}>
                                <img
                                  src="/assets/img/document.png"
                                  className=""
                                  onClick={() =>
                                    window.open(methodModel.noImg(itm?.url))
                                  }
                                  alt="Document"
                                />
                                <i
                                  className="fa fa-times kliil"
                                  title="Remove"
                                  onClick={(e) => removeDocument(i)}
                                ></i>
                                <div>{itm?.name}</div>
                              </div>
                            );
                          })}
                      </div>
                      <div className="imagesRow mt-4">
                        {form?.images &&
                          form?.images.map((itm, i) => {
                            return (
                              <div className="imagethumbWrapper" key={i}>
                                <img
                                  src={methodModel.noImg(itm?.url)}
                                  className="thumbnail"
                                  alt="Upload"
                                />
                                <i
                                  className="fa fa-times kliil"
                                  title="Remove"
                                  onClick={(e) => remove(i)}
                                ></i>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affiliate Program Management Component */}
                <div className="col-md-12 mb-3">
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

              

              <div className="text-right edit-btns mt-0">
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

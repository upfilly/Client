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
  setErrors,
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

  const getCustomParameterValidationStatus = (value) => {
    if (!value) return null;

    const issues = [];

    if (value.includes(' ')) {
      issues.push("No spaces allowed");
    }

    if (!value.includes('=')) {
      issues.push("Must contain key=value pair");
    }

    const invalidChars = value.match(/[^a-zA-Z0-9_\-\[\]{}?=&]/g);
    if (invalidChars) {
      issues.push(`Invalid characters: ${[...new Set(invalidChars)].join(' ')}`);
    }

    if (value.length > 255) {
      issues.push("Too long (max 255 chars)");
    }

    return issues.length > 0 ? issues : null;
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

  // Tier management functions for Lead
  const addLeadTier = () => {
    const lastTier = form.lead_tiers?.[form.lead_tiers?.length - 1];
    let newMin = lastTier
      ? (lastTier.max === Infinity ? lastTier.min + 1 : lastTier.max + 1)
      : 0;

    newMin = Math.floor(newMin);
    const newMax = newMin + 10;

    setform({
      ...form,
      lead_tiers: [
        ...(form.lead_tiers || []),
        { min: newMin, max: newMax, rate: 0 }
      ]
    });
  };

  const updateLeadTier = (index, field, value) => {
    const newTiers = [...(form.lead_tiers || [])];
    let parsedValue = field === 'max' && value === '' ? Infinity : parseFloat(value);

    // For lead counts, ensure integers
    if (field !== 'rate') {
      parsedValue = Math.floor(parsedValue);
    }

    newTiers[index][field] = parsedValue;
    setform({ ...form, lead_tiers: newTiers });
  };

  const removeLeadTier = (index) => {
    const newTiers = (form.lead_tiers || []).filter((_, i) => i !== index);
    setform({ ...form, lead_tiers: newTiers });
  };

  // Tier management functions for Purchase/Sales
  const addPurchaseTier = () => {
    const lastTier = form.purchase_tiers?.[form.purchase_tiers?.length - 1];
    let newMin = lastTier
      ? (lastTier.max === Infinity ? lastTier.min + 1000 : lastTier.max + 1000)
      : 0;

    const newMax = newMin + 1000;

    setform({
      ...form,
      purchase_tiers: [
        ...(form.purchase_tiers || []),
        { min: newMin, max: newMax, rate: 0 }
      ]
    });
  };

  const updatePurchaseTier = (index, field, value) => {
    const newTiers = [...(form.purchase_tiers || [])];
    let parsedValue = field === 'max' && value === '' ? Infinity : parseFloat(value);

    newTiers[index][field] = parsedValue;
    setform({ ...form, purchase_tiers: newTiers });
  };

  const removePurchaseTier = (index) => {
    const newTiers = (form.purchase_tiers || []).filter((_, i) => i !== index);
    setform({ ...form, purchase_tiers: newTiers });
  };

  useEffect(() => {
    getCategory();
    // Initialize tiers if not exists
    if (!form.lead_tiers) {
      setform({ ...form, lead_tiers: [] });
    }
    if (!form.purchase_tiers) {
      setform({ ...form, purchase_tiers: [] });
    }
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

                {/* Custom Parameter */}
                <div className="col-md-6 mb-3 custom-input">
                  <label>
                    Custom Parameter
                  </label>
                  <input
                    type="text"
                    className={`form-control ${form.customparameter && getCustomParameterValidationStatus(form.customparameter) ? 'is-invalid' : ''}`}
                    placeholder="e.g., uuid={subid} or clickid={clickid}"
                    value={form?.customparameter}
                    onChange={(e) => {
                      setform({ ...form, customparameter: e.target.value });
                      if (errors?.customparameter) {
                        setErrors({ ...errors, customparameter: null });
                      }
                    }}
                  />
                  {form.customparameter && getCustomParameterValidationStatus(form.customparameter) && (
                    <div className="invalid-feedback d-block">
                      {getCustomParameterValidationStatus(form.customparameter).map((issue, index) => (
                        <div key={index}>• {issue}</div>
                      ))}
                    </div>
                  )}
                  {submitted && errors?.customparameter && (
                    <div className="invalid-feedback d-block">
                      {errors?.customparameter}
                    </div>
                  )}
                  <small className="form-text text-muted">
                    Examples: uuid=123 | campaign=summer&source=facebook
                  </small>
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
                      Affiliate
                    </label>
                    <div className="select_row">
                      <MultiSelectValue
                        displayValue="name"
                        placeholder="Select Affiliate"
                        intialValue={form?.affiliate_id}
                        result={(e) =>
                          setform({ ...form, affiliate_id: e.value })
                        }
                        options={affiliateData}
                      />
                    </div>
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
                      result={(res) => {
                        setform({
                          ...form,
                          event_type: res.value
                        });
                      }}
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

                {/* ========== TIERED COMMISSIONS SECTION FOR LEADS ========== */}
                {form?.event_type?.includes("lead") && (
                  <div className="col-md-12 mb-3">
                    <div className="card border-success">
                      <div className="card-header bg-success text-white">
                        <h5 className="mb-0">Tiered Commissions - Leads</h5>
                      </div>
                      <div className="card-body">
                        {/* Toggle Switch for Leads */}
                        <div className="form-group">
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="leadTieredCommissionToggle"
                              checked={form.lead_tiered_commission_enabled || false}
                              onChange={(e) => setform({
                                ...form,
                                lead_tiered_commission_enabled: e.target.checked,
                                lead_tier_calculation_type: e.target.checked ? (form.lead_tier_calculation_type || "retrospective") : null
                              })}
                            />
                            <label className="custom-control-label font-weight-bold" htmlFor="leadTieredCommissionToggle">
                              Enable Tiered Commissions for Leads
                            </label>
                          </div>
                          <small className="form-text text-muted">
                            Reward affiliates based on number of leads per month
                          </small>
                        </div>

                        {/* Lead Tier Configuration */}
                        {form.lead_tiered_commission_enabled && (
                          <>
                            {/* Calculation Mode Selection */}
                            <div className="form-row mt-3">
                              <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">
                                  Calculation Mode <span className="star">*</span>
                                </label>
                                <div className="select_row">
                                  <SelectDropdown
                                    theme="search"
                                    displayValue="name"
                                    placeholder="Select Calculation Mode"
                                    intialValue={form.lead_tier_calculation_type || "retrospective"}
                                    result={(e) => setform({ ...form, lead_tier_calculation_type: e.value })}
                                    options={[
                                      { id: "retrospective", name: "🎯 Retrospective - Highest rate applies to ALL leads" },
                                      { id: "per_tier", name: "📊 Per Tier - Each tier gets its own rate" }
                                    ]}
                                  />
                                </div>
                                <small className="form-text text-muted">
                                  {form.lead_tier_calculation_type === "retrospective"
                                    ? "Affiliate reaches highest tier → ALL monthly leads get highest rate"
                                    : "Each lead bracket earns its specific rate"}
                                </small>
                              </div>
                            </div>

                            {/* Example Preview for Leads */}
                            <div className="alert alert-info mt-2">
                              <strong>Example (Leads):</strong><br />
                              {form.lead_tiers && form.lead_tiers.length > 0 ? (
                                <>
                                  {form.lead_tiers.map((tier, idx) => (
                                    <div key={idx}>
                                      {tier.min === 0 ? "0" : `${tier.min}`}
                                      {tier.max === Infinity ? "+" : ` - ${tier.max}`}
                                      {" leads → "}
                                      {`${form?.currencies || "€"}${tier.rate}`}
                                    </div>
                                  ))}
                                  <div className="mt-2 text-muted small">
                                    {form.lead_tier_calculation_type === "retrospective"
                                      ? "✓ If affiliate gets 150 leads → ALL 150 leads get highest tier rate"
                                      : "✓ Each lead bracket earns its specific rate"}
                                  </div>
                                </>
                              ) : (
                                <span className="text-muted">Add tiers below to see example</span>
                              )}
                            </div>

                            {/* Lead Tiers Table */}
                            <label className="font-weight-bold mt-3">
                              Lead Commission Tiers (Lead Count)
                            </label>
                            <div className="table-responsive">
                              <table className="table table-bordered table-hover">
                                <thead className="thead-light">
                                  <tr>
                                    <th>Min Leads</th>
                                    <th>Max Leads</th>
                                    <th>Commission Amount ({form?.currencies || "€"})</th>
                                    <th style={{ width: 50 }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(form.lead_tiers || []).map((tier, index) => (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          value={tier.min}
                                          onChange={(e) => updateLeadTier(index, 'min', e.target.value)}
                                          placeholder="Min leads"
                                          step="1"
                                          min="0"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          value={tier.max === Infinity ? "" : tier.max}
                                          onChange={(e) => updateLeadTier(index, 'max', e.target.value)}
                                          placeholder="Max leads (empty for ∞)"
                                          step="1"
                                          min="0"
                                        />
                                      </td>
                                      <td>
                                        <div className="input-group input-group-sm">
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={tier.rate}
                                            onChange={(e) => updateLeadTier(index, 'rate', e.target.value)}
                                            placeholder="Amount"
                                            step="0.01"
                                            min="0"
                                          />
                                          <div className="input-group-append">
                                            <span className="input-group-text">{form?.currencies || "€"}</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removeLeadTier(index)}
                                          disabled={(form.lead_tiers || []).length === 1}
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <button
                              type="button"
                              className="btn btn-sm btn-secondary mt-2"
                              onClick={addLeadTier}
                            >
                              <i className="fa fa-plus"></i> Add Lead Tier
                            </button>

                            <div className="alert alert-warning mt-3 small">
                              <i className="fa fa-info-circle"></i>
                              <strong>How it works:</strong> Tiers reset monthly. Only approved leads count.
                              Refunded leads are deducted. The final tier rate applies based on monthly lead total.
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========== TIERED COMMISSIONS SECTION FOR PURCHASES ========== */}
                {form?.event_type?.includes("purchase") && (
                  <div className="col-md-12 mb-3">
                    <div className="card border-primary">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Tiered Commissions - Sales</h5>
                      </div>
                      <div className="card-body">
                        {/* Toggle Switch for Purchases */}
                        <div className="form-group">
                          <div className="custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="purchaseTieredCommissionToggle"
                              checked={form.purchase_tiered_commission_enabled || false}
                              onChange={(e) => setform({
                                ...form,
                                purchase_tiered_commission_enabled: e.target.checked,
                                purchase_tier_calculation_type: e.target.checked ? (form.purchase_tier_calculation_type || "retrospective") : null,
                                purchase_tier_commission_value: e.target.checked ? (form.purchase_tier_commission_value || "percentage") : ""
                              })}
                            />
                            <label className="custom-control-label font-weight-bold" htmlFor="purchaseTieredCommissionToggle">
                              Enable Tiered Commissions for Sales
                            </label>
                          </div>
                          <small className="form-text text-muted">
                            Reward affiliates based on monthly sales revenue performance
                          </small>
                        </div>

                        {/* Purchase Tier Configuration */}
                        {form.purchase_tiered_commission_enabled && (
                          <>
                            {/* Calculation Mode Selection */}
                            <div className="form-row mt-3">
                              <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">
                                  Calculation Mode <span className="star">*</span>
                                </label>
                                <div className="select_row">
                                  <SelectDropdown
                                    theme="search"
                                    displayValue="name"
                                    placeholder="Select Calculation Mode"
                                    intialValue={form.purchase_tier_calculation_type || "retrospective"}
                                    result={(e) => setform({ ...form, purchase_tier_calculation_type: e.value })}
                                    options={[
                                      { id: "retrospective", name: "🎯 Retrospective - Highest rate applies to ALL sales" },
                                      { id: "per_tier", name: "📊 Per Tier - Each tier gets its own rate" }
                                    ]}
                                  />
                                </div>
                                <small className="form-text text-muted">
                                  {form.purchase_tier_calculation_type === "retrospective"
                                    ? "Affiliate reaches highest tier → ALL monthly sales get highest rate"
                                    : "Each revenue bracket earns its specific rate (like tax brackets)"}
                                </small>
                              </div>

                              {/* Commission Value Type for Purchases */}
                              <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">
                                  Commission Value <span className="star">*</span>
                                </label>
                                <div className="select_row">
                                  <SelectDropdown
                                    theme="search"
                                    displayValue="name"
                                    placeholder="Select Commission Type"
                                    intialValue={form.purchase_tier_commission_value || "percentage"}
                                    result={(e) => setform({ ...form, purchase_tier_commission_value: e.value })}
                                    options={[
                                      { id: "percentage", name: "Percentage (%)" },
                                      { id: "amount", name: `Fixed Amount (${form?.currencies || "€"})` }
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Example Preview for Purchases */}
                            <div className="alert alert-info mt-2">
                              <strong>Example (Sales Revenue):</strong><br />
                              {form.purchase_tiers && form.purchase_tiers.length > 0 ? (
                                <>
                                  {form.purchase_tiers.map((tier, idx) => (
                                    <div key={idx}>
                                      {`${form?.currencies || "€"}${tier.min === 0 ? "0" : tier.min}`}
                                      {tier.max === Infinity ? "+" : ` - ${form?.currencies || "€"}${tier.max}`}
                                      {" → "}
                                      {form.purchase_tier_commission_value === "amount"
                                        ? `${form?.currencies || "€"}${tier.rate}`
                                        : `${tier.rate}%`}
                                    </div>
                                  ))}
                                  <div className="mt-2 text-muted small">
                                    {form.purchase_tier_calculation_type === "retrospective"
                                      ? "✓ If affiliate earns €7000 → ALL €7000 gets highest tier rate"
                                      : "✓ Each revenue bracket earns its specific rate"}
                                  </div>
                                </>
                              ) : (
                                <span className="text-muted">Add tiers below to see example</span>
                              )}
                            </div>

                            {/* Purchase Tiers Table */}
                            <label className="font-weight-bold mt-3">
                              Sales Commission Tiers (Revenue in {form?.currencies || "€"})
                            </label>
                            <div className="table-responsive">
                              <table className="table table-bordered table-hover">
                                <thead className="thead-light">
                                  <tr>
                                    <th>Min Revenue ({form?.currencies || "€"})</th>
                                    <th>Max Revenue ({form?.currencies || "€"})</th>
                                    <th>
                                      Commission {form.purchase_tier_commission_value === "amount" ? `(${form?.currencies || "€"})` : "(%)"}
                                    </th>
                                    <th style={{ width: 50 }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(form.purchase_tiers || []).map((tier, index) => (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          value={tier.min}
                                          onChange={(e) => updatePurchaseTier(index, 'min', e.target.value)}
                                          placeholder={`Min ${form?.currencies || "€"}`}
                                          step="0.01"
                                          min="0"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          value={tier.max === Infinity ? "" : tier.max}
                                          onChange={(e) => updatePurchaseTier(index, 'max', e.target.value)}
                                          placeholder={`Max ${form?.currencies || "€"} (empty for ∞)`}
                                          step="0.01"
                                          min="0"
                                        />
                                      </td>
                                      <td>
                                        <div className="input-group input-group-sm">
                                          <input
                                            type="number"
                                            className="form-control"
                                            value={tier.rate}
                                            onChange={(e) => updatePurchaseTier(index, 'rate', e.target.value)}
                                            placeholder={form.purchase_tier_commission_value === "amount" ? "Amount" : "Rate %"}
                                            step="0.01"
                                            min="0"
                                            {...(form.purchase_tier_commission_value === "percentage" && { max: "100" })}
                                          />
                                          {form.purchase_tier_commission_value === "percentage" && (
                                            <div className="input-group-append">
                                              <span className="input-group-text">%</span>
                                            </div>
                                          )}
                                          {form.purchase_tier_commission_value === "amount" && (
                                            <div className="input-group-append">
                                              <span className="input-group-text">{form?.currencies || "€"}</span>
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-sm"
                                          onClick={() => removePurchaseTier(index)}
                                          disabled={(form.purchase_tiers || []).length === 1}
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <button
                              type="button"
                              className="btn btn-sm btn-secondary mt-2"
                              onClick={addPurchaseTier}
                            >
                              <i className="fa fa-plus"></i> Add Sales Tier
                            </button>

                            <div className="alert alert-warning mt-3 small">
                              <i className="fa fa-info-circle"></i>
                              <strong>How it works:</strong> Tiers reset monthly. Only approved sales count.
                              Refunds reduce total revenue. The final tier rate applies based on monthly total.
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

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
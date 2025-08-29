import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import crendentialModel from "@/models/credential.model";
import MultiSelectValue from "@/app/components/common/MultiSelectValue";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import "./style.scss";

const Html = ({
  category,
  relatedAffiliate,
  form,
  handleSubmit,
  setform,
  submitted,
  back,
  DestinationUrl,
  setDestinationUrl,
  errors,
  setErrors,
  campaignType,
  dateRef1,
  handleClick1,
  dateRef2,
  handleClick2,
  handleExpiryCheckChange,
  hasExpiryDate,
}) => {
  console.log(form, "form");

  const user = crendentialModel.getUser();
  const isEditPage = form && form.id;

  const filtered = category?.filter((item) =>
    form?.applicable?.includes(item?.id)
  );

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={"Coupons"}
        filters={undefined}
      >
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="sidebar-left-content">
            <div className=" pprofile1 card card-shadow p-4">
              <div className="">
                <div className="main_title_head profile-card">
                  <h3 className="Viewer">
                    <a to="/campaign" onClick={(e) => back()}>
                      {" "}
                      <i
                        className="fa fa-arrow-left mr-2 "
                        title="Back"
                        aria-hidden="true"
                      ></i>
                    </a>
                    {isEditPage ? "Edit" : "Add"} Coupon
                  </h3>
                  <hr></hr>
                </div>
                <div className="form-row">
                  <div className="col-md-6 mb-3">
                    <label>
                      Title<span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.title}
                      onChange={(e) =>
                        setform({ ...form, title: e.target.value })
                      }
                      placeholder="Enter coupon title"
                    />
                    {submitted && !form?.title && (
                      <p className="invalid-feedback d-block">
                        Title is required
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      Coupon Code<span className="star">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.couponCode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\s/g, "")
                          .replace(/[^a-zA-Z0-9]/g, "");
                        setform({ ...form, couponCode: value });
                      }}
                    />
                    {submitted && !form?.couponCode && (
                      <p className="invalid-feedback d-block">
                        Coupon code is required
                      </p>
                    )}
                  </div>
                  <div className="col-md-12 mb-3">
                    <label>Description (optional)</label>
                    <textarea
                      className="form-control"
                      value={form.description}
                      onChange={(e) =>
                        setform({ ...form, description: e.target.value })
                      }
                      placeholder="Enter coupon description"
                      rows={3}
                    />
                  </div>

                  {/* Radio Button for Coupon Tracking */}
                  <div className="col-md-6 mb-3">
                    <label>Enable Coupon Tracking</label>
                    <div className="radio-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="couponTracking"
                          id="trackingYes"
                          checked={form?.visibility === "Exclusive to specific affiliate"}
                          onChange={() => setform({ ...form, visibility: "Exclusive to specific affiliate" })}
                        />
                        <label className="form-check-label" htmlFor="trackingYes">
                          Yes (Private)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="couponTracking"
                          id="trackingNo"
                          checked={form?.visibility === "Public"}
                          onChange={() => setform({ ...form, visibility: "Public" })}
                        />
                        <label className="form-check-label" htmlFor="trackingNo">
                          No (Public)
                        </label>
                      </div>
                    </div>
                    {submitted && !form?.visibility && (
                      <p className="invalid-feedback d-block">
                        Type is required
                      </p>
                    )}
                  </div>

                  {form?.visibility == "Exclusive to specific affiliate" && (
                    <div className="col-md-6 mb-3">
                      <label>
                        Affiliates<span className="star">*</span>
                      </label>
                      <div className="select_row media_row">
                        <MultiSelectValue
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="Select Affiliate"
                          intialValue={form?.media}
                          result={(e) => {
                            console.log(e, "SelectedValue");

                            setform({ ...form, media: e.value });
                          }}
                          isSingle={false}
                          options={relatedAffiliate}
                        />
                      </div>
                      {submitted && !form?.media ? (
                        <div className="invalid-feedback d-block">
                          Affiliate is Required
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}

                  {/* {form?.visibility === "Public" ? ( */}
                    <div className="col-md-6 mb-3">
                      <label>
                        Commission Type<span className="star">*</span>
                      </label>
                      <div className="select_row">
                        <SelectDropdown
                          theme="search"
                          id="commissionTypeDropdown"
                          displayValue="name"
                          placeholder="Select Commission Type"
                          intialValue={form?.couponType}
                          result={(e) => {
                            console.log(e, "====");
                            setform({
                              ...form,
                              couponType: e.value,
                            });
                          }}
                          options={[
                            {
                              name: "Campaign",
                              id: "Campaign",
                            },
                            {
                              name: "Custom",
                              id: "Custom",
                            },
                          ]}
                        />
                        {!form?.couponType && submitted && (
                          <p className="invalid-feedback d-block">
                            Commission Type is required
                          </p>
                        )}
                      </div>
                    </div>
                  {/* ) : null} */}

                  {form?.couponType === "Campaign" &&
                    // form?.visibility === "Public" && 
                    (
                      <div className="col-md-6 mb-3 event-select affiliate">
                        <label>
                          Select Campaign<span className="star">*</span>
                        </label>
                        <div className="select_row">
                          <MultiSelectValue
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="Select Campaign"
                            intialValue={form?.campaign_id}
                            isClearable={true}
                            result={(e) => {
                              setform({ ...form, campaign_id: e.value });
                            }}
                            options={campaignType}
                          />
                        </div>
                        {submitted && !form?.campaign_id && (
                          <div className="invalid-feedback d-block">
                            {errors?.campaign_id}
                          </div>
                        )}
                      </div>
                    )}

                  {form?.couponType === "Custom" &&
                    // form?.visibility === "Public" && 
                    (
                      <>
                        <div className="col-md-6 mb-3">
                          <label>
                            Custom Commission Type
                            <span className="star">*</span>
                          </label>
                          <SelectDropdown
                            theme="search"
                            id="couponCommissionTypeDropdown"
                            displayValue="name"
                            placeholder="Select Commission Type"
                            intialValue={form?.commissionType}
                            result={(e) => {
                              setform({
                                ...form,
                                commissionType: e.value,
                              });
                            }}
                            options={[
                              {
                                name: "Fixed amount",
                                id: "Fixed amount",
                              },
                              {
                                name: "Percentage",
                                id: "Percentage Commission",
                              },
                            ]}
                          />
                          {submitted && !form?.commissionType && (
                            <div className="invalid-feedback d-block">
                              Commission Type is Required
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label>
                            Commission Value<span className="star">*</span>
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={
                              form?.commissionType === "Percentage"
                                ? "Enter percentage"
                                : "Enter amount"
                            }
                            value={form.couponAmount || ""}
                            onChange={(e) =>
                              setform({ ...form, couponAmount: e.target.value })
                            }
                          />
                          {submitted && !form?.couponAmount && (
                            <div className="invalid-feedback d-block">
                              {form?.commissionType === "Percentage"
                                ? "Percentage is required"
                                : "Amount is required"}
                            </div>
                          )}
                          {form?.commissionType === "Percentage" &&
                            form?.couponCommissionValue > 100 && (
                              <div className="invalid-feedback d-block">
                                Percentage cannot exceed 100%
                              </div>
                            )}
                        </div>
                      </>
                    )}

                  

                  <div className="col-md-6 mb-3 main_input">
                    <label>
                      Start Date <span className="star">*</span>
                    </label>

                    <div className="position-relative">
                      <input
                        type="date"
                        ref={dateRef1}
                        onClick={handleClick1}
                        className="width_full input-date"
                        value={form.startDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setform({ ...form, startDate: e.target.value })
                        }
                      />
                      {submitted && !form?.startDate ? (
                        <div className="invalid-feedback d-block">
                          Start Date is Required
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  {/* Updated Expiry Date Section - Always visible unless "No Expiry Date" is checked */}
                  <div className="col-md-6 mb-3">
                    <div className="main_input">
                      <div className="form-check mb-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="noExpiryDate"
                          checked={form.expireCheck || false}
                          onChange={(e) => {
                            setform({
                              ...form,
                              expireCheck: e.target.checked,
                              // Clear expiration date when "No Expiry Date" is checked
                              expirationDate: e.target.checked ? "" : form.expirationDate
                            });
                          }}
                        />
                        <label className="form-check-label" htmlFor="noExpiryDate">
                          No Expiry Date
                        </label>
                      </div>

                      {/* {!form.noExpiryDate && ( */}
                        <>
                          <label>
                            Expiry Date<span className="star">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type="date"
                              ref={dateRef2}
                              onClick={handleClick2}
                              disabled={form?.expireCheck}
                              className="width_full"
                              min={form.startDate}
                              value={form.expirationDate}
                              onChange={(e) =>
                                setform({
                                  ...form,
                                  expirationDate: e.target.value,
                                })
                              }
                            />
                          </div>
                          {submitted && !form.expirationDate && (
                            <div className="invalid-feedback d-block">
                              Expiration Date is Required
                            </div>
                          )}
                        </>
                      {/* )} */}
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>
                      Site URL<span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control`}
                      value={DestinationUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setDestinationUrl(url);
                        setErrors((prev) => ({
                          ...prev,
                          DestinationUrl: "",
                          websiteAllowed: "",
                        }));
                      }}
                      placeholder="https://example.com"
                    />
                    {errors.DestinationUrl && (
                      <div className="invalid-feedback d-block">
                        {errors.DestinationUrl}
                      </div>
                    )}
                    {errors.websiteAllowed && (
                      <div className="invalid-feedback d-block">
                        {errors.websiteAllowed}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right edit-btns">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default Html;
import React, { useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import "../style.scss";
import MultiSelectValue from "@/app/components/common/MultiSelectValue";
import crendentialModel from "@/models/credential.model";

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
}) => {
  const user = crendentialModel.getUser();

  const handleRemove = (valueToRemove) => {
    const updatedValues = form?.applicable?.filter(
      (value) => value !== valueToRemove
    );
    setform({ ...form, applicable: updatedValues });
  };

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
                  <h3 className="VieUser">
                    <a to="/campaign" onClick={(e) => back()}>
                      {" "}
                      <i
                        className="fa fa-arrow-left mr-2 "
                        title="Back"
                        aria-hidden="true"
                      ></i>
                    </a>
                    {form && form.id ? "Edit" : "Add"} Coupon
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
                    <label>Coupon Code</label>
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
                  </div>
                  <div className="col-md-12 mb-3">
                    <label>Description</label>
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
                  <div className="col-md-6 mb-3">
                    <label>Type</label>
                    <div className="select_row">
                      <SelectDropdown
                        theme="search"
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="Select Type"
                        intialValue={form?.visibility}
                        result={(e) => {
                          setform({ ...form, visibility: e.value });
                        }}
                        options={[
                          {
                            id: "Public",
                            name: "Public",
                          },
                          {
                            id: "Exclusive to specific affiliate",
                            name: "Private",
                          },
                        ]}
                      />
                    </div>
                    {submitted && !form?.visibility && (
                      <p className="invalid-feedback d-block">
                        Type is required
                      </p>
                    )}
                  </div>
                  {form?.visibility === "Public" ? (
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
                  ) : null}

                  {form?.couponType === "Custom" &&
                    form?.visibility === "Public" && (
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

                  {form?.visibility == "Exclusive to specific affiliate" && (
                    <div className="col-md-6 mb-3">
                      <label>
                        Affiliates<span className="star">*</span>
                      </label>
                      <div className="select_row media_row">
                        <MultiSelectValue
                          id="statusDropdown"
                          displayValue="name"
                          placeholder="Select Media"
                          intialValue={form?.media}
                          result={(e) => {
                            setform({ ...form, media: e });
                          }}
                          isSingle={false}
                          options={relatedAffiliate}
                        />
                      </div>
                      {submitted && !form?.media ? (
                        <div className="invalid-feedback d-block">
                          Brand is Required
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}

                  <div className="col-md-6 mb-3 main_input">
                    <label>
                      Start Date<span className="star">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        className="width_full"
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
                  <div className="col-md-6 mb-3 main_input">
                    <label>
                      Expired Date<span className="star">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type="date"
                        className="width_full"
                        min={form.startDate}
                        value={form.expirationDate}
                        onChange={(e) =>
                          setform({ ...form, expirationDate: e.target.value })
                        }
                      />
                    </div>
                    {submitted && !form?.expirationDate ? (
                      <div className="invalid-feedback d-block">
                        Expiration Date is Required
                      </div>
                    ) : (
                      <></>
                    )}
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

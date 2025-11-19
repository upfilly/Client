import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import "../style.scss";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import ImageUpload from "@/app/components/common/ImageUpload";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import MultiSelectDropdownData from "../../campaign/MultiSelectDropdownData";
import ApiClient from "@/methods/api/apiClient";
import crendentialModel from "@/models/credential.model";

const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Html = ({
  form,
  affiliateData,
  handleSubmit,
  setform,
  submitted,
  images,
  imageResult,
  back,
  selectedItems,
  setSelectedItems,
  errors,
  setErrors,
  handleDateClickActv,
  closeActv,
  setCloseActv,
  handleDateClickExp,
  closeExp,
  setCloseExp,
  handleClick2,
  dateRef2,
}) => {
  console.log(form, "form");
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const user = crendentialModel.getUser();

  const getCategory = () => {
    let url = `categoryWithSub?page&count&search&cat_type=creative_assets&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data
          .map((data) => (data.parent_cat_name ? data : undefined))
          .filter((item) => item !== undefined);
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  // Handle add type change
  const handleAddTypeChange = (type) => {
    setform({
      ...form,
      addType: type.value
    });
  };

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={form?.addType === 'link' ? "Link" : "Banner"}
        filters={undefined}
      >
        <form onSubmit={handleSubmit}>
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
                    {form && form.id ? "Edit" : "Add"} {form?.addType === 'link' ? 'Link' : 'Banner'}
                  </h3>
                  <hr></hr>
                </div>

                {/* Add Type Dropdown */}
                <div className="form-row">
                  <div className="col-12 col-sm-12 col-md-6">
                    <div className="form-group">
                      <div className="select_drop ">
                        <label>
                          Select Type<span className="star">*</span>
                        </label>
                        <div className="select_row">
                          <SelectDropdown
                            theme="search"
                            id="typeDropdown"
                            displayValue="name"
                            placeholder="Select type"
                            intialValue={form?.addType}
                            result={handleAddTypeChange}
                            options={[
                              { name: "Banner", id: "banner" },
                              { name: "Link", id: "link" },
                            ]}
                          />
                        </div>
                        {submitted && !form?.addType ? (
                          <div className="invalid-feedback d-block">
                            Type is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner Form Fields */}
                {form?.addType === 'banner' && (
                  <>
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
                        />
                        {submitted && !form?.title ? (
                          <div className="invalid-feedback d-block">
                            Title is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="col-12 col-sm-12 col-md-6">
                        <div className="form-group">
                          <div className="select_drop ">
                            <label>
                              Select Access Type<span className="star">*</span>
                            </label>
                            <div className="select_row">
                              <SelectDropdown
                                theme="search"
                                id="statusDropdown"
                                displayValue="name"
                                placeholder="Select type"
                                intialValue={form?.access_type}
                                result={(e) => {
                                  setform({ ...form, access_type: e.value });
                                }}
                                options={[
                                  { name: "Private", id: "private" },
                                  { name: "Public", id: "public" },
                                ]}
                              />
                            </div>
                            {submitted && !form?.access_type ? (
                              <div className="invalid-feedback d-block">
                                Type is Required
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                      {form?.access_type == "private" && (
                        <div className="col-12 col-sm-12 col-md-6">
                          <div className="form-group ">
                            <div className="select_drop ">
                              <label>
                                Select Affiliate<span className="star">*</span>
                              </label>
                              <div className="select_row mc-campaign-dropdown">
                                <SelectDropdown
                                  theme="search"
                                  id="statusDropdown"
                                  displayValue="name"
                                  placeholder="Select Affiliate"
                                  intialValue={form?.affiliate_id}
                                  result={(e) =>
                                    setform({ ...form, affiliate_id: e.value })
                                  }
                                  options={affiliateData}
                                />
                              </div>
                              {submitted && !form?.affiliate_id ? (
                                <div className="invalid-feedback d-block">
                                  Affiliate is Required
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 mb-3">
                        <label>
                          Destination Url<span className="star">*</span>
                        </label>
                        <div className="input-group  border_description ">
                          <input
                            type="text"
                            className="form-control"
                            value={form.destination_url}
                            onChange={(e) => {
                              const url = e.target.value;
                              setform({ ...form, destination_url: url });
                              setErrors((prev) => ({
                                ...prev,
                                DestinationUrl: "",
                                websiteAllowed: "",
                              }));
                            }}
                          />
                        </div>
                        {submitted && !form?.destination_url && (
                          <div className="invalid-feedback d-block">
                            Destination url is Required
                          </div>
                        )}
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

                      <div className="col-md-12 mb-3 category-dropdown">
                        <label>
                          Select Category<span className="star">*</span>
                        </label>
                        <div className="drops category-input add-baner-select-category-dropdown">
                          <MultiSelectDropdownData
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            data={categories}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>SEO Attributes</label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.seo_attributes}
                          onChange={(e) =>
                            setform({ ...form, seo_attributes: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label ">
                          Activation Date<span className="star">*</span>
                        </label>
                        <ReactDatePicker
                          showIcon
                          isClearable={form?.activation_date ? true : false}
                          placeholderText="Select Activation Date"
                          selected={form?.activation_date}
                          className="form-control"
                          onChange={(date) =>
                            setform({ ...form, activation_date: date })
                          }
                          open={closeActv}
                          onInputClick={handleDateClickActv}
                          onClickOutside={() => setCloseActv(false)}
                          timeInputLabel="Time:"
                          dateFormat="MM/dd/yyyy h:mm aa"
                          showTimeInput
                          minDate={new Date()}
                          filterTime={(time) => {
                            const selectedDate = new Date(time);
                            const now = new Date();
                            return selectedDate >= now;
                          }}
                        />

                        {submitted && !form?.activation_date ? (
                          <div className="invalid-feedback d-block">
                            Activation Date Date is Required
                          </div>
                        ) : (
                          <></>
                        )}
                        {errors.dateComparison && (
                          <div className="text-danger small">
                            {errors.dateComparison}
                          </div>
                        )}
                      </div>

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
                                  expiration_date: e.target.checked
                                    ? ""
                                    : form.expiration_date,
                                });
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="noExpiryDate"
                            >
                              No Expiry Date
                            </label>
                          </div>

                          <div className="position-relative">
                            <ReactDatePicker
                              showIcon
                              isClearable={form?.expiration_date ? true : false}
                              placeholderText="Select Expiration Date"
                              selected={form?.expiration_date}
                              minDate={form?.activation_date}
                              className={`form-control ${form?.expireCheck === true ? 'disabled-datepicker' : ''}`}
                              open={closeExp}
                              disabled={form?.expireCheck === true}
                              onInputClick={handleDateClickExp}
                              onClickOutside={() => setCloseExp(false)}
                              onChange={(date) => setform({ ...form, expiration_date: date })}
                              timeInputLabel="Time:"
                              dateFormat="MM/dd/yyyy h:mm aa"
                              showTimeInput
                            />
                            {errors.expirationDate && (
                              <div className="text-danger small">
                                {errors.expirationDate}
                              </div>
                            )}
                            {errors.dateComparison && (
                              <div className="text-danger small">
                                {errors.dateComparison}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3 ">
                        <label>Select : </label>
                        <div className="select_check p-0 pl-1">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input mr-4"
                              checked={form?.mobile_creative}
                              onClick={(e) =>
                                setform({
                                  ...form,
                                  mobile_creative: !form?.mobile_creative,
                                })
                              }
                            />
                            <label className="form-check-label">
                              Mobile Creative
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 mb-3 custom-description">
                        <label>Description</label>
                        {affiliateData && (
                          <DynamicReactQuill
                            theme="snow"
                            value={form?.description ? form?.description : ""}
                            onChange={(newValue, editor) => {
                              setform({ ...form, description: newValue });
                            }}
                            className="tuncketcls"
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
                            bounds={".app"}
                          />
                        )}
                      </div>

                      <div className="col-md-6 mt-3">
                        <label className="lablefontcls">
                          Image<span className="star">*</span>
                        </label>
                        <br></br>
                        <ImageUpload
                          model="untrackSales"
                          result={(e) => imageResult(e, "image")}
                          value={images}
                          multiple={false}
                        />
                        {submitted && !images ? (
                          <div className="invalid-feedback d-block">
                            Image is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Link Form Fields */}
                {form?.addType === 'link' && (
                  <>
                    <div className="form-row">
                      <div className="col-md-6 mb-3">
                        <label>
                          Link Name<span className="star">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.linkName}
                          onChange={(e) =>
                            setform({ ...form, linkName: e.target.value })
                          }
                        />
                        {submitted && !form?.linkName ? (
                          <div className="invalid-feedback d-block">
                            Link Name is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label>
                          Destination Url<span className="star">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.linkDestinationUrl}
                          onChange={(e) => {
                            const url = e.target.value;
                            setform({ ...form, linkDestinationUrl: url });
                            setErrors((prev) => ({
                              ...prev,
                              DestinationUrl: "",
                              websiteAllowed: "",
                            }));
                          }}
                        />
                        {submitted && !form?.linkDestinationUrl && (
                          <div className="invalid-feedback d-block">
                            Destination url is Required
                          </div>
                        )}
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

                      <div className="col-md-12 mb-3 category-dropdown">
                        <label>
                          Select Category<span className="star">*</span>
                        </label>
                        <div className="drops category-input add-baner-select-category-dropdown">
                          <MultiSelectDropdownData
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            data={categories}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                          />
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label ">
                          Start Date<span className="star">*</span>
                        </label>
                        <ReactDatePicker
                          showIcon
                          isClearable={form?.linkStartDate ? true : false}
                          placeholderText="Select Start Date"
                          selected={form?.linkStartDate}
                          className="form-control"
                          onChange={(date) =>
                            setform({ ...form, linkStartDate: date })
                          }
                          dateFormat="MM/dd/yyyy"
                        />
                        {submitted && !form?.linkStartDate ? (
                          <div className="invalid-feedback d-block">
                            Start Date is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label ">
                          End Date<span className="star">*</span>
                        </label>
                        <ReactDatePicker
                          showIcon
                          isClearable={form?.linkEndDate ? true : false}
                          placeholderText="Select End Date"
                          selected={form?.linkEndDate}
                          className="form-control"
                          onChange={(date) =>
                            setform({ ...form, linkEndDate: date })
                          }
                          dateFormat="MM/dd/yyyy"
                          minDate={form?.linkStartDate}
                        />
                        {submitted && !form?.linkEndDate ? (
                          <div className="invalid-feedback d-block">
                            End Date is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="col-md-12 mb-3 custom-description">
                        <label>Description</label>
                        <DynamicReactQuill
                          theme="snow"
                          value={form?.linkDescription ? form?.linkDescription : ""}
                          onChange={(newValue, editor) => {
                            setform({ ...form, linkDescription: newValue });
                          }}
                          className="tuncketcls"
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
                          bounds={".app"}
                        />
                      </div>

                      <div className="col-md-6 mb-3 ">
                        {/* <label>Options : </label> */}
                        <div className="select_check p-0 pl-1">
                          {/* <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input mr-4"
                              checked={form?.linkSeo}
                              onChange={(e) =>
                                setform({
                                  ...form,
                                  linkSeo: !form?.linkSeo,
                                })
                              }
                            />
                            <label className="form-check-label">
                              SEO Enabled
                            </label>
                          </div> */}
                          {/* <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input mr-4"
                              checked={form?.linkDeepLink}
                              onChange={(e) =>
                                setform({
                                  ...form,
                                  linkDeepLink: !form?.linkDeepLink,
                                })
                              }
                            />
                            <label className="form-check-label">
                              Deep Linking
                            </label>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="text-right edit-btns">
                  <button
                    type="submit"
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
    </>
  );
};

export default Html;
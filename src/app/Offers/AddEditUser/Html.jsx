import React, { useEffect, useState } from "react";
import methodModel from "@/methods/methods";
import Layout from "@/app/components/global/layout";
import MultiSelectDropdown from "@/app/components/common/MultiSelectDropdown";
import ApiClient from "@/methods/api/apiClient";
import "react-quill/dist/quill.snow.css";
import "../style.scss";
import { useRouter } from "next/navigation";
import MultiSelectDropdownData from "@/app/campaign/MultiSelectDropdownData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Html = ({
  form,
  startDate,
  endDate,
  setDateRange,
  user,
  handleSubmit,
  setform,
  submitted,
  back,
  selectedItems,
  setSelectedItems,
}) => {
  const [loaderr, setLoader] = useState();
  const [imgLoder, setImgLoder] = useState();
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showOtherOpportunityInput, setShowOtherOpportunityInput] = useState(false);
  const [otherOpportunityValue, setOtherOpportunityValue] = useState('');
  const history = useRouter();

  const uploadImage = async (e, key) => {
    let files = e.target.files;
    let i = 0;
    let imgfile = [];
    for (let item of files) {
      imgfile.push(item);
    }

    setLoader(true);
    for await (let item of imgfile) {
      let file = files.item(i);
      let url = "upload/image?modelName=campaign";

      const res = await ApiClient.postFormData(url, { file: file });
      if (res.success) {
        let path = res?.data?.fullpath;
        if (form?.image.length <= 9) {
          form?.image?.push(`images/campaign/${path}`);
        }
      }
      i++;
    }
    setLoader(false);
    setImgLoder(false);
  };

  const remove = (index, key) => {
    const filterImg =
      form?.image.length > 0 &&
      form.image.filter((data, indx) => {
        return index != indx;
      });
    setform({ ...form, image: filterImg });
  };

  const handleRemove = (valueToRemove) => {
    const updatedValues = form?.opportunity_type?.filter(
      (value) => value !== valueToRemove
    );
    setform({ ...form, opportunity_type: updatedValues });
  };

  const handlePlacementRemove = (valueToRemove) => {
    const updatedValues = form?.placement?.filter(
      (value) => value !== valueToRemove
    );
    setform({ ...form, placement: updatedValues });
  };

  const handlePaymentRemove = (valueToRemove) => {
    const updatedValues = form?.payment_model?.filter(
      (value) => value !== valueToRemove
    );
    setform({ ...form, payment_model: updatedValues });
  };

  const handleAddOtherOpportunity = () => {
    if (otherOpportunityValue.trim()) {
      const updatedOpportunities = [...(form.opportunity_type || []), otherOpportunityValue];
      setform({ ...form, opportunity_type: updatedOpportunities });
      setOtherOpportunityValue('');
      setShowOtherOpportunityInput(false);
    }
  };

  const getCategory = () => {
    let url = `categoryWithSub?page&count&search&cat_type=${user?.role == "affiliate"
        ? "promotional_models,property_types"
        : "advertiser_categories"
      }&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data
          .map(data => data.parent_cat_name ? data : undefined)
          .filter(item => item !== undefined);
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const opportunityOptions = [
    { name: "Single Placement", id: "single_placement" },
    { name: "Package", id: "package" },
    { name: "Social", id: "social" },
    { name: "Other", id: "other" }
  ];

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={"Camapaign"}
        filters={undefined}
      >
        <form onSubmit={handleSubmit}>
          <div className="sidebar-left-content">
            <div className=" pprofile1 card card-shadow p-4">
              <div className="">
                <div className="main_title_head ">
                  <h3 className="VieUser mb-4">
                    <a to="/product" onClick={(e) => back()}>
                      {" "}
                      <i
                        className=" left_btx fa fa-arrow-left mr-2 "
                        title="Back"
                        aria-hidden="true"
                      ></i>
                    </a>
                    {form && form.id ? "Edit" : "Add"} Offer
                  </h3>
                </div>

                <div className="row ">
                  <div className="col-12 col-md-12 col-lg-8">
                    <div className="row">
                      <div className="col-md-6 mb-3 custom-input" >
                        <label>
                          Title<span className="star">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={form.name}
                          onChange={(e) =>
                            setform({ ...form, name: e.target.value })
                          }
                        />
                        {submitted && !form?.name ? (
                          <div className="invalid-feedback d-block">
                            Title name is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="col-md-6 mb-3 custom-input">
                        <label>
                          Date<span className="star">*</span>
                        </label>
                        <DatePicker
                          showIcon
                          className="form-control "
                          monthsShown={2}
                          shouldCloseOnSelect={true}
                          selectsRange={true}
                          placeholderText="Select Date Range"
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update) => {
                            setDateRange([update[0], update[1]]);
                          }}
                          isClearable
                          minDate={new Date()}
                          withPortal
                          dateFormat={"dd/MM/yyyy"}
                        />
                        {submitted && startDate && endDate ? (
                          <div className="invalid-feedback d-block">
                            Date is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="col-md-12 mb-3">
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
                      </div>

                      <div className="select_type select_drop col-md-12 mb-3 ">
                        <label>
                          Placement<span className="star">*</span>
                        </label>
                        <div className="select_row select_arrowbx  custom-dropdown">
                          <MultiSelectDropdown
                            id="statusDropdown"
                            className=""
                            displayValue="name"
                            placeholder="Select Placement"
                            intialValue={form?.placement}
                            result={(e) =>
                              setform({ ...form, placement: e.value })
                            }
                            options={[
                              { name: "Website", id: "website" },
                              { name: "Email", id: "email" },
                              { name: "Social", id: "social" },
                              { name: "Mobile", id: "mobile" },
                            ]}
                            required
                          />
                        </div>
                        {form?.placement?.length > 0 && (
                          <div className="selected_offrs">
                            {form?.placement.map((value, index) => (
                              <span key={index}>
                                {value}{" "}
                                <i
                                  className="fa fa-times"
                                  onClick={() => handlePlacementRemove(value)}
                                ></i>
                              </span>
                            ))}
                          </div>
                        )}
                        {submitted && form?.placement?.length <= 0 ? (
                          <div className="invalid-feedback d-block">
                            Placement is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="select_type select_drop col-md-12 mb-3">
                        <label>
                          Opportunity Type<span className="star">*</span>
                        </label>
                        <div className="select_row select_arrowbx custom-dropdown">
                          <MultiSelectDropdown
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="Select Opportunity"
                            intialValue={form?.opportunity_type}
                            result={(e) => {
                              if (e.value.includes("other")) {
                                setShowOtherOpportunityInput(true);
                              } else {
                                setShowOtherOpportunityInput(false);
                              }
                              setform({ ...form, opportunity_type: e.value });
                            }}
                            options={opportunityOptions}
                            required
                          />
                        </div>

                        {showOtherOpportunityInput && (
                          <div className="d-flex mt-2">
                            <input
                              type="text"
                              className="form-control mr-2"
                              value={otherOpportunityValue}
                              onChange={(e) => setOtherOpportunityValue(e.target.value)}
                              placeholder="Enter custom opportunity type"
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={handleAddOtherOpportunity}
                            >
                              Add
                            </button>
                          </div>
                        )}

                        {form?.opportunity_type?.length > 0 && (
                          <div className="selected_offrs">
                            {form?.opportunity_type.map((value, index) => (
                              <span className="" key={index}>
                                {value}{" "}
                                <i
                                  className="fa fa-times"
                                  onClick={() => handleRemove(value)}
                                ></i>
                              </span>
                            ))}
                          </div>
                        )}
                        {submitted && form?.opportunity_type?.length == 0 ? (
                          <div className="invalid-feedback d-block">
                            Opportunity Type is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="select_drop col-md-12 mb-3">
                        <label>
                          Payment Model<span className="star">*</span>
                        </label>
                        <div className="select_row selectmultiple select_arrowbx custom-dropdown">
                          <MultiSelectDropdown
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="Select category"
                            intialValue={form?.payment_model}
                            result={(e) =>
                              setform({ ...form, payment_model: e.value })
                            }
                            options={[
                              { name: "Revenue Share", id: "Rev_share" },
                              { name: "Flat Fee", id: "Flat_fee" },
                              { name: "CPA +", id: "CPA +" },
                              { name: "CPC", id: "CPC" },
                            ]}
                            required
                          />
                        </div>
                        {form?.payment_model?.length > 0 && (
                          <div className="selected_offrs">
                            {form?.payment_model.map((value, index) => (
                              <span key={index}>
                                {value}{" "}
                                <i
                                  className="fa fa-times"
                                  onClick={() => handlePaymentRemove(value)}
                                ></i>
                              </span>
                            ))}
                          </div>
                        )}
                        {submitted && form?.payment_model?.length == 0 ? (
                          <div className="invalid-feedback d-block">
                            Payment Model is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label>
                          Description<span className="star">*</span>
                        </label>

                        <div className="textarea_offers">
                          <textarea
                            type="text"
                            className="form-control  "
                            rows={3}
                            value={form.description}
                            onChange={(e) =>
                              setform({ ...form, description: e.target.value })
                            }
                          />
                        </div>

                        {submitted && !form?.description ? (
                          <div className="invalid-feedback d-block">
                            Description is Required
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-4">
                    <div className="imagesshowing">
                      <label>Images (Max. Limit 10) </label>
                      <div className="form-group drag_drop">
                        <div className="upload_file">
                          {form?.image.length <= 9 && (
                            <>
                              <button className="uploaddataimg upload_image ">
                                <i className="fa fa-upload"></i> Upload Image
                              </button>
                              <input
                                type="file"
                                className="form-control-file w-100 over_input pointer"
                                accept="image/*"
                                multiple={true}
                                onChange={(e) => {
                                  setImgLoder(true);
                                  uploadImage(e, "image");
                                }}
                              />
                            </>
                          )}
                          {loaderr && imgLoder ? (
                            <div className="text-success text-center mt-5 top_loading">
                              Uploading...{" "}
                              <i className="fa fa-spinner fa-spin"></i>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="imagesRow mt-4 img-wrappper">
                            {form?.image &&
                              form?.image.map((itm, i) => {
                                return (
                                  <div className="imagethumbWrapper" key={i}>
                                    <img
                                      src={methodModel.noImg(itm)}
                                      className="thumbnail"
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
                  </div>
                </div>

                <div className="text-right edit-btns">
                  <a
                    className="btn btn-secondary mr-2 "
                    onClick={() => history.push("/Offers")}
                  >
                    Back
                  </a>
                  <button type="submit" className="btn btn-primary ">
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
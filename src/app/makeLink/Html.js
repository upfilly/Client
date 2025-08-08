import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import { toast } from "react-toastify";
import MultiSelectValue from "../components/common/MultiSelectValue";
import axios from "axios";

const Html = () => {
  const user = crendentialModel.getUser();
  const [url, setUrl] = useState("");
  const [showNewLink, setShowNewLink] = useState(false);
  const [isSubmited, setSubmited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [SelectDropdown, setSelectDropdown] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [showCustomParameters, setShowCustomParameters] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState([
    { id: "param", label: "param" },
    { id: "newparam", label: "newparam" },
    { id: "newparam1", label: "newparam1" },
  ]);
  const [brandData, setBrandData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [CampaignData, setCampaignData] = useState([]);
  const [SelectedCampaign, setSelectedCampaign] = useState("");
  const [shrtlnk, setshrtlnk] = useState("");
  const [DestinationUrl, setDestinationUrl] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [errors, setErrors] = useState({
    selectedBrand: "",
    SelectedCampaign: "",
    DestinationUrl: "",
    websiteAllowed: "",
  });
  console.log(CampaignData, "CampaignData");
  // console.log(user, "user");
  const handleInputChange = (selected, value) => {
    setInputValues((prevState) => ({
      ...prevState,
      [selected]: value,
    }));
  };

  const updateDictionary = () => {
    const updatedDict = Object.fromEntries(
      Object.entries(inputValues).filter(([key]) =>
        selectedValues.includes(key)
      )
    );
    setInputValues(updatedDict);
  };

  useEffect(() => {
    updateDictionary();
  }, [selectedValues]);

  const handleMultiSelectChange = (selectedOptions) => {
    setSelectedValues(selectedOptions);
  };

  const toggleCustomParameters = () => {
    setShowCustomParameters(!showCustomParameters);
  };

  useEffect(() => {
    let url = "campaign-data";
    if (selectedBrand) {
      ApiClient.get(
        `${url}?affiliateId=${selectedBrand}&brandId=${user?.id}`
      ).then((res) => {
        console.log(res, "response");

        if (
          res.message ===
          "Campaigns associated with this affiliate fetched successfully."
        ) {
          setSelectedCampaign(res.data.campaign_id);
        }
      });
    } else {
      setSelectedCampaign("");
    }
  }, [selectedBrand]);

  const getData = (p = {}) => {
    let filter = { brand_id: user?.id };
    let url = "getallaffiliatelisting";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const data = res.data;
        const manipulateData = data.map((itm) => {
          return {
            name: itm?.userName || itm?.firstName,
            id: itm?.id || itm?._id,
          };
        });
        setBrandData(manipulateData);
      }
    });
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setErrors((prev) => ({ ...prev, selectedBrand: "" }));
  };

  const handleCampaignChange = (event) => {
    setSelectedCampaign(event.campaignId);
    setErrors((prev) => ({ ...prev, SelectedCampaign: "" }));
  };

  useEffect(() => {
    getData();
    getCampaignData();
    generateShortLink(url);
  }, [url]);

  const getCampaignData = (p = {}) => {
    let filter = {
      isDeleted: false,
      status: "",
      brand_id: user?.id,
    };
    let url = "campaign/brand/all";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const data = res?.data?.data.map((data) => {
          return {
            id: data?.id || data?._id,
            name: data?.name,
          };
        });
        setCampaignData(data);
      }
    });
  };

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  const isWebsiteAllowed = (url) => {
    if (!user || !user?.website) {
      return {
        allowed: false,
        message:
          "Please update your website in your profile to use this feature",
      };
    }

    const allowedDomains =
      typeof user.website === "string"
        ? [user.website]
        : Array.isArray(user.website)
        ? user.website
        : [];

    if (allowedDomains.length === 0) {
      return {
        allowed: false,
        message:
          "Please update your website in your profile to use this feature",
      };
    }

    const cleanedUrl = url.toString().trim();

    try {
      let urlToParse = cleanedUrl;
      if (!/^https?:\/\//i.test(cleanedUrl)) {
        urlToParse = "https://" + cleanedUrl;
      }

      const urlObj = new URL(urlToParse);
      const hostname = urlObj.hostname.replace("www.", "").toLowerCase();

      const isAllowed = allowedDomains.some((domain) => {
        let domainStr = String(domain).trim().toLowerCase();

        if (
          domainStr.startsWith("http://") ||
          domainStr.startsWith("https://")
        ) {
          try {
            const domainUrl = new URL(domainStr);
            domainStr = domainUrl.hostname;
          } catch (e) {
            domainStr = domainStr.replace(/^https?:\/\//, "");
          }
        }

        // Remove www. and trailing slashes
        domainStr = domainStr.replace("www.", "").replace(/\/+$/, "");

        // Compare the base domains
        return hostname === domainStr || hostname.endsWith(`.${domainStr}`);
      });

      return {
        allowed: isAllowed,
        message: isAllowed
          ? ""
          : `URL must be from allowed domains: ${allowedDomains.join(", ")}`,
      };
    } catch (e) {
      console.error("Error parsing URL:", e);
      return {
        allowed: false,
        message: `Invalid URL format: ${cleanedUrl}`,
      };
    }
  };

  const copyText = () => {
    const textToCopy = document.getElementById("textToCopy").innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const copyShortText = () => {
    const textToCopy = document.getElementById("textShortToCopy").innerText;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const generateShortLink = async (urlData) => {
    if (urlData || url) {
      const data = await axios.post(
        "https://api.t.ly/api/v1/link/shorten",
        { long_url: urlData || url },
        {
          headers: {
            Authorization:
              "Bearer IOjsD8bJKmNq8I9ESfMT3t0z6nAYrvx3KAc7RsfQLentCBeZ90RCO13cdlND",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setshrtlnk(data?.data?.short_url);
    }
  };

  const handleAddNew = () => {
    if (newKey && newLabel) {
      setCheckboxValues((prevValues) => [
        ...prevValues,
        { id: newKey, label: newLabel },
      ]);
      setNewKey("");
      setNewLabel("");
      setShowNewKeyForm(false);
    }
  };

  useEffect(() => {
    ApiClient.get("get-affilaite-link").then((res) => {
      if (res?.success) {
        setUrl(res?.data?.link.replace("/?", "/"));
        generateShortLink(res?.data?.link.replace("/?", "/"));
      }
      loader(false);
    });
  }, []);

  const validateForm = () => {
    let websiteAllowedError = "";

    if (DestinationUrl) {
      if (!isValidUrl(DestinationUrl)) {
        websiteAllowedError =
          "Please enter a valid URL (including http:// or https://)";
      } else {
        const websiteCheck = isWebsiteAllowed(DestinationUrl);
        if (!websiteCheck.allowed) {
          websiteAllowedError = websiteCheck.message;
        }
      }
    }

    const newErrors = {
      selectedBrand: !selectedBrand ? "Please select an affiliate" : "",
      SelectedCampaign: !SelectedCampaign ? "Please select a campaign" : "",
      DestinationUrl: !DestinationUrl ? "Destination URL is required" : "",
      websiteAllowed: websiteAllowedError,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = () => {
    setSubmited(true);

    if (!validateForm()) {
      return;
    }

    const base_url = "https://api.upfilly.com/link/";

    const rawUrl = DestinationUrl.replace(/^https?:\/\//i, "");

    const domainParts = rawUrl.split(".");
    let subdomain = "";
    let domainName = "";
    let domainExtension = "";

    if (domainParts.length >= 3) {
      subdomain = domainParts[0];
      domainName = domainParts[1];
      domainExtension = domainParts.slice(2).join(".");
    } else if (domainParts.length === 2) {
      domainName = domainParts[0];
      domainExtension = domainParts[1];
    }

    const urlParams = `fp_sid=${selectedBrand}&affiliate=${selectedBrand}&brand=${user?.id}`;

    let finalUrl = new URL(base_url);

    if (selectedBrand) {
      finalUrl.searchParams.set("affiliate_id", selectedBrand);
    }

    // if (SelectedCampaign) {
    //   finalUrl.searchParams.set("campaign_id", SelectedCampaign);
    // }

    if (DestinationUrl) {
      const destinationUrlWithParams = `${domainName}`;
      finalUrl.searchParams.set("hUrl", subdomain);
      finalUrl.searchParams.set("url", destinationUrlWithParams);
      finalUrl.searchParams.set("ext", domainExtension);
    }

    const finalUrlString = finalUrl.toString();

    ApiClient.post("get-link", {
      base_url: finalUrlString,
      parameters: inputValues,
    }).then((res) => {
      if (res?.success) {
        toast.success(res?.message);
        setShowNewLink(true);
        setSubmited(false);
        setUrl(res?.data.replace("/?", "/"));
        generateShortLink(res?.data.replace("/?", "/"));
        if (!SelectDropdown) {
          setSelectDropdown(!SelectDropdown);
        }
      }
    });
  };

  return (
    <>
      <Layout
        handleKeyPress={""}
        setFilter={""}
        reset={""}
        filter={""}
        name="Generate Link"
        filters={""}
      >
        <div className="sidebar-left-content">
          <div className="card">
            <div className="card-header">
              <div className="main_title_head d-flex justify-content-between align-items-center">
                <h3 className="link_default m-0">
                  <i
                    className="fa fa-bullhorn link_icon"
                    aria-hidden="true"
                  ></i>{" "}
                  Default Links 
                </h3>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="mb-2">
                      Select Affiliate<span className="star">*</span>
                    </label>
                    <select
                      className={`form-select mb-2 ${
                        errors.selectedBrand && "is-invalid"
                      }`}
                      id="brandSelect"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                    >
                      <option value="">Select Affiliate</option>
                      {brandData.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {errors.selectedBrand && (
                      <div className="invalid-feedback d-block">
                        {errors.selectedBrand}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="mb-3">
                    <label className="mb-2">
                      Select Campaign<span className="star">*</span>
                    </label>
                    <select
                      className={`form-select mb-2 ${
                        errors.SelectedCampaign && "is-invalid"
                      }`}
                      id="brandSelect"
                      value={SelectedCampaign}
                      onChange={handleCampaignChange}
                      disabled
                    >
                      <option value="">Select Campaign</option>
                      {CampaignData.map((item) => (
                        <option
                          key={item.id || item._id}
                          value={item.id || item._id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {errors.SelectedCampaign && (
                      <div className="invalid-feedback d-block">
                        {errors.SelectedCampaign}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label>
                    Destination Url<span className="star">*</span>
                  </label>
                  <div className="input-group border_description">
                    <input
                      type="text"
                      className={`form-control ${
                        (errors.DestinationUrl || errors.websiteAllowed) &&
                        "is-invalid"
                      }`}
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
                  </div>
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

                <div className="col-12 col-md-12 mb-3">
                  <div className="form-check pl-4" >
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showCustomParameters"
                      checked={showCustomParameters}
                      onChange={toggleCustomParameters}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="showCustomParameters"
                    >
                      Show Custom Parameters
                    </label>
                  </div>
                </div>

                {showCustomParameters && (
                  <div className="col-12 col-md-12">
                    <div className="select_parabx mb-3">
                      <div className="mb-3">
                        <label className="mb-2">Select Custom Parameters</label>
                        <MultiSelectValue
                          id="statusDropdown"
                          displayValue="label"
                          intialValue={selectedValues}
                          result={(e) => handleMultiSelectChange(e.value)}
                          setInputValues={setInputValues}
                          updateDictionary={updateDictionary}
                          inputValues={inputValues}
                          options={checkboxValues}
                        />
                      </div>

                      <div className="addkey mt-3 mb-3 d-flex justify-content-end">
                        <button
                          className="btn btn-primary"
                          onClick={() => setShowNewKeyForm(true)}
                        >
                          <i className="fa fa-plus mr-1"></i>Add Key
                        </button>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          {selectedValues.map((selected, index) => (
                            <div
                              className="col-12 col-sm-6 col-md-4 mb-3"
                              key={index}
                            >
                              <p className="mb-0 labeltext">{selected}:</p>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={`Input value for ${selected}`}
                                onChange={(e) =>
                                  handleInputChange(selected, e.target.value)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Generate URL
                </button>
              </div>

              {showNewLink && (
                <>
                  <h6 className="link_default m-0"> Your Link :</h6>
                  <div className="input-group my-3">
                    <div
                      className="input-group-prepend pointer"
                      title="Copy text"
                      onClick={copyText}
                    >
                      <div className="input-group-text">
                        <i
                          className="fa fa-clipboard copy_icon"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                    <div
                      id="textToCopy"
                      className="form-control br0 mb-0 heauto"
                    >
                      {url}
                    </div>
                  </div>

                  <h6 className="link_default mt-3 mb-0">
                    {" "}
                    Your Short URL Link :
                  </h6>
                  <div className="input-group my-2">
                    <div
                      className="input-group-prepend pointer"
                      title="Copy text"
                      onClick={copyShortText}
                    >
                      <div className="input-group-text">
                        <i
                          className="fa fa-clipboard copy_icon"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                    <div
                      id="textShortToCopy"
                      className="form-control br0 mb-0 heauto"
                    >
                      {shrtlnk}
                    </div>
                  </div>
                </>
              )}
              {copied && <div className="">Copied!</div>}
            </div>
          </div>
        </div>
      </Layout>
      {showNewKeyForm && (
        <div className="modal d-block">
          <div
            className="modal-dialog modal-dialog-centered dateModal"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex justify-content-between">
                  <h5 className="mb-3">Add New Key</h5>
                  <i
                    className="fa fa-times"
                    onClick={() => setShowNewKeyForm(false)}
                  ></i>
                </div>
                <div className="form-group">
                  <p className="mb-2">Key:</p>
                  <input
                    type="text"
                    className="form-control"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Enter Key"
                  />
                </div>
                <div className="form-group">
                  <p className="mb-2">Value:</p>
                  <input
                    type="text"
                    className="form-control"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Enter Label"
                  />
                </div>
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddNew}
                  >
                    Add Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Html;

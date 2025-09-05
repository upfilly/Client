import React, { useState, useEffect, useRef } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

const AddEditUser = () => {
  const { role, id } = useParams();
  const user = crendentialModel.getUser();
  const [images, setImages] = useState("");
  const [form, setform] = useState({
    title: "",
    destination_url: "",
    description: "",
    seo_attributes: "",
    activation_date: "",
    availability_date: "",
    expiration_date: "",
    image: "",
    is_animation: false,
    is_deep_linking: false,
    mobile_creative: false,
    expireCheck: false,
  });
  const [affiliateData, setAffiliateData] = useState();
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
  const [submitted, setSubmitted] = useState(false);
  const history = useRouter();
  const [emailLoader, setEmailLoader] = useState(false);
  const [BrandData, setBrandData] = useState("");
  const [detail, setDetail] = useState();
  const [category, setCategory] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    categories: [],
    subCategories: [],
    subSubCategories: [],
  });
  const [errors, setErrors] = useState({
    selectedBrand: "",
    SelectedCampaign: "",
    DestinationUrl: "",
    websiteAllowed: "",
    expirationDate: "",
    dateComparison: "", // Added for date comparison error
  });
  const [closeActv, setCloseActv] = useState(false);
  const [closeExp, setCloseExp] = useState(false);
  const dateRef2 = useRef(null);
  // const [ActivationDate,setActivationDate] = useState('')
  // const [AvailabilityDate,setAvailabilityDate] = useState('')
  // const [ExpirationDate,setExpirationDate] =  useState('')

  const getCategory = (p = {}) => {
    let url = "main-category/all";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data;
        setCategory(data);
      }
    });
  };

  const getBrandData = (p = {}) => {
    let filter = { status: "accepted" };
    let url = "make-offers";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const uniqueBrands = new Set();
        const filteredData = res?.data?.data.reduce((acc, item) => {
          if (!uniqueBrands.has(item.brand_id)) {
            uniqueBrands.add(item.brand_id);
            acc.push({
              id: item.brand_id,
              brand_name: item.brand_name,
            });
          }
          return acc;
        }, []);
        setBrandData(filteredData);
      }
    });
  };

  const getError = (key) => {
    return methodModel.getError(key, form, formValidation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (form?.access_type == "private") {
      if (
        !form?.title ||
        !form?.destination_url ||
        !form?.activation_date ||
        // !form?.availability_date ||
        // !form?.expiration_date ||
        !images ||
        !form?.access_type ||
        !form?.access_type ||
        !form?.affiliate_id
      ) {
        setSubmitted(true);
        return;
      }
    } else {
      if (
        !form?.title ||
        !form?.destination_url ||
        !form?.activation_date ||
        // !form?.availability_date ||
        // !form?.expiration_date ||
        !images ||
        !form?.access_type
      ) {
        setSubmitted(true);
        return;
      }
    }

    let method = "post";
    let url = "banner";

    let value = {
      ...form,
      image: images,
      category_id: selectedItems?.categories,
      subCategory: selectedItems?.subCategories,
      subChildCategory: selectedItems?.subSubCategories,
    };

    if (form?.access_type === "private") {
      value[
        "destination_url"
      ] = `${form?.destination_url}?fp_sid=${form?.affiliate_id}`;
    }

    if (!value?.seo_attributes) {
      delete value?.seo_attributes;
    }

    if (!value?.image) {
      delete value?.image;
    }

    delete value.status;
    if (value.id) {
      method = "put";
      url = "banner";
    } else {
      delete value.id;
    }

    delete value.confirmPassword;
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        toast.success(res.message);
        let url = "/banners";
        if (role) url = "/banners/" + role;
        history.push(url);
      }
      loader(false);
    });
  };

  const imageResult = (e) => {
    setImages(e?.value);
  };

  const addressResult = (e) => {
    setform({ ...form, address: e.value });
  };

  const back = () => {
    history.back();
  };

  const emailCheck = (email) => {
    let isValid = methodModel.emailvalidation(email);
    if (isValid) {
      // Email validation logic
    }
  };

  useEffect(() => {
    setSubmitted(false);

    if (id) {
      loader(true);
      ApiClient.get("banner", { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          console.log(value, "value");
          setDetail(value);
          setform({
            id: value?.id || value?._id,
            title: value?.title,
            destination_url: `${value?.destination_url}`,
            description: value?.description,
            seo_attributes: value?.seo_attributes,
            access_type: value?.access_type,
            affiliate_id: value?.affiliate_id,
            // "category_id": value?.category_id?.id,
            activation_date: new Date(value?.activation_date),
            // availability_date: new Date(value?.availability_date),
            expiration_date: value?.expiration_date
              ? new Date(value?.expiration_date)
              : null,
            image: value?.image,
            is_animation: value?.is_animation,
            is_deep_linking: value?.is_deep_linking,
            mobile_creative: value?.mobile_creative,
            expireCheck: value?.expireCheck,
          });
          setSelectedItems({
            categories: value?.category_id,
            subCategories: value?.subCategory,
            subSubCategories: value?.subChildCategory,
          });
          setImages(value?.image);
        }
        loader(false);
      });
    }
  }, [id]);

  // const getData = () => {
  //     let url = 'users/list'
  //     ApiClient.get(url, {role:"affiliate", createBybrand_id: user?.id,}).then(res => {
  //         if (res.success) {
  //             const data1 = res.data.data.filter(item => item.status === "active");
  //             setAffiliateData(data1)
  //         }
  //     })
  // }

  const getData = (p = {}) => {
    let url = "getallaffiliatelisting";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.filter((item) => item !== null);
        const manipulateData = filteredData.map((itm) => {
          return {
            name: itm?.userName || itm?.firstName,
            id: itm?.id || itm?._id,
          };
        });
        setAffiliateData(manipulateData);
      }
    });
  };

  useEffect(() => {
    getData();
    getBrandData();
    getCategory();
  }, []);

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
      const inputHostname = urlObj.hostname.replace("www.", "").toLowerCase();

      const isAllowed = allowedDomains.some((domain) => {
        // Clean the allowed domain
        let domainStr = String(domain).trim().toLowerCase();

        // Remove protocol if present
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

        // Compare the hostnames
        return (
          inputHostname === domainStr || inputHostname.endsWith(`.${domainStr}`)
        );
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

  const validateForm = () => {
    let websiteAllowedError = "";
    let expirationDateError = "";
    let dateComparisonError = "";

    if (form?.expireCheck == false && !form?.expiration_date) {
      expirationDateError = "Expiration date is required";
    }

    if (form?.activation_date && form?.expiration_date) {
      const activationDate = new Date(form.activation_date);
      const expirationDate = new Date(form.expiration_date);

      if (activationDate.toDateString() === expirationDate.toDateString()) {
        dateComparisonError =
          "Activation date and expiration date cannot be the same";
      }
    }

    if (form?.destination_url) {
      if (!isValidUrl(form?.destination_url)) {
        websiteAllowedError =
          "Please enter a valid URL (including http:// or https://)";
      } else {
        const websiteCheck = isWebsiteAllowed(form?.destination_url);
        if (!websiteCheck.allowed) {
          websiteAllowedError = websiteCheck.message;
        }
      }
    }

    const newErrors = {
      DestinationUrl: !form?.destination_url
        ? "Destination URL is required"
        : "",
      websiteAllowed: websiteAllowedError,
      expirationDate: expirationDateError,
      dateComparison: dateComparisonError,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleDateClickActv = () => {
    setCloseActv(!closeActv);
  };
  const handleDateClickExp = () => {
    setCloseExp(!closeExp);
  };

  const handleClick2 = () => {
    if (closeExp) {
      dateRef2.current.blur();
    } else {
      dateRef2.current.showPicker();
    }
    closeExp(!closeExp);
  };

  return (
    <>
      <Html
        id={id}
        form={form}
        detail={detail}
        emailCheck={emailCheck}
        emailLoader={emailLoader}
        // emailErr={emailErr}
        back={back}
        setEyes={setEyes}
        eyes={eyes}
        role={role}
        setform={setform}
        submitted={submitted}
        images={images}
        addressResult={addressResult}
        handleSubmit={handleSubmit}
        imageResult={imageResult}
        getError={getError}
        affiliateData={affiliateData}
        BrandData={BrandData}
        category={category}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        errors={errors}
        setErrors={setErrors}
        handleDateClickActv={handleDateClickActv}
        closeActv={closeActv}
        setCloseActv={setCloseActv}
        handleDateClickExp={handleDateClickExp}
        closeExp={closeExp}
        setCloseExp={setCloseExp}
        handleClick2={handleClick2}
        dateRef2={dateRef2}
      />
    </>
  );
};

export default AddEditUser;

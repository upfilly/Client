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
    addType: "banner", // Default to banner
    // Banner fields
    title: "",
    destination_url: "",
    description: "",
    seo_attributes: "",
    activation_date: "",
    expiration_date: "",
    image: "",
    is_animation: false,
    is_deep_linking: false,
    mobile_creative: false,
    expireCheck: false,
    access_type: "public",
    affiliate_id: "",
    // Link fields
    linkName: "",
    linkDestinationUrl: "",
    linkDescription: "",
    linkStartDate: "",
    linkEndDate: "",
    linkSeo: false,
    linkDeepLink: false,
  });
  const [affiliateData, setAffiliateData] = useState();
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
    DestinationUrl: "",
    websiteAllowed: "",
    expirationDate: "",
    dateComparison: "",
  });
  const [closeActv, setCloseActv] = useState(false);
  const [closeExp, setCloseExp] = useState(false);
  const dateRef2 = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Banner validation
    if (form?.addType === 'banner') {
      if (form?.access_type == "private") {
        if (
          !form?.title ||
          !form?.destination_url ||
          !form?.activation_date ||
          !images ||
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
          !images ||
          !form?.access_type
        ) {
          setSubmitted(true);
          return;
        }
      }
    }

    // Link validation
    if (form?.addType === 'link') {
      if (
        !form?.linkName ||
        !form?.linkDestinationUrl ||
        !form?.linkStartDate ||
        !form?.linkDescription || 
        !form?.description
        // !form?.linkEndDate
      ) {
        setSubmitted(true);
        return;
      }
    }

    let method = "post";
    let url = form?.addType === 'banner' ? "banner" : "banner";

    // Prepare payload based on type
    let value = {
      addType: form.addType,
    };

    // Add category data based on type
    if (form?.addType === 'banner') {
      value = {
        ...value,
        category_id: selectedItems?.categories,
        subCategory: selectedItems?.subCategories,
        subChildCategory: selectedItems?.subSubCategories,
      };
    } else {
      // For link type, combine all categories into a single array for linkCategory
      const allCategories = [
        ...(selectedItems?.categories || []),
      ].filter(item => item);

      value = {
        ...value,
        linkCategory: allCategories
      };
    }

    if (form?.addType === 'banner') {
      value = {
        ...value,
        title: form.title,
        destination_url: form.destination_url,
        description: form.description,
        seo_attributes: form.seo_attributes,
        activation_date: form.activation_date,
        expiration_date: form.expiration_date,
        image: images,
        is_animation: form.is_animation,
        is_deep_linking: form.is_deep_linking,
        mobile_creative: form.mobile_creative,
        expireCheck: form.expireCheck,
        access_type: form.access_type,
        // Conditionally include affiliate_id only for private access
        ...(form.access_type === "private" && { affiliate_id: form.affiliate_id }),
      };

      if (form?.access_type === "private") {
        value.destination_url = `${form?.destination_url}?fp_sid=${form?.affiliate_id}`;
      }

      if (!value?.seo_attributes) {
        delete value?.seo_attributes;
      }
    } else {
      value = {
        ...value,
        linkName: form.linkName,
        linkDestinationUrl: form.linkDestinationUrl,
        linkDescription: form.linkDescription,
        linkStartDate: form.linkStartDate,
        linkEndDate: form.linkEndDate,
        linkSeo: form.linkSeo,
        linkDeepLink: form.linkDeepLink,
        description: form.description
      };
    }

    // Handle edit case - Include ID in the payload
    if (id) {
      method = "put";
      value.id = id; // Add ID to payload for edit

      if (form?.addType === 'banner' && form?.expireCheck === true) {
        delete value.expiration_date;
      }
    }

    console.log("Submitting with:", { method, url, value }); // Debug log

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        toast.success(res.message);
        let redirectUrl = form?.addType === 'banner' ? "/banners" : "/banners";
        if (role) redirectUrl += "/" + role;
        history.push(redirectUrl);
      } else {
        toast.error(res.message || "Something went wrong");
      }
      loader(false);
    });
  };

  const imageResult = (e) => {
    setImages(e?.value);
  };

  const back = () => {
    history.back();
  };

  useEffect(() => {
    setSubmitted(false);

    if (id) {
      loader(true);
      const apiUrl = "banner";

      ApiClient.get(apiUrl, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          setDetail(value);

          const addType = value?.addType || 'banner';

          if (addType === 'banner') {
            setform({
              // Don't set id here, use the id from useParams
              addType: 'banner',
              title: value?.title || "",
              destination_url: value?.destination_url || "",
              description: value?.description || "",
              seo_attributes: value?.seo_attributes || "",
              activation_date: value?.activation_date ? new Date(value?.activation_date) : "",
              expiration_date: value?.expiration_date ? new Date(value?.expiration_date) : null,
              image: value?.image || "",
              is_animation: value?.is_animation || false,
              is_deep_linking: value?.is_deep_linking || false,
              mobile_creative: value?.mobile_creative || false,
              expireCheck: value?.expireCheck || false,
              access_type: value?.access_type || "public",
              affiliate_id: value?.affiliate_id || "",
              // Reset link fields to empty
              linkName: "",
              linkDestinationUrl: "",
              linkDescription: "",
              linkStartDate: "",
              linkEndDate: "",
              linkSeo: false,
              linkDeepLink: false,
            });
            setImages(value?.image || "");
          } else {
            setform({
              // Don't set id here, use the id from useParams
              addType: 'link',
              title: "",
              destination_url: "",
              description: "",
              seo_attributes: "",
              activation_date: "",
              expiration_date: "",
              image: "",
              is_animation: false,
              is_deep_linking: false,
              mobile_creative: false,
              expireCheck: false,
              access_type: "public",
              affiliate_id: "",
              // Link fields
              linkName: value?.linkName || "",
              linkDestinationUrl: value?.linkDestinationUrl || "",
              linkDescription: value?.linkDescription || "",
              linkStartDate: value?.linkStartDate ? new Date(value?.linkStartDate) : "",
              linkEndDate: value?.linkEndDate ? new Date(value?.linkEndDate) : "",
              linkSeo: value?.linkSeo || false,
              linkDeepLink: value?.linkDeepLink || false,
              description: value?.description
            });
          }
          if (addType == "banner") {
            setSelectedItems({
              categories: value?.category_id || [],
              subCategories: value?.subCategory || [],
              subSubCategories: value?.subChildCategory || [],
            });
          } else {
            setSelectedItems({
              categories: value?.linkCategory?.map((dat) => dat?.id) || [],
              subCategories: value?.subCategory || [],
              subSubCategories: value?.subChildCategory || [],
            });
          }
        } else {
          toast.error("Failed to fetch banner details");
        }
        loader(false);
      }).catch(error => {
        console.error("Error fetching banner:", error);
        toast.error("Error fetching banner details");
        loader(false);
      });
    }
  }, [id]);

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
        message: "Please update your website in your profile to use this feature",
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
        message: "Please update your website in your profile to use this feature",
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
        let domainStr = String(domain).trim().toLowerCase();
        if (domainStr.startsWith("http://") || domainStr.startsWith("https://")) {
          try {
            const domainUrl = new URL(domainStr);
            domainStr = domainUrl.hostname;
          } catch (e) {
            domainStr = domainStr.replace(/^https?:\/\//, "");
          }
        }
        domainStr = domainStr.replace("www.", "").replace(/\/+$/, "");
        return inputHostname === domainStr || inputHostname.endsWith(`.${domainStr}`);
      });

      return {
        allowed: isAllowed,
        message: isAllowed ? "" : `URL must be from allowed domains: ${allowedDomains.join(", ")}`,
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

    // Banner specific validation
    if (form?.addType === 'banner') {
      if (form?.expireCheck == false && !form?.expiration_date) {
        expirationDateError = "Expiration date is required";
      }

      if (form?.activation_date && form?.expiration_date) {
        const activationDate = new Date(form.activation_date);
        const expirationDate = new Date(form.expiration_date);

        if (activationDate.toDateString() === expirationDate.toDateString()) {
          dateComparisonError = "Activation date and expiration date cannot be the same";
        }
      }

      if (form?.destination_url) {
        if (!isValidUrl(form?.destination_url)) {
          websiteAllowedError = "Please enter a valid URL (including http:// or https://)";
        } else {
          const websiteCheck = isWebsiteAllowed(form?.destination_url);
          if (!websiteCheck.allowed) {
            websiteAllowedError = websiteCheck.message;
          }
        }
      }
    }

    // Link specific validation
    if (form?.addType === 'link') {
      if (form?.linkDestinationUrl) {
        if (!isValidUrl(form?.linkDestinationUrl)) {
          websiteAllowedError = "Please enter a valid URL (including http:// or https://)";
        } else {
          const websiteCheck = isWebsiteAllowed(form?.linkDestinationUrl);
          if (!websiteCheck.allowed) {
            websiteAllowedError = websiteCheck.message;
          }
        }
      }
    }

    const newErrors = {
      DestinationUrl: form?.addType === 'banner'
        ? (!form?.destination_url ? "Destination URL is required" : "")
        : (!form?.linkDestinationUrl ? "Destination URL is required" : ""),
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
        back={back}
        setform={setform}
        submitted={submitted}
        images={images}
        handleSubmit={handleSubmit}
        imageResult={imageResult}
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
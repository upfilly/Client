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
  const history = useRouter();
  const user = crendentialModel.getUser();
  const [images, setImages] = useState("");
  const [form, setform] = useState({
    id: "",
    media: "",
    couponCode: "",
    couponType: "",
    startDate: "",
    expirationDate: "",
    commissionType: "",
    applicable: [],
    visibility: "",
    url: user?.website,
    couponCommission: "",
    status: "Enabled",
    expireCheck: false,
  });
  console.log(user?.website, "user?.websiteuser?.website");
  const [campaignType, setCampaignType] = useState([]);
  const [affiliateData, setAffiliateData] = useState();
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
  const [submitted, setSubmitted] = useState(false);
  const [emailLoader, setEmailLoader] = useState(false);
  const [BrandData, setBrandData] = useState("");
  const [detail, setDetail] = useState();
  const [category, setCategory] = useState([]);
  const [relatedAffiliate, setAllAffiliate] = useState([]);
  const [DestinationUrl, setDestinationUrl] = useState("");
  const [errors, setErrors] = useState({
    selectedBrand: "",
    SelectedCampaign: "",
    DestinationUrl: "",
    websiteAllowed: "",
  });
  const [isOpenstart, setIsopenStart] = useState(false);
  const [isOpenEnd, setIsOpenEnd] = useState(false);
  const dateRef1 = useRef(null);
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

  const allGetAffiliate = (p = {}) => {
    let url = "getallaffiliatelisting";
    let brandId = user?.id;
    ApiClient.get(url, { brand_id: brandId }).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.filter((item) => item.id !== null);
        console.log(filteredData, "filteredData");
        const manipulateData = filteredData.map((itm) => ({
          name: itm?.userName || itm?.firstName,
          id: itm?.id || itm?._id,
        }));
        const uniqueData = manipulateData.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );

        console.log(uniqueData, "uniqueData");
        setAllAffiliate(uniqueData);
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

      // const urlObj = new URL(urlToParse);
      // const hostname = urlObj.hostname.replace('www.', '').toLowerCase();

      const isAllowed = allowedDomains.some((domain) => {
        const domainStr = String(domain).replace("www.", "").toLowerCase();
        console.log(domainStr, urlToParse, "11121212");
        return (
          urlToParse === domainStr ||
          (urlToParse.endsWith(`.${domainStr}`) &&
            urlToParse.split(".").length - 1 === domainStr.split(".").length)
        );
      });

      console.log(isAllowed, "isAllowedisAllowed");

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
      DestinationUrl: !DestinationUrl ? "Destination URL is required" : "",
      websiteAllowed: websiteAllowedError,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }
    const requiredFields = {
      title: "Title",
      visibility: "Type",
      couponType: "Commission Type",
      startDate: "Start Date",
      url: "Site URL",
    };

    if (!form.expireCheck) {
      requiredFields.expirationDate = "Expiration Date";
    }

    if (form?.couponType === "Custom") {
      requiredFields.commissionType = "Custom Commission Type";
      requiredFields.couponAmount = "Commission Value";
    }

    if (form?.visibility === "Exclusive to specific affiliate") {
      requiredFields.media = "Affiliates";
    }

    const missingFields = Object.keys(requiredFields).filter(
      (field) =>
        !form[field] || (Array.isArray(form[field]) && form[field].length === 0)
    );

    if (missingFields.length > 0) {
      const fieldNames = missingFields
        .map((field) => requiredFields[field])
        .join(", ");
      toast.error(`Please fill all required fields: ${fieldNames}`);
      return;
    }

    if (
      form.expireCheck &&
      new Date(form.expirationDate) < new Date(form.startDate)
    ) {
      toast.error("Expiration date must be after start date");
      return;
    }

    if (
      form?.commissionType === "Percentage Commission" &&
      form?.couponAmount > 100
    ) {
      toast.error("Percentage commission cannot exceed 100%");
      return;
    }

    try {
      new URL(form.url);
    } catch (e) {
      toast.error("Please enter a valid URL");
      return;
    }

    let method = "post";
    let url = "coupon/add";

    let value = {
      ...form,
    };

    if (form.expireCheck) {
      delete value.expirationDate;
    }

    if (value?.media) {
      value = { ...value, media: value?.media };
    }

    if (form?.visibility === "Public") {
      delete value.media;
    }

    if (form?.couponType === "Campaign") {
      delete value.commissionType;
      delete value.couponAmount;
    }

    const now = new Date();
    const startDate = new Date(form?.startDate);
    if (startDate > now) {
      value.status = "Pending";
    }

    if (value.id) {
      method = "put";
      url = "coupon/edit";
      delete value?.expireCheck;
    } else {
      delete value.id;
    }

    delete value?.couponCommissionValue;
    delete value?.couponCommissionType;
    delete value?.noExpiryDate
    loader(true);
    ApiClient.allApi(url, value, method)
      .then((res) => {
        if (res.success) {
          toast.success(
            value.id
              ? "Coupon Updated Successfully."
              : "Coupon Added Successfully."
          );
          let redirectUrl = "/coupons";
          if (role) redirectUrl = "/coupons/" + role;
          history.push(redirectUrl);
        }
        loader(false);
      })
      .catch((error) => {
        loader(false);
        toast.error(
          error.message || "An error occurred while saving the coupon"
        );
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
      // setEmailLoader(true)
      // ApiClient.get('api/check/email',{email:email}).then(res=>{
      //     if(!res.success){
      //         if(detail?.email!=email){
      //             setEmailErr(res.error.message)
      //         }
      //     }else{
      //         setEmailErr('')
      //     }
      //     setEmailLoader(false)
      // })
    }
  };

  const handleExpiryCheckChange = (checked) => {
    console.log(checked, "checked");
    setform({
      ...form,
      expireCheck: checked,
      expirationDate: checked ? form.expirationDate : "",
    });
  };

  useEffect(() => {
    setSubmitted(false);

    if (id) {
      loader(true);
      ApiClient.get("coupon/get", { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          setDetail(value);
          setform({
            id: value?.id,
            media: value?.media,
            couponCode: value?.couponCode,
            couponType: value?.couponType,
            startDate: value?.startDate,
            expirationDate: value?.expirationDate,
            commissionType: value?.commissionType,
            couponAmount: value?.couponAmount,
            applicable: value?.applicable,
            visibility: value?.visibility,
            url: value?.url,
            // "couponCommission": value?.couponCommission,
            description: value?.description,
            title: value?.title,
            status: value?.status,
            expireCheck: value?.expireCheck || false,
          });
          setImages(value?.image);
        }
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

  const getCampaignTypeData = (p = {}) => {
    let url = "campaign/brand/all";
    ApiClient.get(url, { brand_id: user?.id || user?._id }).then((res) => {
      if (res.success) {
        const data = res.data?.data;
        console.log(data, " campaignTypeData");

        const filteredData = data.filter(
          (item) => item?.access_type === "public"
        );

        const sortedData = [...filteredData].sort((a, b) => {
          if (a.isDefault === b.isDefault) return 0;
          return a.isDefault ? -1 : 1;
        });

        const newFlterData = sortedData?.map((item) => {
          return {
            id: item?.id || item?._id,
            name: `${item?.name} ${item?.isDefault ? "(isDefault)" : ""}`,
            isDefault: item?.isDefault,
          };
        });
        setCampaignType(newFlterData);
      }
    });
  };

  useEffect(() => {
    getData();
    getBrandData();
    getCategory();
    allGetAffiliate();
    getCampaignTypeData();
  }, []);

  const handleClick1 = () => {
    if (isOpenstart) {
      dateRef1.current.blur();
    } else {
      dateRef1.current.showPicker();
    }
    setIsopenStart(!isOpenstart);
  };

  const handleClick2 = () => {
    if (isOpenEnd) {
      dateRef2.current.blur();
    } else {
      dateRef2.current.showPicker();
    }
    isOpenEnd(!isOpenEnd);
  };

  return (
    <>
      <Html
        id={id}
        form={form}
        detail={detail}
        emailCheck={emailCheck}
        emailLoader={emailLoader}
        category={category}
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
        relatedAffiliate={relatedAffiliate}
        DestinationUrl={DestinationUrl}
        setDestinationUrl={setDestinationUrl}
        errors={errors}
        setErrors={setErrors}
        campaignType={campaignType}
        handleClick1={handleClick1}
        handleClick2={handleClick2}
        dateRef1={dateRef1}
        dateRef2={dateRef2}
        handleExpiryCheckChange={handleExpiryCheckChange}
        hasExpiryDate={form.expireCheck}
      />
    </>
  );
};

export default AddEditUser;

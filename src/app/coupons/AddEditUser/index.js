import React, { useState, useEffect, useRef, useCallback } from "react";
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
  });

  const [affiliateData, setAffiliateData] = useState([]);
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
  const [campaignType, setCampaignType] = useState([]);
  const [isAffiliateLoading, setIsAffiliateLoading] = useState(true);

  // Utility function to get affiliate name by ID
  const getAffiliateNameById = (id) => {
    if (!id || !relatedAffiliate.length) return "";
    const affiliate = relatedAffiliate.find((a) => a.id === id);
    return affiliate?.name || "";
  };

  const getCategory = (p = {}) => {
    let url = "main-category/all";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        setCategory(res.data.data);
      }
    });
  };

  const allGetAffiliate = (p = {}) => {
    setIsAffiliateLoading(true);
    let url = "getallaffiliatelisting";
    ApiClient.get(url)
      .then((res) => {
        if (res.success) {
          const data = res.data
            .filter((item) => item !== null)
            .map((itm) => ({
              name:
                itm?.fullName ||
                itm?.firstName ||
                itm?.username ||
                itm?.email?.split("@")[0] ||
                "Unnamed Affiliate",
              id: itm?.id || itm?._id || "",
              value: itm?.id || itm?._id || "",
            }));
          setAllAffiliate(data);

          // If editing and media exists, verify it's in the list
          if (id && form.media) {
            const exists = data.some((a) => a.id === form.media);
            if (!exists) {
              setform((prev) => ({ ...prev, media: "" }));
            }
          }
        }
        setIsAffiliateLoading(false);
      })
      .catch(() => setIsAffiliateLoading(false));
  };

  const getBrandData = (p = {}) => {
    let filter = { status: "accepted" };
    let url = "make-offers";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const uniqueBrands = new Set();
        const filteredData = res.data.data.reduce((acc, item) => {
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

  // ... keep all your existing utility functions (getError, isValidUrl, isWebsiteAllowed, validateForm) ...

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    const requiredFields = {
      title: "Title",
      visibility: "Type",
      couponType: "Commission Type",
      startDate: "Start Date",
      expirationDate: "Expiration Date",
      url: "Site URL",
    };

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
      toast.error(
        `Please fill all required fields: ${missingFields
          .map((f) => requiredFields[f])
          .join(", ")}`
      );
      return;
    }

    if (new Date(form.expirationDate) < new Date(form.startDate)) {
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
    let value = { ...form };

    if (value?.media) {
      value.media = value.media.toString();
    }

    if (form?.visibility === "Public") {
      delete value.media;
    }

    if (form?.couponType === "Campaign") {
      delete value.commissionType;
      delete value.couponAmount;
    }

    if (value.id) {
      method = "put";
      url = "coupon/edit";
    } else {
      delete value.id;
    }

    delete value?.couponCommissionValue;
    delete value?.couponCommissionType;

    loader(true);
    ApiClient.allApi(url, value, method)
      .then((res) => {
        if (res.success) {
          toast.success(
            value.id
              ? "Coupon Updated Successfully."
              : "Coupon Added Successfully."
          );
          history.push(role ? `/coupons/${role}` : "/coupons");
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

  useEffect(() => {
    setSubmitted(false);
    if (id) {
      loader(true);
      ApiClient.get("coupon/get", { id }).then((res) => {
        if (res.success) {
          const value = res.data;
          setDetail(value);
          setform({
            id: value?.id,
            media: value?.media || "",
            couponCode: value?.couponCode,
            couponType: value?.couponType,
            startDate: value?.startDate,
            expirationDate: value?.expirationDate,
            commissionType: value?.commissionType,
            couponAmount: value?.couponAmount,
            applicable: value?.applicable,
            visibility: value?.visibility,
            url: value?.url,
            description: value?.description,
            title: value?.title,
            status: value?.status,
          });
          setImages(value?.image);
        }
        loader(false);
      });
    }
  }, [id]);

  useEffect(() => {
    getData();
    getBrandData();
    getCategory();
    allGetAffiliate();
    getCampaignTypeData();
  }, []);

  const getData = (p = {}) => {
    let url = "getallaffiliatelisting";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data
          .filter((item) => item !== null)
          .map((itm) => ({
            name: itm?.fullName || itm?.firstName,
            id: itm?.id || itm?._id,
          }));
        setAffiliateData(data);
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
        console.log(filteredData, "filteredData");
        const newFlterData = filteredData?.map((item) => {
          return {
            value: item?.id || item?._id,
            label: item?.name,
          };
        });
        console.log(newFlterData, "finewFlterDatanewFlterDatalteredData");
        setCampaignType(newFlterData);
      }
    });
  };
  const useDatePicker = () => {
    const ref = useRef(null);

    const handleClick = useCallback(() => {
      if (ref.current && !ref.current.disabled) {
        ref.current.showPicker();
      }
    }, []);

    return [ref, handleClick];
  };
  const [dateRef1, handleClick1] = useDatePicker();
  const [dateRef2, handleClick2] = useDatePicker();

  const goBack = () => {
    let url = "/coupons";
    history.push(url);
  };

  return (
    <>
      <Html
        id={id}
        form={form}
        detail={detail}
        emailLoader={emailLoader}
        category={category}
        setEyes={setEyes}
        eyes={eyes}
        role={role}
        setform={setform}
        submitted={submitted}
        images={images}
        handleSubmit={handleSubmit}
        affiliateData={affiliateData}
        BrandData={BrandData}
        relatedAffiliate={relatedAffiliate}
        DestinationUrl={DestinationUrl}
        setDestinationUrl={setDestinationUrl}
        errors={errors}
        setErrors={setErrors}
        isAffiliateLoading={isAffiliateLoading}
        getAffiliateNameById={getAffiliateNameById}
        campaignType={campaignType}
        dateRef1={dateRef1}
        handleClick1={handleClick1}
        dateRef2={dateRef2}
        handleClick2={handleClick2}
        back={goBack}
      />
    </>
  );
};

export default AddEditUser;

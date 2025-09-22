import React, { useState, useEffect } from "react";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import "./style.scss";
import { userType } from "@/models/type.model";
import Html from "./Html";
import formModel from "@/models/form.model";
import crendentialModel from "@/models/credential.model";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import methodModel from "@/methods/methods";

const EditProfile = () => {
  const history = useRouter();
  const user = crendentialModel.getUser();
  const [data, setData] = useState("");
  const [form, setForm] = useState({
    id: "",
    fullName: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    mobileNo: "",
    address: "",
    image: [],
    currencies: [],
    role: "",
    instagram_username: "",
    instagram_profile_link: "",
    youtube_username: "",
    youtube_profile_link: "",
    twitter_username: "",
    twitter_profile_link: "",
    linkedin_username: "",
    linkedin_profile_link: "",
    website: "",
    description: "",
    tags: [],
    dialCode: "+1",
    pincode: "",
    social_media_platforms: [],
    category_name: "",
    category_id: "",
    country: "",
    city: "",
    pincode: "",
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: "",
    company_name: "",
    affiliate_type: "",
    cat_type: "",
    defaultCurrency: "",
  });
  const [picLoader, setPicLoader] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState([]);
  const [changeSubCategory, setChangeSubCategory] = useState("");
  const [address, setAddress] = useState(form?.address);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedItems1, setSelectedItems1] = useState(
    form?.social_media_platforms
  );
  const [websites, setWebsites] = useState([""]);
  const [selectedItems, setSelectedItems] = useState({
    categories: [],
    subCategories: [],
    subSubCategories: [],
  });
  const [dob, setDOB] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [formData, setFormData] = useState({
    // auto_invoice: false,
    // is_hide_invoice: false,
    // billing_frequency: '',
    // payment_method: '',
    // tax_detail: '',
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: "",
    company_name: "",
    // front_image:"",
    // back_image:""
    // default_invoice_setting: '',
  });
  const [formatedDob, setFormatedDob] = useState();
  const formValidation = [
    { key: "firstName", required: true },
    { key: "mobileNo", minLength: 10 },
    { key: "gender", required: true },
    { key: "dialCode", minLength: 1 },
    // { key: 'affiliate_type', required:true },
    // { key: 'category_id', required:true },
    // { key: 'sub_category_id', required:true },
    // { key: 'sub_child_category_id', required:true },
  ];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory("");
    setSelectedSubSubcategory("");
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setSelectedSubSubcategory("");
  };

  const handleSubsubcategoryChange = (e) => {
    setSelectedSubSubcategory(e.target.value);
  };

  useEffect(() => {
    if (!form?.dialCode) {
      setForm((prevForm) => ({ ...prevForm, dialCode: "+1" }));
    }
  }, [form?.dialCode]);

  useEffect(() => {
    setAddress(form?.address);
  }, [form?.address]);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedDOB = { day, month, year };

      setDOB(date);
      setFormatedDob(formattedDOB);
    }
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const gallaryData = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: user?.activeUser?.id }).then((res) => {
      if (res.success) {
        // setForm(res.data)
        let value = res.data;
        let payload = userType;
        let oarr = Object.keys(userType);
        oarr.map((itm) => {
          payload[itm] = value[itm] || "";
        });
        setForm({
          ...payload,
          firstName: capitalizeFirstLetter(value.firstName),
          lastName: capitalizeFirstLetter(value.lastName),
          platforms: res?.data?.propertyType || [],
        });
        setFormData(payload);
        setWebsites(value?.affiliate_website || [""]);
        setData(res.data);
        setPlatforms(res?.data?.propertyType || []);
        setSelectedItems({
          categories: res.data.category_id || [],
          subCategories: res.data.sub_category_id || [],
          subSubCategories: res.data.sub_child_category_id || [],
        });
      }
      loader(false);
    });
  };

  console.log(platforms, "platformsplatforms");

  const getError = (key) => {
    return formModel.getError("profileForm", key);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (form?.dialCode == "") return;
    if (form?.mobileNo == "") return;
    if (invalid) return;
    if (user?.role == "affiliate" && !form?.affiliate_type) return;

    let value = {
      ...form,
      firstName: capitalizeFirstLetter(form.firstName),
      lastName: capitalizeFirstLetter(form.lastName),
      currencies: form?.currencies || [],
      social_media_platforms: selectedItems1 || [],
      affiliate_website: websites,
      lat: selectedLocation?.lat?.toString(),
      lng: selectedLocation?.lng?.toString(),
      address: selectedLocation?.address || address,
      country: selectedLocation?.country || form?.country,
      state: selectedLocation?.state || form?.state,
      city: selectedLocation?.city || form?.city,
      pincode: selectedLocation?.pincode || form?.pincode,
      // payment_method:formData?.payment_method,
      accountholder_name: formData?.accountholder_name,
      routing_number: formData?.routing_number,
      account_number: formData?.account_number,
      ssn_number: formData?.ssn_number,
      company_name: formData?.company_name,
      // sub_category_id: selectedSubcategory,
      // sub_child_category_id: selectedSubSubcategory,
      // category_id: selectedCategory,
      propertyType: form?.platforms,
      category_id: selectedItems?.categories,
      sub_category_id: selectedItems?.subCategories,
      sub_child_category_id: selectedItems?.subSubCategories,
      // cat_type:form?.cat_type
      // dob: formatedDob,
    };
    delete value?.platforms;
    delete value?.websites;
    if (!value?.cat_type) {
      delete value?.cat_type;
    }
    if (!value?.sub_category_id) {
      delete value?.sub_category_id;
    }
    if (!value?.category_id) {
      delete value?.category_id;
    }
    if (!value?.sub_child_category_id) {
      delete value?.sub_child_category_id;
    }
    delete value.category_name;
    // delete value.category_id
    delete value.role;
    delete value.addedBy;

    if (!form?.affiliate_group) {
      delete value.affiliate_group;
    }

    if (user?.role != "affiliate") {
      delete value.affiliate_type;
    }

    loader(true);
    ApiClient.put("edit/profile", value).then((res) => {
      if (res.success) {
        let uUser = { ...user, ...value };
        crendentialModel.setUser(uUser);
        history.push("/profile");
        toast.success(res.message);
      }
      toast.error(res.error.message);
      loader(false);
    });
  };

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      const city =
        addressComponents.find((component) =>
          component.types.includes("locality")
        )?.long_name || "";
      const state =
        addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name || "";
      const country =
        addressComponents.find((component) =>
          component.types.includes("country")
        )?.long_name || "";
      const pincode =
        addressComponents.find((component) =>
          component.types.includes("postal_code")
        )?.long_name || "";

      const selectedLocation = {
        address: selectedAddress,
        city,
        state,
        country,
        pincode,
        ...latLng,
      };

      setSelectedLocation(selectedLocation);
      setForm({
        ...form,
        city: selectedLocation?.city,
        state: selectedLocation?.state,
        country: selectedLocation?.country,
        pincode: selectedLocation?.pincode,
      });
      setAddress(selectedAddress);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      // console.error('Error:', error);
    }
  };

  const uploadImage = (e) => {
    setForm({ ...form, baseImg: e.target.value });
    let files = e.target.files;
    let file = files.item(0);
    // loader(true)
    setPicLoader(true);
    ApiClient.postFormData("upload/image?modelName=users", {
      file: file,
      modelName: "users",
    }).then((res) => {
      if (res.data) {
        let image = res?.data?.fullpath;
        setForm({ ...form, image: `images/users/${image}` });
      }
      setPicLoader(false);
    });
  };

  useEffect(() => {
    if (user) {
      gallaryData();
    }
  }, []);

  const getCategory = (p = {}) => {
    let url = `categoryWithSub?page&count&search&cat_type=${
      user?.role == "affiliate" ? "promotional_models" : "advertiser_categories"
    }&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data
          .map((data) => (data.parent_cat_name ? data : undefined))
          .filter((item) => item !== undefined);
        // setCategories(data);
        setCategory(data);
      }
    });
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleFeatureCheckbox = (item) => {
    if (selectedItems1.includes(item)) {
      setSelectedItems1(selectedItems1.filter((selected) => selected !== item));
      // Clear the corresponding form fields when the checkbox is unchecked
      setForm((prevForm) => ({
        ...prevForm,
        [`${item}_username`]: "",
        [`${item}_profile_link`]: "",
      }));
    } else {
      setSelectedItems1([...selectedItems1, item]);
    }
  };

  useEffect(() => {
    setSelectedItems1(form?.social_media_platforms);
  }, [form?.social_media_platforms]);

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
      <Html
        handleSubmit={handleSubmit}
        setForm={setForm}
        form={form}
        uploadImage={uploadImage}
        getError={getError}
        submitted={submitted}
        category={category}
        changeSubCategory={changeSubCategory}
        address={address}
        handleSelect={handleSelect}
        handleChange={handleChange}
        setChangeSubCategory={setChangeSubCategory}
        selectedItems1={selectedItems1}
        setSelectedItems1={setSelectedItems1}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        handleFeatureCheckbox={handleFeatureCheckbox}
        picLoader={picLoader}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        formData={formData}
        setFormData={setFormData}
        dob={dob}
        setDOB={setDOB}
        handleDateChange={handleDateChange}
        user={user}
        handleCategoryChange={handleCategoryChange}
        handleSubcategoryChange={handleSubcategoryChange}
        handleSubsubcategoryChange={handleSubsubcategoryChange}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        history={history}
        websites={websites}
        setWebsites={setWebsites}
        platforms={platforms}
        setPlatforms={setPlatforms}
      />
    </>
  );
};

export default EditProfile;

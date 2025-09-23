"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import crendentialModel from "@/models/credential.model";
import "react-datepicker/dist/react-datepicker.css";
import Layout from "../components/global/layout";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function BillingForm() {
  const param = useSearchParams();
  const id = param.get("planId");
  const user = crendentialModel.getUser();
  const history = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [aloader, setLoader] = useState(true);
  const [formData, setFormData] = useState({
    status: "Active",
    currency: "USD",
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    password: "",
    confirmPassword: "",
    address: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    payment_method: "",
    userName: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    country: "",
    pincode: "",
    terms: "",
    plan: "",
    userName: "",
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    lat: null,
    lng: null,
  });
  const [address, setAddress] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [eyes, setEyes] = useState({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });
  const [startDate, setStartDate] = useState(null);
  const [data, setData] = useState([]);
  const [filters, setFilter] = useState({
    page: 1,
    count: 50,
    search: "",
    isDeleted: false,
    status: "",
  });
  const [selectedId, setSelectedId] = useState(id || null);
  const FilterData = data.filter((event) => !event.isUpcoming);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const specialOfferPrice = offers?.filter((itm) => itm?._id == selectedOffer);
  const seletedplandata = data?.filter((dat) => dat?._id == selectedId);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const getOfferData = (p = {}) => {
    setLoader(true);
    if (!user) {
      let filter = { ...filters, ...p, category: "Managed Services" };
      let url = "subscription-plan/all";
      ApiClient.get(url, filter)
        .then((res) => {
          if (res) {
            setOffers(res?.data?.data);
            setLoader(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching offers:", error);
          setLoader(false);
        });
    }
  };

  const getData = (p = {}) => {
    setLoader(true);
    if (!user) {
      let filter = { ...filters, ...p, category: "Network" };
      let url = "subscription-plan/all";
      ApiClient.get(url, filter)
        .then((res) => {
          if (res) {
            setData(res?.data?.data);
            setLoader(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoader(false);
        });
    }
  };

  useEffect(() => {
    getOfferData();
    getData();
  }, []);

  // Fixed username validation function
  const checkUsernameExists = async (username) => {
    try {
      const response = await ApiClient.post("userName/check", {
        userName: username,
      });
      // Adjust this based on your actual API response structure
      // Typically, it should return { exists: true } if username is taken
      return !response.exists; // Return true if available, false if taken
    } catch (error) {
      console.error("Error checking username:", error);
      return false; // On error, assume not available
    }
  };

  // Username availability check effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (
        formData.userName &&
        formData.userName.length >= 3 &&
        /^[a-zA-Z0-9_]+$/.test(formData.userName)
      ) {
        setCheckingUsername(true);
        const isAvailable = await checkUsernameExists(formData.userName);
        setUsernameAvailable(isAvailable);
        setCheckingUsername(false);
      } else if (formData.userName) {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.userName]);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleRadioChange = (itemId) => {
    setSelectedId(itemId);
    setErrors((prev) => ({
      ...prev,
      plan: "",
    }));
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        error = value.trim() ? "" : "This field is required";
        break;
      case "email":
        error = validateEmail(value)
          ? ""
          : "Please enter a valid email address";
        break;
      case "password":
        error = validatePassword(value)
          ? ""
          : "Password must be at least 8 characters";
        break;
      case "confirmPassword":
        error = value === formData.password ? "" : "Passwords do not match";
        break;
      case "address":
        error = value.trim() ? "" : "Address is required";
        break;
      case "city":
        error = value.trim() ? "" : "City is required";
        break;
      case "country":
        error = value.trim() ? "" : "Country is required";
        break;
      case "pincode":
        error = value.trim() ? "" : "Postal code is required";
        break;
      case "userName":
        if (!value) {
          error = "Username is required";
        } else if (value.length < 3) {
          error = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = "Username can only contain letters, numbers and underscores";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Field length restrictions
    if (name === "cardNumber" && value.length > 16) return;
    if (name === "cardCvc" && value.length > 4) return;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate on change for immediate feedback
    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }

    // Reset username availability when username changes
    if (name === "userName") {
      const cleanedValue = value.replace(/\s/g, "");
      setFormData((prev) => ({
        ...prev,
        userName: cleanedValue,
      }));
      setUsernameAvailable(null);
    }
  };

  const handleLocationChange = (field, value) => {
    setSelectedLocation((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate location fields
    if (field in errors) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate form fields
    newErrors.firstName = validateField("firstName", formData.firstName);
    // newErrors.lastName = validateField("lastName", formData.lastName);
    newErrors.email = validateField("email", formData.email);
    newErrors.password = validateField("password", formData.password);
    newErrors.confirmPassword = validateField(
      "confirmPassword",
      formData.confirmPassword
    );
    newErrors.address = validateField("address", address);
    newErrors.city = validateField("city", selectedLocation.city);
    newErrors.country = validateField("country", selectedLocation.country);
    newErrors.pincode = validateField("pincode", selectedLocation.pincode);
    newErrors.userName = validateField("userName", formData.userName);
    newErrors.terms = isTermsAccepted
      ? ""
      : "You must agree to the terms and conditions";
    newErrors.plan = selectedId ? "" : "Please select a plan";

    // Check if any errors exist
    for (const key in newErrors) {
      if (newErrors[key]) {
        isValid = false;
        break;
      }
    }

    setErrors(newErrors);
    return isValid;
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

      const location = {
        address: selectedAddress,
        city,
        state,
        country,
        pincode,
        ...latLng,
      };

      setSelectedLocation(location);
      setAddress(selectedAddress);

      // Clear address errors after selection
      setErrors((prev) => ({
        ...prev,
        address: "",
        city: city ? "" : "City is required",
        country: country ? "" : "Country is required",
        pincode: pincode ? "" : "Postal code is required",
      }));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
    setErrors((prev) => ({
      ...prev,
      address: newAddress.trim() ? "" : "Address is required",
    }));
  };

  const handleSave = async () => {
    console.log("Buy button clicked - Starting validation");

    if (!validateForm()) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    // Check username availability if not already checked
    if (usernameAvailable === null && formData.userName) {
      console.log("Checking username availability...");
      setCheckingUsername(true);
      try {
        const isAvailable = await checkUsernameExists(formData.userName);
        setUsernameAvailable(isAvailable);
        setCheckingUsername(false);

        if (!isAvailable) {
          toast.error(
            "Username is already taken. Please choose a different one."
          );
          setErrors((prev) => ({
            ...prev,
            userName: "Username is already taken",
          }));
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        toast.error("Error checking username availability. Please try again.");
        setCheckingUsername(false);
        return;
      }
    }

    if (usernameAvailable === false) {
      toast.error("Please choose a different username");
      return;
    }

    console.log("All validations passed - Proceeding with registration");
    loader(true);

    const registrationData = {
      role: "brand",
      request_status: "accepted",
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName || "",
      userName: formData.userName,
      password: formData.password,
      address: selectedLocation.address,
      country: selectedLocation.country,
      state: selectedLocation.state,
      city: selectedLocation.city,
      pincode: selectedLocation.pincode,
      plan_id: selectedId,
      network_plan_amount: seletedplandata?.[0]?.amount || 0,
      managed_services_plan_amount:
        seletedplandata?.[0]?.amount == 0
          ? 0
          : specialOfferPrice?.[0]?.amount || 0,
      special_plan_id: seletedplandata?.[0]?.amount == 0 ? null : selectedOffer,
      isSpecial: false,
      interval: "month",
      interval_count: seletedplandata?.[0]?.interval_count || 1,
      device_token:
        typeof window !== "undefined"
          ? localStorage.getItem("device_token") || ""
          : "",
    };

    console.log("Registration data:", registrationData);

    try {
      const res = await ApiClient.post("register/brand", registrationData);
      console.log("Registration response:", res);

      if (res.success === true) {
        // Reset form
        setFormData({
          status: "Active",
          currency: "USD",
          firstName: "",
          lastName: "",
          email: "",
          website: "",
          password: "",
          confirmPassword: "",
          address: "",
          cardNumber: "",
          cardExpiry: "",
          cardCvc: "",
          payment_method: "",
          userName: "",
        });

        if (seletedplandata?.[0]?.amount == 0) {
          loader(false);
          toast.success(
            "Your account has been created successfully. Please check your email for verification."
          );
          history.push("/");
        } else {
          window.location.href = res?.data?.url;
        }
      } else {
        console.error("Registration failed:", res);
        toast.error(
          res?.error?.message || "Registration failed. Please try again."
        );
        loader(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        "Failed to process your request. Please check your connection and try again."
      );
      loader(false);
    }
  };

  const handleClick = () => {
    setShowPopup(false);
    history.push("/");
  };

  const calculateDiscountedAmount = (amount, discountDetails) => {
    if (!discountDetails || !discountDetails.discount_type) {
      return amount;
    }

    if (discountDetails.discount_type === "flat") {
      return amount - discountDetails.amount_value;
    }

    if (discountDetails.discount_type === "percentage") {
      const percentageValue = (amount * discountDetails.amount_value) / 100;
      return amount - percentageValue;
    }

    return amount;
  };

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={undefined}
        filters={undefined}
      >
        <div className="main-affiliate mt-3 mb-0 pt-0">
          <div className="container">
            <div>
              <img
                src="/assets/img/logo.png"
                className="mx-auto mb-4 pointer logo"
                onClick={
                  !user
                    ? () => history.push("/")
                    : () => history.push("/dashboard")
                }
                alt="Logo"
              />
              <h2 className="text-center mb-0 select_plans">Select a plan</h2>
            </div>
          </div>

          {showPopup && (
            <div className="modal d-block">
              <div
                className="modal-dialog modal-dialog-centered dateModal"
                role="document"
              >
                <div className="modal-content text-center">
                  <div className="modal-body">
                    <div>
                      <img
                        src="../../../assets/img/logo.png"
                        className="greentik"
                        alt="Success"
                      />
                    </div>
                    <h5 className="tital mt-5">Plan Purchased Successfully.</h5>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleClick}
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="common-padding">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12 col-xl-8">
                <div className="card p-0 mb-4">
                  <div className="card-header ">
                    <h3 className="mb-0 card-title">
                      Account <span className="subsmal">Select a plan</span>
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row ">
                      {FilterData?.map((itm) => {
                        const discountedAmount = calculateDiscountedAmount(
                          itm.amount,
                          itm.discount_details
                        );
                        const cardClass =
                          selectedId === itm?._id
                            ? "checked_tbn"
                            : `checked_tbn_after ${
                                errors?.plan ? "border-red" : ""
                              }`;

                        return (
                          <label
                            key={itm._id}
                            htmlFor={`exampleRadios${itm._id}`}
                            className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-4"
                          >
                            <div className={cardClass}>
                              <div className="sub-opt form-check pl-0">
                                <label
                                  className="form-check-label"
                                  htmlFor={`exampleRadios${itm._id}`}
                                >
                                  {itm?.name}
                                </label>
                                <input
                                  className="form-check-input custom-radio"
                                  type="radio"
                                  name="exampleRadios"
                                  id={`exampleRadios${itm._id}`}
                                  value={itm.name}
                                  checked={selectedId === itm._id}
                                  onChange={() => handleRadioChange(itm._id)}
                                  required
                                />
                              </div>
                              <div className="opt-main_cate">
                                <ul className="opt-category plan-featuress pl-0">
                                  <div className="additional-info">
                                    <div className="info-item d-flex justify-content-between align-items-center">
                                      <strong>Basket Value Charge:</strong>
                                      <p className="mb-0">
                                        {itm.basket_value_charge}%
                                      </p>
                                    </div>
                                    <div className="info-item d-flex justify-content-between align-items-center">
                                      <strong>Commission Override:</strong>
                                      <p className="mb-0">
                                        {itm.commission_override}%
                                      </p>
                                    </div>
                                    <div className="info-item d-flex justify-content-between align-items-center">
                                      <strong>Bonus Override:</strong>
                                      <p className="mb-0">
                                        {" "}
                                        {itm.bonus_override}%
                                      </p>
                                    </div>
                                    <div className="info-item d-flex justify-content-between align-items-center">
                                      <strong>Allowed Total Revenue:</strong>
                                      <p className="mb-0">
                                        {itm.allowed_total_revenue}$
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    {itm?.features?.map((feature, index) => (
                                      <li className="flexs" key={index}>
                                        {feature.feature_name && (
                                          <img
                                            className="checkss !mr-0"
                                            src="/assets/img/check.png"
                                            alt=""
                                          />
                                        )}
                                        <p className="ipsi mb-0">
                                          {feature.feature_name}
                                        </p>
                                      </li>
                                    ))}
                                  </div>
                                </ul>
                                <div className="d-flex align-items-center amt-desc">
                                  {itm?.discount_details && (
                                    <p className="textWrong mr-2">
                                      ${itm?.amount}
                                    </p>
                                  )}
                                  <div className="d-flex align-items-center">
                                    <p className="dollarf-sec">
                                      ${discountedAmount}
                                    </p>
                                    <p className="montyh ms-1">
                                      /{itm.billing_frequency} month
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {errors.plan && (
                      <div className="invalid-feedback d-block">
                        {errors.plan}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-12 col-lg-12 col-xl-4">
                <div className="card p-0 mb-4">
                  <div className="card-header">
                    <h4 className="card-title">Basic Information</h4>
                  </div>

                  <div className="card-body">
                    <div className="form-row">
                      {!user && (
                        <>
                          <div className="col-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label className="label-set">First Name</label>
                              <input
                                type="text"
                                className={`form-control quick-radius ${
                                  errors.firstName ? "is-invalid" : ""
                                }`}
                                placeholder="Enter first name"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                onBlur={() =>
                                  setErrors((prev) => ({
                                    ...prev,
                                    firstName: validateField(
                                      "firstName",
                                      formData.firstName
                                    ),
                                  }))
                                }
                              />
                              {errors.firstName && (
                                <div className="invalid-feedback d-block">
                                  {errors.firstName}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label className="label-set">Last Name </label>
                              <input
                                type="text"
                                className={`form-control quick-radius ${
                                  errors.lastName ? "is-invalid" : ""
                                }`}
                                placeholder="Enter last name"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                onBlur={() =>
                                  setErrors((prev) => ({
                                    ...prev,
                                    lastName: validateField(
                                      "lastName",
                                      formData.lastName
                                    ),
                                  }))
                                }
                              />
                              {/* {errors.lastName && (
                                <div className="invalid-feedback d-block">
                                  {errors.lastName}
                                </div>
                              )} */}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-12">
                            <div className="form-group">
                              <label className="label-set">Email </label>
                              <input
                                type="email"
                                className={`form-control quick-radius ${
                                  errors.email ? "is-invalid" : ""
                                }`}
                                placeholder="Enter email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={() =>
                                  setErrors((prev) => ({
                                    ...prev,
                                    email: validateField(
                                      "email",
                                      formData.email
                                    ),
                                  }))
                                }
                              />
                              {errors.email && (
                                <div className="invalid-feedback d-block">
                                  {errors.email}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-12 col-md-6 col-lg-12">
                            <div className="form-group">
                              <label className="label-set">Username </label>
                              <input
                                type="text"
                                className={`form-control quick-radius ${
                                  errors.userName ? "is-invalid" : ""
                                }`}
                                placeholder="Enter username"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                onBlur={() =>
                                  setErrors((prev) => ({
                                    ...prev,
                                    userName: validateField(
                                      "userName",
                                      formData.userName
                                    ),
                                  }))
                                }
                              />
                              {errors.userName && (
                                <div className="invalid-feedback d-block">
                                  {errors.userName}
                                </div>
                              )}
                              {!errors.userName && formData.userName && (
                                <div className="small mt-1">
                                  {checkingUsername ? (
                                    <span className="text-muted">
                                      Checking username availability...
                                    </span>
                                  ) : usernameAvailable === true ? (
                                    <span className="text-success">
                                      ✓ Username is available!
                                    </span>
                                  ) : usernameAvailable === false ? (
                                    <span className="text-danger">
                                      ✗ Username is already taken
                                    </span>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-12 col-md-6 col-lg-12">
                            <div className="form-group">
                              <label className="label-set">Password </label>
                              <div className="input-group position-relative">
                                <input
                                  type={eyes.password ? "text" : "password"}
                                  className={`form-control quick-radius password_space ${
                                    errors.password ? "is-invalid" : ""
                                  }`}
                                  placeholder="Enter password (min 8 characters)"
                                  id="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  onBlur={() =>
                                    setErrors((prev) => ({
                                      ...prev,
                                      password: validateField(
                                        "password",
                                        formData.password
                                      ),
                                    }))
                                  }
                                />
                                <div className="eye-icon-m">
                                  <i
                                    className={
                                      eyes.password
                                        ? "fa fa-eye"
                                        : "fa fa-eye-slash"
                                    }
                                    onClick={() =>
                                      setEyes({
                                        ...eyes,
                                        password: !eyes.password,
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </div>
                              </div>
                              {errors.password && (
                                <div className="invalid-feedback d-block">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-12">
                            <div className="form-group">
                              <label className="label-set">
                                Confirm Password{" "}
                              </label>
                              <div className="input-group position-relative">
                                <input
                                  type={
                                    eyes.confirmPassword ? "text" : "password"
                                  }
                                  className={`form-control quick-radius password_space ${
                                    errors.confirmPassword ? "is-invalid" : ""
                                  }`}
                                  placeholder="Confirm your password"
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleInputChange}
                                  onBlur={() =>
                                    setErrors((prev) => ({
                                      ...prev,
                                      confirmPassword: validateField(
                                        "confirmPassword",
                                        formData.confirmPassword
                                      ),
                                    }))
                                  }
                                />
                                <div className="eye-icon-m">
                                  <i
                                    className={
                                      eyes.confirmPassword
                                        ? "fa fa-eye"
                                        : "fa fa-eye-slash"
                                    }
                                    onClick={() =>
                                      setEyes({
                                        ...eyes,
                                        confirmPassword: !eyes.confirmPassword,
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  ></i>
                                </div>
                              </div>
                              {errors.confirmPassword && (
                                <div className="invalid-feedback d-block">
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-12 col-md-6 col-lg-6 ">
                            <div className="form-group">
                              <label className="label-set">Website </label>
                              <input
                                type="text"
                                className="form-control quick-radius"
                                placeholder="Enter website"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label className="label-set">Currency </label>
                              <input
                                type="text"
                                className="form-control quick-radius"
                                placeholder="Enter currency"
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card p-0 mb-4">
                  <div className="card-header">
                    <h4 className="card-title">Billing Address</h4>
                  </div>
                  <div className="card-body">
                    <div className="form-row">
                      <div className="col-12 col-md-12">
                        <div className="form-group">
                          <label className="label-set">Address </label>
                          {!aloader ? (
                            <PlacesAutocomplete
                              value={address}
                              onChange={handleChange}
                              onSelect={handleSelect}
                            >
                              {({
                                getInputProps,
                                suggestions,
                                getSuggestionItemProps,
                                loading,
                              }) => (
                                <div>
                                  <input
                                    className={`form-control quick-radius ${
                                      errors.address ? "is-invalid" : ""
                                    }`}
                                    {...getInputProps({
                                      placeholder: "Enter an address...",
                                      onFocus: () => setInputFocused(true),
                                      onBlur: () => {
                                        setInputFocused(false);
                                        setErrors((prev) => ({
                                          ...prev,
                                          address: validateField(
                                            "address",
                                            address
                                          ),
                                        }));
                                      },
                                    })}
                                  />
                                  {/* {loading && <div>Loading...</div>} */}
                                  <div className="suggestions-container">
                                    {suggestions.map((suggestion) => (
                                      <div
                                        className="suggestion-item"
                                        {...getSuggestionItemProps(suggestion)}
                                        key={suggestion.placeId}
                                      >
                                        <i className="fa-solid fa-location-dot mr-2"></i>
                                        {suggestion.description}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </PlacesAutocomplete>
                          ) : (
                            <input
                              type="text"
                              className="form-control quick-radius"
                              placeholder="Loading address autocomplete..."
                              disabled
                            />
                          )}
                          {errors.address && (
                            <div className="invalid-feedback d-block">
                              {errors.address}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <div className="form-group">
                          <label className="label-set">Country</label>
                          <input
                            type="text"
                            value={selectedLocation.country}
                            onChange={(e) =>
                              handleLocationChange("country", e.target.value)
                            }
                            className={`form-control quick-radius ${
                              errors.country ? "is-invalid" : ""
                            }`}
                            onBlur={() =>
                              setErrors((prev) => ({
                                ...prev,
                                country: validateField(
                                  "country",
                                  selectedLocation.country
                                ),
                              }))
                            }
                          />
                          {errors.country && (
                            <div className="invalid-feedback d-block">
                              {errors.country}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="label-set">City</label>
                          <input
                            type="text"
                            value={selectedLocation.city}
                            onChange={(e) =>
                              handleLocationChange("city", e.target.value)
                            }
                            className={`form-control quick-radius ${
                              errors.city ? "is-invalid" : ""
                            }`}
                            onBlur={() =>
                              setErrors((prev) => ({
                                ...prev,
                                city: validateField(
                                  "city",
                                  selectedLocation.city
                                ),
                              }))
                            }
                          />
                          {errors.city && (
                            <div className="invalid-feedback d-block">
                              {errors.city}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="label-set">Postal Code</label>
                          <input
                            type="text"
                            value={selectedLocation.pincode}
                            onChange={(e) =>
                              handleLocationChange("pincode", e.target.value)
                            }
                            className={`form-control quick-radius ${
                              errors.pincode ? "is-invalid" : ""
                            }`}
                            onBlur={() =>
                              setErrors((prev) => ({
                                ...prev,
                                pincode: validateField(
                                  "pincode",
                                  selectedLocation.pincode
                                ),
                              }))
                            }
                          />
                          {errors.pincode && (
                            <div className="invalid-feedback d-block">
                              {errors.pincode}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className={`form-check-input ${
                              errors.terms ? "is-invalid" : ""
                            }`}
                            id="termsCheck"
                            checked={isTermsAccepted}
                            onChange={(e) => {
                              setIsTermsAccepted(e.target.checked);
                              setErrors((prev) => ({
                                ...prev,
                                terms: e.target.checked
                                  ? ""
                                  : "You must agree to the terms and conditions",
                              }));
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="termsCheck"
                          >
                            I agree to the{" "}
                            <a
                              href="/termsconditions"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              terms and conditions
                            </a>{" "}
                            and
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShowModal();
                              }}
                            >
                              {" "}
                              agreement
                            </a>
                            .
                          </label>
                          {errors.terms && (
                            <div className="invalid-feedback d-block">
                              {errors.terms}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 justify-content-md-end justify-content-lg-center mt-4">
                      <button
                        className="btn btn-primary buy-btn"
                        onClick={handleSave}
                        disabled={checkingUsername}
                      >
                        {checkingUsername ? "Checking..." : "Buy"}
                      </button>
                      <button
                        className="btn btn-secondary buy-btn"
                        onClick={() => history.back()}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Upfilly Agreement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <iframe
                src="/assets/img/AffiliateAgreemnet.pdf"
                style={{ width: "100%", height: "500px" }}
                frameBorder="0"
                title="Upfilly Agreement"
              ></iframe>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>
    </>
  );
}

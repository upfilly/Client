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

  const checkUsernameExists = async (username) => {
    try {
      const response = await ApiClient.post("userName/check", {
        userName: username,
      });
      return !response.exists;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

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
        if (!value.trim()) {
          error = "This field is required";
        } else if (value.trim().length < 3) {
          error = "Must be at least 3 characters";
        }
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

    if (name === "cardNumber" && value.length > 16) return;
    if (name === "cardCvc" && value.length > 4) return;

    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "firstName" || name === "lastName") {
      if (newValue.length >= 3) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }

    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }

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

    newErrors.firstName = validateField("firstName", formData.firstName);
    newErrors.lastName = validateField("lastName", formData.lastName);
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
        <div className="billing-page">
          <div className="container">
            {/* Logo Section */}
            <div className="billing-header">
              <img
                src="/assets/img/logo.png"
                className="billing-logo"
                onClick={
                  !user
                    ? () => history.push("/")
                    : () => history.push("/dashboard")
                }
                alt="Logo"
              />
              <h1 className="billing-title">Select Your Plan</h1>
              <p className="billing-subtitle">Choose the perfect plan for your business needs</p>
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
                          className="btn-ok"
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

          <div className="billing-content">
            <div className="container">
              <div className="billing-layout">
                {/* Plans Section - Top on mobile, flexible width */}
                <div className="plans-section">
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>Available Plans</h3>
                      <span>{FilterData.length} plans available for you</span>
                    </div>
                    <div className="form-card-body">
                      <div className="plans-container">
                        <div className="plans-scroll-wrapper">
                          <div className="plans-flex-grid">
                            {FilterData?.map((itm) => {
                              const discountedAmount = calculateDiscountedAmount(
                                itm.amount,
                                itm.discount_details
                              );
                              const isSelected = selectedId === itm?._id;

                              return (
                                <div
                                  key={itm._id}
                                  className={`plan-card ${isSelected ? 'selected' : ''} ${errors?.plan ? 'error' : ''}`}
                                  onClick={() => handleRadioChange(itm._id)}
                                >
                                  <div className="plan-card-header">
                                    <div className="plan-radio">
                                      <div className={`radio-custom ${isSelected ? 'checked' : ''}`}>
                                        {isSelected && <div className="radio-dot"></div>}
                                      </div>
                                      <h4 className="plan-name">{itm?.name}</h4>
                                    </div>
                                  </div>
                                  <div className="plan-card-body">
                                    <div className="plan-details">
                                      <div className="detail-item">
                                        <span className="detail-label">Basket Value:</span>
                                        <span className="detail-value">{itm.basket_value_charge}%</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Commission:</span>
                                        <span className="detail-value">{itm.commission_override}%</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Bonus:</span>
                                        <span className="detail-value">{itm.bonus_override}%</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Revenue Cap:</span>
                                        <span className="detail-value">${itm.allowed_total_revenue}</span>
                                      </div>
                                    </div>
                                    <div className="plan-features">
                                      {itm?.features?.slice(0, 3)?.map((feature, index) => (
                                        <div className="feature-item" key={index}>
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                          </svg>
                                          <span>{feature.feature_name}</span>
                                        </div>
                                      ))}
                                      {itm?.features?.length > 3 && (
                                        <div className="feature-more">
                                          +{itm.features.length - 3} more features
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="plan-card-footer">
                                    <div className="plan-price">
                                      {itm?.discount_details && (
                                        <span className="price-original">${itm?.amount}</span>
                                      )}
                                      <span className="price-current">${discountedAmount}</span>
                                      <span className="price-period">/{itm.billing_frequency}m</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      {errors.plan && (
                        <div className="error-message">{errors.plan}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Section - Bottom on mobile */}
                <div className="form-section">
                  {/* Basic Information */}
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>Basic Information</h3>
                      <span>Tell us about yourself</span>
                    </div>
                    <div className="form-card-body">
                      {!user && (
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input
                              type="text"
                              className={`form-input ${errors.firstName ? 'error' : ''}`}
                              placeholder="Enter first name"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setErrors((prev) => ({
                                  ...prev,
                                  firstName: validateField("firstName", formData.firstName),
                                }))
                              }
                            />
                            {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input
                              type="text"
                              className={`form-input ${errors.lastName ? 'error' : ''}`}
                              placeholder="Enter last name"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setErrors((prev) => ({
                                  ...prev,
                                  lastName: validateField("lastName", formData.lastName),
                                }))
                              }
                            />
                            {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                          </div>

                          <div className="form-group full-width">
                            <label className="form-label">Email Address *</label>
                            <input
                              type="email"
                              className={`form-input ${errors.email ? 'error' : ''}`}
                              placeholder="Enter email address"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setErrors((prev) => ({
                                  ...prev,
                                  email: validateField("email", formData.email),
                                }))
                              }
                            />
                            {errors.email && <span className="form-error">{errors.email}</span>}
                          </div>

                          <div className="form-group full-width">
                            <label className="form-label">Username *</label>
                            <input
                              type="text"
                              className={`form-input ${errors.userName ? 'error' : ''}`}
                              placeholder="Choose a username"
                              name="userName"
                              value={formData.userName}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setErrors((prev) => ({
                                  ...prev,
                                  userName: validateField("userName", formData.userName),
                                }))
                              }
                            />
                            {errors.userName && <span className="form-error">{errors.userName}</span>}
                            {!errors.userName && formData.userName && (
                              <span className={`form-hint ${usernameAvailable === true ? 'success' : usernameAvailable === false ? 'error' : ''}`}>
                                {checkingUsername ? (
                                  "Checking availability..."
                                ) : usernameAvailable === true ? (
                                  "✓ Username is available"
                                ) : usernameAvailable === false ? (
                                  "✗ Username is already taken"
                                ) : null}
                              </span>
                            )}
                          </div>

                          <div className="form-group full-width">
                            <label className="form-label">Password *</label>
                            <div className="password-wrapper">
                              <input
                                type={eyes.password ? "text" : "password"}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="Create a password (min 8 characters)"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={() =>
                                  setErrors((prev) => ({
                                    ...prev,
                                    password: validateField("password", formData.password),
                                  }))
                                }
                              />
                              <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setEyes({ ...eyes, password: !eyes.password })}
                              >
                                <i className={eyes.password ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                              </button>
                            </div>
                            {errors.password && <span className="form-error">{errors.password}</span>}
                          </div>

                          <div className="form-group full-width">
                            <label className="form-label">Confirm Password *</label>
                            <div className="password-wrapper">
                              <input
                                type={eyes.confirmPassword ? "text" : "password"}
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={() =>
                                  setErrors((prev) => ({
                                    ...prev,
                                    confirmPassword: validateField("confirmPassword", formData.confirmPassword),
                                  }))
                                }
                              />
                              <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}
                              >
                                <i className={eyes.confirmPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                              </button>
                            </div>
                            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Website</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Enter website URL"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Currency</label>
                            <input
                              type="text"
                              className="form-input"
                              value={formData.currency}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="form-card">
                    <div className="form-card-header">
                      <h3>Billing Address</h3>
                      <span>Where should we send the invoice?</span>
                    </div>
                    <div className="form-card-body">
                      <div className="form-group full-width">
                        <label className="form-label">Address *</label>
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
                              <div className="autocomplete-wrapper">
                                <input
                                  className={`form-input ${errors.address ? 'error' : ''}`}
                                  {...getInputProps({
                                    placeholder: "Enter your address...",
                                  })}
                                />
                                {suggestions.length > 0 && (
                                  <div className="autocomplete-dropdown">
                                    {suggestions.map((suggestion) => (
                                      <div
                                        className="autocomplete-item"
                                        {...getSuggestionItemProps(suggestion)}
                                        key={suggestion.placeId}
                                      >
                                        {suggestion.description}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </PlacesAutocomplete>
                        ) : (
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Loading address autocomplete..."
                            disabled
                          />
                        )}
                        {errors.address && <span className="form-error">{errors.address}</span>}
                      </div>

                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Country *</label>
                          <input
                            type="text"
                            className={`form-input ${errors.country ? 'error' : ''}`}
                            value={selectedLocation.country}
                            onChange={(e) => handleLocationChange("country", e.target.value)}
                            onBlur={() =>
                              setErrors((prev) => ({
                                ...prev,
                                country: validateField("country", selectedLocation.country),
                              }))
                            }
                          />
                          {errors.country && <span className="form-error">{errors.country}</span>}
                        </div>

                        <div className="form-group">
                          <label className="form-label">City *</label>
                          <input
                            type="text"
                            className={`form-input ${errors.city ? 'error' : ''}`}
                            value={selectedLocation.city}
                            onChange={(e) => handleLocationChange("city", e.target.value)}
                            onBlur={() =>
                              setErrors((prev) => ({
                                ...prev,
                                city: validateField("city", selectedLocation.city),
                              }))
                            }
                          />
                          {errors.city && <span className="form-error">{errors.city}</span>}
                        </div>

                        <div className="form-group full-width">
                          <label className="form-label">Postal Code *</label>
                          <input
                            type="text"
                            className={`form-input ${errors.pincode ? 'error' : ''}`}
                            value={selectedLocation.pincode}
                            onChange={(e) => handleLocationChange("pincode", e.target.value)}
                            onBlur={() =>
                              setErrors((prev) => ({
                                ...prev,
                                pincode: validateField("pincode", selectedLocation.pincode),
                              }))
                            }
                          />
                          {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                        </div>
                      </div>

                      <div className="terms-section">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={isTermsAccepted}
                            onChange={(e) => {
                              setIsTermsAccepted(e.target.checked);
                              setErrors((prev) => ({
                                ...prev,
                                terms: e.target.checked ? "" : "You must agree to the terms",
                              }));
                            }}
                          />
                          <span className="checkbox-text">
                            I agree to the{" "}
                            <a href="/termsconditions" target="_blank" rel="noopener noreferrer">
                              terms and conditions
                            </a>{" "}
                            and{" "}
                            <a href="#" onClick={(e) => { e.preventDefault(); handleShowModal(); }}>
                              agreement
                            </a>
                          </span>
                        </label>
                        {errors.terms && <span className="form-error">{errors.terms}</span>}
                      </div>

                      <div className="form-actions">
                        <button className="btn-cancel" onClick={() => history.back()}>
                          Cancel
                        </button>
                        <button
                          className="btn-submit"
                          onClick={handleSave}
                          disabled={checkingUsername}
                        >
                          {checkingUsername ? "Checking..." : "Proceed to Payment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Upfilly Agreement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <iframe
              src="/assets/img/AffiliateAgreemnet.pdf"
              style={{ width: "100%", height: "500px" }}
              frameBorder="0"
              title="Upfilly Agreement"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Layout>

      <style jsx>{`
        .billing-page {
          min-height: 100vh;
          background: #f8f9fc;
          padding: 40px 0 60px;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .billing-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .billing-logo {
          height: 40px;
          width: auto;
          cursor: pointer;
          margin-bottom: 24px;
        }

        .billing-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a1f36;
          margin: 0 0 12px;
        }

        .billing-subtitle {
          font-size: 16px;
          color: #6c757d;
          margin: 0;
        }

        /* Layout - Vertical Stack with flexible plans */
        .billing-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Plans Section */
        .plans-section {
          width: 100%;
        }

        .plans-container {
          width: 100%;
        }

        .plans-scroll-wrapper {
          overflow-x: auto;
          overflow-y: visible;
          padding-bottom: 16px;
          margin: -8px -8px 0 -8px;
          padding: 8px;
        }

        .plans-scroll-wrapper::-webkit-scrollbar {
          height: 6px;
        }

        .plans-scroll-wrapper::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .plans-scroll-wrapper::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .plans-flex-grid {
          display: flex;
          flex-wrap: nowrap;
          gap: 20px;
          min-width: min-content;
        }

        /* Plan Card - Fixed width for consistency */
        .plan-card {
          flex: 0 0 300px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .plan-card:hover {
          border-color: #4361ee;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(67, 97, 238, 0.12);
        }

        .plan-card.selected {
          border-color: #4361ee;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        }

        .plan-card.error {
          border-color: #dc2626;
        }

        .plan-card-header {
          margin-bottom: 16px;
        }

        .plan-radio {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .radio-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .radio-custom.checked {
          border-color: #4361ee;
        }

        .radio-dot {
          width: 10px;
          height: 10px;
          background: #4361ee;
          border-radius: 50%;
        }

        .plan-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1f36;
          margin: 0;
        }

        .plan-details {
          background: #f8f9fc;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          padding: 4px 0;
        }

        .detail-label {
          color: #6c757d;
        }

        .detail-value {
          color: #1a1f36;
          font-weight: 500;
        }

        .plan-features {
          margin-bottom: 16px;
          min-height: 100px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #374151;
          padding: 6px 0;
        }

        .feature-item svg {
          flex-shrink: 0;
          color: #10b981;
        }

        .feature-more {
          font-size: 11px;
          color: #6c757d;
          padding-top: 6px;
          font-style: italic;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .price-original {
          font-size: 13px;
          color: #9ca3af;
          text-decoration: line-through;
        }

        .price-current {
          font-size: 22px;
          font-weight: 700;
          color: #1a1f36;
        }

        .price-period {
          font-size: 12px;
          color: #6c757d;
        }

        /* Form Section */
        .form-section {
          width: 100%;
        }

        /* Form Card */
        .form-card {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .form-card:last-child {
          margin-bottom: 0;
        }

        .form-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          background: #fafbfc;
        }

        .form-card-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1f36;
          margin: 0 0 4px;
        }

        .form-card-header span {
          font-size: 13px;
          color: #6c757d;
        }

        .form-card-body {
          padding: 24px;
        }

        /* Form Elements */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          margin-bottom: 0;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          font-size: 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: #ffffff;
        }

        .form-input:focus {
          outline: none;
          border-color: #4361ee;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        .form-input.error {
          border-color: #dc2626;
        }

        .form-input:disabled {
          background: #f3f4f6;
          color: #6c757d;
        }

        .form-error {
          display: block;
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
        }

        .form-hint {
          display: block;
          font-size: 12px;
          margin-top: 4px;
        }

        .form-hint.success {
          color: #10b981;
        }

        .form-hint.error {
          color: #dc2626;
        }

        /* Password Wrapper */
        .password-wrapper {
          position: relative;
        }

        .password-wrapper .form-input {
          padding-right: 40px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 14px;
        }

        /* Autocomplete */
        .autocomplete-wrapper {
          position: relative;
        }

        .autocomplete-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 100;
          max-height: 200px;
          overflow-y: auto;
        }

        .autocomplete-item {
          padding: 10px 14px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .autocomplete-item:hover {
          background: #f3f4f6;
        }

        /* Terms Section */
        .terms-section {
          margin: 24px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .checkbox-text {
          font-size: 13px;
          color: #374151;
        }

        .checkbox-text a {
          color: #4361ee;
          text-decoration: none;
        }

        .checkbox-text a:hover {
          text-decoration: underline;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-submit {
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background: #4361ee;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: #3a56d4;
          transform: translateY(-1px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-ok {
          padding: 10px 32px;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background: #4361ee;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Error Message */
        .error-message {
          margin-top: 16px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 13px;
          text-align: center;
        }

        /* Responsive */
        @media (min-width: 1024px) {
          .plans-flex-grid {
            flex-wrap: wrap;
          }
          
          .plan-card {
            flex: 1 1 calc(33.333% - 20px);
            min-width: 280px;
          }
        }

        @media (max-width: 768px) {
          .billing-page {
            padding: 20px 0 40px;
          }

          .container {
            padding: 0 16px;
          }

          .billing-title {
            font-size: 24px;
          }

          .billing-subtitle {
            font-size: 14px;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-group.full-width {
            grid-column: span 1;
          }

          .form-card-header,
          .form-card-body {
            padding: 16px;
          }

          .plan-card {
            flex: 0 0 280px;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn-cancel,
          .btn-submit {
            width: 100%;
          }

          .checkbox-text {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .plan-card {
            flex: 0 0 260px;
          }
          
          .price-current {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}
// "use client";

// import react, { useEffect, useRef, useState } from "react";
// import "../style.scss";
// import Layout from "../../components/global/layout";
// import { useRouter } from "next/navigation";
// import ApiClient from "@/methods/api/apiClient";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
// import methodModel from "@/methods/methods";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import crendentialModel from "@/models/credential.model";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import loader from "@/methods/loader";
// import { toast } from "react-toastify";
// import { Label } from "reactstrap";
// import $ from "jquery";
// import datepipeModel from "@/models/datepipemodel";
// import {
//   CitySelect,
//   CountrySelect,
//   StateSelect,
// } from "react-country-state-city";
// import "react-country-state-city/dist/react-country-state-city.css";

// export default function addAffiliateAccount() {
//   const user = crendentialModel.getUser();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("account"); // 'account' or 'tax'
//   const [formData, setFormData] = useState({
//     billing_frequency: "",
//     payment_method: "",
//     tax_detail: "",
//     accountholder_name: "",
//     routing_number: "",
//     account_number: "",
//     ssn_number: "",
//     company_name: "",
//     dialCode: "+1",
//     mobileNo: "",
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [loaderr, setLoader] = useState();
//   const [imgLoder, setImgLoder] = useState();
//   const [image, setImage] = useState([]);
//   const [loadDocerr, setDocLoader] = useState();
//   const [docLoder, setDocLoder] = useState();
//   const [doc, setDoc] = useState([]);
//   const [dob, setDOB] = useState(null);
//   const [formatedDob, setFormatedDob] = useState();
//   const [frontDoc, setFrontDoc] = useState();
//   const [backDoc, setBackDoc] = useState();
//   const [address, setAddress] = useState("");
//   const [address2, setAddress2] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [stateAutocomplete, setStateAutocomplete] = useState(true);
//   const [inputFocused, setInputFocused] = useState(false);
//   const [form, setForm] = useState({
//     user_id: user?.id || user?._id,
//     social_security_number: "",
//     is_us_citizen: true,
//     signature_date: "",
//     country: null,
//     state: null,
//     city: null,
//     tax: "",
//   });
  
//   const currentDate = new Date().toISOString().split("T")[0];
//   const [sumitted, setSumitted] = useState(false);
//   const [taxDetailTabEnabled, setTaxDetailTabEnabled] = useState(false);
  
//   // Determine if user has completed account details
//   const hasAccountDetails = user?.account_id || (frontDoc && backDoc && address);
  
//   useEffect(() => {
//     // Enable tax tab if account details exist
//     if (hasAccountDetails) {
//       setTaxDetailTabEnabled(true);
//     }
//   }, [hasAccountDetails]);

//   const uploadSignatureImage = (e) => {
//     setForm({ ...form, baseImg: e.target.value });
//     let files = e.target.files;
//     let file = files.item(0);
//     setImgLoder(true);
//     setLoader(true);
//     ApiClient.postFormData("upload/image?modelName=users", {
//       file: file,
//       modelName: "users",
//     }).then((res) => {
//       if (res.data) {
//         let image = res?.data?.fullpath;
//         setForm({ ...form, signature: `images/users/${image}` });
//       }
//       setImgLoder(false);
//       setLoader(false);
//     });
//   };

//   const handleSubmit = (e) => {
//     if (!form?.tax_classification) {
//       setSumitted(true);
//       return;
//     }

//     if (form?.tax_classification == "business") {
//       if (!form?.signature_date || !form?.federal_text_classification) {
//         setSumitted(true);
//         return;
//       }
//     }

//     if (form?.tax_classification == "individual") {
//       if (
//         !form?.signature_date ||
//         !form?.tax_name ||
//         !form?.social_security_number
//       ) {
//         setSumitted(true);
//         return;
//       }
//     }
//     loader(true);

//     const payload = {
//       ...form,
//     };

//     delete payload?.baseImg;

//     if (payload?.tax_classification == "business") {
//       delete payload?.tax_name;
//       delete payload?.social_security_number;
//     }

//     if (payload?.tax_classification == "individual") {
//       delete payload?.federal_text_classification;
//     }

//     if (payload.id || payload?.user_id) {
//       ApiClient.put("edit/profile", payload).then((res) => {
//         if (res.success) {
//           toast.success("Tax Detail Updated Successfully ...");
//           router.push("/profile");
//         }
//         loader(false);
//       });
//     }

//     if (!payload.id) {
//       ApiClient.post("addTax", {...payload, user_id: user?.id || user?._id}).then((res) => {
//         if (res.success) {
//           let uUser = { ...user, tax_detail: { ...payload } };
//           crendentialModel.setUser(uUser);
//           toast.success("Tax Detail Added Successfully ...");
//           router.push("/profile");
//         }
//         loader(false);
//       });
//     }
//   };

//   const handleChange = (newAddress) => {
//     setAddress(newAddress);
//   };

//   const handleSelect = async (selectedAddress) => {
//     try {
//       const results = await geocodeByAddress(selectedAddress);
//       const latLng = await getLatLng(results[0]);

//       const addressComponents = results[0].address_components;
//       const city =
//         addressComponents.find((component) =>
//           component.types.includes("locality")
//         )?.long_name || "";
//       const state =
//         addressComponents.find((component) =>
//           component.types.includes("administrative_area_level_1")
//         )?.long_name || "";
//       const country =
//         addressComponents.find((component) =>
//           component.types.includes("country")
//         )?.long_name || "";
//       const pincode =
//         addressComponents.find((component) =>
//           component.types.includes("postal_code")
//         )?.long_name || "";

//       const selectedLocation = {
//         address: selectedAddress,
//         city,
//         state,
//         country,
//         pincode,
//         ...latLng,
//       };

//       setSelectedLocation(selectedLocation);
//       setAddress(selectedAddress);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const eighteenYearsAgo = new Date();
//   eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name === "routing_number" && value.length > 9) {
//       return;
//     }

//     if (name === "account_number" && value.length > 12) {
//       return;
//     }

//     if (name === "ssn_number" && value.length > 9) {
//       return;
//     }

//     if (name === "mobileNo" && value.length > 11) {
//       return;
//     }

//     const fieldValue = type === "checkbox" ? checked : value;
//     setFormData({ ...formData, [name]: fieldValue });
//   };

//   const handleDateChange = (date) => {
//     if (date instanceof Date && !isNaN(date)) {
//       const day = date.getDate();
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       const formattedDOB = { day, month, year };

//       setDOB(date);
//       setFormatedDob(formattedDOB);
//     }
//   };

//   const uploadImage = async (e, key) => {
//     let files = e.target.files;
//     let i = 0;
//     let imgfile = [];
//     for (let item of files) {
//       imgfile.push(item);
//     }

//     setLoader(true);
//     for await (let item of imgfile) {
//       let file = files.item(i);
//       let url = "upload/front/image";

//       const res = await ApiClient.postFormData(url, { file: file });
//       if (res.success) {
//         let path = res?.imagePath;
//         let name = res?.filename;
//         if (image?.length <= 10) {
//           image?.push({
//             name: `${name}`,
//             url: `frontdoc/${path}`,
//           });
//         }
//         const data = await ApiClient.postFormData("verify/images", {
//           image: path,
//           path: res?.fullPath,
//         });
//         if (data.success) {
//           setFrontDoc(data?.data?.id);
//           setLoader(false);
//           setImgLoder(false);
//         } else {
//           setLoader(false);
//           setImgLoder(false);
//         }
//       }
//       i++;
//     }
//     setLoader(false);
//     setImgLoder(false);
//   };

//   const uploadDocument = async (e, key) => {
//     let files = e.target.files;
//     let i = 0;
//     let imgfile = [];
//     for (let item of files) {
//       imgfile.push(item);
//     }

//     setDocLoader(true);
//     for await (let item of imgfile) {
//       let file = files.item(i);
//       let url = "upload/back/image";

//       const res = await ApiClient.postFormData(url, { file: file });
//       if (res.success) {
//         let path = res?.imagePath;
//         let name = res?.filename;
//         doc?.push({
//           name: `backdoc/${name}`,
//           url: `backdoc/${path}`,
//         });
//         const data = await ApiClient.postFormData("verify/images", {
//           image: path,
//           path: res?.fullPath,
//         });
//         if (data.success) {
//           setBackDoc(data?.data?.id);
//           setLoader(false);
//           setImgLoder(false);
//         } else {
//           setLoader(false);
//           setImgLoder(false);
//         }
//       }
//       i++;
//     }
//     setDocLoader(false);
//     setDocLoder(false);
//   };

//   const remove = (index) => {
//     const filteredImages = image.filter((data, indx) => index !== indx);
//     setImage(filteredImages);
//     if (filteredImages.length === 0) {
//       setFrontDoc(null);
//     }
//   };

//   const removeDocument = (index) => {
//     const filteredImages = doc.filter((data, indx) => index !== indx);
//     setDoc(filteredImages);
//     if (filteredImages.length === 0) {
//       setBackDoc(null);
//     }
//   };

//   const gallaryData = () => {
//     loader(true);
//     ApiClient.get(`user/detail`, { id: user?.id || user?._id }).then((res) => {
//       if (res.success) {
//         let value = res?.data?.tax_detail;
//         if (!res?.data?.tax_detail?.tax_name) {
//           setForm({
//             tax_name: value?.tax_name,
//             tax_classification: value?.tax_classification,
//             social_security_number: value?.social_security_number,
//             federal_text_classification: value?.federal_text_classification,
//             is_us_citizen: value?.is_us_citizen,
//             consent_agreed: value?.consent_agreed,
//             signature: value?.signature,
//             ein: value?.ein,
//             trade_name: value?.trade_name,
//             signature_date: value?.signature_date?.split("T")[0],
//             country: value?.country,
//             state: value?.state,
//             city: value?.city,
//             tax: value?.tax,
//           });
//         } else {
//           setForm({
//             id: user?.id || user?._id,
//             tax_name: value?.tax_name,
//             tax_classification: value?.tax_classification,
//             social_security_number: value?.social_security_number,
//             federal_text_classification: value?.federal_text_classification,
//             is_us_citizen: value?.is_us_citizen,
//             consent_agreed: value?.consent_agreed,
//             signature: value?.signature,
//             ein: value?.ein,
//             trade_name: value?.trade_name,
//             signature_date: value?.signature_date?.split("T")[0],
//             country: value?.country,
//             state: value?.state,
//             city: value?.city,
//             tax: value?.tax,
//           });
//         }
//       }
//       loader(false);
//     });
//   };

//   useEffect(() => {
//     gallaryData();
//   }, []);

//   const handleSaveAccount = () => {
//     if (
//       !formData?.mobileNo ||
//       !formData?.account_number ||
//       !formData?.company_name ||
//       !frontDoc ||
//       !backDoc ||
//       formData?.ssn_number?.length < 9 ||
//       formData?.routing_number?.length < 9 ||
//       !formData?.accountholder_name ||
//       formData?.account_number?.length < 12 ||
//       !dob ||
//       formData?.mobileNo?.length < 10
//     ) {
//       setSubmitted(true);
//       return;
//     }

//     if (
//       !address ||
//       !selectedLocation?.pincode ||
//       !selectedLocation?.city ||
//       !selectedLocation?.state
//     ) {
//       setSubmitted(true);
//       return;
//     }
//     loader(true);
//     const mobileData = `${formData?.dialCode}${formData?.mobileNo}`;
//     const data1 = {
//       email: user?.email,
//       accountholder_name: formData.accountholder_name,
//       routing_number: formData.routing_number,
//       account_number: formData.account_number,
//       first_name: user?.firstName,
//       last_name: user?.lastName,
//       mobile: mobileData,
//       ssn_number: formData.ssn_number,
//       address: {
//         line1: selectedLocation?.address,
//         city: selectedLocation?.city,
//         state: selectedLocation?.state,
//         postal_code: selectedLocation?.pincode,
//       },
//       dob: formatedDob,
//       company_name: formData?.company_name,
//       frontdoc: frontDoc,
//       backdoc: backDoc,
//       user_id: user?.id,
//     };
//     ApiClient.post("bank", data1).then((res) => {
//       if (res.success == true) {
//         const data1 = {
//           id: user?.id,
//           accountholder_name: formData?.accountholder_name,
//           routing_number: formData?.routing_number,
//           account_number: formData?.account_number,
//           ssn_number: formData?.ssn_number,
//           company_name: formData?.company_name,
//         };

//         ApiClient.put("edit/profile", data1).then((res) => {
//           if (res.success) {
//             let uUser = { ...user, ...data1 };
//             crendentialModel.setUser(uUser);
//             toast.success("Account Added Successfully ...");
//             setTaxDetailTabEnabled(true);
//             setActiveTab("tax"); // Switch to tax tab after saving account
//           }
//           loader(false);
//         });
//       }
//       loader(false);
//     });
//   };

//   const handleGoBack = () => {
//     router.back();
//   };

//   const dateInputRef = useRef(null);

//   const handleClick = () => {
//     if (dateInputRef.current && !dateInputRef.current.disabled) {
//       dateInputRef.current.showPicker();
//     }
//   };

//   const switchToTaxTab = () => {
//     if (taxDetailTabEnabled) {
//       setActiveTab("tax");
//     }
//   };

//   const switchToAccountTab = () => {
//     setActiveTab("account");
//   };

//   return (
//     <>
//       <Layout
//         handleKeyPress={undefined}
//         setFilter={undefined}
//         reset={undefined}
//         filter={undefined}
//         name={"Add Account"}
//         filters={undefined}
//       >
//         <div className="main-affiliate mt-3 mb-5 pt-0">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 {/* Fixed Tab Navigation */}
//                 <ul className="nav accout_details nav-pills mb-3" id="pills-tab" role="tablist">
//                   <li className="nav-item" role="presentation">
//                     <button 
//                       className={`nav-link nb_link ${activeTab === 'account' ? 'active' : ''}`} 
//                       id="account_details" 
//                       onClick={switchToAccountTab}
//                       type="button" 
//                       role="tab" 
//                       aria-controls="pills-home" 
//                       aria-selected={activeTab === 'account'}
//                     >
//                       Account Detail
//                     </button>
//                   </li>
//                   <li className="nav-item" role="presentation">
//                     <button 
//                       className={`nav-link nb_link ${activeTab === 'tax' ? 'active' : ''} ${!taxDetailTabEnabled ? 'disabled' : ''}`} 
//                       id="text_details" 
//                       onClick={switchToTaxTab}
//                       type="button" 
//                       role="tab" 
//                       aria-controls="pills-profile" 
//                       aria-selected={activeTab === 'tax'}
//                       disabled={!taxDetailTabEnabled}
//                     >
//                       Tax Detail
//                     </button>  
//                   </li>
//                 </ul>
                
//                 <div className="tab-content" id="pills-tabContent">
//                   {/* Account Details Tab */}
//                   <div
//                     className={`tab-pane fade ${activeTab === 'account' ? 'show active' : ''}`}
//                     id="pills-home"
//                     role="tabpanel"
//                     aria-labelledby="account_details"
//                     tabIndex="0"
//                   >
//                     <div className="card">
//                       <div className="card-body account_body ">
//                         <div className="row">
//                           <div className="col-12 col-md-12 ">
//                             <div className="dtls_head">
//                               <h3>Account Detail </h3>
//                             </div>
//                             <div className="row">
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <p className="mb-0">
//                                     <label className="label-set account_set ">
//                                       Account Holder Name
//                                       <span className="star">*</span>{" "}
//                                     </label>
//                                   </p>
//                                   <input
//                                     value={formData?.accountholder_name}
//                                     onChange={handleInputChange}
//                                     name="accountholder_name"
//                                     type="text"
//                                     className="form-control "
//                                     placeholder="Enter Account Holder Name"
//                                   />
//                                   {submitted &&
//                                   !formData?.accountholder_name ? (
//                                     <div className="invalid-feedback d-block">
//                                       Account Holder Name is Required
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <p className="mb-0">
//                                     <label className="label-set account_set ">
//                                       Company Name
//                                       <span className="star">*</span>{" "}
//                                     </label>
//                                   </p>
//                                   <input
//                                     value={formData?.company_name}
//                                     onChange={handleInputChange}
//                                     name="company_name"
//                                     type="text"
//                                     className="form-control "
//                                     placeholder="Enter Company Name"
//                                   />
//                                   {submitted && !formData?.company_name ? (
//                                     <div className="invalid-feedback d-block">
//                                       Company Name is Required
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <p className="mb-0">
//                                     <label className="label-set account_set ">
//                                       Account Number
//                                       <span className="star">*</span>
//                                     </label>
//                                   </p>
//                                   <input
//                                     value={formData?.account_number}
//                                     onChange={handleInputChange}
//                                     name="account_number"
//                                     type="number"
//                                     className="form-control "
//                                     placeholder="Enter Account Number"
//                                   />
//                                   {submitted &&
//                                   formData?.account_number?.length < 12 ? (
//                                     <div className="invalid-feedback d-block">
//                                       Account Number must be 12 digits
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <p className="mb-0">
//                                     <label className="label-set account_set ">
//                                       Routing Number
//                                       <span className="star">*</span>{" "}
//                                     </label>
//                                   </p>
//                                   <input
//                                     value={formData?.routing_number}
//                                     onChange={handleInputChange}
//                                     name="routing_number"
//                                     type="number"
//                                     className="form-control "
//                                     placeholder="Enter Routing Number"
//                                   />
//                                   {submitted &&
//                                   formData?.routing_number?.length < 9 ? (
//                                     <div className="invalid-feedback d-block">
//                                       Routing Number must be 9 digits
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <p className="mb-0">
//                                     <label className="label-set account_set ">
//                                       SSN Number<span className="star">*</span>{" "}
//                                     </label>
//                                   </p>
//                                   <input
//                                     value={formData?.ssn_number}
//                                     onChange={handleInputChange}
//                                     name="ssn_number"
//                                     type="number"
//                                     className="form-control "
//                                     placeholder="Enter SSN Number"
//                                   />
//                                   {submitted &&
//                                   formData?.ssn_number?.length < 9 ? (
//                                     <div className="invalid-feedback d-block">
//                                       SSN Number must be 9 digits
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     Mobile Number<span className="star">*</span>
//                                   </label>
//                                   <div className="phoneInput main-no">
//                                     <div className="dailCode phn-code">
//                                       <PhoneInput
//                                         international
//                                         country={"us"}
//                                         inputProps={{
//                                           disabled: true,
//                                         }}
//                                         value={formData?.dialCode}
//                                         className="input_number bg_none disable_white"
//                                         onChange={(phone) =>
//                                           setFormData({
//                                             ...formData,
//                                             dialCode: phone,
//                                           })
//                                         }
//                                         readOnly={true}
//                                         placeholder="+1"
//                                         enableSearch
//                                       />
//                                     </div>
//                                     <input
//                                       type="number"
//                                       className="form-control overlap_mobile"
//                                       id="exampleFormControlInput1"
//                                       name="mobileNo"
//                                       value={formData?.mobileNo}
//                                       autoComplete="off"
//                                       onChange={handleInputChange}
//                                       placeholder="Enter a valid number"
//                                       required
//                                     />
//                                   </div>
//                                   {submitted &&
//                                   formData?.mobileNo?.length < 10 ? (
//                                     <div className="invalid-feedback d-block">
//                                       Mobile Number must be 10 digits
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group rect-cust-width">
//                                   <label className="label-set account_set ">
//                                     Date of Birth:
//                                     <span className="star">*</span>
//                                   </label>
//                                   <div>
//                                     <DatePicker
//                                       className="form-control w-100"
//                                       selected={dob}
//                                       onChange={handleDateChange}
//                                       peekNextMonth
//                                       showMonthDropdown
//                                       showYearDropdown
//                                       dropdownMode="select"
//                                       placeholderText="Select Date of Birth"
//                                       maxDate={eighteenYearsAgo}
//                                     />
//                                     {submitted && !dob ? (
//                                       <div className="invalid-feedback d-block">
//                                         DOB is Required
//                                       </div>
//                                     ) : (
//                                       <></>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="col-12 col-md-4">
//                                 <label className="label-set account_set ">
//                                   Front Doc{" "}
//                                   <span className="text-sm">(only image)</span>
//                                   <span className="star">*</span>
//                                 </label>
//                                 <div className="form-group drag_drop mb-0">
//                                   <div className="upload_file set_upload_bx">
//                                     {!loaderr &&
//                                     !imgLoder &&
//                                     image.length == 0 ? (
//                                       <>
//                                         <label className="label_btns_file pointer">
//                                           <input
//                                             type="file"
//                                             className="d-none pointer"
//                                             accept="images/*"
//                                             multiple={false}
//                                             onChange={(e) => {
//                                               setImgLoder(true);
//                                               uploadImage(e, "images");
//                                             }}
//                                           />
//                                           <div className="d-flex justify-content-center flex-column">
//                                             <i className="fa fa-plus"></i>
//                                             Upload Image
//                                           </div>
//                                         </label>
//                                       </>
//                                     ) : (
//                                       <></>
//                                     )}
//                                     {submitted && !frontDoc ? (
//                                       <div className="invalid-feedback d-block">
//                                         Front doc is Required
//                                       </div>
//                                     ) : (
//                                       <></>
//                                     )}
//                                     {loaderr && imgLoder ? (
//                                       <div className="text-success text-center mt-2 top_loading">
//                                         Uploading...{" "}
//                                         <i className="fa fa-spinner fa-spin"></i>
//                                       </div>
//                                     ) : (
//                                       <></>
//                                     )}
//                                     <div className="imagesRow img-wrappper">
//                                       {image &&
//                                         image?.map((itm, i) => {
//                                           return (
//                                             <div
//                                               className="imagethumbWrapper"
//                                               key={i}
//                                             >
//                                               <img
//                                                 src={
//                                                   itm?.url?.length > 0
//                                                     ? methodModel.noImg(
//                                                         itm?.url,
//                                                       )
//                                                     : ""
//                                                 }
//                                                 alt={itm.name}
//                                                 className="thumbnail"
//                                               />
//                                               <i
//                                                 className="fa fa-times kliil"
//                                                 title="Remove"
//                                                 onClick={(e) => remove(i)}
//                                               ></i>
//                                             </div>
//                                           );
//                                         })}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="col-12 col-md-4">
//                                 <label className="label-set account_set ">
//                                   Back Doc{" "}
//                                   <span className="text-sm">(only image)</span>
//                                   <span className="star">*</span>
//                                 </label>
//                                 <div className="form-group drag_drop">
//                                   <div className="upload_file set_upload_bx">
//                                     {!loadDocerr &&
//                                       !docLoder &&
//                                       doc.length == 0 && (
//                                         <>
//                                           <label className="label_btns_file pointer">
//                                             <input
//                                               type="file"
//                                               className="form-control-file over_input"
//                                               accept="images/*"
//                                               multiple={false}
//                                               onChange={(e) => {
//                                                 setDocLoder(true);
//                                                 uploadDocument(e, "images");
//                                               }}
//                                             />
//                                             <div className="d-flex justify-content-center flex-column">
//                                               <i className="fa fa-plus"></i>
//                                               Upload Image
//                                             </div>
//                                           </label>
//                                         </>
//                                       )}
//                                     {submitted && !backDoc ? (
//                                       <div className="invalid-feedback d-block">
//                                         Back doc is Required
//                                       </div>
//                                     ) : (
//                                       <></>
//                                     )}
//                                     {loadDocerr && docLoder ? (
//                                       <div className="text-success text-center mt-2 top_loading">
//                                         Uploading...{" "}
//                                         <i className="fa fa-spinner fa-spin"></i>
//                                       </div>
//                                     ) : (
//                                       <></>
//                                     )}
//                                     <div className="imagesRow img-wrappper">
//                                       {doc &&
//                                         doc?.map((itm, i) => {
//                                           return (
//                                             <div
//                                               className="imagethumbWrapper"
//                                               key={i}
//                                             >
//                                               <img
//                                                 src={
//                                                   itm?.url?.length > 0
//                                                     ? methodModel.noImg(
//                                                         itm?.url,
//                                                       )
//                                                     : ""
//                                                 }
//                                                 alt={itm.name}
//                                                 className="thumbnail"
//                                               />
//                                               <i
//                                                 className="fa fa-times kliil"
//                                                 title="Remove"
//                                                 onClick={(e) =>
//                                                   removeDocument(i)
//                                                 }
//                                               ></i>
//                                             </div>
//                                           );
//                                         })}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="col-12 col-md-12 ">
//                             <div className="dtls_head">
//                               <h3>Address Detail</h3>
//                             </div>

//                             <div className="row">
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     Address1<span className="star">*</span>
//                                   </label>
//                                   {!stateAutocomplete && (
//                                     <PlacesAutocomplete
//                                       value={address}
//                                       onChange={handleChange}
//                                       onSelect={handleSelect}
//                                     >
//                                       {({
//                                         getInputProps,
//                                         suggestions,
//                                         getSuggestionItemProps,
//                                         loading,
//                                       }) => (
//                                         <div>
//                                           <input
//                                             className="form-control "
//                                             {...getInputProps({
//                                               placeholder:
//                                                 "Enter an address...",
//                                               onFocus: () =>
//                                                 setInputFocused(true),
//                                               onBlur: () =>
//                                                 setInputFocused(false),
//                                             })}
//                                           />

//                                           {loading && <div>Loading...</div>}

//                                           {suggestions?.map((suggestion) => {
//                                             const style = {
//                                               backgroundColor: suggestion.active
//                                                 ? "#41b6e6"
//                                                 : "#fff",
//                                             };

//                                             return (
//                                               <div key={suggestion.placeId}>
//                                                 <div
//                                                   className="location_address"
//                                                   {...getSuggestionItemProps(
//                                                     suggestion,
//                                                     {
//                                                       style,
//                                                     },
//                                                   )}
//                                                 >
//                                                   <i className="fa-solid fa-location-dot mr-1"></i>
//                                                   {suggestion.description}
//                                                 </div>
//                                               </div>
//                                             );
//                                           })}
//                                         </div>
//                                       )}
//                                     </PlacesAutocomplete>
//                                   )}
//                                   {submitted && !address ? (
//                                     <div className="invalid-feedback d-block">
//                                       Address is Required
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     Address2{" "}
//                                   </label>
//                                   <input
//                                     type="text"
//                                     className="form-control "
//                                     placeholder="Enter Your Address"
//                                     value={address2}
//                                     onChange={(e) =>
//                                       setAddress2(e.target.value)
//                                     }
//                                     id="exampleFormControlInput1"
//                                   />
//                                 </div>
//                               </div>

//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     Country<span className="star">*</span>{" "}
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={selectedLocation?.country}
//                                     className="form-control "
//                                     id="exampleFormControlInput1"
//                                     disabled
//                                   />
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     State<span className="star">*</span>{" "}
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={selectedLocation?.state}
//                                     placeholder="Enter Your State"
//                                     onChange={(e) =>
//                                       setSelectedLocation({
//                                         ...selectedLocation,
//                                         state: e.target.value,
//                                       })
//                                     }
//                                     className="form-control "
//                                     id="exampleFormControlInput1"
//                                   />
//                                   {submitted && !selectedLocation?.state ? (
//                                     <div className="invalid-feedback d-block">
//                                       State is Required
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     City<span className="star">*</span>{" "}
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={selectedLocation?.city}
//                                     placeholder="Enter Your City"
//                                     onChange={(e) =>
//                                       setSelectedLocation({
//                                         ...selectedLocation,
//                                         city: e.target.value,
//                                       })
//                                     }
//                                     className="form-control "
//                                     id="exampleFormControlInput1"
//                                   />
//                                   {submitted && !selectedLocation?.city ? (
//                                     <div className="invalid-feedback d-block">
//                                       City is Required
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="col-12 col-md-4">
//                                 <div className="form-group">
//                                   <label className="label-set account_set ">
//                                     Postal Code<span className="star">*</span>{" "}
//                                   </label>
//                                   <input
//                                     type="text"
//                                     value={selectedLocation?.pincode}
//                                     placeholder="Enter Your Postal Code "
//                                     onChange={(e) =>
//                                       setSelectedLocation({
//                                         ...selectedLocation,
//                                         pincode: e.target.value,
//                                       })
//                                     }
//                                     className="form-control "
//                                     id="exampleFormControlInput1"
//                                   />
//                                   {submitted && !selectedLocation?.pincode ? (
//                                     <div className="invalid-feedback d-block">
//                                       Pincode is Required
//                                     </div>
//                                   ) : (
//                                     <></>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className='d-flex justify-content-end '>
//                           <button className='back-btns' onClick={handleGoBack}>Back</button>
//                           <button className='btn btn-primary login ml-3' onClick={handleSaveAccount}>Save & Continue</button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Tax Details Tab */}
//                   <div
//                     className={`tab-pane fade ${activeTab === 'tax' ? 'show active' : ''}`}
//                     id="pills-profile"
//                     role="tabpanel"
//                     aria-labelledby="text_details"
//                     tabIndex="0"
//                   >
//                     <div className="tx_detailsbx ">
//                       <div className="dtls_head">
//                         <h3>Tax Detail </h3>
//                       </div>

//                       <div className="form_page b-none">
//                         <div className="container">
//                           <div className="row">
//                             <div className="col-md-6">
//                               <div className="mb-4">
//                                 <label className="form-label certif_inst ">
//                                   Are you a U.S. citizen, U.S. permanent
//                                   resident (green card holder){" "}
//                                   <i
//                                     className="fa fa-info-circle"
//                                     aria-hidden="true"
//                                   ></i>
//                                 </label>
//                                 <div className="position-relative selectYes custom-dropdown">
//                                   <select
//                                     className="form-control"
//                                     id="exampleFormControlSelect1"
//                                     value={form?.is_us_citizen}
//                                     onChange={(e) =>
//                                       setForm({
//                                         ...form,
//                                         is_us_citizen: e.target.value === "true",
//                                       })
//                                     }
//                                     required
//                                   >
//                                     <option value={true}>Yes</option>
//                                     <option value={false}>No</option>
//                                   </select>
//                                   <i
//                                     className="fa fa-sort-desc down_arrow"
//                                     aria-hidden="true"
//                                   ></i>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="col-md-6">
//                               <div className="mb-4">
//                                 <label className="form-label certif_inst">
//                                   What is your tax classification?{" "}
//                                 </label>
//                                 <div className="row">
//                                   <div className="col-6">
//                                     <div className="form-check">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         checked={
//                                           form?.tax_classification ===
//                                           "individual"
//                                         }
//                                         name="taxClassification"
//                                         id="flexRadioDefault1"
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             tax_classification: "individual",
//                                             federal_text_classification: "",
//                                             social_security_number: "",
//                                             trade_name: "",
//                                           })
//                                         }
//                                       />
//                                       <label
//                                         className="form-check-label"
//                                         htmlFor="flexRadioDefault1"
//                                       >
//                                         {" "}
//                                         Individual
//                                       </label>
//                                     </div>
//                                   </div>
//                                   <div className="col-6">
//                                     <div className="form-check">
//                                       <input
//                                         className="form-check-input"
//                                         type="radio"
//                                         name="taxClassification"
//                                         id="flexRadioDefault2"
//                                         checked={
//                                           form?.tax_classification ===
//                                           "business"
//                                         }
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             tax_classification: "business",
//                                             tax_name: "",
//                                             ein: "",
//                                           })
//                                         }
//                                       />
//                                       <label
//                                         className="form-check-label"
//                                         htmlFor="flexRadioDefault2"
//                                       >
//                                         {" "}
//                                         Business
//                                       </label>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               {sumitted && !form?.tax_classification && (
//                                 <p className="text-danger">
//                                   This field is required
//                                 </p>
//                               )}
//                             </div>

//                             <div className="row">
//                               <div className="col-md-4">
//                                 <CountrySelect
//                                   defaultValue={form.country}
//                                   onChange={(country) =>
//                                     setForm({
//                                       ...form,
//                                       country,
//                                       state: null,
//                                       city: null,
//                                     })
//                                   }
//                                   placeHolder="Select Country"
//                                   inputClassName="form-control custom-field"
//                                 />
//                               </div>

//                               <div className="col-md-4">
//                                 <StateSelect
//                                   countryid={form?.country?.id}
//                                   defaultValue={form.state}
//                                   onChange={(state) =>
//                                     setForm({
//                                       ...form,
//                                       state,
//                                       city: null,
//                                     })
//                                   }
//                                   placeHolder="Select State"
//                                   inputClassName="form-control custom-field"
//                                   noOptionsMessage={() => "No states available"}
//                                 />
//                               </div>

//                               <div className="col-md-4">
//                                 <CitySelect
//                                   countryid={form?.country?.id}
//                                   stateid={form?.state?.id}
//                                   defaultValue={form.city}
//                                   onChange={(city) =>
//                                     setForm({
//                                       ...form,
//                                       city,
//                                     })
//                                   }
//                                   placeHolder="Select City"
//                                   inputClassName="form-control custom-field"
//                                   noOptionsMessage={() => "No cities available"}
//                                 />
//                               </div>
//                             </div>

//                             <div className="col-md-12">
//                               {form?.tax_classification === "business" && (
//                                 <div className="mb-4">
//                                   <label className="form-label certif_inst ">
//                                     Check appropriate box for federal tax
//                                     classification of the person whose name is
//                                     entered on line
//                                   </label>

//                                   <div className="checkbox_publish mt-2">
//                                     <label className="certif_inst">
//                                       {" "}
//                                       1. Check only one of the following seven
//                                       boxes.{" "}
//                                     </label>

//                                     <div className="form-check">
//                                       <input
//                                         type="checkbox"
//                                         className="form-check-input mr-2"
//                                         checked={
//                                           form?.federal_text_classification ===
//                                           "individual"
//                                         }
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             federal_text_classification:
//                                               e.target.checked ? "individual" : "",
//                                           })
//                                         }
//                                       />
//                                       <label className="form-check-label">
//                                         Individual/sole proprietor or
//                                         single-member LLC
//                                       </label>
//                                     </div>
//                                     <div className="form-check">
//                                       <input
//                                         type="checkbox"
//                                         className="form-check-input mr-2"
//                                         checked={
//                                           form?.federal_text_classification ===
//                                           "c_corporation"
//                                         }
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             federal_text_classification:
//                                               e.target.checked ? "c_corporation" : "",
//                                           })
//                                         }
//                                       />
//                                       <label className="form-check-label">
//                                         C Corporation
//                                       </label>
//                                     </div>
//                                     <div className="form-check">
//                                       <input
//                                         type="checkbox"
//                                         className="form-check-input mr-2"
//                                         checked={
//                                           form?.federal_text_classification ===
//                                           "s_corporation"
//                                         }
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             federal_text_classification:
//                                               e.target.checked ? "s_corporation" : "",
//                                           })
//                                         }
//                                       />
//                                       <label className="form-check-label">
//                                         S Corporation
//                                       </label>
//                                     </div>
//                                     <div className="form-check">
//                                       <input
//                                         type="checkbox"
//                                         className="form-check-input mr-2"
//                                         checked={
//                                           form?.federal_text_classification ===
//                                           "partnership"
//                                         }
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             federal_text_classification:
//                                               e.target.checked ? "partnership" : "",
//                                           })
//                                         }
//                                       />
//                                       <label className="form-check-label">
//                                         Partnership
//                                       </label>
//                                     </div>
//                                     <div className="form-check">
//                                       <input
//                                         type="checkbox"
//                                         className="form-check-input mr-2"
//                                         checked={
//                                           form?.federal_text_classification ===
//                                           "limited_liability"
//                                         }
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             federal_text_classification:
//                                               e.target.checked ? "limited_liability" : "",
//                                           })
//                                         }
//                                       />
//                                       <label className="form-check-label">
//                                         Limited liability company. Enter the tax
//                                         classification (C=C Corporation, S=S
//                                         Corporation, P Partnership)
//                                       </label>
//                                     </div>

//                                     {sumitted &&
//                                       !form?.federal_text_classification && (
//                                         <p className="text-danger">
//                                           This field is required
//                                         </p>
//                                       )}
//                                   </div>
//                                 </div>
//                               )}

//                               <div className="mb-4">
//                                 <label className="form-label certif_inst ">
//                                   Tax Identity Information{" "}
//                                 </label>

//                                 <div className="row gy-2">
//                                   {form?.tax_classification ===
//                                     "individual" && (
//                                     <div className="col-md-6 custom-input">
//                                       <input
//                                         type="text"
//                                         className="form-control"
//                                         id="exampleFormControlInputss"
//                                         placeholder="Name"
//                                         value={form?.tax_name}
//                                         onChange={(e) =>
//                                           setForm({
//                                             ...form,
//                                             tax_name: e.target.value,
//                                           })
//                                         }
//                                         required
//                                       />
//                                       {sumitted && !form?.tax_name && (
//                                         <p className="text-danger">
//                                           This field is required
//                                         </p>
//                                       )}
//                                     </div>
//                                   )}

//                                   {form?.tax_classification === "business" && (
//                                     <>
//                                       <div className="col-md-6 custom-input">
//                                         <input
//                                           type="text"
//                                           className="form-control"
//                                           id="exampleFormControlInput1"
//                                           placeholder="Doing business as “DBA” or trade name (optional)"
//                                           value={form?.trade_name}
//                                           onChange={(e) =>
//                                             setForm({
//                                               ...form,
//                                               trade_name: e.target.value,
//                                             })
//                                           }
//                                         />
//                                       </div>

//                                       <div className="col-md-6 custom-input">
//                                         <input
//                                           type="text"
//                                           className="form-control phone_IN"
//                                           id="exampleFormControlInput1"
//                                           maxLength={10}
//                                           onKeyUp={function (e) {
//                                             var value = e.target.value;
//                                             if (e.key.match(/[0-9]/) == null) {
//                                               value = value.replace(e.key, "");
//                                               setForm({
//                                                 ...form,
//                                                 ein: value,
//                                               });
//                                               return;
//                                             }

//                                             if (value.length === 2) {
//                                               setForm({
//                                                 ...form,
//                                                 ein: value + "-",
//                                               });
//                                             } else {
//                                               setForm({
//                                                 ...form,
//                                                 ein: value,
//                                               });
//                                             }
//                                           }}
//                                           placeholder="EIN (format: XX-XXXXXXX)"
//                                           value={form?.ein}
//                                           onChange={(e) =>
//                                             setForm({
//                                               ...form,
//                                               ein: e.target.value,
//                                             })
//                                           }
//                                           required
//                                         />
//                                         {sumitted && !form?.ein && (
//                                           <p className="text-danger">
//                                             This field is required
//                                           </p>
//                                         )}
//                                       </div>
//                                     </>
//                                   )}

//                                   {form?.tax_classification ===
//                                     "individual" && (
//                                     <div className="col-md-6 custom-input">
//                                       <input
//                                         type="text"
//                                         className="form-control phone_us"
//                                         id="exampleFormControlInput1"
//                                         placeholder="Social Security Number (format: XXX-XX-XXXX)"
//                                         maxLength="11"
//                                         onKeyUp={function (e) {
//                                           var value = e.target.value.replace(/-/g, "");
//                                           if (e.key.match(/[0-9]/) == null) {
//                                             value = value.replace(e.key, "");
//                                           }

//                                           if (value.length > 3 && value.length <= 5) {
//                                             value = value.slice(0, 3) + "-" + value.slice(3);
//                                           } else if (value.length > 5) {
//                                             value = value.slice(0, 3) + "-" + value.slice(3, 5) + "-" + value.slice(5, 9);
//                                           }
                                          
//                                           setForm({
//                                             ...form,
//                                             social_security_number: value,
//                                           });
//                                         }}
//                                         value={form?.social_security_number}
//                                         onChange={(e) => {
//                                           // Keep the formatted value from onKeyUp
//                                         }}
//                                       />
//                                       {sumitted &&
//                                         !form?.social_security_number && (
//                                           <p className="text-danger font_fix">
//                                             This field is required
//                                           </p>
//                                         )}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="col-md-12">
//                               <div className="mb-4">
//                                 <label className="certif_inst">
//                                   I consent to sign my IRS Form W-9
//                                   electronically.{" "}
//                                 </label>
//                                 <div className="form-check">
//                                   <input
//                                     className="mr5 form-check-input"
//                                     type="checkbox"
//                                     id="consent"
//                                     checked={form?.consent_agreed || false}
//                                     onChange={(e) =>
//                                       setForm({
//                                         ...form,
//                                         consent_agreed: e.target.checked,
//                                       })
//                                     }
//                                   />
//                                   <label className="label_p form-check-label" htmlFor="consent">
//                                     If you provide an electronic signature, you
//                                     will be able to submit your tax information
//                                     immediately.
//                                   </label>
//                                 </div>
//                               </div>

//                               <div className="formwrapper p-0">
//                                 <div className="boxpublish certify_detials mb-4">
//                                   <Label className="form-label certif_inst">
//                                     Under penalties of perjury, I certify that:
//                                   </Label>

//                                   <ol className="ul_listsbx">
//                                     <li className="no_list">
//                                       {" "}
//                                       The number shown on this form is my
//                                       correct taxpayer identification number (or
//                                       I am waiting for a number to be issued to
//                                       me), and{" "}
//                                     </li>

//                                     <li className="no_list">
//                                       {" "}
//                                       I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified
//                                       by the Internal Revenue Service (IRS) that
//                                       I am subject to backup withholding as a
//                                       result of a failure to report all interest
//                                       or dividends, or (c) the IRS has notified me
//                                       that I am no longer subject to backup
//                                       withholding, and{" "}
//                                     </li>

//                                     <li className="no_list">
//                                       {" "}
//                                       I am a U.S. citizen or other U.S. person
//                                       (defined in the instructions), and{" "}
//                                     </li>

//                                     <li className="no_list">
//                                       {" "}
//                                       The FATCA code(s) entered on this form (if
//                                       any) indicating that I am exempt from
//                                       FATCA reporting is correct.{" "}
//                                     </li>
//                                   </ol>
//                                 </div>

//                                 <div className="text_git ">
//                                   <h3 className="certif_inst">
//                                     Certification Instructions{" "}
//                                   </h3>
//                                   <p className="label_pbx label_font">
//                                     You must cross out item 2 above if you have
//                                     been notified by the IRS that you are
//                                     currently subject to backup withholding. You
//                                     will need to print out your hard copy form
//                                     at the end of the interview and cross out
//                                     item 2 before signing and mailing to the
//                                     address provided. The Internal Revenue
//                                     Service does not require your consent to any
//                                     provision of this document other than the
//                                     certifications required to avoid backup
//                                     withholding.
//                                   </p>
//                                 </div>

//                                 <div className="d-flex justify-content-between mt-3 align-items-center gap-3">
//                                   <div className="">
//                                     <div className="">
//                                       <div className="form-group drag_drop mb-0">
//                                         <div className="upload_file set_upload_bx position-relative">
//                                           {!form?.signature && !imgLoder && (
//                                             <>
//                                               {" "}
//                                               <button className="btn btn-primary upload_image" type="button">
//                                                 Upload Signature
//                                               </button>
//                                               <input
//                                                 type="file"
//                                                 className="form-control-file over_input"
//                                                 accept="images/*"
//                                                 multiple={false}
//                                                 onChange={(e) => {
//                                                   setImgLoder(true);
//                                                   uploadSignatureImage(e);
//                                                 }}
//                                               />
//                                             </>
//                                           )}
//                                           {loaderr && imgLoder ? (
//                                             <div className="text-success text-center mt-5 top_loading">
//                                               Uploading...{" "}
//                                               <i className="fa fa-spinner fa-spin"></i>
//                                             </div>
//                                           ) : (
//                                             <></>
//                                           )}
//                                           {form?.signature && (
//                                             <div className="imagesRow position-relative mt-4">
//                                               <img
//                                                 className="signurimg"
//                                                 src={methodModel.noImg(
//                                                   form?.signature,
//                                                 )}
//                                                 alt="Signature"
//                                               />
//                                               <i
//                                                 className="fa fa-times kliil"
//                                                 title="Remove"
//                                                 onClick={(e) =>
//                                                   setForm({
//                                                     ...form,
//                                                     signature: "",
//                                                   })
//                                                 }
//                                               ></i>
//                                             </div>
//                                           )}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="">
//                                     <input
//                                       type="date"
//                                       className="form-control cursor-pointer"
//                                       ref={dateInputRef}
//                                       onClick={handleClick}
//                                       min={currentDate}
//                                       value={form?.signature_date || ""}
//                                       onChange={(e) =>
//                                         setForm({
//                                           ...form,
//                                           signature_date: e.target.value,
//                                         })
//                                       }
//                                     />
//                                     {sumitted && !form?.signature_date && (
//                                       <p className="text-danger font_fix">
//                                         This field is required
//                                       </p>
//                                     )}
//                                   </div>
//                                 </div>

//                                 <div className="col-md-12 pl-0 ">
//                                   <div className="mb-4 mt-4 mt-md-5 text-start text-sm-end ">
//                                     <button
//                                       className="btn btn-primary login ml-md-3 "
//                                       onClick={(e) => handleSubmit(e)}
//                                     >
//                                       Save Tax Information
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </>
//   );
// }


"use client";

import react, { useEffect, useRef, useState } from "react";
import "../style.scss";
import Layout from "../../components/global/layout";
import { useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import methodModel from "@/methods/methods";
import crendentialModel from "@/models/credential.model";
import loader from "@/methods/loader";
import { toast } from "react-toastify";
import { Label } from "reactstrap";
import $ from "jquery";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

export default function TaxDetailForm() {
  const user = crendentialModel.getUser();
  const router = useRouter();

  const [form, setForm] = useState({
    user_id: user?.id || user?._id,
    social_security_number: "",
    is_us_citizen: true,
    signature_date: "",
    country: null,
    state: null,
    city: null,
    tax_classification: "",
    tax_name: "",
    ein: "",
    trade_name: "",
    federal_text_classification: "",
    consent_agreed: false,
    signature: "",
  });

  const [imgLoder, setImgLoder] = useState(false);
  const [loaderr, setLoader] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0];
  const dateInputRef = useRef(null);

  useEffect(() => {
    fetchTaxDetails();
  }, []);

  const fetchTaxDetails = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: user?.id || user?._id }).then((res) => {
      if (res.success && res?.data?.tax_detail) {
        const value = res?.data?.tax_detail;
        setForm({
          id:value?.id,
          tax_name: value?.tax_name || "",
          tax_classification: value?.tax_classification || "",
          social_security_number: value?.social_security_number || "",
          federal_text_classification: value?.federal_text_classification || "",
          is_us_citizen: value?.is_us_citizen ?? true,
          consent_agreed: value?.consent_agreed || false,
          signature: value?.signature || "",
          ein: value?.ein || "",
          trade_name: value?.trade_name || "",
          signature_date: value?.signature_date?.split("T")[0] || "",
          country: value?.country || null,
          state: value?.state || null,
          city: value?.city || null,
        });
      }
      loader(false);
    });
  };

  const uploadSignatureImage = (e) => {
    let files = e.target.files;
    let file = files.item(0);
    setImgLoder(true);
    setLoader(true);
    ApiClient.postFormData("upload/image?modelName=users", {
      file: file,
      modelName: "users",
    }).then((res) => {
      if (res.data) {
        let image = res?.data?.fullpath;
        setForm({ ...form, signature: `images/users/${image}` });
      }
      setImgLoder(false);
      setLoader(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form?.tax_classification) {
      setSubmitted(true);
      toast.error("Please select tax classification");
      return;
    }

    if (form?.tax_classification === "business") {
      if (!form?.ein || !form?.federal_text_classification || !form?.signature_date) {
        setSubmitted(true);
        toast.error("Please fill all required fields");
        return;
      }
    }

    if (form?.tax_classification === "individual") {
      if (!form?.signature_date || !form?.tax_name || !form?.social_security_number) {
        setSubmitted(true);
        toast.error("Please fill all required fields");
        return;
      }
    }

    if (!form?.country || !form?.state || !form?.city) {
      setSubmitted(true);
      toast.error("Please select country, state, and city");
      return;
    }

    if (!form?.consent_agreed) {
      setSubmitted(true);
      toast.error("Please consent to sign the form electronically");
      return;
    }

    if (!form?.signature) {
      setSubmitted(true);
      toast.error("Please upload your signature");
      return;
    }

    loader(true);

    const payload = {
      ...form,
      user_id: user?.id || user?._id,
    };

    delete payload?.baseImg;

    if (payload?.tax_classification === "business") {
      delete payload?.tax_name;
      delete payload?.social_security_number;
    }

    if (payload?.tax_classification === "individual") {
      delete payload?.federal_text_classification;
      delete payload?.ein;
      delete payload?.trade_name;
    }

    // Check if updating or creating
    const hasExistingTax = user?.tax_detail;

    const apiCall = hasExistingTax
      ? ApiClient.put("updateTax", payload)
      : ApiClient.post("addTax", payload);

    apiCall.then((res) => {
      if (res.success) {
        let uUser = {
          ...user,
          tax_detail: { ...payload }
        };
        crendentialModel.setUser(uUser);
        toast.success(hasExistingTax
          ? "Tax details updated successfully!"
          : "Tax details added successfully!"
        );
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      }
      loader(false);
    }).catch(() => {
      loader(false);
      toast.error("Something went wrong. Please try again.");
    });
  };

  const handleClick = () => {
    if (dateInputRef.current && !dateInputRef.current.disabled) {
      dateInputRef.current.showPicker();
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleFederalClassificationChange = (value) => {
    setForm({
      ...form,
      federal_text_classification:
        form.federal_text_classification === value ? "" : value,
    });
  };

  const formatSSN = (value) => {
    const ssn = value.replace(/\D/g, '');
    if (ssn.length <= 3) return ssn;
    if (ssn.length <= 5) return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value);
    setForm({ ...form, social_security_number: formatted });
  };

  const formatEIN = (value) => {
    const ein = value.replace(/\D/g, '');
    if (ein.length <= 2) return ein;
    return `${ein.slice(0, 2)}-${ein.slice(2, 9)}`;
  };

  const handleEINChange = (e) => {
    const formatted = formatEIN(e.target.value);
    setForm({ ...form, ein: formatted });
  };

  return (
    <>
      <Layout
        handleKeyPress={undefined}
        setFilter={undefined}
        reset={undefined}
        filter={undefined}
        name={"Tax Details"}
        filters={undefined}
      >
        <div className="main-affiliate mt-3 mb-5 pt-0">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="tx_detailsbx">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="dtls_head">
                      <h3 className="mb-0">Tax Information Form (W-9)</h3>
                      <p className="text-muted small">Please fill in your tax details below</p>
                    </div>
                  </div>

                  <div className="form_page b-none">
                    <div className="container px-0">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          {/* Citizenship Status */}
                          <div className="col-md-6 mb-4">
                            <div className="form-card">
                              <label className="form-label fw-semibold">
                                Are you a U.S. citizen or permanent resident?
                                <span className="text-danger ms-1">*</span>
                                <i className="fa fa-info-circle ms-2 text-muted"
                                  title="U.S. citizen, U.S. permanent resident (green card holder)"></i>
                              </label>
                              <div className="position-relative selectYes custom-dropdown">
                                <select
                                  className="form-control form-select"
                                  value={form?.is_us_citizen.toString()}
                                  onChange={(e) =>
                                    setForm({
                                      ...form,
                                      is_us_citizen: e.target.value === "true",
                                    })
                                  }
                                  required
                                >
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                                <i className="fa fa-sort-desc down_arrow" aria-hidden="true"></i>
                              </div>
                            </div>
                          </div>

                          {/* Tax Classification */}
                          <div className="col-md-6 mb-4">
                            <div className="form-card">
                              <label className="form-label fw-semibold">
                                Tax Classification <span className="text-danger">*</span>
                              </label>
                              <div className="d-flex gap-4 mt-2">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="taxClassification"
                                    id="individual"
                                    checked={form?.tax_classification === "individual"}
                                    onChange={() =>
                                      setForm({
                                        ...form,
                                        tax_classification: "individual",
                                        federal_text_classification: "",
                                        social_security_number: "",
                                        trade_name: "",
                                        ein: "",
                                      })
                                    }
                                  />
                                  <label className="form-check-label" htmlFor="individual">
                                    Individual
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="taxClassification"
                                    id="business"
                                    checked={form?.tax_classification === "business"}
                                    onChange={() =>
                                      setForm({
                                        ...form,
                                        tax_classification: "business",
                                        tax_name: "",
                                        social_security_number: "",
                                        federal_text_classification: "",
                                      })
                                    }
                                  />
                                  <label className="form-check-label" htmlFor="business">
                                    Business
                                  </label>
                                </div>
                              </div>
                              {submitted && !form?.tax_classification && (
                                <div className="text-danger small mt-1">
                                  Please select tax classification
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Location Fields */}
                          <div className="col-12 mb-4">
                            <div className="form-card">
                              <h5 className="mb-3">Address Information</h5>
                              <div className="row">
                                <div className="col-md-4 mb-3 mb-md-0">
                                  <CountrySelect
                                    defaultValue={form.country}
                                    onChange={(country) =>
                                      setForm({
                                        ...form,
                                        country,
                                        state: null,
                                        city: null,
                                      })
                                    }
                                    placeHolder="Select Country"
                                    inputClassName="form-control custom-field"
                                  />
                                  {submitted && !form?.country && (
                                    <div className="text-danger small mt-1">
                                      Country is required
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4 mb-3 mb-md-0">
                                  <StateSelect
                                    countryid={form?.country?.id}
                                    defaultValue={form.state}
                                    onChange={(state) =>
                                      setForm({
                                        ...form,
                                        state,
                                        city: null,
                                      })
                                    }
                                    placeHolder="Select State"
                                    inputClassName="form-control custom-field"
                                    noOptionsMessage={() => "No states available"}
                                  />
                                  {submitted && !form?.state && (
                                    <div className="text-danger small mt-1">
                                      State is required
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4">
                                  <CitySelect
                                    countryid={form?.country?.id}
                                    stateid={form?.state?.id}
                                    defaultValue={form.city}
                                    onChange={(city) =>
                                      setForm({
                                        ...form,
                                        city,
                                      })
                                    }
                                    placeHolder="Select City"
                                    inputClassName="form-control custom-field"
                                    noOptionsMessage={() => "No cities available"}
                                  />
                                  {submitted && !form?.city && (
                                    <div className="text-danger small mt-1">
                                      City is required
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Federal Tax Classification (for Business) */}
                          {form?.tax_classification === "business" && (
                            <div className="col-12 mb-4">
                              <div className="form-card">
                                <label className="form-label fw-semibold mb-3">
                                  Federal Tax Classification <span className="text-danger">*</span>
                                </label>
                                <p className="small text-muted mb-3">
                                  Check only one of the following boxes:
                                </p>

                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-check mb-2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="individualSole"
                                        checked={form?.federal_text_classification === "individual"}
                                        onChange={() => handleFederalClassificationChange("individual")}
                                      />
                                      <label className="form-check-label" htmlFor="individualSole">
                                        Individual/Sole proprietor or single-member LLC
                                      </label>
                                    </div>
                                    <div className="form-check mb-2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="cCorporation"
                                        checked={form?.federal_text_classification === "c_corporation"}
                                        onChange={() => handleFederalClassificationChange("c_corporation")}
                                      />
                                      <label className="form-check-label" htmlFor="cCorporation">
                                        C Corporation
                                      </label>
                                    </div>
                                    <div className="form-check mb-2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="sCorporation"
                                        checked={form?.federal_text_classification === "s_corporation"}
                                        onChange={() => handleFederalClassificationChange("s_corporation")}
                                      />
                                      <label className="form-check-label" htmlFor="sCorporation">
                                        S Corporation
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-check mb-2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="partnership"
                                        checked={form?.federal_text_classification === "partnership"}
                                        onChange={() => handleFederalClassificationChange("partnership")}
                                      />
                                      <label className="form-check-label" htmlFor="partnership">
                                        Partnership
                                      </label>
                                    </div>
                                    <div className="form-check mb-2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="limitedLiability"
                                        checked={form?.federal_text_classification === "limited_liability"}
                                        onChange={() => handleFederalClassificationChange("limited_liability")}
                                      />
                                      <label className="form-check-label" htmlFor="limitedLiability">
                                        Limited Liability Company
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                {submitted && !form?.federal_text_classification && (
                                  <div className="text-danger small mt-2">
                                    Please select federal tax classification
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Tax Identity Information */}
                          <div className="col-12 mb-4">
                            <div className="form-card">
                              <h5 className="mb-3">Tax Identity Information</h5>
                              <div className="row">
                                {form?.tax_classification === "individual" && (
                                  <>
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">
                                        Full Name <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your full name"
                                        value={form?.tax_name || ""}
                                        onChange={(e) =>
                                          setForm({ ...form, tax_name: e.target.value })
                                        }
                                      />
                                      {submitted && !form?.tax_name && (
                                        <div className="text-danger small mt-1">
                                          Name is required
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">
                                        Social Security Number <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="XXX-XX-XXXX"
                                        maxLength="11"
                                        value={form?.social_security_number || ""}
                                        onChange={handleSSNChange}
                                      />
                                      {submitted && !form?.social_security_number && (
                                        <div className="text-danger small mt-1">
                                          SSN is required
                                        </div>
                                      )}
                                      <small className="text-muted">Format: XXX-XX-XXXX</small>
                                    </div>
                                  </>
                                )}

                                {form?.tax_classification === "business" && (
                                  <>
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">
                                        Trade Name (Optional)
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Doing business as (DBA)"
                                        value={form?.trade_name || ""}
                                        onChange={(e) =>
                                          setForm({ ...form, trade_name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                      <label className="form-label">
                                        EIN <span className="text-danger">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="XX-XXXXXXX"
                                        maxLength="10"
                                        value={form?.ein || ""}
                                        onChange={handleEINChange}
                                      />
                                      {submitted && !form?.ein && (
                                        <div className="text-danger small mt-1">
                                          EIN is required
                                        </div>
                                      )}
                                      <small className="text-muted">Format: XX-XXXXXXX</small>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Consent and Certification */}
                          <div className="col-12 mb-4">
                            <div className="form-card">
                              <div className="mb-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="consent"
                                    checked={form?.consent_agreed || false}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        consent_agreed: e.target.checked,
                                      })
                                    }
                                  />
                                  <label className="form-check-label fw-semibold" htmlFor="consent">
                                    I consent to sign my IRS Form W-9 electronically.
                                  </label>
                                </div>
                                <p className="small text-muted mt-2 ps-4">
                                  If you provide an electronic signature, you will be able to submit
                                  your tax information immediately.
                                </p>
                                {submitted && !form?.consent_agreed && (
                                  <div className="text-danger small mt-1 ps-4">
                                    You must consent to continue
                                  </div>
                                )}
                              </div>

                              <div className="certify-box bg-light p-4 rounded mb-4">
                                <Label className="form-label fw-semibold mb-3">
                                  Under penalties of perjury, I certify that:
                                </Label>

                                <ol className="mb-3 ps-3">
                                  <li className="mb-2">
                                    The number shown on this form is my correct taxpayer
                                    identification number (or I am waiting for a number to be
                                    issued to me)
                                  </li>
                                  <li className="mb-2">
                                    I am not subject to backup withholding because: (a) I am exempt
                                    from backup withholding, or (b) I have not been notified by the
                                    IRS that I am subject to backup withholding
                                  </li>
                                  <li className="mb-2">
                                    I am a U.S. citizen or other U.S. person
                                  </li>
                                  <li className="mb-2">
                                    The FATCA code(s) entered on this form (if any) indicating
                                    that I am exempt from FATCA reporting is correct
                                  </li>
                                </ol>

                                <div className="alert alert-info small">
                                  <i className="fa fa-info-circle me-2"></i>
                                  You must cross out item 2 if you have been notified by the IRS
                                  that you are currently subject to backup withholding.
                                </div>
                              </div>

                              {/* Signature and Date */}
                              <div className="row align-items-end">
                                <div className="col-md-6 mb-3 mb-md-0">
                                  <label className="form-label fw-semibold">
                                    Signature <span className="text-danger">*</span>
                                  </label>
                                  <div className="signature-upload">
                                    {!form?.signature && !imgLoder ? (
                                      <div className="upload-area border rounded p-3 text-center">
                                        <input
                                          type="file"
                                          className="d-none"
                                          id="signature-upload"
                                          accept="image/*"
                                          onChange={uploadSignatureImage}
                                        />
                                        <label
                                          htmlFor="signature-upload"
                                          className="btn btn-outline-primary mb-0 cursor-pointer"
                                        >
                                          <i className="fa fa-upload me-2"></i>
                                          Upload Signature
                                        </label>
                                        <p className="small text-muted mt-2 mb-0">
                                          Upload an image of your signature
                                        </p>
                                      </div>
                                    ) : loaderr && imgLoder ? (
                                      <div className="text-center p-4">
                                        <i className="fa fa-spinner fa-spin fa-2x text-primary"></i>
                                        <p className="mt-2">Uploading...</p>
                                      </div>
                                    ) : form?.signature && (
                                      <div className="signature-preview position-relative d-inline-block">
                                        <img
                                          src={methodModel.noImg(form?.signature)}
                                          alt="Signature"
                                          className="border rounded p-2"
                                          style={{ maxHeight: '80px', maxWidth: '200px' }}
                                        />
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                          onClick={() => setForm({ ...form, signature: "" })}
                                          style={{ transform: 'translate(50%, -50%)' }}
                                        >
                                          <i className="fa fa-times"></i>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  {submitted && !form?.signature && !imgLoder && (
                                    <div className="text-danger small mt-1">
                                      Signature is required
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-6">
                                  <label className="form-label fw-semibold">
                                    Signature Date <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    className="form-control cursor-pointer"
                                    ref={dateInputRef}
                                    onClick={handleClick}
                                    min={currentDate}
                                    value={form?.signature_date || ""}
                                    onChange={(e) =>
                                      setForm({ ...form, signature_date: e.target.value })
                                    }
                                  />
                                  {submitted && !form?.signature_date && (
                                    <div className="text-danger small mt-1">
                                      Signature date is required
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Form Actions */}
                          <div className="col-12">
                            <div className="d-flex justify-content-end gap-3">
                              <button
                                type="button"
                                className="btn btn-outline-secondary px-4 py-2"
                                onClick={handleGoBack}
                              >
                                <i className="fa fa-chevron-left me-2"></i>
                                Back
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary px-5 py-2"
                              >
                                <i className="fa fa-save me-2"></i>
                                Save Tax Information
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <style jsx>{`
        .form-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          border: 1px solid #e9ecef;
        }
        .certify-box {
          border-left: 4px solid #0d6efd;
        }
        .signature-preview {
          margin-top: 0.5rem;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .custom-field {
          background-color: white !important;
        }
        .down_arrow {
          position: absolute;
          right: 12px;
          top: 12px;
          color: #6c757d;
          pointer-events: none;
        }
        .selectYes {
          position: relative;
        }
        .selectYes select {
          appearance: none;
          padding-right: 30px;
        }
      `}</style>
    </>
  );
}
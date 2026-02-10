import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import { toast } from "react-toastify";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from "next/navigation";
import environment from "@/environment";
import { Modal } from "react-bootstrap";
import Papa from "papaparse";
import moment from "moment";

const Html = () => {
  const user = crendentialModel.getUser();
  const [formData, setFormData] = useState({
    transaction_date: "",
    amount_of_sale: "",
    amount_of_commission: "",
    order_reference: "",
    publisher_id: "",
    commission_status: "",
  });
  const [data, setData] = useState([]);
  const [formType, setFormType] = useState("single");
  const [isChecked, setIsChecked] = useState(false);
  const [file, setFile] = useState(null);
  const [locale, setLocale] = useState("");
  const [hasHeader, setHasHeader] = useState(false);
  const [commissionSelectType, setCommissionType] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [camppaignData, setCamppaignData] = useState([]);
  const [errors, setErrors] = useState({});
  const history = useRouter();

  const downloadCSVTemplate = () => {
    // CSV content with headers and sample data
    const csvContent = [
      "affiliate_id,commission_type,amount_of_sale,amount_of_commission,order_reference,commission_status,transaction_date,notes",
      "12345,sales,100.00,10.00,ORDER123,pending,2023-01-15,Sample commission entry",
      "12346,lead,0.00,25.00,LEAD456,confirmed,2023-01-16,Sample lead commission",
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "manual_commission_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openModal = () => {
    handleShow();
  };

  const commissionType = [
    {
      id: "sales",
      name: "Sales",
    },
    {
      id: "lead",
      name: "Lead",
    },
    {
      id: "bonus",
      name: "Bonus",
    },
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    ApiClient.postFormData("upload/document", { file: selectedFile }).then(
      (res) => {
        if (res?.success) {
          setFile(res?.data?.imagePath);
        }
      }
    );
  };

  const getCampaignData = (p = {}) => {
    let url = "campaign/brand/all";
    ApiClient.get(url, { ...p, brand_id: user?.id }).then((res) => {
      if (res.success) {
        setCamppaignData(
          res.data.data.map((dat) => {
            return {
              name: dat?.name,
              id: dat?.id || dat?._id,
            };
          })
        );
        // setTotal(res.data.total_count)
      }
    });
  };

  const handleLocaleChange = (event) => {
    setLocale(event.target.value);
  };

  const handleHeaderChange = (event) => {
    setHasHeader(event.target.checked);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCommissionTypeChange = (e) => {
    setCommissionType(e.target.value);
  };

  // Handle number change with 9-digit restriction
  const handleNumberChange = (e, field) => {
    const value = e.target.value;

    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, '');

    // Check if the numeric string (excluding decimal point) exceeds 9 digits
    const digitsOnly = numericValue.replace(/\./g, '');

    if (digitsOnly.length <= 9) {
      setFormData({ ...formData, [field]: numericValue });

      // Clear validation error for this field when user starts typing
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } else {
      // If user tries to enter more than 9 digits, show error immediately
      setErrors(prev => ({
        ...prev,
        [field]: "Cannot exceed 9 digits"
      }));

      // Keep only first 9 digits (plus decimal point if already entered)
      let truncatedValue = '';
      let decimalFound = false;
      let digitCount = 0;

      for (let char of numericValue) {
        if (digitCount >= 9) break;

        if (char === '.' && !decimalFound) {
          truncatedValue += char;
          decimalFound = true;
        } else if (/^\d$/.test(char)) {
          truncatedValue += char;
          digitCount++;
        }
      }

      setFormData({ ...formData, [field]: truncatedValue });
    }
  };

  const getData = (p = {}) => {
    let filter = { brand_id: user?.id };
    let url = "getallaffiliatelisting";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        const data = res.data;
        const filteredData = data.filter((item) => item !== null);
        const manipulateData = filteredData.map((itm) => {
          return {
            name: itm?.userName || itm?.firstName,
            id: itm?.id || itm?._id,
          };
        });
        setData(manipulateData);
      }
    });
  };

  const fetchCSV = async () => {
    try {
      const response = await fetch("/searchspring.csv");
      if (!response.ok) {
        throw new Error("File not found");
      }

      const text = await response.text();
      Papa.parse(text, {
        complete: (result) => {
          setCsvData(result.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    } catch (err) { }
  };

  useEffect(() => {
    getCampaignData({ affiliate_ids: formData?.publisher_id });
  }, [formData.publisher_id]);

  useEffect(() => {
    getData();
    fetchCSV();
  }, []);

  // Validate max 9 digits for a field
  const validateMaxDigits = (value, fieldName) => {
    if (!value) return '';

    // Remove decimal point and non-digit characters for digit count
    const digitsOnly = value.replace(/[^\d]/g, '');

    if (digitsOnly.length > 9) {
      return "Cannot exceed 9 digits";
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!commissionSelectType) {
      newErrors.commissionType = "Commission Type is required";
    }

    if (!formData?.publisher_id) {
      newErrors.publisher_id = "Affiliate Name is required";
    }

    if (!formData?.amount_of_sale && commissionSelectType != "lead") {
      newErrors.amount_of_sale = "Amount of Sale is required";
    } else if (formData?.amount_of_sale) {
      // Validate max 9 digits for amount_of_sale
      const saleAmountError = validateMaxDigits(formData.amount_of_sale, 'amount_of_sale');
      if (saleAmountError) {
        newErrors.amount_of_sale = saleAmountError;
      }
    }

    if (!formData?.amount_of_commission) {
      newErrors.amount_of_commission = "Amount of Commission is required";
    } else if (formData?.amount_of_commission) {
      // Validate max 9 digits for amount_of_commission
      const commissionAmountError = validateMaxDigits(formData.amount_of_commission, 'amount_of_commission');
      if (commissionAmountError) {
        newErrors.amount_of_commission = commissionAmountError;
      }
    }

    if (!formData?.commission_status) {
      newErrors.commission_status = "Commission Status is required";
    }

    if (!formData?.order_reference && commissionSelectType != "lead") {
      newErrors.order_reference = "Order Reference is required";
    }

    if (!formData?.transaction_date) {
      newErrors.transaction_date = "Transaction Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setsubmitted(true);

    if (formType === "single") {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }
    } else {
      if (!file) {
        toast.error("Please upload a CSV file");
        return;
      }
    }

    let payload;

    if (formType == "single") {
      payload = {
        upload_method: formType,
        commission_type: commissionSelectType,
        amount_of_sale: formData?.amount_of_sale,
        amount_of_commission: formData?.amount_of_commission,
        order_reference: formData?.order_reference,
        affiliate_id: formData?.publisher_id,
        is_send_email_to_publisher: isChecked,
        commission_status: formData?.commission_status,
        transaction_date: formData?.transaction_date,
        campaign_id: formData?.campaign_id,
      };
    } else {
      payload = {
        batch_file: `/documents/${file}`,
        isContain_headers: hasHeader ? "yes" : "no",
      };
    }

    if (commissionSelectType == "lead") {
      delete payload.amount_of_sale;
      delete payload.order_reference;
    }

    ApiClient.post("add-commission", payload).then((res) => {
      if (res?.success) {
        toast.success(res?.message);
        setFormType("");
        setCommissionType("");
        history.push("/commission/manualcommission/view");
        setFormData({
          amount_of_sale: "",
          amount_of_commission: "",
          order_reference: "",
          affiliate_id: "",
          is_send_email_to_publisher: false,
          batch_file: "",
          isContain_headers: false,
          locality: "",
          commission_status: "",
          transaction_date: "",
        });
      }
    });
  };
  const dateInputRef = useRef(null);

  const handleClick = () => {
    if (dateInputRef.current && !dateInputRef.current.disabled) {
      dateInputRef.current.showPicker();
    }
  };

  // Format number for display (adds commas)
  const formatNumberForDisplay = (numString) => {
    if (!numString) return '';

    // Split into integer and decimal parts
    const parts = numString.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    // Add commas to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return integerPart + decimalPart;
  };

  return (
    <>
      <Layout
        handleKeyPress={""}
        setFilter={""}
        reset={""}
        filter={""}
        name="Manual Commission"
        filters={""}
      >
        <div className="sidebar-left-content">
          <div className="card">
            <div className="card-header">
              <div className="main_title_head d-flex justify-content-between align-items-center">
                <h3 className="link_default m-0">
                  <i
                    className="fa-solid fa-arrow-left mr-2 link_icon"
                    aria-hidden="true"
                    onClick={() =>
                      history.push("/commission/manualcommission/view")
                    }
                  ></i>
                  Manual Commission
                </h3>
              </div>
            </div>
            <div className="card-body">
              <div className="mx-2">
                <div className="">
                  <div className="d-flex gap-5 align-items-center mb-4 manual-commission-select-options  ">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="single"
                        name="formType"
                        value="single"
                        checked={formType === "single"}
                        onChange={() => setFormType("single")}
                      />
                      <label className="form-check-label" htmlFor="single">
                        Single
                      </label>
                    </div>

                    <div className="form-check pl-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="batch"
                        name="formType"
                        value="batch"
                        checked={formType === "batch"}
                        onChange={() => setFormType("batch")}
                      />
                      <label className="form-check-label" htmlFor="batch">
                        Batch(CSV)
                      </label>
                    </div>
                  </div>

                  {formType === "single" && (
                    <div className="row">
                      <div className="col-md-6 ">
                        <div className="mb-3">
                          <label>Select Commission Type</label>
                          <SelectDropdown
                            theme="search"
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="select"
                            intialValue={commissionSelectType}
                            result={(e) => {
                              setCommissionType(e.value);
                            }}
                            options={commissionType}
                          />
                          {errors.commissionType && (
                            <div className="invalid-feedback d-block">
                              {errors.commissionType}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 ">
                        <div className="mb-3">
                          <label>Affiliate Name</label>
                          <SelectDropdown
                            theme="search"
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="select"
                            intialValue={formData?.publisher_id}
                            result={(e) => {
                              setFormData({
                                ...formData,
                                publisher_id: e.value,
                              });
                            }}
                            options={data}
                          />
                          {errors.publisher_id && (
                            <div className="invalid-feedback d-block">
                              {errors.publisher_id}
                            </div>
                          )}
                        </div>
                      </div>
                      {commissionSelectType != "lead" && (
                        <div className="col-md-6 ">
                          <div className="mb-3">
                            <label>Sale Amount (Max: 9 digits)</label>
                            <input
                              type="text"
                              className={`form-control ${errors.amount_of_sale ? "is-invalid" : ""
                                }`}
                              placeholder="Enter your Amount of Sale"
                              value={formatNumberForDisplay(formData?.amount_of_sale)}
                              onChange={(e) =>
                                handleNumberChange(e, "amount_of_sale")
                              }
                            />
                            {errors.amount_of_sale && (
                              <div className="invalid-feedback">
                                {errors.amount_of_sale}
                              </div>
                            )}
                            <div className="digit-counter mt-1">
                              {/* {formData?.amount_of_sale ? (
                                <small className={formData?.amount_of_sale.replace(/[^\d]/g, '').length > 9 ? "text-danger" : "text-muted"}>
                                  {formData?.amount_of_sale.replace(/[^\d]/g, '').length} / 9 digits
                                </small>
                              ) : (
                                <small className="text-muted">Max 9 digits</small>
                              )} */}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-6 ">
                        <div className="mb-3">
                          <label>Commission Amount (Max: 9 digits)</label>
                          <input
                            type="text"
                            className={`form-control ${errors.amount_of_commission ? "is-invalid" : ""
                              }`}
                            placeholder="Enter your Amount of Commission"
                            value={formatNumberForDisplay(formData?.amount_of_commission)}
                            onChange={(e) =>
                              handleNumberChange(e, "amount_of_commission")
                            }
                          />
                          {errors.amount_of_commission && (
                            <div className="invalid-feedback">
                              {errors.amount_of_commission}
                            </div>
                          )}
                          <div className="digit-counter mt-1">
                            {/* {formData?.amount_of_commission ? (
                              <small className={formData?.amount_of_commission.replace(/[^\d]/g, '').length > 9 ? "text-danger" : "text-muted"}>
                                {formData?.amount_of_commission.replace(/[^\d]/g, '').length} / 9 digits
                              </small>
                            ) : (
                              <small className="text-muted">Max 9 digits</small>
                            )} */}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 ">
                        <div className="mb-3">
                          <label>Commission Status</label>
                          <SelectDropdown
                            theme="search"
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="select"
                            intialValue={formData?.commission_status}
                            result={(e) => {
                              setFormData({
                                ...formData,
                                commission_status: e.value,
                              });
                            }}
                            options={[
                              { id: "pending", name: "Pending" },
                              { id: "confirmed", name: "Confirmed" },
                            ]}
                          />
                          {errors.commission_status && (
                            <div className="invalid-feedback d-block">
                              {errors.commission_status}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 ">
                        <div className="mb-3 mc-campaign-dropdown">
                          <label>Campaign</label>
                          <SelectDropdown
                            theme="search"
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="select"
                            intialValue={formData?.campaign_id}
                            result={(e) => {
                              setFormData({
                                ...formData,
                                campaign_id: e.value,
                              });
                            }}
                            options={camppaignData}
                          />
                          {/* {errors.campaign_id && <div className="invalid-feedback d-block">{errors.campaign_id}</div>} */}
                        </div>
                      </div>

                      {commissionSelectType != "lead" && (
                        <div className="col-md-6 ">
                          <div className="mb-3">
                            <label>Order Reference</label>
                            <input
                              type="text"
                              className={`form-control ${errors.order_reference ? "is-invalid" : ""
                                }`}
                              placeholder="Enter your Order Reference"
                              value={formData?.order_reference}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  order_reference: e?.target?.value,
                                })
                              }
                            />
                            {errors.order_reference && (
                              <div className="invalid-feedback">
                                {errors.order_reference}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="col-md-6 ">
                        <div className="mb-3">
                          <label>Transaction Date</label>
                          <input
                            type="date"
                            ref={dateInputRef}
                            onClick={handleClick}
                            className={`form-control cursor-pointer ${errors.transaction_date ? "is-invalid" : ""
                              }`}
                            value={formData?.transaction_date}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                transaction_date: e.target.value,
                              })
                            }
                            max={moment().format("YYYY-MM-DD")}
                          />
                          {errors.transaction_date && (
                            <div className="invalid-feedback">
                              {errors.transaction_date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="mb-3">
                          <div className="form-check form-check-inline ">
                            An email will be sent to the publishers containing
                            the commission details
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {formType != "single" && (
                    <>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label>
                            Upload CSV File{" "}
                            <span onClick={openModal} style={{ color: "red" }}>
                              (See a example)
                            </span>
                          </label>
                          <div className="form-group drag_drop">
                            <div className="upload_filebx">
                              {!file && (
                                <>
                                  <button className="btn btn-primary upload_image">
                                    Upload CSV File
                                  </button>
                                  <input
                                    type="file"
                                    className="form-control file_input"
                                    accept=".csv"
                                    multiple={false}
                                    onChange={(e) => {
                                      handleFileChange(e);
                                    }}
                                  />
                                </>
                              )}
                              <div className="imagesRow">
                                <div className="upload_csvfile">
                                  {!file ? null : (
                                    <a
                                      href={`${environment?.api}/documents/${file}`}
                                    >
                                      <img
                                        src={`/assets/img/document.png`}
                                        className="thumbnail"
                                      />
                                    </a>
                                  )}
                                  {!file ? null : (
                                    <div
                                      className="removeCross"
                                      onClick={() => setFile("")}
                                    >
                                      <i
                                        class="fa fa-times csv_close"
                                        aria-hidden="true"
                                      ></i>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-3">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="headerCheckbox"
                              checked={hasHeader}
                              onChange={handleHeaderChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="headerCheckbox"
                            >
                              {" "}
                              Does first line contain header?
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-end">
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit Commisssion
                    </button>
                  </div>
                </div>

                <Modal
                  show={show}
                  onHide={handleClose}
                  className="shadowboxmodal csv_modal"
                >
                  <Modal.Header
                    className="align-items-center p-0 pb-3"
                    closeButton
                  >
                    <h5 className="modal-title">Sample CSV File</h5>
                    <button
                      className="btn btn-primary ml-2"
                      onClick={downloadCSVTemplate}
                    >
                      Download CSV
                    </button>
                  </Modal.Header>
                  <Modal.Body className="p-0">
                    <div className="table-responsive">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>Affiliate ID</th>
                              <th>Commission Type</th>
                              <th>Amount of Sale</th>
                              <th>Amount of Commission</th>
                              <th>Order Reference</th>
                              <th>Commission Status</th>
                              <th>Transaction Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>12345</td>
                              <td>sales</td>
                              <td>100.00</td>
                              <td>10.00</td>
                              <td>ORDER123</td>
                              <td>pending</td>
                              <td>2023-01-15</td>
                            </tr>
                            <tr>
                              <td>12346</td>
                              <td>lead</td>
                              <td>0.00</td>
                              <td>25.00</td>
                              <td>LEAD456</td>
                              <td>confirmed</td>
                              <td>2023-01-16</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4">
                        <h5>Instructions:</h5>
                        <ul>
                          <li>Keep the column headers exactly as shown</li>
                          <li>
                            <strong>Commission Type:</strong> Must be "sales",
                            "lead", or "bonus"
                          </li>
                          <li>
                            <strong>Commission Status:</strong> Must be
                            "pending" or "confirmed"
                          </li>
                          <li>
                            <strong>Transaction Date:</strong> Must be in
                            YYYY-MM-DD format
                          </li>
                          <li>
                            <strong>Amount fields:</strong> Should not exceed 9 digits (decimals allowed)
                          </li>
                          <li>Do not add or remove columns</li>
                          <li>
                            Remove the sample data before uploading your own
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Html;
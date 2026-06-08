import React, { useEffect, useState } from "react";
import Layout from "../components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import { toast } from "react-toastify";
import "./style.scss";

const PostbackUrlManager = () => {
  // Postback URL States
  const [postbackUrl, setPostbackUrl] = useState("");
  const [showNewPostback, setShowNewPostback] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Postback Configuration States
  const [postbackMethod, setPostbackMethod] = useState("POST");
  const [postbackFormat, setPostbackFormat] = useState("json");

  // Define all possible keys from your data - ALL EDITABLE
  const [availableKeys, setAvailableKeys] = useState([
    { id: "event", label: "Event Type", required: false, example: "PageView", value: "{event}" },
    { id: "order_id", label: "Order ID", required: false, example: "6622719967345", value: "{order_id}" },
    { id: "price", label: "Price/Amount", required: false, example: "1120.94", value: "{price}" },
    { id: "currency", label: "Currency", required: false, example: "INR", value: "{currency}" },
    { id: "timestamp", label: "Timestamp", required: false, example: "2026-05-27T06:48:03.255Z", value: "{timestamp}" },
    { id: "affiliate_id", label: "Affiliate ID", required: false, example: "68d114d31ac79315333822ab", value: "{affiliate_id}" },
    { id: "campaign_id", label: "Campaign ID", required: false, example: "camp_123", value: "{campaign_id}" },
    { id: "brand_id", label: "Brand ID", required: false, example: "brand_456", value: "{brand_id}" },
    { id: "params_affiliate", label: "Params Affiliate", required: false, example: "68d114d31ac79315333822ab", value: "{params_affiliate}" },
  ]);

  const [selectedKeys, setSelectedKeys] = useState([
    "event", "order_id", "price", "currency", "affiliate_id"
  ]);

  // State for adding new custom key
  const [showAddKeyForm, setShowAddKeyForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [newKey, setNewKey] = useState({ id: "", label: "", example: "", required: false });

  // Nested object key (sub_ids)
  const [includeSubIds, setIncludeSubIds] = useState(true);

  // Test States
  const [testData, setTestData] = useState({
    event: "PageView",
    order_id: "TEST_ORDER_001",
    price: 99.99,
    currency: "USD",
    affiliate_id: "test_affiliate_123"
  });
  const [testResponse, setTestResponse] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  // Validation Errors
  const [errors, setErrors] = useState({ postbackUrl: "" });

  useEffect(() => {
    fetchPostbackConfig();
  }, []);

  const fetchPostbackConfig = () => {
    ApiClient.get("affiliate/postback/config").then((res) => {
      if (res.success && res.data) {
        setPostbackUrl(res.data.postback_url || "");
        setPostbackMethod(res.data.method || "POST");
        setPostbackFormat(res.data.format || "json");
        setSelectedKeys(res.data.selected_keys || ["event", "order_id", "price", "currency", "affiliate_id"]);
        setIncludeSubIds(res.data.include_sub_ids || true);

        // Load custom keys if they exist
        if (res.data.custom_keys && res.data.custom_keys.length) {
          setAvailableKeys(prev => {
            // Merge existing keys with custom keys, avoiding duplicates
            const existingIds = new Set(prev.map(k => k.id));
            const newCustomKeys = res.data.custom_keys.filter(k => !existingIds.has(k.id));
            return [...prev, ...newCustomKeys];
          });
        }
      }
    });
  };

  // Add custom key
  const addCustomKey = () => {
    if (!newKey.id || !newKey.label) {
      toast.error("Please provide both Key ID and Label");
      return;
    }

    // Check for duplicate key id
    if (availableKeys.some(key => key.id === newKey.id)) {
      toast.error("Key ID already exists");
      return;
    }

    const customKey = {
      id: newKey.id,
      label: newKey.label,
      required: newKey.required || false,
      example: newKey.example || "",
      value: `{${newKey.id}}`,
      isCustom: true
    };

    setAvailableKeys([...availableKeys, customKey]);
    setNewKey({ id: "", label: "", example: "", required: false });
    setShowAddKeyForm(false);
    toast.success("Custom key added successfully");
  };

  // Edit ANY key (including system keys)
  const editKey = (key) => {
    setEditingKey({ ...key });
    setNewKey({
      id: key.id,
      label: key.label,
      example: key.example,
      required: key.required
    });
  };

  // Update any key
  const updateKey = () => {
    if (!newKey.id || !newKey.label) {
      toast.error("Please provide both Key ID and Label");
      return;
    }

    // Check for duplicate ID only if ID is being changed
    if (newKey.id !== editingKey.id && availableKeys.some(key => key.id === newKey.id)) {
      toast.error("Key ID already exists");
      return;
    }

    const updatedKey = {
      ...editingKey,
      id: newKey.id,
      label: newKey.label,
      example: newKey.example,
      required: newKey.required,
      value: `{${newKey.id}}`
    };

    setAvailableKeys(prev => prev.map(key =>
      key.id === editingKey.id ? updatedKey : key
    ));

    // Update selected keys if the id changed
    if (editingKey.id !== newKey.id) {
      setSelectedKeys(prev => prev.map(id => id === editingKey.id ? newKey.id : id));

      // Update test data key if exists
      if (testData[editingKey.id] !== undefined) {
        const updatedTestData = { ...testData };
        updatedTestData[newKey.id] = updatedTestData[editingKey.id];
        delete updatedTestData[editingKey.id];
        setTestData(updatedTestData);
      }
    }

    setEditingKey(null);
    setNewKey({ id: "", label: "", example: "", required: false });
    toast.success("Key updated successfully");
  };

  // Delete any key (including custom keys)
  const deleteKey = (keyId) => {
    const key = availableKeys.find(k => k.id === keyId);

    if (window.confirm(`Are you sure you want to delete key "${key.label}"? This action cannot be undone.`)) {
      setAvailableKeys(prev => prev.filter(key => key.id !== keyId));
      setSelectedKeys(prev => prev.filter(id => id !== keyId));

      // Remove from test data if exists
      if (testData[keyId] !== undefined) {
        const updatedTestData = { ...testData };
        delete updatedTestData[keyId];
        setTestData(updatedTestData);
      }

      toast.success(`Key "${key.label}" deleted successfully`);
    }
  };

  // Toggle key selection
  const toggleKey = (keyId) => {
    if (selectedKeys.includes(keyId)) {
      setSelectedKeys(selectedKeys.filter(k => k !== keyId));
    } else {
      setSelectedKeys([...selectedKeys, keyId]);
    }
  };

  // Update test data for any key
  const updateTestDataForKey = (keyId, value) => {
    setTestData({ ...testData, [keyId]: value });
  };

  // Generate raw URL with macros
  const generateRawUrl = () => {
    if (!postbackUrl) return "";

    let url = postbackUrl;
    const params = [];

    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (key) {
        params.push(`${key.id}={${key.id}}`);
      }
    });

    if (includeSubIds) {
      params.push(`sub_ids[affiliate_id]={affiliate_id}`);
    }

    if (params.length > 0) {
      url += (url.includes('?') ? '&' : '?') + params.join('&');
    }

    return url;
  };

  // Generate example URL with sample values
  const generateExampleUrl = () => {
    if (!postbackUrl) return "";

    let url = postbackUrl;
    const params = [];

    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (key && testData[keyId]) {
        params.push(`${key.id}=${encodeURIComponent(testData[keyId])}`);
      }
    });

    if (includeSubIds && testData.affiliate_id) {
      params.push(`sub_ids[affiliate_id]=${encodeURIComponent(testData.affiliate_id)}`);
    }

    if (params.length > 0) {
      url += (url.includes('?') ? '&' : '?') + params.join('&');
    }

    return url;
  };

  // Generate encoded URL
  const generateEncodedUrl = () => {
    if (!postbackUrl) return "";

    let url = postbackUrl;
    const params = [];

    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (key && testData[keyId]) {
        params.push(`${encodeURIComponent(key.id)}=${encodeURIComponent(testData[keyId])}`);
      }
    });

    if (includeSubIds && testData.affiliate_id) {
      params.push(`sub_ids%5Baffiliate_id%5D=${encodeURIComponent(testData.affiliate_id)}`);
    }

    if (params.length > 0) {
      url += (url.includes('?') ? '&' : '?') + params.join('&');
    }

    return url;
  };

  // Generate POST body example
  const generatePostBody = () => {
    const body = {};

    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (key && testData[keyId]) {
        body[key.id] = testData[keyId];
      }
    });

    if (includeSubIds && testData.affiliate_id) {
      body.sub_ids = {
        affiliate: {
          id: testData.affiliate_id
        }
      };
    }

    return JSON.stringify(body, null, 2);
  };

  const getCurrentPreview = () => {
    switch (activeTab) {
      case "raw": return generateRawUrl();
      case "encoded": return generateEncodedUrl();
      default: return generateExampleUrl();
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!postbackUrl) {
      setErrors({ postbackUrl: "Please enter postback URL" });
      return false;
    }
    if (!isValidUrl(postbackUrl)) {
      setErrors({ postbackUrl: "Please enter a valid URL" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSavePostback = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Separate system keys and custom keys (custom keys are those with isCustom flag)
    const customKeys = availableKeys.filter(key => key.isCustom);
    const systemKeys = availableKeys.filter(key => !key.isCustom);

    const payload = {
      postback_url: postbackUrl,
      method: postbackMethod,
      format: postbackFormat,
      selected_keys: selectedKeys,
      include_sub_ids: includeSubIds,
      custom_keys: customKeys,
      // Save all keys (including modified system keys) if needed
      all_keys: availableKeys
    };

    ApiClient.post("affiliate/postback/save", payload).then((res) => {
      if (res?.success) {
        toast.success(res?.message || "Postback URL configured successfully");
        setShowNewPostback(true);
        setTimeout(() => setShowNewPostback(false), 5000);
      } else {
        toast.error(res?.message || "Failed to save configuration");
      }
    }).catch(() => {
      toast.error("Error saving configuration");
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleTestPostback = () => {
    setIsTesting(true);
    setTestResponse(null);

    let testUrl = postbackUrl;
    const payload = {};

    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (key && testData[keyId]) {
        payload[key.id] = testData[keyId];
      }
    });

    if (includeSubIds) {
      payload.sub_ids = {
        affiliate: {
          id: testData.affiliate_id
        }
      };
    }

    if (postbackMethod === "GET") {
      const params = new URLSearchParams();
      Object.keys(payload).forEach(key => {
        if (typeof payload[key] === 'object') {
          params.append(key, JSON.stringify(payload[key]));
        } else {
          params.append(key, payload[key]);
        }
      });
      testUrl += (testUrl.includes('?') ? '&' : '?') + params.toString();

      ApiClient.get(testUrl, {}).then((res) => {
        setTestResponse({ success: true, status: 200, data: res, url: testUrl });
        toast.success("Test postback sent successfully");
      }).catch((error) => {
        setTestResponse({ success: false, status: error.response?.status || 500, error: error.message, url: testUrl });
        toast.error("Test postback failed");
      }).finally(() => setIsTesting(false));

    } else {
      ApiClient.post(testUrl, payload).then((res) => {
        setTestResponse({ success: true, status: 200, data: res, url: testUrl, payload });
        toast.success("Test postback sent successfully");
      }).catch((error) => {
        setTestResponse({ success: false, status: error.response?.status || 500, error: error.message, url: testUrl, payload });
        toast.error("Test postback failed");
      }).finally(() => setIsTesting(false));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <Layout name="Postback URL Configuration">
      <div className="sidebar-left-content">
        <div className="card">
          <div className="card-header">
            <h3 className="link_default m-0">
              <i className="fa fa-exchange link_icon"></i> Postback URL Configuration
            </h3>
          </div>

          <div className="card-body">
            {/* Info Alert */}
            <div className="alert alert-info mb-4">
              <i className="fa fa-info-circle mr-2"></i>
              <strong>Configure Postback Endpoint</strong>
              <p className="mb-0 mt-1">
                Set up the URL where affiliates will send conversion data. Affiliates will send
                event details, order information, and affiliate IDs to track conversions.
              </p>
            </div>

            <div className="row">
              {/* Postback URL Input */}
              <div className="col-12 mb-3">
                <label className="mb-2">
                  Postback URL <span className="star">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.postbackUrl && "is-invalid"}`}
                  value={postbackUrl}
                  onChange={(e) => setPostbackUrl(e.target.value)}
                  placeholder="https://yourdomain.com/api/v1/postback"
                />
                {errors.postbackUrl && (
                  <div className="invalid-feedback d-block">{errors.postbackUrl}</div>
                )}
                <small className="form-text text-muted">
                  The endpoint URL that will receive postback requests from affiliates
                </small>
              </div>

              {/* Request Method & Format */}
              <div className="col-md-6 mb-3">
                <label className="mb-2">Request Method</label>
                <select
                  className="form-select"
                  value={postbackMethod}
                  onChange={(e) => setPostbackMethod(e.target.value)}
                >
                  <option value="POST">POST (Recommended for JSON)</option>
                  <option value="GET">GET (Query Parameters)</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="mb-2">Response Format</label>
                <select
                  className="form-select"
                  value={postbackFormat}
                  onChange={(e) => setPostbackFormat(e.target.value)}
                >
                  <option value="json">JSON Response</option>
                  <option value="text">Plain Text Response</option>
                </select>
              </div>

              {/* Data Fields to Receive - ALL KEYS EDITABLE */}
              <div className="col-12 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="mb-0">Data Fields to Receive</label>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setShowAddKeyForm(true);
                      setEditingKey(null);
                      setNewKey({ id: "", label: "", example: "", required: false });
                    }}
                  >
                    <i className="fa fa-plus mr-1"></i> Add Custom Key
                  </button>
                </div>

                <div className="border rounded p-3">
                  {/* Add/Edit Key Form */}
                  {(showAddKeyForm || editingKey) && (
                    <div className="mb-3 p-3 bg-light rounded border">
                      <h6 className="mb-2">
                        {editingKey ? "Edit Key" : "Add Custom Key"}
                      </h6>
                      <div className="row g-2">
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Key ID (e.g., custom_field)"
                            value={newKey.id}
                            onChange={(e) => setNewKey({ ...newKey, id: e.target.value })}
                            disabled={editingKey && !editingKey.isCustom}
                          />
                          {editingKey && !editingKey.isCustom && (
                            <small className="text-muted">System key ID cannot be changed</small>
                          )}
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Label (e.g., Custom Field)"
                            value={newKey.label}
                            onChange={(e) => setNewKey({ ...newKey, label: e.target.value })}
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Example Value"
                            value={newKey.example}
                            onChange={(e) => setNewKey({ ...newKey, example: e.target.value })}
                          />
                        </div>
                        <div className="col-md-2">
                          <div className="form-check mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="required_key"
                              checked={newKey.required}
                              onChange={(e) => setNewKey({ ...newKey, required: e.target.checked })}
                            />
                            <label className="form-check-label small" htmlFor="required_key">
                              Required
                            </label>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <button
                            className="btn btn-sm btn-success w-100"
                            onClick={editingKey ? updateKey : addCustomKey}
                          >
                            <i className="fa fa-check"></i>
                          </button>
                        </div>
                        <div className="col-md-1">
                          <button
                            className="btn btn-sm btn-secondary w-100"
                            onClick={() => {
                              setShowAddKeyForm(false);
                              setEditingKey(null);
                              setNewKey({ id: "", label: "", example: "", required: false });
                            }}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    {availableKeys.map((key) => (
                      <div className="col-md-4 mb-2" key={key.id}>
                        <div className="d-flex align-items-start">
                          <div className="flex-grow-1">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`key_${key.id}`}
                                checked={selectedKeys.includes(key.id)}
                                onChange={() => toggleKey(key.id)}
                              />
                              <label className="form-check-label" htmlFor={`key_${key.id}`}>
                                {key.label}
                                {key.required && <span className="text-danger ml-1">*</span>}
                                {key.isCustom && <span className="badge bg-info ml-1">Custom</span>}
                              </label>
                              <div className="small text-muted">
                                ID: {key.id} | Example: {key.example}
                              </div>
                            </div>
                          </div>
                          <div className="ms-2">
                            <button
                              className="btn btn-sm btn-link p-0 me-1"
                              onClick={() => editKey(key)}
                              title="Edit"
                            >
                              <i className="fa fa-pencil text-primary"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-link p-0"
                              onClick={() => deleteKey(key.id)}
                              title="Delete"
                            >
                              <i className="fa fa-trash text-danger"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-2" />

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="include_sub_ids"
                      checked={includeSubIds}
                      onChange={(e) => setIncludeSubIds(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="include_sub_ids">
                      Include nested "sub_ids" object
                    </label>
                    <div className="small text-muted">sub_ids.affiliate.id = affiliate_id</div>
                  </div>
                </div>
              </div>

              {/* Test Values for All Selected Keys */}
              {selectedKeys.length > 0 && (
                <div className="col-12 mb-3">
                  <div className="alert alert-secondary">
                    <h6 className="mb-2">Test Values for Selected Keys</h6>
                    <div className="row g-2">
                      {selectedKeys.map(keyId => {
                        const key = availableKeys.find(k => k.id === keyId);
                        if (!key) return null;
                        return (
                          <div className="col-md-4" key={`test_${key.id}`}>
                            <label className="form-label small">{key.label} ({key.id})</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder={`Enter ${key.label}`}
                              value={testData[key.id] || ""}
                              onChange={(e) => updateTestDataForKey(key.id, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Preview URL/Format Section */}
              {postbackUrl && selectedKeys.length > 0 && (
                <div className="col-12 mb-4">
                  <label className="mb-2">Preview URL/Format</label>

                  {/* Tab buttons */}
                  <ul className="nav nav-tabs mb-2">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                      >
                        Preview (Example)
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'raw' ? 'active' : ''}`}
                        onClick={() => setActiveTab('raw')}
                      >
                        Raw (Macros)
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'encoded' ? 'active' : ''}`}
                        onClick={() => setActiveTab('encoded')}
                      >
                        URL Encoded
                      </button>
                    </li>
                  </ul>

                  <div className="border rounded bg-light">
                    <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                      <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                          <div
                            className="font-monospace"
                            style={{
                              fontSize: '13px',
                              wordBreak: 'break-all',
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'monospace',
                              lineHeight: '1.5'
                            }}
                          >
                            {getCurrentPreview()}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => copyToClipboard(getCurrentPreview())}
                          title="Copy to clipboard"
                        >
                          <i className="fa fa-copy"></i>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-white">
                      {activeTab === 'preview' && (
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                          <div>
                            <i className="fa fa-info-circle text-info mr-1"></i>
                            <small className="text-muted">
                              Example with sample values
                            </small>
                          </div>
                          <button
                            className="btn btn-sm btn-link p-0"
                            onClick={() => {
                              const url = generateExampleUrl();
                              window.open(url, '_blank');
                            }}
                          >
                            <i className="fa fa-external-link mr-1"></i> Open in Browser
                          </button>
                        </div>
                      )}

                      {activeTab === 'raw' && (
                        <div>
                          <i className="fa fa-tag text-warning mr-1"></i>
                          <small className="text-muted">
                            Use macros like {"{event}"}, {"{order_id}"}, {"{price}"} that affiliates will replace with actual values
                          </small>
                        </div>
                      )}

                      {activeTab === 'encoded' && (
                        <div>
                          <i className="fa fa-shield text-success mr-1"></i>
                          <small className="text-muted">
                            URL-encoded format for safe transmission over HTTP
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="p-2 bg-light border-top" style={{ fontSize: '12px' }}>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="text-muted">Parameters included:</span>
                        {selectedKeys.map(keyId => {
                          const key = availableKeys.find(k => k.id === keyId);
                          return key ? (
                            <span key={keyId} className="badge bg-secondary">
                              {key.id}
                            </span>
                          ) : null;
                        })}
                        {includeSubIds && (
                          <span className="badge bg-info">sub_ids[affiliate_id]</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Postback Endpoint Section */}
              {postbackUrl && (
                <div className="col-12 mb-3">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fa fa-flask mr-2"></i> Test Your Postback Endpoint
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-2">
                        <div className="col-md-10">
                          <div className="text-muted small">
                            Using test values from above. Click Test to send a real request.
                          </div>
                        </div>
                        <div className="col-md-2">
                          <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={handleTestPostback}
                            disabled={isTesting}
                          >
                            {isTesting ? (
                              <><i className="fa fa-spinner fa-spin mr-1"></i> Testing</>
                            ) : (
                              <><i className="fa fa-play mr-1"></i> Test Postback</>
                            )}
                          </button>
                        </div>
                      </div>

                      {testResponse && (
                        <div className={`alert mt-3 ${testResponse.success ? 'alert-success' : 'alert-danger'} mb-0`}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>
                                {testResponse.success ? (
                                  <><i className="fa fa-check-circle mr-1"></i> Success</>
                                ) : (
                                  <><i className="fa fa-times-circle mr-1"></i> Failed</>
                                )}
                              </strong>
                              <div className="small mt-1">
                                Status: {testResponse.status}
                              </div>
                              {!testResponse.success && testResponse.error && (
                                <div className="small mt-1 text-danger">
                                  Error: {testResponse.error}
                                </div>
                              )}
                            </div>
                            <button
                              className="btn btn-sm btn-link"
                              onClick={() => copyToClipboard(testResponse.url)}
                            >
                              <i className="fa fa-copy"></i> Copy URL
                            </button>
                          </div>
                          {testResponse.payload && (
                            <div className="mt-2">
                              <small className="text-muted">Payload sent:</small>
                              <pre className="small mt-1 mb-0 p-2 bg-light rounded" style={{ fontSize: '11px' }}>
                                {JSON.stringify(testResponse.payload, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="text-end mt-3">
              <button
                className="btn btn-primary"
                onClick={handleSavePostback}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><i className="fa fa-spinner fa-spin mr-1"></i> Saving...</>
                ) : (
                  <><i className="fa fa-save mr-1"></i> Save Configuration</>
                )}
              </button>
            </div>

            {/* Success Message */}
            {showNewPostback && (
              <div className="alert alert-success mt-3">
                <i className="fa fa-check-circle mr-2"></i>
                Postback URL configured successfully! Affiliates can now use this endpoint.
              </div>
            )}

            {/* Copy Notification */}
            {copied && (
              <div className="position-fixed bottom-0 end-0 m-3 p-2 bg-success text-white rounded shadow">
                <i className="fa fa-check mr-1"></i> Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostbackUrlManager;
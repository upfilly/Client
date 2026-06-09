import React, { useEffect, useState } from "react";
import Layout from "../components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import { toast } from "react-toastify";
import "./style.scss";

const defaultKeys = [
  { id: "event", label: "Event type", required: false, example: "PageView", value: "{event}" },
  { id: "order_id", label: "Order ID", required: false, example: "6622719967345", value: "{order_id}" },
  { id: "price", label: "Price", required: false, example: "1120.94", value: "{price}" },
  { id: "currency", label: "Currency", required: false, example: "INR", value: "{currency}" },
  { id: "timestamp", label: "Timestamp", required: false, example: "2026-05-27T06:48:03Z", value: "{timestamp}" },
  { id: "affiliate_id", label: "Affiliate ID", required: false, example: "68d114d31ac79315333822ab", value: "{affiliate_id}" },
  { id: "campaign_id", label: "Campaign ID", required: false, example: "camp_123", value: "{campaign_id}" },
  { id: "brand_id", label: "Brand ID", required: false, example: "brand_456", value: "{brand_id}" },
  { id: "params_affiliate", label: "Params affiliate", required: false, example: "68d114d31ac79315333822ab", value: "{params_affiliate}" },
];

const PostbackUrlManager = () => {
  const [postbackUrl, setPostbackUrl] = useState("");
  const [postbackMethod, setPostbackMethod] = useState("POST");
  const [postbackFormat, setPostbackFormat] = useState("json");
  const [availableKeys, setAvailableKeys] = useState(defaultKeys.map(k => ({ ...k, isCustom: false })));
  const [selectedKeys, setSelectedKeys] = useState(["event", "order_id", "price", "currency", "affiliate_id"]);
  const [includeSubIds, setIncludeSubIds] = useState(true);
  const [existingConfigId, setExistingConfigId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [errors, setErrors] = useState({});

  // Add / Edit key form
  const [showAddKeyForm, setShowAddKeyForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [newKey, setNewKey] = useState({ id: "", label: "", example: "", required: false });

  // Test
  const [testData, setTestData] = useState({
    event: "PageView",
    order_id: "TEST_ORDER_001",
    price: "99.99",
    currency: "USD",
    affiliate_id: "aff_test_123",
  });
  const [testResponse, setTestResponse] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => { fetchPostbackConfig(); }, []);

  const fetchPostbackConfig = () => {
    ApiClient.get("postback-url/my").then((res) => {
      if (res.success && res.data) {
        setPostbackUrl(res.data.postback_url || "");
        setPostbackMethod(res.data.method || "POST");
        setPostbackFormat(res.data.format || "json");
        setSelectedKeys(res.data.selected_keys || ["event", "order_id", "price", "currency", "affiliate_id"]);
        setIncludeSubIds(res.data.include_sub_ids ?? true);
        setExistingConfigId(res.data.id || null);
        if (res.data.custom_keys?.length) {
          setAvailableKeys(prev => {
            const existingIds = new Set(prev.map(k => k.id));
            const newCustomKeys = res.data.custom_keys.filter(k => !existingIds.has(k.id));
            return [...prev, ...newCustomKeys];
          });
        }
      }
    });
  };

  const isValidUrl = (url) => { try { new URL(url); return true; } catch { return false; } };

  const validateForm = () => {
    if (!postbackUrl) { setErrors({ postbackUrl: "Please enter a postback URL" }); return false; }
    if (!isValidUrl(postbackUrl)) { setErrors({ postbackUrl: "Please enter a valid URL" }); return false; }
    setErrors({});
    return true;
  };

  const toggleKey = (keyId) => {
    setSelectedKeys(prev =>
      prev.includes(keyId) ? prev.filter(k => k !== keyId) : [...prev, keyId]
    );
  };

  const addCustomKey = () => {
    if (!newKey.id || !newKey.label) { toast.error("Field ID and label are required"); return; }
    if (availableKeys.some(k => k.id === newKey.id)) { toast.error("Field ID already exists"); return; }
    setAvailableKeys(prev => [...prev, { ...newKey, value: `{${newKey.id}}`, isCustom: true }]);
    resetKeyForm();
    toast.success("Custom field added");
  };

  const updateKey = () => {
    if (!newKey.id || !newKey.label) { toast.error("Field ID and label are required"); return; }
    if (newKey.id !== editingKey.id && availableKeys.some(k => k.id === newKey.id)) {
      toast.error("Field ID already exists"); return;
    }
    const updated = { ...editingKey, ...newKey, value: `{${newKey.id}}` };
    setAvailableKeys(prev => prev.map(k => k.id === editingKey.id ? updated : k));
    if (editingKey.id !== newKey.id) {
      setSelectedKeys(prev => prev.map(id => id === editingKey.id ? newKey.id : id));
      if (testData[editingKey.id] !== undefined) {
        setTestData(prev => { const d = { ...prev }; d[newKey.id] = d[editingKey.id]; delete d[editingKey.id]; return d; });
      }
    }
    resetKeyForm();
    toast.success("Field updated");
  };

  const deleteKey = (keyId) => {
    const key = availableKeys.find(k => k.id === keyId);
    if (!window.confirm(`Delete field "${key.label}"?`)) return;
    setAvailableKeys(prev => prev.filter(k => k.id !== keyId));
    setSelectedKeys(prev => prev.filter(id => id !== keyId));
    setTestData(prev => { const d = { ...prev }; delete d[keyId]; return d; });
    toast.success(`"${key.label}" removed`);
  };

  const editKey = (key) => {
    setEditingKey(key);
    setNewKey({ id: key.id, label: key.label, example: key.example || "", required: key.required || false });
    setShowAddKeyForm(true);
  };

  const resetKeyForm = () => {
    setShowAddKeyForm(false);
    setEditingKey(null);
    setNewKey({ id: "", label: "", example: "", required: false });
  };

  const buildParams = (useValues = false, encode = false) => {
    const params = [];
    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (!key) return;
      if (useValues) {
        const val = testData[keyId] || "";
        params.push(`${encode ? encodeURIComponent(keyId) : keyId}=${encode ? encodeURIComponent(val) : val}`);
      } else {
        params.push(`${keyId}={${keyId}}`);
      }
    });
    if (includeSubIds) {
      if (useValues && testData.affiliate_id) {
        const v = encodeURIComponent(testData.affiliate_id);
        params.push(encode ? `sub_ids%5Baffiliate_id%5D=${v}` : `sub_ids[affiliate_id]=${v}`);
      } else if (!useValues) {
        params.push(`sub_ids[affiliate_id]={affiliate_id}`);
      }
    }
    return params;
  };

  const buildUrl = (params) => {
    if (!postbackUrl) return "";
    const qs = params.join("&");
    return qs ? `${postbackUrl}${postbackUrl.includes("?") ? "&" : "?"}${qs}` : postbackUrl;
  };

  const getCurrentPreview = () => {
    if (activeTab === "raw") return buildUrl(buildParams(false));
    if (activeTab === "encoded") return buildUrl(buildParams(true, true));
    return buildUrl(buildParams(true));
  };

  const handleSavePostback = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    const payload = {
      postback_url: postbackUrl,
      method: postbackMethod,
      format: postbackFormat,
      selected_keys: selectedKeys,
      include_sub_ids: includeSubIds,
      custom_keys: availableKeys.filter(k => k.isCustom),
      all_keys: availableKeys,
    };
    const req = existingConfigId
      ? ApiClient.put("postback-url/update", { ...payload, id: existingConfigId })
      : ApiClient.post("postback-url/add", payload);
    req
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "Configuration saved");
          if (!existingConfigId && res.data?.id) setExistingConfigId(res.data.id);
        } else {
          toast.error(res?.message || "Failed to save configuration");
        }
      })
      .catch((err) => toast.error(err?.response?.data?.message || "Error saving configuration"))
      .finally(() => setIsSubmitting(false));
  };

  const handleTestPostback = () => {
    setIsTesting(true);
    setTestResponse(null);
    const payload = {};
    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (key && testData[keyId]) payload[key.id] = testData[keyId];
    });
    if (includeSubIds) payload.sub_ids = { affiliate: { id: testData.affiliate_id } };

    const req = postbackMethod === "GET"
      ? ApiClient.get(`${postbackUrl}?${new URLSearchParams(Object.entries(payload).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : v]))}`, {})
      : ApiClient.post(postbackUrl, payload);

    req
      .then(res => { setTestResponse({ success: true, status: 200, data: res, payload }); toast.success("Test request sent"); })
      .catch(err => { setTestResponse({ success: false, status: err.response?.status || 500, error: err.message, payload }); toast.error("Test request failed"); })
      .finally(() => setIsTesting(false));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const tabHint = {
    preview: "Example with test values",
    raw: "Macro tokens — affiliates replace these with actual values",
    encoded: "URL-encoded format for safe HTTP transmission",
  };

  const showPreview = postbackUrl && selectedKeys.length > 0;

  return (
    <Layout name="Postback URL Configuration">
      <div className="pbm-page">

        {/* Info banner */}
        <div className="pbm-banner">
          <i className="fa fa-info-circle pbm-banner__icon" />
          <div>
            <strong>Configure your postback endpoint</strong>
            <p>Set up the URL where affiliates send conversion data. Choose which fields to include, preview the request, and test the connection before saving.</p>
          </div>
        </div>

        {/* ── Section: Endpoint ── */}
        <div className="pbm-card">
          <p className="pbm-section-label">Endpoint</p>

          <div className="pbm-field">
            <label htmlFor="pbUrl">Postback URL <span className="pbm-required">*</span></label>
            <input
              id="pbUrl"
              type="text"
              className={`pbm-input${errors.postbackUrl ? " pbm-input--error" : ""}`}
              value={postbackUrl}
              onChange={e => { setPostbackUrl(e.target.value); setErrors({}); }}
              placeholder="https://yourdomain.com/api/v1/postback"
            />
            {errors.postbackUrl && <div className="pbm-field__error">{errors.postbackUrl}</div>}
            <div className="pbm-field__hint">The endpoint that receives postback requests from affiliates</div>
          </div>

          <div className="pbm-row2">
            <div className="pbm-field">
              <label htmlFor="pbMethod">Request method</label>
              <select id="pbMethod" className="pbm-select" value={postbackMethod} onChange={e => setPostbackMethod(e.target.value)}>
                <option value="POST">POST — recommended for JSON</option>
                <option value="GET">GET — query parameters</option>
              </select>
            </div>
            <div className="pbm-field">
              <label htmlFor="pbFormat">Response format</label>
              <select id="pbFormat" className="pbm-select" value={postbackFormat} onChange={e => setPostbackFormat(e.target.value)}>
                <option value="json">JSON</option>
                <option value="text">Plain text</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Section: Data fields ── */}
        <div className="pbm-card">
          <div className="pbm-toolbar">
            <p className="pbm-section-label" style={{ margin: 0 }}>Data fields</p>
            <button
              className="pbm-btn pbm-btn--sm"
              onClick={() => { resetKeyForm(); setShowAddKeyForm(true); }}
            >
              <i className="fa fa-plus" /> Add field
            </button>
          </div>

          {/* Add / Edit form */}
          {showAddKeyForm && (
            <div className="pbm-key-form">
              <p className="pbm-key-form__title">{editingKey ? "Edit field" : "Add custom field"}</p>
              <div className="pbm-key-form__row">
                <div className="pbm-field">
                  <label>Field ID</label>
                  <input
                    type="text"
                    className="pbm-input pbm-input--sm"
                    placeholder="custom_field"
                    value={newKey.id}
                    onChange={e => setNewKey({ ...newKey, id: e.target.value })}
                    disabled={editingKey && !editingKey.isCustom}
                  />
                  {editingKey && !editingKey.isCustom && (
                    <div className="pbm-field__hint">System field IDs cannot be changed</div>
                  )}
                </div>
                <div className="pbm-field">
                  <label>Label</label>
                  <input
                    type="text"
                    className="pbm-input pbm-input--sm"
                    placeholder="My Custom Field"
                    value={newKey.label}
                    onChange={e => setNewKey({ ...newKey, label: e.target.value })}
                  />
                </div>
                <div className="pbm-field">
                  <label>Example value</label>
                  <input
                    type="text"
                    className="pbm-input pbm-input--sm"
                    placeholder="example_123"
                    value={newKey.example}
                    onChange={e => setNewKey({ ...newKey, example: e.target.value })}
                  />
                </div>
                <div className="pbm-field pbm-field--check">
                  <label className="pbm-checkbox">
                    <input
                      type="checkbox"
                      checked={newKey.required}
                      onChange={e => setNewKey({ ...newKey, required: e.target.checked })}
                    />
                    Required
                  </label>
                </div>
                <div className="pbm-key-form__actions">
                  <button className="pbm-btn pbm-btn--sm pbm-btn--primary" onClick={editingKey ? updateKey : addCustomKey}>
                    <i className="fa fa-check" />
                  </button>
                  <button className="pbm-btn pbm-btn--sm" onClick={resetKeyForm}>
                    <i className="fa fa-times" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Keys grid */}
          <div className="pbm-keys-grid">
            {availableKeys.map(key => {
              const sel = selectedKeys.includes(key.id);
              return (
                <div
                  key={key.id}
                  className={`pbm-key-item${sel ? " pbm-key-item--selected" : ""}`}
                  onClick={() => toggleKey(key.id)}
                >
                  <div className={`pbm-key-check${sel ? " pbm-key-check--checked" : ""}`}>
                    {sel && <i className="fa fa-check" />}
                  </div>
                  <div className="pbm-key-body">
                    <div className="pbm-key-label">
                      {key.label}
                      {key.required && <span className="pbm-required"> *</span>}
                      {key.isCustom && <span className="pbm-badge pbm-badge--custom">custom</span>}
                    </div>
                    <div className="pbm-key-id">{`{${key.id}}`}</div>
                  </div>
                  <div className="pbm-key-actions" onClick={e => e.stopPropagation()}>
                    <button className="pbm-icon-btn" title="Edit" onClick={() => editKey(key)}>
                      <i className="fa fa-pencil" />
                    </button>
                    <button className="pbm-icon-btn pbm-icon-btn--danger" title="Delete" onClick={() => deleteKey(key.id)}>
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sub IDs toggle */}
          <div className="pbm-divider" />
          <label className="pbm-checkbox pbm-checkbox--row">
            <input
              type="checkbox"
              checked={includeSubIds}
              onChange={e => setIncludeSubIds(e.target.checked)}
            />
            Include <code>sub_ids</code> object
            <span className="pbm-field__hint" style={{ marginLeft: 8 }}>sub_ids.affiliate.id = affiliate_id</span>
          </label>
        </div>

        {/* ── Section: Test values ── */}
        {selectedKeys.length > 0 && (
          <div className="pbm-card">
            <p className="pbm-section-label">Test values</p>
            <div className="pbm-test-grid">
              {selectedKeys.map(keyId => {
                const key = availableKeys.find(k => k.id === keyId);
                if (!key) return null;
                return (
                  <div className="pbm-field" key={`td_${keyId}`}>
                    <label htmlFor={`td_${keyId}`}>
                      {key.label} <span className="pbm-field__code">({key.id})</span>
                    </label>
                    <input
                      id={`td_${keyId}`}
                      type="text"
                      className="pbm-input pbm-input--sm pbm-input--mono"
                      placeholder={key.example || key.id}
                      value={testData[keyId] || ""}
                      onChange={e => setTestData({ ...testData, [keyId]: e.target.value })}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Section: Preview ── */}
        {showPreview && (
          <div className="pbm-card">
            <p className="pbm-section-label">Preview</p>

            {/* Tabs */}
            <div className="pbm-tabs">
              {["preview", "raw", "encoded"].map(t => (
                <button
                  key={t}
                  className={`pbm-tab${activeTab === t ? " pbm-tab--active" : ""}`}
                  onClick={() => setActiveTab(t)}
                >
                  {{ preview: "Example", raw: "Macros", encoded: "Encoded" }[t]}
                </button>
              ))}
            </div>

            <div className="pbm-preview-box">
              <div className="pbm-preview-content">
                <span>{getCurrentPreview()}</span>
                <button
                  className="pbm-icon-btn pbm-icon-btn--copy"
                  title="Copy"
                  onClick={() => copyToClipboard(getCurrentPreview())}
                >
                  <i className="fa fa-copy" />
                </button>
              </div>
              <div className="pbm-preview-footer">
                <span className="pbm-field__hint">{tabHint[activeTab]}</span>
                {activeTab === "preview" && (
                  <button
                    className="pbm-btn pbm-btn--ghost"
                    onClick={() => window.open(getCurrentPreview(), "_blank")}
                  >
                    <i className="fa fa-external-link" /> Open in browser
                  </button>
                )}
              </div>
              <div className="pbm-param-badges">
                {selectedKeys.map(keyId => (
                  <span key={keyId} className="pbm-badge">{keyId}</span>
                ))}
                {includeSubIds && <span className="pbm-badge pbm-badge--info">sub_ids</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Section: Test request ── */}
        {postbackUrl && (
          <div className="pbm-card">
            <div className="pbm-toolbar">
              <div>
                <p className="pbm-section-label" style={{ margin: 0 }}>Test request</p>
                <div className="pbm-field__hint" style={{ marginTop: 2 }}>
                  Sends a live request using the test values above
                </div>
              </div>
              <button
                className="pbm-btn pbm-btn--primary"
                onClick={handleTestPostback}
                disabled={isTesting}
              >
                {isTesting
                  ? <><i className="fa fa-spinner fa-spin" /> Testing…</>
                  : <><i className="fa fa-play" /> Send test</>}
              </button>
            </div>

            {testResponse && (
              <div className={`pbm-test-result pbm-test-result--${testResponse.success ? "ok" : "fail"}`}>
                <div className="pbm-test-result__title">
                  <i className={`fa fa-${testResponse.success ? "check-circle" : "times-circle"}`} />
                  {testResponse.success ? "Request succeeded" : "Request failed"} — {testResponse.status}
                </div>
                {!testResponse.success && testResponse.error && (
                  <div className="pbm-test-result__error">{testResponse.error}</div>
                )}
                {testResponse.payload && (
                  <div className="pbm-test-result__payload">
                    <div className="pbm-field__hint">Payload sent:</div>
                    <pre>{JSON.stringify(testResponse.payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="pbm-footer">
          <button
            className="pbm-btn pbm-btn--primary"
            onClick={handleSavePostback}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><i className="fa fa-spinner fa-spin" /> Saving…</>
              : <><i className="fa fa-save" /> Save configuration</>}
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default PostbackUrlManager;
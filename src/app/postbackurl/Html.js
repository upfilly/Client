import React, { useEffect, useState } from "react";
import Layout from "../components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import { toast } from "react-toastify";
import "./style.scss";

const defaultKeys = [
  { id: "event", label: "Event type", required: false, example: "PageView", value: "{event}", systemField: "event", affiliateField: "" },
  { id: "order_id", label: "Order ID", required: false, example: "6622719967345", value: "{order_id}", systemField: "order_id", affiliateField: "" },
  { id: "price", label: "Price", required: false, example: "1120.94", value: "{price}", systemField: "price", affiliateField: "" },
  { id: "currency", label: "Currency", required: false, example: "INR", value: "{currency}", systemField: "currency", affiliateField: "" },
  { id: "timestamp", label: "Timestamp", required: false, example: "2026-05-27T06:48:03Z", value: "{timestamp}", systemField: "timestamp", affiliateField: "" },
  { id: "affiliate_id", label: "Affiliate ID", required: false, example: "68d114d31ac79315333822ab", value: "{affiliate_id}", systemField: "affiliate_id", affiliateField: "" },
  { id: "campaign_id", label: "Campaign ID", required: false, example: "camp_123", value: "{campaign_id}", systemField: "campaign_id", affiliateField: "" },
  { id: "brand_id", label: "Brand ID", required: false, example: "brand_456", value: "{brand_id}", systemField: "brand_id", affiliateField: "" },
  { id: "params_affiliate", label: "Params affiliate", required: false, example: "68d114d31ac79315333822ab", value: "{params_affiliate}", systemField: "params_affiliate", affiliateField: "" },
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
  const [showAffiliateDocs, setShowAffiliateDocs] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [showFieldMapping, setShowFieldMapping] = useState(true);

  // Add / Edit key form
  const [showAddKeyForm, setShowAddKeyForm] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [newKey, setNewKey] = useState({ id: "", label: "", example: "", required: false, affiliateField: "" });

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

        // Load keys with affiliateField from all_keys
        if (res.data.all_keys?.length) {
          setAvailableKeys(res.data.all_keys);
        }
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

  // Update affiliate field mapping directly in availableKeys
  const updateAffiliateField = (systemField, affiliateField) => {
    setAvailableKeys(prev => prev.map(key =>
      key.id === systemField
        ? { ...key, affiliateField: affiliateField || "" }
        : key
    ));
  };

  const addCustomKey = () => {
    if (!newKey.id || !newKey.label) { toast.error("Field ID and label are required"); return; }
    if (availableKeys.some(k => k.id === newKey.id)) { toast.error("Field ID already exists"); return; }

    const newCustomKey = {
      ...newKey,
      value: `{${newKey.id}}`,
      isCustom: true,
      systemField: newKey.id,
      affiliateField: newKey.affiliateField || "" // Store affiliate field directly
    };

    setAvailableKeys(prev => [...prev, newCustomKey]);
    resetKeyForm();
    toast.success("Custom field added");
  };

  const updateKey = () => {
    if (!newKey.id || !newKey.label) { toast.error("Field ID and label are required"); return; }
    if (newKey.id !== editingKey.id && availableKeys.some(k => k.id === newKey.id)) {
      toast.error("Field ID already exists"); return;
    }

    // Update the key with all fields including affiliateField
    const updated = {
      ...editingKey,
      id: newKey.id,
      label: newKey.label,
      example: newKey.example,
      required: newKey.required,
      affiliateField: newKey.affiliateField || "", // Save affiliate field
      value: `{${newKey.id}}`,
      systemField: newKey.id
    };

    setAvailableKeys(prev => prev.map(k => k.id === editingKey.id ? updated : k));

    // Update selected keys if ID changed
    if (editingKey.id !== newKey.id) {
      setSelectedKeys(prev => prev.map(id => id === editingKey.id ? newKey.id : id));
      if (testData[editingKey.id] !== undefined) {
        setTestData(prev => {
          const d = { ...prev };
          d[newKey.id] = d[editingKey.id];
          delete d[editingKey.id];
          return d;
        });
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
    setNewKey({
      id: key.id,
      label: key.label,
      example: key.example || "",
      required: key.required || false,
      affiliateField: key.affiliateField || "" // Load affiliate field from the key
    });
    setShowAddKeyForm(true);
  };

  const resetKeyForm = () => {
    setShowAddKeyForm(false);
    setEditingKey(null);
    setNewKey({ id: "", label: "", example: "", required: false, affiliateField: "" });
  };

  // Get the parameter name for a key (use affiliateField if exists, otherwise use id)
  const getParamName = (key) => {
    return key.affiliateField && key.affiliateField.trim() ? key.affiliateField : key.id;
  };

  // Build params using availableKeys data
  const buildParams = (useValues = false, encode = false) => {
    const params = [];
    selectedKeys.forEach(keyId => {
      const key = availableKeys.find(k => k.id === keyId);
      if (!key) return;

      // Get parameter name from key (affiliateField or id)
      const paramName = getParamName(key);

      if (useValues) {
        const val = testData[key.id] || "";
        params.push(`${encode ? encodeURIComponent(paramName) : paramName}=${encode ? encodeURIComponent(val) : val}`);
      } else {
        // For macro template, use the parameter name as the macro
        params.push(`${paramName}={${paramName}}`);
      }
    });

    if (includeSubIds) {
      const affiliateKey = availableKeys.find(k => k.id === 'affiliate_id');
      const affiliateParamName = affiliateKey ? getParamName(affiliateKey) : 'affiliate_id';
      const subIdParam = `sub_ids[${affiliateParamName}]`;

      if (useValues && testData.affiliate_id) {
        const v = encodeURIComponent(testData.affiliate_id);
        params.push(encode ? `${encodeURIComponent(subIdParam)}=${v}` : `${subIdParam}=${v}`);
      } else if (!useValues) {
        params.push(`${subIdParam}={${affiliateParamName}}`);
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

  const getMacroTemplate = () => {
    return buildUrl(buildParams(false));
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
      all_keys: availableKeys, // Save all keys with affiliateField
      custom_keys: availableKeys.filter(k => k.isCustom),
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
      if (key && testData[key.id]) {
        const paramName = getParamName(key);
        payload[paramName] = testData[key.id];
      }
    });

    if (includeSubIds) {
      const affiliateKey = availableKeys.find(k => k.id === 'affiliate_id');
      const affiliateParamName = affiliateKey ? getParamName(affiliateKey) : 'affiliate_id';
      payload[`sub_ids[${affiliateParamName}]`] = testData.affiliate_id;
    }

    const req = postbackMethod === "GET"
      ? ApiClient.get(`${postbackUrl}?${new URLSearchParams(payload)}`, {})
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

  const getAffiliateInstructions = () => {
    const macroUrl = getMacroTemplate();
    const exampleUrl = getCurrentPreview();

    return {
      macroUrl,
      exampleUrl,
      parameters: selectedKeys.map(keyId => {
        const key = availableKeys.find(k => k.id === keyId);
        const paramName = getParamName(key);
        return {
          systemField: keyId,
          paramName,
          label: key?.label,
          required: key?.required,
          example: testData[keyId] || key?.example,
          description: key?.label
        };
      })
    };
  };

  const getCodeExample = (language) => {
    const { macroUrl, parameters } = getAffiliateInstructions();
    const paramsObj = {};
    parameters.forEach(p => {
      paramsObj[p.paramName] = p.example || `YOUR_${p.paramName.toUpperCase()}`;
    });

    switch (language) {
      case 'javascript':
        return `// JavaScript / Node.js
const postbackURL = '${macroUrl}';
const params = new URLSearchParams({
${parameters.map(p => `  ${p.paramName}: '${paramsObj[p.paramName]}'`).join(',\n')}
});

// Make the request
fetch(postbackURL + '?' + params)
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));`;

      case 'php':
        return `// PHP
$postback_url = '${macroUrl}';
$params = http_build_query([
${parameters.map(p => `  '${p.paramName}' => '${paramsObj[p.paramName]}'`).join(',\n')}
]);

// Make the request
$ch = curl_init($postback_url . '?' . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);`;

      case 'python':
        return `# Python
import requests

postback_url = '${macroUrl}'
params = {
${parameters.map(p => `    '${p.paramName}': '${paramsObj[p.paramName]}'`).join(',\n')}
}

# Make the request
response = requests.get(postback_url, params=params)
print(response.json())`;

      case 'curl':
        return `# cURL
curl "${macroUrl}" \\
${parameters.map(p => `  -G \\
  -d "${p.paramName}=${paramsObj[p.paramName]}"`).join(' \\\n')}`;

      case 'ruby':
        return `# Ruby
require 'net/http'
require 'uri'

uri = URI('${macroUrl}')
params = {
${parameters.map(p => `  ${p.paramName}: '${paramsObj[p.paramName]}'`).join(',\n')}
}
uri.query = URI.encode_www_form(params)

response = Net::HTTP.get_response(uri)
puts response.body`;

      default:
        return '';
    }
  };

  const tabHint = {
    preview: "Example with test values - shows how the URL looks with actual data",
    raw: "Macro tokens template - affiliates replace {macros} with their actual values",
    encoded: "URL-encoded format for safe HTTP transmission",
  };

  const showPreview = postbackUrl && selectedKeys.length > 0;
  const instructions = getAffiliateInstructions();

  return (
    <Layout name="Postback URL Configuration">
      <div className="pbm-page">

        {/* Info banner */}
        <div className="pbm-banner">
          <i className="fa fa-info-circle pbm-banner__icon" />
          <div>
            <strong>Configure your postback endpoint</strong>
            <p>Set up the URL where affiliates send conversion data. You can map affiliate's field names to your system fields.</p>
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

        {/* ── Section: Data fields with field mapping ── */}
        <div className="pbm-card">
          <div className="pbm-toolbar">
            <p className="pbm-section-label" style={{ margin: 0 }}>Data fields</p>
            <div>
              <button
                className="pbm-btn pbm-btn--sm"
                onClick={() => setShowFieldMapping(!showFieldMapping)}
                style={{ marginRight: '8px' }}
              >
                <i className="fa fa-exchange" /> {showFieldMapping ? 'Hide' : 'Show'} Field Mapping
              </button>
              <button
                className="pbm-btn pbm-btn--sm"
                onClick={() => { resetKeyForm(); setShowAddKeyForm(true); }}
              >
                <i className="fa fa-plus" /> Add field
              </button>
            </div>
          </div>

          {/* Field Mapping Info */}
          {showFieldMapping && (
            <div className="pbm-mapping-info">
              <div className="pbm-alert pbm-alert--info" style={{ marginBottom: '16px' }}>
                <i className="fa fa-info-circle" />
                <div>
                  <strong>Field Mapping</strong>
                  <p>If your affiliates use different parameter names than your system, you can map their field names to your system fields below. Leave empty to use the default field name.</p>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit form */}
          {showAddKeyForm && (
            <div className="pbm-key-form">
              <p className="pbm-key-form__title">{editingKey ? "Edit field" : "Add custom field"}</p>
              <div className="pbm-key-form__row">
                <div className="pbm-field">
                  <label>Field ID (System)</label>
                  <input
                    type="text"
                    className="pbm-input pbm-input--sm"
                    placeholder="custom_field"
                    value={newKey.id}
                    onChange={e => setNewKey({ ...newKey, id: e.target.value })}
                    disabled={editingKey && !editingKey.isCustom}
                  />
                  <div className="pbm-field__hint">Internal system field name</div>
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

              {/* Affiliate Field Mapping input */}
              <div className="pbm-field" style={{ marginTop: '12px' }}>
                <label>Affiliate's Field Name (Optional)</label>
                <input
                  type="text"
                  className="pbm-input pbm-input--sm"
                  placeholder="e.g., transaction_id, user_id, custom_param"
                  value={newKey.affiliateField}
                  onChange={e => setNewKey({ ...newKey, affiliateField: e.target.value })}
                />
                <div className="pbm-field__hint">
                  {editingKey
                    ? "If your affiliate uses a different name for this field, specify it here. This will map their field name to your system field."
                    : "Optional: Specify what field name affiliates should use for this parameter"}
                </div>
              </div>
            </div>
          )}

          {/* Keys grid with mapping inputs */}
          <div className="pbm-keys-grid">
            {availableKeys.map(key => {
              const sel = selectedKeys.includes(key.id);
              const paramName = getParamName(key);
              const hasMapping = key.affiliateField && key.affiliateField.trim();

              return (
                <div
                  key={key.id}
                  className={`pbm-key-item${sel ? " pbm-key-item--selected" : ""}`}
                >
                  <div
                    className={`pbm-key-check${sel ? " pbm-key-check--checked" : ""}`}
                    onClick={() => toggleKey(key.id)}
                  >
                    {sel && <i className="fa fa-check" />}
                  </div>
                  <div className="pbm-key-body" style={{ flex: 2 }}>
                    <div className="pbm-key-label">
                      {key.label}
                      {key.required && <span className="pbm-required"> *</span>}
                      {key.isCustom && <span className="pbm-badge pbm-badge--custom">custom</span>}
                    </div>
                    <div className="pbm-key-id">
                      System: {'{'}{key.id}{'}'}
                      {hasMapping && (
                        <span className="pbm-mapping-badge">
                          <i className="fa fa-long-arrow-right" /> Affiliate: {'{'}{paramName}{'}'}
                        </span>
                      )}
                    </div>

                    {/* Show current mapping if it exists */}
                    {hasMapping && (
                      <div className="pbm-current-mapping">
                        <i className="fa fa-exchange" style={{ fontSize: 10, marginRight: 4 }} />
                        <span>Affiliate sends as: <code>{key.affiliateField}</code></span>
                      </div>
                    )}

                    {/* Inline mapping input when field mapping is shown */}
                    {showFieldMapping && sel && (
                      <div className="pbm-mapping-input">
                        <input
                          type="text"
                          className="pbm-input pbm-input--sm pbm-input--mapping"
                          placeholder="Affiliate's field name (optional)"
                          value={key.affiliateField || ""}
                          onChange={(e) => updateAffiliateField(key.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                        <div className="pbm-field__hint" style={{ marginTop: 4 }}>
                          {key.affiliateField
                            ? `Affiliates will send as: ${key.affiliateField}`
                            : "Leave empty to use system field name"}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pbm-key-actions" onClick={e => e.stopPropagation()}>
                    <button
                      className="pbm-icon-btn"
                      title="Edit"
                      onClick={() => editKey(key)}
                    >
                      <i className="fa fa-pencil" />
                    </button>
                    <button
                      className="pbm-icon-btn pbm-icon-btn--danger"
                      title="Delete"
                      onClick={() => deleteKey(key.id)}
                      disabled={!key.isCustom}
                    >
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
            <span className="pbm-field__hint" style={{ marginLeft: 8 }}>
              {(() => {
                const affiliateKey = availableKeys.find(k => k.id === 'affiliate_id');
                const paramName = affiliateKey ? getParamName(affiliateKey) : 'affiliate_id';
                return `sub_ids[${paramName}] = affiliate_id`;
              })()}
            </span>
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
                const paramName = getParamName(key);
                return (
                  <div className="pbm-field" key={`td_${keyId}`}>
                    <label htmlFor={`td_${keyId}`}>
                      {key.label}
                      <span className="pbm-field__code">
                        ({paramName})
                      </span>
                    </label>
                    <input
                      id={`td_${keyId}`}
                      type="text"
                      className="pbm-input pbm-input--sm pbm-input--mono"
                      placeholder={key.example || keyId}
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
                {selectedKeys.map(keyId => {
                  const key = availableKeys.find(k => k.id === keyId);
                  const paramName = getParamName(key);
                  return (
                    <span key={keyId} className="pbm-badge" title={`System field: ${keyId}`}>
                      {paramName}
                      {key?.affiliateField && <i className="fa fa-long-arrow-right" style={{ marginLeft: 4, fontSize: 10 }} />}
                    </span>
                  );
                })}
                {includeSubIds && <span className="pbm-badge pbm-badge--info">sub_ids</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Section: Affiliate Instructions ── */}
        {showPreview && (
          <div className="pbm-card">
            <div className="pbm-toolbar">
              <div>
                <p className="pbm-section-label" style={{ margin: 0 }}>📋 Affiliate Integration Guide</p>
                <div className="pbm-field__hint" style={{ marginTop: 2 }}>
                  Share these instructions with your affiliates so they know exactly what parameters to send
                </div>
              </div>
              <button
                className="pbm-btn pbm-btn--secondary"
                onClick={() => setShowAffiliateDocs(!showAffiliateDocs)}
              >
                <i className={`fa fa-chevron-${showAffiliateDocs ? 'up' : 'down'}`} />
                {showAffiliateDocs ? 'Hide' : 'Show'} Instructions
              </button>
            </div>

            {showAffiliateDocs && (
              <div className="pbm-affiliate-docs">
                {/* Quick Copy Section */}
                <div className="pbm-docs-header">
                  <div className="pbm-docs-header__item">
                    <label>Your Postback URL Template:</label>
                    <div className="pbm-copy-box">
                      <code>{instructions.macroUrl}</code>
                      <button
                        className="pbm-icon-btn"
                        onClick={() => copyToClipboard(instructions.macroUrl)}
                      >
                        <i className="fa fa-copy" />
                      </button>
                    </div>
                    <div className="pbm-field__hint" style={{ marginTop: 8 }}>
                      Replace the values in curly braces <code>{'{...}'}</code> with your actual data
                    </div>
                  </div>
                  <div className="pbm-docs-header__item">
                    <label>Example URL (with test data):</label>
                    <div className="pbm-copy-box">
                      <code>{instructions.exampleUrl}</code>
                      <button
                        className="pbm-icon-btn"
                        onClick={() => copyToClipboard(instructions.exampleUrl)}
                      >
                        <i className="fa fa-copy" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parameters Table */}
                <div className="pbm-params-section">
                  <h4>Parameters to Include</h4>
                  <table className="pbm-params-table">
                    <thead>
                      <tr>
                        <th>Parameter Name</th>
                        <th>Description</th>
                        <th>Required</th>
                        <th>Example Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructions.parameters.map(param => (
                        <tr key={param.systemField}>
                          <td><code>{param.paramName}</code></td>
                          <td>{param.description}</td>
                          <td>{param.required ? '✓ Yes' : '—'}</td>
                          <td><code>{param.example}</code></td>
                        </tr>
                      ))}
                      {includeSubIds && (
                        <tr>
                          <td><code>sub_ids[{availableKeys.find(k => k.id === 'affiliate_id')?.affiliateField || 'affiliate_id'}]</code></td>
                          <td>Affiliate ID in sub_ids object</td>
                          <td>—</td>
                          <td><code>{testData.affiliate_id}</code></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Code Examples */}
                <div className="pbm-code-section">
                  <h4>Integration Examples</h4>
                  <div className="pbm-language-tabs">
                    {['javascript', 'php', 'python', 'curl', 'ruby'].map(lang => (
                      <button
                        key={lang}
                        className={`pbm-lang-tab${selectedLanguage === lang ? ' pbm-lang-tab--active' : ''}`}
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="pbm-code-block-wrapper">
                    <pre className="pbm-code-block">
                      <code>{getCodeExample(selectedLanguage)}</code>
                    </pre>
                    <button
                      className="pbm-icon-btn pbm-icon-btn--copy-code"
                      onClick={() => copyToClipboard(getCodeExample(selectedLanguage))}
                    >
                      <i className="fa fa-copy" />
                    </button>
                  </div>
                </div>

                {/* How It Works */}
                <div className="pbm-how-it-works">
                  <h4>How It Works</h4>
                  <div className="pbm-steps">
                    <div className="pbm-step">
                      <div className="pbm-step-number">1</div>
                      <div className="pbm-step-content">
                        <strong>Copy the template URL</strong>
                        <p>Use the macro template URL above in your system</p>
                      </div>
                    </div>
                    <div className="pbm-step">
                      <div className="pbm-step-number">2</div>
                      <div className="pbm-step-content">
                        <strong>Replace macros with real values</strong>
                        <p>Replace each <code>{'{...}'}</code> with actual data from your system</p>
                      </div>
                    </div>
                    <div className="pbm-step">
                      <div className="pbm-step-number">3</div>
                      <div className="pbm-step-content">
                        <strong>Send the request</strong>
                        <p>Make a {postbackMethod} request when a conversion occurs (purchase, signup, etc.)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pbm-alert pbm-alert--info">
                  <i className="fa fa-lightbulb-o" />
                  <div>
                    <strong>Pro Tip:</strong> Always URL-encode your parameter values, especially if they contain special characters or spaces.
                  </div>
                </div>
              </div>
            )}
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
                  {testResponse.success ? "Request succeeded" : "Request failed"} — Status: {testResponse.status}
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
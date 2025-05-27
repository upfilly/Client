import React, { useState, useEffect } from "react";
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";

const PropertyDataEntry = ({ form, setForm, platforms, setPlatforms }) => {
  const [newPlatform, setNewPlatform] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({
    "Social Media": true,
    Communication: false,
    "Web & Mobile": false,
    "Browser Extensions": false,
    "Custom Platforms": false,
  });

  const platformCategories = {
    "Social Media": {
      platforms: ["Instagram", "TikTok", "Facebook", "YouTube"],
      icon: "📱",
      description: "Social networking and content platforms",
    },
    Communication: {
      platforms: ["Discord", "Telegram", "Email"],
      icon: "💬",
      description: "Messaging and communication tools",
    },
    "Web & Mobile": {
      platforms: ["Website", "iOS App", "Android App"],
      icon: "🌐",
      description: "Websites and mobile applications",
    },
    "Browser Extensions": {
      platforms: [
        "Chrome Extension",
        "Firefox Extension",
        "Opera Extension",
        "Safari Extension",
      ],
      icon: "🔧",
      description: "Browser add-ons and extensions",
    },
  };

  const propertyTypes = {
    Website: {
      needsUsername: false,
      urlLabel: "Website URL",
      placeholder: "https://example.com",
    },
    Instagram: {
      needsUsername: true,
      urlLabel: "Profile URL",
      placeholder: "https://instagram.com/username",
    },
    TikTok: {
      needsUsername: true,
      urlLabel: "Profile URL",
      placeholder: "https://tiktok.com/@username",
    },
    Facebook: {
      needsUsername: true,
      urlLabel: "Profile URL",
      placeholder: "https://facebook.com/username",
    },
    YouTube: {
      needsUsername: true,
      urlLabel: "Channel URL",
      placeholder: "https://youtube.com/@username",
    },
    Discord: {
      needsUsername: true,
      urlLabel: "Server URL",
      placeholder: "https://discord.gg/invite",
    },
    Telegram: {
      needsUsername: true,
      urlLabel: "Channel URL",
      placeholder: "https://t.me/channel",
    },
    Email: {
      needsUsername: false,
      urlLabel: "Email Address",
      placeholder: "contact@example.com",
    },
    "iOS App": {
      needsUsername: false,
      urlLabel: "App Store URL",
      placeholder: "https://apps.apple.com/app/...",
    },
    "Android App": {
      needsUsername: false,
      urlLabel: "Play Store URL",
      placeholder: "https://play.google.com/store/apps/...",
    },
    "Chrome Extension": {
      needsUsername: false,
      urlLabel: "Extension URL",
      placeholder: "https://chrome.google.com/webstore/...",
    },
    "Firefox Extension": {
      needsUsername: false,
      urlLabel: "Extension URL",
      placeholder: "https://addons.mozilla.org/...",
    },
    "Opera Extension": {
      needsUsername: false,
      urlLabel: "Extension URL",
      placeholder: "https://addons.opera.com/...",
    },
    "Safari Extension": {
      needsUsername: false,
      urlLabel: "Extension URL",
      placeholder: "https://apps.apple.com/...",
    },
  };

  const getAllDefaultPlatforms = () => {
    return Object.values(platformCategories).flatMap((cat) => cat.platforms);
  };

  // Initialize platforms from form data on component mount
  useEffect(() => {
    if (!form) return;

    const allDefaultPlatforms = getAllDefaultPlatforms();
    const existingPlatforms = [];

    if (
      form.platforms &&
      Array.isArray(form.platforms) &&
      form.platforms.length > 0
    ) {
      // New format - use platforms array
      form.platforms.forEach((platformData) => {
        const config = propertyTypes[platformData.name] ||
          platformData.config || {
            needsUsername: true,
            urlLabel: "Profile URL",
            placeholder: "https://example.com/profile",
          };

        existingPlatforms.push({
          id: platformData.id || platformData.name,
          name: platformData.name,
          isSelected: true, // Always set to true for API data since it exists
          isCustom: !allDefaultPlatforms.includes(platformData.name),
          url: platformData.url || "",
          username: platformData.username || "",
          config: config,
        });
      });
    } else {
      // Legacy format - convert old format to new array format
      const formKeys = Object.keys(form);
      const platformNames = new Set();

      formKeys.forEach((key) => {
        if (key.includes("_url") || key.includes("_username")) {
          const platformName = key.split("_")[0];
          platformNames.add(platformName);
        }
      });

      platformNames.forEach((name) => {
        // Only add if it has a URL (indicating it was selected)
        if (form[`${name}_url`]) {
          const config = propertyTypes[name] || {
            needsUsername: true,
            urlLabel: "Profile URL",
            placeholder: "https://example.com/profile",
          };

          existingPlatforms.push({
            id: name,
            name: name,
            isSelected: true,
            isCustom: !allDefaultPlatforms.includes(name),
            url: form[`${name}_url`] || "",
            username: form[`${name}_username`] || "",
            config: config,
          });
        }
      });
    }

    // Only set platforms if we found some data, otherwise keep existing platforms state
    if (existingPlatforms.length > 0) {
      setPlatforms(existingPlatforms);
    }
  }, [form?.fullName]);

  // Update form whenever platforms array changes
  useEffect(() => {
    if (!platforms || platforms.length === 0) return;

    const newForm = { ...form };

    // Remove old platform data format if it exists
    Object.keys(newForm).forEach((key) => {
      if (key.includes("_url") || key.includes("_username")) {
        delete newForm[key];
      }
    });

    // Set the platforms array in the form
    newForm.platforms = platforms
      .filter((p) => p.isSelected && (p.url || p.username)) // Only include platforms with data
      .map((p) => ({
        id: p.id || p.name,
        name: p.name,
        url: p.url,
        username: p.config.needsUsername ? p.username : undefined,
        config: p.config,
      }));

    setForm(newForm);
  }, [platforms]);

  const getCustomPlatforms = () => {
    return platforms.filter((p) => p.isCustom).map((p) => p.name);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handlePlatformCheckbox = (platformName) => {
    setPlatforms((prevPlatforms) => {
      const existingPlatform = prevPlatforms.find(
        (p) => p.name === platformName
      );

      if (existingPlatform) {
        // Toggle existing platform
        return prevPlatforms.map((p) =>
          p.name === platformName ? { ...p, isSelected: !p.isSelected } : p
        );
      } else {
        // Add new platform
        const config = propertyTypes[platformName] || {
          needsUsername: true,
          urlLabel: "Profile URL",
          placeholder: "https://example.com/profile",
        };

        const newPlatform = {
          id: platformName,
          name: platformName,
          isSelected: true,
          isCustom: !getAllDefaultPlatforms().includes(platformName),
          url: "",
          username: "",
          config: config,
        };

        return [...prevPlatforms, newPlatform];
      }
    });
  };

  const handleInputChange = (platformName, field, value) => {
    setPlatforms((prevPlatforms) =>
      prevPlatforms.map((platform) =>
        platform.name === platformName
          ? { ...platform, [field]: value }
          : platform
      )
    );
  };

  const addCustomPlatform = () => {
    if (
      newPlatform.trim() &&
      !getAllDefaultPlatforms().includes(newPlatform.trim())
    ) {
      const trimmedPlatform = newPlatform.trim();
      const config = {
        needsUsername: true,
        urlLabel: "Profile URL",
        placeholder: "https://example.com/profile",
      };

      propertyTypes[trimmedPlatform] = config;

      const newPlatformObj = {
        id: trimmedPlatform,
        name: trimmedPlatform,
        isSelected: false,
        isCustom: true,
        url: "",
        username: "",
        config: config,
      };

      setPlatforms((prev) => [...prev, newPlatformObj]);
      setNewPlatform("");
      setExpandedCategories((prev) => ({ ...prev, "Custom Platforms": true }));
    }
  };

  const removeCustomPlatform = (platformName) => {
    setPlatforms((prev) => prev.filter((p) => p.name !== platformName));
    delete propertyTypes[platformName];
  };

  const getSelectedCount = () => platforms.filter((p) => p.isSelected).length;

  const isPlatformSelected = (platformName) => {
    const platform = platforms.find((p) => p.name === platformName);
    return platform ? platform.isSelected : false;
  };

  const getPlatformData = (platformName) => {
    return (
      platforms.find((p) => p.name === platformName) || {
        url: "",
        username: "",
        config: propertyTypes[platformName] || {
          needsUsername: true,
          urlLabel: "Profile URL",
          placeholder: "https://example.com",
        },
      }
    );
  };

  const renderPlatformCard = (platformName, isCustom = false) => {
    const platformData = getPlatformData(platformName);
    const config = platformData.config;
    const isSelected = isPlatformSelected(platformName);

    return (
      <div
        key={platformName}
        className={`card mb-3 ${isSelected ? "border-primary" : ""}`}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center ">
            <div className="form-check pb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id={`platform-${platformName}`}
                onChange={() => handlePlatformCheckbox(platformName)}
                checked={isSelected}
              />
              <label
                className="form-check-label fw-bold"
                htmlFor={`platform-${platformName}`}
              >
                {platformName}
              </label>
            </div>
            {isCustom && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeCustomPlatform(platformName)}
                title="Remove custom platform"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {isSelected && (
            <div className="border-top pt-3">
              <div className="row">
                <div className="col-12 ">
                  <div className="form-group custom-input">
                    <label className="form-label">
                      {config.urlLabel} <span className="star">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={config.placeholder}
                      value={platformData.url || ""}
                      onChange={(e) =>
                        handleInputChange(platformName, "url", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {config.needsUsername && (
                  <div className="col-12">
                    <div className="form-group custom-input">
                      <label className="form-label">
                        Username <span className="star">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username"
                        value={platformData.username || ""}
                        onChange={(e) =>
                          handleInputChange(
                            platformName,
                            "username",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="col-12 col-sm-12 col-md-12 col-lg-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <div className="main_title_head">
            <h3 className="text-white mb-1">Property Types</h3>
            <p className="mb-0 text-light">
              Select and configure your social media and digital platforms
            </p>
            {getSelectedCount() > 0 && (
              <div className="mt-2">
                <span className="badge bg-light text-primary">
                  {getSelectedCount()} platform
                  {getSelectedCount() !== 1 ? "s" : ""} selected
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className="card-body"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          {/* Platform Categories */}
          {Object.entries(platformCategories).map(
            ([categoryName, categoryData]) => (
              <div key={categoryName} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleCategory(categoryName)}
                  className="btn btn-light w-100 d-flex flex-nowrap justify-content-between align-items-start p-3 mb-3"
                >
                  <div className="d-flex align-items-start">
                    <span className="me-2" style={{ fontSize: "1.2rem" }}>
                      {categoryData.icon}
                    </span>
                    <div className="text-start">
                      <div className="fw-bold lh-1">{categoryName}</div>
                      <small className="text-muted">
                        {categoryData.description}
                      </small>
                    </div>
                  </div>
                  {expandedCategories[categoryName] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {expandedCategories[categoryName] && (
                  <div className="ps-3">
                    {categoryData.platforms.map((platform) =>
                      renderPlatformCard(platform)
                    )}
                  </div>
                )}
              </div>
            )
          )}

          {/* Custom Platforms Section */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => toggleCategory("Custom Platforms")}
              className="btn btn-light w-100 d-flex flex-nowrap justify-content-between align-items-start p-3 mb-3"
            >
              <div className="d-flex align-items-start">
                <span className="me-2" style={{ fontSize: "1.2rem" }}>
                  ⚡
                </span>
                <div className="text-start">
                  <div className="fw-bold lh-1">Custom Platforms</div>
                  <small className="text-muted">
                    Add your own custom platforms
                  </small>
                </div>
              </div>
              {expandedCategories["Custom Platforms"] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedCategories["Custom Platforms"] && (
              <div className="ps-3">
                {/* Add Custom Platform */}
                <div
                  className="card border-success mb-3"
                  style={{ backgroundColor: "#f8fff9" }}
                >
                  <div className="card-body p-3">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter new platform name (e.g., LinkedIn, Pinterest)"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomPlatform();
                          }
                        }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-success rounded-pill w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={addCustomPlatform}
                        disabled={!newPlatform.trim()}
                      >
                        <Plus size={16} />
                        Add Platform
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Platform Cards */}
                {getCustomPlatforms().length > 0 && (
                  <div>
                    {platforms
                      .filter((p) => p.isCustom)
                      .map((p) => renderPlatformCard(p.name, true))}
                  </div>
                )}

                {getCustomPlatforms().length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <div style={{ fontSize: "2rem" }} className="mb-2">
                      📝
                    </div>
                    <p className="mb-1">No custom platforms added yet</p>
                    <small>
                      Add platforms that aren't in the standard categories above
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {getSelectedCount() > 0 && (
            <div className="alert alert-primary">
              <h6 className="alert-heading">Selected Platforms Summary</h6>
              <div className="d-flex flex-wrap gap-2">
                {platforms
                  .filter((p) => p.isSelected)
                  .map((platform) => (
                    <span key={platform.name} className="badge bg-primary">
                      {platform.name}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDataEntry;

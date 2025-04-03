import React, { useState } from "react";
import "./MultiSelectDropdownData.css";
import { regionData } from "./AddEditUser/regionCountries";

const MultiSelectRegionDropdown = ({ selectedItems, setSelectedItems ,isRegionOpen, setRegionIsOpen}) => {
  const data = regionData;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => setRegionIsOpen(!isRegionOpen);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSelection = (region, country, checked) => {
    setSelectedItems((prevState) => {
      let newSelectedRegions = [...prevState.regions];
      let newSelectedCountries = [...prevState.countries];

      if (checked) {
        if (!newSelectedRegions.includes(region)) {
          newSelectedRegions.push(region);
        }
        if (!newSelectedCountries.includes(country)) {
          newSelectedCountries.push(country);
        }
      } else {
        newSelectedRegions = newSelectedRegions.filter((item) => item !== region);
        newSelectedCountries = newSelectedCountries.filter((item) => item !== country);
      }

      return { regions: newSelectedRegions, countries: newSelectedCountries };
    });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const renderCategories = () => {
    return Object.keys(data)
      .filter((region) => region.toLowerCase().includes(searchTerm))
      .map((region) => (
        <div key={region} className="category-container">
          <div className="dropdown-item">
            <input
              type="checkbox"
              checked={selectedItems.regions.includes(region)}
              onChange={(e) => handleSelection(region, "", e.target.checked)}
            />
            <label onClick={() => toggleCategory(region)}>{region}</label>
          </div>

          {expandedCategories[region] && renderSubcategories(region, data[region])}
        </div>
      ));
  };

  const renderSubcategories = (region, countries) => (
    <div className="subcategory-dropdown">
      {countries.map((country, index) => (
        <div key={index} className="subcategory-container" style={{ marginLeft: "15px" }}>
          <div className="ml-5">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedItems.countries.includes(country)}
              onChange={(e) => handleSelection(region, country, e.target.checked)}
            />
            <label>{country}</label>
          </div>
        </div>
      ))}
    </div>
  );

  const getSelectedValuesText = () => {
    // Combine selected regions and countries into a string
    const selectedRegionsText = selectedItems.regions.join(", ");
    const selectedCountriesText = selectedItems.countries.join(", ");
    let displayText = "Select Regions";

    if (selectedRegionsText) {
      displayText = selectedRegionsText;
    }
    if (selectedCountriesText) {
      if (displayText !== "Select Regions") {
        displayText += " - "; // Add separator between regions and countries
      }
      displayText += selectedCountriesText;
    }

    return displayText || "Select Regions";
  };

  return (
    <div className="dropdown-container show-drop">
      <span onClick={toggleDropdown} className="dropdown-toggle">
        {getSelectedValuesText()}
      </span>

      {isRegionOpen && (
        <div className="dropdown-menu">
          <input
            type="text"
            placeholder="Search Regions..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />

          <div className="select-actions">
            <input
              className="form-check-input"
              type="checkbox"
              id="selectAll"
              onChange={(e) => {
                if (e.target.checked) {
                  const allRegions = Object.keys(data);
                  const allCountries = Object.values(data).flat();
                  setSelectedItems({ regions: allRegions, countries: allCountries });
                } else {
                  setSelectedItems({ regions: [], countries: [] });
                }
              }}
              checked={selectedItems.regions.length === Object.keys(data).length}
            />
            <label htmlFor="selectAll">Select All</label>
          </div>

          {renderCategories()}
        </div>
      )}
    </div>
  );
};

export default MultiSelectRegionDropdown;

import React, { useState } from "react";
import "./MultiSelectDropdownData.css";
import { regionData } from "./AddEditUser/regionCountries";

const MultiSelectRegionDropdown = ({ selectedItems, setSelectedItems, isRegionOpen, setRegionIsOpen }) => {
  const data = regionData;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [savedSelections, setSavedSelections] = useState(null);

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
        // If selecting a country, also ensure its region is selected
        if (country && !newSelectedRegions.includes(region)) {
          newSelectedRegions.push(region);
        }
        
        // Add the region or country
        if (region && !country && !newSelectedRegions.includes(region)) {
          newSelectedRegions.push(region);
        }
        if (country && !newSelectedCountries.includes(country)) {
          newSelectedCountries.push(country);
        }
      } else {
        if (!country) {
          // If deselecting a region, also deselect all its countries
          newSelectedRegions = newSelectedRegions.filter(item => item !== region);
          newSelectedCountries = newSelectedCountries.filter(item => 
            !data[region].includes(item)
          );
        } else {
          // If deselecting a country, just remove the country
          newSelectedCountries = newSelectedCountries.filter(item => item !== country);
          
          // Check if there are any selected countries from this region remaining
          const hasSelectedCountriesInRegion = newSelectedCountries.some(country => 
            data[region].includes(country)
          );
          
          // If no countries from this region are selected, also deselect the region
          if (!hasSelectedCountriesInRegion) {
            newSelectedRegions = newSelectedRegions.filter(item => item !== region);
          }
        }
      }

      return { regions: newSelectedRegions, countries: newSelectedCountries };
    });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleSave = () => {
    setSavedSelections({...selectedItems});
    setRegionIsOpen(false);
    // You can add additional logic here, such as sending the data to a parent component or API
  };

  const handleRemoveAll = () => {
    setSelectedItems({ regions: [], countries: [] });
  };

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
            <span className="remove-all-btn ml-2" title="Remove" onClick={handleRemoveAll}>
              Remove All
            </span>
          </div>

          {renderCategories()}
          
          <div className="save-container">
            <button 
              className="save-button" 
              onClick={handleSave}
            >
              Save Selection
            </button>
          </div>
        </div>
      )}
      
      {savedSelections && (
        <div className="saved-selections">
          {/* <h4>Selected Values:</h4> */}
          {savedSelections.regions.length > 0 && (
            <div>
              <strong>Regions:</strong> {savedSelections.regions.join(", ")}
            </div>
          )}
          {savedSelections.countries.length > 0 && (
            <div>
              <strong>Countries:</strong> {savedSelections.countries.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectRegionDropdown;
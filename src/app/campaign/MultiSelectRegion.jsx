import React, { useState, useEffect } from "react";
import "./MultiSelectDropdownData.css";
import { regionData } from "./AddEditUser/regionCountries";

const MultiSelectRegionDropdown = ({ selectedItems, setSelectedItems, isRegionOpen, setRegionIsOpen }) => {
  const data = regionData;
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [savedSelections, setSavedSelections] = useState(null);
  const [filteredData, setFilteredData] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    // Calculate total selected items whenever selectedItems changes
    const count = selectedItems.regions.length + selectedItems.countries.length;
    setSelectedCount(count);
  }, [selectedItems]);

  const toggleDropdown = () => setRegionIsOpen(!isRegionOpen);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  useEffect(() => {
    if (searchTerm) {
      const newFilteredData = {};
      const newExpandedCategories = {};

      Object.keys(data).forEach(region => {
        const matchingCountries = data[region].filter(country => 
          country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (region.toLowerCase().includes(searchTerm.toLowerCase()) || matchingCountries.length > 0) {
          newFilteredData[region] = matchingCountries.length > 0 ? matchingCountries : data[region];
          newExpandedCategories[region] = true;
        }
      });

      setFilteredData(newFilteredData);
      setExpandedCategories(newExpandedCategories);
    } else {
      setFilteredData(data);
      setExpandedCategories({});
    }
  }, [searchTerm, data]);

  const handleSelection = (region, country, checked) => {
    setSelectedItems((prevState) => {
      let newSelectedRegions = [...prevState.regions];
      let newSelectedCountries = [...prevState.countries];

      if (checked) {
        // If selecting a country, ensure its region is selected
        if (country) {
          if (!newSelectedRegions.includes(region)) {
            newSelectedRegions.push(region);
          }
          if (!newSelectedCountries.includes(country)) {
            newSelectedCountries.push(country);
          }
        }
        // If selecting a region, select the region and all its visible countries
        else if (region && !newSelectedRegions.includes(region)) {
          newSelectedRegions.push(region);
          // Add all visible countries in this region if not already selected
          const countriesToAdd = searchTerm 
            ? filteredData[region] || [] 
            : data[region];
          
          countriesToAdd.forEach(c => {
            if (!newSelectedCountries.includes(c)) {
              newSelectedCountries.push(c);
            }
          });
        }
      } else {
        if (country) {
          // If deselecting a country, just remove the country
          newSelectedCountries = newSelectedCountries.filter(item => item !== country);

          // Check if there are any selected countries from this region remaining
          const hasSelectedCountriesInRegion = newSelectedCountries.some(c =>
            data[region].includes(c)
          );

          // If no countries from this region are selected, also deselect the region
          if (!hasSelectedCountriesInRegion) {
            newSelectedRegions = newSelectedRegions.filter(item => item !== region);
          }
        } else {
          // If deselecting a region, deselect all its countries
          newSelectedRegions = newSelectedRegions.filter(item => item !== region);
          newSelectedCountries = newSelectedCountries.filter(item =>
            !data[region].includes(item)
          );
        }
      }

      return { regions: newSelectedRegions, countries: newSelectedCountries };
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSave = () => {
    setSavedSelections({ ...selectedItems });
    setRegionIsOpen(false);
  };

  const handleRemoveAll = () => {
    setSelectedItems({ regions: [], countries: [] });
  };

  const handleAddAllVisible = () => {
    setSelectedItems(prev => {
      const visibleRegions = searchTerm ? Object.keys(filteredData) : Object.keys(data);
      const visibleCountries = searchTerm 
        ? Object.values(filteredData).flat() 
        : Object.values(data).flat();
      
      // Merge with existing selections
      const newRegions = [...new Set([...prev.regions, ...visibleRegions])];
      const newCountries = [...new Set([...prev.countries, ...visibleCountries])];
      
      return { regions: newRegions, countries: newCountries };
    });
  };

  const handleRemoveAllVisible = () => {
    if (!searchTerm) {
      handleRemoveAll();
      return;
    }

    setSelectedItems(prev => {
      const visibleRegions = Object.keys(filteredData);
      const visibleCountries = Object.values(filteredData).flat();
      
      // Remove only visible items
      const newRegions = prev.regions.filter(region => !visibleRegions.includes(region));
      const newCountries = prev.countries.filter(country => !visibleCountries.includes(country));
      
      return { regions: newRegions, countries: newCountries };
    });
  };

  const renderCategories = () => {
    const displayData = searchTerm ? filteredData : data;
    
    if (Object.keys(displayData).length === 0) {
      return <div className="no-results">No matching regions or countries found</div>;
    }
    
    return Object.keys(displayData).map((region) => (
      <div key={region} className="category-container">
        <div className="dropdown-item">
          <input
            type="checkbox"
            checked={selectedItems.regions.includes(region)}
            onChange={(e) => handleSelection(region, null, e.target.checked)}
          />
          <label onClick={() => toggleCategory(region)}>
            {region} 
            <span className="item-count">
              ({selectedItems.countries.filter(c => data[region].includes(c)).length}/{data[region].length})
            </span>
          </label>
        </div>

        {(expandedCategories[region] || searchTerm) && renderSubcategories(region, displayData[region])}
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
    if (selectedCount === 0) return "Select Regions";
    
    const selectedRegionsText = selectedItems.regions.length > 0 
      ? `${selectedItems.regions.length} region${selectedItems.regions.length !== 1 ? 's' : ''}`
      : '';
    
    const selectedCountriesText = selectedItems.countries.length > 0
      ? `${selectedItems.countries.length} countr${selectedItems.countries.length !== 1 ? 'ies' : 'y'}`
      : '';

    return [selectedRegionsText, selectedCountriesText].filter(Boolean).join(', ');
  };

  return (
    <div className="dropdown-container show-drop">
      <span onClick={toggleDropdown} className="dropdown-toggle">
        {getSelectedValuesText()}
        {selectedCount > 0 && (
          <span className="clear-selection" onClick={(e) => {
            e.stopPropagation();
            handleRemoveAll();
          }}>
            ×
          </span>
        )}
      </span>

      {isRegionOpen && (
        <div className="dropdown-menu">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search regions or countries..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={handleClearSearch}>
                ×
              </button>
            )}
          </div>

          <div className="selection-controls">
            <div className="select-actions">
              <span 
                className="action-btn add-all"
                onClick={handleAddAllVisible}
              >
                Add All Visible
              </span>
              <span 
                className="action-btn remove-all"
                onClick={handleRemoveAllVisible}
                disabled={selectedCount === 0}
              >
                Remove All Visible
              </span>
            </div>
            {/* <div className="select-checkbox">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAll"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleAddAllVisible();
                  } else {
                    handleRemoveAllVisible();
                  }
                }}
                checked={
                  searchTerm
                    ? selectedItems.regions.length === Object.keys(filteredData).length &&
                      selectedItems.countries.length === Object.values(filteredData).flat().length
                    : selectedItems.regions.length === Object.keys(data).length &&
                      selectedItems.countries.length === Object.values(data).flat().length
                }
              />
              <label htmlFor="selectAll">Select All Visible</label>
            </div> */}
          </div>

          <div className="dropdown-content">
            {renderCategories()}
          </div>

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
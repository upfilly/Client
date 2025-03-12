import React, { useState } from "react";
import "./MultiSelectDropdownData.css";

const MultiSelectDropdown = ({ data, selectedItems, setSelectedItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleSubCategory = (subCategoryId) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId],
    }));
  };

  const handleSelection = (categoryId, subcategoryId, subSubCategoryId, checked) => {
    setSelectedItems((prevState) => {
      let newCategories = [...prevState.categories];
      let newSubCategories = [...prevState.subCategories];
      let newSubSubCategories = [...prevState.subSubCategories];

      if (categoryId && checked) {
        newCategories.push(categoryId);
        const subCategoriesForCategory = data.find((item) => item._id === categoryId).subCategories;
        subCategoriesForCategory.forEach((subCategory) => {
          newSubCategories.push(subCategory.id);
          subCategory.subchildcategory.forEach((subSubCategory) => {
            newSubSubCategories.push(subSubCategory._id);
          });
        });
      }

      if (subcategoryId && checked) {
        newSubCategories.push(subcategoryId);
        const subCategory = data
          .flatMap((item) => item.subCategories)
          .find((item) => item.id === subCategory);
        subCategory.subchildcategory.forEach((subSubCategory) => {
          newSubSubCategories.push(subSubCategory._id);
        });
      }

      if (!checked) {
        if (categoryId) newCategories = newCategories.filter((item) => item !== categoryId);
        if (subcategoryId) newSubCategories = newSubCategories.filter((item) => item !== subcategoryId);
        if (subSubCategoryId) newSubSubCategories = newSubSubCategories.filter((item) => item !== subSubCategoryId);
      }

      return { categories: newCategories, subCategories: newSubCategories, subSubCategories: newSubSubCategories };
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allCategories = data.map((parentCategory) => parentCategory._id);
      const allSubCategories = data.flatMap((parentCategory) => parentCategory.subCategories.map((subCategory) => subCategory.id));
      const allSubSubCategories = data.flatMap((parentCategory) => parentCategory.subCategories.flatMap((subCategory) => subCategory.subchildcategory.map((subSubCategory) => subSubCategory._id)));
      setSelectedItems({
        categories: allCategories,
        subCategories: allSubCategories,
        subSubCategories: allSubSubCategories,
      });
    } else {
      setSelectedItems({
        categories: [],
        subCategories: [],
        subSubCategories: [],
      });
    }
  };

  // Remove All Handler
  const handleRemoveAll = () => {
    setSelectedItems({ categories: [], subCategories: [], subSubCategories: [] });
  };

  // Search Handler
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Render Sub-Subcategories
  const renderSubSubcategories = (categoryId, subcategoryId, subSubCategories) => (
    <div className={`sub-subcategory-container ${expandedSubCategories[subcategoryId] ? "open" : ""}`} style={{ marginLeft: "30px" }}>
      {subSubCategories.map((subSub) => (
        <div key={subSub._id} className="">
          <input
            type="checkbox"
            checked={selectedItems.subSubCategories.includes(subSub._id)}
            onChange={(e) => handleSelection(categoryId, subcategoryId, subSub._id, e.target.checked)}
          />
          <label>{subSub.name}</label>
        </div>
      ))}
    </div>
  );

  // Render Subcategories
  const renderSubcategories = (categoryId, subCategories) => (
    <div className="subcategory-dropdown">
      {subCategories.map((sub) => (
        <div key={sub.id} className="subcategory-container" style={{ marginLeft: "15px" }}>
          <div className="dropdown-item" onClick={() => toggleSubCategory(sub.id)}>
            <input
              type="checkbox"
              checked={selectedItems.subCategories.includes(sub.id)}
              onChange={(e) => handleSelection(categoryId, sub.id, "", e.target.checked)}
            />
            <label>{sub.name}</label>
          </div>

          {/* Render Sub-Subcategories */}
          {expandedSubCategories[sub.id] && renderSubSubcategories(categoryId, sub.id, sub.subchildcategory)}
        </div>
      ))}
    </div>
  );

  // Render Categories
  const renderCategories = () => {
    return data
      .filter((cat) => cat.parent_cat_name.toLowerCase().includes(searchTerm))
      .map((category) => (
        <div key={category._id} className="category-container">
          <div className="dropdown-item" onClick={() => toggleCategory(category._id)}>
            <input
              type="checkbox"
              checked={selectedItems.categories.includes(category._id)}
              onChange={(e) => handleSelection(category._id, "", "", e.target.checked)}
            />
            <label>{category.parent_cat_name}</label>
            {/* {category.subCategories.length > 0 && (
              <span className="toggle-icon">{expandedCategories[category._id] ? "▲" : "▼"}</span>
            )} */}
          </div>

          {/* Render Subcategories */}
          {expandedCategories[category._id] && renderSubcategories(category._id, category.subCategories)}
        </div>
      ));
  };

  return (
    <div className="dropdown-container show-drop">
      <span onClick={toggleDropdown} className="dropdown-toggle">
        Select Categories
      </span>

      {isOpen && (
        <div className="dropdown-menu">
          {/* Search Bar */}
          <input type="text" placeholder="Search Categories..." value={searchTerm} onChange={handleSearch} className="search-input" />

          {/* Select & Remove Options */}
          <div className="select-actions">
            <input
              type="checkbox"
              id="selectAll"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={selectedItems.categories.length === data.length}
            />
            <label htmlFor="selectAll">Select All</label>
            <span className="remove-all-btn" onClick={handleRemoveAll}>
              Remove All
            </span>
          </div>

          {renderCategories()}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

import React, { useState } from 'react';
import './MultiSelectDropdownData.css';

const MultiSelectDropdown = ({ data, selectedItems, setSelectedItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(selectedItems,"selectedItemsselectedItems")

  const handleCategoryChange = (category, subcategory, subSubCategoryId, checked) => {
    const value = { category, subcategory, subSubCategoryId };

    setSelectedItems((prevState) => {
      let newCategories = [...prevState.categories];
      let newSubCategories = [...prevState.subCategories];
      let newSubSubCategories = [...prevState.subSubCategories];

      if (category && checked) {
        newCategories.push(category);
        const subCategoriesForCategory = data.find((item) => item._id === category).subCategories;
        subCategoriesForCategory.forEach((subCategory) => {
          newSubCategories.push(subCategory.id);
          subCategory.subchildcategory.forEach((subSubCategory) => {
            newSubSubCategories.push(subSubCategory._id);
          });
        });
      }

      if (subcategory && checked) {
        newSubCategories.push(subcategory);
        const subCategory = data
          .flatMap((item) => item.subCategories)
          .find((item) => item.id === subcategory);
        subCategory.subchildcategory.forEach((subSubCategory) => {
          newSubSubCategories.push(subSubCategory._id);
        });
      }

      if (!checked) {
        if (category) newCategories = newCategories.filter((item) => item !== category);
        if (subcategory) newSubCategories = newSubCategories.filter((item) => item !== subcategory);
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

  const handleRemoveAll = () => {
    setSelectedItems({
      categories: [],
      subCategories: [],
      subSubCategories: [],
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const renderSubcategories = (categoryId, subcategory) => {
    return subcategory.subchildcategory.map((subSubCategory, index) => (
      <div key={subSubCategory._id} style={{ paddingLeft: '40px' }}>
        <input
          type="checkbox"
          id={`${categoryId}-${subcategory.id}-${subSubCategory._id}`}
          onChange={(e) => handleCategoryChange(categoryId, subcategory.id, subSubCategory._id, e.target.checked)}
          checked={selectedItems.subSubCategories.includes(subSubCategory._id)}
        />
        <label htmlFor={`${categoryId}-${subcategory.id}-${subSubCategory._id}`}>{subSubCategory.name}</label>
      </div>
    ));
  };

  const renderCategories = () => {
    return data.filter((parentCategory) => parentCategory.parent_cat_name.toLowerCase().includes(searchTerm)).map((parentCategory) => (
      <div key={parentCategory._id}>
        <div className="dropdown-item">
          <input
            type="checkbox"
            id={parentCategory._id}
            onChange={(e) => handleCategoryChange(parentCategory._id, '', '', e.target.checked)}
            checked={selectedItems.categories.includes(parentCategory._id)}
          />
          <label htmlFor={parentCategory._id}>{parentCategory.parent_cat_name}</label>
        </div>
        {parentCategory.subCategories.map((subcategory) => (
          <div key={subcategory.id} style={{ paddingLeft: '20px' }}>
            <div className="dropdown-item">
              <input
                type="checkbox"
                id={subcategory.id}
                onChange={(e) => handleCategoryChange(parentCategory._id, subcategory.id, '', e.target.checked)}
                checked={selectedItems.subCategories.includes(subcategory.id)}
              />
              <label htmlFor={subcategory.id}>{subcategory.name}</label>
            </div>
            {/* Render Sub-Subcategories if the subcategory is selected */}
            {subcategory.subchildcategory.length > 0 && renderSubcategories(parentCategory._id, subcategory)}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div>
      <div className="dropdown w-100">
        <span onClick={() => setIsOpen(!isOpen)} className="btn btn-primary dropdown-toggle removeBg">
          Select Categories
        </span>
        {isOpen && (
          <div className="dropdown_main dropdown-menu px-3 show active">
            {/* Search Input */}
            <input 
              type="text" 
              placeholder="Search Categories..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <div className="select-options">
              <div className="select-option">
                <input
                  type="checkbox"
                  id="selectAll"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedItems.categories.length === data.length}
                />
                <span htmlFor="selectAll">Select All</span>
              </div>
                <div className="select-option dst">
                  <span onClick={handleRemoveAll}>Remove All</span>
                </div>
            </div>
            {renderCategories()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;

import React, { useState, useEffect } from "react";
import "./MultiSelectDropdownData.css";

const MultiSelectDropdown = ({ data, selectedItems,setSelectedItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [displaySelections, setDisplaySelections] = useState({
    categories: [],
    subCategories: [],
    subSubCategories: []
  });

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
      let newCategories = [...prevState?.categories];
      let newSubCategories = [...prevState?.subCategories];
      let newSubSubCategories = [...prevState?.subSubCategories];

      if (categoryId && !subcategoryId && !subSubCategoryId) {
        if (checked) {
          newCategories?.push(categoryId);
          const categoryData = data?.find((item) => item?._id === categoryId);
          if (categoryData && categoryData?.subCategories) {
            categoryData?.subCategories?.forEach((subCategory) => {
              if (!newSubCategories?.includes(subCategory?.id)) {
                newSubCategories?.push(subCategory?.id);
              }
              if (subCategory?.subchildcategory) {
                subCategory?.subchildcategory?.forEach((subSubCategory) => {
                  if (!newSubSubCategories?.includes(subSubCategory?._id)) {
                    newSubSubCategories?.push(subSubCategory?._id);
                  }
                });
              }
            });
          }
        } else {
          newCategories = newCategories?.filter((item) => item !== categoryId);
          const categoryData = data?.find((item) => item?._id === categoryId);
          if (categoryData && categoryData?.subCategories) {
            categoryData?.subCategories?.forEach((subCategory) => {
              newSubCategories = newSubCategories?.filter((item) => item !== subCategory?.id);
              if (subCategory?.subchildcategory) {
                subCategory?.subchildcategory?.forEach((subSubCategory) => {
                  newSubSubCategories = newSubSubCategories?.filter((item) => item !== subSubCategory?._id);
                });
              }
            });
          }
        }
      } else if (subSubCategoryId) {
        if (checked) {
          newSubSubCategories?.push(subSubCategoryId);
        } else {
          newSubSubCategories = newSubSubCategories?.filter((item) => item !== subSubCategoryId);
        }
      } else if (subcategoryId) {
        if (checked) {
          newSubCategories?.push(subcategoryId);
          const subCategoryData = data
            .flatMap((item) => item?.subCategories)
            .find((item) => item?.id === subcategoryId);
          if (subCategoryData && subCategoryData?.subchildcategory) {
            subCategoryData?.subchildcategory.forEach((subSub) => {
              if (!newSubSubCategories?.includes(subSub?._id)) {
                newSubSubCategories?.push(subSub?._id);
              }
            });
          }
        } else {
          newSubCategories = newSubCategories?.filter((item) => item !== subcategoryId);
          const subCategoryData = data
            ?.flatMap((item) => item?.subCategories)
            ?.find((item) => item?.id === subcategoryId);
          if (subCategoryData && subCategoryData?.subchildcategory) {
            subCategoryData?.subchildcategory?.forEach((subSub) => {
              newSubSubCategories = newSubSubCategories?.filter((item) => item !== subSub?._id);
            });
          }
        }
      }

      data.forEach((category) => {
        const allSubSelected = category.subCategories.every(
          (sub) =>
            newSubCategories.includes(sub.id) &&
            sub.subchildcategory.every((subSub) => newSubSubCategories.includes(subSub._id))
        );
        if (allSubSelected && !newCategories.includes(category._id)) {
          newCategories.push(category._id);
        } else if (!allSubSelected && newCategories.includes(category._id)) {
          newCategories = newCategories.filter((id) => id !== category._id);
        }
      });

      data
        .flatMap((category) => category.subCategories)
        .forEach((subCategory) => {
          if (subCategory.subchildcategory) {
            const allSubSubSelected = subCategory.subchildcategory.every((subSub) => newSubSubCategories.includes(subSub._id));
            if (allSubSubSelected && !newSubCategories.includes(subCategory.id)) {
              // newSubCategories.push(subCategory.id);
            } else if (!allSubSubSelected && newSubCategories.includes(subCategory.id)) {
              newSubCategories = newSubCategories.filter((id) => id !== subCategory.id);
            }
          }
        });

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
    setSelectedItems({ categories: [], subCategories: [], subSubCategories: [] });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const isIndeterminate = (parentId, type) => {
    let selected = [];
    if (type === 'category') {
      selected = data.find((category) => category._id === parentId)?.subCategories || [];
    } else if (type === 'subcategory') {
      selected = data
        .flatMap((category) => category.subCategories)
        .find((subcategory) => subcategory.id === parentId)?.subchildcategory || [];
    }

    return selected.some((item) => selectedItems && selectedItems?.subSubCategories?.includes(item._id)) && !selected.every((item) => selectedItems && selectedItems.subSubCategories.includes(item._id));
  };

  const renderSubSubcategories = (categoryId, subcategoryId, subSubCategories) => (
    <div className={`sub-subcategory-container ${expandedSubCategories[subcategoryId] ? "open" : ""}`} style={{ marginLeft: "30px" }}>
      {subSubCategories.map((subSub) => (
        <div key={subSub._id} className="ml-5">
          <input
            className="form-check-input"
            type="checkbox"
            checked={selectedItems && selectedItems?.subSubCategories?.includes(subSub._id)}
            onChange={(e) => handleSelection("", subcategoryId, subSub._id, e.target.checked)}
          />
          <label className="ml-2">{subSub.name}</label>
        </div>
      ))}
    </div>
  );

  const renderSubcategories = (categoryId, subCategories) => (
    <div className="subcategory-dropdown">
      {subCategories.map((sub) => (
        <div key={sub.id} className="subcategory-container">
          <div className={sub.subchildcategory?.length > 0 ? "dropdown-item ml-3" : "ml-5"}>
            <input
              type="checkbox"
              className={sub.subchildcategory?.length > 0 ? "" : "form-check-input"}
              checked={selectedItems && selectedItems?.subCategories?.includes(sub.id)}
              indeterminate={isIndeterminate(categoryId, 'category')}
              onChange={(e) => handleSelection("", sub.id, "", e.target.checked)}
            />
            <label onClick={() => toggleSubCategory(sub.id)}>{sub.name}</label>
          </div>

          {expandedSubCategories[sub.id] && renderSubSubcategories(categoryId, sub.id, sub.subchildcategory)}
        </div>
      ))}
    </div>
  );

  const renderCategories = () => {
    return data
      .filter((cat) => cat?.parent_cat_name?.toLowerCase()?.includes(searchTerm))
      .map((category) => (
        <div key={category._id} className="category-container">
          <div className="dropdown-item">
            <input
              type="checkbox"
              checked={selectedItems && selectedItems?.categories?.includes(category._id)}
              indeterminate={isIndeterminate(category._id, 'subcategory')}
              onChange={(e) => handleSelection(category._id, "", "", e.target.checked)}
            />
            <label onClick={() => toggleCategory(category._id)}>{category.parent_cat_name}</label>
          </div>

          {expandedCategories[category._id] && renderSubcategories(category._id, category.subCategories)}
        </div>
      ));
  };

  const getSelectedCategoryNames = (items = selectedItems) => {
    return items && items?.categories
      ?.map((categoryId) => {
        const category = data?.find((cat) => cat._id === categoryId);
        return category ? category?.parent_cat_name : "";
      })
      .filter((name) => name) // Filter out any empty values
      .join(", ");
  };

  const getSelectedSubCategoryNames = (items = selectedItems) => {
    return items && items?.subCategories
      ?.map((subcategoryId) => {
        const subCategory = data
          ?.flatMap((category) => category?.subCategories)
          ?.find((sub) => sub?.id === subcategoryId);
        return subCategory ? subCategory?.name : "";
      })
      .filter((name) => name) // Filter out any empty values
      .join(", ");
  };

  const getSelectedSubSubCategoryNames = (items = selectedItems) => {
    return items && items?.subSubCategories
      ?.map((subSubCategoryId) => {
        const subSubCategory = data
          ?.flatMap((category) =>
            category?.subCategories?.flatMap((sub) =>
              sub?.subchildcategory?.filter((subSub) => subSub._id === subSubCategoryId)
            )
          )
          .find((subSub) => subSub._id === subSubCategoryId);
        return subSubCategory ? subSubCategory?.name : "";
      })
      .filter((name) => name) // Filter out any empty values
      .join(", ");
  };

  useEffect(() => {
    if (selectedItems) {
      setDisplaySelections({
        categories: selectedItems.categories || [],
        subCategories: selectedItems.subCategories || [],
        subSubCategories: selectedItems.subSubCategories || []
      });
    }
  }, [selectedItems]);

  const handleSave = () => {
    // Save the current selections to be displayed in the toggle
    setDisplaySelections({...selectedItems});
    // Close the dropdown
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container show-drop">
      <div className="category-input">
      <span onClick={toggleDropdown} className="dropdown-toggle">
          {getSelectedCategoryNames(displaySelections) || "Select Categories"}{" "}
          {getSelectedSubCategoryNames(displaySelections) && `| ${getSelectedSubCategoryNames(displaySelections)}`}
          {getSelectedSubSubCategoryNames(displaySelections) && `| ${getSelectedSubSubCategoryNames(displaySelections)}`}
        </span>
      </div>

      {isOpen && (
        <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
          <input
            type="text"
            placeholder="Search Categories..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />

          <div className="select-actions">
            <input
              className="form-check-input"
              type="checkbox"
              id="selectAll"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={selectedItems && selectedItems?.categories?.length === data.length}
            />
            <label htmlFor="selectAll">Select All</label>
            <span className="remove-all-btn ml-2" title="Remove" onClick={handleRemoveAll}>
              Remove All
            </span>
          </div>

          {renderCategories()}

          {/* Save button at the bottom */}
          <div className="dropdown-footer">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
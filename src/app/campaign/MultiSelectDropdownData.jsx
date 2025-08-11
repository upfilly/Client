import React, { useState, useEffect } from "react";
import "./MultiSelectDropdownData.css";

const MultiSelectDropdown = ({ data, selectedItems, setSelectedItems }) => {
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

  const searchInHierarchy = (category, searchTerm) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    // Check if category name matches
    if (category?.parent_cat_name?.toLowerCase().includes(term)) {
      return true;
    }

    // Check if any subcategory matches
    if (category?.subCategories?.some(sub => {
      // Check subcategory name
      if (sub.name?.toLowerCase().includes(term)) {
        return true;
      }

      // Check if any sub-subcategory matches
      if (sub.subchildcategory?.some(subSub =>
        subSub.name?.toLowerCase().includes(term)
      )) {
        return true;
      }

      return false;
    })) {
      return true;
    }

    return false;
  };

  // Function to determine if a subcategory should be shown based on search
  const shouldShowSubCategory = (subCategory, searchTerm) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    // Show if subcategory name matches
    if (subCategory.name?.toLowerCase().includes(term)) {
      return true;
    }

    // Show if any of its sub-subcategories match
    if (subCategory.subchildcategory?.some(subSub =>
      subSub.name?.toLowerCase().includes(term)
    )) {
      return true;
    }

    return false;
  };

  // Function to filter sub-subcategories based on search term
  const getFilteredSubSubCategories = (subSubCategories, searchTerm) => {
    if (!searchTerm) return subSubCategories || [];

    const term = searchTerm.toLowerCase();

    return (subSubCategories || []).filter(subSub =>
      subSub.name?.toLowerCase().includes(term)
    );
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const toggleSubCategory = (subCategoryId) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId],
    }));
  };

  // Helper function to find parent category of a subcategory
  const findParentCategory = (subcategoryId) => {
    return data.find(category =>
      category?.subCategories.some(sub => sub.id === subcategoryId)
    );
  };

  // Helper function to find parent subcategory of a sub-subcategory
  const findParentSubCategory = (subSubCategoryId) => {
    for (const category of data) {
      for (const subCategory of category?.subCategories) {
        if (subCategory.subchildcategory &&
          subCategory.subchildcategory.some(subSub => subSub._id === subSubCategoryId)) {
          return { category, subCategory };
        }
      }
    }
    return null;
  };

  const handleSelection = (categoryId, subcategoryId, subSubCategoryId, checked) => {
    setSelectedItems((prevState) => {
      let newCategories = prevState?.categories ? [...prevState.categories] : [];
      let newSubCategories = prevState?.subCategories ? [...prevState.subCategories] : [];
      let newSubSubCategories = prevState?.subSubCategories ? [...prevState.subSubCategories] : [];

      if (categoryId && !subcategoryId && !subSubCategoryId) {
        // Category selection logic - only select/deselect the category itself
        if (checked) {
          if (!newCategories.includes(categoryId)) {
            newCategories.push(categoryId);
          }
        } else {
          newCategories = newCategories.filter((item) => item !== categoryId);
          // When deselecting category, also deselect all its subcategories and sub-subcategories
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
        // Sub-subcategory selection logic
        if (checked) {
          if (!newSubSubCategories.includes(subSubCategoryId)) {
            newSubSubCategories.push(subSubCategoryId);
          }

          // Auto-select parent subcategory and category
          const parentInfo = findParentSubCategory(subSubCategoryId);
          if (parentInfo) {
            // Add parent subcategory if not already selected
            if (!newSubCategories.includes(parentInfo.subCategory.id)) {
              newSubCategories.push(parentInfo.subCategory.id);
            }

            // Add parent category if not already selected
            if (!newCategories.includes(parentInfo.category?._id)) {
              newCategories.push(parentInfo.category?._id);
            }
          }
        } else {
          newSubSubCategories = newSubSubCategories.filter((item) => item !== subSubCategoryId);
        }
      } else if (subcategoryId) {
        // Subcategory selection logic
        if (checked) {
          if (!newSubCategories.includes(subcategoryId)) {
            newSubCategories.push(subcategoryId);
          }

          // Auto-select parent category only
          const parentCategory = findParentCategory(subcategoryId);
          if (parentCategory && !newCategories.includes(parentCategory._id)) {
            newCategories.push(parentCategory._id);
          }
        } else {
          newSubCategories = newSubCategories.filter((item) => item !== subcategoryId);
          // When deselecting subcategory, also deselect all its sub-subcategories
          const subCategoryData = data
            ?.flatMap((item) => item?.subCategories)
            ?.find((item) => item?.id === subcategoryId);
          if (subCategoryData && subCategoryData?.subchildcategory) {
            subCategoryData?.subchildcategory?.forEach((subSub) => {
              newSubSubCategories = newSubSubCategories.filter((item) => item !== subSub?._id);
            });
          }
        }
      }

      // Only clean up when deselecting - don't interfere with direct selections
      if (!checked) {
        // Clean up parent selections only when deselecting
        data.forEach((category) => {
          const hasSelectedChild = category?.subCategories.some(sub =>
            newSubCategories.includes(sub.id) ||
            (sub.subchildcategory && sub.subchildcategory.some(subSub =>
              newSubSubCategories.includes(subSub._id)
            ))
          );
          // Only remove category if we're deselecting and it has no selected children
          if (!hasSelectedChild && newCategories.includes(category?._id) && categoryId === category?._id) {
            // This category is being deselected, so it's OK to remove it
          } else if (!hasSelectedChild && newCategories.includes(category?._id) && !categoryId) {
            // This category was auto-selected but now has no children, so remove it
            newCategories = newCategories.filter((id) => id !== category?._id);
          }
        });

        // Clean up subcategory selections only when deselecting
        data
          .flatMap((category) => category?.subCategories)
          .forEach((subCategory) => {
            if (subCategory.subchildcategory && subCategory.subchildcategory.length > 0) {
              const hasSelectedChild = subCategory.subchildcategory.some(subSub =>
                newSubSubCategories.includes(subSub._id)
              );
              // Only remove subcategory if we're deselecting and it has no selected children
              if (!hasSelectedChild && newSubCategories.includes(subCategory.id) && subcategoryId === subCategory.id) {
                // This subcategory is being deselected, so it's OK to remove it
              } else if (!hasSelectedChild && newSubCategories.includes(subCategory.id) && !subcategoryId) {
                // This subcategory was auto-selected but now has no children, so remove it
                newSubCategories = newSubCategories.filter((id) => id !== subCategory.id);
              }
            }
          });
      }

      return {
        categories: newCategories,
        subCategories: newSubCategories,
        subSubCategories: newSubSubCategories
      };
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Get all visible items based on search term
      const visibleCategories = data.filter(cat => searchInHierarchy(cat, searchTerm));

      const allCategories = visibleCategories.map(category => category._id);

      const allSubCategories = visibleCategories.flatMap(category =>
        category.subCategories
          .filter(sub => shouldShowSubCategory(sub, searchTerm))
          .map(sub => sub.id)
      );

      const allSubSubCategories = visibleCategories.flatMap(category =>
        category.subCategories.flatMap(sub =>
          getFilteredSubSubCategories(sub.subchildcategory, searchTerm)
            .map(subSub => subSub._id)
        )
      );

      setSelectedItems(prev => ({
        categories: [...new Set([...prev.categories, ...allCategories])],
        subCategories: [...new Set([...prev.subCategories, ...allSubCategories])],
        subSubCategories: [...new Set([...prev.subSubCategories, ...allSubSubCategories])],
      }));
    } else {
      // Get all visible items based on search term to deselect only those
      const visibleCategories = data.filter(cat => searchInHierarchy(cat, searchTerm));

      const allCategories = visibleCategories.map(category => category._id);

      const allSubCategories = visibleCategories.flatMap(category =>
        category.subCategories
          .filter(sub => shouldShowSubCategory(sub, searchTerm))
          .map(sub => sub.id)
      );

      const allSubSubCategories = visibleCategories.flatMap(category =>
        category.subCategories.flatMap(sub =>
          getFilteredSubSubCategories(sub.subchildcategory, searchTerm)
            .map(subSub => subSub._id)
        )
      );

      setSelectedItems(prev => ({
        categories: prev.categories.filter(id => !allCategories.includes(id)),
        subCategories: prev.subCategories.filter(id => !allSubCategories.includes(id)),
        subSubCategories: prev.subSubCategories.filter(id => !allSubSubCategories.includes(id)),
      }));
    }
  };

  const isAllVisibleSelected = () => {
    if (!data.length) return false;

    const visibleCategories = data.filter(cat => searchInHierarchy(cat, searchTerm));
    if (!visibleCategories.length) return false;

    // Check categories
    const allCategoriesSelected = visibleCategories.every(category =>
      selectedItems?.categories?.includes(category._id)
    );
    if (!allCategoriesSelected) return false;

    // Check subcategories
    const allSubCategoriesSelected = visibleCategories.every(category =>
      category.subCategories
        .filter(sub => shouldShowSubCategory(sub, searchTerm))
        .every(sub => selectedItems?.subCategories?.includes(sub.id))
    );
    if (!allSubCategoriesSelected) return false;

    // Check sub-subcategories
    const allSubSubCategoriesSelected = visibleCategories.every(category =>
      category.subCategories.every(sub =>
        getFilteredSubSubCategories(sub.subchildcategory, searchTerm)
          .every(subSub => selectedItems?.subSubCategories?.includes(subSub._id))
      ))

    return allSubSubCategoriesSelected;
  };

  const isSomeVisibleSelected = () => {
    if (!data.length) return false;

    const visibleCategories = data.filter(cat => searchInHierarchy(cat, searchTerm));
    if (!visibleCategories.length) return false;

    // Check if any category is selected
    const anyCategorySelected = visibleCategories.some(category =>
      selectedItems?.categories?.includes(category._id)
    );

    // Check if any subcategory is selected
    const anySubCategorySelected = visibleCategories.some(category =>
      category.subCategories
        .filter(sub => shouldShowSubCategory(sub, searchTerm))
        .some(sub => selectedItems?.subCategories?.includes(sub.id))
    );

    // Check if any sub-subcategory is selected
    const anySubSubCategorySelected = visibleCategories.some(category =>
      category.subCategories.some(sub =>
        getFilteredSubSubCategories(sub.subchildcategory, searchTerm)
          .some(subSub => selectedItems?.subSubCategories?.includes(subSub._id))
      )
    );

    return anyCategorySelected || anySubCategorySelected || anySubSubCategorySelected;
  };

  const handleRemoveAll = () => {
    setSelectedItems({ categories: [], subCategories: [], subSubCategories: [] });
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const isIndeterminate = (parentId, type) => {
    let selected = [];
    if (type === 'category') {
      selected = data.find((category) => category?._id === parentId)?.subCategories || [];
    } else if (type === 'subcategory') {
      selected = data
        .flatMap((category) => category?.subCategories)
        .find((subcategory) => subcategory.id === parentId)?.subchildcategory || [];
    }

    return selected.some((item) => selectedItems && selectedItems?.subSubCategories?.includes(item._id)) && !selected.every((item) => selectedItems && selectedItems.subSubCategories.includes(item._id));
  };

  const renderSubSubcategories = (categoryId, subcategoryId, subSubCategories) => {
    const filteredSubSubs = getFilteredSubSubCategories(subSubCategories, searchTerm);

    if (filteredSubSubs.length === 0 && searchTerm) return null;

    return (
      <div className={`sub-subcategory-container ${expandedSubCategories[subcategoryId] ? "open" : ""}`} style={{ marginLeft: "30px" }}>
        {filteredSubSubs.map((subSub) => (
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
  };

  const renderSubcategories = (categoryId, subCategories) => (
    <div className="subcategory-dropdown">
      {subCategories
        .filter(sub => shouldShowSubCategory(sub, searchTerm))
        .map((sub) => (
          <div key={sub.id} className="subcategory-container">
            <div className={sub.subchildcategory?.length > 0 ? "dropdown-item ml-3" : "ml-5"}>
              <input
                type="checkbox"
                className={sub.subchildcategory?.length > 0 ? "" : "form-check-input"}
                checked={selectedItems && selectedItems?.subCategories?.includes(sub.id)}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isIndeterminate(sub.id, 'subcategory');
                  }
                }}
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
      .filter((cat) => searchInHierarchy(cat, searchTerm))
      .map((category) => (
        <div key={category?._id} className="category-container">
          <div className={`${category?.subCategories?.length ? 'dropdown-item' : 'no-subcategory-item'} overflow-auto`}>
            <input
              type="checkbox"
              checked={selectedItems && selectedItems?.categories?.includes(category?._id)}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isIndeterminate(category?._id, 'category');
                }
              }}
              onChange={(e) => handleSelection(category?._id, "", "", e.target.checked)}
            />
            <label onClick={() => toggleCategory(category?._id)}>{category?.parent_cat_name}</label>
          </div>

          {expandedCategories[category?._id] && renderSubcategories(category?._id, category?.subCategories)}
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
    setDisplaySelections(selectedItems)
    if (searchTerm) {
      // Expand all categories that match the search or have matching children
      const newExpandedCategories = {};
      const newExpandedSubCategories = {};

      data.forEach(category => {
        // Check if category itself matches
        const categoryMatches = category?.parent_cat_name?.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if any subcategories match
        const hasMatchingSubCategories = category?.subCategories?.some(sub => {
          const subMatches = sub.name?.toLowerCase().includes(searchTerm.toLowerCase());
          const hasMatchingSubSub = sub.subchildcategory?.some(
            subSub => subSub.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return subMatches || hasMatchingSubSub;
        });

        if (categoryMatches || hasMatchingSubCategories) {
          newExpandedCategories[category._id] = true;

          // Expand matching subcategories
          category.subCategories?.forEach(sub => {
            const subMatches = sub.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const hasMatchingSubSub = sub.subchildcategory?.some(
              subSub => subSub.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (subMatches || hasMatchingSubSub) {
              newExpandedSubCategories[sub.id] = true;
            }
          });
        }
      });

      setExpandedCategories(newExpandedCategories);
      setExpandedSubCategories(newExpandedSubCategories);

    } else {
      setExpandedCategories({});
      setExpandedSubCategories({});
    }
  }, [searchTerm, data]);

  const handleSave = () => {
    // Save the current selections to be displayed in the toggle
    setDisplaySelections({ ...selectedItems });
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
        <div className={`dropdown-menu add-offer-select-category  ${isOpen ? "show" : ""}`}>
          <div className="search-container      " >
            <input
              type="text"
              placeholder="Search Categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>


          <div className="select-actions">
            <input
              className="form-check-input"
              type="checkbox"
              id="selectAll"
              onChange={(e) => handleSelectAll(e.target.checked)}
              checked={isAllVisibleSelected()}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isSomeVisibleSelected() && !isAllVisibleSelected();
                }
              }}
            />
            <label htmlFor="selectAll">Select All</label>
            <span className="remove-all-btn ml-md-2" title="Remove" onClick={handleRemoveAll}>
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
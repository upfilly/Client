
const FilterDropdown = () => (
    <div className="filter-dropdown-container">
      <div className="filter-dropdown-content">
        <div className="modal-header align-items-center bg_headers">
          <h2 className="modal-title fs-5">All Filter</h2>
          <button
            className="close-btn"
            onClick={() => setShowFilters(false)}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-footer gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary m-0"
              onClick={reset}
            >
              Clear all Filter
            </button>
          </div>
          <div className="height_fixed">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item"></div>
            </div>

            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsebx1"
                    aria-expanded="true"
                    aria-controls="collapsebx1"
                  >
                    <b>Select Category</b>
                    <i
                      className="fa fa-angle-down down_typs"
                      aria-hidden="true"
                    ></i>
                  </button>
                </h2>
                <div
                  id="collapsebx1"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <ul className="filter_ullist">
                      {category.map((category) => {
                        const isCategoryExpanded =
                          expandedCategories.includes(category._id);
                        return (
                          <li key={category._id}>
                            <div className="form-check d-flex justify-content-between align-items-center">
                              <div>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={category._id}
                                  name="category"
                                  value={category._id}
                                  checked={selectedCategory?.includes(
                                    category._id
                                  )}
                                  onChange={() =>
                                    handleCategoryChange(category)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={category._id}
                                >
                                  {category.parent_cat_name}
                                </label>
                              </div>

                              {category.subCategories?.length > 0 && (
                                <i
                                  className={`fa fa-angle-${
                                    isCategoryExpanded ? "down" : "right"
                                  } toggle-arrow`}
                                  onClick={() => toggleCategory(category._id)}
                                  style={{ cursor: "pointer" }}
                                ></i>
                              )}
                            </div>

                            {isCategoryExpanded && (
                              <ul className="sub_ulbx">
                                {category.subCategories.map((subCategory) => {
                                  const isSubExpanded =
                                    expandedSubCategories.includes(
                                      subCategory.id
                                    );
                                  return (
                                    <li key={subCategory.id}>
                                      <div className="form-check d-flex justify-content-between align-items-center">
                                        <div>
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={subCategory.id}
                                            name="subCategory"
                                            value={subCategory.id}
                                            checked={selectedSubCategory?.includes(
                                              subCategory.id
                                            )}
                                            onChange={() =>
                                              handleSubCategoryChange(
                                                subCategory
                                              )
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor={subCategory.id}
                                          >
                                            {subCategory.name}
                                          </label>
                                        </div>

                                        {subCategory.subchildcategory?.length >
                                          0 && (
                                          <i
                                            className={`fa fa-angle-${
                                              isSubExpanded ? "down" : "right"
                                            } toggle-arrow`}
                                            onClick={() =>
                                              toggleSubCategory(subCategory.id)
                                            }
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        )}
                                      </div>

                                      {isSubExpanded &&
                                        subCategory.subchildcategory?.length >
                                          0 && (
                                          <ul>
                                            {subCategory.subchildcategory.map(
                                              (subSubCategory) => (
                                                <li
                                                  key={subSubCategory._id}
                                                >
                                                  <div className="form-check">
                                                    <input
                                                      className="form-check-input"
                                                      type="checkbox"
                                                      id={subSubCategory._id}
                                                      name="subSubCategory"
                                                      value={subSubCategory._id}
                                                      checked={selectedSubSubCategory?.includes(
                                                        subSubCategory._id
                                                      )}
                                                      onChange={() =>
                                                        handleSubSubCategoryChange(
                                                          subSubCategory
                                                        )
                                                      }
                                                    />
                                                    <label
                                                      className="form-check-label"
                                                      htmlFor={
                                                        subSubCategory._id
                                                      }
                                                    >
                                                      {subSubCategory.name}
                                                    </label>
                                                  </div>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        )}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsebxRegionCountry"
                      aria-expanded="true"
                      aria-controls="collapsebxRegionCountry"
                    >
                      <b>Select Region & Country</b>
                      <i
                        className="fa fa-angle-down down_typs"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </h2>
                  <div
                    id="collapsebxRegionCountry"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <ul className="filter_ullist">
                        <ul className="filter_ullist">
                          {Object.keys(regionData).map((region) => (
                            <li key={region}>
                              <div className="form-check d-flex justify-content-between align-items-center">
                                <div>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={region}
                                    value={region}
                                    checked={selectedRegion?.includes(region)}
                                    onChange={() => handleRegionChange(region)}
                                  />
                                  <label
                                    className="form-check-label ms-2"
                                    htmlFor={region}
                                  >
                                    <b>{region}</b>
                                  </label>
                                </div>
                                <i
                                  className={`fa fa-angle-${
                                    expandedRegions.includes(region)
                                      ? "down"
                                      : "right"
                                  } cursor-pointer`}
                                  onClick={() => toggleRegionExpand(region)}
                                  aria-hidden="true"
                                ></i>
                              </div>

                              {expandedRegions.includes(region) && (
                                <ul className="filter_ullist ms-4">
                                  {regionData[region].map((country) => (
                                    <li key={country}>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={country}
                                          name="country"
                                          value={country}
                                          checked={selectedCountries?.includes(
                                            country
                                          )}
                                          onChange={() =>
                                            handleCountryChange(country)
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={country}
                                        >
                                          {country}
                                        </label>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

export default FilterDropdown;


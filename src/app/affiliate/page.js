"use client";

import react, { useEffect, useState, useCallback, useRef } from "react";
import Layout from "../components/global/layout";
import "./style.scss";
import crendentialModel from "@/models/credential.model";
import ApiClient from "@/methods/api/apiClient";
import SelectDropdown from "../components/common/SelectDropdown";
import datepipeModel from "@/models/datepipemodel";
import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import methodModel from "../../methods/methods";
import environment from "../../environment/index";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import React from "react";

export default function affilate() {
  const history = useRouter();
  const user = crendentialModel.getUser();
  const initialRender = useRef(true);
  const initialLoadComplete = useRef(false);
  const isInitializing = useRef(true);

  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    role: "affiliate",
    search: "",
    isDeleted: false,
    status: "",
    invite_status: "",
    end_date: "",
    start_date: "",
    affiliate_group_id: "",
    sub_category_id: "",
    sub_child_category_id: "",
    category_id: "",
    cat_type: "",
  });

  const [form, setform] = useState({
    message: "",
    tags: [],
    campaign_id: "",
  });

  const [groupForm, setGroupform] = useState({
    affiliate_group: "",
  });

  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [affiliategroup, setAffiliategroup] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [category, setCategory] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [groupShow, setGroupShow] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [selectedAffiliteid, setselectedAffiliteid] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState([]);
  const [Campaigns, setCampaign] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
  const [categoryType, setCategoryType] = useState([]);
  const [camppaignData, setCamppaignData] = useState([]);

  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const handleClose = () => {
    setShow(false), setselectedAffiliteid([]);
  };
  const handleShow = () => setShow(true);
  const handleGroupClose = () => setGroupShow(false);
  const handleGroupShow = () => setGroupShow(true);

  console.log(filters, "paramsparamsparams");

  const view = (id) => {
    const filterParams = {
      ...filters,
      page: 1,
      start_date: startDate ? startDate.toISOString().split("T")[0] : null,
      end_date: endDate ? endDate.toISOString().split("T")[0] : null,
      category_type: categoryType?.join(","),
      category: selectedCategory?.join(","),
      sub_category: selectedSubCategory?.join(","),
      sub_child_category: selectedSubSubCategory?.join(","),
    };

    const queryString = new URLSearchParams(filterParams).toString();
    history.push(`/affiliate/detail/${id}?${queryString}`);
  };

  function parseStringToArray(input) {
    if (typeof input !== "string") return [];
    return input.split(",").map((item) => item.trim());
  }

  const resetUrl = () => {
    let filter = {
      status: "",
      role: "",
      search: "",
      page: 1,
      count: 10,
    };
    setFilter({ ...filters, ...filter });
    getData({ ...filter, page: 1 });
    setSelectedCurrency("USD");
    history.push("/campaignManagement");
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCampaignData = (p = {}) => {
    let url = "campaign/brand/all";
    ApiClient.get(url, { brand_id: user?.id }).then((res) => {
      if (res.success) {
        const campaign = res.data.data.map((dat) => {
          return {
            name: dat?.name,
            id: dat?.id || dat?._id,
            isDefault: dat?.isDefault,
          };
        });
        campaign.sort((a, b) => b.isDefault - a.isDefault);
        setCamppaignData(campaign);
      }
    });
  };

  const toggleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleCategoryTypeChange = (id) => {
    setCategoryType((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory((prev) =>
      prev.includes(category._id)
        ? prev.filter((item) => item !== category._id)
        : [...prev, category._id]
    );
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory((prev) =>
      prev.includes(subCategory.id)
        ? prev.filter((item) => item !== subCategory.id)
        : [...prev, subCategory.id]
    );
  };

  const handleSubSubCategoryChange = (subSubCategory) => {
    setSelectedSubSubCategory((prev) =>
      prev.includes(subSubCategory._id)
        ? prev.filter((item) => item !== subSubCategory._id)
        : [...prev, subSubCategory._id]
    );
  };

  const handleRowClick = (id) => {
    const isExpanded = expandedRowId.includes(id);
    if (isExpanded) {
      setExpandedRowId(expandedRowId.filter((rowId) => rowId !== id));
    } else {
      setExpandedRowId([...expandedRowId, id]);
    }
  };

  const permission = (p) => {
    if (user && user?.permission_detail && p) {
      return user?.permission_detail[p];
    } else {
      return false;
    }
  };

  const categoryTypes = [
    { id: "promotional_models", name: "Promotional Models" },
    { id: "property_types", name: "Property Types" },
  ];

  const handleCountChange = (count) => {
    const newFilters = { ...filters, count: count, page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      if (!form.tags.includes(tagInput)) {
        setform({ ...form, tags: [...form.tags, tagInput] });
      } else {
        toast.error("Tag already exists.");
      }
      setTagInput("");
    }
  };

  const handleDeleteTag = (index) => {
    const newTags = [...form.tags];
    newTags.splice(index, 1);
    setform({ ...form, tags: newTags });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filter();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form?.campaign_id || !form?.message) {
      setSubmitted(true);
      return;
    }

    const payload = {
      affiliate_id: selectedAffiliteid,
      brand_id: user?.id || user?._id,
      ...form,
    };
    ApiClient.post(`addInvite`, payload).then((res) => {
      if (res.success) {
        getData({ page: 1 });
        setform({
          message: "",
          tags: [],
          campaign_id: "",
        });
        toast.success("Invitation Send Successfully..");
        handleClose();
      }
    });
  };

  const selectedGroupId = selectedOptions.map((item) => {
    return item?.id;
  });

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // Create new filter object with date changes
    const newFilters = {
      ...filters,
      start_date: start ? start.toISOString().split("T")[0] : "",
      end_date: end ? end.toISOString().split("T")[0] : "",
      page: 1 // Reset to first page
    };

    setFilter(newFilters);

    // Only call getData if initial load is complete
    if (initialLoadComplete.current) {
      getData(newFilters);
    }
  };

  const getData = useCallback((p = {}) => {
    console.log("getData called with:", p);
    setLoader(true);
    let filter = { ...filters, ...p };

    if (
      filter?.start_date == null ||
      filter?.start_date == "null" ||
      !filter?.start_date
    ) {
      filter = {
        ...filter,
        start_date: "",
        end_date: "",
      };
    }

    console.log("API Call with filters:", filter);
    ApiClient.get(`getAllAffiliateForBrand`, filter).then((res) => {
      if (res.success) {
        setData(res?.data);
        setTotal(res?.data?.total);
        setLoader(false);
      }
    }).catch((error) => {
      console.error("API Error:", error);
      setLoader(false);
    });
  }, [])

  const getCategory = (p = {}) => {
    let url = `categoryWithSub?page&count&search&cat_type=promotional_models,property_types&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data;
        setCategory(data);
      }
    });
  };

  useEffect(() => {
    const initializeComponent = async () => {

      const params = Object.fromEntries(searchParams.entries());

      const parsedSelectedCategory = parseStringToArray(params?.category);
      const parsedSelectedSubCategory = parseStringToArray(params?.sub_category);
      const parsedSelectedSubSubCategory = parseStringToArray(params?.sub_child_category);

      const startDateParam =
        params.start_date && params.start_date !== "null"
          ? new Date(params.start_date)
          : null;
      const endDateParam =
        params.end_date && params.end_date !== "null"
          ? new Date(params.end_date)
          : null;

      setSelectedCategory(parsedSelectedCategory);
      setSelectedSubCategory(parsedSelectedSubCategory);
      setSelectedSubSubCategory(parsedSelectedSubSubCategory);
      setEndDate(endDateParam);
      setStartDate(startDateParam);

      const initialFilters = {
        ...filters,
        ...params,
        page: 1,
        count: 10,
        start_date: startDateParam
          ? startDateParam.toISOString().split("T")[0]
          : "",
        end_date: endDateParam ? endDateParam.toISOString().split("T")[0] : "",
        cat_type: params.cat_type || "",
        category_id: parsedSelectedCategory.length > 0
          ? parsedSelectedCategory.join(",")
          : "",
        sub_category_id: parsedSelectedSubCategory.length > 0
          ? parsedSelectedSubCategory.join(",")
          : "",
        sub_child_category_id: parsedSelectedSubSubCategory.length > 0
          ? parsedSelectedSubSubCategory.join(",")
          : "",
      };

      setFilter(initialFilters);

      await getCategory();

      getData(initialFilters);

      isInitializing.current = false;
      initialLoadComplete.current = true;
      initialRender.current = false;
    };

    initializeComponent();
  }, [searchParams]);

  useEffect(() => {
    if (isInitializing.current || !initialLoadComplete.current) {
      return;
    }

    const hasCategoryType = categoryType?.length > 0;
    const hasSelectedCategory = selectedCategory?.length > 0;
    const hasSelectedSubCategory = selectedSubCategory?.length > 0;
    const hasSelectedSubSubCategory = selectedSubSubCategory?.length > 0;

    const newFilters = {
      ...filters,
      page: 1,
      cat_type: hasCategoryType ? categoryType.join(",") : "",
      category_id: hasSelectedCategory ? selectedCategory.join(",") : "",
      sub_category_id: hasSelectedSubCategory ? selectedSubCategory.join(",") : "",
      sub_child_category_id: hasSelectedSubSubCategory ? selectedSubSubCategory.join(",") : "",
    };

    const hasChanges =
      newFilters.cat_type !== filters.cat_type ||
      newFilters.category_id !== filters.category_id ||
      newFilters.sub_category_id !== filters.sub_category_id ||
      newFilters.sub_child_category_id !== filters.sub_child_category_id;

    if (hasChanges) {
      console.log("Category filters changed, updating..."); // Debug log
      setFilter(newFilters);
      getData(newFilters);
    }
  }, [categoryType, selectedCategory, selectedSubCategory, selectedSubSubCategory]);

  useEffect(() => {
    if (isInitializing.current || !initialLoadComplete.current || selectedOptions?.length === 0) {
      return;
    }

    const newFilters = {
      ...filters,
      affiliate_group_id: selectedGroupId.join(","),
      page: 1
    };

    console.log("Affiliate group filters changed, updating..."); // Debug log
    setFilter(newFilters);
    getData(newFilters);
  }, [selectedOptions]);

  useEffect(() => {
    handleAffiliateGroup();
    handleCampaign();
    getCampaignData();
  }, []);

  const pageChange = (e) => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    // if (e.selected === 0 || e.selected === undefined) return
    const newFilters = { ...filters, page: e.selected };
    setFilter(newFilters);
    getData({ ...newFilters, page: e.selected + 1 });
  };

  const filter = (p = {}) => {
    const newFilters = { ...filters, ...p, page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key == key) {
      if (filters?.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }

    let sortBy = `${key} ${sorder}`;
    const newFilters = { ...filters, sortBy, key, sorder, page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const ChangeStatus = (e) => {
    const newFilters = { ...filters, invite_status: e, page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const ChangeCampaign = (e) => {
    const newFilters = { ...filters, campaign: e, page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const reset = () => {
    let newFilter = {
      status: "",
      invite_status: "",
      role: "affiliate",
      search: "",
      campaign: "",
      page: 1,
      count: 10,
      end_date: "",
      start_date: "",
      affiliate_group_id: "",
      sub_category_id: "",
      sub_child_category_id: "",
      category_id: "",
      cat_type: "",
    };

    setStartDate(null);
    setEndDate(null);
    setCategoryType([]);
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setSelectedSubSubCategory([]);
    setSelectedOptions([]);
    setIsOpen(false);

    setFilter(newFilter);
    getData(newFilter);
    history.push("/affiliate");
  };

  const handleAffiliateGroup = () => {
    ApiClient.get("affiliate-groups", {
      status: "active",
      addedBy: user?.id,
      group_type: "affiliate",
    }).then((res) => {
      if (res.success == true) {
        setAffiliategroup(res?.data?.data);
      }
    });
  };

  const handleCampaign = () => {
    ApiClient.get("campaign/brand/all", { brand_id: user?.id }).then((res) => {
      if (res.success == true) {
        const data = res?.data?.data?.map((data) => ({
          id: data?.id || data?._id,
          name: data?.name,
          isDefault: data?.isDefault,
        }));
        data.sort((a, b) => b.isDefault - a.isDefault);
        setCampaign(data);
      }
    });
  };

  const handleSetGroup = (e) => {
    e.preventDefault();
    const data = {
      id: selectedAffiliteid,
      affiliate_group: groupForm?.affiliate_group,
    };
    ApiClient.put("edit/profile", data).then((res) => {
      if (res.success == true) {
        handleGroupClose();
        getData({ search: "", page: 1 });
      }
    });
  };

  const clear = () => {
    const newFilters = { ...filters, search: "", page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const MultiSelectAffliates = (add, id) => {
    let data = selectedAffiliteid;
    if (add) {
      data.push(id);
      setselectedAffiliteid([...data]);
    } else {
      data = data.filter((itm) => itm !== id);
      setselectedAffiliteid([...data]);
    }
  };

  const handleAddCampaign = () => {
    history.push("/campaign/add");
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all not-invited affiliates
      const allNotInvitedIds = data?.data
        .filter((itm) => itm.invite_status === "not_invited")
        .map((itm) => itm.id);
      setselectedAffiliteid(allNotInvitedIds);
    } else {
      // Deselect all
      setselectedAffiliteid([]);
    }
  };

  const getSelectedCategoryNames = () => {
    const names = [];
    selectedCategory.forEach((catId) => {
      const cat = category.find((c) => c._id === catId);
      if (cat) names.push(cat.parent_cat_name || "Promotional Models");
    });
    selectedSubCategory.forEach((subCatId) => {
      category.forEach((cat) => {
        const subCat = cat.subCategories?.find((sc) => sc.id === subCatId);
        if (subCat) names.push(subCat.name);
      });
    });
    selectedSubSubCategory.forEach((subSubCatId) => {
      category.forEach((cat) => {
        cat.subCategories?.forEach((subCat) => {
          const subSubCat = subCat.subchildcategory?.find(
            (ssc) => ssc._id === subSubCatId
          );
          if (subSubCat) names.push(subSubCat.name);
        });
      });
    });
    return names;
  };

  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  // Filter categories based on search term
  const filteredCategories = category.filter((cat) => {
    const matchesSearch =
      cat.parent_cat_name
        ?.toLowerCase()
        .includes(categorySearchTerm.toLowerCase()) ||
      cat.subCategories?.some(
        (subCat) =>
          subCat.name
            .toLowerCase()
            .includes(categorySearchTerm.toLowerCase()) ||
          subCat.subchildcategory?.some((subSubCat) =>
            subSubCat.name
              .toLowerCase()
              .includes(categorySearchTerm.toLowerCase())
          )
      );

    return matchesSearch;
  });

  // Automatically expand categories when searching
  useEffect(() => {
    if (categorySearchTerm) {
      const expandedIds = [];
      category.forEach((cat) => {
        if (
          cat.parent_cat_name
            ?.toLowerCase()
            .includes(categorySearchTerm.toLowerCase())
        ) {
          expandedIds.push(cat._id);
        }
        cat.subCategories?.forEach((subCat) => {
          if (
            subCat.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
          ) {
            expandedIds.push(cat._id);
          }
        });
      });
      setExpandedCategories([...new Set(expandedIds)]);
    }
  }, [categorySearchTerm, category]);

  return (
    <>
      <Layout
        handleKeyPress={handleKeyPress}
        setFilter={setFilter}
        reset={reset}
        filter={filter}
        name="Affiliates"
        filters={filters}
      >
        <div className="nmain-list mb-3">
          <div className="row align-items-center mx-0">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="set_modal postion-relative">
                <div className="d-flex gap-2 align-items-center affilitate-top-dropdowns  flex-wrap">
                  {/* Category Filter Dropdown */}
                  <>
                    <div className="dropdown position-relative">
                      <button
                        className="btn dropdown-toggle"
                        style={{ border: "1px solid #ccc" }}
                        type="button"
                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      >
                        {getSelectedCategoryNames().length > 0
                          ? `Categories (${getSelectedCategoryNames().length})`
                          : "Select Categories"}
                      </button>

                      {categoryDropdownOpen && (
                        <div
                          className="dropdown-menu select-category show position-absolute"
                          style={{
                            maxHeight: "400px",
                            overflowY: "auto",
                            width: "350px",
                            zIndex: 1050,
                            padding: "10px",
                          }}
                        >
                          <div className="p-3 p-md-4">
                            <h6 className="mb-3">Select Category of Affiliate</h6>

                            {/* Search input for categories */}
                            <div className="mb-3">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search categories..."
                                value={categorySearchTerm}
                                onChange={(e) => setCategorySearchTerm(e.target.value)}
                              />
                            </div>

                            <ul className="list-unstyled">
                              {filteredCategories.length > 0 ? (
                                // Group categories by cat_type and sort alphabetically
                                Object.entries(
                                  filteredCategories.reduce((acc, category) => {
                                    const type = category.cat_type || 'Other';
                                    if (!acc[type]) acc[type] = [];
                                    acc[type].push(category);
                                    return acc;
                                  }, {})
                                )
                                  // Sort the groups (cat_types) alphabetically
                                  .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
                                  .map(([type, categories]) => (
                                    <li key={type}>
                                      <h6 className="mt-3 mb-2 text-muted">{type == "promotional_models" ? "Promotional Models" : "Property Types"}</h6>
                                      {/* Sort categories alphabetically within each group */}
                                      {categories
                                        .sort((a, b) => (a.parent_cat_name || "").localeCompare(b.parent_cat_name || ""))
                                        .map((categoryItem) => (
                                          <li key={categoryItem._id} className="mb-2">
                                            <div className="form-check d-flex justify-content-between align-items-center">
                                              <div>
                                                <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  id={`cat-${categoryItem._id}`}
                                                  checked={selectedCategory?.includes(
                                                    categoryItem._id
                                                  )}
                                                  onChange={() =>
                                                    handleCategoryChange(categoryItem)
                                                  }
                                                />
                                                <label
                                                  className="form-check-label ms-2"
                                                  htmlFor={`cat-${categoryItem._id}`}
                                                >
                                                  {categoryItem.parent_cat_name ||
                                                    "Promotional Models"}
                                                </label>
                                              </div>
                                              {categoryItem.subCategories?.length > 0 && (
                                                <i
                                                  className={`fa fa-angle-${expandedCategories.includes(
                                                    categoryItem._id
                                                  )
                                                    ? "down"
                                                    : "right"
                                                    } cursor-pointer`}
                                                  onClick={() =>
                                                    toggleCategoryExpand(categoryItem._id)
                                                  }
                                                ></i>
                                              )}
                                            </div>

                                            {expandedCategories.includes(
                                              categoryItem._id
                                            ) && (
                                                <ul className="list-unstyled ms-4 mt-2">
                                                  {/* Sort subcategories alphabetically */}
                                                  {categoryItem.subCategories
                                                    .filter(
                                                      (subCat) =>
                                                        !categorySearchTerm ||
                                                        subCat.name
                                                          .toLowerCase()
                                                          .includes(
                                                            categorySearchTerm.toLowerCase()
                                                          ) ||
                                                        subCat.subchildcategory?.some(
                                                          (subSubCat) =>
                                                            subSubCat.name
                                                              .toLowerCase()
                                                              .includes(
                                                                categorySearchTerm.toLowerCase()
                                                              )
                                                        )
                                                    )
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((subCategory) => (
                                                      <li
                                                        key={subCategory.id}
                                                        className="mb-1"
                                                      >
                                                        <div className="form-check d-flex justify-content-between align-items-center">
                                                          <div>
                                                            <input
                                                              className="form-check-input"
                                                              type="checkbox"
                                                              id={`subcat-${subCategory.id}`}
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
                                                              className="form-check-label ms-2"
                                                              htmlFor={`subcat-${subCategory.id}`}
                                                            >
                                                              {subCategory.name}
                                                            </label>
                                                          </div>
                                                          {subCategory.subchildcategory
                                                            ?.length > 0 && (
                                                              <i
                                                                className={`fa fa-angle-${expandedSubCategories.includes(
                                                                  subCategory.id
                                                                )
                                                                  ? "down"
                                                                  : "right"
                                                                  } cursor-pointer`}
                                                                onClick={() =>
                                                                  toggleSubCategoryExpand(
                                                                    subCategory.id
                                                                  )
                                                                }
                                                              ></i>
                                                            )}
                                                        </div>

                                                        {expandedSubCategories.includes(
                                                          subCategory.id
                                                        ) &&
                                                          subCategory.subchildcategory
                                                            ?.length > 0 && (
                                                            <ul className="list-unstyled ms-4 mt-1">
                                                              {/* Sort sub-subcategories alphabetically */}
                                                              {subCategory.subchildcategory
                                                                .filter(
                                                                  (subSubCat) =>
                                                                    !categorySearchTerm ||
                                                                    subSubCat.name
                                                                      .toLowerCase()
                                                                      .includes(
                                                                        categorySearchTerm.toLowerCase()
                                                                      )
                                                                )
                                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                                .map((subSubCategory) => (
                                                                  <li
                                                                    key={subSubCategory._id}
                                                                    className="mb-1"
                                                                  >
                                                                    <div className="form-check">
                                                                      <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`subsubcat-${subSubCategory._id}`}
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
                                                                        className="form-check-label ms-2"
                                                                        htmlFor={`subsubcat-${subSubCategory._id}`}
                                                                      >
                                                                        {
                                                                          subSubCategory.name
                                                                        }
                                                                      </label>
                                                                    </div>
                                                                  </li>
                                                                ))}
                                                            </ul>
                                                          )}
                                                      </li>
                                                    ))}
                                                </ul>
                                              )}
                                          </li>
                                        ))}
                                    </li>
                                  ))
                              ) : (
                                <li className="text-muted">No categories found</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Invitation Status Filter */}
                    <div className="w-25  All-status-dropdown" >
                      <SelectDropdown
                        theme="search"
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="Status"
                        className="mt-2"
                        intialValue={filters.invite_status}
                        result={(e) => {
                          ChangeStatus(e.value);
                        }}
                        options={[
                          { id: "not_invited", name: "Not Invited" },
                          { id: "accepted", name: "Accepted" },
                          { id: "pending", name: "Pending" },
                          { id: "rejected", name: "Rejected" },
                        ]}
                      />
                    </div>

                    {/* Campaign Filter */}
                    <div className="w-25 all-campaign-dropdown ">
                      <SelectDropdown
                        theme="search"
                        id="campaignDropdown"
                        displayValue="name"
                        placeholder="All Campaign"
                        className="mt-2"
                        intialValue={filters.campaign}
                        result={(e) => {
                          ChangeCampaign(e.value);
                        }}
                        options={camppaignData}
                      />
                    </div>

                    {/* Date Range Filter */}
                    <div className="datepicker-dropdown-wrapper">
                      <DatePicker
                        className="datepicker-field"
                        selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        showIcon
                        placeholderText="Date Range"
                        selectsRange
                      />
                    </div>
                  </>


                  {/* Reset Button */}
                  {(selectedSubSubCategory?.length ||
                    selectedCategory?.length ||
                    selectedSubCategory?.length ||
                    filters.invite_status ||
                    filters.campaign ||
                    filters.status ||
                    filters.affiliate_group_id ||
                    filters.end_date ||
                    filters.start_date) && (
                      <button className="btn btn-primary" onClick={reset}>
                        Reset
                      </button>
                    )}

                  {/* Action Dropdown for Multiple Selection */}
                  {(user?.role == "brand" || permission("affiliate_group")) &&
                    selectedAffiliteid?.length > 1 && (
                      // <DropdownButton
                      //   variant="primary"
                      //   id="dropdown-basic-button"
                      //   title="Action"
                      // >
                      //   <Dropdown.Item as="button" onClick={handleShow}>
                      //     Send multiple invites to affiliates
                      //   </Dropdown.Item>
                      // </DropdownButton>
                      <button className="btn btn-primary" onClick={handleShow}>
                        Send Invites
                      </button>
                    )}
                </div>


















              </div>
            </div>
          </div>

          {/* Close dropdown when clicking outside */}
          {categoryDropdownOpen && (
            <div
              className="position-fixed w-100 h-100"
              style={{ top: 0, left: 0, zIndex: 1040 }}
              onClick={() => setCategoryDropdownOpen(false)}
            />
          )}

          {/* Rest of your component remains the same - table, modals, pagination, etc. */}
          <div className="row mx-0 mt-3">
            <div className="col-md-12">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="thead-clr">
                    <tr>
                      <th scope="col">
                        <label className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            className="form-check-input check_bx_input"
                            checked={
                              selectedAffiliteid.length === data?.data?.length
                            }
                            onChange={handleSelectAll}
                          />
                          <span className="checkbox-btn"></span>
                        </label>
                      </th>
                      <th scope="col" onClick={(e) => sorting("fullName")}>
                        Affiliate{" "}
                        {filters?.sorder === "asc" ? (
                          <i className="fa fa-caret-up" aria-hidden="true"></i>
                        ) : (
                          <i
                            className="fa fa-caret-down"
                            aria-hidden="true"
                          ></i>
                        )}
                      </th>
                      <th scope="col" onClick={(e) => sorting("email")}>
                        Email{" "}
                        {filters?.sorder === "asc" ? (
                          <i className="fa fa-caret-up" aria-hidden="true"></i>
                        ) : (
                          <i
                            className="fa fa-caret-down"
                            aria-hidden="true"
                          ></i>
                        )}
                      </th>
                      <th
                        scope="col"
                        onClick={(e) => sorting("affiliate_group_name")}
                      >
                        Affiliate Group{" "}
                        {filters?.sorder === "asc" ? (
                          <i className="fa fa-caret-up" aria-hidden="true"></i>
                        ) : (
                          <i
                            className="fa fa-caret-down"
                            aria-hidden="true"
                          ></i>
                        )}
                      </th>
                      <th scope="col">Campaign</th>
                      <th scope="col" onClick={(e) => sorting("createdAt")}>
                        Join Date{" "}
                        {filters?.sorder === "asc" ? (
                          <i className="fa fa-caret-up" aria-hidden="true"></i>
                        ) : (
                          <i
                            className="fa fa-caret-down"
                            aria-hidden="true"
                          ></i>
                        )}
                      </th>
                      <th scope="col" onClick={(e) => sorting("status")}>
                        Invitation Status
                        {filters?.sorder === "asc" ? (
                          <i className="fa fa-caret-up" aria-hidden="true"></i>
                        ) : (
                          <i
                            className="fa fa-caret-down"
                            aria-hidden="true"
                          ></i>
                        )}
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loaging &&
                      data?.data?.map((itm) => {
                        console.log(itm, "lkllklklk")
                        return (
                          <React.Fragment key={itm.id}>
                            <tr className="table_row">
                              <td>
                                <label className="d-flex align-items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="form-check-input check_bx_input"
                                    checked={
                                      selectedAffiliteid?.includes(itm.id)
                                        ? true
                                        : false
                                    }
                                    disabled={
                                      itm.invite_status == "not_invited"
                                        ? false
                                        : true
                                    }
                                    onChange={(e) =>
                                      MultiSelectAffliates(
                                        e.target.checked,
                                        itm.id
                                      )
                                    }
                                  />
                                  <span
                                    className={
                                      itm.invite_status == "not_invited"
                                        ? "checkbox-btn"
                                        : "disable_check"
                                    }
                                  ></span>
                                </label>
                              </td>
                              <td className="profile_height">
                                <div
                                  className="d-flex align-items-center"
                                  onClick={(e) => view(itm.id)}
                                >
                                  {itm?.image ? (
                                    <img
                                      className="person-img"
                                      src={`${environment?.api}/${itm?.image}`}
                                      alt=""
                                    ></img>
                                  ) : (
                                    <img
                                      className="person-img"
                                      src="/assets/img/likjh.jpeg"
                                      alt=""
                                    ></img>
                                  )}
                                  <p className="name-person ml-2">
                                    {methodModel?.capitalizeFirstLetter(
                                      itm?.fullName
                                    )}
                                  </p>
                                </div>

                                {!expandedRowId.includes(itm.id) ? (
                                  <span
                                    className="show_morebx"
                                    onClick={() => handleRowClick(itm.id)}
                                  >
                                    Show More
                                  </span>
                                ) : (
                                  <span
                                    className="show_morebx"
                                    onClick={() => handleRowClick(itm.id)}
                                  >
                                    Show Less
                                  </span>
                                )}
                              </td>
                              <td>
                                <p className="name-person ml-2" href="">
                                  {itm?.email}
                                </p>
                              </td>
                              <td>
                                <p className="name-person ml-2" href="">
                                  {itm?.affiliate_group_name || "--"}
                                </p>
                              </td>
                              <td>
                                <p className="name-person ml-2" href="">
                                  {itm?.campaign_details?.name || "--"}
                                </p>
                              </td>
                              <td>
                                <p className="td-set">
                                  {datepipeModel.date(itm?.createdAt)}
                                </p>
                              </td>
                              <td className="table_dats">
                                <span className={`active_btn${itm?.status}`}>
                                  <span className={itm.status}>
                                    {itm.invite_status == "accepted"
                                      ? "Accepted"
                                      : itm.invite_status == "not_invited"
                                        ? "Not Invited"
                                        : "Pending"}
                                  </span>
                                </span>
                              </td>

                              <td>
                                <div className="action_icons">
                                  {(user?.role == "brand" ||
                                    permission("affiliate_invite")) && (
                                      <button
                                        disabled={
                                          itm.invite_status == "not_invited"
                                            ? false
                                            : true
                                        }
                                        className="btn btn-primary btn_primary"
                                        onClick={() => {
                                          handleShow();
                                          setselectedAffiliteid([itm?.id]);
                                        }}
                                      >
                                        <i
                                          className="fa fa-plus fa_icns"
                                          title="Invite"
                                        ></i>
                                      </button>
                                    )}
                                  <span
                                    className="btn btn-primary btn_primary"
                                    onClick={() => {
                                      history.push(`/chat`);
                                      localStorage.setItem(
                                        "chatId",
                                        itm?._id || itm?.id
                                      );
                                    }}
                                  >
                                    <i
                                      className="fa fa-comment-o fa_icns"
                                      title="Chat"
                                    ></i>
                                  </span>
                                  {(user?.role == "brand" ||
                                    permission("affiliate_group")) && (
                                      <button
                                        className="btn btn-primary btn_primary"
                                        onClick={() => {
                                          handleGroupShow();
                                          setselectedAffiliteid(
                                            itm?.id || itm?._id
                                          );
                                        }}
                                      >
                                        <i
                                          className="fa-solid fa-people-group fa_icns"
                                          title="Add Group"
                                        ></i>
                                      </button>
                                    )}
                                </div>
                              </td>
                            </tr>

                            {expandedRowId.includes(itm.id) && (
                              <tr className="table_row show_mores">
                                <td>
                                  <label className="form-label">
                                    Affiliate Type:
                                  </label>
                                  <p className="affi_tabbls">
                                    {itm.affiliate_type || "--"}
                                  </p>
                                </td>
                                <td>
                                  <label className="form-label">
                                    Social Media Platforms:
                                  </label>
                                  <p className="affi_tabbls">
                                    {itm.propertyType?.length > 0
                                      ? itm.propertyType.map((dat) => dat?.name).join(",")
                                      : "--"}
                                  </p>
                                </td>
                                <td>
                                  <label className="form-label">
                                    Category :
                                  </label>
                                  <p className="affi_tabbls text-break">
                                    {/* {itm.cat_type == "promotional_models"
                                    ? "Promotional Models"
                                    : itm.cat_type == "property_types"
                                      ? "Property Type"
                                      : itm.cat_type == "advertiser_categories"
                                        ? "Advertiser Categories"
                                        : "" || "--"} */}
                                    {
                                      itm?.categoryDetails?.slice(0, 1)?.map((dat) => dat?.name)?.join(",")
                                    }
                                  </p>
                                </td>
                                <td>
                                  <label className="form-label">Timezone:</label>
                                  <p className="affi_tabbls">
                                    {itm.timezone || "--"}
                                  </p>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Modal show={show} onHide={handleClose} className="shadowboxmodal">
            <Modal.Header className="align-items-center" closeButton>
              <h5 className="modal-title">Send Invite</h5>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3 d-flex flex-column justify-content-between width_label"
                  controlId="formBasicEmail"
                >
                  <Form.Label>Invitation Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    className="rounded-4"
                    rows={3}
                    cols={6}
                    placeholder="Enter text"
                    value={form?.message}
                    onChange={(e) =>
                      setform({ ...form, message: e.target.value })
                    }
                    required
                  />
                  {submitted && !form?.message ? (
                    <div className="invalid-feedback d-block">
                      Message is required
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group
                  className="mb-3 d-flex justify-content-between flex-column width_label selectlabel"
                  controlId="formBasicText"
                >
                  <Form.Label>Select Campaign</Form.Label>
                  <SelectDropdown
                    theme="search"
                    id="statusDropdown"
                    className="w-100"
                    displayValue="name"
                    placeholder="Select Campaign"
                    intialValue={form?.campaign_id}
                    result={(e) => setform({ ...form, campaign_id: e.value })}
                    options={Campaigns}
                  />
                  {submitted && !form?.campaign_id && (
                    <div className="invalid-feedback d-block">
                      Campaign is required
                    </div>
                  )}
                </Form.Group>

                {/* Show 'Add Campaign' button if no campaign is selected */}
                {Campaigns?.length == 0 && (
                  <div className="mb-3">
                    If you don't have campaign ?
                    <a
                      onClick={handleAddCampaign}
                      className="text-blue-100 hover:text-blue-200 cursor-pointer ml-2"
                    >
                      Add Campaign
                    </a>
                  </div>
                )}

                <Form.Group
                  className="mb-3 d-flex justify-content-between flex-column width_label selectlabel"
                  controlId="formBasicText"
                >
                  <Form.Label>Tags</Form.Label>
                  <div className="d-flex justify-content-between gap-2 input_adds">
                    <Form.Control
                      type="text"
                      placeholder="Enter text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                    />
                    <Button variant="primary" onClick={handleAddTag}>
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-flex align-items-center text_adds gap-2 flex-wrap">
                  {form.tags.map((tag, index) => (
                    <ul
                      key={index}
                      className="d-flex align-items-center gap-3 mb-2"
                    >
                      <li>
                        <span>{tag}</span>
                        <i
                          className="fa fa-times-circle ml-2"
                          onClick={() => handleDeleteTag(index)}
                          aria-hidden="true"
                        ></i>
                      </li>
                    </ul>
                  ))}
                </div>

                <div className="d-flex align-items-center justify-content-end">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal
            show={groupShow}
            onHide={handleGroupClose}
            className="shadowboxmodal"
          >
            <Modal.Header className="align-items-center" closeButton>
              <h5 className="modal-title">Set Group</h5>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSetGroup}>
                {/* <Form.Group className='mb-3 d-flex flex-column justify-content-between width_label' controlId="formBasicEmail">
                  <Form.Label>Invitation Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    className='br0'
                    rows={3}
                    cols={6}
                    placeholder="Enter text"
                    value={form?.message}
                    onChange={(e) => setform({ ...form, message: e.target.value })}
                    required
                  />
                  {submitted && !form?.message ? <div className="invalid-feedback d-block">message is Required</div> : <></>}
                </Form.Group> */}

                <Form.Group
                  className="mb-3 d-flex justify-content-between flex-column  width_label selectlabel"
                  controlId="formBasicText"
                >
                  <Form.Label>Select group</Form.Label>
                  <SelectDropdown
                    theme="search"
                    id="statusDropdown"
                    className="w-100"
                    displayValue="group_name"
                    placeholder="Select Group"
                    intialValue={groupForm?.affiliate_group}
                    result={(e) => {
                      setGroupform({ ...groupForm, affiliate_group: e.value });
                    }}
                    options={affiliategroup}
                  />
                </Form.Group>

                {/* <Form.Group className='mb-3 d-flex justify-content-between flex-column  width_label selectlabel' controlId="formBasicText">
                  <Form.Label>Tags</Form.Label>
                  <div className=' d-flex justify-content-between gap-3 input_adds' >
                    <Form.Control
                      type='text'
                      placeholder="Enter text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                    />
                    <Button variant="primary" onClick={handleAddTag}> <i class="fa fa-plus" aria-hidden="true"></i>
                    </Button>
                  </div>
                </Form.Group> */}
                {/* <div className='d-flex align-items-center  text_adds gap-2 flex-wrap' >
                  {form.tags.map((tag, index) => (
                    <ul key={index} className="d-flex align-items-center gap-3 mb-2">
                      <li> <span>{tag}</span> <i class="fa fa-times-circle ml-2" onClick={() => handleDeleteTag(index)} aria-hidden="true"></i></li>
                    </ul>
                  ))}
                </div> */}

                <div className="d-flex align-items-center justify-content-end">
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </div>

        {!loaging && total == 0 ? (
          <div className="py-3 text-center">No Affiliate</div>
        ) : (
          <></>
        )}

        <div
          className={`paginationWrapper ${!loaging && total > 10 ? "" : "d-none"
            }`}
        >
          <span>
            Show{" "}
            <select
              className="form-control"
              onChange={(e) => handleCountChange(parseInt(e.target.value))}
              value={filters.count}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={150}>150</option>
              <option value={200}>200</option>
            </select>{" "}
            from {total} Affiliates
          </span>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            initialPage={filters?.page}
            onPageChange={(e) => { if (!initialLoadComplete.current) return; pageChange(e) }}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={Math.ceil(total / filters?.count)}
            // pageCount={2}
            previousLabel="< Previous"
            renderOnZeroPageCount={null}
            pageClassName={"pagination-item"}
            activeClassName={"pagination-item-active"}
          />
        </div>

        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <></>
        )}
      </Layout>
    </>
  );
}

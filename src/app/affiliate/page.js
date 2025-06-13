'use client'

import react, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import SelectDropdown from '../components/common/SelectDropdown';
import datepipeModel from '@/models/datepipemodel';
import ReactPaginate from 'react-paginate';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import methodModel from '../../methods/methods';
import environment from '../../environment/index'
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function affilate() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    role: "affiliate",
    search: '',
    // createBybrand_id: user?.id,
    isDeleted: false,
    status: '',
    invite_status: '',
    end_date: '',
    start_date: '',
    affiliate_group_id: '',
    sub_category_id: '',
    sub_child_category_id: '',
    category_id: '',
    cat_type: ''
  })
  const [form, setform] = useState({
    "message": "",
    "tags": [],
    // "commission": "",
    "campaign_id": ""
  })
  const [groupForm, setGroupform] = useState({
    "affiliate_group": "",
  })
  const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [affiliategroup, setAffiliategroup] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [category, setCategory] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [groupShow, setGroupShow] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedAffiliteid, setselectedAffiliteid] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  // const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  // const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState([]);
  // const [categoryType, SetCategoryType] = useState('')
  const [Campaigns, setCampaign] = useState([])
  const handleClose = () => { setShow(false), setselectedAffiliteid([]) };
  const handleShow = () => setShow(true);
  const handleGroupClose = () => setGroupShow(false);
  const handleGroupShow = () => setGroupShow(true);
  const [categoryType, setCategoryType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [camppaignData, setCamppaignData] = useState([]);
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  console.log(filters, "paramsparamsparams")

  const view = (id) => {
    const filterParams = {
      ...filters,
      page: 1,
      // currency: selectedCurrency,
      // region: selectedRegion?.join(","),
      "start_date": startDate ? startDate.toISOString().split('T')[0] : null,
      "end_date": endDate ? endDate.toISOString().split('T')[0] : null,
      category_type: categoryType?.join(","),
      category: selectedCategory?.join(","),
      sub_category: selectedSubCategory?.join(","),
      // countries: ?.join(","),
      sub_child_category: selectedSubSubCategory?.join(",")
    };

    const queryString = new URLSearchParams(filterParams).toString();

    history.push(`/affiliate/detail/${id}?${queryString}`);
  };

  function parseStringToArray(input) {
    if (typeof input !== "string") return [];

    // Split by comma and trim each element
    return input.split(',').map(item => item.trim());
  }

  useEffect(() => {
    // getExchangeRate(params?.currency)
    setSelectedCategory(parseStringToArray(params?.category));
    setSelectedSubCategory(parseStringToArray(params?.sub_category));
    setSelectedSubSubCategory(parseStringToArray(params?.sub_child_category));
    // setSelectedRegion(parseStringToArray(params?.region));
    // setSelectedCountries(parseStringToArray(params?.countries));
  }, [])

  const resetUrl = () => {
    let filter = {
      status: '',
      role: '',
      search: '',
      page: 1,
      count: 10
    }
    setFilter({ ...filters, ...filter })
    getData({ ...filter, page: 1 })
    setSelectedCurrency("USD")
    history.push("/campaignManagement")
  }

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getCampaignData = (p = {}) => {
    let url = 'campaign/brand/all'
    ApiClient.get(url).then(res => {
      if (res.success) {
        setCamppaignData(res.data.data.map((dat) => {
          return ({
            name: dat?.name,
            id: dat?.id || dat?._id
          })
        }))
        // setTotal(res.data.total_count)
      }
    })
  }


  const toggleSubCategoryExpand = (subCategoryId) => {
    setExpandedSubCategories(prev =>
      prev.includes(subCategoryId)
        ? prev.filter(id => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleCategoryTypeChange = (id) => {
    setCategoryType(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(prev =>
      prev.includes(category._id) ? prev.filter(item => item !== category._id) : [...prev, category._id]
    );
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(prev =>
      prev.includes(subCategory.id) ? prev.filter(item => item !== subCategory.id) : [...prev, subCategory.id]
    );
  };

  const handleSubSubCategoryChange = (subSubCategory) => {
    setSelectedSubSubCategory(prev =>
      prev.includes(subSubCategory._id) ? prev.filter(item => item !== subSubCategory._id) : [...prev, subSubCategory._id]
    );
  };

  // const reset = () => {
  //   setCategoryType([]);
  //   setSelectedCategory([]);
  //   setSelectedSubCategory([]);
  //   setSelectedSubSubCategory([]);
  // };

  const handleRowClick = (id) => {
    const isExpanded = expandedRowId.includes(id);

    if (isExpanded) {
      setExpandedRowId(expandedRowId.filter(rowId => rowId !== id));
    } else {
      setExpandedRowId([...expandedRowId, id]);
    }
  };

  const permission = (p) => {
    if (user && user?.permission_detail && p) {
      return user?.permission_detail[p]
    } else {
      return false
    }
  }

  const categoryTypes = [
    { id: 'promotional_models', name: 'Promotional Models' },
    { id: 'property_types', name: 'Property Types' },
    // { id: 'advertiser_categories', name: 'Advertiser Categories' },
  ]

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      if (!form.tags.includes(tagInput)) {
        setform({ ...form, tags: [...form.tags, tagInput] });
      } else {
        toast.error('Tag already exists.')
      }
      setTagInput('');
    }
  };


  const handleDeleteTag = (index) => {
    const newTags = [...form.tags];
    newTags.splice(index, 1);
    setform({ ...form, tags: newTags });
  };

  // const Commission = [
  //   { id: "Program Standard Commission Rates", name: "Program Standard Commission Rates" },
  //   { id: "Default 8% Commission", name: "Default 8% Commission" },
  //   { id: "Padel/Sports Publisher", name: "Padel/Sports Publisher" },
  //   { name: "2% Commission Increase (10%)" },
  //   { id: "5% Commission Increase (13%)", name: "5% Commission Increase (13%)" },
  //   { id: "2% Commission Increase (7%)", name: "2% Commission Increase (7%)" }
  // ]

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form?.campaign_id || !form?.message) {
      setSubmitted(true)
      return
    }

    const payload = {
      affiliate_id: selectedAffiliteid,
      brand_id: user?.id || user?._id,
      ...form,
    }
    ApiClient.post(`addInvite`, payload).then(res => {
      if (res.success) {
        getData({ page: 1 })
        setform({
          "message": "",
          "tags": [],
          "campaign_id": ""
        })
        toast.success("Invitation Send Successfully..")
        handleClose()
      }
    })
  }

  const selectedGroupId = selectedOptions.map((item) => {
    return item?.id
  })

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const handleCheckboxChange = (option) => {
  //   if (selectedOptions.some((selectedOption) => selectedOption.id === option.id)) {
  //     setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.id !== option.id));
  //   } else {
  //     setSelectedOptions([...selectedOptions, option]);
  //   }
  // };
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    filter({ "start_date": start.toISOString().split('T')[0], "end_date": end.toISOString().split('T')[0] })
  };

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    if (filter?.start_date == null || filter?.start_date == "null" || !filter?.start_date) {
      filter = {
        ...filters, ...p, start_date: "", end_date: ""
      }
    }
    ApiClient.get(`getAllAffiliateForBrand`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total)
        setLoader(false)
      }

    })
  };

  const getCategory = (p = {}) => {
    let url = `categoryWithSub?page&count&search&cat_type=${categoryType?.map((dat) => dat).join(",")}&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data;
        setCategory(data);
      }
    });
  };

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    const startDateParam = params.start_date && params.start_date !== "null"
      ? new Date(params.start_date)
      : null;
    const endDateParam = params.end_date && params.end_date !== "null"
      ? new Date(params.end_date)
      : null;

    setFilter({
      ...params,
      page: 1,
      count: 10,
      start_date: startDateParam ? startDateParam.toISOString().split('T')[0] : "",
      end_date: endDateParam ? endDateParam.toISOString().split('T')[0] : ""
    });

    setEndDate(endDateParam);
    setStartDate(startDateParam);

    getData({
      ...params,
      page: 1,
      count: 10,
      start_date: startDateParam ? startDateParam.toISOString().split('T')[0] : "",
      end_date: endDateParam ? endDateParam.toISOString().split('T')[0] : ""
    });
  }, []);

  useEffect(() => {
    const hasCategoryType = categoryType?.length > 0;
    const hasSelectedCategory = selectedCategory?.length > 0;
    const hasSelectedSubCategory = selectedSubCategory?.length > 0;
    const hasSelectedSubSubCategory = selectedSubSubCategory?.length > 0;

    if (hasCategoryType || hasSelectedCategory || hasSelectedSubCategory || hasSelectedSubSubCategory) {
      setFilter({ ...filters, ...params, count: 10 });
      getData({
        ...filters,
        ...params,
        page: 1,
        cat_type: hasCategoryType ? categoryType.map((dat) => dat).join(",") : undefined,
        category_id: hasSelectedCategory ? selectedCategory.map((dat) => dat).join(",") : undefined,
        sub_category_id: hasSelectedSubCategory ? selectedSubCategory.map((dat) => dat).join(",") : undefined,
        sub_child_category_id: hasSelectedSubSubCategory ? selectedSubSubCategory.map((dat) => dat).join(",") : undefined
      });
    }
  }, [categoryType, selectedCategory, selectedSubCategory, selectedSubSubCategory]);

  useEffect(() => {
    getCategory()
  }, [categoryType])


  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    getData({ ...p, page: 1 })
  }

  const sorting = (key) => {
    let sorder = 'asc'
    if (filters.key == key) {
      if (filters?.sorder == 'asc') {
        sorder = 'desc'
      } else {
        sorder = 'asc'
      }
    }

    let sortBy = `${key} ${sorder}`;
    filter({ sortBy, key, sorder })
  }

  const ChangeStatus = (e) => {
    setFilter({ ...filters, invite_status: e })
    getData({ invite_status: e, page: 1 })
  }

  const ChangeCampaign = (e) => {
    setFilter({ ...filters, campaign: e })
    getData({ campaign: e, page: 1 })
  }

  const reset = () => {
    let filter = {
      status: '',
      invite_status: '',
      role: '',
      search: '',
      role: 'affiliate',
      campaign: "",
      page: 1,
      count: 10,
      end_date: '',
      start_date: '',
      affiliate_group_id: '',
      sub_category_id: '',
      sub_child_category_id: '',
      category_id: '',
      cat_type: ''
    }
    setStartDate(null);
    setEndDate(null);
    setCategoryType([]);
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setSelectedSubSubCategory([]);
    setSelectedOptions([])
    setIsOpen(false)
    setFilter({ ...filter })
    getData({ ...filter, page: 1 })
    history.push("/affiliate")

    // dispatch(search_success(''))
  }

  // const view = (id) => {
  //   history.push("/affiliate/detail/" + id)
  // }

  const handleAffiliateGroup = () => {
    ApiClient.get('affiliate-groups', { status: "active", addedBy: user?.id, group_type: 'affiliate' }).then(res => {
      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  const handleCampaign = () => {
    ApiClient.get('campaign/brand/all', { brand_id: user?.id }).then(res => {
      if (res.success == true) {
        const data = res?.data?.data?.map((data) => {
          return ({
            id: data?.id || data?._id,
            name: data?.name
          })
        })
        setCampaign(data)
      }
    })
  }

  const handleSetGroup = (e) => {
    e.preventDefault()
    const data = {
      id: selectedAffiliteid,
      affiliate_group: groupForm?.affiliate_group
    }
    ApiClient.put('edit/profile', data).then(res => {

      if (res.success == true) {
        handleGroupClose()
        getData({ search: '', page: 1 })
      }
      // setLoader(false)
    })
  }

  useEffect(() => {
    handleAffiliateGroup()
    handleCampaign()
    getCampaignData()
  }, [])

  useEffect(() => {
    if (selectedOptions?.length > 0) {
      filter({ ...filters, "affiliate_group_id": selectedGroupId.join(',') })
    }
  }, [selectedOptions])

  const clear = () => {
    setFilter({ ...filters, search: '', page: 0 })
    getData({ search: '', page: 1 })
  }

  const MultiSelectAffliates = (add, id) => {
    let data = selectedAffiliteid
    if (add) {
      data.push(id)
      setselectedAffiliteid([...data])
    } else {
      data = data.filter(itm => itm !== id)
      setselectedAffiliteid([...data])
    }
  }

  const handleAddCampaign = () => {
    history.push('/campaign/add')
  };


  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Affiliates" filters={filters}>
        <div className='nmain-list   mb-3'>
          <div className='row align-items-center mx-0'>
            <div className='col-12 col-md-12 col-lg-12'>

              <div className="modal filter_modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header align-items-center bg_headers">
                      <h2 className="modal-title fs-5" id="exampleModalLabel">All Filter</h2>
                      <i data-bs-dismiss="modal" aria-label="Close" className="fa fa-times clse" aria-hidden="true"></i>
                    </div>
                    <div className="modal-body">
                      <div className='height_fixed'>
                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebxone" aria-expanded="true" aria-controls="collapsebxone">
                                <b>Select Category Type</b>
                                <i className="fa fa-angle-down down_typs" aria-hidden="true"></i>
                              </button>
                            </h2>
                            <div id="collapsebxone" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                                <ul className="filter_ullist">
                                  {categoryTypes.map(category1 => (
                                    <li key={category1.id}>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={category1.id}
                                          name="categoryType"
                                          value={category1.id}
                                          checked={categoryType.includes(category1.id)}
                                          onChange={() => handleCategoryTypeChange(category1.id)}
                                        />
                                        <label className="form-check-label" htmlFor={category1.id}>{category1.name}</label>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header">
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebx1" aria-expanded="true" aria-controls="collapsebx1">
                                <b>Select Category of Affiliate</b>
                                <i className="fa fa-angle-down down_typs" aria-hidden="true"></i>
                              </button>
                            </h2>
                            <div id="collapsebx1" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                                <ul className="filter_ullist">
                                  {category.map(category => (
                                    <li key={category._id}>
                                      <div className="form-check d-flex justify-content-between align-items-center">
                                        <div>
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={category._id}
                                            name="category"
                                            value={category._id}
                                            checked={selectedCategory?.includes(category._id)}
                                            onChange={() => handleCategoryChange(category)}
                                          />
                                          <label className="form-check-label ms-2" htmlFor={category._id}>
                                            {category.parent_cat_name}
                                          </label>
                                        </div>
                                        {category.subCategories?.length > 0 && (
                                          <i
                                            className={`fa fa-angle-${expandedCategories.includes(category._id) ? 'down' : 'right'} cursor-pointer`}
                                            onClick={() => toggleCategoryExpand(category._id)}
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                      </div>

                                      {expandedCategories.includes(category._id) && (
                                        <ul className="sub_ulbx ms-4">
                                          {category.subCategories.map((subCategory) => (
                                            <li key={subCategory.id}>
                                              <div className="form-check d-flex justify-content-between align-items-center">
                                                <div>
                                                  <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={subCategory.id}
                                                    name="subCategory"
                                                    value={subCategory.id}
                                                    checked={selectedSubCategory?.includes(subCategory.id)}
                                                    onChange={() => handleSubCategoryChange(subCategory)}
                                                  />
                                                  <label className="form-check-label ms-2" htmlFor={subCategory.id}>
                                                    {subCategory.name}
                                                  </label>
                                                </div>
                                                {subCategory.subchildcategory?.length > 0 && (
                                                  <i
                                                    className={`fa fa-angle-${expandedSubCategories.includes(subCategory.id) ? 'down' : 'right'} cursor-pointer`}
                                                    onClick={() => toggleSubCategoryExpand(subCategory.id)}
                                                    aria-hidden="true"
                                                  ></i>
                                                )}
                                              </div>

                                              {expandedSubCategories.includes(subCategory.id) && subCategory.subchildcategory?.length > 0 && (
                                                <ul className="ms-4">
                                                  {subCategory.subchildcategory.map((subSubCategory) => (
                                                    <li key={subSubCategory._id}>
                                                      <div className="form-check">
                                                        <input
                                                          className="form-check-input"
                                                          type="checkbox"
                                                          id={subSubCategory._id}
                                                          name="subSubCategory"
                                                          value={subSubCategory._id}
                                                          checked={selectedSubSubCategory?.includes(subSubCategory._id)}
                                                          onChange={() => handleSubSubCategoryChange(subSubCategory)}
                                                        />
                                                        <label className="form-check-label" htmlFor={subSubCategory._id}>
                                                          {subSubCategory.name}
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

                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer gap-3">
                      <button type="button" className="btn btn-outline-secondary m-0" data-bs-dismiss="modal" onClick={reset}>Clear all Filter</button>
                    </div>
                  </div>
                </div>
              </div>


              <div className='set_modal postion-relative '>
                <div className='d-flex gap-2 align-items-center flex-wrap'>
                  <div className='filter-opt'>
                    <button className='set-filter' type="button" class="set-filter abs_butsn" data-bs-toggle="modal" data-bs-target="#exampleModal"><svg xmlns="http://www.w3.org/2000/svg" width="14px" aria-hidden="true" data-name="Layer 1" viewBox="0 0 14 14" role="img"><path d="M0 2.48v2h2.09a3.18 3.18 0 006.05 0H14v-2H8.14a3.18 3.18 0 00-6.05 0zm3.31 1a1.8 1.8 0 111.8 1.81 1.8 1.8 0 01-1.8-1.82zm2.2 6.29H0v2h5.67a3.21 3.21 0 005.89 0H14v-2h-2.29a3.19 3.19 0 00-6.2 0zm1.3.76a1.8 1.8 0 111.8 1.79 1.81 1.81 0 01-1.8-1.79z"></path></svg> Filter</button>
                  </div>
                  <div class="w-25">
                    <SelectDropdown theme='search'
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All"
                      className='mt-2 '
                      intialValue={filters.invite_status}
                      result={e => { ChangeStatus(e.value) }}
                      options={[
                        { id: 'not_invited', name: 'Not Invited' },
                        { id: 'accepted', name: 'Accepted' },
                        { id: 'pending', name: 'Pending' },
                        { id: 'rejected', name: 'rejected' },
                      ]}
                    />
                  </div>

                  <div class="w-25">
                    <SelectDropdown theme='search'
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Campaign"
                      className='mt-2 '
                      intialValue={filters.campaign}
                      result={e => { ChangeCampaign(e.value) }}
                      options={camppaignData}
                    />
                  </div>

                  <div class="">
                    <DatePicker
                      className="datepicker-field"
                      selected={startDate}
                      onChange={onChange}
                      startDate={startDate}
                      endDate={endDate}
                      showIcon
                      placeholderText=" Date Range"
                      selectsRange

                    // inline
                    />
                  </div>

                  {/* <div className={`checkbox-inner checkbox-dropdown ${isOpen ? 'open' : ''} ml_3`}>
                    <div className="newselectmulti position-relative" onClick={toggleDropdown}>
                      {selectedOptions.length === 0 ? "Select Groups " : (
                        <p className='checkbox-option-main'>
                          {selectedOptions.map((selectedOption) => (
                            <span>{selectedOption.group_name}</span>
                          ))}
                        </p>
                      )}

                      <i className='fa fa-chevron-down donabsolute'></i>
                    </div>
                    <div className="checkbox-options">
                      {affiliategroup?.map((option) => (
                        <label className='text-sm' key={option.id}>
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={selectedOptions.some((selectedOption) => selectedOption.id === option.id)}
                            onChange={() => {
                              handleCheckboxChange(option);
                            }}
                          />
                          {option.group_name}
                        </label>
                      ))}
                    </div>
                  </div> */}

                  {selectedSubSubCategory?.length || selectedCategory?.length || selectedSubSubCategory?.length || filters.invite_status || filters.campaign || filters.status || filters.affiliate_group_id || filters.end_date || filters.start_date ? <>
                    <a className="btn btn-primary   " onClick={e => reset()}>
                      Reset
                    </a>
                  </> : <></>}
                  {(user?.role == 'brand' || permission('affiliate_group')) && (
                    <>
                      {selectedAffiliteid?.length > 1 && (
                        <DropdownButton
                          variant="primary"
                          id="dropdown-basic-button"
                          title={<>Action</>}
                          className=""
                        >
                          <Dropdown.Item as="button" onClick={() => handleShow()}>
                            Send multiple invites to affiliates
                          </Dropdown.Item>
                          {/* You can add more items here if needed */}
                        </DropdownButton>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>


            {/* <div className='col-12 col-md-2 col-lg-3'>
              <div className='text-end d-flex align-items-center justify-content-end' onClick={handleCleanData}>
                  <Link href="/affiliate-form/StageFirstStep" className='btn btn-primary d-flex align-items-center'><i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                    New Affilate</Link>
                </div>
            </div> */}
          </div>
          <div className='row mx-0 mt-3'>
            <div className='col-md-12'>

              <div className='table-responsive'>
                <table class="table table-striped ">
                  <thead class="thead-clr">
                    <tr >
                      {/* <th></th> */}
                      <th scope="col" onClick={e => sorting('fullName')}>Affiliate {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th>
                      <th scope="col" onClick={e => sorting('email')}>Email {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th>
                      <th scope="col" onClick={e => sorting('affiliate_group_name')}>Affilate Group {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th>
                      <th scope="col" onClick={e => sorting('createdAt')}>Join Date {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th>
                      <th scope="col">Invitation Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loaging && data?.data?.map((itm) => <><tr className='table_row' >
                      <td className='profile_height' >

                        <label className='d-flex align-items-center gap-2 pb-3 ml-3'>
                          {permission('affiliate_invite') && <input type='checkbox' className='form-check-input check_bx_input' checked={selectedAffiliteid?.includes(itm.id) ? true : false} disabled={itm.invite_status == 'not_invited' ? false : true} onChange={e => MultiSelectAffliates(e.target.checked, itm.id)} />}
                          <span className={itm.invite_status == 'not_invited' ? "checkbox-btn" : 'disable_check'} ></span>
                          <div className='d-flex align-items-center' onClick={e => view(itm.id)}>
                            {itm?.image ?
                              <img className='person-img' src={`${environment?.api}/${itm?.image}`} alt=''></img>
                              :
                              <img className='person-img' src='/assets/img/likjh.jpeg' alt=''></img>
                            }
                            <p className='name-person ml-2'>{methodModel?.capitalizeFirstLetter(itm?.fullName)}</p>
                          </div>
                        </label>


                        {!expandedRowId.includes(itm.id) ? (
                          <span className='show_morebx' onClick={() => handleRowClick(itm.id)}>
                            Show More
                          </span>
                        ) : (
                          <span className='show_morebx' onClick={() => handleRowClick(itm.id)}>
                            Show Less
                          </span>
                        )}

                      </td>
                      <td><p className='name-person ml-2' href=''>{itm?.email}</p></td>
                      <td><p className='name-person ml-2' href=''>{itm?.affiliate_group_name || "--"}</p></td>
                      <td><p className='td-set'>{datepipeModel.date(itm?.createdAt)}</p></td>
                      <td className='table_dats'>   <span className={`active_btn${itm?.status}`}
                      // onClick={() => statusChange(itm)}
                      >
                        <span className={itm.status}>
                          {itm.invite_status == 'accepted' ? 'Accepted' : itm.invite_status == 'not_invited' ? "Not Invited" : "Pending"}
                        </span>
                      </span></td>

                      <td>
                        <div className='action_icons'>
                          {/* <a className='edit_icon edit-main' title="Edit" onClick={itm.status == "deactive" ? null : (e) => edit(itm.id)} >
                        <i className={`material-icons edit ${itm.status == "deactive" ? 'disabled' : ''}`} title="Edit">edit</i>
                      </a> */}

                          {/* <a className='edit_icon' onClick={() => deleteItem(itm.id)}>
                            <i className={`material-icons delete`} title='Delete'> delete</i>
                          </a> */}
                          {(user?.role == 'brand' || permission('affiliate_invite')) && <button disabled={itm.invite_status == 'not_invited' ? false : true} className="btn btn-primary btn_primary" onClick={() => { handleShow(); setselectedAffiliteid([itm?.id]) }}>
                            <i className='fa fa-plus fa_icns' title='Invite'></i>
                          </button>}
                          <span className='btn btn-primary btn_primary '
                            onClick={() => {
                              history.push(`/chat`)
                              localStorage.setItem("chatId", itm?._id || itm?.id)
                            }}>
                            <i className='fa fa-comment-o fa_icns' title='Chat'></i>
                          </span>
                          {(user?.role == 'brand' || permission('affiliate_group')) && <button className="btn btn-primary btn_primary " onClick={() => { handleGroupShow(); setselectedAffiliteid(itm?.id || itm?._id) }}>
                            <i class="fa-solid fa-people-group fa_icns" title='Add Group'></i>
                          </button>}
                        </div>
                      </td>

                    </tr>
                      {expandedRowId.includes(itm.id) && (
                        <tr class="table_row  show_mores">
                          <td>

                            <label className='form-label' >Affiliate Type:</label>
                            <p className='affi_tabbls' >{itm.affiliate_type || "--"}</p>

                          </td>
                          <td>


                            <label className='form-label' >Social Media Platforms:</label>
                            <p className='affi_tabbls' >{itm.social_media_platforms.map((itm) => itm).join(",") || "--"}</p>

                          </td>
                          <td>


                            <label className='form-label' >Category Type:</label>
                            <p className='affi_tabbls' >{itm.cat_type == "promotional_models" ? "Promotional Models" : itm.cat_type == "property_types" ? "Property Type" : itm.cat_type == "advertiser_categories" ? "Advertiser Categories" : "" || "--"}</p>
                          </td>
                          <td>


                            <label className='form-label' >Country:</label>
                            <p className='affi_tabbls' >{itm.country || "--"}</p>

                          </td>
                        </tr>
                      )}
                    </>
                    )}
                  </tbody>
                </table>

              </div>
            </div>
          </div>

          <Modal show={show} onHide={handleClose} className="shadowboxmodal">
            <Modal.Header className='align-items-center' closeButton>
              <h5 className='modal-title'>Send Invite</h5>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3 d-flex flex-column justify-content-between width_label' controlId="formBasicEmail">
                  <Form.Label>Invitation Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    className='rounded-4'
                    rows={3}
                    cols={6}
                    placeholder="Enter text"
                    value={form?.message}
                    onChange={(e) => setform({ ...form, message: e.target.value })}
                    required
                  />
                  {submitted && !form?.message ? (
                    <div className="invalid-feedback d-block">Message is required</div>
                  ) : null}
                </Form.Group>

                <Form.Group className='mb-3 d-flex justify-content-between flex-column width_label selectlabel' controlId="formBasicText">
                  <Form.Label>Select Campaign</Form.Label>
                  <SelectDropdown theme='search'
                    id="statusDropdown"
                    className="w-100"
                    displayValue="name"
                    placeholder="Select Campaign"
                    intialValue={form?.campaign_id}
                    result={e => setform({ ...form, campaign_id: e.value })}
                    options={Campaigns}
                  />
                  {submitted && !form?.campaign_id && (
                    <div className="invalid-feedback d-block">Campaign is required</div>
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

                <Form.Group className='mb-3 d-flex justify-content-between flex-column width_label selectlabel' controlId="formBasicText">
                  <Form.Label>Tags</Form.Label>
                  <div className='d-flex justify-content-between gap-2 input_adds'>
                    <Form.Control
                      type='text'
                      placeholder="Enter text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                    />
                    <Button variant="primary" onClick={handleAddTag}>
                      <i className="fa fa-plus" aria-hidden="true"></i>
                    </Button>
                  </div>
                </Form.Group>

                <div className='d-flex align-items-center text_adds gap-2 flex-wrap'>
                  {form.tags.map((tag, index) => (
                    <ul key={index} className="d-flex align-items-center gap-3 mb-2">
                      <li>
                        <span>{tag}</span>
                        <i className="fa fa-times-circle ml-2" onClick={() => handleDeleteTag(index)} aria-hidden="true"></i>
                      </li>
                    </ul>
                  ))}
                </div>

                <div className='d-flex align-items-center justify-content-end'>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>


          <Modal show={groupShow} onHide={handleGroupClose} className="shadowboxmodal">
            <Modal.Header className='align-items-center' closeButton>
              <h5 className='modal-title'>Set Group</h5>
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

                <Form.Group className='mb-3 d-flex justify-content-between flex-column  width_label selectlabel' controlId="formBasicText">
                  <Form.Label>Select group</Form.Label>
                  <SelectDropdown theme='search'
                    id="statusDropdown"
                    className="w-100"
                    displayValue="group_name"
                    placeholder="Select Group"
                    intialValue={groupForm?.affiliate_group}
                    result={e => {
                      setGroupform({ ...groupForm, affiliate_group: e.value })
                    }}
                    options={affiliategroup}
                  /></Form.Group>

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

                <div className='d-flex align-items-center justify-content-end'>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>

          </Modal>

        </div>

        {!loaging && total == 0 ? <div className="py-3 text-center">No Affiliate</div> : <></>}

        <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
          <span>Show <select
            className="form-control"
            onChange={(e) => handleCountChange(parseInt(e.target.value))}
            value={filters.count}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select> from {total} Affiliates</span>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            initialPage={filters?.page}
            onPageChange={pageChange}
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

        {loaging ? <div className="text-center py-4">
          <img src="/assets/img/loader.gif" className="pageLoader" />
        </div> : <></>}
      </Layout>
    </>
  );
}

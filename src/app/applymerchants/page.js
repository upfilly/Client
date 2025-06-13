'use client'

import react, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import crendentialModel from '@/models/credential.model';
import loader from '@/methods/loader';
import ApiClient from '@/methods/api/apiClient';
import SelectDropdown from '../components/common/SelectDropdown';
import datepipeModel from '@/models/datepipemodel';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
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
    role: "brand",
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState([]);
  const [categoryType, SetCategoryType] = useState('')
  const [Campaigns, setCampaign] = useState([])
  const handleClose = () => { setShow(false), setselectedAffiliteid([]) };
  const handleShow = () => setShow(true);
  // const handleGroupClose = () => setGroupShow(false);
  // const handleGroupShow = () => setGroupShow(true);

  const handleRowClick = (id) => {
    const isExpanded = expandedRowId.includes(id);

    if (isExpanded) {
      setExpandedRowId(expandedRowId.filter(rowId => rowId !== id));
    } else {
      setExpandedRowId([...expandedRowId, id]);
    }
  };

  const categoryTypes = [
    { id: 'promotional_models', name: 'Promotional Models' },
    { id: 'property_types', name: 'Property Types' },
    { id: 'advertiser_categories', name: 'Advertiser Categories' },
  ]

  const handleCategoryChange = (category) => {
    getData({ page: 1, category_id: category?.id || category?._id })
    setFilter({ ...filters, category_id: category?.id || category?._id })
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
  };

  const handleSubCategoryChange = (subCategory) => {
    setFilter({ ...filters, page: 1, sub_category_id: subCategory?.id || subCategory?._id })
    getData({ sub_category_id: subCategory?.id || subCategory?._id })
    setSelectedSubCategory(subCategory);
    setSelectedSubSubCategory(null);
  };

  const handleCountChange = (count) => {
    setFilter({ ...filters, count: count, page: 1 });
    getData({ count: count, page: 1 });
  };

  const handleSubSubCategoryChange = (subSubCategory) => {
    getData({ page: 1, sub_child_category_id: subSubCategory?.id || subSubCategory?._id })
    setFilter({ ...filters, sub_child_category_id: subSubCategory?.id || subSubCategory?._id })
    setSelectedSubSubCategory(subSubCategory);
  };

  const handleCategoryTypeChange = (CategoryType) => {
    getData({ page: 1, cat_type: CategoryType })
    setFilter({ ...filters, cat_type: CategoryType })
    SetCategoryType(CategoryType);
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setform({ ...form, tags: [...form.tags, tagInput] });
      setTagInput('');
    }
  };

  const handleDeleteTag = (index) => {
    const newTags = [...form.tags];
    newTags.splice(index, 1);
    setform({ ...form, tags: newTags });
  };

  const Commission = [
    { id: "Program Standard Commission Rates", name: "Program Standard Commission Rates" },
    { id: "Default 8% Commission", name: "Default 8% Commission" },
    { id: "Padel/Sports Publisher", name: "Padel/Sports Publisher" },
    { name: "2% Commission Increase (10%)" },
    { id: "5% Commission Increase (13%)", name: "5% Commission Increase (13%)" },
    { id: "2% Commission Increase (7%)", name: "2% Commission Increase (7%)" }
  ]

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const handleSubmit = (e,id) => {
    e.preventDefault()
    const payload = {
      brand_ids: [id] || selectedAffiliteid,
    }
    ApiClient.post(`brand/applyrequest`, payload).then(res => {
      if (res.success) {
        getData({ page: 1 })
        toast.success("Invitation Send Successfully..")
        handleClose()
      }
    })
  }

  const selectedGroupId = selectedOptions.map((item) => {
    return item?.id
  })

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (option) => {
    if (selectedOptions.some((selectedOption) => selectedOption.id === option.id)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    filter({ "start_date": start.toISOString().split('T')[0], "end_date": end.toISOString().split('T')[0] })

  };

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    ApiClient.get(`getAllBrandForAffiliate`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total)
        setLoader(false)
      }
    })
  };

  const getCategory = (p = {}) => {
    let url = `categoryWithSub?page&count&search&cat_type=${categoryType}&status=active`;
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data;
        setCategory(data);
      }
    });
  };

  useEffect(() => {
    getData({ page: 1 })
  }, [])

  useEffect(() => {
    getCategory()
  }, [categoryType])


  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    getData({ ...p, page: filters?.page + 1 })
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

  const reset = () => {
    let filter = {
      status: '',
      invite_status: '',
      role: '',
      search: '',
      role: 'affiliate',
      page: 0,
      count: 10,
      end_date: '',
      start_date: '',
      affiliate_group_id: '',
      sub_category_id: '',
      sub_child_category_id: '',
      category_id: '',
      cat_type: ''
    }
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedSubSubCategory(null);
    SetCategoryType('')
    setStartDate("");
    setEndDate("");
    setSelectedOptions([])
    setIsOpen(false)
    setFilter({ ...filters, ...filter })
    // getData({ ...filter })
    // dispatch(search_success(''))
  }

  const view = (id) => {
    history.push("/affiliate/detail/" + id)
  }

  const handleAffiliateGroup = () => {
    ApiClient.get('affiliate-groups', { status: "active", addedBy: user?.id }).then(res => {
      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  // const handleCampaign = () => {
  //   ApiClient.get('campaign/all', { brand_id: user?.id }).then(res => {
  //     if (res.success == true) {
  //       setCampaign(res?.data?.data)
  //     }
  //   })
  // }

  const handleSetGroup = (e) => {
    e.preventDefault()
    const data = {
      id: selectedAffiliteid,
      affiliate_group: groupForm?.affiliate_group
    }
    ApiClient.put('edit/profile', data).then(res => {

      if (res.success == true) {
        // handleGroupClose()
        getData({ search: '', page: 1 })
      }
      // setLoader(false)
    })
  }

  useEffect(() => {
    handleAffiliateGroup()
    // handleCampaign()
  }, [])

  useEffect(() => {
    if (selectedOptions) {
      filter({ ...filters, "affiliate_group_id": selectedGroupId.join(',') })
    }
  }, [selectedOptions])

  const edit = (id) => {
    let url = `/affiliate-form/StageFirstStep/${id}`
    // if(role) url=`/users/${role}/edit/${id}`
    history.push(url)
  }

  const statusChange = (itm) => {
    let status = 'active'
    if (itm.status == 'active') status = 'deactive'

    Swal.fire({
      title: ``,
      text: `Do you want to ${status == 'active' ? 'Activate' : 'Deactivate'} this Affiliate`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true)
        ApiClient.put(`change/status`, { status, id: itm._id, model: 'users' }).then(res => {
          if (res.success) {
            getData({ page: filters?.page + 1 })
          }
          loader(false)
        })
      }
    })
  }

  const handleCleanData = () => {
    localStorage.removeItem('stepFirst');
    localStorage.removeItem('step2');
    localStorage.removeItem('step3');
  }

  const clear = () => {
    setFilter({ ...filters, search: '', page: 0 })
    getData({ search: '', page: 1 })
  }

  const deleteItem = (id) => {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        ApiClient.delete(`delete?model=users&id=${id}`).then(res => {
          if (res.success) {
            toast.success(res.message)
            clear()
          }
        })
      }
    })
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

  // console.log(selectedAffiliteid,"selectedAffiliteid")

  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Merchants" filters={filters}>
        <div className='nmain-list  mb-3'>
          <div className='row align-items-center mx-0'>
            <div className='col-12 col-md-12 col-lg-12'>

              <div class="modal filter_modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header align-items-center bg_headers ">
                      <h2 class="modal-title fs-5" id="exampleModalLabel">All Filter</h2>
                      {/* <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                      <i   data-bs-dismiss="modal" aria-label="Close" class="fa fa-times clse" aria-hidden="true"></i>
                    </div>
                    <div class="modal-body">
                      <div className='height_fixed'>
                        <div class="accordion" id="accordionExample">
                          <div class="accordion-item">
                            <h2 class="accordion-header">
                              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebxone" aria-expanded="true" aria-controls="collapsebxone">
                                <b className='' >Select Category Type</b>
                                <i class="fa fa-angle-down down_typs" aria-hidden="true"></i>
                              </button>
                            </h2>
                            <div id="collapsebxone" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                              <div class="accordion-body">
                                <ul className='filter_ullist' >
                                  {categoryTypes.map(category1 => (
                                    <li key={category1.id} >
                                      <div class="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          id={category1.id}
                                          name="categoryType"
                                          value={categoryType}
                                          checked={categoryType == category1.id ? true : false}
                                          onChange={() => handleCategoryTypeChange(category1.id)}
                                        />
                                        <label class="form-check-label" htmlFor={category1.id}>{category1.name}</label>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>


                        <div class="accordion" id="accordionExample">
                          <div class="accordion-item">
                            <h2 class="accordion-header">
                              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebx1" aria-expanded="true" aria-controls="collapsebx1">
                                <b className='' >Select Category of Affiliate</b>
                                <i class="fa fa-angle-down down_typs" aria-hidden="true"></i>
                              </button>
                            </h2>
                            <div id="collapsebx1" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                              <div class="accordion-body">
                                {/* ///////////////////////////////////////////////////////////////////////////////// */}

                                {/* ///////////////////////////////////////////////////////////////////////////////// */}
                                <ul className='filter_ullist' >
                                  {category.map(category => (
                                    <li key={category._id} >

                                      <div class="form-check">
                                        <input
                                          className=" form-check-input"
                                          type="radio"
                                          id={category._id}
                                          name="category"
                                          value={category._id}
                                          checked={selectedCategory?._id === category._id}
                                          onChange={() => handleCategoryChange(category)}
                                        />
                                        <label class="form-check-label" htmlFor={category._id}>{category.parent_cat_name}</label>

                                      </div>

                                      {selectedCategory?._id === category._id && selectedCategory && (
                                        <ul className=' sub_ulbx ' >
                                          {category.subCategories.map(subCategory => (
                                            <li key={subCategory.id}>
                                              <div class="form-check">
                                                <input
                                                  className="form-check-input"
                                                  type="radio"
                                                  id={subCategory.id}
                                                  name="subCategory"
                                                  value={subCategory.id || subCategory._id}
                                                  checked={selectedSubCategory?._id || selectedSubCategory?.id === subCategory.id || subCategory._id}
                                                  onChange={() => handleSubCategoryChange(subCategory)}
                                                />
                                                <label class="form-check-label" htmlFor={subCategory.id}>{subCategory.name}</label>
                                              </div>

                                            </li>
                                          ))}
                                        </ul>
                                      )}

                                      {selectedCategory?._id === category._id && selectedSubCategory && (
                                        <ul className='filter_ullist' >
                                          {selectedSubCategory.subchildcategory.map(subSubCategory => (
                                            <li key={subSubCategory._id}>
                                              <div class="form-check">
                                                <input
                                                  class="form-check-input"
                                                  type="checkbox"
                                                  id={subSubCategory._id}
                                                  name="subSubCategory"
                                                  value={subSubCategory._id}
                                                  checked={selectedSubSubCategory?.id || selectedSubSubCategory?._id === subSubCategory._id}
                                                  onChange={() => handleSubSubCategoryChange(subSubCategory)}
                                                />


                                                <label class="form-check-label" htmlFor={subSubCategory._id}>{subSubCategory.name}</label>

                                              </div>
                                            </li>

                                          ))}

                                        </ul>)}

                                    </li>

                                  ))}
                                </ul>

                              </div>
                            </div>
                          </div>

                        </div>
                      </div>


                    </div>
                    <div class="modal-footer gap-3">
                      <button type="button" class="btn btn-outline-secondary m-0" data-bs-dismiss="modal" onClick={reset}>Clear all Filter</button>
                      {/* <button type="button" class="btn btn-primary m-0">Apply Filter</button> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className='set_modal postion-relative '>
                <div className='d-flex gap-2 align-items-center flex-wrap'>
                  <div className='filter-opt'>
                    <button className='set-filter' type="button" class="set-filter abs_butsn" data-bs-toggle="modal" data-bs-target="#exampleModal"><svg xmlns="http://www.w3.org/2000/svg" width="14px" aria-hidden="true" data-name="Layer 1" viewBox="0 0 14 14" role="img"><path d="M0 2.48v2h2.09a3.18 3.18 0 006.05 0H14v-2H8.14a3.18 3.18 0 00-6.05 0zm3.31 1a1.8 1.8 0 111.8 1.81 1.8 1.8 0 01-1.8-1.82zm2.2 6.29H0v2h5.67a3.21 3.21 0 005.89 0H14v-2h-2.29a3.19 3.19 0 00-6.2 0zm1.3.76a1.8 1.8 0 111.8 1.79 1.81 1.81 0 01-1.8-1.79z"></path></svg> Filter</button>
                  </div>
                  <div class="">
                    <SelectDropdown                                                     theme='search'
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Status"
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

                  {filters.status || filters.affiliate_group_id || filters.end_date || filters.start_date ? <>
                    <a className="btn btn-primary   " onClick={e => reset()}>
                      Reset
                    </a>
                  </> : <></>}
                  <button disabled={selectedAffiliteid?.length <= 0} className="btn btn-primary btn_primary" onClick={(e) =>{handleSubmit(e)}}>
                    <i className='fa fa-plus fa_icns' title='Invite'></i>
                  </button>
                </div>
              </div>
            </div>

          </div>
          <div className='row mx-0 mt-3'>
            <div className='col-md-12'>
              <div className='table-responsive'>
                <table class="table table-striped ">
                  <thead class="thead-clr">
                    <tr >
                      {/* <th></th> */}
                      <th scope="col" onClick={e => sorting('fullName')}>Merchants {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th>
                      <th scope="col" onClick={e => sorting('email')}>Email {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th>
                      {/* <th scope="col" onClick={e => sorting('affiliate_group_name')}>Affilate Group {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                      </th> */}
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
                          <input type='checkbox' className='form-check-input check_bx_input' checked={selectedAffiliteid?.includes(itm.id) ? true : false} disabled={itm.invite_status == 'not_invited' ? false : true} onChange={e => MultiSelectAffliates(e.target.checked, itm.id)} />
                          <span className='checkbox-btn' ></span>
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
                          {<button disabled={itm.invite_status == 'not_invited' ? false : true} className="btn btn-primary btn_primary" onClick={(e) => { handleSubmit(e,itm?.id)}}>
                            <i className='fa fa-plus fa_icns' title='Invite'></i>
                          </button>}
                          <span className='btn btn-primary btn_primary '
                            onClick={() => {
                              history.push(`/chat`)
                              localStorage.setItem("chatId", itm?._id || itm?.id)
                            }}>
                            <i className='fa fa-comment-o fa_icns' title='Chat'></i>
                          </span>
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

          {/* <Modal show={show} onHide={handleClose} className="shadowboxmodal">
            <Modal.Header className='align-items-center' closeButton>
              <h5 className='modal-title'>Send Invite</h5>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3 d-flex flex-column justify-content-between width_label' controlId="formBasicEmail">
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
                </Form.Group>

                <Form.Group className='mb-3 d-flex justify-content-between flex-column  width_label selectlabel' controlId="formBasicText">
                  <Form.Label>Select Campaign</Form.Label>
                  <SelectDropdown                                                     theme='search'
                    id="statusDropdown"
                    className="w-100"
                    displayValue="name"
                    placeholder="Select Campaign"
                    intialValue={form?.campaign_id}
                    result={e => {
                      setform({ ...form, campaign_id: e.value })
                    }}
                    options={Campaigns}
                  /></Form.Group>

                <Form.Group className='mb-3 d-flex justify-content-between flex-column  width_label selectlabel' controlId="formBasicText">
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
                </Form.Group>
                <div className='d-flex align-items-center  text_adds gap-2 flex-wrap' >
                  {form.tags.map((tag, index) => (
                    <ul key={index} className="d-flex align-items-center gap-3 mb-2">
                      <li> <span>{tag}</span> <i class="fa fa-times-circle ml-2" onClick={() => handleDeleteTag(index)} aria-hidden="true"></i></li>
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

          </Modal> */}

          {/* <Modal show={groupShow} onHide={handleGroupClose} className="shadowboxmodal">
            <Modal.Header className='align-items-center' closeButton>
              <h5 className='modal-title'>Set Group</h5>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSetGroup}>
              

                <Form.Group className='mb-3 d-flex justify-content-between flex-column  width_label selectlabel' controlId="formBasicText">
                  <Form.Label>Select group</Form.Label>
                  <SelectDropdown                                                     theme='search'
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

                <div className='d-flex align-items-center justify-content-end'>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Modal.Body>

          </Modal> */}

        </div>

        {!loaging && total == 0 ? <div className="py-3 text-center">No Brands</div> : <></>}

        <div className={`paginationWrapper ${!loaging && total > 10 ? '' : 'd-none'}`}>
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
          </select> from {total} Users</span>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            initialPage={filters?.page}
            onPageChange={pageChange}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={Math.ceil(total / filters?.count)}
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

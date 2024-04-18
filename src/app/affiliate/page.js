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
import methodModel from '@/methods/methods';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function affilate() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({
    page: 0,
    count: 10,
    role: "affiliate",
    search: '',
    createBybrand_id: user?.id,
    isDeleted: false,
    status: '',
    end_date: '',
    start_date: '',
    affiliate_group_id: ''
  })
  const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [affiliategroup, setAffiliategroup] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

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
    ApiClient.get(`users/list`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total)
        setLoader(false)
      }

    })
  };

  useEffect(() => {
    getData({ page: 1 })
  }, [])

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
    setFilter({ ...filters, status: e })
    getData({ status: e, page: 1 })
  }

  const reset = () => {
    let filter = {
      status: '',
      role: '',
      search: '',
      role: 'affiliate',
      page: 0,
      count: 10,
      end_date: '',
      start_date: '',
      affiliate_group_id: ''
    }
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

    ApiClient.get('affiliate-groups', { status: "active" }).then(res => {

      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  useEffect(() => {
    handleAffiliateGroup()
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
      cancelButtonColor: '#d33',
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
        cancelButtonColor: '#d33',
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

  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Affiliates" filters={filters}>
        <div className='nmain-list  mb-3'>
          <div className='row align-items-center mx-0'>
            <div className='col-12 col-md-10 col-lg-9'>
              <div className=' '>
                <div className='d-flex gap-2 align-items-center flex-wrap'>
                  <div className='filter-opt'>
                    <button className='set-filter'><svg xmlns="http://www.w3.org/2000/svg" width="14px" aria-hidden="true" data-name="Layer 1" viewBox="0 0 14 14" role="img"><path d="M0 2.48v2h2.09a3.18 3.18 0 006.05 0H14v-2H8.14a3.18 3.18 0 00-6.05 0zm3.31 1a1.8 1.8 0 111.8 1.81 1.8 1.8 0 01-1.8-1.82zm2.2 6.29H0v2h5.67a3.21 3.21 0 005.89 0H14v-2h-2.29a3.19 3.19 0 00-6.2 0zm1.3.76a1.8 1.8 0 111.8 1.79 1.81 1.81 0 01-1.8-1.79z"></path></svg> Filter</button>
                  </div>
                  <div class="">
                    <SelectDropdown
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Status"
                      intialValue={filters.status}
                      result={e => { ChangeStatus(e.value) }}
                      options={[
                        { id: 'active', name: 'Active' },
                        { id: 'deactive', name: 'Inactive' },
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

                  <div className={`checkbox-inner checkbox-dropdown ${isOpen ? 'open' : ''} ml_3`}>
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
                  </div>

                  {filters.status || filters.affiliate_group_id || filters.end_date || filters.start_date ? <>
                    <a className="btn btn-primary   " onClick={e => reset()}>
                      Reset
                    </a>
                  </> : <></>}
                </div>

              
              </div>
            </div>

            <div className='col-12 col-md-2 col-lg-3'>
              <div className='text-end d-flex align-items-center justify-content-end' onClick={handleCleanData}>
                  <Link href="/affiliate-form/StageFirstStep" className='btn btn-primary d-flex align-items-center'><i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>
                    New Affilate</Link>
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
                    <th scope="col" onClick={e => sorting('fullName')}>Affiliate {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                    </th>
                    <th scope="col" onClick={e => sorting('email')}>Email {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                    </th>
                    <th scope="col" onClick={e => sorting('affiliate_group_name')}>Affilate Group {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                    </th>
                    <th scope="col" onClick={e => sorting('createdAt')}>Join Date {filters?.sorder === "asc" ? <i class="fa fa-caret-up" aria-hidden="true"></i> : <i class="fa fa-caret-down" aria-hidden="true"></i>}
                    </th>
                    <th scope="col">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {!loaging && data?.data?.map((itm) => <tr className='table_row'>
                    {/* <td>   <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                    </div> </td> */}
                    <td onClick={e => view(itm.id)}><div className='d-flex align-items-center'>
                      {itm?.image ?
                        <img className='person-img' src={`http://endpoint.jcsoftwaresolution.com:6043/${itm?.image}`} alt=''></img>
                        :
                        <img className='person-img' src='/assets/img/likjh.jpeg' alt=''></img>
                      }
                      <p className='name-person ml-2'>{methodModel?.capitalizeFirstLetter(itm?.fullName)}</p>
                    </div></td>
                    <td><p className='name-person ml-2' href=''>{itm?.email}</p></td>
                    <td><p className='name-person ml-2' href=''>{itm?.affiliate_group_name}</p></td>
                    <td><p className='td-set'>{datepipeModel.date(itm?.createdAt)}</p></td>
                    <td className='table_dats'>   <span className={`active_btn${itm?.status}`} onClick={() => statusChange(itm)}>
                      <span className= {itm.status == 'deactive' ? 'inactive' : 'contract'}>
                        {itm.status == 'deactive' ? 'Inactive' : 'Active'}
                      </span>
                    </span></td>
                   
                      <td>
                      <div className='action_icons'> <a className='edit_icon edit-main' title="Edit" onClick={itm.status == "deactive" ? null : (e) => edit(itm.id)} >

                        <i className={`material-icons edit ${itm.status == "deactive" ? 'disabled' : ''}`} title="Edit">edit</i>
                      </a>
                       
                          <a className='edit_icon' onClick={() => deleteItem(itm.id)}>
                            <i className={`material-icons delete`} title='Delete'> delete</i>
                          </a></div>
                      </td>
                    
                  </tr>)}
                </tbody>
              </table>

              </div>
            </div>
          </div>

        </div>

        {!loaging && total == 0 ? <div className="py-3 text-center">No Affiliate</div> : <></>}

        <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
          <span>Show {data?.length} from {total} Users</span>
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            initialPage={filters?.page}
            onPageChange={pageChange}
            pageRangeDisplayed={6}
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

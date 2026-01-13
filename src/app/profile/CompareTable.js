'use client'

import react, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import "./style.scss";
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import datepipeModel from '@/models/datepipemodel';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import "react-datepicker/dist/react-datepicker.css";
import methodModel from '../../methods/methods';

 function CompareTable({ data }) {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 0, count: 10, search: '', isDeleted: false })
  // const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(false)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  useEffect(() => {

    if (user.role == 'brand') {
      // getData({ page: 1 })
    } else if (user.role != 'brand') {
      // getData({ page: 1 })
    }

  }, [])

  const pageChange = (e) => {
    setFilter({ ...filters, page: e.selected })
    // getData({ page: e.selected + 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    // getData({ ...p, page: 1 })
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
    setFilter({ ...filters, transaction_status: e })
    // getData({ transaction_status: e, page: 1, user_id: user?.id })
  }

  const reset = () => {
    let filter = {
      user_id: user?.id,
      transaction_status: '',
      role: '',
      search: '',
      page: 1,
      count: 10,
      transaction_type: ''
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
    history.push("/payments/detail/" + id)
  }

  const changeTransactionStatus = (e) => {
    setFilter({ ...filters, transaction_type: e, page: 0 })
    // getData({ transaction_type: e, page: 1, user_id: user?.id })
  }

  const uniqueKeys = data?.data?.reduce((headers, itm) => {
    if (itm?.urlParams && typeof itm.urlParams === 'object') {
      Object.keys(itm.urlParams).forEach(key => {
        if (!headers.includes(key)) {
          headers.push(key);
        }
      });
    }
    return headers;
  }, []);




  return (
    <>
      <div className='nmain-list  mb-0 pt-0 main_box'>
        <div className='container-fluid'>

          {/* <div className='row'>
            <div className='col-md-12'>
            </div>
          </div> */}
          <div className='row '>
            <div className='respon_data px-0'>
              <div className='table_section mt-0 '>
                <div className='table-responsive '>
                  <table class="table table-striped ">
                    <thead className="thead-clr">
                      <tr>
                          <th scope="col">Name</th>
                          <th scope="col">E-mail</th>
                          <th scope="col">Module</th>
                          <th scope="col" >Creation Date</th>
                          <th scope="col">Type</th>
                          <th scope="col">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {!loaging && data?.map((itm, i) => {

                        return <tr className='data_row' key={i}>
                          <td className='name-person ml-2' >{itm?.fullName}</td>
                          <td className='name-person ml-2' >{itm?.email}</td>
                          <td className='name-person ml-2' >{itm?.module}</td>
                          <td className='name-person ml-2' >{datepipeModel.date(itm?.createdAt)}</td>
                          <td className='name-person ml-2' >{itm?.type}</td>
                          <td className='name-person ml-2' >
                            <a className='edit_icon action-btn' onClick={() => {
                              history.push(`/activitydetail/${itm?.id || itm?._id}`)
                            }} title="View Details">
                              <i class="fa-solid fa-circle-chevron-right text-white">‌</i>
                            </a>

                          </td>
                        </tr>

                      })
                      }
                    </tbody>
                  </table>
                  {loaging ? <div className="text-center py-4">
                    <img src="/assets/img/loader.gif" className="pageLoader" />
                  </div> : <></>}
                  {!loaging && data?.length == 0 ? 
                  
                <div className='d-flex flex-column align-items-center justify-content-center'>
                   <img src="/assets/img/no_data.jpg" className="no_data_img" />
<div className="my-1 text-center no_data">No Data Found</div>
                </div>
                   : <></>}
                </div>
              </div>
            </div>
          </div>


        </div>

      </div>



      <div className={`paginationWrapper ${!loaging && total > 10 ? '' : 'd-none'}`}>
        <span>Show {data?.length} from {total} Users</span>
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
    </>
  );
}

export default CompareTable;
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
import "react-datepicker/dist/react-datepicker.css";
import methodModel from '@/methods/methods';

export default function affilate() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 0,  count: 10, transaction_type: '', search: '', isDeleted: false, transaction_status: '', subscription_plan_id: '', export_to_xls: '' ,...(user?.role == 'brand' ? { user_id: user?.id } : { paid_to: user?.id })})
  const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const getData = (p = {}) => {
    if(!methodModel.permission('transactions_get')){
      setLoader(false)
      return
    }
    setLoader(true)
    let filter = { ...filters, ...p}
    
    ApiClient.get(`transaction/all`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total)
        setLoader(false)
      }

    })
  };

  useEffect(() => {

    if (user.role == 'brand' ) {
      getData({ page: 1, user_id: user?.id })
    } else if (user.role != 'brand'){
      getData({ page: 1, paid_to: user?.id })
    }
   
  }, [])

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
    setFilter({ ...filters, transaction_status: e })
    getData({ transaction_status: e, page: 1, user_id: user?.id })
  }

  const reset = () => {
    let filter = {
      user_id: user?.id,
      transaction_status: '',
      role: '',
      search: '',
      page: 1,
      count: 5,
      transaction_type: ''
    }
    setStartDate("");
    setEndDate("");
    setSelectedOptions([])
    setIsOpen(false)
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
    // dispatch(search_success(''))
  }

  const view = (id) => {
    history.push("/payments/detail/" + id)
  }

  const changeTransactionStatus = (e) => {
    setFilter({ ...filters, transaction_type: e, page: 0 })
    getData({ transaction_type: e, page: 1, user_id: user?.id })
  }



  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Payments" filters={filters}>
        <div className='nmain-list  mb-3 main_box'>
       <div className='container-fluid'>
     
       <div className='row'>
            <div className='col-md-12'>
              <div className='d-flex flex-wrap gap-2 all_flexbx justify-content-end'>
              
                  {/* <div className='searchInput'>
                    <input
                      type="text"
                      value={filters?.search}
                      placeholder="Search"
                      className="form-control"
                      onChange={(e) => e.target.value == "" ? reset() : setFilter({ search: e.target.value })}
                      onKeyPress={handleKeyPress}
                    />
                    <i class="fa fa-search search_fa" onClick={() => {
                      filter()
                    }} aria-hidden="true"></i>
                  </div> */}

                  <div className=''>
                   {user?.role == 'brand' ? <SelectDropdown
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Transaction"
                      intialValue={filters?.transaction_type}
                      result={e => { changeTransactionStatus(e.value) }}
                      options={[
                        { id: 'buy_subscription', name: 'Buy Subscription' },
                        { id: 'bank_account', name: 'Commission' },
                      ]}
                    />
:
                    <SelectDropdown
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Transaction"
                      intialValue={filters?.transaction_type}
                      result={e => { changeTransactionStatus(e.value) }}
                      options={[
                        { id: 'bank_account', name: 'Commission' },
                      ]}
                    />}
                  </div>
                  <div className=''>
                    <SelectDropdown
                      id="statusDropdown"
                      displayValue="name"
                      placeholder="All Status"
                      intialValue={filters?.transaction_status}
                      result={e => { ChangeStatus(e.value) }}
                      options={[
                        { id: 'successful', name: 'Successful' },
                        { id: 'failed', name: 'Failed' }
                      ]}
                    /></div>


                  {filters?.search || filters.transaction_status || filters.transaction_type ? <>
                    <a className="btn btn-primary  " onClick={e => reset()}>
                      Reset
                    </a>
                  </> : <></>}
              


              </div>
            </div>
          </div>
          <div className='row '>
            <div className='respon_data'>
              <div className='table_section '>
              <div className='table-responsive '>
                <table class="table table-striped ">
                  <thead class="thead-clr">
                    <tr >

                      <th scope="row" onClick={e => sorting('paid_to_name')}>Name {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                      {/* <th onClick={e => sorting('role')}>Role {filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                      {/* <th onClick={e => sorting('subscription_plan_name')}>Plan Name {filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                      {user?.role == 'brand' ? <th onClick={e => sorting('amount')}>Amount {filters?.sorder === "asc" ? "↑" : "↓"}</th>:
                      <th onClick={e => sorting('amount')}>Commission {filters?.sorder === "asc" ? "↑" : "↓"}</th>}
                      <th onClick={e => sorting('currency')}>Currency {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                      {/* <th onClick={e => sorting('transaction_id')}>Transaction Id {filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                      <th onClick={e => sorting('transaction_status')}>Transaction Status {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                      <th onClick={e => sorting('createdAt')}>Creation Date {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                      <th onClick={e => sorting('updatedAt')}>Last Modified {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                      <th></th>

                    </tr>
                  </thead>
                  <tbody>
                    {!loaging && data?.data.map((itm, i) => {
                      return <tr className='data_row' key={i}>
                        <td className='name-person ml-2' onClick={e => view(itm._id)}>{methodModel?.capitalizeFirstLetter(itm?.paid_to_name)}</td>
                        {/* <td className='name-person ml-2'  >{itm?.role}</td> */}
                        {/* <td className='name-person ml-2'  >{methodModel?.capitalizeFirstLetter(itm?.subscription_plan_name)}</td> */}
                        <td className='name-person ml-2' >{itm?.amount}</td>
                        <td className='name-person ml-2'  >{itm?.currency}</td>
                        {/* <td className='name-person ml-2'  >{itm?.transaction_id}</td> */}
                        <td className='name-person ml-2'  >{itm?.transaction_status}</td>
                        <td className='name-person ml-2' >{datepipeModel.date(itm?.createdAt)}</td>
                        <td className='name-person ml-2' >{datepipeModel.date(itm?.updatedAt)}</td>

                      </tr>

                    })
                    }
                  </tbody>
                </table>
                {loaging ? <div className="text-center py-4">
                  <img src="/assets/img/loader.gif" className="pageLoader" />
                </div> : <></>} 
                {!loaging && total == 0 ? <div className="mb-3 text-center">No Data Found</div> : <></>}
              </div>
              </div>
            </div>
          </div>

         
       </div>

        </div>
        
      

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
      </Layout>
    </>
  );
}

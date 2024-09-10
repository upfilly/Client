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

export default function affilate() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 0,  count: 10, search: '', isDeleted: false})
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

    setLoader(true)
    let filter ;

    if(user?.role == "brand"){
      filter = { ...filters, ...p,brand_id:user?.id}
    }else{
      filter = { ...filters, ...p , affiliate_id:user.id}
    }
    
    ApiClient.get(`affiliatelink/all`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total_count)
        setLoader(false)
      }

    })
  };

  useEffect(() => {

    if (user.role == 'brand' ) {
      getData({ page: 1 })
    } else if (user.role != 'brand'){
      getData({ page: 1 })
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
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Track Data" filters={filters}>
        <div className='nmain-list  mb-3 main_box'>
       <div className='container-fluid'>
     
       <div className='row'>
       <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="">
                                Tracking Affiliates
                            </h3>

                            <article className="d-flex filterFlex phView">
                                <div className='searchInput'>
                                    <input
                                        type="text"
                                        value={filters.search}
                                        placeholder="Search"
                                        className="form-control"
                                        onChange={(e) => e.target.value == "" ? reset() : setFilter({ search: e.target.value })}
                                        // onKeyPress={handleKeyPress}
                                    />
                                    <i class="fa fa-search search_fa" onClick={() => {
                                        filter()
                                    }} aria-hidden="true"></i>
                                </div>

                                {/* <SelectDropdown
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="All Status"
                                    intialValue={filters.status}
                                    result={e => { ChangeStatus(e.value) }}
                                    options={[
                                        {id:'pending',name:'Pending'},
                                        {id:'accepted',name:'Accepted'},
                                        {id:'rejected',name:'Rejected'},
                                    ]}
                                /> */}


                                {filters.search ? <>
                                    <a className="btn btn-primary" onClick={e => reset()}>
                                        Reset
                                    </a>
                                </> : <></>}
                            </article>
                        </div>
                    </div>
          </div>
          <div className='row '>
            <div className='respon_data'>
              <div className='table_section '>
              <div className='table-responsive '>
                <table class="table table-striped ">
                      <thead className="thead-clr">
                        <tr>
                          {data?.data?.reduce((headers, itm) => {
                        if (itm?.urlParams && typeof itm.urlParams === 'object') {
                            Object.keys(itm.urlParams).forEach(key => {
                              if (!headers.includes(key)) {
                                headers.push(key);
                              }
                            })};
                            return headers;
                          }, [])?.map(key => (
                            <th key={key} scope="col">{key}</th>
                          ))}
                          <th scope="col" >Affiliate</th> 
                          <th scope="col" >Brand</th> 
                          <th scope="col" >Currency</th> 
                          <th scope="col" >Price</th> 
                          <th scope="col" >Order Id</th> 

                          {/* <th scope="col" >Page</th> */}
                          {/* <th scope="col" onClick={e => sorting('currency')}>Currency</th>
                          <th scope="col" onClick={e => sorting('transaction_status')}>Transaction Status</th> */}
                          <th scope="col" onClick={e => sorting('createdAt')}>Creation Date</th>
                          {/* <th scope="col" onClick={e => sorting('updatedAt')}>Last Modified</th> */}
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {!loaging && data?.data?.map((itm, i) => {

                          return <tr className='data_row' key={i}>
                            {uniqueKeys?.map(key => {
                              const value = itm?.urlParams && itm.urlParams[key] !== undefined ? itm.urlParams[key] : null;
                              return <td key={key} className='name-person ml-2'>{value || "--"}</td>;
                            })}
                            <td className='name-person ml-2' >{itm?.affiliate_name}</td>
                            <td className='name-person ml-2' >{itm?.brand_name || "--"}</td>
                            <td className='name-person ml-2' >{itm?.currency}</td>
                            <td className='name-person ml-2' >{itm?.price}</td>
                            <td className='name-person ml-2' >{itm?.order_id}</td>

                            {/* <td className='name-person ml-2' >{itm?.data?.page}</td> */}
                            <td className='name-person ml-2' >{datepipeModel.date(itm?.createdAt)}</td>
                            {/* <td className='name-person ml-2' >{datepipeModel.date(itm?.updatedAt)}</td> */}
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
            pageRangeDisplayed={2}
                        marginPagesDisplayed={1}
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

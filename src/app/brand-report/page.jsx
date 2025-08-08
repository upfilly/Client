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
import ReportChart from '../components/common/AreaChart/AreaChart'
import SelectDropdown from '../components/common/SelectDropdown';

export default function BrandReport() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 0, count: 10, search: '', isDeleted: false })
  const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [affiliateData, setAffiliateData] = useState("");
  const [AffiliateDataId, setAffiliateDataId] = useState([]);
  const [analyticData, setAnalyticData] = useState()

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const getAffiliateData = (p = {}) => {
    let filter = {brand_id:user?.id}
    let url = 'getallaffiliatelisting'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        const data = res?.data?.map((data) => {
          return ({
            id: data?.id || data?._id,
            name: data?.userName
          })
        })
        setAffiliateData(data)
      }
    })
  }

  const getData = (p = {}) => {

    setLoader(true)
    let filter = { ...filters, ...p,affiliate_id:AffiliateDataId}

    // if(user?.role == "brand"){
    //   filter = { ...filters, ...p,brand_id:user?.id}
    // }else{
    //   filter = { ...filters, ...p , affiliate_id:user.id}
    // }

    ApiClient.get(`affiliatelink/all`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total_count)
        setLoader(false)
      }

    })
  };

  useEffect(() => {
    getAffiliateData({ page: 1 })
    if (user.role == 'brand') {
      getData({ page: 1 })
    } else if (user.role != 'brand') {
      getData({ page: 1 })
    }
  }, [AffiliateDataId])

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
    getData({ ...filter })
    // dispatch(search_success(''))
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



  const getAnalyticsData = () => {
    let url = 'analytics-sales'
    let filter = { affiliate_id:AffiliateDataId}

    ApiClient.get(url, filter).then(res => {
      if (res) {
        setAnalyticData(res?.data)
      }
    })
  }

  useEffect(() => {
    getAnalyticsData()
  }, [AffiliateDataId])

  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Brand Report" filters={filters}>
        <div className='nmain-list  mb-3 main_box'>
          <div className='container-fluid'>
            <ReportChart areaData={analyticData?.data?.[0]} />
            <div className='row'>
            </div>
            <div className='row '>
              <div className='respon_data'>
                <div className='table_section '>
                  <div className='table-responsive '>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <SelectDropdown                                                     theme='search'
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="All Affiliates"
                        intialValue={AffiliateDataId}
                        result={e => { setAffiliateDataId(e.value) }}
                        options={affiliateData}
                      />

                    </div>
                    <table class="table table-striped ">
                      <thead className="thead-clr">
                        <tr>
                          {data?.data?.reduce((headers, itm) => {
                            if (itm?.urlParams && typeof itm.urlParams === 'object') {
                              Object.keys(itm.urlParams).forEach(key => {
                                if (!headers.includes(key)) {
                                  headers.push(key);
                                }
                              })
                            };
                            return headers;
                          }, [])?.map(key => (
                            <th key={key} scope="col">{key}</th>
                          ))}
                          <th scope="col" >Affiliate</th>
                          <th scope="col" >Brand</th>
                          <th scope="col" >Currency</th>
                          <th scope="col" >Price</th>
                          <th scope="col" >Order Id</th>
                          <th scope="col" onClick={e => sorting('createdAt')}>Creation Date</th>
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
                            <td className='name-person ml-2' >{datepipeModel.date(itm?.createdAt)}</td>
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
      </Layout>
    </>
  );
}

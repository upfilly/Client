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
import MultiSelectDropdownWithCheckboxes from './MultiSelectDropdownWithCheckboxes';

export default function CampaignReport() {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 0, count: 10, search: '', isDeleted: false })
  const [data, setData] = useState({})
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [campaignId, setCampaignId] = useState([]);
  const [CampaignData, setCamapign] = useState([]);
  const [analyticData, setAnalyticData] = useState()

  console.log(campaignId,"campaignIdcampaignIdcampaignId")

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const getCamapignData = (p = {}) => {
    let filter = { ...filters, ...p }
    let url = 'campaign/all'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        const data = res?.data?.data?.map((data) => {
          return ({
            id: data?.id || data?._id,
            name: data?.name
          })
        })
        setCamapign(data)
      }
    })
  }

  const getData = (p = {}) => {

    setLoader(true)
    let filter;

    if (user?.role == "brand") {
      filter = { ...filters, ...p,brand_id:user?.id || user?._id, campaignId: campaignId.map((itm)=>itm).join(",").toString() }
    } else {
      filter = { ...filters, ...p, campaignId: campaignId.map((itm)=>itm).join(",").toString() }
    }

    ApiClient.get(`affiliatelink/report`, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        setTotal(res?.data?.total_count)
        setLoader(false)
      }
    })
  };

  useEffect(() => {
    getCamapignData({ page: 1 })
    if (user.role == 'brand') {
      getData({ page: 1 })
    } else if (user.role != 'brand') {
      getData({ page: 1 })
    }
  }, [campaignId])

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
    let filters = {brand_id:user?.id || user?._id, campaignId: campaignId.map((itm)=>itm).join(",").toString() }

    ApiClient.get(url, filters).then(res => {
      if (res) {
        setAnalyticData(res?.data)
      }
    })
  }

  useEffect(() => {
    getAnalyticsData()
  }, [campaignId])

  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Track Data" filters={filters}>

        <div className='nmain-list  mb-3 main_box'>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {/* <MultiSelectDropdown
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="All Campaign"
                        intialValue={campaignId}
                        result={e => { setCampaignId(e.value) }}
                        options={CampaignData}
                      /> */}
            <h3 class="campaign-header">
              Select Campaign
            </h3>
          <MultiSelectDropdownWithCheckboxes
            options={CampaignData}
            initialValue={campaignId}
            onChange={(selectedValues) => setCampaignId(selectedValues)}
          />

        </div>
          <div className='container-fluid'>
            <ReportChart areaData={analyticData?.data?.[0]} />
            <div className='row'>
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
                              })
                            };
                            return headers;
                          }, [])?.map(key => (
                            <th key={key} scope="col">{key}</th>
                          ))}
                          <th scope="col" >Affiliate</th>
                          <th scope="col" >Brand</th>
                          {/* <th scope="col" >Currency</th> */}
                          <th scope="col" >Revenue</th>
                          <th scope="col" >Counts</th>
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
                            <td className='name-person ml-2' >{itm?.affiliate_details?.fullName || "--"}</td>
                            <td className='name-person ml-2' >{itm?.brand_details?.fullName || "--"}</td>
                            <td className='name-person ml-2' >{itm?.revenue}</td>
                            <td className='name-person ml-2' >{itm?.click_count}</td>
                            {/* <td className='name-person ml-2' >{itm?.order_id}</td> */}
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

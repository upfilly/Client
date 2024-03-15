'use client'

import { useEffect, useState } from "react";
import Layout from "../components/global/layout";
import "./style.scss";
import ApiClient from "@/methods/api/apiClient";
import datepipeModel from "@/models/datepipemodel";
import OfferFormModal from "../marketplace/MakeofferModal";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MultiSelectDropdown from "../components/common/MultiSelectDropdown";
import methodModel from "@/methods/methods";
import crendentialModel from "@/models/credential.model";
import { useRouter } from "next/navigation";

export default function MarketPlace() {
  const user: any = crendentialModel.getUser()
  const history = useRouter()
  const [filters, setFilter] = useState<any>({
    page: 0,
    count: 5,
    search: '',
    isDeleted: false,
    opportunity_type: null,
    placement: null,
    start_date: '',
    end_date: '',
    status: ''
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [category, setCategory] = useState([])
  const [category_id, setCategory_id] = useState('')
  const [affiliateName, setAffiliateName] = useState('')
  const [id, setid] = useState('')
  const [subCategory_id, setSubcategory_id] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [placement, setPlacement] = useState([])
  const [opportunity, setOpportunity] = useState([])
  const [dateRange, setDateRange] = useState([null, null]);
  const [opportunitySate, setopportunitySate] = useState(false)
  const [PlacementSate, setPlacementSate] = useState(false)
  const [Datefilter, setDateSate] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState([]);

  const toggleDescription = (index: any) => {
    const newShowFullDescription: any = [...showFullDescription];
    newShowFullDescription[index] = !newShowFullDescription[index];
    setShowFullDescription(newShowFullDescription);
  };

  const [startDate, endDate]: any = dateRange;

  const currentDate: any = startDate ? new Date(startDate) : null;
  const formattedStartDate = startDate ? `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}` : null

  const currentEndDate: any = endDate ? new Date(endDate) : null;
  const formattedEndDate = endDate ? `${currentEndDate.getFullYear()}-${(currentEndDate.getMonth() + 1).toString().padStart(2, '0')}-${currentEndDate.getDate().toString().padStart(2, '0')}` : null

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    let url = 'product/all'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setData(res.data.data)
        setTotal(res.data.total_count)
      }
      setLoader(false)
    })
  }

  const placementData = placement.map((itm) => itm).join(',\n') || ''
  const oportunityData = opportunity.map((itm) => itm,).join(',\n') || ''

  useEffect(() => {
    if (opportunity.length > 0) {
      console.log("inn")
      setFilter({ ...filters, page: 1, sub_category_id: subCategory_id, opportunity_type: oportunityData, start_date: formattedStartDate, end_date: formattedEndDate })
      getData({ ...filters, page: 1, sub_category_id: subCategory_id, start_date: formattedStartDate, end_date: formattedEndDate, opportunity_type: oportunityData })
    }
    if (opportunity.length == 0 || placement.length == 0) {
      console.log("inn")
      setFilter({ ...filters, page: 1, sub_category_id: subCategory_id, opportunity_type: oportunityData, placement: placementData, start_date: formattedStartDate, end_date: formattedEndDate })
      getData({ ...filters, page: 1, sub_category_id: subCategory_id, opportunity_type: oportunityData, placement: placementData, start_date: formattedStartDate, end_date: formattedEndDate, })
    }
    if (placement.length > 0) {
      console.log("innnn")
      setFilter({ ...filters, page: 1, sub_category_id: subCategory_id, placement: placementData, start_date: formattedStartDate, end_date: formattedEndDate })
      getData({ ...filters, page: 1, sub_category_id: subCategory_id, start_date: formattedStartDate, end_date: formattedEndDate, placement: placementData })
    }
    if (subCategory_id || formattedStartDate || formattedEndDate) {
      console.log("innnnnnnnn")
      setFilter({ ...filters, page: 1, sub_category_id: subCategory_id, start_date: formattedStartDate, end_date: formattedEndDate })
      getData({ ...filters, page: 1, sub_category_id: subCategory_id, start_date: formattedStartDate, end_date: formattedEndDate })
    }
  }, [subCategory_id, startDate, endDate, opportunity, placement])

  const pageChange = (e: any) => {
    setFilter({ ...filters, page: e.selected })
    getData({ page: e.selected + 1 })
  }

  const filter = (e: any) => {
    e.preventDefault()
    setFilter({ ...filters })
    getData({ ...filters, page: 1 })
  }

  const reset = () => {
    let filter = {
      status: '',
      role: '',
      search: '',
      page: 1,
      count: 5
    }
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
  }

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      filter(event);
    }
  };

  useEffect(() => {
    getData({ page: 1 })
  }, [])

  const getCategory = (p = {}) => {
    let url = "categoryWithSub?page&count&search&cat_type=product&status=active";
    ApiClient.get(url).then((res) => {
      if (res.success) {
        const data = res.data.data;

        setCategory(data);
      }
    });
  };

  useEffect(() => {
    getCategory()
  }, [])

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <>
        <section className="p-80">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-3">
                <div className="filters_data_list">
                  <div className="categories-container">
                    <h5 className="mb-4">Category</h5>
                    {category.map((itm: any) => {
                      const isOpenCategory = category_id === itm._id;
                      return (
                        <div className={!isOpenCategory ? "arowslist_up opendiv" : "arowslist_up mb-4"} key={itm._id}>
                          <div className="names_checklist d-flex align-items-center justify-content-between" onClick={() => {
                            setCategory_id(prevState => prevState === itm._id ? null : itm._id);
                          }}>
                            <p className="mb-2">{itm.parent_cat_name}</p>
                            <p className="mb-2"><i className="fa fa-angle-down"></i></p>
                          </div>
                          {itm?.subCategories?.map((data: any) => {
                            return (
                              <div className={!isOpenCategory ? "show_checksbox mb-4" : "hide_checksbox mb-4"} key={data._id}>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <label className="container_checks m-0">
                                    <input
                                      type="checkbox"
                                      checked={selectedSubcategory === data.id}
                                      onChange={() => {
                                        setSelectedSubcategory(prevState => prevState === data.id ? null : data.id);
                                        setSubcategory_id(prevState => prevState === data.id ? null : data.id);
                                      }}
                                    />
                                    <div className="checkmark"></div>
                                  </label>
                                  <div className="d-flex align-items-center justify-content-between w-100">
                                    <p className="m-0 fs14">{methodModel.capitalizeFirstLetter(data.name)}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>


                  <div className="categories-container">
                    <h5 className="mb-4 mt-2">Other Filter</h5>

                    <div className={Datefilter ? 'arowslist_up opendiv' : 'arowslist_up'} >
                      <div className="names_checklist d-flex align-items-center justify-content-between" onClick={() => setDateSate(!Datefilter)}>
                        <p className="mb-2">Date Filter</p>
                        <p className="mb-2"><i className="fa fa-angle-down"></i></p>
                      </div>

                      <div className={Datefilter ? "show_checksbox mb-4" : "hide_checksbox mb-4"}>
                        <DatePicker
                          showIcon
                          className="dateselect"
                          monthsShown={2}
                          shouldCloseOnSelect={true}
                          selectsRange={true}
                          placeholderText="Select Date Range"
                          startDate={startDate}
                          endDate={endDate}
                          onChange={(update: any) => {
                            setDateRange([update[0], update[1]])
                          }}
                          isClearable
                          // minDate={new Date()}
                          withPortal
                          dateFormat={"dd/MM/yyyy"}
                        />
                      </div>

                    </div>


                    <div className={PlacementSate ? 'arowslist_up opendiv' : 'arowslist_up'}  >
                      <div className="names_checklist d-flex align-items-center justify-content-between" onClick={() => setPlacementSate(!PlacementSate)}>
                        <p className="mb-2">Placement Filter</p>
                        <p className="mb-2"><i className="fa fa-angle-down"></i></p>
                      </div>

                      <div className={PlacementSate ? "show_checksbox mb-4" : "hide_checksbox mb-4"}>
                        <MultiSelectDropdown
                          id="statusDropdown"
                          displayValue="name"

                          intialValue={placement}
                          result={(e: any) => setPlacement(e.value)}
                          options={[{ name: "Website", id: "website" },
                          { name: "Email", id: "email" },
                          { name: "Social", id: "social" },
                          { name: "Mobile", id: "mobile" }]}

                        />

                      </div>

                    </div>


                    <div className={opportunitySate ? 'arowslist_up opendiv' : 'arowslist_up'}  >
                      <div className="names_checklist d-flex align-items-center justify-content-between" onClick={() => setopportunitySate(!opportunitySate)}>
                        <p className="mb-2">Opportunity Filter</p>
                        <p className="mb-2"><i className="fa fa-angle-down"></i></p>
                      </div>

                      <div className={opportunitySate ? "show_checksbox mb-4" : "hide_checksbox mb-4"}>
                        <MultiSelectDropdown
                          id="statusDropdown"
                          displayValue="name"

                          intialValue={opportunity}
                          result={(e: any) => setOpportunity(e.value)}
                          options={[
                            { name: "Single Placement", id: "single_placement" },
                            { name: "Package", id: "package" },
                            { name: "Social", id: "social" },
                          ]}

                        />

                      </div>

                    </div>
                  </div>

                </div>
              </div>

              <div className="col-12 col-md-9">
                <div className="lists_marketplace">
                  <div className="job-searchbar mb-6">
                    <h4 className="mb-0">{total} Results Found</h4>
                    <form>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex jobs_child-flex">
                            <input value={filters.search} onKeyPress={handleKeyPress} onChange={(e) => e.target.value == "" ? reset() : setFilter({ search: e.target.value })} className="form-control me-3" type="text" placeholder="Search Here" />
                            <button className="btn-primary btn-sm plr-5" onClick={(e) => filter(e)}> Search</button>
                          </div>
                        </div>
                      </div>
                    </form>



                  </div>


                  <div className="mt-5">

                    <div className="heading_lists">
                      <h4 className="filtes_herd">Opportunity Marketplace</h4>
                    </div>

                    <div className="row">
                      {!loaging  && data.map((data: any, index: any) => <div className="col-12 col-md-6" >
                        <div className="showngmkt lists_mkt">

                          <div className="grid_lists_mkt ">
                            <div className="subparttop d-flex align-items-center justify-content-between" onClick={()=>history.push(`/marketplace/detail/${data?._id}`)}>
                              <div className="leftshead">
                                <h6>{methodModel.capitalizeFirstLetter(data?.name)}</h6>
                                <p className="types_date">Type:<span className="types_main"> {data?.opportunity_type?.map((itm: any) => itm).join(',\n') || ''}</span> - Added: {datepipeModel.date(data?.createdAt)}</p>
                              </div>
                            </div>

                            <div className="showin_mkt mt-4 mb-4" onClick={()=>history.push(`/marketplace/detail/${data?._id}`)}>
                              <h5 className="capital">Placements: {data?.placement?.map((itm: any) => itm).join(',\n') || ''}</h5>
                              <div key={index}>
                                <p className="descmkt" dangerouslySetInnerHTML={{ __html: showFullDescription[index] ? data?.description : `${data?.description.slice(0, 100)}` }}></p>
                              </div>

                            </div>


                            <div className="d-flex align-items-center justify-content-between bordertop">
                              <div className="leftshead">
                                {/* <h6>${data?.price}</h6> */}
                                <p className="types_date mb-0"><span className="types_main">Start: {datepipeModel.date(data?.start_date)} End: {datepipeModel.date(data?.end_date)}</span></p>
                              </div>

                              {user?.role == 'brand' && <div className="rightimg">
                                <div className="btn_offers d-flex justify-content-end">
                                  {data?.isSubmitted ?
                                    <button className="btn-cancel" disabled>Offer Sent</button>
                                    : 
                                    <button className="btn-cancel" onClick={() => {
                                      setModalIsOpen(true)
                                      setid(data?._id)
                                      setAffiliateName(data?.addedBy_name)
                                    }}> Make Offer</button>}
                                </div>
                              </div>}
                            </div>

                          </div>
                        </div>
                      </div>)}
                    </div>
                    {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}

                    <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
                      <span>Show {data?.length} from {total} Offers</span>
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
                  </div>

                </div>
              </div>


            </div>
          </div>
          <OfferFormModal getProductData={getData} modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} id={id} affiliateName={affiliateName} />
        </section>
      </>
    </Layout>
  );
}

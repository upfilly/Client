import React, { useState, useEffect } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '../../methods/methods';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';

const Html = ({
    view,
    reset,
    statusChange,
    pageChange,
    filters,
    loaging,
    data,
    total,
    filter,
    sorting,
    setFilter,
    previousdata,
    previoustotal,
    SendPreviousRequest
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState('new'); // State to track the active tab
    const [filteredData, setFilteredData] = useState(data); // State for filtered data
    const [categoryType, setCategoryType] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
    const [category, setCategory] = useState([])

    const handleCategoryTypeChange = (id) => {
        setCategoryType(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
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

    const categoryTypes = [
        { id: 'promotional_models', name: 'Promotional Models' },
        { id: 'property_types', name: 'Property Types' },
        { id: 'advertiser_categories', name: 'Advertiser Categories' },
    ]

    useEffect(() => {
        if (activeTab === 'new') {
            setFilteredData(data);
        } else {
            setFilteredData(previousdata);
        }
    }, [activeTab]);

    useEffect(() => {
        getCategory()
    }, [categoryType])

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    const handleCountChange = (count) => {
        setFilter({ ...filters, count: count, page: 1 });
        getData({ count: count, page: 1 });
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Campaigns" filters={filters}>
            <div className='nmain-list mb-3'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-flex-start align-items-center">
                            <div className='filter_camp mr-2'>
                                <button className='set-filter' type="button" class="set-filter abs_butsn" data-bs-toggle="modal" data-bs-target="#exampleModal"><svg xmlns="http://www.w3.org/2000/svg" width="14px" aria-hidden="true" data-name="Layer 1" viewBox="0 0 14 14" role="img"><path d="M0 2.48v2h2.09a3.18 3.18 0 006.05 0H14v-2H8.14a3.18 3.18 0 00-6.05 0zm3.31 1a1.8 1.8 0 111.8 1.81 1.8 1.8 0 01-1.8-1.82zm2.2 6.29H0v2h5.67a3.21 3.21 0 005.89 0H14v-2h-2.29a3.19 3.19 0 00-6.2 0zm1.3.76a1.8 1.8 0 111.8 1.79 1.81 1.81 0 01-1.8-1.79z"></path></svg> Filter</button>
                            </div>
                            <h3 className="">
                                Campaign Management
                            </h3>
                            {/* Tab Navigation */}
                            {/* <div className="tabs">
                                {['new', 'previous'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab === 'new' ? 'New Campaign' : 'Previous Campaign'}
                                    </button>
                                ))}
                            </div>*/}

                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='table_section mt-0'>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className='table_head'>
                                        <tr className='heading_row'>
                                            <th scope="col" className="table_data" onClick={e => sorting('name')}>
                                                Campaign Name {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className="table_data" onClick={e => sorting('name')}>
                                                Brand Name {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className='table_data' onClick={e => sorting('event_type')}>
                                                Event Type {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className='table_data'>Commission</th>
                                            <th scope="col" className='table_data'>Status</th>
                                            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>
                                                Created Date {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            {/* <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>
                                                Last Modified {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th> */}
                                            <th scope="col" className='table_data'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!loaging && activeTab == "new") ? data.map((itm, i) => {

                                            // if (!itm?.campaign_detail?.commission) {
                                            //     return
                                            // }

                                            return (
                                                <tr className='data_row' key={i}>
                                                    <td className='table_dats' onClick={e => view(itm.campaign_detail?.id || itm?.campaign_detail?._id)}>
                                                        <div className='user_detail'>
                                                            <div className='user_name'>
                                                                <h4 className='user'>
                                                                    {methodModel.capitalizeFirstLetter(itm?.campaign_detail?.name)}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {itm?.brand_detail?.fullName && <td className='table_dats'>{itm?.brand_detail?.fullName}</td>}
                                                    {itm?.campaign_detail?.event_type && <td className='table_dats'>{itm?.campaign_detail?.event_type.join(",")}</td>}
                                                    <td className='table_dats'>{itm?.campaign_detail?.commission} {itm?.campaign_detail?.commission_type == "percentage" ? "%" : "$"}</td>
                                                    {/* <td className={`${itm?.isActive  ? "active" : "inactive"}`}>{itm?.isActive ? "Active" : "InActive"}</td> */}
                                                    <td className='table_dats'>   <span className={`active_btn${itm?.isActive}`}>
                                                        <span className={!itm?.isActive ? "inactive" : "contract"}>
                                                            {!itm?.isActive ? 'Not Joined' : 'Joined'}
                                                        </span>
                                                    </span></td>
                                                    <td className='table_dats'>{datepipeModel.date(itm.campaign_detail?.createdAt)}</td>
                                                    {/* <td className='table_dats'>{datepipeModel.date(itm?.campaign_detail?.updatedAt)}</td> */}
                                                    <td className='table_dats d-flex align-items-center'>
                                                        {itm?.status == 'pending' ? (
                                                            <div className='d-flex align-items-center'>
                                                                <button onClick={() => statusChange("accepted", itm?.id || itm?._id)} className="btn btn-primary mr-2 btn_actions">
                                                                    <i className='fa fa-check'></i>
                                                                </button>
                                                                <button onClick={() => statusChange("rejected", itm?.id || itm?._id)} className="btn btn-danger br50 bg-red mr-2 btn_actions">
                                                                    <i className='fa fa-times'></i>
                                                                </button>
                                                            </div>
                                                        ) : itm?.status == 'rejected' ? (
                                                            <div className="btn btn-primary mr-2">Rejected</div>
                                                        ) : (
                                                            <div className="btn btn-primary mr-2">Accepted</div>
                                                        )}
                                                        <button className='btn btn-primary btn_actions'
                                                            onClick={() => {
                                                                history.push(`/chat`);
                                                                localStorage.setItem("chatId", itm?.brand_id);
                                                            }}>
                                                            <i className='fa fa-comment-o'></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <>
                                                {!loaging && filteredData.map((itm, i) => (
                                                    <tr className='data_row' key={i}>
                                                        <td className='table_dats' onClick={e => view(itm?.id || itm?._id)}>
                                                            <div className='user_detail'>
                                                                <div className='user_name'>
                                                                    <h4 className='user'>
                                                                        {methodModel.capitalizeFirstLetter(itm?.name)}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {itm?.event_type && <td className='table_dats'>{itm?.event_type.join(",")}</td>}
                                                        <td className='table_dats'>{itm?.amount}</td>
                                                        <td className='table_dats'>{datepipeModel.date(itm?.createdAt)}</td>
                                                        <td className='table_dats'>{datepipeModel.date(itm?.updatedAt)}</td>
                                                        <td className='table_dats d-flex align-items-center'>
                                                            <button className='btn btn-primary btn_actions'
                                                                title="Send request"
                                                                onClick={() => {
                                                                    SendPreviousRequest(itm?.id || itm?._id, itm?.brand_id)
                                                                    // history.push(`/chat`);
                                                                    // localStorage.setItem("chatId", itm?.brand_id);
                                                                }}>
                                                                <i class="fa-solid fa-code-pull-request"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                                {(!loaging && total === 0 && activeTab == "new") && <div className="py-3 text-center">No Data</div>}
                                {(!loaging && previoustotal === 0 && activeTab != "new") && <div className="py-3 text-center">No Data</div>}
                            </div>
                        </div>

                        {/* {activeTab == 'previous' && <div className={`paginationWrapper ${!loaging && previoustotal > previousfilters?.count ? '' : 'd-none'}`}>
                            <span>Show {previousdata?.length} from {previoustotal} campaigns</span>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Next >"
                                initialPage={previousfilters?.page}
                                onPageChange={pagePreviousChange}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                pageCount={Math.ceil(previoustotal / previousfilters?.count)}
                                previousLabel="< Previous"
                                renderOnZeroPageCount={null}
                                pageClassName={"pagination-item"}
                                activeClassName={"pagination-item-active"}
                            />
                        </div>}

                        {activeTab != 'previous' && <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
                            <span>Show {filteredData?.length} from {total} campaigns</span>
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
                        </div>} */}

                        {/* {!loaging && total == 0 ? <div className="py-3 text-center">No Affiliate</div> : <></>} */}

                        <div className={`paginationWrapper ${!loaging ? '' : 'd-none'}`}>
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
                    </div>
                </div>


                {/* campaign filters */}
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
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={category._id}
                                                                        name="category"
                                                                        value={category._id}
                                                                        checked={selectedCategory?.includes(category._id)}
                                                                        onChange={() => handleCategoryChange(category)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={category._id}>{category.parent_cat_name}</label>
                                                                </div>

                                                                {selectedCategory?.includes(category._id) && (
                                                                    <ul className="sub_ulbx">
                                                                        {category.subCategories.map((subCategory) => (
                                                                            <li key={subCategory.id}>
                                                                                <div className="form-check">
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        type="checkbox"
                                                                                        id={subCategory.id}
                                                                                        name="subCategory"
                                                                                        value={subCategory.id}
                                                                                        checked={selectedSubCategory?.includes(subCategory.id)}
                                                                                        onChange={() => handleSubCategoryChange(subCategory)}
                                                                                    />
                                                                                    <label className="form-check-label" htmlFor={subCategory.id}>
                                                                                        {subCategory.name}
                                                                                    </label>
                                                                                </div>

                                                                                {subCategory.subchildcategory && subCategory.subchildcategory.length > 0 && (
                                                                                    <ul>
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


                                                                {/* {selectedCategory?.includes(category._id) && (
                                        <ul className='filter_ullist'>
                                          {selectedSubCategory.subchildcategory.map(subSubCategory => (
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
                                                <label className="form-check-label" htmlFor={subSubCategory._id}>{subSubCategory.name}</label>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      )} */}
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


            </div>
        </Layout>
    );
};

export default Html

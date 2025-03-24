import React, { useState, useEffect } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '../../methods/methods';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import { FaFilter } from "react-icons/fa";
import MultiSelectValue from '../components/common/MultiSelectValue';
import SelectDropdown from '../components/common/SelectDropdown';
import axios from 'axios';

const Html = ({
    view,
    // reset,
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
    getData,
    SendPreviousRequest,
    sendRequest,
    ChangeStatus,
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState('new');
    const [filteredData, setFilteredData] = useState(data);
    const [categoryType, setCategoryType] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState([]);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [category, setCategory] = useState([])
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const regions = [
        { id: "Africa", name: "Africa" },
        { id: "Asia", name: "Asia" },
        { id: "Europe", name: "Europe" },
        { id: "North America", name: "North America" },
        { id: "Oceania", name: "Oceania" }
    ];

    const handleCategoryTypeChange = (id) => {
        setCategoryType(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const reset = () => {
        let filter = {
            status: '',
            role: '',
            search: '',
            page: 1,
            count: 5
        }
        setFilter({ ...filters, ...filter })
        setSelectedCategory([]);
        setSelectedSubCategory([]);
        setSelectedSubSubCategory([]);
        setSelectedRegion([]);
        setSelectedCountries([]);
        getData({ ...filter })
        // dispatch(search_success(''))
    }

    const getCategory = (p = {}) => {
        let url = `categoryWithSub?page&count&search&cat_type=advertiser_categories&status=active`;
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

    const handleRegionChange = (region) => {
        setSelectedRegion(prev =>
            prev.includes(region.id) ? prev.filter(item => item !== region.id) : [...prev, region.id]
        );
    };

    const fetchCountriesByRegions = async (regions) => {
        try {
            const countries = await Promise.all(
                regions.map(async (region) => {
                    const response = await axios.get(
                        `https://restcountries.com/v3.1/region/${region}`
                    );
                    return response.data.map((country) => ({
                        label: country.name.common,
                        id: country.name.common,
                    }));
                })
            );
            setCountries(countries.flat());
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    };

    const categoryTypes = [
        { id: 'promotional_models', name: 'Promotional Models' },
        { id: 'property_types', name: 'Property Types' },
        // { id: 'advertiser_categories', name: 'Advertiser Categories' },
    ]

    useEffect(() => {
        if (activeTab === 'new') {
            setFilteredData(data);
        } else {
            setFilteredData(previousdata);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchCountriesByRegions(selectedRegion)
    }, [selectedRegion])

    useEffect(() => {
        getCategory()
    }, [categoryType])

    useEffect(() => {
        getData({
            page: 1, region: selectedRegion?.map((dat) => dat).join(","),
            category_type: categoryType?.map((dat) => dat).join(","),
            category: selectedCategory?.map((dat) => dat).join(","),
            sub_category: selectedSubCategory?.map((dat) => dat).join(","),
            countries: selectedCountries?.map((dat) => dat).join(","),
            sub_child_category: selectedSubSubCategory?.map((dat) => dat).join(",")
        })
    }, [categoryType, selectedCategory, selectedSubCategory, selectedSubSubCategory, selectedRegion])

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
            <div className='mapping-wrapper'>
                <div className='row'>
                    <div className='col-12 col-sm-12 col-md-6 col-lg-12'>
                        <div className='lists_marketplace'>
                            <div className='set-border-top'>
                                <div className="main_title_head d-flex justify-content-flex-start align-items-center">
                                    <div className='filter_camp mr-2'>
                                        <button className='btn btn-primary d-flex align-items-center' type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><FaFilter className="mr-2" /> Filter</button>
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
                                <SelectDropdown
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="All Status"
                                    intialValue={filters.status}
                                    result={e => { ChangeStatus(e.value) }}
                                    options={[
                                        { id: 'pending', name: 'Pending' },
                                        { id: 'accepted', name: 'Joined' },
                                        { id: 'rejected', name: 'Rejected' },
                                    ]}
                                />
                            </div>
                            <div className='mt-5'>
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
                                                    <th scope="col" className="table_data" onClick={e => sorting('name')}>
                                                        Affiliate Approval
                                                    </th>
                                                    <th scope="col" className='table_data' onClick={e => sorting('event_type')}>
                                                        Event Type
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
                                                            {<td className='table_dats'>{itm?.campaign_type || "--"}</td>}
                                                            {itm?.campaign_detail?.event_type && <td className='table_dats'>{itm?.campaign_detail?.event_type.join(",")}</td>}
                                                            <td className='table_dats'> {itm?.campaign_detail?.commission_type == "percentage" ? `${itm?.campaign_detail?.commission}%` : `$${itm?.campaign_detail?.commission}`}</td>
                                                            {/* <td className={`${itm?.isActive  ? "active" : "inactive"}`}>{itm?.isActive ? "Active" : "InActive"}</td> */}
                                                            <td className='table_dats'>   <span className={`active_btn${itm?.isActive}`}>
                                                                <span className={!itm?.isActive ? (itm?.status == "accepted" && !itm?.isActive) ? "switched" : "inactive" : "contract"}>
                                                                    {!itm?.isActive ? itm?.status == "rejected" ? "Rejected" : (itm?.status == "accepted" && !itm?.isActive) ? "Switched" : 'Pending' : 'Joined'}
                                                                </span>
                                                            </span></td>
                                                            <td className='table_dats'>{datepipeModel.date(itm.campaign_detail?.createdAt)}</td>
                                                            {/* <td className='table_dats'>{datepipeModel.date(itm?.campaign_detail?.updatedAt)}</td> */}
                                                            <td className='table_dats d-flex align-items-center'>
                                                                {itm?.status == 'pending' ? (
                                                                    <div className='d-flex align-items-center'>
                                                                        <button onClick={itm?.campaign_type == 'manual' ? () => sendRequest(itm?._id, itm?.brand_id, itm?.campaign_id) : () => statusChange("accepted", itm?.id || itm?._id)} className="btn btn-primary mr-2 btn_actions">
                                                                            <i className='fa fa-check'></i>
                                                                        </button>
                                                                        <button onClick={() => statusChange("rejected", itm?.id || itm?._id)} className="btn btn-danger br50 bg-red mr-2 btn_actions">
                                                                            <i className='fa fa-times'></i>
                                                                        </button>
                                                                    </div>
                                                                ) : itm?.status == 'rejected' ?
                                                                    <div className="btn btn-primary mr-2">Rejected</div> :
                                                                    itm?.status == 'requested' ?
                                                                        <div className="btn btn-primary mr-2">Request Sent</div> : (
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
                                            {/* Category Type Filter */}
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    {/* <h2 className="accordion-header">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebxone" aria-expanded="true" aria-controls="collapsebxone">
                                                            <b>Select Category Type</b>
                                                            <i className="fa fa-angle-down down_typs" aria-hidden="true"></i>
                                                        </button>
                                                    </h2> */}
                                                    {/* <div id="collapsebxone" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
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
                                                    </div> */}
                                                </div>
                                            </div>

                                            {/* Affiliate Category Filter */}
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
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Region Filter */}
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebxRegion" aria-expanded="true" aria-controls="collapsebxRegion">
                                                            <b>Select Region</b>
                                                            <i className="fa fa-angle-down down_typs" aria-hidden="true"></i>
                                                        </button>
                                                    </h2>
                                                    <div id="collapsebxRegion" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                            <ul className="filter_ullist">
                                                                {regions.map(region => (
                                                                    <li key={region.id}>
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id={region.id}
                                                                                name="region"
                                                                                value={region.id}
                                                                                checked={selectedRegion?.includes(region.id)}
                                                                                onChange={() => handleRegionChange(region)}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={region.id}>{region.name}</label>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Country Filter */}
                                            <div className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header">
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapsebxRegion" aria-expanded="true" aria-controls="collapsebxRegion">
                                                            <b>Select Country</b>
                                                            <i className="fa fa-angle-down down_typs" aria-hidden="true"></i>
                                                        </button>
                                                    </h2>
                                                    <div id="collapsebxRegion" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body pading">
                                                            <ul className="filter_ullist">

                                                                <MultiSelectValue
                                                                    className="select-c"
                                                                    id="subSubCategoryDropdown"
                                                                    displayValue="label"
                                                                    placeholder="Select Country"
                                                                    intialValue={selectedCountries}
                                                                    result={e => {
                                                                        setSelectedCountries(e.value);
                                                                        // fetchCountriesByRegions(e.value)
                                                                    }}
                                                                    options={countries}
                                                                />

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
                </div>
            </div>
        </Layout>
    );
};

export default Html

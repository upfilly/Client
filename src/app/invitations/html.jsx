import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';
import './style.scss';
import methodModel from '@/methods/methods';
import SelectDropdown from '../components/common/SelectDropdown';

const Html = ({
    reset,
    pageChange,
    filters,
    loaging,
    data,
    total,
    filter,
    statusChange,
    sorting,
    setFilter,
    user,
    view,
    ChangeStatus
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

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
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name={"Invitations"} filters={filters}>
            <div className='sidebar-left-content main_box'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="">
                                Invitations
                            </h3>

                            <article className="d-flex filterFlex phView">
                                {/* <div className='searchInput'>
                                    <input
                                        type="text"
                                        value={filters.search}
                                        placeholder="Search"
                                        className="form-control"
                                        onChange={(e) => e.target.value == "" ? reset() : setFilter({ search: e.target.value })}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <i class="fa fa-search search_fa" onClick={() => {
                                        filter()
                                    }} aria-hidden="true"></i>
                                </div> */}

                                <SelectDropdown                                                     
                                    theme='search'
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
                                />


                                {filters.search || filters.status ? <>
                                    <a className="btn btn-primary" onClick={e => reset()}>
                                        Reset
                                    </a>
                                </> : <></>}
                            </article>
                        </div>
                    </div>
                    <div className='card-body'>


                        <div className='table_section mt-0'>
                            <div className="table-responsive ">

                                <table className="table table-striped  ">
                                    <thead className='table_head'>
                                        <tr className='heading_row'>
                                            <th scope="col" class="table_data" >Merchnat Name</th>
                                            <th scope="col" class="table_data" >Message</th>
                                            <th scope="col" className='table_data' >Brand Name</th>
                                            <th scope="col" className='table_data' >Campaign Name</th>
                                            <th scope="col" className='table_data' >Tags</th>
                                            <th scope="col" className='table_data' >Status</th>
                                            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th> Action</th>
                                            {/* <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loaging && data && data.map((itm, i) => {
                                            return <tr className='data_row' key={i}>
                                                <td className='table_dats'
                                                    onClick={() => view(itm?.id || itm?._id)}
                                                >
                                                    <div className='user_detail'>
                                                        <div className='user_name'>
                                                            <h4 className='user'>
                                                                {itm?.addedBy?.fullName}
                                                            </h4>
                                                        </div>
                                                    </div></td>
                                                <td className='table_dats'
                                                // onClick={()=>view(itm?.id)}
                                                >
                                                    <div className='user_detail'>
                                                        <div className='user_name'>
                                                            <h4 className='user'>
                                                                {itm?.message}
                                                            </h4>
                                                        </div>
                                                    </div></td>
                                                <td className='table_dats'>{itm?.brand_details?.fullName}</td>
                                                <td className='table_dats'>{itm?.campaign_detail?.name}</td>
                                                <td className='table_dats'>{itm?.tags?.map((data) => data).join(",") || "--"}</td>
                                                <td className={itm?.status == 'deactive' ? "inactive" : "contract"}>{methodModel.capitalizeFirstLetter(itm?.status)}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm.updatedAt)}</td>
                                                {<td className='table_dats d-flex flex-nowrap set_iconstabls justify-content-cente'>
                                                    {user && user?.role == "affiliate" && <>
                                                        {itm?.status == 'pending' ? <div>
                                                            <button onClick={() => {
                                                                statusChange("accepted", itm?.id || itm?._id)
                                                                // Tracklogin(itm?.campaign_unique_id)
                                                            }} className="btn btn-primary action-btns circle_icons mb-0 mr-2">
                                                                <i className='fa fa-check'></i>
                                                            </button>
                                                            <button onClick={() => statusChange("rejected", itm?.id || itm?._id)} className="btn btn-danger action-btns br50 bg-red circle_icons mb-0">
                                                                <i className='fa fa-times'></i>
                                                            </button>
                                                        </div> :
                                                            itm?.status == 'rejected' ?
                                                                <div className="btn btn-danger action-btns" title="Rejected">
                                                                    <i className="fa fa-times"></i>
                                                                </div>
                                                                :
                                                                <div className="btn btn-primary py-2 action-btns" title="Accepted">
                                                                    <i className="fa fa-check"></i>
                                                                </div>
                                                        }
                                                    </>}
                                                        <button type='button' className='btn btn-primary action-btns circle_icons mb-0'
                                                            onClick={() => {
                                                                history.push(`/chat`)
                                                                localStorage.setItem("chatId", itm?.addedBy?._id || itm?.addedBy?.id)
                                                            }}>
                                                            <i className='fa fa-comment-o'></i>
                                                        </button>



                                                </td>}

                                            </tr>

                                        })
                                        }
                                    </tbody>
                                </table>
                                {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

                            </div>
                        </div>



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
                                    </select> from {total} Campaigns</span>
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


            </div>
        </Layout>
    );
};

export default Html;

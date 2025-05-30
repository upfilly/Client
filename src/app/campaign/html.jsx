import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import datepipeModel from '@/models/datepipemodel';
import rolesModel from "@/models/role.model";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from 'next/navigation';
import methodModel from '../../methods/methods';


const Html = ({
    view,
    edit,
    reset,
    add,
    ChangeRole,
    ChangeStatus,
    sorting,
    pageChange,
    deleteItem,
    filters,
    loaging,
    data,
    statusChange,
    isAllow,
    total,
    setFilter,
    filter,
    user,
    getData,
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    const permission = (p) => {
        if (user && user?.permission_detail && p) {
            return user?.permission_detail[p]
        } else {
            return false
        }
    }

    const handleCountChange = (count) => {
        setFilter({ ...filters, count: count, page: 1 });
        getData({ count: count, page: 1 });
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Campaigns" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-end align-items-center">
                    {/* <SelectDropdown                                                     theme='search'
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="All Status"
                        intialValue={filters.status}
                        result={e => { ChangeStatus(e.value) }}
                        options={[
                            { id: 'pending', name: 'Pending' },
                            { id: 'accepted', name: 'Accepted' },
                            { id: 'rejected', name: 'Rejected' },
                        ]}
                    /> */}

                    <article className="d-flex filterFlex phView">
                        {permission('campaign_add') ? <>
                            <a className="btn btn-primary" onClick={e => add()}>
                                Add Campaign
                            </a>
                        </> : <></>}
                        {/* <div className='searchInput'>
                            <input
                                type="text"
                                value={filters.search}
                                placeholder="Search"
                                className="form-control"
                                onChange={(e)=>e.target.value==""?reset(): setFilter({ search: e.target.value })}
                                onKeyPress={handleKeyPress}
                            />
                            <i class="fa fa-search search_fa" onClick={() => {
                                filter()
                            }} aria-hidden="true"></i>
                        </div> */}




                        {/* {!role ? <SelectDropdown                                                     theme='search'
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="All User"
                                    intialValue={filters.role}
                                    result={e => { ChangeRole(e.value) }}
                                    options={rolesModel.list}
                                />: <></>} */}


                        {filters.status ? <>
                            <a className="btn btn-primary" onClick={e => reset()}>
                                Reset
                            </a>
                        </> : <></>}
                    </article>


                </div>

                <div className='table_section'>
                    <div className="table-responsive ">

                        <table className="table table-striped table-width">
                            <thead className='table_head'>
                                <tr className='heading_row'>
                                    <th scope="col" className='table_data' onClick={e => sorting('name')}>Name{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('event_type')}>Event Type{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    <th scope="col" className='table_data'>Access Type</th>
                                    <th scope="col" className='table_data'>Commission</th>
                                    <th scope="col" className='table_data'>Currency</th>
                                    <th scope="col" className='table_data'>Status</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {/* <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                                    <th scope="col" className='table_data'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats' onClick={e => view(itm.id || itm._id)}>

                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm.name)}
                                                    </h4>
                                                </div>
                                            </div></td>
                                        <td className='table_dats'>

                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {itm?.event_type.map((itm) => itm).join(",")}
                                                    </h4>
                                                </div>
                                            </div></td>
                                        <td className='table_dats'>{itm?.access_type}</td>
                                        <td className='table_dats'>{itm?.commission || "--"} {itm?.commission_type == "percentage" ? "%" : "$"}</td>
                                        {/* {<td className='table_dats'>   <div className={`user_hours`}>
                                            <span className={itm?.access_type == "private" ? itm?.status == "accepted" ? 'contract' : itm?.status == "pending" ? 'pending_status' : 'inactive' : ""}
                                            >
                                                {itm?.access_type == "private" ? itm.status : "--"}
                                            </span>
                                        </div></td>} */}
                                        <td className='table_dats'>{itm?.currencies || "--"}</td>
                                        <td className='table_dats'>   <span className={`active_btn${itm?.status}`} onClick={() => statusChange(itm)}>
                                            <span className={itm?.status == 'deactive' ? "inactive" : "contract"}>
                                                {itm?.status == 'deactive' ? 'Inactive' : 'Active'}
                                            </span>
                                        </span></td>
                                        {/* <td className='table_dats'>{(itm?.commission == "0" || !itm?.commission) ? "No Commission Added" : "Added Commission"}</td> */}
                                        <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>

                                        {/* dropdown */}
                                        <td className='table_dats'>
                                            <div className="action_icons">
                                                {isAllow('editAdmins') && permission('campaign_edit') ? <>
                                                    <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm.id || itm._id)}>
                                                        <i className="material-icons edit" title="Edit">edit</i>
                                                    </a>
                                                </> : <></>}

                                                {isAllow('deleteAdmins') && permission('campaign_delete') ? <>
                                                    <a className='edit_icon edit-delete' onClick={itm?.status == "accepted" ? "" : () => deleteItem(itm.id || itm._id)}>
                                                        <i className={`material-icons ${itm?.status == "accepted" ? 'delete' : 'diabled'}`} title='Delete'>delete</i>
                                                    </a>
                                                </> : <></>}

                                                {permission('campaign_edit') && <>
                                                    <a className='edit_icon action-btn' onClick={() => {
                                                        history.push(`/chat`)
                                                        // localStorage.setItem("chatId", itm?.affiliate_id)
                                                    }}>
                                                        <i className='fa fa-comment-o text-white'></i>
                                                    </a>
                                                </>}
                                            </div>
                                        </td>

                                    </tr>

                                })
                                }
                            </tbody>
                        </table>
                        {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}
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
        </Layout>
    );
};

export default Html;

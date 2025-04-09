import datepipeModel from '@/models/datepipemodel';
import React from 'react';
import SelectDropdown from '../components/common/SelectDropdown';
import methodModel from '../../methods/methods';
import ReactPaginate from 'react-paginate';
import Layout from '../components/global/layout';

const Html = ({
    filter,
    view,
    reset,
    add,
    ChangeStatus,
    statusChange,
    pageChange,
    filters,
    loaging,
    sorting,
    data,
    total,
    setFilter,
    user,
    edit,
    deleteItem,
    ChangeRole,
}) => {

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    const permission=(p)=>{
        if (user && user?.permission_detail && p) {
            return user?.permission_detail[p]
        }else{
            return false
        }
    }

    return (
        <>
            <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Users" filters={filters} >

                <div className='nmain-list main_box '>
                    <div className='container-fluid'>
                        <div className='row '>
                            <div className='col-lg-12 '>
                                <div className=" all_bxbtns flex-wrap  gap-2 d-flex filterFlex phView align-items-center   justify-content-end">
                                    <SelectDropdown                                                     theme='search'
                                        id="statusDropdown" className=" "
                                        displayValue="name"
                                        placeholder="All Status"
                                        intialValue={filters?.status}
                                        result={e => { ChangeStatus(e.value) }}
                                        options={[
                                            { id: 'active', name: 'Active' },
                                            { id: 'deactive', name: 'Inactive' },
                                        ]}
                                    />

                                    <SelectDropdown                                                     theme='search'
                                        id="statusDropdown" 
                                        className=" "
                                        displayValue="name"
                                        placeholder="All Role"
                                        intialValue={filters?.role}
                                        result={e => { ChangeRole(e.value) }}
                                        options={[
                                            { id: 'super_user', name: 'Super User' },
                                            { id: 'operator', name: 'Operator' },
                                            { id: 'analyzer', name: 'Analyzer' },
                                            { id: 'publisher', name: 'Publisher' },
                                        ]}
                                    />

                                    {(user?.role == 'brand' || user?.role == 'affiliate' ||  permission("user_add")) && <> <a className="btn btn-primary add_users " onClick={e => add()}>
                                        <i className='fa fa-plus mr-1'></i> Add user
                                    </a></>}

                                    {filters?.status ? <>
                                        <a className="btn btn-primary reset-same" onClick={e => reset()}>
                                            Reset
                                        </a>
                                    </> : <></>}
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-lg-12'>
                                <div className='table_section mt-3'>
                                    <div className="table-responsive ">
                                        <table className="table table-striped">
                                            <thead className='table_head'>
                                                <tr className='heading_row'>
                                                    <th onClick={e => sorting('fullName')} scope="col" className='table_data'>Name {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                    <th onClick={e => sorting('role')} scope="col" className='table_data'>Role {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                    <th onClick={e => sorting('status')} scope="col" className='table_data'>Account Status {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                    {/* <th onClick={e => sorting('istrusted')} scope="col" className='table_data'>Trusted {filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                                                    <th onClick={e => sorting('createdAt')} scope="col" className='table_data'>Creation Date {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                    <th onClick={e => sorting('updatedAt')} scope="col" className='table_data'>Last Modified {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                    {permission("user_edit") && <th>Action</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {!loaging && data && data.map((itm, i) => {
                                                    return <tr className='data_row' key={i}>
                                                        <td className='table_dats' onClick={e => view(itm?.user_id)}>
                                                            <div className='user_detail' onClick={e => view(itm?.id)}>
                                                                <img src={methodModel.userImg(itm?.image)} className="user_imgs" />
                                                                <div className=''>
                                                                    <h4 className='user'>
                                                                        {methodModel?.capitalizeFirstLetter(itm?.firstName)}
                                                                    </h4>
                                                                    <p className='user_info'>
                                                                        {itm?.email}
                                                                    </p>
                                                                </div>
                                                            </div></td>
                                                        <td>{methodModel?.capitalizeFirstLetter(itm?.role)}</td>
                                                        <td className='table_dats'>   <span className={`active_btn${itm?.status}`}
                                                         onClick={() => statusChange(itm)}
                                                         >
                                                            <span className={itm?.status == 'deactive' ? "inactive" : "contract"}>
                                                                {itm?.status == 'deactive' ? 'Inactive' : 'Active'}
                                                            </span>
                                                        </span></td>
                                                        <td className='table_dats'>{datepipeModel.date(itm?.createdAt)}</td>
                                                        <td className='table_dats'>{datepipeModel.date(itm?.updatedAt)}</td>
                                                        <td>
                                                            {(user?.role == 'affiliate' || user?.role == 'brand' || user?.permission_detail?.user_edit) &&
                                                                <div className='action_icons'>
                                                                    {permission("user_edit") && <a className='edit_icon edit-main' title="Edit" onClick={itm.status == "deactive" ? null : (e) => edit(itm.user_id)} >

                                                                        <i className={`material-icons edit ${itm.status == "deactive" ? 'disabled' : ''}`} title="Edit">edit</i>
                                                                    </a>}

                                                                    {(user?.role == 'affiliate' || user?.role == 'brand' || permission("user_delete")) &&<a className='edit_icon' onClick={() => deleteItem(itm.user_id)}>
                                                                        <i className={`material-icons delete`} title='Delete'> delete</i>
                                                                    </a>}
                                                                    {/* <a className='edit_icon action-btn' onClick={() => {
                                                                        history.push(`/chat`)
                                                                        localStorage.setItem("chatId", user?.role != 'affiliate' ? itm?._id || itm?.id : itm?.addedBy)
                                                                    }}>
                                                                        <i className='fa fa-comment-o text-white'></i>
                                                                    </a> */}

                                                                </div>}

                                                        </td>
                                                    </tr>

                                                })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}
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

                {loaging ? <div className="text-center py-4">
                    <img src="/assets/img/loader.gif" className="pageLoader" />
                </div> : <></>}
            </Layout>
        </>
    );
};

export default Html;

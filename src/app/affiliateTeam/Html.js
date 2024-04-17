import datepipeModel from '@/models/datepipemodel';
import React from 'react';
import SelectDropdown from '../components/common/SelectDropdown';
import methodModel from '@/methods/methods';
import ReactPaginate from 'react-paginate';
import Layout from '../components/global/layout';

const Html = ({
    filter,
    view,
    edit,
    reset,
    add,
    ChangeStatus,
    statusChange,
    pageChange,
    deleteItem,
    filters,
    loaging,
    sorting,
    data,
    total,
    setFilter,
    user,
    history,
}) => {

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    return (
        <>
            <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Affiliates" filters={filters} >

                <div className='nmain-list '>
                    <div className='row mx-0'>
                        <div className='col-lg-12'>
                            <div className="d-flex filterFlex phView align-items-center   justify-content-end">
                               {user?.role != 'team' && <> <a className="btn btn-primary ms-2 " onClick={e => add()}>
                                    <i className='fa fa-plus mr-1'></i> Add
                                </a></>}
                                <SelectDropdown
                                    id="statusDropdown" className="mr-2 "
                                    displayValue="name"
                                    placeholder="All Status"
                                    intialValue={filters?.status}
                                    result={e => { ChangeStatus(e.value) }}
                                    options={[
                                        { id: 'active', name: 'Active' },
                                        { id: 'deactive', name: 'Inactive' },
                                    ]}
                                />

                                {filters?.status  ? <>
                                    <a className="btn btn-primary  ml-2 reset-same" onClick={e => reset()}>
                                        Reset
                                    </a>
                                </> : <></>}
                            </div>
                        </div>
                    </div>

                    <div className='row mx-0'>
                        <div className='col-lg-12'>

                            <div className="table-responsive table_section mt-3">

                                <table className="table table-striped">
                                    <thead className='table_head'>
                                        <tr className='heading_row'>
                                            <th onClick={e => sorting('fullName')} scope="col" className='table_data'>Name {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th onClick={e => sorting('role')} scope="col" className='table_data'>Role {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th onClick={e => sorting('status')} scope="col" className='table_data'>Account Status {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            {/* <th onClick={e => sorting('istrusted')} scope="col" className='table_data'>Trusted {filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                                            <th onClick={e => sorting('createdAt')} scope="col" className='table_data'>Creation Date {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th onClick={e => sorting('updatedAt')} scope="col" className='table_data'>Last Modified {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!loaging && data && data.map((itm, i) => {
                                            return <tr className='data_row' key={i}>
                                                <td className='table_dats' onClick={e => view(itm?.id)}>
                                                    <div className='user_detail' onClick={e => view(itm?.id)}>
                                                        <img src={methodModel.userImg(itm?.image)} className="user_imgs" />
                                                        <div className='user_name'>
                                                            <h4 className='user'>
                                                                {methodModel?.capitalizeFirstLetter(itm?.fullName)}
                                                            </h4>
                                                            <p className='user_info'>
                                                                {itm?.email}
                                                            </p>
                                                        </div>
                                                    </div></td>
                                                    <td>{methodModel?.capitalizeFirstLetter(itm?.role)}</td>
                                                <td className='table_dats'>   <span className={`active_btn${itm?.status}`} onClick={() => statusChange(itm)}>
                                                    <span className={itm?.status == 'deactive' ? "inactive" : "contract"}>
                                                        {itm?.status == 'deactive' ? 'Inactive' : 'Active'}
                                                    </span>
                                                </span></td>
                                                <td className='table_dats'>{datepipeModel.date(itm?.createdAt)}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm?.updatedAt)}</td>
                                                <td>
                                                   {user?.role != 'team'  && <div className='action_icons'> <a className='edit_icon edit-main' title="Edit" onClick={itm.status == "deactive" ? null : (e) => edit(itm.id)} >

                                                        <i className={`material-icons edit ${itm.status == "deactive" ? 'disabled' : ''}`} title="Edit">edit</i>
                                                    </a>

                                                        <a className='edit_icon' onClick={() => deleteItem(itm.id)}>
                                                            <i className={`material-icons delete`} title='Delete'> delete</i>
                                                        </a></div>}
                                                    <a className='edit_icon action-btn' onClick={() => {
                                                        history.push(`/chat`)
                                                        localStorage.setItem("chatId", user?.role == 'affiliate' ? itm?._id || itm?.id : itm?.addedBy)
                                                    }}>
                                                        <i className='fa fa-comment-o text-white'></i>
                                                    </a>
                                                </td>
                                            </tr>

                                        })
                                        }
                                    </tbody>
                                </table>


                            </div>

                        </div>
                    </div>
                </div>



                {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

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

                {loaging ? <div className="text-center py-4">
                    <img src="/assets/img/loader.gif" className="pageLoader" />
                </div> : <></>}
            </Layout>
        </>
    );
};

export default Html;

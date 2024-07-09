import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from 'next/navigation';

const Html = ({
    view,
    edit,
    reset,
    add,
    user,
    ChangeStatus,
    sorting,
    pageChange,
    deleteItem,
    filters,
    loaging,
    data,
    isAllow,
    total,
    setFilter,
    filter,
    statusChange,
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Coupons" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-end gap-2 flex-wrap align-items-center all_flexbx">
                    {/* <SelectDropdown
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
                        {user?.role == "brand" && <>
                            <a className="btn btn-primary mb-0 set_reset" onClick={e => add()}>
                                Add Coupon
                            </a>
                        </>}
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




                        {/* {!role ? <SelectDropdown
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
            <th scope="col" className='table_data' >Coupon Code</th>
            <th scope="col" className='table_data' >Coupon Type</th>
            <th scope="col" className='table_data' >Visibility</th>
            <th scope="col" className='table_data' >Expiration Date</th>
            {/* <th scope="col" className='table_data' onClick={e => sorting('brand_id')}>{user?.role == "brand" ? "Affiliate" : "Brand"}{filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
            <th scope="col" className='table_data'>Status</th>
            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            {user?.role == 'brand' && <th scope="col" className='table_data'>Action</th>}
        </tr>
    </thead>
    <tbody>
        {!loaging && data && data.map((itm, i) => {
            return <tr className='data_row' key={i}>
                <td className='table_dats' onClick={e => view(itm.id || itm?._id)}>

                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {methodModel.capitalizeFirstLetter(itm.couponCode)}
                            </h4>
                        </div>
                    </div></td>
                <td className='table_dats'>

                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {methodModel.capitalizeFirstLetter(itm?.couponType)}
                            </h4>
                        </div>
                    </div></td>
                <td className='table_dats'>
                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {methodModel.capitalizeFirstLetter(itm?.visibility)}
                            </h4>
                        </div>
                    </div></td>
                    <td className='table_dats'>
                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {datepipeModel.date(itm.expirationDate)}
                            </h4>
                        </div>
                    </div></td>
                <td className='table_dats'>   <div className={`user_hours`}>
                    <span className={itm?.status == "accepted" ? 'contract' : itm?.status == "pending" ? 'pending_status' : 'inactive'}
                    >
                        {itm.status}
                    </span>
                </div></td>
                <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>

                {/* dropdown */}
                <td className='table_dats'>
                    <div className="action_icons gap-3 ">
                        {/* {user?.role == 'brand' && <>{itm?.status == 'pending' ? <div >
                            <button onClick={() => {
                                statusChange("accepted", itm?.id || itm?._id)
                            }} className="btn btn-primary mr-2 ml-3">
                                <i className='fa fa-check'></i>
                            </button>
                            <button onClick={() => statusChange("rejected", itm?.id || itm?._id)} className="btn btn-danger br50 bg-red mr-2">
                                <i className='fa fa-times'></i>
                            </button>
                        </div> :
                            itm?.status == 'rejected' ?
                                <div className="btn btn-primary mr-2">Rejected</div> :
                                <div className="btn btn-primary mr-2">Accepted</div>
                        }</>} */}
                        {user?.role == 'brand' && <>
                            <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm.id || itm?._id)}>
                                <i className="material-icons edit" title="Edit">edit</i>
                            </a>
                            <a className='edit_icon edit-delete' onClick={itm?.status == "accepted" ? "" : () => deleteItem(itm.id || itm?._id)}>
                                <i className={`material-icons ${itm?.status == "accepted" ? 'delete' : 'diabled'}`} title='Delete'> delete</i>
                            </a>
                        </>
                        }

                        {/* <>
                            <a className='edit_icon action-btn' onClick={() => {
                                history.push(`/chat`)
                                localStorage.setItem("chatId", user?.role == 'brand' ? itm?.affiliate_id : itm?.brand_id)
                            }}>
                                <i className='fa fa-comment-o text-white'></i>
                            </a>
                        </> */}
                    </div>
                </td>

            </tr>

        })
        }
    </tbody>
</table>
{!loaging && total == 0 ? <div className="py-3 text-center">No Coupon Found</div> : <></>}
</div>
                </div>

               

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
            </div>
        </Layout>
    );
};

export default Html;

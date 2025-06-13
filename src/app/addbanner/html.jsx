import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '../../methods/methods';
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
    getData
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    // console.log(data,"dhsjghgfj")

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
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Banners" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-end gap-2 flex-wrap align-items-center all_flexbx">
                    <SelectDropdown                                                     theme='search'
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="All Status"
                        intialValue={filters.status}
                        result={e => { ChangeStatus(e.value) }}
                        options={[
                            { id: 'active', name: 'Active' },
                            { id: 'deactive', name: 'Inactive' },
                            // { id: 'pending', name: 'Pending' },
                            // { id: 'accepted', name: 'Accepted' },
                            // { id: 'rejected', name: 'Rejected' },
                        ]}
                    />

                    <article className="d-flex filterFlex phView">
                        {(user?.role == "brand" || permission('banner_add')) && <>
                            <a className="btn btn-primary mb-0 set_reset" onClick={e => add()}>
                                Add Banner
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
                                    <th scope="col" className='table_data' onClick={e => sorting('title')}>Title{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    <th scope="col" className='table_data' >Brand Name</th>
                                    <th scope="col" className='table_data' >SEO Attributes</th>
                                    <th scope="col" className='table_data'>Expiration Date</th>
                                    <th scope="col" className='table_data'>Activation Date</th>
                                    <th scope="col" className='table_data'>Availability Date</th>
                                    <th scope="col" className='table_data'>Status</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {user?.role == "brand" && <th scope="col" className='table_data'>Action</th>}

                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats inline_bx' onClick={e => view(itm.id || itm?._id)}>
                                            <img src={methodModel.userImg(itm?.image)} className="user_imgs" />
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm.title)}
                                                    </h4>
                                                </div>
                                            </div></td>
                                            <td className='table_dats'>
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm?.addedBy_details?.fullName)}
                                                    </h4>
                                                </div>
                                            </div></td>
                                        <td className='table_dats'>{itm.seo_attributes || "--"}</td>
                                        {/* <td className='table_dats'>{itm.seo_attributes}</td> */}
                                        <td className='table_dats'>{datepipeModel.date(itm.expiration_date)}</td>
                                        <td className='table_dats'>{datepipeModel.date(itm.activation_date)}</td>
                                        <td className='table_dats'>{datepipeModel.date(itm.availability_date)}</td>
                                        <td className='table_dats'>   <div className={`user_hours`}>
                                            <span className={itm?.status == "accepted" ? 'contract' : itm?.status == "pending" ? 'pending_status' : 'inactive'}
                                            >
                                                {itm.status}
                                            </span>
                                        </div></td>
                                        <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>

                                        {/* dropdown */}
                                        {(user?.role == "brand" || permission('banner_edit')) && <td className='table_dats'>
                                            <div className="action_icons gap-3 ">
                                                {<>{isAllow('editAdmins') ? <>
                                                    <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm.id || itm?._id)}>
                                                        <i className="material-icons edit " title="Edit">edit</i>
                                                    </a>
                                                </> : <></>}

                                                    {isAllow('deleteAdmins') && permission('banner_delete') ? <>
                                                        <a className='edit_icon edit-delete' onClick={() => deleteItem(itm.id || itm?._id)}>
                                                            <i className={`material-icons delete`} title='Delete'> delete</i>
                                                        </a>
                                                    </> : <></>}
                                                </>}
                                                <>
                                                </>
                                            </div>
                                        </td>}

                                    </tr>

                                })
                                }
                            </tbody>
                        </table>
                        {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}
                    </div>
                </div>



                <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
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
                                    </select> from {total} Banners</span>
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

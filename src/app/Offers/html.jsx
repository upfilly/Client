import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';
import rolesModel from "@/models/role.model";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from 'next/navigation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Html = ({
    view,
    edit,
    reset,
    add,
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
    statusChange,dateRange, setDateRange,startDate, endDate ,user
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Add Offers" filters={filters}>
        
        
            <div className='sidebar-left-content main_box '>
                <div className="d-flex justify-content-between align-items-center flex-wrap all_flexbx gap-2">
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <SelectDropdown
                                id="statusDropdown"
                                displayValue="name"
                                placeholder="All Status"
                                intialValue={filters.status}
                                result={e => { ChangeStatus(e.value) }}
                                options={[
                                    { id: 'active', name: 'Active' },
                                    { id: 'deactive', name: 'Inactive' },
                                    // { id: 'rejected', name: 'Rejected' },
                                ]}
                            />

                    

                        

                       <div className="d-flex gap-2  cal_search">
                       <DatePicker
                                showIcon
                                className="form-control"
                                monthsShown={2}
                                shouldCloseOnSelect={true}
                                selectsRange={true}
                                placeholderText="Select Date Range"
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange([update[0], update[1]])
                                }}
                                isClearable
                                // minDate={new Date()}
                                withPortal
                                dateFormat={"dd/MM/yyyy"}
                            />

                               
                        <div className='searchInput ml-0'>
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
                        </div>
                       </div>
                          


                        {filters.status ? <>
                            <a className="btn btn-primary " onClick={e => reset()}>
                                Reset
                            </a>
                        </> : <></>}
                        </div>
                   
                     

                        {user?.role == 'affiliate' ||  user?.permission_detail?.offer_add ? <>
                                <a className="btn btn-primary set_reset" onClick={e => add()}>
                                    <i className='fa fa-plus mr-1'></i>  Add Offers
                                </a>
                            </> : <></>}
                

                  
                </div>

               <div className="table_section">
               <div className="table-responsive ">

<table className="table table-striped table-width">
    <thead className='table_head'>
        <tr className='heading_row'>
            <th scope="col" className='table_data' onClick={e => sorting('name')}>Name{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            <th scope="col" className='table_data'>Price ($)</th>
            <th scope="col" className='table_data'>Status</th>
            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            <th scope="col" className='table_data'>Action</th>

        </tr>
    </thead>
    <tbody>
        {!loaging && data && data.map((itm, i) => {
            return <tr className='data_row' key={i}>
                <td className='table_dats' onClick={e => view(itm.id)}>
                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {methodModel.capitalizeFirstLetter(itm.name)}
                            </h4>
                        </div>
                    </div></td>
                <td className='table_dats'>{itm?.price}</td>
                <td className='table_dats'>   <div className={`user_hours`}>
                    <span className={itm?.status == "active" ? 'contract capital' : itm?.status == "pending" ? 'pending_status' : 'inactive'}
                        onClick={() => statusChange(itm)}
                    >
                        {itm.status}
                    </span>
                </div></td>
                <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
                {/* dropdown */}
                <td className='table_dats'>
                    <div className="action_icons">
                        {isAllow('editAdmins') || user?.permission_detail?.offer_edit ? <>
                            <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm.id)}>
                                <i className="material-icons edit" title="Edit">edit</i>
                            </a>
                        </> : <></>}

                        {isAllow('deleteAdmins') || user?.permission_detail?.offer_delete  ? <>
                            <a className='edit_icon edit-delete' onClick={itm?.status == "accepted" ? "" : () => deleteItem(itm.id)}>
                                <i className={`material-icons ${itm?.status == "accepted" ? 'delete' : 'diabled'}`} title='Delete'> delete</i>
                            </a>
                        </> : <></>}
                    </div>
                </td>

            </tr>

        })
        }
    </tbody>
</table>
</div>
               </div>

                {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}

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

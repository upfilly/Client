import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';
import rolesModel from "@/models/role.model";
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from 'next/navigation';


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
    role,
    isAllow,
    total,
    setFilter,
    filter,
    user
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

     const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          filter();
        }
      };
    
    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="E-mail" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-end align-items-center">
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

                   {user?.role != 'affiliate' && <article className="d-flex filterFlex phView">
                        {isAllow('addAdmins') ? <>
                            <a className="btn btn-primary" onClick={e => add()}>
                                Add Email 
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
                    </article>}


                </div>

                <div className='table_section'>
                <div className="table-responsive ">

<table className="table table-striped table-width">
    <thead className='table_head'>
        <tr className='heading_row'>
            <th scope="col" className='table_data' onClick={e => sorting('name')}>Template Name{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            <th scope="col" className='table_data' onClick={e => sorting('event_type')}>Email Name{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            <th scope="col" className='table_data'>Subject</th>
            <th scope="col" className='table_data'>Purpose</th>
            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            {/* <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
            {user?.role != "affiliate" && <th scope="col" className='table_data'>Action</th>}
        </tr>
    </thead>
    <tbody>
        {!loaging && data && data.map((itm, i) => {
            return <tr className='data_row' key={i}>
                <td className='table_dats' onClick={e => view(user?.role == 'affiliate' ? itm?.emailtemplate_details?._id : itm._id)}>

                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {user?.role == "affiliate" ?  methodModel.capitalizeFirstLetter(itm?.emailtemplate_details?.templateName) : methodModel.capitalizeFirstLetter(itm.templateName)}
                            </h4>
                        </div>
                    </div></td>
                <td className='table_dats'>

                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {user?.role == "affiliate" ?  itm?.emailtemplate_details?.emailName  : itm?.emailName}
                            </h4>
                        </div>
                    </div></td>
                    <td className='table_dats'>{user?.role == "affiliate" ?  itm?.emailtemplate_details?.subject : itm?.subject}</td>
                <td className='table_dats'>   <div className={`user_hours`}>
                    <span className= ''
                    >{user?.role == "affiliate" ? itm?.emailtemplate_details?.purpose : itm?.purpose}</span>
                </div></td>
                <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
                {/* <td className='table_dats'>{datepipeModel.date(itm.updatedAt)}</td> */}

                {/* dropdown */}
               {user?.role != "affiliate" && <td className='table_dats'>
                    <div className="action_icons">
                        {isAllow('editAdmins') ? <>
                            <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm._id)}>
                                <i className="material-icons edit" title="Edit">edit</i>
                            </a>
                        </> : <></>}

                        {isAllow('deleteAdmins') ? <>
                            <a className='edit_icon edit-delete' onClick={itm?.status=="accepted" ? "" : () => deleteItem(itm.id || itm?._id)}>
                                <i className={`material-icons ${itm?.status=="accepted" ? 'delete' : 'diabled'}`} title='Delete'> delete</i>
                            </a>
                        </> : <></>}
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
                    <span>Show {data?.length} from {total} Users</span>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        initialPage={filters?.page}
                        onPageChange={pageChange}
                        pageRangeDisplayed={6}
                      // pageCount={Math.ceil(total / filters?.count)}
          pageCount={2}
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

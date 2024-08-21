import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';

const Html = ({
    view,
    reset,
    pageChange,
    filters,
    loaging,
    data,
    total,
    filter,
    sorting,
    setFilter,
    user,
    statusChange
}) => {
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Proposals" filters={filters}>
            <div className='sidebar-left-content'>

                <div className='card'>

                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="">
                                Proposals
                            </h3>

                            <article className="d-flex filterFlex phView">
                                {/* <div className='searchInput'>
                            <input
                                type="text"
                                value={filters.search}
                                placeholder="Search"
                                className="form-control"
                                onChange={(e) => e.target.value == "" ? reset() : setFilter({ search: e.target.value ,brand_id:user.id})}
                                onKeyPress={handleKeyPress}
                            />
                            <i class="fa fa-search search_fa" onClick={() => {
                                filter()
                            }} aria-hidden="true"></i>
                        </div> */}

                                {/* <SelectDropdown
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="All Status"
                                    intialValue={filters.status}
                                    result={e => { ChangeStatus(e.value) }}
                                    options={[
                                        {id:'active',name:'Active'},
                                        {id:'deactive',name:'Deactive'},
                                    ]}
                                />


                  
                    {!role ? <SelectDropdown
                                    id="statusDropdown"
                                    displayValue="name"
                                    placeholder="All User"
                                    intialValue={filters.role}
                                    result={e => { ChangeRole(e.value) }}
                                    options={rolesModel.list}
                                />: <></>} */}


                                {/* {filters.search ? <>
                                    <a className="btn btn-primary" onClick={e => reset()}>
                                        Reset
                                    </a>
                                </> : <></>} */}
                            </article>

                        </div>
                    </div>

                    <div className='card-body'>
                        <div className='propos_data'>
                           <div className='table_section mt-0' >
                           <div className="table-responsive ">

<table className="table table-striped">
    <thead className='table_head'>
        <tr className='heading_row'>
            <th scope="col" class="table_data" onClick={e => sorting('addedBy_name')}>Sender Name{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            {user?.role == "affiliate" && <th scope="col" className='table_data'> Status</th>}
            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}</th>
            {/* <th scope="col" className='table_data'>Status</th> */}

        </tr>
    </thead>
    <tbody>
        {!loaging && data && data.map((itm, i) => {
            return <tr className='data_row' key={i}>
                <td className='table_dats' onClick={e => view(itm.id)}>

                    <div className='user_detail'>
                        <div className='user_name'>
                            <h4 className='user'>
                                {methodModel.capitalizeFirstLetter(itm?.addedBy_name)}
                            </h4>
                        </div>
                    </div></td>
                {user?.role == "affiliate" && <td className='table_dats'>{itm?.status}</td>}
                <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
                <td className='table_dats'>{datepipeModel.date(itm.updatedAt)}</td>

                {user.role == "brand" && <td className='table_dats'>
                    {itm?.status == 'pending' ? <div >
                        <button onClick={() => statusChange("accepted", itm?.id)} className="btn btn-primary">
                            Accept
                        </button>
                        <button onClick={() => statusChange("rejected", itm?.id)} className="btn btn-primary ms-2">
                            Deny
                        </button>
                    </div> :
                        itm?.status == 'rejected' ?
                            <div className="btn btn-primary">Rejected</div> :
                            <div className="btn btn-primary">Accepted</div>
                    }
                </td>}

            </tr>

        })
        }
    </tbody>
</table>
{!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

</div>
                           </div>

                          

                            <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
                                <span>Show {data?.length} from {total} campaignManagement</span>
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
                    </div>


                </div>






            </div>
        </Layout>
    );
};

export default Html;

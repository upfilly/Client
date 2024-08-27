import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '../../methods/methods';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';

const Html = ({
    view,
    reset,
    statusChange,
    pageChange,
    filters,
    loaging,
    data,
    total,
    filter,
    sorting,
    sendProposal,
    setFilter,
    Tracklogin,
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };
    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Campaigns" filters={filters}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="">
                                Campaign Management
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


                        <div className='table_section mt-0'>
                            <div className="table-responsive ">

                                <table className="table table-striped  ">
                                    <thead className='table_head'>
                                        <tr className='heading_row'>
                                            <th scope="col" class="table_data" onClick={e => sorting('name')}>Name{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th scope="col" className='table_data' onClick={e => sorting('event_type')}>Event Type{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th scope="col" className='table_data' >Amount($)</th>
                                            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                            <th scope="col" className='table_data'>Actions</th>
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
                                                <td className='table_dats'>{itm?.event_type.map((itm) => itm).join(",")}</td>
                                                <td className='table_dats'>{itm?.amount}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm.updatedAt)}</td>

                                                <td className='table_dats d-flex '>
                                                    {itm?.status == 'pending' ? <div >
                                                        <button onClick={() => {
                                                            statusChange("accepted", itm?.id)
                                                            Tracklogin(itm?.campaign_unique_id)
                                                        }} className="btn btn-primary mr-2">
                                                            <i className='fa fa-check'></i>
                                                        </button>
                                                        <button onClick={() => statusChange("rejected", itm?.id)} className="btn btn-danger br50 bg-red mr-2">
                                                            <i className='fa fa-times'></i>
                                                        </button>
                                                    </div> :
                                                        itm?.status == 'rejected' ?
                                                            <div className="btn btn-primary">Rejected</div> :
                                                            <div className="btn btn-primary">Accepted</div>
                                                    }
                                                    <>
                                                        <span className='btn btn-primary ml-2'
                                                            onClick={() => {
                                                                history.push(`/chat`)
                                                                localStorage.setItem("chatId", itm?.brand_id)
                                                            }}>
                                                            <i className='fa fa-comment-o'></i>
                                                        </span>
                                                    </>

                                                    {/* {itm?.status == 'accepted' &&
                <button onClick={() => sendProposal(itm?.brand_id)} className="btn btn-primary ms-2">
                    Send Proposal
                </button>} */}

                                                </td>

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
                    </div>
                </div>


            </div>
        </Layout>
    );
};

export default Html;

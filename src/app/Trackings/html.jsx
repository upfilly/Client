import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';
import './style.scss';

const Html = ({
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
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };
    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name={"Tracking"} filters={filters}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="">
                                Tracking Customer
                            </h3>

                            <article className="d-flex filterFlex phView">
                                <div className='searchInput'>
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
                                </div>

                                {/* <SelectDropdown
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
                                /> */}


                                {filters.search ? <>
                                    <a className="btn btn-primary" onClick={e => reset()}>
                                        Reset
                                    </a>
                                </> : <></>}
                            </article>
                        </div>
                    </div>
                    <div className='card-body'>


                        <div className="table-responsive table_section mt-0">

                            <table className="table table-striped  ">
                                <thead className='table_head'>
                                    <tr className='heading_row'>
                                        <th scope="col" class="table_data" >Customer Type</th>
                                        <th scope="col" className='table_data' >Clicks</th>
                                        <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                        <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>Last Modified{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loaging && data && data.map((itm, i) => {
                                        return <tr className='data_row' key={i}>
                                            <td className='table_dats'>
                                                <div className='user_detail'>
                                                    <div className='user_name'>
                                                        <h4 className='user'>
                                                            {itm?.type == 'returning_customer' ? 'Returning Customer' : 'New Customer'}
                                                        </h4>
                                                    </div>
                                                </div></td>
                                            <td className='table_dats'>{itm?.clicks}</td>
                                            {user && user?.role == "brand" && <td className={itm?.status == 'deactive' ? "inactive" : "contract"}>{itm?.status}</td>}
                                            <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
                                            <td className='table_dats'>{datepipeModel.date(itm.updatedAt)}</td>

                                        </tr>

                                    })
                                    }
                                </tbody>
                            </table>


                        </div>

                        {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

                        <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
                            <span>Show {data?.length} from {total} Customers</span>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="next >"
                                initialPage={filters?.page}
                                onPageChange={pageChange}
                                pageRangeDisplayed={6}
                                pageCount={Math.ceil(total / filters?.count)}
                                previousLabel="< previous"
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

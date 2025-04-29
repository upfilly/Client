import React, { useState, useEffect } from 'react';
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
    getData,
    setFilter,
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false);


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    const handleCountChange = (count) => {
        setFilter({ ...filters, count: count, page: 1 });
        getData({ count: count, page: 1 });
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Campaigns" filters={filters}>
            <div className='sidebar-left-content'>
                <div className='card'>
                    <div className='card-header'>
                        <div className="main_title_head d-flex justify-content-between align-items-center">
                            <h3 className="">
                                Campaign Request
                            </h3>

                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='table_section mt-0'>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className='table_head'>
                                        <tr className='heading_row'>
                                            <th scope="col" className="table_data" onClick={e => sorting('name')}>
                                                Name {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className='table_data'>
                                                Event Type
                                            </th>
                                            <th scope="col" className='table_data'>Commission</th>
                                            <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>
                                                Created Date {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className='table_data' onClick={e => sorting('updatedAt')}>
                                                Last Modified {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className='table_data'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((itm, i) => (
                                            <tr className='data_row' key={i}>
                                                <td className='table_dats' onClick={e => view(itm.campaign_details?.id || itm?.campaign_details?._id)}>
                                                    <div className='user_detail'>
                                                        <div className='user_name'>
                                                            <h4 className='user'>
                                                                {methodModel.capitalizeFirstLetter(itm?.campaign_details?.name)}
                                                            </h4>

                                                        </div>
                                                    </div>
                                                </td>
                                                {itm?.campaign_details?.event_type && <td className='table_dats'>{itm?.campaign_details?.event_type.join(",")}</td>}
                                                <td className='table_dats'>{itm?.campaign_details?.commission || "--"} {itm?.campaign_details?.commission_type == "percentage" ? "%" : "$"}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm.campaign_details?.createdAt)}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm?.campaign_details?.updatedAt)}</td>
                                                <td className='table_dats d-flex align-items-center'>
                                                    {itm?.status === 'pending' ? (
                                                        <div className='d-flex align-items-center'>
                                                            <button onClick={() => statusChange("accepted", itm?.affiliate_id, itm?.id || itm?._id)} className="btn btn-primary mr-2 btn_actions">
                                                                <i className='fa fa-check'></i>
                                                            </button>
                                                            <button onClick={() => statusChange("rejected", itm?.affiliate_id, itm?.id || itm?._id)} className="btn btn-danger br50 bg-red mr-2 btn_actions">
                                                                <i className='fa fa-times'></i>
                                                            </button>
                                                        </div>
                                                    ) : itm?.status === 'rejected' ? (
                                                        <div className="btn btn-primary mr-2">Rejected</div>
                                                    ) : (
                                                        <div className="btn btn-primary mr-2">Accepted</div>
                                                    )}
                                                    <button className='btn btn-primary btn_actions'
                                                        onClick={() => {
                                                            history.push(`/chat`);
                                                            localStorage.setItem("chatId", itm?.brand_id);
                                                        }}>
                                                        <i className='fa fa-comment-o'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {(!loaging && total === 0) && <div className="py-3 text-center">No Data</div>}
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

                        {loaging && <div className="text-center py-4">
                            <img src="/assets/img/loader.gif" className="pageLoader" />
                        </div>}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Html

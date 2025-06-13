import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import './style.scss';
import datepipeModel from '@/models/datepipemodel';
import environment from '@/environment';

const Html = ({
    user,
    sorting,
    pageChange,
    filters,
    loaging,
    data,
    total,
    deleteItem
}) => {

    return (
        <div className='sidebar-left-content px-0 pt-4 '>
            <div className=" data_details ">
                <h3 className="data_title rise pl-4"> <i class="fa fa-database mr-2" aria-hidden="true"></i>
                    Sent Data</h3>

                <div className='px-2 pt-2'>
                    <div className="table-responsive ">

                        <table className="table table-striped table-width">
                            <thead className='table_head'>
                                <tr className='heading_row'>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Sent At{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {user?.role == 'brand' && <th scope="col" className='table_data'>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data?.slice(0,10).map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>

                                        {/* dropdown */}
                                        <td className='table_dats'>
                                            <div className="action_icons gap-3 ">
                                                <div className="hoverdonload ">
                                                    <a
                                                        href={itm.filePath ? `${environment?.api}${itm.filePath}` : itm.url}
                                                        download="document.pdf"
                                                    >
                                                        {" "}
                                                        <span className='edit_icon'>
                                                            <i className="fa fa-download"></i>{" "}
                                                        </span>
                                                        {/* <i className="fa fa-download"></i>{" "} */}

                                                    </a>

                                                </div>
                                                <span className='edit_icon' onClick={() => deleteItem(itm.id || itm._id)}>
                                                    <i className="material-icons delete" title='Delete'> delete</i>
                                                </span>
                                            </div>
                                        </td>

                                    </tr>

                                })
                                }
                            </tbody>
                        </table>
                        {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}
                    </div>
                </div>
            </div>




            {/* <div className={`paginationWrapper ${!loaging && total > 10 ? '' : 'd-none'}`}>
                <span>Show {data?.length} from {total} Emails</span>
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
            </div> */}

            {loaging ? <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" />
            </div> : <></>}
        </div>
    );
};

export default Html;

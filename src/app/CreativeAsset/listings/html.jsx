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
        <div className='sidebar-left-content'>
            <div className="row align-items-center">
                    <h3 className="text-center rise">Sended Data</h3>
            </div>
            <div className='table_section'>
                <div className="table-responsive ">

                    <table className="table table-striped table-width">
                        <thead className='table_head'>
                            <tr className='heading_row'>
                                <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Send At{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                {user?.role == 'brand' && <th scope="col" className='table_data'>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr className='data_row' key={i}>
                                    <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>

                                    {/* dropdown */}
                                    <td className='table_dats'>
                                        <div className="action_icons gap-3 ">
                                            <div className="hoverdonload ">
                                                <a
                                                    href={`${environment?.api}${itm.filePath}`}
                                                    download="document.pdf"
                                                >
                                                    {" "}
                                                    <i className="fa fa-download"></i>{" "}

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
    );
};

export default Html;

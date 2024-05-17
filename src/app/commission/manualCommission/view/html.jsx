import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';
import SelectDropdown from "@/app/components/common/SelectDropdown";
import { useRouter } from 'next/navigation';

const Html = ({
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
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    console.log(data, "dhsjghgfj")

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Commission" filters={filters}>
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
                        <>
                            <a className="btn btn-primary mb-0 set_reset" onClick={e => add()}>
                                Add Commission
                            </a>
                        </>

                        {/* {filters.status ? <>
                            <a className="btn btn-primary" onClick={e => reset()}>
                                Reset
                            </a>
                        </> : <></>} */}
                    </article>


                </div>

                <div className='table_section'>
                    <div className="table-responsive ">

                        <table className="table table-striped table-width">
                            <thead className='table_head'>
                                <tr className='heading_row'>
                                    <th scope="col" className='table_data' onClick={e => sorting('title')}>Click Ref{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    <th scope="col" className='table_data' >Commisssion Type</th>
                                    <th scope="col" className='table_data' >Affiliate</th>
                                    <th scope="col" className='table_data'>Amount of Sale</th>
                                    <th scope="col" className='table_data'>Amount of Commission</th>
                                    <th scope="col" className='table_data'>Order Reference</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {/* <th scope="col" className='table_data'>Action</th> */}

                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats'
                                        // onClick={e => view(itm.id || itm?._id)}
                                        >
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {itm?.click_ref || "--"}
                                                    </h4>
                                                </div>
                                            </div></td>
                                        <td className='table_dats'>{itm?.commission_type || "--"}</td>
                                        <td className='table_dats'>{itm?.affiliate_name || "--"}</td>
                                        <td className='table_dats'>{itm?.amount_of_sale || "--"}</td>
                                        <td className='table_dats'>{itm?.amount_of_commission || "--"}</td>
                                        <td className='table_dats'>{itm?.order_reference || "--"}</td>
                                        <td className='table_dats'>{datepipeModel.date(itm?.createdAt)}</td>
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

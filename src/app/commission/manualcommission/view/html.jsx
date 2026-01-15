import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';
import methodModel from '../../../../methods/methods';
import SelectDropdown from '@/app/components/common/SelectDropdown';

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
    user,
    affiliateData,
    ChangeAffiliateStatus,
    getData
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const permission=(p)=>{
        if (user && user?.permission_detail && p) {
            return user?.permission_detail[p]
        }else{
            return false
        }
    }

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
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Manual Commission" filters={filters}>
            <div className='sidebar-left-content'>
            
                <div className="d-flex justify-content-start justify-content-sm-end gap-2 flex-wrap align-items-center all_flexbx">
                    <SelectDropdown                                                     
                        theme='search'
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="All Commission type"
                        intialValue={filters.commission_type}
                        result={e => { ChangeStatus(e.value) }}
                        options={[{
                            id: "sales", name: "Sales"
                        },
                        {
                            id: "lead", name: "Lead"
                        },
                        {
                            id: "bonus", name: "Bonus"
                        }]}
                    />

                     <SelectDropdown                                                     
                        theme='search'
                        id="statusDropdown"
                        displayValue="name"
                        placeholder="All Affiliate"
                        intialValue={filters.affiliate}
                        result={e => { ChangeAffiliateStatus(e.value) }}
                        options={affiliateData}
                    />


                    <article className="d-flex filterFlex phView">
                        <>
                            {permission('commission_add')&&<a className="btn btn-primary mb-0 set_reset" onClick={e => add()}>

                                  <i className="fa fa-plus mr-1"> </i>

                                Add Commission 
                            </a>}
                        </>

                        {(filters.affiliate || filters.commission_type) ? <>
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
                                    {/* <th scope="col" className='table_data' onClick={e => sorting('title')}>Click Ref{filters?.sorder === "asc" ? "↑" : "↓"}</th> */}
                                    <th scope="col" className='table_data' >Commisssion Type</th>
                                    <th scope="col" className='table_data' >Affiliate</th>
                                    <th scope="col" className='table_data'>Order price</th>
                                    <th scope="col" className='table_data'>Commission</th>
                                    <th scope="col" className='table_data'>Order Id</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {/* <th scope="col" className='table_data'>Action</th> */}

                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        {/* <td className='table_dats'
                                        >
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {itm?.click_ref || "--"}
                                                    </h4>
                                                </div>
                                            </div></td> */}
                                        <td className='table_dats'>{itm?.commission_type || "--"}</td>
                                        <td className='table_dats'>{itm?.affiliate_name || "--"}</td>
                                        <td className='table_dats'>${itm?.amount_of_sale || "--"}</td>
                                        <td className='table_dats'>${itm?.amount_of_commission || "--"}</td>
                                        <td className='table_dats'>{itm?.order_reference || "--"}</td>
                                        <td className='table_dats'>{datepipeModel.date(itm?.createdAt)}</td>
                                    </tr>
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                    {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}
                </div>


               <div className={`paginationWrapper ${!loaging && total > 10 ? '' : 'd-none'}`}>
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
                    </select> from {total} Commissions</span>
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
        </Layout>
    );
};

export default Html;

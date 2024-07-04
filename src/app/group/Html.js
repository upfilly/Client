import datepipeModel from '@/models/datepipemodel';
import React from 'react';
import SelectDropdown from '../components/common/SelectDropdown';
import ReactPaginate from 'react-paginate';
import Layout from '../components/global/layout';
import methodModel from '../../methods/methods';

const Html = ({
    filter,
    view,
    edit,
    reset,
    add,
    ChangeStatus,
    statusChange,
    pageChange,
    deleteItem,
    filters,
    loaging,
    sorting,
    data,
    total,
    setFilter,
}) => {

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    return (
        <>
            <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Groups" filters={filters} >

                <div className='nmain-list '>
                    <div className='row mx-0'>
                        <div className='col-lg-12'>
                            <div className="d-flex gap-3 flex-wrap filterFlex phView align-items-center   justify-content-end">
                                {methodModel.permission('group_add') && <a className="btn btn-primary ms-2 " onClick={e => add()}>
                                    <i className='fa fa-plus mr-1'></i> Add
                                </a>}
                                <SelectDropdown
                                    id="statusDropdown" className="mr-2 "
                                    displayValue="name"
                                    placeholder="All Status"
                                    intialValue={filters?.status}
                                    result={e => { ChangeStatus(e.value) }}
                                    options={[
                                        { id: 'active', name: 'Active' },
                                        { id: 'deactive', name: 'Inactive' },
                                    ]}
                                />

                                {filters?.status || filters?.role ? <>
                                    <a className="btn btn-primary  ml-2 reset-same" onClick={e => reset()}>
                                        Reset
                                    </a>
                                </> : <></>}
                            </div>
                        </div>
                    </div>

                    <div className='row mx-0'>
                        <div className='col-lg-12'>

                            <div className='table_section mt-3'>
                                <div className="table-responsive ">

                                    <table className="table table-striped">
                                        <thead className='table_head'>
                                            <tr className='heading_row'>
                                                <th scope="col" className='table_data' onClick={e => sorting('name')}>Affliate Group {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                <th scope="col" className='table_data' >Affiliates </th>
                                                {/* <th scope="col" className='table_data' >Default</th> */}
                                                <th scope="col" className='table_data' onClick={e => sorting('status')}>Status {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Creation Date {filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                                <th scope="col" className='table_data ml-5' ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!loaging && data && data.map((itm, i) => {
                                                return <tr className='data_row' key={i}>
                                                    <td className='table_dats' onClick={e => view(itm?.id)}>
                                                        <div className='user_detail'>
                                                            <div className='user_name'>
                                                                <h4 className='user'>
                                                                    {methodModel?.capitalizeFirstLetter(itm?.group_name)}
                                                                </h4>
                                                            </div>
                                                        </div></td>
                                                    <td className='table_dats'>   <span className={`active_btn${itm?.status}`} >
                                                        <span className=''>
                                                            {itm?.number_of_affiliate_added}
                                                        </span>
                                                    </span></td>
                                                    {/* <td className='table_dats'>
                                                        <div className='user_detail'>
                                                            <div className='user_name'>
                                                                <h4 className='user'>
                                                                    {itm?.isDefaultAffiliateGroup ? <i class="fa fa-check" aria-hidden="true"></i> : <i class="fa fa-times" aria-hidden="true"></i>}
                                                                </h4>
                                                            </div>
                                                        </div></td> */}
                                                    <td className='table_dats'>   <span className={`active_btn${itm?.status}`} onClick={() => statusChange(itm)}>
                                                        <span className={itm?.status == 'deactive' ? "inactive" : "contract"}>
                                                            {itm?.status == 'deactive' ? 'Inactive' : 'Active'}
                                                        </span>
                                                    </span></td>
                                                    <td className='table_dats'>
                                                        <h4 class="user"> {datepipeModel.date(itm?.createdAt)}</h4>
                                                    </td>
                                                    <td>
                                                        <div className='action_icons'>
                                                            {methodModel.permission('group_edit')&&<a className='edit_icon edit-main' title="Edit" onClick={itm.status == "deactive" ? null : (e) => edit(itm.id)} >

                                                                <i className={`material-icons edit ${itm.status == "deactive" ? 'disabled' : ''}`} title="Edit">edit</i>
                                                            </a>}

                                                            {methodModel.permission('group_delete')&&<a className='edit_icon' onClick={() => deleteItem(itm.id)}>
                                                                <i className={`material-icons delete`} title='Delete'> delete</i>
                                                            </a>}
                                                        </div>
                                                    </td>
                                                </tr>

                                            })
                                            }
                                        </tbody>
                                    </table></div>
                                {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}
                            </div>
                        </div>
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
            </Layout>
        </>
    );
};

export default Html;

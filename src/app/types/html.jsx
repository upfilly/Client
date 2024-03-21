import React from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
import datepipeModel from '@/models/datepipemodel';
import SelectDropdown from "@/app/components/common/SelectDropdown";

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
    data,
    isAllow,
    total
}) => {
    return (
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className="d-flex justify-content-between align-items-center">
                <h3 className="hedding">
                Types
                </h3>

                <article className="d-flex filterFlex phView">
                    {isAllow('addAdmins') ? <>
                        <a className="btn btn-primary" onClick={e => add()}>
                            Add Type
                        </a>
                    </> : <></>}
                    <div className='searchInput'><input type="text" value={filters.search} placeholder="Search" className="form-control" onChange={e=>filter({search:e.target.value,page:1})} /></div>
                    <SelectDropdown
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


                    {filters.status ? <>
                        <a className="btn btn-primary" onClick={e => reset()}>
                            Reset
                        </a>
                    </> : <></>}
                </article>


            </div>

            <div className="table-responsive table_section">

<table className="table table-striped">
    <thead className='table_head'>
        <tr className='heading_row'>
            <th scope="col" className='table_data'>Name</th>
            <th scope="col" className='table_data'>Status</th>
            <th scope="col" className='table_data'>Date Created</th>
            <th scope="col" className='table_data'></th>

        </tr>
    </thead>
    <tbody>
        {!loaging && data && data.map((itm, i) => {
            return <tr className='data_row' key={i}>
                <td className='table_dats' onClick={e => view(itm.id)}>
                {itm.name}
</td>
                <td className='table_dats'>   <div className={`user_hours ${itm.status}`} onClick={() => statusChange(itm)}>
                    <span className='contract'>
                        {itm.status == 'deactive' ? 'inactive' : 'active'}
                    </span>
                </div></td>
                <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
              


                {/* dropdown */}
                <td className='table_dats'>
                    <div className="action_icons">
                        {isAllow('editAdmins') ? <>
                            <a className='edit_icon' title="Edit" onClick={e => edit(itm.id)}>
                                <i className="material-icons edit" title="Edit">edit</i>
                            </a>
                        </> : <></>}

                        {isAllow('deleteAdmins') ? <>
                        <span className='edit_icon' onClick={() => deleteItem(itm.id)}>
                            <i className="material-icons delete" title='Delete'> delete</i>
                        </span>
                        </> : <></>}
                    </div>
                </td>

            </tr>

        })
        }
    </tbody>
</table>


</div>





            {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

            {
                !loaging && total > filters.count ? <div className='paginationWrapper'>
                    <span>Show {filters.count} from {total} Sub Admin’s</span>
                    {/* <Pagination
                        currentPage={filters.page}
                        totalSize={total}
                        sizePerPage={filters.count}
                        changeCurrentPage={pageChange}
                    /> */}
                    <ReactPaginate
        breakLabel="..."
        // nextLabel="Next >"
        initialPage={filters.page}
        onPageChange={pageChange}
        pageRangeDisplayed={5}
        pageCount={filters.count}
        previousLabel="< Previous"
        renderOnZeroPageCount={null}
      />
                </div> : <></>
            }

            {loaging ? <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" />
            </div> : <></>}
        </Layout>
    );
};

export default Html;

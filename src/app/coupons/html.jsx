import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '../../methods/methods';
import datepipeModel from '../../models/datepipemodel';
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import SelectDropdown from '../components/common/SelectDropdown';

const Html = ({
    view,
    edit,
    reset,
    add,
    user,
    sorting,
    pageChange,
    deleteItem,
    filters,
    loaging,
    data,
    total,
    setFilter,
    filter,
    ChangeStatus
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    const permission = (p) => {
        if (user && user?.permission_detail && p) {
          return user?.permission_detail[p]
        } else {
          return false
        }
    }

    const exportCSV = () => {
        let url='coupon/getAll'
        let payload ={media:user?.id,csv:"yes",visibility:"Public",}
        ApiClient.get(url, payload).then(res => {
            if (res) {
                const xmlContent = res;
    
                const blob = new Blob([xmlContent], { type: 'application/xml' });
    
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
    
                link.download = 'Coupons.csv';
    
                link.click(); 
            }
        })
    };

    const exportXML = () => {
        let url = 'coupon/getAll';
        let payload = { media: user?.id, xml: "yes", visibility: "Public" };
    
        ApiClient.get(url, payload).then(res => {
            if (res) {
                const xmlContent = res;
    
                const blob = new Blob([xmlContent], { type: 'application/xml' });
    
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
    
                link.download = 'CouponsXml.xml';
    
                link.click();
            }
        });
    };    

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Coupons" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-end gap-2 flex-wrap align-items-center all_flexbx">

                    <article className="d-flex filterFlex phView">
                        {(user?.role == "brand" || permission('coupon_add')) && <>
                            <a className="btn btn-primary mb-0 set_reset" onClick={e => add()}>
                                Add Coupon
                            </a>
                        </>}
                        <SelectDropdown                                                     theme='search'
                            id="statusDropdown" className="mr-2 "
                            displayValue="name"
                            placeholder="All Status"
                            intialValue={filters?.status}
                            result={e => { ChangeStatus(e.value) }}
                            options={[
                                { id: 'Enabled', name: 'Enabled' },
                                { id: 'Expired', name: 'Expired' },
                            ]}
                        />

                        {filters.status ? <>
                            <a className="btn btn-primary" onClick={e => reset()}>
                                Reset
                            </a>
                        </> : <></>}
                    </article>

                    {/* Add Export Buttons */}
                   {user?.role == "affiliate" && <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={exportCSV}>Export CSV</button>
                        <button className="btn btn-warning" onClick={exportXML}>Export XML</button>
                    </div>}

                </div>

                <div className='table_section'>
                    <div className="table-responsive ">
                        <table className="table table-striped table-width">
                            <thead className='table_head'>
                                <tr className='heading_row'>
                                    <th scope="col" className='table_data' >Coupon Code</th>
                                    <th scope="col" className='table_data' >Coupon Type</th>
                                    <th scope="col" className="table_data">Brand Name</th>
                                    <th scope="col" className='table_data' >Visibility</th>
                                    <th scope="col" className='table_data' >Expiration Date</th>
                                    <th scope="col" className='table_data'>Status</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Created Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {user?.role == 'brand' && <th scope="col" className='table_data'>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats' onClick={e => view(itm.id || itm?._id)}>
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm.couponCode)}
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='table_dats'>
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm?.couponType)}
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='table_dats'>
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm?.addedByDetails?.fullName)}
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='table_dats'>
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm?.visibility)}
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='table_dats'>
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {datepipeModel.date(itm.expirationDate)}
                                                    </h4>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='table_dats'>
                                            <div className={`user_hours`}>
                                                <span className={itm?.status == "Enabled" ? 'contract' : itm?.status == "Expired" ? 'inactive' : 'pending_status'}>
                                                    {itm.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>

                                        {/* dropdown */}
                                        <td className='table_dats'>
                                            <div className="action_icons gap-3 ">
                                                {(user?.role == 'brand' || permission('coupon_edit')) && <>
                                                    <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm.id || itm?._id)}>
                                                        <i className="material-icons edit" title="Edit">edit</i>
                                                    </a>
                                                    <a className='edit_icon edit-delete' onClick={itm?.status == "accepted" ? "" : () => deleteItem(itm.id || itm?._id)}>
                                                        <i className={`material-icons ${itm?.status == "accepted" ? 'delete' : 'diabled'}`} title='Delete'> delete</i>
                                                    </a>
                                                </>
                                                }
                                            </div>
                                        </td>

                                    </tr>

                                })
                                }
                            </tbody>
                        </table>
                        {!loaging && data?.length == 0 ? <div className="py-3 text-center">No Coupon Found</div> : <></>}
                    </div>
                </div>

                <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
                    <span>Show {data?.length} from {total} Users</span>
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

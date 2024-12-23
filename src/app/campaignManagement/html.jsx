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
    setFilter,
    Tracklogin,
    previousdata,
    previoustotal,
    previousfilters,
    pagePreviousChange,
    SendPreviousRequest
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState('new'); // State to track the active tab
    const [filteredData, setFilteredData] = useState(data); // State for filtered data

    useEffect(() => {
        // Filter data based on the selected tab
        if (activeTab === 'new') {
            // Filter for new campaigns (e.g., status == 'pending')
            setFilteredData(data);
        } else {
            // Filter for previous campaigns (e.g., status != 'pending')
            setFilteredData(previousdata);
        }
    }, [activeTab]); // Re-run effect when activeTab or data changes

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
                            {/* Tab Navigation */}
                             {/* <div className="tabs">
                                {['new', 'previous'].map((tab) => (
                                    <button
                                        key={tab}
                                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab === 'new' ? 'New Campaign' : 'Previous Campaign'}
                                    </button>
                                ))}
                            </div>*/}

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
                                            <th scope="col" className='table_data' onClick={e => sorting('event_type')}>
                                                Event Type {filters?.sorder === "asc" ? "↑" : "↓"}
                                            </th>
                                            <th scope="col" className='table_data'>Amount($)</th>
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
                                        {(!loaging && activeTab == "new")? data.map((itm, i) => (
                                            <tr className='data_row' key={i}>
                                                <td className='table_dats' onClick={e => view(itm.campaign_detail?.id || itm?.campaign_detail?._id)}>
                                                    <div className='user_detail'>
                                                        <div className='user_name'>
                                                            <h4 className='user'>
                                                                {methodModel.capitalizeFirstLetter(itm?.campaign_detail?.name)}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </td>
                                                {itm?.campaign_detail?.event_type && <td className='table_dats'>{itm?.campaign_detail?.event_type.join(",")}</td>}
                                                <td className='table_dats'>{itm?.campaign_detail?.amount}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm.campaign_detail?.createdAt)}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm?.campaign_detail?.updatedAt)}</td>
                                                <td className='table_dats d-flex align-items-center'>
                                                    {itm?.status == 'pending' ? (
                                                        <div className='d-flex align-items-center'>
                                                            <button onClick={() => statusChange("accepted", itm?.id || itm?._id)} className="btn btn-primary mr-2 btn_actions">
                                                                <i className='fa fa-check'></i>
                                                            </button>
                                                            <button onClick={() => statusChange("rejected", itm?.id || itm?._id)} className="btn btn-danger br50 bg-red mr-2 btn_actions">
                                                                <i className='fa fa-times'></i>
                                                            </button>
                                                        </div>
                                                    ) : itm?.status == 'rejected' ? (
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
                                        )) : (
                                            <>
                                            {!loaging && filteredData.map((itm, i) => (
                                            <tr className='data_row' key={i}>
                                                <td className='table_dats' onClick={e => view(itm?.id || itm?._id)}>
                                                    <div className='user_detail'>
                                                        <div className='user_name'>
                                                            <h4 className='user'>
                                                                {methodModel.capitalizeFirstLetter(itm?.name)}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                </td>
                                                {itm?.event_type && <td className='table_dats'>{itm?.event_type.join(",")}</td>}
                                                <td className='table_dats'>{itm?.amount}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm?.createdAt)}</td>
                                                <td className='table_dats'>{datepipeModel.date(itm?.updatedAt)}</td>
                                                <td className='table_dats d-flex align-items-center'>
                                                    <button className='btn btn-primary btn_actions'
                                                    title="Send request"
                                                        onClick={() => {
                                                            SendPreviousRequest(itm?.id || itm?._id,itm?.brand_id)
                                                            // history.push(`/chat`);
                                                            // localStorage.setItem("chatId", itm?.brand_id);
                                                        }}>
                                                        <i class="fa-solid fa-code-pull-request"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                                {(!loaging && total === 0 && activeTab == "new") && <div className="py-3 text-center">No Data</div>}
                                {(!loaging && previoustotal === 0 && activeTab != "new") && <div className="py-3 text-center">No Data</div>}
                            </div>
                        </div>

                        {activeTab == 'previous' && <div className={`paginationWrapper ${!loaging && previoustotal > previousfilters?.count ? '' : 'd-none'}`}>
                            <span>Show {previousdata?.length} from {previoustotal} campaigns</span>
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel="Next >"
                                initialPage={previousfilters?.page}
                                onPageChange={pagePreviousChange}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                pageCount={Math.ceil(previoustotal / previousfilters?.count)}
                                previousLabel="< Previous"
                                renderOnZeroPageCount={null}
                                pageClassName={"pagination-item"}
                                activeClassName={"pagination-item-active"}
                            />
                        </div>}

                        {activeTab != 'previous' && <div className={`paginationWrapper ${!loaging && total > filters?.count ? '' : 'd-none'}`}>
                            <span>Show {filteredData?.length} from {total} campaigns</span>
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
                        </div>}

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

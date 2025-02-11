import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import { toast } from 'react-toastify';
import loader from '@/methods/loader';
import ApiClient from '@/methods/api/apiClient';
import environment from '../../environment';

const Html = ({
    reset,
    pageChange,
    filters,
    loaging,
    data,
    total,
    setFilter,
    filter,
    getData,
    comprehensiveTemplate,
    uniqueKeysArray,
}) => {
    const [activeSidebar, setActiveSidebar] = useState(false)
    const [show, setShow] = useState(false);
    const [form, setform] = useState({
        "email": "",
    })
    const [submitted, setSubmitted] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [copySuccess, setCopySuccess] = useState("");

    const downloadCsv = (csv) => {
        ApiClient.get("csv",{"csv_url":`${csv}`}).then(res => {
            if (res.success) {
                const file = res?.data;
                // const fileURL = URL.createObjectURL(file);
                window.open(file);
            }
        })
    }

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                setCopySuccess("URL copied to clipboard!");
                setTimeout(() => setCopySuccess(""), 2000)
            })
            .catch((err) => {
                console.error("Failed to copy URL: ", err);
            });
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        setIsValidEmail(isValid);
        setform({ ...form, email });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            filter();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form?.email) {
            setSubmitted(true)
            return;
        }
        loader(true)
        let method = 'post'
        let url = 'invite'

        let value = {
            ...form,
        }

        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                handleClose()
                setform({
                    "email": "",
                })
            }
            getData({ ...filters, page: 1 })
            loader(false)
        })
    };

    return (
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Data Feeds" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-end align-items-center flex-wrap gap-3 ">
                    <div className='d-flex align-items-center flex-wrap gap-2'>
                        {/* <SelectDropdown
                            id="statusDropdown"
                            displayValue="name"
                            placeholder="All Status"
                            intialValue={filters.invite_status}
                            result={e => { ChangeStatus(e.value) }}
                            options={[
                                { id: 'invited', name: 'Invited' },
                                { id: 'onboard', name: 'Onboard' },
                                { id: 'rejected', name: 'Rejected' },
                            ]}
                        /> */}
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
                    </div>

                    <div className='d-flex gap-3 align-items-center'>

                        <div className="d-flex filterFlex phView">
                            {/* {isAllow('addAdmins') ? <>
                                <a className="btn btn-primary" onClick={handleShow}>
                                    <i className='fa fa-plus mr-1'></i>  Send Invite
                                </a>
                            </> : <></>} */}
                            {filters.status ? <>
                                <a className="btn btn-primary" onClick={e => reset()}>
                                    Reset
                                </a>
                            </> : <></>}
                        </div>

                    </div>
                </div>

                <div className='table_section'>
                    <div className="table-responsive ">
                        <table className="table table-striped table-width">
                            {total != 0 && <thead className='table_head'>
                                <tr className='heading_row'>
                                    {/* {uniqueKeysArray?.map((itm) => {
                                        return <th scope="col" className='table_data'>{itm}</th>
                                    })} */}
                                    <th scope="col" className='table_data'>Brand Name</th>
                                    <th scope="col" className='table_data'>Type</th>
                                    <th scope="col" className='table_data'>Action</th>
                                    {/* <th scope="col" className='table_data'>Share URL</th> */}
                                </tr>
                            </thead>}
                            { <tbody>
                                {/* {comprehensiveTemplate?.map((item, index) => ( */}
                                    {/* {uniqueKeysArray.map((key, idx) => (
                                            <td className='table_dats' key={idx}>
                                                {key == "createdAt" ? datepipeModel.date(item[key]) :
                                                    key == "updatedBy" ? datepipeModel.date(item[key]) : item[key] || "--"}
                                            </td>
                                        ))} */}
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats'>{itm?.brand_id?.fullName}</td>
                                        <td className='table_dats'>{itm?.url ? "URL" : "CSV"}</td>
                                        {itm?.url ? <td className='table_dats'>
                                            <a href={itm?.url} target="_blank" rel="noopener noreferrer">
                                                {itm?.url?.slice(0, 40)}
                                            </a>
                                        </td> :
                                            <td className='table_dats' >
                                                <button onClick={()=>downloadCsv(itm?.filePath)} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                                    Click here
                                                </button>
                                            </td>}

                                    </tr>

                                })
                                }

                                    {/* <td className='table_dats'>
                                        <div className="d-flex align-items-center">
                                            <a href={`https://upfilly.com?affiliate_id=66d9a1b2231607c158aa25ae&url=${encodeURIComponent(item.url)}`} target="_blank" rel="noopener noreferrer">
                                                Share URL
                                            </a>
                                            <button
                                                className="btn btn-link ms-2"
                                                onClick={() => copyToClipboard(`https://upfilly.com?affiliate_id=66d9a1b2231607c158aa25ae&url=${encodeURIComponent(item.url || item.productURL)}`)}
                                                title="Copy URL"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        {copySuccess && <div className="text-success mt-2">{copySuccess}</div>}
                                    </td> */}
                                {/* // ))} */}
                            </tbody>}
                        </table>
                        {loaging ? <div className="text-center py-4">
                            <img src="/assets/img/loader.gif" className="pageLoader" />
                        </div> : <></>}
                        {!loaging && comprehensiveTemplate?.length == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}
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

            </div>
        </Layout>
    );
};

export default Html;

import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import datepipeModel from '@/models/datepipemodel';
import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import loader from '@/methods/loader';
import ApiClient from '@/methods/api/apiClient';

const Html = ({
    view,
    edit,
    reset,
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
    statusChange,
    getData,
    uniqueKeys,
    comprehensiveTemplate,
    uniqueKeysArray,
}) => {
    const history = useRouter()
    const [activeSidebar, setActiveSidebar] = useState(false)
    const [show, setShow] = useState(false);
    const [form, setform] = useState({
        "email": "",
    })
    const [submitted, setSubmitted] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isValidEmail, setIsValidEmail] = useState(true);

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
                            <thead className='table_head'>
                                <tr className='heading_row'>
                                    {uniqueKeysArray?.map((itm) => {
                                        return <th scope="col" className='table_data'>{itm}</th>
                                    })
                                    }
                                </tr>
                            </thead>
                            {!loaging && <tbody>
                                {comprehensiveTemplate?.map((item, index) => (
                                    <tr key={index}>
                                        {uniqueKeysArray.map((key, idx) => (
                                            <td className='table_dats' key={idx}>{key == "createdAt" ? datepipeModel.date(item[key]) : key == "updatedBy" ? datepipeModel.date(item[key]) : item[key] || "--"}</td>
                                        ))}
                                    </tr>
                                ))}
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



                <Modal className='invite_modal' show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title className='mb-0 fs14'>Send Invite</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className='d-flex justify-content-between align-items-center width_label' controlId="formBasicEmail">

                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={form.email}
                                onChange={handleEmailChange}
                                isInvalid={!isValidEmail}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                            {submitted && !form?.email ? <div className="invalid-feedback d-block">email is Required</div> : <></>}
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => handleSubmit(e)}>
                            Send
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Layout>
    );
};

export default Html;

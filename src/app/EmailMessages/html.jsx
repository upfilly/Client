import React, { useState } from 'react';
import Layout from '@/app/components/global/layout';
import ReactPaginate from 'react-paginate';
import './style.scss';
import methodModel from '@/methods/methods';
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
    getData
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
        <Layout activeSidebar={activeSidebar} handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Messages" filters={filters}>
            <div className='sidebar-left-content'>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 ">
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
                                    <th scope="col" className='table_data' onClick={e => sorting('email')}>E-mail{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    <th scope="col" className='table_data'>Title</th>
                                    <th scope="col" className='table_data'>Content</th>
                                    <th scope="col" className='table_data' onClick={e => sorting('createdAt')}>Sended Date{filters?.sorder === "asc" ? "↑" : "↓"}</th>
                                    {/* <th scope="col" className='table_data'>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr className='data_row' key={i}>
                                        <td className='table_dats'
                                         onClick={e => view(itm.id || itm?._id)}
                                         >
                                            <div className='user_detail'>
                                                <div className='user_name'>
                                                    <h4 className='user'>
                                                        {methodModel.capitalizeFirstLetter(itm?.addedBy_details?.email)}
                                                    </h4>
                                                </div>
                                            </div></td>
                                        <td className='table_dats'>{itm?.title}</td>
                                        <td className='table_dats' dangerouslySetInnerHTML={{ __html: itm?.description?.slice(0, 50) || "--" }} />
                                        <td className='table_dats'>{datepipeModel.date(itm.createdAt)}</td>
                                        {/* dropdown */}
                                        {/* <td className='table_dats'>
                    <div className="action_icons">
                        {isAllow('editAdmins') ? <>
                            <a className='edit_icon action-btn' title="Edit" onClick={e => edit(itm.id)}>
                                <i className="material-icons edit" title="Edit">edit</i>
                            </a>
                        </> : <></>}

                        {isAllow('deleteAdmins') ? <>
                            <a className='edit_icon edit-delete' onClick={itm?.status == "accepted" ? "" : () => deleteItem(itm.id)}>
                                <i className={`material-icons ${itm?.status == "accepted" ? 'delete' : 'diabled'}`} title='Delete'> delete</i>
                            </a>
                        </> : <></>}
                    </div>
                </td> */}
                                    </tr>

                                })
                                }
                            </tbody>
                        </table>
                        {!loaging && total == 0 ? <div className="py-3 text-center">No Data Found</div> : <></>}
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

import React, { useEffect, useRef, useState } from 'react';
import Layout from '../../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import SelectDropdown from '@/app/components/common/SelectDropdown';
import { useRouter } from 'next/navigation';
import environment from '@/environment';
import { Modal } from 'react-bootstrap';

const Html = () => {
    const user = crendentialModel.getUser()
    const [formData, setFormData] = useState({});
    const [data, setData] = useState([]);
    const [formType, setFormType] = useState('single');
    const [isChecked, setIsChecked] = useState(false);
    const [file, setFile] = useState(null);
    const [locale, setLocale] = useState('');
    const [hasHeader, setHasHeader] = useState(false);
    const [commissionSelectType, setCommissionType] = useState("");
    const [submitted, setsubmitted] = useState(false)
    const [show, setShow] = useState(false);
    const history = useRouter()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const openModal = () => {
        handleShow()
    }

    const commissionType = [{
        id: "sales", name: "Sales"
    },
    {
        id: "lead", name: "Lead"
    }]

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        ApiClient.postFormData('upload/document', { file: selectedFile }).then((res) => {
            if (res?.success) {
                setFile(res?.data?.imagePath)
            }
        })
    };

    const handleLocaleChange = (event) => {
        setLocale(event.target.value);
    };

    const handleHeaderChange = (event) => {
        setHasHeader(event.target.checked);
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleCommissionTypeChange = (e) => {
        setCommissionType(e.target.value)
    }

    const getData = (p = {}) => {
        // let filter = { ...filters, ...p }
        ApiClient.get(`users/list`).then(res => {
            if (res.success) {
                setData(res?.data?.data)
            }
        })
    };

    useEffect(() => {
        getData()
    }, [])

    const handleSubmit = () => {

        let payload;

        if (formType == "single") {
            if (!commissionSelectType) {
                setsubmitted(true)
                return
            }
        }

        if (formType == "single") {
            payload = {
                "upload_method": formType,
                "commission_type": commissionSelectType,
                // "publisher_id": formData?.publisher_id,
                "amount_of_sale": formData?.amount_of_sale,
                "amount_of_commission": formData?.amount_of_commission,
                "order_reference": formData?.order_reference,
                // "click_ref": formData?.click_ref,
                "affiliate_id": formData?.publisher_id,
                "is_send_email_to_publisher": isChecked,
            }
        } else {
            payload = {
                "batch_file": `/documents/${file}`,
                "isContain_headers": hasHeader ? "yes" : "no",
                "locality": locale,
            }
        }

        ApiClient.post('add-commission', payload).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setFormType('')
                setCommissionType('')
                history.push('/commission/manualCommission/view')
                setFormData({
                    "amount_of_sale": "",
                    "amount_of_commission": "",
                    "order_reference": "",
                    // "click_ref": "",
                    "affiliate_id": "",
                    "is_send_email_to_publisher": false,
                    "batch_file": "",
                    "isContain_headers": false,
                    "locality": '',
                })
            }
            // loader(false);
        });
    };


    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Manual Commission" filters={''} >
                <div className='sidebar-left-content'>
                    <div className="card">
                        <div className='card-header'>
                            <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 className="link_default m-0"><i className="fa-solid fa-arrow-left mr-3 link_icon"
                                    aria-hidden="true" onClick={() => history.push("/commission/manualCommission/view")}></i>
                                    Manual Commission
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>
                            <div className='container' >
                                <div className='' >

                                    <div className='d-flex gap-5 align-items-center mb-4 ' >
                                        <div className="form-check" >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="single"
                                                name="formType"
                                                value="single"
                                                checked={formType === 'single'}
                                                onChange={() => setFormType('single')}
                                            />
                                            <label className="form-check-label" htmlFor="single">Single</label>
                                        </div>
                                        <div className="form-check" >
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="batch"
                                                name="formType"
                                                value="batch"
                                                checked={formType === 'batch'}
                                                onChange={() => setFormType('batch')}
                                            />
                                            <label className="form-check-label" htmlFor="batch">Batch(CSV)</label>
                                        </div>
                                    </div>

                                    {formType === 'single' &&
                                        <div className='row' >
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Select a Commission Type</label>
                                                    <SelectDropdown
                                                        id="statusDropdown"
                                                        displayValue="name"
                                                        placeholder="select"
                                                        intialValue={commissionSelectType}
                                                        result={e => { setCommissionType(e.value) }}
                                                        options={commissionType}
                                                    />
                                                    {submitted && !commissionSelectType ? <div className="invalid-feedback d-block">Commission Type is Required</div> : <></>}
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Publisher Id</label>
                                                    <SelectDropdown
                                                        id="statusDropdown"
                                                        displayValue="fullName"
                                                        placeholder="select"
                                                        intialValue={formData?.publisher_id}
                                                        result={e => { setFormData({ ...formData, publisher_id: e.value }) }}
                                                        options={data}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Amount of Sale </label>
                                                    <input
                                                        type="text"
                                                        className='form-control'
                                                        placeholder="Enter your Amount of Sale"
                                                        value={formData?.amount_of_sale}
                                                        onChange={(e) => setFormData({ ...formData, amount_of_sale: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Amount of Commission </label>
                                                    <input
                                                        type="text"
                                                        className='form-control'
                                                        placeholder="Enter your Amount of Commission"
                                                        value={formData?.amount_of_commission}
                                                        onChange={(e) => setFormData({ ...formData, amount_of_commission: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Commission Status</label>
                                                    <SelectDropdown
                                                        id="statusDropdown"
                                                        displayValue="name"
                                                        placeholder="select"
                                                        intialValue={formData?.commission_status}
                                                        result={e => { setFormData({ ...formData, commission_status: e.value }) }}
                                                        options={[
                                                            { id: 'pending', name: 'Pending' },
                                                            { id: 'confirmed', name: 'Confirmed' },
                                                        ]}
                                                    />
                                                </div>
                                            </div>

                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Order Reference</label>
                                                    <input
                                                        type="text"
                                                        className='form-control'
                                                        placeholder="Enter your Order Rference"
                                                        value={formData?.order_reference}
                                                        onChange={(e) => setFormData({ ...formData, order_reference: e?.target?.value })} />
                                                </div>
                                            </div>

                                            {/* <div className='col-md-6 '>
            <div className='mb-3' >
                <label>click ref (IO Number)</label>
                <input
                    type="text"
                    className='form-control'
                    placeholder="Enter your click ref (IO Number)"
                    value={formData?.click_ref}
                    onChange={(e) => setFormData({ ...formData, click_ref: e?.target?.value })} />
            </div>
        </div> */}
                                            <div className='col-md-12'>
                                                <div className='mb-3'>
                                                    <div className="form-check form-check-inline ">

                                                        <label className="form-check-label" >
                                                            <input
                                                                className="form-check-input mt-1"
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={handleCheckboxChange}
                                                            />
                                                            <span className='ml-2' >Check the box to send the publisher an email containing the commission details </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>}
                                    {formType != 'single' && <>


                                        {/* <div className='mb-3' >
        <label htmlFor="fileInput">Upload CSV file:</label>
        <input
            type="file"
            className='form-control'
            accept=".csv"
            onChange={handleFileChange}
        />
    </div> */}

                                        <div className='col-md-12'>
                                            <div className='mb-3'>
                                                <label>Upload CSV File <span onClick={openModal} style={{ color: 'red' }}>(See a example)</span></label>
                                                <div className="form-group drag_drop">
                                                    <div className='upload_filebx'>
                                                        {!file && <><button className="btn btn-primary upload_image">Upload CSV File</button>
                                                            <input type="file" className="form-control file_input" accept=".csv" multiple={false}
                                                                onChange={(e) => {
                                                                    handleFileChange(e);
                                                                }} /></>}
                                                        {/* {file ? <div className="text-success text-center mt-5 top_loading">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : null} */}
                                                        <div className="imagesRow">
                                                            <div className="upload_csvfile">
                                                                {!file ? null : <a href={`${environment?.api}/documents/${file}`}><img src={`/assets/img/document.png`} className="thumbnail" /></a>}
                                                                {!file ? null : <div className="removeCross" onClick={() => setFile('')}><i class="fa fa-times csv_close" aria-hidden="true"></i>
                                                                </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            {/* <div className='mb-3' >
                                                <label htmlFor="localeSelect">Select Locale:</label>
                                                <select className='form-control' id="localeSelect" value={locale} onChange={handleLocaleChange}>
                                                    <option value="">Select Locale</option>
                                                    <option value="en">English</option>
                                                    <option value="fr">French</option>
                                                </select>
                                            </div> */}
                                            <div className='mb-3'>
                                                <div className="form-check form-check-inline" >
                                                    <input className="form-check-input" type="checkbox"
                                                        id="headerCheckbox"
                                                        checked={hasHeader}
                                                        onChange={handleHeaderChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="headerCheckbox"> Does first line contain header?
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </>}

                                    <div className='text-end'>
                                        <button type="button" class="btn btn-primary" onClick={handleSubmit} >Submit Commisssion</button>
                                    </div>
                                </div>

                                <Modal show={show} onHide={handleClose} className="shadowboxmodal csv_modal">
                                    <Modal.Header className='align-items-center p-0 pb-3' closeButton>
                                        <h5 className='modal-title'>Sample CSV File</h5>
                                    </Modal.Header>
                                    <Modal.Body className='p-0' >
                                        <img src="/assets/img/affiliteCsv.png" className='csv_img_file'
                                        />
                                    </Modal.Body>
                                </Modal>

                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

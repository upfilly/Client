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
import Papa from 'papaparse';

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
    const [csvData, setCsvData] = useState([]);
    const [errors, setErrors] = useState({});
    const history = useRouter()

    const handleDownload = () => {
        const url = '/searchspring.csv';
        window.open(url, '_blank');
    };

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
    },
    {
        id: "bonus", name: "Bonus"
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
        let filter = { brand_id: user?.id }
        let url = 'getallaffiliatelisting'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                const manipulateData = filteredData.map((itm) => {
                    return {
                        name: itm?.fullName || itm?.firstName, id: itm?.id || itm?._id
                    }
                })
                setData(manipulateData)
            }
        })
    }

    const fetchCSV = async () => {
        try {
            const response = await fetch('/searchspring.csv');
            if (!response.ok) {
                throw new Error('File not found');
            }

            const text = await response.text();
            Papa.parse(text, {
                complete: (result) => {
                    setCsvData(result.data);
                },
                header: true,
                skipEmptyLines: true,
            });
        } catch (err) {
        }
    };

    useEffect(() => {
        getData()
        fetchCSV();
    }, [])

    const validateForm = () => {
        const newErrors = {};

        if (!commissionSelectType) {
            newErrors.commissionType = 'Commission Type is required';
        }

        if (!formData?.publisher_id) {
            newErrors.publisher_id = 'Affiliate Name is required';
        }

        if (!formData?.amount_of_sale) {
            newErrors.amount_of_sale = 'Amount of Sale is required';
        }

        if (!formData?.amount_of_commission) {
            newErrors.amount_of_commission = 'Amount of Commission is required';
        }

        if (!formData?.commission_status) {
            newErrors.commission_status = 'Commission Status is required';
        }

        if (!formData?.order_reference) {
            newErrors.order_reference = 'Order Reference is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        setsubmitted(true);

        if (formType === 'single') {
            const isValid = validateForm();
            if (!isValid) {
                return;
            }
        } else {
            if (!file) {
                toast.error('Please upload a CSV file');
                return;
            }
        }

        let payload;

        if (formType == "single") {
            payload = {
                "upload_method": formType,
                "commission_type": commissionSelectType,
                "amount_of_sale": formData?.amount_of_sale,
                "amount_of_commission": formData?.amount_of_commission,
                "order_reference": formData?.order_reference,
                "affiliate_id": formData?.publisher_id,
                "is_send_email_to_publisher": isChecked,
                "commission_status": formData?.commission_status
            }
        } else {
            payload = {
                "batch_file": `/documents/${file}`,
                "isContain_headers": hasHeader ? "yes" : "no",
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
                    "affiliate_id": "",
                    "is_send_email_to_publisher": false,
                    "batch_file": "",
                    "isContain_headers": false,
                    "locality": '',
                    "commission_status": ""
                })
            }
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
                                                    <label>Select Commission Type</label>
                                                    <SelectDropdown theme='search'
                                                        id="statusDropdown"
                                                        displayValue="name"
                                                        placeholder="select"
                                                        intialValue={commissionSelectType}
                                                        result={e => { setCommissionType(e.value) }}
                                                        options={commissionType}
                                                    />
                                                    {errors.commissionType && <div className="invalid-feedback d-block">{errors.commissionType}</div>}
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Affiliate Name</label>
                                                    <SelectDropdown theme='search'
                                                        id="statusDropdown"
                                                        displayValue="name"
                                                        placeholder="select"
                                                        intialValue={formData?.publisher_id}
                                                        result={e => { setFormData({ ...formData, publisher_id: e.value }) }}
                                                        options={data}
                                                    />
                                                    {errors.publisher_id && <div className="invalid-feedback d-block">{errors.publisher_id}</div>}
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Amount of Sale </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.amount_of_sale ? 'is-invalid' : ''}`}
                                                        placeholder="Enter your Amount of Sale"
                                                        value={formData?.amount_of_sale}
                                                        onChange={(e) => setFormData({ ...formData, amount_of_sale: e.target.value })} />
                                                    {errors.amount_of_sale && <div className="invalid-feedback">{errors.amount_of_sale}</div>}
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Amount of Commission </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.amount_of_commission ? 'is-invalid' : ''}`}
                                                        placeholder="Enter your Amount of Commission"
                                                        value={formData?.amount_of_commission}
                                                        onChange={(e) => setFormData({ ...formData, amount_of_commission: e.target.value })} />
                                                    {errors.amount_of_commission && <div className="invalid-feedback">{errors.amount_of_commission}</div>}
                                                </div>
                                            </div>
                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Commission Status</label>
                                                    <SelectDropdown theme='search'
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
                                                    {errors.commission_status && <div className="invalid-feedback d-block">{errors.commission_status}</div>}
                                                </div>
                                            </div>

                                            <div className='col-md-6 '>
                                                <div className='mb-3' >
                                                    <label>Order Reference</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.order_reference ? 'is-invalid' : ''}`}
                                                        placeholder="Enter your Order Reference"
                                                        value={formData?.order_reference}
                                                        onChange={(e) => setFormData({ ...formData, order_reference: e?.target?.value })} />
                                                    {errors.order_reference && <div className="invalid-feedback">{errors.order_reference}</div>}
                                                </div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div className='mb-3'>
                                                    <div className="form-check form-check-inline ">
                                                        {/* <label className="form-check-label" > */}
                                                            An email will be sent to the publishers containing the commission details
                                                        {/* </label> */}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>}
                                    {formType != 'single' && <>
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
                                        <button className='btn btn-primary ml-2' onClick={handleDownload}>Download CSV</button>
                                    </Modal.Header>
                                    <Modal.Body className='p-0'>
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Product ID</th>
                                                        <th>SKU</th>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Retail Price</th>
                                                        <th>Category</th>
                                                        <th>Brand</th>
                                                        <th>Size</th>
                                                        <th>Color</th>
                                                        <th>Season</th>
                                                        <th>Avg Rating</th>
                                                        <th>Rating Count</th>
                                                        <th>Inventory Count</th>
                                                        <th>Product URL</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {csvData.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product["Product ID"]}</td>
                                                            <td>{product["SKU"]}</td>
                                                            <td>{product["Name"]}</td>
                                                            <td>{product["Price"]}</td>
                                                            <td>{product["Retail Price"]}</td>
                                                            <td>{product["Category"]}</td>
                                                            <td>{product["Brand"]}</td>
                                                            <td>{product["Size"]}</td>
                                                            <td>{product["Color"]}</td>
                                                            <td>{product["Season"]}</td>
                                                            <td>{product["Rating Avg"]}</td>
                                                            <td>{product["Rating Count"]}</td>
                                                            <td>{product["Inventory Count"]}</td>
                                                            <td>{product["Product URL"]}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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
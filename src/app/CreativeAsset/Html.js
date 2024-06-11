import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss'
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { Modal } from 'react-bootstrap';
import SelectDropdown from '../components/common/SelectDropdown';
import environment from '@/environment';

const Html = () => {
    const user = crendentialModel.getUser()
    const history = useRouter()
    const [form, setForm] = useState({
    })
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [relatedAffiliate, setAllAffiliate] = useState([])
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDownload = () => {
        const url = '/assets/img/Example.csv';
        window.open(url, '_blank');
    };

    const openModal = () => {
        handleShow()
    }

    const allGetAffiliate = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                setAllAffiliate(filteredData)
            }
        })
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        ApiClient.postFormData('upload/document', { file: selectedFile }).then((res) => {
            if (res?.success) {
                setFile(res?.data?.imagePath)
            }
        })
    };

    useEffect(() => {
        allGetAffiliate()
    }, [])

    const handleSubmit = () => {

        const payload = {
            addedBy: user?.id,
            user_id: form?.user_id,
            filePath: `/documents/${file}`
        }

        loader(true);
        ApiClient.post('dataset/send', payload).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setFile(null)
                setForm({})
            }
            loader(false);
        });
    };


    return (
        <>
            <Layout handleKeyPress={''} setFilter={''} reset={''} filter={''} name="Data Feeds" filters={''} >
                <div className='sidebar-left-content'>
                    <div className="card">
                        <div className='card-header'>
                            <div className='main_title_head d-flex justify-content-between align-items-center'>
                                <h3 className="link_default m-0"><i className="fa fa-bullhorn link_icon" aria-hidden="true"></i> Send Data Feeds
                                </h3>
                            </div>
                        </div>
                        <div className='card-body'>

                            <div className='row'>
                                <div className="col-md-6 mb-3">
                                    <label>Select Affiliate<span className="star">*</span></label>
                                    <div className="select_row">
                                        <SelectDropdown
                                            id="statusDropdown"
                                            displayValue="fullName"
                                            placeholder="Select Media"
                                            intialValue={form?.user_id}
                                            result={e => {
                                                setForm({ ...form, user_id: e.value })
                                            }}
                                            options={relatedAffiliate}
                                        />
                                    </div>
                                </div>
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

                            </div>

                            <Modal show={show} onHide={handleClose} className="shadowboxmodal csv_modal">
                                <Modal.Header className='align-items-center p-0 pb-3' closeButton>
                                    <h5 className='modal-title'>Sample CSV File</h5>
                                    <button className='btn btn-primary ml-2' onClick={handleDownload}>Download CSV</button>
                                </Modal.Header>
                                <Modal.Body className='p-0' >
                                    <img src="/assets/img/affiliteCsv.png" className='csv_img_file'
                                    />
                                </Modal.Body>
                            </Modal>

                            <div className='text-end mt-3'>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Send Data</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Html;

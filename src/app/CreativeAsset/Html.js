import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '@/methods/api/apiClient';
import './style.scss'
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css';
import { Modal } from 'react-bootstrap';
import DataFeedslisting from '../CreativeAsset/listings'
import environment from '@/environment';
import Papa from 'papaparse';
import crendentialModel from '@/models/credential.model';

const Html = () => {
    const user = crendentialModel.getUser()
    const [csvData, setCsvData] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [loaderData, setloaderData] = useState(false)
    const [relatedAffiliate, setAllAffiliate] = useState([])
    const [error, setError] = useState("");
    const [selectedOption, setSelectedOption] = useState('csv');
    const [url, setUrl] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDownload = () => {
        const url = '/searchspring.csv';
        window.open(url, '_blank');
    };

    const openModal = () => {
        handleShow()
    }

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        setFile(null);
        setUrl('');
        setError('');
    };

    const handleUrlChange = (e) => {
        const urlValue = e.target.value;
        setUrl(urlValue);
        setError("");
    };

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

    const handleSubmit = () => {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w .-]*)*\/?$/;
        if (selectedOption == "csv") {
            if (!file) {
                setError("Upload Csv file first")
                return
            }
        }
        //  else {
        //     if (!url || !urlPattern.test(url)) {
        //         setError("Please enter a valid URL.");
        //         return
        //     }
        // }


        setloaderData(true)

        let payload = {
            // addedBy: user?.id,
            // user_id: form?.user_id,
            "brand_id": user?.id || user?._id,
            "type": "csv",
            "filePath": `/documents/${file}`,
        }

        if (url) {
            payload = {
                // addedBy: user?.id,
                // user_id: form?.user_id,
                "brand_id": user?.id || user?._id,
                "type": "url",
                "url": url,
            }
        }

        ApiClient.post('dataset/send', payload).then((res) => {
            if (res?.success) {
                toast.success(res?.message)
                setloaderData(false)
                fetchCSV()
                setFile(null)
                // setForm({})
            }
        });
    };

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
        fetchCSV();
        allGetAffiliate();
    }, []);

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

                            {!loaderData ?
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <div className='mb-3 options'>
                                            <label>Choose an option:</label>
                                            <div className="form-check">
                                                <input
                                                    type="radio"
                                                    id="uploadCsv"
                                                    name="fileOption"
                                                    value="csv"
                                                    checked={selectedOption === 'csv'}
                                                    onChange={handleOptionChange}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="uploadCsv" className="form-check-label">Upload CSV</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="radio"
                                                    id="enterUrl"
                                                    name="fileOption"
                                                    value="url"
                                                    checked={selectedOption === 'url'}
                                                    onChange={handleOptionChange}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor="enterUrl" className="form-check-label">Enter URL</label>
                                            </div>
                                        </div>

                                        {selectedOption === 'csv' ? (
                                            <div className="mb-3">
                                                <label>Upload CSV File <span onClick={openModal} style={{ color: 'red' }}>(See an example)</span></label>
                                                <div className="form-group drag_drop">
                                                    <div className='upload_filebx'>
                                                        {!file && (
                                                            <>
                                                                <button className="btn btn-primary upload_image">Upload CSV File</button>
                                                                <input
                                                                    type="file"
                                                                    className="form-control file_input"
                                                                    accept=".csv"
                                                                    multiple={false}
                                                                    onChange={handleFileChange}
                                                                />
                                                            </>
                                                        )}
                                                        <div className="imagesRow">
                                                            <div className="upload_csvfile">
                                                                {!file ? null : (
                                                                    <a href={`${environment?.api}/documents/${file}`}>
                                                                        <img src={`/assets/img/document.png`} className="thumbnail" />
                                                                    </a>
                                                                )}
                                                                {!file ? null : (
                                                                    <div className="removeCross" onClick={() => setFile('')}>
                                                                        <i className="fa fa-times csv_close" aria-hidden="true"></i>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {error && <p style={{ color: "red" }}>{error}</p>}
                                            </div>
                                        ) : (
                                            <div className="mb-3">
                                                <label>Enter URL</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter the URL here"
                                                    value={url}
                                                    onChange={handleUrlChange}
                                                />
                                                {error && <p style={{ color: "red" }}>{error}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                :
                                <div className="text-center py-4">
                                    <img src="/assets/img/loader.gif" className="pageLoader" />
                                </div>
                            }

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

                            {!loaderData && <div className='text-end mt-3'>
                                <button type="button" class="btn btn-primary" onClick={handleSubmit} >Send Data</button>
                            </div>}
                        </div>
                    </div>
                    <DataFeedslisting file={file} loaderData={loaderData}/>
                </div>
            </Layout>
        </>
    );
};

export default Html;

'use client'

import React, { useEffect, useState } from 'react';
import Layout from '../components/global/layout/index';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./card.scss";
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import { useRouter, useSearchParams } from 'next/navigation';
import crendentialModel from '@/models/credential.model';
import { validateCVV, validateCardNumber } from '@/utils/utils';
import { toast } from 'react-toastify';

const cards = () => {
    const history = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const price = searchParams.get("price")
    const user = crendentialModel.getUser()
    const [startDate, setStartDate] = useState(null);
    const [data, setData] = useState([])
    const [summitted, Setsummitted] = useState(false)
    const [Loader, setLoader] = useState(false)
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [addCardLoader, setAddCardLoader] = useState(false)
    const [formData, setFormData] = useState({
        status: 'Active',
        currency: '',
        firstName: '',
        lastName: '',
        email: '',
        website: '',
        password: '',
        confirmPassword: '',
        address: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
        paypal_email: ''
    });
    const [selectedKey, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState('savedPayment');

    const handleSaveData = (e) => {
        e.preventDefault();

        if (!validateCardNumber(formData.cardNumber)) {
            Setsummitted(true);
            return;
        }

        const inputDate = new Date(startDate);
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const year = String(inputDate.getFullYear()).slice(-2)
        setAddCardLoader(true)
        const data1 = {
            // "firstName": user?.firstName,
            // "lastName": user?.lastName,
            "card_number": formData?.cardNumber,
            // "plan_id": id,
            "exp_month": month,
            "exp_year": year,
            "user_id": user?.id,
            "cvc": formData?.cardCvc
        }

        ApiClient.post('card', data1).then(res => {
            if (res.success == true) {
                toast.success(res.message)
                setFormData({
                    "paypal_email": "",
                    "cardNumber": '',
                    "cardExpiry": '',
                    "cardCvc": '',
                })
                handleCardData()
                setActiveTab('savedPayment')
                setStartDate(null)
                setAddCardLoader(false)
            } else {
                setAddCardLoader(false)
            }
        })
    }

    const handlePayment = (e) => {
        e.preventDefault();

        setPaymentLoader(true)
        const data1 = {
            "user_id": user.id,
            "card_id": selectedKey.card_id,
            "id": id
        }

        ApiClient.post('subscribe', data1).then(res => {
            if (res.success == true) {
                toast.success(res?.message)
                history.push('/dashboard')
                setPaymentLoader(false)
            }
        })
    }

    const handleCardData = () => {
        setLoader(true)


        ApiClient.get(`card/all?user_id=${user?.id}`).then(res => {
            if (res.success == true) {
                setData(res?.data)
                setLoader(false)
            } else {
                setLoader(false)
            }
        })
    }



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'cardNumber' && value.length > 16) {
            return;
        }
        if (name === 'cardCvc' && value.length > 4) {
            return;
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRadioChange = (itm) => {
        setSelectedItem(itm);
    };

    useEffect(() => {
        const initiallySelected = data?.data?.find((itm) => itm.isPrimary);
        if (initiallySelected) {
            setSelectedItem(initiallySelected);
        }
    }, [data]);

    const handleDeleteCard = (token) => {

        ApiClient.delete(`card?id=${token}`).then(res => {
            if (res.success == true) {
                handleCardData()
            }
        })
    }

    useEffect(() => {
        handleCardData()
    }, [])

    useEffect(() => {
        // const initiallySelected = data.find((itm) => itm.isPrimary);
        // if (initiallySelected) {
        //     setSelectedItem(initiallySelected);
        // }
    }, [data]);

    return <>
        <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
            <div className='container '>
                <div className='row'>
                    <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6'>
                        <div className='tabs_payment'>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab !== 'savedPayment' ? 'active' : ''}`}
                                        id='otherPayment-tab'
                                        data-bs-toggle='tab'
                                        data-bs-target='otherPayment'
                                        type='button'
                                        role='tab'
                                        aria-controls='Other'
                                        aria-selected={activeTab === 'otherPayment'}
                                        onClick={() => setActiveTab('otherPayment')}
                                    >Add Other Card</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'savedPayment' ? 'active' : ''}`}
                                        id='savedPayment-tab'
                                        data-bs-toggle='tab'
                                        data-bs-target='savedPayment'
                                        type='button'
                                        role='tab'
                                        aria-controls='Saved'
                                        aria-selected={activeTab === 'savedPayment'}
                                        onClick={() => {
                                            setActiveTab('savedPayment')
                                            handleCardData()
                                        }}
                                    >Saved Cards </button>
                                </li>

                            </ul>
                            {!paymentLoader ? <div className="tab-content" id="myTabContent">

                                {/* other payment form */}
                                {!addCardLoader ? <div
                                    className={`tab-pane fade ${activeTab === 'otherPayment' ? 'show active' : ''}`}
                                    id='otherPayment'
                                    role='tabpanel'
                                    aria-labelledby='otherPayment-tab'
                                >                                    <form className='payment_input_tab' onSubmit={handleSaveData}>
                                        <div className='row'>
                                            <div className='col'>
                                                <div className='form-group'>
                                                    <label>Card Number</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        name='cardNumber'
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        id="" placeholder="" />
                                                </div>
                                            </div>
                                            {summitted && !validateCardNumber(formData.cardNumber) ? <div className="invalid-feedback d-block">cardNumber is not valid</div> : <></>}
                                        </div>
                                        <div className='row'>
                                            <div className='col pr-0'>
                                                <div className='form-group'>
                                                    <label>Card Date</label>
                                                    <DatePicker
                                                        selected={startDate}
                                                        className="form-control quick-radius "
                                                        placeholderText="Select Expiry Date"
                                                        onChange={(date) => setStartDate(date)}
                                                        dateFormat="MM/yy"
                                                        minDate={new Date()}
                                                        showMonthYearPicker
                                                        showFullMonthYearPicker
                                                    />
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='form-group'>
                                                    <label>CVV</label>
                                                    <input
                                                        type="text"
                                                        name='cardCvc'
                                                        className="form-control"
                                                        value={formData.cardCvc}
                                                        onChange={handleInputChange}
                                                        id="" placeholder="" />
                                                </div>
                                                {summitted && !formData.cardCvc ? <div className="invalid-feedback d-block">Cvv is not valid</div> : <></>}
                                            </div>
                                        </div>
                                        {/* <div className='row'>
                                            <div className='col'>
                                                <div className='form-group'>
                                                    <label>Paypal Email</label>
                                                    <input
                                                        type="text"
                                                        name='paypal_email'
                                                        className="form-control"
                                                        value={formData.paypal_email}
                                                        onChange={handleInputChange}
                                                        id="" placeholder="" />
                                                </div>

                                            </div>
                                        </div> */}
                                        <div className='row'>
                                            <div className='col'>
                                                <div className='form-group'>

                                                    <button className='form-control btn btn-primary mt-3' type='submit'>Submit</button>
                                                </div>
                                            </div>

                                        </div>

                                    </form>
                                </div> :
                                    <div className="row"><img src="/assets/img/loader.gif" className="pageLoader" /></div>

                                }

                                {/* saved payment label */}
                                <div
                                    className={`tab-pane fade ${activeTab === 'savedPayment' ? 'show active' : ''}`}
                                    id='savedPayment'
                                    role='tabpanel'
                                    aria-labelledby='savedPayment-tab'
                                >
                                    <div className='saved_payment_tab'>
                                        <div className='row'>
                                            <div className='prme_ount text-center p-3 px-0'>
                                                <h6>Price</h6>
                                                <p>${price}</p>
                                            </div>
                                        </div>
                                        {!Loader ? <div className="row">
                                            {data?.data?.length > 0 ? data?.data?.map((itm) => {
                                                return (
                                                    <div className="col-12 mb-3" key={itm.id}>
                                                        <label className='click_cards'>
                                                            <input
                                                                type="radio"
                                                                name="product"
                                                                className="card-input-element"
                                                                checked={selectedKey === itm}
                                                                onChange={() => handleRadioChange(itm)}
                                                            />
                                                            <div className="panel-body ml-3 d-flex justify-content-between w-100">
                                                                <div className='bank_img'> <img src='assets/img/payment.png' className='img-fluid'></img>  <span>xxxxxxxxxxxx{itm?.card_details.last4}</span></div>

                                                                {!itm?.isPrimary && <span onClick={() => handleDeleteCard(itm?.id)}><i className='fa fa-trash'></i></span>}
                                                            </div>
                                                        </label>
                                                    </div>
                                                );
                                            })
                                                :
                                                <div className='appdata_text'>
                                                    <h5> Please Add Cards </h5>
                                                </div>
                                            }
                                        </div> : <div className="row"><img src="/assets/img/loader.gif" className="pageLoader-card" /></div>}

                                        <div className='row'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div className='cards_Add'>
                                                    <a href="#" onClick={() => setActiveTab('otherPayment')}>
                                                        <i className='fa fa-plus'></i> Add New cards
                                                    </a>
                                                </div>
                                                {data?.data?.length > 0 && <div className='cards_Add'>
                                                    <button className='btn btn-primary form-control' onClick={handlePayment}>Pay Now!</button>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                                <div className="row"><img src="/assets/img/loader.gif" className="pageLoader" /></div>
                            }
                        </div>
                    </div>

                    <div className='col-sm-12 col-md-5 col-lg-6 col-xl-6'>
                        <div className='image_payment'>
                            <img src='assets/img/payment.png' className='img-fluid'></img>
                        </div>
                    </div>


                </div>
            </div>

        </Layout>

    </>
}

export default cards
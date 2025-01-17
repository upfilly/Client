'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import crendentialModel from '@/models/credential.model';
import "react-datepicker/dist/react-datepicker.css";
import Layout from '../components/global/layout';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function BillingForm() {
  const param = useSearchParams()
  const id = param.get('planId')
  const user = crendentialModel.getUser()
  const history = useRouter()
  const [showPopup, setShowPopup] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [aloader, setLoader] = useState(true)
  const [formData, setFormData] = useState({
    status: 'Active',
    currency: 'USD',
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
    payment_method: ''
    // paypal_email: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [inputFocused, setInputFocused] = useState(false)
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [summitted, Setsummitted] = useState(false)
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });
  const [startDate, setStartDate] = useState(null);
  const [data, setData] = useState([])
  const [filters, setFilter] = useState({
    page: 1,
    count: 50,
    search: '',
    isDeleted: false,
    status: ''
  })
  const [selectedId, setSelectedId] = useState(id || null);
  const FilterData = data.filter(event => !event.isUpcoming);
  const [offers,setOffers] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null);
  const specialOfferPrice = offers?.filter((itm)=>itm?._id == selectedOffer)
  const seletedplandata = data?.filter((dat)=>dat?._id == selectedId)
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleSpecialOfferChange = (id) => {
    setSelectedOffer((prevSelected) => (prevSelected === id ? null : id));
  };

  const handleRadioChange = (itemId) => {
    setSelectedId(itemId);
    // history.push(`/bookingForm?planId=${itemId}`)
  };

  console.log(seletedplandata,"seletedplandataseletedplandata")

  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
    return emailRegex.test(email);
  }

  useEffect(() => {
    if (id) {
      handleRadioChange(selectedId)
    }
  }, [])

  useEffect(() => {
    if (user) {
      history.push('/dashboard')
    }
  }, [])

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

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      const city = addressComponents.find((component) =>
        component.types.includes('locality')
      )?.long_name || '';
      const state = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      )?.long_name || '';
      const country = addressComponents.find((component) =>
        component.types.includes('country')
      )?.long_name || '';
      const pincode = addressComponents.find((component) =>
        component.types.includes('postal_code')
      )?.long_name || '';

      const selectedLocation = {
        address: selectedAddress,
        city,
        state,
        country,
        pincode,
        ...latLng,
      };

      setSelectedLocation(selectedLocation);
      setAddress(selectedLocation?.address);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      // console.error('Error:', error);
    }
  }

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };
  // useEffect(() => {
  //   handleSelect()
  // }, [id])

  const handleSave = () => {

    if (!selectedId) {
      Setsummitted(true);
      return;
    }

    if (!formData?.firstName || !formData?.currency) {
      Setsummitted(true);
      return;
    }

    if (!isValidEmail(formData?.email)) {
      Setsummitted(true);
      return;
    }

    // Validate password
    if (!formData.password || formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    loader(true)

    let data = {
      role: "brand",
      request_status:"accepted",
      email: formData?.email,
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      password: formData?.password,
      address: selectedLocation?.address,
      country: selectedLocation?.country,
      state: selectedLocation?.state,
      city: selectedLocation?.city,
      pincode: selectedLocation?.pincode,
      plan_id: selectedId,
      network_plan_amount:seletedplandata?.[0]?.amount,
      managed_services_plan_amount:seletedplandata?.[0]?.amount == 0 ? 0 : specialOfferPrice?.[0]?.amount,
      special_plan_id:seletedplandata?.[0]?.amount == 0 ? null : selectedOffer,
      isSpecial: false,
      interval: "month",
      interval_count: seletedplandata?.[0]?.interval_count,
      device_token: localStorage.getItem("device_token") || ''
    };

    ApiClient.post('register/brand', data).then(res => {
      let userId = res?.data?.id
      const inputDate = new Date(startDate);
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const year = String(inputDate.getFullYear()).slice(-2)

      // const data1 = {
      //   // "card_number": formData?.cardNumber,
      //   // "exp_month": month,
      //   // "exp_year": year,
      //   "plan_id": selectedId,
      //   "user_id": res?.data?.id,
      //   // "cvc": formData?.cardCvc
      // }

      if (res.success == true) {
        setFormData({
          status: 'Active',
          firstName: '',
          currency: 'USD',
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
        })
        if (seletedplandata?.[0]?.amount == 0) {
          loader(false)
          toast.success("Your account is created check your E-mail")
          history.push("/")
        } else {
          window.location.href = res?.data?.url
        }
        // ApiClient.post('create/session', data1).then(res => {
        //   if (res.success == true) {
        //     loader(false)
        //     window.location.href = res?.data?.url
        //     // window.open(res?.data?.url)
        //     // toast.success(res.message)
        //     // const data2 = {
        //     //   "user_id": res?.data?.user_id,
        //     //   "card_id": res?.data?.card_id,
        //     //   "id": selectedId
        //     // }
        //     // ApiClient.post('subscribe', data2).then(res => {
        //     //   if (res.success == true) {

        //     //     setFormData({
        //     //       status: 'Active',
        //     //       currency: '',
        //     //       firstName: '',
        //     //       lastName: '',
        //     //       email: '',
        //     //       website: '',
        //     //       password: '',
        //     //       confirmPassword: '',
        //     //       address: '',
        //     //       cardNumber: '',
        //     //       cardExpiry: '',
        //     //       cardCvc: '',
        //     //       paypal_email: ''
        //     //     })
        //     //     setShowPopup(true)
        //     //     loader(false)
        //     //   } else {
        //     //     ApiClient.delete(`destroy/user?id=${userId}`).then(res => {
        //     //       if (res.success) {
        //     //         toast.error("Payment cannot complete...")
        //     //       }
        //     //       loader(false)
        //     //     })
        //     //   }
        //     // })
        //   } else {
        //     loader(false)
        //     // ApiClient.delete(`destroy/user?id=${userId}`).then(res => {
        //     //   if (res.success) {
        //     //     toast.error("Payment cannot complete...")
        //     //   }
        //     //   loader(false)
        //     // })
        //   }
        // })

      }

    })

    // router.push("/affiliate-form/StageSecStep");
  };

  const handleClick = () => {
    setShowPopup(false)
    let url = '/login'
    history.push(url);
  }

  const getData = (p = {}) => {
    setLoader(true)
    if (!user) {
      let filter = { ...filters, ...p ,category:"Network"}
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setData(res?.data?.data)
          setLoader(false)
        }
      })
    }
  }

  const getOfferData = (p = {}) => {
    setLoader(true)
    if (!user) {
      let filter = { ...filters, ...p ,category:"Managed Services"}
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setOffers(res?.data?.data)
          setLoader(false)
        }
      })
    }
  }

  useEffect(() => {
    getOfferData()
    getData()
  }, [])

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
        <div className='main-affiliate mt-3 mb-0 pt-0'>
          <div className='container'>

            <div>
              <img src="/assets/img/logo.png" className='mx-auto mb-4 pointer logo' onClick={() => history.push('/')} />
              <h2 className='text-center mb-0 select_plans'> Select a plan</h2>
            </div>

          </div>

          {showPopup && (

            <div class="modal d-block">
              <div class="modal-dialog  modal-dialog-centered dateModal" role="document">
                <div class="modal-content text-center">
                  {/* <button type="button" class="close verify" routerLink="/auth/login">
        <span aria-hidden="true">&times;</span> </button> */}

                  <div class="modal-body">
                    <div>
                      <img src="../../../assets/img/logo.png" class="greentik" />
                    </div>
                    <h5 Class="tital mt-5">Plan Purchased Successfully .</h5>
                    {/* <div class="paraclass">
                      We have send you the verification by email.
                    </div> */}

                    <div>
                      <button type="button" class="btn btn-primary " onClick={() => handleClick()} >Ok</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>


          )}
        </div>

        <section className='common-padding'>
          <div className='container'>
            <div className='row'>
              <div className='col-12 col-md-12 col-lg-12 col-xl-8'>
                <div className='card p-0 mb-4'>
                  <div className='card-header '>
                    <h3 className='mb-0 card-title'>Account <span className='subsmal'>Select a plan</span></h3>
                  </div>
                  <div className='card-body'>


                    <div className='row '>
                      {FilterData?.map((itm) => {
                        const calculateDiscountedAmount = (amount, discountDetails) => {
                          if (!discountDetails || !discountDetails.discount_type) {
                            return amount;
                          }

                          if (discountDetails.discount_type === 'flat') {
                            return amount - discountDetails.amount_value;
                          }

                          if (discountDetails.discount_type === 'percentage') {
                            const percentageValue = (amount * discountDetails.amount_value) / 100;
                            return amount - percentageValue;
                          }

                          return amount;
                        }

                        const discountedAmount = calculateDiscountedAmount(itm.amount, itm.discount_details);

                        return <label htmlFor={`exampleRadios${itm._id}`} className=' col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-4'> <div class={selectedId == itm?._id ? "checked_tbn" : "checked_tbn_after"} >
                          <div className='sub-opt form-check pl-0' >



                            <label class="form-check-label " htmlFor={`exampleRadios${itm._id}`}>
                              {itm?.name}
                            </label>

                            <input class="form-check-input  custom-radio"
                              type="radio"
                              name="exampleRadios"
                              id={`exampleRadios${itm._id}`}
                              value={itm.name}
                              checked={selectedId === itm._id}
                              onChange={() => handleRadioChange(itm._id)} />
                          </div>
                          <div className='opt-main_cate'>
                            <ul className='opt-category plan-featuress pl-0'>
                              <div className='additional-info'>
                                <div className='info-item d-flex justify-content-between align-items-center'>
                                  <strong>Basket Value Charge:</strong> 
                                  <p className='mb-0'>{itm.basket_value_charge}%</p>
                                </div>
                                <div className='info-item d-flex justify-content-between align-items-center'>
                                  <strong>Commission Override:</strong> 
                                  <p className='mb-0'>{itm.commission_override}%</p>
                                </div>
                                <div className='info-item d-flex justify-content-between align-items-center'>
                                  <strong>Bonus Override:</strong>
                                  <p className='mb-0'> {itm.bonus_override}%</p>
                                </div>
                                <div className='info-item d-flex justify-content-between align-items-center'>
                                  <strong>Allowed Total Revenue:</strong> 
                                  <p className='mb-0'>{itm.allowed_total_revenue}$</p>
                                </div>
                              </div>
                              {itm?.features?.map((feature) => (
                                <li className='d-flex align-items-center' key={feature.id}>
                                 {itm.features?.[0]?.feature_name && <img
                                    className='checkss'
                                    src='/assets/img/check.png'
                                    alt=''
                                  ></img>}
                                  <p className='ipsi ml-2 mb-0'>{feature.feature_name}</p>
                                </li>
                              ))}
                            </ul>
                            <div className='d-flex  align-items-center amt-desc'>
                              {itm?.discount_details && <p className="textWrong mr-2">{itm?.amount}</p>}
                              <div className='d-flex align-items-center'>
                                <p className='dollarf-sec'>${discountedAmount}</p>
                                <p className='montyh ms-1'> /{itm.billing_frequency} month</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        </label>

                      })}
                    </div>
                    {!selectedId && summitted ? <div className="invalid-feedback d-block">Select a plan</div> : <></>}
                  </div>


                </div>
              </div>

              <div className='col-12 col-md-12 col-lg-12 col-xl-4'>

                {seletedplandata?.[0]?.amount != 0 && <div className='card p-0 mb-4'>
                  <div className='card-header'>
                    <h4 className='card-title'>Special Offers</h4>
                  </div>
                  <div className='card-body'>
                    {offers.map((offer) => (
                      <div key={offer.id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`specialOfferCheckbox-${offer._id}`}
                          checked={selectedOffer === offer._id}
                          onChange={() => handleSpecialOfferChange(offer._id)}
                        />
                        <label className="form-check-label" htmlFor={`specialOfferCheckbox-${offer._id}`}>
                          {offer.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>}
               
                <div className='card p-0 mb-4'>
                  <div className='card-header'>
                    <h4 className='card-title'>Basic Information</h4>
                  </div>

                  <div className='card-body'>
                    <div className='form-row'>
                      {!user && <>

                        <div className='col-12 col-md-6 col-lg-6  '>
                          <div className="form-group">
                            <label className='label-set'>First Name</label>
                            <input
                              type="text"
                              className="form-control quick-radius"
                              placeholder='Enter first name'
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange} />
                            {summitted && !formData.firstName ? <div className="invalid-feedback d-block">First Name is required</div> : <></>}

                          </div>
                        </div>
                        <div className='col-12 col-md-6 col-lg-6'>
                          <div className="form-group">
                            <label className='label-set'>Last Name </label>
                            <input
                              type="text"
                              className="form-control quick-radius"
                              placeholder='Enter last name'
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange} />
                            {summitted && !formData.lastName ? <div className="invalid-feedback d-block">Last Name is required</div> : <></>}

                          </div>
                        </div>
                        <div className='col-12 col-md-6 col-lg-12 '>
                          <div className="form-group">
                            <label className='label-set'>Email </label>
                            <input
                              type="email"
                              className="form-control quick-radius"
                              placeholder='Enter email'
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange} />
                            {summitted && !isValidEmail(formData?.email) ? <div className="invalid-feedback d-block">Email is required</div> : <></>}

                          </div>
                        </div>

                        <div className='col-12 col-md-6 col-lg-12'>
                          <div className="form-group">
                            <label className='label-set'>Password </label>
                            <div className='input-group position-relative'>
                              <input
                                type={eyes.password ? 'text' : 'password'}
                                className="form-control quick-radius password_space"
                                placeholder='Enter password'
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange} />
                              <div className='eye-icon-m'>
                                <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
                              </div>

                            </div>
                            {passwordError && formData.password.length < 8 && <div className="text-danger pass_danger ">{passwordError}</div>}

                          </div>

                        </div>
                        <div className='col-12 col-md-6 col-lg-12'>
                          <div className="form-group">
                            <label className='label-set'>confirm Password </label>
                            <div className='input-group position-relative'>
                              <input
                                type={eyes.confirmPassword ? 'text' : 'password'}
                                className="form-control quick-radius password_space"
                                placeholder='confirm your password'
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange} />
                              <div className='eye-icon-m'>
                                <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
                              </div>
                            </div>
                            {confirmPasswordError && formData.password !== formData.confirmPassword && (
                              <div className="text-danger pass_danger">{confirmPasswordError}</div>
                            )}
                          </div>
                        </div>

                        <div className='col-12 col-md-6 col-lg-6 '>
                          <div className="form-group">
                            <label className='label-set'>Website  </label>
                            <input
                              type="text"
                              className="form-control quick-radius"
                              placeholder='Enter website'
                              id="website"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className='col-12 col-md-6 col-lg-6'>
                          <div className="form-group">
                            <label className='label-set'>Currency </label>
                            <input
                              type="text"
                              className="form-control quick-radius"
                              placeholder='Enter currency'
                              id="currency"
                              name="currency"
                              value={formData.currency}
                              onChange={handleInputChange} />

                            {summitted && !formData.currency ? <div className="invalid-feedback d-block">Currency is required</div> : <></>}

                          </div>

                        </div>
                      </>
                      }
                    </div>
                  </div>


                </div>

                <div className='card p-0 mb-4'>
                  <div className='card-header'>
                    <h4 className='card-title'>Billing Address</h4>
                  </div>
                  <div className='card-body'>
                    <div className='form-row'>
                      <div className='col-12 col-md-12'>
                        <div className='form-group'>
                          <label className='label-set'>Address </label>
                          {!aloader ? (
                            <PlacesAutocomplete
                              value={address}
                              onChange={handleChange}
                              onSelect={handleSelect}
                            >
                              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                  <input
                                    className="form-control quick-radius"
                                    {...getInputProps({
                                      placeholder: 'Enter an address...',
                                      onFocus: () => setInputFocused(true),
                                      onBlur: () => setInputFocused(false),
                                    })}
                                  />
                                  {loading && <div>Loading...</div>}
                                  {suggestions?.map((suggestion) => (
                                    <div className='suggested'>
                                      <div
                                        className='location_address'
                                        {...getSuggestionItemProps(suggestion)}
                                      >
                                        <i className="fa-solid fa-location-dot mr-1"></i> {suggestion.description}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </PlacesAutocomplete>
                          ) : ""}
                        </div>
                      </div>

                      {/* Country, City, Postal Code Fields */}
                      <div className='col-12 col-md-6'>
                        <div className="form-group">
                          <label className='label-set'>Country</label>
                          <input
                            type="text"
                            value={selectedLocation?.country}
                            className="form-control quick-radius"
                          />
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <div className="form-group">
                          <label className='label-set'>City</label>
                          <input
                            type="text"
                            value={selectedLocation?.city}
                            className="form-control quick-radius"
                          />
                        </div>
                      </div>

                      <div className='col-md-12'>
                        <div className="form-group">
                          <label className='label-set'>Postal Code</label>
                          <input
                            type="text"
                            value={selectedLocation?.pincode}
                            onChange={(e) => setSelectedLocation({ ...selectedLocation, pincode: e.target.value })}
                            className="form-control quick-radius"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="form-row">
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="termsCheck"
                            checked={isTermsAccepted}
                            onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                          />
                          <label className="form-check-label" htmlFor="termsCheck">
                            I agree to the <a href="/termsconditions" target="_blank">terms and conditions</a> and 
                            <a href="#"  onClick={handleShowModal}> aggreement</a>.
                          </label>
                          {summitted && !isTermsAccepted && (
                            <div className="invalid-feedback d-block">You must agree to the terms and conditions.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='d-flex justify-content-center gap-3 justify-content-md-end justify-content-lg-center'>
                      <button
                        className='btn btn-primary buy-btn'
                        onClick={handleSave}
                        disabled={!isTermsAccepted}
                      >
                        Buy
                      </button>
                      <button className='btn btn-danger buy-btn ml-2' onClick={() => history.back()}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          </div>
        </section>

        {/* Modal for Terms and Conditions with Google Docs Viewer */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Upfilly Agreement.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <iframe
                src={`/assets/img/AffiliateAgreemnet.pdf`}
                style={{ width: "100%", height: "500px" }}
                frameBorder="0"
              ></iframe>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </Layout>
    </>
  );
}

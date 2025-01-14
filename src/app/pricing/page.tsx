'use client'

import { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../components/global/layout/index';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import datepipeModel from '@/models/datepipemodel';
import loader from '@/methods/loader';
import methodModel from '@/methods/methods';
import { toast } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';

export default function Pricing() {
  const user = crendentialModel.getUser()
  const history = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [FAQdata, setFAQData] = useState([])
  const [filters, setFilter] = useState({
    page: 1,
    count: 50,
    search: '',
    isDeleted: false,
    status: ''
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any>(false)
  const param = useSearchParams()
  const id = param.get("id")
  const [show, setShow] = useState(false);
  const [offers,setOffers] = useState<any>([])
  const [selectedOffer, setSelectedOffer] = useState(null);
  const handleClose = () => { setShow(false) };
  const handleShow = () => setShow(true);

  const specialOfferPrice = offers?.filter((itm:any)=>itm?._id == selectedOffer)?.[0]?.amount

  const handleSpecialOfferChange = (id:any) => {
    setSelectedOffer((prevSelected) => (prevSelected === id ? null : id));
  };

  const getContentData = (p = {}) => {
    let url = 'content'
    ApiClient.get(url, { title: "Pricing" }).then(res => {
      if (res) {
        // setData(res?.data)
        getFaq(res?.data?.id)
      }
    })
  }

  const getFaq = (id: any) => {
    let url = 'faq/all'
    ApiClient.get(url, { content_id: id }).then(res => {
      if (res.success) {
        const data = res?.data?.data;
        setFAQData(data)
      }
    })
  }

  const getOfferData = (p = {}) => {
    setLoader(true)
      let filter = { category:"Managed Services"}
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setOffers(res?.data?.data)
          setLoader(false)
        }
      })
  }

  useEffect(() => {
    getOfferData()
    getContentData()
  }, [])

  // const getFaq = (p = {}) => {
  //   let url = 'faq/all'
  //   ApiClient.get(url).then(res => {
  //     if (res.success) {
  //       const data = res?.data?.data;
  //       setFAQData(data)
  //     }
  //   })
  // }

  // useEffect(() => {
  //   getFaq()
  // }, [])

  const handleAutologin = () => {
    loader(true)
    ApiClient.post('user/auto-login', { "id": id }).then(res => {
      if (res.success == true) {
        crendentialModel?.setUser(res?.data)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('addedUser', JSON.stringify(res?.data?.addedBy))
        // let url = '/dashboard'
        // history.push(url);
        // window.location.assign('')
        window.location.reload();
      }
      loader(false)
    })
  };

  useEffect(() => {
    if (id && !user) {
      handleAutologin()
    }
  }, [id])

  if (user?.role == "affiliate") {
    history.push('/')
  }

  const getData = (p = {}) => {
    setLoader(true)
    if (!user) {
      let filter = { ...filters, ...p, category: "Network" }
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setData(res?.data?.data)
          setTotal(res?.data?.total_count)
        }
        setLoader(false)
      })
    }

    if (user) {
      let filter = { ...filters, ...p, userId: user?.id, category: "Network" }
      let url = 'subscription-plan/all'
      ApiClient.get(url, filter).then(res => {
        if (res) {
          setData(res?.data?.data)
          setTotal(res?.data?.total_count)
        }
        setLoader(false)
      })
    }
  }

  const filteredPlans = data?.filter((item: any) => {
    if (!selectedPlan) {
      return item?.interval_count === 1;
    } else {
      return item?.interval_count === 12;
    }
  });

  // const sortedData = filteredPlans?.sort((a: any, b: any) => {
  //   if (a.isUpcoming == b.isUpcoming) {
  //     return b.amount - a.amount;
  //   }
  //   return a.isUpcoming ? -1 : 1;
  // })

  const sortedData = filteredPlans?.sort((a: any, b: any) => {
    if (a.recommended === 'Y' && b.recommended === 'N') return -1;
    if (a.recommended === 'N' && b.recommended === 'Y') return 1;

    return a.amount - b.amount;
  });


  const ChangePlan = (dat: any) => {
    const data1 = {
      // "card_number": formData?.cardNumber,
      // "exp_month": month,
      // "exp_year": year,
      // "plan_id":id,
      // "user_id": user?.id,
      // "cvc": formData?.cardCvc
      "network_plan_amount": dat?.amount,
      "managed_services_plan_amount": 0,
      "interval": "month",
      "interval_count": dat?.interval_count,
      "isSpecial": false,
      "planId": dat?.id || dat?._id,
      "promoId": "",
      "special_plan_id": null
    }
    // ApiClient.post('create/session', data1).then(res => {
    ApiClient.post('subscribe', data1).then(res => {
      if (res.success == true) {
        loader(false)
        if (dat?.amount == 0) {
          toast.success(res?.message)
          getData()
        } else {
          window.location.href = res?.data?.url
        }
        //  window.open(res?.data?.url)
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className='container   '>
        <div className="row  ">
          <div className="col-12  ">

            <div className='pricing-list pricing-padding'>
              <div className='title-pricing'>
                {!user?.isPayment && user && <h5 className='text-center '>Note : <span className='noPlan'>You Don't have any Active Plan</span></h5>}
                <div className='main-title text-center mb-3'>
                  <h1 className=' '>Price & Plans</h1>
                </div>
                <p className='text-center printit'>UpFilly offers a range of flexible pricing plans designed to scale with your business needs. The plans include monthly platform fees and basket value charges based on revenue generation.</p>

              </div>
              <div className=''>
                <div className="row">
                  <div className="col-md-12 mb-5 mt-4">
                    <div className="monthalu_plan d-flex">
                      <h3>Monthly Plan</h3>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={selectedPlan}
                          onChange={() => setSelectedPlan(!selectedPlan)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <h3>Annual Plan</h3>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {sortedData?.map((itm: any) => {
                    const activePlans: any = data.filter((plan: any) => plan.isActive);
                    const upcomingDate = new Date(itm?.upcoming_date)
                    const currentDate = new Date()
                    const showCard = (upcomingDate >= currentDate);
                    const calculateDiscountedAmount = (amount: any, discountDetails: any) => {
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

                    return (

                      <div className=" col-12 col-sm-12 col-md-6 col-lg-4 mt-4" key={itm._id}>
                        <div className={itm.recommended === "Y" && !user?.isPayment ? "card quicksf card_height p-4" : "card card_height quickss p-4 h-100"}>
                          <div className='card_highjt'>
                            <div className='d-flex justify-content-between align-items-center'>
                              {(itm?.isUpcoming && showCard) && <div className="avtive_badges"><p className='mb-0 upcoming-plan'>Upcoming Plan <span className='d-block date-activeplan'>{`(${datepipeModel.date(itm?.upcoming_date)})`}</span> </p>

                              </div>}
                              {itm.recommended === "Y" && !user?.isPayment && <div className="avtive_badges">MOST POPULAR</div>}
                              <div>
                                <h1 className={itm.recommended === "Y" && !user?.isPayment ? 'triel-city locks' : 'triel-city '}>{methodModel.capitalizeFirstLetter(itm.name)}</h1>
                              </div>
                              {/* {itm.payment_type === "recurring" && ( */}
                              <div className='text-end'>
                                <div className='text_wrong d-flex justify-content-between align-items-center'>
                                  {itm?.discount_details && <p className="textWrong mr-2">{itm?.amount}</p>}
                                  <p className={itm.recommended === "Y" && !user?.isPayment ? 'dollarf-sec locks' : 'dollarf-sec '}>${discountedAmount}</p>
                                </div>
                                <p className={itm.recommended === "Y" && !user?.isPayment ? 'montyh locks' : 'montyh '}>for {itm.billing_frequency} month</p>
                              </div>
                              {/* )} */}
                              {itm.payment_type === "trial" && (
                                <div className='text-end'>
                                  <div className='text_wrong d-flex justify-content-between align-items-center'>
                                    {itm?.discount_details && <p className="textWrong mr-2">{itm?.amount}</p>}
                                    <p className={itm.recommended === "Y" && !user?.isPayment ? 'dollarf-sec locks' : 'dollarf-sec '}>${discountedAmount}</p>
                                  </div>
                                  <p className={itm.recommended === "Y" && !user?.isPayment ? 'montyh locks' : 'montyh '}>for {itm.trial_period_days} days</p>
                                </div>
                              )}
                            </div>

                            <hr className='bgs'></hr>
                            <p className={itm.recommended === "Y" && !user?.isPayment ? 'includes-plan locks' : 'includes-plan '}>Plan includes</p>
                            <div className='additional-info'>
                              <div className='info-item d-flex align-items-center justify-content-between'>
                                <strong>Basket Value Charge:</strong> 
                                <p className='mb-0'>{itm.basket_value_charge}</p>
                              </div>
                              <div className='info-item d-flex align-items-center justify-content-between'>
                                <strong>Commission Override:</strong>
                                <p className='mb-0'>{itm.commission_override}</p> 
                              </div>
                              <div className='info-item d-flex align-items-center justify-content-between'>
                                <strong>Bonus Override:</strong>
                                <p className='mb-0'>{itm.bonus_override}</p> 
                              </div>
                              <div className='info-item d-flex align-items-center justify-content-between'>
                                <strong>Allowed Total Revenue:</strong> 
                                <p className='mb-0'>{itm.allowed_total_revenue}</p>
                              </div>
                            </div>
                            {<div className='plan-features'>
                              {itm.features.map((feature: any) => (
                                <div className='d-flex align-items-center mt-3 flex_list' key={feature.id}>
                                  {itm.features?.[0]?.feature_name && <img
                                    className={itm.recommended === "Y" && !user?.isPayment ? 'checkss locks check_list' : 'checkss check_list '}
                                    src={itm.recommended === "Y" && !user?.isPayment ? '/assets/img/checkmark.png' : '/assets/img/check.png'}
                                    alt=''
                                  ></img>}
                                  <p className={itm.recommended === "Y" && !user?.isPayment ? 'ipsi ml-3 locks' : 'ipsi ml-3 '}>{methodModel.capitalizeFirstLetter(feature.feature_name)}</p>
                                </div>
                              ))}
                            </div>}

                          </div>
                          <div className='mt-4'>
                            {(!showCard && !itm.isUpcoming && !user && !user?.isPayment) && <a className='demos-button w-100 form-control book-demo' onClick={() => { !user ? history.push(`/bookingForm?planId=${itm._id}`) : ChangePlan(itm) }}>Book a Demo</a>}
                            {!showCard && !itm.isUpcoming && !user?.isPayment && user && <a className='demos-button w-100 form-control book-demo'
                              // href={user ? `/cards?id=${itm._id}&price=${itm?.amount}` : `/bookingForm/${itm._id}`}
                              onClick={() => ChangePlan(itm)}>Buy a Plan</a>}
                            {!showCard && !itm.isUpcoming && user && !itm.isActive && user?.isPayment && (
                              <a className='demos-button w-100 form-control' onClick={() => ChangePlan(itm)}>
                                {parseInt(itm.amount) <= parseInt(activePlans[0]?.amount) ? "Buy" : "Upgrade"}
                              </a>
                            )}
                            {(!showCard && !itm.isUpcoming && user && itm.isActive) && <Link className='demos-button w-100 form-control    ' href='#'>Active</Link>}
                            {(showCard && itm.isUpcoming) && <span className=''></span>}
                            {(!showCard && itm.isUpcoming && !user && !user?.isPayment) && <a className='demos-button w-100 form-control book-demo' onClick={() => { !user ? history.push(`/bookingForm?planId=${itm._id}`) : ChangePlan(itm) }}>Book a Demo</a>}
                            {(!showCard && itm.isUpcoming && user && !user?.isPayment && user) && <a className='demos-button w-100 form-control book-demo' onClick={() => ChangePlan(itm)}>Buy a Plan</a>}
                            {(!showCard && itm.isUpcoming) && user && !itm.isActive && user?.isPayment && (
                              <a className='demos-button w-100 form-control' onClick={() => ChangePlan(itm)}>
                                {parseInt(itm.amount) <= parseInt(activePlans[0]?.amount) ? "Buy" : "Upgrade"}
                              </a>
                            )}
                            {(!showCard && itm.isUpcoming && user && itm.isActive) && <Link className='demos-button w-100 form-control    ' href='#'>Active</Link>}
                          </div>
                        </div>
                      </div>

                    )

                  })}
                </div>
              </div>
            </div>


            <div className='truste pricing-padding'>
              <div className='main-title text-center'>
                <h1 className=' '>Trusted by industry leaders</h1>
              </div>

              <div className='row mt-4'>

                <div className='col-6 col-md-3 text-center'>
                  <img className='rankeds' src='/assets/img/ora-1.png' alt=''></img>
                </div>
                <div className='col-6 col-md-3 text-center'>
                  <img className='rankeds' src='/assets/img/ora-2.png' alt=''></img>
                </div>
                <div className='col-6 col-md-3 text-center'>
                  <img className='rankeds' src='/assets/img/ora-3.png' alt=''></img>
                </div>
                <div className='col-6 col-md-3 text-center'>
                  <img className='rankeds' src='/assets/img/ora-4.png' alt=''></img>
                </div>
              </div>
            </div>

            <div className="bg_tracked pricing-padding">
              <div className="row align-items-center">
                <div className="col-md-6 ">
                  <div className="mb-4">

                    <h1 className='customers'>Customers <br />tracked in 2023 <br />more than +3M </h1>
                    {(user?.role == "affiliate" || !user) && <Link className=' btn btn-light ' href="/pricing">Book a Demo</Link>}

                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-white text-black p-4 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="41" viewBox="0 0 43 41" fill="none">
                      <path opacity="0.15" d="M24.42 38.8719V31.7199C24.4199 31.489 24.4653 31.2604 24.5536 31.047C24.6419 30.8337 24.7713 30.6398 24.9346 30.4765C25.0979 30.3133 25.2917 30.1838 25.5051 30.0955C25.7184 30.0072 25.9471 29.9618 26.178 29.9619C29.64 29.9619 31.524 26.4109 31.786 19.4009H26.177C25.7116 19.4007 25.2653 19.2159 24.936 18.8871C24.6066 18.5583 24.4211 18.1123 24.42 17.6469V2.53193C24.42 2.30111 24.4655 2.07255 24.5538 1.85932C24.6422 1.64609 24.7717 1.45235 24.935 1.28919C25.0982 1.12602 25.292 0.996621 25.5053 0.908382C25.7186 0.820144 25.9472 0.774795 26.178 0.774926H41.128C41.5941 0.774926 42.0411 0.960007 42.3707 1.28948C42.7004 1.61895 42.8857 2.06585 42.886 2.53193V17.6419C42.9164 20.7263 42.579 23.8034 41.881 26.8079C41.286 29.394 40.229 31.8514 38.761 34.0619C37.4058 36.0763 35.5886 37.7374 33.461 38.9069C31.2171 40.0832 28.7131 40.6758 26.18 40.6299C25.949 40.6302 25.7201 40.5849 25.5066 40.4967C25.2931 40.4085 25.0991 40.279 24.9356 40.1157C24.7722 39.9525 24.6425 39.7586 24.554 39.5451C24.4655 39.3317 24.42 39.103 24.42 38.8719ZM1.757 29.9589C1.29119 29.9589 0.84444 30.1439 0.514967 30.4732C0.185494 30.8025 0.000265403 31.2491 2.84602e-07 31.7149V38.8729C0.000530323 39.3386 0.185876 39.785 0.51532 40.114C0.844764 40.4431 1.29136 40.6279 1.757 40.6279C4.28982 40.6738 6.79343 40.0812 9.037 38.9049C11.1651 37.7362 12.9825 36.0749 14.337 34.0599C15.8059 31.8493 16.8632 29.3915 17.458 26.8049C18.1547 23.7996 18.4904 20.7218 18.458 17.6369V2.53093C18.4577 2.06485 18.2724 1.61795 17.9427 1.28848C17.6131 0.959006 17.1661 0.773926 16.7 0.773926H1.757C1.2911 0.774191 0.84435 0.959388 0.514906 1.28883C0.185462 1.61828 0.000265229 2.06502 2.84602e-07 2.53093V17.6369C-0.000131085 17.8677 0.0452181 18.0963 0.133457 18.3096C0.221696 18.5229 0.351094 18.7167 0.51426 18.88C0.677426 19.0432 0.87116 19.1727 1.08439 19.2611C1.29763 19.3494 1.52618 19.3949 1.757 19.3949H7.286C7.028 26.4069 5.171 29.9589 1.757 29.9589Z" fill="black" />
                    </svg>

                    <p className='mt-4 mb-4 pb-4 border-bottom'>"We are thrilled to be part of this incredible growth! Over 3 million customers tracked in 2023 alone, showcasing the value and trust our service brings to users across the globe. Their satisfaction and success are what drive us to continue innovating and improving."</p>
                    <div className="d-flex align-items-center">
                      <img src='/assets/img/person.jpg' className='icon_user' alt="Customer" />
                      <div className='ml-2 line_height_user'>
                        <b>Sarah Williams</b> <br />
                        <small>Los Angeles, USA</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='syas pricing-padding'>
              <div className='main-title text-center'>
                <h1 className='abouts mb-0 '>What Our Customers Say</h1>
              </div>

              <div className='row'>
                <div className=' col-12 col-sm-12  col-md-6 col-lg-4'>
                  <div className='card set-bg p-4 mb-4'>
                    <div>
                      <i className="fa fa-quote-right df" aria-hidden="true"></i>
                    </div>

                    <p className='types'>"I've been using this service for months, and it has never disappointed. The team is professional, and the results are always top-notch. I highly recommend them to anyone looking for reliable and efficient service."</p>
                    <hr className='bgs'></hr>
                    <div className='d-flex align-items-center'>
                      <img src='/assets/img/person.jpg' className='icon_user' alt="Customer" />
                      <div>
                        <h3 className='person-name ml-3'>John Doe</h3>
                        <p className='city-locatio ml-3'>New York, USA</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=' col-12 col-sm-12  col-md-6 col-lg-4'>
                  <div className='card set-bg p-4 mb-4'>
                    <div>
                      <i className="fa fa-quote-right df" aria-hidden="true"></i>
                    </div>

                    <p className='types'>"This company has exceeded my expectations. The customer service is exceptional, and their attention to detail is unmatched. I will continue to be a loyal customer for years to come!"</p>
                    <hr className='bgs'></hr>
                    <div className='d-flex align-items-center'>
                      <img src='/assets/img/person.jpg' className='icon_user' alt="Customer" />
                      <div>
                        <h3 className='person-name ml-3'>Jane Smith</h3>
                        <p className='city-locatio ml-3'>Los Angeles, USA</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=' col-12 col-sm-12  col-md-6 col-lg-4'>
                  <div className='card set-bg p-4 mb-4'>
                    <div>
                      <i className="fa fa-quote-right df" aria-hidden="true"></i>
                    </div>

                    <p className='types'>"I've tried many similar services, but none have come close to the level of professionalism and quality I receive here. They truly understand customer needs and always go the extra mile. Highly recommend!"</p>
                    <hr className='bgs'></hr>
                    <div className='d-flex align-items-center'>
                      <img src='/assets/img/person.jpg' className='icon_user' alt="Customer" />
                      <div>
                        <h3 className='person-name ml-3'>Mark Johnson</h3>
                        <p className='city-locatio ml-3'>Chicago, USA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className='last-sec pricing-padding'>
              {/* <div className='main-title text-center mb-0'>
                <h1 className='customers mb-0'>Frequent Asked Questions</h1>
              </div> */}

              <div className="accordion " id="accordionExample">
                <div className="row">
                  {FAQdata ? <>{FAQdata?.map((itm: any, index) => {
                    if (index <= 2) {
                      return <div key={itm?._id} className="col-md-6">
                        <div className="accordion-item mb-3">
                          <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseTwo-${index}`} aria-expanded="false" aria-controls={`collapseTwo-${index}`}>
                              {itm?.question}
                            </button>
                          </h2>
                          <div id={`collapseTwo-${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                              <p dangerouslySetInnerHTML={{ __html: itm?.answer }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  })}</>
                    :
                    <><p>No Question for now</p></>
                  }
                </div>



              </div>

              {/* <div className='row'>
                <div className="accordion " id="accordionExample">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="accordion-item mb-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Lorem Ipsum is simply dummy text of the printing?
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="accordion-item mb-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Lorem Ipsum is simply dummy text of the printing?
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="accordion-item mb-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Lorem Ipsum is simply dummy text of the printing?
                          </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                </div>
              </div> */}


            </div>
          </div>

        </div>


        {showPopup && (

          <div className="modal d-block">
            <div className="modal-dialog  dateModal" role="document">
              <div className="modal-content text-center">
                <div className="modal-body">
                  <div>
                    <img src="../../../assets/img/logo.png" className="greentik" />
                  </div>
                  <h5 className="tital mt-5">Alert .</h5>
                  <div className="paraclass">
                    Please purchase a plan First to continue...
                  </div>

                  <div>
                    <button type="button" className="btn btn-primary" onClick={() => setShowPopup(false)} >Ok</button>
                  </div>
                </div>

              </div>
            </div>
          </div>


        )}
      </div>

      {/* special Offer */}
      {/* <Modal show={show} onHide={handleClose} className="shadowboxmodal">
        <Modal.Header className='align-items-center' closeButton>
          <h5 className='modal-title'>Select Special Offers</h5>
        </Modal.Header>
        <Modal.Body>
          {offers.map((offer:any) => (
            <div key={offer._id} className="form-check">
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
          <div className='d-flex align-items-center justify-content-end'>
            <button className='' onClick={()=>ChangePlan()}>
              Buy Plan
            </button>
          </div>
        </Modal.Body>
      </Modal> */}
    </Layout>
  );
}

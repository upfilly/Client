'use client'

import React, { useState, useEffect } from 'react';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './profile.scss';
import methodModel from '@/methods/methods';
import crendentialModel from '@/models/credential.model';
import Link from 'next/link';
import Layout from '../components/global/layout/index';
import { useRouter } from 'next/navigation';
import { Modal, Button, Form } from 'react-bootstrap';

const Profile = () => {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [data, setData] = useState<any>();
  const [Id, setId] = useState<any>('')
  const [show, setShow] = useState(false);
  const [ActivityData,setActivityData] = useState([])
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const gallaryData = (id: any) => {
    loader(true)
    ApiClient.get(`user/detail`, { id: id }).then(res => {
      if (res.success) {
        setData(res.data)
        if (res?.data?.activeUser)
          crendentialModel?.setUser(res?.data)
      }
      loader(false)

    })
  };

  const activityLogsData = (id: any) => {
    loader(true)
    ApiClient.get(`getallactivities`, { parentUserId: id }).then(res => {
      if (res.success) {
        setActivityData(res.data)
      }
    })
  };

  const handleSwitchUser = (id: any) => {
    loader(true)
    ApiClient.put(`changeactiveuser`, { id: id }).then(res => {
      if (res.success) {
        gallaryData(id)
        setId(id)
      }
      loader(false)

    })
  }

  useEffect(
    () => {
      if (user) {
        gallaryData(user?.activeUser?.id || user?.id || user?._id);
        activityLogsData(user?.activeUser?.id || user?.id || user?._id)
      }
    },
    []
  );

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="pprofile1  edit-profile-page my-5">
        <div className='container ' >
          <div className='row'>
            <div className="col-12 col-sm-12 col-md-12  col-lg-12">
              <div className="form-row flex-md-column-reverse flex-lg-row">
                <div className="col-12 col-sm-12 col-md-12  col-lg-4 ">

                  {/* <label>Image</label> */}

                  {/* <div className="  d-flex justify-content-center align-items-center profileimage ">
                    <img src={methodModel.userImg(data && data?.image)} className="profileImage" />
                  </div> */}


                  <div className="box_div">
                    <div className="user-profile_scroller ">
                      {data?.listOfOtherUsers.map((itm: any) => {

                        return <div >
                          {/* <input type="radio" className='radio_users ' checked={itm?.user_id == user?.activeUser?.id ? true : false} /> */}

                          <label className="custom-radio m-0 mb-3 d-flex gap-2 align-items-center users_detialsbx" onClick={() => handleSwitchUser(itm?.user_id)}>
                            <div>
                              <input type="radio" name="radio-option" checked={itm?.user_id == user?.activeUser?.id ? true : false} />
                              <span className="radio-btn"></span>
                            </div>
                            <img src={methodModel.userImg(data && data?.image)} className="profileUsers" />
                            <div>
                              <p className='users_names '> {itm?.firstName} {itm?.lastName}</p>
                              <p className='users_emails '>        {itm?.email}</p>
                            </div>
                          </label>
                        </div>
                      })}
                    </div>
                  </div>

                </div>
                {data?.activeUser ?
                  <div className='col-12 col-sm-12 col-md-12  col-lg-8  '>
                    <div className='card p-3 rounded-3 mb-4 ' >
                      <div className="d-flex justify-content-between align-items-center flex-wrap basic_info ">
                        <div className='main_title_head'>
                          <h3 className=''>Basic Information </h3>
                        </div>
                        <div className='d-flex gap-3 align-items-center' >
                          {(user?.activeUser?.role == "affiliate" || user?.activeUser?.role == "brand") && <Link href="/profile/edit" className="btn btn-primary profiles">
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            Edit Profile
                          </Link>}
                          <button className="btn btn-primary profiles" onClick={handleShow}>
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            See Activity Logs
                          </button>
                          {user?.addedBy && <a className='edit_icon action-btn' onClick={() => {
                            history.push(`/chat`)
                            localStorage.setItem("chatId", user?.addedBy)
                          }}>
                            <i className='fa fa-comment-o text-white'></i>
                          </a>}
                        </div>
                      </div>
                      {/* <hr /> */}
                      <div className=" row align-items-center ">


                        <div className="col-12 col-sm-12 col-md-12">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className=' inputFlexs width400'>
                                <label>Name:</label>
                                <div>
                                  <p className="profile_data">{data && methodModel.capitalizeFirstLetter(data?.activeUser?.fullName)}</p>
                                </div>
                              </div>

                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400'>
                                <label>Email:</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.email}</p>
                                </div>
                              </div>

                            </div>
                            {data?.address &&
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
                                <div className='inputFlexs width400'>
                                  <label >Address:</label>
                                  <p className="profile_data">{data && data?.activeUser?.address}</p>
                                </div>
                              </div>}

                            {data?.affiliate_group_name &&
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                                <div className='inputFlexs width400'>
                                  <label>Affiliate Group:</label>
                                  <div>
                                    <p className="profile_data">{data && data?.activeUser?.affiliate_group_name}</p>
                                  </div>
                                </div>

                              </div>}

                          </div>
                        </div>




                        {data?.activeUser?.category_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Category Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.category_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.parter_manager_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Parter Manager Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.parter_manager_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.account_executive_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Account Executive Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.account_executive_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.address2 &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                            <div className='inputFlexs width400'>
                              <label>Address 2:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.address2}</p>
                              </div>
                            </div>

                          </div>}


                        {data?.dialCode && data?.mobileNo &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Mobile No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.dialCode}) {data && data?.activeUser?.mobileNo}</p>
                              </div>
                            </div>
                          </div>}

                        {data?.cellDialCode && data?.work_phone &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Work No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.cellDialCode}) {data && data?.activeUser?.work_phone}</p>
                              </div>
                            </div>
                          </div>}

                        {data?.brand_name && data?.mobileNo && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                          <div className='inputFlexs width400' >
                            <label>Brand Name</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.brand_name}</p>
                            </div>
                          </div>
                        </div>}

                        {data?.language && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                          <div className='inputFlexs width400' >
                            <label>Language</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.language}</p>
                            </div>
                          </div>
                        </div>}

                        {data?.reffering_affiliate && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                          <div className='inputFlexs width400'>
                            <label>Brand Email:</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.reffering_affiliate}</p>
                            </div>
                          </div>

                        </div>}


                        {
                          <>


                            {data?.social_media_platforms?.length > 0 && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                              <div className='inputFlexs width400'>
                                <label >Social Media</label>
                                <div className='d-flex wraps'>
                                  {data?.activeUser?.social_media_platforms?.map((item: any, index: any, array: any) =>
                                    <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p>
                                  )
                                  }

                                </div>
                              </div>
                            </div>}

                            {data?.tags?.length > 0 && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400'>
                                <label >Tags:</label>
                                <div className='d-flex wraps'>
                                  {data?.activeUser?.tags?.map((item: any, index: any, array: any) =>
                                    <div key={item} className="profile_data_wrapper">
                                      <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p></div>
                                  )

                                  }

                                </div>
                              </div>
                            </div>}

                            {data?.tax_detail && data?.default_invoice_setting && data?.payment_method && <div className="col-md-12 ">
                              <div className='main_title_head_bill'>
                                <h3>Billing Detail</h3>
                              </div>
                            </div>}

                            {/* {data?.tax_detail && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                   <div className='inputFlexs width400' >
                     <label>Tax Detail</label>
                     <div>
                       <p className="profile_data">{data && data?.tax_detail}</p>
                     </div>
                   </div>
                 </div>} */}

                            {data?.default_invoice_setting && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Default Invoice </label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.default_invoice_setting}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.accountholder_name && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Account Holdername</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.accountholder_name}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.routing_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Routing Number</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.routing_number}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.account_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Account Number</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.account_number}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.ssn_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>SSN Number</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.ssn_number}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.company_name && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Company Name</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.company_name}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.payment_method && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Payment Method</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.payment_method}</p>
                                </div>
                              </div>
                            </div>}


                            <div className="">
                              <div className="row mt-2">

                                {data?.instagram_username && data?.instagram_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links '>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/instagram.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Instagram</label>
                                        <p className="profile_data name_space">User Name : <b>{data?.instagram_username}</b></p>
                                        <div>
                                          <p className="profile_data name_space ">Link : <b>{data?.instagram_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}


                                {data?.linkedin_username && data?.linkedin_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links'>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/linkedin.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Linkedin</label>
                                        <p className="profile_data name_space">User Name : <b>{data?.linkedin_username}</b></p>
                                        <div>
                                          <p className="profile_data ">Link : <b>{data?.linkedin_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}


                                {data?.twitter_username && data?.twitter_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links'>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/twitter.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Twitter</label>
                                        <p className="profile_data name_space">User Name : <b>{data?.twitter_username}</b></p>
                                        <div>
                                          <p className="profile_data ">Link : <b>{data?.twitter_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}


                                {data?.youtube_username && data?.youtube_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links'>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/youtub.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Youtube</label>
                                        <p className="profile_data name_space">Username : <b>{data?.youtube_username}</b></p>
                                        <div>
                                          <p className="profile_data ">Link : <b>{data?.youtube_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}

                              </div>
                            </div>
                          </>
                        }

                      </div>
                    </div>
                  </div>

                  : <div className='col-12 col-sm-12 col-md-7  col-lg-7  '>
                    <div className='card p-3 rounded-3 ' >
                      <div className="d-flex justify-content-between align-items-center flex-wrap basic_info ">
                        <div className='main_title_head'>
                          <h3 className=''>Basic Information </h3>
                        </div>
                        <div className='d-flex gap-3 align-items-center' >
                          <Link href="/profile/edit" className="btn btn-primary profiles">
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            Edit Profile
                          </Link>
                          {user?.addedBy && <a className='edit_icon action-btn' onClick={() => {
                            history.push(`/chat`)
                            localStorage.setItem("chatId", user?.addedBy)
                          }}>
                            <i className='fa fa-comment-o text-white'></i>
                          </a>}
                        </div>
                      </div>
                      {/* <hr /> */}
                      <div className=" row align-items-center ">


                        <div className="col-12 col-sm-12 col-md-12">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className=' inputFlexs width400'>
                                <label>Name:</label>
                                <div>
                                  <p className="profile_data">{data && methodModel.capitalizeFirstLetter(data?.activeUser?.firstName || data?.firstName)}</p>
                                </div>
                              </div>

                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400'>
                                <label>Email:</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.email || data?.email}</p>
                                </div>
                              </div>

                            </div>
                            {data?.address &&
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
                                <div className='inputFlexs width400'>
                                  <label >Address:</label>
                                  <p className="profile_data">{data && data?.activeUser?.address || data?.address}</p>
                                </div>
                              </div>}

                            {data?.affiliate_group_name &&
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                                <div className='inputFlexs width400'>
                                  <label>Affiliate Group:</label>
                                  <div>
                                    <p className="profile_data">{data && data?.activeUser?.affiliate_group_name || data?.affiliate_group_name}</p>
                                  </div>
                                </div>

                              </div>}

                          </div>
                        </div>




                        {data?.category_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Category Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.category_name || data?.category_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.parter_manager_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Parter Manager Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.parter_manager_name || data?.parter_manager_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.account_executive_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Account Executive Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.account_executive_name || data?.account_executive_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.address2 &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                            <div className='inputFlexs width400'>
                              <label>Address 2:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.address2 || data?.address2}</p>
                              </div>
                            </div>

                          </div>}


                        {data?.dialCode && data?.mobileNo &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Mobile No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.dialCode || data?.dialCode}) {data && data?.activeUser?.mobileNo || data?.mobileNo}</p>
                              </div>
                            </div>
                          </div>}

                        {data?.cellDialCode && data?.work_phone &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Work No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.cellDialCode || data?.cellDialCode}) {data && data?.activeUser?.work_phone || data?.work_phone}</p>
                              </div>
                            </div>
                          </div>}

                        {data?.brand_name && data?.mobileNo && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                          <div className='inputFlexs width400' >
                            <label>Brand Name</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.brand_name || data?.brand_name}</p>
                            </div>
                          </div>
                        </div>}

                        {data?.language && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                          <div className='inputFlexs width400' >
                            <label>Language</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.language || data?.language}</p>
                            </div>
                          </div>
                        </div>}

                        {data?.reffering_affiliate && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                          <div className='inputFlexs width400'>
                            <label>Brand Email:</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.reffering_affiliate || data?.reffering_affiliate}</p>
                            </div>
                          </div>

                        </div>}


                        {
                          <>


                            {data?.social_media_platforms?.length > 0 && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                              <div className='inputFlexs width400'>
                                <label >Social Media</label>
                                <div className='d-flex wraps'>
                                  {data?.activeUser?.social_media_platforms?.map((item: any, index: any, array: any) =>
                                    <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p>
                                  )
                                  }
                                  ||
                                  {data?.social_media_platforms?.map((item: any, index: any, array: any) =>
                                    <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p>
                                  )
                                  }
                                </div>
                              </div>
                            </div>}

                            {data?.tags?.length > 0 && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400'>
                                <label >Tags:</label>
                                <div className='d-flex wraps'>
                                  {data?.activeUser?.tags?.map((item: any, index: any, array: any) =>
                                    <div key={item} className="profile_data_wrapper">
                                      <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p></div>
                                  )

                                  }
                                  ||
                                  {data?.tags?.map((item: any, index: any, array: any) =>
                                    <div key={item} className="profile_data_wrapper">
                                      <p className="profile_data">{item} {index !== array.length - 1 && <span>,</span>}</p></div>
                                  )

                                  }
                                </div>
                              </div>
                            </div>}

                            {data?.tax_detail && data?.default_invoice_setting && data?.payment_method && <div className="col-md-12 ">
                              <div className='main_title_head_bill'>
                                <h3>Billing Detail</h3>
                              </div>
                            </div>}

                            {/* {data?.tax_detail && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>Tax Detail</label>
                        <div>
                          <p className="profile_data">{data && data?.tax_detail}</p>
                        </div>
                      </div>
                    </div>} */}

                            {data?.default_invoice_setting && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Default Invoice </label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.default_invoice_setting || data?.default_invoice_setting}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.accountholder_name && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Account Holdername</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.accountholder_name || data?.accountholder_name}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.routing_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Routing Number</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.routing_number || data?.routing_number}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.account_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Account Number</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.account_number || data?.account_number}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.ssn_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>SSN Number</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.ssn_number || data?.ssn_number}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.company_name && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Company Name</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.company_name || data?.company_name}</p>
                                </div>
                              </div>
                            </div>}

                            {data?.payment_method && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400' >
                                <label>Payment Method</label>
                                <div>
                                  <p className="profile_data">{data && data?.activeUser?.payment_method || data?.payment_method}</p>
                                </div>
                              </div>
                            </div>}


                            <div className="">
                              <div className="row mt-2">

                                {data?.instagram_username && data?.instagram_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links '>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/instagram.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Instagram</label>
                                        <p className="profile_data name_space">User Name : <b>{data?.instagram_username}</b></p>
                                        <div>
                                          <p className="profile_data name_space ">Link : <b>{data?.instagram_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}


                                {data?.linkedin_username && data?.linkedin_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links'>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/linkedin.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Linkedin</label>
                                        <p className="profile_data name_space">User Name : <b>{data?.linkedin_username}</b></p>
                                        <div>
                                          <p className="profile_data ">Link : <b>{data?.linkedin_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}


                                {data?.twitter_username && data?.twitter_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links'>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/twitter.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Twitter</label>
                                        <p className="profile_data name_space">User Name : <b>{data?.twitter_username}</b></p>
                                        <div>
                                          <p className="profile_data ">Link : <b>{data?.twitter_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}


                                {data?.youtube_username && data?.youtube_profile_link &&
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                                    <div className='d-flex inputFlexs social-media-links'>
                                      <i className=" mr-1" aria-hidden="true"><img src="/assets/img/youtub.png" /> </i>
                                      <div className='ml-1'>
                                        <label >Youtube</label>
                                        <p className="profile_data name_space">Username : <b>{data?.youtube_username}</b></p>
                                        <div>
                                          <p className="profile_data ">Link : <b>{data?.youtube_profile_link}</b></p>
                                        </div>
                                      </div>


                                    </div>


                                  </div>}

                              </div>
                            </div>
                          </>
                        }

                      </div>
                    </div>
                  </div>}


                {/* Activity Log Modal */}

                <Modal show={show} onHide={handleClose} className="shadowboxmodal">
                  <Modal.Header className='align-items-center' closeButton>
                    <h5 className='modal-title'>Activity Logs</h5>
                  </Modal.Header>
                  <Modal.Body>



                  </Modal.Body>
                </Modal>

              </div>
            </div>

          </div>
        </div>
      </div>


    </Layout>
  );
};

export default Profile;

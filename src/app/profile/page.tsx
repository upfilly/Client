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
import { Modal } from 'react-bootstrap';
import CompareTable from './CompareTable'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Profile = () => {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [data, setData] = useState<any>();
  const [Id, setId] = useState<any>('')
  const [show, setShow] = useState(false);
  const [ActivityData, setActivityData] = useState<any>([])
  const [assosiateUserData, setAssosiateUserData] = useState([])
  const [switchUser, setSwitchUser] = useState<any>(null)
  const [bankData, setBankData] = useState<any>([])
  const [roles, setRoles] = useState<any>('')
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // console.log(ActivityData,"ActivityDataActivityData")

  const gallaryData = (id: any) => {
    loader(true)
    ApiClient.get(`user/detail`, { id: id }).then(res => {
      if (res.success) {
        setData(res.data)
        activityLogsData(res?.data?.activeUser?.id || res?.data?.id || res?.data?._id)
        // if (res?.data?.activeUser)
        // crendentialModel?.setUser(res?.data)
      }
      loader(false)

    })
  };

  const copyToClipboard = (text: any) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard: " + text);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const AssosiateUserData = () => {
    ApiClient.get(`getallassociatedusers`).then(res => {
      if (res.success) {
        setAssosiateUserData(res.data)
      }
    })
  };

  const activityLogsData = (id: any) => {
    loader(true)
    ApiClient.get(`activity-logs`, { account_manager_id: user?.id, user_id: id }).then(res => {
      if (res.success) {
        setActivityData(res?.data?.data)
      }
    })
  };

  const retriveAccountData = () => {
    loader(true)
    ApiClient.get(`account/retrieve`, { userId: user?.id || user?._id }).then(res => {
      if (res.success) {
        setBankData(res?.data)
      }
    })
  };

  const GenerateAddAcountLink = () => {
    loader(true)
    ApiClient.post(`account/create`, {
      "email": user?.email,
      "businessName": user?.fullName,
      "country": "US"
    }).then(res => {
      if (res.success) {
        window.location.href = res?.data?.url;
        // console.log(res?.data?.url,"popopopop")
      }
    })
  };

  const handleDelete = (id: any) => {
    // Show confirmation modal
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        ApiClient.delete(`account/delete?accountId=${id}`).then(res => {
          if (res.success) {
            retriveAccountData();
            toast.success("Account deleted successfully.");
          }
        }).catch(error => {
          toast.error("Failed to delete account.");
        });
      } else {
        // If canceled
        toast.info("Account deletion canceled.");
      }
    });
  };

  const handleSwitchUser = (id: any) => {
    if(id == Id) return
    loader(true)
    ApiClient.put(`changeactiveuser`, { id: id }).then(res => {
      if (res.success) {
        activityLogsData(id)
        // gallaryData(id)
        setId(id)
      }
      loader(false)
    })
  }

  useEffect(() => {
    retriveAccountData()
    if (user) {
      gallaryData(user?.id || user?._id);
      AssosiateUserData()
      handleSwitchUser(user?.id || user?._id)
      // activityLogsData(user?.activeUser?.id || user?.id || user?._id)
      setRoles(user?.activeUser?.role)
    }
  }, []
  );


  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="pprofile1  edit-profile-page my-5">
        <div className='container ' >
          <div className='row'>
            <div className="col-12 col-sm-12 col-md-12  col-lg-12 px-0">
              <div className="form-row ">
                <div className="col-12 col-sm-12 col-md-12  col-lg-4 ">

                  <div className="box_div mb-3">
                    <div className="user-profile_scroller ">
                      {assosiateUserData.map((itm: any) => {

                        return <div>
                          <label className="custom-radio m-0 mb-3 d-flex gap-2 align-items-center users_detialsbx" onClick={() => { handleSwitchUser(itm?.user_id); setRoles(itm?.role); setSwitchUser(itm) }}>
                            <div>
                              <input type="radio" className='profile_radio' name="radio-option" checked={itm?.user_id == Id ? true : false} />
                              <span className="radio-btn"></span>
                            </div>
                            <img src={methodModel.userImg(data && data?.image)} className="profileUsers" />
                            <div>
                              <p className='users_names '> {itm?.firstName} {itm?.lastName}</p>
                              <p className='users_emails '>{itm?.email}</p>
                            </div>
                          </label>
                        </div>
                      })}
                    </div>
                  </div>

                </div>
                {data?.activeUser?.id == Id ?
                  <div className='col-12 col-sm-12 col-md-12  col-lg-8  '>
                    <div className='card p-3 rounded-3 mb-4 ' >
                      <div className="d-flex justify-content-between align-items-center flex-wrap  gap-3 basic_info ">
                        <div className='main_title_head'>
                          <h3 className=''>Basic Information </h3>
                        </div>
                        <div className='d-flex gap-3 align-items-center' >
                          {(Id == user?.id) && (user?.activeUser?.role == "affiliate" || user?.activeUser?.role == "brand" || roles == 'affiliate' || roles == 'brand') && <Link href="/profile/edit" className="btn btn-primary profiles">
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            Edit Profile
                          </Link>}
                          {/* <button className="btn btn-primary profiles" onClick={handleShow}>
                            See Activity Logs
                          </button> */}
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
                            {data?.activeUser?.address &&
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
                                <div className='inputFlexs width400'>
                                  <label >Address:</label>
                                  <p className="profile_data">{data && data?.activeUser?.address}</p>
                                </div>
                              </div>}

                            {data?.activeUser?.affiliate_group_name &&
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

                        {data?.activeUser?.dialCode && data?.activeUser?.mobileNo &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Mobile No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.dialCode}) {data && data?.activeUser?.mobileNo}</p>
                              </div>
                            </div>
                          </div>}


                        {data &&
                          <div className="col-12">
                            <div className='inputFlexs width400'>
                              <label>Category Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.all_category?.map((dat: any) => dat?.name).join(",")}</p>
                              </div>
                            </div>

                          </div>}

                        {data &&
                          <div className="col-12">
                            <div className='inputFlexs width400'>
                              <label>Sub Category Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.all_sub_category?.map((dat: any) => dat?.name).join(",")}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.activeUser &&
                          <div className="col-12">
                            <div className='inputFlexs width400'>
                              <label>Sub Child Category Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.all_sub_child_category?.map((dat: any) => dat?.name).join(",")}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.activeUser?.parter_manager_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Parter Manager Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.parter_manager_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.activeUser?.account_executive_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Account Executive Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.account_executive_name}</p>
                              </div>
                            </div>

                          </div>}

                        {data?.activeUser?.address2 &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                            <div className='inputFlexs width400'>
                              <label>Address 2:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.address2}</p>
                              </div>
                            </div>

                          </div>}




                        {data?.activeUser?.cellDialCode && data?.activeUser?.work_phone &&
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

                            {data.activeUser.role == "brand" && <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className='inputFlexs width400'>
                                <label>Advertiser ID:</label>
                                <div className='d-flex align-items-center gap-3'>
                                  <p className="profile_data" id="advertiserId">{data.activeUser._id || data.activeUser.id}</p>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => copyToClipboard(data.activeUser._id || data.activeUser.id)}>
                                    Copy
                                  </button>
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
                    {user?.role == "affiliate" && <div className='card p-3 rounded-3 mb-4 ' >
                      <div className="d-flex justify-content-between align-items-center flex-wrap  gap-3 basic_info ">
                        <div className='main_title_head'>
                          <h3 className=''>Accounts</h3>
                        </div>
                        <div className='d-flex gap-3 align-items-center' >
                          {(Id == user?.id) && (user?.activeUser?.role == "affiliate" || user?.activeUser?.role == "brand" || roles == 'affiliate' || roles == 'brand') && !bankData?.bank_name && <button onClick={GenerateAddAcountLink} className="btn btn-primary profiles">
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            Add Account
                          </button>}
                        </div>
                      </div>

                      {bankData?.bank_name && <div className="bank-details-container">
                        <h2 className="bank-details-header">Bank Details</h2>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Bank Name:</span>
                          <span className="bank-details-value">{bankData.bank_name}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Account Holder:</span>
                          <span className="bank-details-value">{bankData.accountHolderName || 'N/A'}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Account Status:</span>
                          <span className="bank-details-value">{bankData.accountStatus}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Account Number:</span>
                          <span className="bank-details-value">XXXX-XXXX-{bankData.bankAccountNumber}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Routing Number:</span>
                          <span className="bank-details-value">{bankData.routingNumber}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Country:</span>
                          <span className="bank-details-value">{bankData.country}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Currency:</span>
                          <span className="bank-details-value">{bankData.currency}</span>
                        </div>
                        <div className="bank-details-row">
                          <span className="bank-details-label">Transfer Status:</span>
                          <span className="bank-details-value">{bankData.transfer === 'inactive' ? 'Inactive' : 'Active'}</span>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(bankData.id)}
                        >
                          Delete
                        </button>
                      </div>}

                      {!bankData?.bank_name && <div className="py-3 text-center">No Account Found
                      </div>}
                    </div>}
                  </div>
                  :
                  <div className='col-12 col-sm-12 col-md-7  col-lg-8  '>
                    <div className='card p-3 rounded-3 ' >
                      <div className="d-flex justify-content-between align-items-center flex-wrap basic_info ">
                        <div className='main_title_head'>
                          <h3 className=''>Basic Information </h3>
                        </div>
                        <div className='d-flex gap-3 align-items-center' >
                          {(Id == user?.id) && (user?.activeUser?.role == "affiliate" || user?.activeUser?.role == "brand" || roles == 'brand' || roles == 'affilaite') && <Link href="/profile/edit" className="btn btn-primary profiles">
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            Edit Profile
                          </Link>}
                          {(user?.role == "brand" || user?.role == "affiliate") && <button className="btn btn-primary profiles" onClick={handleShow}>
                            See Activity Logs
                          </button>}
                        </div>
                      </div>
                      <div className=" row align-items-center ">


                        <div className="col-12 col-sm-12 col-md-12">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className=' inputFlexs width400'>
                                <label>Name:</label>
                                <div>
                                  <p className="profile_data">{switchUser && methodModel.capitalizeFirstLetter(switchUser?.firstName)}</p>
                                </div>
                              </div>

                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                              <div className='inputFlexs width400'>
                                <label>Email:</label>
                                <div>
                                  <p className="profile_data">{switchUser && switchUser?.email}</p>
                                </div>
                              </div>

                            </div>
                            {
                              <div className="col-12 col-sm-12 col-md-12 col-lg-12 ">
                                <div className='inputFlexs width400'>
                                  <label >Role:</label>
                                  <p className="profile_data">{switchUser && switchUser?.role}</p>
                                </div>
                              </div>}
                            {/* 
                            {data?.affiliate_group_name &&
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                                <div className='inputFlexs width400'>
                                  <label>Affiliate Group:</label>
                                  <div>
                                    <p className="profile_data">{data && data?.activeUser?.affiliate_group_name || data?.affiliate_group_name}</p>
                                  </div>
                                </div>

                              </div>} */}

                          </div>
                        </div>




                        {/* {data?.category_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Category Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.category_name || data?.category_name}</p>
                              </div>
                            </div>

                          </div>} */}

                        {/* {data?.parter_manager_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Parter Manager Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.parter_manager_name || data?.parter_manager_name}</p>
                              </div>
                            </div>

                          </div>} */}

                        {/* {data?.account_executive_name &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400'>
                              <label>Account Executive Name:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.account_executive_name || data?.account_executive_name}</p>
                              </div>
                            </div>

                          </div>} */}

                        {/* {data?.address2 &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                            <div className='inputFlexs width400'>
                              <label>Address 2:</label>
                              <div>
                                <p className="profile_data">{data && data?.activeUser?.address2 || data?.address2}</p>
                              </div>
                            </div>

                          </div>} */}


                        {/* {data?.dialCode && data?.mobileNo &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Mobile No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.dialCode || data?.dialCode}) {data && data?.activeUser?.mobileNo || data?.mobileNo}</p>
                              </div>
                            </div>
                          </div>} */}

                        {/* {data?.cellDialCode && data?.work_phone &&
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                            <div className='inputFlexs width400' >
                              <label>Work No</label>
                              <div>
                                <p className="profile_data">({data && data?.activeUser?.cellDialCode || data?.cellDialCode}) {data && data?.activeUser?.work_phone || data?.work_phone}</p>
                              </div>
                            </div>
                          </div>} */}

                        {/* {data?.brand_name && data?.mobileNo && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                          <div className='inputFlexs width400' >
                            <label>Brand Name</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.brand_name || data?.brand_name}</p>
                            </div>
                          </div>
                        </div>} */}

                        {/* {data?.language && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                          <div className='inputFlexs width400' >
                            <label>Language</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.language || data?.language}</p>
                            </div>
                          </div>
                        </div>} */}

                        {/* {data?.reffering_affiliate && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                          <div className='inputFlexs width400'>
                            <label>Brand Email:</label>
                            <div>
                              <p className="profile_data">{data && data?.activeUser?.reffering_affiliate || data?.reffering_affiliate}</p>
                            </div>
                          </div>

                        </div>} */}


                        {/* {
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
                        } */}

                      </div>
                    </div>
                  </div>}


                {/* Activity Log Modal */}

                <Modal show={show} onHide={handleClose} className="shadowboxmodal activity_modals">
                  <Modal.Header className='align-items-center' closeButton>
                    <h5 className='modal-title'>Activity Logs</h5>
                  </Modal.Header>
                  <Modal.Body>

                    {ActivityData?.length > 0 && <div>
                      <CompareTable
                        data={ActivityData}
                      // getData={activityLogsData}
                      />
                    </div>}
                    {/* {ActivityData?.map((data: any) => {
                      return <div className='modal_bx'><h5 className='title_body mb-0'>{data?.message}</h5>
                        {data?.response_data?.data?.name && <>
                          <div className="d-flex align-items-center gap-3 sert ">
                            <h5 className='mb-0'>Campaign Name :</h5><span>{methodModel.capitalizeFirstLetter(data?.response_data?.data?.name)}</span>
                          </div>
                        </>}</div>
                    })

                    } */}
                    {ActivityData?.length == 0 && <div className='d-flex justify-content-center align-items-center height_fix' > <img src="/assets/img/no-data.jpg" className='n-databx' alt="" /> </div>}
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

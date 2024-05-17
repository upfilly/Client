'use client'

import React, { useState, useEffect } from 'react';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './profile.scss';
import methodModel from '@/methods/methods';
import crendentialModel from '@/models/credential.model';
import Link from 'next/link';
import Layout from '../components/global/layout/index';
import { userDetailType } from "@/models/type.model";
import { useRouter } from 'next/navigation';

const Profile = () => {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [data, setData] = useState(userDetailType);

  const gallaryData = () => {
    loader(true)
    ApiClient.get(`user/detail`, { id: user.id }).then(res => {
      if (res.success) {
        setData(res.data)
      }
      loader(false)

    })
  };

  useEffect(
    () => {
      if (user) {
        gallaryData();
      }
    },
    []
  );

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>

      <div className='container pprofile1  edit-profile-page' >
        <div className='row'>
          <div className='col-12 col-sm-12 col-md-12  col-lg-10 mx-auto  '>
            <div className='card  profile-card ' >
              <div className="d-flex justify-content-between align-items-center flex-wrap ">
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
              <hr />
              <div className="form-row mx-auto row">
                <div className="col-md-12 ">
                  {/* <label>Image</label> */}

                  <div className="profileImageLabel">
                    <img src={methodModel.userImg(data && data?.image)} className="profileImage" />
                  </div>


                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                  <div className=' inputFlexs width400'>
                    <label>Name:</label>
                    <div>
                      <p className="profile_data">{data && methodModel.capitalizeFirstLetter(data?.firstName)}</p>
                    </div>
                  </div>

                </div>

                <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400'>
                    <label>Email:</label>
                    <div>
                      <p className="profile_data">{data && data?.email}</p>
                    </div>
                  </div>

                </div>

                {data?.category_name &&
                 <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400'>
                    <label>Category Name:</label>
                    <div>
                      <p className="profile_data">{data && data?.category_name}</p>
                    </div>
                  </div>

                </div>}

                {data?.parter_manager_name &&
                 <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400'>
                    <label>Parter Manager Name:</label>
                    <div>
                      <p className="profile_data">{data && data?.parter_manager_name}</p>
                    </div>
                  </div>

                </div>}

                {data?.account_executive_name && 
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400'>
                    <label>Account Executive Name:</label>
                    <div>
                      <p className="profile_data">{data && data?.account_executive_name}</p>
                    </div>
                  </div>

                </div>}


                {data?.affiliate_group_name &&
                 <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400'>
                    <label>Affiliate Group:</label>
                    <div>
                      <p className="profile_data">{data && data?.affiliate_group_name}</p>
                    </div>
                  </div>

                </div>}

                {data?.address && 
                <div className="col-12 col-sm-6 col-md-6 col-lg-6  inputFlexs">
                  <div className='inputFlexs width400'>
                    <label >Address:</label>
                    <p className="profile_data">{data && data?.address}</p>
                  </div>
                </div>}



                {data?.address2 && 
                <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                  <div className='inputFlexs width400'>
                    <label>Address 2:</label>
                    <div>
                      <p className="profile_data">{data && data?.address2}</p>
                    </div>
                  </div>

                </div>}


                {data?.dialCode && data?.mobileNo &&
                 <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400' >
                    <label>Mobile No</label>
                    <div>
                      <p className="profile_data">({data && data?.dialCode}) {data && data?.mobileNo}</p>
                    </div>
                  </div>
                </div>}

                {data?.cellDialCode && data?.work_phone &&
                 <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400' >
                    <label>Work No</label>
                    <div>
                      <p className="profile_data">({data && data?.cellDialCode}) {data && data?.work_phone}</p>
                    </div>
                  </div>
                </div>}

                {data?.brand_name && data?.mobileNo && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400' >
                    <label>Brand Name</label>
                    <div>
                      <p className="profile_data">{data && data?.brand_name}</p>
                    </div>
                  </div>
                </div>}

                {data?.language && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                  <div className='inputFlexs width400' >
                    <label>Language</label>
                    <div>
                      <p className="profile_data">{data && data?.language}</p>
                    </div>
                  </div>
                </div>}

                {data?.reffering_affiliate && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                  <div className='inputFlexs width400'>
                    <label>Brand Email:</label>
                    <div>
                      <p className="profile_data">{data && data?.reffering_affiliate}</p>
                    </div>
                  </div>

                </div>}


                {
                  <>


                    {data?.social_media_platforms?.length > 0 && <div className="col-12 col-sm-6 col-md-6 col-lg-6  ">
                      <div className='inputFlexs width400'>
                        <label >Social Media</label>
                        <div className='d-flex wraps'>
                          {data?.social_media_platforms?.map((item, index, array) =>
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
                          {data?.tags?.map((item, index, array) =>
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
                          <p className="profile_data">{data && data?.default_invoice_setting}</p>
                        </div>
                      </div>
                    </div>}

                    {data?.accountholder_name && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>Account Holdername</label>
                        <div>
                          <p className="profile_data">{data && data?.accountholder_name}</p>
                        </div>
                      </div>
                    </div>}

                    {data?.routing_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>Routing Number</label>
                        <div>
                          <p className="profile_data">{data && data?.routing_number}</p>
                        </div>
                      </div>
                    </div>}

                    {data?.account_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>Account Number</label>
                        <div>
                          <p className="profile_data">{data && data?.account_number}</p>
                        </div>
                      </div>
                    </div>}

                    {data?.ssn_number && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>SSN Number</label>
                        <div>
                          <p className="profile_data">{data && data?.ssn_number}</p>
                        </div>
                      </div>
                    </div>}

                    {data?.company_name && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>Company Name</label>
                        <div>
                          <p className="profile_data">{data && data?.company_name}</p>
                        </div>
                      </div>
                    </div>}

                    {data?.payment_method && <div className="col-12 col-sm-6 col-md-6 col-lg-6 ">
                      <div className='inputFlexs width400' >
                        <label>Payment Method</label>
                        <div>
                          <p className="profile_data">{data && data?.payment_method}</p>
                        </div>
                      </div>
                    </div>}

                    {/* {data?.instagram_username && data?.instagram_profile_link && 
                <div className="col-md-12 inputFlexs">
                  <label><i className='fa fa-facebook mr-1'></i> Instagram</label>
                  <p className="profile_data name_space">User Name : <b>{data?.instagram_username}</b></p>
                  <div>
                  <p className="profile_data name_space ">Link : <b>{data?.instagram_profile_link}</b></p>
                  </div>
                </div>} */}

                    {/* {data?.linkedin_username && data?.linkedin_profile_link && 
                <div className="col-md-12 inputFlexs">
                  <label ><i className='fa fa-linkedin mr-1'></i> Linkedin</label>
                  <p className="profile_data name_space">User Name : <b>{data?.linkedin_username}</b></p>
                  <div>
                  <p className="profile_data ">Link : <b>{data?.linkedin_profile_link}</b></p>
                  </div>
                </div>} */}

                    {/* {data?.twitter_username && data?.twitter_profile_link && 
                <div className="col-md-3 inputFlexs social-media-links">
                  <label ><i className="fa fa-twitter mr-1" aria-hidden="true"></i> Twitter</label>
                  <p className="profile_data name_space">User Name : <b>{data?.twitter_username}</b></p>
                  <div>
                  <p className="profile_data ">Link : <b>{data?.twitter_profile_link}</b></p>
                  </div>
                </div>} */}

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
        </div>
      </div>

    </Layout>
  );
};

export default Profile;

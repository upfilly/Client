import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import "../style.scss";
import methodModel from "@/methods/methods";
import { useRouter, useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";
import datepipeModel from "@/models/datepipemodel";

const Detail = (p) => {
  const history = useRouter();
  const user = crendentialModel.getUser();
  const { id } = useParams();
  const [data, setData] = useState();
  const [status, setStatus] = useState();
  const [showStatus, setShowStatus] = useState();

  const getStatus = (did) => {
    ApiClient.get(`tracking`, { affiliate_id: did }).then((res) => {
      if (res.success) {
        setStatus(res?.data?.data);
      }
    });
  };

  useEffect(() => {
    getStatus(id);
  }, [id]);

  const getDetail = (did) => {
    loader(true);
    ApiClient.get(`user/detail`, { id: did }).then((res) => {
      if (res.success) {
        setData(res.data);
      }
      loader(false);
    });
  };

  // const back = () => {
  //     history.back()
  // }

  const back = () => {
    const searchParams = window.location.search;

    window.location.href = "/affiliate" + searchParams;
  };

  useEffect(() => {
    getDetail(id);
  }, [id]);

  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={"Affiliate"}
      filters={undefined}
    >
      <div className="sidebar-left-content">
        <div className="  card  ">
          <div className="card-header">
            <div className="main_title_head profile-card card_header">
              <h3 className="  ">
                <a to="/campaign" onClick={back}>
                  {" "}
                  <i
                    className="fa fa-arrow-left mr-2 "
                    title="Back"
                    aria-hidden="true"
                  ></i>
                </a>{" "}
                <span> Affiliate Details</span>
              </h3>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                <div className="affilate-detals">
                  <div className="billing_dtls">
                    <h6>User Information</h6>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto ">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Name:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {data &&
                            methodModel.capitalizeFirstLetter(data?.fullName)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto ">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Email:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {data &&
                            methodModel.capitalizeFirstLetter(data?.email)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {data?.title && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Title:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(data?.title)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.language && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Language:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(data?.language)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.time_zone && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Time zone:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(
                                data?.time_zone
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.mobileNo && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Mobile Number:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(data?.mobileNo)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.work_phone && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Work Number:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(
                                data?.work_phone
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.description && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Description:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(
                                data?.description
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.affiliate_group_name && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Affiliate group:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(
                                data?.affiliate_group_name
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.parter_manager_name && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Partner Manager:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              methodModel.capitalizeFirstLetter(
                                data?.parter_manager_name
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.images && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Image:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {" "}
                            <img
                              src={methodModel.noImg(data?.images)}
                              className="w170"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3'>
                                {<div className='billing_dtls'>
                                    <h6>Billing Detail</h6>
                                </div>
                                }

                                {data?.default_invoice_setting && <div className='row align-items-center mb-3 mx-auto '>
                                    <div className='col-12 col-sm-12 col-md-3 col-lg-2'>
                                        <div className='userdata'>
                                            <p className='headmains'>Default Invoice:</p>
                                        </div>
                                    </div>
                                    <div className='col-12 col-sm-12 col-md-9 col-lg-10'>
                                        <div className='name-dtls'>
                                            <p className='headsubs'>{data?.default_invoice_setting}</p>
                                        </div>
                                    </div>
                                </div>}

                                {data?.billing_frequency && <div className='row align-items-center mb-3 mx-auto '>
                                    <div className='col-12 col-sm-12 col-md-3 col-lg-2'>
                                        <div className='userdata'>
                                            <p className='headmains'>Billing Frequency:</p>
                                        </div>
                                    </div>
                                    <div className='col-12 col-sm-12 col-md-9 col-lg-10'>
                                        <div className='name-dtls'>
                                            <p className='headsubs'>{data?.billing_frequency}</p>
                                        </div>
                                    </div>
                                </div>}

                                {data?.address && <div className='row align-items-center mb-3 mx-auto '>
                                    <div className='col-12 col-sm-12 col-md-3 col-lg-2'>
                                        <div className='userdata'>
                                            <p className='headmains'>Address:</p>
                                        </div>
                                    </div>
                                    <div className='col-12 col-sm-12 col-md-9 col-lg-10'>
                                        <div className='name-dtls'>
                                            <p className='headsubs'>{data && methodModel.capitalizeFirstLetter(data?.address)}</p>
                                        </div>
                                    </div>
                                </div>}
                            </div> */}

              {data?.tax_detail && (
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                  <div className="billing_dtls">
                    <h6>Tax Detail</h6>
                  </div>

                  {data?.tax_detail?.tax_name && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Tax Name:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data?.tax_detail?.tax_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.tax_detail?.tax_classification && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Tax Classification:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data?.tax_detail?.tax_classification}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row align-items-center mb-3 mx-auto ">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Us Citizen:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {data && data?.tax_detail?.is_us_citizen
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {data?.tax_detail?.federal_text_classification && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">
                            Federal Text Classification:
                          </p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              data?.tax_detail?.federal_text_classification}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.tax_detail?.trade_name && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Trade Name:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data && data?.tax_detail?.trade_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.tax_detail?.social_security_number && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Social Security Number:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data && data?.tax_detail?.social_security_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data?.tax_detail?.signature_date && (
                    <div className="row align-items-center mb-3 mx-auto ">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Signature Date:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data &&
                              datepipeModel.date(
                                data?.tax_detail?.signature_date
                              )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* <div className='col-sm-12 col-md-12'>
                                <div className='fetch_data'>
                                    <div className='track_head' onClick={() => setShowStatus(!showStatus)}>
                                        <h4 > Track Affiliate Status</h4>
                                        <i className={`fa ${showStatus ? 'fa-minus boxfas' : 'fa-plus boxfas'}`}></i>

                                    </div>


                                    {showStatus && <> {data?.length <= 0 ?
                                        <div className='NoProgressHeading'>
                                            <h3>No Progress</h3>
                                        </div>
                                        : <div className='table_section mt-3 '>
                                            <div className='table-responsive '>
                                                <table className='table table-striped'>
                                                    <thead>
                                                        <tr>
                                                            <th>Campaign</th>
                                                            <th>Event Type</th>
                                                            <th>No of Member Click On Link</th>
                                                        </tr>
                                                    </thead>
                                                    {status?.map((item) => {
                                                        return <tbody>
                                                            <tr>
                                                                <td>{item && item?.campign_name}</td>
                                                                <td>{item && methodModel.capitalizeFirstLetter(item?.event_type)}</td>
                                                                <td>{item && item?.clicks}</td>
                                                            </tr>
                                                        </tbody>
                                                    })}
                                                    
                                                </table>
                                                {status?.length == 0 && <div className='text-center'>No Data Found</div>}
                                            </div>
                                        </div>}</>}
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;

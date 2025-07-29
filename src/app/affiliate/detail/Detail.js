import React, { useEffect, useState } from "react";
import Layout from "@/app/components/global/layout";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import "../style.scss";
import methodModel from "@/methods/methods";
import { useRouter, useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

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
        <div className="card">
          <div className="card-header">
            <div className="main_title_head profile-card card_header">
              <h3>
                <a to="/campaign" onClick={back}>
                  <i
                    className="fa fa-arrow-left mr-2"
                    title="Back"
                    aria-hidden="true"
                  ></i>
                </a>
                <span> Affiliate Details</span>
              </h3>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              {/* User Information Section */}
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                <div className="affilate-detals">
                  <div className="billing_dtls">
                    <h6>User Information</h6>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Name:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {methodModel.capitalizeFirstLetter(data?.fullName)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Email:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {methodModel.capitalizeFirstLetter(data?.email)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Mobile Number:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {data?.dialCode} {data?.mobileNo}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Status:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {data?.request_status == "accepted"
                            ? "Accepted"
                            : data?.request_status == "not_invited"
                              ? "Not Invited"
                              : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Address:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {methodModel.capitalizeFirstLetter(data?.address)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Company Name:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {methodModel.capitalizeFirstLetter(data?.company_name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Affiliate Type:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {methodModel.capitalizeFirstLetter(data?.affiliate_type)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Website:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          <a href={data?.website} target="_blank" rel="noopener noreferrer">
                            {data?.website}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Affiliate Group:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <p className="headsubs">
                          {methodModel.capitalizeFirstLetter(data?.affiliate_group_name)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-3 mx-auto">
                    <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                      <div className="userdata">
                        <p className="headmains">Description:</p>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                      <div className="name-dtls">
                        <div
                          className="headsubs"
                          dangerouslySetInnerHTML={{ __html: data?.description }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Details Section */}
              {data?.tax_detail && (
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                  <div className="affilate-detals">
                    <div className="billing_dtls">
                      <h6>Tax Detail</h6>
                    </div>

                    <div className="row align-items-center mb-3 mx-auto">
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

                    <div className="row align-items-center mb-3 mx-auto">
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

                    <div className="row align-items-center mb-3 mx-auto">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">US Citizen:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data?.tax_detail?.is_us_citizen ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row align-items-center mb-3 mx-auto">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Social Security Number:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="headsubs">
                            {data?.tax_detail?.social_security_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Section */}
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                <div className="affilate-detals">
                  <div className="billing_dtls">
                    <h6>Categories</h6>
                  </div>

                  {/* Main Categories */}
                  {data?.all_category?.length > 0 && (
                    <div className="row align-items-center mb-3 mx-auto">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Main Categories:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <div className="d-flex flex-wrap gap-2">
                            {data.all_category.map((category) => (
                              <span
                                key={category.id}
                                className="badge bg-primary"
                              >
                                {methodModel.capitalizeFirstLetter(category.name)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub Categories */}
                  {data?.all_sub_category?.length > 0 && (
                    <div className="row align-items-center mb-3 mx-auto">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Sub Categories:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <div className="d-flex flex-wrap gap-2">
                            {data.all_sub_category.map((subCategory) => (
                              <span
                                key={subCategory.id}
                                className="badge bg-secondary"
                              >
                                {methodModel.capitalizeFirstLetter(subCategory.name)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub Child Categories */}
                  {data?.all_sub_child_category?.length > 0 ? (
                    <div className="row align-items-center mb-3 mx-auto">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Sub Child Categories:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <div className="d-flex flex-wrap gap-2">
                            {data.all_sub_child_category.map((childCategory) => (
                              <span
                                key={childCategory.id}
                                className="badge bg-info text-dark"
                              >
                                {methodModel.capitalizeFirstLetter(childCategory.name)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row align-items-center mb-3 mx-auto">
                      <div className="col-12 col-sm-12 col-md-3 col-lg-2">
                        <div className="userdata">
                          <p className="headmains">Sub Child Categories:</p>
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-9 col-lg-10">
                        <div className="name-dtls">
                          <p className="text-muted">No sub child categories available</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tracking Status Section */}
              {/* <div className="col-sm-12 col-md-12">
                <div className="fetch_data">
                  <div className="track_head" onClick={() => setShowStatus(!showStatus)}>
                    <h4>Track Affiliate Status</h4>
                    <i className={`fa ${showStatus ? 'fa-minus boxfas' : 'fa-plus boxfas'}`}></i>
                  </div>

                  {showStatus && (
                    <>
                      {status?.length <= 0 ? (
                        <div className="NoProgressHeading">
                          <h3>No Progress</h3>
                        </div>
                      ) : (
                        <div className="table_section mt-3">
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Campaign</th>
                                  <th>Event Type</th>
                                  <th>No of Member Click On Link</th>
                                </tr>
                              </thead>
                              <tbody>
                                {status?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item?.campign_name}</td>
                                    <td>{methodModel.capitalizeFirstLetter(item?.event_type)}</td>
                                    <td>{item?.clicks}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {status?.length === 0 && <div className="text-center">No Data Found</div>}
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
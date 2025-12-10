"use client";

import { useEffect, useState } from "react";
import crendentialModel from "@/models/credential.model";
import Layout from "@/app/components/global/layout";
import "./style.scss";
import { useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import MyHoriBarChart from "../components/common/BarChart/Horizontalbarchart";
import environment from "@/environment";
import { Modal, Button } from 'react-bootstrap';
import loader from "@/methods/loader";
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [activeSidebar, setActiveSidebar] = useState(false);
  const history = useRouter();
  const user: any = crendentialModel.getUser();
  const [filter, setFilter] = useState('this_month')
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [recentUser, setRecentUser] = useState<any>([]);
  const [CampaignRequest, setCampaignRequest] = useState<any>(null);
  const [analyticData, setAnalyticData] = useState<any>();
  const [clicksAnalyticData, setClicksAnalyticData] = useState<any>();
  const [transactionAnalyticData, setTransactionAnalyticData] = useState<any>();
  const [show, setShow] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState('');
  const handleClose = () => { setShow(false) };
  const handleShow = () => setShow(true);

  const generateAffiliateLink = () => {
    if (user?.id || user?._id) {
      const baseUrl = window.location.origin;
      const affiliateLink = `${baseUrl}/signup/publisher?brandId=${user.id || user._id}`;
      setAffiliateLink(affiliateLink);
      return affiliateLink;
    }
    return '';
  };

  // Copy affiliate link to clipboard
  const copyAffiliateLink = () => {
    const link = affiliateLink || generateAffiliateLink();
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        toast.success('Affiliate link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy affiliate link');
      });
    } else {
      toast.error('Unable to generate affiliate link');
    }
  };

  // Share affiliate link
  const shareAffiliateLink = () => {
    const link = affiliateLink || generateAffiliateLink();
    if (navigator.share) {
      navigator.share({
        title: 'Join My Affiliate Program',
        text: 'Join my affiliate program and start earning commissions!',
        url: link,
      }).catch(err => {
        console.error('Error sharing:', err);
        copyAffiliateLink(); // Fallback to copy if share fails
      });
    } else {
      copyAffiliateLink(); // Fallback to copy if Web Share API not supported
    }
  };

  const handleFilterChange = (e: any) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    if (
      !user ||
      user?.request_status == "pending" ||
      user?.request_status == "rejected"
    ) {
      history.push("/profile");
    }
  }, []);

  useEffect(() => {
    getClicksData({ filter: filter })
    getSalesAnalyticsData({ filter: filter });
    getTransactionData({ filter: filter })
  }, [filter]);

  useEffect(() => {
    if (user?.total_campaign == 0) {
      setShow(true)
    }
  }, []);

  useEffect(() => {
    if (user) {
      ApiClient.get("total-users").then((data) => {
        setDashboardData(data);
      });
    }
  }, []);

  const getSalesAnalyticsData = (p = {}) => {
    let url = "findGraph";
    let filters;
    if (user?.role == "affiliate") {
      filters = { affiliate_id: user?.id, ...p };
    } else {
      filters = { brand_id: user?.id, ...p };
    }
    loader(true)
    ApiClient.get(url, filters).then((res) => {
      if (res) {
        setAnalyticData(res?.data);
        loader(false)
      }
    });
  };

  const getClicksData = (p = {}) => {
    let url = "analytics-click";
    let filters;
    if (user?.role == "affiliate") {
      filters = { affiliate_id: user?.id, ...p };
    } else {
      filters = { brand_id: user?.id, ...p };
    }
    ApiClient.get(url, filters).then((res) => {
      if (res) {
        setClicksAnalyticData(res?.data?.data);
      }
    });
  };

  const getTransactionData = (p = {}) => {
    let url = "transactionGraph";
    let filters;
    if (user?.role == "affiliate") {
      filters = { affiliate_id: user?.id, ...p };
    } else {
      filters = { brand_id: user?.id, ...p };
    }
    ApiClient.get(url, filters).then((res) => {
      if (res) {
        setTransactionAnalyticData(res?.data);
      }
    });
  };

  useEffect(() => {
    if (user) {
      let filter
      if (user?.role == "brand") {
        filter = { brand_id: user?.id || user?._id }
      }
      ApiClient.get("affiliate/count", filter).then((data) => {
        setCampaignData(data);
      });
      getClicksData()
      getSalesAnalyticsData();
      getTransactionData()
      // Generate affiliate link for brand users
      if (user?.role === "brand") {
        generateAffiliateLink();
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      let filter;
      if (user?.role == "affiliate") {
        filter = { affiliate_id: user?.id || user?._id }
      } else {
        filter = { brand_id: user?.id || user?._id }
      }
      ApiClient.get("dashboard/campaign-request", filter).then((data) => {
        setCampaignRequest(data);
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      ApiClient.get('user/detail', { id: user.id }).then(res => {
        if (res.success) {
          if (res?.data?.total_campaign == 0) {
            setShow(true)
          }
          let data = { ...user, ...res.data }
          crendentialModel.setUser(data)
          localStorage.setItem('browseload', 'true')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (user) {
      ApiClient.get("recent-users").then((data) => {
        setRecentUser(data?.data?.data);
      });
    }
  }, []);

  return (
    <Layout
      activeSidebar={activeSidebar}
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={"Dashboard"}
      filters={undefined}
    >
      <div className="main-dashboards  main_box mb-3">
        <div className="container-fluid">

          <div className="row ">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3 ">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">
                  {user.role == "brand" ? (
                    <div className="ml-2" style={{ "cursor": "pointer" }} onClick={() => history.push("/campaign")}>
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                            className="fixi-boxx purchase"
                            src="/assets/img/total.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Total Campaigns</p>
                          <h3 className="dollars-t">
                            {campaignData?.myTotalCampaigns}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-2 " style={{ "cursor": "pointer" }} onClick={() => history.push("/campaignmanagement?status=accepted")}>
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                            className="fixi-boxx"
                            src="/assets/img/lead.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Accepted Campaigns </p>
                          <h3 className="dollars-t">
                            {CampaignRequest?.acceptedRequestCount}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">
                  {user.role == "brand" ? (
                    <div className="ml-2 " style={{ "cursor": "pointer" }} onClick={() => history.push("/affiliate?association_status=accepted")}>
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                            className="fixi-boxx purchase"
                            src="/assets/img/approved.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Joined Affiliates</p>
                          <h3 className="dollars-t">
                            {campaignData?.totalJoined + campaignData?.totalActive}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-2 " style={{ "cursor": "pointer" }} onClick={() => history.push("/campaignmanagement?status=pending")}>
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                            className="fixi-boxx"
                            src="/assets/img/visiter.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Pending Campaigns</p>
                          <h3 className="dollars-t">
                            {CampaignRequest?.pendingRequestsCount}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.role == "brand" &&
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3">
                <div className="fixi-ic">
                  <div className="d-flex align-items-center flex-wrap">
                    {user.role == "brand" ? (
                      <div className="ml-2" style={{ "cursor": "pointer" }} onClick={() => history.push("/affiliate?association_status=accepted")}>
                        <div className="d-flex items-center gap-2">
                          <div className="img-div-first">
                            <img
                              className="fixi-boxx purchase"
                              src="/assets/img/approved.png"
                              alt=""
                            ></img>
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <p className="revuh">Active Affiliates</p>
                            <h3 className="dollars-t">
                              {campaignData?.totalActive}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            }

            {user.role == "brand" &&
              <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3">
                <div className="fixi-ic">
                  <div className="d-flex align-items-center flex-wrap">
                    {user.role == "brand" ? (
                      <div className="ml-2" style={{ "cursor": "pointer" }} onClick={() => history.push("/requestcampaigns")}>
                        <div className="d-flex items-center gap-2">
                          <div className="img-div-first">
                            <img
                              className="fixi-boxx"
                              src="/assets/img/visiter.png"
                              alt=""
                            ></img>
                          </div>
                          <div className="d-flex flex-column justify-content-center">
                            <p className="revuh">Pending Affiliates</p>
                            <h3 className="dollars-t">
                              {campaignData?.totalPending || 0}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            }

            {user.role == "affiliate" && <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3   mb-3 ">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="ml-2" style={{ "cursor": "pointer" }} onClick={() => history.push("/campaignmanagement?status=rejected")}>
                    <div className="d-flex items-center gap-2">
                      <div className="img-div-first">
                        <img
                          className="fixi-boxx purchase"
                          src="/assets/img/purchase.png"
                          alt=""
                        ></img>
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <p className="revuh">Rejected Campaigns</p>
                        <h3 className="dollars-t">
                          {CampaignRequest?.rejectedRequestsCount}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            {user.role == "affiliate" && <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3   mb-3">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="ml-2" style={{ "cursor": "pointer" }} onClick={() => history.push("/campaignmanagement?status=accepted")}>
                    <div className="d-flex items-center gap-2">
                      <div className="img-div-first">
                        <img
                          className="fixi-boxx purchase"
                          src="/assets/img/line.png"
                          alt=""
                        ></img>
                      </div>
                      <div className="d-flex flex-column justify-content-center">
                        <p className="revuh">Brands Associated</p>
                        <h3 className="dollars-t">
                          {CampaignRequest?.brandsAssociatedCount}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </div>

        <div className="mt-3">
          <div className="container-fluid">
            <div className="row mb-3 justify-content-center justify-content-sm-end">
              <div className="col-auto">
                <div className="btn-group btnsgroup" role="group" aria-label="Filter">
                  <button
                    type="button"
                    className={`btn ${filter === "this_month" ? "primary12" : "btn-outline-primary"}`}
                    value="this_month"
                    onClick={handleFilterChange}
                  >
                    This Month
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === "last_month" ? "primary12" : "btn-outline-primary"}`}
                    value="last_month"
                    onClick={handleFilterChange}
                  >
                    Last Month
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === "this_year" ? "primary12" : "btn-outline-primary"}`}
                    value="this_year"
                    onClick={handleFilterChange}
                  >
                    This Year
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === "last_year" ? "primary12" : "btn-outline-primary"}`}
                    value="last_year"
                    onClick={handleFilterChange}
                  >
                    Last Year
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-span-12">
                <div className="whitemain">
                  {analyticData && clicksAnalyticData && transactionAnalyticData && (
                    <MyHoriBarChart
                      sales={analyticData}
                      clicks={clicksAnalyticData}
                      transaction={transactionAnalyticData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {user?.role === "brand" && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="affiliate-link-card card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-12">
                      <h5 className="card-title text-primary mb-2">
                        <i className="fas fa-link me-2"></i>
                        Your Affiliate Invitation Link
                      </h5>
                      <p className="text-muted mb-3">
                        Share this link with potential affiliates to join your program.
                        When they sign up using this link, they'll be automatically associated with your brand.
                      </p>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={affiliateLink}
                          readOnly
                          placeholder="Generating affiliate link..."
                        />
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={copyAffiliateLink}
                          title="Copy to clipboard"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                        {/* <button
                          className="btn btn-outline-primary btn-lg"
                          onClick={shareAffiliateLink}
                          title="Share link"
                        >
                          <i className="fas fa-share-alt"></i>
                        </button> */}
                      </div>
                    </div>
                    {/* <div className="col-md-4 text-center">
                      <div className="affiliate-stats bg-light rounded p-3">
                        <h4 className="text-success mb-1">{campaignData?.totalActive || 0}</h4>
                        <p className="text-muted mb-0">Active Affiliates</p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal show={show} onHide={handleClose} className="shadowboxmodal new-modal">
        <Modal.Body>
          <div className="mt-2">
            <h4 className="mb-2 fs-5 fw-bold text-center">👋 Welcome to your Upfilly Dashboard</h4>
            <p className="text-center mb-3 fs-6">Here's how to get started:</p>

            <ul className="dashboard-list list-unstyled">
              <li className="dashboard-item" >
                <i className="fas fa-tachometer-alt text-primary"></i>
                <div>
                  <div>
                    <strong>Dashboard</strong><br />
                    <small>Overview of your performance and key metrics.</small>
                  </div>
                  <Button variant="" onClick={() => history.push('dashboard')} className="">
                    Click here
                  </Button>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-users text-success"></i>
                <div>
                  <div>
                    <strong>Affiliate Management</strong>
                    <ul className="sub-list">
                      <li>Affiliate Requests</li>
                      <li>Manage Affiliates</li>
                      <li>Affiliate Groups</li>
                    </ul>
                  </div>
                  <Button variant="" onClick={() => history.push('affiliate')} className="">
                    Click here
                  </Button>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-comments text-purple"></i>
                <div>
                  <div>
                    <strong>Chat</strong><br />
                    <small>Communicate directly with your affiliates.</small>
                  </div>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-clipboard-list text-danger"></i>
                <div>
                  <div>
                    <strong>Campaign Management</strong>
                    <ul className="sub-list">
                      <li>Manage Campaigns</li>
                      <li>Campaign Requests</li>
                    </ul>
                  </div>
                  <Button variant="" onClick={() => history.push('campaign')} className="">
                    Click here
                  </Button>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-tools text-warning"></i>
                <div>
                  <div>
                    <strong>Marketing Tools</strong>
                    <ul className="sub-list">
                      <li>Creative Assets</li>
                      <li>Banners</li>
                      <li>Email Templates</li>
                      <li>Product Feeds</li>
                      <li>Generate Links</li>
                      <li>Add Coupon</li>
                      <li>Newsletter</li>
                    </ul>
                  </div>
                  <Button variant="" onClick={() => history.push('banners')} className="">
                    Click here
                  </Button>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-chart-line text-info"></i>
                <div>
                  <div>
                    <strong>Performance & Analytics</strong>
                    <ul className="sub-list">
                      <li>Campaign Reports</li>
                      <li>Performance Charts</li>
                      <li>Affiliate Marketing Stats</li>
                    </ul>
                  </div>
                  <Button variant="" onClick={() => history.push('reports/all')} className="">
                    Click here
                  </Button>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-store text-pink"></i>
                <div>
                  <div>
                    <strong>Marketplace</strong>
                    <ul className="sub-list">
                      <li>Marketplace</li>
                      <li>Sent Offers</li>
                    </ul>
                  </div>
                  <Button variant="" onClick={() => history.push('marketplace')} className="">
                    Click here
                  </Button>
                </div>
              </li>

              <li className="dashboard-item">
                <i className="fas fa-user-plus text-secondary"></i>
                <div>
                  <div>
                    <strong>User Management</strong>
                    <ul className="sub-list">
                      <li>Add Users</li>
                    </ul>
                  </div>
                  <Button variant="" onClick={() => history.push('users')} className="">
                    Click here
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        </Modal.Body>
      </Modal>

    </Layout>
  );
}
"use client";

import { useEffect, useState } from "react";
import crendentialModel from "@/models/credential.model";
import Layout from "@/app/components/global/layout";
import "./style.scss";
import { useRouter } from "next/navigation";
import ApiClient from "@/methods/api/apiClient";
import environment from "@/environment";
import BarChart from "../components/common/BarChart/Barchart";
import PieChart from "../components/common/PieChart/Piechat";
import { Modal, Button } from 'react-bootstrap';
import { FaTachometerAlt, FaUsers, FaClipboardList, FaChalkboardTeacher, FaTools, FaChartLine, FaMarker, FaUserPlus } from 'react-icons/fa'; // FontAwesome icons

export default function Dashboard() {
  const [activeSidebar, setActiveSidebar] = useState(false);
  const history = useRouter();
  const user: any = crendentialModel.getUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [recentUser, setRecentUser] = useState<any>([]);
  const [CampaignRequest, setCampaignRequest] = useState<any>(null);
  const [analyticData, setAnalyticData] = useState<any>();
  const [show, setShow] = useState(false);
  const handleClose = () => { setShow(false)};
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (
      !user ||
      user?.request_status == "pending" ||
      user?.request_status == "rejected"
    ) {
      history.push("/profile");
    }
  }, []);

  //   useEffect(() => {
  //     if (user) {
  //       if ((user?.role == 'affiliate' && user?.account_id == '') || (user?.role == 'affiliate' && user?.tax_detail?.tax_classification == '')) {
  //         history.push('/addAccount/detail')
  //       }
  //     }
  // }, [user])

  const handleAddCampaignClick = () => {
    console.log('Redirecting to Add Campaign page...');
  };

  const navigateToSection = () =>{

  }
  
  useEffect(() => {
    setShow(true)
  }, []);

  useEffect(() => {
    if (user) {
      ApiClient.get("total-users").then((data) => {
        setDashboardData(data);
      });
    }
  }, []);

  const getAnalyticsData = (p = {}) => {
    let url = "analytics-sales";
    let filters;
    if (user?.role == "affiliate") {
      filters = { affiliate_id: user?.id };
    } else {
      filters = { brand_id: user?.id };
    }
    ApiClient.get(url, filters).then((res) => {
      if (res) {
        setAnalyticData(res?.data);
        // getData(res?.data?.id)
      }
    });
  };

  // console.log(analyticData,"analyticDataanalyticDataanalyticData")

  useEffect(() => {
    if (user) {
      let filter
      if(user?.role == "brand"){
        filter = {brand_id:user?.id || user?._id}
      }
      ApiClient.get("total-campaigns",filter).then((data) => {
        setCampaignData(data);
      });
      getAnalyticsData();
    }
  }, []);

  useEffect(() => {
    if (user) {
      let filter;
      if(user?.role == "affiliate"){
        filter={affiliate_id:user?.id || user?._id}
      }else{
        filter={brand_id:user?.id || user?._id}
      }
      ApiClient.get("dashboard/campaign-request",filter).then((data) => {
        setCampaignRequest(data);
      });
    }
  }, []);

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
                  {/* <img className='fixi-boxx' src='/assets/img/three-dollar.png' alt=''></img> */}

                  {user.role == "brand" ? (
                    <div className="ml-2 ">
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
                    <div className="ml-2 ">
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                            className="fixi-boxx"
                            src="/assets/img/lead.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Accepted Campaigns</p>

                          <h3 className="dollars-t">
                            {CampaignRequest?.acceptedRequestCount}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="">
                  {/* <div className='text-right'>
                  <p className='colrs-blue'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                  <div></div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">

                  {user.role == "brand" ? (
                    <div className="ml-2 ">
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
                            {campaignData?.associatedAffiliatesCount}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-2 ">
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
                <div className="">
                  {/* <div className='text-right'>
                  <p className='colrs-blues'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                  <div></div>
                </div>
              </div>
            </div>
            {user.role == "affiliate" && <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3   mb-3 ">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">



                  {/* {user.role == "brand" ? (
                    <div className="ml-2 ">
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                             className="fixi-boxx purchase"
                            src="/assets/img/pending.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Pending Campaigns</p>

                          <h3 className="dollars-t">
                            {campaignData?.pendingCampaigns}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : ( */}
                  <div className="ml-2 ">
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
                  {/* )} */}
                </div>
                <div className="">
                  {/* <div className='text-right'>
                  <p className='colrs-blues'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                  <div></div>
                </div>
              </div>
            </div>}
            {user.role == "affiliate" && <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3   mb-3">
              <div className="fixi-ic">
                <div className="d-flex align-items-center flex-wrap">
                  {/* <img
                    className="fixi-boxx"
                    src="/assets/img/growth.png"
                    alt=""
                  ></img> */}

                  {/* {user.role == "brand" ? (
                    <div className="ml-2 ">
                      <div className="d-flex items-center gap-2">
                        <div className="img-div-first">
                          <img
                            className="fixi-boxx purchase"
                            src="/assets/img/rejected.png"
                            alt=""
                          ></img>
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                          <p className="revuh">Rejected Campaigns</p>

                          <h3 className="dollars-t">
                            {CampaignRequest?.rejectedCampaigns || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : ( */}
                  <div className="ml-2 ">
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
                  {/* )} */}
                </div>
                <div className="">
                  {/* <div className='text-right'>
                  <p className='colrs-blue'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                  <div></div>
                </div>
              </div>
            </div>}
          </div>
        </div>
        <div className="mt-3">
          <div className="container-fluid ">
            <div className="row ">
              <div className="col-sm-12 col-md-7 col-lg-7 col-xl-8  mb-3 ">
                <div className="bgDiv p-2">
                  {" "}
                  <BarChart data={analyticData?.data?.[0]} />
                </div>
                {/* <img className='w-100' src='/assets/img/yeks.png' alt=''></img> */}
              </div>
              <div className="col-sm-12 col-md-5 col-lg-5 col-xl-4   mb-3">
                <div className="bgDiv d-flex">
                  {" "}
                  <PieChart data={analyticData?.data?.[0]} />
                </div>
                {/* <div className='dispost'>
              <div className='d-flex align-items-center flex-wrap justify-content-between'>
                <p className='tives mb-0'>Dispositives</p>
                <i className="fa fa-chevron-right awes" aria-hidden="true"></i>

              </div>
              <div className='text-center'>
                <img className='pro-bar' src='/assets/img/progresser.png' alt=''></img>
              </div>
              <div className='row mx-auto mt-3'>
                <div className='col-md-6 '>
                  <p className='tebs-t'><i className="fa fa-circle aas mr-2" aria-hidden="true"></i>
                    Desktop
                  </p>
                </div>
                <div className='col-md-6 '>
                  <p className='tebs-t'><i className="fa fa-circle yell mr-2" aria-hidden="true"></i>
                    Android
                  </p>
                </div>
                <div className='col-md-6'>
                  <p className='tebs-t'><i className="fa fa-circle blu mr-2" aria-hidden="true"></i>
                    iPhone
                  </p>
                </div>
                <div className='col-md-6'>
                  <p className='tebs-t'><i className="fa fa-circle pik mr-2" aria-hidden="true"></i>
                    Tablet
                  </p>
                </div>
              </div>
            </div> */}
              </div>
            </div>
          </div>
        </div>

        {user.role == "brand" && (
          <div className="row mt-3 mx-0">
            {/* <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
              <div className="recent-sales">
                <div className="d-flex align-items-center flex-wrap justify-content-between">
                  <p className="tives mb-0">Recent Sales</p>
                  <i
                    className="fa fa-chevron-right awes"
                    aria-hidden="true"
                  ></i>
                </div>
                <ul className="sales-listing">
                  <li>
                    <div className="d-flex flex-wrap  align-items-center item-name">
                      <img
                        src="/assets/img/person.jpg"
                        className="dashboard_image"
                      />
                      <p className="mb-0">Product Item Name</p>
                    </div>

                    <div className="d-flex align-items-center flex-wrap item-status">
                      <p className="light-badge">Confirmed</p>
                      <i
                        className="fa fa-chevron-right "
                        aria-hidden="true"
                      ></i>
                    </div>
                  </li>

                  <li>
                    <div className="d-flex align-items-center flex-wrap item-name">
                      <img
                        src="/assets/img/person.jpg"
                        className="dashboard_image"
                      />
                      <p className="mb-0">Product Item Name</p>
                    </div>

                    <div className="d-flex align-items-center flex-wrap item-status">
                      <p className="light-badge">Confirmed</p>
                      <i
                        className="fa fa-chevron-right "
                        aria-hidden="true"
                      ></i>
                    </div>
                  </li>

                  <li>
                    <div className="d-flex align-items-center flex-wrap item-name">
                      <img
                        src="/assets/img/person.jpg"
                        className="dashboard_image"
                      />
                      <p className="mb-0">Product Item Name</p>
                    </div>

                    <div className="d-flex align-items-center flex-wrap item-status">
                      <p className="yellow-badge">Payment Pending</p>
                      <i
                        className="fa fa-chevron-right "
                        aria-hidden="true"
                      ></i>
                    </div>
                  </li>

                  <li>
                    <div className="d-flex align-items-center flex-wrap item-name">
                      <img
                        src="/assets/img/person.jpg"
                        className="dashboard_image"
                      />
                      <p className="mb-0">Product Item Name</p>
                    </div>

                    <div className="d-flex align-items-center flex-wrap item-status">
                      <p className="yellow-badge">Payment Pending</p>
                      <i
                        className="fa fa-chevron-right "
                        aria-hidden="true"
                      ></i>
                    </div>
                  </li>

                  <li>
                    <div className="d-flex align-items-center flex-wrap item-name">
                      <img
                        src="/assets/img/person.jpg"
                        className="dashboard_image"
                      />
                      <p className="mb-0">Product Item Name</p>
                    </div>

                    <div className="d-flex align-items-center flex-wrap item-status">
                      <p className="yellow-badge">Payment Pending</p>
                      <i
                        className="fa fa-chevron-right "
                        aria-hidden="true"
                      ></i>
                    </div>
                  </li>
                </ul>
              </div>
            </div> */}

            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 ">
              <div className="recent-sales active-users">
                <div className="d-flex align-items-center flex-wrap justify-content-between">
                  <p className="tives mb-0">Recent Users</p>
                  <i
                    className="fa fa-chevron-right awes"
                    aria-hidden="true"
                  ></i>
                </div>
                <ul className="sales-listing">
                  {recentUser?.slice(0, 5)?.map((data: any) => (
                    <li onClick={() => history.push(`affiliate/detail/${data?.id || data?._id}`)}>
                      <div className="d-flex flex-wrap align-items-center item-name">
                        {data?.image ? (
                          <img
                            src={`${environment.api}${data?.image}`}
                            className="dashboard_image"
                          />
                        ) : (
                          <img
                            src="/assets/img/person.jpg"
                            className="dashboard_image"
                          />
                        )}
                        <p className="mb-0">{data?.fullName}</p>
                      </div>

                      <div className="d-flex flex-wrap align-items-center item-status">
                        <p className="yellow-badge">{data?.role}</p>
                        <i
                          className="fa fa-chevron-right "
                          aria-hidden="true"
                        ></i>
                      </div>
                    </li>
                  ))}

                  {recentUser?.length == 0 && (
                    <div className="py-3 text-center">No User</div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal show={show} onHide={handleClose} className="shadowboxmodal">
        <Modal.Header className="align-items-center" closeButton>
          <h5 className="modal-title">Welcome to Upfilly Dashboard</h5>
        </Modal.Header>
        <Modal.Body>
          <p>Welcome to your Upfilly Dashboard! Here's how to get started:</p>
          <ol className="instruction-list">
            <li>
              <FaTachometerAlt className="icon" onClick={() => navigateToSection('dashboard')} />
              <strong>Dashboard</strong>: Overview of your performance and key metrics.
            </li>
            <li>
              <FaUsers className="icon" onClick={() => navigateToSection('affiliateManagement')} />
              <strong>Affiliate Management</strong>: Manage your affiliates, approve or deny affiliate requests.
              <ul>
                <li>Affiliate Requests: View and manage new affiliate requests.</li>
                <li>Manage Affiliates: Manage all your existing affiliates.</li>
                <li>Affiliate Groups: Organize your affiliates into groups for targeted campaigns.</li>
              </ul>
            </li>
            <li>
              <FaChalkboardTeacher className="icon" onClick={() => navigateToSection('chat')} />
              <strong>Chat</strong>: Communicate with your affiliates directly through the chat feature.
            </li>
            <li>
              <FaClipboardList className="icon" onClick={() => navigateToSection('campaignManagement')} />
              <strong>Campaign Management</strong>: Manage your campaigns from creation to tracking performance.
              <ul>
                <li>Manage Campaigns: View and edit your active campaigns.</li>
                <li>Campaign Requests: Approve or deny new campaign requests.</li>
              </ul>
            </li>
            <li>
              <FaTools className="icon" onClick={() => navigateToSection('marketingTools')} />
              <strong>Marketing Tools</strong>: Enhance your marketing efforts with creative assets and more.
              <ul>
                <li>Creative Assets: Upload and manage banners, images, and other creative materials.</li>
                <li>Banners: Create and manage banners for your campaigns.</li>
                <li>Email Templates: Design email templates for marketing purposes.</li>
                <li>Data Feeds: Provide affiliates with product data feeds.</li>
                <li>Generate Links: Create trackable links for your affiliates.</li>
                <li>Add Coupon: Create and manage promotional codes for campaigns.</li>
                <li>Newsletter: Send updates and newsletters to your affiliates or users.</li>
              </ul>
            </li>
            <li>
              <FaChartLine className="icon" onClick={() => navigateToSection('performanceAnalytics')} />
              <strong>Performance & Analytics</strong>: Analyze campaign performance and track affiliate success.
              <ul>
                <li>Campaign Reports: View detailed reports on each campaign's performance.</li>
                <li>Performance Charts: Visualize data with charts to assess performance.</li>
                <li>Affiliate Marketing Stats: Review stats on affiliate activities and earnings.</li>
              </ul>
            </li>
            <li>
              <FaMarker className="icon" onClick={() => navigateToSection('marketplace')} />
              <strong>Marketplace</strong>: Explore the marketplace to find new offers.
              <ul>
                <li>Marketplace: Browse available offers in the marketplace.</li>
                <li>Sent Offers: View the offers you've sent to affiliates.</li>
              </ul>
            </li>
            <li>
              <FaUserPlus className="icon" onClick={() => navigateToSection('userManagement')} />
              <strong>User Management</strong>: Add and manage users within your platform.
              <ul>
                <li>Add Users: Add new users to your dashboard with different roles and permissions.</li>
              </ul>
            </li>
          </ol>
          <Button variant="primary" onClick={handleAddCampaignClick} className="cta-button">
            Click here to add a campaign
          </Button>
        </Modal.Body>
      </Modal>

    </Layout>
  );
}

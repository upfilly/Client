'use client'

import { useEffect, useState } from 'react';
import crendentialModel from '@/models/credential.model';
import Layout from "@/app/components/global/layout";
import "./style.scss";
import { useRouter } from 'next/navigation';
import ApiClient from '@/methods/api/apiClient';
import environment from '@/environment';

export default function Dashboard() {
  const [activeSidebar, setActiveSidebar] = useState(false)
  const history = useRouter()
  const user: any = crendentialModel.getUser()
  const [dashboardData,setDashboardData] = useState<any>(null)
  const [campaignData,setCampaignData] = useState<any>(null)
  const [recentUser,setRecentUser] = useState<any>([])
  const [CampaignRequest , setCampaignRequest] = useState<any>(null)

  useEffect(() => {
      if (!user) {
          history.push('/')
      }
  }, [])

  useEffect(() => {
    if (user) {
      if ((user?.role == 'affiliate' && user?.account_id == '') || (user?.role == 'affiliate' && user?.tax_detail?.tax_classification == '')) {
        history.push('/addAccount/detail')
      }
    }
}, [user])

  useEffect(()=>{
    if(user){
    ApiClient.get('total-users').then((data)=>{
     setDashboardData(data)
    })
  }
  },[])
  
  useEffect(()=>{
    if(user){
    ApiClient.get('total-campaigns').then((data)=>{
     setCampaignData(data)
    })
  }
  },[])

  useEffect(()=>{
    if(user){
    ApiClient.get('campaign-request').then((data)=>{
     setCampaignRequest(data)
    })
  }
  },[])

  useEffect(()=>{
    if(user){
    ApiClient.get('recent-users').then((data)=>{
     setRecentUser(data?.data?.data)
    })
  }
  },[])

  return (
    <Layout activeSidebar={activeSidebar} handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Dashboard"} filters={undefined}>
    <div className='main-dashboards mb-3'>
        <div className='row mx-0'>
          <div className='col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3 pr-0'>
            <div className='fixi-ic'>
              <div className='d-flex align-items-center'>
                <img className='fixi-boxx' src='/assets/img/three-dollar.png' alt=''></img>
                {user.role == 'brand' ? <div className='ml-2'>
                  <p className='revuh'>Total Campaign</p>
                  <h3 className='dollars-t'>{campaignData?.myTotalCampaigns}</h3>
                </div>:
                <div className='ml-2'>
                <p className='revuh'>Lead Campaign</p>
                <h3 className='dollars-t'>{CampaignRequest?.leadCampaigns}</h3>
              </div>
                }
              </div>
              <div className=''>

                {/* <div className='text-right'>
                  <p className='colrs-blue'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                <div>

                </div>
              </div>
            </div>

          </div>
          <div className='col-sm-12 col-md-6 col-lg-4 col-xl-3  mb-3 pr-0'>
            <div className='fixi-ic'>
              <div className='d-flex align-items-center'>
                <img className='fixi-boxx' src='/assets/img/three-dollar.png' alt=''></img>
                {user.role == 'brand' ? <div className='ml-2'>
                  <p className='revuh'>Accept Campaign</p>
                  <h3 className='dollars-t'>{campaignData?.acceptedCampaigns}</h3>
                </div> :
                  <div className='ml-2'>
                    <p className='revuh'>Visitor Campaign</p>
                    <h3 className='dollars-t'>{CampaignRequest?.visitor_campaigns}</h3>
                  </div>
                }
              </div>
              <div className=''>

                {/* <div className='text-right'>
                  <p className='colrs-blues'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                <div>

                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-12 col-md-6 col-lg-4 col-xl-3   mb-3 pr-0'>
            <div className='fixi-ic'>
              <div className='d-flex align-items-center'>
                <img className='fixi-boxx' src='/assets/img/three-dollar.png' alt=''></img>
               {user.role == 'brand' ? <div className='ml-2'>
                  <p className='revuh'>Pending Campaign</p>
                  <h3 className='dollars-t'>{campaignData?.pendingCampaigns}</h3>
                </div>:
                  <div className='ml-2'>
                    <p className='revuh'>Purchase Campaign</p>
                    <h3 className='dollars-t'>{CampaignRequest?.purchase_campaigns}</h3>
                  </div>
                }
              </div>
              <div className=''>

                {/* <div className='text-right'>
                  <p className='colrs-blues'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                <div>

                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-12 col-md-6 col-lg-4 col-xl-3   mb-3'>
            <div className='fixi-ic'>
              <div className='d-flex align-items-center'>
                <img className='fixi-boxx' src='/assets/img/growth.png' alt=''></img>
                {user.role == 'brand' ? <div className='ml-2'>
                  <p className='revuh'>Rejected Campaign</p>
                  <h3 className='dollars-t'> {CampaignRequest?.rejectedCampaigns || 0}</h3>
                </div> : <div className='ml-2'>
                  <p className='revuh'>Line Campaign</p>
                  <h3 className='dollars-t'> {CampaignRequest?.lineItems_campaigns}</h3>
                </div>}
              </div>
              <div className=''>

                {/* <div className='text-right'>
                  <p className='colrs-blue'>2-56</p>
                  <p className='week-last'>Last week</p>
                </div> */}
                <div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row mx-0 mt-3'>
          <div className='col-sm-12 col-md-7 col-lg-7 col-xl-9  mb-3 '>
            <img className='w-100' src='/assets/img/yeks.png' alt=''></img>
          </div>
          <div className='col-sm-12 col-md-5 col-lg-5 col-xl-3   mb-3'>
            <div className='dispost'>
              <div className='d-flex align-items-center justify-content-between'>
                <p className='tives mb-0'>Dispositives</p>
                <i className="fa fa-chevron-right awes" aria-hidden="true"></i>

              </div>
              <div className='text-center'>
                <img className='pro-bar' src='/assets/img/progresser.png' alt=''></img>
              </div>
              <div className='row mx-auto mt-3'>
                <div className='col-md-6 p-0'>
                  <p className='tebs-t'><i className="fa fa-circle aas mr-2" aria-hidden="true"></i>
                    Desktop
                  </p>
                </div>
                <div className='col-md-6 p-0'>
                  <p className='tebs-t'><i className="fa fa-circle yell mr-2" aria-hidden="true"></i>
                    Android
                  </p>
                </div>
                <div className='col-md-6 p-0'>
                  <p className='tebs-t'><i className="fa fa-circle blu mr-2" aria-hidden="true"></i>
                    iPhone
                  </p>
                </div>
                <div className='col-md-6 p-0'>
                  <p className='tebs-t'><i className="fa fa-circle pik mr-2" aria-hidden="true"></i>
                    Tablet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

       {user.role == 'brand' && <div className='row mt-3 mx-0'>
            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6 '>
                <div className='recent-sales'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <p className='tives mb-0'>Recent Sales</p>
                        <i className="fa fa-chevron-right awes" aria-hidden="true"></i>
                    </div>
                    <ul className='sales-listing'>
                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/person.jpg' className='dashboard_image'/>
                          <p className='mb-0'>Product Item Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='light-badge'>Confirmed</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>

                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/person.jpg' className='dashboard_image'/>
                          <p className='mb-0'>Product Item Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='light-badge'>Confirmed</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>


                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/person.jpg' className='dashboard_image'/>
                          <p className='mb-0'>Product Item Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Payment Pending</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>

                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/person.jpg' className='dashboard_image'/>
                          <p className='mb-0'>Product Item Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Payment Pending</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>

                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/person.jpg' className='dashboard_image'/>
                          <p className='mb-0'>Product Item Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Payment Pending</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>
                    </ul>
                </div>
            </div>

            <div className='col-sm-12 col-md-6 col-lg-6 col-xl-6 '>
            <div className='recent-sales active-users'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <p className='tives mb-0'>Recent Users</p>
                        <i className="fa fa-chevron-right awes" aria-hidden="true"></i>
                    </div>
                    <ul className='sales-listing'>
                      {recentUser.map((data:any)=><li>
                        <div className='d-flex align-items-center item-name'>
                          {data?.image ? <img src={`${environment.api}${data?.image}`} className='dashboard_image'/>:
                          <img src='/assets/img/person.jpg' className='dashboard_image'/>
                        }
                          <p className='mb-0'>{data?.fullName}</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>{data?.role}</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>)}

                      {/* <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/girl-img.png' />
                          <p className='mb-0'>Person Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Last Activity: Today</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>


                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/girl-img.png' />
                          <p className='mb-0'>Person Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Last Activity: Today</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>

                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/girl-img.png' />
                          <p className='mb-0'>Person Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Last Activity: Today</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li>

                      <li>
                        <div className='d-flex align-items-center item-name'>
                          <img src='/assets/img/girl-img.png' />
                          <p className='mb-0'>Person Name</p>
                        </div>

                        <div className='d-flex align-items-center item-status'>
                          <p className='yellow-badge'>Last Activity: Today</p>
                          <i className="fa fa-chevron-right " aria-hidden="true"></i>
                        </div>
                      </li> */}
                    </ul>
                </div>
            </div>
        </div>}
      </div>
    </Layout>
  );
}

'use client'

import { useEffect, useState } from 'react';
import Layout from '../../components/global/layout';
import "./style.scss";
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import datepipeModel from '@/models/datepipemodel';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';

export default function Commissions() {
  const user = crendentialModel.getUser()
  const [filters, setFilter] = useState({ page: 0, count: 5, search: '', addedBy: user?.id })
  const [data, setData] = useState([])
  const [pendingData, setPendingData] = useState([])
  const [loaging, setLoader] = useState(true)
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [affiliateData, setAffiliateData] = useState([])
  const [groupData, setGroupData] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const idsAndAmountsFromGroupDetails = groupData?.map((itm) => ({
    commission_id: itm?.id,
    group_id: itm?.affiliate_group,
    amount: itm?.amount,
    amount_type: itm?.amount_type,
    event_type: itm?.event_type
  }))

  const idsAndAmountFromAffiliate = affiliateData?.map((data) => ({
    commission_id: data?.id,
    user_id: data?.affiliate_id,
    amount: data?.amount,
    amount_type: data?.amount_type,
    event_type: data?.event_type
  }))

  const conbineData = [...idsAndAmountsFromGroupDetails, ...idsAndAmountFromAffiliate]

  const getData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p }
    let url = 'commissions'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setData(res?.data)
        // setTotal(res?.data?.total)
      }
      setLoader(false)
    })
  }

  const getPendingData = (p = {}) => {
    setLoader(true)
    let filter = { ...filters, ...p, status: "pending" }
    let url = 'commissions'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setPendingData(res?.data)
        // setTotal(res?.data?.total)
      }
      setLoader(false)
    })
  }

  useEffect(() => {
    getData({ page: 1 })
    getPendingData({ page: 1 })
  }, [])


  const handleRowClick = (index) => {
    const newExpandedRows = [...expandedRows];
    if (newExpandedRows.includes(index)) {
      // Row is already expanded, so collapse it
      newExpandedRows.splice(newExpandedRows.indexOf(index), 1);
    } else {
      // Row is not expanded, so expand it
      newExpandedRows.push(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const filter = (p = {}) => {
    setFilter({ ...filters, ...p })
    getData({ ...p, page: filters?.page + 1 })
    getPendingData({...p,page: filters?.page + 1})
  }

  const reset = () => {
    let filter = {
      status: '',
      role: '',
      search: '',
      page: 1,
      count: 5
    }
    setFilter({ ...filters, ...filter })
    getData({ ...filter })
    getPendingData({...filter})
    // dispatch(search_success(''))
  }

  const handlePay = () => {
    if (!selectedUser) {
      return;
    }
    if (conbineData?.length <= 0) {
      setSubmitted(true)
      return
    }
    loader(true)
    ApiClient.post("bank/transfer", { user_id: conbineData }).then(res => {
      if (res.success) {
        getPendingData({ page: 1 })
        getData({ page: 1 })
        setSelectedUser([])
        setAffiliateData([])
        setGroupData([])
      }
      loader(false)
    })

  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      filter();
    }
  };

  const handleCheckboxChange = (itm) => {
    const selectedIndex = selectedUser.findIndex((user) => user.id === itm.id);

    if (selectedIndex === -1) {
      const updatedSelectedUser = [...selectedUser, itm];
      setSelectedUser(updatedSelectedUser);

      const affiliateData = updatedSelectedUser.filter((user) => !user.groupDetails || user.groupDetails.length === 0);
      const groupData = updatedSelectedUser.filter((user) => user.groupDetails && user.groupDetails.length > 0);

      setAffiliateData(affiliateData);
      setGroupData(groupData);
    } else {
      const updatedUsers = [...selectedUser];
      updatedUsers.splice(selectedIndex, 1);
      setSelectedUser(updatedUsers);

      const affiliateData = updatedUsers.filter((user) => !user.groupDetails || user.groupDetails.length === 0);
      const groupData = updatedUsers.filter((user) => user.groupDetails && user.groupDetails.length > 0);

      setAffiliateData(affiliateData);
      setGroupData(groupData);
    }
  };  

  return (
    <>
      <Layout handleKeyPress={handleKeyPress} setFilter={setFilter} reset={reset} filter={filter} name="Commission" filters={filters}>
        <div className=" ">
          <div className="sidebar-left-content">
            <div className='commsion_tabs'>
              <div className=' row'>

                <div className='col-md-12'>
                  <div className='tabs_coms_tabs'>
                    <div className='d-flex justify-content-between align-items-center  gap-3 flex-wrap'>
                      <div className='manin_innertabs inner_navtabs '>
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                          <li class="nav-item m-0">
                            <a class="nav-link navtaabs active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Due Commissions</a>
                          </li>
                          <li class="nav-item m-0">
                            <a class="nav-link navtaabs" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">All Commissions</a>
                          </li>
                          {/* <li class="nav-item">
                            <a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">All Commissions</a>
                          </li> */}
                        </ul>
                      </div>




                      <div className=' '>
                        <a onClick={() => handlePay()} className='btn btn-primary d-flex align-items-center'> <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i> Pay Selected Affiliates</a>
                        {submitted && conbineData?.length <= 0 ? <div className="invalid-feedback d-block">Select one user</div> : <></>}
                      </div>
                    </div>
                  </div>
                </div>

              </div>





              <div className='table_addcomison mt-4'>
                <div className='row'>
                  <div className='col-md-12'>

                    <div class="tab-content" id="myTabContent">
                      {/* first tab start */}
                      <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                      <div className='table-responsive' >
                      <table className='table table-striped  '>
                          <thead>
                            <tr>
                              <th></th>
                              {/* <th>Affiliate</th> */}
                              <th>Type</th>
                              <th>Due</th>
                              <th>Amount</th>
                              <th>Status</th>

                            </tr>
                          </thead>
                          <tbody>
                            { pendingData?.data?.map((itm, index) => <> <tr>
                              <td><input
                                type="checkbox"
                                className=''
                                // disabled={itm?.groupDetails?.length <=0 ? true : false}
                                checked={selectedUser.some((user) => user.id === itm.id)}
                                onChange={() => {
                                  if (itm?.groupDetails?.length <= 0 && !itm?.affiliate_name) {
                                    toast.success('No affiliate in this group')
                                  } else {
                                    handleCheckboxChange(itm);
                                  }
                                  if(!itm?.affiliate_group){
                                    handleCheckboxChange(itm);
                                  }
                                }}
                              /></td>
                              {/* {itm?.affiliate_group_name && <td> <img className='fgsdafsd' width="20" src='../assets/img/plus-p.png' onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }} /> {itm?.affiliate_group_name}(gr)</td>}
                              {itm?.affiliate_name && <td> {itm?.affiliate_name}</td>} */}
                              <td>{itm?.event_type}</td>

                              <td>{datepipeModel.date(itm.due_date)}</td>

                              <td>${itm?.amount}</td>

                              <td><span class={itm?.status=="pending"?"pending_status":"contract"}>{itm?.status}</span></td>
                            </tr>

                              <>
                                {expandedRows.includes(index) && (<>

                                  {itm?.groupDetails.map((itms) => {
                                    return <tr className=''>
                                      <td>

                                      </td>
                                      <td>{itms?.fullName}</td>
                                      <td>

                                      </td>
                                      <td>{datepipeModel.date(itm.due_date)}</td>

                                      <td>${itm?.amount}</td>

                                      <td><span class={itm?.status=="pending"?"pending_status":"contract"}>{itm?.status}</span></td>
                                    </tr>

                                  })}

                                </>)}</>
                            </>

                            )}
                          </tbody>
                        </table>
                        {pendingData?.data?.length <= 0 && <div className='py-3 text-center'>No Data Found</div>}
                      </div>
                      </div>
                      {/* second tab start */}
                      <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">


                        <table className='table table-striped  '>
                          <thead>
                            <tr>
                              <th></th>
                              <th>Type</th>
                              {/* <th>Email</th> */}
                              <th>Due</th>
                              {/* <th>Count</th> */}
                              <th>Ammout</th>
                              <th>Status</th>

                            </tr>
                          </thead>
                          <tbody>
                            {data?.data?.map((itm, index) => <> <tr>
                              {itm?.status == "pending" ? <td><input
                                type="checkbox"
                                className=''
                                checked={selectedUser.some((user) => user.id === itm.id)}
                                onChange={() => {
                                  if (itm?.groupDetails?.length <= 0) {
                                    toast.error('No affiliate in this group')
                                  } else {
                                    handleCheckboxChange(itm);
                                  }
                                  if(!itm?.affiliate_group){
                                    handleCheckboxChange(itm);
                                  }
                                }}
                              /></td> : <td></td>}
                              {/* {itm?.affiliate_group_name && <td> <img className='fgsdafsd' width="20" src='../assets/img/plus-p.png' onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }} /> {itm?.affiliate_group_name}(gr)</td>}
                              {itm?.affiliate_name && <td> {itm?.affiliate_name}</td>} */}
                              <td>{itm?.event_type}</td>

                              <td>{datepipeModel.date(itm.due_date)}</td>

                              <td>${itm?.amount}</td>
                              {/* <td></td> */}


                              <td><span class={itm?.status=="pending"?"pending_status":"contract"}>{itm?.status}</span></td>
                            </tr>

                              <>
                                {expandedRows.includes(index) && (<>

                                  {itm?.groupDetails.map((itms) => {
                                    return <tr className=''>
                                      <td>
                                      </td>
                                      <td>{itms?.fullName}</td>
                                      <td>

                                      </td>
                                      <td>{datepipeModel.date(itm.due_date)}</td>

                                      <td>${itm?.amount}</td>

                                      <td><span class={itm?.status=="pending"?"pending_status":"contract"}>{itm?.status}</span></td>
                                    </tr>
                                  })}
                                </>)}</>
                            </>

                            )}
                          </tbody>
                        </table>
                        {data?.data?.length <=0 && <div className='py-3 text-center'>No Data Found</div>}
                      </div>
                      {/* third tab start */}
                      <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                        <table className='table table-striped  '>
                          <thead>
                            <tr>
                              <th></th>
                              <th>Affiliate</th>
                              <th>Email</th>
                              <th>Due</th>
                              <th>Count</th>
                              <th>Status</th>

                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><input type="checkbox" className='' /></td>

                              <td><img className='' width="20" src='../assets/img/plus-p.png' /> Person Name</td>

                              <td>contact@email.com</td>

                              <td>June 26, 2024</td>

                              <td>$0.00</td>

                              <td><span class="contract">Active</span></td>
                            </tr>


                            <tr>
                              <td><input type="checkbox" className='' /></td>

                              <td><img className='' width="20" src='../assets/img/plus-p.png' /> Person Name</td>

                              <td>contact@email.com</td>

                              <td>June 26, 2024</td>

                              <td>$0.00</td>

                              <td><span class="contract">Active</span></td>
                            </tr>


                            <tr>
                              <td><input type="checkbox" className='' /></td>

                              <td><img className='' width="20" src='../assets/img/plus-p.png' /> Person Name</td>

                              <td>contact@email.com</td>

                              <td>June 26, 2024</td>

                              <td>$0.00</td>

                              <td><span class="contract">Active</span></td>
                            </tr>


                            <tr>
                              <td><input type="checkbox" className='' /></td>

                              <td><img className='' width="20" src='../assets/img/plus-p.png' /> Person Name</td>

                              <td>contact@email.com</td>

                              <td>June 26, 2024</td>

                              <td>$0.00</td>

                              <td><span class="contract">Active</span></td>
                            </tr>




                          </tbody>
                        </table>
                      </div>
                    </div>



                  </div>
                </div>
              </div>




            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

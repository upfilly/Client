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
import { Modal, Tab, Tabs } from 'react-bootstrap';
import CompareTable from './CompareTable'
import ApprovalRequirementsModal from './ApprovalRequirement'
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
  const [showApprovalPrompt, setShowApprovalPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState('basic-info'); // State for active tab

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleApprovalPromptClose = () => setShowApprovalPrompt(false);
  const handleApprovalPromptShow = () => setShowApprovalPrompt(true);

  // Function to check if all required fields are present for admin approval
  const checkApprovalRequirements = (userData: any) => {
    if (!userData?.activeUser) return false;

    const user = userData.activeUser;
    const hasName = user?.fullName;
    const hasAddress = user?.address;
    const hasTimezone = user?.timezone;
    const hasCurrency = userData?.currencies && userData.currencies.length > 0;
    const hasPropertyType = userData?.propertyType && userData.propertyType.length > 0;
    const hasCategory = userData?.all_category && userData.all_category.length > 0;

    return hasName && hasAddress && hasTimezone && hasCurrency && hasPropertyType && hasCategory;
  };

  // Get missing requirements for display
  const getMissingRequirements = (userData: any) => {
    if (!userData?.activeUser) return [];

    const user = userData.activeUser;
    const missing = [];

    if (!user?.fullName) missing.push('Name');
    if (!user?.address) missing.push('Address');
    if (!user?.timezone) missing.push('Timezone');
    if (!userData?.currencies || userData.currencies.length === 0) missing.push('Currency');
    if (!userData?.propertyType || userData.propertyType.length === 0) missing.push('Property Type');
    if (!userData?.all_category || userData.all_category.length === 0) missing.push('Category');

    return missing;
  };

  const gallaryData = (id: any) => {
    loader(true)
    ApiClient.get(`user/detail`, { id: id }).then(res => {
      if (res.success) {
        setData(res.data)
        activityLogsData(res?.data?.activeUser?.id || res?.data?.id || res?.data?._id)
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
      }
    })
  };

  const handleDelete = (id: any) => {
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
        ApiClient.delete(`account/delete?accountId=${id}`).then(res => {
          if (res.success) {
            retriveAccountData();
            toast.success("Account deleted successfully.");
          }
        }).catch(error => {
          toast.error("Failed to delete account.");
        });
      } else {
        toast.info("Account deletion canceled.");
      }
    });
  };

  const handleSwitchUser = (id: any) => {
    if (id == Id) return
    loader(true)
    ApiClient.put(`changeactiveuser`, { id: id }).then(res => {
      if (res.success) {
        activityLogsData(id)
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
      setRoles(user?.activeUser?.role)
    }
  }, []);

  // Check if user meets approval requirements
  const meetsApprovalRequirements = data ? checkApprovalRequirements(data) : false;
  const missingRequirements: any = data ? getMissingRequirements(data) : [];

  // Basic Info Tab Content
  const renderBasicInfoTab = () => (
    <div className='card p-3 rounded-3 mb-0 inner-card-one'>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 basic_info">
        <div className='main_title_head d-flex align-items-center gap-3'>
          <h3 className=''>Basic Information</h3>
          {(meetsApprovalRequirements) && (
            <div className="d-flex align-items-center gap-2">
              <i className="material-icons text-success" style={{ fontSize: '20px' }}>check_circle</i>
              {(meetsApprovalRequirements && user?.request_status != "accepted") && <span className="text-success font-weight-bold">Wait for Admin Approval</span>}
            </div>
          )}
        </div>
        <div className='d-flex gap-3 align-items-center'>
          {(!meetsApprovalRequirements && missingRequirements.length > 0 && user?.request_status != "accepted") && (
            <button className="btn btn-warning profiles" onClick={handleApprovalPromptShow}>
              <i className="material-icons prob" title="Requirements">info</i>
              Approval Requirements
            </button>
          )}
          {(Id == user?.id) && (user?.activeUser?.role == "affiliate" || user?.activeUser?.role == "brand" || roles == 'affiliate' || roles == 'brand') && <Link href="/profile/edit" className="btn btn-primary profiles">
            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
            Edit Profile
          </Link>}
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-12 col-sm-12 col-md-12">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className='inputFlexs width400'>
                <label>Username:</label>
                <div>
                  <p className="profile_data profile-page-pl-none">{data && methodModel.capitalizeFirstLetter(data?.activeUser?.userName)}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className='inputFlexs width400'>
                <label>Name:</label>
                <div>
                  <p className="profile_data profile-page-pl-none">{data && methodModel.capitalizeFirstLetter(data?.activeUser?.fullName)}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className='inputFlexs width400'>
                <label>Email:</label>
                <div>
                  <p className="profile_data profile-page-pl-none">{data && data?.activeUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Rest of the basic info fields */}
            {data?.activeUser?.address &&
              <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <div className='inputFlexs width400'>
                  <label>Address:</label>
                  <p className="profile_data">{data && data?.activeUser?.address}</p>
                </div>
              </div>}

            {/* Continue with other fields... */}

          </div>
        </div>
      </div>
    </div>
  );

  // Accounts Tab Content
  const renderAccountsTab = () => (
    <div className='card p-3 rounded-3 mb-4 inner-card-two mt-3'>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 basic_info">
        <div className='main_title_head'>
          <h3 className=''>Accounts</h3>
        </div>
        <div className='d-flex gap-3 align-items-center'>
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

      {!bankData?.bank_name && <div className="py-3 text-center">No Account Found</div>}
    </div>
  );

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="pprofile1 edit-profile-page">
        <div className='mx-5'>
          <div className='row'>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 px-0">
              <div className="form-row justify-content-end">
                <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                  <div className="box_div mb-3">
                    <div className="user-profile_scroller">
                      {assosiateUserData.map((itm: any) => (
                        <div key={itm.user_id}>
                          <label className="custom-radio m-0 mb-3 d-flex gap-2 align-items-center users_detialsbx" onClick={() => { handleSwitchUser(itm?.user_id); setRoles(itm?.role); setSwitchUser(itm) }}>
                            <div>
                              <input type="radio" className='profile_radio' name="radio-option" checked={itm?.user_id == Id} />
                              <span className="radio-btn"></span>
                            </div>
                            <img src={methodModel.userImg(data && data?.image)} className="profileUsers" />
                            <div>
                              <p className='users_names'> {itm?.firstName} {itm?.lastName}</p>
                              <p className='users_emails'>{itm?.email}</p>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='col-12 col-sm-12 col-md-12 col-lg-8'>
                  {data?.activeUser?.id == Id ? (
                    <>
                      {/* Tabs Navigation */}
                      <div className="mb-3">
                        <Tabs
                          activeKey={activeTab}
                          onSelect={(k) => setActiveTab(k || 'basic-info')}
                          className="profile-tabs"
                          id="profile-tabs"
                        >
                          <Tab eventKey="basic-info" title="Basic Information">
                            {renderBasicInfoTab()}
                          </Tab>
                         {user.role == "affiliate" && <Tab eventKey="accounts" title="Accounts">
                            {renderAccountsTab()}
                          </Tab>}
                        </Tabs>
                      </div>
                    </>
                  ) : (
                    <div className='card p-3 rounded-3'>
                      <div className="d-flex justify-content-between align-items-center flex-wrap basic_info">
                        <div className='main_title_head'>
                          <h3 className=''>Basic Information</h3>
                        </div>
                        <div className='d-flex gap-3 align-items-center'>
                          {(Id == user?.id) && (user?.activeUser?.role == "affiliate" || user?.activeUser?.role == "brand" || roles == 'brand' || roles == 'affilaite') && <Link href="/profile/edit" className="btn btn-primary profiles">
                            <i className="material-icons prob" title="Edit Profile">mode_edit_outline</i>
                            Edit Profile
                          </Link>}
                          {(user?.role == "brand" || user?.role == "affiliate") && <button className="btn btn-primary profiles" onClick={handleShow}>
                            See Activity Logs
                          </button>}
                        </div>
                      </div>
                      <div className="row align-items-center">
                        <div className="col-12 col-sm-12 col-md-12">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className='inputFlexs width400'>
                                <label>Username:</label>
                                <div>
                                  <p className="profile_data profile-page-pl-none">{data && methodModel.capitalizeFirstLetter(data?.userName)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className='inputFlexs width400'>
                                <label>Name:</label>
                                <div>
                                  <p className="profile_data">{switchUser && methodModel.capitalizeFirstLetter(switchUser?.firstName)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div className='inputFlexs width400'>
                                <label>Email:</label>
                                <div>
                                  <p className="profile_data">{switchUser && switchUser?.email}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                              <div className='inputFlexs width400'>
                                <label>Role:</label>
                                <p className="profile_data">{switchUser && switchUser?.role}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Log Modal */}
              <Modal show={show} onHide={handleClose} className="shadowboxmodal activity_modals">
                <Modal.Header className='align-items-center' closeButton>
                  <h5 className='modal-title'>Activity Logs</h5>
                </Modal.Header>
                <Modal.Body>
                  {ActivityData?.length > 0 && (
                    <div>
                      <CompareTable data={ActivityData} />
                    </div>
                  )}
                  {ActivityData?.length == 0 && <div className='d-flex justify-content-center align-items-center height_fix'> <img src="/assets/img/no-data.jpg" className='n-databx' alt="" /> </div>}
                </Modal.Body>
              </Modal>

              {showApprovalPrompt && <ApprovalRequirementsModal
                show={showApprovalPrompt}
                onHide={handleApprovalPromptClose}
                missingRequirements={missingRequirements}
                onEditProfile={() => history.push('/profile/edit')}
              />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
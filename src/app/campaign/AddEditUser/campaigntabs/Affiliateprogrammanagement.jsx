import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PublisherPolicyForm from './Publishers';
import Deduplication from './Deduplication';
import Transactions from './Transactions';
import Ppc from './Ppc';
import Terms from './Terms';

const AffiliateProgramManagement = ({
  onAcceptTerms,
  formData,
  setFormData,
  formPpcData,
  setFormPpcData,
  formPublisherData,
  setFormPublisherData,
  formTransactionData, 
  setFormTransactionData,
  isAgreed,
  setIsAgreed,
  legalTerm, 
  setlegalTerm,
  formFields,
  formPpcFields,
  formTransactionFields,
  formPublisherFields
 }) => {
  const tabsData = [
    {
      id: 'legal-terms',
      title: 'Legal Terms',
      content: <Terms 
      onAcceptTerms={onAcceptTerms} 
      isAgreed={isAgreed}
      setIsAgreed={setIsAgreed}
      legalTerm={legalTerm} 
      setlegalTerm={setlegalTerm}
      />
    },
    {
      id: 'publishers',
      title: 'Publishers',
      content: <PublisherPolicyForm formPublisherData={formPublisherData} setFormPublisherData={setFormPublisherData} formPublisherFields={formPublisherFields}/>
    },
    {
      id: 'deduplication',
      title: 'Deduplication',
      content: <Deduplication formData={formData} setFormData={setFormData} formFields={formFields}/>
    },
    {
      id: 'transactions',
      title: 'Transactions',
      content: <Transactions formTransactionData={formTransactionData} 
      setFormTransactionData={setFormTransactionData} formTransactionFields={formTransactionFields}/>
    },
    {
      id: 'ppc',
      title: 'PPC',
      content: <Ppc formPpcData={formPpcData}
        setFormPpcData={setFormPpcData} formPpcFields={formPpcFields}/>
    },
  ];

  const [activeTab, setActiveTab] = useState(tabsData[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container-fluid d-flex flex-column  p-3" style={{height:"600px"}} >
      <div className="row flex-grow-1">
        <div className="col-12 d-flex flex-column h-100 p-0 ">
          

          {/* Tab Navigation */}
          <ul className="nav nav-tabs custom-nav-tabs-class flex-shrink-0 pb-3" id="affiliateTab" role="tablist">
            {tabsData.map((tab) => (
              <li className="nav-item" role="presentation" key={tab.id}>
                <button
                  className={`nav-link shadow-none border-0 ${activeTab === tab.id ? 'active fw-semibold  text-primary bg-tab' : 'text-dark bg-transparent'}`}
                  id={`${tab.id}-tab`}
                  type="button"
                  role="tab"
                  aria-controls={tab.id}
                  aria-selected={activeTab === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.title}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div
            className="tab-content  custom-tab-content-class   border border-top-0 rounded-bottom  shadow-sm flex-grow-1 d-flex flex-column"
            id="affiliateTabContent"
          >
            {tabsData.map((tab) => (<>
              {(activeTab == tab.id) && <div
                key={tab.id}
                className={`tab-pane fade h-100 d-flex flex-column ${activeTab == tab.id ? 'show active' : ''
                  }`}
                id={tab.id}
                role="tabpanel"
                aria-labelledby={`${tab.id}-tab`}
              >
                {(activeTab == tab.id) && <div className="p-2 sm-p-4 flex-grow-1 overflow-auto tab-height">
                  {tab.content}
                </div>}
              </div>}
            </>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

AffiliateProgramManagement.propTypes = {
  onAcceptTerms: PropTypes.func.isRequired,
};

export default AffiliateProgramManagement;